import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/config/database.js";
import { resetDb, seedRoles } from "../helpers/db.js";
import { createTestUser } from "../helpers/auth.js";

async function seedPublishers() {
  await prisma.jobPublisher.createMany({
    data: [
      { name: "LinkedIn",     slug: "linkedin" },
      { name: "Indeed",       slug: "indeed" },
      { name: "Glassdoor",    slug: "glassdoor" },
      { name: "ZipRecruiter", slug: "ziprecruiter" },
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
    await seedPublishers();
    const result = await createTestUser();
    token = result.token;
    userId = result.userId;
  });

  // ─── GET /api/user/sources ────────────────────────────────────────
  describe("GET /api/user/sources", () => {
    it("returns 4 sources with isSelected: false for a new user", async () => {
      const res = await request(app)
        .get("/api/user/sources")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.sources).toHaveLength(4);
      for (const s of res.body.data.sources) {
        expect(s.isSelected).toBe(false);
        expect(s.isEnabled).toBe(false);
      }
    });

    it("returns them alphabetically", async () => {
      const res = await request(app)
        .get("/api/user/sources")
        .set("Authorization", `Bearer ${token}`);

      const names = res.body.data.sources.map((s: any) => s.name);
      expect(names).toEqual(["Glassdoor", "Indeed", "LinkedIn", "ZipRecruiter"]);
    });

    it("excludes inactive sources", async () => {
      await prisma.jobPublisher.update({
        where: { name: "Glassdoor" },
        data: { isActive: false },
      });

      const res = await request(app)
        .get("/api/user/sources")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.data.sources).toHaveLength(3);
    });

    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/user/sources");
      expect(res.status).toBe(401);
    });
  });

  // ─── POST /api/user/sources/:id/select ────────────────────────────
  describe("POST /api/user/sources/:sourceId/select", () => {
    it("selects a source and persists the row", async () => {
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "LinkedIn" },
      });

      const res = await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.source.isSelected).toBe(true);

      const row = await prisma.userSelectedPublisher.findUnique({
        where: {
          userId_publisherId: {
            userId: BigInt(userId),
            publisherId: source.id,
          },
        },
      });
      expect(row).not.toBeNull();
      expect(row!.isEnabled).toBe(true);
    });

    it("is idempotent — selecting twice yields one row", async () => {
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "Indeed" },
      });

      await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);
      const res2 = await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      expect(res2.status).toBe(200);

      const count = await prisma.userSelectedPublisher.count({
        where: { userId: BigInt(userId), publisherId: source.id },
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
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "ZipRecruiter" },
      });
      await prisma.jobPublisher.update({
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
  });

  // ─── DELETE /api/user/sources/:id/select ──────────────────────────
  describe("DELETE /api/user/sources/:sourceId/select", () => {
    it("removes a selected source", async () => {
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "LinkedIn" },
      });

      // First select
      await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      // Then deselect
      const res = await request(app)
        .delete(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      const row = await prisma.userSelectedPublisher.findUnique({
        where: {
          userId_publisherId: {
            userId: BigInt(userId),
            publisherId: source.id,
          },
        },
      });
      expect(row).toBeNull();
    });

    it("is idempotent — deleting a non-selected source returns 200", async () => {
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "Indeed" },
      });

      const res = await request(app)
        .delete(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  // ─── PATCH /api/user/sources/:id ──────────────────────────────────
  describe("PATCH /api/user/sources/:sourceId", () => {
    it("toggles isEnabled to false on an existing selection", async () => {
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "LinkedIn" },
      });

      // Select first
      await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      // Toggle off
      const res = await request(app)
        .patch(`/api/user/sources/${source.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ isEnabled: false });

      expect(res.status).toBe(200);
      expect(res.body.data.isEnabled).toBe(false);

      const row = await prisma.userSelectedPublisher.findUniqueOrThrow({
        where: {
          userId_publisherId: {
            userId: BigInt(userId),
            publisherId: source.id,
          },
        },
      });
      expect(row.isEnabled).toBe(false);
    });

    it("returns 404 if the source is not in the user's list", async () => {
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "Glassdoor" },
      });

      const res = await request(app)
        .patch(`/api/user/sources/${source.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ isEnabled: false });

      expect(res.status).toBe(404);
    });

    it("returns 400 for a missing isEnabled body field", async () => {
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "LinkedIn" },
      });

      const res = await request(app)
        .patch(`/api/user/sources/${source.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  // ─── Cross-user isolation ─────────────────────────────────────────
  describe("Cross-user isolation", () => {
    it("user A's selection does not affect user B", async () => {
      const other = await createTestUser({ email: "other@example.com" });
      const source = await prisma.jobPublisher.findFirstOrThrow({
        where: { name: "LinkedIn" },
      });

      await request(app)
        .post(`/api/user/sources/${source.id}/select`)
        .set("Authorization", `Bearer ${token}`);

      const res = await request(app)
        .get("/api/user/sources")
        .set("Authorization", `Bearer ${other.token}`);

      const linkedin = res.body.data.sources.find((s: any) => s.name === "LinkedIn");
      expect(linkedin.isSelected).toBe(false);
    });
  });
});