import { createHash, randomBytes } from "node:crypto";
import { getAbsoluteAppUrl } from "@/server/app-url";

export function getAbsoluteUrl(pathname: string, baseUrl?: string) {
  return getAbsoluteAppUrl(pathname, baseUrl);
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
