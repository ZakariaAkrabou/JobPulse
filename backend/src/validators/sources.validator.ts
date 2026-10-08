import { z } from "zod";

export const sourceIdParamSchema = z.object({
  sourceId: z.coerce
    .bigint()
    .positive("Source ID must be a positive number"),
});