// src/lib/cities.ts
// NYC field mappings + Cincinnati added + Seattle fields corrected
// Replace your current src/lib/cities.ts with this entire file

export interface CityConfig {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  endpoint?: string;
  addressField?: string;
  streetField?: string | null;
  typeField?: string;
  dateField?: string;
  statusField?: string;
  valueField?: string;
  descField?: string;
  workTypeField?: string;     // extra description field
  ownerField?: string;        // owner name
  permitteeField?: string;    // contractor name
  totalPermits?: string;
  population?: string;
  permitAuthority: string;
  permitAuthorityUrl?: string;
  avgReviewDays?: number;
  tier: 1 | 2;
}

export interface StateConfig {
  name: string;
  slug: string;
  abbr: string;
  population: string;
  topCities: string[];
  permitAuthority: string;
}

// ═══════════════════════════════════════════════════════════
// TIER 1: LIVE DATA CITIES — Fields verified against current APIs
// ═══════════════════════════════════════════════════════════

export const LIVE_CITIES: Record<string, CityConfig> = {
  "new-york": {
    name: "New York City",
    slug: "new-york",
    state: "NY",
    stateSlug: "new-york",
    endpoint: "https://data.cityofnewyork.us/resource/ipu4-2q9a.json",
    addressField: "house__",
    streetField: "street_name",
    typeField: "permit_type",          // FIXED: was job_type
    dateField: "issuance_date",         // FIXED: was filing_date
    statusField: "permit_status",       // FIXED: was job_status_descrp
    valueField: "permit_si_no",         // NYC doesn't expose cost in this dataset
    descField: "work_type",             // FIXED: was job_description
    workTypeField: "job_type",          // Job type code (A1, A2, NB, etc)
    ownerField: "owner_s_business_name",
    permitteeField: "permittee_s_business_name",
    totalPermits: "4.87M+",
    population: "8.3M",
    permitAuthority: "NYC Department of Buildings (DOB)",
    permitAuthorityUrl: "https://www.nyc.gov/site/buildings/index.page",
    avgReviewDays: 14,
    tier: 1,
  },
  "san-francisco": {
    name: "San Francisco",
    slug: "san-francisco",
    state: "CA",
    stateSlug: "california",
    endpoint: "https://data.sfgov.org/resource/i98e-djp9.json",
    addressField: "street_number",
    streetField: "street_name",
    typeField: "permit_type_definition",
    dateField: "filed_date",
    statusField: "current_status",
    valueField: "estimated_cost",
    descField: "description",
    totalPermits: "1.2M+",
    population: "808k",
    permitAuthority: "SF Department of Building Inspection (DBI)",
    permitAuthorityUrl: "https://sfdbi.org/",
    avgReviewDays: 21,
    tier: 1,
  },
  "chicago": {
    name: "Chicago",
    slug: "chicago",
    state: "IL",
    stateSlug: "illinois",
    endpoint: "https://data.cityofchicago.org/resource/ydr8-5enu.json",
    addressField: "street_number",
    streetField: "street_name",
    typeField: "permit_type",
    dateField: "application_start_date",
    statusField: "permit_status",
    valueField: "reported_cost",
    descField: "work_description",
    totalPermits: "890k+",
    population: "2.7M",
    permitAuthority: "Chicago Department of Buildings",
    permitAuthorityUrl: "https://www.chicago.gov/city/en/depts/bldgs.html",
    avgReviewDays: 18,
    tier: 1,
  },
  "austin": {
    name: "Austin",
    slug: "austin",
    state: "TX",
    stateSlug: "texas",
    endpoint: "https://data.austintexas.gov/resource/3syk-w9eu.json",
    addressField: "original_address_1",
    streetField: null,
    typeField: "permit_type_desc",
    dateField: "applied_date",
    statusField: "status_current",
    valueField: "total_job_valuation",
    descField: "description",
    totalPermits: "620k+",
    population: "975k",
    permitAuthority: "Austin Development Services Department",
    avgReviewDays: 15,
    tier: 1,
  },
  "seattle": {
    name: "Seattle",
    slug: "seattle",
    state: "WA",
    stateSlug: "washington",
    endpoint: "https://data.seattle.gov/resource/76t5-zqzr.json",
    addressField: "originaladdress1",
    streetField: null,
    typeField: "permittypemapped",            // FIXED: was "permittype"
    dateField: "issueddate",                   // FIXED: was "appliedddate" (didn't exist)
    statusField: "statuscurrent",
    valueField: "estprojectcost",
    descField: "description",
    permitteeField: "contractorcompanyname",   // ADDED: contractor name
    totalPermits: "410k+",
    population: "750k",
    permitAuthority: "Seattle Department of Construction & Inspections",
    avgReviewDays: 20,
    tier: 1,
  },
  "los-angeles": {
    name: "Los Angeles",
    slug: "los-angeles",
    state: "CA",
    stateSlug: "california",
    endpoint: "https://data.lacity.org/resource/pi9x-tg5x.json",
    addressField: "address_start",
    streetField: "street_name",
    typeField: "permit_type",
    dateField: "issue_date",
    statusField: "status",
    valueField: "valuation",
    descField: "work_description",
    totalPermits: "2.1M+",
    population: "3.9M",
    permitAuthority: "LA Department of Building & Safety (LADBS)",
    avgReviewDays: 25,
    tier: 1,
  },
  "cincinnati": {
    name: "Cincinnati",
    slug: "cincinnati",
    state: "OH",
    stateSlug: "ohio",
    endpoint: "https://data.cincinnati-oh.gov/resource/dy5r-w456.json",
    addressField: "originaladdress1",
    streetField: null,
    typeField: "permittypemapped",
    dateField: "issueddate",
    statusField: "statuscurrentmapped",
    valueField: "estprojectcostdec",
    descField: "description",
    permitteeField: "companyname",      // contractor: "PARADIGM CONSTRUCTION LLC"
    totalPermits: "300k+",
    population: "310k",
    permitAuthority: "Cincinnati Department of Buildings & Inspections",
    permitAuthorityUrl: "https://www.cincinnati-oh.gov/buildings/",
    avgReviewDays: 20,
    tier: 1,
  },
};

export const INFO_CITIES: Record<string, CityConfig> = {};
export const CITIES: Record<string, CityConfig> = { ...LIVE_CITIES, ...INFO_CITIES };
export const CITIES_LIST = Object.values(CITIES);
export const LIVE_CITIES_LIST = Object.values(LIVE_CITIES);

export const STATES: Record<string, StateConfig> = {};
export const STATES_LIST = Object.values(STATES);

export const getCityBySlug = (slug: string) => CITIES[slug];
export const getCityByStateCity = (stateSlug: string, citySlug: string) =>
  CITIES_LIST.find(c => c.stateSlug === stateSlug && c.slug === citySlug);
export const getStateBySlug = (slug: string) => STATES[slug];
export const getCitiesInState = (stateSlug: string) =>
  CITIES_LIST.filter(c => c.stateSlug === stateSlug);
export const isCityLive = (slug: string) => CITIES[slug]?.tier === 1;
