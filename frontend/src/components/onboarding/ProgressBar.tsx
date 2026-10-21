"use client";

import React from "react";
import { cn } from "@/src/lib/utils";

export interface ProgressBarProps {
  currentStep: number; // 1, 2, or 3
  totalSteps?: number;
  className?: string;
}

const STEPS = [
  { step: 1, label: "Profile", sub: "Title & location" },
  { step: 2, label: "Resume", sub: "Upload CV" },
  { step: 3, label: "Preferences", sub: "Target feeds" },
];

export default function ProgressBar({
  currentStep = 1,
  totalSteps = 3,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn("w-full select-none mb-8", className)}>
      {/* 3-segment progress indicator line */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {STEPS.map((s) => {
          const isComplete = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <div key={s.step} className="flex flex-col">
              <div
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  isComplete && "bg-[#4C9A78]",
                  isCurrent && "bg-[#3F5D9E]",
                  !isComplete && !isCurrent && "bg-[#E5E1D8]"
                )}
              />
              <div className="flex items-center justify-between mt-2">
                <span
                  className={cn(
                    "font-mono text-[11px] font-medium transition-colors",
                    isCurrent && "text-[#3F5D9E] font-semibold",
                    isComplete && "text-[#4C9A78]",
                    !isComplete && !isCurrent && "text-[#949499]"
                  )}
                >
                  0{s.step} · {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ProgressBar };
