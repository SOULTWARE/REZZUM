import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthPageShell } from "@/components/auth-page-shell";
import { enabledAuthProviders } from "@/server/auth";
import { getAuthSession } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page for REZZUM.",
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage() {
  const session = await getAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      alternateHref="/signup"
      alternateLabel="Create an account"
      alternatePrompt="Need an account?"
      subtitle="Automate Your Social Flow"
      title="Sign in to REZZUM"
    >
      <AuthForm mode="login" providers={enabledAuthProviders} />
    </AuthPageShell>
  );
}
