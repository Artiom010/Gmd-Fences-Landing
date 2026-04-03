import type { MetadataRoute } from "next";
import { SITE_NOINDEX } from "@/lib/site-flags";

const SITE_URL = "https://gmdfences.com";

export default function robots(): MetadataRoute.Robots {
  if (SITE_NOINDEX) {
    return { rules: { userAgent: "*", disallow: ["/"] } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https:\/\//, ""),
  };
}
