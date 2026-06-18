import type { NextRequest } from "next/server";
import { proxyLegacyStorefront } from "@/lib/legacyStorefront";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyLegacyStorefront(request, `/catalog/${path.join("/")}`);
}
