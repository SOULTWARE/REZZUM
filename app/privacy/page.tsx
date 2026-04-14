import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHeader } from "@/components/landing-header";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for REZZUM.",
  alternates: {
    canonical: "/privacy",
  },
};

const primaryNavLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const sections = [
  {
    title: "Information we collect",
    body:
      "REZZUM may collect account details, usage information, connected platform metadata, and workflow-related content needed to provide drafting, review, scheduling, and publishing functionality.",
  },
  {
    title: "How we use information",
    body:
      "We use information to operate the service, maintain account access, support workflow automation, improve reliability, process subscriptions, and communicate service-related updates.",
  },
  {
    title: "Connected accounts and content",
    body:
      "If you connect third-party accounts or platforms, REZZUM may process the information necessary to support authorized actions such as drafting, scheduling, and publishing. You remain responsible for the accounts and content you connect.",
  },
  {
    title: "Data retention",
    body:
      "We retain information for as long as reasonably necessary to provide the service, comply with legal obligations, resolve disputes, and enforce platform terms. Retention periods may vary by data type and account status.",
  },
  {
    title: "Security",
    body:
      "REZZUM applies reasonable administrative, technical, and operational measures to protect information handled by the service. No system can guarantee absolute security, and you are responsible for safeguarding your own account credentials.",
  },
  {
    title: "Sharing of information",
    body:
      "We do not share information except as needed to operate the service, comply with legal obligations, protect the platform, or support approved integrations and service providers involved in delivery of REZZUM.",
  },
  {
    title: "Your choices",
    body:
      "You may manage certain account information, connected services, and usage of the platform through your account settings or by discontinuing use of the service.",
  },
  {
    title: "Policy updates",
    body:
      "This privacy policy may be updated as REZZUM evolves. When material changes are made, the effective date and published policy will reflect the updated terms.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader primaryNavLinks={primaryNavLinks} />

      <main className="px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
        <section className="mx-auto max-w-4xl">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              Privacy Policy
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-5xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
              How REZZUM handles information
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--muted)] sm:text-xl">
              This policy explains the general categories of information REZZUM may process and
              how that information is used in connection with the platform.
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
              If you have questions about this privacy policy or how REZZUM handles information,
              contact the team before continuing to use the service.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/terms"
                className="button-secondary inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-semibold"
              >
                Review terms
              </Link>
              <Link
                href="/about"
                className="button-primary inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-semibold"
              >
                Learn more about REZZUM
              </Link>
            </div>
          </section>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
