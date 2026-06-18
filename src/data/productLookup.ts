import { deutschProducts } from "@/data/deutschConnectors";
import { attrsForPart } from "@/data/deutschAttributes";
import { teCatalogueProducts, teProductAttributes } from "@/data/teCatalogue";
import { htpProducts, htpProductAttributes } from "@/data/htpCatalogue";
import { cviluxProducts, cviluxProductAttributes } from "@/data/cviluxCatalogue";
import { stockoFlatProducts, stockoFlatAttributes } from "@/data/stockoCatalogueFlat";
import { productDetailHref } from "@/lib/productHref";

export { productDetailHref };

export type UnifiedProduct = {
  sku: string;
  brand: string;
  brandHref: string;
  image: string | null;
  specs: Record<string, string>;
};

const BRAND_HREF: Record<string, string> = {
  Deutsch: "/products/deutsch-connectors",
  "TE Connectivity": "/products/te-connectivity",
  HTP: "/products/htp",
  Cvilux: "/products/cvilux",
  Stocko: "/products/stocko",
};

type RawProduct = { partNumber: string; image?: string | null; imageUrl?: string | null };

const registry: Map<string, UnifiedProduct> = (() => {
  const map = new Map<string, UnifiedProduct>();

  function addAll(
    products: RawProduct[],
    brand: string,
    getImage: (p: RawProduct) => string | null | undefined,
    getAttrs: (p: RawProduct) => Record<string, string> | undefined,
  ) {
    for (const p of products) {
      const sku = p.partNumber;
      if (!sku) continue;
      const key = sku.toLowerCase();
      if (map.has(key)) continue;

      const raw = { Brand: brand, ...(getAttrs(p) ?? {}) };
      const specs: Record<string, string> = {};
      for (const [k, v] of Object.entries(raw)) {
        if (v != null && String(v).trim()) specs[k] = String(v).trim();
      }

      map.set(key, {
        sku,
        brand,
        brandHref: BRAND_HREF[brand] ?? "/webshop.html",
        image: getImage(p) ?? null,
        specs,
      });
    }
  }

  addAll(
    deutschProducts as unknown as RawProduct[],
    "Deutsch",
    (p) => (p as { imageUrl?: string | null }).imageUrl,
    (p) => attrsForPart(p.partNumber),
  );
  addAll(teCatalogueProducts, "TE Connectivity", (p) => p.image, (p) => teProductAttributes[p.partNumber]);
  addAll(htpProducts, "HTP", (p) => p.image, (p) => htpProductAttributes[p.partNumber]);
  addAll(cviluxProducts, "Cvilux", (p) => p.image, (p) => cviluxProductAttributes[p.partNumber]);
  addAll(stockoFlatProducts, "Stocko", (p) => p.image, (p) => stockoFlatAttributes[p.partNumber]);

  return map;
})();

export function getUnifiedProduct(skuParam: string): UnifiedProduct | undefined {
  if (!skuParam) return undefined;
  const decoded = decodeURIComponent(skuParam);
  return registry.get(decoded.toLowerCase());
}

/** A few same-brand products for the "related" strip. */
export function getRelatedProducts(product: UnifiedProduct, limit = 6): UnifiedProduct[] {
  const out: UnifiedProduct[] = [];
  for (const p of registry.values()) {
    if (out.length >= limit) break;
    if (p.brand === product.brand && p.sku !== product.sku && p.image) out.push(p);
  }
  return out;
}
