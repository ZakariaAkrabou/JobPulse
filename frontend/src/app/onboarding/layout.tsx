"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/src/components/layout/header";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const safePath = pathname || "";

  // Determine current step index from route
  const getStepNumber = () => {
    if (safePath.includes("/onboarding/resume")) return 2;
    if (safePath.includes("/onboarding/preferences")) return 3;
    return 1; // Default to step 1 (profile)
  };

  const currentStep = getStepNumber();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const hasLocalStorageToken =
          typeof window !== "undefined" &&
          (localStorage.getItem("token") ||
            localStorage.getItem("access_token") ||
            localStorage.getItem("user"));

        const hasCookieToken =
          typeof document !== "undefined" &&
          document.cookie.includes("access_token");

        const authed = Boolean(hasLocalStorageToken || hasCookieToken);
        const isDev = process.env.NODE_ENV === "development";
        const allowed = authed || isDev;

        if (!allowed) {
          router.replace(`/login?redirect=${encodeURIComponent(safePath)}`);
          return;
        }

        // If visiting root /onboarding, redirect to profile step
        if (safePath === "/onboarding" || safePath === "/onboarding/") {
          router.replace("/onboarding/profile");
        }

        // NOTE: Incomplete profiles are intentionally kept here to complete onboarding.
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [safePath, router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#2A2B2F]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-full border-2 border-[#3F5D9E] border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-[#6B6B72]">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2A2B2F]">
      {/* Same Header as across all pages for 100% identical logo alignment */}
      <Header />

      {/* Thin animated top progress bar track directly beneath the Header */}
      <div className="w-full bg-[#E5E1D8] h-0.5 relative overflow-hidden">
        <div
          className="h-full bg-[#3F5D9E] transition-all duration-500 ease-out"
          style={{ width: `${Math.round((currentStep / 3) * 100)}%` }}
        />
      </div>

      {/* Main Onboarding Step Container */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-285 mx-auto flex flex-col items-center">
          {children}
        </div>
      </main>
    </div>
  );
}
