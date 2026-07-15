import { NextResponse, type NextRequest } from "next/server";

const AUTH_CREDENTIAL_QUERY_PARAMS = ["email", "password", "name"];

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  let shouldRedirect = false;

  for (const key of AUTH_CREDENTIAL_QUERY_PARAMS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      shouldRedirect = true;
    }
  }

  if (shouldRedirect) {
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"],
};
