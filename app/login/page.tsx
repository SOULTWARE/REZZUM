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

export default async function LoginPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const session = await getAuthSession();
  const resolvedSearchParams = await searchParams;
  const planValue =
    typeof resolvedSearchParams.plan === "string" ? resolvedSearchParams.plan : null;
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
        mode="login"
        providers={enabledAuthProviders}
      />
    </AuthPageShell>
  );
}
