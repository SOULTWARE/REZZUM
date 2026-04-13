import { NextResponse } from "next/server";
import { publishDuePosts } from "@/server/publishing/service";

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

  const results = await publishDuePosts();

  return NextResponse.json({
    ok: true,
    results,
  });
}
