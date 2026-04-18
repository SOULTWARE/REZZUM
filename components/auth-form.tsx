"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LinkedInIcon } from "@/components/icons";
import { authClient } from "@/lib/auth-client";
import { loginSchema, signupSchema } from "@/lib/auth-validation";

type AuthFormMode = "login" | "signup";
type SocialProvider = "google" | "linkedin";

type AuthFormProps = {
  callbackURL?: string;
  mode: AuthFormMode;
  providers: {
    google: boolean;
    linkedin: boolean;
  };
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M21.6 12.23C21.6 11.55 21.54 10.9 21.43 10.27H12V14.14H17.39C17.16 15.39 16.45 16.45 15.39 17.16V19.67H18.62C20.51 17.93 21.6 15.37 21.6 12.23Z"
        fill="#4285F4"
      />
      <path
        d="M12 22C14.7 22 16.96 21.11 18.62 19.67L15.39 17.16C14.5 17.76 13.36 18.12 12 18.12C9.39 18.12 7.18 16.36 6.4 14H3.06V16.59C4.71 19.86 8.09 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.4 14C6.2 13.4 6.09 12.76 6.09 12C6.09 11.24 6.2 10.6 6.4 10V7.41H3.06C2.39 8.73 2 10.31 2 12C2 13.69 2.39 15.27 3.06 16.59L6.4 14Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.88C13.49 5.88 14.82 6.39 15.87 7.39L18.69 4.57C16.95 2.95 14.69 2 12 2C8.09 2 4.71 4.14 3.06 7.41L6.4 10C7.18 7.64 9.39 5.88 12 5.88Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function getErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
    return "The email or password is incorrect.";
  }

  if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    return "An account already exists for that email.";
  }

  if (error.code === "PASSWORD_TOO_SHORT") {
    return "Use at least 8 characters for your password.";
  }

  if (error.code === "PASSWORD_TOO_LONG") {
    return "Use 128 characters or fewer for your password.";
  }

  if (error.code === "EMAIL_NOT_VERIFIED") {
    return "Your email is not verified yet. We sent a fresh verification link.";
  }

  return error.message || "Something went wrong. Please try again.";
}

function getPrimaryButtonLabel(mode: AuthFormMode, pending: boolean) {
  if (!pending) {
    return mode === "login" ? "Log in" : "Create account";
  }

  return mode === "login" ? "Logging in..." : "Creating account...";
}

function getSocialButtonLabel(mode: AuthFormMode, provider: SocialProvider) {
  const action = mode === "login" ? "Sign in" : "Sign up";

  return `${action} with ${provider === "google" ? "Google" : "LinkedIn"}`;
}

function resolveCallbackURL(callbackURL: string) {
  if (callbackURL.startsWith("http://") || callbackURL.startsWith("https://")) {
    return callbackURL;
  }

  if (typeof window === "undefined") {
    return callbackURL;
  }

  return new URL(callbackURL, window.location.origin).toString();
}

export function AuthForm({ callbackURL = "/dashboard", mode, providers }: Readonly<AuthFormProps>) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);

  async function handleCredentialSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || pendingProvider) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const rawValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    if (mode === "login") {
      const parsedValues = loginSchema.safeParse(rawValues);

      if (!parsedValues.success) {
        const [firstIssue] = parsedValues.error.issues;

        setErrorMessage(firstIssue?.message ?? "Check the highlighted fields and try again.");
        return;
      }
    } else {
      const parsedValues = signupSchema.safeParse(rawValues);

      if (!parsedValues.success) {
        const [firstIssue] = parsedValues.error.issues;

        setErrorMessage(firstIssue?.message ?? "Check the highlighted fields and try again.");
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const resolvedCallbackURL = resolveCallbackURL(callbackURL);
      const result =
        mode === "login"
          ? await (async () => {
              const parsedValues = loginSchema.parse(rawValues);

              return authClient.signIn.email({
                callbackURL: resolvedCallbackURL,
                email: parsedValues.email,
                password: parsedValues.password,
                rememberMe: true,
              });
            })()
          : await (async () => {
              const parsedValues = signupSchema.parse(rawValues);

              return authClient.signUp.email({
                callbackURL: resolvedCallbackURL,
                name: parsedValues.name,
                email: parsedValues.email,
                password: parsedValues.password,
              });
            })();

      if (result.error) {
        setErrorMessage(getErrorMessage(result.error));
        return;
      }

      if (mode === "signup" && !result.data?.token) {
        setSuccessMessage("Account created. Check your inbox to verify your email address.");
        return;
      }

      router.replace(callbackURL);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialSignIn(provider: SocialProvider) {
    if (isSubmitting || pendingProvider || !providers[provider]) {
      return;
    }

    setPendingProvider(provider);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: resolveCallbackURL(callbackURL),
      });

      if (result.error) {
        setErrorMessage(getErrorMessage(result.error));
        setPendingProvider(null);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start social sign-in right now.";

      setErrorMessage(message);
      setPendingProvider(null);
    }
  }

  const socialDisabled = isSubmitting || pendingProvider !== null;

  return (
    <form className="space-y-4" onSubmit={handleCredentialSubmit}>
      {mode === "signup" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
            Full name
          </span>
          <input
            autoComplete="name"
            className="w-full rounded-[0.95rem] border border-[rgb(0_83_218_/_0.24)] bg-white px-4 py-4 text-[1.02rem] text-[var(--foreground)] shadow-[inset_0_1px_2px_rgb(16_24_40_/_0.04)] outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgb(0_83_218_/_0.12)]"
            name="name"
            placeholder="Your name"
            type="text"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
          Email address
        </span>
        <input
          autoComplete="email"
          className="w-full rounded-[0.95rem] border border-[rgb(0_83_218_/_0.24)] bg-white px-4 py-4 text-[1.02rem] text-[var(--foreground)] shadow-[inset_0_1px_2px_rgb(16_24_40_/_0.04)] outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgb(0_83_218_/_0.12)]"
          name="email"
          placeholder="you@company.com"
          type="email"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
          Password
        </span>
        <input
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="w-full rounded-[0.95rem] border border-[rgb(0_83_218_/_0.24)] bg-white px-4 py-4 text-[1.02rem] text-[var(--foreground)] shadow-[inset_0_1px_2px_rgb(16_24_40_/_0.04)] outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgb(0_83_218_/_0.12)]"
          name="password"
          placeholder={mode === "login" ? "Enter your password" : "Create a password"}
          type="password"
        />
      </label>

      {successMessage ? (
        <p
          role="status"
          className="rounded-[0.95rem] border border-[rgb(0_83_218_/_0.18)] bg-[rgb(240_247_255)] px-4 py-3 text-sm font-medium text-[var(--primary-strong)]"
        >
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-[0.95rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || pendingProvider !== null}
        className="button-primary mt-3 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-70"
      >
        {getPrimaryButtonLabel(mode, isSubmitting)}
      </button>

      <button
        type="button"
        disabled={socialDisabled || !providers.google}
        onClick={() => void handleSocialSignIn("google")}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-600 shadow-[0_6px_14px_rgb(15_23_42_/_0.06)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        <span>
          {pendingProvider === "google"
            ? "Redirecting to Google..."
            : getSocialButtonLabel(mode, "google")}
        </span>
      </button>

      <button
        type="button"
        disabled={socialDisabled || !providers.linkedin}
        onClick={() => void handleSocialSignIn("linkedin")}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] px-6 py-4 text-lg font-medium text-white shadow-[0_14px_30px_rgb(0_83_218_/_0.22)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LinkedInIcon className="h-5 w-5" />
        <span>
          {pendingProvider === "linkedin"
            ? "Redirecting to LinkedIn..."
            : getSocialButtonLabel(mode, "linkedin")}
        </span>
      </button>
    </form>
  );
}
