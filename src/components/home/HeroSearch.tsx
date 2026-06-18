"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Deutsch connectors", href: "/webshop/components/sealed-connectors/deutsch/connectors.html" },
  { label: "Heat shrink tubing", href: "/webshop/components/heat-shrinkable.html" },
  { label: "Crimping equipment", href: "/webshop/production-equipment/crimping-equipment.html" },
  { label: "M8/M12 connectors", href: "/webshop/components/sealed-connectors/htp.html" },
  { label: "Wire ferrules", href: "/webshop/components/sealed-connectors/zoller-frohlich/wire-ferrules.html" },
];

const trustBadges = [
  "Specialist supplier since 1985",
  "ISO 9001:2015 certified",
  "Support across five Nordic markets",
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0a1628] min-h-[420px] lg:min-h-[520px] flex items-center">
      {/* Background video */}
      <video
        className="hero-background-video absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/background-poster.jpg"
        aria-hidden="true"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay, keeps text legible over the footage */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/98 via-[#0a1628]/78 to-[#0a1628]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/70 via-transparent to-[#0a1628]/20" />

      {/* Subtle tech grid on top */}
      <div className="absolute inset-0 tech-grid opacity-40" />

      {/* Blue glow accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563eb] opacity-[0.06] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#1d4ed8] opacity-[0.06] rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-[1440px] mx-auto px-6 py-14 lg:py-20 w-full">
        <div className="max-w-3xl animate-fade-up">
          {/* Headline */}
          <h1 className="text-[36px] lg:text-[50px] font-extrabold text-white leading-[1.05] tracking-[-0.035em] mb-5">
            Source the right component.{" "}
            <span className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] bg-clip-text text-transparent">
              Build the right process.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-[#a3b2c7] text-base lg:text-lg leading-relaxed mb-7 max-w-2xl">
            Industrial components, connection systems and wire-processing equipment, backed by
            technical support from people who understand the complete production chain.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} action="/products" method="GET" className="relative mb-6">
            <div className="flex items-center bg-white rounded-2xl shadow-[0_8px_50px_rgba(0,0,0,0.35)] overflow-hidden border border-white/10 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-[#2563eb]/60 focus-within:shadow-[0_8px_60px_rgba(37,99,235,0.35)]">
              <div className="flex items-center gap-3 flex-1 px-5 py-4">
                <Search size={20} className="text-[#9ca3af] flex-shrink-0" />
                <input
                  type="text"
                  name="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by product, brand, part number, application…"
                  className="flex-1 text-[#111827] text-base placeholder:text-[#9ca3af] bg-transparent outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-4 m-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm transition-colors flex-shrink-0"
              >
                Search
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1">
            <span className="flex-shrink-0 text-xs text-[#64748b]">Quick search:</span>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex-shrink-0 px-2.5 py-1.5 bg-[#0f2042]/80 hover:bg-[#1a2f5a] text-[#93c5fd] text-xs font-medium rounded-full border border-[#1e3a6e] hover:border-[#2563eb] transition-all duration-200 hover:-translate-y-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Compact proof points */}
        <div className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3">
          {trustBadges.map((badge, i) => (
            <div
              key={badge}
              className="flex items-center gap-2.5 bg-[#0f2042]/80 border border-[#1e3a6e] backdrop-blur-sm rounded-lg px-4 py-3 min-w-[200px]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CheckCircle size={14} className="text-[#2563eb] flex-shrink-0" />
              <span className="text-xs font-medium text-[#e2e8f0]">{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1e3a6e] to-transparent" />
    </section>
  );
}
