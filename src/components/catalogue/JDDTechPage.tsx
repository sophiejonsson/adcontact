import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { brands } from "@/data/brands";
import type { CatalogueCategory } from "@/lib/magentoCatalogue";

const JDD_TECH = "https://www.jddsleeve.com" as const;
const brand = brands.find((b) => b.slug === "jdd-tech")!;

// Featured product categories from jddsleeve.com. Proposed shortlist (2026-07-11)
// pending Stefan's confirmation — swap any entry out, the layout supports any 6.
type CategoryCard = { title: string; href: string; image: string };
const CATEGORIES: CategoryCard[] = [
  {
    title: "Expandable Braided Sleeving",
    href: `${JDD_TECH}/expandable-braided-sleeving/`,
    image: `${JDD_TECH}/uploadfile/2024/0529/20240529042802107.jpg`,
  },
  {
    title: "Spiral Wrap",
    href: `${JDD_TECH}/spiral-wrap/`,
    image: `${JDD_TECH}/uploadfile/2023/0314/20230314032433774.jpg`,
  },
  {
    title: "Textile Sleeve",
    href: `${JDD_TECH}/textile-sleeve/`,
    image: `${JDD_TECH}/uploadfile/2017/0531/20170531110242559.jpg`,
  },
  {
    title: "Corrugated Flexible Conduit",
    href: `${JDD_TECH}/corrugated-flexible-conduit/`,
    image: `${JDD_TECH}/uploadfile/2017/0531/20170531110352932.jpg`,
  },
  {
    title: "Heat Shrinkable Tube",
    href: `${JDD_TECH}/heat-shrinkable-tube/`,
    image: `${JDD_TECH}/uploadfile/2023/0217/20230217094953824.jpg`,
  },
  {
    title: "Thermal Insulation Tube",
    href: `${JDD_TECH}/thermal-insulation-tube/`,
    image: `${JDD_TECH}/uploadfile/2017/0531/20170531113104893.jpg`,
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
                {CATEGORIES.length} product categories
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

      {/* Category grid */}
      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.title}
              href={cat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
            >
              <div className="relative aspect-[4/3] bg-[#f8fafc]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[#eef2f7] px-4 py-3">
                <span className="text-sm font-bold text-[#0a1628] group-hover:text-[#2563eb]">
                  {cat.title}
                </span>
                <ArrowUpRight size={14} className="flex-none text-[#93c5fd] transition-transform duration-200 group-hover:text-[#2563eb]" />
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
              href={brand.website}
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
