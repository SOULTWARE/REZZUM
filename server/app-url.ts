function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeOrigin(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    if (trimmed.startsWith("localhost") || trimmed.startsWith("127.0.0.1")) {
      return `http://${trimmed}`;
    }

    return `https://${trimmed}`;
  }
}

export function getAppBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return stripTrailingSlash(configuredUrl);
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  throw new Error("NEXT_PUBLIC_APP_URL is required in production.");
}

export function getAbsoluteAppUrl(pathname: string) {
  return new URL(pathname, `${getAppBaseUrl()}/`).toString();
}

export function getTrustedAppOrigins() {
  const origins = new Set<string>();
  const configuredOrigins = process.env.ALLOWED_DEV_ORIGINS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  origins.add(new URL(getAppBaseUrl()).origin);

  for (const origin of configuredOrigins ?? []) {
    const normalizedOrigin = normalizeOrigin(origin);

    if (!normalizedOrigin) {
      continue;
    }

    origins.add(normalizedOrigin);
  }

  return Array.from(origins);
}
