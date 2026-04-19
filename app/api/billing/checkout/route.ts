import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestBaseUrl } from "@/server/app-url";
import {
  createCheckoutForPlan,
  resolveBillingPlanSlug,
  resolveInternalReturnPath,
} from "@/server/billing/polar";
import { getRequestAuthSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

function getAuthRedirect(request: NextRequest, plan: string | null) {
  const redirectUrl = new URL("/signup", `${getRequestBaseUrl(request)}/`);

  if (plan) {
    redirectUrl.searchParams.set("plan", plan);
  }

  return NextResponse.redirect(redirectUrl);
}

function getSettingsRedirect(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/settings?billing=${status}`, `${getRequestBaseUrl(request)}/`));
}

function getPricingRedirect(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/pricing?billing=${status}`, `${getRequestBaseUrl(request)}/`));
}

export async function GET(request: NextRequest) {
  const rawPlan = request.nextUrl.searchParams.get("plan");
  const plan = resolveBillingPlanSlug(rawPlan);

  if (!plan) {
    return getPricingRedirect(request, "missing-plan");
  }

  const session = await getRequestAuthSession(request);

  if (!session) {
    return getAuthRedirect(request, plan);
  }

  try {
    const checkoutUrl = await createCheckoutForPlan({
      appBaseUrl: getRequestBaseUrl(request),
      plan,
      returnPath: resolveInternalReturnPath(
        request.nextUrl.searchParams.get("returnTo"),
        "/pricing",
      ),
      user: {
        email: session.user.email,
        id: session.user.id,
        name: session.user.name || session.user.email,
      },
    });

    return NextResponse.redirect(checkoutUrl);
  } catch {
    return getSettingsRedirect(request, "unavailable");
  }
}
