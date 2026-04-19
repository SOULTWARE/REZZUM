import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";

export async function getAuthSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuthSession(redirectTo = "/login") {
  const session = await getAuthSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}

export async function getRequestAuthSession(request: Request) {
  return auth.api.getSession({
    headers: request.headers,
  });
}
