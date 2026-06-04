import Nav from "@/components/Nav";
import SearchCard from "@/components/SearchCard";
import Footer from "@/components/Footer";
import HeroDemo from "@/components/HeroDemo";
import CoverageMap from "@/components/CoverageMap";
import PropertyTimeline from "@/components/PropertyTimeline";
import { CITIES_LIST } from "@/lib/cities";
import { Home, ShieldCheck, Eye, ArrowRight, CheckCircle2, Search, Shield, Scale, Calendar, HardHat, FileWarning, Building2, DollarSign } from "lucide-react";
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
                  The truth about any property, <span className="italic">before you commit.</span>
                </h1>
                <p className="font-serif text-lg md:text-xl text-stone-600 max-w-md mb-8 reveal stagger-2">
                  Before the biggest purchase of your life, uncover its permit history, hidden renovations, unpermitted work, and the real cost of what&rsquo;s wrong — straight from official US records.
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

        {/* THE PROBLEM */}
        <section className="py-28 border-t border-stone-900/10 bg-stone-100/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
              § 01 · The Problem
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-stone-900 max-w-3xl leading-tight">
              Roughly <span className="italic">1 in 3 homes</span> hides work that was never permitted, inspected, or closed.
            </h2>
            <p className="font-serif text-lg text-stone-600 max-w-2xl mt-6 leading-relaxed">
              The data is public — but buried in cryptic city databases, written in codes like &ldquo;EW&rdquo; and &ldquo;A2,&rdquo; and nobody hands it to you before you fall in love with a house. Then the title company calls two weeks before closing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-900/10 border border-stone-900/10 mt-14">
              {[
                { icon: FileWarning, title: "Open permits", desc: "Work started but never inspected to completion — can delay or kill your closing." },
                { icon: Building2, title: "Unpermitted additions", desc: "That finished basement may be illegal square footage you inherit." },
                { icon: HardHat, title: "Bad contractors", desc: "The pros who worked on it may have a trail of violations and abandoned jobs." },
                { icon: DollarSign, title: "Surprise costs", desc: "Retroactive fees, re-inspections, and corrections routinely run $10k–$50k+." },
              ].map((x, i) => (
                <div key={i} className="bg-stone-50 p-8 flex flex-col">
                  <x.icon size={20} strokeWidth={1.5} className="mb-5" />
                  <h3 className="font-display text-2xl font-light mb-3">{x.title}</h3>
                  <p className="font-serif text-stone-600 leading-relaxed text-[15px]">{x.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-28 border-t border-stone-900/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-16">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 02 · How It Works
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-stone-900 max-w-xl leading-tight">
                Three steps between you and a costly mistake
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n: "01", icon: Search, title: "Search an address", desc: "Enter any address in a covered city. We instantly pull the city's live permit database — the same public records title companies use, but made readable." },
                { n: "02", icon: Shield, title: "We analyze the risk", desc: "Our engine reads every permit, flags what's open or unpermitted, checks the contractors who worked on it, and estimates the real cost to fix it." },
                { n: "03", icon: Scale, title: "You decide, with leverage", desc: "Get a clear risk score, a plain-English breakdown, and a negotiation brief for your agent. Walk away — or knock thousands off the price." },
              ].map((s, i) => (
                <div key={i} className="border border-stone-900/10 rounded-lg p-9 bg-white flex flex-col">
                  <div className="flex items-start justify-between mb-7">
                    <div className="w-12 h-12 flex items-center justify-center border border-stone-900/10 rounded-md">
                      <s.icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="font-display text-4xl font-light text-stone-200">{s.n}</span>
                  </div>
                  <h3 className="font-display text-2xl font-light mb-3">{s.title}</h3>
                  <p className="font-serif text-stone-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="py-28 border-t border-stone-900/10 bg-white/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-16 max-w-2xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 03 · What You Get
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-stone-900 leading-tight mb-5">
                A complete dossier on the property
              </h2>
              <p className="font-serif text-lg text-stone-600 leading-relaxed">
                Not raw data — answers. Every part of the report is built to change a decision or prevent a loss.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-900/10 border border-stone-900/10">
              {[
                { icon: Shield, title: "Property Risk Score", desc: "One glanceable score, 0 to 100, summarizing the property's permit risk — know in seconds if it's worth a closer look." },
                { icon: Calendar, title: "Property Timeline", desc: "Every permit plotted in time — built, renovated, re-roofed, and every item still left open and unresolved." },
                { icon: HardHat, title: "Contractor Track Record", desc: "We check who did the work and how it went — license status plus their real permit history of violations and abandoned jobs.", exclusive: true },
                { icon: FileWarning, title: "Unpermitted Work Detector", desc: "We reconcile the listing's square footage against permitted work to flag likely illegal additions or conversions." },
                { icon: Scale, title: "Remediation Cost + Brief", desc: "The real dollar cost to clear every open item, plus a one-page negotiation brief your agent can act on." },
                { icon: CheckCircle2, title: "Plain-English Decoder", desc: "No cryptic codes. Every permit translated into language you actually understand, with why it matters." },
              ].map((f, i) => (
                <div key={i} className="bg-stone-50 p-9 flex flex-col">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 flex items-center justify-center border border-stone-900/10 rounded-md">
                      <f.icon size={18} strokeWidth={1.5} />
                    </div>
                    {f.exclusive && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] bg-stone-900 text-stone-50 px-2 py-1 rounded-sm">Exclusive</span>
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-light mb-3">{f.title}</h3>
                  <p className="font-serif text-stone-600 leading-relaxed text-[15px]">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Timeline showcase */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mt-20 pt-16 border-t border-stone-900/10">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">The Timeline</span>
                <h3 className="font-display text-3xl md:text-4xl font-light text-stone-900 leading-tight mb-4">See the property&rsquo;s entire life story</h3>
                <p className="font-serif text-lg text-stone-600 leading-relaxed">Every permit, plotted in time. Built, renovated, re-roofed — and every item still left open and unresolved, flagged the moment you look.</p>
              </div>
              <PropertyTimeline />
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="py-28 border-t border-stone-900/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-16">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 04 · Use Cases
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

        {/* COVERAGE */}
        <section className="py-28 border-t border-stone-900/10 bg-white/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 05 · Coverage
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-stone-900 leading-tight">
                National Database
              </h2>
            </div>

            <div className="mb-12">
              <CoverageMap />
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

        {/* PRICING */}
        <section id="pricing" className="py-28 border-t border-stone-900/10 bg-stone-100/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-16">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 06 · Pricing
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

        {/* FINAL CTA */}
        <section className="py-32 border-t border-stone-900/10 text-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-stone-500 mb-6 block">
              The 30 seconds that saves you $40,000
            </span>
            <h2 className="font-display font-light text-stone-900 leading-[1.05] tracking-[-0.02em] max-w-3xl mx-auto mb-9" style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)" }}>
              Don&rsquo;t fall in love with a house before you know its <span className="italic">secrets.</span>
            </h2>
            <a href="#" className="inline-flex items-center gap-2.5 bg-stone-900 text-stone-50 px-9 py-4 rounded-md font-mono text-[13px] uppercase tracking-[0.12em] hover:bg-stone-800 transition-colors">
              Search a property <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
