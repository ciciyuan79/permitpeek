"use client";

import { useState, useEffect, useRef } from "react";

// All 21 live cities, positioned with de-cluttered AZ + Northeast clusters.
const CITIES = [
  { name: "Seattle", state: "WA", x: 95, y: 92, recs: "410K" },
  { name: "San Francisco", state: "CA", x: 60, y: 240, recs: "1.2M" },
  { name: "Los Angeles", state: "CA", x: 118, y: 332, recs: "2.1M" },
  { name: "San Diego County", state: "CA", x: 135, y: 372, recs: "100K" },
  { name: "Phoenix Metro", state: "AZ", x: 210, y: 348, recs: "100K" },
  { name: "Mesa", state: "AZ", x: 268, y: 360, recs: "300K" },
  { name: "Tempe", state: "AZ", x: 238, y: 384, recs: "200K" },
  { name: "Denver", state: "CO", x: 388, y: 250, recs: "150K" },
  { name: "Kansas City", state: "MO", x: 540, y: 250, recs: "200K" },
  { name: "Austin", state: "TX", x: 485, y: 428, recs: "620K" },
  { name: "Chicago", state: "IL", x: 655, y: 200, recs: "890K" },
  { name: "Cincinnati", state: "OH", x: 715, y: 248, recs: "300K" },
  { name: "Nashville", state: "TN", x: 690, y: 312, recs: "250K" },
  { name: "Miami-Dade", state: "FL", x: 815, y: 458, recs: "100K" },
  { name: "Buffalo", state: "NY", x: 805, y: 162, recs: "200K" },
  { name: "Pittsburgh", state: "PA", x: 788, y: 220, recs: "62K" },
  { name: "Washington", state: "DC", x: 845, y: 250, recs: "150K" },
  { name: "Virginia Beach", state: "VA", x: 862, y: 286, recs: "100K" },
  { name: "Philadelphia", state: "PA", x: 870, y: 212, recs: "880K" },
  { name: "New York City", state: "NY", x: 888, y: 184, recs: "4.8M" },
  { name: "Boston", state: "MA", x: 916, y: 156, recs: "728K" },
];
const US_PATH = "M60,58 L300,44 L540,42 L600,54 L760,60 L880,70 L945,96 L935,142 L905,180 L872,236 L858,300 L852,360 L835,415 L740,452 L620,466 L540,472 L470,476 L400,452 L300,424 L190,404 L120,390 L95,356 L72,300 L40,234 L45,150 L50,92 Z";
const REGIONS = [{ label: "WEST", x: 92, y: 200 }, { label: "SOUTH", x: 540, y: 380 }, { label: "MIDWEST", x: 640, y: 130 }, { label: "NORTHEAST", x: 870, y: 120 }];

// Cascade order: west -> east by x position
const ORDER = CITIES.map((_, i) => i).sort((a, b) => CITIES[a].x - CITIES[b].x);

export default function CoverageMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<Set<number>>(new Set());
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        ORDER.forEach((cityIdx, step) => {
          setTimeout(() => {
            setLit((prev) => {
              const next = new Set(prev);
              next.add(cityIdx);
              return next;
            });
            if (step === ORDER.length - 1) setTimeout(() => setDone(true), 400);
          }, step * 140);
        });
        o.disconnect();
      }
    }, { threshold: 0.3 });
    o.observe(el);
    return () => o.disconnect();
  }, [started]);

  const active = lit.size;
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
        </defs>
        <g clipPath="url(#cmus)">
          <rect width="1000" height="500" fill="#e7e5e4" />
          <rect width="1000" height="500" fill="url(#cmgrid)" />
        </g>
        <path d={US_PATH} fill="none" stroke="rgba(28,25,23,0.28)" strokeWidth="1.5" strokeLinejoin="round" style={{ opacity: started ? 1 : 0, transition: "opacity 1s ease" }} />
        {REGIONS.map((r, i) => (
          <text key={i} x={r.x} y={r.y} textAnchor="middle" fontFamily="monospace" fontSize="12" fill="rgba(28,25,23,0.18)" letterSpacing="2" style={{ opacity: started ? 1 : 0, transition: `opacity 1s ease ${0.3 + i * 0.1}s` }}>{r.label}</text>
        ))}
        {CITIES.map((c, i) => {
          const on = lit.has(i);
          const isH = hover === i;
          return (
            <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHover(i)}>
              <circle cx={c.x} cy={c.y} r="24" fill="transparent" />
              {on && done && <circle cx={c.x} cy={c.y} r="5" fill="none" stroke="rgba(28,25,23,0.4)" strokeWidth="2" style={{ animation: `cmPulse 2.6s ease-out ${i * 0.12}s infinite`, transformOrigin: `${c.x}px ${c.y}px` }} />}
              <circle cx={c.x} cy={c.y} r={isH ? 8 : 5.5} fill={on ? "#1c1917" : "rgba(28,25,23,0.12)"} stroke={on ? "#1c1917" : "rgba(28,25,23,0.25)"} strokeWidth="2" style={{ transition: "all .35s ease", animation: on && !done ? `cmPop .4s ease` : "none", transformOrigin: `${c.x}px ${c.y}px` }} />
              <text x={c.x} y={c.y - 13} textAnchor="middle" fontFamily="monospace" fontSize="14.5" fill={on ? "#44403c" : "rgba(28,25,23,0.3)"} letterSpacing="0.3" style={{ transition: "fill .4s ease", fontWeight: isH ? 600 : 400, opacity: on ? 1 : 0.35 }}>{c.name}</text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-5 font-mono text-[11px] text-stone-400 pt-2 border-t border-stone-900/10 min-h-[30px]">
        {hc ? (
          <span className="text-stone-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900" />
            {hc.name}, {hc.state} — Live now · ~{hc.recs} records
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stone-900" /> Live now</span>
            <span className="ml-auto">Hover a city for detail</span>
          </>
        )}
      </div>
      <style>{`
        @keyframes cmPulse { 0% { r:5; opacity:.5 } 70% { r:24; opacity:0 } 100% { r:24; opacity:0 } }
        @keyframes cmPop { 0% { r:5.5 } 45% { r:9 } 100% { r:5.5 } }
      `}</style>
    </div>
  );
}
