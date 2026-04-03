import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
