// src/lib/permit-knowledge.ts
//
// PermitPeek Knowledge Layer
// Plain-English explanations for what each permit type means, why it matters,
// and what an "open" status implies. Layered on top of raw city data to
// make our reports genuinely informative.
//
// This is what differentiates our $9 report from just looking at the
// city's open data portal — we explain what users are actually seeing.

export interface PermitKnowledge {
  /** Plain English name (matches translatePermitType output) */
  name: string;
  /** 2-3 sentence explanation of what this permit covers */
  description: string;
  /** Why a homebuyer/owner should care about this permit type */
  whyItMatters: string;
  /** What it typically means if this permit is "open" (not closed/finaled) */
  ifOpen: string;
  /** Average cost range to remediate if there's an issue */
  remediationCost?: string;
  /** Typical professionals required for this work */
  whoDoesIt?: string;
}

// ═══════════════════════════════════════════════════════════
// KNOWLEDGE BASE — Comprehensive explanations for common permit types
// ═══════════════════════════════════════════════════════════

export const PERMIT_KNOWLEDGE: Record<string, PermitKnowledge> = {
  // ── NYC DOB Permit Codes ──────────────────────────────────
  "A1": {
    name: "Major Alteration (Use Change)",
    description: "A1 permits authorize major structural or use changes to a building — including changing the building's primary use (e.g., commercial to residential), adding/removing floors, or significantly modifying load-bearing elements.",
    whyItMatters: "These are the highest-impact alterations and require a registered architect or engineer. An open A1 permit often indicates substantial unfinished work that materially affects the property's value, safety, and legal status.",
    ifOpen: "Open A1 permits are serious red flags before a property sale. Lenders may refuse financing, and the city can issue stop-work orders or fines. Resolution typically requires final inspection sign-off, which can take 3-6 months and cost $5,000-50,000+.",
    remediationCost: "$5,000 - $50,000+",
    whoDoesIt: "Registered Architect or Professional Engineer required",
  },
  "A2": {
    name: "Minor Alteration (Renovation)",
    description: "A2 permits cover renovations that don't change the building's use or footprint — including kitchen remodels, bathroom renovations, partition walls, and most interior modifications.",
    whyItMatters: "A2 is the most common renovation permit type. Multiple A2 permits on a property indicate an active renovation history, which can be positive (well-maintained) or concerning (frequent issues being addressed).",
    ifOpen: "An open A2 permit usually means work was started but never inspected to completion. Common causes: contractor abandoned the job, owner never scheduled final inspection, or work failed inspection and was never re-submitted.",
    remediationCost: "$500 - $5,000",
    whoDoesIt: "Licensed contractor with appropriate trade license",
  },
  "A3": {
    name: "Minor Alteration (Cosmetic)",
    description: "A3 permits cover minor cosmetic alterations such as plumbing fixture replacements, electrical outlet additions, or non-structural cosmetic work. Often self-certifiable in some jurisdictions.",
    whyItMatters: "Generally low-impact, but multiple open A3 permits over time can indicate poor record-keeping or work done without proper closure.",
    ifOpen: "Usually easy to resolve. May require a single inspection visit. Most often closed retroactively without significant cost.",
    remediationCost: "$200 - $1,500",
    whoDoesIt: "Licensed trade contractor",
  },
  "NB": {
    name: "New Building Construction",
    description: "NB permits authorize new building construction from the ground up. This is the most comprehensive permit type and requires plans approval, multiple inspections, and a Certificate of Occupancy at completion.",
    whyItMatters: "An open NB on an existing property typically indicates the building was constructed but never received its Certificate of Occupancy (C of O) — meaning it may technically be illegal to occupy.",
    ifOpen: "This is a major issue. Without a Certificate of Occupancy, the building may not legally be habitable. Mortgage lenders typically won't finance, and insurance may be denied. Resolution requires extensive remediation.",
    remediationCost: "$10,000 - $100,000+",
    whoDoesIt: "Registered Architect, Engineer, and General Contractor",
  },
  "DM": {
    name: "Demolition",
    description: "DM permits authorize full or partial demolition of a structure. Required even for partial demolitions like removing a wing of a house or tearing down a garage.",
    whyItMatters: "Demolition permits indicate something was removed from the property. If the demolished structure was unpermitted to begin with, the property may have undisclosed history of code violations.",
    ifOpen: "Open demolition permits without a follow-up construction permit can indicate incomplete site cleanup or unresolved violations.",
    remediationCost: "$1,000 - $10,000",
    whoDoesIt: "Licensed demolition contractor",
  },
  "EW": {
    name: "Earthwork / Excavation",
    description: "Earthwork permits cover excavation, grading, foundation work, and below-grade construction. Required for any work that disturbs soil more than a few inches deep.",
    whyItMatters: "Earthwork permits often precede major construction. Multiple earthwork permits may indicate foundation issues that required repeated remediation.",
    ifOpen: "Open earthwork permits without subsequent inspection can indicate incomplete site work, potential drainage issues, or unsigned-off foundation modifications.",
    remediationCost: "$2,000 - $25,000",
    whoDoesIt: "Excavation contractor, often with engineering oversight",
  },
  "EQ": {
    name: "Equipment Installation",
    description: "Equipment permits cover the installation of permanent building equipment such as elevators, escalators, large HVAC units, boilers, generators, and similar mechanical systems.",
    whyItMatters: "Equipment permits indicate major mechanical systems on the property. Open EQ permits may mean equipment was installed but never certified safe for use.",
    ifOpen: "Open EQ permits typically mean equipment is functioning but not officially certified. Insurance may not cover incidents involving uncertified equipment.",
    remediationCost: "$1,000 - $15,000",
    whoDoesIt: "Licensed mechanical contractor and specialized equipment installer",
  },
  "FA": {
    name: "Fire Alarm System",
    description: "Fire alarm permits cover the installation or modification of fire detection and notification systems, including smoke detectors, pull stations, and notification appliances.",
    whyItMatters: "Critical for life safety. Open fire alarm permits may mean systems are installed but never tested or certified as functional.",
    ifOpen: "An open fire alarm permit could mean the building's fire detection system has never been officially certified. This is a significant liability and insurance issue.",
    remediationCost: "$500 - $10,000",
    whoDoesIt: "Licensed fire alarm contractor",
  },
  "FB": {
    name: "Fuel Burning Equipment",
    description: "Fuel burning permits cover the installation of boilers, furnaces, water heaters, and other fuel-consuming appliances. Required for both gas and oil-fired equipment.",
    whyItMatters: "Improperly installed fuel-burning equipment is a fire and carbon monoxide hazard. Open permits indicate equipment was installed but not officially inspected for safety.",
    ifOpen: "An open FB permit may mean carbon monoxide ventilation, gas line connections, or combustion safety were never verified. Could be a serious safety issue.",
    remediationCost: "$500 - $5,000",
    whoDoesIt: "Licensed plumber, gas fitter, or HVAC contractor",
  },
  "FP": {
    name: "Fire Protection / Sprinkler",
    description: "Fire protection permits cover sprinkler systems, standpipes, fire pumps, and related fire suppression infrastructure.",
    whyItMatters: "Required for most commercial buildings and multi-family residences. Open permits mean fire suppression systems may not be officially tested or certified.",
    ifOpen: "Open fire protection permits can void insurance coverage and create serious liability. Resolution requires hydrostatic testing, flow tests, and certification.",
    remediationCost: "$1,000 - $20,000",
    whoDoesIt: "Licensed fire protection contractor",
  },
  "FS": {
    name: "Fuel Storage",
    description: "Fuel storage permits cover oil tanks, propane tanks, and other on-site fuel storage. Common in older properties with oil heat.",
    whyItMatters: "Underground oil tanks are a major environmental liability. Open fuel storage permits may indicate undisclosed tanks or environmental remediation issues.",
    ifOpen: "Open FS permits are a particular concern for buyers. Could indicate an unresolved oil tank inspection, leak, or removal that was never completed.",
    remediationCost: "$1,500 - $25,000",
    whoDoesIt: "Licensed tank installer; environmental consultant for removals",
  },
  "MH": {
    name: "Manhole / Vault Work",
    description: "MH permits cover work on manholes, sidewalk vaults, and below-grade utility access points. Common in dense urban properties.",
    whyItMatters: "Typically routine maintenance work for utilities. Open MH permits rarely indicate serious property issues.",
    ifOpen: "Usually low-impact. May indicate utility coordination issues but rarely affects property habitability or value.",
    remediationCost: "$500 - $5,000",
    whoDoesIt: "Utility contractor",
  },
  "PL": {
    name: "Plumbing Work",
    description: "Plumbing permits cover installation or modification of water supply lines, drainage, sewer connections, plumbing fixtures, and gas piping.",
    whyItMatters: "Plumbing permits are common and usually low-risk individually. However, frequent plumbing permits may indicate aging pipes or repeated water damage issues.",
    ifOpen: "Open plumbing permits typically mean work was completed but never officially inspected. Common reasons: contractor didn't schedule final inspection, or work failed and was abandoned.",
    remediationCost: "$300 - $3,000",
    whoDoesIt: "Licensed plumber",
  },
  "SD": {
    name: "Sidewalk Shed / Construction Protection",
    description: "Sidewalk shed permits authorize the installation of temporary protective scaffolding over public sidewalks during construction.",
    whyItMatters: "These are temporary permits. An open sidewalk shed permit means construction is either ongoing or wasn't properly demobilized.",
    ifOpen: "Could indicate active construction at the property, or a contractor that left equipment in place without filing closeout paperwork.",
    remediationCost: "$500 - $3,000",
    whoDoesIt: "General contractor; scaffolding company",
  },
  "SF": {
    name: "Scaffold",
    description: "Scaffold permits authorize temporary scaffolding for exterior work — facade repairs, painting, window replacement, roof work.",
    whyItMatters: "Indicates exterior maintenance or renovation work. Multiple recent scaffold permits may suggest ongoing facade or roof issues.",
    ifOpen: "Open scaffold permits are usually administrative. May indicate the contractor finished the work but didn't file closeout, or work is paused.",
    remediationCost: "$300 - $2,000",
    whoDoesIt: "Scaffolding contractor",
  },
  "SG": {
    name: "Sign Installation",
    description: "Sign permits authorize the installation of building signage — commercial signs, awnings, advertising displays, illuminated signs.",
    whyItMatters: "Common for commercial properties. Usually low-impact on residential properties. Open sign permits rarely affect property habitability.",
    ifOpen: "Generally low priority. May indicate old signs that were installed but never officially certified.",
    remediationCost: "$200 - $1,500",
    whoDoesIt: "Licensed sign contractor",
  },
  "SH": {
    name: "Sidewalk Shed",
    description: "Sidewalk shed permits authorize protective sheds over public sidewalks during construction work on adjacent buildings.",
    whyItMatters: "Indicates construction activity at or near the property. Often required for facade work on multi-story buildings.",
    ifOpen: "Open SH permits may indicate the protective structure wasn't properly removed after work completion.",
    remediationCost: "$500 - $2,000",
    whoDoesIt: "Scaffolding company; general contractor",
  },
  "SP": {
    name: "Sprinkler System",
    description: "Sprinkler permits cover the installation or modification of fire sprinkler systems. Required for most commercial buildings and large residential structures.",
    whyItMatters: "Critical life safety system. Open sprinkler permits mean the fire suppression system may not be officially tested or certified as functional.",
    ifOpen: "Significant concern. Sprinkler systems that haven't been officially commissioned may not function in an emergency. Insurance companies often require certified, inspected sprinkler systems.",
    remediationCost: "$1,000 - $15,000",
    whoDoesIt: "Licensed fire sprinkler contractor",
  },
  "OT": {
    name: "Other / Miscellaneous Work",
    description: "OT covers work that doesn't fit standard permit categories — including unusual installations, specialty trades, or interpretive work types.",
    whyItMatters: "The 'other' category requires deeper investigation. The actual nature of the work isn't clear from the permit type alone — review the work description for context.",
    ifOpen: "Without knowing the specific work type, the impact of an open permit can't be assessed. Recommend contacting the city's building department for details.",
    remediationCost: "Varies widely",
    whoDoesIt: "Varies by work type",
  },
  "BL": {
    name: "Boiler Installation",
    description: "Boiler permits cover the installation, replacement, or major modification of building heating boilers. Required for both residential and commercial boilers above certain capacity.",
    whyItMatters: "Boilers are pressurized fuel-burning equipment with significant safety implications. Open boiler permits may mean the unit hasn't been officially certified for safe operation.",
    ifOpen: "Open boiler permits typically mean a unit was installed but never received its operating certificate. Insurance and safety concerns apply.",
    remediationCost: "$500 - $5,000",
    whoDoesIt: "Licensed mechanical contractor; boiler inspector",
  },

  // ── Generic permit categories (used by non-NYC cities) ────
  "PLUMBING": {
    name: "Plumbing Work",
    description: "Plumbing permits cover any modification to water supply, drainage, sewer connections, gas piping, or plumbing fixtures within the property.",
    whyItMatters: "Common, routine permits. Multiple plumbing permits may indicate recurring issues. Open permits often mean work was done but never officially inspected.",
    ifOpen: "Typically resolved with a single inspection. Most lenders won't reject mortgages over isolated open plumbing permits, but they should be cleared before closing.",
    remediationCost: "$300 - $3,000",
    whoDoesIt: "Licensed plumber",
  },
  "ELECTRICAL": {
    name: "Electrical Work",
    description: "Electrical permits cover any modification to a property's electrical systems — new circuits, panel upgrades, outlet additions, lighting installations, and rewiring projects.",
    whyItMatters: "Electrical work is the most common cause of house fires. Unpermitted or unclosed electrical work creates fire risk and can void homeowner's insurance.",
    ifOpen: "Open electrical permits are higher-priority concerns. Could indicate unfinished or uninspected wiring — a potential fire hazard. Insurance claims related to electrical fires are often denied if work was unpermitted.",
    remediationCost: "$500 - $8,000",
    whoDoesIt: "Licensed electrician",
  },
  "MECHANICAL": {
    name: "HVAC / Mechanical",
    description: "Mechanical permits cover heating, ventilation, and air conditioning system installations and modifications. Includes ductwork, refrigerant lines, and condensate drains.",
    whyItMatters: "HVAC work affects building energy efficiency and air quality. Open mechanical permits may mean systems were installed but never tested for proper operation.",
    ifOpen: "Open HVAC permits usually mean equipment is functional but uncertified. Could affect warranty coverage and energy efficiency claims.",
    remediationCost: "$500 - $10,000",
    whoDoesIt: "Licensed HVAC contractor",
  },
  "STRUCTURAL": {
    name: "Structural Work",
    description: "Structural permits cover work affecting the building's load-bearing elements — foundations, beams, columns, load-bearing walls, and roof structure.",
    whyItMatters: "Structural work is the highest-stakes category. Improper structural modifications can compromise building safety. Open structural permits are major red flags for buyers.",
    ifOpen: "Open structural permits should halt any property purchase until resolved. The structural integrity of the building cannot be verified without final inspection sign-off.",
    remediationCost: "$3,000 - $50,000+",
    whoDoesIt: "Structural Engineer + General Contractor",
  },
  "DEMOLITION": {
    name: "Demolition",
    description: "Demolition permits cover full or partial removal of building structures, walls, or significant components.",
    whyItMatters: "Demolition often precedes new construction. Open demolition permits without follow-up construction can indicate environmental or zoning issues.",
    ifOpen: "Investigate whether demolished items were ever properly replaced. Open demolition permits may indicate exposed structural elements or incomplete site work.",
    remediationCost: "$1,000 - $10,000",
    whoDoesIt: "Licensed demolition contractor",
  },
  "ALTERATION": {
    name: "Renovation / Alteration",
    description: "General alteration permits cover modifications to existing structures that don't fall into specialized categories (electrical, plumbing, structural, etc.).",
    whyItMatters: "Catch-all category for renovations. Multiple alteration permits indicate active property maintenance and improvement.",
    ifOpen: "Typically resolves with final inspection. Check the description field for specific work details.",
    remediationCost: "$500 - $5,000",
    whoDoesIt: "Licensed contractor",
  },
  "ADDITION": {
    name: "Building Addition",
    description: "Addition permits cover expansions to existing structures — new rooms, second-story additions, garage conversions, deck additions.",
    whyItMatters: "Additions change the property's footprint and assessed value. Open addition permits may mean unauthorized square footage that wasn't legally added to the property.",
    ifOpen: "Significant concern. The property may have additional square footage that isn't legally documented. Affects tax assessment, insurance, and resale value.",
    remediationCost: "$2,000 - $25,000",
    whoDoesIt: "Licensed General Contractor; often requires Architect",
  },
};

// ═══════════════════════════════════════════════════════════
// CITY VERIFICATION GUIDES — How to call each city's building dept
// ═══════════════════════════════════════════════════════════

export interface CityVerificationGuide {
  authority: string;
  phone?: string;
  email?: string;
  hours?: string;
  inPersonAddress?: string;
  freeServices: string[];
  paidServices: string[];
  tipForCallers: string;
}

export const CITY_VERIFICATION: Record<string, CityVerificationGuide> = {
  "new-york": {
    authority: "NYC Department of Buildings (DOB)",
    phone: "(212) 393-2000",
    hours: "Monday–Friday, 8:30 AM–4:30 PM ET",
    inPersonAddress: "280 Broadway, 7th Floor, New York, NY 10007",
    freeServices: [
      "Verify permit status by address (online or phone)",
      "Look up violations and complaints history",
      "Check Certificate of Occupancy status",
      "View basic permit details via DOB NOW website",
    ],
    paidServices: [
      "Full permit copies: $0.25 per page",
      "Certified copies: additional fees apply",
      "Property profile reports",
    ],
    tipForCallers: "Have the property's address and BIN (Building Identification Number) ready. The BIN can be looked up free at the NYC DOB website. For complex situations, request to speak with a Borough Office representative for the specific borough where the property is located.",
  },
  "san-francisco": {
    authority: "SF Department of Building Inspection (DBI)",
    phone: "(628) 652-3700",
    hours: "Monday–Friday, 8:00 AM–5:00 PM PT",
    inPersonAddress: "49 South Van Ness Avenue, San Francisco, CA 94103",
    freeServices: [
      "Verify permit status via DBI Online portal",
      "View Notice of Violation (NOV) history",
      "Check Notice of Special Restriction (NSR) status",
      "Basic property information lookup",
    ],
    paidServices: [
      "Building permit history reports",
      "Plan copies (varies by request)",
      "Records requests via Sunshine Ordinance",
    ],
    tipForCallers: "SF DBI has detailed online tools at sfdbi.org. For unpermitted work concerns, ask specifically about Notice of Violation history and any pending enforcement actions on the property.",
  },
  "chicago": {
    authority: "Chicago Department of Buildings",
    phone: "(312) 744-3449",
    hours: "Monday–Friday, 8:30 AM–4:30 PM CT",
    inPersonAddress: "121 N LaSalle Street, Room 900, Chicago, IL 60602",
    freeServices: [
      "Permit search via Chicago Data Portal",
      "Building violation history lookup",
      "Active permits by address",
    ],
    paidServices: [
      "Permit document copies",
      "Records requests via FOIA",
    ],
    tipForCallers: "Chicago uses a self-certification system for many permit types. When checking a property, ask whether the work was self-certified or had municipal inspection — self-certified work has weaker oversight.",
  },
  "austin": {
    authority: "Austin Development Services Department",
    phone: "(512) 978-4000",
    hours: "Monday–Friday, 7:45 AM–4:30 PM CT",
    inPersonAddress: "6310 Wilhelmina Delco Drive, Austin, TX 78752",
    freeServices: [
      "Permit search via Austin Build + Connect (AB+C)",
      "Code violation history",
      "Online permit status lookup",
    ],
    paidServices: [
      "Document copies",
      "Public records requests",
    ],
    tipForCallers: "Austin's AB+C system is comprehensive. For older properties (pre-2000), some records may not be digitized — request in-person research at the Wilhelmina Delco Drive office.",
  },
  "seattle": {
    authority: "Seattle Department of Construction & Inspections (SDCI)",
    phone: "(206) 684-8600",
    hours: "Monday–Friday, 8:00 AM–4:00 PM PT",
    inPersonAddress: "700 5th Avenue, Suite 2000, Seattle, WA 98104",
    freeServices: [
      "Permit lookup via Seattle Services Portal",
      "Property history search",
      "Code compliance history",
    ],
    paidServices: [
      "Microfilm research and copies",
      "Records requests under Public Records Act",
    ],
    tipForCallers: "SDCI offers a free 'Property Detail' search online that's quite comprehensive. For pre-1970 properties, in-person microfilm research may be required.",
  },
  "los-angeles": {
    authority: "LA Department of Building & Safety (LADBS)",
    phone: "(213) 482-0000",
    hours: "Monday–Friday, 7:30 AM–4:30 PM PT",
    inPersonAddress: "201 N Figueroa Street, Los Angeles, CA 90012",
    freeServices: [
      "Permit search via LADBS website",
      "Online Code Violation Inquiry System",
      "Address-based property information",
    ],
    paidServices: [
      "Full plan copies: $0.50–$5 per page depending on size",
      "Certified copies",
      "Records research fee for older properties",
    ],
    tipForCallers: "LA has separate offices for different zones. After your initial call, you may be transferred to a District Office. For unpermitted work, ask about the 'Code Enforcement' division which tracks active violations.",
  },
};

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get knowledge for a permit, trying multiple lookup strategies.
 * NYC uses codes like "EW", "A2"; other cities use words like "PLUMBING".
 */
export function getPermitKnowledge(permitType: string): PermitKnowledge | null {
  if (!permitType) return null;

  // Try exact uppercase match (NYC codes: EW, MH, A2, etc.)
  const upper = permitType.toUpperCase().trim();
  if (PERMIT_KNOWLEDGE[upper]) {
    return PERMIT_KNOWLEDGE[upper];
  }

  // Try keyword matching for descriptive types
  const lower = permitType.toLowerCase();
  if (lower.includes("plumb")) return PERMIT_KNOWLEDGE["PLUMBING"];
  if (lower.includes("electric")) return PERMIT_KNOWLEDGE["ELECTRICAL"];
  if (lower.includes("mechanical") || lower.includes("hvac")) return PERMIT_KNOWLEDGE["MECHANICAL"];
  if (lower.includes("structural") || lower.includes("foundation")) return PERMIT_KNOWLEDGE["STRUCTURAL"];
  if (lower.includes("demolition") || lower.includes("demo")) return PERMIT_KNOWLEDGE["DEMOLITION"];
  if (lower.includes("alteration") || lower.includes("renovation") || lower.includes("remodel")) return PERMIT_KNOWLEDGE["ALTERATION"];
  if (lower.includes("addition")) return PERMIT_KNOWLEDGE["ADDITION"];
  if (lower.includes("new") && lower.includes("construction")) return PERMIT_KNOWLEDGE["NB"];

  return null;
}

/**
 * Get the verification guide for a city
 */
export function getCityVerification(citySlug: string): CityVerificationGuide | null {
  return CITY_VERIFICATION[citySlug] || null;
}

/**
 * General "what does an open permit mean" explainer
 * Used in the report's risk assessment section
 */
export const OPEN_PERMIT_EXPLAINER = {
  title: "What does an open permit mean?",
  body: "An 'open' permit means work was approved by the city but never officially marked as complete by an inspector. This commonly happens when contractors finish work but fail to schedule final inspection, when work fails inspection and is never re-submitted, or when the project was abandoned mid-completion.",
  consequences: [
    "Mortgage lenders may refuse to finance properties with open permits",
    "Title companies may flag open permits during closing, delaying or canceling sales",
    "Homeowner's insurance may deny claims related to unpermitted/unclosed work",
    "The new owner inherits responsibility for resolving the open permit",
    "Cities may issue fines or stop-work orders even years after work was performed",
  ],
  howToResolve: "Contact the city's building department, request the permit's current status, and ask what's needed to close it. Most open permits resolve with a single inspection. Some require additional documentation or remediation work.",
};

/**
 * Citation links to each city's authoritative code source
 */
export const CITY_CODE_LINKS: Record<string, { name: string; url: string }[]> = {
  "new-york": [
    { name: "NYC Building Code (BC)", url: "https://www.nyc.gov/site/buildings/codes/2022-construction-codes.page" },
    { name: "NYC DOB Permit Information", url: "https://www.nyc.gov/site/buildings/about/permits.page" },
  ],
  "san-francisco": [
    { name: "SF Building Code", url: "https://sfdbi.org/codes-standards" },
    { name: "SF DBI Permit Center", url: "https://sfdbi.org/permits" },
  ],
  "chicago": [
    { name: "Chicago Building Code", url: "https://www.chicago.gov/city/en/depts/bldgs/provdrs/permit_review/svcs/permit_processoverview.html" },
    { name: "Chicago Department of Buildings", url: "https://www.chicago.gov/city/en/depts/bldgs.html" },
  ],
  "austin": [
    { name: "Austin Building Criteria Manual", url: "https://www.austintexas.gov/department/building-criteria-manual" },
    { name: "Austin Development Services", url: "https://www.austintexas.gov/department/development-services" },
  ],
  "seattle": [
    { name: "Seattle Building Code", url: "https://www.seattle.gov/sdci/codes/codes-we-enforce-(a-z)/building-code" },
    { name: "Seattle SDCI", url: "https://www.seattle.gov/sdci" },
  ],
  "los-angeles": [
    { name: "LA Building Code", url: "https://www.ladbs.org/services/core-services/code-amendments" },
    { name: "LADBS", url: "https://www.ladbs.org/" },
  ],
};
