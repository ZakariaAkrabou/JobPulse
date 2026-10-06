import {prisma} from "../config/database";
import type {JobSourceModel} from "../generated/prisma/models/JobSource";


export async function listActiveSources(): Promise<JobSourceModel[]>{

    return prisma.jobSource.findMany({

        where:{isActive: true},
        orderBy:{name: "asc"}
    });
}