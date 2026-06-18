import catalogue from "@/data/generated/stocko-catalogue.json";

export type StockoProduct = {
  partNumber: string;
  /** Catalogue path (without .html), e.g. "crimp-contacts/receptacles/2-8-mm/rsb-...". */
  path: string;
  image: string | null;
};

export type StockoNode = {
  path: string;
  title: string;
  parent: string | null;
  children: string[];
  products: StockoProduct[];
};

type Catalogue = {
  generatedAt: string;
  roots: string[];
  nodeCount: number;
  productCount: number;
  nodes: Record<string, StockoNode>;
};

const data = catalogue as Catalogue;

export const stockoRoots = data.roots;
export const stockoNodes = data.nodes;
export const stockoProductCount = data.productCount;

export function getStockoNode(path: string): StockoNode | undefined {
  return data.nodes[path];
}

export function getAllStockoNodePaths(): string[] {
  return Object.keys(data.nodes);
}

/** Breadcrumb chain from a root down to (and including) the given node. */
export function getStockoTrail(path: string): StockoNode[] {
  const trail: StockoNode[] = [];
  let current: string | null = path;
  while (current) {
    const node: StockoNode | undefined = data.nodes[current];
    if (!node) break;
    trail.unshift(node);
    current = node.parent;
  }
  return trail;
}

/** Total products contained in a node and all of its descendants. */
export function getStockoProductTotal(path: string): number {
  const node = data.nodes[path];
  if (!node) return 0;
  let total = node.products.length;
  for (const child of node.children) total += getStockoProductTotal(child);
  return total;
}

/** Legacy webshop URL for a catalogue path (used for product detail links). */
export function stockoWebshopUrl(path: string): string {
  return `/webshop/components/sealed-connectors/stocko/${path}.html`;
}

/** First available product image in a node or its descendants, for thumbnails. */
export function getStockoRepImage(path: string): string | null {
  const node = data.nodes[path];
  if (!node) return null;
  const direct = node.products.find((p) => p.image)?.image;
  if (direct) return direct;
  for (const child of node.children) {
    const img = getStockoRepImage(child);
    if (img) return img;
  }
  return null;
}
