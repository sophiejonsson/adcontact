export type Resource = {
  id: string;
  title: string;
  slug: string;
  type: "guide" | "checklist" | "datasheet" | "certificate" | "article";
  description: string;
  category: string;
  downloadable: boolean;
  featured: boolean;
  tags: string[];
};

export const resources: Resource[] = [
  {
    id: "heat-shrink-selection-guide",
    title: "Heat Shrink Tubing Selection Guide",
    slug: "heat-shrink-selection-guide",
    type: "guide",
    description:
      "How to select the right heat shrink tubing: shrink ratio, material type (PE, PVDF, Viton, fluoropolymer), operating temperature, adhesive lining, and colour coding. Includes comparison table for 15 standard types.",
    category: "Heat Shrink Tubing",
    downloadable: true,
    featured: true,
    tags: ["heat shrink", "selection", "PVDF", "dual-wall", "temperature"],
  },
  {
    id: "connector-selection-guide",
    title: "Connector Selection Guide",
    slug: "connector-selection-guide",
    type: "guide",
    description:
      "A structured approach to selecting connectors: number of positions, sealing requirements, operating environment, current rating, mating cycles, and locking mechanism. Covers DEUTSCH, TE, Stocko, and M8/M12 families.",
    category: "Connectors",
    downloadable: true,
    featured: true,
    tags: ["connector", "selection", "IP67", "DEUTSCH", "M12", "sealing"],
  },
  {
    id: "crimping-quality-basics",
    title: "Crimping Quality Basics",
    slug: "crimping-quality-basics",
    type: "guide",
    description:
      "Understanding crimp quality: correct cross-section, pull force requirements, crimp height (B-crimp), insulation crimp, and visual inspection criteria. Includes tooling selection notes and common failure modes.",
    category: "Contacts & Terminals",
    downloadable: true,
    featured: true,
    tags: ["crimping", "quality", "pull force", "B-crimp", "tooling"],
  },
  {
    id: "wire-harness-checklist",
    title: "Wire Harness Pre-Production Checklist",
    slug: "wire-harness-checklist",
    type: "checklist",
    description:
      "A 25-point checklist for wire harness production teams: from drawing review and material verification to first-article inspection, electrical test, and packaging requirements.",
    category: "Wire Harness",
    downloadable: true,
    featured: false,
    tags: ["wire harness", "checklist", "production", "inspection", "first article"],
  },
  {
    id: "rfq-checklist",
    title: "RFQ Checklist for Industrial Buyers",
    slug: "rfq-checklist",
    type: "checklist",
    description:
      "What information to include when requesting a quotation for industrial components or production equipment. Speeds up the quotation process and ensures accurate pricing.",
    category: "Procurement",
    downloadable: false,
    featured: false,
    tags: ["RFQ", "procurement", "quote request", "checklist"],
  },
  {
    id: "iso-9001-certificate",
    title: "ISO 9001:2015 Quality Certificate",
    slug: "iso-9001-certificate",
    type: "certificate",
    description:
      "Adcontact / Gammeter quality management system certificate ISO 9001:2015. Covers procurement, distribution, and technical support of industrial components and production equipment.",
    category: "Quality",
    downloadable: true,
    featured: false,
    tags: ["ISO 9001", "quality", "certificate", "QMS"],
  },
  {
    id: "deutsch-dt-series-overview",
    title: "DEUTSCH DT Series Technical Overview",
    slug: "deutsch-dt-series-overview",
    type: "article",
    description:
      "A technical overview of the DEUTSCH DT, DTM, and DTP sealed connector series: environmental ratings, contact sizes, housing materials, locking systems, and accessory options (wedgelocks, backshells, seals).",
    category: "Connectors",
    downloadable: false,
    featured: true,
    tags: ["DEUTSCH", "DT series", "DTM", "DTP", "sealed connectors", "technical"],
  },
];

export const featuredResources = resources.filter((r) => r.featured);
