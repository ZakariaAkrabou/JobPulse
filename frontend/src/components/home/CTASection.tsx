"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import ScrollReveal from "@/src/components/ui/ScrollReveal";

export function CTASection() {
  return (
    <section className="py-24 border-t border-[#E5E1D8]">
      <div className="mx-auto max-w-285 px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Left: Serif H2 with one italic accent */}
            <div className="max-w-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72] block mb-3">
                GET STARTED
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight text-[#2A2B2F]">
                Set it up in three minutes.{" "}
                <span className="italic text-[#3F5D9E]">Ignore</span> it forever.
              </h2>
            </div>

            {/* Right: Primary button + Ghost button */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/register" className="cursor-pointer">
                <Button size="lg" className="h-11 px-6 text-sm font-medium cursor-pointer">
                  Create account
                </Button>
              </Link>
              <Link href="#how" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-6 text-sm font-medium cursor-pointer"
                >
                  See a live demo
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default CTASection;
