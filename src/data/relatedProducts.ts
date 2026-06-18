import generatedProducts from "./generated/related-products.json";
import type { DrawingFile, RelatedProduct } from "./deutschProductDetails";

export interface RelatedProductDetail {
  partNumber: string;
  slug: string;
  sourcePath: string;
  sourceUrl: string;
  imageUrl: string;
  largeImageUrl: string;
  availability: "in-stock" | "lead-time";
  availabilityNote: string;
  specs: Record<string, string>;
  contacts: RelatedProduct[];
  matingConnectors: RelatedProduct[];
  requiredComponents: RelatedProduct[];
  accessories: RelatedProduct[];
  drawings: DrawingFile[];
}

export const relatedProducts =
  generatedProducts as unknown as RelatedProductDetail[];

export function getRelatedProduct(slug: string): RelatedProductDetail | undefined {
  return relatedProducts.find((product) => product.slug === slug);
}

export function getRelatedProductByPartNumber(
  partNumber: string,
): RelatedProductDetail | undefined {
  return relatedProducts.find(
    (product) => product.partNumber.toLowerCase() === partNumber.toLowerCase(),
  );
}
