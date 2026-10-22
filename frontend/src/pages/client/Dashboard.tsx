"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiSliders,
  FiBookmark,
  FiExternalLink,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiRefreshCw,
  FiLayers,
  FiTrendingUp,
  FiActivity,
  FiEye,
  FiBriefcase,
} from "react-icons/fi";
import Header from "@/src/components/layout/header";
import Footer from "@/src/components/layout/footer";
import ScoreChip from "@/src/components/home/ScoreChip";
import { Button } from "@/src/components/ui/button";

interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLogoText: string;
  location: string;
  workMode: "Remote" | "Onsite" | "Hybrid";
  source: "linkedin" | "indeed" | "remotive" | "adzuna";
  salary: string;
  postedAge: string;
  matchScore: number;
  matchLevel: "high" | "mid";
  matchedSkills: string[];
  summary: string;
  description: string[];
  requirements: string[];
  applyUrl: string;
}

const SAMPLE_MATCHES: JobItem[] = [
  {
    id: "match-1",
    title: "Senior Backend Engineer (Node.js & Distributed Systems)",
    company: "Vercel",
    companyLogoText: "V",
    location: "Remote, Worldwide",
    workMode: "Remote",
    source: "remotive",
    salary: "16,000 - 22,000 MAD / mo",
    postedAge: "2h ago",
    matchScore: 96,
    matchLevel: "high",
    matchedSkills: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "Redis"],
    summary:
      "Design and scale serverless infrastructure, APIs, and edge functions servicing millions of requests per second.",
    description: [
      "Architect and scale resilient backend services handling mission-critical workloads.",
      "Collaborate with product and infrastructure teams to design high-throughput REST and gRPC endpoints.",
      "Optimize PostgreSQL queries, implement caching layers with Redis, and monitor telemetry.",
    ],
    requirements: [
      "4+ years of professional backend development with Node.js and TypeScript.",
      "Solid foundation in distributed database architecture, indexing, and connection pooling.",
      "Experience deploying containerized services with Docker & Kubernetes.",
    ],
    applyUrl: "https://remotive.com",
  },
  {
    id: "match-2",
    title: "Lead API & Cloud Architect",
    company: "Stripe",
    companyLogoText: "S",
    location: "Casablanca, Morocco",
    workMode: "Onsite",
    source: "linkedin",
    salary: "18,000 - 25,000 MAD / mo",
    postedAge: "4h ago",
    matchScore: 94,
    matchLevel: "high",
    matchedSkills: ["Backend Architecture", "Node.js", "PostgreSQL", "REST APIs", "AWS"],
    summary:
      "Drive payment platform integrations across EMEA. Lead architecture reviews, security auditing, and core transaction flows.",
    description: [
      "Own core banking gateway connections and high-volume billing pipelines.",
      "Ensure 99.999% uptime for transaction processing endpoints.",
      "Mentor mid-level engineers and drive internal documentation standards.",
    ],
    requirements: [
      "5+ years building and scaling enterprise backend applications.",
      "Hands-on experience with SQL optimization, ACID compliance, and secure auth flows.",
      "Based in or willing to work onsite in Casablanca.",
    ],
    applyUrl: "https://linkedin.com",
  },
  {
    id: "match-3",
    title: "Backend Platform Engineer",
    company: "Linear",
    companyLogoText: "L",
    location: "Remote, EMEA",
    workMode: "Remote",
    source: "remotive",
    salary: "15,000 - 19,000 MAD / mo",
    postedAge: "6h ago",
    matchScore: 91,
    matchLevel: "high",
    matchedSkills: ["TypeScript", "Node.js", "PostgreSQL", "WebSockets", "GraphQL"],
    summary:
      "Build real-time synchronization pipelines for high-performance project management tools with sub-50ms latency.",
    description: [
      "Develop real-time synchronization primitives and data replication layers.",
      "Build robust client sync protocols using WebSockets and background task queues.",
      "Scale database read replicas and write pipelines.",
    ],
    requirements: [
      "Strong background in reactive data systems and schema design.",
      "Deep understanding of event loops, asynchronous programming, and web standards.",
    ],
    applyUrl: "https://remotive.com",
  },
  {
    id: "match-4",
    title: "Full Stack / Backend Developer",
    company: "Shopify",
    companyLogoText: "S",
    location: "Rabat, Morocco (Hybrid)",
    workMode: "Hybrid",
    source: "indeed",
    salary: "12,000 - 16,000 MAD / mo",
    postedAge: "7h ago",
    matchScore: 88,
    matchLevel: "high",
    matchedSkills: ["Node.js", "Docker", "REST APIs", "Git", "Microservices"],
    summary:
      "Develop commerce APIs and merchant automation features for millions of global online businesses.",
    description: [
      "Build resilient merchant microservices powering real-time checkout and inventory tracking.",
      "Integrate automated CI/CD pipelines and end-to-end integration tests.",
    ],
    requirements: [
      "3+ years building production web applications.",
      "Comfortable with containerization, API contracts, and team code reviews.",
    ],
    applyUrl: "https://indeed.com",
  },
  {
    id: "match-5",
    title: "Backend Cloud Infrastructure Engineer",
    company: "Datadog",
    companyLogoText: "D",
    location: "Casablanca, Morocco",
    workMode: "Onsite",
    source: "adzuna",
    salary: "14,000 - 18,000 MAD / mo",
    postedAge: "10h ago",
    matchScore: 85,
    matchLevel: "high",
    matchedSkills: ["Node.js", "Cloud Services", "PostgreSQL", "Linux", "Docker"],
    summary:
      "Maintain telemetry pipelines and log collectors across regional data centers.",
    description: [
      "Build log parsing and metrics aggregation services.",
      "Configure automated alerting thresholds and diagnostic runbooks.",
    ],
    requirements: [
      "Experience with high-throughput streaming architectures.",
      "Strong Linux systems administration and bash scripting skills.",
    ],
    applyUrl: "https://adzuna.com",
  },
  {
    id: "match-6",
    title: "Software Engineer (Backend Focus)",
    company: "Spotify",
    companyLogoText: "S",
    location: "Remote, Morocco",
    workMode: "Remote",
    source: "linkedin",
    salary: "13,000 - 17,000 MAD / mo",
    postedAge: "14h ago",
    matchScore: 78,
    matchLevel: "mid",
    matchedSkills: ["REST APIs", "Node.js", "PostgreSQL", "Unit Testing"],
    summary:
      "Join the audio catalog team managing metadata ingestion and licensing verification.",
    description: [
      "Develop ingestion queues for global publisher music catalogues.",
      "Write unit and integration tests with automated code coverage gates.",
    ],
    requirements: [
      "Solid grasp of data modeling and RESTful API principles.",
      "Demonstrated ability to write clean, maintainable, self-documenting code.",
    ],
    applyUrl: "https://linkedin.com",
  },
];

export default function ClientDashboard() {
  const [matches, setMatches] = useState<JobItem[]>(SAMPLE_MATCHES);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set(["match-1"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"inbox" | "saved">("inbox");
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Toggle bookmark / saved
  const toggleSaveJob = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Dismiss job
  const handleDismissJob = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMatches((prev) => prev.filter((m) => m.id !== id));
    if (selectedJob?.id === id) setSelectedJob(null);
  };

  // Trigger instant scan simulation
  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanMessage("Scan complete! All 4 feeds verified. Found 28 matching roles.");
      setTimeout(() => setScanMessage(null), 5000);
    }, 1200);
  };

  // Filter matches
  const filteredMatches = matches.filter((job) => {
    // Saved tab filter
    if (activeTab === "saved" && !savedJobIds.has(job.id)) return false;

    // Source filter
    if (selectedSource !== "all" && job.source !== selectedSource) return false;

    // WorkMode filter
    if (
      selectedWorkMode !== "all" &&
      job.workMode.toLowerCase() !== selectedWorkMode.toLowerCase()
    )
      return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchSkill = job.matchedSkills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkill) return false;
    }

    return true;
  });

  const getSourceBadgeClass = (source: JobItem["source"]) => {
    switch (source) {
      case "linkedin":
        return "bg-[#0077B5]/10 text-[#0077B5] border-[#0077B5]/20";
      case "indeed":
        return "bg-[#2164f3]/10 text-[#2164f3] border-[#2164f3]/20";
      case "remotive":
        return "bg-[#4C9A78]/10 text-[#4C9A78] border-[#4C9A78]/25";
      case "adzuna":
        return "bg-[#E8B894]/20 text-[#A86D2C] border-[#E8B894]/40";
      default:
        return "bg-[#F2EFE9] text-[#6B6B72] border-[#E5E1D8]";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#2A2B2F]">
      {/* Client Header with identical brand logo alignment */}
      <Header />

      {/* Live Scanner Pipeline Status Strip */}
      <div className="w-full border-b border-[#E5E1D8] bg-[#F2EFE9]/60 px-4 sm:px-6 lg:px-8 py-2">
        <div className="mx-auto max-w-285 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4C9A78] animate-pulse-subtle" />
            <span className="text-[#2A2B2F] font-medium">Hourly Pipeline Active</span>
            <span className="text-[#949499] hidden sm:inline">·</span>
            <span className="text-[#6B6B72] hidden sm:inline">
              Scanning Indeed, LinkedIn, Remotive, and Adzuna
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#6B6B72]">
            <span>Next automatic scan in 52m</span>
            <button
              type="button"
              onClick={handleTriggerScan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#E5E1D8] text-[#3F5D9E] hover:bg-[#FAF9F6] hover:border-[#D8D2C4] transition-all cursor-pointer disabled:opacity-50"
            >
              <FiRefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "Scanning..." : "Run instant scan"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instant scan notification */}
      <AnimatePresence>
        {scanMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#E6F2EC] border-b border-[#4C9A78]/30 px-4 py-2 text-center text-xs font-mono text-[#4C9A78]"
          >
            {scanMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Container */}
      <main className="flex-1 mx-auto w-full max-w-285 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hero Welcome & Filter Target Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E5E1D8]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#6B6B72] mb-2 select-none">
              <span>CANDIDATE DASHBOARD</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2B2F] tracking-tight">
              Verified Job Matches
            </h1>
            <p className="mt-1.5 text-sm text-[#6B6B72] max-w-[56ch] leading-relaxed">
              Real-time roles parsed and matched against your resume and targeting
              preferences.
            </p>
          </div>

          {/* Active Target Filter Tag Widget */}
          <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl px-4 py-3 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] text-[#949499] uppercase tracking-wider">
                Current Scanner Profile
              </span>
              <span className="text-xs font-mono text-[#2A2B2F] font-semibold mt-0.5">
                Backend Developer · Morocco / Remote · &ge; 8,000 MAD
              </span>
            </div>
            <Link
              href="/onboarding/preferences"
              className="ml-3 p-1.5 rounded-lg text-[#6B6B72] hover:text-[#3F5D9E] hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E1D8] transition-colors"
              title="Edit preferences"
            >
              <FiSliders className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Metric Bento Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-[#D8D2C4]">
            <div className="flex items-center justify-between text-[#6B6B72] mb-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wider">
                Verified Matches
              </span>
              <FiLayers className="w-4 h-4 text-[#3F5D9E]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#2A2B2F]">28</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-[#4C9A78]">
              <FiTrendingUp className="w-3.5 h-3.5" />
              <span>+6 new since 09:14</span>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-[#D8D2C4]">
            <div className="flex items-center justify-between text-[#6B6B72] mb-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wider">
                Top Match Fit
              </span>
              <FiActivity className="w-4 h-4 text-[#4C9A78]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#2A2B2F]">96%</div>
            <div className="mt-2 text-xs font-mono text-[#6B6B72] truncate">
              Senior Backend at Vercel
            </div>
          </div>

          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-[#D8D2C4]">
            <div className="flex items-center justify-between text-[#6B6B72] mb-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wider">
                Active Feeds
              </span>
              <FiBriefcase className="w-4 h-4 text-[#E8B894]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#2A2B2F]">4 Feeds</div>
            <div className="mt-2 text-xs font-mono text-[#6B6B72]">
              LinkedIn · Indeed · Remotive
            </div>
          </div>

          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-[#D8D2C4]">
            <div className="flex items-center justify-between text-[#6B6B72] mb-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wider">
                Fit Threshold
              </span>
              <FiSliders className="w-4 h-4 text-[#3F5D9E]" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#2A2B2F]">60%+</div>
            <div className="mt-2 text-xs font-mono text-[#4C9A78]">
              Semantic keyword &amp; CV match
            </div>
          </div>
        </div>

        {/* View Tabs & Search Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Inbox / Saved Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-[#FAF9F6] border border-[#E5E1D8] self-start">
            <button
              type="button"
              onClick={() => setActiveTab("inbox")}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === "inbox"
                  ? "bg-[#FFFFFF] text-[#2A2B2F] shadow-xs border border-[#E5E1D8] font-semibold"
                  : "text-[#6B6B72] hover:text-[#2A2B2F]"
              }`}
            >
              Inbox Matches ({matches.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === "saved"
                  ? "bg-[#FFFFFF] text-[#2A2B2F] shadow-xs border border-[#E5E1D8] font-semibold"
                  : "text-[#6B6B72] hover:text-[#2A2B2F]"
              }`}
            >
              Saved / Bookmarked ({savedJobIds.size})
            </button>
          </div>

          {/* Search Input & Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, tech stack..."
                className="w-full h-10 pl-9 pr-3.5 rounded-lg bg-[#FFFFFF] border border-[#E5E1D8] text-xs font-sans text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors hover:border-[#D8D2C4]"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#949499] pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F]"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Source Filter */}
            <select
              aria-label="Filter by Source"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E5E1D8] text-xs font-mono text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors cursor-pointer hover:border-[#D8D2C4]"
            >
              <option value="all">All Sources (4)</option>
              <option value="linkedin">LinkedIn</option>
              <option value="indeed">Indeed</option>
              <option value="remotive">Remotive</option>
              <option value="adzuna">Adzuna</option>
            </select>

            {/* Work Mode Filter */}
            <select
              aria-label="Filter by Work Mode"
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E5E1D8] text-xs font-mono text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors cursor-pointer hover:border-[#D8D2C4]"
            >
              <option value="all">All Work Modes</option>
              <option value="remote">Remote Only</option>
              <option value="onsite">Onsite Only</option>
              <option value="hybrid">Hybrid Only</option>
            </select>
          </div>
        </div>

        {/* Matched Roles Feed Card */}
        <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-colors">
          {/* Table / List Header */}
          <div className="flex items-center justify-between border-b border-[#E5E1D8] bg-[#FAF9F6] px-5 py-3 text-xs font-mono text-[#6B6B72]">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#2A2B2F]">
                {activeTab === "inbox" ? "Active Pipeline Roles" : "Saved Bookmarks"}
              </span>
              <span>· {filteredMatches.length} available</span>
            </div>
            <span className="hidden sm:inline">Ranked by semantic match score</span>
          </div>

          {/* Job Rows */}
          {filteredMatches.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF9F6] border border-[#E5E1D8] text-[#949499] mb-3">
                <FiSearch className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl text-[#2A2B2F]">No matches found</h3>
              <p className="mt-1 text-sm text-[#6B6B72] max-w-sm mx-auto">
                No roles match your current search and filters. Try resetting the filter
                criteria or broadening keywords.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSource("all");
                  setSelectedWorkMode("all");
                  setActiveTab("inbox");
                }}
                className="mt-4"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E1D8]">
              {filteredMatches.map((job) => {
                const isSaved = savedJobIds.has(job.id);

                return (
                  <article
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 transition-colors duration-150 hover:bg-[#FAF9F6] cursor-pointer"
                  >
                    {/* Left: Avatar, Role Title, Meta & Tags */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Company Logo Avatar */}
                      <div className="h-11 w-11 shrink-0 rounded-xl bg-[#FAF9F6] border border-[#E5E1D8] flex items-center justify-center font-serif text-lg text-[#2A2B2F] font-bold shadow-2xs group-hover:border-[#3F5D9E]/30 transition-colors">
                        {job.companyLogoText}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-medium text-[#2A2B2F] group-hover:text-[#3F5D9E] transition-colors truncate">
                            {job.title}
                          </h2>

                          {/* Source pill */}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border uppercase tracking-wider ${getSourceBadgeClass(
                              job.source
                            )}`}
                          >
                            {job.source}
                          </span>
                        </div>

                        {/* Company / Location / Salary / Age */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-xs text-[#6B6B72]">
                          <span className="font-medium text-[#2A2B2F]">{job.company}</span>
                          <span className="text-[#949499]">/</span>
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-3 h-3 text-[#949499]" />
                            {job.location}
                          </span>
                          <span className="text-[#949499]">/</span>
                          <span className="text-[#4C9A78] font-medium">{job.salary}</span>
                          <span className="text-[#949499]">/</span>
                          <span className="text-[#949499] flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {job.postedAge}
                          </span>
                        </div>

                        {/* Matched Skill Tags */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          {job.matchedSkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#FAF9F6] border border-[#E5E1D8] text-[#6B6B72]"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.matchedSkills.length > 4 && (
                            <span className="text-[11px] font-mono text-[#949499]">
                              +{job.matchedSkills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Match Score & Quick Action Buttons */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E5E1D8]/60">
                      <ScoreChip level={job.matchLevel} score={job.matchScore} />

                      <div className="flex items-center gap-1.5">
                        {/* Save / Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleSaveJob(job.id, e)}
                          title={isSaved ? "Saved" : "Save job"}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            isSaved
                              ? "bg-[#E7ECF7] border-[#3F5D9E]/30 text-[#3F5D9E]"
                              : "bg-[#FFFFFF] border-[#E5E1D8] text-[#949499] hover:text-[#2A2B2F] hover:bg-[#F2EFE9]"
                          }`}
                        >
                          <FiBookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>

                        {/* View Breakdown Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedJob(job)}
                          className="px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-[#FFFFFF] hover:bg-[#F2EFE9] text-xs font-mono text-[#2A2B2F] hover:text-[#3F5D9E] transition-colors cursor-pointer"
                        >
                          Details
                        </button>

                        {/* Dismiss Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDismissJob(job.id, e)}
                          title="Dismiss role"
                          className="p-2 rounded-lg border border-[#E5E1D8] bg-[#FFFFFF] text-[#949499] hover:text-[#D97575] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between border-t border-[#E5E1D8] bg-[#FAF9F6] px-5 py-3 font-mono text-xs text-[#949499]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#4C9A78] animate-pulse-subtle" />
              <span className="text-[#6B6B72]">Continuous hourly background scan</span>
            </div>
            <span>Verified feeds: LinkedIn, Indeed, Remotive, Adzuna</span>
          </div>
        </div>
      </main>

      {/* Interactive Job Detail Slide-Over Drawer */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-[#2A2B2F]/30 backdrop-blur-xs cursor-pointer"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-10 w-full max-w-xl bg-[#FFFFFF] border-l border-[#E5E1D8] shadow-2xl flex flex-col h-full overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E5E1D8] bg-[#FAF9F6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border uppercase tracking-wider ${getSourceBadgeClass(
                      selectedJob.source
                    )}`}
                  >
                    {selectedJob.source}
                  </span>
                  <ScoreChip level={selectedJob.matchLevel} score={selectedJob.matchScore} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSaveJob(selectedJob.id)}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      savedJobIds.has(selectedJob.id)
                        ? "bg-[#E7ECF7] border-[#3F5D9E]/30 text-[#3F5D9E]"
                        : "bg-[#FFFFFF] border-[#E5E1D8] text-[#949499] hover:text-[#2A2B2F]"
                    }`}
                  >
                    <FiBookmark
                      className={`w-4 h-4 ${
                        savedJobIds.has(selectedJob.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="p-2 rounded-lg border border-[#E5E1D8] bg-[#FFFFFF] text-[#6B6B72] hover:text-[#2A2B2F] transition-colors cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-[#2A2B2F] tracking-tight">
                    {selectedJob.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-[#6B6B72]">
                    <span className="font-medium text-[#2A2B2F] text-sm">
                      {selectedJob.company}
                    </span>
                    <span className="text-[#949499]">·</span>
                    <span>{selectedJob.location}</span>
                    <span className="text-[#949499]">·</span>
                    <span className="text-[#4C9A78] font-medium">{selectedJob.salary}</span>
                  </div>
                </div>

                {/* Match Intelligence Breakdown Box */}
                <div className="rounded-xl border border-[#E5E1D8] bg-[#FAF9F6] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[#2A2B2F] uppercase tracking-wider">
                      Match Breakdown Analysis
                    </span>
                    <span className="text-[#3F5D9E] font-medium">Semantic Fit</span>
                  </div>
                  <p className="text-xs text-[#6B6B72] leading-relaxed">
                    Matched {selectedJob.matchScore}% against your uploaded resume and
                    targeting criteria.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedJob.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#FFFFFF] border border-[#4C9A78]/30 text-[#4C9A78]"
                      >
                        <FiCheck className="w-3 h-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Role Summary */}
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B6B72] mb-2">
                    Role Summary
                  </h3>
                  <p className="text-sm text-[#2A2B2F] leading-relaxed">
                    {selectedJob.summary}
                  </p>
                </div>

                {/* Key Responsibilities */}
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B6B72] mb-2">
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2 text-sm text-[#6B6B72]">
                    {selectedJob.description.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3F5D9E] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B6B72] mb-2">
                    Qualifications &amp; Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-[#6B6B72]">
                    {selectedJob.requirements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4C9A78] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-[#E5E1D8] bg-[#FAF9F6] flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedJob(null)}
                  className="px-4"
                >
                  Close
                </Button>

                <a
                  href={selectedJob.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full h-11 text-sm font-medium flex items-center justify-center gap-2">
                    <span>Apply on {selectedJob.source.toUpperCase()}</span>
                    <FiExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export { ClientDashboard };
