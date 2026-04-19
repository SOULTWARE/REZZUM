import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestBaseUrl } from "@/server/app-url";
import {
  createCheckoutForPlan,
  getBillingErrorDetail,
  resolveBillingPlanSlug,
  resolveInternalReturnPath,
} from "@/server/billing/polar";
import { getRequestAuthSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

function getAuthRedirect(request: NextRequest, plan: string | null) {
  const redirectUrl = new URL("/login", `${getRequestBaseUrl(request)}/`);

  if (plan) {
    redirectUrl.searchParams.set("plan", plan);
  }

  return NextResponse.redirect(redirectUrl);
}

function getSettingsRedirect(request: NextRequest, status: string, detail?: string) {
  const url = new URL(`/settings?billing=${status}`, `${getRequestBaseUrl(request)}/`);

  if (detail) {
    url.searchParams.set("billingDetail", detail.slice(0, 180));
  }

  return NextResponse.redirect(url);
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
  } catch (error) {
    console.error("Polar checkout failed", error);
    return getSettingsRedirect(request, "unavailable", getBillingErrorDetail(error));
  }
}
