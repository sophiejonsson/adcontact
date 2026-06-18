import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogueCategoryPage from "@/components/catalogue/CatalogueCategoryPage";
import CatalogueProductPage from "@/components/catalogue/CatalogueProductPage";
import {
  getCatalogueCategory,
  getCatalogueProduct,
  resolveCatalogueRoute,
  type CatalogueSearchParams,
  webshopPathFromSegments,
} from "@/lib/magentoCatalogue";
import {
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
  return `https://www.adcontact.se${path}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const routePath = webshopPathFromSegments(path);
  const route = resolveCatalogueRoute(routePath);

  if (!route) return {};

  if (route.type === "product") {
    const product = getCatalogueProduct(route.id);
    if (!product) return {};
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
    return <CatalogueProductPage product={product} />;
  }

  const category = getCatalogueCategory(route.id);
  if (!category) notFound();
  return <CatalogueCategoryPage category={category} searchParams={await searchParams} />;
}
