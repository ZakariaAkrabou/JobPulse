import {
  mysqlTable,
  bigint,
  varchar,
  boolean,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" })
    .autoincrement()
    .primaryKey(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),

  password: varchar("password", { length: 255 })
    .notNull(),

  fullName: varchar("full_name", { length: 255 })
    .notNull(),

  role: mysqlEnum("role", ["USER", "ADMIN"])
    .notNull()
    .default("USER"),

  isVerified: boolean("is_verified")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
    
});


export const refreshTokens = mysqlTable("refresh_tokens", {
  id: bigint("id", { mode: "number" })
    .autoincrement()
    .primaryKey(),

  userId: bigint("user_id", { mode: "number" })
    .notNull(),

  tokenHash: varchar("token_hash", { length: 255 })
    .notNull()
    .unique(),

  expiresAt: timestamp("expires_at")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
