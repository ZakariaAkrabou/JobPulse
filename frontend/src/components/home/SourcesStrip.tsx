"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/src/components/ui/ScrollReveal";

export function SourcesStrip() {
  const sources = [
    { name: "Indeed", type: "Career Feed" },
    { name: "LinkedIn", type: "Corporate Network" },
    { name: "Adzuna", type: "Aggregated APIs" },
    { name: "Remotive", type: "Remote-First" },
    { name: "RemoteOK", type: "Tech Roles" },
  ];

  return (
    <section
      id="sources"
      aria-label="Supported Job Sources"
      className="w-full border-y border-[#E5E1D8] bg-[#F2EFE9] py-5 transition-colors"
    >
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left Kicker */}
            <div className="shrink-0 flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72]">
                PULLS FROM 5 PLATFORMS:
              </span>
            </div>

            {/* Platform Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              {sources.map((source) => (
                <motion.div
                  key={source.name}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#FAF9F6] border border-[#E5E1D8] hover:border-[#3F5D9E]/50 text-xs font-medium text-[#2A2B2F] shadow-none transition-colors cursor-pointer select-none"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[#3F5D9E]"
                  />
                  <span>{source.name}</span>
                  <span className="font-mono text-[10px] text-[#949499] hidden sm:inline">
                    · {source.type}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Right Trust Signal */}
            <div className="shrink-0 font-mono text-xs text-[#6B6B72] flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#4C9A78] animate-pulse-subtle"
              />
              <span>Live official APIs · hourly scan</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default SourcesStrip;
