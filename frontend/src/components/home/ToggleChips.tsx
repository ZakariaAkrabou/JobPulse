import React from "react";

export interface ChipItem {
  label: string;
  active: boolean;
}

export function ToggleChips({ items }: { items: ChipItem[] }) {
  return (
    <div className="flex flex-wrap gap-2 pt-2" role="group" aria-label="Notification channels">
      {items.map((item) => (
        <span
          key={item.label}
          className={`inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-[10px] select-none border transition-colors cursor-pointer hover:border-[#3F5D9E]/40 ${
            item.active
              ? "bg-[#E7ECF7] text-[#3F5D9E] border-[#3F5D9E]/30 font-medium"
              : "bg-[#F2EFE9] text-[#6B6B72] border-[#E5E1D8]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              item.active ? "bg-[#3F5D9E]" : "bg-[#949499]"
            }`}
            aria-hidden="true"
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export default ToggleChips;
