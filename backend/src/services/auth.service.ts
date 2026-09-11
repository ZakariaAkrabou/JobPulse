import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "../config/database.js";
import { users, refreshTokens } from "../database/schema.js";

interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

interface LoginInput {
  email: string;
  password: string;
}
interface RefreshTokenInput {
  refreshToken: string;
}
interface UpdateProfileInput {
  fullName: string;
}

export const registerUser = async ({
  email,
  password,
  fullName,
}: RegisterInput) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.insert(users).values({
    email,
    passwordHash,
    fullName,
  });

  return {
    id: result[0].insertId,
    email,
    fullName,
    role: "USER",
    isVerified: false,
  };
};

export const loginUser = async ({
  email,
  password,
}: LoginInput) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = result[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  // Access token
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "development-secret",
    {
      expiresIn: "15m",
    }
  );

  // Generate refresh token
  const refreshToken = crypto.randomBytes(64).toString("hex");

  // Hash refresh token before storing it
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Refresh token expires in 7 days
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
    },
    accessToken,
    refreshToken,
  };
};
export const refreshAccessToken = async ({
  refreshToken,
}: RefreshTokenInput) => {
  // Hash the received refresh token
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Find token in database
  const result = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .limit(1);

  const storedToken = result[0];

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  // Check expiration
  if (storedToken.expiresAt.getTime() < Date.now()) {
    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.id, storedToken.id));

    throw new Error("Refresh token expired");
  }

  // Find user
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, storedToken.userId))
    .limit(1);

  const user = userResult[0];

  if (!user) {
    throw new Error("User not found");
  }

  // Delete old refresh token = rotation
  await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.id, storedToken.id));

  // Create new access token
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "development-secret",
    {
      expiresIn: "15m",
    }
  );

  // Create new refresh token
  const newRefreshToken = crypto.randomBytes(64).toString("hex");

  const newTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash: newTokenHash,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
export const getCurrentUser = async (userId: number) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = result[0];

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isVerified: user.isVerified,
  };
};
export const getProfile = async (userId: number) => {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = result[0];

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
export const updateProfile = async (
  userId: number,
  { fullName }: UpdateProfileInput
) => {
  const result = await db
    .update(users)
    .set({
      fullName,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  if (result[0].affectedRows === 0) {
    throw new Error("User not found");
  }

  const updatedUser = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = updatedUser[0];

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};