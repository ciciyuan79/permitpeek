import { CityConfig } from "@/lib/cities";
import { ShieldCheck, CircleCheck, Landmark, CalendarClock, RefreshCw } from "lucide-react";

export default function CoverageSourcePanel({
  city,
  totalCount,
}: {
  city: CityConfig;
  totalCount: number;
}) {
  const portalHost = (() => {
    try {
      if (city.permitAuthorityUrl) return new URL(city.permitAuthorityUrl).host.replace(/^www\./, "");
    } catch {}
    return null;
  })();

  const windowText = city.coverageStart
    ? `${city.coverageStart} – present`
    : "Coverage varies — see source";

  const windowSub = city.coverageStart
    ? "Permits filed before this may not appear in the online registry."
    : "We'll flag in your results if a record may predate digital records.";

  return (
    <section className="py-8 border-b border-stone-900/10 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="border border-stone-900/12 rounded-xl p-6 md:p-7">
          {/* Header row: covered status + confidence line side by side */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CircleCheck size={18} strokeWidth={1.75} />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">
                  Coverage &amp; Data Source
                </div>
                <div className="font-serif text-lg text-stone-900 leading-snug">
                  {city.name}, {city.state} — covered
                  {totalCount > 0 && (
                    <span className="text-[13px] text-stone-500 font-sans ml-2">
                      · {totalCount.toLocaleString()} permits on file
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:max-w-sm bg-stone-50 rounded-lg px-4 py-3 flex items-start gap-2">
              <ShieldCheck size={15} strokeWidth={1.75} className="shrink-0 mt-0.5 text-emerald-700" />
              <p className="text-[12.5px] text-stone-600 leading-relaxed">
                If our data turns out incomplete or stale, your report is{" "}
                <span className="text-stone-900">free</span>.
              </p>
            </div>
          </div>

          {/* Three source columns side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-900/8 border border-stone-900/8 rounded-lg overflow-hidden">
            <Col
              icon={<Landmark size={16} strokeWidth={1.6} />}
              label="Data source"
              value={city.permitAuthority}
              sub={portalHost ? `Official records · ${portalHost}` : "Official municipal records"}
            />
            <Col
              icon={<CalendarClock size={16} strokeWidth={1.6} />}
              label="Coverage window"
              value={windowText}
              sub={windowSub}
            />
            <Col
              icon={<RefreshCw size={16} strokeWidth={1.6} />}
              label="Freshness"
              value="Queried live just now"
              sub="Real-time pull — never a stale cache."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Col({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="shrink-0 w-[28px] h-[28px] rounded-md bg-stone-100 text-stone-500 flex items-center justify-center">
          {icon}
        </span>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
          {label}
        </div>
      </div>
      <div className="font-serif text-[15px] text-stone-800 leading-snug">{value}</div>
      {sub && <div className="text-[12px] text-stone-500 mt-1">{sub}</div>}
    </div>
  );
}
