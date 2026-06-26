import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { componentPartners, equipmentPartners } from "@/data/brands";
import type { Brand } from "@/data/brands";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Trusted Partners | Adcontact Linecard",
  description:
    "Adcontact's manufacturer partners: TE Connectivity, Stocko, HTP, JDD Tech, Schneider & Gemsa, Mecal, Metzner, Ramatech Systems, and more. Nordic specialist distributor since 1985.",
};

function PartnerCard({ brand }: { brand: Brand }) {
  return (
    <div className="surface-card group flex flex-col rounded-2xl p-6">
      {/* Logo */}
      <div className="h-16 flex items-center mb-4">
        {brand.logo ? (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${brand.name} website`}
            className="relative h-14"
            style={{ width: brand.logoWidth ? `${brand.logoWidth}px` : "100%" }}
          >
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              fill
              sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-contain object-left"
            />
          </a>
        ) : (
          <span className="text-base font-bold text-[#0a1628]">{brand.name}</span>
        )}
      </div>

      {/* Name + description */}
      <a
        href={brand.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-1.5 text-sm font-semibold text-[#0a1628] transition-colors group-hover:text-[#2563eb]"
      >
        {brand.name}
      </a>
      <p className="text-xs text-[#6b7280] leading-relaxed flex-1">
        {brand.shortDescription}
      </p>

      {/* Arrow */}
      <Link
        href={`/brands/${brand.slug}`}
        className="mt-4 flex items-center gap-1 text-xs font-medium text-[#9ca3af] transition-colors group-hover:text-[#2563eb]"
      >
        View partner profile
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#0a1628]">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <Breadcrumbs
            crumbs={[{ label: "Trusted Partners" }]}
            light
          />
          <h1 className="text-4xl font-extrabold text-white mt-4 mb-3 tracking-[-0.035em]">
            Trusted Partners
          </h1>
          <p className="text-[#94a3b8] text-sm max-w-2xl leading-relaxed">
            Adcontact maintains direct relationships with leading manufacturers in electromechanical
            components and wire-processing equipment. We provide application support, stock
            management, and technical consultancy, not just logistics.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-14">
        {/* Component Partners */}
        <section className="mb-16">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-xl font-bold text-[#0a1628]">Component Partners</h2>
            <span className="text-sm text-[#9ca3af]">{componentPartners.length} manufacturers</span>
          </div>
          <p className="text-sm text-[#6b7280] mb-8 max-w-2xl">
            Connectors, contacts, heat-shrink, PCB terminals, and cable accessories, sourced directly from the manufacturer.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {componentPartners.map((brand) => (
              <PartnerCard key={brand.id} brand={brand} />
            ))}
          </div>
        </section>

        {/* Equipment Partners */}
        <section className="mb-16">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-xl font-bold text-[#0a1628]">Production & Test Equipment</h2>
            <span className="text-sm text-[#9ca3af]">{equipmentPartners.length} manufacturers</span>
          </div>
          <p className="text-sm text-[#6b7280] mb-8 max-w-2xl">
            Wire-processing machines, crimping tools, harness testers, and ferrule systems for professional cable assembly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {equipmentPartners.map((brand) => (
              <PartnerCard key={brand.id} brand={brand} />
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-[#0a1628] mb-1">
              Need a manufacturer not on our linecard?
            </h3>
            <p className="text-sm text-[#374151]">
              We source from a broad supplier network beyond our standard linecard. Send us a part
              number or manufacturer name and we will get back to you.
            </p>
          </div>
          <Link
            href="/contact/quote"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors"
          >
            <Mail size={14} />
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
