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
        <div className="border border-stone-900/12 rounded-xl p-6 md:p-7 max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-5">
            Coverage &amp; Data Source
          </div>

          {/* Covered header */}
          <div className="flex items-start gap-3 mb-5">
            <span className="shrink-0 w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CircleCheck size={18} strokeWidth={1.75} />
            </span>
            <div>
              <div className="font-serif text-lg text-stone-900 leading-snug">
                {city.name}, {city.state} — covered
              </div>
              {totalCount > 0 && (
                <div className="text-[13px] text-stone-500 mt-0.5">
                  {totalCount.toLocaleString()} permits on file for this address.
                </div>
              )}
            </div>
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-stone-900/8">
            <Row
              icon={<Landmark size={16} strokeWidth={1.6} />}
              label="Data source"
              value={city.permitAuthority}
              sub={portalHost ? `Official municipal permit records · ${portalHost}` : "Official municipal permit records"}
            />
            <Row
              icon={<CalendarClock size={16} strokeWidth={1.6} />}
              label="Coverage window"
              value={windowText}
              sub={windowSub}
            />
            <Row
              icon={<RefreshCw size={16} strokeWidth={1.6} />}
              label="Freshness"
              value="Queried live just now"
              sub="We pull the city's database in real time — never a stale cache."
            />
          </div>

          {/* Confidence line */}
          <div className="mt-5 bg-stone-50 rounded-lg px-4 py-3 flex items-start gap-2">
            <ShieldCheck size={15} strokeWidth={1.75} className="shrink-0 mt-0.5 text-emerald-700" />
            <p className="text-[13px] text-stone-600 leading-relaxed">
              If our data for this address turns out incomplete or stale, your report is{" "}
              <span className="text-stone-900">free</span>. We&rsquo;d rather under-promise than show you records we can&rsquo;t stand behind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
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
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span className="shrink-0 w-[30px] h-[30px] rounded-md bg-stone-100 text-stone-500 flex items-center justify-center">
        {icon}
      </span>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400 mb-0.5">
          {label}
        </div>
        <div className="font-serif text-[15px] text-stone-800 leading-snug">{value}</div>
        {sub && <div className="text-[12.5px] text-stone-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
