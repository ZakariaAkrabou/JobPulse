import React from "react";

export interface ScoreChipProps {
  level: "high" | "mid" | "low";
  score: number;
}

export function ScoreChip({ level, score }: ScoreChipProps) {
  if (level === "low") return null;

  const isHigh = level === "high";

  return (
    <span
      role="status"
      aria-label={`${score} percent match`}
      className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded-[10px] select-none ${
        isHigh
          ? "bg-[#E6F2EC] text-[#4C9A78] border border-[#4C9A78]/25"
          : "bg-[#FFF4E5] text-[#A86D2C] border border-[#A86D2C]/25"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          isHigh ? "bg-[#4C9A78]" : "bg-[#A86D2C]"
        }`}
      />
      <span>{score}% fit</span>
    </span>
  );
}

export default ScoreChip;
