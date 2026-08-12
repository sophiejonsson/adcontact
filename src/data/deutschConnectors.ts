import generatedProducts from "./generated/deutsch-products.json";

export interface DeutschProduct {
  partNumber: string;
  series: string;
  ways: number | null;
  type: "Plug" | "Socket" | null;
  availability: "quote" | "lead-time";
  imageUrl: string | null;
  urlPath: string;
}

// Photo overrides for parts whose scraped imageUrl is a no_photo placeholder.
// Keyed by partNumber (uppercase) so a re-export of deutsch-products.json
// doesn't silently drop the fix — see PRODUCT_OVERRIDES in magentoCatalogue.ts
// for the equivalent mechanism on the main catalogue.
const DEUTSCH_IMAGE_OVERRIDES: Record<string, string> = {
  "HDP24-24-18SE-L017": "/media/featured-products/hdp24-24-18se-l017.webp",
};

export const deutschProducts = (
  generatedProducts as unknown as DeutschProduct[]
).map((p) => {
  const override = DEUTSCH_IMAGE_OVERRIDES[p.partNumber.toUpperCase()];
  return override ? { ...p, imageUrl: override } : p;
});

export function getDeutschWebshopUrl(product: DeutschProduct): string {
  return `/webshop/${product.urlPath}`;
}
