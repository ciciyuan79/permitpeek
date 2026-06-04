import Nav from "@/components/Nav";
import SearchCard from "@/components/SearchCard";
import Footer from "@/components/Footer";
import HeroDemo from "@/components/HeroDemo";
import { CITIES_LIST } from "@/lib/cities";
import { Home, ShieldCheck, Eye, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative pt-20 pb-24 overflow-hidden dot-grain">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500 mb-6 block reveal stagger-1">
                  Property Intelligence · Public Records, Decoded
                </span>
                <h1 className="font-display font-light text-stone-900 leading-[0.98] tracking-[-0.02em] mb-6 reveal stagger-1" style={{ fontSize: "clamp(2.75rem, 5vw, 4.75rem)" }}>
                  Is your house <span className="italic">legally</span> built?
                </h1>
                <p className="font-serif text-lg md:text-xl text-stone-600 max-w-md mb-8 reveal stagger-2">
                  Uncover hidden renovations, unpermitted work, contractor track records, and official history from US municipal building records.
                </p>
                <div className="reveal stagger-3">
                  <SearchCard />
                </div>
              </div>

              <div className="reveal stagger-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-3 block text-center lg:text-left">
                  ↓ A sample report, in real time
                </span>
                <HeroDemo />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-stone-900/10 mt-20 reveal stagger-3">
              {[
                ["8.8M+", "Permits indexed"],
                ["1,800+", "Jurisdictions"],
                ["Daily", "Data refresh"],
                ["30s", "To a full report"],
              ].map((s, i) => (
                <div key={i} className={`py-8 px-6 ${i === 0 ? "" : "border-l border-stone-900/10"} ${i === 2 ? "border-l-0 md:border-l" : ""}`}>
                  <div className="font-display font-light text-stone-900 leading-none" style={{ fontSize: "clamp(2rem,3vw,2.6rem)" }}>{s[0]}</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500 mt-3">{s[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="py-28 border-t border-stone-900/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-16">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 02 · Use Cases
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-stone-900 max-w-lg leading-tight">
                Three reasons people search a permit
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
              {[
                { title: "Buying a Home", desc: "Verify that the basement renovation or deck was actually permitted. Don't inherit a legal nightmare.", icon: Home },
                { title: "Contractor Verification", desc: "Check if your contractor is actually pulling the permits they promised to handle for your project.", icon: ShieldCheck },
                { title: "Neighbor Watch", desc: "Stay informed about construction in your neighborhood. Get alerts when new work is filed nearby.", icon: Eye },
              ].map((reason, i) => (
                <div key={i} className="group">
                  <div className="w-12 h-12 flex items-center justify-center border border-stone-900/10 rounded-md mb-7 group-hover:bg-stone-200/60 transition-colors duration-300">
                    <reason.icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-2xl font-light mb-4">{reason.title}</h3>
                  <p className="font-serif text-stone-600 leading-relaxed">{reason.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CITIES */}
        <section className="py-28 border-t border-stone-900/10 bg-white/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-16">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 03 · Coverage
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-stone-900 leading-tight">
                National Database
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-900/10 border border-stone-900/10">
              {CITIES_LIST.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.stateSlug || city.state.toLowerCase()}/${city.slug}/building-permits`}
                  className="bg-stone-50 p-12 hover:bg-white transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-2 block">
                      {city.state} · Official Data
                    </span>
                    <h3 className="font-display text-3xl font-light mb-4">{city.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-900 mt-8">
                    View Registry <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING (monochrome) */}
        <section id="pricing" className="py-28 border-t border-stone-900/10 bg-stone-100/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-16">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 04 · Pricing
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-stone-900 leading-tight">
                Access public history
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Free Search", price: "$0", period: "Per address", features: ["First 2 permits", "Basic address check", "Risk score indicator", "No credit card"], cta: "Search Now", highlight: false },
                { title: "Full Report", price: "$9", period: "One-time", features: ["Unlimited permits", "Detailed descriptions", "Contractor details", "PDF Download"], cta: "Unlock Report", highlight: true },
                { title: "Address Watch", price: "$19", period: "Per month", features: ["Monitor 5 addresses", "Instant email alerts", "Monthly local digest", "Priority support"], cta: "Subscribe Now", highlight: false },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`relative p-10 rounded-sm flex flex-col bg-white ${plan.highlight ? "border border-stone-900 shadow-[0_24px_50px_-20px_rgba(28,25,23,0.18)]" : "border border-stone-900/10"}`}
                >
                  {plan.highlight && (
                    <span className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-[0.1em] bg-stone-900 text-stone-50 px-2.5 py-1 rounded-sm">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-8">{plan.title}</h3>
                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-5xl font-display font-light text-stone-900">{plan.price}</span>
                    <span className="font-serif text-stone-500 italic">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="font-serif text-sm text-stone-700 flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-stone-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 text-sm uppercase tracking-widest font-mono rounded-[2px] border border-stone-900 transition-colors ${plan.highlight ? "bg-stone-900 text-stone-50 hover:bg-stone-800" : "bg-white text-stone-900 hover:bg-stone-900/5"}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
