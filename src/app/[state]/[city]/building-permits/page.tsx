import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES_LIST } from "@/lib/cities";
import Nav from "@/components/Nav";
import SearchCard from "@/components/SearchCard";
import Footer from "@/components/Footer";
import { ShieldCheck, Home, Eye, HelpCircle } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    state: string;
    city: string;
  }>;
}

export async function generateStaticParams() {
  return CITIES_LIST.map((city) => ({
    state: city.stateSlug || city.state.toLowerCase(),
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = CITIES_LIST.find((c) => c.slug === citySlug);

  if (!city) return { title: "City Not Found" };

  return {
    title: `${city.name} Building Permit Lookup | PermitPeek`,
    description: `Search official building permits in ${city.name}, ${city.state}. Access public records for renovations, electrical work, and additions.`,
  };
}

export default async function CityLandingPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = CITIES_LIST.find((c) => c.slug === citySlug);

  if (!city) {
    notFound();
  }

  // Get 3 nearby cities (just the next 3 in the list for now)
  const nearbyCities = CITIES_LIST.filter((c) => c.slug !== citySlug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `PermitPeek ${city.name} Permit Lookup`,
    "description": `Official building permit search for properties in ${city.name}, ${city.state}.`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="pt-20 pb-24 border-b border-stone-900/10 bg-stone-50 dot-grain">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-12">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 01 · Jurisdiction: {city.state}
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-light text-stone-900 leading-tight mb-8">
                {city.name} <span className="italic">Building</span> Permit Lookup
              </h1>
              <p className="font-serif text-xl text-stone-600 max-w-2xl mx-auto mb-12">
                Access the official registry of building permits for any address 
                in {city.name}. Verify legal history and safety compliance.
              </p>
              <SearchCard />
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 border-b border-stone-900/10 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Total Permits", value: "1.2M+" },
                { label: "Last 12 Months", value: "42,000" },
                { label: "Population", value: "Citywide" },
                { label: "Avg Review", value: "14 Days" },
              ].map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                    {stat.label}
                  </div>
                  <div className="font-display text-2xl font-light text-stone-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Content */}
        <section className="py-24 border-b border-stone-900/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-6 block">
                  § 02 · Authority Details
                </span>
                <h2 className="font-display text-4xl font-light mb-8 leading-tight">
                  Navigating the {city.name} permit registry
                </h2>
                <div className="font-serif text-lg text-stone-600 space-y-6 leading-relaxed">
                  <p>
                    Building permits in {city.name} are essential public records that 
                    ensure every renovation, addition, and structural change meets the 
                    city&apos;s safety and zoning standards. Whether you are a homebuyer 
                    performing due diligence or a resident curious about neighborhood 
                    construction, these records provide the only verified source of 
                    truth for property modifications.
                  </p>
                  <p>
                    Our database pulls directly from {city.name}&apos;s Department of Buildings 
                    open data portal, providing real-time access to filings, approvals, 
                    and inspection results. This includes everything from large-scale 
                    new construction to minor electrical and plumbing alterations.
                  </p>
                  <p>
                    Failure to secure proper permits can lead to significant legal 
                    challenges, including fines, required demolition of unpermitted 
                    work, and complications during the sale of a property. By using 
                    PermitPeek, you can quickly identify &quot;red flag&quot; properties that 
                    show evidence of major work without a corresponding permit trail.
                  </p>
                </div>
              </div>
              
              <div className="space-y-12">
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-900 mb-6 font-bold">
                    Use Cases
                  </h3>
                  <div className="space-y-8">
                    {[
                      { icon: Home, text: "Pre-purchase due diligence for homebuyers" },
                      { icon: ShieldCheck, text: "Contractor license & permit verification" },
                      { icon: Eye, text: "Neighborhood construction monitoring" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <item.icon size={18} className="text-stone-400 mt-1 shrink-0" />
                        <span className="font-serif text-stone-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 border-b border-stone-900/10 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-16">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                § 03 · Frequently Asked
              </span>
              <h2 className="font-display text-4xl font-light leading-tight">
                Permit Registry FAQ
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {[
                { 
                  q: "How far back do the records go?", 
                  a: `Records for ${city.name} typically go back several decades, though digital records are most comprehensive for work performed after 1990.` 
                },
                { 
                  q: "Are these records official?", 
                  a: "Yes. PermitPeek aggregates data directly from municipal open data APIs provided by city government offices." 
                },
                { 
                  q: "What if I find work without a permit?", 
                  a: "Unpermitted work is a common risk. We recommend consulting a licensed inspector or real estate attorney to assess the impact on property value." 
                },
                { 
                  q: "Does every minor repair need a permit?", 
                  a: "Most cosmetic repairs do not, but any work involving structural, electrical, or plumbing systems almost always requires a filing." 
                },
                { 
                  q: "How often is the database updated?", 
                  a: "We refresh our data daily to ensure you have access to the latest filings and inspection results." 
                }
              ].map((faq, i) => (
                <div key={i}>
                  <h4 className="font-display text-xl font-light mb-3 flex gap-2">
                    <HelpCircle size={18} className="text-stone-400 mt-1 shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="font-serif text-stone-600 leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Cities */}
        <section className="py-24 border-b border-stone-900/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-8 block">
              § 04 · Explore More
            </span>
            <div className="flex flex-wrap justify-center gap-12">
              {nearbyCities.map((c) => (
                <Link 
                  key={c.slug} 
                  href={`/${c.stateSlug || c.state.toLowerCase()}/${c.slug}/building-permits`}
                  className="font-display text-3xl font-light text-stone-900 hover:italic hover-underline transition-all"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Search */}
        <section className="py-32 bg-stone-900 text-stone-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
            <h2 className="font-display text-5xl font-light mb-12">
              Ready to check <span className="italic">another</span> address?
            </h2>
            <SearchCard />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
