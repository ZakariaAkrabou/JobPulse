"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiMapPin,
  FiCheck,
  FiArrowRight,
  FiAlertCircle,
  FiSliders,
  FiBriefcase,
  FiGlobe,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import ProgressBar from "./ProgressBar";

type JobType = "full_time" | "part_time" | "contract" | "internship" | "freelance";
type WorkMode = "remote" | "onsite" | "hybrid";
type DateRange = "h24" | "d7" | "d30" | "any";
type Currency = "MAD" | "USD" | "EUR";

interface PreferencesState {
  jobType: JobType;
  workMode: WorkMode;
  dateRange: DateRange;
  keywords: string;
  locationFilter: string;
  salaryMin: number;
  currency: Currency;
}

const JOB_TYPE_OPTIONS: { id: JobType; label: string }[] = [
  { id: "full_time", label: "Full-time" },
  { id: "part_time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
  { id: "freelance", label: "Freelance" },
];

const WORK_MODE_OPTIONS: { id: WorkMode; label: string }[] = [
  { id: "onsite", label: "Onsite" },
  { id: "hybrid", label: "Hybrid" },
  { id: "remote", label: "Remote" },
];

const DATE_RANGE_OPTIONS: { id: DateRange; label: string }[] = [
  { id: "h24", label: "Past 24h" },
  { id: "d7", label: "Past week" },
  { id: "d30", label: "Past month" },
  { id: "any", label: "Any time" },
];

const CURRENCIES: Currency[] = ["MAD", "USD", "EUR"];

export default function PreferencesForm() {
  const router = useRouter();

  // Form states with default values matching requirements
  const [formData, setFormData] = useState<PreferencesState>({
    jobType: "full_time",
    workMode: "onsite",
    dateRange: "d30",
    keywords: "backend developer",
    locationFilter: "Morocco",
    salaryMin: 8000,
    currency: "MAD",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // Fetch existing preferences on mount
  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      try {
        setIsLoading(true);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("access_token")
            : null;

        const res = await fetch("/api/user/preferences/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          const prefs = json?.data?.preferences;
          if (isMounted && prefs) {
            setFormData((prev) => ({
              ...prev,
              jobType: prefs.jobType || prev.jobType,
              workMode: prefs.workMode || prev.workMode,
              dateRange: prefs.dateRange || prev.dateRange,
              keywords: prefs.keywords || prev.keywords,
              locationFilter: prefs.locationFilter || prev.locationFilter,
              salaryMin: typeof prefs.salaryMin === "number" ? prefs.salaryMin : prev.salaryMin,
              currency: prefs.currency || prev.currency,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not pre-populate preferences:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPreferences();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setApiError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("access_token")
          : null;

      const payload = {
        jobType: formData.jobType,
        workMode: formData.workMode,
        dateRange: formData.dateRange,
        keywords: formData.keywords.trim(),
        locationFilter: formData.locationFilter.trim(),
        salaryMin: Number(formData.salaryMin) || 0,
        currency: formData.currency,
      };

      const res = await fetch("/api/user/preferences/set", {
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
        throw new Error(errorData.message || "Failed to save preferences. Please try again.");
      }

      setIsSuccess(true);

      setTimeout(() => {
        router.push("/client/dashboard");
      }, 700);
    } catch (err: any) {
      console.error("Preferences save error:", err);
      setApiError(err?.message || "Failed to save preferences.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push("/client/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* 3-segment progress indicator line */}
      <ProgressBar currentStep={3} totalSteps={3} className="max-w-2xl mx-auto mb-8" />

      {/* Wide 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context, Live Criteria Pill Cloud & Scanner Insight */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#6B6B72] mb-3 select-none">
              <span className="h-2 w-2 rounded-full bg-[#3F5D9E] animate-pulse-subtle" />
              <span>STEP 03 OF 03 · SCANNER TARGETING</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2B2F] tracking-tight leading-tight">
              Fine-tune your hourly job matches.
            </h1>

            <p className="mt-3 text-sm text-[#6B6B72] leading-relaxed">
              We monitor Indeed, LinkedIn, Adzuna, and Remotive every 60 minutes.
              Your preferences define when an email alert is triggered.
            </p>
          </div>

          {/* Live Scanner Match Summary Card */}
          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FAF9F6] p-5 sm:p-6 transition-all hover:border-[#D8D2C4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
              <span className="font-mono text-xs font-semibold text-[#2A2B2F] uppercase tracking-wider flex items-center gap-2">
                <FiSliders className="w-3.5 h-3.5 text-[#3F5D9E]" />
                Live Target Profile
              </span>
              <span className="font-mono text-[11px] text-[#4C9A78] font-medium bg-[#E6F2EC] px-2 py-0.5 rounded-full">
                Active Scanner
              </span>
            </div>

            {/* Dynamic summary pill tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#FFFFFF] border border-[#E5E1D8] text-[#2A2B2F]">
                <FiSearch className="w-3 h-3 text-[#3F5D9E]" />
                {formData.keywords || "Any role"}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#FFFFFF] border border-[#E5E1D8] text-[#2A2B2F]">
                <FiMapPin className="w-3 h-3 text-[#3F5D9E]" />
                {formData.locationFilter || "Any location"}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#E7ECF7] border border-[#3F5D9E]/20 text-[#3F5D9E] font-medium capitalize">
                <FiGlobe className="w-3 h-3" />
                {formData.workMode}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#FFFFFF] border border-[#E5E1D8] text-[#2A2B2F] capitalize">
                <FiBriefcase className="w-3 h-3 text-[#6B6B72]" />
                {formData.jobType.replace("_", " ")}
              </span>

              {formData.salaryMin > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#FFFFFF] border border-[#E5E1D8] text-[#2A2B2F]">
                  <FiDollarSign className="w-3 h-3 text-[#4C9A78]" />
                  &ge; {formData.salaryMin.toLocaleString()} {formData.currency}
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#FFFFFF] border border-[#E5E1D8] text-[#6B6B72]">
                <FiClock className="w-3 h-3" />
                {formData.dateRange === "h24"
                  ? "Past 24h"
                  : formData.dateRange === "d7"
                  ? "Past 7 days"
                  : formData.dateRange === "d30"
                  ? "Past 30 days"
                  : "Any time"}
              </span>
            </div>

            {/* Monitored sources strip */}
            <div className="mt-5 pt-3 border-t border-[#E5E1D8] flex items-center justify-between text-[11px] font-mono text-[#949499]">
              <span>Sources: Indeed · LinkedIn · Remotive · Adzuna</span>
              <span className="text-[#3F5D9E] font-medium">100% Automated</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive, Low-Scroll Preferences Controls */}
        <div className="lg:col-span-7">
          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors hover:border-[#D8D2C4]">
            {isLoading ? (
              <div className="space-y-4 py-8 animate-pulse">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-11 bg-[#FAF9F6] border border-[#E5E1D8] rounded-lg" />
                  <div className="h-11 bg-[#FAF9F6] border border-[#E5E1D8] rounded-lg" />
                </div>
                <div className="h-24 bg-[#FAF9F6] border border-[#E5E1D8] rounded-lg" />
                <div className="h-11 bg-[#F2EFE9] rounded-lg" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Banner */}
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

                {/* Section 1: Role & Location (2-col grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="keywords"
                      className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                    >
                      Target Role / Tech Stack
                    </label>
                    <div className="relative">
                      <input
                        id="keywords"
                        type="text"
                        value={formData.keywords}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, keywords: e.target.value }))
                        }
                        placeholder="e.g. backend developer"
                        className="w-full h-10.5 pl-3.5 pr-9 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                      />
                      <FiSearch
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="locationFilter"
                      className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                    >
                      Location Filter
                    </label>
                    <div className="relative">
                      <input
                        id="locationFilter"
                        type="text"
                        value={formData.locationFilter}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            locationFilter: e.target.value,
                          }))
                        }
                        placeholder="e.g. Morocco or Remote"
                        className="w-full h-10.5 pl-3.5 pr-9 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                      />
                      <FiMapPin
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick location chips directly below */}
                <div className="flex flex-wrap items-center gap-1.5 -mt-2">
                  <span className="text-[11px] font-mono text-[#949499]">Quick pick:</span>
                  {["Morocco", "Casablanca", "Rabat", "Remote", "Worldwide"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, locationFilter: chip }))
                      }
                      className="px-2 py-0.5 rounded text-[11px] font-mono border border-[#E5E1D8] bg-[#FAF9F6] text-[#6B6B72] hover:bg-[#F2EFE9] hover:text-[#2A2B2F] hover:border-[#D8D2C4] transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Section 2: Work Mode & Job Type */}
                <div className="pt-2 border-t border-[#E5E1D8]/80 space-y-4">
                  {/* Work Mode */}
                  <div>
                    <label className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5">
                      Work Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {WORK_MODE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, workMode: opt.id }))
                          }
                          className={`h-9.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                            formData.workMode === opt.id
                              ? "bg-[#3F5D9E] text-white border-[#3F5D9E] shadow-xs"
                              : "bg-[#FAF9F6] text-[#6B6B72] border-[#E5E1D8] hover:bg-[#F2EFE9] hover:text-[#2A2B2F]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5">
                      Employment Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {JOB_TYPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, jobType: opt.id }))
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                            formData.jobType === opt.id
                              ? "bg-[#3F5D9E] text-white border-[#3F5D9E] shadow-xs"
                              : "bg-[#FAF9F6] text-[#6B6B72] border-[#E5E1D8] hover:bg-[#F2EFE9] hover:text-[#2A2B2F]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Salary & Date Freshness */}
                <div className="pt-3 border-t border-[#E5E1D8]/80 space-y-4">
                  {/* Minimum Salary with Segmented Currency Switcher */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="salaryMin"
                        className="block font-mono text-xs text-[#2A2B2F] font-medium"
                      >
                        Minimum Desired Salary
                      </label>
                      {/* Segmented Currency Switcher */}
                      <div className="inline-flex items-center p-0.5 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8]">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, currency: c }))
                            }
                            className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-md transition-all cursor-pointer ${
                              formData.currency === c
                                ? "bg-[#3F5D9E] text-white shadow-xs"
                                : "text-[#6B6B72] hover:text-[#2A2B2F]"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Numeric Input with Currency Tag on left */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="font-mono text-xs font-semibold text-[#6B6B72] bg-[#E5E1D8]/50 px-1.5 py-0.5 rounded">
                          {formData.currency}
                        </span>
                      </div>
                      <input
                        id="salaryMin"
                        type="number"
                        min={0}
                        step={500}
                        value={formData.salaryMin || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            salaryMin: Number(e.target.value) || 0,
                          }))
                        }
                        placeholder="8000"
                        className="w-full h-10.5 pl-16 pr-4 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm font-mono font-medium text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                      />
                    </div>

                    {/* Quick Salary Presets based on Currency */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-mono text-[#949499]">Quick presets:</span>
                      {(formData.currency === "MAD"
                        ? [5000, 8000, 12000, 15000, 20000]
                        : [2000, 3500, 5000, 7500, 10000]
                      ).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, salaryMin: val }))
                          }
                          className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                            formData.salaryMin === val
                              ? "bg-[#E7ECF7] border-[#3F5D9E] text-[#3F5D9E] font-medium"
                              : "border-[#E5E1D8] bg-[#FAF9F6] text-[#6B6B72] hover:bg-[#F2EFE9] hover:text-[#2A2B2F]"
                          }`}
                        >
                          {val.toLocaleString()} {formData.currency}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Posting Date Horizon */}
                  <div>
                    <label className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5">
                      Posting Date Range
                    </label>
                    {/* Modern Segmented Track Switcher */}
                    <div className="p-1 rounded-xl bg-[#FAF9F6] border border-[#E5E1D8] grid grid-cols-2 sm:grid-cols-4 gap-1">
                      {DATE_RANGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, dateRange: opt.id }))
                          }
                          className={`h-9 px-2 rounded-lg text-xs font-mono font-medium transition-all text-center flex items-center justify-center cursor-pointer ${
                            formData.dateRange === opt.id
                              ? "bg-[#FFFFFF] text-[#2A2B2F] border border-[#E5E1D8] shadow-xs font-semibold"
                              : "text-[#6B6B72] hover:text-[#2A2B2F]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions: Save & Complete + Skip Link */}
                <div className="pt-4 border-t border-[#E5E1D8] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={isSubmitting || isSuccess}
                    className="order-2 sm:order-1 font-mono text-xs text-[#6B6B72] hover:text-[#2A2B2F] hover:underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Skip for now &rarr;
                  </button>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="order-1 sm:order-2 w-full sm:w-auto h-11 px-7 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <span>Saving preferences...</span>
                    ) : isSuccess ? (
                      <>
                        <FiCheck className="w-4 h-4 text-emerald-300" />
                        <span>Preferences Saved!</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { PreferencesForm };
