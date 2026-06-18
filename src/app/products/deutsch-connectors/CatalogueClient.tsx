"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, X, ArrowRight, ChevronDown } from "lucide-react";
import { deutschProducts, type DeutschProduct } from "@/data/deutschConnectors";
import { deutschProductDetails } from "@/data/deutschProductDetails";
import { filterAttributes, attrsForPart } from "@/data/deutschAttributes";
import { productDetailHref } from "@/lib/productHref";

const RICH_SLUGS = new Set(deutschProductDetails.map((p) => p.slug));

// Attribute groups long enough to warrant a scroll area in the filter panel.
const SCROLL_GROUPS = new Set(["No. of cavities", "Color"]);

const SERIES_COLORS: Record<string, string> = {
  DT: "bg-blue-50 text-blue-700 border-blue-200",
  DT13: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DT15: "bg-violet-50 text-violet-700 border-violet-200",
  DTF13: "bg-purple-50 text-purple-700 border-purple-200",
  DTF15: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  DTM: "bg-sky-50 text-sky-700 border-sky-200",
  DTP: "bg-amber-50 text-amber-700 border-amber-200",
  HDP: "bg-orange-50 text-orange-700 border-orange-200",
  JS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SRK: "bg-teal-50 text-teal-700 border-teal-200",
  AT: "bg-green-50 text-green-700 border-green-200",
  OTHER: "bg-slate-50 text-slate-700 border-slate-200",
};

function ProductCard({ product }: { product: DeutschProduct }) {
  const seriesColor = SERIES_COLORS[product.series] ?? SERIES_COLORS.OTHER;
  const isRich = RICH_SLUGS.has(product.partNumber.toLowerCase());
  const detailHref = productDetailHref(product.partNumber);
  const attrs = attrsForPart(product.partNumber);
  const seriesLabel = attrs["Series"] ?? product.series;
  const cavities = attrs["No. of cavities"];
  const style = attrs["Connector Style"];

  return (
    <Link href={detailHref} className="group bg-white border border-[#e5e7eb] rounded-xl overflow-hidden hover:border-[#2563eb] hover:shadow-[0_4px_16px_rgba(37,99,235,0.12)] transition-all duration-200 flex flex-col">
      {/* Product image */}
      <div className="relative h-40 bg-[#f8fafc] overflow-hidden flex-shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.partNumber}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#d1d5db] text-xs font-mono">No image</span>
          </div>
        )}
        {/* Availability dot */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              product.availability === "quote"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                product.availability === "quote" ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {product.availability === "quote" ? "Stock" : "Lead time"}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] bg-[#2563eb] text-white px-2 py-0.5 rounded font-semibold">
            {isRich ? "Full specs →" : "View →"}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <div className="font-mono font-bold text-[#0a1628] text-sm leading-tight mb-2 group-hover:text-[#2563eb] transition-colors">
            {product.partNumber}
          </div>
          <div className="flex flex-wrap gap-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${seriesColor}`}>
              {seriesLabel}
            </span>
            {cavities && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
                {cavities}-way
              </span>
            )}
            {style && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-blue-50 text-blue-600 border-blue-200">
                {style}
              </span>
            )}
          </div>
        </div>

        <span className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 bg-[#f1f5f9] group-hover:bg-[#2563eb] text-[#374151] group-hover:text-white text-xs font-semibold rounded-lg transition-colors">
          {isRich ? "View details" : "Request quote"}
          <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

function CheckFilter({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group py-1">
      <div className="flex items-center gap-2">
        <div
          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            checked ? "bg-[#2563eb] border-[#2563eb]" : "border-[#d1d5db] group-hover:border-[#2563eb]"
          }`}
          onClick={() => onChange(!checked)}
        >
          {checked && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-sm text-[#374151] group-hover:text-[#0a1628]">{label}</span>
      </div>
      <span className="text-xs text-[#9ca3af] font-mono flex-shrink-0">{count}</span>
    </label>
  );
}

export default function CatalogueClient() {
  const [search, setSearch] = useState("");
  // selected[attributeName] = Set of chosen option labels
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  // Collapsible filter groups — only the first (Series) is open by default so
  // every filter heading is visible at a glance.
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set([filterAttributes[0]?.name].filter(Boolean) as string[])
  );
  const [showFilters, setShowFilters] = useState(false);
  const PAGE_SIZE = 48;
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Activate the Series filter when arriving from the series overview
  // (e.g. /products/deutsch-connectors?series=DT%20Series#catalogue).
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get("series");
  useEffect(() => {
    if (seriesParam) {
      setSelected({ Series: new Set([seriesParam]) });
      setOpenGroups((prev) => new Set(prev).add("Series"));
      setVisible(PAGE_SIZE);
    }
  }, [seriesParam]);

  const filtered = useMemo(() => {
    const active = Object.entries(selected).filter(([, set]) => set.size > 0);
    const q = search.trim().toLowerCase();
    return deutschProducts.filter((p) => {
      if (q && !p.partNumber.toLowerCase().includes(q)) return false;
      if (active.length) {
        const attrs = attrsForPart(p.partNumber);
        for (const [name, set] of active) {
          const v = attrs[name];
          if (!v || !set.has(v)) return false;
        }
      }
      return true;
    });
  }, [search, selected]);

  // Reset the visible window whenever the result set changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, selected]);

  const selectedCount = useMemo(
    () => Object.values(selected).reduce((n, set) => n + set.size, 0),
    [selected]
  );
  const hasFilters = selectedCount > 0 || search.length > 0;

  function clearAll() {
    setSearch("");
    setSelected({});
  }

  function toggleOption(attr: string, label: string) {
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[attr] ?? []);
      if (set.has(label)) set.delete(label);
      else set.add(label);
      next[attr] = set;
      return next;
    });
  }

  function toggleGroup(name: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const allOpen = openGroups.size === filterAttributes.length;
  function toggleAllGroups() {
    setOpenGroups(allOpen ? new Set() : new Set(filterAttributes.map((g) => g.name)));
  }

  const renderFilterPanel = () => (
    <div>
      <div className="mb-2 flex justify-end">
        <button
          onClick={toggleAllGroups}
          className="text-[11px] font-medium text-[#64748b] hover:text-[#2563eb] transition-colors"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <div className="divide-y divide-[#f1f5f9] border-y border-[#f1f5f9]">
        {filterAttributes.map((group) => {
          const open = openGroups.has(group.name);
          const activeInGroup = selected[group.name]?.size ?? 0;
          return (
            <div key={group.name}>
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex w-full items-center justify-between gap-2 py-3 text-left"
                aria-expanded={open}
              >
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#374151]">
                  {group.name}
                  {activeInGroup > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[9px] font-bold text-white">
                      {activeInGroup}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={15}
                  className={`flex-shrink-0 text-[#9ca3af] transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div
                  className={`pb-3 space-y-0.5 ${
                    SCROLL_GROUPS.has(group.name) ? "max-h-56 overflow-y-auto pr-1 -mr-1" : ""
                  }`}
                >
                  {group.options.map((opt) => (
                    <CheckFilter
                      key={opt.label}
                      label={opt.label}
                      count={opt.count}
                      checked={selected[group.name]?.has(opt.label) ?? false}
                      onChange={() => toggleOption(group.name, opt.label)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section id="catalogue" className="scroll-mt-28">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#2563eb] mb-2">Product catalogue</div>
        <h2 className="text-3xl font-bold text-[#0a1628] mb-3">
          {deutschProducts.length} Deutsch connector products
        </h2>
        <p className="text-[#64748b] max-w-2xl">
          Filter by series, cavity count, and type to find your part. Use the request quote link to send an enquiry directly to our Bromma office.
        </p>
      </div>

      {/* Search + mobile filter toggle */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search part number…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#0a1628] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151] hover:border-[#2563eb]"
        >
          <Filter size={15} />
          Filters
          {selectedCount > 0 && (
            <span className="w-5 h-5 bg-[#2563eb] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {selectedCount}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#0a1628] border border-[#e5e7eb] rounded-lg hover:border-[#d1d5db] bg-white transition-colors"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Mobile filter panel */}
      {showFilters && (
        <div className="lg:hidden bg-white border border-[#e5e7eb] rounded-xl p-5 mb-6">
          {renderFilterPanel()}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#64748b]">
          <span className="font-semibold text-[#0a1628]">{filtered.length}</span> products
          {hasFilters && " (filtered)"}
        </p>
        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(selected).flatMap(([attr, set]) =>
              Array.from(set).map((label) => (
                <span
                  key={`${attr}:${label}`}
                  onClick={() => toggleOption(attr, label)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-[#eff6ff] text-[#2563eb] text-xs font-medium rounded-full cursor-pointer hover:bg-[#dbeafe]"
                >
                  {label} <X size={10} />
                </span>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters, desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 sticky top-[168px]">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-[#0a1628]">Filter</span>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-xs text-[#2563eb] hover:text-[#1d4ed8] font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
            {renderFilterPanel()}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center">
              <p className="text-[#64748b] text-sm mb-3">No products match the current filters.</p>
              <button
                onClick={clearAll}
                className="text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.slice(0, visible).map((product) => (
                  <ProductCard key={product.partNumber} product={product} />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-8 flex flex-col items-center gap-3">
                  <p className="text-xs text-[#64748b]">
                    Showing {Math.min(visible, filtered.length)} of {filtered.length}
                  </p>
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#e5e7eb] hover:border-[#2563eb] hover:text-[#2563eb] text-sm font-semibold text-[#374151] rounded-lg transition-colors"
                  >
                    Load more products
                    <ChevronDown size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
