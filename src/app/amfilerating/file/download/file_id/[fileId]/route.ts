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

  const directPath = (amfileLookup as Record<string, string>)[fileId];

  // Primary: Cloudflare R2 (same bucket the /media proxy uses). The bucket IS
  // the old "media" folder, so the object key drops the leading /media/.
  // Falls through to Oderland below if R2 isn't configured or the file isn't
  // there yet — this used to go straight to Oderland with no R2 attempt at
  // all, which would have broken every drawing/CAD download the moment
  // Oderland is decommissioned, even though the files are already in R2.
  const r2Origin = process.env.R2_MEDIA_ORIGIN;
  if (directPath && r2Origin) {
    const r2Source = new URL(directPath.replace(/^\/media\//, "/"), r2Origin);
    r2Source.search = request.nextUrl.search;
    const r2Upstream = await fetch(r2Source, {
      headers: { Accept: request.headers.get("accept") ?? "*/*", "User-Agent": "Adcontact catalogue download proxy" },
      cache: "no-store",
    });
    if (r2Upstream.ok) {
      const headers = new Headers();
      for (const name of ["cache-control", "content-length", "content-type", "etag", "last-modified"]) {
        const value = r2Upstream.headers.get(name);
        if (value) headers.set(name, value);
      }
      headers.set("x-adcontact-download-source", r2Source.toString());
      if (!headers.get("content-disposition") && directPath.endsWith(".pdf")) {
        const filename = directPath.split("/").pop() ?? `file-${fileId}.pdf`;
        headers.set("content-disposition", `attachment; filename="${filename}"`);
      }
      return new Response(r2Upstream.body, { status: r2Upstream.status, headers });
    }
  }

  const origin = process.env.ORDERLAND_MEDIA_ORIGIN;
  if (!origin) {
    return new Response("Download origin is not configured.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Fallback: the amfilerating download handler on the Oderland origin
  // requires Magento session auth and redirects to the homepage without it,
  // so fetch the direct file path instead.
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
