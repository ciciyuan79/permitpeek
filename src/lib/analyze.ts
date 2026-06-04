// src/lib/analyze.ts
// Risk analysis engine + permit code translation + accurate totals + numeric score

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
// RISK ANALYSIS — now supports accurate totalCount + numeric score
// ═══════════════════════════════════════════════════════════

export type RiskScore = "clean" | "review" | "risk";

export interface Flag {
  level: "high" | "med" | "low";
  text: string;
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
  scoreValue: number;   // NEW: 0–100 numeric score (higher = safer)
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
      scoreValue: 50, // unknown / no data
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

  // ─── NEW: numeric 0–100 score (higher = safer) ───
  // Starts at 100, deducts for risk signals. Mirrors the homepage gauge.
  let scoreValue = 100;
  scoreValue -= Math.min(stats.open * 6, 45);        // open permits hurt most
  scoreValue -= Math.min(stats.expired * 4, 20);     // expired permits
  scoreValue -= Math.min(stats.electrical * 2, 12);  // heavy electrical history
  scoreValue -= Math.min(stats.structural * 2, 12);  // structural/renovation
  scoreValue = Math.max(8, Math.min(100, Math.round(scoreValue)));

  let summary: string;
  if (isSubset) {
    summary = `${total.toLocaleString()} total permits on record. Showing the ${stats.showing} most recent. ${stats.open} open in this sample.`;
  } else {
    summary = `${stats.total} permit${stats.total > 1 ? "s" : ""} on record. ${stats.open} open, ${stats.expired} expired, ${stats.finaled} finaled.`;
  }

  return {
    score,
    scoreValue,
    flags,
    summary,
    openCount: stats.open,
    expiredCount: stats.expired,
    stats,
  };
}
