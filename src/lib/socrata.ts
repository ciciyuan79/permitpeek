// src/lib/socrata.ts
//
// Smart permit search with accurate total count + recent 50 detail.
// Returns BOTH the real total (could be hundreds or thousands)
// AND the top 50 recent permits for display.

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
  permits: Permit[];      // Up to 50 most recent for display
  totalCount: number;     // Actual count of all matching permits
  showingCount: number;   // How many we're actually showing (≤ 50)
}

// ═══════════════════════════════════════════════════════════
// ADDRESS NORMALIZATION (same as before)
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

// ═══════════════════════════════════════════════════════════
// QUERY EXECUTION — supports both detail and count queries
// ═══════════════════════════════════════════════════════════

/**
 * Build the WHERE clause for a query. Returns null if no valid query is possible.
 */
function buildWhereClauses(city: CityConfig, parsed: ParsedAddress): string[] {
  const { addressField, streetField } = city;
  const strategies: string[] = [];

  if (!streetField) {
    // Single-field cities
    if (parsed.fullCleaned) {
      strategies.push(`upper(${addressField}) like '%${esc(parsed.fullCleaned.toUpperCase())}%'`);
    }
    if (parsed.houseNumber && parsed.streetKeyword) {
      strategies.push(`upper(${addressField}) like '%${esc(parsed.houseNumber)}%${esc(parsed.streetKeyword)}%'`);
    }
    if (parsed.streetKeyword) {
      strategies.push(`upper(${addressField}) like '%${esc(parsed.streetKeyword)}%'`);
    }
    return strategies;
  }

  // Two-field cities (NYC, SF, Chicago, LA)

  // Strategy 1: Exact house + fuzzy street keyword
  if (parsed.houseNumber && parsed.streetKeyword) {
    strategies.push(
      `${addressField}='${esc(parsed.houseNumber)}' AND upper(${streetField}) like '%${esc(parsed.streetKeyword)}%'`
    );
  }

  // Strategy 2: Exact house + each street part
  if (parsed.houseNumber && parsed.streetParts.length > 1) {
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

  // Strategy 3: Just the house number
  if (parsed.houseNumber) {
    strategies.push(`${addressField}='${esc(parsed.houseNumber)}'`);
  }

  // Strategy 4: Street keyword only
  if (parsed.streetKeyword) {
    strategies.push(`upper(${streetField}) like '%${esc(parsed.streetKeyword)}%'`);
  }

  return strategies;
}

/**
 * Run a count query for a given WHERE clause.
 */
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

/**
 * Run a detail query for a given WHERE clause.
 */
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
// MAIN SEARCH — tries fallback strategies, returns count + detail
// ═══════════════════════════════════════════════════════════

async function searchWithFallbacks(
  city: CityConfig,
  parsed: ParsedAddress
): Promise<{ where: string; permits: Record<string, string>[]; total: number }> {
  const strategies = buildWhereClauses(city, parsed);

  for (const where of strategies) {
    // First get count to see if this strategy yields results
    const total = await countQuery(city, where);
    if (total > 0) {
      // We found a match — fetch the top 50 for display
      const permits = await detailQuery(city, where, 50);
      return { where, permits, total };
    }
  }

  return { where: "", permits: [], total: 0 };
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════

export async function fetchPermits(
  city: CityConfig,
  address: string
): Promise<Permit[]> {
  const result = await fetchPermitsWithCount(city, address);
  return result.permits;
}

/**
 * Enhanced version that returns both display permits AND accurate total count.
 * Use this for the report page to show truthful totals.
 */
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
  } = city;

  const parsed = parseAddress(address);

  if (!parsed.houseNumber && !parsed.streetKeyword) {
    return { permits: [], totalCount: 0, showingCount: 0 };
  }

  const { permits: rawResults, total } = await searchWithFallbacks(city, parsed);

  const permits: Permit[] = rawResults.map((item: Record<string, string>, index: number) => ({
    id: item.id || `permit-${index}`,
    type: item[typeField] || "Unknown",
    date: item[dateField] || "",
    status: item[statusField] || "Unknown",
    value: item[valueField] || "0",
    description: item[descField] || "No description provided",
    address: streetField
      ? `${item[addressField] || ""} ${item[streetField] || ""}`.trim()
      : item[addressField] || "",
    contractor: (city.contractorField && item[city.contractorField]) ? item[city.contractorField] : "",
  }));
    id: item.id || `permit-${index}`,
    type: item[typeField] || "Unknown",
    date: item[dateField] || "",
    status: item[statusField] || "Unknown",
    value: item[valueField] || "0",
    description: item[descField] || "No description provided",
    address: streetField
      ? `${item[addressField] || ""} ${item[streetField] || ""}`.trim()
      : item[addressField] || "",
  }));

  return {
    permits,
    totalCount: total,
    showingCount: permits.length,
  };
}
