import { z } from "zod";

export const sourceIdParamSchema = z.object({
  sourceId: z.coerce
    .bigint()
    .positive("Source ID must be a positive number"),
});

export const toggleSourceBodySchema = z.object({
  isEnabled: z.boolean({ error: "isEnabled must be a boolean" }),
});