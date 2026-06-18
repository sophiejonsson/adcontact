import teProducts from "@/data/generated/te-connectivity-products.json";
import teAttrs from "@/data/generated/te-attributes.json";
import type {
  CatalogueAttribute,
  CatalogueProduct,
  OverviewCard,
} from "@/components/brand/BrandCatalogue";

type AttrFile = {
  attributes: CatalogueAttribute[];
  products: Record<string, Record<string, string>>;
};

const attrs = teAttrs as AttrFile;

// Drop attributes that aren't useful as filters (single-value groups).
const DROP = new Set(["Shape"]);

export const teCatalogueProducts = teProducts as CatalogueProduct[];
export const teProductAttributes = attrs.products;
export const teFilterAttributes: CatalogueAttribute[] = attrs.attributes.filter(
  (a) => !DROP.has(a.name) && a.options.length > 1
);

const TE_TAGLINES: Record<string, string> = {
  "AMPSEAL Series": "Rugged sealed connectors for transportation and industrial power and signal.",
  "AMPSEAL 16 Series": "Compact sealed connectors for higher-density signal circuits.",
};

const seriesAttr = attrs.attributes.find((a) => a.name === "Series");

export const teOverviewCards: OverviewCard[] = (seriesAttr?.options ?? [])
  .map((o) => {
    let image: string | null = null;
    for (const p of teProducts) {
      if (attrs.products[p.partNumber]?.["Series"] === o.label) {
        image = p.image;
        break;
      }
    }
    return { label: o.label, count: o.count, image, tagline: TE_TAGLINES[o.label] };
  })
  .sort((a, b) => b.count - a.count);
