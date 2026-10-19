import { prisma } from "../../config/database.js";
import type { NormalizedJob } from "./normalized.js";
import { extractSkills } from "../match/skill-extractor.js";

export interface PersistResult {
  fetched: number;
  inserted: number;
  skipped: number;
  newPublishers: string[];
  insertedJobIds: bigint[];
}

export async function persistJobs(
  jobApiId: bigint,
  jobs: NormalizedJob[],
): Promise<PersistResult> {
  let inserted = 0;
  let skipped = 0;
  const newPublishers: string[] = [];
  const insertedJobIds: bigint[] = [];

  const uniqueNames = Array.from(
    new Set(
      jobs
        .map((j) => j.publisherName)
        .filter((n): n is string => typeof n === "string" && n.length > 0),
    ),
  );

  const publisherMap = new Map<string, bigint>();

  for (const name of uniqueNames) {
    const existing = await prisma.jobPublisher.findUnique({ where: { name } });
    if (existing) {
      publisherMap.set(name, existing.id);
      continue;
    }
    const created = await prisma.jobPublisher.create({
      data: { name, slug: toSlug(name), discoveredVia: jobApiId, isActive: true },
    });
    publisherMap.set(name, created.id);
    newPublishers.push(name);
  }

  for (const job of jobs) {
    const existing = await prisma.job.findUnique({
      where: {
        externalId_jobApiId: {
          externalId: job.externalId,
          jobApiId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const publisherId = job.publisherName
      ? publisherMap.get(job.publisherName) ?? null
      : null;

    const created = await prisma.job.create({
      data: {
        externalId: job.externalId,
        jobApiId,
        jobPublisherId: publisherId,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        url: job.url,
        skills: extractSkills(job.description ?? "") as any,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        jobType: job.jobType,
        workMode: job.workMode,
        postedAt: job.postedAt,
      },
    });

    insertedJobIds.push(created.id);
    inserted++;
  }

  return { fetched: jobs.length, inserted, skipped, newPublishers, insertedJobIds };
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}