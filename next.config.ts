import type { NextConfig } from "next";

function resolveAllowedDevOrigins() {
  const origins = new Set<string>();
  const configuredOrigins = process.env.ALLOWED_DEV_ORIGINS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  for (const origin of configuredOrigins ?? []) {
    origins.add(origin);
  }

  const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (publicAppUrl) {
    try {
      origins.add(new URL(publicAppUrl).hostname);
    } catch {
      origins.add(publicAppUrl.replace(/^https?:\/\//, "").replace(/\/+$/, ""));
    }
  }

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: resolveAllowedDevOrigins(),
};

export default nextConfig;
