// src/lib/socrata.ts
//
// Smart permit search with multi-strategy fallback.
// Handles real-world address variations: abbreviations, ordinals,
// Queens hyphenated addresses, NYC borough nuances, etc.

import { CityConfig } from "./cities";

export interface Permit {
  id: string;
  type: string;
  date: string;
  status: string;
  value: string;
  description: string;
  address: string;
}

// ═══════════════════════════════════════════════════════════
// ADDRESS NORMALIZATION
// ═══════════════════════════════════════════════════════════

/**
 * Strip city/state/zip suffix from address.
 * "350 5th Avenue, New York, NY 10118" → "350 5th Avenue"
 */
function stripLocationSuffix(address: string): string {
  // Remove anything after first comma
  const commaIdx = address.indexOf(",");
  if (commaIdx !== -1) {
    return address.substring(0, commaIdx).trim();
  }
  return address.trim();
}

/**
 * Strip apartment/unit numbers.
 * "350 5th Ave Apt 4B" → "350 5th Ave"
 */
function stripUnit(address: string): string {
  return address
    .replace(/\s+(apt|apartment|unit|suite|ste|#)\.?\s*[a-z0-9-]+$/i, "")
    .trim();
}

/**
 * Strip ordinal suffix from numbers.
 * "5th" → "5", "42nd" → "42", "23rd" → "23", "1st" → "1"
 */
function stripOrdinal(word: string): string {
  return word.replace(/^(\d+)(st|nd|rd|th)$/i, "$1");
}

/**
 * Detect if address is a NYC Queens-style hyphenated address.
 * Examples: "47-01 111th Street", "30-77 Steinway Street"
 */
function isQueensAddress(houseNumber: string): boolean {
  return /^\d+-\d+$/.test(houseNumber);
}

/**
 * Expand common street type abbreviations.
 * "Ave" → ["AVE", "AVENUE"], "St" → ["ST", "STREET"]
 */
function expandStreetType(word: string): string[] {
  const upper = word.toUpperCase();
  const expansions: Record<string, string[]> = {
    "AVE": ["AVE", "AVENUE"],
    "AVENUE": ["AVE", "AVENUE"],
    "ST": ["ST", "STREET"],
    "STREET": ["ST", "STREET"],
    "BLVD": ["BLVD", "BOULEVARD"],
    "BOULEVARD": ["BLVD", "BOULEVARD"],
    "RD": ["RD", "ROAD"],
    "ROAD": ["RD", "ROAD"],
    "DR": ["DR", "DRIVE"],
    "DRIVE": ["DR", "DRIVE"],
    "PL": ["PL", "PLACE"],
    "PLACE": ["PL", "PLACE"],
    "PKWY": ["PKWY", "PARKWAY"],
    "PARKWAY": ["PKWY", "PARKWAY"],
    "TPKE": ["TPKE", "TURNPIKE"],
    "TURNPIKE": ["TPKE", "TURNPIKE"],
    "TER": ["TER", "TERRACE"],
    "TERRACE": ["TER", "TERRACE"],
    "LN": ["LN", "LANE"],
    "LANE": ["LN", "LANE"],
    "CT": ["CT", "COURT"],
    "COURT": ["CT", "COURT"],
    "SQ": ["SQ", "SQUARE"],
    "SQUARE": ["SQ", "SQUARE"],
    "PLZ": ["PLZ", "PLAZA"],
    "PLAZA": ["PLZ", "PLAZA"],
    "HWY": ["HWY", "HIGHWAY"],
    "HIGHWAY": ["HWY", "HIGHWAY"],
  };
  return expansions[upper] || [upper];
}

/**
 * Expand direction prefixes.
 * "W" → ["W", "WEST"], "East" → ["E", "EAST"]
 */
function expandDirection(word: string): string[] {
  const upper = word.toUpperCase();
  const expansions: Record<string, string[]> = {
    "W": ["W", "WEST"],
    "WEST": ["W", "WEST"],
    "E": ["E", "EAST"],
    "EAST": ["E", "EAST"],
    "N": ["N", "NORTH"],
    "NORTH": ["N", "NORTH"],
    "S": ["S", "SOUTH"],
    "SOUTH": ["S", "SOUTH"],
  };
  return expansions[upper] || [upper];
}

/**
 * Build a core street name keyword for fuzzy LIKE matching.
 * Pulls out the most distinctive word (usually the proper noun).
 * Strips ordinals, expands directions.
 *
 * "5th Avenue" → "5"  (the distinctive part)
 * "E 42nd Street" → "42"
 * "Avenue of the Americas" → "AMERICAS"
 * "Mosholu Avenue" → "MOSHOLU"
 * "Flatbush Avenue" → "FLATBUSH"
 * "Brooklyn Avenue" → "BROOKLYN"
 */
function extractStreetKeyword(streetParts: string[]): string {
  // Strip out direction prefixes (W, E, N, S, WEST, EAST, etc.)
  const directionWords = new Set([
    "W", "E", "N", "S",
    "WEST", "EAST", "NORTH", "SOUTH",
    "NE", "NW", "SE", "SW",
  ]);

  // Strip out street type suffixes (Avenue, Street, etc.)
  const streetTypes = new Set([
    "AVE", "AVENUE", "ST", "STREET", "BLVD", "BOULEVARD",
    "RD", "ROAD", "DR", "DRIVE", "PL", "PLACE", "PKWY", "PARKWAY",
    "TPKE", "TURNPIKE", "TER", "TERRACE", "LN", "LANE", "CT", "COURT",
    "SQ", "SQUARE", "PLZ", "PLAZA", "HWY", "HIGHWAY",
  ]);

  // Filter to "meaningful" words
  const meaningful = streetParts
    .map(p => p.toUpperCase().replace(/[^\w]/g, ""))
    .filter(p => p && !directionWords.has(p) && !streetTypes.has(p));

  if (meaningful.length === 0) {
    // Edge case: nothing meaningful, return original
    return streetParts.join(" ").toUpperCase();
  }

  // Strip ordinals from the first meaningful word (most distinctive usually)
  const primary = stripOrdinal(meaningful[0]);
  return primary;
}

// ═══════════════════════════════════════════════════════════
// QUERY BUILDERS
// ═══════════════════════════════════════════════════════════

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

/**
 * Escape single quotes for SoQL queries.
 */
function esc(s: string): string {
  return s.replace(/'/g, "''");
}

// ═══════════════════════════════════════════════════════════
// SEARCH STRATEGIES
// ═══════════════════════════════════════════════════════════

/**
 * Try multiple search strategies in order of specificity.
 * Returns the first strategy that yields results.
 */
async function searchWithFallbacks(
  city: CityConfig,
  parsed: ParsedAddress
): Promise<Record<string, string>[]> {
  const { addressField, streetField, dateField } = city;

  if (!streetField) {
    // Cities with single-field addresses (Austin, Seattle)
    return searchSingleField(city, parsed);
  }

  // Cities with separate house+street fields (NYC, SF, Chicago, LA)
  const strategies: string[] = [];

  // Strategy 1: Exact house + fuzzy street keyword
  // E.g., house__=350 AND street_name LIKE '%5%AVENUE%'
  if (parsed.houseNumber && parsed.streetKeyword) {
    strategies.push(
      `${addressField}='${esc(parsed.houseNumber)}' AND upper(${streetField}) like '%${esc(parsed.streetKeyword)}%'`
    );
  }

  // Strategy 2: Exact house + each street part (loose AND)
  // For multi-word streets like "Avenue of the Americas"
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

  // Strategy 3: Just the house number (might match many, but better than nothing)
  // Useful for Queens hyphenated addresses
  if (parsed.houseNumber) {
    strategies.push(`${addressField}='${esc(parsed.houseNumber)}'`);
  }

  // Strategy 4: Street keyword only — returns ALL permits on that street
  // User can see if data exists at all
  if (parsed.streetKeyword) {
    strategies.push(`upper(${streetField}) like '%${esc(parsed.streetKeyword)}%'`);
  }

  // Try each strategy in order
  for (const where of strategies) {
    const results = await runQuery(city, where);
    if (results.length > 0) {
      return results;
    }
  }

  return [];
}

/**
 * Search cities with a single combined address field (Austin, Seattle).
 */
async function searchSingleField(
  city: CityConfig,
  parsed: ParsedAddress
): Promise<Record<string, string>[]> {
  const { addressField } = city;

  // Strategy 1: Full cleaned address
  let where = `upper(${addressField}) like '%${esc(parsed.fullCleaned.toUpperCase())}%'`;
  let results = await runQuery(city, where);
  if (results.length > 0) return results;

  // Strategy 2: House + street keyword
  if (parsed.houseNumber && parsed.streetKeyword) {
    where = `upper(${addressField}) like '%${esc(parsed.houseNumber)}%${esc(parsed.streetKeyword)}%'`;
    results = await runQuery(city, where);
    if (results.length > 0) return results;
  }

  // Strategy 3: Street keyword only
  if (parsed.streetKeyword) {
    where = `upper(${addressField}) like '%${esc(parsed.streetKeyword)}%'`;
    results = await runQuery(city, where);
    if (results.length > 0) return results;
  }

  return [];
}

/**
 * Execute a single Socrata query.
 */
async function runQuery(
  city: CityConfig,
  where: string
): Promise<Record<string, string>[]> {
  const { endpoint, dateField } = city;

  const params = new URLSearchParams({
    $where: where,
    $limit: "50",
    $order: `${dateField} DESC`,
  });

  const url = `${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Socrata query failed: ${response.statusText}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Socrata fetch error:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════

export async function fetchPermits(
  city: CityConfig,
  address: string
): Promise<Permit[]> {
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

  // No address provided? Return empty.
  if (!parsed.houseNumber && !parsed.streetKeyword) {
    return [];
  }

  const rawResults = await searchWithFallbacks(city, parsed);

  return rawResults.map((item: Record<string, string>, index: number) => ({
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
}
