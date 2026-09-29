import { z } from "zod";

const currencyAllowlist = ["USD", "EUR", "MAD"] as const;

export const updatePreferencesSchema = z.object({
  jobType: z.enum(["full_time", "part_time", "contract", "internship", "freelance"]).optional(),

  workMode: z.enum(["remote", "onsite", "hybrid"]).optional(),

  dateRange: z.enum(["h24", "d7", "d30", "any"]).optional(),

  keywords: z
    .string()
    .max(255, "Keywords must be at most 255 characters")
    .optional(),

  locationFilter: z
    .string()
    .max(150, "Location filter must be at most 150 characters")
    .optional(),

  salaryMin: z
    .number()
    .int("Salary must be an integer")
    .min(0, "Salary cannot be negative")
    .max(1_000_000, "Salary seems too high")
    .optional(),

  currency: z
    .enum(currencyAllowlist, {
      error: `Currency must be one of: ${currencyAllowlist.join(", ")}`,
    })
    .optional(),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;