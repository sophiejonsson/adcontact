import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink, ArrowUpRight } from "lucide-react";
import { getBrandBySlug, brands } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  catalogueProductLegacyRoute,
  findCatalogueProductByReference,
} from "@/lib/magentoCatalogue";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} | Distributor & Technical Support`,
    description: brand.shortDescription,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const products = getProductsByBrand(slug);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <Breadcrumbs
            crumbs={[
              { label: "Brands", href: "/brands" },
              { label: brand.name },
            ]}
          />
          <div className="flex items-start justify-between gap-4 mt-4">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {brand.categories.map((cat) => (
                  <span key={cat} className="text-xs text-[#6b7280] font-medium px-2 py-0.5 bg-white border border-[#e2e8f0] rounded capitalize">
                    {cat.replace("-", " ")}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-[#0a1628] mb-2">{brand.name}</h1>
              <p className="text-[#6b7280] text-sm max-w-2xl">{brand.shortDescription}</p>
            </div>
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] text-sm text-[#374151] hover:border-[#2563eb] hover:text-[#2563eb] rounded-md transition-colors"
              >
                <ExternalLink size={13} />
                Manufacturer site
              </a>
            )}
          </div>

          {brand.shopUrl && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-5 py-3.5">
              <span className="text-sm text-[#92400e]">
                Can&apos;t find what you&apos;re looking for? Browse the full range directly with {brand.name}.
              </span>
              <a
                href={brand.shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#b45309] hover:text-[#92400e] transition-colors"
              >
                Browse {brand.name} products
                <ArrowUpRight size={14} />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-[#0a1628] mb-3">About {brand.name}</h2>
            <p className="text-sm text-[#374151] leading-relaxed mb-8">{brand.description}</p>

            {products.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-[#0a1628] mb-4">Products from {brand.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={
                        findCatalogueProductByReference(product.partNumber)
                          ? catalogueProductLegacyRoute(findCatalogueProductByReference(product.partNumber)!)
                          : `/contact?product=${encodeURIComponent(product.partNumber)}`
                      }
                      className="group p-5 bg-white border border-[#e2e8f0] hover:border-[#2563eb] rounded-xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-[#374151] bg-[#f3f4f6] px-2 py-1 rounded">
                          {product.partNumber}
                        </span>
                        {product.available && (
                          <span className="flex items-center gap-1 text-[10px] text-green-600">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Available
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#0a1628] group-hover:text-[#2563eb] transition-colors mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#6b7280] leading-relaxed">{product.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-[#0a1628] mb-4">Enquire about {brand.name} products</h3>
              <p className="text-xs text-[#6b7280] mb-5 leading-relaxed">
                We can provide pricing, availability, and technical specifications for the full {brand.name} product range, including items not shown here.
              </p>
              <Link
                href={`/contact?brand=${encodeURIComponent(brand.name)}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg transition-colors mb-3"
              >
                Request pricing
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/webshop.html"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] text-[#374151] text-sm font-medium rounded-lg transition-colors hover:bg-[#f3f4f6]"
              >
                Browse catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
