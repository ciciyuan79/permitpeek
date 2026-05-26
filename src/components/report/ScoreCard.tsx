import { RiskScore } from "@/lib/analyze";
import { ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";

interface ScoreCardProps {
  score: RiskScore;
  summary: string;
}

export default function ScoreCard({ score, summary }: ScoreCardProps) {
  const config = {
    clean: {
      color: "text-emerald-900 bg-emerald-50 border-emerald-900/20",
      icon: ShieldCheck,
      label: "Clean History",
      desc: "Low risk detected. Standard historical maintenance patterns.",
    },
    review: {
      color: "text-amber-900 bg-amber-50 border-amber-900/20",
      icon: AlertTriangle,
      label: "Review Advised",
      desc: "Medium risk flags identified. Manual verification recommended.",
    },
    risk: {
      color: "text-red-900 bg-red-50 border-red-900/20",
      icon: AlertCircle,
      label: "Risk Detected",
      desc: "High risk indicators. Potential legal or safety compliance issues.",
    },
  }[score];

  const Icon = config.icon;

  return (
    <div className={`p-8 border ${config.color} h-full`}>
      <div className="flex items-center gap-3 mb-6">
        <Icon size={24} strokeWidth={1.5} />
        <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
          {config.label}
        </span>
      </div>
      
      <h3 className="font-display text-3xl font-light mb-4 leading-tight">
        {config.desc}
      </h3>
      
      <p className="font-serif text-sm opacity-80 leading-relaxed italic">
        &quot;{summary}&quot;
      </p>
    </div>
  );
}
