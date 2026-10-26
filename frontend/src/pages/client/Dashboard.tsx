"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiSliders,
  FiBookmark,
  FiExternalLink,
  FiCheck,
  FiX,

  FiMapPin,
  FiRefreshCw,
  FiFilter,
 
  FiChevronDown,

} from "react-icons/fi";
import Header from "@/src/components/layout/header";
import Footer from "@/src/components/layout/footer";
import ScoreChip from "@/src/components/home/ScoreChip";
import { Button } from "@/src/components/ui/button";
import {
  getSourceMeta,
  KNOWN_SOURCES,
  SAMPLE_MATCHES,
  type JobItem,
} from "@/src/helpers/mockData";



export default function ClientDashboard() {
  const [matches, setMatches] = useState<JobItem[]>(SAMPLE_MATCHES);
  const [selectedJobState, setSelectedJob] = useState<JobItem>(SAMPLE_MATCHES[0]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set(["match-1"]));
  const [searchQuery, setSearchQuery] = useState("");

  const allAvailableSources = useMemo(() => {
    const fromMatches = Array.from(new Set(matches.map((m) => m.source.toLowerCase())));
    const knownIds = KNOWN_SOURCES.map((s) => s.id);
    const combined = Array.from(new Set([...fromMatches, ...knownIds]));
    return combined.map((id) => getSourceMeta(id));
  }, [matches]);

  const [selectedSources, setSelectedSources] = useState<string[]>(() =>
    allAvailableSources.map((s) => s.id)
  );

  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [sourceSearchInput, setSourceSearchInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSourceDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"inbox" | "saved">("inbox");

  const [isMobileInspectorOpen, setIsMobileInspectorOpen] = useState(false);

  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanModalSearchTerm] = useState("");
  const [scanSources, setScanSources] = useState<string[]>(() =>
    allAvailableSources.map((s) => s.id)
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanFinishedData, setScanFinishedData] = useState<{
    sources: string[];
    totalFound: number;
  } | null>(null);

  const filteredPopoverSources = useMemo(() => {
    if (!sourceSearchInput.trim()) return allAvailableSources;
    const q = sourceSearchInput.toLowerCase();
    return allAvailableSources.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [allAvailableSources, sourceSearchInput]);

  const filteredModalSources = useMemo(() => {
    if (!scanModalSearchTerm.trim()) return allAvailableSources;
    const q = scanModalSearchTerm.toLowerCase();
    return allAvailableSources.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q)
    );
  }, [allAvailableSources, scanModalSearchTerm]);

  const toggleSaveJob = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDismissJob = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMatches((prev) => {
      const remaining = prev.filter((m) => m.id !== id);
      if (selectedJob?.id === id && remaining.length > 0) {
        setSelectedJob(remaining[0]);
      }
      return remaining;
    });
  };

  const handleToggleSource = (sourceId: string) => {
    setSelectedSources((prev) => {
      if (prev.includes(sourceId)) {
        return prev.filter((s) => s !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleSelectAllSources = () => {
    setSelectedSources(allAvailableSources.map((s) => s.id));
  };

  const handleClearSources = () => {
    setSelectedSources([]);
  };

  const handleToggleScanSource = (sourceId: string) => {
    setScanSources((prev) => {
      if (prev.includes(sourceId)) {
        return prev.filter((s) => s !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleSelectAllScanSources = () => {
    setScanSources(allAvailableSources.map((s) => s.id));
  };

  const handleDeselectAllScanSources = () => {
    setScanSources([]);
  };

  const executeScan = () => {
    if (scanSources.length === 0) return;

    setIsScanning(true);
    setScanLogs([]);
    setScanFinishedData(null);

    const steps = [
      `Connecting to JSearch multi-platform API gateway (${scanSources.length} sources)...`,
      ...scanSources.slice(0, 4).map((sourceId) => {
        const meta = getSourceMeta(sourceId);
        return `Scanning ${meta.label} live index · matching against CV embeddings...`;
      }),
      ...(scanSources.length > 4
        ? [`Parsing remaining ${scanSources.length - 4} publisher channels in parallel...`]
        : []),
      "Deduplicating cross-platform postings & verifying minimum 8,000 MAD threshold...",
      "Matching verified. Ranked 12 candidate opportunities by semantic fit score.",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const nextLog = steps[currentStep];
        setScanLogs((prev) => [...prev, nextLog]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);

        const matchedInScanned = matches.filter((m) =>
          scanSources.includes(m.source.toLowerCase())
        ).length;

        setScanFinishedData({
          sources: [...scanSources],
          totalFound: matchedInScanned,
        });

        setSelectedSources([...scanSources]);

        setScanMessage(
          `Scan completed! Verified ${matchedInScanned} roles across ${scanSources.length} source(s).`
        );

        setTimeout(() => setScanMessage(null), 6000);
      }
    }, 400);
  };

  const getSourceCount = (sourceId: string) => {
    return matches.filter((m) => {
      if (activeTab === "saved" && !savedJobIds.has(m.id)) return false;
      return m.source.toLowerCase() === sourceId.toLowerCase();
    }).length;
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((job) => {
      if (activeTab === "saved" && !savedJobIds.has(job.id)) return false;

      if (selectedSources.length === 0) return false;
      if (!selectedSources.includes(job.source.toLowerCase())) return false;

      if (
        selectedWorkMode !== "all" &&
        job.workMode.toLowerCase() !== selectedWorkMode.toLowerCase()
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchSkill = job.matchedSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchSkill) return false;
      }

      return true;
    });
  }, [matches, activeTab, savedJobIds, selectedSources, selectedWorkMode, searchQuery]);

  const selectedJob =
    filteredMatches.find((job) => job.id === selectedJobState.id) ??
    filteredMatches[0] ??
    selectedJobState;

  const isAllSourcesSelected =
    allAvailableSources.length > 0 &&
    allAvailableSources.length === selectedSources.length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#2A2B2F]">
    
      <Header />

  
      <section className="w-full border-b border-[#E5E1D8] bg-[#FFFFFF]/80 backdrop-blur-xs py-3.5 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 transition-all">
        <div className="mx-auto max-w-285 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
              
                <div className="flex items-center gap-1" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
                  <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
                  <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
                </div>
                <span className="font-mono text-[11px] text-[#6B6B72] tracking-tight">
                  jobpulse.app / candidate-cockpit
                </span>
                <span className="text-[#949499]">·</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#4C9A78]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4C9A78] animate-pulse-subtle" />
                  Scanner Active
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <h1 className="font-serif text-2xl sm:text-3xl text-[#2A2B2F] tracking-tight">
                  Matched <span className="italic text-[#3F5D9E]">Opportunities</span>
                </h1>
                <span className="font-mono text-xs text-[#6B6B72]">
                  ({filteredMatches.length} verified)
                </span>
              </div>
            </div>
          </div>

      
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-[#FAF9F6] font-mono text-xs text-[#6B6B72]">
              <span className="text-[#949499]">Target:</span>
              <span className="font-semibold text-[#2A2B2F]">Backend Dev · Morocco</span>
              <Link
                href="/onboarding/preferences"
                title="Edit preferences"
                className="text-[#3F5D9E] hover:underline ml-1"
              >
                <FiSliders className="w-3 h-3 inline" />
              </Link>
            </div>

          
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-[#FAF9F6] font-mono text-xs">
              <span className="text-[#949499]">Top Fit:</span>
              <span className="font-bold text-[#4C9A78]">96% Vercel</span>
            </div>

         
            <button
              type="button"
              onClick={() => {
                setScanFinishedData(null);
                setScanLogs([]);
                setIsScanModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#3F5D9E] hover:bg-[#344E85] text-[#FFFFFF] text-xs font-mono font-medium transition-colors shadow-xs cursor-pointer"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Scan Feeds</span>
            </button>
          </div>
        </div>
      </section>

     
      <AnimatePresence>
        {scanMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#E6F2EC] border-b border-[#4C9A78]/30 px-4 py-2 text-center text-xs font-mono text-[#4C9A78] flex items-center justify-center gap-2"
          >
            <FiCheck className="w-4 h-4 shrink-0" />
            <span>{scanMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

  
      <section className="w-full border-b border-[#E5E1D8] bg-[#FAF9F6] px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="mx-auto max-w-285 flex flex-col md:flex-row md:items-center justify-between gap-3">
       
          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 rounded-lg bg-[#F2EFE9] border border-[#E5E1D8]">
              <button
                type="button"
                onClick={() => setActiveTab("inbox")}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  activeTab === "inbox"
                    ? "bg-[#FFFFFF] text-[#2A2B2F] font-semibold shadow-2xs border border-[#E5E1D8]"
                    : "text-[#6B6B72] hover:text-[#2A2B2F]"
                }`}
              >
                Inbox ({matches.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  activeTab === "saved"
                    ? "bg-[#FFFFFF] text-[#2A2B2F] font-semibold shadow-2xs border border-[#E5E1D8]"
                    : "text-[#6B6B72] hover:text-[#2A2B2F]"
                }`}
              >
                Saved ({savedJobIds.size})
              </button>
            </div>

         
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                  isAllSourcesSelected
                    ? "bg-[#FFFFFF] border-[#E5E1D8] text-[#2A2B2F] hover:bg-[#F2EFE9]"
                    : "bg-[#E7ECF7] border-[#3F5D9E]/30 text-[#3F5D9E] font-medium"
                }`}
              >
                <FiFilter className="w-3 h-3 text-[#3F5D9E]" />
                <span>
                  Sources: {isAllSourcesSelected ? "All (12)" : `${selectedSources.length} Active`}
                </span>
                <FiChevronDown
                  className={`w-3 h-3 transition-transform ${
                    isSourceDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

      
              <AnimatePresence>
                {isSourceDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-1.5 w-76 sm:w-80 rounded-xl bg-[#FFFFFF] border border-[#E5E1D8] shadow-xl p-3 z-50 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8]">
                      <span className="font-semibold text-[#2A2B2F] uppercase text-[11px] tracking-wider">
                        Select Sources
                      </span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={handleSelectAllSources}
                          className="text-[#3F5D9E] hover:underline cursor-pointer"
                        >
                          All
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={handleClearSources}
                          className="text-[#6B6B72] hover:text-[#D97575] cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                  
                    <div className="relative my-2">
                      <input
                        type="text"
                        value={sourceSearchInput}
                        onChange={(e) => setSourceSearchInput(e.target.value)}
                        placeholder="Search publisher..."
                        className="w-full h-7 pl-7 pr-6 rounded-md bg-[#FAF9F6] border border-[#E5E1D8] text-[11px] font-mono text-[#2A2B2F] placeholder:text-[#949499] focus:outline-none focus:border-[#3F5D9E]"
                      />
                      <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#949499]" />
                      {sourceSearchInput && (
                        <button
                          type="button"
                          onClick={() => setSourceSearchInput("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F]"
                        >
                          <FiX className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>

                  
                    <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                      {filteredPopoverSources.map((source) => {
                        const isChecked = selectedSources.includes(source.id);
                        const count = getSourceCount(source.id);

                        return (
                          <div
                            key={source.id}
                            onClick={() => handleToggleSource(source.id)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-[#E7ECF7]/40 text-[#2A2B2F]"
                                : "hover:bg-[#FAF9F6] text-[#6B6B72]"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`h-3.5 w-3.5 rounded flex items-center justify-center shrink-0 ${
                                  isChecked
                                    ? "bg-[#3F5D9E] text-[#FFFFFF]"
                                    : "border border-[#949499] bg-[#FFFFFF]"
                                }`}
                              >
                                {isChecked && <FiCheck className="w-2.5 h-2.5" />}
                              </div>
                              <span className="truncate">{source.label}</span>
                            </div>

                            <span className="text-[10px] text-[#949499] shrink-0 ml-1">
                              {count} roles
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          
            <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-[#E5E1D8]">
              {["linkedin", "indeed", "glassdoor", "remotive", "adzuna"].map((sId) => {
                const meta = getSourceMeta(sId);
                const isSelected = selectedSources.includes(sId);

                return (
                  <button
                    key={sId}
                    type="button"
                    onClick={() => handleToggleSource(sId)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#FFFFFF] border-[#3F5D9E] text-[#3F5D9E] font-medium shadow-2xs"
                        : "bg-[#FAF9F6] border-[#E5E1D8] text-[#949499] hover:text-[#2A2B2F]"
                    }`}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

        
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter title, tech stack..."
                className="w-full h-8 pl-8 pr-7 rounded-lg bg-[#FFFFFF] border border-[#E5E1D8] text-xs font-sans text-[#2A2B2F] placeholder:text-[#949499] focus:outline-none focus:border-[#3F5D9E]"
              />
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#949499]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F]"
                >
                  <FiX className="w-3 h-3" />
                </button>
              )}
            </div>

           
            <select
              aria-label="Filter by Work Mode"
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E1D8] text-xs font-mono text-[#2A2B2F] focus:outline-none focus:border-[#3F5D9E] cursor-pointer"
            >
              <option value="all">All Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
        </div>
      </section>

    
      <main className="flex-1 mx-auto w-full max-w-285 px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
   
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col space-y-2.5">
          
            <div className="flex items-center justify-between text-xs font-mono text-[#6B6B72] px-1">
              <span>
                Showing {filteredMatches.length} role{filteredMatches.length === 1 ? "" : "s"}
              </span>
              <span className="text-[#949499]">Ranked by semantic match fit</span>
            </div>


            {filteredMatches.length === 0 ? (
              <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-8 text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF9F6] border border-[#E5E1D8] text-[#949499] mb-3">
                  <FiSearch className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-lg text-[#2A2B2F]">No matches found</h3>
                <p className="mt-1 text-xs text-[#6B6B72] max-w-xs mx-auto">
                  {selectedSources.length === 0
                    ? "All sources have been deselected. Please re-enable at least one platform."
                    : "No roles match your search and filters."}
                </p>
                <div className="mt-3">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSources(allAvailableSources.map((s) => s.id));
                      setSelectedWorkMode("all");
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>
            ) : (
            
              <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden divide-y divide-[#E5E1D8]">
                {filteredMatches.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  const isSaved = savedJobIds.has(job.id);
                  const meta = getSourceMeta(job.source);

                  return (
                    <article
                      key={job.id}
                      onClick={() => {
                        setSelectedJob(job);
                        setIsMobileInspectorOpen(true);
                      }}
                      className={`group p-4 transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF9F6] ring-2 ring-inset ring-[#3F5D9E]/50"
                          : "hover:bg-[#F2EFE9]/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                  
                        <div className="h-9 w-9 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] flex items-center justify-center font-serif text-base text-[#2A2B2F] font-bold shrink-0 group-hover:border-[#3F5D9E]/30">
                          {job.companyLogoText}
                        </div>

                      
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-medium text-[#2A2B2F] group-hover:text-[#3F5D9E] transition-colors truncate">
                              {job.title}
                            </h2>
                            <ScoreChip level={job.matchLevel} score={job.matchScore} />
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-xs text-[#6B6B72]">
                            <span className="font-semibold text-[#2A2B2F]">{job.company}</span>
                            <span className="text-[#949499]">·</span>
                            <span>{job.location}</span>
                            <span className="text-[#949499]">·</span>
                            <span className="text-[#4C9A78] font-medium">{job.salary}</span>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1">
                              {job.matchedSkills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#FAF9F6] border border-[#E5E1D8] text-[#6B6B72]"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.matchedSkills.length > 3 && (
                                <span className="text-[10px] font-mono text-[#949499]">
                                  +{job.matchedSkills.length - 3}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase tracking-wider border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                              >
                                {meta.label}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => toggleSaveJob(job.id, e)}
                                title={isSaved ? "Saved" : "Save job"}
                                className={`p-1 rounded hover:bg-[#FAF9F6] text-[#949499] transition-colors cursor-pointer ${
                                  isSaved ? "text-[#3F5D9E]" : "hover:text-[#2A2B2F]"
                                }`}
                              >
                                <FiBookmark
                                  className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:col-span-6 xl:col-span-7 sticky top-20">
            {selectedJob ? (
              <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col max-h-[calc(100vh-110px)]">
                <div className="flex items-center justify-between border-b border-[#E5E1D8] bg-[#F2EFE9] px-4 py-2.5">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
                    <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
                    <span className="h-2 w-2 rounded-full bg-[#D8D2C4]" />
                  </div>
                  <div className="font-mono text-[11px] text-[#6B6B72] tracking-tight select-none">
                    jobpulse.app / match-inspector · {selectedJob.id}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSaveJob(selectedJob.id)}
                      className={`p-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                        savedJobIds.has(selectedJob.id)
                          ? "text-[#3F5D9E]"
                          : "text-[#949499] hover:text-[#2A2B2F]"
                      }`}
                    >
                      <FiBookmark
                        className={`w-3.5 h-3.5 ${
                          savedJobIds.has(selectedJob.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismissJob(selectedJob.id)}
                      title="Dismiss job"
                      className="text-[#949499] hover:text-[#D97575] cursor-pointer"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 border-b border-[#E5E1D8] bg-[#FAF9F6]">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border uppercase tracking-wider ${
                        getSourceMeta(selectedJob.source).badgeBg
                      } ${getSourceMeta(selectedJob.source).badgeText} ${
                        getSourceMeta(selectedJob.source).badgeBorder
                      }`}
                    >
                      {getSourceMeta(selectedJob.source).label}
                    </span>
                    <ScoreChip level={selectedJob.matchLevel} score={selectedJob.matchScore} />
                  </div>

                  <h2 className="font-serif text-2xl text-[#2A2B2F] tracking-tight">
                    {selectedJob.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-[#6B6B72]">
                    <span className="font-semibold text-sm text-[#2A2B2F]">
                      {selectedJob.company}
                    </span>
                    <span className="text-[#949499]">·</span>
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-3 h-3 text-[#949499]" />
                      {selectedJob.location}
                    </span>
                    <span className="text-[#949499]">·</span>
                    <span className="text-[#4C9A78] font-medium">{selectedJob.salary}</span>
                    <span className="text-[#949499]">·</span>
                    <span>{selectedJob.postedAge}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div className="rounded-xl border border-[#E5E1D8] bg-[#FAF9F6] p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-[#2A2B2F] uppercase tracking-wider">
                        Semantic Match Intelligence
                      </span>
                      <span className="text-[#3F5D9E] font-medium">Verified against resume</span>
                    </div>

                    <p className="text-xs text-[#6B6B72] leading-relaxed">
                      High-confidence match ({selectedJob.matchScore}% similarity). Meets your targeting criteria: Backend Developer, location filters, and salary benchmark.
                    </p>

                    <div className="pt-2 border-t border-[#E5E1D8]/60 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B6B72]">Overlapping Skills</span>
                        <span className="font-semibold text-[#2A2B2F]">
                          {selectedJob.matchedSkills.length} Core Tech Matches
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B6B72]">Salary Alignment</span>
                        <span className="font-semibold text-[#4C9A78]">
                          &ge; 8,000 MAD threshold verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2A2B2F] mb-2">
                      Verified Resume Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-[#E7ECF7] text-[#3F5D9E] border border-[#3F5D9E]/20"
                        >
                          <FiCheck className="w-2.5 h-2.5" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2A2B2F] mb-1.5">
                      Executive Overview
                    </h3>
                    <p className="text-sm text-[#6B6B72] leading-relaxed">
                      {selectedJob.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2A2B2F] mb-1.5">
                      Key Responsibilities
                    </h3>
                    <ul className="space-y-1.5">
                      {selectedJob.description.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#6B6B72]">
                          <span className="text-[#3F5D9E] font-bold mt-0.5">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2A2B2F] mb-1.5">
                      Requirements Checklist
                    </h3>
                    <ul className="space-y-1.5">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#6B6B72]">
                          <span className="text-[#4C9A78] font-bold mt-0.5">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 border-t border-[#E5E1D8] bg-[#FAF9F6] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSaveJob(selectedJob.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                      savedJobIds.has(selectedJob.id)
                        ? "bg-[#E7ECF7] border-[#3F5D9E]/30 text-[#3F5D9E] font-medium"
                        : "bg-[#FFFFFF] border-[#E5E1D8] text-[#6B6B72] hover:text-[#2A2B2F]"
                    }`}
                  >
                    <FiBookmark
                      className={`w-3.5 h-3.5 ${
                        savedJobIds.has(selectedJob.id) ? "fill-current" : ""
                      }`}
                    />
                    <span>{savedJobIds.has(selectedJob.id) ? "Saved" : "Save for later"}</span>
                  </button>

                  <a
                    href={selectedJob.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#3F5D9E] hover:bg-[#344E85] text-[#FFFFFF] text-xs font-mono font-medium transition-colors shadow-xs"
                  >
                    <span>Apply on {getSourceMeta(selectedJob.source).label}</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-8 text-center text-xs font-mono text-[#949499]">
                Select a role from the left feed to inspect details and match breakdown.
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isMobileInspectorOpen && selectedJob && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileInspectorOpen(false)}
              className="fixed inset-0 bg-[#2A2B2F]/30 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg bg-[#FFFFFF] border-l border-[#E5E1D8] shadow-2xl flex flex-col h-full overflow-hidden"
            >
              <div className="p-4 border-b border-[#E5E1D8] bg-[#FAF9F6] flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#2A2B2F]">
                  JobPulse Inspector
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileInspectorOpen(false)}
                  className="p-1 rounded text-[#6B6B72] hover:text-[#2A2B2F]"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <h2 className="font-serif text-2xl text-[#2A2B2F]">{selectedJob.title}</h2>
                <div className="font-mono text-xs text-[#6B6B72]">
                  {selectedJob.company} · {selectedJob.location} · {selectedJob.salary}
                </div>
                <p className="text-xs text-[#6B6B72] leading-relaxed">{selectedJob.summary}</p>
                <div className="space-y-1">
                  {selectedJob.requirements.map((req, i) => (
                    <div key={i} className="text-xs text-[#6B6B72] flex items-start gap-1.5">
                      <span className="text-[#4C9A78]">✓</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-[#E5E1D8] bg-[#FAF9F6] flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveJob(selectedJob.id)}
                >
                  {savedJobIds.has(selectedJob.id) ? "Saved" : "Save"}
                </Button>
                <a
                  href={selectedJob.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3F5D9E] text-white text-xs font-mono"
                >
                  <span>Apply on {selectedJob.source}</span>
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isScanning) setIsScanModalOpen(false);
              }}
              className="fixed inset-0 bg-[#2A2B2F]/40 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-xl rounded-2xl bg-[#FFFFFF] border border-[#E5E1D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-[#E5E1D8] bg-[#FAF9F6] flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#3F5D9E] font-medium">
                    <FiRefreshCw className="w-3 h-3" />
                    <span>Pipeline Scanner</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#2A2B2F] tracking-tight mt-0.5">
                    Query Sources &amp; Run Scan
                  </h3>
                </div>

                {!isScanning && (
                  <button
                    type="button"
                    onClick={() => setIsScanModalOpen(false)}
                    className="p-1.5 rounded-lg border border-[#E5E1D8] bg-[#FFFFFF] text-[#6B6B72] hover:text-[#2A2B2F] cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {!isScanning && !scanFinishedData && (
                  <>
                    <div className="flex items-center justify-between text-xs font-mono text-[#6B6B72]">
                      <span>Select platforms to query ({scanSources.length} selected):</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllScanSources}
                          className="text-[#3F5D9E] hover:underline cursor-pointer"
                        >
                          Select All
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={handleDeselectAllScanSources}
                          className="text-[#6B6B72] hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {filteredModalSources.map((source) => {
                        const isChecked = scanSources.includes(source.id);
                        return (
                          <div
                            key={source.id}
                            onClick={() => handleToggleScanSource(source.id)}
                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                              isChecked
                                ? "border-[#3F5D9E] bg-[#E7ECF7]/25"
                                : "border-[#E5E1D8] bg-[#FAF9F6]/40 hover:bg-[#FAF9F6]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`h-4 w-4 rounded flex items-center justify-center shrink-0 ${
                                  isChecked
                                    ? "bg-[#3F5D9E] text-[#FFFFFF]"
                                    : "border border-[#949499] bg-[#FFFFFF]"
                                }`}
                              >
                                {isChecked && <FiCheck className="w-2.5 h-2.5" />}
                              </div>
                              <span className="font-mono text-xs font-medium text-[#2A2B2F]">
                                {source.label}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[#949499]">
                              {source.category}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {isScanning && (
                  <div className="py-4 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#2A2B2F]">
                      <span className="flex items-center gap-2">
                        <FiRefreshCw className="w-3.5 h-3.5 animate-spin text-[#3F5D9E]" />
                        Querying sources...
                      </span>
                      <span className="text-[#3F5D9E]">Live Scan</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] space-y-1.5 max-h-48 overflow-y-auto">
                      {scanLogs.map((log, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-[#6B6B72]">
                          <span className="text-[#4C9A78]">✓</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isScanning && scanFinishedData && (
                  <div className="py-3 text-center space-y-2">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F2EC] text-[#4C9A78]">
                      <FiCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-xl text-[#2A2B2F]">Scan Complete!</h4>
                    <p className="text-xs font-mono text-[#6B6B72]">
                      Found {scanFinishedData.totalFound} matching roles across{" "}
                      {scanFinishedData.sources.length} sources.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-[#E5E1D8] bg-[#FAF9F6] flex items-center justify-end gap-2">
                {!isScanning && !scanFinishedData && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsScanModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={executeScan}
                      disabled={scanSources.length === 0}
                    >
                      Run Scan ({scanSources.length})
                    </Button>
                  </>
                )}

                {!isScanning && scanFinishedData && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsScanModalOpen(false)}
                  >
                    View Matches
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

  
      <Footer />
    </div>
  );
}
