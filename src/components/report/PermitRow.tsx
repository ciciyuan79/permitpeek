import { Permit } from "@/lib/socrata";
import { translatePermitType } from "@/lib/analyze";

interface PermitRowProps {
  permit: Permit;
  index: number;
}

export default function PermitRow({ permit, index }: PermitRowProps) {
  const translatedType = translatePermitType(permit.type);
  const hasValidDescription =
    permit.description &&
    permit.description.trim().length > 0 &&
    permit.description.toLowerCase() !== "unknown" &&
    permit.description.toLowerCase() !== "no description provided";

  const hasValidValue =
    permit.value &&
    !isNaN(Number(permit.value)) &&
    Number(permit.value) > 0;

  return (
    <div className="bg-white p-8 group">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="md:w-32 shrink-0">
          <div className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mb-2">
            Record №{index.toString().padStart(3, '0')}
          </div>
          <div className="font-display text-lg text-stone-900">
            {permit.date
              ? new Date(permit.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Date unknown'}
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="font-display text-2xl font-light text-stone-900">
              {translatedType}
            </h3>
            <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-[2px] border ${
              permit.status.toLowerCase().includes('issued') || permit.status.toLowerCase().includes('open')
                ? 'border-emerald-900/20 text-emerald-900 bg-emerald-50'
                : 'border-stone-900/20 text-stone-500 bg-stone-50'
            }`}>
              {permit.status}
            </span>
          </div>

          {hasValidDescription && (
            <p className="font-serif text-stone-600 leading-relaxed max-w-2xl mb-6">
              {permit.description}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-900/5">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-1">
                Valuation
              </div>
              <div className="font-serif text-sm text-stone-900 font-bold">
                {hasValidValue ? `$${Number(permit.value).toLocaleString()}` : 'Not disclosed'}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-1">
                Jurisdiction
              </div>
              <div className="font-serif text-sm text-stone-900">
                Municipal Records
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
