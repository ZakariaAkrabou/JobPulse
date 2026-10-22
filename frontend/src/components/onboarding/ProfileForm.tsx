"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiBriefcase, FiMapPin, FiArrowRight, FiCheck, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import ProgressBar from "./ProgressBar";

interface ProfileData {
  currentTitle?: string;
  location?: string;
  fullName?: string;
}

export default function ProfileForm() {
  const router = useRouter();

  // Form states
  const [currentTitle, setCurrentTitle] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<{ title?: string; location?: string }>({});
  const [apiError, setApiError] = useState("");

  // Status states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch existing profile on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        setIsLoadingProfile(true);
        setApiError("");

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("access_token")
            : null;

        const res = await fetch("/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const profile: ProfileData | null =
            data?.data?.profile || data?.profile || null;

          if (isMounted && profile) {
            if (profile.currentTitle) setCurrentTitle(profile.currentTitle);
            if (profile.location) setLocation(profile.location);
          }
        }
      } catch (err) {
        console.warn("Could not pre-populate profile:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const validate = () => {
    const errs: { title?: string; location?: string } = {};

    if (!currentTitle.trim()) {
      errs.title = "Please enter your job title.";
    } else if (currentTitle.trim().length < 2) {
      errs.title = "Job title must be at least 2 characters.";
    }

    if (!location.trim()) {
      errs.location = "Please enter your city and country (or Remote).";
    } else if (location.trim().length < 2) {
      errs.location = "Location must be at least 2 characters.";
    }

    setError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setApiError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("access_token")
          : null;

      const payload = {
        currentTitle: currentTitle.trim(),
        location: location.trim(),
      };

      const res = await fetch("/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile. Please try again.");
      }

      setIsSaved(true);

      setTimeout(() => {
        router.push("/onboarding/resume");
      }, 600);
    } catch (err: any) {
      console.error("Profile save error:", err);
      setApiError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/resume");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-115 mx-auto"
    >
      {/* 3-segment progress indicator line */}
      <ProgressBar currentStep={1} totalSteps={3} />

      {/* Heading section */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2B2F] tracking-tight">
          Let&apos;s set up your profile.
        </h1>
        <p className="mt-2.5 text-sm text-[#6B6B72] leading-relaxed max-w-[36ch] mx-auto">
          Tell us your target role and location. We scan Indeed, LinkedIn, and Remotive to find roles that fit.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors hover:border-[#D8D2C4]">
        {isLoadingProfile ? (
          <div className="space-y-4 py-4 animate-pulse">
            <div>
              <div className="h-3.5 w-24 bg-[#F2EFE9] rounded mb-2" />
              <div className="h-11 w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-lg" />
            </div>
            <div>
              <div className="h-3.5 w-28 bg-[#F2EFE9] rounded mb-2" />
              <div className="h-11 w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-lg" />
            </div>
            <div className="h-11 w-full bg-[#F2EFE9] rounded-lg mt-6" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* API error alert */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-lg border border-[#D97575]/40 bg-[#FDF2F2] p-3 text-xs text-[#D97575] flex items-center gap-2"
                >
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{apiError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Field: currentTitle */}
            <div>
              <label
                htmlFor="currentTitle"
                className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
              >
                Job Title
              </label>
              <div className="relative">
                <input
                  id="currentTitle"
                  type="text"
                  value={currentTitle}
                  onChange={(e) => {
                    setCurrentTitle(e.target.value);
                    if (error.title) setError((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="e.g. Senior Frontend Engineer"
                  disabled={isSubmitting || isSaved}
                  className={`w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors ${error.title
                      ? "border-[#D97575]"
                      : "border-[#E5E1D8] hover:border-[#D8D2C4]"
                    }`}
                />
                <FiBriefcase
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              {error.title && (
                <p className="font-mono text-xs text-[#D97575] mt-1.5">{error.title}</p>
              )}
            </div>

            {/* Field: location */}
            <div>
              <label
                htmlFor="location"
                className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
              >
                Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (error.location) setError((prev) => ({ ...prev, location: undefined }));
                  }}
                  placeholder="e.g. Casablanca, Morocco or Remote"
                  disabled={isSubmitting || isSaved}
                  className={`w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors ${error.location
                      ? "border-[#D97575]"
                      : "border-[#E5E1D8] hover:border-[#D8D2C4]"
                    }`}
                />
                <FiMapPin
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {error.location && (
                <p className="font-mono text-xs text-[#D97575] mt-1.5">{error.location}</p>
              )}

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[11px] font-mono text-[#949499]">Suggestions:</span>
                {["Casablanca, Morocco", "Rabat, Morocco", "London, UK", "Paris, France"].map(
                  (chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setLocation(chip);
                        if (error.location) setError((prev) => ({ ...prev, location: undefined }));
                      }}
                      className="px-2 py-0.5 rounded text-[11px] font-mono border border-[#E5E1D8] bg-[#FAF9F6] text-[#6B6B72] hover:bg-[#F2EFE9] hover:text-[#2A2B2F] hover:border-[#D8D2C4] transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting || isSaved}
                className="w-full h-11 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : isSaved ? (
                  <>
                    <FiCheck className="w-4 h-4 text-emerald-300" />
                    <span>Saved! Continuing...</span>
                  </>
                ) : (
                  <>
                    <span>Save &amp; Continue</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting || isSaved}
                  className="font-mono text-xs text-[#6B6B72] hover:text-[#2A2B2F] hover:underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50"
                >
                  I&apos;ll do this later &rarr;
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export { ProfileForm };
