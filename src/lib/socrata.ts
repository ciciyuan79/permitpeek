// src/lib/socrata.ts
//
// Smart permit search with accurate total count + recent 50 detail.
// Matching tightened: requires house number AND street to match,
// so a wrong-city/vague address returns "no results" instead of mis-matching.

import { CityConfig } from "./cities";

export interface Permit {
  id: string;
  type: string;
  date: string;
  status: string;
  value: string;
  description: string;
  address: string;
  contractor: string;
}

export interface PermitSearchResult {
  permits: Permit[];
  totalCount: number;
  showingCount: number;
}

// ═══════════════════════════════════════════════════════════
// ADDRESS NORMALIZATION
// ═══════════════════════════════════════════════════════════

function stripLocationSuffix(address: string): string {
  const commaIdx = address.indexOf(",");
  if (commaIdx !== -1) {
    return address.substring(0, commaIdx).trim();
  }
  return address.trim();
}

function stripUnit(address: string): string {
  return address
    .replace(/\s+(apt|apartment|unit|suite|ste|#)\.?\s*[a-z0-9-]+$/i, "")
    .trim();
}

function stripOrdinal(word: string): string {
  return word.replace(/^(\d+)(st|nd|rd|th)$/i, "$1");
}

function isQueensAddress(houseNumber: string): boolean {
  return /^\d+-\d+$/.test(houseNumber);
}

function extractStreetKeyword(streetParts: string[]): string {
  const directionWords = new Set([
    "W", "E", "N", "S",
    "WEST", "EAST", "NORTH", "SOUTH",
    "NE", "NW", "SE", "SW",
  ]);

  const streetTypes = new Set([
    "AVE", "AVENUE", "ST", "STREET", "BLVD", "BOULEVARD",
    "RD", "ROAD", "DR", "DRIVE", "PL", "PLACE", "PKWY", "PARKWAY",
    "TPKE", "TURNPIKE", "TER", "TERRACE", "LN", "LANE", "CT", "COURT",
    "SQ", "SQUARE", "PLZ", "PLAZA", "HWY", "HIGHWAY",
  ]);

  const meaningful = streetParts
    .map(p => p.toUpperCase().replace(/[^\w]/g, ""))
    .filter(p => p && !directionWords.has(p) && !streetTypes.has(p));

  if (meaningful.length === 0) {
    return streetParts.join(" ").toUpperCase();
  }

  return stripOrdinal(meaningful[0]);
}

interface ParsedAddress {
  houseNumber: string;
  streetParts: string[];
  streetKeyword: string;
  fullCleaned: string;
  isQueens: boolean;
}

function parseAddress(rawAddress: string): ParsedAddress {
  const cleaned = stripUnit(stripLocationSuffix(rawAddress));
  const parts = cleaned.split(/\s+/);
  const houseNumber = parts[0] || "";
  const streetParts = parts.slice(1);

  return {
    houseNumber,
    streetParts,
    streetKeyword: extractStreetKeyword(streetParts),
    fullCleaned: cleaned,
    isQueens: isQueensAddress(houseNumber),
  };
}

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

// Clean up values that come wrapped in literal quote characters
// (e.g. Cincinnati's companyname = "\"PARADIGM CONSTRUCTION LLC\"")
function cleanValue(v: string): string {
  return (v || "").replace(/^"+|"+$/g, "").trim();
}

// ═══════════════════════════════════════════════════════════
// QUERY EXECUTION — TIGHTENED MATCHING
// Requires house number AND street. No loose "house-only" or
// "street-only" fallbacks (those returned the wrong property/city).
// ═══════════════════════════════════════════════════════════

function buildWhereClauses(city: CityConfig, parsed: ParsedAddress): string[] {
  const { addressField, streetField } = city;
  const strategies: string[] = [];

  if (!parsed.houseNumber) {
    return strategies;
  }

  if (!streetField) {
    if (!parsed.streetKeyword) {
      return strategies;
    }
    if (parsed.fullCleaned) {
      strategies.push(
        `upper(${addressField}) like '%${esc(parsed.fullCleaned.toUpperCase())}%'`
      );
    }
    strategies.push(
      `upper(${addressField}) like '%${esc(parsed.houseNumber)}%${esc(parsed.streetKeyword)}%'`
    );
    return strategies;
  }

  // Two-field cities: require EXACT house number AND a street match.
  if (parsed.streetKeyword) {
    strategies.push(
      `${addressField}='${esc(parsed.houseNumber)}' AND upper(${streetField}) like '%${esc(parsed.streetKeyword)}%'`
    );
  }

  if (parsed.streetParts.length > 1) {
    const partsConditions = parsed.streetParts
      .map(p => p.toUpperCase().replace(/[^\w]/g, ""))
      .filter(p => p.length > 2 && !["THE", "OF", "AND"].includes(p))
      .map(p => `upper(${streetField}) like '%${esc(p)}%'`);

    if (partsConditions.length > 0) {
      strategies.push(
        `${addressField}='${esc(parsed.houseNumber)}' AND ${partsConditions.join(" AND ")}`
      );
    }
  }

  return strategies;
}

async function countQuery(city: CityConfig, where: string): Promise<number> {
  const { endpoint } = city;
  const params = new URLSearchParams({
    $where: where,
    $select: "count(*) as total",
  });

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return parseInt(data[0]?.total || "0", 10);
  } catch {
    return 0;
  }
}

async function detailQuery(
  city: CityConfig,
  where: string,
  limit: number = 50
): Promise<Record<string, string>[]> {
  const { endpoint, dateField } = city;
  const params = new URLSearchParams({
    $where: where,
    $limit: limit.toString(),
    $order: `${dateField} DESC`,
  });

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN SEARCH
// ═══════════════════════════════════════════════════════════

async function searchWithFallbacks(
  city: CityConfig,
  parsed: ParsedAddress
): Promise<{ where: string; permits: Record<string, string>[]; total: number }> {
  const strategies = buildWhereClauses(city, parsed);

  for (const where of strategies) {
    const total = await countQuery(city, where);
    if (total > 0) {
      const permits = await detailQuery(city, where, 50);
      return { where, permits, total };
    }
  }

  return { where: "", permits: [], total: 0 };
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORTS
// ═══════════════════════════════════════════════════════════

export async function fetchPermits(
  city: CityConfig,
  address: string
): Promise<Permit[]> {
  const result = await fetchPermitsWithCount(city, address);
  return result.permits;
}

export async function fetchPermitsWithCount(
  city: CityConfig,
  address: string
): Promise<PermitSearchResult> {
  const {
    addressField,
    streetField,
    typeField,
    dateField,
    statusField,
    valueField,
    descField,
    permitteeField,
    ownerField,
  } = city;

  const parsed = parseAddress(address);

  // Require BOTH a house number and a street — prevents vague/wrong matches.
  if (!parsed.houseNumber || !parsed.streetKeyword) {
    return { permits: [], totalCount: 0, showingCount: 0 };
  }

  const { permits: rawResults, total } = await searchWithFallbacks(city, parsed);

  const permits: Permit[] = rawResults.map((item: Record<string, string>, index: number) => {
    // Contractor: prefer the permittee (contractor) field, fall back to owner.
    let contractor = "";
    if (permitteeField && item[permitteeField]) {
      contractor = cleanValue(item[permitteeField]);
    } else if (ownerField && item[ownerField]) {
      contractor = cleanValue(item[ownerField]);
    }

    return {
      id: item.id || `permit-${index}`,
      type: (typeField && item[typeField]) || "Unknown",
      date: (dateField && item[dateField]) || "",
      status: (statusField && item[statusField]) || "Unknown",
      value: (valueField && item[valueField]) || "0",
      description: (descField && item[descField]) || "No description provided",
      address: streetField
        ? `${item[addressField || ""] || ""} ${item[streetField] || ""}`.trim()
        : item[addressField || ""] || "",
      contractor,
    };
  });

  return {
    permits,
    totalCount: total,
    showingCount: permits.length,
  };
}
