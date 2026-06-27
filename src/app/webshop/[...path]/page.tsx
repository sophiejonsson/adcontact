import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CatalogueCategoryPage from "@/components/catalogue/CatalogueCategoryPage";
import CatalogueProductPage from "@/components/catalogue/CatalogueProductPage";
import {
  getCatalogueCategory,
  getCatalogueProduct,
  resolveCatalogueRoute,
  type CatalogueSearchParams,
  webshopPathFromSegments,
} from "@/lib/magentoCatalogue";
import { deutschProducts } from "@/data/deutschConnectors";
import {
  absoluteUrl,
  categoryMetaDescription,
  categoryTitle,
  productMetaDescription,
  productTitle,
} from "@/lib/seo";

type Props = {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<CatalogueSearchParams>;
};

function canonical(path: string) {
  return absoluteUrl(path);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const routePath = webshopPathFromSegments(path);
  const route = resolveCatalogueRoute(routePath);

  if (!route) return {};

  if (route.type === "product") {
    const product = getCatalogueProduct(route.id);
    if (!product) return {};

    // Redirect pages don't need metadata — the destination generates its own.
    const sku = (product.sku ?? product.name ?? "").toUpperCase();
    const isDeutsch = deutschProducts.some((d) => d.partNumber.toUpperCase() === sku);
    if (isDeutsch) return {};

    const title = productTitle(product);
    const description = productMetaDescription(product);
    return {
      title,
      description,
      alternates: { canonical: canonical(routePath) },
      openGraph: {
        title,
        description,
        url: canonical(routePath),
        type: "website",
        images: product.image ? [{ url: product.image }] : undefined,
      },
    };
  }

  // Redirect pages don't need metadata — the destination generates its own.
  if (route.id === 1711) return {};

  const category = getCatalogueCategory(route.id);
  if (!category) return {};
  const title = categoryTitle(category);
  const description = categoryMetaDescription(category);
  return {
    title,
    description,
    alternates: { canonical: canonical(routePath) },
    openGraph: {
      title,
      description,
      url: canonical(routePath),
      type: "website",
    },
  };
}

export default async function WebshopCatalogueRoute({ params, searchParams }: Props) {
  const { path } = await params;
  const routePath = webshopPathFromSegments(path);
  const route = resolveCatalogueRoute(routePath);
  if (!route) notFound();

  if (route.type === "product") {
    const product = getCatalogueProduct(route.id);
    if (!product) notFound();

    // Deutsch connector products have a richer dedicated page — redirect there.
    const sku = (product.sku ?? product.name ?? "").toUpperCase();
    const deutschMatch = deutschProducts.find(
      (d) => d.partNumber.toUpperCase() === sku,
    );
    if (deutschMatch) {
      permanentRedirect(`/products/deutsch-connectors/${deutschMatch.partNumber.toLowerCase()}`);
    }

    return <CatalogueProductPage product={product} />;
  }

  // Zoller+Fröhlich sealed-connectors category is an empty Magento shell — redirect to brand hub.
  if (route.id === 1711) {
    permanentRedirect("/products/zoller-frohlich");
  }

  const category = getCatalogueCategory(route.id);
  if (!category) notFound();
  return <CatalogueCategoryPage category={category} searchParams={await searchParams} />;
}
