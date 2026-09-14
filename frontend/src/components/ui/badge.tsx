import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "sky" | "teal" | "burgundy";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default:
      "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900",
    secondary:
      "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
    outline:
      "text-slate-950 border border-slate-200 dark:text-slate-50 dark:border-slate-800",
    sky: "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800",
    teal: "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800",
    burgundy:
      "bg-[#800020]/10 text-[#800020] dark:bg-[#800020]/25 dark:text-rose-200 border border-[#800020]/30 dark:border-rose-900/50",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
