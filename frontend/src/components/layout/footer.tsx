import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#E5E1D8] bg-[#F2EFE9] py-8">
      <div className="mx-auto flex max-w-285 flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 font-mono text-xs text-[#6B6B72]">
        {/* Left */}
        <div>
          © 2026 JobMatch · Built in Casablanca.
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="#privacy"
            className="hover:text-[#2A2B2F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-xs cursor-pointer"
          >
            Privacy
          </Link>
          <span className="text-[#D8D2C4]" aria-hidden="true">·</span>
          <Link
            href="#terms"
            className="hover:text-[#2A2B2F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-xs cursor-pointer"
          >
            Terms
          </Link>
          <span className="text-[#D8D2C4]" aria-hidden="true">·</span>
          <Link
            href="#status"
            className="hover:text-[#2A2B2F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-xs cursor-pointer"
          >
            Status
          </Link>
          <span className="text-[#D8D2C4]" aria-hidden="true">·</span>
          <a
            href="mailto:hello@jobmatch.app"
            className="hover:text-[#2A2B2F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-xs cursor-pointer"
          >
            hello@jobmatch.app
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
