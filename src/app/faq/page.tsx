import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ | PermitPeek",
  description: "Frequently asked questions about PermitPeek — where our building permit data comes from, how accurate it is, pricing and refunds, and privacy.",
};

const SECTIONS = [
  {
    marker: "§ 01",
    title: "The Data & Where It Comes From",
    faqs: [
      {
        q: "Where does PermitPeek's data come from?",
        a: "Every report is built from official public records published by city and county governments through their open-data portals. We don't create or alter the data — we read it directly from the same registries that municipal building departments and title companies use, and translate it into plain English.",
      },
      {
        q: "Is this data official?",
        a: "Yes. The underlying permit records are official government data. However, PermitPeek is an independent service and is not affiliated with, endorsed by, or operated by any government agency. We organize and interpret public records; we don't issue or certify them.",
      },
      {
        q: "Which cities do you cover?",
        a: "We're live in major US markets and expanding city by city, with more added regularly. You can see the current coverage on our homepage. If your city isn't listed yet, the records for it aren't available through our service — but we're working to add it.",
      },
      {
        q: "Why do some addresses show no permits?",
        a: "A few reasons: the property genuinely may have no permit history on file; the work was done without a permit (which is itself worth knowing); the address may be formatted differently in the city's database; or the city hasn't digitized older records. Try the street address without apartment or unit numbers for the broadest match.",
      },
      {
        q: "Why don't I see the contractor's name on some permits?",
        a: "Contractor and company names are only shown when the city actually publishes that field — and many cities either don't include it or leave it blank on individual permits. We show contractor information wherever the official record contains it, and omit it where the government simply didn't record it.",
      },
    ],
  },
  {
    marker: "§ 02",
    title: "Accuracy & Verifying With The City",
    faqs: [
      {
        q: "How accurate is the information?",
        a: "Our reports reflect what each government portal publishes. That data is generally reliable, but it can lag, contain gaps, or use codes that require interpretation. Some cities update daily; others run months behind. We note known delays where we can — but for any decision that matters, treat our report as a fast, readable starting point, then confirm specifics with the city.",
      },
      {
        q: "How do I verify a permit directly with the city?",
        a: "Every report includes a verification guide for that jurisdiction, with the relevant department and what to ask for. You can take the permit numbers from your report and confirm them on the city's official portal or by contacting the building department directly. This is the authoritative source for any high-stakes decision.",
      },
      {
        q: "What does an \"open\" permit mean?",
        a: "An open permit is work that was started but never inspected to final approval and closed out. Open permits can complicate a home sale or mortgage closing, because the responsibility to resolve them can transfer to the new owner. They're one of the most important things to verify before committing to a property.",
      },
      {
        q: "What's a risk score and how is it calculated?",
        a: "The risk score is a 0–100 summary of a property's permit profile, derived from signals in the public records — such as open permits, expired permits, and the volume of structural or electrical work. It's a quick orientation tool, not a professional inspection or legal opinion.",
      },
    ],
  },
  {
    marker: "§ 03",
    title: "Pricing & Refunds",
    faqs: [
      {
        q: "How much does it cost?",
        a: "Searching an address and seeing the risk indicator is free. A full report — with the complete permit history and detailed breakdown — is a one-time $9 charge per property. An optional Address Watch subscription is available for ongoing monitoring.",
      },
      {
        q: "Is the free search really free?",
        a: "Yes. You can search any covered address and see a preview at no cost and without a credit card. You only pay if you choose to unlock the full report for a specific property.",
      },
      {
        q: "What's your refund policy?",
        a: "Because a report delivers public-records data instantly upon purchase, sales are generally final. That said, if a report fails to generate, returns no data after payment, or you were charged in error, contact us and we'll make it right.",
      },
      {
        q: "How do I cancel Address Watch?",
        a: "Address Watch is month-to-month and can be cancelled anytime from your account; you won't be billed for the following cycle once cancelled. (Exact steps depend on your account settings.)",
      },
    ],
  },
  {
    marker: "§ 04",
    title: "Privacy & Legal",
    faqs: [
      {
        q: "Is PermitPeek legal to use?",
        a: "Yes. We work exclusively with public records that governments make openly available. We don't access private information, credit data, or anything behind a login.",
      },
      {
        q: "Is this legal or professional advice?",
        a: "No. PermitPeek provides information from public records for general informational purposes only. It is not legal, financial, engineering, or professional advice, and it is not a substitute for a licensed home inspection, title search, or attorney. Always consult the appropriate professional before making a purchase decision.",
      },
      {
        q: "What do you do with my data?",
        a: "We collect only what's needed to run the service — such as the email you provide to receive a report. We don't sell your personal information. See our Privacy Policy for full details.",
      },
      {
        q: "Can I remove a property from your service?",
        a: "PermitPeek doesn't host a private database of properties — we query public government records live at search time. Because the underlying records are maintained by the government, requests to amend or remove them should be directed to the relevant agency.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-grow">
        {/* Header */}
        <section className="pt-20 pb-12 md:pb-16 border-b border-stone-900/10 dot-grain">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500 mb-5 block">
              Help · Frequently Asked Questions
            </span>
            <h1 className="font-display font-light text-stone-900 leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Questions, answered.
            </h1>
            <p className="font-serif text-lg md:text-xl text-stone-600 max-w-2xl mt-6 leading-relaxed">
              Everything about where our data comes from, how accurate it is, what it costs, and how we handle privacy.
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-20">
            {SECTIONS.map((section, si) => (
              <div key={si}>
                <div className="mb-10">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-3 block">
                    {section.marker}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-light text-stone-900 leading-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="divide-y divide-stone-900/10 border-t border-stone-900/10">
                  {section.faqs.map((faq, fi) => (
                    <details key={fi} className="group py-6">
                      <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                        <h3 className="font-display text-xl md:text-2xl font-light text-stone-900 leading-snug">
                          {faq.q}
                        </h3>
                        <span className="font-mono text-stone-400 text-2xl leading-none mt-1 transition-transform duration-300 group-open:rotate-45 flex-shrink-0">
                          +
                        </span>
                      </summary>
                      <p className="font-serif text-stone-600 leading-relaxed mt-4 max-w-3xl">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 border-t border-stone-900/10 bg-stone-100/40">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-light text-stone-900 leading-tight mb-6">
              Still have a question?
            </h2>
            <p className="font-serif text-lg text-stone-600 max-w-xl mx-auto mb-9">
              Search any covered address free, or reach out and we&rsquo;ll help you read your report.
            </p>
            <Link href="/" className="inline-flex items-center gap-2.5 bg-stone-900 text-stone-50 px-9 py-4 rounded-md font-mono text-[13px] uppercase tracking-[0.12em] hover:bg-stone-800 transition-colors">
              Search a property <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
