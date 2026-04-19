import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestBaseUrl } from "@/server/app-url";
import { createCustomerPortalSession } from "@/server/billing/polar";
import { getRequestAuthSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

function getSettingsRedirect(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/settings?billing=${status}`, `${getRequestBaseUrl(request)}/`));
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
  } catch {
    return getSettingsRedirect(request, "portal-unavailable");
  }
}
