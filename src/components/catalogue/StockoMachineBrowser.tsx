"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { StockoMachineGroup } from "@/data/stockoTerminatingTechnology";

type FlatMachine = {
  model: string;
  name: string;
  url: string;
  image: string;
  group: string;
};

export default function StockoMachineBrowser({
  groups,
  initialGroup,
}: {
  groups: StockoMachineGroup[];
  initialGroup?: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(initialGroup ?? null);

  const allMachines: FlatMachine[] = useMemo(
    () =>
      groups.flatMap((g) =>
        g.machines.map((m) => ({ ...m, group: g.fullName })),
      ),
    [groups],
  );

  const filtered = useMemo(() => {
    let result = allMachines;
    if (selectedGroup) result = result.filter((m) => m.group === selectedGroup);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.model.toLowerCase().includes(q) ||
          m.group.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allMachines, selectedGroup, query]);

  const hasActiveFilter = selectedGroup !== null || query.trim() !== "";

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search machine models…"
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

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup(null)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all ${
              !selectedGroup
                ? "border-[#2563eb] bg-[#2563eb] text-white shadow-sm"
                : "border-[#d8dee7] bg-white text-[#374151] hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb]"
            }`}
          >
            All
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                !selectedGroup ? "bg-white/20 text-white" : "bg-[#f1f5f9] text-[#64748b]"
              }`}
            >
              {allMachines.length}
            </span>
          </button>

          {groups.map((group) => {
            const active = selectedGroup === group.fullName;
            return (
              <button
                key={group.fullName}
                onClick={() => setSelectedGroup(active ? null : group.fullName)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all ${
                  active
                    ? "border-[#2563eb] bg-[#2563eb] text-white shadow-sm"
                    : "border-[#d8dee7] bg-white text-[#374151] hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb]"
                }`}
              >
                {group.name}
              </button>
            );
          })}

          {hasActiveFilter && (
            <button
              onClick={() => {
                setSelectedGroup(null);
                setQuery("");
              }}
              className="ml-1 inline-flex items-center gap-1 text-xs text-[#64748b] underline underline-offset-2 hover:text-[#374151]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-[#94a3b8]">No machines match your search.</p>
          <button
            onClick={() => {
              setSelectedGroup(null);
              setQuery("");
            }}
            className="mt-3 text-sm font-medium text-[#2563eb] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((machine) => (
            <a
              key={machine.url}
              href={machine.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
            >
              <div className="relative aspect-[4/3] bg-[#f8fafc]">
                <Image
                  src={machine.image}
                  alt={machine.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-8 transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="border-t border-[#eef2f7] px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#0a1628] group-hover:text-[#2563eb]">
                    {machine.model}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="flex-none text-[#93c5fd] transition-colors group-hover:text-[#2563eb]"
                  />
                </div>
                <p className="mt-0.5 text-xs leading-snug text-[#94a3b8]">{machine.group}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
