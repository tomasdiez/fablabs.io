import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.fablabs.io",
      },
      {
        protocol: "https",
        hostname: "fablabs.io",
      },
    ],
  },
};

export default nextConfig;
