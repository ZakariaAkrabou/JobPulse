import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),

  fullName: z
    .string({ error: "Full name is required" })
    .min(2, "Full name must be at least 2 characters")
    .max(150, "Full name must be at most 150 characters")
    .trim(),
});
export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z.string({ error: "Password is required" }).min(1),
});



export const verifyEmailSchema = z.object({
  token: z
    .string({ error: "Token is required" })
    .length(64, "Invalid token format")
    .regex(/^[a-f0-9]+$/, "Invalid token format"),
});


export const forgotPasswordSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
});



export const resetPasswordSchema = z.object({
  token: z
    .string({ error: "Token is required" })
    .length(64, "Invalid token format")
    .regex(/^[a-f0-9]+$/, "Invalid token format"),

  newPassword: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ error: "Current password is required" })
    .min(1, "Current password is required"),

  newPassword: z
    .string({ error: "New password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;