import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SocialPlatform } from "@prisma/client";
import { getRequestAuthSession } from "@/server/auth/session";
import { getPublicRequestBaseUrl, getPublicRequestUrl } from "@/server/app-url";
import { assertPlatformsAllowed, getUserPlanAccess } from "@/server/billing/limits";
import { connectXAccount } from "@/server/integrations/x";

export async function GET(request: Request) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(getPublicRequestUrl("/login", request));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("rezzum_x_oauth_state")?.value;
  const verifier = cookieStore.get("rezzum_x_oauth_verifier")?.value;

  cookieStore.delete("rezzum_x_oauth_state");
  cookieStore.delete("rezzum_x_oauth_verifier");

  if (!code || !state || !expectedState || !verifier || state !== expectedState) {
    return NextResponse.redirect(getPublicRequestUrl("/accounts?error=x_oauth_state", request));
  }

  try {
    assertPlatformsAllowed(await getUserPlanAccess(session.user.id), [SocialPlatform.X]);
    await connectXAccount({
      code,
      userId: session.user.id,
      verifier,
      baseUrl: getPublicRequestBaseUrl(request),
    });

    return NextResponse.redirect(getPublicRequestUrl("/accounts?connected=x", request));
  } catch (error) {
    const message = error instanceof Error ? error.message : "X connection failed.";

    return NextResponse.redirect(
      getPublicRequestUrl(`/accounts?error=${encodeURIComponent(message)}`, request),
    );
  }
}
