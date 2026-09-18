import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Unhandled error:", err);

  if (typeof err === "object" && err && "code" in err && (err as any).code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}