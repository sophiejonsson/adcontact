import type {
  CatalogueAttribute,
  CatalogueProduct,
  OverviewCard,
} from "@/components/brand/BrandCatalogue";

// Shared helper that flattens a crawled category tree (Stocko-style JSON) into a
// single filterable product list with Family / Sub-category filters and
// family overview cards. Used by the HTP and Cvilux landing pages.

type CrawlNode = {
  path: string;
  title: string;
  parent: string | null;
  children: string[];
  products: { partNumber: string; path: string; image: string | null }[];
};
type CrawlFile = { nodes: Record<string, CrawlNode> };

export type FlatCatalogue = {
  products: CatalogueProduct[];
  productAttributes: Record<string, Record<string, string>>;
  filterAttributes: CatalogueAttribute[];
  overviewCards: OverviewCard[];
};

/** Part numbers are stored as "CODE - description"; keep the code for display. */
function code(partNumber: string): string {
  return partNumber.split(/\s+[-–]\s+/)[0].trim();
}

export function buildFlatCatalogue(
  data: CrawlFile,
  opts: { webshopPrefix: string; taglines?: Record<string, string> }
): FlatCatalogue {
  const nodes = data.nodes;
  const products: CatalogueProduct[] = [];
  const productAttributes: Record<string, Record<string, string>> = {};
  const seen = new Set<string>();

  const familyCounts = new Map<string, number>();
  const subcatCounts = new Map<string, number>();
  const familyImage = new Map<string, string | null>();

  for (const node of Object.values(nodes)) {
    if (!node.products.length) continue;
    const segs = node.path.split("/");
    const familyTitle = nodes[segs[0]]?.title ?? segs[0];
    const subKey = segs.slice(0, 2).join("/");
    const subTitle = segs.length > 1 ? nodes[subKey]?.title ?? segs[1] : familyTitle;

    for (const pr of node.products) {
      const pn = code(pr.partNumber);
      if (seen.has(pn)) continue;
      seen.add(pn);

      productAttributes[pn] = { Family: familyTitle, "Sub-category": subTitle };
      products.push({
        partNumber: pn,
        href: `${opts.webshopPrefix}/${pr.path}.html`,
        image: pr.image,
      });

      familyCounts.set(familyTitle, (familyCounts.get(familyTitle) ?? 0) + 1);
      subcatCounts.set(subTitle, (subcatCounts.get(subTitle) ?? 0) + 1);
      if (!familyImage.get(familyTitle) && pr.image) familyImage.set(familyTitle, pr.image);
    }
  }

  const toOptions = (m: Map<string, number>) =>
    Array.from(m.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

  const filterAttributes: CatalogueAttribute[] = [
    { name: "Family", options: toOptions(familyCounts) },
    { name: "Sub-category", options: toOptions(subcatCounts) },
  ];

  const overviewCards: OverviewCard[] = toOptions(familyCounts).map((o) => ({
    label: o.label,
    count: o.count,
    image: familyImage.get(o.label) ?? null,
    tagline: opts.taglines?.[o.label],
  }));

  return { products, productAttributes, filterAttributes, overviewCards };
}
