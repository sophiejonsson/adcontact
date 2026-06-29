import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.adcontact.se";
const isOfficialSite = new URL(siteUrl).hostname.replace(/^www\./, "") === "adcontact.se";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
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
