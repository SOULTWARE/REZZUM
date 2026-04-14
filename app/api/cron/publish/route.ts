import { NextResponse } from "next/server";
import { publishDuePosts } from "@/server/publishing/service";
import {
  getUnauthorizedCronResponse,
  isAuthorizedCronRequest,
} from "@/server/cron/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleCronRequest(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return getUnauthorizedCronResponse();
  }

  const results = await publishDuePosts();

  return NextResponse.json({
    ok: true,
    results,
    processedAt: new Date().toISOString(),
  });
}

export const GET = handleCronRequest;
export const POST = handleCronRequest;
