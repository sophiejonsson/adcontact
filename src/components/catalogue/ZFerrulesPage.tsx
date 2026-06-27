import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  getCategoryChildren,
  type CatalogueCategory,
} from "@/lib/magentoCatalogue";

const BASE = "https://www.adcontact.se";

function cdnSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("/") ? `${BASE}${path}` : path;
}

function getLeafCategories(cat: CatalogueCategory): CatalogueCategory[] {
  const children = getCategoryChildren(cat);
  if (children.length === 0) return [cat];
  return children.flatMap(getLeafCategories);
}

export default function ZFerrulesPage({ category }: { category: CatalogueCategory }) {
  const ferruleTypes = getLeafCategories(category);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
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
              End sleeves and wire ferrules from Zoller &amp; Fröhlich — single bag, multiple bag, reel, belt-strips, and uninsulated types across a full range of cross-sections.
            </p>
            <p className="mt-4 text-sm font-semibold text-blue-200">
              {ferruleTypes.length} product categories
            </p>
            <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3">
              <span className="text-sm text-[#94a3b8]">
                Can&apos;t find what you&apos;re looking for? Browse the full range directly with Zoller &amp; Fröhlich.
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

      <main className="mx-auto max-w-[1440px] px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ferruleTypes.map((type) => {
            const img = cdnSrc(type.image);
            return (
              <Link
                key={type.id}
                href={type.route ?? "#"}
                className="group overflow-hidden rounded-xl border border-[#d8dee7] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
              >
                <div className="relative flex aspect-square items-center justify-center bg-[#f8fafc]">
                  {img ? (
                    <Image
                      src={img}
                      alt={type.name ?? ""}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
                      className="object-contain p-6 transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-[#e5e7eb]" />
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-[#eef2f7] p-4">
                  <h3 className="text-sm font-bold text-[#0a1628] group-hover:text-[#2563eb]">
                    {type.name}
                  </h3>
                  <ArrowRight
                    size={14}
                    className="flex-none text-[#93c5fd] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#2563eb]"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
