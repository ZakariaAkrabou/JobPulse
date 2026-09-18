import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import type { RoleName } from "../generated/prisma/enums.js";

type AccessTokenPayload = {
  sub: string;
  role: RoleName;
};

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: RoleName;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const fromCookie = req.cookies?.access_token;
  const fromHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;

  const token = fromCookie ?? fromHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as AccessTokenPayload;

    req.user = {
      userId: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("JWT verify failed:", (err as Error).message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};