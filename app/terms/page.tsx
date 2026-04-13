import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHeader } from "@/components/landing-header";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for REZZUM.",
  alternates: {
    canonical: "/terms",
  },
};

const primaryNavLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const sections = [
  {
    title: "Acceptance of terms",
    body:
      "By accessing or using REZZUM, you agree to these Terms of Use. If you do not agree, do not use the service.",
  },
  {
    title: "Use of the service",
    body:
      "You may use REZZUM only in compliance with applicable laws and only for legitimate publishing, review, and scheduling workflows. You are responsible for the content you create, review, schedule, and publish through the platform.",
  },
  {
    title: "Accounts and access",
    body:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate information when creating or managing your account.",
  },
  {
    title: "Billing and plans",
    body:
      "Paid plans are billed according to the pricing presented by REZZUM at the time of purchase. If billing terms, renewals, or refunds are introduced or updated, those terms will apply to the relevant subscription or purchase.",
  },
  {
    title: "Content and connected platforms",
    body:
      "You retain responsibility for the source material, drafts, edits, and published posts processed through REZZUM. You must have the necessary rights to use the content and to connect any third-party platforms or accounts.",
  },
  {
    title: "Prohibited conduct",
    body:
      "You may not use REZZUM to violate laws, infringe intellectual property rights, distribute malicious content, abuse connected platforms, or interfere with the security or reliability of the service.",
  },
  {
    title: "Availability and changes",
    body:
      "REZZUM may update, modify, suspend, or discontinue parts of the service from time to time. We may also update these terms as the product evolves.",
  },
  {
    title: "Termination",
    body:
      "We may suspend or terminate access to REZZUM if these terms are violated or if use of the service creates operational, legal, or security risk.",
  },
  {
    title: "Disclaimer and limitation of liability",
    body:
      "REZZUM is provided on an as-available basis to the extent permitted by applicable law. To the extent permitted by law, REZZUM is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the service.",
  },
] as const;

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader primaryNavLinks={primaryNavLinks} />

      <main className="px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
        <section className="mx-auto max-w-4xl">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              Terms of Use
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-5xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
              Terms for using REZZUM
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--muted)] sm:text-xl">
              These terms govern access to and use of the REZZUM platform, including connected
              workflows for content generation, review, scheduling, and publishing.
            </p>
            <p className="mt-4 text-sm font-medium text-[var(--muted-soft)]">
              Effective date: April 13, 2026
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {sections.map((section) => (
              <section key={section.title} className="surface-card rounded-2xl p-6 sm:p-8">
                <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                  {section.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{section.body}</p>
              </section>
            ))}
          </div>

          <section className="surface-card mt-6 rounded-2xl p-6 sm:p-8">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              Contact
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              For questions about these terms, contact the REZZUM team before continuing to use the
              service.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about"
                className="button-secondary inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-semibold"
              >
                Learn more about REZZUM
              </Link>
              <Link
                href="/pricing"
                className="button-primary inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-semibold"
              >
                View pricing
              </Link>
            </div>
          </section>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
