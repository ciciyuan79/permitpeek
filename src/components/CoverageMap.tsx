"use client";

import { useState, useEffect, useRef } from "react";

const CITIES = [
  { name: "Seattle", state: "WA", x: 95, y: 92, live: true, recs: "1.1M" },
  { name: "San Francisco", state: "CA", x: 62, y: 240, live: true, recs: "900K" },
  { name: "Los Angeles", state: "CA", x: 120, y: 332, live: true, recs: "3.2M" },
  { name: "San Diego", state: "CA", x: 138, y: 370, live: false, recs: "640K" },
  { name: "Austin", state: "TX", x: 485, y: 428, live: true, recs: "1.4M" },
  { name: "New Orleans", state: "LA", x: 612, y: 440, live: false, recs: "380K" },
  { name: "Minneapolis", state: "MN", x: 558, y: 135, live: false, recs: "520K" },
  { name: "Chicago", state: "IL", x: 655, y: 205, live: true, recs: "2.1M" },
  { name: "Cincinnati", state: "OH", x: 712, y: 248, live: false, recs: "410K" },
  { name: "Baltimore", state: "MD", x: 832, y: 230, live: false, recs: "560K" },
  { name: "New York City", state: "NY", x: 882, y: 184, live: true, recs: "4.8M" },
  { name: "Boston", state: "MA", x: 912, y: 156, live: false, recs: "470K" },
];
const US_PATH = "M60,58 L300,44 L540,42 L600,54 L760,60 L880,70 L945,96 L935,142 L905,180 L872,236 L858,300 L852,360 L835,415 L740,452 L620,466 L540,472 L470,476 L400,452 L300,424 L190,404 L120,390 L95,356 L72,300 L40,234 L45,150 L50,92 Z";
const REGIONS = [{ label: "WEST", x: 92, y: 200 }, { label: "SOUTH", x: 540, y: 380 }, { label: "MIDWEST", x: 640, y: 130 }, { label: "NORTHEAST", x: 870, y: 120 }];

export default function CoverageMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [sweep, setSweep] = useState(0);
  const [started, setStarted] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        const dur = 3000;
        const s = performance.now();
        const tick = (n: number) => {
          const t = Math.min((n - s) / dur, 1);
          setSweep((1 - Math.pow(1 - t, 2)) * 1000);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        o.disconnect();
      }
    }, { threshold: 0.3 });
    o.observe(el);
    return () => o.disconnect();
  }, [started]);

  const active = CITIES.filter((c) => c.x <= sweep).length;
  const hc = hover != null ? CITIES[hover] : null;

  return (
    <div ref={ref} className="relative bg-stone-100 border border-stone-900/10 rounded-2xl p-6 overflow-hidden">
      <div className="flex justify-between items-baseline mb-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">United States · Coverage</div>
        <div className="font-mono text-[11px] text-stone-600">{active} / {CITIES.length} cities online</div>
      </div>
      <svg viewBox="0 0 1000 500" className="w-full block" onMouseLeave={() => setHover(null)}>
        <defs>
          <pattern id="cmgrid" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M 34 0 L 0 0 0 34" fill="none" stroke="rgba(28,25,23,0.06)" strokeWidth="1" />
          </pattern>
          <clipPath id="cmus"><path d={US_PATH} /></clipPath>
          <linearGradient id="cmsw" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(28,25,23,0)" />
            <stop offset="100%" stopColor="rgba(28,25,23,0.12)" />
          </linearGradient>
        </defs>
        <g clipPath="url(#cmus)">
          <rect width="1000" height="500" fill="#e7e5e4" />
          <rect width="1000" height="500" fill="url(#cmgrid)" />
          {started && sweep < 1000 && (
            <>
              <rect x={Math.max(0, sweep - 130)} y="0" width="130" height="500" fill="url(#cmsw)" />
              <line x1={sweep} y1="0" x2={sweep} y2="500" stroke="rgba(28,25,23,0.3)" strokeWidth="2" />
            </>
          )}
        </g>
        <path d={US_PATH} fill="none" stroke="rgba(28,25,23,0.28)" strokeWidth="1.5" strokeLinejoin="round" style={{ opacity: started ? 1 : 0, transition: "opacity 1s ease" }} />
        {REGIONS.map((r, i) => (
          <text key={i} x={r.x} y={r.y} textAnchor="middle" fontFamily="monospace" fontSize="12" fill="rgba(28,25,23,0.18)" letterSpacing="2" style={{ opacity: started ? 1 : 0, transition: `opacity 1s ease ${1.2 + i * 0.1}s` }}>{r.label}</text>
        ))}
        {CITIES.map((c, i) => {
          const on = c.x <= sweep;
          const isH = hover === i;
          return (
            <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHover(i)}>
              <circle cx={c.x} cy={c.y} r="24" fill="transparent" />
              {on && c.live && <circle cx={c.x} cy={c.y} r="5" fill="none" stroke="rgba(28,25,23,0.4)" strokeWidth="2" style={{ animation: `cmPulse 2.6s ease-out ${i * 0.1}s infinite`, transformOrigin: `${c.x}px ${c.y}px` }} />}
              <circle cx={c.x} cy={c.y} r={isH ? 8 : 5.5} fill={on ? (c.live ? "#1c1917" : "#f5f5f4") : "rgba(28,25,23,0.12)"} stroke={on ? "#1c1917" : "rgba(28,25,23,0.25)"} strokeWidth="2" style={{ transition: "all .3s ease" }} />
              <text x={c.x} y={c.y - 13} textAnchor="middle" fontFamily="monospace" fontSize="14.5" fill={on ? "#44403c" : "rgba(28,25,23,0.3)"} letterSpacing="0.3" style={{ transition: "fill .4s ease", fontWeight: isH ? 600 : 400 }}>{c.name}</text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-5 font-mono text-[11px] text-stone-400 pt-2 border-t border-stone-900/10 min-h-[30px]">
        {hc ? (
          <span className="text-stone-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: hc.live ? "#1c1917" : "transparent", border: hc.live ? "none" : "2px solid #78716c" }} />
            {hc.name}, {hc.state} — {hc.live ? "Live now" : "Coming soon"} · ~{hc.recs} records
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stone-900" /> Live now</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border-2 border-stone-500" /> Coming soon</span>
            <span className="ml-auto">Hover a city for detail</span>
          </>
        )}
      </div>
      <style>{`@keyframes cmPulse { 0% { r:5; opacity:.55 } 70% { r:24; opacity:0 } 100% { r:24; opacity:0 } }`}</style>
    </div>
  );
}
