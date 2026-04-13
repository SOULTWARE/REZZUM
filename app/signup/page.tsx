import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth-page-shell";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign-up page for REZZUM.",
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupPage() {
  return (
    <AuthPageShell
      alternateHref="/login"
      alternateLabel="Log in"
      alternatePrompt="Already have an account?"
      fields={[
        {
          autoComplete: "name",
          label: "Full name",
          name: "name",
          placeholder: "Your name",
          type: "text",
        },
        {
          autoComplete: "email",
          label: "Email address",
          name: "email",
          placeholder: "you@company.com",
          type: "email",
        },
        {
          autoComplete: "new-password",
          label: "Password",
          name: "password",
          placeholder: "Create a password",
          type: "password",
        },
      ]}
      submitLabel="Create account"
      subtitle="Automate Your Social Flow"
      title="Create your REZZUM account"
    />
  );
}
