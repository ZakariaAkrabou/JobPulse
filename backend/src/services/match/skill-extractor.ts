import { SKILLS_DICTIONARY } from "./skills-dictionary.js";

export function extractSkills(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const skill of SKILLS_DICTIONARY) {
    const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
    if (regex.test(lower)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}