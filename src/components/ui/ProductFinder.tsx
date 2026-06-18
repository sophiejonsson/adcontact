"use client";

import { useState } from "react";
import { Search, X, Filter, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { products, searchProducts } from "@/data/products";

const filterOptions = {
  category: ["Connectors", "Heat Shrink Tubing", "Wire Ferrules", "Contacts & Terminals", "PCB Contacts", "Tools"],
  brand: ["Deutsch", "TE Connectivity", "Stocko", "DSG-Canusa", "HongShang", "Ulmer", "Mecal"],
  application: ["Automotive", "White Goods", "Wire Harness", "Industrial Automation", "Marine"],
  standard: ["IP67", "DIN 46228", "UL224", "ISO 9001", "RoHS"],
};

type Filters = {
  category: string;
  brand: string;
  application: string;
  standard: string;
};

export default function ProductFinder() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({ category: "", brand: "", application: "", standard: "" });
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const results = query.length >= 2
    ? searchProducts(query).filter((p) => {
        if (filters.category && p.category !== filters.category) return false;
        if (filters.brand && p.brand !== filters.brand) return false;
        if (filters.application && !p.applications.some((a) => a.includes(filters.application))) return false;
        if (filters.standard && !p.standards?.some((s) => s.includes(filters.standard))) return false;
        return true;
      })
    : products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-20 bg-[#f8fafc] border-t border-[#e2e8f0]">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#2563eb] uppercase tracking-widest mb-2">
            Product finder
          </p>
          <h2 className="text-3xl font-bold text-[#0a1628] mb-3">
            Find the right component
          </h2>
          <p className="text-sm text-[#6b7280] max-w-lg mx-auto">
            Search by product name, part number, brand, or application. Use filters to narrow down by category, standard, or industry.
          </p>
        </div>

        {/* Search and filter bar */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product, part number, brand…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
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

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]"
                  : "bg-[#f8fafc] border-[#e2e8f0] text-[#374151] hover:bg-[#f3f4f6]"
              }`}
            >
              <Filter size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#2563eb] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter chips */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#f3f4f6] grid grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.entries(filterOptions) as [keyof Filters, string[]][]).map(([key, options]) => (
                <div key={key}>
                  <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5 block">
                    {key}
                  </label>
                  <select
                    value={filters[key]}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  >
                    <option value="">All {key}s</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {query.length < 2 && (
            <p className="text-xs text-[#9ca3af] mb-4">
              Showing featured products, type 2+ characters to search
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#e2e8f0] rounded-xl p-5 hover:border-[#2563eb] hover:shadow-[0_4px_20px_rgba(37,99,235,0.08)] transition-all duration-200 flex flex-col"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-medium text-[#6b7280] uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-semibold text-[#0a1628] mt-0.5 leading-snug">
                      {product.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#6b7280] leading-relaxed mb-3 flex-1">
                  {product.shortDescription}
                </p>

                {/* Specs preview */}
                <div className="border-t border-[#f3f4f6] pt-3 mb-3">
                  {product.specs.slice(0, 2).map((spec) => (
                    <div key={spec.label} className="flex justify-between text-[10px] py-0.5">
                      <span className="text-[#9ca3af]">{spec.label}</span>
                      <span className="text-[#374151] font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-[#f3f4f6] text-[9px] text-[#6b7280] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Part number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#374151] bg-[#f3f4f6] px-2 py-1 rounded">
                    {product.partNumber}
                  </span>
                  {product.available && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Available
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.categorySlug}/${product.slug}`}
                    className="flex-1 text-center text-xs font-medium py-2 border border-[#e2e8f0] hover:border-[#2563eb] hover:text-[#2563eb] text-[#374151] rounded-md transition-colors"
                  >
                    View details
                  </Link>
                  <Link
                    href={`/contact?product=${product.partNumber}`}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-[#0a1628] hover:bg-[#1a2f5a] text-white rounded-md transition-colors"
                  >
                    <Plus size={12} />
                    Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {query.length >= 2 && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-[#6b7280] mb-3">
                No results found for &quot;{query}&quot;
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-md hover:bg-[#1d4ed8] transition-colors"
              >
                <ShoppingCart size={14} />
                Request this part
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href={`/products${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e2e8f0] hover:border-[#2563eb] text-sm font-medium text-[#374151] hover:text-[#2563eb] rounded-lg transition-all"
              >
                View all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
