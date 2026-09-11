"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[62px] w-full border-b border-[#E5E1D8] bg-[#FAF9F6] transition-colors">
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Wordmark Jobmatch */}
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-[#2A2B2F] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-[4px] cursor-pointer"
          aria-label="JobMatch Home"
        >
          Job<span className="italic text-[#3F5D9E]">match</span>
        </Link>

        {/* Right: Desktop Navigation Links (Pricing removed) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2A2B2F]">
          <Link
            href="#how"
            className="text-[#6B6B72] hover:text-[#2A2B2F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-[4px] cursor-pointer"
          >
            How it works
          </Link>
          <Link
            href="#sources"
            className="text-[#6B6B72] hover:text-[#2A2B2F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-[4px] cursor-pointer"
          >
            Sources
          </Link>
          <Link
            href="/login"
            className="text-[#6B6B72] hover:text-[#2A2B2F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-[4px] cursor-pointer"
          >
            Sign in
          </Link>

          <Link href="/register" className="cursor-pointer">
            <Button size="sm" className="h-9 px-4 text-xs font-medium cursor-pointer">
              Get started
            </Button>
          </Link>
        </nav>

        {/* Mobile: Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-[8px] text-[#2A2B2F] hover:bg-[#F2EFE9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E1D8] bg-[#FAF9F6] px-4 py-6 shadow-none">
          <nav className="flex flex-col gap-4 text-base font-medium text-[#2A2B2F]">
            <Link
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#6B6B72] hover:text-[#2A2B2F] transition-colors cursor-pointer"
            >
              How it works
            </Link>
            <Link
              href="#sources"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#6B6B72] hover:text-[#2A2B2F] transition-colors cursor-pointer"
            >
              Sources
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#6B6B72] hover:text-[#2A2B2F] transition-colors cursor-pointer"
            >
              Sign in
            </Link>
            <div className="pt-2 border-t border-[#E5E1D8]">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                <Button className="w-full justify-center cursor-pointer">
                  Get started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export { Header };
