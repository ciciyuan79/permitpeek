// src/lib/analyze.ts
// Risk analysis engine + permit code translation
// REPLACE your entire src/lib/analyze.ts with this file

import type { Permit } from "./socrata";

// ═══════════════════════════════════════════════════════════
// PERMIT CODE TRANSLATIONS
// Turn cryptic codes ("A2", "Ew", "MH") into human language
// ═══════════════════════════════════════════════════════════

const PERMIT_TYPE_NAMES: Record<string, string> = {
  // NYC DOB Permit Types
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
// RISK ANALYSIS — keeps the stats object structure
// ═══════════════════════════════════════════════════════════

export interface Flag {
  level: "high" | "med" | "low";
  text: string;
}

export interface Stats {
  total: number;
  open: number;
  expired: number;
  finaled: number;
  electrical: number;
  structural: number;
  plumbing: number;
  totalValue: number;
}

export interface Analysis {
  score: "clean" | "review" | "risk";
  flags: Flag[];
  summary: string;
  openCount: number;
  expiredCount: number;
  stats: Stats;
}

export function analyzePermits(permits: Permit[]): Analysis {
  const stats: Stats = {
    total: permits.length,
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

  if (stats.open > 0) {
    flags.push({
      level: "high",
      text: `${stats.open} open permit${stats.open > 1 ? "s" : ""} without final inspection. Can delay home sale or mortgage closing.`,
    });
  }

  if (stats.expired > 0) {
    flags.push({
      level: "med",
      text: `${stats.expired} expired permit${stats.expired > 1 ? "s" : ""}. May require re-inspection.`,
    });
  }

  if (stats.electrical >= 3) {
    flags.push({
      level: "med",
      text: `${stats.electrical} electrical permits on file — significant electrical work history.`,
    });
  }

  if (stats.structural >= 1) {
    flags.push({
      level: "low",
      text: `${stats.structural} structural / renovation permit${stats.structural > 1 ? "s" : ""} on record.`,
    });
  }

  const score: Analysis["score"] = flags.some(f => f.level === "high")
    ? "risk"
    : flags.length > 0
      ? "review"
      : "clean";

  return {
    score,
    flags,
    summary: `${permits.length} permit${permits.length > 1 ? "s" : ""} on record. ${stats.open} open, ${stats.expired} expired, ${stats.finaled} finaled.`,
    openCount: stats.open,
    expiredCount: stats.expired,
    stats,
  };
}
