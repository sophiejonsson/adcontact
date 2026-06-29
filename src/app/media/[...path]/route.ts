import { readdir, readFile, stat } from "node:fs/promises";
import { basename, extname, join, normalize, relative, sep } from "node:path";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_MEDIA_ROOT = join(process.cwd(), "public", "media");
const PUBLIC_IMAGES_ROOT = join(process.cwd(), "public", "images");
const PLACEHOLDER_IMAGE = "placeholders_small_1.png";
const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".webp": "image/webp",
};
const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"]);
let publicImageIndex: Promise<Map<string, string>> | null = null;

type Context = {
  params: Promise<{ path: string[] }>;
};

function safeRelativePath(parts: string[]): string | null {
  const decoded = parts.map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });
  const relativePath = normalize(decoded.join("/"));
  if (
    !relativePath ||
    relativePath === "." ||
    relativePath.startsWith("..") ||
    relativePath.includes(`${sep}..${sep}`)
  ) {
    return null;
  }
  return relativePath.replace(/^[/\\]+/, "");
}

function contentTypeFor(path: string) {
  return CONTENT_TYPES[extname(path).toLowerCase()] ?? "application/octet-stream";
}

async function serveLocalMedia(relativePath: string) {
  const absolutePath = join(PUBLIC_MEDIA_ROOT, relativePath);
  if (!absolutePath.startsWith(`${PUBLIC_MEDIA_ROOT}${sep}`)) return null;

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) return null;
    const body = await readFile(absolutePath);
    return new Response(body, {
      headers: {
        "cache-control": CACHE_CONTROL,
        "content-length": String(fileStat.size),
        "content-type": contentTypeFor(relativePath),
        "x-adcontact-media-source": "local",
      },
    });
  } catch {
    return null;
  }
}

async function servePublicImageFallback(relativePath: string) {
  const filename = basename(relativePath);
  if (!filename || filename === "." || filename === "..") return null;
  if (!IMAGE_EXTENSIONS.has(extname(filename).toLowerCase())) return null;

  const imageIndex = await getPublicImageIndex();
  const absolutePath =
    imageIndex.get(filename.toLowerCase()) ??
    imageIndex.get(normalizedImageKey(filename)) ??
    imageIndex.get(productCodeImageKey(filename));
  if (!absolutePath || !absolutePath.startsWith(`${PUBLIC_IMAGES_ROOT}${sep}`)) return null;

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) return null;
    const body = await readFile(absolutePath);
    return new Response(body, {
      headers: {
        "cache-control": CACHE_CONTROL,
        "content-length": String(fileStat.size),
        "content-type": contentTypeFor(absolutePath),
        "x-adcontact-media-source": `public-images-fallback:${relative(PUBLIC_IMAGES_ROOT, absolutePath)}`,
      },
    });
  } catch {
    return null;
  }
}

async function servePlaceholderImage(relativePath: string) {
  if (!IMAGE_EXTENSIONS.has(extname(relativePath).toLowerCase())) return null;
  const absolutePath = join(PUBLIC_IMAGES_ROOT, PLACEHOLDER_IMAGE);

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) return null;
    const body = await readFile(absolutePath);
    return new Response(body, {
      headers: {
        "cache-control": CACHE_CONTROL,
        "content-length": String(fileStat.size),
        "content-type": contentTypeFor(absolutePath),
        "x-adcontact-media-source": "public-images-placeholder",
      },
    });
  } catch {
    return null;
  }
}

function normalizedImageKey(filename: string) {
  return basename(filename, extname(filename))
    .toLowerCase()
    .replace(/_\d+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function productCodeImageKey(filename: string) {
  return normalizedImageKey(filename).replace(/\d+/g, (part) => String(Number(part)));
}

async function getPublicImageIndex() {
  publicImageIndex ??= buildPublicImageIndex();
  return publicImageIndex;
}

async function buildPublicImageIndex() {
  const index = new Map<string, string>();

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }
      if (!entry.isFile() || !IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue;

      const exactKey = entry.name.toLowerCase();
      const normalizedKey = normalizedImageKey(entry.name);
      const productCodeKey = productCodeImageKey(entry.name);
      if (!index.has(exactKey)) index.set(exactKey, absolutePath);
      if (!index.has(normalizedKey)) index.set(normalizedKey, absolutePath);
      if (!index.has(productCodeKey)) index.set(productCodeKey, absolutePath);
    }
  }

  try {
    await walk(PUBLIC_IMAGES_ROOT);
  } catch {
    return index;
  }

  return index;
}

// The server stores product images under lowercase single-char subdirectories
// (e.g. catalog/product/d/t/DT04.jpg). Magento catalogue dumps sometimes have
// uppercase dirs (D/T/) or all-lowercase filenames. Generate both variants to try.
function withLowercaseDirs(relativePath: string): string | null {
  const match = relativePath.match(/^(catalog\/product\/)([A-Z])(\/.+)$/);
  if (!match) return null;
  return `${match[1]}${match[2].toLowerCase()}${match[3]}`;
}

function withUppercaseFirstDir(relativePath: string): string | null {
  const match = relativePath.match(/^(catalog\/product\/)([a-z])(\/.+)$/);
  if (!match) return null;
  return `${match[1]}${match[2].toUpperCase()}${match[3]}`;
}

async function fetchMedia(path: string, origin: string, qs: string): Promise<Response | null> {
  const url = new URL(`/media/${path}`, origin);
  url.search = qs;
  const res = await fetch(url, {
    headers: { Accept: "*/*", "User-Agent": "Adcontact catalogue media proxy" },
    cache: "no-store",
  });
  return res.ok ? res : null;
}

async function proxyOrderlandMedia(request: NextRequest, relativePath: string) {
  const origin = process.env.ORDERLAND_MEDIA_ORIGIN;
  if (!origin) {
    return new Response("Media origin is not configured.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const fallbackOrigin = process.env.ORDERLAND_MEDIA_FALLBACK_ORIGIN ?? null;
  const lowercased = withLowercaseDirs(relativePath);
  const uppercased = withUppercaseFirstDir(relativePath);
  const qs = request.nextUrl.search;

  // Try path variants in order: as-is, lowercase dirs (server stores d/t/ not D/T/),
  // uppercase first dir, then same set on fallback origin.
  const candidates: [string, string][] = [
    [relativePath, origin],
    ...(lowercased ? [[lowercased, origin] as [string, string]] : []),
    ...(uppercased ? [[uppercased, origin] as [string, string]] : []),
    ...(fallbackOrigin ? [[relativePath, fallbackOrigin] as [string, string]] : []),
    ...(fallbackOrigin && lowercased ? [[lowercased, fallbackOrigin] as [string, string]] : []),
    ...(fallbackOrigin && uppercased ? [[uppercased, fallbackOrigin] as [string, string]] : []),
  ];

  let found: Response | null = null;
  let foundUrl = "";
  for (const [path, src] of candidates) {
    const res = await fetchMedia(path, src, qs);
    if (res) { found = res; foundUrl = `${src}/media/${path}`; break; }
  }

  if (!found) {
    return new Response("Media file was not found.", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-adcontact-media-source": `${origin}/media/${relativePath}`,
      },
    });
  }

  const upstream = found;

  const headers = new Headers();
  headers.set("cache-control", CACHE_CONTROL);
  headers.set("content-type", upstream.headers.get("content-type") ?? contentTypeFor(relativePath));
  headers.set("x-adcontact-media-source", foundUrl);

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("content-length", contentLength);

  return new Response(upstream.body, { headers });
}

export async function GET(request: NextRequest, { params }: Context) {
  const { path } = await params;
  const relativePath = safeRelativePath(path);
  if (!relativePath) {
    return new Response("Invalid media path.", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const local = await serveLocalMedia(relativePath);
  if (local) return local;

  const proxied = await proxyOrderlandMedia(request, relativePath);
  if (proxied.status !== 404) return proxied;

  return (await servePublicImageFallback(relativePath)) ?? (await servePlaceholderImage(relativePath)) ?? proxied;
}

export async function HEAD(request: NextRequest, context: Context) {
  const response = await GET(request, context);
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
