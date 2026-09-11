import React from "react";
import ScoreChip from "./ScoreChip";

export function NotificationMock() {
  return (
    <div
      className="mt-6 rounded-[10px] border border-[#E5E1D8] bg-[#FFFFFF] p-3.5 shadow-none transition-colors hover:border-[#D8D2C4] cursor-pointer"
      aria-label="Sample match notification"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Avatar Block */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E1D8] bg-[#F2EFE9] font-mono text-xs font-semibold text-[#2A2B2F] select-none"
            aria-hidden="true"
          >
            ▲
          </div>

          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-medium text-[#2A2B2F]">
                Frontend Engineer at Vercel
              </span>
            </div>
            <p className="mt-0.5 font-mono text-xs text-[#949499]">
              2 minutes ago · via remotive
            </p>
          </div>
        </div>

        <ScoreChip level="high" score={92} />
      </div>
    </div>
  );
}

export default NotificationMock;
