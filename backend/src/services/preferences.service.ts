import { date } from "zod";
import {prisma} from "../config/database";
import type {UserJobPreferencesModel} from "../generated/prisma/models/UserJobPreferences";
import type {UpdatePreferencesInput} from "../validators/preferences.validator";


export async function getPreferencesByUserId(userId:bigint): Promise<UserJobPreferencesModel | null>{

    return prisma.userJobPreferences.findUnique({
        where :{ userId}
    });
}

export async function upsertPreferences( userId: bigint, data: UpdatePreferencesInput,): Promise<UserJobPreferencesModel> {

  return prisma.userJobPreferences.upsert({

    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
}