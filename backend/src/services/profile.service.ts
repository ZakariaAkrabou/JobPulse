import { prisma } from './../config/database';
import type {UserProfileModel} from "../generated/prisma/models/UserProfile";
import type {UpdateProfileInput} from "../validators/profile.validator";
import { cloudinary } from "../config/cloudinary.js";


export async function getProfileByUserId(userId:bigint):Promise<UserProfileModel | null >{
    return prisma.userProfile.findUnique({
        where: {userId},
        
    });
    
}

export async function upsertProfile(userId:bigint ,data:UpdateProfileInput):Promise<UserProfileModel>{
    return prisma.userProfile.upsert({
        where:{userId},
        update:data,
        create:{
            userId,
            ...data,
        },
    })
}

export async function uploadResumeToCloudinary(
  userId: bigint,
  buffer: Buffer,
  originalName: string,
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const publicId = `resume-${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `jobpulse/resumes/${userId}`,
        resource_type: "raw",
        public_id: publicId,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    stream.end(buffer);
  });
}

export async function updateResumeFields(
  userId: bigint,
  data: { resumeUrl: string; resumeParsedText: string | null },
) {
  return prisma.userProfile.upsert({
    where: { userId },
    update: {
      resumeUrl: data.resumeUrl,
      resumeParsedText: data.resumeParsedText,
    },
    create: {
      userId,
      resumeUrl: data.resumeUrl,
      resumeParsedText: data.resumeParsedText,
    },
  });
}

export async function findUserById(id: bigint) {
  return prisma.user.findUnique({ where: { id } });
}

export async function changeUserPassword(
  userId: bigint,
  passwordHash: string,
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      refreshToken: null,
      refreshTokenExpiresAt: null,
    },
    select: { id: true },
  });
}