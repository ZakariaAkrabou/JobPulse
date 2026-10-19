import { prisma } from "../../config/database";
import type { ListMatchesParams } from "../../dto/matchesDto";


export async function listMatchesForUser(params: ListMatchesParams) {

    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const minScore = params.minScore ?? 0;
    const skip = (page - 1) * limit;


    const selections = await prisma.userSelectedPublisher.findMany({

        where: { userId: params.userId, isEnabled: true },
        select: { publisherId: true }
    });

    const selectedPublisherIds = selections.map((s) => s.publisherId);

    if (selectedPublisherIds.length === 0) {
        return { matches: [], totalMatches: 0, page, limit };
    }

    const preferences = await prisma.userJobPreferences.findUnique({
        where: { userId: params.userId },
    });

    const dateFilter = buildDateFilter(preferences?.dateRange ?? "any");

    const where = {
        userId: params.userId,
        isDismissed: false,
        matchScore: { gte: minScore },
        job: {
            jobPublisherId: { in: selectedPublisherIds },
            ...(dateFilter ? { postedAt: dateFilter } : {}),
        },
    };

    const [matches, total] = await Promise.all([
        prisma.userJobMatch.findMany({
            where,
            include: { job: { include: { jobPublisher: true } } },
            orderBy: [{ matchScore: "desc" }, { createdAt: "desc" }],
            skip,
            take: limit,
        }),
        prisma.userJobMatch.count({ where }),
    ]);

    return {
    matches: matches.map((m) => ({
      id: m.id.toString(),
      matchScore: m.matchScore,
      isSaved: m.isSaved,
      isDismissed: m.isDismissed,
      createdAt: m.createdAt,
      job: {
        id: m.job.id.toString(),
        externalId: m.job.externalId,
        title: m.job.title,
        company: m.job.company,
        location: m.job.location,
        url: m.job.url,
        postedAt: m.job.postedAt,
        publisher: m.job.jobPublisher?.name ?? null,
      },
    })),
    total,
    page,
    limit,
  };
}

function buildDateFilter(range: string): { gte: Date } | null {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  switch (range) {
    case "h24": return { gte: new Date(now - day) };
    case "d7":  return { gte: new Date(now - 7 * day) };
    case "d30": return { gte: new Date(now - 30 * day) };
    case "any":
    default:    return null;
  }
}
