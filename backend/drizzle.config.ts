import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run Drizzle Kit from backend");
}

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./src/database/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: databaseUrl,
  },
});