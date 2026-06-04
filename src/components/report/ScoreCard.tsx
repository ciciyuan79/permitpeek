import { RiskScore } from "@/lib/analyze";
import { ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";

interface ScoreCardProps {
  score: RiskScore;
  scoreValue: number;
  summary: string;
}

export default function ScoreCard({ score, scoreValue, summary }: ScoreCardProps) {
  const config = {
    clean: {
      color: "text-emerald-900 bg-emerald-50 border-emerald-900/20",
      stroke: "#065f46",
      icon: ShieldCheck,
      label: "Clean History",
      desc: "Low risk detected. Standard historical maintenance patterns.",
    },
    review: {
      color: "text-amber-900 bg-amber-50 border-amber-900/20",
      stroke: "#92400e",
      icon: AlertTriangle,
      label: "Review Advised",
      desc: "Medium risk flags identified. Manual verification recommended.",
    },
    risk: {
      color: "text-red-900 bg-red-50 border-red-900/20",
      stroke: "#991b1b",
      icon: AlertCircle,
      label: "Risk Detected",
      desc: "High risk indicators. Potential legal or safety compliance issues.",
    },
  }[score];

  const Icon = config.icon;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (scoreValue / 100) * circ;

  return (
    <div className={`p-8 border ${config.color} h-full flex flex-col`}>
      <div className="flex items-center gap-3 mb-6">
        <Icon size={24} strokeWidth={1.5} />
        <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
          {config.label}
        </span>
      </div>

      {/* Numeric gauge */}
      <div className="flex items-center gap-5 mb-6">
        <div className="relative" style={{ width: 130, height: 130 }}>
          <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="65" cy="65" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="9" />
            <circle
              cx="65" cy="65" r={r} fill="none"
              stroke={config.stroke} strokeWidth="9" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-light leading-none">{scoreValue}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-70 mt-1">/ 100</span>
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70 mb-1">
            Risk Score
          </div>
          <p className="font-serif text-sm leading-snug">{config.desc}</p>
        </div>
      </div>

      <p className="font-serif text-sm opacity-80 leading-relaxed italic mt-auto">
        &quot;{summary}&quot;
      </p>
    </div>
  );
}
