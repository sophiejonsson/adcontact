export type Category = {
  id: string;
  name: string;
  slug: string;
  webshopHref: string;
  description: string;
  shortDescription: string;
  icon: string;
  image?: string;
  exampleBrands: string[];
  exampleProducts: string[];
  productCount: number;
  featured: boolean;
  tags: string[];
};

export const categories: Category[] = [
  {
    id: "connectors",
    name: "Connectors & Connector Systems",
    slug: "connectors",
    webshopHref: "/webshop/components/sealed-connectors.html",
    description:
      "Sealed and unsealed connectors for harsh environments, automotive, industrial, and wire-to-board applications. Including Deutsch DT/DTM/DTP series, TE Connectivity AMP connectors, Stocko systems, M8/M12 fieldbus connectors, and Cvilux wire-to-board solutions.",
    shortDescription:
      "Deutsch, TE Connectivity, Stocko, M8/M12, automotive and PCB connector systems.",
    icon: "Zap",
    image: "/images/DT06-2S-E003_1.jpg",
    exampleBrands: ["Deutsch", "TE Connectivity", "Stocko", "Cvilux", "Vogt"],
    exampleProducts: ["DT06-6S", "AMP MTA-156", "M12 4-pin A-coded", "MQS 1.2"],
    productCount: 847,
    featured: true,
    tags: ["sealed", "automotive", "industrial", "PCB", "fieldbus"],
  },
  {
    id: "heat-shrink",
    name: "Heat Shrink Tubing",
    slug: "heat-shrink-tubing",
    webshopHref: "/webshop/components/heat-shrinkable.html",
    description:
      "Single-wall, dual-wall (adhesive-lined), and specialised heat shrink tubing for cable insulation, bundling, environmental sealing, and strain relief. Including standard polyolefin, PVDF, Viton, and fluoropolymer types from DSG-Canusa and HongShang.",
    shortDescription:
      "Single-wall, dual-wall, adhesive-lined and specialised heat shrink tubing.",
    icon: "Flame",
    image: "/images/h-2z-140-x-105-version-2_5.jpg",
    exampleBrands: ["DSG-Canusa", "HongShang", "TE Connectivity"],
    exampleProducts: ["2:1 PE tubing", "3:1 adhesive-lined", "PVDF high-temp", "Wraparound sleeves"],
    productCount: 612,
    featured: true,
    tags: ["insulation", "sealing", "strain relief", "dual-wall", "PVDF"],
  },
  {
    id: "contacts-terminals",
    name: "Contacts, Terminals & Splices",
    slug: "contacts-terminals",
    webshopHref: "/webshop/components/contacts.html",
    description:
      "Crimp contacts, solderless terminals, ring terminals, fork terminals, pin terminals, butt splices, and inline splices. Compatible with leading connector housings from Deutsch, TE, and Stocko. Available in tin, gold, and silver plating.",
    shortDescription:
      "Crimp contacts, ring, fork and pin terminals, butt splices, all plating options.",
    icon: "CircuitBoard",
    image: "/images/Cable_Terminals_-_Solderless_splices.jpg",
    exampleBrands: ["TE Connectivity", "Vogt", "Stocko"],
    exampleProducts: ["Ring terminal M6", "Butt splice 1.5mm²", "Crimp contact 0.5mm²", "DT receptacle contact"],
    productCount: 1240,
    featured: true,
    tags: ["crimp", "ring terminal", "fork terminal", "butt splice", "gold plated"],
  },
  {
    id: "wire-ferrules",
    name: "Wire Ferrules & End Sleeves",
    slug: "wire-ferrules",
    webshopHref: "/webshop/components/sealed-connectors/zoller-frohlich/wire-ferrules.html",
    description:
      "End sleeve ferrules (Aderendhülsen) for fine wire termination into screw terminals and push-in connectors. Insulated and non-insulated types, single and twin-wire versions. Available from 0.5mm² to 95mm². DIN 46228 compliant.",
    shortDescription:
      "Insulated and non-insulated end sleeves, single and twin, 0.5–95mm², DIN 46228.",
    icon: "Cable",
    image: "/images/AEI_isoliert_114.jpg",
    exampleBrands: ["Zoller & Fröhlich"],
    exampleProducts: ["Twin ferrule 2×1.5mm²", "0.75mm² insulated blue", "4mm² non-insulated", "95mm² power ferrule"],
    productCount: 389,
    featured: false,
    tags: ["ferrule", "end sleeve", "DIN 46228", "screw terminal", "twin"],
  },
  {
    id: "pcb-contacts",
    name: "PCB Contacts & Soldering Tags",
    slug: "pcb-contacts",
    webshopHref: "/webshop/components/sealed-connectors/vogt/contact-pieces-for-pcb-soldering-tags.html",
    description:
      "Press-fit, solder, and SMD PCB contacts. Turret, bifurcated, and cup soldering tags for board-level assembly. Including right-angle, vertical, and through-hole types suitable for wave and reflow soldering.",
    shortDescription:
      "Press-fit, SMD, and through-hole PCB contacts; turret and bifurcated soldering tags.",
    icon: "Cpu",
    image: "/images/Contact_pieces_for_PCB_-Soldering_tags.jpg",
    exampleBrands: ["Vogt", "TE Connectivity", "Stocko"],
    exampleProducts: ["Turret terminal PCB", "Press-fit contact 2.54mm", "SMD pad terminal", "Right-angle pin"],
    productCount: 278,
    featured: false,
    tags: ["PCB", "press-fit", "SMD", "through-hole", "turret", "reflow"],
  },
  {
    id: "tools",
    name: "Tools & Application Equipment",
    slug: "tools",
    webshopHref: "/webshop/components/sealed-connectors/vogt/hand-tools-presses-and-accessories.html",
    description:
      "Hand crimp tools, ratchet crimpers, pneumatic bench applicators, heat guns, and extraction tools. Correct tooling is critical for reliable crimp connections. We stock and source tooling matched to the connector and contact series we supply.",
    shortDescription:
      "Hand crimpers, pneumatic applicators, heat guns, extraction tools, matched to part.",
    icon: "Wrench",
    image: "/images/Hand_tools_-_Presses_and_accessories.jpg",
    exampleBrands: ["TE Connectivity", "Mecal", "Zoller & Fröhlich"],
    exampleProducts: ["DEUTSCH HDT-48-00 crimp tool", "Heat gun 1500W", "Pneumatic applicator AP-200", "Pin extraction tool"],
    productCount: 156,
    featured: false,
    tags: ["crimp tool", "ratchet", "pneumatic", "heat gun", "extraction"],
  },
  {
    id: "production-equipment",
    name: "Production Equipment",
    slug: "production-equipment",
    webshopHref: "/webshop/production-equipment.html",
    description:
      "Wire cutting machines, automatic stripping machines, crimping equipment, ultrasonic welding units, quality assurance modules, electrical test systems, and networking solutions for the complete wire-processing line.",
    shortDescription:
      "Cutting, stripping, crimping, ultrasonic welding, QA test systems, complete lines.",
    icon: "Factory",
    image: "/images/p120_web12.jpg",
    exampleBrands: ["Mecal", "Zoller & Fröhlich", "Branson", "Schunk"],
    exampleProducts: ["Automatic wire cutter", "Rotary stripping machine", "Crimping press", "Ultrasonic welder 2000W"],
    productCount: 94,
    featured: true,
    tags: ["cutting", "stripping", "crimping press", "ultrasonic", "quality control"],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
