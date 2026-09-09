import app from "./app.js";
import env from "./config/env.js";
import { db } from "./config/database.js";
import { sql } from "drizzle-orm";

const startServer = async () => {
  try {
    await db.execute(sql`SELECT 1`);

    console.log("Database connected successfully");

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();