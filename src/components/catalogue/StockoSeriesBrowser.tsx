"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { StockoConnectorPitchGroup } from "@/data/stockoConnectorSystems";
import { usePartnerSearch, usePartnerFilter } from "@/lib/partnerSearchContext";

type FlatSeries = {
  name: string;
  url: string;
  image: string;
  pitch: string;
};

function SeriesGrid({ series }: { series: FlatSeries[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {series.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition-all duration-200 hover:border-[#93c5fd] hover:shadow-[0_8px_28px_-10px_rgba(15,23,42,0.18)]"
        >
          <div className="relative aspect-square bg-[#f8fafc]">
            <Image
              src={s.image}
              alt={s.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
            />
          </div>
          <div className="flex flex-1 flex-col px-3 pt-3">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#0a1628] group-hover:text-[#2563eb]">
              {s.name}
            </h3>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#94a3b8]">
              {s.pitch}
            </p>
          </div>
          <div className="mx-3 mb-3 mt-3 flex items-center justify-between rounded-lg bg-[#f1f5f9] px-3 py-2 transition-colors group-hover:bg-[#eff6ff]">
            <span className="text-xs font-semibold text-[#374151] group-hover:text-[#2563eb]">
              View series
            </span>
            <ArrowUpRight
              size={12}
              className="text-[#94a3b8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#2563eb]"
            />
          </div>
        </a>
      ))}
    </div>
  );
}

export default function StockoSeriesBrowser({
  groups,
  initialPitch,
  embedded,
}: {
  groups: StockoConnectorPitchGroup[];
  initialPitch?: string;
  /** Full embedded mode: no outer wrapper, no chips, no search. The parent
   *  product browser owns the pitch facet (left sidebar) and search bar; this
   *  component just renders a header + grid matching the rest of the page,
   *  reading the query/pitch from PartnerSearch/PartnerFilter context. */
  embedded?: boolean;
}) {
  const partnerQuery = usePartnerSearch();
  const partnerPitch = usePartnerFilter();
  const [localQuery, setLocalQuery] = useState("");
  const [selectedPitch, setSelectedPitch] = useState<string | null>(initialPitch ?? null);

  const allSeries: FlatSeries[] = useMemo(
    () => groups.flatMap((g) => g.series.map((s) => ({ ...s, pitch: g.pitch }))),
    [groups],
  );

  // In embedded mode the query + pitch come from the parent (via context);
  // standalone mode uses this component's own search box and chip row.
  const query = embedded ? partnerQuery : localQuery;
  const activePitch = embedded ? partnerPitch : selectedPitch;

  const filtered = useMemo(() => {
    let result = allSeries;
    if (activePitch) result = result.filter((s) => s.pitch === activePitch);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.pitch.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allSeries, activePitch, query]);

  const pitchCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of allSeries) map.set(s.pitch, (map.get(s.pitch) ?? 0) + 1);
    return map;
  }, [allSeries]);

  // ---- Embedded mode: header + grid only, matching the product browser. ----
  if (embedded) {
    return (
      <div>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
              Connector systems
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">Browse series</h2>
          </div>
          <span className="text-sm font-medium text-[#64748b]">
            {filtered.length.toLocaleString()} of {allSeries.length.toLocaleString()} series
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-[#e5e7eb] bg-white px-6 py-12 text-center">
            <h3 className="text-base font-bold text-[#0a1628]">No matching series</h3>
            <p className="mt-2 text-sm text-[#64748b]">
              Try a different pitch or a shorter series name.
            </p>
          </div>
        ) : (
          <SeriesGrid series={filtered} />
        )}
      </div>
    );
  }

  // ---- Standalone page mode: search + pitch chips + grid. ----
  const hasActiveFilter = selectedPitch !== null || query.trim() !== "";

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      {/* Search + filter bar */}
      <div className="sticky top-0 z-10 bg-[#f8fafc] pb-4 pt-1">
        <div className="relative mb-3">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search connector series…"
            className="w-full rounded-xl border border-[#d8dee7] bg-white py-2.5 pl-10 pr-10 text-sm text-[#0a1628] placeholder-[#94a3b8] shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
          />
          {localQuery && (
            <button
              onClick={() => setLocalQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#374151]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Pitch filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPitch(null)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all ${
              !selectedPitch
                ? "border-[#2563eb] bg-[#2563eb] text-white shadow-sm"
                : "border-[#d8dee7] bg-white text-[#374151] hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb]"
            }`}
          >
            All
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                !selectedPitch ? "bg-white/20 text-white" : "bg-[#f1f5f9] text-[#64748b]"
              }`}
            >
              {allSeries.length}
            </span>
          </button>

          {groups.map((group) => {
            const active = selectedPitch === group.pitch;
            return (
              <button
                key={group.pitch}
                onClick={() => setSelectedPitch(active ? null : group.pitch)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all ${
                  active
                    ? "border-[#2563eb] bg-[#2563eb] text-white shadow-sm"
                    : "border-[#d8dee7] bg-white text-[#374151] hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb]"
                }`}
              >
                {group.pitch}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                    active ? "bg-white/20 text-white" : "bg-[#f1f5f9] text-[#64748b]"
                  }`}
                >
                  {pitchCounts.get(group.pitch) ?? 0}
                </span>
              </button>
            );
          })}

          {hasActiveFilter && (
            <button
              onClick={() => {
                setSelectedPitch(null);
                setLocalQuery("");
              }}
              className="ml-1 inline-flex items-center gap-1 text-xs text-[#64748b] underline underline-offset-2 hover:text-[#374151]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {hasActiveFilter && (
        <p className="mb-4 text-xs text-[#94a3b8]">
          {filtered.length} of {allSeries.length} series
        </p>
      )}

      {/* Series grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-[#94a3b8]">No series match your search.</p>
          <button
            onClick={() => {
              setSelectedPitch(null);
              setLocalQuery("");
            }}
            className="mt-3 text-sm font-medium text-[#2563eb] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <SeriesGrid series={filtered} />
      )}
    </div>
  );
}
