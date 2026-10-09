import type { MetadataRoute } from "next";

import { siteOrigin } from "@/config/site";

export const dynamic = "force-static";

// Sitemaps need absolute URLs, so the list stays empty until SITE_URL is set.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return [];
  return [{ url: `${siteOrigin}/`, changeFrequency: "monthly", priority: 1 }];
}
