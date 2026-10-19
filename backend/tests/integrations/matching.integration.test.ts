import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/config/database.js";
import { resetDb, seedRoles } from "../helpers/db.js";
import { createTestUser } from "../helpers/auth.js";
import { computeMatchScore } from "../../src/services/match/scoring.js";

async function seedApis() {
  await prisma.jobApi.createMany({
    data: [
      {
        code: "jsearch",
        name: "JSearch",
        apiEndpoint: "https://jsearch.p.rapidapi.com/search-v2",
        apiKeyEnv: "JSEARCH_KEY",
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
}

describe("Matching — scoring function", () => {
  it("gives high score for matching title, exact location, fresh", () => {
    const result = computeMatchScore({
      jobTitle: "Backend Developer",
      jobLocation: "Casablanca",
      jobWorkMode: null,
      jobPostedAt: new Date(),
      userCurrentTitle: "Backend Developer",
      userLocation: "Casablanca",
      userWorkMode: null,
    });

    expect(result.score).toBeGreaterThanOrEqual(0.9);
    expect(result.breakdown.titleSimilarity).toBe(1);
    expect(result.breakdown.locationMatch).toBe(1);
  });

  it("gives zero for completely mismatched title", () => {
    const result = computeMatchScore({
      jobTitle: "Chef",
      jobLocation: null,
      jobWorkMode: null,
      jobPostedAt: null,
      userCurrentTitle: "Backend Developer",
      userLocation: null,
      userWorkMode: null,
    });

    expect(result.breakdown.titleSimilarity).toBe(0);
  });

  it("prioritizes remote match for remote-seekers", () => {
    const result = computeMatchScore({
      jobTitle: "Backend Developer",
      jobLocation: null,
      jobWorkMode: "remote",
      jobPostedAt: new Date(),
      userCurrentTitle: "Backend Developer",
      userLocation: null,
      userWorkMode: "remote",
    });

    expect(result.breakdown.locationMatch).toBe(1);
  });

  it("penalizes old jobs via recency", () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = computeMatchScore({
      jobTitle: "Backend Developer",
      jobLocation: null,
      jobWorkMode: null,
      jobPostedAt: thirtyDaysAgo,
      userCurrentTitle: "Backend Developer",
      userLocation: null,
      userWorkMode: null,
    });

    expect(result.breakdown.recency).toBeLessThan(1);
  });
});

describe("Matching — API integration", () => {
  let token: string;

  beforeEach(async () => {
    await resetDb();
    await seedRoles();
    await seedApis();
    const result = await createTestUser();
    token = result.token;
  });

  it("returns empty matches when user has no selected publishers", async () => {
    const res = await request(app)
      .get("/api/user/matches")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.matches).toEqual([]);
    expect(res.body.data.total).toBe(0);
  });

  it("returns matches filtered by selected publisher", async () => {
   
    const publisher = await prisma.jobPublisher.create({
      data: { name: "LinkedIn", slug: "linkedin" },
    });
    const jobApi = await prisma.jobApi.findUniqueOrThrow({ where: { code: "jsearch" } });

    const job = await prisma.job.create({
      data: {
        externalId: "test-job-1",
        jobApiId: jobApi.id,
        jobPublisherId: publisher.id,
        title: "Backend Developer",
        company: "Acme",
        url: "https://example.com",
        postedAt: new Date(),
      },
    });

    const user = await prisma.user.findFirstOrThrow();
    await prisma.userJobMatch.create({
      data: { userId: user.id, jobId: job.id, matchScore: 0.85 },
    });

    
    const before = await request(app)
      .get("/api/user/matches")
      .set("Authorization", `Bearer ${token}`);
    expect(before.body.data.matches).toEqual([]);
   

    await prisma.userSelectedPublisher.create({
      data: { userId: user.id, publisherId: publisher.id, isEnabled: true },
    });

    const after = await request(app)
      .get("/api/user/matches")
      .set("Authorization", `Bearer ${token}`);
    expect(after.body.data.matches).toHaveLength(1);
    expect(after.body.data.matches[0].job.title).toBe("Backend Developer");
  });

  it("excludes dismissed matches", async () => {
    const publisher = await prisma.jobPublisher.create({
      data: { name: "LinkedIn", slug: "linkedin" },
    });
    const jobApi = await prisma.jobApi.findUniqueOrThrow({ where: { code: "jsearch" } });
    const job = await prisma.job.create({
      data: {
        externalId: "test-job-2",
        jobApiId: jobApi.id,
        jobPublisherId: publisher.id,
        title: "Backend Developer",
        company: "Acme",
        url: "https://example.com",
        postedAt: new Date(),
      },
    });
    const user = await prisma.user.findFirstOrThrow();

    await prisma.userJobMatch.create({
      data: { userId: user.id, jobId: job.id, matchScore: 0.85, isDismissed: true },
    });
    await prisma.userSelectedPublisher.create({
      data: { userId: user.id, publisherId: publisher.id, isEnabled: true },
    });

    const res = await request(app)
      .get("/api/user/matches")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data.matches).toEqual([]);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/user/matches");
    expect(res.status).toBe(401);
  });
});