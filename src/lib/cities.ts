// src/lib/cities.ts
// Verified field mappings for all cities + Kansas City (Socrata) +
// Washington DC (ArcGIS) added. platform field enables ArcGIS support.
// Replace your current src/lib/cities.ts with this entire file

export interface CityConfig {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  endpoint?: string;
  platform?: "socrata" | "arcgis";   // defaults to socrata when omitted
  addressField?: string;
  streetField?: string | null;
  typeField?: string;
  dateField?: string;
  statusField?: string;
  valueField?: string;
  descField?: string;
  workTypeField?: string;     // extra description field
  ownerField?: string;        // owner name (also contractor fallback)
  permitteeField?: string;    // contractor name
  contractorFromContacts?: boolean; // Chicago: extract contractor from contact_N list
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
// TIER 1: LIVE DATA CITIES
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
    typeField: "permit_type",
    dateField: "issuance_date",
    statusField: "permit_status",
    valueField: "permit_si_no",
    descField: "work_type",
    workTypeField: "job_type",
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
    dateField: "issued_date",
    statusField: "status",
    valueField: "revised_cost",
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
    contractorFromContacts: true,
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
    addressField: "original_address1",
    streetField: null,
    typeField: "permit_type_desc",
    dateField: "issue_date",
    statusField: "status_current",
    valueField: "total_job_valuation",
    descField: "description",
    permitteeField: "contractor_company_name",
    ownerField: "contractor_full_name",
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
    typeField: "permittypemapped",
    dateField: "issueddate",
    statusField: "statuscurrent",
    valueField: "estprojectcost",
    descField: "description",
    permitteeField: "contractorcompanyname",
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
    addressField: "primary_address",
    streetField: null,
    typeField: "permit_type",
    dateField: "issue_date",
    statusField: "status_desc",
    valueField: "valuation",
    descField: "work_desc",
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
    permitteeField: "companyname",
    totalPermits: "300k+",
    population: "310k",
    permitAuthority: "Cincinnati Department of Buildings & Inspections",
    permitAuthorityUrl: "https://www.cincinnati-oh.gov/buildings/",
    avgReviewDays: 20,
    tier: 1,
  },
  "kansas-city": {
    name: "Kansas City",
    slug: "kansas-city",
    state: "MO",
    stateSlug: "missouri",
    endpoint: "https://data.kcmo.org/resource/w8jz-wjgn.json",
    addressField: "main_address_line1",
    streetField: null,
    typeField: "permit_type",
    dateField: "issue_date",
    statusField: "permit_status",
    valueField: "valuation",
    descField: "work_class",
    totalPermits: "200k+",
    population: "510k",
    permitAuthority: "Kansas City Development Services",
    permitAuthorityUrl: "https://www.kcmo.gov/city-hall/departments/city-planning-development",
    avgReviewDays: 18,
    tier: 1,
  },
  "washington-dc": {
    name: "Washington",
    slug: "washington-dc",
    state: "DC",
    stateSlug: "district-of-columbia",
    platform: "arcgis",
    endpoint: "https://maps2.dcgis.dc.gov/dcgis/rest/services/FEEDS/DCRA/FeatureServer/17",
    addressField: "FULL_ADDRESS",
    streetField: null,
    typeField: "PERMIT_TYPE_NAME",
    dateField: "ISSUE_DATE",
    statusField: "APPLICATION_STATUS_NAME",
    valueField: "",
    descField: "DESC_OF_WORK",
    ownerField: "OWNER_NAME",
    totalPermits: "150k+",
    population: "690k",
    permitAuthority: "DC Department of Buildings (DOB)",
    permitAuthorityUrl: "https://dob.dc.gov/",
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
