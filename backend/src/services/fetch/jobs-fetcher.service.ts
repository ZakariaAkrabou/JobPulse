import { prisma } from "../../config/database.js";
import {fetchJobsFromJSearch} from "./adapters/jsearch.adapter.js";
import type { FetchParams } from "../../dto/JsearchDto"
import { persistJobs, type PersistResult } from "./persist.js";

export async function runJSearchFetch(
  params: FetchParams,
): Promise<PersistResult> {

  const jobApi = await prisma.jobApi.findUnique({
    where: { code: "jsearch" },
  });

  if (!jobApi) {
    throw new Error(
      "JSearch API row not found in job_apis. Did you run the seed?",
    );
  }

  if (!jobApi.isActive) {
    throw new Error("JSearch API is deactivated");
  }


  const normalized = await fetchJobsFromJSearch(params);


  const result = await persistJobs(jobApi.id, normalized);

  return result;
}