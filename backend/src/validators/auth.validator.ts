import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const email = z
	.string()
	.trim()
	.email("Please provide a valid email address")
	.max(255, "Email must be at most 255 characters");

const password = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(72, "Password must be at most 72 characters");

const fullName = z
	.string()
	.trim()
	.min(2, "Full name must be at least 2 characters")
	.max(255, "Full name must be at most 255 characters");

export const registerSchema = z.object({
	email,
	password,
	fullName,
});

export const loginSchema = z.object({
	email,
	password,
});

export const refreshSchema = z.object({
	refreshToken: z.string().trim().min(1, "Refresh token is required"),
});

export const updateProfileSchema = z.object({
	fullName,
});
export const verifyEmailSchema = z.object({
	token: z.string().trim().min(1, "Verification token is required"),
});
export const forgotPasswordSchema = z.object({
  email,
});
export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Reset token is required"),
  newPassword: password,
});
export const validate = (schema: z.ZodType) => (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const result = schema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors: result.error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			})),
		});
	}

	req.body = result.data;
	next();
};
