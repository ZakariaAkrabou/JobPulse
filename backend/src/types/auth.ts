import type { Request } from "express";
import type { RoleName } from "../generated/prisma/enums.js";

export type AuthUser = {
  userId: string;
  role: RoleName;
};

export function getAuthUser(req: Request): AuthUser {
  const user = (req as Request & { user?: AuthUser }).user;
  if (!user) {
    throw new Error("getAuthUser called without authenticate middleware");
  }
  return user;
}