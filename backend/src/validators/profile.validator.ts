import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(150, "Full name must be at most 150 characters")
    .trim()
    .optional(),

  phone: z.string().max(30, "Phone must be at most 30 characters").optional(),

  location: z
    .string()
    .max(150, "Location must be at most 150 characters")
    .optional(),

  currentTitle: z
    .string()
    .max(150, "Current title must be at most 150 characters")
    .optional(),

  experienceYears: z.coerce
    .number()
    .int("Experience years must be an integer")
    .min(0, "Experience years cannot be negative")
    .max(70, "Experience years seems too high")
    .optional(),

  summary: z
    .string()
    .max(5000, "Summary must be at most 5000 characters")
    .optional(),
    
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

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;