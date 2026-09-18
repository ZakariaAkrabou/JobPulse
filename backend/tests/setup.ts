import { config } from "dotenv";
import { beforeAll, afterAll } from "vitest";
import { prisma } from "../src/config/database.js";


config({ path: ".env.test", override: true });


beforeAll(() => {
  if (!process.env.DATABASE_URL?.includes("jobpulse_test")) {
    throw new Error(
      `Refusing to run tests: DATABASE_URL doesn't look like a test DB. Got: ${process.env.DATABASE_URL}`,
    );
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});