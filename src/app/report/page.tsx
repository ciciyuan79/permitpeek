// src/app/report/page.tsx

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
  robots: { index: false, follow: false },
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
              We encountered an error while connecting to the {city.name} data registry. Please verify the address and try again.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isUnlocked = unlocked === "true";
  const visiblePermits = isUnlocked ? permits : permits.slice(0, 2);
  const hiddenCount = isUnlocked ? 0 : Math.max(0, totalCount - visiblePermits.length);
  const verifyUrl = city.dataPortalUrl || city.permitAuthorityUrl || "";

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Nav />

      <main className="flex-grow">
        <section className="pt-16 pb-12 border-b border-stone-900/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
              Property Registry Report · File No {Math.floor(Math.random() * 9000) + 1000}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-light text-stone-900 leading-tight max-w-4xl">
              {address.toUpperCase()}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">Searched within</span>
              <span className="font-mono text-xs uppercase tracking-wider bg-stone-900 text-stone-50 px-2.5 py-1 rounded-[2px]">
                {city.name}, {city.state}
              </span>
              <span className="font-serif text-sm text-stone-500 italic">wrong city? Change it on the search bar.</span>
            </div>
          </div>
        </section>

        <section className="py-12 border-b border-stone-900/10 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <ScoreCard score={analysis.score} scoreValue={analysis.scoreValue} summary={analysis.summary} />
              </div>

              <div className="lg:col-span-8"> 
                <div className="mb-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-6 block">
                    Section 01 · Risk Assessment
                  </span>
                  <div className="space-y-4">
                    {analysis.flags.length > 0 ? (
                      analysis.flags.map((flag, i) => (
                        <div key={i} className={`p-4 border-l-2 ${flag.level === "high" ? "border-red-900 bg-red-50/30" : flag.level === "med" ? "border-amber-900 bg-amber-50/30" : "border-stone-900 bg-stone-50/30"}`}>
                          <div className="flex gap-3">
                            <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] self-start mt-0.5 ${flag.level === "high" ? "bg-red-900 text-red-50" : flag.level === "med" ? "bg-amber-900 text-amber-50" : "bg-stone-900 text-stone-50"}`}>
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

                {/* Why this score — factor breakdown */}
                {analysis.scoreFactors && analysis.scoreFactors.length > 0 && (
                  <div className="mb-8 border border-stone-900/10 rounded-lg overflow-hidden">
                    <div className="px-5 py-3 bg-stone-100/70 border-b border-stone-900/10">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
                        Why this score — {analysis.scoreValue}/100
                      </span>
                    </div>
                    <div className="divide-y divide-stone-900/8">
                      {analysis.scoreFactors.map((f, i) => (
                        <div key={i} className="px-5 py-4 flex gap-4">
                          <div className="shrink-0 w-14 text-right">
                            <span className={`font-display text-xl font-light ${f.points < 0 ? "text-red-800" : f.points > 0 ? "text-stone-900" : "text-stone-400"}`}>
                              {f.points > 0 ? `${f.points}` : f.points < 0 ? `${f.points}` : "—"}
                            </span>
                          </div>
                          <div>
                            <div className="font-serif text-[15px] text-stone-900 leading-snug">{f.label}</div>
                            <div className="text-[13px] text-stone-500 mt-0.5 leading-relaxed">{f.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-stone-900/5">
                  {[
                    { label: "Total Records", value: analysis.stats.total.toLocaleString() },
                    { label: "Open", value: analysis.stats.open.toString() },
                    { label: "Expired", value: analysis.stats.expired.toString() },
                    { label: "Finaled", value: analysis.stats.finaled.toString() },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-1">{stat.label}</div>
                      <div className="font-display text-2xl font-light text-stone-900">{stat.value}</div>
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

        <CoverageSourcePanel city={city} totalCount={totalCount} />

        <section className="py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                Section 02 · Permit Registry
              </span>
              <h2 className="font-display text-3xl font-light">Historical Records</h2>
              {totalCount > permits.length && (
                <p className="font-serif text-sm text-stone-500 mt-2">
                  Showing the {permits.length} most recent of {totalCount.toLocaleString()} total permits
                </p>
              )}
              {permits.length > 0 && verifyUrl !== "" && (
                <p className="mt-4">
                  <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-stone-600 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 pb-0.5 transition-colors">
                    Verify any permit at {city.name} official records
                  </a>
                </p>
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
                  <p className="font-display text-2xl font-light text-stone-900 mb-3">No permit records found</p>
                  <p className="font-serif text-stone-600 leading-relaxed max-w-lg mx-auto">
                    We could not find permits for this address in {city.name}, {city.state}. That can mean the property genuinely has no permit history, the address needs a different format (try the street number without an apt/unit), or the property is in a different city than the one selected.
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 mt-6">
                    PermitPeek currently covers select US cities only
                  </p>
                </div>
              )}
            </div>

            {isUnlocked && (
              <div className="mt-16 p-12 bg-stone-900 text-stone-50 text-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-4 block">Upgrade Available</span>
                <h3 className="font-display text-3xl font-light mb-6">Monitor this property for changes</h3>
                <p className="font-serif text-stone-400 max-w-xl mx-auto mb-10">
                  Get notified the moment a new permit is filed for this address. Includes monthly neighborhood trend reports.
                </p>
                <button className="bg-stone-50 text-stone-900 px-8 py-3 font-mono text-xs uppercase tracking-widest hover:bg-stone-200 transition-colors">
                  Subscribe for $19/mo
                </button>
              </div>
            )}
          </div>
        </section>

        <VerificationGuide citySlug={citySlug} cityName={city.name} hasOpenPermits={analysis.stats.open > 0} />
      </main>

      <Footer />
    </div>
  );
}
