import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Clock, Download, Package, Phone } from "lucide-react";
import { deutschProducts, getDeutschWebshopUrl } from "@/data/deutschConnectors";
import type { DrawingFile, RelatedProduct } from "@/data/deutschProductDetails";
import {
  getRelatedProduct,
  getRelatedProductByPartNumber,
  relatedProducts,
} from "@/data/relatedProducts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return relatedProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getRelatedProduct(slug);
  if (!product) return {};

  const brand = product.specs.Brand ?? "Adcontact";
  const series = product.specs.Series ? ` ${product.specs.Series}.` : "";
  return {
    title: `${product.partNumber} | Adcontact Webshop`,
    description: `${product.partNumber} by ${brand}.${series} View specifications, compatible products, drawings, and availability.`,
    alternates: { canonical: product.sourcePath },
  };
}

function productHref(item: RelatedProduct): string {
  const catalogueProduct = deutschProducts.find(
    (product) => product.partNumber.toLowerCase() === item.partNumber.toLowerCase(),
  );
  if (catalogueProduct) return getDeutschWebshopUrl(catalogueProduct);

  const localProduct = getRelatedProductByPartNumber(item.partNumber);
  if (localProduct) return localProduct.sourcePath;

  if (!item.url) return `/webshop/${item.partNumber.toLowerCase()}.html`;
  try {
    return new URL(item.url).pathname;
  } catch {
    return item.url;
  }
}

function RelatedCard({ item }: { item: RelatedProduct }) {
  const localProduct = getRelatedProductByPartNumber(item.partNumber);
  const imageUrl = localProduct?.imageUrl ?? item.imageUrl;

  return (
    <Link
      href={productHref(item)}
      className="group flex flex-col items-center rounded-xl border border-[#e5e7eb] bg-white p-4 text-center transition-all hover:border-[#2563eb] hover:shadow-sm"
    >
      <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-lg bg-[#f8fafc]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.partNumber}
            fill
            className="object-contain p-2"
            sizes="80px"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={24} className="text-[#d1d5db]" />
          </div>
        )}
      </div>
      <span className="font-mono text-xs font-semibold leading-snug text-[#0a1628] transition-colors group-hover:text-[#2563eb]">
        {item.partNumber}
      </span>
      <span className="mt-2 text-[10px] font-medium text-[#2563eb] opacity-0 transition-opacity group-hover:opacity-100">
        View product →
      </span>
    </Link>
  );
}

function RelatedSection({
  title,
  items,
}: {
  title: string;
  items: RelatedProduct[];
}) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-[#0a1628]">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <RelatedCard key={`${title}-${item.partNumber}`} item={item} />
        ))}
      </div>
    </section>
  );
}

function DownloadRow({ file }: { file: DrawingFile }) {
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 transition-all hover:border-[#2563eb]"
    >
      <div className="flex items-center gap-3">
        <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
          {file.type}
        </span>
        <span className="text-sm text-[#374151]">{file.label}</span>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        {file.size && <span className="text-xs text-[#9ca3af]">{file.size}</span>}
        <Download size={14} className="text-[#9ca3af] group-hover:text-[#2563eb]" />
      </div>
    </a>
  );
}

export default async function StorefrontProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getRelatedProduct(slug);
  if (!product) notFound();

  const brand = product.specs.Brand ?? "Deutsch";
  const series = product.specs.Series;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[#64748b]">
            <Link href="/">Adcontact</Link>
            <ChevronRight size={11} />
            <Link href="/webshop.html">Webshop</Link>
            <ChevronRight size={11} />
            <span className="font-medium text-[#0a1628]">{product.partNumber}</span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="mb-12 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
            <Image
              src={product.largeImageUrl}
              alt={product.partNumber}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {brand}
              </span>
              {series && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {series}
                </span>
              )}
            </div>

            <h1 className="mb-3 font-mono text-3xl font-bold tracking-tight text-[#0a1628] lg:text-4xl">
              {product.partNumber}
            </h1>

            <div className="mb-7 flex w-fit items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white p-3">
              <Clock
                size={14}
                className={product.availability === "in-stock" ? "text-emerald-600" : "text-amber-500"}
              />
              <span
                className={`text-sm font-semibold ${
                  product.availability === "in-stock" ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {product.availabilityNote}
              </span>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3">
              {Object.entries(product.specs)
                .filter(([key]) =>
                  ["Contact Size", "Wire Size", "Current Rating", "Material", "Color", "Connector Style"].includes(key),
                )
                .slice(0, 6)
                .map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-[#e5e7eb] bg-white p-3">
                    <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                      {label}
                    </div>
                    <div className="text-sm font-semibold text-[#0a1628]">{value}</div>
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact?pn=${encodeURIComponent(product.partNumber)}&ref=webshop-product`}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-6 py-3.5 font-semibold text-[#0a1628] transition-colors hover:bg-[#d97706]"
              >
                Request a quote
                <ArrowRight size={15} />
              </Link>
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-6 py-3.5 font-medium text-[#374151]"
              >
                <Phone size={14} />
                Call us
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="mb-4 text-xl font-bold text-[#0a1628]">Technical specifications</h2>
            <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
              {Object.entries(product.specs).map(([label, value], index) => (
                <div
                  key={label}
                  className={`grid gap-2 px-5 py-3 text-sm sm:grid-cols-[240px_1fr] ${
                    index ? "border-t border-[#f1f5f9]" : ""
                  }`}
                >
                  <span className="font-medium text-[#64748b]">{label}</span>
                  <span className="font-semibold text-[#0a1628]">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <RelatedSection title="Contacts" items={product.contacts} />
          <RelatedSection title="Mating connectors" items={product.matingConnectors} />
          <RelatedSection title="Required components" items={product.requiredComponents} />
          <RelatedSection title="Accessories" items={product.accessories} />

          {product.drawings.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-[#0a1628]">Drawings and CAD files</h2>
              <div className="space-y-2">
                {product.drawings.map((file) => (
                  <DownloadRow key={`${file.url}-${file.label}`} file={file} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
