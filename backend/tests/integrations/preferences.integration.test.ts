import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/config/database.js";
import { resetDb, seedRoles } from "../helpers/db.js";
import { createTestUser } from "../helpers/auth.js";

describe("Preferences API", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await resetDb();
    await seedRoles();
    const result = await createTestUser();
    token = result.token;
    userId = result.userId;
  });


  describe("GET /api/user/preferences", () => {
    it("returns null for a new user", async () => {
      const res = await request(app)
        .get("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.preferences).toBeNull();
    });

    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/user/preferences");
      expect(res.status).toBe(401);
    });

    it("returns 401 with an invalid token", async () => {
      const res = await request(app)
        .get("/api/user/preferences")
        .set("Authorization", "Bearer not-a-real-token");
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/user/preferences", () => {
    it("creates preferences on first PUT", async () => {
      const res = await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobType: "full_time",
          workMode: "remote",
          dateRange: "d7",
          keywords: "react,node",
          locationFilter: "Casablanca",
          salaryMin: 8000,
          currency: "MAD",
        });

      expect(res.status).toBe(200);

      const inDb = await prisma.userJobPreferences.findUnique({
        where: { userId: BigInt(userId) },
      });
      expect(inDb).not.toBeNull();
      expect(inDb!.jobType).toBe("full_time");
      expect(inDb!.workMode).toBe("remote");
      expect(inDb!.salaryMin).toBe(8000);
      expect(inDb!.currency).toBe("MAD");
    });

    it("updates only provided fields on subsequent PUT", async () => {
      await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ locationFilter: "Casablanca", jobType: "full_time" });

      await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ locationFilter: "Rabat" });

      const inDb = await prisma.userJobPreferences.findUniqueOrThrow({
        where: { userId: BigInt(userId) },
      });
      expect(inDb.locationFilter).toBe("Rabat");
      expect(inDb.jobType).toBe("full_time"); 
    });

    it("rejects invalid jobType", async () => {
      const res = await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ jobType: "invalid_type" });

      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "jobType" }),
        ]),
      );
    });

    it("rejects invalid workMode", async () => {
      const res = await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ workMode: "teleport" });

      expect(res.status).toBe(400);
    });

    it("rejects invalid dateRange", async () => {
      const res = await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ dateRange: "1y" });

      expect(res.status).toBe(400);
    });

    it("rejects unsupported currency", async () => {
      const res = await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ currency: "XYZ" });

      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "currency" }),
        ]),
      );
    });

    it("rejects negative salaryMin", async () => {
      const res = await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ salaryMin: -100 });

      expect(res.status).toBe(400);
    });

    it("ignores unknown fields (Zod strips them)", async () => {
      await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ locationFilter: "Rabat", isAdmin: true } as any);

      const inDb = await prisma.userJobPreferences.findUniqueOrThrow({
        where: { userId: BigInt(userId) },
      });
      expect(inDb.locationFilter).toBe("Rabat");
   
      expect((inDb as any).isAdmin).toBeUndefined();
    });

    it("rejects keywords longer than 255 chars", async () => {
      const res = await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ keywords: "a".repeat(256) });

      expect(res.status).toBe(400);
    });
  });

  describe("Cross-user isolation", () => {
    it("a user cannot see another user's preferences", async () => {
      const other = await createTestUser({ email: "other@example.com" });

      await request(app)
        .put("/api/user/preferences")
        .set("Authorization", `Bearer ${other.token}`)
        .send({ locationFilter: "Secret City" });

      const res = await request(app)
        .get("/api/user/preferences")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.data.preferences).toBeNull();
    });
  });
});