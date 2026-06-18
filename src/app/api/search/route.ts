import { NextRequest, NextResponse } from "next/server";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { searchCatalogue } from "@/lib/search";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], categories: [], brands: [] });
  }

  const ql = q.toLowerCase();

  const matchedProducts = searchCatalogue(q, 8).map((r) => ({
    id: r.id,
    partNumber: r.partNumber,
    name: r.name,
    brand: r.brand,
    category: r.category,
    href: r.href,
    available: r.available,
    shortDescription: r.description,
  }));

  const matchedCategories = categories
    .filter(
      (c) =>
        c.name.toLowerCase().includes(ql) ||
        c.tags.some((t) => t.includes(ql))
    )
    .slice(0, 3);

  const matchedBrands = brands
    .filter((b) => b.name.toLowerCase().includes(ql))
    .slice(0, 3);

  return NextResponse.json({
    products: matchedProducts,
    categories: matchedCategories,
    brands: matchedBrands,
    query: q,
  });
}
