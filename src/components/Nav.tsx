import Link from "next/link";
import { CITIES_LIST } from "@/lib/cities";

export default function Nav() {
  return (
    <nav className="border-b border-stone-900/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight font-light">
          PermitPeek
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {CITIES_LIST.slice(0, 3).map((city) => (
              <Link 
                key={city.slug} 
                href={`/${city.stateSlug || city.state.toLowerCase()}/${city.slug}/building-permits`}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
          <Link 
            href="/#pricing" 
            className="bg-stone-900 text-stone-50 px-5 py-2 text-sm font-light hover:bg-stone-800 transition-colors rounded-[4px]"
          >
            Pricing
          </Link>
        </div>
      </div>
    </nav>
  );
}
