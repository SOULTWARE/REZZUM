import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHeader } from "@/components/landing-header";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  organizationJsonLd,
  serializeStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About REZZUM",
  description:
    "Learn how REZZUM helps teams turn RSS feeds into AI-assisted social drafts with editorial review, scheduling, and publishing workflows.",
  pathname: "/about",
  keywords: [
    "about REZZUM",
    "RSS publishing workflow",
    "social media operations platform",
    "AI content review workflow",
  ],
});

const primaryNavLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const principles = [
  {
    title: "Editorial control stays with the team",
    description:
      "REZZUM is built around approval before publication so automation improves output without removing human judgment.",
  },
  {
    title: "Operational simplicity matters",
    description:
      "RSS intake, draft generation, review, scheduling, and publishing belong in one flow that teams can trust day to day.",
  },
  {
    title: "Useful automation should stay accountable",
    description:
      "Every workflow is designed to keep source context visible so generated posts can be reviewed quickly and confidently.",
  },
] as const;

const focusAreas = [
  "RSS-driven content intake",
  "AI-assisted draft generation",
  "Editorial review workflows",
  "Scheduling and publishing operations",
] as const;

const structuredData = [
  organizationJsonLd(),
  breadcrumbJsonLd([
    { name: "Home", pathname: "/" },
    { name: "About", pathname: "/about" },
  ]),
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader primaryNavLinks={primaryNavLinks} />

      <main className="px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
        <section className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                About REZZUM
              </p>
              <h1 className="mt-4 font-[var(--font-display)] text-5xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
                A focused system for turning RSS content into reliable social output
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                REZZUM exists to help teams convert ongoing content streams into consistent,
                reviewable social publishing without relying on fragmented tools or manual
                handoffs.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="button-primary inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold"
                >
                  View pricing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="button-secondary inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-semibold"
                >
                  Open app
                </Link>
              </div>
            </div>

            <div className="surface-card rounded-2xl p-6 sm:p-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Platform focus
              </p>
              <ul className="mt-6 space-y-4">
                {focusAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-xl bg-[var(--surface-low)] px-4 py-4 text-sm font-medium text-[var(--foreground)]"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              Principles
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Built for teams that want leverage without losing quality control
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="surface-card rounded-2xl p-6 sm:p-8">
                <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                  {principle.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-7xl">
          <div className="rounded-2xl bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] px-6 py-10 text-white shadow-[0_22px_46px_rgb(0_83_218_/_0.18)] sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Next step
                </p>
                <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-white">
                  See which plan fits your workflow
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/82">
                  Start with the plan that matches your current publishing volume and expand from
                  there.
                </p>
              </div>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[var(--primary-strong)]"
              >
                Go to pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(structuredData),
        }}
      />
    </div>
  );
}
