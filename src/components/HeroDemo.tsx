"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, CheckCircle2, FileWarning } from "lucide-react";

const DEMOS = [
  { addr: "350 5th Avenue, New York, NY", score: 38, grade: "High Risk", tone: 0.9, permits: 50, open: 25, cost: "$42k–68k" },
  { addr: "1 Market St, San Francisco, CA", score: 71, grade: "Review", tone: 0.55, permits: 33, open: 6, cost: "$8k–14k" },
  { addr: "233 S Wacker Dr, Chicago, IL", score: 88, grade: "Low Risk", tone: 0.25, permits: 19, open: 1, cost: "$0–2k" },
];

const WIN = 176;

export default function HeroDemo() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState(0);
  const [seg, setSeg] = useState(0);
  const cancel = useRef(false);

  useEffect(() => {
    cancel.current = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let i = 0;
    (async () => {
      while (!cancel.current) {
        const d = DEMOS[i % DEMOS.length];
        setIdx(i % DEMOS.length); setPhase(0); setTyped(""); setSeg(0);
        for (let c = 1; c <= d.addr.length; c++) { if (cancel.current) return; setTyped(d.addr.slice(0, c)); await wait(36); }
        await wait(550); if (cancel.current) return;
        setPhase(1); await wait(1150); if (cancel.current) return;
        setPhase(2);
        for (let s = 0; s < 5; s++) { if (cancel.current) return; setSeg(s); await wait(1150); }
        await wait(700); i++;
      }
    })();
    return () => { cancel.current = true; };
  }, []);

  const d = DEMOS[idx];
  const circ = 2 * Math.PI * 28;
  const inkTone = `rgba(28,25,23,${0.3 + d.tone * 0.6})`;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-stone-400 mb-1">{children}</div>
  );

  return (
    <div className="bg-white border border-stone-900/10 rounded-2xl overflow-hidden shadow-[0_30px_70px_-20px_rgba(28,25,23,0.18)]">
      <div className="flex items-center gap-2.5 p-3 border-b border-stone-900/10">
        <Search size={17} className="ml-2 text-stone-400" />
        <span className="flex-1 font-serif text-[14.5px] text-stone-700">
          {typed}<span className={phase === 0 ? "opacity-100 text-stone-500" : "opacity-0"}>|</span>
        </span>
        <span className="bg-stone-900 text-stone-50 rounded-md px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] flex items-center gap-1.5">
          {phase === 1 ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
          {phase === 1 ? "Analyzing" : "Analyze"}
        </span>
      </div>

      <div className="relative overflow-hidden bg-stone-50" style={{ height: WIN }}>
        {phase < 2 ? (
          <div className="flex flex-col items-center justify-center gap-3" style={{ height: WIN }}>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-400">
              {phase === 0 ? "Enter an address" : "Reading city permit records"}
            </div>
            {phase === 1 && (
              <div className="flex gap-1.5">
                {[0, 1, 2].map((k) => (
                  <span key={k} className="w-1.5 h-1.5 rounded-full bg-stone-400" style={{ animation: `hdBounce 1s ease-in-out ${k * 0.15}s infinite` }} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={{ transform: `translateY(-${seg * WIN}px)`, transition: "transform .7s cubic-bezier(.16,1,.3,1)" }}>
              <div className="flex flex-col justify-center" style={{ height: WIN, paddingLeft: 22, paddingRight: 22 }}>
                <div className="flex items-center gap-5">
                  <div className="relative flex-shrink-0" style={{ width: 82, height: 82 }}>
                    <svg width="82" height="82" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="41" cy="41" r="28" fill="none" stroke="rgba(28,25,23,0.1)" strokeWidth="6" />
                      <circle cx="41" cy="41" r="28" fill="none" stroke={inkTone} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (d.score / 100) * circ} style={{ transition: "stroke-dashoffset .9s ease" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-display text-3xl">{d.score}</div>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone-900 bg-stone-200/70 px-2.5 py-1 rounded">{d.grade}</span>
                    <div className="font-display text-[22px] mt-2">Property Risk Score</div>
                    <div className="font-mono text-[11px] text-stone-500 mt-1">{d.permits} permits · {d.open} open</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2" style={{ height: WIN, paddingLeft: 22, paddingRight: 22 }}>
                <Label>Property Timeline</Label>
                {[["2021", "Kitchen renovation", "Closed"], ["2019", "Electrical rewire", "Open"], ["2014", "Roof replacement", "Closed"]].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-stone-900/[0.06]">
                    <span className="font-mono text-[11px] text-stone-400 w-8">{r[0]}</span>
                    <span className="font-display text-base flex-1">{r[1]}</span>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded ${r[2] === "Open" ? "bg-stone-900 text-stone-50" : "bg-stone-200/70 text-stone-500"}`}>{r[2]}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-center gap-2" style={{ height: WIN, paddingLeft: 22, paddingRight: 22 }}>
                <Label>Contractor Track Record</Label>
                {[["Apex Building Co.", "18 jobs · clean", false], ["Citywide Renov.", "7 jobs · 4 open", true]].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-stone-900/[0.06]">
                    <div className="flex-1">
                      <div className="font-display text-base">{r[0]}</div>
                      <div className={`font-mono text-[11px] ${r[2] ? "text-stone-900" : "text-stone-400"}`}>{r[1]}</div>
                    </div>
                    {r[2] ? <FileWarning size={16} className="text-stone-900" /> : <CheckCircle2 size={16} className="text-stone-400" />}
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-center gap-2" style={{ height: WIN, paddingLeft: 22, paddingRight: 22 }}>
                <Label>Unpermitted Work</Label>
                <div className="flex gap-3">
                  <FileWarning size={20} className="text-stone-900 flex-shrink-0 mt-0.5" />
                  <div className="font-serif text-sm text-stone-700 leading-relaxed">
                    Listing claims <strong>2,400 sq ft</strong>, permits cover ~1,800. Possible unpermitted addition — investigate before offer.
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2" style={{ height: WIN, paddingLeft: 22, paddingRight: 22 }}>
                <Label>Negotiation Brief</Label>
                <div className="font-serif text-sm text-stone-700 leading-relaxed">
                  {d.open} open permits (~<strong>{d.cost}</strong>). Ask the seller to resolve before closing, or negotiate a reduction. Add a permit contingency.
                </div>
              </div>
            </div>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`w-[5px] h-[5px] rounded-full transition-colors ${i === seg ? "bg-stone-900" : "bg-stone-300"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes hdBounce { 0%,100% { transform: translateY(0); opacity:.5 } 50% { transform: translateY(-6px); opacity:1 } }`}</style>
    </div>
  );
}
