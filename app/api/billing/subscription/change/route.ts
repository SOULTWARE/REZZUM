import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  changeSubscriptionForUser,
  resolveBillingPlanSlug,
} from "@/server/billing/polar";
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

  const formData = await request.formData();
  const plan = resolveBillingPlanSlug(String(formData.get("plan") ?? ""));

  if (!plan) {
    return getSettingsRedirect(request, "missing-plan");
  }

  try {
    const result = await changeSubscriptionForUser({
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
  } catch {
    return getSettingsRedirect(request, "unavailable");
  }
}
