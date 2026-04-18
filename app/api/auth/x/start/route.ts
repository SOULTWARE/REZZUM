import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthSession } from "@/server/auth/session";
import { createOauthState } from "@/server/integrations/oauth";
import { createXAuthorizationRequest } from "@/server/integrations/x";

export async function GET(request: Request) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const state = createOauthState();
  const { verifier, authorizationUrl } = createXAuthorizationRequest(state);
  const cookieStore = await cookies();

  cookieStore.set("rezzum_x_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  cookieStore.set("rezzum_x_oauth_verifier", verifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(authorizationUrl);
}
