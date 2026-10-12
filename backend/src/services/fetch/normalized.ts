export interface NormalizedJob {
  externalId: string;
  publisherName: string | null;

  title: string;
  company: string;
  location: string | null;
  description: string | null;
  url: string;

  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;

  jobType: string | null;
  workMode: string | null;

  postedAt: Date | null;
}