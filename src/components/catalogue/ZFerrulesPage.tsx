import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  getCategoryChildren,
  type CatalogueCategory,
} from "@/lib/magentoCatalogue";

const ZOFRE = "https://www.zofre.de/fileadmin/files/medienverzeichnis/produkte/aeh";

// Product images sourced from zofre.de, mapped to our catalogue categories.
const GROUP_IMAGE: Record<string, string> = {
  "Single Bag":             `${ZOFRE}/isolierte_aderendh%C3%BClsen/zoller-froehlich-aderendhuelsen-bandware-blau.jpg`,
  "Multiple bag":           `${ZOFRE}/isolierte_zwillings_aderendh%C3%BClsen/zoller-froehlich-zwillings-aderendhuelse-als-einzelbeutel-grau.jpg`,
  "Wire ferrules on reel":  `${ZOFRE}/isolierte_aderendh%C3%BClsen_auf_rollen/zoller-froehlich-aderendhuelsen-auf-rolle.jpg`,
  "Belt-strips":            `${ZOFRE}/isolierte_aderendh%C3%BClsen_als_gurtstreifen/zoller-froehlich-aderendhuelsen-als-grutware-blau.jpg`,
  "Uninsulated ferrules":   `${ZOFRE}/unisolierte_aderendh%C3%BClsen/zoller-froehlich-unisolierte-aderendhuelsen-in-einzelbeutel-menue.jpg`,
};

export default function ZFerrulesPage({ category }: { category: CatalogueCategory }) {
  // category = 1711 (Z+F root) → child 1712 (Wire Ferrules) → 5 groups
  const wireFerrules = getCategoryChildren(category)[0];
  const groups = wireFerrules ? getCategoryChildren(wireFerrules) : [];

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
              { label: "Sealed Connectors", href: "/webshop/components/sealed-connectors.html" },
              { label: "Zoller & Fröhlich" },
            ]}
          />
          <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="flex-1">
              <span className="mb-4 inline-flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-2 shadow-sm">
                <Image
                  src="/images/partners/zoller-frohlich.png"
                  alt="Zoller & Fröhlich"
                  width={132}
                  height={28}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              </span>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
                Wire Ferrules
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#94a3b8]">
                End sleeves and wire ferrules from Zoller &amp; Fröhlich — available as single bag, multiple bag, reel, belt-strips, and uninsulated types across the full range of cross-sections. High availability · ask for current lead time.
              </p>
              <p className="mt-4 text-sm font-semibold text-blue-200">
                {groups.length} product groups
              </p>
              <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3">
                <span className="text-sm text-[#94a3b8]">
                  Can&apos;t find what you&apos;re looking for? Browse the full range at Zoller &amp; Fröhlich.
                </span>
                <a
                  href="https://www.zofre.de/en/ferrules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#fbbf24] transition-colors hover:text-[#f59e0b]"
                >
                  Go to partner shop
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product groups */}
      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const subCategories = getCategoryChildren(group);
            const image = GROUP_IMAGE[group.name ?? ""] ?? null;
            const href = group.route ?? "#";

            return (
              <div
                key={group.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <Link href={href} className="group relative block aspect-[4/3] bg-[#f8fafc]">
                  {image ? (
                    <Image
                      src={image}
                      alt={group.name ?? ""}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-8 transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#d1d5db]" />
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <Link
                    href={href}
                    className="group mb-2 inline-flex items-center gap-2 text-lg font-bold text-[#0a1628] hover:text-[#2563eb]"
                  >
                    {group.name}
                    <ArrowRight size={15} className="text-[#93c5fd] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2563eb]" />
                  </Link>

                  {/* Sub-types as chips */}
                  {subCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={sub.route ?? "#"}
                          className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#374151] transition-colors hover:border-[#93c5fd] hover:bg-[#eff6ff] hover:text-[#2563eb]"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
