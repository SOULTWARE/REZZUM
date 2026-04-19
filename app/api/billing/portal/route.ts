import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/server/billing/polar";
import { getRequestAuthSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

function getSettingsRedirect(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/settings?billing=${status}`, request.url));
}

export async function GET(request: NextRequest) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const customerSession = await createCustomerPortalSession({
      returnPath: "/settings",
      userId: session.user.id,
    });

    return NextResponse.redirect(customerSession.customer_portal_url);
  } catch {
    return getSettingsRedirect(request, "portal-unavailable");
  }
}
