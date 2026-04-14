import { NextResponse } from "next/server";

export function getCronSecret() {
  return process.env.CRON_SECRET?.trim() ?? "";
}

export function isAuthorizedCronRequest(request: Request) {
  const secret = getCronSecret();

  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export function getUnauthorizedCronResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
