import {prisma} from "../config/database";
import type {JobSourceModel} from "../generated/prisma/models/JobSource";




export async function findSourceById(sourceId: bigint): Promise<JobSourceModel | null> {

    return prisma.jobSource.findUnique({
        
        where: {id: sourceId}
    });
}

export async function listActiveSources(): Promise<JobSourceModel[]>{

    return prisma.jobSource.findMany({

        where:{isActive: true},
        orderBy:{name: "asc"}
    });
}


export async function listActiveSourcesForUser(userId: bigint) {
  const sources = await prisma.jobSource.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      userSelections: {
        where: { userId },
      },
    },
  });

  return sources.map((s) => ({
    id: s.id,
    name: s.name,
    isActive: s.isActive,
    isSelected: s.userSelections.length > 0,
    isEnabled: s.userSelections[0]?.isEnabled ?? false,
  }));
}


export async function selectSourceForUser(userId: bigint, sourceId: bigint) {
  return prisma.userSelectedSource.upsert({
    where: {
      userId_sourceId: { userId, sourceId },
    },
    update: { isEnabled: true },
    create: {
      userId,
      sourceId,
      isEnabled: true,
    },
  });
}


