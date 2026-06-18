"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import type { WebshopProduct } from "@/data/webshopBrands";

const PAGE_SIZE = 32;

export default function ProductCatalogue({ products }: { products: WebshopProduct[] }) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) => product.partNumber.toLowerCase().includes(normalized));
  }, [products, query]);

  const shown = filtered.slice(0, visible);

  function updateQuery(value: string) {
    setQuery(value);
    setVisible(PAGE_SIZE);
  }

  return (
    <section id="catalogue" className="py-16 sm:py-20 bg-canvas">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb] mb-3">
              Product catalogue
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a1628]">TE Connectivity products</h2>
            <p className="text-[#64748b] mt-3">
              {filtered.length} {filtered.length === 1 ? "product" : "products"} available to browse.
            </p>
          </div>
          <div className="relative w-full lg:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
            <input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search part number..."
              className="w-full h-12 rounded-xl border border-[#dbe2ea] bg-white pl-11 pr-11 text-sm text-[#0a1628] shadow-sm outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => updateQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0a1628]"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {shown.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {shown.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  className="surface-card group overflow-hidden rounded-2xl flex flex-col min-w-0"
                >
                  <div className="relative aspect-[4/3] bg-[#f8fafc] border-b border-[#edf1f5]">
                    <Image
                      src={product.image}
                      alt={product.partNumber}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                      className="object-contain p-4 sm:p-6 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748b]">
                      Part number
                    </span>
                    <h3 className="font-mono font-bold text-sm sm:text-base text-[#0a1628] mt-1 break-all">
                      {product.partNumber}
                    </h3>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb]">
                      View product <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {visible < filtered.length && (
              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={() => setVisible((count) => count + PAGE_SIZE)}
                  className="btn-elevate rounded-xl bg-[#0a1628] px-6 py-3 text-sm font-bold text-white hover:bg-[#132747]"
                >
                  Show more products
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-[#dbe2ea] bg-white px-6 py-16 text-center">
            <p className="font-semibold text-[#0a1628]">No matching part numbers</p>
            <button
              type="button"
              onClick={() => updateQuery("")}
              className="mt-3 text-sm font-semibold text-[#2563eb]"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
