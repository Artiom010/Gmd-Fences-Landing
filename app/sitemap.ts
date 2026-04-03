import type { MetadataRoute } from "next";
import { SITE_NOINDEX } from "@/lib/site-flags";

const SITE_URL = "https://gmdfences.com";

export default function sitemap(): MetadataRoute.Sitemap {
  if (SITE_NOINDEX) return [];
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
