import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, Package, ArrowUpRight } from "lucide-react";
import CatalogueProductBrowser from "@/components/catalogue/CatalogueProductBrowser";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  getCategoryBreadcrumbs,
  getCategoryChildren,
  getCategoryProductCount,
  getCategoryProducts,
  getCategoryAllProducts,
  getCatalogueCategory,
  type CatalogueCategory,
  type CatalogueSearchParams,
} from "@/lib/magentoCatalogue";
import { normalizeLegacyHtml } from "@/lib/legacyHtml";
import { categoryIntro } from "@/lib/seo";
import { brands } from "@/data/brands";
import { deutschProducts } from "@/data/deutschConnectors";
import {
  DEUTSCH_SERIES_CATEGORY_ROUTE,
  DEUTSCH_SERIES_INTRO,
  deutschSeriesByName,
  TE_CONNECTIVITY_SERIES_CATEGORY_ROUTE,
  TE_CONNECTIVITY_SERIES_INTRO,
  teConnectivitySeriesByName,
  type DeutschSeriesInfo,
} from "@/data/deutschSeries";
import {
  STOCKO_CONNECTOR_SYSTEMS_CATEGORY_ID,
  STOCKO_CONNECTOR_SYSTEMS_ROUTE,
  stockoSeriesCount,
} from "@/data/stockoConnectorSystems";
import {
  STOCKO_TERMINATING_TECHNOLOGY_CATEGORY_ID,
  STOCKO_TERMINATING_TECHNOLOGY_ROUTE,
  stockoMachinesCount,
} from "@/data/stockoTerminatingTechnology";

// Build a map of Magento product id → Deutsch CDN imageUrl for products that
// have no Magento image, so the category listing can show the correct thumbnail.
import type { CatalogueProduct } from "@/lib/magentoCatalogue";
function buildDeutschImageMap(products: CatalogueProduct[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const product of products) {
    const sku = (product.sku ?? product.name ?? "").toUpperCase();
    const deutsch = deutschProducts.find((d) => d.partNumber.toUpperCase() === sku);
    if (deutsch?.imageUrl) map[String(product.id)] = deutsch.imageUrl;
  }
  return map;
}

// A URL-style slug derived from a brand's display name, so a route segment
// like "te-connectivity" resolves to the brand whose stored slug is "deutsch"
// (TE Connectivity manufactures the DEUTSCH catalogue).
function brandNameSlug(brand: (typeof brands)[number]) {
  return brand.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// The current manufacturer behind a brand-named category (e.g. the "Deutsch"
// catalogue is now manufactured by TE Connectivity). Every page beneath a
// brand category should carry that brand's logo, so we walk the route from the
// deepest segment outward and return the closest brand ancestor — matching a
// segment against either the brand slug or its name-derived slug.
function brandForCategory(category: CatalogueCategory) {
  const segments =
    category.route
      ?.split("/")
      .filter(Boolean)
      .map((segment) => segment.replace(/\.html$/, "")) ?? [];

  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i];
    const brand = brands.find(
      (b) => b.logo && (b.slug === segment || brandNameSlug(b) === segment),
    );
    if (brand) return brand;
  }
  return undefined;
}

// AMPSEAL and AMPSEAL 16 are TE Connectivity series, not part of the DEUTSCH
// series family — excluded from the DEUTSCH facets, surfaced on the TE page.
const AMPSEAL_SERIES = /^ampseal\b/i;

// Product "Series" values (DT, DTM, HDP20 …) with counts, sorted by size.
// `exclude` drops matching series (e.g. AMPSEAL from the DEUTSCH hub).
function getSeriesFacets(category: CatalogueCategory | undefined, exclude?: RegExp) {
  if (!category) return [] as Array<{ label: string; count: number }>;
  const products = getCategoryProducts(category, undefined, {
    includeDescendantsWhenEmpty: true,
  });
  const counts = new Map<string, number>();
  for (const product of products) {
    const raw = product.attributes?.["Series"];
    if (!raw) continue;
    for (const value of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (exclude && exclude.test(value)) continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

// "Browse by series" configuration for the brand hubs whose products carry a
// "Series" attribute. Each hub defines where its series live and how to
// present them.
type SeriesPageConfig = {
  target: CatalogueCategory | undefined;
  intro: string;
  seriesByName: Map<string, DeutschSeriesInfo>;
  exclude?: RegExp;
  fallbackBlurb: string;
};

function getSeriesPageConfig(
  category: CatalogueCategory,
  children: CatalogueCategory[],
): SeriesPageConfig | undefined {
  // DEUTSCH: series live in the largest child (Connectors). AMPSEAL is excluded
  // because those are TE Connectivity series.
  if (category.route === DEUTSCH_SERIES_CATEGORY_ROUTE) {
    const target = [...children].sort(
      (a, b) => getCategoryProductCount(b) - getCategoryProductCount(a),
    )[0];
    return {
      target,
      intro: DEUTSCH_SERIES_INTRO,
      seriesByName: deutschSeriesByName,
      exclude: AMPSEAL_SERIES,
      fallbackBlurb: "DEUTSCH sealed connector series.",
    };
  }
  // TE Connectivity: products (the AMPSEAL family) live directly in this category.
  if (category.route === TE_CONNECTIVITY_SERIES_CATEGORY_ROUTE) {
    return {
      target: category,
      intro: TE_CONNECTIVITY_SERIES_INTRO,
      seriesByName: teConnectivitySeriesByName,
      fallbackBlurb: "TE Connectivity sealed connector series.",
    };
  }
  return undefined;
}

type VisualLink = {
  href: string;
  title: string;
  image: string | null;
};

type DescriptionContent = {
  html: string | null;
  visualLinks: VisualLink[];
  standaloneImages: string[];
  videoEmbedSrc: string | null;
};

function magentoMediaSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/")) return `https://www.adcontact.se${path}`;
  return path;
}

// Only match a brand when the category's own last segment is the brand slug —
// not when the brand is merely an ancestor. This prevents subcategory cards
// within a brand page (e.g. Stocko › Micro connectors) from showing the brand
// logo instead of actual product photos.
function isBrandOwnCategory(category: CatalogueCategory) {
  const route = category.route;
  if (!route) return undefined;
  const lastSegment = route
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/\.html$/, "") ?? "";
  return brands.find(
    (b) => b.logo && (b.slug === lastSegment || brandNameSlug(b) === lastSegment),
  );
}

type CategoryCardOverrides = {
  image?: string;
  countLabel?: string;
  hideChildren?: boolean;
};

function CategoryCard({
  category,
  overrides,
}: {
  category: CatalogueCategory;
  overrides?: CategoryCardOverrides;
}) {
  const children = getCategoryChildren(category).slice(0, 6);
  const productCount = getCategoryProductCount(category);

  // Use a curated partner logo only when the card is the brand category itself
  // (e.g. the "Stocko" card on Sealed Connectors). Subcategory cards within a
  // brand page always use product photos so the grid stays visually informative.
  const brand = isBrandOwnCategory(category);
  const representativeProduct = brand
    ? undefined
    : getCategoryProducts(category, undefined, {
        includeDescendantsWhenEmpty: true,
      }).find((p) => p.thumbnail || p.image);
  const cardImage =
    overrides?.image ??
    brand?.logo ??
    magentoMediaSrc(representativeProduct?.thumbnail ?? representativeProduct?.image) ??
    magentoMediaSrc(category.image);

  return (
    <article className="group grid min-w-0 overflow-hidden rounded-lg border border-[#d8dee7] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)] sm:grid-cols-[132px_1fr]">
      <Link
        href={category.route ?? "#"}
        className={`relative flex min-h-32 items-center justify-center ${brand ? "bg-white" : "bg-[#f8fafc]"}`}
      >
        {cardImage ? (
          <Image
            src={cardImage}
            alt={category.name ?? "Category"}
            fill
            unoptimized
            sizes="132px"
            className={`object-contain transition-transform group-hover:scale-105 ${brand ? "p-6" : "p-4"}`}
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#d8dee7] bg-white text-[#2563eb] shadow-sm">
            <Boxes size={27} strokeWidth={1.7} />
          </div>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={category.route ?? "#"}
              className="text-lg font-bold leading-snug text-[#0a1628] group-hover:text-[#2563eb]"
            >
              {category.name ?? "Category"}
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
              {overrides?.countLabel ?? `${productCount.toLocaleString()} catalogue items`}
            </p>
          </div>
          <Link
            href={category.route ?? "#"}
            className="hidden flex-none items-center gap-1.5 rounded-md border border-[#d8dee7] px-3 py-2 text-xs font-bold text-[#2563eb] transition-colors hover:border-[#93c5fd] hover:bg-[#eff6ff] sm:inline-flex"
          >
            Browse <ArrowRight size={13} />
          </Link>
        </div>

        {!overrides?.hideChildren && children.length > 0 && (
          <div className="mt-5 grid gap-2 border-t border-[#eef2f7] pt-4 sm:grid-cols-2">
            {children.map((child) => (
              <Link
                key={child.id}
                href={child.route ?? "#"}
                className="flex items-start justify-between gap-3 rounded-md bg-[#f8fafc] px-3 py-2 text-xs font-medium leading-snug text-[#475569] hover:bg-[#eff6ff] hover:text-[#2563eb]"
              >
                <span>{child.name ?? "Category"}</span>
                <span className="mt-0.5 flex-none text-[#94a3b8]">
                  {getCategoryProductCount(child).toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value: string) {
  return decodeEntities(
    value
      .replace(/<br\s*\/?>/gi, " / ")
      .replace(/<\/(h[1-6]|p|div)>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

function firstImageSrc(value: string) {
  const match = value.match(/<img\b[^>]*\bsrc=(["'])(.*?)\1/i);
  return match?.[2] ?? null;
}

function descriptionContent(description: string | null): DescriptionContent {
  if (!description) return { html: null, visualLinks: [], standaloneImages: [], videoEmbedSrc: null };

  const normalized = normalizeLegacyHtml(description).trim();
  if (!normalized) return { html: null, visualLinks: [], standaloneImages: [], videoEmbedSrc: null };

  // Extract the first iframe embed (e.g. YouTube) and remove it from the HTML so
  // it doesn't render in the content area — it will be shown in the header instead.
  const iframeMatch = normalized.match(/<iframe\b[^>]*\bsrc=(["'])(https?:\/\/[^"']+)\1[^>]*>(?:[\s\S]*?<\/iframe>)?/i);
  const videoEmbedSrc = iframeMatch?.[2] ?? null;
  const withoutIframe = videoEmbedSrc
    ? normalized
        .replace(iframeMatch![0], "")
        // Drop a "Video" heading that was only there to label the iframe
        .replace(/<h[1-6][^>]*>\s*(?:<[^>]+>)*\s*Video\s*(?:<\/[^>]+>)*\s*<\/h[1-6]>/gi, "")
        .trim()
    : normalized;

  const visualLinks: VisualLink[] = [];
  const linkedBlocks: string[] = [];
  const linkPattern = /<a\b[^>]*\bhref=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(withoutIframe))) {
    const [, , href, innerHtml] = match;
    const title = stripTags(innerHtml);
    const rawImage = firstImageSrc(innerHtml);
    // Magento template strings are already resolved to /media/... paths by normalizeLegacyHtml.
    // Both the original {{media url="..."}} form and the resolved /media/ paths should be
    // treated as null — we prefer brand logos from the brands.ts data over stale Magento images.
    const image =
      !rawImage || rawImage.startsWith("{{") || rawImage.startsWith("/media/")
        ? null
        : rawImage.startsWith("/")
          ? `https://www.adcontact.se${rawImage}`
          : rawImage;
    if (!href || !title) continue;
    linkedBlocks.push(match[0]);
    visualLinks.push({ href, title, image });
  }

  const htmlWithoutLinks = linkedBlocks.reduce(
    (html, block) => html.replace(block, ""),
    withoutIframe,
  );
  const standaloneImages = [...htmlWithoutLinks.matchAll(/<img\b[^>]*\bsrc=(["'])(.*?)\1/gi)]
    .map((imageMatch) => {
      const src = imageMatch[2];
      return src?.startsWith("/") ? `https://www.adcontact.se${src}` : src;
    })
    .filter(Boolean);

  const textWithoutLinksOrImages = stripTags(htmlWithoutLinks.replace(/<img\b[^>]*>/gi, ""));
  const shouldRenderHtml = visualLinks.length === 0 && standaloneImages.length === 0 && textWithoutLinksOrImages;

  return {
    html: shouldRenderHtml ? withoutIframe : null,
    visualLinks,
    standaloneImages: [...new Set(standaloneImages)],
    videoEmbedSrc,
  };
}

function CategoryVisualLinkCard({
  item,
  category,
}: {
  item: VisualLink;
  category: CatalogueCategory | undefined;
}) {
  const productCount = category ? getCategoryProductCount(category) : null;
  const childCount = category ? getCategoryChildren(category).length : 0;
  const brand = category ? isBrandOwnCategory(category) : undefined;
  const imageSrc = item.image ?? brand?.logo ?? null;

  return (
    <Link
      href={item.href}
      className="group grid min-h-[210px] overflow-hidden rounded-lg border border-[#d8dee7] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
    >
      <div className={`relative flex min-h-32 items-center justify-center border-b border-[#eef2f7] ${brand ? "bg-white" : "bg-[#f8fafc]"}`}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 280px"
            className={`object-contain transition-transform group-hover:scale-105 ${brand ? "p-6" : "p-4"}`}
          />
        ) : (
          <Boxes size={34} strokeWidth={1.6} className="text-[#2563eb]" />
        )}
      </div>
      <div className="flex min-w-0 flex-col p-4">
        <h3 className="min-h-11 text-base font-bold leading-snug text-[#0a1628] group-hover:text-[#2563eb]">
          {item.title}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#eef2f7] pt-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
            {productCount !== null
              ? `${productCount.toLocaleString()} items`
              : "Open category"}
            {childCount > 0 ? ` · ${childCount} areas` : ""}
          </span>
          <ArrowRight size={15} className="flex-none text-[#2563eb]" />
        </div>
      </div>
    </Link>
  );
}

function ImageShowcase({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="grid gap-4 md:grid-cols-2">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={index === 0 && images.length > 2 ? "md:col-span-2" : ""}
          >
            <div className="relative aspect-[3/1] overflow-hidden rounded-lg border border-[#d8dee7] bg-white">
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                unoptimized
                sizes={index === 0 ? "(max-width: 1024px) 100vw, 1280px" : "(max-width: 1024px) 100vw, 640px"}
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeriesSection({
  facets,
  targetRoute,
  intro,
  seriesByName,
  fallbackBlurb,
}: {
  facets: Array<{ label: string; count: number }>;
  targetRoute: string;
  intro: string;
  seriesByName: Map<string, DeutschSeriesInfo>;
  fallbackBlurb: string;
}) {
  return (
    <section className="mb-14">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
            Product series
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">Browse by series</h2>
        </div>
        <span className="text-sm font-medium text-[#64748b]">
          {facets.length.toLocaleString()} series
        </span>
      </div>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-[#64748b]">
        {intro}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facets.map(({ label, count }) => {
          const info = seriesByName.get(label);
          return (
            <Link
              key={label}
              href={`${targetRoute}?f_series=${encodeURIComponent(label)}`}
              className="group flex flex-col rounded-lg border border-[#d8dee7] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-[#eef2f7] pb-3">
                <h3 className="text-base font-bold leading-snug text-[#0a1628] group-hover:text-[#2563eb]">
                  {label}
                </h3>
                <span className="flex-none rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-bold text-[#475569]">
                  {count.toLocaleString()} {count === 1 ? "product" : "products"}
                </span>
              </div>

              {info?.features ? (
                <ul className="mt-3 flex-1 space-y-1.5">
                  {info.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-xs leading-snug text-[#475569]"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#93c5fd]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 flex-1 text-xs leading-snug text-[#64748b]">
                  {info?.blurb ?? fallbackBlurb}
                </p>
              )}

              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb]">
                View series
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function CatalogueCategoryPage({
  category,
  searchParams = {},
}: {
  category: CatalogueCategory;
  searchParams?: CatalogueSearchParams;
}) {
  const isWebshopRoot = category.id === 3;
  const children = getCategoryChildren(category).filter(
    (child) => !(isWebshopRoot && child.name === "Featured Products"),
  );

  // When a category has both its own productIds AND subcategories, treat it as
  // a "flat catalogue hub": show all products (direct + descendants) in the
  // product browser with attribute filters, instead of forcing an extra click
  // through subcategory cards. This matches the legacy Magento behaviour for
  // production-equipment hubs like Crimping Equipment.
  const isFlatHub = !isWebshopRoot && category.productIds.length > 0 && children.length > 0;

  // "Descendant hub": no direct products, but a browsable set of descendant products
  // worth surfacing in a product browser rather than hiding behind deep navigation.
  // Threshold ≤ 2000 catches brand hubs like Stocko (1 227) and Cvilux (888) while
  // keeping huge categories (Connectors 20k, Vogt 14k) as category-card pages.
  const descendantPool =
    !isWebshopRoot && !isFlatHub && category.productIds.length === 0 && children.length > 0
      ? getCategoryAllProducts(category)
      : [];
  const isDescendantHub = descendantPool.length > 0 && descendantPool.length <= 2000;

  // "Leaf of flat hub": a leaf sub-category (e.g. a brand page) whose parent is a
  // flat hub. The leaf's own products all share the same attribute value, so the
  // product browser shows no useful filters. Fix: use the parent's full product pool
  // so filter facets (brand, type, …) are available, and pre-apply this leaf's
  // distinguishing attribute value as the default filter.
  const parentCategory = !isWebshopRoot && !isFlatHub && !isDescendantHub && children.length === 0 && category.productIds.length > 0
    ? getCatalogueCategory(category.parentId)
    : undefined;
  const parentHubChildren = parentCategory ? getCategoryChildren(parentCategory) : [];
  const parentIsFlatHub = Boolean(
    parentCategory &&
    parentCategory.productIds.length > 0 &&
    parentHubChildren.length > 1,
  );
  const isLeafOfFlatHub = Boolean(parentIsFlatHub);

  const leafParentPool = isLeafOfFlatHub ? getCategoryAllProducts(parentCategory!) : [];

  // Find the attribute key/value that singles out this leaf's products within the
  // parent pool (e.g. "Crimping equipment Brands" = "Zoller & Fröhlich").
  const leafPreFilter: Record<string, string> = {};
  if (isLeafOfFlatHub && leafParentPool.length > 0) {
    const ownProducts = getCategoryProducts(category, undefined);
    outer: for (const [attr, value] of Object.entries(ownProducts[0]?.attributes ?? {})) {
      if (!value || value.length > 80) continue;
      if (!ownProducts.every((p) => p.attributes[attr] === value)) continue;
      const parentValues = new Set(leafParentPool.map((p) => p.attributes[attr]).filter(Boolean));
      if (parentValues.size > 1) {
        const param = `f_${attr.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`;
        leafPreFilter[param] = value;
        break outer;
      }
    }
  }

  const rawProductPool = isFlatHub
    ? getCategoryAllProducts(category)
    : isDescendantHub
      ? descendantPool
      : isLeafOfFlatHub
        ? leafParentPool
        : getCategoryProducts(category, undefined);

  const seriesPage = getSeriesPageConfig(category, children);
  const seriesFacets = seriesPage
    ? getSeriesFacets(seriesPage.target, seriesPage.exclude)
    : [];
  const showSeries = seriesFacets.length > 1 && Boolean(seriesPage?.target?.route);

  // When the series config excludes a subset (e.g. AMPSEAL from Deutsch), drop
  // those products from the pool so they don't appear in the grid or filters.
  const productPool = seriesPage?.exclude
    ? rawProductPool.filter((p) => {
        const series = p.attributes?.["Series"];
        if (!series) return true;
        return !series.split(",").map((s) => s.trim()).some((s) => seriesPage.exclude!.test(s));
      })
    : rawProductPool;

  const content = descriptionContent(category.description);
  const breadcrumbs = getCategoryBreadcrumbs(category.id);
  const title = category.name ?? "Catalogue";
  const description = category.metaDescription;
  const productCount = getCategoryProductCount(category);
  const productSectionLabel = isWebshopRoot ? "Selected products" : "Products";
  const productSectionTitle = isWebshopRoot ? "Featured product selection" : "Catalogue items";
  // Single transparent pass-through: the only child is a leaf with products and
  // no sub-categories. Clicking it would just show a flat product list anyway,
  // so skip the intermediary card and surface the products directly.
  const isSingleLeafPassthrough =
    !isWebshopRoot &&
    !isFlatHub &&
    !isDescendantHub &&
    children.length === 1 &&
    getCategoryChildren(children[0]).length === 0 &&
    getCategoryProductCount(children[0]) > 0;

  const showProductBrowser = productPool.length > 0 && (isWebshopRoot || children.length === 0 || isFlatHub || isSingleLeafPassthrough || isDescendantHub || isLeafOfFlatHub);
  // Suppress visual link cards on descendant hubs — the product browser with brand
  // filters replaces them, just like isFlatHub pages show no category cards.
  const showVisualLinks = content.visualLinks.length > 0 && !isDescendantHub;

  // When the category has exactly one child that carries no direct products but
  // itself has sub-categories, flatten one level so those sub-categories appear
  // as first-class cards instead of requiring an extra click.
  const singleEmptyChild =
    !showVisualLinks &&
    !isFlatHub &&
    !isSingleLeafPassthrough &&
    children.length === 1 &&
    getCategoryProductCount(children[0]) === 0 &&
    getCategoryChildren(children[0]).length > 0
      ? children[0]
      : undefined;
  const displayChildren = singleEmptyChild
    ? getCategoryChildren(singleEmptyChild)
    : children;
  const flattenedGroupLabel = singleEmptyChild?.name ?? null;

  const visualCategoryByHref = new Map(displayChildren.map((child) => [child.route, child]));
  // For descendant hubs filter out empty subcategories so only navigable buckets
  // appear as chips alongside the browser. Non-product categories with their own
  // dedicated pages (Connector Systems, Terminating Technology) are included too
  // so they appear in the sidebar Category filter as navigation links.
  const PARTNER_CONTENT_IDS = new Set([
    STOCKO_CONNECTOR_SYSTEMS_CATEGORY_ID,
    STOCKO_TERMINATING_TECHNOLOGY_CATEGORY_ID,
  ]);
  const browsableChildren = isDescendantHub
    ? displayChildren.filter(
        (c) => getCategoryProductCount(c) > 0 || PARTNER_CONTENT_IDS.has(c.id),
      )
    : displayChildren;
  // Non-hub pages show category cards. Descendant hubs (e.g. Stocko) use the
  // product browser directly with subcategory options injected as a "Category"
  // filter facet — Zalando-style: grid first, filters on the left.
  const showGenericCategoryCards =
    !showVisualLinks && !isFlatHub && !isDescendantHub && !isSingleLeafPassthrough &&
    displayChildren.length > 0;

  // For descendant hubs: build subcategory filter options. Product-bearing
  // categories get filter buttons; non-product partner categories get navigation
  // links (href set) so clicking takes the user to their dedicated page.
  function getAllDescendantCategoryIds(cat: CatalogueCategory): number[] {
    const ids = [cat.id];
    for (const childId of cat.children) {
      const child = getCatalogueCategory(childId);
      if (child) ids.push(...getAllDescendantCategoryIds(child));
    }
    return ids;
  }
  const subcategoryOptions = isDescendantHub
    ? browsableChildren.map((c) => {
        if (c.id === STOCKO_CONNECTOR_SYSTEMS_CATEGORY_ID) {
          return {
            id: c.id,
            name: c.name ?? "Connector Systems",
            count: stockoSeriesCount,
            countLabel: `${stockoSeriesCount} series`,
            allCategoryIds: [] as number[],
            href: c.route ?? STOCKO_CONNECTOR_SYSTEMS_ROUTE,
          };
        }
        if (c.id === STOCKO_TERMINATING_TECHNOLOGY_CATEGORY_ID) {
          return {
            id: c.id,
            name: c.name ?? "Terminating Technology",
            count: stockoMachinesCount,
            countLabel: `${stockoMachinesCount} machines`,
            allCategoryIds: [] as number[],
            href: c.route ?? STOCKO_TERMINATING_TECHNOLOGY_ROUTE,
          };
        }
        return {
          id: c.id,
          name: c.name ?? "Category",
          count: getCategoryProductCount(c),
          allCategoryIds: getAllDescendantCategoryIds(c),
        };
      })
    : [];

  const heroStatText = (() => {
    const itemsPart = `${productCount.toLocaleString()} catalogue items`;
    if (showSeries) {
      return `${seriesFacets.length} series · ${itemsPart}`;
    }
    if (showVisualLinks) {
      const label = isWebshopRoot ? "categories" : "subcategories";
      return `${content.visualLinks.length.toLocaleString()} ${label} · ${itemsPart}`;
    }
    if (isDescendantHub && subcategoryOptions.length > 0) {
      return `${subcategoryOptions.length} subcategories · ${itemsPart}`;
    }
    if (showGenericCategoryCards) {
      const label = isWebshopRoot ? "categories" : "subcategories";
      return `${displayChildren.length.toLocaleString()} ${label} · ${itemsPart}`;
    }
    return itemsPart;
  })();

  // Video embeds and standalone images are promoted to the hero right column.
  // Video takes precedence over an image when both are present.
  const { videoEmbedSrc } = content;
  const heroImageSrc = !videoEmbedSrc ? (content.standaloneImages[0] ?? null) : null;
  const remainingImages = heroImageSrc ? content.standaloneImages.slice(1) : content.standaloneImages;

  // Current manufacturer logo for brand-named categories (e.g. Deutsch → TE).
  const brand = brandForCategory(category);
  // Sourcing CTA: connector and heat-shrink brands get the bottom-of-grid block
  // (instead of the top "Go to partner shop" box). Equipment/other brands keep
  // their existing top box ("the rest").
  const showSourcingCta =
    !!brand &&
    (brand.categories.includes("connectors") || brand.categories.includes("heat-shrink"));

  // "Browse by series" — on brand hubs (DEUTSCH, TE Connectivity) whose products
  const breadcrumbCrumbs =
    category.id === 3
      ? [{ label: title }]
      : [
          { label: "Webshop", href: "/webshop.html" },
          ...breadcrumbs
            .filter((item) => item.route)
            .map((item) => ({
              label: item.name ?? "Category",
              href: item.route ?? undefined,
            })),
          { label: title },
        ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="relative overflow-hidden bg-[#0a1628] text-white">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-6">
          <Breadcrumbs
            light
            crumbs={breadcrumbCrumbs}
          />

          <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Left: title, description, stats, CTA */}
            <div className="flex-1">
              {brand?.logo && (
                <span className="mb-4 inline-flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-2 shadow-sm">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={132}
                    height={28}
                    unoptimized
                    className="h-6 w-auto object-contain"
                  />
                </span>
              )}
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#94a3b8]">
                {description ?? (
                  // Only use the brand description when the brand's product type
                  // matches the category tree (e.g. equipment brands describe
                  // themselves on equipment pages, not on connector pages).
                  brand?.linecardSection === "equipment" && !category.route?.includes("/production-equipment")
                    ? null
                    : brand?.description
                ) ?? categoryIntro(category)}
              </p>
              <p className="mt-4 text-sm font-semibold text-blue-200">
                {heroStatText}
              </p>

              {brand?.shopUrl && !showSourcingCta && (
                <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3">
                  <span className="text-sm text-[#94a3b8]">
                    Can&apos;t find what you&apos;re looking for? Browse the full range directly with {brand.name}.
                  </span>
                  <a
                    href={brand.shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#fbbf24] hover:text-[#f59e0b] transition-colors"
                  >
                    Go to partner shop
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              )}
            </div>

            {/* Right: video or image promoted from category description */}
            {(videoEmbedSrc || heroImageSrc) && (
              <div className="w-full lg:w-[420px] lg:flex-shrink-0 xl:w-[480px]">
                <div
                  className="relative w-full overflow-hidden rounded-2xl border border-[#1e3a6e] bg-[#0f2042]"
                  style={{ aspectRatio: videoEmbedSrc ? "16/9" : "4/3" }}
                >
                  {videoEmbedSrc ? (
                    <iframe
                      src={videoEmbedSrc}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <Image
                      src={heroImageSrc!}
                      alt={title}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 480px"
                      className="object-contain p-4"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-6 py-6">
        {/* The brand badge in the hero now represents brand-named categories,
            so the legacy category banner (often a stale brand logo) is hidden
            for them. */}
        {category.image && !brand && (
          <section className="mb-12">
            <div className="relative aspect-[5/2] max-h-[340px] overflow-hidden rounded-lg border border-[#d8dee7] bg-white">
              <Image
                src={category.image}
                alt={category.name ?? "Category"}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-contain p-4"
              />
            </div>
          </section>
        )}

        {/* Decorative series banner images shown only when there is no series section */}
        {remainingImages.length > 0 && !showSeries && (
          <ImageShowcase images={remainingImages} title={title} />
        )}

        {showVisualLinks && (
          <section className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
                  Categories
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">
                  Browse {title}
                </h2>
              </div>
              <span className="text-sm font-medium text-[#64748b]">
                {content.visualLinks.length.toLocaleString()} categories
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.visualLinks.map((item) => (
                <CategoryVisualLinkCard
                  key={`${item.href}-${item.title}`}
                  item={item}
                  category={visualCategoryByHref.get(item.href)}
                />
              ))}
            </div>
          </section>
        )}

        {showGenericCategoryCards && (
          <section className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
                  {flattenedGroupLabel ?? "Categories"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">
                  {flattenedGroupLabel
                    ? `Browse ${flattenedGroupLabel}`
                    : isWebshopRoot
                      ? "Browse catalogue areas"
                      : "Browse subcategories"}
                </h2>
              </div>
              <span className="text-sm font-medium text-[#64748b]">
                {browsableChildren.length.toLocaleString()} categories
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {displayChildren.map((child) => (
                <CategoryCard key={child.id} category={child} />
              ))}
            </div>
          </section>
        )}

        {content.html && (
          <section className="mb-12">
            <div
              className="prose prose-sm max-w-none rounded-lg border border-[#e5e7eb] bg-white px-6 py-5 text-[#374151]"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          </section>
        )}

        {showProductBrowser && (
          <div id="products">
            {(showSeries || isLeafOfFlatHub) && (
              <div className="mb-6 flex justify-end">
                <a
                  href={isLeafOfFlatHub && parentCategory?.route ? `${parentCategory.route}#series` : "#series"}
                  className="flex items-center gap-1.5 rounded-lg border border-[#d8dee7] bg-white px-3.5 py-2 text-sm font-semibold text-[#374151] shadow-sm transition-colors hover:border-[#93c5fd] hover:text-[#2563eb]"
                >
                  Browse by series
                  <ArrowRight size={14} />
                </a>
              </div>
            )}

            <CatalogueProductBrowser
              products={productPool}
              route={isLeafOfFlatHub ? (parentCategory?.route ?? category.route) : category.route}
              searchParams={isLeafOfFlatHub ? { ...leafPreFilter, ...searchParams } : searchParams}
              isWebshopRoot={isWebshopRoot}
              sectionLabel={productSectionLabel}
              sectionTitle={productSectionTitle}
              deutschImageMap={buildDeutschImageMap(productPool)}
              subcategoryOptions={subcategoryOptions.length > 0 ? subcategoryOptions : undefined}
            />

            {/* Sourcing CTA for connector & heat-shrink brands — sits directly
                under the product grid, not at the very bottom, since some pages
                have more sections before the footer. The manufacturer catalogue
                link only shows for brands that have a partner shop URL. */}
            {brand && showSourcingCta && (
              <section className="mt-10 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-6 py-7 sm:px-8">
                <h2 className="text-lg font-bold text-[#0a1628] sm:text-xl">
                  Can&apos;t find the exact part?
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
                  {brand.shopUrl
                    ? `We supply the complete ${brand.name} range, not only what's listed here. Find the exact reference in the ${brand.name} catalogue, then send it to us and we'll source it for you.`
                    : `We supply the complete ${brand.name} range, not only what's listed here. Tell us the part number or spec you need and we'll source it for you.`}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href={`mailto:info@adcontact.se?subject=${encodeURIComponent(`Sourcing request: ${brand.name}`)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
                  >
                    Send us the part number
                    <ArrowRight size={15} />
                  </a>
                  {brand.shopUrl && (
                    <a
                      href={brand.shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] transition-colors hover:text-[#2563eb]"
                    >
                      {`View ${brand.name} catalogue`}
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {showSeries && seriesPage?.target?.route && (
          <div id="series" className="mt-14">
            <SeriesSection
              facets={seriesFacets}
              targetRoute={seriesPage.target.route}
              intro={seriesPage.intro}
              seriesByName={seriesPage.seriesByName}
              fallbackBlurb={seriesPage.fallbackBlurb}
            />
          </div>
        )}

        {children.length === 0 && productPool.length === 0 && !content.html && content.standaloneImages.length === 0 && (
          <div className="rounded-xl border border-[#e5e7eb] bg-white px-6 py-10 text-center">
            <Package className="mx-auto text-[#cbd5e1]" size={34} />
            <h2 className="mt-4 text-lg font-bold text-[#0a1628]">No catalogue items yet</h2>
            <p className="mt-2 text-sm text-[#64748b]">
              Contact Adcontact and we will help locate the right product.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
