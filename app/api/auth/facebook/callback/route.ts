import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SocialPlatform } from "@prisma/client";
import { getRequestAuthSession } from "@/server/auth/session";
import { getPublicRequestBaseUrl, getPublicRequestUrl } from "@/server/app-url";
import { assertPlatformsAllowed, getUserPlanAccess } from "@/server/billing/limits";
import { connectFacebookPages } from "@/server/integrations/facebook";

export async function GET(request: Request) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(getPublicRequestUrl("/login", request));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("rezzum_facebook_oauth_state")?.value;

  cookieStore.delete("rezzum_facebook_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(getPublicRequestUrl("/accounts?error=facebook_oauth_state", request));
  }

  try {
    assertPlatformsAllowed(await getUserPlanAccess(session.user.id), [SocialPlatform.FACEBOOK]);
    await connectFacebookPages(session.user.id, code, getPublicRequestBaseUrl(request));

    return NextResponse.redirect(getPublicRequestUrl("/accounts?connected=facebook", request));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Facebook connection failed.";

    return NextResponse.redirect(
      getPublicRequestUrl(`/accounts?error=${encodeURIComponent(message)}`, request),
    );
  }
}
