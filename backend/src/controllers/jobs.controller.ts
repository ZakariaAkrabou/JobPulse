import type { Request, Response } from "express";
import { getAuthUser } from "../types/auth.js";
import { runJSearchFetch } from "../services/fetch/jobs-fetcher.service.js";
import type { FetchParams } from "../dto/JsearchDto.js"

export async function manualFetch(req: Request, res: Response) {

  const { userId } = getAuthUser(req);


  const query =
    typeof req.query.query === "string" && req.query.query.length > 0
      ? req.query.query
      : "developer jobs";

  const country =
    typeof req.query.country === "string" ? req.query.country : undefined;

  const datePostedRaw =
    typeof req.query.datePosted === "string" ? req.query.datePosted : "week";

  const validDateRanges = ["all", "today", "3days", "week", "month"] as const;
  type DateRange = (typeof validDateRanges)[number];

  const datePosted: DateRange = (validDateRanges as readonly string[]).includes(datePostedRaw)
    ? (datePostedRaw as DateRange)
    : "week";

  const params: FetchParams = {
    query,
    country,
    datePosted,
    numPages: 1,
  };

  const result = await runJSearchFetch(params);

  return res.status(200).json({
    success: true,
    message: `Fetched ${result.fetched}, inserted ${result.inserted}, created ${result.matchesCreated} matches`,
    data: {
      fetched: result.fetched,
      inserted: result.inserted,
      skipped: result.skipped,
      newPublishers: result.newPublishers,
      matchesCreated: result.matchesCreated,
      usersEvaluated: result.usersEvaluated,
      requestedBy: userId,
      query,
      country: country ?? null,
      datePosted,
    },
  });
}