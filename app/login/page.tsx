import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth-page-shell";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page for REZZUM.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <AuthPageShell
      alternateHref="/signup"
      alternateLabel="Create an account"
      alternatePrompt="Need an account?"
      fields={[
        {
          autoComplete: "email",
          label: "Email address",
          name: "email",
          placeholder: "you@company.com",
          type: "email",
        },
        {
          autoComplete: "current-password",
          label: "Password",
          name: "password",
          placeholder: "Enter your password",
          type: "password",
        },
      ]}
      submitLabel="Log in"
      subtitle="Automate Your Social Flow"
      title="Sign in to REZZUM"
    />
  );
}
