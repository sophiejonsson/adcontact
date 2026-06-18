import { NextRequest, NextResponse } from "next/server";
import { brands } from "@/data/brands";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const featured = request.nextUrl.searchParams.get("featured");
  const category = request.nextUrl.searchParams.get("category");

  let results = [...brands];

  if (featured === "true") {
    results = results.filter((b) => b.featured);
  }

  if (category) {
    results = results.filter((b) => b.categories.includes(category));
  }

  return NextResponse.json({ brands: results, total: results.length });
}
