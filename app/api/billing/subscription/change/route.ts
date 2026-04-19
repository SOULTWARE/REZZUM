import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestBaseUrl } from "@/server/app-url";
import {
  changeSubscriptionForUser,
  getBillingErrorDetail,
  resolveBillingPlanSlug,
} from "@/server/billing/polar";
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

  const formData = await request.formData();
  const plan = resolveBillingPlanSlug(String(formData.get("plan") ?? ""));

  if (!plan) {
    return getSettingsRedirect(request, "missing-plan");
  }

  try {
    const result = await changeSubscriptionForUser({
      appBaseUrl: getRequestBaseUrl(request),
      plan,
      user: {
        email: session.user.email,
        id: session.user.id,
        name: session.user.name || session.user.email,
      },
    });

    if (result.type === "checkout") {
      return NextResponse.redirect(result.checkoutUrl);
    }

    if (result.type === "noop") {
      return getSettingsRedirect(request, "unchanged");
    }

    return getSettingsRedirect(request, "changed");
  } catch (error) {
    console.error("Polar subscription change failed", error);
    return getSettingsRedirect(request, "unavailable", getBillingErrorDetail(error));
  }
}
