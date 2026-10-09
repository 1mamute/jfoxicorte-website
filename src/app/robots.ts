import type { MetadataRoute } from "next";

import { siteOrigin } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(siteOrigin && { sitemap: `${siteOrigin}/sitemap.xml` }),
  };
}
