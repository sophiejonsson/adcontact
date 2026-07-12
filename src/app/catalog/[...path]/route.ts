import { NextResponse, type NextRequest } from "next/server";
import {
  getCatalogueCategory,
  getCatalogueProduct,
  PRODUCT_CANONICAL_ROUTES,
  CATEGORY_CANONICAL_ROUTES,
} from "@/lib/magentoCatalogue";
import { absoluteUrl } from "@/lib/seo";

// Legacy Magento default view URLs (from before the site moved to SEO-friendly
// /webshop/... paths): /catalog/product/view/id/<id>/... and
// /catalog/category/view/id/<id>/.... Resolve the id and 301 straight to the
// matching page on the new site.
//
// This route used to PROXY to LEGACY_WEBSHOP_ORIGIN, which defaults to this
// same domain now that the new site lives at www.adcontact.se, causing a
// self-referencing loop (Vercel returned 508 Loop Detected on every request,
// 2026-07-11/12 incident). Redirecting by id instead of proxying removes the
// loop entirely and needs no external origin.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const [section, action, idKey, idValue] = path;
  const id = idKey === "id" ? Number(idValue) : NaN;

  if (Number.isFinite(id) && action === "view") {
    if (section === "product") {
      const product = getCatalogueProduct(id);
      const route = PRODUCT_CANONICAL_ROUTES[id] ?? product?.route;
      if (route) return NextResponse.redirect(absoluteUrl(route), 301);
    }
    if (section === "category") {
      const category = getCatalogueCategory(id);
      const route = CATEGORY_CANONICAL_ROUTES[id] ?? category?.route;
      if (route) return NextResponse.redirect(absoluteUrl(route), 301);
    }
  }

  return new NextResponse("Not found", { status: 404 });
}
