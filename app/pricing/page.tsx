import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHeader } from "@/components/landing-header";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple monthly pricing for REZZUM with free, Starter, and Pro limits.",
  alternates: {
    canonical: "/pricing",
  },
};

const primaryNavLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const plans = [
  {
    name: "Free",
    slug: null,
    price: 0,
    description: "Included when no paid subscription is active.",
    features: [
      "5 generated and published posts",
      "1 RSS feed",
      "Facebook and LinkedIn publishing",
      "Manual review before publishing",
    ],
    highlighted: false,
  },
  {
    name: "Starter",
    slug: "starter",
    price: 5,
    description: "A lightweight plan for getting your RSS-to-social workflow running.",
    features: [
      "100 generated and published posts",
      "10 RSS feeds",
      "Facebook and LinkedIn publishing",
      "Manual review before publishing",
      "Basic scheduling",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    slug: "pro",
    price: 20,
    description: "More capacity for teams managing a steadier publishing cadence.",
    features: [
      "1,000 generated and published posts",
      "100 RSS feeds",
      "Facebook, LinkedIn, and X publishing",
      "Editorial review and scheduling",
    ],
    highlighted: true,
  },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader primaryNavLinks={primaryNavLinks} />

      <main className="px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
        <section className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              Pricing
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-5xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
              Straightforward plans for consistent social publishing
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--muted)] sm:text-xl">
              Choose the plan that fits your publishing volume today. Both options
              keep the workflow simple and predictable.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`surface-card flex flex-col rounded-2xl border p-8 sm:p-10 ${
                  plan.highlighted
                    ? "border-[rgb(0_83_218_/_0.22)] shadow-[0_20px_48px_rgb(0_83_218_/_0.14)]"
                    : "border-[var(--ghost-line)]"
                }`}
              >
                <div className="flex min-h-36 items-start justify-between gap-4">
                  <div>
                    <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--foreground)]">
                      {plan.name}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
                      {plan.description}
                    </p>
                  </div>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
                      Popular
                    </span>
                  ) : null}
                </div>

                <div className="mt-10 flex items-end gap-2">
                  <span className="font-[var(--font-display)] text-6xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                    ${plan.price}
                  </span>
                  <span className="pb-2 text-sm font-medium text-[var(--muted)]">/ month</span>
                </div>

                <ul className="mt-10 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[var(--foreground)]">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-low)] text-[var(--primary)]">
                        <Check className="h-4 w-4" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  <Link
                    href={plan.slug ? `/signup?plan=${plan.slug}` : "/signup"}
                    className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3.5 text-sm font-semibold ${
                      plan.highlighted ? "button-primary" : "button-secondary"
                    }`}
                  >
                    {plan.slug ? "Get started" : "Start free"}
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
