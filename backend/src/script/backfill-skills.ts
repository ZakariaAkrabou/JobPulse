import "dotenv/config";
import { prisma } from "../../src/config/database.js";
import { Prisma } from "../generated/prisma/client.js";
import { extractSkills } from "../services/match/skill-extractor.js";

async function main() {
  const jobs = await prisma.job.findMany({
   where: { skills: { equals: Prisma.DbNull } },
    select: { id: true, description: true },
  });

  for (const job of jobs) {
    const skills = extractSkills(job.description ?? "");
    await prisma.job.update({
      where: { id: job.id },
      data: { skills: skills as any },
    });
  }
  console.log(`Backfilled skills for ${jobs.length} jobs.`);
}

main().finally(() => prisma.$disconnect());