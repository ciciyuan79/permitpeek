// src/components/Footer.tsx
import Link from "next/link";
import { CITIES_LIST } from "@/lib/cities";

export default function Footer() {
  return (
    <footer className="border-t border-stone-900/10 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl font-semibold text-stone-900 mb-3">
            PermitPeek
          </h3>
          <p className="font-serif text-sm text-stone-600 leading-relaxed max-w-xs">
            A serious civic records publication dedicated to property transparency.
            We index public building permit data to help homebuyers, owners, and
            professionals make informed decisions.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-400 mt-6">
            © {new Date().getFullYear()} PermitPeek · Data provided by Socrata Open Data APIs
          </p>
        </div>

        {/* Coverage */}
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-900 mb-6 font-bold">
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

        {/* Legal */}
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-900 mb-6 font-bold">
            Legal
          </h4>
          <ul className="space-y-3 font-serif text-sm text-stone-600">
            <li>
              <Link href="/terms" className="hover-underline hover:text-stone-900">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover-underline hover:text-stone-900">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/data-policy" className="hover-underline hover:text-stone-900">
                Data Policy
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
