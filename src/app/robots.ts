import type { MetadataRoute } from "next";
import { IS_OFFICIAL_SITE, SITE_URL } from "@/lib/seo";
import { getSitemapChunkCount } from "@/lib/sitemapUrls";

export default function robots(): MetadataRoute.Robots {
  if (!IS_OFFICIAL_SITE) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // generateSitemaps() may split the catalogue across multiple chunk files
  // (Google's 50,000-URL-per-sitemap cap) — list every chunk so crawlers
  // discover all of them, not just the first.
  const chunkCount = getSitemapChunkCount();
  const sitemap = Array.from(
    { length: chunkCount },
    (_, id) => `${SITE_URL}/sitemap/${id}.xml`,
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: chunkCount === 1 ? `${SITE_URL}/sitemap.xml` : sitemap,
  };
}
