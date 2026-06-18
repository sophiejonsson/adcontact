import generatedDetails from "./generated/deutsch-product-details.json";

export interface RelatedProduct {
  partNumber: string;
  imageUrl: string | null;
  url?: string;
}

export interface DrawingFile {
  label: string;
  type: "pdf" | "dxf" | "step" | "iges" | "tif" | "zip";
  url: string;
  size?: string;
}

export interface DeutschProductDetail {
  partNumber: string;
  slug: string;
  imageUrl: string;
  largImageUrl: string;
  availability: "quote" | "lead-time";
  availabilityNote: string;
  specs: Record<string, string>;
  contacts: RelatedProduct[];
  matingConnectors: RelatedProduct[];
  requiredComponents: RelatedProduct[];
  accessories: RelatedProduct[];
  drawings: DrawingFile[];
}

export const deutschProductDetails =
  generatedDetails as unknown as DeutschProductDetail[];

export function getProductDetail(slug: string): DeutschProductDetail | undefined {
  return deutschProductDetails.find((product) => product.slug === slug);
}
