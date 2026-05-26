import Nav from "@/components/Nav";
import SearchCard from "@/components/SearchCard";
import Footer from "@/components/Footer";
import { CITIES_LIST } from "@/lib/cities";
import { Home, ShieldCheck, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden dot-grain">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="font-display font-light text-stone-900 leading-[0.95] tracking-[-0.02em] mb-8 reveal stagger-1" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}>
                Is your house <span className="italic">legally</span> built?
              </h1>
              <p className="font-serif text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto reveal stagger-2">
                Uncover hidden renovations, unpermitted work, and official history 
                from US municipal building records.
              </p>
            </div>
            
            <SearchCard />
            
            {/* Live Ticker */}
            <div className="mt-20 flex justify-center reveal stagger-3">
              <div className="inline-flex items-center gap-2 px-6 py-2 border border-stone-900/10 rounded-full bg-stone-50/50 backdrop-blur-sm shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
                  8.8M+ permits indexed · 1,800+ jurisdictions · Daily refresh
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Reasons Section */}
        <section className="py-32 border-t border-stone-900/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                  § 02 · Use Cases
                </span>
                <h2 className="font-display text-5xl font-light text-stone-900 max-w-lg leading-tight">
                  Three reasons people search a permit
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                {
                  title: "Buying a Home",
                  desc: "Verify that the basement renovation or deck was actually permitted. Don't inherit a legal nightmare.",
                  icon: Home
                },
                {
                  title: "Contractor Verification",
                  desc: "Check if your contractor is actually pulling the permits they promised to handle for your project.",
                  icon: ShieldCheck
                },
                {
                  title: "Neighbor Watch",
                  desc: "Stay informed about construction in your neighborhood. Get alerts when new work is filed nearby.",
                  icon: Eye
                }
              ].map((reason, i) => (
                <div key={i} className="group">
                  <div className="w-12 h-12 flex items-center justify-center border border-stone-900/10 mb-8 group-hover:bg-stone-900 group-hover:text-stone-50 transition-colors duration-300">
                    <reason.icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-2xl font-light mb-4">{reason.title}</h3>
                  <p className="font-serif text-stone-600 leading-relaxed">
                    {reason.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-32 border-t border-stone-900/10 bg-white/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-20">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 03 · Coverage
              </span>
              <h2 className="font-display text-5xl font-light text-stone-900 leading-tight">
                National Database
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1px bg-stone-900/10 border border-stone-900/10">
              {CITIES_LIST.map((city) => (
                <Link 
                  key={city.slug}
                  href={`/${city.stateSlug || city.state.toLowerCase()}/${city.slug}/building-permits`}
                  className="bg-white p-12 hover:bg-stone-50 transition-colors group flex flex-col justify-between"
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

        {/* Pricing Section */}
        <section id="pricing" className="py-32 border-t border-stone-900/10 bg-stone-900 text-stone-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-20">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400 mb-4 block">
                § 04 · Pricing
              </span>
              <h2 className="font-display text-5xl font-light leading-tight">
                Access public history
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Free Search",
                  price: "$0",
                  period: "Per address",
                  features: ["First 2 permits", "Basic address check", "Risk score indicator", "No credit card"],
                  cta: "Search Now",
                  highlight: false
                },
                {
                  title: "Full Report",
                  price: "$9",
                  period: "One-time",
                  features: ["Unlimited permits", "Detailed descriptions", "Contractor details", "PDF Download"],
                  cta: "Unlock Report",
                  highlight: true
                },
                {
                  title: "Address Watch",
                  price: "$19",
                  period: "Per month",
                  features: ["Monitor 5 addresses", "Instant email alerts", "Monthly local digest", "Priority support"],
                  cta: "Subscribe Now",
                  highlight: false
                }
              ].map((plan, i) => (
                <div 
                  key={i} 
                  className={`p-10 border ${plan.highlight ? 'border-stone-50' : 'border-stone-50/10'} flex flex-col`}
                >
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400 mb-8">{plan.title}</h3>
                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-5xl font-display font-light">{plan.price}</span>
                    <span className="font-serif text-stone-400 italic">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="font-serif text-sm text-stone-300 flex items-center gap-3">
                        <div className="w-1 h-1 bg-stone-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 text-sm uppercase tracking-widest font-mono ${plan.highlight ? 'bg-stone-50 text-stone-900' : 'border border-stone-50/20 text-stone-50 hover:bg-stone-50/5'} transition-colors rounded-[2px]`}>
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
