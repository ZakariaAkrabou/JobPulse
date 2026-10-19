import { prisma } from "../../config/database.js";
import {fetchJobsFromJSearch} from "./adapters/jsearch.adapter.js";
import type { FetchParams } from "../../dto/JsearchDto"
import { persistJobs, type PersistResult } from "./persist.js";
import { runMatchingForJobs } from "../match/match.service.js";


export interface FetchResult extends PersistResult {
  matchesCreated: number;
  usersEvaluated: number;
}

export async function runJSearchFetch(
  params: FetchParams,
): Promise<FetchResult> {
  const jobApi = await prisma.jobApi.findUnique({
    where: { code: "jsearch" },
  });

  if (!jobApi) throw new Error("JSearch API row not found. Did you run the seed?");
  if (!jobApi.isActive) throw new Error("JSearch API is deactivated");

  const normalized = await fetchJobsFromJSearch(params);
  const persistResult = await persistJobs(jobApi.id, normalized);

  const matchResult = await runMatchingForJobs(persistResult.insertedJobIds);

  return {
    ...persistResult,
    matchesCreated: matchResult.matchesCreated,
    usersEvaluated: matchResult.usersEvaluated,
  };
}