import categoryData from "@/data/generated/webshop-brand-categories.json";
import teProducts from "@/data/generated/te-connectivity-products.json";

export type WebshopProduct = {
  partNumber: string;
  href: string;
  image: string;
};

export type WebshopCategory = {
  title: string;
  href: string;
  image?: string | null;
  children?: Array<{
    title: string;
    href: string;
  }>;
};

export type WebshopBrand = {
  slug: string;
  name: string;
  label: string;
  description: string;
  logo: string;
  website: string;
  accent: string;
  catalogueNote: string;
  categories: WebshopCategory[];
  products: WebshopProduct[];
};

export const webshopBrands: WebshopBrand[] = [
  {
    slug: "te-connectivity",
    name: "TE Connectivity",
    label: "Sealed connector catalogue",
    description:
      "A broad range of robust connector housings and components for transportation, industrial equipment, and demanding electrical environments.",
    logo: "/images/partners/te-connectivity.svg",
    website: "https://www.te.com/",
    accent: "from-[#1175bc] to-[#07558d]",
    catalogueNote: "Browse all 338 TE Connectivity products available from Adcontact.",
    categories: [],
    products: teProducts,
  },
  {
    slug: "stocko",
    name: "Stocko",
    label: "Connector systems and terminals",
    description:
      "Connector systems, crimp contacts, housings, and solderless terminals for reliable high-volume electrical assembly.",
    logo: "/images/Stocko.png",
    website: "https://www.stocko-contact.com/",
    accent: "from-[#e4222b] to-[#a80f1a]",
    catalogueNote: "Explore Stocko connector families, contacts and terminals by category.",
    categories: categoryData.stocko,
    products: [],
  },
  {
    slug: "htp",
    name: "HTP",
    label: "Industrial circular connectors",
    description:
      "Circular connectors, valve connectors, distribution boxes, automotive interfaces, and accessories for industrial connectivity.",
    logo: "/images/htp.jpg",
    website: "https://www.htp.it/",
    accent: "from-[#236bb4] to-[#143b70]",
    catalogueNote: "Choose an HTP connector family to explore the full range.",
    categories: categoryData.htp,
    products: [],
  },
  {
    slug: "cvilux",
    name: "Cvilux",
    label: "Board, cable, and I/O connectivity",
    description:
      "Board-to-board, wire-to-board, FFC/FPC, I/O, power, and application tooling for electronic assemblies.",
    logo: "/images/Cvilux.png",
    website: "https://www.cvilux.com/",
    accent: "from-[#2475b8] to-[#164b78]",
    catalogueNote: "Browse the complete Cvilux connectivity range by category.",
    categories: categoryData.cvilux,
    products: [],
  },
];

export function getWebshopBrand(slug: string) {
  return webshopBrands.find((brand) => brand.slug === slug);
}
