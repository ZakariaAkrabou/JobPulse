import React from "react";
import ScoreChip, { ScoreChipProps } from "./ScoreChip";

export interface JobRowProps {
  title: string;
  company: string;
  location: string;
  source: "remotive" | "linkedin" | "indeed" | "adzuna" | "remoteok";
  age: string;
  matchScore: number;
  matchLevel: ScoreChipProps["level"];
  isLast?: boolean;
}

export function JobRow({
  title,
  company,
  location,
  source,
  age,
  matchScore,
  matchLevel,
  isLast = false,
}: JobRowProps) {
  return (
    <article
      tabIndex={0}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 transition-colors duration-150 hover:bg-[#F2EFE9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus-visible:ring-inset cursor-pointer ${
        !isLast ? "border-b border-[#E5E1D8]" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="text-sm font-medium text-[#2A2B2F] truncate group-hover:text-[#3F5D9E] transition-colors cursor-pointer">
            {title}
          </h4>
          <span className="font-mono text-xs text-[#949499]">
            · {source}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-[#6B6B72]">
          <span>{company}</span>
          <span className="text-[#949499]">/</span>
          <span>{location}</span>
          <span className="text-[#949499]">/</span>
          <span className="text-[#949499]">{age}</span>
        </div>
      </div>

      <div className="shrink-0 sm:self-center">
        <ScoreChip level={matchLevel} score={matchScore} />
      </div>
    </article>
  );
}

export default JobRow;
