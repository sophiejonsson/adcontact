import { NextRequest } from "next/server";
import amfileLookup from "@/data/generated/amfile-lookup.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ fileId: string }>;
};

function validFileId(fileId: string) {
  return /^\d+$/.test(fileId);
}

async function proxyDownload(request: NextRequest, { params }: Context) {
  const { fileId } = await params;
  if (!validFileId(fileId)) {
    return new Response("Invalid file id.", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const origin = process.env.ORDERLAND_MEDIA_ORIGIN;
  if (!origin) {
    return new Response("Download origin is not configured.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Use the direct file path from our local Magento data — the amfilerating
  // download handler on the origin server requires Magento session auth and
  // redirects to the homepage without it.
  const directPath = (amfileLookup as Record<string, string>)[fileId];
  const source = directPath
    ? new URL(directPath, origin)
    : new URL(`/amfilerating/file/download/file_id/${fileId}/`, origin);

  source.search = request.nextUrl.search;

  const upstream = await fetch(source, {
    headers: {
      Accept: request.headers.get("accept") ?? "*/*",
      "User-Agent": "Adcontact catalogue download proxy",
    },
    cache: "no-store",
    redirect: "manual",
  });

  // If the origin redirects (e.g. to the homepage due to missing auth),
  // treat it as not found.
  if (upstream.status >= 300 && upstream.status < 400) {
    return new Response("Download file was not found.", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-adcontact-download-source": source.toString(),
      },
    });
  }

  if (!upstream.ok) {
    return new Response("Download file was not found.", {
      status: upstream.status === 404 ? 404 : 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-adcontact-download-source": source.toString(),
      },
    });
  }

  const headers = new Headers();
  for (const name of [
    "cache-control",
    "content-description",
    "content-disposition",
    "content-length",
    "content-transfer-encoding",
    "content-type",
    "expires",
    "last-modified",
    "pragma",
  ]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-adcontact-download-source", source.toString());

  // Ensure PDF files get a useful Content-Disposition if the origin didn't set one.
  if (!headers.get("content-disposition") && directPath?.endsWith(".pdf")) {
    const filename = directPath.split("/").pop() ?? `file-${fileId}.pdf`;
    headers.set("content-disposition", `attachment; filename="${filename}"`);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}

export async function GET(request: NextRequest, context: Context) {
  return proxyDownload(request, context);
}

export async function HEAD(request: NextRequest, context: Context) {
  const response = await proxyDownload(request, context);
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
