"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import AuthButton from "@/components/AuthButton";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const goToSearch = () => {
    if (pathname === "/") {
      const el = document.getElementById("search");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      router.push("/#search");
    }
  };
  return (
    <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-900/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 bg-stone-900 rounded-md flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path
                d="M10 26 L24 12 L38 26 M24 22 C18 26 18 33 24 33 C30 33 30 40 24 40 C18 40 18 33 24 33 C30 33 30 26 24 22 Z"
                fill="none"
                stroke="#faf9f7"
                strokeWidth="2.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
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
          <AuthButton />
          <button
            type="button"
            onClick={goToSearch}
            className="bg-stone-900 text-stone-50 px-4 py-2 rounded-md tracking-[0.1em] hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Search a property
          </button>
        </div>
        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-stone-700">
          <AuthButton />
          <button
            type="button"
            onClick={goToSearch}
            className="inline-flex items-center gap-2 bg-stone-900 text-stone-50 px-4 py-2.5 rounded-md hover:bg-stone-800 transition-colors flex-shrink-0 cursor-pointer active:scale-95"
            aria-label="Search a property"
          >
            <Search size={15} strokeWidth={2} />
            Search
          </button>
        </div>
      </div>
    </nav>
  );
}
