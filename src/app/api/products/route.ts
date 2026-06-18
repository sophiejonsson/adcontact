import { NextRequest, NextResponse } from "next/server";
import { products, searchProducts } from "@/data/products";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  let results = q ? searchProducts(q) : [...products];

  if (category) {
    results = results.filter((p) => p.categorySlug === category);
  }

  if (brand) {
    results = results.filter((p) => p.brandSlug === brand);
  }

  if (featured === "true") {
    results = results.filter((p) => p.featured);
  }

  const total = results.length;
  const offset = (page - 1) * limit;
  const paged = results.slice(offset, offset + limit);

  return NextResponse.json({
    products: paged,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
}
