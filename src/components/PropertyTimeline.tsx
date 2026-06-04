"use client";

import { useState, useEffect, useRef } from "react";

const ITEMS = [
  { year: "2023", title: "Plumbing repair", status: "Closed", strong: false, note: "$3,200 · finaled" },
  { year: "2021", title: "Kitchen renovation", status: "Closed", strong: false, note: "Permit A2 · $48,000" },
  { year: "2019", title: "Electrical rewire", status: "Open", strong: true, note: "Never finaled — inherited risk" },
  { year: "2014", title: "Roof replacement", status: "Closed", strong: false, note: "$19,000" },
  { year: "2008", title: "Rear addition", status: "Closed", strong: false, note: "Permit A1 · +320 sq ft" },
  { year: "1962", title: "Original construction", status: "On record", strong: false, note: "Single-family residence" },
];

export default function PropertyTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); o.disconnect(); } }, { threshold: 0.4 });
    o.observe(el);
    return () => o.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-stone-50 border border-stone-900/10 rounded-2xl p-7">
      <div className="relative pl-8">
        <div className="absolute left-[7px] top-1.5 w-0.5 bg-stone-900/10" style={{ height: "calc(100% - 12px)", transformOrigin: "top", transform: go ? "scaleY(1)" : "scaleY(0)", transition: "transform 1.1s cubic-bezier(.16,1,.3,1)" }} />
        {ITEMS.map((it, i) => (
          <div key={i} className={i < ITEMS.length - 1 ? "mb-5 relative" : "relative"} style={{ opacity: go ? 1 : 0, transform: go ? "none" : "translateX(-10px)", transition: `opacity .5s ease ${0.25 + i * 0.13}s, transform .5s ease ${0.25 + i * 0.13}s` }}>
            <div className="absolute -left-8 top-0.5">
              {it.strong && go && <span className="absolute -left-0.5 -top-0.5 w-4 h-4 rounded-full border-2 border-stone-900" style={{ animation: "ptPulse 2.2s ease-out infinite" }} />}
              <span className="block w-3 h-3 rounded-full border-2 border-stone-50" style={{ background: it.strong ? "#1c1917" : "#d6d3d1", boxShadow: `0 0 0 1px ${it.strong ? "#1c1917" : "#c7c0b5"}` }} />
            </div>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="font-mono text-xs text-stone-400 w-9">{it.year}</span>
              <span className="font-display text-lg">{it.title}</span>
              <span className={`font-mono text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded ${it.strong ? "bg-stone-900 text-stone-50" : "bg-stone-200/70 text-stone-500"}`}>{it.status}</span>
            </div>
            <div className="font-serif text-[13px] text-stone-500 mt-0.5 ml-11">{it.note}</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes ptPulse { 0% { transform: scale(1); opacity:.6 } 70% { transform: scale(2.2); opacity:0 } 100% { opacity:0 } }`}</style>
    </div>
  );
}
