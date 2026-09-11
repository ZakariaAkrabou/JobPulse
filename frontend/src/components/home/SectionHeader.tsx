import React from "react";

export interface SectionHeaderProps {
  kicker: string;
  preAccent: string;
  accentWord: string;
  postAccent?: string;
  className?: string;
}

export function SectionHeader({
  kicker,
  preAccent,
  accentWord,
  postAccent,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline pb-10 sm:pb-12 ${className}`}
    >
      <div className="md:col-span-4">
        <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72]">
          {kicker}
        </span>
      </div>

      <div className="md:col-span-8">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#2A2B2F]">
          {preAccent}{" "}
          <span className="italic text-[#3F5D9E]">{accentWord}</span>
          {postAccent ? ` ${postAccent}` : ""}
        </h2>
      </div>
    </div>
  );
}

export default SectionHeader;
