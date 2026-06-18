import type { NextRequest } from "next/server";

const LEGACY_ORIGIN =
  process.env.LEGACY_WEBSHOP_ORIGIN ?? "https://www.adcontact.se";

export async function proxyLegacyStorefront(
  request: NextRequest,
  sourcePath: string,
) {
  const sourceUrl = new URL(sourcePath, LEGACY_ORIGIN);
  sourceUrl.search = request.nextUrl.search;

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: request.headers.get("accept") ?? "text/html",
        "Accept-Language": request.headers.get("accept-language") ?? "en",
        "User-Agent": "Adcontact webshop migration proxy",
      },
      next: { revalidate: 3600 },
    });

    const headers = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    headers.set("x-adcontact-legacy-source", sourceUrl.pathname);

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch {
    return new Response("The requested webshop page is temporarily unavailable.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
