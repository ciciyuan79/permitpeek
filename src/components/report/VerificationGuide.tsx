// src/components/report/VerificationGuide.tsx
import { getCityVerification, CITY_CODE_LINKS, OPEN_PERMIT_EXPLAINER } from "@/lib/permit-knowledge";

interface VerificationGuideProps {
  citySlug: string;
  cityName: string;
  hasOpenPermits: boolean;
}

export default function VerificationGuide({ citySlug, cityName, hasOpenPermits }: VerificationGuideProps) {
  const verification = getCityVerification(citySlug);
  const codeLinks = CITY_CODE_LINKS[citySlug] || [];

  if (!verification) return null;

  return (
    <section className="py-24 bg-white border-t border-stone-900/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Open Permit Explainer (shown when relevant) */}
        {hasOpenPermits && (
          <div className="mb-16 p-8 bg-amber-50/50 border-l-2 border-amber-900">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-900 mb-3 block">
              § 03 · Understanding Open Permits
            </span>
            <h3 className="font-display text-3xl font-light text-stone-900 mb-4">
              {OPEN_PERMIT_EXPLAINER.title}
            </h3>
            <p className="font-serif text-stone-700 leading-relaxed mb-6 max-w-3xl">
              {OPEN_PERMIT_EXPLAINER.body}
            </p>
            <div className="mb-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">
                Why this matters
              </div>
              <ul className="space-y-2">
                {OPEN_PERMIT_EXPLAINER.consequences.map((item, i) => (
                  <li key={i} className="font-serif text-stone-700 flex gap-2">
                    <span className="text-amber-900 shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-2">
                How to resolve
              </div>
              <p className="font-serif text-stone-700 leading-relaxed">
                {OPEN_PERMIT_EXPLAINER.howToResolve}
              </p>
            </div>
          </div>
        )}

        {/* Verification Guide */}
        <div className="mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
            § {hasOpenPermits ? "04" : "03"} · Verify With City
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-light text-stone-900 mb-3">
            Confirm this report directly with {cityName}
          </h2>
          <p className="font-serif text-stone-600 max-w-2xl">
            PermitPeek aggregates public records. For high-stakes decisions, verify directly with the issuing authority.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authority Info */}
          <div className="p-8 border border-stone-900/10 bg-stone-50">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">
              Issuing Authority
            </div>
            <h3 className="font-display text-xl font-normal text-stone-900 mb-6">
              {verification.authority}
            </h3>

            <div className="space-y-4">
              {verification.phone && (
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-1">
                    Phone
                  </div>
                  <div className="font-serif text-stone-900">
                    {verification.phone}
                  </div>
                </div>
              )}
              {verification.hours && (
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-1">
                    Hours
                  </div>
                  <div className="font-serif text-sm text-stone-700">
                    {verification.hours}
                  </div>
                </div>
              )}
              {verification.inPersonAddress && (
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-1">
                    Office Address
                  </div>
                  <div className="font-serif text-sm text-stone-700">
                    {verification.inPersonAddress}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-stone-900/10">
              <div className="font-mono text-[9px] uppercase tracking-widest text-stone-500 mb-2">
                ✦ Pro Tip
              </div>
              <p className="font-serif text-sm text-stone-700 leading-relaxed italic">
                {verification.tipForCallers}
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="p-8 border border-stone-900/10 bg-white">
            <div className="mb-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-900 mb-3">
                Free Services
              </div>
              <ul className="space-y-2">
                {verification.freeServices.map((service, i) => (
                  <li key={i} className="font-serif text-sm text-stone-700 flex gap-2">
                    <span className="text-emerald-900 shrink-0">✓</span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {verification.paidServices.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">
                  Paid Services
                </div>
                <ul className="space-y-2">
                  {verification.paidServices.map((service, i) => (
                    <li key={i} className="font-serif text-sm text-stone-700 flex gap-2">
                      <span className="text-stone-400 shrink-0">·</span>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Code Citations */}
        {codeLinks.length > 0 && (
          <div className="mt-12 p-8 border border-stone-900/10 bg-stone-900 text-stone-50">
            <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-3">
              Official Code References
            </div>
            <h3 className="font-display text-xl font-light mb-2">
              {cityName} Building Code
            </h3>
            <p className="font-serif text-sm text-stone-400 mb-6 max-w-2xl">
              For specific regulatory requirements, consult the official {cityName} building code.
              Always defer to the authoritative source for legal decisions.
            </p>
            <div className="space-y-2">
              {codeLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-sm text-stone-50 hover:text-stone-300 transition-colors block underline-offset-4 hover:underline"
                >
                  → {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
