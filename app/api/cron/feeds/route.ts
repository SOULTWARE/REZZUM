import { NextResponse } from "next/server";
import { syncDueFeeds } from "@/server/pipeline/service";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();

  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await syncDueFeeds();

  return NextResponse.json({
    ok: true,
    results,
  });
}
