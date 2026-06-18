import { stripLegacyHtml } from "@/lib/legacyHtml";
import {
  getCategoryBreadcrumbs,
  getCategoryChildren,
  getCategoryProductCount,
  productDisplaySku,
  type CatalogueCategory,
  type CatalogueProduct,
} from "@/lib/magentoCatalogue";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.adcontact.se").replace(
  /\/+$/,
  "",
);

export const IS_OFFICIAL_SITE =
  new URL(SITE_URL).hostname.replace(/^www\./, "") === "adcontact.se";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Adcontact's positioning, reused as a consistent closing value proposition.
const TAGLINE =
  "Specialist Nordic distributor of industrial components and wire-processing equipment.";

/** Collapse HTML/whitespace into clean plain text for meta tags and titles. */
function clean(value: string): string {
  return stripLegacyHtml(value).replace(/\s+/g, " ").trim();
}

/** Trim to a meta-description-friendly length on a word boundary (~160 chars). */
function truncate(value: string, max = 158): string {
  const text = clean(value);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).replace(/[\s.,;:–—-]+$/, "")}…`;
}

/** Strip a trailing brand suffix so the layout template doesn't duplicate it. */
function stripBrandSuffix(title: string): string {
  return title.replace(/\s*[-|–·—]\s*adcontact\.?\s*$/i, "").trim();
}

/** The immediate parent category name, when it adds useful context. */
function parentContext(category: CatalogueCategory): string {
  const ancestors = getCategoryBreadcrumbs(category.id);
  const parent = ancestors[ancestors.length - 1]?.name?.trim();
  if (!parent || parent === category.name) return "";
  return parent;
}

/* ── Categories ─────────────────────────────────────────────────────── */

export function categoryTitle(category: CatalogueCategory): string {
  const base = category.metaTitle
    ? stripBrandSuffix(clean(category.metaTitle))
    : category.name?.trim() || "Catalogue";
  return base;
}

export function categoryMetaDescription(category: CatalogueCategory): string {
  if (category.metaDescription?.trim()) {
    return truncate(category.metaDescription);
  }

  const name = category.name?.trim() || "Products";
  const productCount = getCategoryProductCount(category);
  const childCount = getCategoryChildren(category).length;
  const parent = parentContext(category);
  const context = parent ? ` ${parent.toLowerCase()}` : "";

  if (productCount > 0) {
    const noun = productCount === 1 ? "product" : "products";
    return truncate(
      `${name}${context ? ` —${context}` : ""} at Adcontact. Browse ${productCount.toLocaleString()} ${noun} and request a quote with expert technical support and fast Nordic delivery.`,
    );
  }

  if (childCount > 0) {
    const noun = childCount === 1 ? "category" : "categories";
    return truncate(
      `Explore ${name} at Adcontact across ${childCount} ${noun}. ${TAGLINE} Request a quote with expert technical support.`,
    );
  }

  return truncate(`${name} at Adcontact. ${TAGLINE} Request a quote today.`);
}

/** Fuller, on-page introduction paragraph (user-facing, not length-capped). */
export function categoryIntro(category: CatalogueCategory): string {
  if (category.metaDescription?.trim()) return clean(category.metaDescription);

  const name = category.name?.trim() || "this range";
  const productCount = getCategoryProductCount(category);
  const childCount = getCategoryChildren(category).length;
  const parent = parentContext(category);
  const parentClause = parent ? ` within our ${parent.toLowerCase()} range` : "";

  if (productCount > 0) {
    const noun = productCount === 1 ? "product" : "products";
    return `Browse ${productCount.toLocaleString()} ${name} ${noun}${parentClause} at Adcontact. Request a quote and get technical support choosing the right parts for your application, with reliable supply across the Nordic region.`;
  }

  if (childCount > 0) {
    return `Explore our ${name} range at Adcontact${parentClause}, organised across ${childCount} categories of industrial components and wire-processing equipment. Request a quote and get expert help specifying the right products.`;
  }

  return `Discover ${name} at Adcontact. As a specialist Nordic distributor, we supply industrial components and wire-processing equipment with technical support and quotes tailored to your application.`;
}

/* ── Products ───────────────────────────────────────────────────────── */

export function productTitle(product: CatalogueProduct): string {
  if (product.metaTitle?.trim()) return stripBrandSuffix(clean(product.metaTitle));

  const brand = (product.brand ?? product.manufacturer ?? "").trim();
  const name = (product.name ?? productDisplaySku(product)).trim();
  return brand && !name.toLowerCase().includes(brand.toLowerCase())
    ? `${brand} ${name}`
    : name;
}

export function productMetaDescription(product: CatalogueProduct): string {
  if (product.metaDescription?.trim()) return truncate(product.metaDescription);

  const brand = (product.brand ?? product.manufacturer ?? "").trim();
  const name = (product.name ?? "").trim();
  const part = productDisplaySku(product);
  const short = product.shortDescription ? clean(product.shortDescription) : "";

  const subject = [brand && !name.toLowerCase().includes(brand.toLowerCase()) ? brand : "", name]
    .filter(Boolean)
    .join(" ");
  const partClause = part && part !== name ? ` (${part})` : "";
  const detailText = short && short !== name ? short.replace(/[\s.]+$/, "") : "";
  const detail = detailText ? ` ${detailText}.` : "";

  return truncate(
    `${subject || part}${partClause}.${detail} Request a quote from Adcontact — specialist Nordic supplier with technical support and reliable delivery.`,
  );
}
