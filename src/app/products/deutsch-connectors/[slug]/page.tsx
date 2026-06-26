import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, Download, Phone, Mail, Clock, Package } from "lucide-react";
import type { Metadata } from "next";
import { getProductDetail, type RelatedProduct, type DrawingFile } from "@/data/deutschProductDetails";
import { deutschProducts, getDeutschWebshopUrl } from "@/data/deutschConnectors";

// Generate pages for ALL products in the catalogue
export function generateStaticParams() {
  return deutschProducts.map((p) => ({ slug: p.partNumber.toLowerCase() }));
}

const SERIES_LABELS: Record<string, string> = {
  DT: "DT Series",
  DT13: "DT13 Flanged Series",
  DT15: "DT15 Flanged Series",
  DTF13: "DTF13 Flanged Series",
  DTF15: "DTF15 Flanged Series",
  DTM: "DTM Miniature Series",
  DTP: "DTP Power Series",
  HDP: "HDP Heavy Power Series",
  JS: "JS Series",
  SRK: "SRK Series",
  AT: "AT Series",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const catalogueProduct = deutschProducts.find((p) => p.partNumber.toLowerCase() === slug);
  if (!catalogueProduct) return {};
  const detail = getProductDetail(slug);
  return {
    title: `${catalogueProduct.partNumber} | Deutsch Connector | Adcontact`,
    description: detail
      ? `${catalogueProduct.partNumber}: ${detail.specs["Series"] ?? "Deutsch"} sealed connector, ${detail.specs["No. of cavities"] ?? ""} way, contact size ${detail.specs["Contact Size"] ?? ""}. Request a quote from Adcontact Sweden.`
      : `${catalogueProduct.partNumber}: ${SERIES_LABELS[catalogueProduct.series] ?? catalogueProduct.series} sealed connector${catalogueProduct.ways ? `, ${catalogueProduct.ways}-way` : ""}. Request a quote from Adcontact Sweden.`,
    alternates: {
      canonical: getDeutschWebshopUrl(catalogueProduct),
    },
  };
}

const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: "bg-red-50 text-red-700 border-red-200",
  dxf: "bg-blue-50 text-blue-700 border-blue-200",
  step: "bg-green-50 text-green-700 border-green-200",
  iges: "bg-purple-50 text-purple-700 border-purple-200",
  tif: "bg-amber-50 text-amber-700 border-amber-200",
  zip: "bg-slate-50 text-slate-700 border-slate-200",
};

const SERIES_COLORS: Record<string, string> = {
  DT: "bg-blue-50 text-blue-700 border-blue-200",
  DT13: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DT15: "bg-violet-50 text-violet-700 border-violet-200",
  DTF13: "bg-purple-50 text-purple-700 border-purple-200",
  DTF15: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  DTM: "bg-sky-50 text-sky-700 border-sky-200",
  DTP: "bg-amber-50 text-amber-700 border-amber-200",
  HDP: "bg-orange-50 text-orange-700 border-orange-200",
  JS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SRK: "bg-teal-50 text-teal-700 border-teal-200",
  AT: "bg-green-50 text-green-700 border-green-200",
};

function localStorefrontUrl(url: string | undefined, partNumber: string): string {
  if (!url) return `/webshop/${partNumber.toLowerCase()}.html`;

  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function RelatedCard({ item }: { item: RelatedProduct }) {
  const catalogueProduct = deutschProducts.find(
    (product) => product.partNumber.toLowerCase() === item.partNumber.toLowerCase(),
  );
  const href = catalogueProduct
    ? getDeutschWebshopUrl(catalogueProduct)
    : localStorefrontUrl(item.url, item.partNumber);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#bfdbfe] hover:shadow-[0_16px_30px_-16px_rgba(15,23,42,0.22)]"
    >
      {/* Media, edge-to-edge on white so the product photo blends in with no inner frame */}
      <div className="relative aspect-square w-full bg-white">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={`Deutsch ${item.partNumber}`}
            fill
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 45vw, 160px"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f8fafc]">
            <Package size={28} className="text-[#cbd5e1]" />
          </div>
        )}
      </div>
      {/* Label */}
      <div className="border-t border-[#f1f5f9] px-3 py-2.5 text-center">
        <span className="font-mono text-xs font-semibold text-[#0a1628] transition-colors group-hover:text-[#2563eb]">
          {item.partNumber}
        </span>
      </div>
    </Link>
  );
}

function DownloadRow({ file }: { file: DrawingFile }) {
  const colorClass = FILE_TYPE_COLORS[file.type] ?? FILE_TYPE_COLORS.zip;
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-4 py-3 px-4 bg-white border border-[#e5e7eb] hover:border-[#2563eb] rounded-lg transition-all group"
    >
      <div className="flex items-center gap-3">
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${colorClass}`}>{file.type}</span>
        <span className="text-sm text-[#374151] group-hover:text-[#0a1628] transition-colors">{file.label}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {file.size && <span className="text-xs text-[#9ca3af]">{file.size}</span>}
        <Download size={14} className="text-[#9ca3af] group-hover:text-[#2563eb] transition-colors" />
      </div>
    </a>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const catalogueProduct = deutschProducts.find((p) => p.partNumber.toLowerCase() === slug);
  if (!catalogueProduct) notFound();

  const detail = getProductDetail(slug);
  const partNumber = catalogueProduct.partNumber;
  const seriesLabel = SERIES_LABELS[catalogueProduct.series] ?? catalogueProduct.series;
  const seriesColor = SERIES_COLORS[catalogueProduct.series] ?? "bg-slate-50 text-slate-700 border-slate-200";

  // Use large image from detail if available, else CDN thumbnail
  const mainImage = detail?.largImageUrl ?? catalogueProduct.imageUrl;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-[1440px] mx-auto px-6 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[#64748b]">
            <Link href="/" className="hover:text-[#0a1628] transition-colors">Adcontact</Link>
            <ChevronRight size={11} />
            <Link href="/webshop.html" className="hover:text-[#0a1628] transition-colors">Webshop</Link>
            <ChevronRight size={11} />
            <Link href="/webshop/components/sealed-connectors/deutsch/connectors.html" className="hover:text-[#0a1628] transition-colors">Deutsch Connectors</Link>
            <ChevronRight size={11} />
            <span className="text-[#0a1628] font-medium">{partNumber}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-10">
        {/* ── Top section ───────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Product image */}
          <div>
            <div className="relative aspect-square max-w-md w-full bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={partNumber}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={64} className="text-[#d1d5db]" />
                </div>
              )}
            </div>
          </div>

          {/* Key info */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${seriesColor}`}>
                {catalogueProduct.series}
              </span>
              {catalogueProduct.ways !== null && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {catalogueProduct.ways}-way
                </span>
              )}
              {catalogueProduct.type && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  catalogueProduct.type === "Socket"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-violet-50 text-violet-700 border-violet-200"
                }`}>
                  {catalogueProduct.type}
                </span>
              )}
              <span className="text-xs text-[#64748b]">Deutsch</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-[#0a1628] mb-2 font-mono tracking-tight">
              {partNumber}
            </h1>
            <p className="text-[#64748b] text-sm mb-5">
              {seriesLabel}
              {catalogueProduct.ways !== null ? ` · ${catalogueProduct.ways}-way` : ""}
              {catalogueProduct.type ? ` · ${catalogueProduct.type}` : ""}
              {detail?.specs["Contact Size"] ? ` · Size ${detail.specs["Contact Size"]} contacts` : ""}
            </p>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-white border border-[#e5e7eb] rounded-lg w-fit">
              <Clock size={14} className={catalogueProduct.availability === "quote" ? "text-emerald-600" : "text-amber-500"} />
              <span className={`text-sm font-semibold ${catalogueProduct.availability === "quote" ? "text-emerald-700" : "text-amber-700"}`}>
                {catalogueProduct.availability === "quote" ? "Available for quote" : "Lead time"}
              </span>
              {detail?.availabilityNote && (
                <span className="text-xs text-[#64748b]">{detail.availabilityNote}</span>
              )}
            </div>

            {/* Quick specs, from detail if available, else from catalogue data */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {detail ? (
                [
                  { label: "Cavities", value: detail.specs["No. of cavities"] },
                  { label: "Contact size", value: detail.specs["Contact Size"] },
                  { label: "Current rating", value: detail.specs["Current Rating"] },
                  { label: "Wire size (AWG)", value: detail.specs["Wire Size (AWG)"] ?? detail.specs["Wire Size"] },
                  { label: "Color", value: detail.specs["Color"] },
                  { label: "Required wedgelock", value: detail.specs["Required Wedgelock"] },
                ]
                  .filter((s) => s.value)
                  .map((s) => (
                    <div key={s.label} className="bg-white border border-[#e5e7eb] rounded-lg p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-0.5">{s.label}</div>
                      <div className="text-sm font-semibold text-[#0a1628]">{s.value}</div>
                    </div>
                  ))
              ) : (
                [
                  catalogueProduct.ways !== null && { label: "Cavities", value: String(catalogueProduct.ways) },
                  catalogueProduct.type && { label: "Type", value: catalogueProduct.type },
                  { label: "Series", value: seriesLabel },
                  { label: "Brand", value: "Deutsch" },
                ]
                  .filter(Boolean)
                  .map((s) => s && (
                    <div key={s.label} className="bg-white border border-[#e5e7eb] rounded-lg p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-0.5">{s.label}</div>
                      <div className="text-sm font-semibold text-[#0a1628]">{s.value}</div>
                    </div>
                  ))
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/contact?pn=${encodeURIComponent(partNumber)}&ref=product-detail`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1628] font-semibold rounded-lg transition-colors"
              >
                Request a quote
                <ArrowRight size={15} />
              </Link>
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#f8fafc] border border-[#e5e7eb] text-[#374151] font-medium rounded-lg transition-colors"
              >
                <Phone size={14} />
                Call us
              </a>
              <a
                href={`mailto:info@adcontact.se?subject=Quote request: ${partNumber}`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#f8fafc] border border-[#e5e7eb] text-[#374151] font-medium rounded-lg transition-colors"
              >
                <Mail size={14} />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* ── Full spec table (only if rich data exists) ─────────────────── */}
        {detail && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-[#0a1628] mb-4">Technical specifications</h2>
            <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#f1f5f9]">
                  {Object.entries(detail.specs).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                      <td className="px-5 py-3 font-medium text-[#64748b] w-56 text-xs uppercase tracking-wide">{key}</td>
                      <td className="px-5 py-3 font-semibold text-[#0a1628]">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Related products (only if rich data) ──────────────────────── */}
        {detail && (
          <>
            <div className="grid lg:grid-cols-2 gap-10 mb-12">
              {detail.contacts.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#0a1628] mb-4">Compatible contacts</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {detail.contacts.map((c) => <RelatedCard key={c.partNumber} item={c} />)}
                  </div>
                </section>
              )}
              {detail.matingConnectors.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#0a1628] mb-4">Mating connectors</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {detail.matingConnectors.map((c) => <RelatedCard key={c.partNumber} item={c} />)}
                  </div>
                </section>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-10 mb-12">
              {detail.requiredComponents.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#0a1628] mb-1">Required components</h2>
                  <p className="text-xs text-[#64748b] mb-4">Must be ordered together with the housing.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {detail.requiredComponents.map((c) => <RelatedCard key={c.partNumber} item={c} />)}
                  </div>
                </section>
              )}
              {detail.accessories.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#0a1628] mb-4">Accessories</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {detail.accessories.map((c) => <RelatedCard key={c.partNumber} item={c} />)}
                  </div>
                </section>
              )}
            </div>

            {detail.drawings.length > 0 && (
              <section className="mb-12">
                <h2 className="text-lg font-bold text-[#0a1628] mb-4">Drawings & CAD files</h2>
                <div className="space-y-2">
                  {detail.drawings.map((file) => <DownloadRow key={file.url} file={file} />)}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── No rich data, info note ──────────────────────────────────── */}
        {!detail && (
          <div className="mb-12 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-5">
            <p className="text-sm text-[#1d4ed8]">
              Full technical specifications, compatible contacts, mating connectors, and CAD drawings are available on request. Contact our Bromma office for the complete datasheet.
            </p>
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="bg-[#0a1628] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-20" />
          <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Ready to order {partNumber}?</h2>
              <p className="text-[#94a3b8] text-sm">
                Our Bromma team can advise on contact selection, tooling, and compatible accessories.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href={`/contact?pn=${encodeURIComponent(partNumber)}&ref=product-cta`}
                className="flex items-center gap-2 px-6 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1628] font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Request a quote <ArrowRight size={14} />
              </Link>
              <Link
                href="/webshop/components/sealed-connectors/deutsch/connectors.html#catalogue"
                className="flex items-center gap-2 px-6 py-3 bg-[#1a2f5a] hover:bg-[#1e3a6e] text-white font-medium rounded-lg transition-colors border border-[#1e3a6e] whitespace-nowrap"
              >
                ← Back to catalogue
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
