// src/components/Footer.tsx
import Link from "next/link";
import { CITIES_LIST } from "@/lib/cities";

export default function Footer() {
  return (
    <footer className="border-t border-stone-900/10 bg-stone-50">
      {/* Graphic band */}
      <div className="border-b border-stone-900/10 dot-grain">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-stone-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M10 26 L24 12 L38 26 M24 22 C18 26 18 33 24 33 C30 33 30 40 24 40 C18 40 18 33 24 33 C30 33 30 26 24 22 Z" fill="none" stroke="#faf9f7" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="font-display text-2xl font-light text-stone-900 leading-none">PermitPeek</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mt-1.5">Public records, decoded</div>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center justify-center gap-2 bg-stone-900 text-stone-50 px-7 py-3.5 rounded-md font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-stone-800 transition-colors">
            Search a property
          </Link>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <p className="font-serif text-sm text-stone-600 leading-relaxed max-w-xs">
            A civic records service for property transparency. We organize public building-permit data to help buyers, owners, and professionals make informed decisions.
          </p>
        </div>

        {/* Coverage */}
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-900 mb-5 font-bold">
            Coverage
          </h4>
          <ul className="space-y-3">
            {CITIES_LIST.filter((c) => c.tier === 1).map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/${city.stateSlug}/${city.slug}/building-permits`}
                  className="font-serif text-sm text-stone-600 hover:text-stone-900 hover-underline"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-900 mb-5 font-bold">
            Company
          </h4>
          <ul className="space-y-3 font-serif text-sm text-stone-600">
            <li><Link href="/contact" className="hover-underline hover:text-stone-900">Contact</Link></li>
            <li><Link href="/terms" className="hover-underline hover:text-stone-900">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover-underline hover:text-stone-900">Privacy Policy</Link></li>
            <li><Link href="/data-policy" className="hover-underline hover:text-stone-900">Data Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-900/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-400">
            © {new Date().getFullYear()} PermitPeek · Data via public open-data APIs · Not legal or financial advice
          </p>
        </div>
      </div>
    </footer>
  );
}
