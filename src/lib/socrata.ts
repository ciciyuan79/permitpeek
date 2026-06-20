// src/lib/socrata.ts
//
// Permit search supporting BOTH Socrata and ArcGIS portals.
// ArcGIS cities may have one `endpoint` or multiple `endpoints` (merged).
// Optional `statusMap` decodes coded status values (e.g. Miami-Dade A/E/F).

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
  if (commaIdx !== -1) return address.substring(0, commaIdx).trim();
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
    "W", "E", "N", "S", "WEST", "EAST", "NORTH", "SOUTH", "NE", "NW", "SE", "SW",
  ]);
  const streetTypes = new Set([
    "AVE", "AVENUE", "ST", "STREET", "BLVD", "BOULEVARD", "RD", "ROAD", "DR", "DRIVE",
    "PL", "PLACE", "PKWY", "PARKWAY", "TPKE", "TURNPIKE", "TER", "TERRACE", "LN", "LANE",
    "CT", "COURT", "SQ", "SQUARE", "PLZ", "PLAZA", "HWY", "HIGHWAY", "CV", "COVE", "PIKE",
  ]);

  const meaningful = streetParts
    .map(p => p.toUpperCase().replace(/[^\w]/g, ""))
    .filter(p => p && !directionWords.has(p) && !streetTypes.has(p));

  if (meaningful.length === 0) {
    return streetParts.join(" ").toUpperCase().replace(/[^\w\s]/g, "").trim();
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

function cleanValue(v: string): string {
  return (v || "").replace(/^"+|"+$/g, "").trim();
}

function formatArcgisDate(v: unknown): string {
  if (typeof v === "number" && v > 0) {
    try { return new Date(v).toISOString().split("T")[0]; } catch { return ""; }
  }
  return typeof v === "string" ? v : "";
}

function extractContactContractor(item: Record<string, string>): string {
  let general = "", any = "";
  for (let i = 1; i <= 12; i++) {
    const type = (item[`contact_${i}_type`] || "").toUpperCase();
    const name = cleanValue(item[`contact_${i}_name`] || "");
    if (!type || !name) continue;
    if (type.includes("CONTRACTOR")) {
      if (type.includes("GENERAL")) { if (!general) general = name; }
      else if (!any) any = name;
    }
  }
  return general || any || "";
}

// ═══════════════════════════════════════════════════════════
// SOCRATA
// ═══════════════════════════════════════════════════════════

function buildWhereClauses(city: CityConfig, parsed: ParsedAddress): string[] {
  const { addressField, streetField } = city;
  const strategies: string[] = [];
  const house = esc(parsed.houseNumber);
  const keyword = esc(parsed.streetKeyword);

  if (!parsed.houseNumber || !parsed.streetKeyword) return strategies;

  if (!streetField) {
    strategies.push(`upper(${addressField}) like '%${house}%${keyword}%'`);
    strategies.push(`upper(${addressField}) like '%${house}%' AND upper(${addressField}) like '%${keyword}%'`);
    return strategies;
  }

  strategies.push(`${addressField}='${house}' AND upper(${streetField}) like '%${keyword}%'`);

  if (parsed.streetParts.length > 1) {
    const partsConditions = parsed.streetParts
      .map(p => p.toUpperCase().replace(/[^\w]/g, ""))
      .filter(p => p.length > 2 && !["THE", "OF", "AND"].includes(p))
      .map(p => `upper(${streetField}) like '%${esc(p)}%'`);
    if (partsConditions.length > 0) {
      strategies.push(`${addressField}='${house}' AND ${partsConditions.join(" AND ")}`);
    }
  }

  strategies.push(`upper(${addressField}) like '%${house}%' AND upper(${streetField}) like '%${keyword}%'`);
  return strategies;
}

async function socrataCount(city: CityConfig, where: string): Promise<number> {
  const params = new URLSearchParams({ $where: where, $select: "count(*) as total" });
  try {
    const res = await fetch(`${city.endpoint}?${params.toString()}`, { next: { revalidate: 3600 } });
    if (!res.ok) return 0;
    const data = await res.json();
    return parseInt(data[0]?.total || "0", 10);
  } catch { return 0; }
}

async function socrataDetail(city: CityConfig, where: string, limit = 50): Promise<Record<string, string>[]> {
  const { endpoint, dateField } = city;
  if (dateField) {
    const p = new URLSearchParams({ $where: where, $limit: limit.toString(), $order: `${dateField} DESC` });
    try {
      const res = await fetch(`${endpoint}?${p.toString()}`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch { /* fall through */ }
  }
  const p = new URLSearchParams({ $where: where, $limit: limit.toString() });
  try {
    const res = await fetch(`${endpoint}?${p.toString()}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

async function socrataSearch(city: CityConfig, parsed: ParsedAddress) {
  const strategies = buildWhereClauses(city, parsed);
  for (const where of strategies) {
    const total = await socrataCount(city, where);
    if (total > 0) {
      const permits = await socrataDetail(city, where, 50);
      return { permits, total };
    }
  }
  return { permits: [] as Record<string, string>[], total: 0 };
}

// ═══════════════════════════════════════════════════════════
// ARCGIS (single or multiple endpoints)
// ═══════════════════════════════════════════════════════════

function buildArcgisWhere(city: CityConfig, parsed: ParsedAddress): string {
  const field = city.addressField;
  const house = parsed.houseNumber.replace(/'/g, "''");
  const keyword = parsed.streetKeyword.replace(/'/g, "''");
  return `UPPER(${field}) LIKE '%${house}%' AND UPPER(${field}) LIKE '%${keyword}%'`;
}

async function arcgisSearchOne(endpoint: string, city: CityConfig, parsed: ParsedAddress) {
  const where = buildArcgisWhere(city, parsed);

  const countParams = new URLSearchParams({ where, returnCountOnly: "true", f: "json" });
  let total = 0;
  try {
    const res = await fetch(`${endpoint}/query?${countParams.toString()}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      total = data.count || 0;
    }
  } catch { total = 0; }

  if (total === 0) return { permits: [] as Record<string, unknown>[], total: 0 };

  const detailParams = new URLSearchParams({ where, outFields: "*", resultRecordCount: "50", f: "json" });
  if (city.dateField) detailParams.set("orderByFields", `${city.dateField} DESC`);

  let features: Record<string, unknown>[] = [];
  try {
    const res = await fetch(`${endpoint}/query?${detailParams.toString()}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      features = (data.features || []).map((f: { attributes: Record<string, unknown> }) => f.attributes);
    }
  } catch { features = []; }

  return { permits: features, total };
}

async function arcgisSearch(city: CityConfig, parsed: ParsedAddress) {
  const endpoints = city.endpoints && city.endpoints.length > 0
    ? city.endpoints
    : city.endpoint ? [city.endpoint] : [];

  let allPermits: Record<string, unknown>[] = [];
  let totalCount = 0;

  for (const ep of endpoints) {
    const { permits, total } = await arcgisSearchOne(ep, city, parsed);
    allPermits = allPermits.concat(permits);
    totalCount += total;
  }

  if (city.dateField) {
    const df = city.dateField;
    allPermits.sort((a, b) => {
      const av = typeof a[df] === "number" ? (a[df] as number) : 0;
      const bv = typeof b[df] === "number" ? (b[df] as number) : 0;
      return bv - av;
    });
  }

  return { permits: allPermits.slice(0, 50), total: totalCount };
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORTS
// ═══════════════════════════════════════════════════════════

export async function fetchPermits(city: CityConfig, address: string): Promise<Permit[]> {
  const result = await fetchPermitsWithCount(city, address);
  return result.permits;
}

export async function fetchPermitsWithCount(
  city: CityConfig,
  address: string
): Promise<PermitSearchResult> {
  const parsed = parseAddress(address);
  if (!parsed.houseNumber || !parsed.streetKeyword) {
    return { permits: [], totalCount: 0, showingCount: 0 };
  }

  const isArcgis = city.platform === "arcgis";

  const { permits: rawResults, total } = isArcgis
    ? await arcgisSearch(city, parsed)
    : await socrataSearch(city, parsed);

  const {
    addressField, streetField, typeField, dateField, statusField,
    valueField, descField, permitteeField, ownerField,
  } = city;

  const permits: Permit[] = (rawResults as Record<string, unknown>[]).map((item, index) => {
    const get = (f?: string): string => {
      if (!f) return "";
      const v = item[f];
      return v === null || v === undefined ? "" : String(v).trim();
    };

    let contractor = "";
    if (city.contractorFromContacts) {
      contractor = extractContactContractor(item as Record<string, string>);
    } else if (permitteeField && get(permitteeField)) {
      contractor = cleanValue(get(permitteeField));
    } else if (ownerField && get(ownerField)) {
      contractor = cleanValue(get(ownerField));
    }

    const date = isArcgis
      ? formatArcgisDate(dateField ? item[dateField] : undefined)
      : get(dateField);

    // Status, with optional code decoding (e.g. Miami-Dade A/E/F)
    let status = get(statusField);
    if (!status) {
      status = "Unknown";
    } else if (city.statusMap && city.statusMap[status]) {
      status = city.statusMap[status];
    }

    return {
      id: get("id") || get("PERMIT_ID") || get("PERMIT_NUM") || get("PermitNumber") || `permit-${index}`,
      type: get(typeField) || "Unknown",
      date,
      status,
      value: get(valueField) || "0",
      description: get(descField) || "No description provided",
      address: streetField
        ? `${get(addressField)} ${get(streetField)}`.trim()
        : get(addressField),
      contractor,
    };
  });

  return { permits, totalCount: total, showingCount: permits.length };
}
