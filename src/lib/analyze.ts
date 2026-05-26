import { Permit } from "./socrata";

export type RiskScore = "clean" | "review" | "risk";

export interface RiskFlag {
  level: "high" | "med" | "low";
  text: string;
}

export interface RiskStats {
  total: number;
  open: number;
  expired: number;
  finaled: number;
  electrical: number;
  structural: number;
  plumbing: number;
}

export interface AnalysisResult {
  score: RiskScore;
  flags: RiskFlag[];
  stats: RiskStats;
  summary: string;
}

export function analyzePermits(permits: Permit[]): AnalysisResult {
  const stats: RiskStats = {
    total: permits.length,
    open: 0,
    expired: 0,
    finaled: 0,
    electrical: 0,
    structural: 0,
    plumbing: 0,
  };

  const flags: RiskFlag[] = [];

  permits.forEach((permit) => {
    const status = permit.status.toLowerCase();
    const type = permit.type.toLowerCase();
    const desc = permit.description.toLowerCase();

    // Stats
    if (/open|active|issued|pending|in progress/.test(status)) {
      stats.open++;
    }
    if (/expired|void|cancelled/.test(status)) {
      stats.expired++;
    }
    if (/finaled|closed|completed|inspected/.test(status)) {
      stats.finaled++;
    }

    if (/elect/.test(type) || /elect/.test(desc)) {
      stats.electrical++;
    }
    if (/struct|renov|addit|alter/.test(type) || /struct|renov|addit|alter/.test(desc)) {
      stats.structural++;
    }
    if (/plumb/.test(type) || /plumb/.test(desc)) {
      stats.plumbing++;
    }
  });

  // Risk Logic
  if (stats.open > 0) {
    flags.push({
      level: "high",
      text: `${stats.open} open permit${stats.open > 1 ? "s" : ""} without final inspection. Can delay home sale or mortgage closing.`,
    });
  }

  if (stats.expired > 0) {
    flags.push({
      level: "med",
      text: `${stats.expired} expired permit${stats.expired > 1 ? "s" : ""}. Work may have been started but never officially completed.`,
    });
  }

  if (stats.electrical >= 3) {
    flags.push({
      level: "med",
      text: `Multiple electrical permits (${stats.electrical}) found. May indicate significant rewiring or recurring issues.`,
    });
  }

  if (stats.structural > 0) {
    flags.push({
      level: "low",
      text: "Structural or renovation permits detected. Verify work was done to code and matches the home's current layout.",
    });
  }

  let score: RiskScore = "clean";
  if (flags.some((f) => f.level === "high")) {
    score = "risk";
  } else if (flags.some((f) => f.level === "med")) {
    score = "review";
  }

  const summary = stats.total === 0
    ? "No permits found for this address. This is common for older homes or those that haven't had recent work."
    : `Found ${stats.total} total permits. ${stats.open} are still open, and ${stats.expired} are expired. Overall risk level is ${score.toUpperCase()}.`;

  return { score, flags, stats, summary };
}
