import type { ScoringInput, ScoringResult } from '../../dto/ScoreDto';




function computeTitleSimilarity(
  jobTitle: string,
  userTitle: string | null,
): number {
  if (!userTitle || !jobTitle) return 0;

  const jobWords = tokenize(jobTitle);
  const userWords = tokenize(userTitle);
  if (jobWords.length === 0 || userWords.length === 0) return 0;

  const jobSet = new Set(jobWords);
  const userSet = new Set(userWords);

  let matches = 0;
  for (const word of jobSet) {
    if (userSet.has(word)) matches++;
  }


  const unionSize = new Set([...jobSet, ...userSet]).size;
  return unionSize === 0 ? 0 : matches / unionSize;
}

function computeLocationMatch(
  jobLocation: string | null,
  jobWorkMode: string | null,
  userLocation: string | null,
  userWorkMode: string | null,
): number {

  if (userWorkMode === "remote" && jobWorkMode === "remote") return 1;


  if (userWorkMode === "remote" && jobWorkMode !== "remote") return 0;


  if (jobWorkMode === "remote") return 0.5;


  if (!userLocation || !jobLocation) return 0;
  const job = jobLocation.toLowerCase().trim();
  const user = userLocation.toLowerCase().trim();

  if (job === user) return 1;
  if (job.includes(user) || user.includes(job)) return 0.7;
  return 0;
}

function computeRecency(postedAt: Date | null): number {
  if (!postedAt) return 0.5;
  const ageMs = Date.now() - postedAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays <= 1) return 1.0;
  if (ageDays <= 7) return 0.8;
  if (ageDays <= 30) return 0.5;
  if (ageDays <= 90) return 0.2;
  return 0;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
}

function computeSkillOverlap(userSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 0;
  if (userSkills.length === 0) return 0;

  const userSet = new Set(userSkills.map((s) => s.toLowerCase().trim()));
  let matches = 0;

  for (const skill of jobSkills) {
    if (userSet.has(skill.toLowerCase().trim())) {
      matches++;
    }
  }

  return matches / jobSkills.length;
}

export function computeMatchScore(input: ScoringInput): ScoringResult {
  const skillOverlap = computeSkillOverlap(input.userSkills, input.jobSkills);
  const titleSimilarity = computeTitleSimilarity(input.jobTitle, input.userCurrentTitle);
  const locationMatch = computeLocationMatch(
    input.jobLocation,
    input.jobWorkMode,
    input.userLocation,
    input.userWorkMode,
  );
  const recency = computeRecency(input.jobPostedAt);

  const score =
    0.50 * skillOverlap +
    0.20 * titleSimilarity +
    0.15 * locationMatch +
    0.15 * recency;

  return {
    score: Math.min(1, Math.max(0, score)),
    breakdown: { skillOverlap, titleSimilarity, locationMatch, recency },
  };
}