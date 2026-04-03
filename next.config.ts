import type { NextConfig } from "next";
import { SITE_NOINDEX } from "./lib/site-flags";

const nextConfig: NextConfig = {
  async headers() {
    if (!SITE_NOINDEX) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  webpack(config, { dev, isServer }) {
    // Windows: filesystem cache can keep stale chunk ids → ENOENT / Cannot find module './NNN.js'
    if (dev) {
      config.cache = false;
    }
    if (isServer) {
      config.externals = [...(config.externals ?? []), "globe.gl"];
    }
    return config;
  },
};

export default nextConfig;
