"use client";

import React from "react";
import Header from "@/src/components/layout/header";
import Hero from "@/src/components/home/Hero";
import SourcesStrip from "@/src/components/home/SourcesStrip";
import HowItWorks from "@/src/components/home/HowItWorks";
import FeatureBento from "@/src/components/home/FeatureBento";
import Quote from "@/src/components/home/Quote";
import CTASection from "@/src/components/home/CTASection";
import Footer from "@/src/components/layout/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#2A2B2F]">
      <Header />
      <main className="flex-1">
        <Hero />
        <SourcesStrip />
        <HowItWorks />
        <FeatureBento />
        <Quote />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export { HomePage };
