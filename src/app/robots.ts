import type { MetadataRoute } from "next";
import { IS_OFFICIAL_SITE, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!IS_OFFICIAL_SITE) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
