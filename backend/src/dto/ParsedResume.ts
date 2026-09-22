export interface ParsedResume {
  personal_info: {
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  work_experience: Array<{
    title: string;
    start_date: string | null;
    end_date: string | null;
    company: string;
    location: string | null;
    description: string | null;
  }>;
  education: Array<{
    title: string;
    start_date: string | null;
    end_date: string | null;
    institute: string;
    location: string | null;
    description: string | null;
  }>;
  languages: string[];
  skills: string[];
  certificates: string[];
}