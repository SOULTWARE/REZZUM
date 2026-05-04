import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SocialPlatform } from "@prisma/client";
import { getRequestAuthSession } from "@/server/auth/session";
import { getPublicRequestBaseUrl } from "@/server/app-url";
import { assertPlatformsAllowed, getUserPlanAccess } from "@/server/billing/limits";
import { getFacebookAuthorizationUrl } from "@/server/integrations/facebook";
import { createOauthState } from "@/server/integrations/oauth";

export async function GET(request: Request) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const access = await getUserPlanAccess(session.user.id);

  try {
    assertPlatformsAllowed(access, [SocialPlatform.FACEBOOK]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Facebook is not available.";

    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(message)}`, request.url),
    );
  }

  const state = createOauthState();
  const cookieStore = await cookies();

  cookieStore.set("rezzum_facebook_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(getFacebookAuthorizationUrl(state, getPublicRequestBaseUrl(request)));
}
