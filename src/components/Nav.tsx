"use client";

import Link from "next/link";
import { Building2, Search } from "lucide-react";

export default function Nav() {
  const scrollToSearch = () => {
    const el = document.getElementById("search");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-900/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 bg-stone-900 rounded-md flex items-center justify-center flex-shrink-0">
            <Building2 size={17} className="text-stone-50" strokeWidth={1.6} />
          </span>
          <span className="font-display text-xl font-medium tracking-[-0.01em] text-stone-900">
            PermitPeek
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-mono text-[12px] uppercase tracking-[0.08em] text-stone-700">
          <Link href="/#how" className="hover:text-stone-900 hover-underline pb-0.5">How it works</Link>
          <Link href="/#features" className="hover:text-stone-900 hover-underline pb-0.5">What you get</Link>
          <Link href="/#coverage" className="hover:text-stone-900 hover-underline pb-0.5">Coverage</Link>
          <Link href="/faq" className="hover:text-stone-900 hover-underline pb-0.5">FAQ</Link>
          <button
            onClick={scrollToSearch}
            className="bg-stone-900 text-stone-50 px-4 py-2 rounded-md tracking-[0.1em] hover:bg-stone-800 transition-colors"
          >
            Search a property
          </button>
        </div>

        {/* Mobile search button */}
        <button
          onClick={scrollToSearch}
          className="md:hidden inline-flex items-center gap-2 bg-stone-900 text-stone-50 px-4 py-2.5 rounded-md font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-stone-800 transition-colors flex-shrink-0"
          aria-label="Search a property"
        >
          <Search size={15} strokeWidth={2} />
          Search
        </button>
      </div>
    </nav>
  );
}
