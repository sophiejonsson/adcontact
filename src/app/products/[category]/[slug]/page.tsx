import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import {
  catalogueProductLegacyRoute,
  findCatalogueProductByReference,
} from "@/lib/magentoCatalogue";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateStaticParams() {
  return products.map((p) => ({
    category: p.categorySlug,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} (${product.partNumber})`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const catalogueProduct = findCatalogueProductByReference(product.partNumber);
  redirect(
    catalogueProduct
      ? catalogueProductLegacyRoute(catalogueProduct)
      : `/contact?product=${encodeURIComponent(product.partNumber)}`,
  );
}
