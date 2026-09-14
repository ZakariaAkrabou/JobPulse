"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import PreviewCard from "./PreviewCard";

export function Hero() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email format.");
      return;
    }

    setError("");
    router.push(`/register?email=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-[#E5E1D8]">
      <div className="mx-auto max-w-285 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
         
          <div className="lg:col-span-7 flex flex-col items-start">
           
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#6B6B72] mb-6 select-none">
              <span
                className="h-2 w-2 rounded-full bg-[#4C9A78] animate-pulse-subtle"
                aria-hidden="true"
              />
              <span>Watching 847 open roles right now</span>
            </div>

            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-tight text-[#2A2B2F] text-left">
              Stop checking job boards.{" "}
              <br className="hidden sm:inline" />
              Start{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="italic text-[#3F5D9E] relative z-10">seeing</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 140 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -bottom-1 left-0 w-full h-3 text-[#E8B894] z-0 pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 12C35 4 85 3 138 10C100 15 45 16 12 14"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>{" "}
              them.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#6B6B72] max-w-[46ch] leading-relaxed">
              Upload your resume once. We scan Indeed, LinkedIn, Adzuna, and Remotive every hour and send an email only when a role actually fits.
            </p>

            
            <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <label htmlFor="hero-email" className="sr-only">
                    Work or personal email
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your email"
                    aria-describedby="hero-microcopy hero-error"
                    aria-invalid={Boolean(error)}
                    className={`w-full h-11 px-3.5 rounded-lg bg-white border text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors ${
                      error ? "border-[#D97575]" : "border-[#E5E1D8] hover:border-[#D8D2C4]"
                    }`}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="h-11 px-6 text-sm font-medium shrink-0 cursor-pointer"
                >
                  Start free
                </Button>
              </div>

              {error && (
                <p id="hero-error" role="alert" className="mt-1.5 font-mono text-xs text-[#D97575]">
                  {error}
                </p>
              )}

         
              <p id="hero-microcopy" className="mt-2.5 font-mono text-xs text-[#6B6B72]">
                No card · Beta, free until Jan 2026.
              </p>
            </form>
          </div>

     
          <div className="lg:col-span-5 w-full">
            <PreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
