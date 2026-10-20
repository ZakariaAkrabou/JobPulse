export interface ScoringInput {
  jobTitle: string;
  jobLocation: string | null;
  jobWorkMode: string | null;
  jobPostedAt: Date | null;
  jobSkills: string[];        

  userCurrentTitle: string | null;
  userLocation: string | null;
  userWorkMode: string | null;
  userSkills: string[];      
}

export interface ScoringResult {
  score: number;
  breakdown: {
    titleSimilarity: number;
    skillOverlap: number;
    locationMatch: number;
    recency: number;
  };
}

export interface MatchRunResult {
  usersEvaluated: number;
  matchesCreated: number;
  matchesSkipped: number;
}
