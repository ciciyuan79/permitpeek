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
  "Ew": "Earthwork / Excavation",
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
  
  // Standard category names (already readable)
  "PLUMBING": "Plumbing Work",
  "ELECTRICAL": "Electrical Work",
  "MECHANICAL": "HVAC / Mechanical",
  "STRUCTURAL": "Structural Work",
  "DEMOLITION": "Demolition",
  "ALTERATION": "Renovation",
  "ADDITION": "Building Addition",
};

const JOB_TYPE_NAMES: Record<string, string> = {
  "A1": "Major Renovation",
  "A2": "Standard Renovation",
  "A3": "Minor Renovation",
  "NB": "New Construction",
  "DM": "Demolition",
  "SG": "Sign Installation",
};

export function translatePermitType(code: string): string {
  if (!code) return "Building Permit";
  const upper = code.toUpperCase().trim();
  return PERMIT_TYPE_NAMES[upper] || PERMIT_TYPE_NAMES[code] || code;
}

export function translateJobType(code: string): string {
  if (!code) return "";
  const upper = code.toUpperCase().trim();
  return JOB_TYPE_NAMES[upper] || code;
}

// ═══════════════════════════════════════════════════════════
// PERMIT SUMMARY — for showing rich stats before paywall
// ═══════════════════════════════════════════════════════════

export interface PermitSummary {
  totalValue: number;
  totalValueFormatted: string;
  mostRecentDate: string;
  mostRecentType: string;
  oldestDate: string;
  byType: { type: string; count: number }[];
  topContractors: { name: string; count: number }[];
  permitsByYear: { year: string; count: number }[];
  estimatedConstructionAge: string;
}

export function summarizePermits(permits: Permit[]): PermitSummary {
  const totalValue = permits.reduce((sum, p) => {
    const v = parseFloat(p.value || "0");
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  // Group by translated type
  const typeMap = new Map<string, number>();
  permits.forEach(p => {
    const translated = translatePermitType(p.type);
    typeMap.set(translated, (typeMap.get(translated) || 0) + 1);
  });
  const byType = Array.from(typeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Group by year
  const yearMap = new Map<string, number>();
  permits.forEach(p => {
    if (!p.date) return;
    const year = new Date(p.date).getFullYear().toString();
    if (year && year !== "NaN") {
      yearMap.set(year, (yearMap.get(year) || 0) + 1);
    }
  });
  const permitsByYear = Array.from(yearMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, 5);

  // Sort by date for most/oldest
  const dated = permits.filter(p => p.date).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const mostRecent = dated[0];
  const oldest = dated[dated.length - 1];

  return {
    totalValue,
    totalValueFormatted: totalValue > 0
      ? `$${(totalValue / 1000000).toFixed(1)}M`
      : "Not disclosed",
    mostRecentDate: mostRecent?.date || "",
    mostRecentType: mostRecent ? translatePermitType(mostRecent.type) : "",
    oldestDate: oldest?.date || "",
    byType: byType.slice(0, 6),
    topContractors: [], // populated if data available
    permitsByYear,
    estimatedConstructionAge: oldest?.date
      ? `Records go back to ${new Date(oldest.date).getFullYear()}`
      : "",
  };
}

// ═══════════════════════════════════════════════════════════
// RISK ANALYSIS
// ═══════════════════════════════════════════════════════════

export interface Flag {
  level: "high" | "med" | "low";
  text: string;
}

export interface Analysis {
  score: "clean" | "review" | "risk";
  flags: Flag[];
  summary: string;
  openCount: number;
  expiredCount: number;
}

export function analyzePermits(permits: Permit[]): Analysis {
  if (!permits.length) {
    return {
      score: "clean",
      flags: [],
      summary: "No permits found on record.",
      openCount: 0,
      expiredCount: 0,
    };
  }

  const flags: Flag[] = [];
  const openPermits = permits.filter(p =>
    /open|active|issued|in progress|applied|pending/i.test(p.status) &&
    !/final|closed|complete|expired|withdrawn/i.test(p.status)
  );
  const expired = permits.filter(p => /expired/i.test(p.status));
  const electrical = permits.filter(p => /electric/i.test(p.type + " " + p.description));
  const structural = permits.filter(p => /struct|addition|renov|remodel|a1|a2|nb/i.test(p.type + " " + p.description));

  if (openPermits.length) {
    flags.push({
      level: "high",
      text: `${openPermits.length} open permit${openPermits.length > 1 ? "s" : ""} without final inspection. Can delay home sale or mortgage closing.`,
    });
  }
  if (expired.length) {
    flags.push({
      level: "med",
      text: `${expired.length} expired permit${expired.length > 1 ? "s" : ""}. May require re-inspection.`,
    });
  }
  if (electrical.length > 2) {
    flags.push({
      level: "med",
      text: `Multiple electrical permits filed — significant electrical work history.`,
    });
  }
  if (structural.length) {
    flags.push({
      level: "low",
      text: `${structural.length} structural / renovation permit${structural.length > 1 ? "s" : ""} on record.`,
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
    summary: `${permits.length} permit${permits.length > 1 ? "s" : ""} on record. ${openPermits.length} open, ${expired.length} expired.`,
    openCount: openPermits.length,
    expiredCount: expired.length,
  };
}
