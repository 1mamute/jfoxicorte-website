import type { MetadataRoute } from "next";

import { siteBase } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(siteBase && { sitemap: `${siteBase}/sitemap.xml` }),
  };
}
