import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, Package, Search } from "lucide-react";
import CatalogueProductBrowser from "@/components/catalogue/CatalogueProductBrowser";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  getCategoryBreadcrumbs,
  getCategoryChildren,
  getCategoryProductCount,
  getCategoryProducts,
  type CatalogueCategory,
  type CatalogueSearchParams,
} from "@/lib/magentoCatalogue";
import { normalizeLegacyHtml } from "@/lib/legacyHtml";
import { categoryIntro } from "@/lib/seo";
import { brands } from "@/data/brands";
import {
  DEUTSCH_SERIES_CATEGORY_ROUTE,
  DEUTSCH_SERIES_INTRO,
  deutschSeriesByName,
  TE_CONNECTIVITY_SERIES_CATEGORY_ROUTE,
  TE_CONNECTIVITY_SERIES_INTRO,
  teConnectivitySeriesByName,
  type DeutschSeriesInfo,
} from "@/data/deutschSeries";

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
};

function CategoryCard({ category }: { category: CatalogueCategory }) {
  const children = getCategoryChildren(category).slice(0, 6);
  const productCount = getCategoryProductCount(category);

  return (
    <article className="group grid min-w-0 overflow-hidden rounded-lg border border-[#d8dee7] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)] sm:grid-cols-[132px_1fr]">
      <Link
        href={category.route ?? "#"}
        className="relative flex min-h-32 items-center justify-center bg-[#eef4fb]"
      >
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name ?? "Category"}
            fill
            unoptimized
            sizes="132px"
            className="object-contain p-5 transition-transform group-hover:scale-105"
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
              {productCount.toLocaleString()} catalogue items
            </p>
          </div>
          <Link
            href={category.route ?? "#"}
            className="hidden flex-none items-center gap-1.5 rounded-md border border-[#d8dee7] px-3 py-2 text-xs font-bold text-[#2563eb] transition-colors hover:border-[#93c5fd] hover:bg-[#eff6ff] sm:inline-flex"
          >
            Browse <ArrowRight size={13} />
          </Link>
        </div>

        {children.length > 0 && (
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
  if (!description) return { html: null, visualLinks: [], standaloneImages: [] };

  const normalized = normalizeLegacyHtml(description).trim();
  if (!normalized) return { html: null, visualLinks: [], standaloneImages: [] };

  const visualLinks: VisualLink[] = [];
  const linkedBlocks: string[] = [];
  const linkPattern = /<a\b[^>]*\bhref=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(normalized))) {
    const [, , href, innerHtml] = match;
    const title = stripTags(innerHtml);
    const image = firstImageSrc(innerHtml);
    if (!href || !title) continue;
    linkedBlocks.push(match[0]);
    visualLinks.push({ href, title, image });
  }

  const htmlWithoutLinks = linkedBlocks.reduce(
    (html, block) => html.replace(block, ""),
    normalized,
  );
  const standaloneImages = [...htmlWithoutLinks.matchAll(/<img\b[^>]*\bsrc=(["'])(.*?)\1/gi)]
    .map((imageMatch) => imageMatch[2])
    .filter(Boolean);

  const textWithoutLinksOrImages = stripTags(htmlWithoutLinks.replace(/<img\b[^>]*>/gi, ""));
  const shouldRenderHtml = visualLinks.length === 0 && standaloneImages.length === 0 && textWithoutLinksOrImages;

  return {
    html: shouldRenderHtml ? normalized : null,
    visualLinks,
    standaloneImages: [...new Set(standaloneImages)],
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

  return (
    <Link
      href={item.href}
      className="group grid min-h-[210px] overflow-hidden rounded-lg border border-[#d8dee7] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
    >
      <div className="relative flex min-h-32 items-center justify-center border-b border-[#eef2f7] bg-[#f8fafc]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 280px"
            className="object-contain p-6 transition-transform group-hover:scale-105"
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
  const productPool = getCategoryProducts(category, undefined);
  const content = descriptionContent(category.description);
  const breadcrumbs = getCategoryBreadcrumbs(category.id);
  const title = category.name ?? "Catalogue";
  const description = category.metaDescription;
  const productCount = getCategoryProductCount(category);
  const productSectionLabel = isWebshopRoot ? "Selected products" : "Products";
  const productSectionTitle = isWebshopRoot ? "Featured product selection" : "Catalogue items";
  const showProductBrowser = productPool.length > 0 && (isWebshopRoot || children.length === 0);
  const visualCategoryByHref = new Map(children.map((child) => [child.route, child]));
  const showVisualLinks = content.visualLinks.length > 0;
  const showGenericCategoryCards = children.length > 0 && !showVisualLinks;

  // Current manufacturer logo for brand-named categories (e.g. Deutsch → TE).
  const brand = brandForCategory(category);

  // "Browse by series" — on brand hubs (DEUTSCH, TE Connectivity) whose products
  // carry a "Series" attribute. Series are derived from products and link to the
  // catalogue view that lists them.
  const seriesPage = getSeriesPageConfig(category, children);
  const seriesFacets = seriesPage
    ? getSeriesFacets(seriesPage.target, seriesPage.exclude)
    : [];
  const showSeries = seriesFacets.length > 1 && Boolean(seriesPage?.target?.route);
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

          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
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
                {description ?? categoryIntro(category)}
              </p>
              <p className="mt-4 text-sm font-semibold text-blue-200">
                {children.length.toLocaleString()} categories · {productCount.toLocaleString()} catalogue items
              </p>
            </div>

            <form action={category.route ?? "/webshop.html"} method="GET" role="search" className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              />
              <input
                name="q"
                aria-label="Search catalogue"
                placeholder="Search part number..."
                className="h-12 w-full rounded-xl border border-white/15 bg-white/10 pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#94a3b8] focus:border-[#60a5fa] focus:bg-white/15"
              />
            </form>
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

        {showSeries && seriesPage?.target?.route && (
          <SeriesSection
            facets={seriesFacets}
            targetRoute={seriesPage.target.route}
            intro={seriesPage.intro}
            seriesByName={seriesPage.seriesByName}
            fallbackBlurb={seriesPage.fallbackBlurb}
          />
        )}

        {/* Decorative series banner images are replaced by the clickable
            "Browse by series" section above when series data exists. */}
        {content.standaloneImages.length > 0 && !showSeries && (
          <ImageShowcase images={content.standaloneImages} title={title} />
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
                  Categories
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">
                  {isWebshopRoot ? "Browse catalogue areas" : "Browse subcategories"}
                </h2>
              </div>
              <span className="text-sm font-medium text-[#64748b]">
                {children.length.toLocaleString()} categories
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {children.map((child) => (
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
          <CatalogueProductBrowser
            products={productPool}
            route={category.route}
            searchParams={searchParams}
            isWebshopRoot={isWebshopRoot}
            sectionLabel={productSectionLabel}
            sectionTitle={productSectionTitle}
          />
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
