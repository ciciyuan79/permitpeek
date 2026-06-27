// src/lib/analyze.ts
// Risk analysis engine + permit code translation + accurate totals + numeric score
// Now returns scoreFactors: a transparent breakdown of how the score was derived.

import type { Permit } from "./socrata";

// ═══════════════════════════════════════════════════════════
// PERMIT CODE TRANSLATIONS
// ═══════════════════════════════════════════════════════════

const PERMIT_TYPE_NAMES: Record<string, string> = {
  "A1": "Major Alteration (Use Change)",
  "A2": "Minor Alteration (Renovation)",
  "A3": "Minor Alteration",
  "NB": "New Building Construction",
  "DM": "Demolition",
  "EW": "Earthwork / Excavation",
  "EQ": "Equipment Permit",
  "FA": "Fire Alarm",
  "FB": "Fuel Burning",
  "FP": "Fire Protection",
  "FS": "Fuel Storage",
  "MH": "Manhole / Vault Work",
  "PL": "Plumbing Work",
  "SD": "Sidewalk Shed",
  "SF": "Scaffold",
  "SG": "Sign",
  "SH": "Sidewalk Shed",
  "SP": "Sprinkler System",
  "OT": "Other / Misc Work",
  "BL": "Boiler",
  "PLUMBING": "Plumbing Work",
  "ELECTRICAL": "Electrical Work",
  "MECHANICAL": "HVAC / Mechanical",
  "STRUCTURAL": "Structural Work",
  "DEMOLITION": "Demolition",
  "ALTERATION": "Renovation",
  "ADDITION": "Building Addition",
};

export function translatePermitType(code: string): string {
  if (!code) return "Building Permit";
  const upper = code.toUpperCase().trim();
  return PERMIT_TYPE_NAMES[upper] || code;
}

// ═══════════════════════════════════════════════════════════
// RISK ANALYSIS
// ═══════════════════════════════════════════════════════════

export type RiskScore = "clean" | "review" | "risk";

export interface Flag {
  level: "high" | "med" | "low";
  text: string;
}

export interface ScoreFactor {
  label: string;        // e.g. "Open permits"
  points: number;       // signed: negative = deduction, positive = baseline
  detail: string;       // plain-English explanation
}

export interface Stats {
  total: number;
  showing: number;
  open: number;
  expired: number;
  finaled: number;
  electrical: number;
  structural: number;
  plumbing: number;
  totalValue: number;
}

export interface Analysis {
  score: RiskScore;
  scoreValue: number;
  scoreFactors: ScoreFactor[];   // NEW: transparent breakdown of the score
  flags: Flag[];
  summary: string;
  openCount: number;
  expiredCount: number;
  stats: Stats;
}

export function analyzePermits(permits: Permit[], totalCount?: number): Analysis {
  const total = totalCount !== undefined ? totalCount : permits.length;

  const stats: Stats = {
    total,
    showing: permits.length,
    open: 0,
    expired: 0,
    finaled: 0,
    electrical: 0,
    structural: 0,
    plumbing: 0,
    totalValue: 0,
  };

  if (!permits.length) {
    return {
      score: "clean",
      scoreValue: 50,
      scoreFactors: [
        { label: "No records found", points: 0, detail: "No permit history was found for this address, so there's nothing to score. This can mean no permitted work was done, or it predates the city's digital records." },
      ],
      flags: [],
      summary: "No permits found on record.",
      openCount: 0,
      expiredCount: 0,
      stats,
    };
  }

  const flags: Flag[] = [];

  permits.forEach(p => {
    const haystack = `${p.type || ""} ${p.description || ""} ${p.status || ""}`.toLowerCase();
    const isOpen =
      /open|active|issued|in progress|applied|pending/i.test(p.status || "") &&
      !/final|closed|complete|expired|withdrawn/i.test(p.status || "");

    if (isOpen) stats.open++;
    if (/expired/i.test(p.status || "")) stats.expired++;
    if (/final|closed|complete/i.test(p.status || "")) stats.finaled++;
    if (/electric/.test(haystack)) stats.electrical++;
    if (/struct|addition|renov|remodel|a1|a2|nb/.test(haystack)) stats.structural++;
    if (/plumb/.test(haystack)) stats.plumbing++;

    const v = parseFloat(p.value || "0");
    if (!isNaN(v)) stats.totalValue += v;
  });

  const samplingRatio = stats.showing > 0 ? total / stats.showing : 1;
  const isSubset = total > stats.showing;

  if (stats.open > 0) {
    if (isSubset) {
      const estimatedOpen = Math.round(stats.open * samplingRatio);
      flags.push({
        level: "high",
        text: `~${estimatedOpen} open permit${estimatedOpen > 1 ? "s" : ""} estimated across all records (${stats.open} in recent sample). Open permits can delay home sale or mortgage closing.`,
      });
    } else {
      flags.push({
        level: "high",
        text: `${stats.open} open permit${stats.open > 1 ? "s" : ""} without final inspection. Can delay home sale or mortgage closing.`,
      });
    }
  }

  if (stats.expired > 0) {
    flags.push({
      level: "med",
      text: `${stats.expired} expired permit${stats.expired > 1 ? "s" : ""} in recent sample. May require re-inspection.`,
    });
  }

  if (stats.electrical >= 3) {
    flags.push({
      level: "med",
      text: `${stats.electrical}+ electrical permits in recent sample — significant electrical work history.`,
    });
  }

  if (stats.structural >= 1) {
    flags.push({
      level: "low",
      text: `${stats.structural} structural / renovation permit${stats.structural > 1 ? "s" : ""} in recent sample.`,
    });
  }

  const score: RiskScore = flags.some(f => f.level === "high")
    ? "risk"
    : flags.length > 0
      ? "review"
      : "clean";

  // ─── Numeric 0–100 score with captured factors ───
  const scoreFactors: ScoreFactor[] = [];
  let scoreValue = 100;

  scoreFactors.push({
    label: "Baseline",
    points: 100,
    detail: "Every property starts at 100. Points come off for unresolved or high-activity permit signals.",
  });

  const openDeduction = Math.min(stats.open * 6, 45);
  if (openDeduction > 0) {
    scoreValue -= openDeduction;
    scoreFactors.push({
      label: `Open permits (${stats.open} in sample)`,
      points: -openDeduction,
      detail: "Open permits — work that was started but never inspected to completion — can delay or block a sale or mortgage. These weigh the most.",
    });
  }

  const expiredDeduction = Math.min(stats.expired * 4, 20);
  if (expiredDeduction > 0) {
    scoreValue -= expiredDeduction;
    scoreFactors.push({
      label: `Expired permits (${stats.expired} in sample)`,
      points: -expiredDeduction,
      detail: "Expired permits may need to be reopened and re-inspected before the work is considered legal and closed.",
    });
  }

  const elecDeduction = Math.min(stats.electrical * 2, 12);
  if (elecDeduction > 0) {
    scoreValue -= elecDeduction;
    scoreFactors.push({
      label: `Electrical work history (${stats.electrical} in sample)`,
      points: -elecDeduction,
      detail: "A heavy electrical permit history isn't bad on its own, but it's worth confirming the work was finaled and done by licensed contractors.",
    });
  }

  const structDeduction = Math.min(stats.structural * 2, 12);
  if (structDeduction > 0) {
    scoreValue -= structDeduction;
    scoreFactors.push({
      label: `Structural / renovation work (${stats.structural} in sample)`,
      points: -structDeduction,
      detail: "Additions and structural changes are where unpermitted square footage and code issues most often hide. Worth verifying against the listing.",
    });
  }

  scoreValue = Math.max(8, Math.min(100, Math.round(scoreValue)));

  if (scoreFactors.length === 1) {
    // Only baseline — nothing was deducted.
    scoreFactors.push({
      label: "No risk signals",
      points: 0,
      detail: "No open, expired, or high-activity permit signals were found in the records reviewed. This is a clean permit profile.",
    });
  }

  let summary: string;
  if (isSubset) {
    summary = `${total.toLocaleString()} total permits on record. Showing the ${stats.showing} most recent. ${stats.open} open in this sample.`;
  } else {
    summary = `${stats.total} permit${stats.total > 1 ? "s" : ""} on record. ${stats.open} open, ${stats.expired} expired, ${stats.finaled} finaled.`;
  }

  return {
    score,
    scoreValue,
    scoreFactors,
    flags,
    summary,
    openCount: stats.open,
    expiredCount: stats.expired,
    stats,
  };
}
