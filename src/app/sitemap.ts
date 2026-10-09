import type { MetadataRoute } from "next";

import { siteBase } from "@/config/site";

export const dynamic = "force-static";

// Sitemaps need absolute URLs, so the list stays empty until SITE_URL is set.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteBase) return [];
  return [{ url: `${siteBase}/`, changeFrequency: "monthly", priority: 1 }];
}
