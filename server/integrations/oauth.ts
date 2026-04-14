import { createHash, randomBytes } from "node:crypto";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ||
    "https://heroic-solely-amoeba.ngrok-free.app"
  );
}

export function getAbsoluteUrl(pathname: string) {
  return `${getBaseUrl()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function createOauthState() {
  return randomBytes(24).toString("base64url");
}

export function createPkceVerifier() {
  return randomBytes(48).toString("base64url");
}

export function createPkceChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}
