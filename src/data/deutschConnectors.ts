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

export const deutschProducts =
  generatedProducts as unknown as DeutschProduct[];

export function getDeutschWebshopUrl(product: DeutschProduct): string {
  return `/webshop/${product.urlPath}`;
}
