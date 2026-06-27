// src/app/report/page.tsx
// Coverage & Data Source panel placed after the risk assessment.
// REPLACE your entire src/app/report/page.tsx with this file

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES } from "@/lib/cities";
import { fetchPermitsWithCount } from "@/lib/socrata";
import { analyzePermits } from "@/lib/analyze";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScoreCard from "@/components/report/ScoreCard";
import PermitRow from "@/components/report/PermitRow";
import PaywallOverlay from "@/components/report/PaywallOverlay";
import VerificationGuide from "@/components/report/VerificationGuide";
import CoverageSourcePanel from "@/components/report/CoverageSourcePanel";

interface ReportPageProps {
  searchParams: Promise<{
    city?: string;
    address?: string;
    unlocked?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Property Permit Report | PermitPeek",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const { city: citySlug, address, unlocked } = await searchParams;

  if (!citySlug || !address) {
    notFound();
  }

  const city = CITIES[citySlug];
  if (!city) {
    notFound();
  }

  let permits = [];
  let analysis = null;
  let totalCount = 0;

  try {
    const result = await fetchPermitsWithCount(city, address);
    permits = result.permits;
    totalCount = result.totalCount;
    analysis = analyzePermits(permits, totalCount);
  } catch (error) {
    console.error("Report generation error:", error);
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Nav />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h1 className="font-display text-3xl font-light mb-4">Report Unavailable</h1>
            <p className="font-serif text-stone-600">
              We encountered an error while connecting to the {city.name} data registry. 
              Please verify the address and try again.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isUnlocked = unlocked === "true";
  const visiblePermits = isUnlocked ? permits : permits.slice(0, 2);
  
  // Use real total for hidden count calculation
  const hiddenCount = isUnlocked 
    ? 0 
    : Math.max(0, totalCount - visiblePermits.length);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Nav />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="pt-16 pb-12 border-b border-stone-900/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
              Property Registry Report · File №{Math.floor(Math.random() * 9000) + 1000}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-light text-stone-900 leading-tight max-w-4xl">
              {address.toUpperCase()}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">
                Searched within
              </span>
              <span className="font-mono text-xs uppercase tracking-wider bg-stone-900 text-stone-50 px-2.5 py-1 rounded-[2px]">
                {city.name}, {city.state}
              </span>
              <span className="font-serif text-sm text-stone-500 italic">
                — wrong city? Change it on the search bar.
              </span>
            </div>
          </div>
        </section>

        {/* Analysis Overview */}
        <section className="py-12 border-b border-stone-900/10 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <ScoreCard score={analysis.score} scoreValue={analysis.scoreValue} summary={analysis.summary} />
              </div>
              
              <div className="lg:col-span-8">
                <div className="mb-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-6 block">
                    § 01 · Risk Assessment
                  </span>
                  <div className="space-y-4">
                    {analysis.flags.length > 0 ? (
                      analysis.flags.map((flag, i) => (
                        <div key={i} className={`p-4 border-l-2 ${
                          flag.level === 'high' ? 'border-red-900 bg-red-50/30' : 
                          flag.level === 'med' ? 'border-amber-900 bg-amber-50/30' : 
                          'border-stone-900 bg-stone-50/30'
                        }`}>
                          <div className="flex gap-3">
                            <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] self-start mt-0.5 ${
                              flag.level === 'high' ? 'bg-red-900 text-red-50' : 
                              flag.level === 'med' ? 'bg-amber-900 text-amber-50' : 
                              'bg-stone-900 text-stone-50'
                            }`}>
                              {flag.level}
                            </span>
                            <p className="font-serif text-stone-900">{flag.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="font-serif text-stone-600 italic">No significant risk flags detected for this history.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-stone-900/5">
                  {[
                    { label: "Total Records", value: analysis.stats.total.toLocaleString() },
                    { label: "Open", value: analysis.stats.open.toString() },
                    { label: "Expired", value: analysis.stats.expired.toString() },
                    { label: "Finaled", value: analysis.stats.finaled.toString() },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-1">
                        {stat.label}
                      </div>
                      <div className="font-display text-2xl font-light text-stone-900">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
                
                {analysis.stats.total > analysis.stats.showing && (
                  <p className="mt-6 font-serif text-xs text-stone-500 italic">
                    Recent counts (Open / Expired / Finaled) based on the {analysis.stats.showing} most recent permits.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Coverage & Data Source */}
        <CoverageSourcePanel city={city} totalCount={totalCount} />

        {/* Permit List */}
        <section className="py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 02 · Permit Registry
              </span>
              <h2 className="font-display text-3xl font-light">Historical Records</h2>
              {totalCount > permits.length && (
                <p className="font-serif text-sm text-stone-500 mt-2">
                  Showing the {permits.length} most recent of {totalCount.toLocaleString()} total permits
                </p>
              )}
              {permits.length > 0 && (city.dataPortalUrl || city.permitAuthorityUrl) && (
                
                  href={city.dataPortalUrl || city.permitAuthorityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-stone-600 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 pb-0.5 transition-colors"
                >
                  Verify any permit at {city.name}&rsquo;s official records
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
            
            <div className="space-y-1px bg-stone-900/10 border border-stone-900/10 relative">
              {permits.length > 0 ? (
                <>
                  {visiblePermits.map((permit, i) => (
                    <PermitRow key={permit.id} permit={permit} index={i + 1} />
                  ))}
                  
                  {!isUnlocked && hiddenCount > 0 && (
                    <>
                      {permits.slice(2, 5).map((permit, i) => (
                        <div key={permit.id} className="blur-[6px] select-none pointer-events-none opacity-40">
                          <PermitRow permit={permit} index={i + 3} />
                        </div>
                      ))}
                      <PaywallOverlay hiddenCount={hiddenCount} address={address} city={citySlug} />
                    </>
                  )}
                </>
              ) : (
                <div className="bg-white p-16 md:p-20 text-center">
                  <p className="font-display text-2xl font-light text-stone-900 mb-3">
                    No permit records found
                  </p>
                  <p className="font-serif text-stone-600 leading-relaxed max-w-lg mx-auto">
                    We couldn&rsquo;t find permits for this address in <strong>{city.name}, {city.state}</strong>.
                    That can mean the property genuinely has no permit history, the address needs a
                    different format (try the street number without an apt/unit), or
                    <strong> the property is in a different city</strong> than the one selected.
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 mt-6">
                    PermitPeek currently covers select US cities only
                  </p>
                </div>
              )}
            </div>

            {isUnlocked && (
              <div className="mt-16 p-12 bg-stone-900 text-stone-50 text-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-4 block">
                  Upgrade Available
                </span>
                <h3 className="font-display text-3xl font-light mb-6">
                  Monitor this property for <span className="italic">changes</span>
                </h3>
                <p className="font-serif text-stone-400 max-w-xl mx-auto mb-10">
                  Get notified the moment a new permit is filed for this address. 
                  Includes monthly neighborhood trend reports.
                </p>
                <button className="bg-stone-50 text-stone-900 px-8 py-3 font-mono text-xs uppercase tracking-widest hover:bg-stone-200 transition-colors">
                  Subscribe for $19/mo
                </button>
              </div>
            )}
          </div>
        </section>
        
        <VerificationGuide
          citySlug={citySlug}
          cityName={city.name}
          hasOpenPermits={analysis.stats.open > 0}
        />
      </main>
      
      <Footer />
    </div>
  );
}
