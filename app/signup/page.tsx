import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { resolveBillingPlanSlug } from "@/server/billing/polar";
import { enabledAuthProviders } from "@/server/auth";
import { getAuthSession } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign-up page for REZZUM.",
  alternates: {
    canonical: "/signup",
  },
};

function getPlanCheckoutUrl(plan: string | null | undefined) {
  const resolvedPlan = resolveBillingPlanSlug(plan);

  if (!resolvedPlan) {
    return null;
  }

  return `/api/billing/checkout?plan=${resolvedPlan}&returnTo=%2Fpricing`;
}

export default async function SignupPage({
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
      alternateHref={planValue ? `/login?plan=${encodeURIComponent(planValue)}` : "/login"}
      alternateLabel="Log in"
      alternatePrompt="Already have an account?"
      subtitle="Automate Your Social Flow"
      title="Create your REZZUM account"
    >
      <AuthForm
        callbackURL={checkoutUrl ?? "/dashboard"}
        mode="signup"
        providers={enabledAuthProviders}
      />
    </AuthPageShell>
  );
}
