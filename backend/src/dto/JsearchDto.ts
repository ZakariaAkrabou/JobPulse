export interface FetchParams {
  query: string;
  page?: number;
  numPages?: number;
  datePosted?: "all" | "today" | "3days" | "week" | "month";
  country?: string;
  language?: string;
  workFromHome?: boolean;
  employmentTypes?: string;
  jobRequirements?: string;
  radius?: number;
  excludeJobPublishers?: string;
}