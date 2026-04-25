import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestBaseUrl } from "@/server/app-url";
import { cancelSubscriptionForUser, getBillingErrorDetail } from "@/server/billing/polar";
import { getRequestAuthSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

function getSettingsRedirect(request: NextRequest, status: string, detail?: string) {
  const url = new URL(`/settings?billing=${status}`, `${getRequestBaseUrl(request)}/`);

  if (detail) {
    url.searchParams.set("billingDetail", detail.slice(0, 180));
  }

  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", `${getRequestBaseUrl(request)}/`));
  }

  try {
    const canceled = await cancelSubscriptionForUser({
      appBaseUrl: getRequestBaseUrl(request),
      userId: session.user.id,
    });

    return getSettingsRedirect(request, canceled ? "canceled" : "no-subscription");
  } catch (error) {
    console.error("Polar subscription cancel failed", error);
    return getSettingsRedirect(request, "unavailable", getBillingErrorDetail(error));
  }
}
