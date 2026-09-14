"use client";

import React from "react";
import ScrollReveal from "@/src/components/ui/ScrollReveal";

export function Quote() {
  return (
    <section className="py-24 border-b border-[#E5E1D8]">
      <div className="mx-auto max-w-285 px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
            {/* Left: Mono Kicker */}
            <div className="md:col-span-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72]">
                FROM A USER
              </span>
            </div>

           
            <div className="md:col-span-8">
              <div className="w-12 h-px bg-[#E5E1D8] mb-6" aria-hidden="true" />
              <blockquote className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-snug text-[#2A2B2F] max-w-[26ch]">
                &quot;I uploaded my resume in October, forgot about it, and received three emails over two months. One was Doctolib.&quot;
              </blockquote>
              <figcaption className="mt-6 font-mono text-xs text-[#6B6B72]">
                <strong className="font-medium text-[#2A2B2F]">Sarah K.</strong> · Frontend engineer, hired at Doctolib through jobPulse
              </figcaption>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default Quote;
