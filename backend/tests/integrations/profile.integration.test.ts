import { describe, it, expect, beforeEach, vi } from "vitest";

// ─── Mocks — must be hoisted before any imports ───────────────────────

vi.mock("../../src/config/cloudinary.js", () => ({
  cloudinary: {
    uploader: {
      upload_stream: (_opts: any, cb: any) => {
        setTimeout(() => {
          cb(null, {
            secure_url: "https://res.cloudinary.com/test/raw/upload/test-resume.pdf",
            public_id: "jobpulse/resumes/1/resume-test.pdf",
          });
        }, 0);
        return { end: () => {} };
      },
    },
  },
}));

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  return {
    ...actual,
    default: {
      ...actual.default,
      get: vi.fn().mockResolvedValue({
        data: Buffer.from("%PDF-1.4 fake pdf bytes"),
      }),
      post: vi.fn(),
    },
  };
});

vi.mock("../../src/services/parse.service.js", async () => {
  const actual = await vi.importActual<
    typeof import("../../src/services/parse.service.js")
  >("../../src/services/parse.service.js");

  return {
    ...actual,
    parseResumeFromBuffer: vi.fn().mockResolvedValue({
      personal_info: {
        name: "Test User",
        email: "test@example.com",
        phone: "+212600000000",
        address: "Casablanca",
      },
      work_experience: [],
      education: [],
      languages: ["English"],
      skills: ["TypeScript", "Node.js"],
      certificates: [],
    }),
  };
});


import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/config/database.js";
import { resetDb, seedRoles } from "../helpers/db.js";
import { createTestUser } from "../helpers/auth.js";

describe("Profile API", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await resetDb();
    await seedRoles();
    const result = await createTestUser();
    token = result.token;
    userId = result.userId;
  });


  describe("GET /api/user/profile", () => {
    it("returns null profile for a new user", async () => {
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.profile).toBeNull();
    });

    it("returns 401 without a token", async () => {
      const res = await request(app).get("/api/user/profile");
      expect(res.status).toBe(401);
    });

    it("returns 401 with an invalid token", async () => {
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", "Bearer not-a-real-token");
      expect(res.status).toBe(401);
    });

    it("never leaks passwordHash or refresh tokens", async () => {
      await request(app)
        .put("/api/user/update-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ location: "Casablanca" });

      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${token}`);

      const body = JSON.stringify(res.body);
      expect(body).not.toContain("passwordHash");
      expect(body).not.toContain("refreshToken");
      expect(body).not.toContain("verificationToken");
    });
  });


  describe("PUT /api/user/update-profile", () => {
    it("creates a profile on first PUT", async () => {
      const res = await request(app)
        .put("/api/user/update-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          phone: "+212600000000",
          location: "Casablanca",
          currentTitle: "Backend Dev",
          experienceYears: 3,
        });

      expect(res.status).toBe(200);

      const inDb = await prisma.userProfile.findUnique({
        where: { userId: BigInt(userId) },
      });
      expect(inDb).not.toBeNull();
      expect(inDb!.location).toBe("Casablanca");
      expect(inDb!.experienceYears).toBe(3);
    });

    it("updates only provided fields on subsequent PUT", async () => {
      await request(app)
        .put("/api/user/update-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ location: "Casablanca", currentTitle: "Backend Dev" });

      await request(app)
        .put("/api/user/update-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ location: "Rabat" });

      const inDb = await prisma.userProfile.findUniqueOrThrow({
        where: { userId: BigInt(userId) },
      });
      expect(inDb.location).toBe("Rabat");
      expect(inDb.currentTitle).toBe("Backend Dev"); 
    });

    it("rejects invalid experienceYears", async () => {
      const res = await request(app)
        .put("/api/user/update-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ experienceYears: -5 });

      expect(res.status).toBe(400);
    });

    it("ignores unknown fields (e.g. roleId) — Zod strips them", async () => {
      await request(app)
        .put("/api/user/update-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ location: "Casablanca", roleId: 9999 } as any);

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: BigInt(userId) },
        include: { role: true },
      });
      expect(user.role.name).toBe("client");
    });
  });


  describe("POST /api/user/profile/resume", () => {
    it("uploads a resume and saves the URL", async () => {
      const pdf = Buffer.from("%PDF-1.4 test");

      const res = await request(app)
        .post("/api/user/profile/resume")
        .set("Authorization", `Bearer ${token}`)
        .attach("resume", pdf, "resume.pdf");

      expect(res.status).toBe(200);

      const profile = await prisma.userProfile.findUnique({
        where: { userId: BigInt(userId) },
      });
      expect(profile!.resumeUrl).toBeTruthy();
    });

    it("rejects non-PDF files", async () => {
      const txt = Buffer.from("not a pdf");

      const res = await request(app)
        .post("/api/user/profile/resume")
        .set("Authorization", `Bearer ${token}`)
        .attach("resume", txt, {
          filename: "resume.txt",
          contentType: "text/plain",
        });

      expect(res.status).toBe(400);
    });

    it("rejects requests without a file", async () => {
      const res = await request(app)
        .post("/api/user/profile/resume")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("clears cached parse when a new resume is uploaded", async () => {
     
      await request(app)
        .post("/api/user/profile/resume")
        .set("Authorization", `Bearer ${token}`)
        .attach("resume", Buffer.from("%PDF-1.4 test"), "resume.pdf");

     
      await request(app)
        .post("/api/user/profile/resume/parse")
        .set("Authorization", `Bearer ${token}`);

      
      const afterFirstParse = await prisma.userProfile.findUniqueOrThrow({
        where: { userId: BigInt(userId) },
      });
      expect(afterFirstParse.resumeParsedJson).not.toBeNull();

      await request(app)
        .post("/api/user/profile/resume")
        .set("Authorization", `Bearer ${token}`)
        .attach("resume", Buffer.from("%PDF-1.4 new"), "resume2.pdf");

    
      const afterReupload = await prisma.userProfile.findUniqueOrThrow({
        where: { userId: BigInt(userId) },
      });
      expect(afterReupload.resumeParsedJson).toBeNull();
    });
  });

  describe("POST /api/user/profile/resume/parse", () => {
    it("returns 400 if no resume has been uploaded", async () => {
      const res = await request(app)
        .post("/api/user/profile/resume/parse")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("parses a resume and saves the result", async () => {
      await request(app)
        .post("/api/user/profile/resume")
        .set("Authorization", `Bearer ${token}`)
        .attach("resume", Buffer.from("%PDF-1.4 test"), "resume.pdf");

      const res = await request(app)
        .post("/api/user/profile/resume/parse")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.parsedJson.skills).toContain("TypeScript");

      const profile = await prisma.userProfile.findUniqueOrThrow({
        where: { userId: BigInt(userId) },
      });
      expect(profile.resumeParsedJson).not.toBeNull();
    });

    it("returns cached result on second parse without calling Extracta again", async () => {
      const parseService = await import("../../src/services/parse.service.js");

      await request(app)
        .post("/api/user/profile/resume")
        .set("Authorization", `Bearer ${token}`)
        .attach("resume", Buffer.from("%PDF-1.4 test"), "resume.pdf");

     
      await request(app)
        .post("/api/user/profile/resume/parse")
        .set("Authorization", `Bearer ${token}`);


      const second = await request(app)
        .post("/api/user/profile/resume/parse")
        .set("Authorization", `Bearer ${token}`);

      expect(second.status).toBe(200);
      expect(second.body.message).toContain("cached");

    
      expect(parseService.parseResumeFromBuffer).toHaveBeenCalledTimes(1);
    });
  });

 
  describe("PUT /api/user/profile/change-password", () => {
    it("changes the password and invalidates refresh token", async () => {
      const res = await request(app)
        .put("/api/user/profile/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "testpassword123",
          newPassword: "newpassword456",
        });

      expect(res.status).toBe(200);

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: BigInt(userId) },
      });
      expect(user.refreshToken).toBeNull();
    });

    it("rejects wrong current password", async () => {
      const res = await request(app)
        .put("/api/user/profile/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "wrongpassword",
          newPassword: "newpassword456",
        });

      expect(res.status).toBe(401);
    });

    it("rejects same password as current", async () => {
      const res = await request(app)
        .put("/api/user/profile/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "testpassword123",
          newPassword: "testpassword123",
        });

      expect(res.status).toBe(400);
    });

    it("rejects short new password", async () => {
      const res = await request(app)
        .put("/api/user/profile/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "testpassword123",
          newPassword: "short",
        });

      expect(res.status).toBe(400);
    });
  });


  describe("Cross-user isolation", () => {
    it("a user cannot see another user's profile", async () => {
      const other = await createTestUser({ email: "other@example.com" });

      await request(app)
        .put("/api/user/update-profile")
        .set("Authorization", `Bearer ${other.token}`)
        .send({ location: "Secret City" });

      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.data.profile?.location).not.toBe("Secret City");
    });
  });
});