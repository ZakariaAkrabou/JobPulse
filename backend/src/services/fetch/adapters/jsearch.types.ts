export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  employer_website: string | null;

  job_publisher: string | null;
  job_employment_type: string | null;
  job_employment_types: string[] | null;

  job_apply_link: string | null;
  job_apply_is_direct: boolean | null;

  job_description: string | null;
  job_is_remote: boolean | null;
  job_posted_at_timestamp: number | null;

  job_city: string | null;
  job_state: string | null;
  job_country: string | null;

  job_salary_currency: string | null;
  job_salary_period: string | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
}

export interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: Record<string, unknown>;
  data: {
    jobs: JSearchJob[];
    cursor?: string | null;
  };
}