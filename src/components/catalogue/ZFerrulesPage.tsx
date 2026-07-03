import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { CatalogueCategory } from "@/lib/magentoCatalogue";

const ZOFRE = "https://www.zofre.de" as const;
const FILES = `${ZOFRE}/fileadmin/files/medienverzeichnis/produkte/aeh`;

type FerruleCard = { title: string; href: string; image: string; internalHref?: string };
const CATEGORIES: FerruleCard[] = [
  {
    title: "Insulated ferrules",
    href: `${ZOFRE}/en/ferrules/insulatedferrules`,
    image: `${FILES}/isolierte_aderendh%C3%BClsen/zoller-froehlich-aderendhuelsen-bandware-blau.jpg`,
    internalHref: "/products/zoller-frohlich/ferrules/insulated-ferrules",
  },
  {
    title: "Insulated twin ferrules",
    href: `${ZOFRE}/en/ferrules/insulated-twin-ferrules`,
    image: `${FILES}/isolierte_zwillings_aderendh%C3%BClsen/zoller-froehlich-zwillings-aderendhuelse-als-einzelbeutel-grau.jpg`,
    internalHref: "/products/zoller-frohlich/ferrules/insulated-twin-ferrules",
  },
  {
    title: "Ferrules for multi-standard conductors",
    href: `${ZOFRE}/en/ferrules/insulated-ferrules-for-multi-standard-conductors`,
    image: `${FILES}/isolierte_aderendh%C3%BClsen_f%C3%BCr_multinorm_leitungen/zoller-froehlich-aderendhuelsen-fuer-multinorm-leitungen-menue.jpg`,
    internalHref: "/products/zoller-frohlich/ferrules/multi-standard-conductors",
  },
  {
    title: "Ferrules on reel",
    href: `${ZOFRE}/en/ferrules/ferrules-on-reel`,
    image: `${FILES}/isolierte_aderendh%C3%BClsen_auf_rollen/zoller-froehlich-aderendhuelsen-auf-rolle.jpg`,
    // Reproduced internally (product picture in R2) so visitors stay on our site.
    internalHref: "/products/zoller-frohlich/ferrules/ferrules-on-reel",
  },
  {
    title: "Insulated ferrules as belt-strips",
    href: `${ZOFRE}/en/ferrules/insulated-ferrules-as-belt-strips`,
    image: `${FILES}/isolierte_aderendh%C3%BClsen_als_gurtstreifen/zoller-froehlich-aderendhuelsen-als-grutware-blau.jpg`,
    internalHref: "/products/zoller-frohlich/ferrules/belt-strips",
  },
  {
    title: "Uninsulated ferrules",
    href: `${ZOFRE}/en/ferrules/uninsulated-ferrules`,
    image: `${FILES}/unisolierte_aderendh%C3%BClsen/zoller-froehlich-unisolierte-aderendhuelsen-in-einzelbeutel-menue.jpg`,
    internalHref: "/products/zoller-frohlich/ferrules/uninsulated-ferrules",
  },
  // "Ferrules assortment boxes and case" and "Terminals" intentionally omitted —
  // we don't promote/sell them (available from another supplier if ever needed).
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
              End sleeves and wire ferrules from Zoller &amp; Fröhlich — insulated, twin, multi-standard, reel, belt-strip, and uninsulated types.
            </p>
            <p className="mt-4 text-sm font-semibold text-blue-200">
              {CATEGORIES.length} product categories
            </p>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const cardClass =
              "group flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]";
            const inner = (
              <>
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
                  {cat.internalHref ? (
                    <ArrowRight size={14} className="flex-none text-[#93c5fd] transition-transform duration-200 group-hover:text-[#2563eb]" />
                  ) : (
                    <ArrowUpRight size={14} className="flex-none text-[#93c5fd] transition-transform duration-200 group-hover:text-[#2563eb]" />
                  )}
                </div>
              </>
            );
            // Internal (reproduced) pages keep the visitor on our site; the rest
            // still open the manufacturer page in a new tab for now.
            return cat.internalHref ? (
              <Link key={cat.title} href={cat.internalHref} className={cardClass}>
                {inner}
              </Link>
            ) : (
              <a key={cat.title} href={cat.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                {inner}
              </a>
            );
          })}
        </div>

        {/* Sourcing CTA — same as our other brand pages */}
        <section className="mt-10 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-6 py-7 sm:px-8">
          <h2 className="text-lg font-bold text-[#0a1628] sm:text-xl">Can&apos;t find the exact part?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
            {`We supply the complete Zoller & Fröhlich range, not only what's shown here. Find the exact reference in the Zoller & Fröhlich catalogue, then send it to us and we'll source it for you.`}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="mailto:info@adcontact.se?subject=Sourcing%20request%3A%20Zoller%20%26%20Fr%C3%B6hlich"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Send us the part number
              <ArrowRight size={15} />
            </a>
            <a
              href="https://www.zofre.de/en/ferrules"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] transition-colors hover:text-[#2563eb]"
            >
              View Zoller &amp; Fröhlich catalogue
              <ArrowUpRight size={14} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
