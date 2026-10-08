import type { Request, Response } from "express";
import { findSourceById, listActiveSourcesForUser, selectSourceForUser } from "../services/sources.service.js";
import { sourceIdParamSchema } from "../validators/sources.validator.js";
import { getAuthUser } from "../types/auth.js";




export async function getSources(req: Request, res: Response) {
  const { userId } = getAuthUser(req);

  const sources = await listActiveSourcesForUser(BigInt(userId));

  return res.status(200).json({
    success: true,
    data: {
      sources: sources.map((s) => ({
        id: s.id.toString(),
        name: s.name,
        isSelected: s.isSelected,
        isEnabled: s.isEnabled,
      })),
    },
  });
}

export async function selectSource(req: Request, res: Response) {
  const { userId } = getAuthUser(req);

  const parsed = sourceIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const { sourceId } = parsed.data;

  const source = await findSourceById(sourceId);
  if (!source) {
    return res.status(404).json({
      success: false,
      message: "Source not found",
    });
  }

  if (!source.isActive) {
    return res.status(400).json({
      success: false,
      message: "Source is not available",
    });
  }

  await selectSourceForUser(BigInt(userId), sourceId);

  return res.status(200).json({
    success: true,
    message: "Source enabled",
    data: {
      source: {
        id: source.id.toString(),
        name: source.name,
        isSelected: true,
        isEnabled: true,
      },
    },
  });
}
