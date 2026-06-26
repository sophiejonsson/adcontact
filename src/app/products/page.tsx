import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Search, Zap, Flame, CircuitBoard, Cable, Cpu, Wrench, Factory } from "lucide-react";
import { categories } from "@/data/categories";
import { searchCatalogue } from "@/lib/search";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Products | Industrial Components Catalogue",
  description:
    "Browse Adcontact's full catalogue of industrial components: connectors, heat shrink tubing, crimp contacts, wire ferrules, PCB contacts, tools, and production equipment.",
};

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap, Flame, CircuitBoard, Cable, Cpu, Wrench, Factory,
};

function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/products" method="GET" className="mt-5 max-w-2xl">
      <div className="flex items-center gap-2 rounded-xl border border-[#d1d5db] bg-white p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#2563eb]/50">
        <Search size={18} className="ml-2.5 flex-shrink-0 text-[#9ca3af]" />
        <input
          type="text"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search by part number, product, brand, or application…"
          className="flex-1 bg-transparent px-1 py-2 text-sm text-[#111827] placeholder:text-[#9ca3af] outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="flex-shrink-0 rounded-lg bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const isSearching = query.length >= 2;
  const results = isSearching ? searchCatalogue(query) : [];

  if (!query) {
    redirect("/webshop.html");
  }

  if (isSearching) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="max-w-[1440px] mx-auto px-6 py-8">
            <Breadcrumbs crumbs={[{ label: "Products", href: "/products" }, { label: "Search" }]} />
            <h1 className="text-3xl font-bold text-[#0a1628] mt-4 mb-2">
              Search results
            </h1>
            <p className="text-[#6b7280] text-sm">
              {results.length > 0
                ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`
                : `No matches for "${query}"`}
            </p>
            <SearchBar defaultValue={query} />
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 py-12">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={r.href}
                  className="group flex flex-col bg-white border border-[#e2e8f0] hover:border-[#2563eb] hover:shadow-[0_4px_20px_rgba(37,99,235,0.08)] rounded-xl p-5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-medium text-[#6b7280] uppercase tracking-wider">
                      {r.brand} · {r.category}
                    </span>
                    {r.available && (
                      <span className="flex items-center gap-1 text-[10px] text-green-600">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Available
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-semibold text-[#0a1628] group-hover:text-[#2563eb] transition-colors leading-snug mb-2">
                    {r.name}
                  </h2>
                  <p className="text-xs text-[#6b7280] leading-relaxed flex-1 mb-3">
                    {r.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#374151] bg-[#f3f4f6] px-2 py-1 rounded">
                      {r.partNumber}
                    </span>
                    <ArrowRight size={14} className="text-[#9ca3af] group-hover:text-[#2563eb] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-10 text-center">
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">
                We couldn&apos;t find a match for &quot;{query}&quot;
              </h3>
              <p className="text-sm text-[#6b7280] max-w-md mx-auto mb-5">
                Try a part number or a broader term, or contact our team. We source many parts that are not in the online catalogue.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/contact?q=${encodeURIComponent(query)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors"
                >
                  Request this part
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/webshop.html"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e2e8f0] hover:border-[#2563eb] text-sm font-medium text-[#374151] hover:text-[#2563eb] rounded-md transition-colors"
                >
                  Browse all categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <Breadcrumbs crumbs={[{ label: "Products" }]} />
          <h1 className="text-3xl font-bold text-[#0a1628] mt-4 mb-2">
            Product catalogue
          </h1>
          <p className="text-[#6b7280] text-sm max-w-2xl">
            Electromechanical components, connectors, heat shrink tubing, crimp contacts, wire ferrules, and production tooling for industrial manufacturers across the Nordics.
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Zap;
            return (
              <Link
                key={cat.id}
                href={cat.webshopHref}
                className="group flex flex-col bg-white border border-[#e2e8f0] hover:border-[#2563eb] hover:shadow-[0_4px_24px_rgba(37,99,235,0.1)] rounded-xl p-6 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 bg-[#eff6ff] group-hover:bg-[#2563eb] rounded-xl flex items-center justify-center transition-colors duration-200">
                    <Icon size={22} className="text-[#2563eb] group-hover:text-white transition-colors duration-200" />
                  </div>
                  <span className="text-xs text-[#9ca3af] font-mono bg-[#f3f4f6] px-2 py-1 rounded">
                    {cat.productCount.toLocaleString()} SKUs
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-[#0a1628] mb-2 group-hover:text-[#2563eb] transition-colors">
                  {cat.name}
                </h2>
                <p className="text-sm text-[#6b7280] leading-relaxed mb-5 flex-1">
                  {cat.description.slice(0, 160)}…
                </p>

                <div className="border-t border-[#f3f4f6] pt-4">
                  <p className="text-[10px] text-[#9ca3af] uppercase tracking-wider mb-2">Key brands</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.exampleBrands.map((brand) => (
                      <span key={brand} className="px-2 py-0.5 bg-[#f3f4f6] text-[#374151] text-xs font-medium rounded">
                        {brand}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-[#2563eb]">
                    Browse {cat.name}
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Request custom */}
        <div className="mt-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-[#0a1628] mb-2">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-sm text-[#6b7280] max-w-md mx-auto mb-5">
            Our catalogue covers a broad range but not every product we can source. Contact our team with your part number or specification, we find hard-to-source parts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact/quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors"
            >
              Request a part
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e2e8f0] hover:border-[#2563eb] text-sm font-medium text-[#374151] hover:text-[#2563eb] rounded-md transition-colors"
            >
              View full linecard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
