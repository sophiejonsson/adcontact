import categoriesJson from "@/data/generated/magento-catalogue/categories.json";
import productsJson from "@/data/generated/magento-catalogue/products.json";
import routesJson from "@/data/generated/magento-catalogue/routes.json";

export type CatalogueRoute = {
  type: "product" | "category";
  id: number;
};

export type CatalogueFile = {
  id: number;
  name: string | null;
  filename: string | null;
  path: string | null;
  link: string | null;
  legacyDownloadPath: string;
};

export type CatalogueProduct = {
  id: number;
  sku: string | null;
  type: string;
  name: string;
  urlPath: string | null;
  route: string | null;
  brand: string | null;
  manufacturer: string | null;
  manufacturerId: number | null;
  status: "enabled" | "disabled";
  visibility: number;
  image: string | null;
  smallImage: string | null;
  thumbnail: string | null;
  gallery: string[];
  description: string | null;
  shortDescription: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  price: number | null;
  specialPrice: number | null;
  categoryIds: number[];
  files: CatalogueFile[];
  attributes: Record<string, string>;
  routes: string[];
};

export type CatalogueCategory = {
  id: number;
  parentId: number;
  path: string;
  position: number;
  level: number;
  name: string | null;
  urlPath: string | null;
  route: string | null;
  image: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  includeInMenu: boolean;
  productIds: number[];
  children: number[];
};

export type CatalogueSearchParams = Record<string, string | string[] | undefined>;

export type CatalogueFilterFacet = {
  label: string;
  param: string;
  values: Array<{
    value: string;
    count: number;
    active: boolean;
  }>;
};

const routes = routesJson as unknown as Record<string, CatalogueRoute>;
const products = productsJson as unknown as Record<string, CatalogueProduct>;
const categories = categoriesJson as unknown as Record<string, CatalogueCategory>;
const LEGACY_ROUTE_ALIASES: Record<string, string> = {
  "/webshop/components/contact-pieces-for-pcb.html":
    "/webshop/components/sealed-connectors/vogt/contact-pieces-for-pcb-soldering-tags.html",
};
const HIDDEN_FILTER_ATTRIBUTES = new Set([
  "Apply MAP",
  "Availability",
  "Display Actual Price",
  "Enable Recurring Profile",
  "Finishing Ni",
  "Purchase currency",
]);

export function normalizeCataloguePath(path: string): string {
  const withoutOrigin = path.replace(/^https?:\/\/[^/]+/i, "");
  const cleanPath = withoutOrigin.split("?")[0].split("#")[0] || "/";
  return `/${cleanPath.replace(/^\/+/, "").replace(/\/+/g, "/")}`;
}

export function webshopPathFromSegments(segments: string[]): string {
  return normalizeCataloguePath(`/webshop/${segments.join("/")}`);
}

export function resolveCatalogueRoute(path: string): CatalogueRoute | undefined {
  const normalizedPath = normalizeCataloguePath(path);
  return (
    routes[normalizedPath] ??
    routes[LEGACY_ROUTE_ALIASES[normalizedPath]] ??
    routes[legacyNumberedCategoryAlias(normalizedPath)]
  );
}

function legacyNumberedCategoryAlias(path: string) {
  return path
    .replace("/for-hole-1-3mm-3.html", "/for-hole-1-3mm-4209.html")
    .replace("/for-hole-1-3mm-4.html", "/for-hole-1-3mm-4210.html")
    .replace("/insulating-spacers-227/", "/insulating-spacers-4209/")
    .replace("/insulating-spacers-227.html", "/insulating-spacers-4209.html")
    .replace("/insulating-spacers-228.html", "/insulating-spacers-4210.html")
    .replace("/clamping-straps-116.html", "/clamping-straps-2105.html");
}

export function getCatalogueProduct(id: number | string): CatalogueProduct | undefined {
  return products[String(id)];
}

export function getAllCatalogueProducts(): CatalogueProduct[] {
  return Object.values(products);
}

export function catalogueProductLegacyRoute(product: CatalogueProduct): string {
  return product.routes.find((route) => route.startsWith("/webshop/")) ?? product.route ?? product.routes[0] ?? "#";
}

function normalizeReference(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function findCatalogueProductByReference(reference: string): CatalogueProduct | undefined {
  const needle = normalizeReference(reference);
  if (!needle) return undefined;

  return getAllCatalogueProducts().find((product) => {
    const candidates = [
      product.sku,
      product.name,
      product.attributes["Part Number"],
    ].filter(Boolean);
    return candidates.some((candidate) => normalizeReference(candidate ?? "") === needle);
  });
}

export function getCatalogueCategory(id: number | string): CatalogueCategory | undefined {
  return categories[String(id)];
}

export function getWebshopRootCategory(): CatalogueCategory | undefined {
  return getCatalogueCategory(3);
}

export function getCategoryChildren(category: CatalogueCategory): CatalogueCategory[] {
  return category.children
    .map((id) => getCatalogueCategory(id))
    .filter((child): child is CatalogueCategory => Boolean(child))
    .sort((a, b) => a.position - b.position || a.name?.localeCompare(b.name ?? "") || 0);
}

export function getCategoryProductCount(category: CatalogueCategory): number {
  const productIds = new Set(category.productIds);
  const stack = [...category.children];
  const seen = new Set<number>();

  while (stack.length > 0) {
    const id = stack.pop();
    if (!id || seen.has(id)) continue;
    seen.add(id);

    const child = getCatalogueCategory(id);
    if (!child) continue;

    for (const productId of child.productIds) productIds.add(productId);
    stack.push(...child.children);
  }

  return productIds.size;
}

function getCategoryDescendantProductIds(category: CatalogueCategory): number[] {
  const productIds = new Set<number>();
  const stack = [...category.children];
  const seen = new Set<number>();

  while (stack.length > 0) {
    const id = stack.pop();
    if (!id || seen.has(id)) continue;
    seen.add(id);

    const child = getCatalogueCategory(id);
    if (!child) continue;

    for (const productId of child.productIds) productIds.add(productId);
    stack.push(...child.children);
  }

  return [...productIds];
}

export function getCategoryProducts(
  category: CatalogueCategory,
  limit?: number,
  options: { includeDescendantsWhenEmpty?: boolean } = {},
): CatalogueProduct[] {
  const out: CatalogueProduct[] = [];
  const productIds =
    category.productIds.length > 0 || options.includeDescendantsWhenEmpty === false
      ? category.productIds
      : getCategoryDescendantProductIds(category);

  for (const id of productIds) {
    const product = getCatalogueProduct(id);
    if (!product || product.status !== "enabled") continue;
    out.push(product);
    if (limit && out.length >= limit) break;
  }
  return out;
}

// Returns all enabled products from the category itself AND all descendants,
// deduplicated. Use this for parent categories that carry both their own
// productIds and subcategories (e.g. production-equipment hubs).
export function getCategoryAllProducts(
  category: CatalogueCategory,
  limit?: number,
): CatalogueProduct[] {
  const seen = new Set<number>();
  const out: CatalogueProduct[] = [];

  for (const id of [...category.productIds, ...getCategoryDescendantProductIds(category)]) {
    if (seen.has(id)) continue;
    seen.add(id);
    const product = getCatalogueProduct(id);
    if (!product || product.status !== "enabled") continue;
    out.push(product);
    if (limit && out.length >= limit) break;
  }
  return out;
}

function firstParamValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function filterParamFor(label: string): string {
  return `f_${label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")}`;
}

function productMatchesText(product: CatalogueProduct, query: string): boolean {
  const q = query.toLowerCase();
  return [
    product.name,
    product.sku,
    product.brand,
    product.manufacturer,
    product.shortDescription,
  ].some((value) => value?.toLowerCase().includes(q));
}

export function filterCatalogueProducts(
  productsToFilter: CatalogueProduct[],
  searchParams: CatalogueSearchParams = {},
): CatalogueProduct[] {
  const query = firstParamValue(searchParams.q)?.trim();
  const activeFilters = Object.entries(searchParams)
    .filter(([key]) => key.startsWith("f_"))
    .map(([param, rawValue]) => [param, firstParamValue(rawValue)] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));

  return productsToFilter.filter((product) => {
    if (query && !productMatchesText(product, query)) return false;

    for (const [param, value] of activeFilters) {
      const match = Object.entries(product.attributes).some(
        ([label, attributeValue]) =>
          filterParamFor(label) === param && attributeValue === value,
      );
      if (!match) return false;
    }

    return true;
  });
}

export function getCategoryFilterFacets(
  productsForFacets: CatalogueProduct[],
  searchParams: CatalogueSearchParams = {},
  limit = 6,
): CatalogueFilterFacet[] {
  const byAttribute = new Map<string, Map<string, number>>();

  for (const product of productsForFacets) {
    for (const [label, value] of Object.entries(product.attributes)) {
      if (!value || HIDDEN_FILTER_ATTRIBUTES.has(label)) continue;
      if (value.length > 80) continue;
      if (!byAttribute.has(label)) byAttribute.set(label, new Map());
      const values = byAttribute.get(label);
      values?.set(value, (values.get(value) ?? 0) + 1);
    }
  }

  return [...byAttribute.entries()]
    .map(([label, values]) => ({
      label,
      param: filterParamFor(label),
      values: [...values.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 8)
        .map(([value, count]) => ({
          value,
          count,
          active: firstParamValue(searchParams[filterParamFor(label)]) === value,
        })),
      totalValues: values.size,
      totalProducts: [...values.values()].reduce((sum, count) => sum + count, 0),
    }))
    .filter((facet) => facet.values.length > 1 && facet.totalValues <= 30)
    .sort((a, b) => b.totalProducts - a.totalProducts || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map(({ totalValues: _totalValues, totalProducts: _totalProducts, ...facet }) => facet);
}

export function getProductPrimaryCategory(
  product: CatalogueProduct,
): CatalogueCategory | undefined {
  for (const id of [...product.categoryIds].reverse()) {
    const category = getCatalogueCategory(id);
    if (category?.route) return category;
  }
  return product.categoryIds.map(getCatalogueCategory).find(Boolean);
}

export function getCategoryBreadcrumbs(categoryId: number): CatalogueCategory[] {
  const crumbs: CatalogueCategory[] = [];
  const seen = new Set<number>();
  let current = getCatalogueCategory(categoryId);

  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    if (current.route && current.name && current.id !== categoryId && current.id > 3) {
      crumbs.unshift(current);
    }
    if (current.parentId <= 2) break;
    current = getCatalogueCategory(current.parentId);
  }

  return crumbs;
}

export function getProductBreadcrumbs(product: CatalogueProduct): CatalogueCategory[] {
  const category = getProductPrimaryCategory(product);
  return category ? [...getCategoryBreadcrumbs(category.id), category] : [];
}

// Attributes that are internal Magento bookkeeping or shown elsewhere on the page.
const HIDDEN_PRODUCT_ATTRIBUTES = new Set([
  // Internal Magento flags
  "Accessory",
  "Apply MAP",
  "Display Actual Price",
  "Enable Recurring Profile",
  "Finishing Ni",
  "Purchase currency",
  "Availability",
  // Image metadata (internal)
  "Image Label",
  "Small Image Label",
  "Thumbnail Label",
  // Redundant with the page title
  "Part Number",
  // Redundant with the brand/manufacturer header
  "Brand",
  // Relationship buckets — rendered in their own sections below the spec table
  "Accessory Type",
  "Accessories",
  "Mating Connectors",
  "Pin Connectors",
  "Socket Connectors",
  "Stamped/Formed Contacts",
  "Solid Contacts",
  "Tab Connectors",
  "Required Components",
  "Required Wedgelock",
  "Receptacle Contact Housing/Pin Contact Housing/PCB Header",
]);

export function getProductAttributeEntries(
  product: CatalogueProduct,
  limit?: number,
): Array<[string, string]> {
  const entries = Object.entries(product.attributes).filter(
    ([key, value]) => value && value !== "y" && value !== "n" && !HIDDEN_PRODUCT_ATTRIBUTES.has(key),
  );
  return typeof limit === "number" ? entries.slice(0, limit) : entries;
}

// The human-facing part number shown on product pages.
// The "Part Number" attribute holds the manufacturer/catalogue designation
// (e.g. "HDP26-24-47SE-L017"). The raw `sku` field is an internal
// Adcontact/Magento catalog number not shown on the original site.
export function productDisplaySku(product: CatalogueProduct): string {
  const partAttr = product.attributes?.["Part Number"];
  if (partAttr && partAttr !== product.name) return partAttr;
  return product.name ?? product.sku ?? `Product ${product.id}`;
}

export function getRelatedCatalogueProducts(
  product: CatalogueProduct,
  limit = 8,
): CatalogueProduct[] {
  const out: CatalogueProduct[] = [];
  const category = getProductPrimaryCategory(product);
  if (!category) return out;

  for (const id of category.productIds) {
    if (out.length >= limit) break;
    if (id === product.id) continue;
    const related = getCatalogueProduct(id);
    if (related?.status === "enabled") out.push(related);
  }

  return out;
}

export function titleForProduct(product: CatalogueProduct): string {
  return product.name ?? productDisplaySku(product);
}
