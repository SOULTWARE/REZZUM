import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHeader } from "@/components/landing-header";
import { publicFaqItems } from "@/lib/public-faq";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  serializeStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about REZZUM, RSS-to-social automation, AI-assisted drafts, review workflows, scheduling, publishing, and pricing.",
  pathname: "/faq",
  keywords: [
    "REZZUM FAQ",
    "RSS to social media FAQ",
    "AI social media automation questions",
    "RSS publishing questions",
  ],
});

const primaryNavLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

const structuredData = [
  breadcrumbJsonLd([
    { name: "Home", pathname: "/" },
    { name: "FAQ", pathname: "/faq" },
  ]),
  faqJsonLd(publicFaqItems),
];

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader primaryNavLinks={primaryNavLinks} />

      <main className="px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
        <section className="mx-auto max-w-4xl">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              FAQ
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-5xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
              Clear answers about REZZUM and RSS-to-social automation
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--muted)] sm:text-xl">
              Direct answers for teams comparing AI-assisted social publishing workflows,
              editorial review, scheduling, and supported platforms.
            </p>
          </div>

          <div className="mt-12 space-y-5">
            {publicFaqItems.map((item) => (
              <article key={item.question} className="surface-card rounded-2xl p-6 sm:p-8">
                <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                  {item.question}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.answer}</p>
              </article>
            ))}
          </div>

          <section className="mt-8 rounded-2xl bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] px-6 py-10 text-white shadow-[0_22px_46px_rgb(0_83_218_/_0.18)] sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Next step
                </p>
                <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-white">
                  Compare plans and start with the right publishing volume
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/82">
                  REZZUM includes a free plan and paid plans with 5-day trials.
                </p>
              </div>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[var(--primary-strong)]"
              >
                View pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
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
