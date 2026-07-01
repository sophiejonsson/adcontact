import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CatalogueCategoryPage from "@/components/catalogue/CatalogueCategoryPage";
import CatalogueProductPage from "@/components/catalogue/CatalogueProductPage";
import ZFerrulesPage from "@/components/catalogue/ZFerrulesPage";
import StockoConnectorSystemsPage from "@/components/catalogue/StockoConnectorSystemsPage";
import {
  getCatalogueCategory,
  getCatalogueProduct,
  resolveCatalogueRoute,
  type CatalogueSearchParams,
  webshopPathFromSegments,
} from "@/lib/magentoCatalogue";
import { deutschProducts } from "@/data/deutschConnectors";
import { getStockoPitchGroupByCategoryRoute } from "@/data/stockoConnectorSystems";

// Stocko "Connector Systems" category (125) and its pitch sub-categories have
// 0 Magento products — those series were never imported, but they exist on
// the manufacturer's own site. Render the scraped reference data instead of
// an empty category page.
const STOCKO_CONNECTOR_SYSTEMS_CATEGORY_ID = 125;
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
    const sku = (product.sku ?? "").toUpperCase();
    const name = (product.name ?? "").toUpperCase();
    const isDeutsch = deutschProducts.some(
      (d) => d.partNumber.toUpperCase() === sku || d.partNumber.toUpperCase() === name,
    );
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
    if (!product || product.status !== "enabled") notFound();

    // Deutsch connector products have a richer dedicated page — redirect there.
    // Match by SKU first; fall back to product name (some Magento entries use a
    // numeric TE part number as the SKU rather than the Deutsch part number).
    const sku = (product.sku ?? "").toUpperCase();
    const name = (product.name ?? "").toUpperCase();
    const deutschMatch = deutschProducts.find(
      (d) => d.partNumber.toUpperCase() === sku || d.partNumber.toUpperCase() === name,
    );
    if (deutschMatch) {
      permanentRedirect(`/products/deutsch-connectors/${deutschMatch.partNumber.toLowerCase()}`);
    }

    return <CatalogueProductPage product={product} />;
  }

  const category = getCatalogueCategory(route.id);
  if (!category) notFound();

  // Z+F Wire Ferrules hub — dedicated visual layout with partner link
  if (category.id === 1711) {
    return <ZFerrulesPage category={category} />;
  }

  // Stocko Connector Systems hub and its pitch sub-categories — no Magento
  // products exist here, so show the manufacturer-sourced reference page.
  if (category.id === STOCKO_CONNECTOR_SYSTEMS_CATEGORY_ID) {
    return <StockoConnectorSystemsPage category={category} />;
  }
  if (category.parentId === STOCKO_CONNECTOR_SYSTEMS_CATEGORY_ID) {
    const pitchGroup = category.route
      ? getStockoPitchGroupByCategoryRoute(category.route)
      : undefined;
    return <StockoConnectorSystemsPage category={category} pitchGroup={pitchGroup} />;
  }

  return <CatalogueCategoryPage category={category} searchParams={await searchParams} />;
}
