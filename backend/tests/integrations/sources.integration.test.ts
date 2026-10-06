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

  beforeEach(async () => {
    await resetDb();
    await seedRoles();
    await seedSources();
    const result = await createTestUser();
    token = result.token;
  });

  describe("GET /api/user/sources", () => {
    it("returns the list of active sources", async () => {
      const res = await request(app)
        .get("/api/user/sources")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.sources).toHaveLength(4);
      const names = res.body.data.sources.map((s: any) => s.name);
      expect(names).toEqual(["Adzuna", "JSearch", "RemoteOK", "Remotive"]); // alphabetical
    });

    it("never exposes api_key_env", async () => {
      const res = await request(app)
        .get("/api/user/sources")
        .set("Authorization", `Bearer ${token}`);

      const body = JSON.stringify(res.body);
      expect(body).not.toContain("apiKeyEnv");
      expect(body).not.toContain("api_key_env");
    });

    it("does not return inactive sources", async () => {
      // Flip one to inactive
      await prisma.jobSource.update({
        where: { name: "Adzuna" },
        data: { isActive: false },
      });

      const res = await request(app)
        .get("/api/user/sources")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.data.sources).toHaveLength(3);
      const names = res.body.data.sources.map((s: any) => s.name);
      expect(names).not.toContain("Adzuna");
    });

    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/user/sources");
      expect(res.status).toBe(401);
    });

    it("returns 401 with an invalid token", async () => {
      const res = await request(app)
        .get("/api/user/sources")
        .set("Authorization", "Bearer not-a-real-token");
      expect(res.status).toBe(401);
    });
  });
});