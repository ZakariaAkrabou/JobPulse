import {prisma} from "../config/database";
import type {JobSourceModel} from "../generated/prisma/models/JobSource";


export async function listActiveSources(): Promise<JobSourceModel[]>{

    return prisma.jobSource.findMany({

        where:{isActive: true},
        orderBy:{name: "asc"}
    });
}

export async function findSourceById(sourceId: bigint): Promise<JobSourceModel | null> {

    return prisma.jobSource.findUnique({
        
        where: {id: sourceId}
    });
}

export async function selectSourceForUser(userId: bigint, sourceId: bigint) {

    return prisma.userSelectedSource.upsert({
        where: {
            userId_sourceId: { userId, sourceId }
        },
        update: { isEnabled: true },

        create : {

            userId,
            sourceId,
            isEnabled: true
        },
    })
}

