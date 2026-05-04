import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthSession } from "@/server/auth/session";
import { getRequestBaseUrl } from "@/server/app-url";
import { connectLinkedInOrganizations } from "@/server/integrations/linkedin";

export async function GET(request: Request) {
  const session = await getRequestAuthSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("rezzum_linkedin_oauth_state")?.value;

  cookieStore.delete("rezzum_linkedin_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/accounts?error=linkedin_oauth_state", request.url));
  }

  try {
    await connectLinkedInOrganizations(code, getRequestBaseUrl(request));

    return NextResponse.redirect(new URL("/accounts?connected=linkedin", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "LinkedIn connection failed.";

    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
