/** Canonical link to a product's native detail page. Pure — safe for client bundles. */
export function productDetailHref(sku: string): string {
  return `/product/${encodeURIComponent(sku)}`;
}
