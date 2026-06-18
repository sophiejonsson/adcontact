import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.adcontact.se",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "adcgam.hemsida.eu",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
