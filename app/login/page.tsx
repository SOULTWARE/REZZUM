import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { resolveBillingPlanSlug } from "@/server/billing/polar";
import { enabledAuthProviders } from "@/server/auth";
import { getAuthSession } from "@/server/auth/session";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Login",
  description: "Sign in to your REZZUM account.",
  pathname: "/login",
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

function getCleanLoginPath(plan: string | null) {
  return plan ? `/login?plan=${encodeURIComponent(plan)}` : "/login";
}

function getSearchParamValue(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
) {
  const value = searchParams[key];

  return typeof value === "string" ? value : null;
}

export default async function LoginPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const resolvedSearchParams = await searchParams;
  const planValue = getSearchParamValue(resolvedSearchParams, "plan");

  if (hasCredentialQueryParams(resolvedSearchParams)) {
    redirect(getCleanLoginPath(planValue));
  }

  const session = await getAuthSession();
  const checkoutUrl = getPlanCheckoutUrl(planValue);

  if (session) {
    redirect(checkoutUrl ?? "/dashboard");
  }

  return (
    <AuthPageShell
      alternateHref={planValue ? `/signup?plan=${encodeURIComponent(planValue)}` : "/signup"}
      alternateLabel="Create an account"
      alternatePrompt="Need an account?"
      subtitle="Automate Your Social Flow"
      title="Sign in to REZZUM"
    >
      <AuthForm
        callbackURL={checkoutUrl ?? "/dashboard"}
        errorRedirectPath={getCleanLoginPath(planValue)}
        initialErrorCode={getSearchParamValue(resolvedSearchParams, "authError")}
        mode="login"
        providers={enabledAuthProviders}
      />
    </AuthPageShell>
  );
}
