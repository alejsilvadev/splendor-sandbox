// Case studies, services and agency facts sourced from Splendor's public
// site (splendordesign.com). Headlines are theirs; the supporting prose
// describes the shape of each engagement rather than claiming results —
// this is an unaffiliated portfolio sandbox, not agency marketing.

export type Discipline =
  | "Branding"
  | "Website Design"
  | "Digital Marketing"
  | "Content Marketing";

export interface CaseStudy {
  slug: string;
  client: string;
  headline: string;
  sector: string;
  year: number;
  disciplines: Discipline[];
  deliverables: string[];
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  imageId: number;
}

export interface Service {
  id: Discipline;
  blurb: string;
  capabilities: string[];
}

// Picsum photo IDs, hand-picked so each card reads as a plausible sector
// image; they run through a duotone treatment in the UI either way.
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "sensient",
    client: "Sensient",
    headline: "Natural food colors. Supernatural creative.",
    sector: "Food & Beverage",
    year: 2024,
    disciplines: ["Branding", "Content Marketing"],
    deliverables: ["Campaign platform", "Art direction", "Trade collateral", "Motion"],
    summary:
      "A global colors manufacturer whose science was ahead of its storytelling.",
    challenge:
      "Sensient makes the natural colors behind products people eat every day, but the category talks in chemistry — certifications, stability curves, regulatory language. The work that mattered most to buyers was the hardest part of the business to see.",
    approach:
      "Lead with the spectacle. Build a visual language out of the product itself — pigment in motion, saturated and unapologetic — and let the technical proof sit underneath it rather than in front of it.",
    outcome:
      "A campaign platform that carries across trade press, booth graphics and sales collateral, giving a science-led business a creative register it did not previously have.",
    imageId: 1080,
  },
  {
    slug: "brookdale-community-college",
    client: "Brookdale Community College",
    headline: "Here will get you there.",
    sector: "Higher Education",
    year: 2023,
    disciplines: ["Branding", "Digital Marketing"],
    deliverables: ["Positioning", "Brand campaign", "Media plan", "Recruitment creative"],
    summary:
      "Enrollment marketing for a county college competing against four-year name recognition.",
    challenge:
      "Community college is a decision students talk themselves out of. The institution was competing less with other schools than with the assumption that starting close to home means settling.",
    approach:
      "Reframe proximity as leverage. A positioning line that treats Brookdale as the first move in a longer plan, carried through recruitment creative aimed at students and the parents funding the decision.",
    outcome:
      "A recruitment platform that gives admissions, advancement and academic departments one consistent argument to make.",
    imageId: 20,
  },
  {
    slug: "m-station-morristown",
    client: "M Station at Morristown",
    headline: "From dated strip mall to Fortune 500 headquarters.",
    sector: "Commercial Real Estate",
    year: 2023,
    disciplines: ["Branding", "Website Design"],
    deliverables: ["Naming", "Identity", "Leasing site", "Environmental graphics"],
    summary:
      "Branding a ground-up redevelopment before there was anything on site to photograph.",
    challenge:
      "Leasing a building that does not exist yet means selling an idea to tenants who evaluate in square feet. The site's existing reputation — a tired retail strip — was working against the pitch.",
    approach:
      "Name and position the development as a destination rather than an address, then build a leasing site where renderings, transit math and floor plates carry equal weight.",
    outcome:
      "An identity and leasing platform that gave the brokerage team a story to lead with well ahead of delivery.",
    imageId: 1076,
  },
  {
    slug: "langan",
    client: "Langan",
    headline: "Engineering Langan's marketing for success.",
    sector: "Engineering & Design",
    year: 2024,
    disciplines: ["Branding", "Digital Marketing", "Content Marketing"],
    deliverables: ["Messaging framework", "Sector campaigns", "Thought leadership", "Recruiting creative"],
    summary:
      "Marketing infrastructure for a global engineering firm with more technical depth than air cover.",
    challenge:
      "An international firm whose work spans site development, environmental and transportation — sold by technical experts who are not marketers, into sectors that each expect their own vocabulary.",
    approach:
      "Build one messaging framework flexible enough to flex by sector, then equip practice leads with campaign assets, thought leadership and recruiting creative they can actually deploy.",
    outcome:
      "A repeatable marketing system that scales across practice groups instead of being rebuilt for each one.",
    imageId: 1067,
  },
  {
    slug: "figenza",
    client: "Figenza",
    headline: "Raising awareness, then a glass.",
    sector: "Spirits",
    year: 2022,
    disciplines: ["Branding", "Digital Marketing"],
    deliverables: ["Packaging", "Brand identity", "Social", "Point of sale"],
    summary:
      "A fig-infused vodka that needed shelf presence before it could earn a pour.",
    challenge:
      "Flavored vodka is a crowded, discount-driven shelf. A new entrant gets roughly one second of attention and no chance to explain itself.",
    approach:
      "Treat the bottle as the whole campaign — packaging built to be recognized at distance, extended into social and point of sale that teach the serve rather than just the name.",
    outcome:
      "A consistent identity running from the shelf through to bar programs and social, so every touchpoint reinforces the same drink.",
    imageId: 431,
  },
  {
    slug: "robert-edward-auctions",
    client: "Robert Edward Auctions",
    headline: "A grand slam of creative.",
    sector: "Collectibles & Auctions",
    year: 2023,
    disciplines: ["Branding", "Website Design"],
    deliverables: ["Identity refresh", "Catalog design", "Digital platform"],
    summary:
      "Repositioning the sports memorabilia auction house for a market that moved online.",
    challenge:
      "Decades of authority in a category whose buyers had shifted from print catalogs and phone bids to digital-first browsing, without the brand shifting with them.",
    approach:
      "Keep the provenance, modernize the delivery. An identity that still reads as an institution, paired with catalog and digital design built around how lots are actually browsed now.",
    outcome:
      "A brand system that carries the same weight in a hardbound catalog and on a phone during a live auction.",
    imageId: 1058,
  },
  {
    slug: "hill-wallack",
    client: "Hill Wallack LLP",
    headline: "Impact where it matters most.",
    sector: "Legal",
    year: 2024,
    disciplines: ["Branding", "Website Design"],
    deliverables: ["Brand strategy", "Identity", "Website", "Practice collateral"],
    summary:
      "Differentiating a mid-Atlantic law firm in a category where every competitor says the same thing.",
    challenge:
      "Legal branding converges: the same columns, the same handshake photography, the same claim to be trusted advisors. Real differences between firms live in practice depth that nobody reads far enough to find.",
    approach:
      "Lead with consequence rather than credentials. Structure the site so practice areas surface the matters that demonstrate depth, instead of burying them under firm history.",
    outcome:
      "A brand and site that give attorneys something specific to point at during a pitch.",
    imageId: 1082,
  },
  {
    slug: "power-to-protect-nj",
    client: "Power to Protect NJ",
    headline: "Injecting new life into New Jersey's flu shot campaign.",
    sector: "Public Health",
    year: 2022,
    disciplines: ["Digital Marketing", "Content Marketing"],
    deliverables: ["Campaign identity", "Paid media", "Video", "Multilingual assets"],
    summary:
      "A statewide public health campaign competing for attention with everything else on the feed.",
    challenge:
      "Vaccination messaging has to reach communities with different languages, different media habits and different reasons for hesitancy — on a public budget, against well-funded noise.",
    approach:
      "One campaign identity, many cuts. Build the creative to be localized from the start rather than translated at the end, and put the media weight where the gaps actually are.",
    outcome:
      "A campaign toolkit deployable across paid, community partner and clinic channels without losing coherence.",
    imageId: 1024,
  },
  {
    slug: "onyx-equities",
    client: "Onyx Equities",
    headline: "A partnership built on a solid foundation.",
    sector: "Real Estate",
    year: 2023,
    disciplines: ["Branding", "Website Design", "Digital Marketing"],
    deliverables: ["Corporate identity", "Property brand system", "Websites", "Leasing campaigns"],
    summary:
      "A long-running relationship spanning the corporate brand and the properties underneath it.",
    challenge:
      "A regional owner-operator acquiring and repositioning buildings faster than any one-off branding process could keep up with. Each property needed its own identity without fragmenting the parent brand.",
    approach:
      "Build a system, not a set of logos. A corporate identity with clear rules for how a property brand hangs off it, plus templated leasing sites that spin up in days rather than months.",
    outcome:
      "A brand architecture that absorbs new acquisitions instead of being renegotiated for each one.",
    imageId: 1031,
  },
  {
    slug: "violet-pr",
    client: "Violet PR",
    headline: "Writing a bolder future.",
    sector: "Public Relations",
    year: 2022,
    disciplines: ["Branding", "Website Design"],
    deliverables: ["Naming", "Identity", "Website", "Content system"],
    summary:
      "Branding the brand people — a PR firm that had never turned its own methods inward.",
    challenge:
      "Agencies are famously their own worst client. The firm sold sharp positioning to everyone else while its own presence stayed generic.",
    approach:
      "Take the medicine. A bolder verbal and visual identity, built around the kind of point of view the firm asks its own clients to take.",
    outcome:
      "An identity and site that demonstrate the service rather than describing it.",
    imageId: 1074,
  },
];

export const SERVICES: Service[] = [
  {
    id: "Branding",
    blurb:
      "Finding what is actually true about a company, then making it impossible to confuse with anyone else.",
    capabilities: ["Strategy", "Naming", "Messaging", "Logo design", "Collateral"],
  },
  {
    id: "Website Design",
    blurb:
      "Custom sites built around how people really move through them, not around a template's assumptions.",
    capabilities: ["UI/UX", "Web development", "Apps", "Mobile", "Hosting"],
  },
  {
    id: "Digital Marketing",
    blurb:
      "Getting the work in front of the people it was made for, and knowing what happened when it landed.",
    capabilities: ["SEO", "Paid media", "Social", "Email", "Display"],
  },
  {
    id: "Content Marketing",
    blurb:
      "The substance behind the positioning — the pieces that earn attention before anything is asked for.",
    capabilities: ["Copywriting", "Video", "Motion graphics", "Case studies", "Presentations"],
  },
];

export const AGENCY_FACTS = [
  { value: "27", label: "years in business" },
  { value: "300+", label: "creative awards" },
  { value: "Inc. 5000", label: "2026 honoree" },
  { value: "2", label: "offices — Red Bank, NJ & Jacksonville, FL" },
] as const;

export const DISCIPLINES: Discipline[] = [
  "Branding",
  "Website Design",
  "Digital Marketing",
  "Content Marketing",
];

export const CASE_STUDY_COUNT = CASE_STUDIES.length;

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function adjacentCaseStudies(slug: string) {
  const index = CASE_STUDIES.findIndex((study) => study.slug === slug);
  return {
    previous: index > 0 ? CASE_STUDIES[index - 1] : null,
    next: index >= 0 && index < CASE_STUDIES.length - 1 ? CASE_STUDIES[index + 1] : null,
  };
}
