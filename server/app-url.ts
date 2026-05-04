const DEFAULT_PRODUCTION_APP_URL = "https://rezzum.online";

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function isLocalhostUrl(value: string) {
  try {
    const { hostname } = new URL(value);

    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return value.startsWith("localhost") || value.startsWith("127.0.0.1");
  }
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
  const isDevelopment = process.env.NODE_ENV === "development";

  if (configuredUrl && (!isLocalhostUrl(configuredUrl) || isDevelopment)) {
    return stripTrailingSlash(configuredUrl);
  }

  if (isDevelopment) {
    return "http://localhost:3000";
  }

  return DEFAULT_PRODUCTION_APP_URL;
}

export function getRequestBaseUrl(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = request.headers.get("host")?.trim();
  const origin = request.headers.get("origin")?.trim();

  if (forwardedHost) {
    return `${forwardedProto || "https"}://${forwardedHost}`;
  }

  if (host) {
    const protocol =
      forwardedProto ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

    return `${protocol}://${host}`;
  }

  if (origin) {
    return stripTrailingSlash(origin);
  }

  return getAppBaseUrl();
}

export function getPublicRequestBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl && !isLocalhostUrl(configuredUrl)) {
    return stripTrailingSlash(configuredUrl);
  }

  const requestBaseUrl = getRequestBaseUrl(request);

  if (!isLocalhostUrl(requestBaseUrl)) {
    return requestBaseUrl;
  }

  if (process.env.NODE_ENV === "development") {
    return requestBaseUrl;
  }

  return DEFAULT_PRODUCTION_APP_URL;
}

export function getAbsoluteAppUrl(pathname: string, baseUrl = getAppBaseUrl()) {
  return new URL(pathname, `${stripTrailingSlash(baseUrl)}/`).toString();
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
