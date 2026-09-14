"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import StepCard from "./StepCard";
import ScrollReveal from "@/src/components/ui/ScrollReveal";

export function HowItWorks() {
  return (
    <section id="how" className="py-24 border-b border-[#E5E1D8]">
      <div className="mx-auto max-w-285 px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeader
            kicker="HOW IT WORKS"
            preAccent="Three steps. Then you can"
            accentWord="close"
            postAccent="the tab."
          />
        </ScrollReveal>

        
        <ScrollReveal delay={0.1}>
          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FAF9F6] overflow-hidden grid grid-cols-1 md:grid-cols-3 shadow-none">
            <StepCard
              number="01"
              title="Drop your resume"
              body={
                <p>
                  Upload your PDF or DOCX once. We extract your skills, target title, and experience. You can review and adjust anytime.
                </p>
              }
            />
            <StepCard
              number="02"
              title="Pick your sources"
              body={
                <p>
                  Toggle the boards you already check: Indeed, LinkedIn, Adzuna, and Remotive. Turn off any you do not need.
                </p>
              }
            />
            <StepCard
              number="03"
              title="Go do something else"
              isLast={true}
              body={
                <p>
                  Hourly scans run quietly. We send an email only when a role scores above your{" "}
                  <span className="inline-block font-mono text-xs bg-[#E7ECF7] text-[#3F5D9E] px-1.5 py-0.5 rounded-sm font-medium">
                    60%
                  </span>{" "}
                  fit threshold.
                </p>
              }
            />
          </div>
        </ScrollReveal>

        {/* Visual Engine Illustration Showcase */}
        <ScrollReveal delay={0.2} className="mt-8">
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-5 sm:p-8 transition-all hover:border-[#3F5D9E]/40 cursor-pointer overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-4 border-b border-[#E5E1D8]">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72]">
                  ENGINE ARCHITECTURE
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#2A2B2F] mt-1">
                  How resume data maps directly to live verified feeds
                </h4>
              </div>
              <span className="font-mono text-xs text-[#949499] shrink-0">
                Hourly automated pipeline
              </span>
            </div>

            <div className="relative w-full aspect-video rounded-[10px] overflow-hidden border border-[#E5E1D8] bg-[#FAF9F6]">
              <Image
                src="/images/resume-matching.jpg"
                alt="Diagram showing Candidate Resume parsing and matching against Verified Job Feeds from LinkedIn, Indeed, and Remotive"
                fill
                sizes="(max-width: 1140px) 100vw, 1140px"
                className="object-cover object-center"
                priority={false}
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs text-[#6B6B72]">
              <span>Resume skills & experience parsed once · matched semantically without keyword spam</span>
              <span className="text-[#3F5D9E] font-medium">92%+ accuracy threshold</span>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default HowItWorks;
