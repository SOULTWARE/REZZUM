import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { enabledAuthProviders } from "@/server/auth";
import { getAuthSession } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign-up page for REZZUM.",
  alternates: {
    canonical: "/signup",
  },
};

export default async function SignupPage() {
  const session = await getAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      alternateHref="/login"
      alternateLabel="Log in"
      alternatePrompt="Already have an account?"
      subtitle="Automate Your Social Flow"
      title="Create your REZZUM account"
    >
      <AuthForm mode="signup" providers={enabledAuthProviders} />
    </AuthPageShell>
  );
}
