// src/lib/cities.ts
//
// PermitPeek Geographic Coverage — Strategic Three-Tier Model
//
// TIER 1: Live data cities (real Socrata APIs, full permit search)
// TIER 2: Informational cities (no API yet, but content page with link to city portal)
// TIER 3: State overview pages (using Census Bureau aggregate data)
//
// This gets you ~3,500 indexable pages on Google with strong SEO,
// while only making API claims you can actually fulfill.
//
// To upgrade a TIER 2 city to TIER 1: find its Socrata dataset,
// add the endpoint + field mappings, move it to LIVE_CITIES.

export interface CityConfig {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  // Live API fields (only present for TIER 1)
  endpoint?: string;
  addressField?: string;
  streetField?: string | null;
  typeField?: string;
  dateField?: string;
  statusField?: string;
  valueField?: string;
  descField?: string;
  // SEO + display metadata
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
  topCities: string[]; // city slugs
  permitAuthority: string;
  // Aggregate Census BPS stats
  permitsLast12Months?: string;
}

// ═══════════════════════════════════════════════════════════
// TIER 1: LIVE DATA CITIES (Socrata APIs — real search works)
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
    typeField: "job_type",
    dateField: "filing_date",
    statusField: "job_status_descrp",
    valueField: "initial_cost",
    descField: "job_description",
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
    permitAuthorityUrl: "https://www.austintexas.gov/department/development-services",
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
    typeField: "permittype",
    dateField: "appliedddate",
    statusField: "statuscurrent",
    valueField: "estprojectcost",
    descField: "description",
    totalPermits: "410k+",
    population: "750k",
    permitAuthority: "Seattle Department of Construction & Inspections (SDCI)",
    permitAuthorityUrl: "https://www.seattle.gov/sdci",
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
    permitAuthorityUrl: "https://www.ladbs.org/",
    avgReviewDays: 25,
    tier: 1,
  },
  "boston": {
    name: "Boston",
    slug: "boston",
    state: "MA",
    stateSlug: "massachusetts",
    endpoint: "https://data.boston.gov/api/3/action/datastore_search",
    addressField: "address",
    streetField: null,
    typeField: "permittypedescr",
    dateField: "applicationdate",
    statusField: "status",
    valueField: "declared_valuation",
    descField: "description",
    totalPermits: "520k+",
    population: "675k",
    permitAuthority: "Boston Inspectional Services Department",
    permitAuthorityUrl: "https://www.boston.gov/departments/inspectional-services",
    avgReviewDays: 18,
    tier: 1,
  },
  "cambridge": {
    name: "Cambridge",
    slug: "cambridge",
    state: "MA",
    stateSlug: "massachusetts",
    endpoint: "https://data.cambridgema.gov/resource/9qm7-wbdc.json",
    addressField: "address",
    streetField: null,
    typeField: "permittypedescr",
    dateField: "issuedate",
    statusField: "status",
    valueField: "totalprojectcost",
    descField: "description",
    totalPermits: "95k+",
    population: "118k",
    permitAuthority: "Cambridge Inspectional Services",
    permitAuthorityUrl: "https://www.cambridgema.gov/inspection",
    avgReviewDays: 14,
    tier: 1,
  },
};

// ═══════════════════════════════════════════════════════════
// TIER 2: INFORMATIONAL CITIES (no API yet — content + portal link)
// These get SEO landing pages with city-specific info and a CTA
// linking to the official municipal permit portal.
//
// To upgrade any of these to LIVE: find their Socrata dataset
// (try data.[cityname].gov), add field mappings, move to LIVE_CITIES.
// ═══════════════════════════════════════════════════════════

export const INFO_CITIES: Record<string, CityConfig> = {
  // California
  "san-diego": { name: "San Diego", slug: "san-diego", state: "CA", stateSlug: "california", population: "1.4M", permitAuthority: "San Diego Development Services", permitAuthorityUrl: "https://www.sandiego.gov/development-services", tier: 2 },
  "san-jose": { name: "San Jose", slug: "san-jose", state: "CA", stateSlug: "california", population: "1.0M", permitAuthority: "San Jose Building Division", permitAuthorityUrl: "https://www.sanjoseca.gov/your-government/departments-offices/planning-building-code-enforcement", tier: 2 },
  "sacramento": { name: "Sacramento", slug: "sacramento", state: "CA", stateSlug: "california", population: "525k", permitAuthority: "Sacramento Community Development", permitAuthorityUrl: "https://www.cityofsacramento.org/Community-Development", tier: 2 },
  "fresno": { name: "Fresno", slug: "fresno", state: "CA", stateSlug: "california", population: "545k", permitAuthority: "Fresno Development Services", permitAuthorityUrl: "https://www.fresno.gov/darm/", tier: 2 },
  "long-beach": { name: "Long Beach", slug: "long-beach", state: "CA", stateSlug: "california", population: "456k", permitAuthority: "Long Beach Development Services", permitAuthorityUrl: "https://www.longbeach.gov/lbds/", tier: 2 },
  "oakland": { name: "Oakland", slug: "oakland", state: "CA", stateSlug: "california", population: "440k", permitAuthority: "Oakland Planning & Building", permitAuthorityUrl: "https://www.oaklandca.gov/departments/planning-and-building", tier: 2 },
  "bakersfield": { name: "Bakersfield", slug: "bakersfield", state: "CA", stateSlug: "california", population: "403k", permitAuthority: "Bakersfield Building Department", tier: 2 },
  "anaheim": { name: "Anaheim", slug: "anaheim", state: "CA", stateSlug: "california", population: "346k", permitAuthority: "Anaheim Planning & Building", tier: 2 },
  "santa-ana": { name: "Santa Ana", slug: "santa-ana", state: "CA", stateSlug: "california", population: "311k", permitAuthority: "Santa Ana Planning & Building", tier: 2 },
  "riverside": { name: "Riverside", slug: "riverside", state: "CA", stateSlug: "california", population: "317k", permitAuthority: "Riverside Community & Economic Development", tier: 2 },

  // Texas
  "houston": { name: "Houston", slug: "houston", state: "TX", stateSlug: "texas", population: "2.3M", permitAuthority: "Houston Permitting Center", permitAuthorityUrl: "https://www.houstontx.gov/planning/", tier: 2 },
  "san-antonio": { name: "San Antonio", slug: "san-antonio", state: "TX", stateSlug: "texas", population: "1.5M", permitAuthority: "San Antonio Development Services", permitAuthorityUrl: "https://www.sa.gov/Directory/Departments/DSD", tier: 2 },
  "dallas": { name: "Dallas", slug: "dallas", state: "TX", stateSlug: "texas", population: "1.3M", permitAuthority: "Dallas Development Services", permitAuthorityUrl: "https://dallascityhall.com/departments/sustainabledevelopment", tier: 2 },
  "fort-worth": { name: "Fort Worth", slug: "fort-worth", state: "TX", stateSlug: "texas", population: "957k", permitAuthority: "Fort Worth Development Services", tier: 2 },
  "el-paso": { name: "El Paso", slug: "el-paso", state: "TX", stateSlug: "texas", population: "678k", permitAuthority: "El Paso Planning & Inspections", tier: 2 },
  "arlington": { name: "Arlington", slug: "arlington", state: "TX", stateSlug: "texas", population: "395k", permitAuthority: "Arlington Community Development", tier: 2 },
  "corpus-christi": { name: "Corpus Christi", slug: "corpus-christi", state: "TX", stateSlug: "texas", population: "317k", permitAuthority: "Corpus Christi Development Services", tier: 2 },
  "plano": { name: "Plano", slug: "plano", state: "TX", stateSlug: "texas", population: "289k", permitAuthority: "Plano Building Inspections", tier: 2 },

  // Florida
  "jacksonville": { name: "Jacksonville", slug: "jacksonville", state: "FL", stateSlug: "florida", population: "971k", permitAuthority: "Jacksonville Building Inspection Division", tier: 2 },
  "miami": { name: "Miami", slug: "miami", state: "FL", stateSlug: "florida", population: "442k", permitAuthority: "Miami Building Department", permitAuthorityUrl: "https://www.miamigov.com/Government/Departments-Organizations/Building", tier: 2 },
  "tampa": { name: "Tampa", slug: "tampa", state: "FL", stateSlug: "florida", population: "398k", permitAuthority: "Tampa Construction Services Center", tier: 2 },
  "orlando": { name: "Orlando", slug: "orlando", state: "FL", stateSlug: "florida", population: "316k", permitAuthority: "Orlando Permitting Services", tier: 2 },
  "st-petersburg": { name: "St. Petersburg", slug: "st-petersburg", state: "FL", stateSlug: "florida", population: "263k", permitAuthority: "St. Petersburg Development Services", tier: 2 },
  "hialeah": { name: "Hialeah", slug: "hialeah", state: "FL", stateSlug: "florida", population: "224k", permitAuthority: "Hialeah Construction & Code Compliance", tier: 2 },
  "tallahassee": { name: "Tallahassee", slug: "tallahassee", state: "FL", stateSlug: "florida", population: "201k", permitAuthority: "Tallahassee Growth Management", tier: 2 },
  "fort-lauderdale": { name: "Fort Lauderdale", slug: "fort-lauderdale", state: "FL", stateSlug: "florida", population: "183k", permitAuthority: "Fort Lauderdale Building Services", tier: 2 },

  // New York
  "buffalo": { name: "Buffalo", slug: "buffalo", state: "NY", stateSlug: "new-york", population: "276k", permitAuthority: "Buffalo Department of Permit & Inspection Services", tier: 2 },
  "rochester": { name: "Rochester", slug: "rochester", state: "NY", stateSlug: "new-york", population: "211k", permitAuthority: "Rochester Department of Neighborhood & Business Development", tier: 2 },
  "yonkers": { name: "Yonkers", slug: "yonkers", state: "NY", stateSlug: "new-york", population: "211k", permitAuthority: "Yonkers Department of Housing & Buildings", tier: 2 },
  "syracuse": { name: "Syracuse", slug: "syracuse", state: "NY", stateSlug: "new-york", population: "146k", permitAuthority: "Syracuse Codes Division", tier: 2 },
  "albany": { name: "Albany", slug: "albany", state: "NY", stateSlug: "new-york", population: "99k", permitAuthority: "Albany Department of Buildings & Regulatory Compliance", tier: 2 },

  // Pennsylvania
  "philadelphia": { name: "Philadelphia", slug: "philadelphia", state: "PA", stateSlug: "pennsylvania", population: "1.6M", permitAuthority: "Philadelphia Department of Licenses & Inspections (L&I)", permitAuthorityUrl: "https://www.phila.gov/departments/department-of-licenses-and-inspections/", tier: 2 },
  "pittsburgh": { name: "Pittsburgh", slug: "pittsburgh", state: "PA", stateSlug: "pennsylvania", population: "302k", permitAuthority: "Pittsburgh Permits, Licenses & Inspections", tier: 2 },
  "allentown": { name: "Allentown", slug: "allentown", state: "PA", stateSlug: "pennsylvania", population: "126k", permitAuthority: "Allentown Building & Inspections", tier: 2 },

  // Illinois
  "aurora-il": { name: "Aurora", slug: "aurora-il", state: "IL", stateSlug: "illinois", population: "180k", permitAuthority: "Aurora Building & Permits", tier: 2 },
  "rockford": { name: "Rockford", slug: "rockford", state: "IL", stateSlug: "illinois", population: "147k", permitAuthority: "Rockford Community & Economic Development", tier: 2 },
  "naperville": { name: "Naperville", slug: "naperville", state: "IL", stateSlug: "illinois", population: "149k", permitAuthority: "Naperville Transportation, Engineering & Development", tier: 2 },

  // Ohio
  "columbus": { name: "Columbus", slug: "columbus", state: "OH", stateSlug: "ohio", population: "907k", permitAuthority: "Columbus Department of Building & Zoning Services", tier: 2 },
  "cleveland": { name: "Cleveland", slug: "cleveland", state: "OH", stateSlug: "ohio", population: "367k", permitAuthority: "Cleveland Department of Building & Housing", tier: 2 },
  "cincinnati": { name: "Cincinnati", slug: "cincinnati", state: "OH", stateSlug: "ohio", population: "309k", permitAuthority: "Cincinnati Buildings & Inspections", tier: 2 },
  "toledo": { name: "Toledo", slug: "toledo", state: "OH", stateSlug: "ohio", population: "270k", permitAuthority: "Toledo Department of Building Inspection", tier: 2 },

  // Georgia
  "atlanta": { name: "Atlanta", slug: "atlanta", state: "GA", stateSlug: "georgia", population: "499k", permitAuthority: "Atlanta Office of Buildings", permitAuthorityUrl: "https://www.atlantaga.gov/government/departments/city-planning/office-of-buildings", tier: 2 },
  "augusta": { name: "Augusta", slug: "augusta", state: "GA", stateSlug: "georgia", population: "202k", permitAuthority: "Augusta Planning & Development", tier: 2 },
  "savannah": { name: "Savannah", slug: "savannah", state: "GA", stateSlug: "georgia", population: "147k", permitAuthority: "Savannah Development Services", tier: 2 },

  // North Carolina
  "charlotte": { name: "Charlotte", slug: "charlotte", state: "NC", stateSlug: "north-carolina", population: "880k", permitAuthority: "Charlotte Code Enforcement & Building Standards", tier: 2 },
  "raleigh": { name: "Raleigh", slug: "raleigh", state: "NC", stateSlug: "north-carolina", population: "470k", permitAuthority: "Raleigh Development Services", tier: 2 },
  "greensboro": { name: "Greensboro", slug: "greensboro", state: "NC", stateSlug: "north-carolina", population: "298k", permitAuthority: "Greensboro Planning Department", tier: 2 },
  "durham": { name: "Durham", slug: "durham", state: "NC", stateSlug: "north-carolina", population: "284k", permitAuthority: "Durham City-County Inspections", tier: 2 },

  // Michigan
  "detroit": { name: "Detroit", slug: "detroit", state: "MI", stateSlug: "michigan", population: "632k", permitAuthority: "Detroit Buildings, Safety Engineering & Environmental Department (BSEED)", tier: 2 },
  "grand-rapids": { name: "Grand Rapids", slug: "grand-rapids", state: "MI", stateSlug: "michigan", population: "198k", permitAuthority: "Grand Rapids Development Center", tier: 2 },
  "warren": { name: "Warren", slug: "warren", state: "MI", stateSlug: "michigan", population: "139k", permitAuthority: "Warren Building Department", tier: 2 },

  // Arizona
  "phoenix": { name: "Phoenix", slug: "phoenix", state: "AZ", stateSlug: "arizona", population: "1.6M", permitAuthority: "Phoenix Planning & Development Department", permitAuthorityUrl: "https://www.phoenix.gov/pdd", tier: 2 },
  "tucson": { name: "Tucson", slug: "tucson", state: "AZ", stateSlug: "arizona", population: "543k", permitAuthority: "Tucson Planning & Development Services", tier: 2 },
  "mesa": { name: "Mesa", slug: "mesa", state: "AZ", stateSlug: "arizona", population: "510k", permitAuthority: "Mesa Development Services", tier: 2 },
  "chandler": { name: "Chandler", slug: "chandler", state: "AZ", stateSlug: "arizona", population: "279k", permitAuthority: "Chandler Building Inspection", tier: 2 },
  "scottsdale": { name: "Scottsdale", slug: "scottsdale", state: "AZ", stateSlug: "arizona", population: "242k", permitAuthority: "Scottsdale Planning & Development Services", tier: 2 },

  // Washington (state) — Seattle is Tier 1
  "spokane": { name: "Spokane", slug: "spokane", state: "WA", stateSlug: "washington", population: "228k", permitAuthority: "Spokane Building Services", tier: 2 },
  "tacoma": { name: "Tacoma", slug: "tacoma", state: "WA", stateSlug: "washington", population: "219k", permitAuthority: "Tacoma Planning & Development Services", tier: 2 },
  "vancouver-wa": { name: "Vancouver", slug: "vancouver-wa", state: "WA", stateSlug: "washington", population: "190k", permitAuthority: "Vancouver Community & Economic Development", tier: 2 },
  "bellevue": { name: "Bellevue", slug: "bellevue", state: "WA", stateSlug: "washington", population: "151k", permitAuthority: "Bellevue Development Services", tier: 2 },

  // Massachusetts — Boston + Cambridge are Tier 1
  "worcester": { name: "Worcester", slug: "worcester", state: "MA", stateSlug: "massachusetts", population: "206k", permitAuthority: "Worcester Inspectional Services", tier: 2 },
  "springfield-ma": { name: "Springfield", slug: "springfield-ma", state: "MA", stateSlug: "massachusetts", population: "155k", permitAuthority: "Springfield Code Enforcement", tier: 2 },

  // Colorado
  "denver": { name: "Denver", slug: "denver", state: "CO", stateSlug: "colorado", population: "713k", permitAuthority: "Denver Community Planning & Development", permitAuthorityUrl: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Community-Planning-and-Development", tier: 2 },
  "colorado-springs": { name: "Colorado Springs", slug: "colorado-springs", state: "CO", stateSlug: "colorado", population: "478k", permitAuthority: "Colorado Springs Pikes Peak Regional Building Department", tier: 2 },
  "aurora-co": { name: "Aurora", slug: "aurora-co", state: "CO", stateSlug: "colorado", population: "386k", permitAuthority: "Aurora Building Division", tier: 2 },

  // Oregon
  "portland-or": { name: "Portland", slug: "portland-or", state: "OR", stateSlug: "oregon", population: "650k", permitAuthority: "Portland Bureau of Development Services", permitAuthorityUrl: "https://www.portland.gov/bds", tier: 2 },
  "salem-or": { name: "Salem", slug: "salem-or", state: "OR", stateSlug: "oregon", population: "176k", permitAuthority: "Salem Community Development", tier: 2 },
  "eugene": { name: "Eugene", slug: "eugene", state: "OR", stateSlug: "oregon", population: "175k", permitAuthority: "Eugene Building & Permit Services", tier: 2 },

  // Nevada
  "las-vegas": { name: "Las Vegas", slug: "las-vegas", state: "NV", stateSlug: "nevada", population: "656k", permitAuthority: "Las Vegas Building & Safety", tier: 2 },
  "henderson": { name: "Henderson", slug: "henderson", state: "NV", stateSlug: "nevada", population: "327k", permitAuthority: "Henderson Building & Fire Safety", tier: 2 },
  "reno": { name: "Reno", slug: "reno", state: "NV", stateSlug: "nevada", population: "275k", permitAuthority: "Reno Building & Safety Division", tier: 2 },

  // Minnesota
  "minneapolis": { name: "Minneapolis", slug: "minneapolis", state: "MN", stateSlug: "minnesota", population: "429k", permitAuthority: "Minneapolis Community Planning & Economic Development", tier: 2 },
  "saint-paul": { name: "Saint Paul", slug: "saint-paul", state: "MN", stateSlug: "minnesota", population: "311k", permitAuthority: "Saint Paul Department of Safety & Inspections", tier: 2 },

  // Maryland
  "baltimore": { name: "Baltimore", slug: "baltimore", state: "MD", stateSlug: "maryland", population: "586k", permitAuthority: "Baltimore Department of Housing & Community Development", tier: 2 },

  // DC
  "washington": { name: "Washington", slug: "washington", state: "DC", stateSlug: "district-of-columbia", population: "689k", permitAuthority: "DC Department of Buildings", permitAuthorityUrl: "https://dob.dc.gov/", tier: 2 },

  // Tennessee
  "nashville": { name: "Nashville", slug: "nashville", state: "TN", stateSlug: "tennessee", population: "689k", permitAuthority: "Nashville Department of Codes & Building Safety", tier: 2 },
  "memphis": { name: "Memphis", slug: "memphis", state: "TN", stateSlug: "tennessee", population: "633k", permitAuthority: "Memphis Construction Enforcement", tier: 2 },
  "knoxville": { name: "Knoxville", slug: "knoxville", state: "TN", stateSlug: "tennessee", population: "190k", permitAuthority: "Knoxville Plans Review & Inspections", tier: 2 },

  // Missouri
  "kansas-city": { name: "Kansas City", slug: "kansas-city", state: "MO", stateSlug: "missouri", population: "508k", permitAuthority: "Kansas City Development Services", tier: 2 },
  "st-louis": { name: "St. Louis", slug: "st-louis", state: "MO", stateSlug: "missouri", population: "301k", permitAuthority: "St. Louis Building Division", tier: 2 },
  "springfield-mo": { name: "Springfield", slug: "springfield-mo", state: "MO", stateSlug: "missouri", population: "169k", permitAuthority: "Springfield Building Development Services", tier: 2 },

  // Wisconsin
  "milwaukee": { name: "Milwaukee", slug: "milwaukee", state: "WI", stateSlug: "wisconsin", population: "577k", permitAuthority: "Milwaukee Department of Neighborhood Services", tier: 2 },
  "madison": { name: "Madison", slug: "madison", state: "WI", stateSlug: "wisconsin", population: "269k", permitAuthority: "Madison Building Inspection Division", tier: 2 },

  // Oklahoma
  "oklahoma-city": { name: "Oklahoma City", slug: "oklahoma-city", state: "OK", stateSlug: "oklahoma", population: "687k", permitAuthority: "Oklahoma City Development Services", tier: 2 },
  "tulsa": { name: "Tulsa", slug: "tulsa", state: "OK", stateSlug: "oklahoma", population: "411k", permitAuthority: "Tulsa Permit Center", tier: 2 },

  // Indiana
  "indianapolis": { name: "Indianapolis", slug: "indianapolis", state: "IN", stateSlug: "indiana", population: "880k", permitAuthority: "Indianapolis Department of Business & Neighborhood Services", tier: 2 },
  "fort-wayne": { name: "Fort Wayne", slug: "fort-wayne", state: "IN", stateSlug: "indiana", population: "270k", permitAuthority: "Fort Wayne Allen County Building Department", tier: 2 },

  // Kentucky
  "louisville": { name: "Louisville", slug: "louisville", state: "KY", stateSlug: "kentucky", population: "628k", permitAuthority: "Louisville Develop Louisville", tier: 2 },
  "lexington": { name: "Lexington", slug: "lexington", state: "KY", stateSlug: "kentucky", population: "322k", permitAuthority: "Lexington Building Inspection", tier: 2 },

  // New Mexico
  "albuquerque": { name: "Albuquerque", slug: "albuquerque", state: "NM", stateSlug: "new-mexico", population: "564k", permitAuthority: "Albuquerque Planning Department", tier: 2 },

  // Virginia
  "virginia-beach": { name: "Virginia Beach", slug: "virginia-beach", state: "VA", stateSlug: "virginia", population: "459k", permitAuthority: "Virginia Beach Permits & Inspections", tier: 2 },
  "norfolk": { name: "Norfolk", slug: "norfolk", state: "VA", stateSlug: "virginia", population: "238k", permitAuthority: "Norfolk Permits & Inspections", tier: 2 },
  "chesapeake": { name: "Chesapeake", slug: "chesapeake", state: "VA", stateSlug: "virginia", population: "249k", permitAuthority: "Chesapeake Development & Permits", tier: 2 },
  "richmond": { name: "Richmond", slug: "richmond", state: "VA", stateSlug: "virginia", population: "226k", permitAuthority: "Richmond Permits & Inspections", tier: 2 },

  // New Jersey
  "newark": { name: "Newark", slug: "newark", state: "NJ", stateSlug: "new-jersey", population: "311k", permitAuthority: "Newark Department of Engineering", tier: 2 },
  "jersey-city": { name: "Jersey City", slug: "jersey-city", state: "NJ", stateSlug: "new-jersey", population: "292k", permitAuthority: "Jersey City Department of Housing, Economic Development & Commerce", tier: 2 },

  // Louisiana
  "new-orleans": { name: "New Orleans", slug: "new-orleans", state: "LA", stateSlug: "louisiana", population: "384k", permitAuthority: "New Orleans Department of Safety & Permits", tier: 2 },
  "baton-rouge": { name: "Baton Rouge", slug: "baton-rouge", state: "LA", stateSlug: "louisiana", population: "220k", permitAuthority: "Baton Rouge Department of Inspection", tier: 2 },

  // Hawaii
  "honolulu": { name: "Honolulu", slug: "honolulu", state: "HI", stateSlug: "hawaii", population: "350k", permitAuthority: "Honolulu Department of Planning & Permitting", tier: 2 },

  // Alaska
  "anchorage": { name: "Anchorage", slug: "anchorage", state: "AK", stateSlug: "alaska", population: "291k", permitAuthority: "Anchorage Building Safety Service", tier: 2 },
};

// Combined for iteration
export const CITIES: Record<string, CityConfig> = { ...LIVE_CITIES, ...INFO_CITIES };
export const CITIES_LIST = Object.values(CITIES);
export const LIVE_CITIES_LIST = Object.values(LIVE_CITIES);
export const INFO_CITIES_LIST = Object.values(INFO_CITIES);

// ═══════════════════════════════════════════════════════════
// STATES — all 50 + DC, used for state hub pages
// Aggregate permit data sourced from US Census Bureau BPS
// ═══════════════════════════════════════════════════════════

export const STATES: Record<string, StateConfig> = {
  "alabama": { name: "Alabama", slug: "alabama", abbr: "AL", population: "5.1M", topCities: [], permitAuthority: "Alabama Department of Insurance — Building Commission" },
  "alaska": { name: "Alaska", slug: "alaska", abbr: "AK", population: "734k", topCities: ["anchorage"], permitAuthority: "Alaska Department of Labor & Workforce Development" },
  "arizona": { name: "Arizona", slug: "arizona", abbr: "AZ", population: "7.4M", topCities: ["phoenix", "tucson", "mesa", "chandler", "scottsdale"], permitAuthority: "Arizona Registrar of Contractors" },
  "arkansas": { name: "Arkansas", slug: "arkansas", abbr: "AR", population: "3.0M", topCities: [], permitAuthority: "Arkansas Contractors Licensing Board" },
  "california": { name: "California", slug: "california", abbr: "CA", population: "39M", topCities: ["los-angeles", "san-francisco", "san-diego", "san-jose", "fresno", "sacramento", "long-beach", "oakland"], permitAuthority: "California Department of Housing & Community Development" },
  "colorado": { name: "Colorado", slug: "colorado", abbr: "CO", population: "5.9M", topCities: ["denver", "colorado-springs", "aurora-co"], permitAuthority: "Colorado Department of Local Affairs" },
  "connecticut": { name: "Connecticut", slug: "connecticut", abbr: "CT", population: "3.6M", topCities: [], permitAuthority: "Connecticut Department of Administrative Services — Building Inspection" },
  "delaware": { name: "Delaware", slug: "delaware", abbr: "DE", population: "1.0M", topCities: [], permitAuthority: "Delaware Division of Professional Regulation" },
  "district-of-columbia": { name: "Washington, DC", slug: "district-of-columbia", abbr: "DC", population: "689k", topCities: ["washington"], permitAuthority: "DC Department of Buildings" },
  "florida": { name: "Florida", slug: "florida", abbr: "FL", population: "22M", topCities: ["jacksonville", "miami", "tampa", "orlando", "st-petersburg", "hialeah", "tallahassee", "fort-lauderdale"], permitAuthority: "Florida Department of Business & Professional Regulation" },
  "georgia": { name: "Georgia", slug: "georgia", abbr: "GA", population: "11M", topCities: ["atlanta", "augusta", "savannah"], permitAuthority: "Georgia Department of Community Affairs" },
  "hawaii": { name: "Hawaii", slug: "hawaii", abbr: "HI", population: "1.4M", topCities: ["honolulu"], permitAuthority: "Hawaii Department of Commerce & Consumer Affairs" },
  "idaho": { name: "Idaho", slug: "idaho", abbr: "ID", population: "1.9M", topCities: [], permitAuthority: "Idaho Division of Building Safety" },
  "illinois": { name: "Illinois", slug: "illinois", abbr: "IL", population: "12.6M", topCities: ["chicago", "aurora-il", "rockford", "naperville"], permitAuthority: "Illinois Capital Development Board" },
  "indiana": { name: "Indiana", slug: "indiana", abbr: "IN", population: "6.8M", topCities: ["indianapolis", "fort-wayne"], permitAuthority: "Indiana Department of Homeland Security — Fire & Building Services" },
  "iowa": { name: "Iowa", slug: "iowa", abbr: "IA", population: "3.2M", topCities: [], permitAuthority: "Iowa Department of Public Safety — State Fire Marshal" },
  "kansas": { name: "Kansas", slug: "kansas", abbr: "KS", population: "2.9M", topCities: [], permitAuthority: "Kansas State Fire Marshal" },
  "kentucky": { name: "Kentucky", slug: "kentucky", abbr: "KY", population: "4.5M", topCities: ["louisville", "lexington"], permitAuthority: "Kentucky Department of Housing, Buildings & Construction" },
  "louisiana": { name: "Louisiana", slug: "louisiana", abbr: "LA", population: "4.6M", topCities: ["new-orleans", "baton-rouge"], permitAuthority: "Louisiana State Uniform Construction Code Council" },
  "maine": { name: "Maine", slug: "maine", abbr: "ME", population: "1.4M", topCities: [], permitAuthority: "Maine Department of Public Safety" },
  "maryland": { name: "Maryland", slug: "maryland", abbr: "MD", population: "6.2M", topCities: ["baltimore"], permitAuthority: "Maryland Department of Labor — Building Codes Administration" },
  "massachusetts": { name: "Massachusetts", slug: "massachusetts", abbr: "MA", population: "7.0M", topCities: ["boston", "cambridge", "worcester", "springfield-ma"], permitAuthority: "Massachusetts Board of Building Regulations & Standards" },
  "michigan": { name: "Michigan", slug: "michigan", abbr: "MI", population: "10M", topCities: ["detroit", "grand-rapids", "warren"], permitAuthority: "Michigan Department of Licensing & Regulatory Affairs (LARA)" },
  "minnesota": { name: "Minnesota", slug: "minnesota", abbr: "MN", population: "5.7M", topCities: ["minneapolis", "saint-paul"], permitAuthority: "Minnesota Department of Labor & Industry — Construction Codes" },
  "mississippi": { name: "Mississippi", slug: "mississippi", abbr: "MS", population: "2.9M", topCities: [], permitAuthority: "Mississippi State Board of Contractors" },
  "missouri": { name: "Missouri", slug: "missouri", abbr: "MO", population: "6.2M", topCities: ["kansas-city", "st-louis", "springfield-mo"], permitAuthority: "Missouri Division of Fire Safety" },
  "montana": { name: "Montana", slug: "montana", abbr: "MT", population: "1.1M", topCities: [], permitAuthority: "Montana Department of Labor & Industry — Building Codes" },
  "nebraska": { name: "Nebraska", slug: "nebraska", abbr: "NE", population: "2.0M", topCities: [], permitAuthority: "Nebraska Department of Labor" },
  "nevada": { name: "Nevada", slug: "nevada", abbr: "NV", population: "3.2M", topCities: ["las-vegas", "henderson", "reno"], permitAuthority: "Nevada State Contractors Board" },
  "new-hampshire": { name: "New Hampshire", slug: "new-hampshire", abbr: "NH", population: "1.4M", topCities: [], permitAuthority: "New Hampshire Department of Safety — State Fire Marshal" },
  "new-jersey": { name: "New Jersey", slug: "new-jersey", abbr: "NJ", population: "9.3M", topCities: ["newark", "jersey-city"], permitAuthority: "New Jersey Department of Community Affairs — Division of Codes & Standards" },
  "new-mexico": { name: "New Mexico", slug: "new-mexico", abbr: "NM", population: "2.1M", topCities: ["albuquerque"], permitAuthority: "New Mexico Construction Industries Division" },
  "new-york": { name: "New York", slug: "new-york", abbr: "NY", population: "19.5M", topCities: ["new-york", "buffalo", "rochester", "yonkers", "syracuse", "albany"], permitAuthority: "New York Department of State — Division of Building Standards & Codes" },
  "north-carolina": { name: "North Carolina", slug: "north-carolina", abbr: "NC", population: "10.7M", topCities: ["charlotte", "raleigh", "greensboro", "durham"], permitAuthority: "North Carolina Department of Insurance — Office of State Fire Marshal" },
  "north-dakota": { name: "North Dakota", slug: "north-dakota", abbr: "ND", population: "780k", topCities: [], permitAuthority: "North Dakota Department of Commerce" },
  "ohio": { name: "Ohio", slug: "ohio", abbr: "OH", population: "11.8M", topCities: ["columbus", "cleveland", "cincinnati", "toledo"], permitAuthority: "Ohio Board of Building Standards" },
  "oklahoma": { name: "Oklahoma", slug: "oklahoma", abbr: "OK", population: "4.1M", topCities: ["oklahoma-city", "tulsa"], permitAuthority: "Oklahoma Construction Industries Board" },
  "oregon": { name: "Oregon", slug: "oregon", abbr: "OR", population: "4.2M", topCities: ["portland-or", "salem-or", "eugene"], permitAuthority: "Oregon Building Codes Division" },
  "pennsylvania": { name: "Pennsylvania", slug: "pennsylvania", abbr: "PA", population: "13M", topCities: ["philadelphia", "pittsburgh", "allentown"], permitAuthority: "Pennsylvania Department of Labor & Industry — UCC Program" },
  "rhode-island": { name: "Rhode Island", slug: "rhode-island", abbr: "RI", population: "1.1M", topCities: [], permitAuthority: "Rhode Island State Building Code Commission" },
  "south-carolina": { name: "South Carolina", slug: "south-carolina", abbr: "SC", population: "5.4M", topCities: [], permitAuthority: "South Carolina Department of Labor, Licensing & Regulation" },
  "south-dakota": { name: "South Dakota", slug: "south-dakota", abbr: "SD", population: "910k", topCities: [], permitAuthority: "South Dakota Department of Public Safety" },
  "tennessee": { name: "Tennessee", slug: "tennessee", abbr: "TN", population: "7.1M", topCities: ["nashville", "memphis", "knoxville"], permitAuthority: "Tennessee Department of Commerce & Insurance — Fire Prevention" },
  "texas": { name: "Texas", slug: "texas", abbr: "TX", population: "30M", topCities: ["houston", "san-antonio", "dallas", "austin", "fort-worth", "el-paso", "arlington", "corpus-christi", "plano"], permitAuthority: "Texas Department of Licensing & Regulation" },
  "utah": { name: "Utah", slug: "utah", abbr: "UT", population: "3.4M", topCities: [], permitAuthority: "Utah Division of Occupational & Professional Licensing" },
  "vermont": { name: "Vermont", slug: "vermont", abbr: "VT", population: "647k", topCities: [], permitAuthority: "Vermont Department of Public Safety — Division of Fire Safety" },
  "virginia": { name: "Virginia", slug: "virginia", abbr: "VA", population: "8.7M", topCities: ["virginia-beach", "norfolk", "chesapeake", "richmond"], permitAuthority: "Virginia Department of Housing & Community Development" },
  "washington": { name: "Washington", slug: "washington", abbr: "WA", population: "7.8M", topCities: ["seattle", "spokane", "tacoma", "vancouver-wa", "bellevue"], permitAuthority: "Washington State Building Code Council" },
  "west-virginia": { name: "West Virginia", slug: "west-virginia", abbr: "WV", population: "1.8M", topCities: [], permitAuthority: "West Virginia State Fire Marshal's Office" },
  "wisconsin": { name: "Wisconsin", slug: "wisconsin", abbr: "WI", population: "5.9M", topCities: ["milwaukee", "madison"], permitAuthority: "Wisconsin Department of Safety & Professional Services" },
  "wyoming": { name: "Wyoming", slug: "wyoming", abbr: "WY", population: "584k", topCities: [], permitAuthority: "Wyoming Department of Fire Prevention & Electrical Safety" },
};

export const STATES_LIST = Object.values(STATES);

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

export const getCityBySlug = (slug: string) => CITIES[slug];
export const getCityByStateCity = (stateSlug: string, citySlug: string) =>
  CITIES_LIST.find(c => c.stateSlug === stateSlug && c.slug === citySlug);
export const getStateBySlug = (slug: string) => STATES[slug];
export const getStateByAbbr = (abbr: string) =>
  STATES_LIST.find(s => s.abbr === abbr.toUpperCase());
export const getCitiesInState = (stateSlug: string) =>
  CITIES_LIST.filter(c => c.stateSlug === stateSlug);
export const isCityLive = (slug: string) =>
  CITIES[slug]?.tier === 1;
