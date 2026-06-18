export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  partNumber: string;
  category: string;
  categorySlug: string;
  brand: string;
  brandSlug: string;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  tags: string[];
  applications: string[];
  standards?: string[];
  available: boolean;
  requestQuote: boolean;
  featured: boolean;
};

export const products: Product[] = [
  {
    id: "dt06-6s",
    name: "DEUTSCH DT06-6S 6-Way Receptacle",
    slug: "dt06-6s-deutsch-6way-receptacle",
    partNumber: "DT06-6S",
    category: "Connectors",
    categorySlug: "connectors",
    brand: "Deutsch",
    brandSlug: "deutsch",
    shortDescription: "6-way sealed receptacle, grey, DT series, suitable for wire gauges 0.5–4.0mm².",
    description:
      "The DEUTSCH DT06-6S is a 6-position sealed receptacle connector from the DT Series. Designed for harsh environments, it offers IP67 sealing when fully mated. Used extensively in agricultural machinery, construction equipment, and truck/trailer wiring. Compatible with 0462 and 0460 series contacts.",
    specs: [
      { label: "Series", value: "DEUTSCH DT" },
      { label: "Positions", value: "6" },
      { label: "Gender", value: "Receptacle (female housing)" },
      { label: "Wire gauge", value: "0.5–4.0mm² (AWG 20–12)" },
      { label: "Sealing", value: "IP67 when mated" },
      { label: "Operating temp.", value: "-55°C to +125°C" },
      { label: "Material", value: "Nylon 66, colour: Grey" },
      { label: "Contact plating", value: "Gold over nickel (standard)" },
    ],
    tags: ["sealed", "IP67", "6-way", "DT series", "harsh environment", "automotive"],
    applications: ["Agricultural machinery", "Construction vehicles", "Truck & trailer", "Off-highway", "Marine"],
    standards: ["MIL-C-38999", "IEC 61984"],
    available: true,
    requestQuote: false,
    featured: true,
  },
  {
    id: "dt04-6p",
    name: "DEUTSCH DT04-6P 6-Way Plug",
    slug: "dt04-6p-deutsch-6way-plug",
    partNumber: "DT04-6P",
    category: "Connectors",
    categorySlug: "connectors",
    brand: "Deutsch",
    brandSlug: "deutsch",
    shortDescription: "6-way sealed plug, grey, DT series, mating half to DT06-6S.",
    description:
      "The DEUTSCH DT04-6P is the mating plug (male housing) for the DT06-6S receptacle. Same environmental performance, compatible with the same contact and sealing range. Includes secondary lock and wedge lock options.",
    specs: [
      { label: "Series", value: "DEUTSCH DT" },
      { label: "Positions", value: "6" },
      { label: "Gender", value: "Plug (male housing)" },
      { label: "Wire gauge", value: "0.5–4.0mm² (AWG 20–12)" },
      { label: "Sealing", value: "IP67 when mated" },
      { label: "Operating temp.", value: "-55°C to +125°C" },
    ],
    tags: ["sealed", "IP67", "6-way", "DT series", "plug"],
    applications: ["Agricultural machinery", "Construction vehicles", "Truck & trailer"],
    available: true,
    requestQuote: false,
    featured: true,
  },
  {
    id: "hs-25-2-1-pe-black",
    name: "Heat Shrink Tubing 25.4/12.7mm 2:1 Black",
    slug: "heat-shrink-25-4mm-2-1-black",
    partNumber: "HS-25-2:1-BK",
    category: "Heat Shrink Tubing",
    categorySlug: "heat-shrink-tubing",
    brand: "HongShang",
    brandSlug: "hongshang",
    shortDescription: "25.4mm expanded / 12.7mm recovered, 2:1 ratio, black polyolefin, 1.2m length.",
    description:
      "Standard cross-linked polyolefin heat shrink tubing with a 2:1 shrink ratio. UV-resistant black colour. Suitable for cable bundling, insulation, colour coding, and abrasion protection. Shrinks at 90°C, fully recovered by 120°C.",
    specs: [
      { label: "Expanded diameter", value: "25.4mm" },
      { label: "Recovered diameter", value: "12.7mm" },
      { label: "Shrink ratio", value: "2:1" },
      { label: "Material", value: "Crosslinked polyolefin" },
      { label: "Colour", value: "Black" },
      { label: "Shrink temp.", value: "90°C minimum" },
      { label: "Operating temp.", value: "-55°C to +135°C" },
      { label: "Length", value: "1.2m per piece" },
    ],
    tags: ["2:1 ratio", "black", "polyolefin", "UV resistant", "standard"],
    applications: ["Cable insulation", "Bundling", "Abrasion protection", "Colour coding"],
    standards: ["UL224", "RoHS"],
    available: true,
    requestQuote: false,
    featured: false,
  },
  {
    id: "hs-dw-12-3-1-adhesive-black",
    name: "Dual-Wall Adhesive-Lined Heat Shrink 12mm 3:1",
    slug: "dual-wall-heat-shrink-12mm-3-1-adhesive",
    partNumber: "HS-DW-12-3:1-BK",
    category: "Heat Shrink Tubing",
    categorySlug: "heat-shrink-tubing",
    brand: "DSG-Canusa",
    brandSlug: "dsg-canusa",
    shortDescription: "12mm expanded, 3:1 ratio, dual-wall adhesive-lined for environmental sealing.",
    description:
      "Dual-wall heat shrink with an inner layer of hot-melt adhesive. As the tube shrinks, the adhesive flows and bonds to create a waterproof, strain-relieved seal. Suitable for outdoor and subsea cable terminations, inline connectors, and end caps.",
    specs: [
      { label: "Expanded diameter", value: "12.0mm" },
      { label: "Recovered diameter", value: "4.0mm" },
      { label: "Shrink ratio", value: "3:1" },
      { label: "Inner adhesive", value: "Hot-melt polyamide" },
      { label: "Colour", value: "Black" },
      { label: "Operating temp.", value: "-45°C to +110°C" },
    ],
    tags: ["dual-wall", "adhesive-lined", "3:1 ratio", "waterproof", "sealing"],
    applications: ["Cable end sealing", "Connector boots", "Marine", "Outdoor installations"],
    standards: ["UL224 VW-1", "RoHS"],
    available: true,
    requestQuote: false,
    featured: true,
  },
  {
    id: "ferrule-1-5-blue",
    name: "Insulated Wire Ferrule 1.5mm² Blue",
    slug: "wire-ferrule-1-5mm2-blue-insulated",
    partNumber: "FER-1.5-BU",
    category: "Wire Ferrules",
    categorySlug: "wire-ferrules",
    brand: "Ulmer",
    brandSlug: "ulmer",
    shortDescription: "1.5mm² insulated end sleeve ferrule, blue, DIN 46228 part 4, box of 500.",
    description:
      "Standard insulated wire ferrule for 1.5mm² fine-stranded conductors. Blue colour coding per DIN 46228. Provides a reliable, vibration-resistant termination in screw and spring clamp terminals. Crimp with 8/10mm² jaw crimper.",
    specs: [
      { label: "Cross-section", value: "1.5mm²" },
      { label: "Colour", value: "Blue" },
      { label: "Sleeve length", value: "8mm" },
      { label: "Pin length", value: "10mm" },
      { label: "Material", value: "Electrolytic copper, tin-plated" },
      { label: "Insulation", value: "Polyamide (PA)" },
      { label: "Standard", value: "DIN 46228 Part 4" },
      { label: "Packing", value: "500 pcs/box" },
    ],
    tags: ["1.5mm²", "blue", "insulated", "DIN 46228", "500 pcs"],
    applications: ["Control cabinet wiring", "Screw terminal", "Spring clamp terminal", "PLCs"],
    standards: ["DIN 46228-4"],
    available: true,
    requestQuote: false,
    featured: false,
  },
  {
    id: "m12-4pin-a-coded-male",
    name: "M12 Connector 4-Pin A-Coded Male Straight",
    slug: "m12-4pin-a-coded-male-straight",
    partNumber: "M12-4A-MS-PG9",
    category: "Connectors",
    categorySlug: "connectors",
    brand: "TE Connectivity",
    brandSlug: "te-connectivity",
    shortDescription: "M12 4-pin A-coded male field-wireable connector, IP67, PG9 cable entry.",
    description:
      "Field-wireable M12 connector, 4-position A-coded (used for sensors, actuators, and AS-Interface). Screw terminal connection, suitable for cables 4–8mm OD. IP67 rated when mated. Zinc die-cast coupling nut for durability.",
    specs: [
      { label: "Standard", value: "M12" },
      { label: "Positions", value: "4" },
      { label: "Coding", value: "A-coded" },
      { label: "Gender", value: "Male (plug)" },
      { label: "Connection", value: "Screw terminal" },
      { label: "Cable OD", value: "4–8mm" },
      { label: "IP rating", value: "IP67" },
      { label: "Operating temp.", value: "-25°C to +90°C" },
      { label: "Coupling nut", value: "Zinc die-cast" },
    ],
    tags: ["M12", "4-pin", "A-coded", "IP67", "field-wireable", "sensor"],
    applications: ["Industrial sensors", "Actuators", "AS-Interface", "Factory automation"],
    standards: ["IEC 61076-2-101", "IP67"],
    available: true,
    requestQuote: false,
    featured: false,
  },
  {
    id: "mecal-ws-900",
    name: "Mecal WS-900 Automatic Wire Cutting & Stripping Machine",
    slug: "mecal-ws-900-wire-cutting-stripping",
    partNumber: "WS-900",
    category: "Production Equipment",
    categorySlug: "production-equipment",
    brand: "Mecal",
    brandSlug: "mecal",
    shortDescription: "Fully automatic benchtop wire cutting and stripping machine, 0.1–6.0mm², programmable.",
    description:
      "The Mecal WS-900 is a high-precision fully automatic wire cutting and stripping machine for production environments. Supports wire cross-sections from 0.1mm² to 6.0mm². Programmable cut lengths, strip lengths, and strip depths. Stores up to 999 programs. Suitable for single wires and multi-conductor cable.",
    specs: [
      { label: "Wire range", value: "0.1–6.0mm² (AWG 28–10)" },
      { label: "Cut length", value: "10–9999mm (programmable)" },
      { label: "Strip length", value: "0–40mm each end" },
      { label: "Throughput", value: "Up to 3000 cuts/hour" },
      { label: "Programs", value: "999 stored" },
      { label: "Power", value: "230V / 50Hz" },
      { label: "Weight", value: "18kg" },
    ],
    tags: ["automatic", "wire cutting", "wire stripping", "benchtop", "programmable", "CNC"],
    applications: ["Wire harness production", "Control panel wiring", "Automotive assembly", "Electronics manufacturing"],
    available: true,
    requestQuote: true,
    featured: true,
  },
  {
    id: "crimp-contact-dt-16-0462-201-16141",
    name: "DEUTSCH 0462-201-16141 Size 16 Socket Contact",
    slug: "deutsch-0462-201-16141-size-16-socket",
    partNumber: "0462-201-16141",
    category: "Contacts & Terminals",
    categorySlug: "contacts-terminals",
    brand: "Deutsch",
    brandSlug: "deutsch",
    shortDescription: "DEUTSCH size 16 socket (female) crimp contact, gold, 0.8–2.0mm², DT/DTM series.",
    description:
      "Standard DEUTSCH size 16 socket contact for use in DT and DTM series connector housings. Gold-plated over copper alloy for reliable low-resistance contact. Crimp range 0.8–2.0mm² (AWG 18–14). Must be crimped with DEUTSCH HDT-48-00 or equivalent ratchet tool.",
    specs: [
      { label: "Contact size", value: "Size 16" },
      { label: "Gender", value: "Socket (female)" },
      { label: "Crimp range", value: "0.8–2.0mm² (AWG 18–14)" },
      { label: "Plating", value: "Gold over nickel" },
      { label: "Material", value: "Copper alloy" },
      { label: "Compatible", value: "DT, DTM series housings" },
      { label: "Packing", value: "100 pcs/pkg" },
    ],
    tags: ["size 16", "socket", "gold plated", "DT series", "DTM series", "crimp contact"],
    applications: ["Deutsch DT connectors", "DTM connectors", "Automotive", "Agriculture"],
    available: true,
    requestQuote: false,
    featured: false,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return products.filter((p) => p.brandSlug === brandSlug);
}

export function searchProducts(query: string): Product[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.partNumber,
      p.brand,
      p.category,
      p.shortDescription,
      ...p.tags,
      ...p.applications,
    ]
      .join(" ")
      .toLowerCase();
    return tokens.every((t) => haystack.includes(t));
  });
}

export const featuredProducts = products.filter((p) => p.featured);
