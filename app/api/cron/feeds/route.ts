import { NextResponse } from "next/server";
import { syncDueFeeds } from "@/server/pipeline/service";
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

  const results = await syncDueFeeds();

  return NextResponse.json({
    ok: true,
    results,
    processedAt: new Date().toISOString(),
  });
}

export const GET = handleCronRequest;
export const POST = handleCronRequest;
