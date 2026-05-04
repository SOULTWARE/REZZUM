import type { MetadataRoute } from "next";
import { getAbsoluteUrl, publicSeoRoutes } from "@/lib/seo";

const lastModified = new Date("2026-05-04");

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSeoRoutes.map((route) => ({
    url: getAbsoluteUrl(route.pathname),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
