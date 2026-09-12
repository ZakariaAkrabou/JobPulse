"use client";

import React from "react";

/* ── Platform data ────────────────────────────────────────────────────────── */
const platforms = [
  {
    name: "LinkedIn",
    tag: "Corporate Network",
    color: "#0A66C2",
    bg: "#E8F0FA",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.977 1.977 0 0 1-1.975-1.975 1.977 1.977 0 0 1 1.975-1.975 1.977 1.977 0 0 1 1.975 1.975 1.977 1.977 0 0 1-1.975 1.975zm1.975 13.019H3.362V9h3.95v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "Indeed",
    tag: "Career Feed",
    color: "#2164F3",
    bg: "#EAF0FE",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12.006 0A6.751 6.751 0 0 0 5.258 6.75c0 3.727 6.748 13.689 6.748 13.689s6.748-9.962 6.748-13.689A6.75 6.75 0 0 0 12.006 0zm0 9.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-1.502 5.513V24h3v-8.737a8.982 8.982 0 0 1-3 0z"/>
      </svg>
    ),
  },
  {
    name: "Adzuna",
    tag: "Aggregated APIs",
    color: "#FF6B35",
    bg: "#FFF0EA",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-9A1.5 1.5 0 0 1 6 14V10a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 18 10v4a1.5 1.5 0 0 1-1.5 1.5zm-7.5-6v4.5h1.5V12h1.5v2.25H13V12h1.5v2.25H16V9.5H7.5v.001z"/>
      </svg>
    ),
  },
  {
    name: "Remotive",
    tag: "Remote-First",
    color: "#7C3AED",
    bg: "#F3EEFE",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
      </svg>
    ),
  },
  {
    name: "RemoteOK",
    tag: "Tech Roles",
    color: "#10B981",
    bg: "#E6F7F1",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27H15l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
      </svg>
    ),
  },
  {
    name: "Glassdoor",
    tag: "Reviews & Jobs",
    color: "#0CAA41",
    bg: "#E6F7EC",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 4.8c1.548 0 2.8 1.252 2.8 2.8S13.548 10.4 12 10.4 9.2 9.148 9.2 7.6 10.452 4.8 12 4.8zm6 13.2H6v-1.2c0-3.314 2.686-6 6-6s6 2.686 6 6V18z"/>
      </svg>
    ),
  },
  {
    name: "WeWorkRemotely",
    tag: "Remote Community",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    name: "Wellfound",
    tag: "Startup Jobs",
    color: "#F43F5E",
    bg: "#FFF1F3",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l7 4.5-7 4.5z"/>
      </svg>
    ),
  },
];

/* Double the list for seamless loop */
const doubled = [...platforms, ...platforms];

/* ── Component ────────────────────────────────────────────────────────────── */
export function SourcesStrip() {
  return (
    <section
      id="sources"
      aria-label="Supported job platforms"
      className="w-full border-y border-[#E5E1D8] bg-[#F2EFE9] py-8 overflow-hidden"
    >
      {/* CSS keyframe injection */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 32s linear infinite;
          will-change: transform;
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Label row */}
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B72]">
          Pulls from {platforms.length} platforms
        </span>
        <span className="font-mono text-xs text-[#6B6B72] flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4C9A78] animate-pulse" aria-hidden="true" />
          Live APIs · hourly scan
        </span>
      </div>

      {/* Carousel wrapper — hover pauses via CSS */}
      <div
        className="marquee-wrapper relative flex overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
        aria-hidden="true"
      >
        <div className="marquee-track flex gap-3">
          {doubled.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="group flex items-center gap-3 px-4 py-3 rounded-[12px] border border-[#E5E1D8] bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:border-[#3F5D9E]/40 hover:shadow-[0_4px_16px_rgb(0,0,0,0.08)] transition-all duration-200 cursor-default shrink-0 select-none"
              style={{ minWidth: 190 }}
            >
              {/* Colored logo badge */}
              <span
                className="flex items-center justify-center h-9 w-9 rounded-[8px] shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: p.bg, color: p.color }}
              >
                {p.logo}
              </span>

              {/* Text */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#2A2B2F] leading-tight">{p.name}</span>
                <span className="font-mono text-[10px] text-[#949499] leading-tight mt-0.5">
                  {p.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SourcesStrip;
