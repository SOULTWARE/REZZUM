import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthSession } from "@/server/auth/session";
import { connectXAccount } from "@/server/integrations/x";

export async function GET(request: Request) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
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
    return NextResponse.redirect(new URL("/accounts?error=x_oauth_state", request.url));
  }

  try {
    await connectXAccount({
      code,
      verifier,
    });

    return NextResponse.redirect(new URL("/accounts?connected=x", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "X connection failed.";

    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
