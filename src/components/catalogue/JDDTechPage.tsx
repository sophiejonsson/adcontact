import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { brands } from "@/data/brands";
import type { CatalogueCategory } from "@/lib/magentoCatalogue";

const JDD_TECH = "https://www.jddsleeve.com" as const;
// Category photos are mirrored into R2 (jdd-tech/categories/…) rather than
// hotlinked, so the page doesn't break if jddsleeve.com reorganises its site.
const IMG = "/media/jdd-tech/categories" as const;
const brand = brands.find((b) => b.slug === "jdd-tech")!;

// The complete range: all 15 product categories from jddsleeve.com's own
// navigation menu, each linking to its real category page with its own
// product photo (verified 2026-07-11).
type CategoryCard = { title: string; href: string; image: string };
const CATEGORIES: CategoryCard[] = [
  {
    title: "Expandable Braided Sleeving",
    href: `${JDD_TECH}/expandable-braided-sleeving/`,
    image: `${IMG}/expandable-braided-sleeving.jpg`,
  },
  {
    title: "Cable Management",
    href: `${JDD_TECH}/cable-management/`,
    image: `${IMG}/cable-management.jpg`,
  },
  {
    title: "Textile Sleeve",
    href: `${JDD_TECH}/textile-sleeve/`,
    image: `${IMG}/textile-sleeve.jpg`,
  },
  {
    title: "Spiral Wrap",
    href: `${JDD_TECH}/spiral-wrap/`,
    image: `${IMG}/spiral-wrap.jpg`,
  },
  {
    title: "Corrugated Flexible Conduit",
    href: `${JDD_TECH}/corrugated-flexible-conduit/`,
    image: `${IMG}/corrugated-flexible-conduit.jpg`,
  },
  {
    title: "Wiring Duct",
    href: `${JDD_TECH}/wiring-duct/`,
    image: `${IMG}/wiring-duct.jpg`,
  },
  {
    title: "High Temperature Tube",
    href: `${JDD_TECH}/high-temperature-tube/`,
    image: `${IMG}/high-temperature-tube.jpg`,
  },
  {
    title: "Thermal Insulation Tube",
    href: `${JDD_TECH}/thermal-insulation-tube/`,
    image: `${IMG}/thermal-insulation-tube.jpg`,
  },
  {
    title: "EMI Shielding Tube",
    href: `${JDD_TECH}/emi-shielding-tube/`,
    image: `${IMG}/emi-shielding-tube.jpg`,
  },
  {
    title: "Noisy Reduction Sleeve",
    href: `${JDD_TECH}/noisy-reduction-sleeve/`,
    image: `${IMG}/noisy-reduction-sleeve.jpg`,
  },
  {
    title: "Fiberglass Sleeving",
    href: `${JDD_TECH}/High%20Temperature%20Fiberglass%20sleeving/`,
    image: `${IMG}/fiberglass-sleeving.jpg`,
  },
  {
    title: "Heat Shrinkable Tube",
    href: `${JDD_TECH}/heat-shrinkable-tube/`,
    image: `${IMG}/heat-shrinkable-tube.jpg`,
  },
  {
    title: "Monofilament Fiber & Multifilament Yarn",
    href: `${JDD_TECH}/monofilament-fiber-and-multifilament-yarn/`,
    image: `${IMG}/monofilament-fiber-yarn.jpg`,
  },
  {
    title: "Conduit Fittings & Cable Gland",
    href: `${JDD_TECH}/conduit-fittings-and-cable-gland/`,
    image: `${IMG}/conduit-fittings-cable-gland.png`,
  },
  {
    title: "New Products",
    href: `${JDD_TECH}/New%20product/`,
    image: `${IMG}/new-products.jpg`,
  },
];

export default function JDDTechPage({ category: _ }: { category: CatalogueCategory }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-6">
          <Breadcrumbs
            light
            crumbs={[
              { label: "Webshop", href: "/webshop.html" },
              { label: "Components", href: "/webshop/components.html" },
              { label: "Heat Shrink Tubing and Protective Sleeves", href: "/webshop/components/heat-shrinkable.html" },
              { label: "JDD Tech" },
            ]}
          />
          <div className="mt-5 grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="mb-4 inline-flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-2 shadow-sm">
                <Image
                  src={brand.logo!}
                  alt={brand.name}
                  width={brand.logoWidth ?? 132}
                  height={28}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              </span>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">JDD Tech</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#94a3b8]">{brand.description}</p>
              <p className="mt-4 text-sm font-semibold text-blue-200">
                {CATEGORIES.length} product categories, the complete range
              </p>
            </div>
            <div className="lg:justify-self-end">
              <div className="overflow-hidden rounded-2xl shadow-lg lg:w-[420px]">
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src="/media/jdd-tech/hub-header.jpg"
                    alt="JDD Tech manufacturing facility"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid — same compact card size as the HTP categories (4 per
          row on large screens), so a 15-box page stays easy to scan. */}
      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.title}
              href={cat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid min-h-[180px] overflow-hidden rounded-lg border border-[#d8dee7] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
            >
              <div className="relative flex min-h-28 items-center justify-center border-b border-[#eef2f7] bg-[#f8fafc]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 25vw, 240px"
                  className="object-contain p-3 transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex min-w-0 flex-col p-3.5">
                <h3 className="min-h-10 text-sm font-bold leading-snug text-[#0a1628] group-hover:text-[#2563eb]">
                  {cat.title}
                </h3>
                <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-[#eef2f7] pt-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748b]">
                    View range
                  </span>
                  <ArrowUpRight size={14} className="flex-none text-[#2563eb]" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Sourcing CTA — same as our other brand pages */}
        <section className="mt-10 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-6 py-7 sm:px-8">
          <h2 className="text-lg font-bold text-[#0a1628] sm:text-xl">Can&apos;t find the exact part?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
            {`We supply the complete JDD Tech range, not only what's shown here. Find the exact reference in the JDD Tech catalogue, then send it to us and we'll source it for you.`}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="mailto:info@adcontact.se?subject=Sourcing%20request%3A%20JDD%20Tech"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Send us the part number
              <ArrowUpRight size={15} />
            </a>
            <a
              href="https://www.jddsleeve.com/Products%20&%20Application/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] transition-colors hover:text-[#2563eb]"
            >
              View JDD Tech catalogue
              <ArrowUpRight size={14} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
