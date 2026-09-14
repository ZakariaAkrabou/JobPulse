"use client";

import React from "react";
import { motion } from "framer-motion";
import JobRow from "./JobRow";

export function PreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-all hover:border-[#3F5D9E]/30 cursor-pointer"
      aria-label="JobMatch Inbox Preview"
    >
    
      <div className="flex items-center justify-between border-b border-[#E5E1D8] bg-[#F2EFE9] px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
          <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
          <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
        </div>
        <div className="font-mono text-[11px] text-[#6B6B72] tracking-tight select-none">
          jobmatch.app / inbox
        </div>
        <div className="w-8" aria-hidden="true" />
      </div>

 
      <div className="flex items-baseline justify-between border-b border-[#E5E1D8] px-4 py-3 bg-[#FAF9F6]">
        <h3 className="font-serif text-lg text-[#2A2B2F]">Your inbox</h3>
        <span className="font-mono text-xs text-[#6B6B72]">
          3 new since 09:14
        </span>
      </div>

  
      <div className="divide-y divide-[#E5E1D8]">
        <JobRow
          title="Senior Frontend Engineer"
          company="Vercel"
          location="Remote"
          source="remotive"
          age="2h ago"
          matchScore={92}
          matchLevel="high"
        />
        <JobRow
          title="Product Systems Designer"
          company="Linear"
          location="Remote, US/EU"
          source="linkedin"
          age="4h ago"
          matchScore={88}
          matchLevel="high"
        />
        <div className="hidden md:block">
          <JobRow
            title="Full Stack Developer"
            company="Stripe"
            location="Hybrid, London"
            source="indeed"
            age="6h ago"
            matchScore={71}
            matchLevel="mid"
            isLast={true}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#E5E1D8] bg-[#FAF9F6] px-4 py-2.5 font-mono text-[11px] text-[#949499]">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[#4C9A78] animate-pulse-subtle"
          />
          <span className="text-[#6B6B72]">last scan 4m ago</span>
        </div>
        <span>next scan in 56m</span>
      </div>
    </motion.div>
  );
}

export default PreviewCard;
