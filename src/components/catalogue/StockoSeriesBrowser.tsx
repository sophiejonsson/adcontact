"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { StockoConnectorPitchGroup } from "@/data/stockoConnectorSystems";
import { usePartnerSearch } from "@/lib/partnerSearchContext";

type FlatSeries = {
  name: string;
  url: string;
  image: string;
  pitch: string;
};

export default function StockoSeriesBrowser({
  groups,
  initialPitch,
  hideSearch,
}: {
  groups: StockoConnectorPitchGroup[];
  initialPitch?: string;
  /** Hide the internal search bar — used when embedded in the product browser
   *  where the parent search bar drives the query via PartnerSearchContext. */
  hideSearch?: boolean;
}) {
  const partnerQuery = usePartnerSearch();
  const [query, setQuery] = useState(partnerQuery);

  // Sync whenever the parent product browser search changes
  useEffect(() => {
    setQuery(partnerQuery);
  }, [partnerQuery]);
  const [selectedPitch, setSelectedPitch] = useState<string | null>(initialPitch ?? null);

  const allSeries: FlatSeries[] = useMemo(
    () => groups.flatMap((g) => g.series.map((s) => ({ ...s, pitch: g.pitch }))),
    [groups],
  );

  const filtered = useMemo(() => {
    let result = allSeries;
    if (selectedPitch) result = result.filter((s) => s.pitch === selectedPitch);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.pitch.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allSeries, selectedPitch, query]);

  const pitchCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of allSeries) map.set(s.pitch, (map.get(s.pitch) ?? 0) + 1);
    return map;
  }, [allSeries]);

  const hasActiveFilter = selectedPitch !== null || query.trim() !== "";

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      {/* Search + filter bar */}
      <div className="sticky top-0 z-10 bg-[#f8fafc] pb-4 pt-1">
        {/* Search input — hidden when parent browser is driving the query */}
        {!hideSearch && (
          <div className="relative mb-3">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search connector series…"
              className="w-full rounded-xl border border-[#d8dee7] bg-white py-2.5 pl-10 pr-10 text-sm text-[#0a1628] placeholder-[#94a3b8] shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#374151]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

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
                setQuery("");
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
              setQuery("");
            }}
            className="mt-3 text-sm font-medium text-[#2563eb] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((series) => (
            <a
              key={series.url}
              href={series.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
            >
              <div className="relative aspect-[4/3] bg-[#f8fafc]">
                <Image
                  src={series.image}
                  alt={series.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="border-t border-[#eef2f7] px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0a1628] group-hover:text-[#2563eb]">
                    {series.name}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="flex-none text-[#93c5fd] transition-colors group-hover:text-[#2563eb]"
                  />
                </div>
                <p className="mt-0.5 text-xs text-[#94a3b8]">{series.pitch}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
