import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestBaseUrl } from "@/server/app-url";
import { createCustomerPortalSession, getBillingErrorDetail } from "@/server/billing/polar";
import { getRequestAuthSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

function getSettingsRedirect(request: NextRequest, status: string, detail?: string) {
  const url = new URL(`/settings?billing=${status}`, `${getRequestBaseUrl(request)}/`);

  if (detail) {
    url.searchParams.set("billingDetail", detail.slice(0, 180));
  }

  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", `${getRequestBaseUrl(request)}/`));
  }

  try {
    const customerSession = await createCustomerPortalSession({
      appBaseUrl: getRequestBaseUrl(request),
      returnPath: "/settings",
      userId: session.user.id,
    });

    return NextResponse.redirect(customerSession.customer_portal_url);
  } catch (error) {
    console.error("Polar portal session failed", error);
    return getSettingsRedirect(request, "portal-unavailable", getBillingErrorDetail(error));
  }
}
