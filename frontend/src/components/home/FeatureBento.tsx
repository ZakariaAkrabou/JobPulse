"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import ToggleChips from "./ToggleChips";
import NotificationMock from "./NotificationMock";
import ScrollReveal from "@/src/components/ui/ScrollReveal";

export function FeatureBento() {
  const notificationChips = [
    { label: "Email · instant", active: true },
    { label: "Push", active: false },
    { label: "In-app", active: false },
    { label: "Weekly digest", active: true },
    { label: "Auto-fetch ON", active: true },
  ];

  return (
    <section id="features" className="py-24 border-b border-[#E5E1D8]">
      <div className="mx-auto max-w-285 px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeader
            kicker="THE ENGINE"
            preAccent="A quiet tool that"
            accentWord="works"
            postAccent="while you sleep."
          />
        </ScrollReveal>

     
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
          <ScrollReveal className="lg:col-span-7 flex flex-col" delay={0.1}>
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex-1 flex flex-col justify-between rounded-[14px] border border-[#E5E1D8] bg-[#FAF9F6] p-6 sm:p-8 transition-colors hover:border-[#3F5D9E]/40 cursor-pointer"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72]">
                  CONTROL
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2A2B2F] mt-2 mb-3">
                  Notifications you set, not us.
                </h3>
                <p className="text-sm leading-relaxed text-[#6B6B72] max-w-xl">
                  Decide how and when we contact you. Instant email alerts trigger only for high-scoring matches, while weekly summaries catch everything else. We built no unread counters, no push nags, and no engagement loops.
                </p>

             
                <div className="mt-5">
                  <ToggleChips items={notificationChips} />
                </div>
              </div>

              
              <NotificationMock />
            </motion.div>
          </ScrollReveal>

         
          <div className="lg:col-span-5 flex flex-col gap-6">
          
            <ScrollReveal delay={0.2} className="flex-1 flex flex-col">
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex-1 rounded-[14px] border border-[#E5E1D8] bg-[#FAF9F6] p-6 sm:p-7 transition-colors hover:border-[#3F5D9E]/40 cursor-pointer"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72]">
                  INTEGRATIONS
                </span>
                <h3 className="font-serif text-2xl text-[#2A2B2F] mt-2 mb-3">
                  Built on real APIs.
                </h3>
                <p className="text-sm leading-relaxed text-[#6B6B72]">
                  We ingest roles through verified API endpoints and structured platform partnerships. We do not use fragile web scrapers that fail on DOM updates or deliver dead job links.
                </p>
              </motion.div>
            </ScrollReveal>

     
            <ScrollReveal delay={0.3} className="flex-1 flex flex-col">
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex-1 rounded-[14px] border border-[#E5E1D8] bg-[#FAF9F6] p-6 sm:p-7 transition-colors hover:border-[#3F5D9E]/40 cursor-pointer"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72]">
                  PRIVACY
                </span>
                <h3 className="font-serif text-2xl text-[#2A2B2F] mt-2 mb-3">
                  Your data stays yours.
                </h3>
                <p className="text-sm leading-relaxed text-[#6B6B72]">
                  Your resume text is encrypted with AES-256 and used only for semantic role matching. Deleting your account initiates immediate cascade deletion across all databases.
                </p>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureBento;
