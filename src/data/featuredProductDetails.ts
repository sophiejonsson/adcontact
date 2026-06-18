import generatedDetails from "./generated/featured-product-details.json";
import { featuredProducts } from "./featuredProducts";
import { deutschProducts } from "./deutschConnectors";
import { getProductDetail } from "./deutschProductDetails";
import { getRelatedProduct } from "./relatedProducts";
import type { DrawingFile, RelatedProduct } from "./deutschProductDetails";

export interface FeaturedProductDetail {
  name: string;
  slug: string;
  sourcePath: string;
  imageUrl: string;
  gallery: string[];
  shortDescription: string;
  descriptionHtml: string;
  availability: "in-stock" | "lead-time";
  availabilityNote: string;
  price: string;
  specs: Record<string, string>;
  contacts: RelatedProduct[];
  matingConnectors: RelatedProduct[];
  requiredComponents: RelatedProduct[];
  accessories: RelatedProduct[];
  drawings: DrawingFile[];
}

const crawledDetails =
  generatedDetails as unknown as FeaturedProductDetail[];

const modernSlugs = ["dt06-4s-e008", "dt06-2s-e003", "0460-202-1631"];

function featuredCard(slug: string) {
  return featuredProducts.find(
    (product) => product.href === `/webshop/${slug}.html`,
  );
}

function getModernDetail(slug: string): FeaturedProductDetail | undefined {
  const card = featuredCard(slug);
  if (!card) return undefined;

  const related = getRelatedProduct(slug);
  if (related) {
    return {
      name: related.partNumber,
      slug,
      sourcePath: card.href,
      imageUrl: related.largeImageUrl,
      gallery: [related.largeImageUrl],
      shortDescription: `${related.partNumber} industrial contact by ${related.specs.Brand ?? "Adcontact"}.`,
      descriptionHtml: "",
      availability: related.availability,
      availabilityNote: related.availabilityNote,
      price: card.price,
      specs: related.specs,
      contacts: related.contacts,
      matingConnectors: related.matingConnectors,
      requiredComponents: related.requiredComponents,
      accessories: related.accessories,
      drawings: related.drawings,
    };
  }

  const catalogue = deutschProducts.find(
    (product) => product.partNumber.toLowerCase() === slug,
  );
  if (!catalogue) return undefined;
  const detail = getProductDetail(slug);

  return {
    name: catalogue.partNumber,
    slug,
    sourcePath: card.href,
    imageUrl: detail?.largImageUrl ?? catalogue.imageUrl ?? card.image,
    gallery: [detail?.largImageUrl ?? catalogue.imageUrl ?? card.image],
    shortDescription: `${catalogue.partNumber} ${catalogue.series} sealed connector${catalogue.ways ? `, ${catalogue.ways}-way` : ""}.`,
    descriptionHtml: "",
    availability: catalogue.availability === "quote" ? "in-stock" : "lead-time",
    availabilityNote:
      detail?.availabilityNote ??
      (catalogue.availability === "quote" ? "Available for quote" : "Contact us for lead time"),
    price: card.price,
    specs:
      detail?.specs ?? {
        Brand: "Deutsch",
        Series: catalogue.series,
        ...(catalogue.ways ? { Cavities: String(catalogue.ways) } : {}),
        ...(catalogue.type ? { Type: catalogue.type } : {}),
      },
    contacts: detail?.contacts ?? [],
    matingConnectors: detail?.matingConnectors ?? [],
    requiredComponents: detail?.requiredComponents ?? [],
    accessories: detail?.accessories ?? [],
    drawings: detail?.drawings ?? [],
  };
}

export const featuredProductDetails = [
  ...crawledDetails.map((product) => ({
    ...product,
    price: featuredCard(product.slug)?.price ?? product.price,
  })),
  ...modernSlugs
    .map(getModernDetail)
    .filter((product): product is FeaturedProductDetail => Boolean(product)),
];

export function getFeaturedProductDetail(
  slug: string,
): FeaturedProductDetail | undefined {
  return featuredProductDetails.find((product) => product.slug === slug);
}
