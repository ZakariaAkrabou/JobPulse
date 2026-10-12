import axios from "axios";
import env from "../../../config/env";
import type { JSearchJob, JSearchResponse } from "./jsearch.types";
import type { FetchParams } from "../../../dto/JsearchDto";
import type { NormalizedJob } from "../normalized";


export async function fetchJobsFromJSearch(params: FetchParams): Promise<NormalizedJob[]> {

    const host = env.JSEARCH_HOST;

    const url = `https://${host}/search-v2`;

    const response = await axios.get<JSearchResponse>(url, {
        params: {
            query: params.query,
            page: params.page ?? 1,
            num_pages: params.numPages ?? 1,
            date_posted: params.datePosted ?? "week",
            country: params.country,
            language: params.language,
            work_from_home: params.workFromHome,
            employment_types: params.employmentTypes,
            job_requirements: params.jobRequirements,
            radius: params.radius,
            exclude_job_publishers: params.excludeJobPublishers,
        },

        headers: {
            "X-RapidAPI-Key": env.JSEARCH_KEY,
            "X-RapidAPI-Host": host,
        },
    });

    if(response.data.status !== "OK") {
        throw new Error(`JSearch API error: ${response.data.status} "for query: ${params.query}"`);
    }

    return response.data.data.jobs.map(normalizeJSearchJob);

}

function normalizeJSearchJob(job: JSearchJob): NormalizedJob {

    return {
        externalId: job.job_id,
    publisherName: job.job_publisher,

    title: job.job_title,
    company: job.employer_name,
    location: buildLocation(job),
    description: job.job_description,
    url: job.job_apply_link ?? "",

    salaryMin: job.job_min_salary,
    salaryMax: job.job_max_salary,
    currency: job.job_salary_currency,

    jobType: normalizeEmploymentType(job.job_employment_type),
    workMode: job.job_is_remote ? "remote" : null,

    postedAt: job.job_posted_at_timestamp
      ? new Date(job.job_posted_at_timestamp * 1000)
      : null,
    };
}

function buildLocation(job: JSearchJob): string | null {
  const parts = [job.job_city, job.job_state, job.job_country].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );
  return parts.length > 0 ? parts.join(", ") : null;
}

function normalizeEmploymentType(type: string | null): string | null {
  if (!type) return null;
  const map: Record<string, string> = {
    FULLTIME: "full_time",
    PARTTIME: "part_time",
    CONTRACTOR: "contract",
    INTERN: "internship",
  };
  return map[type] ?? type.toLowerCase();
}