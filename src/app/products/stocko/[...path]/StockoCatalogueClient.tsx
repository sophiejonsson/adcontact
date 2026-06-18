"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, X, Package, ArrowUpRight } from "lucide-react";
import { type StockoProduct } from "@/data/stockoCatalogue";
import { productDetailHref } from "@/lib/productHref";

const PAGE_SIZE = 60;

// Stocko part numbers encode the material as the trailing token, e.g.
// "RSB 7770 V-1-CuZn" → CuZn. Surface it as the key differentiator.
const MATERIAL_STYLES: Record<string, string> = {
  CuSn: "bg-amber-50 text-amber-700 border-amber-200",
  CuZn: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Fe: "bg-slate-100 text-slate-600 border-slate-200",
  Sn: "bg-sky-50 text-sky-700 border-sky-200",
  Cu: "bg-orange-50 text-orange-700 border-orange-200",
};

function parseMaterial(pn: string): string | null {
  const m = pn.match(/-([A-Za-z]{2,8})$/);
  return m ? m[1] : null;
}

/** Strip the trailing material so the row's primary label stays clean. */
function baseLabel(pn: string, material: string | null): string {
  return material ? pn.slice(0, pn.length - material.length - 1) : pn;
}

export default function StockoCatalogueClient({ products }: { products: StockoProduct[] }) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.partNumber.toLowerCase().includes(q));
  }, [products, query]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query]);

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#64748b]">
          Showing{" "}
          <span className="font-semibold text-[#0a1628]">
            {Math.min(visible, filtered.length)}
          </span>{" "}
          of <span className="font-semibold text-[#0a1628]">{filtered.length}</span> parts
        </p>
        <div className="relative w-full max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by part number…"
            className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2.5 pl-9 pr-9 text-sm text-[#0a1628] placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-[#e5e7eb] bg-white py-20 text-center">
          <Package size={36} className="mb-4 text-[#d1d5db]" />
          <p className="text-sm font-medium text-[#374151]">No parts match &ldquo;{query}&rdquo;</p>
          <button onClick={() => setQuery("")} className="mt-3 text-sm text-[#2563eb] hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <>
          {/* Dense, scannable list — the part number and material lead, the
              technical drawing is a small framed reference. */}
          <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
            <div className="divide-y divide-[#f1f5f9]">
              {filtered.slice(0, visible).map((product) => {
                const material = parseMaterial(product.partNumber);
                const label = baseLabel(product.partNumber, material);
                const chip = material
                  ? MATERIAL_STYLES[material] ?? "bg-slate-100 text-slate-600 border-slate-200"
                  : "";
                return (
                  <a
                    key={product.path}
                    href={productDetailHref(product.partNumber)}
                    className="group flex items-center gap-4 px-3 py-2.5 transition-colors hover:bg-[#f8fafc] sm:px-4"
                  >
                    {/* Reference thumbnail */}
                    <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg border border-[#eef2f7] bg-gradient-to-br from-white to-[#f1f5f9]">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain p-1.5 mix-blend-multiply transition-transform duration-200 group-hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package size={16} className="text-[#cbd5e1]" />
                        </div>
                      )}
                    </div>

                    {/* Part number */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-sm font-semibold text-[#0a1628] group-hover:text-[#2563eb]">
                        {label}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[#94a3b8]">Stocko Contact</div>
                    </div>

                    {/* Material */}
                    {material && (
                      <span
                        className={`hidden flex-none rounded-md border px-2 py-0.5 text-[11px] font-medium sm:inline-block ${chip}`}
                      >
                        {material}
                      </span>
                    )}

                    {/* Action */}
                    <span className="flex flex-none items-center gap-1 text-xs font-medium text-[#94a3b8] transition-colors group-hover:text-[#2563eb]">
                      <span className="hidden md:inline">View</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {visible < filtered.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-6 py-3 text-sm font-semibold text-[#374151] shadow-sm transition-all hover:border-[#2563eb] hover:text-[#2563eb]"
              >
                Load more parts
                <span className="text-xs text-[#9ca3af]">({filtered.length - visible} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
