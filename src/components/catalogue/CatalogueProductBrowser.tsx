"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Package } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  CatalogueProduct,
  CatalogueSearchParams,
} from "@/lib/magentoCatalogue";
import { brands } from "@/data/brands";

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [25, 50, 100];
const HIDDEN_FILTER_ATTRIBUTES = new Set([
  "Apply MAP",
  "Availability",
  "Display Actual Price",
  "Enable Recurring Profile",
  "Finishing Ni",
  "Purchase currency",
]);

function firstParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInt(value: string | string[] | undefined, fallback: number) {
  const parsed = Number.parseInt(firstParamValue(value) ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function productDisplaySku(product: CatalogueProduct) {
  return product.sku ?? product.name ?? `Product ${product.id}`;
}

function filterParamFor(label: string) {
  return `f_${label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")}`;
}

function searchableText(product: CatalogueProduct) {
  return [
    product.name,
    product.sku,
    product.brand,
    product.manufacturer,
    product.shortDescription,
    product.route,
    ...product.routes,
    ...Object.keys(product.attributes),
    ...Object.values(product.attributes),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function normalizedSearchText(product: CatalogueProduct) {
  return searchableText(product).replace(/[^a-z0-9]+/g, "");
}

function normalizedQuery(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function productSearchScore(product: CatalogueProduct, query: string) {
  const q = query.toLowerCase().trim();
  const nq = normalizedQuery(query);
  if (!q && !nq) return 0;

  const name = product.name.toLowerCase();
  const sku = (product.sku ?? "").toLowerCase();
  const partNumber = (product.attributes["Part Number"] ?? "").toLowerCase();
  const routeText = [product.route, ...product.routes].join(" ").toLowerCase();
  const haystack = searchableText(product);
  const normalizedHaystack = normalizedSearchText(product);
  let score = 0;

  for (const value of [sku, name, partNumber]) {
    const normalizedValue = normalizedQuery(value);
    if (value === q || normalizedValue === nq) score += 1000;
    else if (value.startsWith(q) || normalizedValue.startsWith(nq)) score += 650;
    else if (value.includes(q) || normalizedValue.includes(nq)) score += 420;
  }

  if (routeText.includes(q) || (nq && normalizedQuery(routeText).includes(nq))) score += 260;
  if (haystack.includes(q) || (nq && normalizedHaystack.includes(nq))) score += 80;

  return score;
}

function activeFiltersFromSearchParams(searchParams: CatalogueSearchParams) {
  const filters: Record<string, string> = {};
  for (const [key, rawValue] of Object.entries(searchParams)) {
    const value = firstParamValue(rawValue);
    if (key.startsWith("f_") && value) filters[key] = value;
  }
  return filters;
}

// Attribute values can be comma-separated lists (e.g. Series: "DT Series, DTM
// Series"), so treat each value as a set of tokens for both faceting and matching.
function attributeTokens(value: string): string[] {
  return value
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function productMatchesFilter(
  product: CatalogueProduct,
  param: string,
  value: string,
) {
  return Object.entries(product.attributes).some(([label, attributeValue]) => {
    if (filterParamFor(label) !== param || !attributeValue) return false;
    return attributeValue === value || attributeTokens(attributeValue).includes(value);
  });
}

function productMatchesFilters(
  product: CatalogueProduct,
  activeFilters: Record<string, string>,
  exceptParam?: string,
) {
  return Object.entries(activeFilters).every(
    ([param, value]) => param === exceptParam || productMatchesFilter(product, param, value),
  );
}

// Narrowing faceted search: each facet's counts reflect the products that match
// the search plus every OTHER active filter, so options never lead to a dead
// end and the active value always stays visible and selectable.
function buildFacets(products: CatalogueProduct[], activeFilters: Record<string, string>) {
  // Universe of candidate attributes (distinct token counts gate which qualify).
  const universe = new Map<string, Map<string, number>>();
  for (const product of products) {
    for (const [label, value] of Object.entries(product.attributes)) {
      if (!value || HIDDEN_FILTER_ATTRIBUTES.has(label) || value.length > 80) continue;
      if (!universe.has(label)) universe.set(label, new Map());
      const counts = universe.get(label)!;
      for (const token of attributeTokens(value)) {
        counts.set(token, (counts.get(token) ?? 0) + 1);
      }
    }
  }

  return [...universe.entries()]
    .filter(([, tokens]) => tokens.size > 1 && tokens.size <= 35)
    .map(([label, baseTokens]) => {
      const param = filterParamFor(label);
      const activeValue = activeFilters[param];

      // Count this dimension over products matching all OTHER active filters.
      const narrowed = products.filter((product) =>
        productMatchesFilters(product, activeFilters, param),
      );
      const counts = new Map<string, number>();
      for (const product of narrowed) {
        const value = product.attributes[label];
        if (!value) continue;
        for (const token of attributeTokens(value)) {
          counts.set(token, (counts.get(token) ?? 0) + 1);
        }
      }

      let values = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 10)
        .map(([value, count]) => ({ value, count, active: value === activeValue }));

      // Always surface the active value even if it falls outside the top 10.
      if (activeValue && !values.some((item) => item.value === activeValue)) {
        values = [
          { value: activeValue, count: counts.get(activeValue) ?? 0, active: true },
          ...values,
        ].slice(0, 10);
      }

      const totalProducts = [...baseTokens.values()].reduce((sum, n) => sum + n, 0);
      return { label, param, values, totalProducts };
    })
    .filter((facet) => facet.values.length > 1 || Boolean(activeFilters[facet.param]))
    .sort((a, b) => b.totalProducts - a.totalProducts || a.label.localeCompare(b.label))
    .slice(0, 7);
}

function magentoImageSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  // Serve via our /media proxy (handles uppercase/lowercase dir variants and
  // fetches from ORDERLAND_MEDIA_ORIGIN) rather than hardcoding adcontact.se,
  // which 404s on uppercase subdirectories like /D/T/.
  if (path.startsWith("/")) return path;
  return path;
}

function productHref(product: CatalogueProduct, categoryRoute: string | null) {
  if (categoryRoute) {
    const basePath = categoryRoute.replace(/\.html$/, "/");
    const categoryProductRoute = product.routes.find((route) => route.startsWith(basePath));
    if (categoryProductRoute) return categoryProductRoute;
  }

  return product.route ?? product.routes[0] ?? "#";
}

function brandLogoForProduct(product: CatalogueProduct): string | undefined {
  const name = (product.brand ?? product.manufacturer ?? "").toLowerCase();
  return brands.find((b) => b.logo && b.name.toLowerCase() === name)?.logo ?? undefined;
}

function ProductCard({
  product,
  categoryRoute,
  deutschImageMap,
  compact = false,
}: {
  product: CatalogueProduct;
  categoryRoute: string | null;
  deutschImageMap?: Record<string, string>;
  compact?: boolean;
}) {
  const realImageUrl =
    magentoImageSrc(product.thumbnail ?? product.image) ??
    deutschImageMap?.[String(product.id)] ??
    null;
  const hasRealImage = Boolean(realImageUrl);
  const imageUrl = realImageUrl ?? brandLogoForProduct(product) ?? null;

  if (compact) {
    return (
      <Link
        href={productHref(product, categoryRoute)}
        className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#e5e7eb] bg-white transition-all duration-200 hover:border-[#93c5fd] hover:shadow-[0_6px_20px_-8px_rgba(15,23,42,0.18)]"
      >
        <div className="relative aspect-square bg-[#f8fafc]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
              className={`object-contain transition-transform duration-300 group-hover:scale-[1.05] ${hasRealImage ? "p-3" : "p-6 opacity-30"}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package size={22} className="text-[#d1d5db]" />
            </div>
          )}
        </div>
        <div className="border-t border-[#f1f5f9] px-2.5 py-2">
          <h3 className="line-clamp-2 text-[11px] font-bold leading-snug text-[#0a1628] group-hover:text-[#2563eb]">
            {product.name}
          </h3>
          <p className="mt-0.5 font-mono text-[9px] font-semibold text-[#94a3b8]">
            {productDisplaySku(product)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={productHref(product, categoryRoute)}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition-all duration-200 hover:border-[#93c5fd] hover:shadow-[0_8px_28px_-10px_rgba(15,23,42,0.18)]"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#f8fafc]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            className={`object-contain transition-transform duration-300 group-hover:scale-[1.04] ${hasRealImage ? "p-4" : "p-8 opacity-25"}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={28} className="text-[#d1d5db]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-3 pt-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#0a1628] group-hover:text-[#2563eb]">
          {product.name}
        </h3>
        <p className="mt-1 font-mono text-[10px] font-semibold text-[#94a3b8]">
          {productDisplaySku(product)}
        </p>
        <p className="mt-2 text-[11px] leading-snug text-[#64748b]">High availability · lead time on request</p>
      </div>

      {/* Quote CTA */}
      <div className="mx-3 mb-3 mt-3 flex items-center justify-between rounded-lg bg-[#f1f5f9] px-3 py-2 transition-colors group-hover:bg-[#eff6ff]">
        <span className="text-xs font-semibold text-[#374151] group-hover:text-[#2563eb]">
          Get quote
        </span>
        <ArrowRight
          size={12}
          className="text-[#94a3b8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#2563eb]"
        />
      </div>
    </Link>
  );
}

export default function CatalogueProductBrowser({
  products,
  route,
  searchParams,
  isWebshopRoot,
  sectionLabel,
  sectionTitle,
  deutschImageMap,
}: {
  products: CatalogueProduct[];
  route: string | null;
  searchParams: CatalogueSearchParams;
  isWebshopRoot: boolean;
  sectionLabel: string;
  sectionTitle: string;
  deutschImageMap?: Record<string, string>;
}) {
  const initialPageSize = positiveInt(searchParams.per_page, DEFAULT_PAGE_SIZE);
  const [query, setQuery] = useState(firstParamValue(searchParams.q) ?? "");
  const [activeFilters, setActiveFilters] = useState(() => activeFiltersFromSearchParams(searchParams));
  const [pageSize, setPageSize] = useState(
    PAGE_SIZE_OPTIONS.includes(initialPageSize) ? initialPageSize : DEFAULT_PAGE_SIZE,
  );
  const [page, setPage] = useState(positiveInt(searchParams.page ?? searchParams.p, 1));

  const queryText = query.toLowerCase().trim();
  const queryTokens = queryText.split(/\s+/).filter(Boolean);
  const normalizedTokens = queryTokens.map(normalizedQuery).filter(Boolean);
  const searchedProducts = useMemo(() => {
    if (queryTokens.length === 0) return products;
    return products
      .filter((product) => {
      const haystack = searchableText(product);
        const normalizedHaystack = normalizedSearchText(product);
        return queryTokens.every((token, index) => {
          const normalizedToken = normalizedTokens[index];
          return (
            haystack.includes(token) ||
            Boolean(normalizedToken && normalizedHaystack.includes(normalizedToken))
          );
        });
      })
      .sort(
        (a, b) =>
          productSearchScore(b, queryText) - productSearchScore(a, queryText) ||
          a.name.localeCompare(b.name),
      );
  }, [products, queryText, queryTokens, normalizedTokens]);

  const facets = useMemo(
    () => buildFacets(searchedProducts, activeFilters),
    [searchedProducts, activeFilters],
  );

  const filteredProducts = useMemo(
    () => searchedProducts.filter((product) => productMatchesFilters(product, activeFilters)),
    [searchedProducts, activeFilters],
  );

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  const pageProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  const visibleStart = filteredProducts.length > 0 ? startIndex + 1 : 0;
  const visibleEnd = startIndex + pageProducts.length;
  const showFilters = !isWebshopRoot && facets.length > 0;

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function toggleFilter(param: string, value: string) {
    setActiveFilters((current) => {
      const next = { ...current };
      if (next[param] === value) delete next[param];
      else next[param] = value;
      return next;
    });
    setPage(1);
  }

  function clearAll() {
    setQuery("");
    setActiveFilters({});
    setPage(1);
  }

  return (
    <section className={showFilters ? "grid gap-8 lg:grid-cols-[280px_1fr]" : ""}>
      {showFilters && (
        <aside className="space-y-5">
          <div className="rounded-lg border border-[#e5e7eb] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#0a1628]">
                Filter
              </h2>
              {(query || Object.keys(activeFilters).length > 0) && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8]"
                >
                  Clear
                </button>
              )}
            </div>

            {facets.length > 0 && (
              <div className="mt-5 space-y-5">
                {facets.map((facet) => (
                  <div key={facet.param}>
                    <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#64748b]">
                      {facet.label}
                    </h3>
                    <div className="mt-2 space-y-1.5">
                      {facet.values.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => toggleFilter(facet.param, item.value)}
                          className={`flex w-full items-start justify-between gap-3 rounded-md px-2 py-1.5 text-left text-xs leading-snug ${
                            item.active
                              ? "bg-[#eaf2ff] font-bold text-[#1d4ed8]"
                              : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#2563eb]"
                          }`}
                        >
                          <span>{item.value}</span>
                          <span className="flex-none text-[#94a3b8]">{item.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      <div>
        <div className={`mb-5 rounded-lg border border-[#d8dee7] bg-white p-4${isWebshopRoot ? " hidden" : ""}`}>
          <label className="sr-only" htmlFor="instant-catalogue-search">
            Search within this catalogue page
          </label>
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]"
            />
            <input
              id="instant-catalogue-search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Instant search: part number, series, material, colour, brand..."
              className="h-12 w-full rounded-md border border-[#d8dee7] bg-[#f8fafc] pl-11 pr-11 text-sm text-[#0a1628] outline-none placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => updateQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#64748b] hover:bg-[#eef2f7] hover:text-[#0a1628]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {(query || Object.keys(activeFilters).length > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {query && (
                <span className="rounded-md bg-[#eff6ff] px-2 py-1 text-xs font-bold text-[#1d4ed8]">
                  Search: {query}
                </span>
              )}
              {Object.entries(activeFilters).map(([param, value]) => (
                <button
                  key={param}
                  type="button"
                  onClick={() => toggleFilter(param, value)}
                  className="rounded-md bg-[#f1f5f9] px-2 py-1 text-xs font-bold text-[#475569] hover:bg-[#e2e8f0]"
                >
                  {value} x
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
              {sectionLabel}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">{sectionTitle}</h2>
          </div>
          <span className="text-sm font-medium text-[#64748b]">
            Items {visibleStart.toLocaleString()} to {visibleEnd.toLocaleString()} of{" "}
            {filteredProducts.length.toLocaleString()} total
          </span>
        </div>

        {pageProducts.length > 0 ? (
          <div className={isWebshopRoot
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          }>
            {pageProducts.map((product) => (
              <ProductCard key={product.id} product={product} categoryRoute={route} deutschImageMap={deutschImageMap} compact={isWebshopRoot} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#e5e7eb] bg-white px-6 py-12 text-center">
            <h3 className="text-base font-bold text-[#0a1628]">No matching catalogue items</h3>
            <p className="mt-2 text-sm text-[#64748b]">
              Try a shorter part number, product family, material, colour, or brand.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-[#e5e7eb] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#64748b]">
              Show
            </span>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setPageSize(size);
                  setPage(1);
                }}
                className={`rounded-md border px-3 py-1.5 text-xs font-bold ${
                  size === pageSize
                    ? "border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8]"
                    : "border-[#d8dee7] bg-white text-[#475569] hover:border-[#93c5fd] hover:text-[#2563eb]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-[#d8dee7] bg-white px-3 py-1.5 text-xs font-bold text-[#475569] hover:border-[#93c5fd] hover:text-[#2563eb] disabled:pointer-events-none disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-[#64748b]">
                Page {currentPage.toLocaleString()} of {pageCount.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage === pageCount}
                className="rounded-md border border-[#d8dee7] bg-white px-3 py-1.5 text-xs font-bold text-[#475569] hover:border-[#93c5fd] hover:text-[#2563eb] disabled:pointer-events-none disabled:border-[#e5e7eb] disabled:text-[#cbd5e1]"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
