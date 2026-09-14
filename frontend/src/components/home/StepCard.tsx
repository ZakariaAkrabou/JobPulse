"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StepCardProps {
  number: string;
  title: string;
  body: React.ReactNode;
  isLast?: boolean;
}

export function StepCard({ number, title, body, isLast = false }: StepCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`flex flex-col justify-between p-6 sm:p-8 bg-[#FAF9F6] transition-colors duration-150 hover:bg-[#F2EFE9] cursor-pointer ${
        !isLast ? "border-b md:border-b-0 md:border-r border-[#E5E1D8]" : ""
      }`}
    >
      <div>

        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm font-medium text-[#6B6B72]">
            {number}
          </span>
          <div className="h-px flex-1 bg-[#E5E1D8]" />
        </div>

        <h3 className="font-serif text-2xl text-[#2A2B2F] mb-3">
          {title}
        </h3>

        <div className="text-sm leading-relaxed text-[#6B6B72] max-w-[32ch]">
          {body}
        </div>
      </div>
    </motion.div>
  );
}

export default StepCard;
