import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/accounts",
        "/dashboard",
        "/feeds",
        "/queue",
        "/schedule",
        "/settings",
        "/support",
      ],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
