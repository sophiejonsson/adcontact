"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, Loader2 } from "lucide-react";

type Product = {
  id: string;
  partNumber: string;
  name: string;
  brand: string;
  category: string;
  href: string;
};

type CategoryResult = { name: string; href: string; slug: string };
type BrandResult = { name: string; slug: string };

type Results = {
  products: Product[];
  categories: CategoryResult[];
  brands: BrandResult[];
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchAutocomplete({
  className,
  onNavigate,
  prominent = false,
}: {
  className?: string;
  onNavigate?: () => void;
  prominent?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 180);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data: Results) => {
        if (!cancelled) {
          setResults(data);
          setOpen(true);
          setSelected(-1);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const productResults = results?.products.slice(0, 6) ?? [];
  const categoryResults = results?.categories.slice(0, 2) ?? [];
  const allItems = [
    ...productResults.map((p) => ({ href: p.href })),
    ...categoryResults.map((c) => ({ href: c.href })),
  ];
  const hasResults = productResults.length > 0 || categoryResults.length > 0;

  const close = () => {
    setOpen(false);
    setSelected(-1);
    setQuery("");
    onNavigate?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setSelected(-1);
    } else if (e.key === "Enter" && selected >= 0) {
      const target = allItems[selected];
      if (target) {
        e.preventDefault();
        router.push(target.href);
        close();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      onNavigate?.();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative flex items-center">
          {loading ? (
            <Loader2
              size={prominent ? 20 : 15}
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 animate-spin text-[#2563eb] ${prominent ? "left-5" : "left-4"}`}
            />
          ) : (
            <Search
              size={prominent ? 20 : 15}
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors ${prominent ? "left-5 text-[#6b7a8d]" : "left-3.5 text-[#94a3b8]"}`}
            />
          )}
          <input
            ref={inputRef}
            type="text"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results && query.length >= 2) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              prominent
                ? "Search by part number, product, brand or application…"
                : "Part number, product, brand…"
            }
            aria-label="Search catalogue"
            aria-expanded={open}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            className={
              prominent
                ? "h-14 w-full rounded-2xl border border-[#dde3ed] bg-white pl-14 pr-36 text-base text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.06)] placeholder:text-[#9faab6] transition-all duration-200 focus:border-[#2563eb] focus:outline-none focus:shadow-[0_4px_20px_rgba(37,99,235,0.13)]"
                : "h-9 w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] pl-9 pr-[72px] text-sm text-[#111827] placeholder:text-[#9ca3af] transition-all duration-150 focus:border-[#2563eb] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/15"
            }
          />
          <button
            type="submit"
            className={
              prominent
                ? "absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-xl bg-[#2563eb] px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1d4ed8] hover:shadow-md"
                : "absolute right-1 top-1/2 -translate-y-1/2 h-7 rounded-md bg-[#2563eb] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            }
          >
            Search
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.13)]">
          {hasResults ? (
            <>
              {productResults.length > 0 && (
                <section>
                  <div className="border-b border-[#f1f5f9] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">
                    Products
                  </div>
                  <ul>
                    {productResults.map((p, i) => (
                      <li key={p.id}>
                        <Link
                          href={p.href}
                          onClick={close}
                          className={`flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-[#f8fafc] ${selected === i ? "bg-[#eff6ff]" : ""}`}
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-[#111827]">
                              {p.name}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#64748b]">
                              {p.partNumber && p.partNumber !== p.name && (
                                <span className="font-mono text-[#2563eb]">
                                  {p.partNumber}
                                </span>
                              )}
                              {p.brand && (
                                <>
                                  <span className="text-[#d1d5db]">·</span>
                                  <span>{p.brand}</span>
                                </>
                              )}
                              {!p.brand && p.category && (
                                <span>{p.category}</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight
                            size={12}
                            className="flex-none text-[#d1d5db] transition-colors group-hover:text-[#2563eb]"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {categoryResults.length > 0 && (
                <section className="border-t border-[#f1f5f9]">
                  <div className="border-b border-[#f1f5f9] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">
                    Categories
                  </div>
                  {categoryResults.map((c, i) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={close}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f8fafc] hover:text-[#2563eb] ${selected === productResults.length + i ? "bg-[#eff6ff] text-[#2563eb]" : ""}`}
                    >
                      {c.name}
                      <ArrowRight size={12} className="flex-none text-[#d1d5db]" />
                    </Link>
                  ))}
                </section>
              )}

              <div className="border-t border-[#f1f5f9] px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/products?q=${encodeURIComponent(query)}`);
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] transition-colors hover:text-[#1d4ed8]"
                >
                  All results for &ldquo;{query}&rdquo;
                  <ArrowRight size={11} />
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[#64748b]">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
