import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { resolveBillingPlanSlug } from "@/server/billing/polar";
import { enabledAuthProviders } from "@/server/auth";
import { getAuthSession } from "@/server/auth/session";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign up",
  description: "Create a REZZUM account to start building your RSS-to-social workflow.",
  pathname: "/signup",
  noIndex: true,
});

function getPlanCheckoutUrl(plan: string | null | undefined) {
  const resolvedPlan = resolveBillingPlanSlug(plan);

  if (!resolvedPlan) {
    return null;
  }

  return `/api/billing/checkout?plan=${resolvedPlan}&returnTo=%2Fpricing`;
}

function hasCredentialQueryParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  return ["email", "password", "name"].some((key) => searchParams[key] !== undefined);
}

function getCleanSignupPath(plan: string | null) {
  return plan ? `/signup?plan=${encodeURIComponent(plan)}` : "/signup";
}

function getSearchParamValue(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
) {
  const value = searchParams[key];

  return typeof value === "string" ? value : null;
}

function getSignupStatusMessage(value: string | null) {
  if (value === "verification_sent") {
    return "Account created. Check your inbox to verify your email address.";
  }

  return null;
}

export default async function SignupPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const resolvedSearchParams = await searchParams;
  const planValue = getSearchParamValue(resolvedSearchParams, "plan");

  if (hasCredentialQueryParams(resolvedSearchParams)) {
    redirect(getCleanSignupPath(planValue));
  }

  const session = await getAuthSession();
  const checkoutUrl = getPlanCheckoutUrl(planValue);

  if (session) {
    redirect(checkoutUrl ?? "/dashboard");
  }

  return (
    <AuthPageShell
      alternateHref={planValue ? `/login?plan=${encodeURIComponent(planValue)}` : "/login"}
      alternateLabel="Log in"
      alternatePrompt="Already have an account?"
      subtitle="Automate Your Social Flow"
      title="Create your REZZUM account"
    >
      <AuthForm
        callbackURL={checkoutUrl ?? "/dashboard"}
        errorRedirectPath={getCleanSignupPath(planValue)}
        initialErrorCode={getSearchParamValue(resolvedSearchParams, "authError")}
        initialSuccessMessage={getSignupStatusMessage(
          getSearchParamValue(resolvedSearchParams, "authStatus"),
        )}
        mode="signup"
        providers={enabledAuthProviders}
      />
    </AuthPageShell>
  );
}
