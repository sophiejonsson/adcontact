import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Package, FolderTree } from "lucide-react";
import type { Metadata } from "next";
import { BrandCTA } from "@/components/brand/BrandChrome";
import StockoCatalogueClient from "./StockoCatalogueClient";
import {
  getStockoNode,
  getStockoTrail,
  getStockoProductTotal,
  getStockoRepImage,
  getAllStockoNodePaths,
  stockoNodes,
} from "@/data/stockoCatalogue";

type Props = { params: Promise<{ path: string[] }> };

export function generateStaticParams() {
  return getAllStockoNodePaths().map((p) => ({ path: p.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const node = getStockoNode(path.join("/"));
  if (!node) return {};
  const total = getStockoProductTotal(node.path);
  return {
    title: { absolute: `Stocko ${node.title} | Connectors & Terminals | Adcontact` },
    description: `Browse Stocko ${node.title}${
      total ? ` — ${total} parts` : ""
    } from Adcontact, Nordic stocking distributor of Stocko Contact connector systems and terminals.`,
    alternates: {
      canonical: `https://www.adcontact.se/products/stocko/${node.path}`,
    },
  };
}

function CategoryCard({ path }: { path: string }) {
  const node = stockoNodes[path];
  if (!node) return null;
  const total = getStockoProductTotal(path);
  const img = getStockoRepImage(path);
  const isLeaf = node.children.length === 0;

  return (
    <Link
      href={`/products/stocko/${node.path}`}
      className="group flex items-center gap-4 rounded-xl border border-[#e5e7eb] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#bfdbfe] hover:shadow-[0_14px_28px_-18px_rgba(15,23,42,0.25)]"
    >
      {/* Framed reference thumbnail */}
      <div className="relative h-20 w-20 flex-none overflow-hidden rounded-xl border border-[#eef2f7] bg-gradient-to-br from-white to-[#f1f5f9]">
        {img ? (
          <Image
            src={img}
            alt=""
            fill
            sizes="80px"
            className="object-contain p-2.5 mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FolderTree size={24} className="text-[#cbd5e1]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold leading-snug text-[#0a1628] transition-colors group-hover:text-[#2563eb]">
          {node.title}
        </h3>
        <p className="mt-1 text-xs text-[#9ca3af]">
          {isLeaf
            ? `${node.products.length} products`
            : `${node.children.length} sub-categories`}
        </p>
        {total > 0 && (
          <span className="mt-2 inline-block rounded-md bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#475569]">
            {total} parts
          </span>
        )}
      </div>

      <ArrowRight
        size={16}
        className="flex-none text-[#d1d5db] transition-transform group-hover:translate-x-1 group-hover:text-[#2563eb]"
      />
    </Link>
  );
}

export default async function StockoCategoryPage({ params }: Props) {
  const { path } = await params;
  const fullPath = path.join("/");
  const node = getStockoNode(fullPath);
  if (!node) notFound();

  const trail = getStockoTrail(fullPath);
  const total = getStockoProductTotal(fullPath);
  const hasChildren = node.children.length > 0;
  const hasProducts = node.products.length > 0;
  const parentHref = node.parent ? `/products/stocko/${node.parent}` : "/products/stocko";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Compact header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#0a1628] text-white">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div
          className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: "#e4222b", opacity: 0.08 }}
        />
        <div className="relative mx-auto max-w-[1440px] px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-7 flex flex-wrap items-center gap-1.5 text-xs text-[#475569]">
            <Link href="/" className="transition-colors hover:text-white">
              Adcontact
            </Link>
            <ChevronRight size={12} />
            <Link href="/products/stocko" className="transition-colors hover:text-white">
              Stocko
            </Link>
            {trail.map((n, i) => (
              <span key={n.path} className="flex items-center gap-1.5">
                <ChevronRight size={12} />
                {i < trail.length - 1 ? (
                  <Link
                    href={`/products/stocko/${n.path}`}
                    className="transition-colors hover:text-white"
                  >
                    {n.title}
                  </Link>
                ) : (
                  <span className="text-[#93c5fd]">{n.title}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-28 flex-none rounded-lg bg-white px-3 py-2">
                <Image
                  src="/images/Stocko.png"
                  alt="Stocko"
                  fill
                  sizes="112px"
                  className="object-contain p-1.5"
                  unoptimized
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold leading-tight lg:text-4xl">{node.title}</h1>
                <p className="mt-1 text-sm text-[#94a3b8]">
                  {hasChildren
                    ? `${node.children.length} sub-categories · ${total} parts`
                    : `${node.products.length} products`}
                </p>
              </div>
            </div>
            <Link
              href={parentHref}
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a6e] bg-[#1a2f5a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e3a6e]"
            >
              <ChevronRight size={14} className="rotate-180" />
              Back
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-14">
        {/* Sub-categories */}
        {hasChildren && (
          <section className="mb-16">
            <div className="mb-8">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563eb]">
                Browse
              </div>
              <h2 className="text-2xl font-bold text-[#0a1628]">Sub-categories</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {node.children.map((child) => (
                <CategoryCard key={child} path={child} />
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        {hasProducts && (
          <section className="mb-16">
            <div className="mb-8">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563eb]">
                Catalogue
              </div>
              <h2 className="text-2xl font-bold text-[#0a1628]">
                {node.title}{" "}
                <span className="text-base font-normal text-[#9ca3af]">
                  ({node.products.length})
                </span>
              </h2>
            </div>
            <StockoCatalogueClient products={node.products} />
          </section>
        )}

        {/* Empty leaf */}
        {!hasChildren && !hasProducts && (
          <section className="mb-16">
            <div className="flex flex-col items-center rounded-2xl border border-[#e5e7eb] bg-white py-20 text-center">
              <Package size={36} className="mb-4 text-[#cbd5e1]" />
              <h2 className="mb-2 text-lg font-semibold text-[#0a1628]">
                Full range available on request
              </h2>
              <p className="mb-5 max-w-md text-sm text-[#6b7280]">
                We can source the complete Stocko {node.title} range. Send us your specification or
                part number for pricing and availability.
              </p>
              <Link
                href={`/contact?category=${encodeURIComponent(`Stocko ${node.title}`)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
              >
                Request pricing
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}

        <BrandCTA
          title={`Need a specific Stocko ${node.title} part?`}
          body="We stock a wide Stocko range and can source the full Stocko Contact catalogue. Send us your part number or drawing and our technical sales team will respond fast."
        />
      </div>
    </div>
  );
}
