import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.adcontact.se";
const isOfficialSite = new URL(siteUrl).hostname.replace(/^www\./, "") === "adcontact.se";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      // Legacy Magento on-site search results (e.g. /catalogsearch/result/?q=x)
      // — still probed by old crawler indexes (Majestic/MJ12bot, 2026-07-21)
      // years after the migration. There's no 1:1 content match per query, but
      // /products?q= is the new site's equivalent results page and reuses the
      // same `q` param, so the visitor's original search term carries over.
      {
        source: "/catalogsearch/result/:path*",
        destination: "/products",
        permanent: true,
      },
      // Used machines moved under the new Outlet section (2026-08-27).
      {
        source: "/used-machines",
        destination: "/outlet/used-machines",
        permanent: true,
      },
    ];
  },
  async headers() {
    if (isOfficialSite) return [];

    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
