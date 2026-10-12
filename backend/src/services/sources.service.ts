import {prisma} from "../config/database";
import type {JobPublisherModel} from "../generated/prisma/models/JobPublisher.js";




export async function listActiveSourcesForUser(userId: bigint) {
  const publishers = await prisma.jobPublisher.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      userSelections: {
        where: { userId },
      },
    },
  });

  return publishers.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    isSelected: p.userSelections.length > 0,
    isEnabled: p.userSelections[0]?.isEnabled ?? false,
  }));
}


export async function findSourceById(id: bigint): Promise<JobPublisherModel | null> {
  return prisma.jobPublisher.findUnique({
    where: { id },
  });
}

export async function selectSourceForUser(userId: bigint, sourceId: bigint) {
  return prisma.userSelectedPublisher.upsert({
    where: {
      userId_publisherId: { userId, publisherId: sourceId },
    },
    update: { isEnabled: true },
    create: {
      userId,
      publisherId: sourceId,
      isEnabled: true,
    },
  });
}

export async function deselectSourceForUser(userId: bigint, sourceId: bigint) {

  await prisma.userSelectedPublisher.deleteMany({

    where: { userId, publisherId: sourceId },

  });
}


export async function toggleSourceForUser(
  userId: bigint,
  sourceId: bigint,
  isEnabled: boolean,
) {
  const existing = await prisma.userSelectedPublisher.findUnique({
    where: {
      userId_publisherId: { userId, publisherId: sourceId },
    },
  });

  if (!existing) return null;

  return prisma.userSelectedPublisher.update({

    where: { id: existing.id },
    
    data: { isEnabled },
  });
}


