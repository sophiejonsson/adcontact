import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getAllSitemapEntries, getSitemapChunkCount, SITEMAP_CHUNK_SIZE } from "@/lib/sitemapUrls";

export async function generateSitemaps() {
  return Array.from({ length: getSitemapChunkCount() }, (_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const chunkId = Number(await id);
  const start = chunkId * SITEMAP_CHUNK_SIZE;
  const entries = getAllSitemapEntries().slice(start, start + SITEMAP_CHUNK_SIZE);

  return entries.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  }));
}
