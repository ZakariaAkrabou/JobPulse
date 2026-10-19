import {prisma} from "../../config/database";
import {computeMatchScore} from "./scoring";
import type { MatchRunResult} from "../../dto/ScoreDto";



const MIN_SCORE = 0.60;


export async function runMatchingForJobs( jobIds: bigint[], ): Promise<MatchRunResult> {
  if (jobIds.length === 0) {
    return { usersEvaluated: 0, matchesCreated: 0, matchesSkipped: 0 };
  }

  const jobs = await prisma.job.findMany({
    where: { id: { in: jobIds } },
  });

 
  const users = await prisma.user.findMany({
    where: {
      isVerified: true,
      preferences: { isNot: null },
    },
    include: {
      profile: true,
      preferences: true,
      selectedPublishers: {
        where: { isEnabled: true },
      },
    },
  });

  let matchesCreated = 0;

  for (const user of users) {
    const userSkills = extractUserSkills(user.profile?.resumeParsedJson);
    const selectedPublisherIds = new Set(
      user.selectedPublishers.map((s) => s.publisherId.toString()),
    );

  
    if (selectedPublisherIds.size === 0) continue;

    for (const job of jobs) {
     
      if (
        !job.jobPublisherId ||
        !selectedPublisherIds.has(job.jobPublisherId.toString())
      ) {
        continue;
      }

      const jobSkills = (job.skills as string[] | null) ?? [];

      const result = computeMatchScore({
        jobTitle: job.title,
        jobLocation: job.location,
        jobWorkMode: job.workMode,
        jobPostedAt: job.postedAt,
        jobSkills,

        userCurrentTitle: user.profile?.currentTitle ?? null,
        userLocation: user.profile?.location ?? null,
        userWorkMode: user.preferences?.workMode ?? null,
        userSkills,
      });

      if (result.score < MIN_SCORE) continue;

      await prisma.userJobMatch.upsert({
        where: { userId_jobId: { userId: user.id, jobId: job.id } },
        update: { matchScore: result.score },
        create: { userId: user.id, jobId: job.id, matchScore: result.score },
      });

      matchesCreated++;
    }
  }

  return {
    usersEvaluated: users.length,
    matchesCreated,
    matchesSkipped: jobs.length * users.length - matchesCreated,
  };
}
function extractUserSkills(parsedJson: unknown): string[] {
  if (!parsedJson || typeof parsedJson !== "object") return [];
  const skills = (parsedJson as any).skills;
  if (!Array.isArray(skills)) return [];
  return skills.filter((s): s is string => typeof s === "string");
}