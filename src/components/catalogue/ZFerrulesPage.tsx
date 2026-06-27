import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { CatalogueCategory } from "@/lib/magentoCatalogue";

const ZOFRE = "https://www.zofre.de" as const;
const FILES = `${ZOFRE}/fileadmin/files/medienverzeichnis/produkte/aeh`;

const CATEGORIES = [
  {
    title: "Insulated ferrules",
    href: `${ZOFRE}/en/ferrules/insulatedferrules`,
    image: `${FILES}/isolierte_aderendh%C3%BClsen/zoller-froehlich-aderendhuelsen-bandware-blau.jpg`,
  },
  {
    title: "Insulated twin ferrules",
    href: `${ZOFRE}/en/ferrules/insulated-twin-ferrules`,
    image: `${FILES}/isolierte_zwillings_aderendh%C3%BClsen/zoller-froehlich-zwillings-aderendhuelse-als-einzelbeutel-grau.jpg`,
  },
  {
    title: "Ferrules for multi-standard conductors",
    href: `${ZOFRE}/en/ferrules/insulated-ferrules-for-multi-standard-conductors`,
    image: `${FILES}/isolierte_aderendh%C3%BClsen_f%C3%BCr_multinorm_leitungen/zoller-froehlich-aderendhuelsen-fuer-multinorm-leitungen-menue.jpg`,
  },
  {
    title: "Ferrules on reel",
    href: `${ZOFRE}/en/ferrules/ferrules-on-reel`,
    image: `${FILES}/isolierte_aderendh%C3%BClsen_auf_rollen/zoller-froehlich-aderendhuelsen-auf-rolle.jpg`,
  },
  {
    title: "Insulated ferrules as belt-strips",
    href: `${ZOFRE}/en/ferrules/insulated-ferrules-as-belt-strips`,
    image: `${FILES}/isolierte_aderendh%C3%BClsen_als_gurtstreifen/zoller-froehlich-aderendhuelsen-als-grutware-blau.jpg`,
  },
  {
    title: "Uninsulated ferrules",
    href: `${ZOFRE}/en/ferrules/uninsulated-ferrules`,
    image: `${FILES}/unisolierte_aderendh%C3%BClsen/zoller-froehlich-unisolierte-aderendhuelsen-in-einzelbeutel-menue.jpg`,
  },
  {
    title: "Ferrules assortment boxes and case",
    href: `${ZOFRE}/en/ferrules/ferrules-assortment-boxes-and-case`,
    image: `${FILES}/aderendh%C3%BClsen_sortimentsdosen_und_sortimentskasten/zoller-froehlich-aderendhuelsen-in-sortimentsdosen-mix.jpg`,
  },
  {
    title: "Terminals",
    href: `${ZOFRE}/en/ferrules/terminals`,
    image: `${FILES}/kabelschuhe/zoller-froehlich-flachstecker.jpg`,
  },
];

export default function ZFerrulesPage({ category: _ }: { category: CatalogueCategory }) {
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
          <div className="mt-5">
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
              End sleeves and wire ferrules from Zoller &amp; Fröhlich — insulated, twin, multi-standard, reel, belt-strip, and uninsulated types. Browse the full range below or go directly to the manufacturer.
            </p>
            <p className="mt-4 text-sm font-semibold text-blue-200">
              {CATEGORIES.length} product categories
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
      </section>

      {/* 8-card grid */}
      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.href}
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[#eef2f7] px-4 py-3">
                <span className="text-sm font-bold text-[#0a1628] group-hover:text-[#2563eb]">
                  {cat.title}
                </span>
                <ArrowUpRight
                  size={14}
                  className="flex-none text-[#93c5fd] transition-transform duration-200 group-hover:text-[#2563eb]"
                />
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
