import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/seo";

const internalDisallowRules = [
  "/api/",
  "/accounts",
  "/dashboard",
  "/feeds",
  "/queue",
  "/schedule",
  "/settings",
  "/support",
];

const aiVisibilityUserAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Googlebot",
  "Google-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...aiVisibilityUserAgents.map((userAgent) => ({
        userAgent,
        allow: ["/", "/llms.txt", "/llms-full.txt", "/sitemap.xml"],
        disallow: internalDisallowRules,
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: internalDisallowRules,
      },
    ],
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
