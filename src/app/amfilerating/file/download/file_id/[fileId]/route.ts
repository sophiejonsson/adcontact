import { NextRequest } from "next/server";

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

  const source = new URL(`/amfilerating/file/download/file_id/${fileId}/`, origin);
  source.search = request.nextUrl.search;

  const upstream = await fetch(source, {
    headers: {
      Accept: request.headers.get("accept") ?? "*/*",
      "User-Agent": "Adcontact catalogue download proxy",
    },
    cache: "no-store",
  });

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
