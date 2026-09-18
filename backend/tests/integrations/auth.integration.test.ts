import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { resetDb, seedRoles } from "../helpers/db.js";
import { prisma } from "../../src/config/database.js";

describe("Auth — Registration", () => {
  beforeEach(async () => {
    await resetDb();
    await seedRoles();
  });

  it("registers a new user and returns 201 with sanitized payload", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "alice@example.com",
        password: "supersecret123",
        fullName: "Alice Doe",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

   
    const dbUser = await prisma.user.findUnique({
      where: { email: "alice@example.com" },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser!.isVerified).toBe(false);
    expect(dbUser!.passwordHash).not.toBe("supersecret123"); 
    expect(dbUser!.verificationToken).toMatch(/^[a-f0-9]{64}$/);

   
    expect(JSON.stringify(res.body)).not.toContain("passwordHash");
    expect(JSON.stringify(res.body)).not.toContain("verificationToken");
  });

  it("returns 409 for a duplicate email", async () => {
    const payload = {
      email: "bob@example.com",
      password: "supersecret123",
      fullName: "Bob",
    };

    await request(app).post("/api/auth/register").send(payload);
    const second = await request(app).post("/api/auth/register").send(payload);

    expect(second.status).toBe(409);
  });

  it("returns 400 with field errors on invalid input", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "not-an-email", password: "abc", fullName: "" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
        expect.objectContaining({ field: "password" }),
        expect.objectContaining({ field: "fullName" }),
      ]),
    );
  });

  it("assigns the client role by default", async () => {
    await request(app).post("/api/auth/register").send({
      email: "client@example.com",
      password: "supersecret123",
      fullName: "Client User",
    });

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: "client@example.com" },
      include: { role: true },
    });

    expect(user.role.name).toBe("client");
  });
});