import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/config/database.js";
import { resetDb, seedRoles } from "../helpers/db.js";
import { createTestUser } from "../helpers/auth.js";

async function seedSources() {
  await prisma.jobSource.createMany({
    data: [
      { name: "JSearch",  apiEndpoint: "https://jsearch.p.rapidapi.com/search", apiKeyEnv: "RAPIDAPI_KEY" },
      { name: "Adzuna",   apiEndpoint: "https://api.adzuna.com/v1/api/jobs",   apiKeyEnv: "ADZUNA_APP_ID" },
      { name: "Remotive", apiEndpoint: "https://remotive.com/api/remote-jobs", apiKeyEnv: "" },
      { name: "RemoteOK", apiEndpoint: "https://remoteok.com/api",             apiKeyEnv: "" },
    ],
    skipDuplicates: true,
  });
}

describe("Sources API", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await resetDb();
    await seedRoles();
    await seedSources();
    const result = await createTestUser();
    token = result.token;
    userId = result.userId;
  });

  describe("GET /api/user/sources/list", () => {
    it("returns all active sources with isSelected: false by default", async () => {
      const res = await request(app)
        .get("/api/user/sources/list")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.sources).toHaveLength(4);
      for (const s of res.body.data.sources) {
        expect(s.isSelected).toBe(false);
        expect(s.isEnabled).toBe(false);
      }
    });

    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/user/sources/list");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/user/sources/:sourceId/select", () => {
    it("selects a source and returns isSelected: true", async () => {
      const source = await prisma.jobSource.findFirstOrThrow({
        where: { name: "JSearch" },
      });

      const res = await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.source.isSelected).toBe(true);
      expect(res.body.data.source.isEnabled).toBe(true);

      const row = await prisma.userSelectedSource.findUnique({
        where: {
          userId_sourceId: {
            userId: BigInt(userId),
            sourceId: source.id,
          },
        },
      });
      expect(row).not.toBeNull();
      expect(row!.isEnabled).toBe(true);
    });

    it("is idempotent — selecting twice returns 200 both times", async () => {
      const source = await prisma.jobSource.findFirstOrThrow({
        where: { name: "Remotive" },
      });

      const res1 = await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);
      const res2 = await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);


      const count = await prisma.userSelectedSource.count({
        where: { userId: BigInt(userId), sourceId: source.id },
      });
      expect(count).toBe(1);
    });

    it("returns 404 for a non-existent source", async () => {
      const res = await request(app)
        .post("/api/user/sources/999999/select")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("returns 400 for an inactive source", async () => {
      const source = await prisma.jobSource.findFirstOrThrow({
        where: { name: "Adzuna" },
      });
      await prisma.jobSource.update({
        where: { id: source.id },
        data: { isActive: false },
      });

      const res = await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("returns 400 for an invalid sourceId", async () => {
      const res = await request(app)
        .post("/api/user/sources/abc/select")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("returns 401 without a token", async () => {
      const res = await request(app).post("/api/user/sources/1/select");
      expect(res.status).toBe(401);
    });

    it("does not let user A affect user B's selections", async () => {
      const other = await createTestUser({ email: "other@example.com" });
      const source = await prisma.jobSource.findFirstOrThrow({
        where: { name: "RemoteOK" },
      });

   
      await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

  
      const res = await request(app)
        .get("/api/user/sources/list")
        .set("Authorization", `Bearer ${other.token}`);

      const remoteOk = res.body.data.sources.find(
        (s: any) => s.name === "RemoteOK",
      );
      expect(remoteOk.isSelected).toBe(false);
    });

    it("reflects selection in GET /sources/list", async () => {
      const source = await prisma.jobSource.findFirstOrThrow({
        where: { name: "JSearch" },
      });

      await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      const res = await request(app)
        .get("/api/user/sources/list")
        .set("Authorization", `Bearer ${token}`);

      const jsearch = res.body.data.sources.find(
        (s: any) => s.name === "JSearch",
      );
      expect(jsearch.isSelected).toBe(true);
      expect(jsearch.isEnabled).toBe(true);
    });
  });
});