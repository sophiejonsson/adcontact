import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Mail,
  Package,
  Phone,
  ShieldCheck,
} from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import {
  featuredProductDetails,
  getFeaturedProductDetail,
} from "@/data/featuredProductDetails";
import type { DrawingFile, RelatedProduct } from "@/data/deutschProductDetails";

export function generateStaticParams() {
  return featuredProductDetails.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getFeaturedProductDetail(slug);
  if (!product) return {};

  return {
    title: `${product.name} | Adcontact Webshop`,
    description:
      product.shortDescription ||
      `View specifications and request a quote for ${product.name} from Adcontact.`,
    alternates: { canonical: product.sourcePath },
  };
}

function RelatedCard({ item }: { item: RelatedProduct }) {
  let href = item.url ?? `/webshop/${item.partNumber.toLowerCase()}.html`;
  try {
    href = new URL(href).pathname;
  } catch {
    // Already a local path.
  }

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-[#e5eaf0] bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-[#bfdbfe] hover:shadow-[0_14px_30px_-22px_rgba(15,23,42,0.35)]"
    >
      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-[#f8fafc]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.partNumber}
            fill
            className="object-contain p-2"
            sizes="64px"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={22} className="text-[#cbd5e1]" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-sm font-bold text-[#0a1628] group-hover:text-[#2563eb]">
          {item.partNumber}
        </p>
        <p className="mt-1 text-xs text-[#94a3b8]">View product</p>
      </div>
      <ArrowRight
        size={15}
        className="ml-auto flex-none text-[#94a3b8] transition-transform group-hover:translate-x-0.5"
      />
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
      <h2 className="mb-5 text-xl font-bold text-[#0a1628]">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      className="group flex items-center gap-4 rounded-2xl border border-[#e5eaf0] bg-white p-4 transition-all hover:border-[#bfdbfe] hover:shadow-sm"
    >
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
        <FileText size={19} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#0a1628]">{file.label}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-[#94a3b8]">
          {file.type}
          {file.size ? ` · ${file.size}` : ""}
        </p>
      </div>
      <Download
        size={16}
        className="ml-auto flex-none text-[#94a3b8] group-hover:text-[#2563eb]"
      />
    </a>
  );
}

export default async function FeaturedProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getFeaturedProductDetail(slug);
  if (!product) notFound();

  const brand =
    product.specs.Brand ??
    product.specs["Crimping equipment Brands"] ??
    product.specs["Stripping machine Brands"] ??
    product.specs["Cutting machine Brands"] ??
    product.specs["Miscellaneous Brands"] ??
    "Adcontact";
  const descriptionIsUseful =
    product.descriptionHtml &&
    !["n/a", product.name.toLowerCase(), product.slug].includes(
      product.descriptionHtml.trim().toLowerCase(),
    );
  const quickSpecs = Object.entries(product.specs).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="border-b border-[#e5eaf0] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-3.5">
          <nav className="flex items-center gap-1.5 overflow-hidden text-xs text-[#64748b]">
            <Link href="/" className="hover:text-[#2563eb]">
              Home
            </Link>
            <ChevronRight size={11} className="flex-none" />
            <Link href="/webshop.html" className="hover:text-[#2563eb]">
              Webshop
            </Link>
            <ChevronRight size={11} className="flex-none" />
            <span className="truncate font-medium text-[#0a1628]">{product.name}</span>
          </nav>
        </div>
      </div>

      <main>
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
            <ProductGallery images={product.gallery} name={product.name} />

            <div className="flex flex-col justify-center">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-xs font-semibold text-[#1d4ed8]">
                  {brand}
                </span>
                {product.specs.Series && (
                  <span className="rounded-full bg-[#f1f5f9] px-3 py-1.5 text-xs font-semibold text-[#475569]">
                    {product.specs.Series}
                  </span>
                )}
              </div>

              <h1 className="max-w-2xl text-[36px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#0a1628] lg:text-[48px]">
                {product.name}
              </h1>

              {product.shortDescription &&
                product.shortDescription.toLowerCase() !== product.name.toLowerCase() && (
                  <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#64748b]">
                    {product.shortDescription}
                  </p>
                )}

              {quickSpecs.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-[#e5eaf0] py-6">
                  {quickSpecs.map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-[#0a1628]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-[#dbe3ee] bg-[#f8fafc] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#64748b]">Price and availability</p>
                    <p className="mt-1 text-xl font-bold text-[#0a1628]">{product.price}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#475569]">
                    {product.availability === "in-stock" ? (
                      <CheckCircle2 size={17} className="text-emerald-600" />
                    ) : (
                      <Clock3 size={17} className="text-amber-500" />
                    )}
                    {product.availabilityNote}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <Link
                    href={`/contact?pn=${encodeURIComponent(product.name)}&ref=featured-product`}
                    className="btn-elevate inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
                  >
                    Request a quote
                    <ArrowRight size={15} />
                  </Link>
                  <a
                    href="tel:+46084453600"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe3ee] bg-white px-4 py-3.5 text-sm font-semibold text-[#334155] hover:border-[#94a3b8]"
                  >
                    <Phone size={15} />
                    Call
                  </a>
                  <a
                    href={`mailto:info@adcontact.se?subject=${encodeURIComponent(`Product enquiry: ${product.name}`)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe3ee] bg-white px-4 py-3.5 text-sm font-semibold text-[#334155] hover:border-[#94a3b8]"
                  >
                    <Mail size={15} />
                    Email
                  </a>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#64748b]">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#2563eb]" />
                  Technical sales support
                </span>
                <span className="flex items-center gap-2">
                  <Package size={14} className="text-[#2563eb]" />
                  Nordic industrial supply
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1440px] space-y-14 px-6 py-14 lg:py-20">
          {descriptionIsUseful && (
            <section className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
                  Product overview
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">Details</h2>
              </div>
              <div
                className="rounded-[24px] border border-[#e5eaf0] bg-white p-6 text-[15px] leading-7 text-[#475569] shadow-[0_16px_40px_-32px_rgba(15,23,42,0.3)] sm:p-8 [&_a]:font-semibold [&_a]:text-[#2563eb] [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0a1628] [&_h4]:mb-3 [&_h4]:mt-7 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#0a1628] [&_h5]:mb-3 [&_h5]:mt-6 [&_h5]:text-base [&_h5]:font-bold [&_h5]:text-[#0a1628] [&_li]:mb-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </section>
          )}

          {Object.keys(product.specs).length > 0 && (
            <section className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
                  Product data
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">
                  Technical specifications
                </h2>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-[#e5eaf0] bg-white">
                {Object.entries(product.specs).map(([label, value], index) => (
                  <div
                    key={label}
                    className={`grid gap-1 px-5 py-4 text-sm sm:grid-cols-[minmax(180px,0.38fr)_1fr] sm:px-7 ${
                      index ? "border-t border-[#edf1f5]" : ""
                    }`}
                  >
                    <span className="font-medium text-[#64748b]">{label}</span>
                    <span className="font-semibold text-[#0a1628]">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {product.drawings.length > 0 && (
            <section className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
                  Documentation
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">
                  Downloads and CAD
                </h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {product.drawings.map((file) => (
                  <DownloadRow key={`${file.url}-${file.label}`} file={file} />
                ))}
              </div>
            </section>
          )}

          <RelatedSection title="Compatible contacts" items={product.contacts} />
          <RelatedSection title="Mating connectors" items={product.matingConnectors} />
          <RelatedSection title="Required components" items={product.requiredComponents} />
          <RelatedSection title="Accessories" items={product.accessories} />

          <section className="flex flex-col items-start justify-between gap-5 rounded-[28px] bg-[#0a1628] p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <h2 className="text-2xl font-bold text-white">Need help specifying this product?</h2>
              <p className="mt-2 text-sm text-[#94a3b8]">
                Our technical sales team can help confirm compatibility and availability.
              </p>
            </div>
            <Link
              href={`/contact?pn=${encodeURIComponent(product.name)}&ref=featured-product-footer`}
              className="inline-flex flex-none items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0a1628] transition-colors hover:bg-[#eff6ff]"
            >
              Contact a specialist
              <ArrowRight size={15} />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
