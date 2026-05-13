import { NextResponse } from "next/server";
import { isAPIError } from "better-auth/api";
import { ZodError } from "zod";
import { loginSchema, signupSchema } from "@/lib/auth-validation";
import { auth } from "@/server/auth";

type AuthMode = "login" | "signup";

const AUTH_ERROR_FALLBACK = "AUTH_REQUEST_FAILED";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getAuthMode(formData: FormData): AuthMode {
  return getString(formData, "mode") === "signup" ? "signup" : "login";
}

function getDefaultAuthPath(mode: AuthMode) {
  return mode === "signup" ? "/signup" : "/login";
}

function resolveSafePath(value: string, fallbackPath: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallbackPath;
  }

  return value;
}

function buildPageRedirect(request: Request, mode: AuthMode, params: Record<string, string>) {
  const fallbackPath = getDefaultAuthPath(mode);
  const redirectPath = resolveSafePath(getStringFromParams(params, "redirectPath"), fallbackPath);
  const url = new URL(redirectPath, request.url);

  for (const [key, value] of Object.entries(params)) {
    if (key === "redirectPath") {
      continue;
    }

    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url);
}

function getStringFromParams(params: Record<string, string>, key: string) {
  return params[key] ?? "";
}

function appendAuthCookies(response: NextResponse, headers: Headers | null | undefined) {
  if (!headers) {
    return;
  }

  const setCookies =
    (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ??
    (headers.get("set-cookie") ? [headers.get("set-cookie")!] : []);

  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }
}

function getErrorCode(error: unknown) {
  if (error instanceof ZodError) {
    return "VALIDATION_ERROR";
  }

  if (isAPIError(error)) {
    return error.body?.code ?? AUTH_ERROR_FALLBACK;
  }

  return AUTH_ERROR_FALLBACK;
}

function getCallbackPath(formData: FormData, fallbackPath: string) {
  return resolveSafePath(getString(formData, "callbackURL"), fallbackPath);
}

function getErrorRedirectPath(formData: FormData, mode: AuthMode) {
  return resolveSafePath(getString(formData, "errorRedirectPath"), getDefaultAuthPath(mode));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const mode = getAuthMode(formData);
  const errorRedirectPath = getErrorRedirectPath(formData, mode);
  const callbackPath = getCallbackPath(formData, "/dashboard");
  const rawValues = {
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  };

  try {
    if (mode === "login") {
      const parsed = loginSchema.parse(rawValues);
      const result = await auth.api.signInEmail({
        body: {
          callbackURL: callbackPath,
          email: parsed.email,
          password: parsed.password,
          rememberMe: true,
        },
        headers: request.headers,
        returnHeaders: true,
      });
      const redirectResponse = NextResponse.redirect(new URL(callbackPath, request.url));

      appendAuthCookies(redirectResponse, result.headers);

      return redirectResponse;
    }

    const parsed = signupSchema.parse(rawValues);
    const result = await auth.api.signUpEmail({
      body: {
        callbackURL: callbackPath,
        email: parsed.email,
        name: parsed.name,
        password: parsed.password,
        rememberMe: true,
      },
      headers: request.headers,
      returnHeaders: true,
    });

    if (!result.response.token) {
      return buildPageRedirect(request, mode, {
        authStatus: "verification_sent",
        redirectPath: errorRedirectPath,
      });
    }

    const redirectResponse = NextResponse.redirect(new URL(callbackPath, request.url));

    appendAuthCookies(redirectResponse, result.headers);

    return redirectResponse;
  } catch (error) {
    return buildPageRedirect(request, mode, {
      authError: getErrorCode(error),
      redirectPath: errorRedirectPath,
    });
  }
}
