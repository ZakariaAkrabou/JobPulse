import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../src/services/fetch/adapters/jsearch.adapter.js", () => ({
  fetchJobsFromJSearch: vi.fn().mockResolvedValue([
    {
      externalId: "job-1",
      publisherName: "LinkedIn",
      title: "Backend Developer",
      company: "Acme Corp",
      location: "Casablanca, MA",
      description: "Build APIs",
      url: "https://example.com/job-1",
      salaryMin: 8000,
      salaryMax: 12000,
      currency: "MAD",
      jobType: "full_time",
      workMode: null,
      postedAt: new Date("2026-10-01T00:00:00Z"),
    },
    {
      externalId: "job-2",
      publisherName: "Indeed",
      title: "Frontend Developer",
      company: "Beta Inc",
      location: "Rabat, MA",
      description: "Build UIs",
      url: "https://example.com/job-2",
      salaryMin: null,
      salaryMax: null,
      currency: null,
      jobType: "full_time",
      workMode: "remote",
      postedAt: new Date("2026-10-02T00:00:00Z"),
    },
  ]),
}));

import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/config/database.js";
import { resetDb, seedRoles } from "../helpers/db.js";
import { createTestUser } from "../helpers/auth.js";

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

describe("Jobs Fetch API", () => {
  let token: string;

  beforeEach(async () => {
    await resetDb();
    await seedRoles();
    await seedApis();
    const result = await createTestUser();
    token = result.token;
  });

  describe("POST /api/user/jobs/fetch", () => {
    it("fetches jobs, creates publishers, and returns a summary", async () => {
      const res = await request(app)
        .post("/api/user/jobs/fetch")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fetched).toBe(2);
      expect(res.body.data.inserted).toBe(2);
      expect(res.body.data.skipped).toBe(0);
      expect(res.body.data.newPublishers).toEqual(
        expect.arrayContaining(["LinkedIn", "Indeed"]),
      );

      const jobs = await prisma.job.findMany();
      expect(jobs).toHaveLength(2);

      const publishers = await prisma.jobPublisher.findMany();
      const names = publishers.map((p) => p.name).sort();
      expect(names).toEqual(["Indeed", "LinkedIn"]);
    });

    it("deduplicates jobs on second fetch", async () => {

      await request(app)
        .post("/api/user/jobs/fetch")
        .set("Authorization", `Bearer ${token}`);

      const res = await request(app)
        .post("/api/user/jobs/fetch")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.data.inserted).toBe(0);
      expect(res.body.data.skipped).toBe(2);

      const jobs = await prisma.job.findMany();
      expect(jobs).toHaveLength(2);
    });

    it("attaches the correct publisher to each job", async () => {
      await request(app)
        .post("/api/user/jobs/fetch")
        .set("Authorization", `Bearer ${token}`);

      const job1 = await prisma.job.findFirstOrThrow({
        where: { externalId: "job-1" },
        include: { jobPublisher: true },
      });
      expect(job1.jobPublisher?.name).toBe("LinkedIn");

      const job2 = await prisma.job.findFirstOrThrow({
        where: { externalId: "job-2" },
        include: { jobPublisher: true },
      });
      expect(job2.jobPublisher?.name).toBe("Indeed");
    });

    it("stores the jobApiId on each job", async () => {
      await request(app)
        .post("/api/user/jobs/fetch")
        .set("Authorization", `Bearer ${token}`);

      const jsearch = await prisma.jobApi.findUniqueOrThrow({
        where: { code: "jsearch" },
      });

      const jobs = await prisma.job.findMany();
      for (const job of jobs) {
        expect(job.jobApiId).toBe(jsearch.id);
      }
    });

    it("returns 401 without a token", async () => {
      const res = await request(app).post("/api/user/jobs/fetch");
      expect(res.status).toBe(401);
    });
  });
});