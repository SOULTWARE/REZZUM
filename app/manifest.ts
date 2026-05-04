import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.defaultTitle,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fb",
    theme_color: "#0053da",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/REZZUM.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}
