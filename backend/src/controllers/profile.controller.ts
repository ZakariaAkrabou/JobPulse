import type { Request, Response } from "express";
import { getAuthUser } from "../types/auth.js";
import { updateProfileSchema,changePasswordSchema } from "../validators/profile.validator.js";
import {getProfileByUserId,upsertProfile,uploadResumeToCloudinary,updateResumeFields,findUserById,changeUserPassword,} from "../services/profile.service.js";
import { verifyPassword, hashPassword } from "../utils/hash.js";


export async function getProfile(req: Request, res: Response) {
  const { userId } = getAuthUser(req);
  const profile = await getProfileByUserId(BigInt(userId));
  console.log(userId)
  return res.status(200).json({
    success: true,
    data: {
      profile: profile
        ? {
            ...profile,
            id: profile.id.toString(),
            userId: profile.userId.toString(),
          }
        : null,
    },
  });
}

export async function updateProfile(req: Request, res: Response) {
  const { userId } = getAuthUser(req);

  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const profile = await upsertProfile(BigInt(userId), parsed.data);

  return res.status(200).json({
    success: true,
    message: "Profile updated",
    data: {
      profile: {
        ...profile,
        id: profile.id.toString(),
        userId: profile.userId.toString(),
      },
    },
  });
}

export async function uploadResume(req: Request, res: Response) {
  const { userId } = getAuthUser(req);

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No resume file provided. Use field name 'resume'.",
    });
  }

  const { url, publicId } = await uploadResumeToCloudinary(
    BigInt(userId),
    req.file.buffer,
    req.file.originalname,
  );

  const profile = await updateResumeFields(BigInt(userId), {
    resumeUrl: url,
    resumeParsedText: null,
  });

  return res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    data: {
      resumeUrl: url,
      publicId,
      profile: {
        ...profile,
        id: profile.id.toString(),
        userId: profile.userId.toString(),
      },
    },
  });
}


export async function changePassword(req: Request, res: Response) {
  const { userId } = getAuthUser(req);

  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await findUserById(BigInt(userId));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const ok = await verifyPassword(currentPassword, user.passwordHash);
  if (!ok) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different from current password",
    });
  }

  const newHash = await hashPassword(newPassword);
  await changeUserPassword(user.id, newHash);

  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/api/v1/auth" });

  return res.status(200).json({
    success: true,
    message: "Password changed successfully. Please log in again.",
  });
}