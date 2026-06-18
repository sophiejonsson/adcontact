"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, X, ChevronDown, Filter, ArrowRight, Package, Layers } from "lucide-react";
import { productDetailHref } from "@/lib/productHref";

export type CatalogueProduct = {
  partNumber: string;
  href: string;
  image: string | null;
};

export type CatalogueAttribute = {
  name: string;
  options: { label: string; count: number }[];
};

export type OverviewCard = {
  label: string;
  count: number;
  image: string | null;
  tagline?: string;
};

type Props = {
  products: CatalogueProduct[];
  /** partNumber -> { attributeName: optionLabel } */
  productAttributes: Record<string, Record<string, string>>;
  filterAttributes: CatalogueAttribute[];
  /** Cards shown above the catalogue; clicking one applies the matching filter. */
  overviewCards?: OverviewCard[];
  /** Which attribute the overview cards filter on when clicked. */
  overviewAttr?: string;
  overviewEyebrow?: string;
  overviewTitle?: string;
  overviewIntro?: string;
  /** Long filter groups that get a scroll area. */
  scrollGroups?: string[];
  productNoun?: string;
};

function CheckFilter({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group py-1">
      <div className="flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            checked ? "bg-[#2563eb] border-[#2563eb]" : "border-[#d1d5db] group-hover:border-[#2563eb]"
          }`}
        >
          {checked && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-sm text-[#374151] group-hover:text-[#0a1628]">{label}</span>
      </div>
      <span className="text-xs text-[#9ca3af] font-mono flex-shrink-0">{count}</span>
    </label>
  );
}

const PAGE_SIZE = 48;

export default function BrandCatalogue({
  products,
  productAttributes,
  filterAttributes,
  overviewCards,
  overviewAttr,
  overviewEyebrow = "Browse by category",
  overviewTitle = "Browse the catalogue",
  overviewIntro,
  scrollGroups = ["No. of cavities", "Color"],
  productNoun = "products",
}: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set([filterAttributes[0]?.name].filter(Boolean) as string[])
  );
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const scrollSet = useMemo(() => new Set(scrollGroups), [scrollGroups]);

  const filtered = useMemo(() => {
    const active = Object.entries(selected).filter(([, set]) => set.size > 0);
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.partNumber.toLowerCase().includes(q)) return false;
      if (active.length) {
        const attrs = productAttributes[p.partNumber] ?? {};
        for (const [name, set] of active) {
          const v = attrs[name];
          if (!v || !set.has(v)) return false;
        }
      }
      return true;
    });
  }, [products, productAttributes, search, selected]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, selected]);

  const selectedCount = useMemo(
    () => Object.values(selected).reduce((n, s) => n + s.size, 0),
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

  function selectOverview(label: string) {
    if (!overviewAttr) return;
    setSelected({ [overviewAttr]: new Set([label]) });
    setOpenGroups((prev) => new Set(prev).add(overviewAttr));
    setVisible(PAGE_SIZE);
    document.getElementById("catalogue-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
                    scrollSet.has(group.name) ? "max-h-56 overflow-y-auto pr-1 -mr-1" : ""
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
    <div>
      {/* ── Overview cards ───────────────────────────────────────────────── */}
      {overviewCards && overviewCards.length > 0 && (
        <section id="overview" className="mb-16 scroll-mt-28">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#2563eb] mb-2">
              {overviewEyebrow}
            </div>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-3">{overviewTitle}</h2>
            {overviewIntro && <p className="text-[#64748b] max-w-2xl">{overviewIntro}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {overviewCards.map((c) => (
              <button
                key={c.label}
                onClick={() => selectOverview(c.label)}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#bfdbfe] hover:shadow-[0_16px_30px_-16px_rgba(15,23,42,0.2)]"
              >
                <div className="relative aspect-[4/3] w-full bg-white">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.label}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f8fafc]">
                      <Package size={28} className="text-[#cbd5e1]" />
                    </div>
                  )}
                  <span className="absolute right-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[#475569] shadow-sm ring-1 ring-[#e5e7eb] backdrop-blur-sm">
                    {c.count} {c.count === 1 ? productNoun.replace(/s$/, "") : productNoun}
                  </span>
                </div>
                <div className="flex flex-1 flex-col border-t border-[#f1f5f9] p-5">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">
                    <Layers size={12} className="text-[#2563eb]" />
                    {overviewEyebrow.replace(/^Browse by /i, "")}
                  </div>
                  <h3 className="text-base font-bold text-[#0a1628] transition-colors group-hover:text-[#2563eb]">
                    {c.label}
                  </h3>
                  {c.tagline && (
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-[#64748b]">{c.tagline}</p>
                  )}
                  <div className="mt-4 flex items-center gap-1.5 border-t border-[#f1f5f9] pt-3 text-xs font-semibold text-[#2563eb]">
                    View {c.count} {c.count === 1 ? productNoun.replace(/s$/, "") : productNoun}
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Catalogue ────────────────────────────────────────────────────── */}
      <section id="catalogue-grid" className="scroll-mt-28">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2563eb] mb-2">
            Catalogue
          </div>
          <h2 className="text-3xl font-bold text-[#0a1628] mb-3">
            {products.length} {productNoun}
          </h2>
          <p className="text-[#64748b] max-w-2xl">
            Filter by the same attributes as the original webshop to find your part, then send a
            quote request directly to our Bromma office.
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

        {showFilters && (
          <div className="lg:hidden bg-white border border-[#e5e7eb] rounded-xl p-5 mb-6">
            {renderFilterPanel()}
          </div>
        )}

        {/* Results count + active chips */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <p className="text-sm text-[#64748b]">
            <span className="font-semibold text-[#0a1628]">{filtered.length}</span> {productNoun}
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
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 sticky top-[168px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[#0a1628]">Filter</span>
                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-[#2563eb] hover:text-[#1d4ed8] font-medium">
                    Clear all
                  </button>
                )}
              </div>
              {renderFilterPanel()}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center">
                <p className="text-[#64748b] text-sm mb-3">No {productNoun} match the current filters.</p>
                <button onClick={clearAll} className="text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8]">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.slice(0, visible).map((product) => {
                    const attrs = productAttributes[product.partNumber] ?? {};
                    const chips = filterAttributes
                      .map((g) => attrs[g.name])
                      .filter(Boolean)
                      .slice(0, 3);
                    return (
                      <a
                        key={product.partNumber}
                        href={productDetailHref(product.partNumber)}
                        className="group bg-white border border-[#e5e7eb] rounded-xl overflow-hidden hover:border-[#2563eb] hover:shadow-[0_4px_16px_rgba(37,99,235,0.12)] transition-all duration-200 flex flex-col"
                      >
                        <div className="relative h-40 bg-[#f8fafc] overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.partNumber}
                              fill
                              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Package size={22} className="text-[#d1d5db]" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1 gap-3">
                          <div>
                            <div className="font-mono font-bold text-[#0a1628] text-sm leading-tight mb-2 group-hover:text-[#2563eb] transition-colors break-all">
                              {product.partNumber}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {chips.map((c) => (
                                <span
                                  key={c}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 bg-[#f1f5f9] group-hover:bg-[#2563eb] text-[#374151] group-hover:text-white text-xs font-semibold rounded-lg transition-colors">
                            View details
                            <ArrowRight size={11} />
                          </span>
                        </div>
                      </a>
                    );
                  })}
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
                      Load more {productNoun}
                      <ChevronDown size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
