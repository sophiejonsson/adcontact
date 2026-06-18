import { stockoNodes, stockoWebshopUrl } from "@/data/stockoCatalogue";
import type {
  CatalogueAttribute,
  CatalogueProduct,
  OverviewCard,
} from "@/components/brand/BrandCatalogue";

// Flatten the Stocko category tree into a single filterable product list.
// Filters are derived from the catalogue structure (Family, Sub-category) plus
// the material encoded in each part number (CuSn / CuZn / Fe / …).

function parseMaterial(pn: string): string | null {
  const m = pn.match(/-([A-Za-z]{2,8})$/);
  return m ? m[1] : null;
}

const FAMILY_TAGLINES: Record<string, string> = {
  "Crimp Contacts": "Receptacles, tabs, sockets, splices and open-barrel terminals.",
  Housing: "Standard and multi-way self-locking housings, 2.8–6.3 mm.",
  "Solderless Terminals": "Insulated and non-insulated terminals, splices and ferrules.",
  "Stocko Connectors, Connector Systems": "Connector systems across pitches from 2.5 to 11.4 mm.",
};

type Built = {
  products: CatalogueProduct[];
  productAttributes: Record<string, Record<string, string>>;
  filterAttributes: CatalogueAttribute[];
  overviewCards: OverviewCard[];
};

const built: Built = (() => {
  const products: CatalogueProduct[] = [];
  const productAttributes: Record<string, Record<string, string>> = {};

  const familyCounts = new Map<string, number>();
  const subcatCounts = new Map<string, number>();
  const materialCounts = new Map<string, number>();
  const familyImage = new Map<string, string | null>();
  const seen = new Set<string>();

  for (const node of Object.values(stockoNodes)) {
    if (!node.products.length) continue;
    const segs = node.path.split("/");
    const familyKey = segs[0];
    const familyTitle = stockoNodes[familyKey]?.title ?? familyKey;
    const subKey = segs.slice(0, 2).join("/");
    const subTitle = segs.length > 1 ? stockoNodes[subKey]?.title ?? subKey : familyTitle;

    for (const prod of node.products) {
      if (seen.has(prod.partNumber)) continue;
      seen.add(prod.partNumber);

      const attrs: Record<string, string> = { Family: familyTitle, "Sub-category": subTitle };
      const material = parseMaterial(prod.partNumber);
      if (material) attrs["Material"] = material;
      productAttributes[prod.partNumber] = attrs;

      products.push({
        partNumber: prod.partNumber,
        href: stockoWebshopUrl(prod.path),
        image: prod.image,
      });

      familyCounts.set(familyTitle, (familyCounts.get(familyTitle) ?? 0) + 1);
      subcatCounts.set(subTitle, (subcatCounts.get(subTitle) ?? 0) + 1);
      if (material) materialCounts.set(material, (materialCounts.get(material) ?? 0) + 1);
      if (!familyImage.get(familyTitle) && prod.image) familyImage.set(familyTitle, prod.image);
    }
  }

  const toOptions = (m: Map<string, number>) =>
    Array.from(m.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

  const filterAttributes: CatalogueAttribute[] = [
    { name: "Family", options: toOptions(familyCounts) },
    { name: "Sub-category", options: toOptions(subcatCounts) },
    { name: "Material", options: toOptions(materialCounts) },
  ];

  const overviewCards: OverviewCard[] = toOptions(familyCounts).map((o) => ({
    label: o.label,
    count: o.count,
    image: familyImage.get(o.label) ?? null,
    tagline: FAMILY_TAGLINES[o.label],
  }));

  return { products, productAttributes, filterAttributes, overviewCards };
})();

export const stockoFlatProducts = built.products;
export const stockoFlatAttributes = built.productAttributes;
export const stockoFlatFilters = built.filterAttributes;
export const stockoFlatOverview = built.overviewCards;
