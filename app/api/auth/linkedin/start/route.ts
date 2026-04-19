import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthSession } from "@/server/auth/session";
import { getLinkedInAuthorizationUrl } from "@/server/integrations/linkedin";
import { createOauthState } from "@/server/integrations/oauth";

export async function GET(request: Request) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const state = createOauthState();
  const cookieStore = await cookies();

  cookieStore.set("rezzum_linkedin_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(getLinkedInAuthorizationUrl(state));
}
