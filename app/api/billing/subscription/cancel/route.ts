import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cancelSubscriptionForUser } from "@/server/billing/polar";
import { getRequestAuthSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

function getSettingsRedirect(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/settings?billing=${status}`, request.url));
}

export async function POST(request: NextRequest) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const canceled = await cancelSubscriptionForUser(session.user.id);

    return getSettingsRedirect(request, canceled ? "canceled" : "no-subscription");
  } catch {
    return getSettingsRedirect(request, "unavailable");
  }
}
