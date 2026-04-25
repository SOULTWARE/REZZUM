import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHeader } from "@/components/landing-header";
import {
  ArrowRightIcon,
  FacebookIcon,
  FeedsIcon,
  LinkedInIcon,
  PublishIcon,
  ReviewIcon,
  ScheduleIcon,
  SparkIcon,
  XIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "REZZUM | RSS-to-Social Media Automation Platform",
  description:
    "Automate social media content from RSS feeds with AI-assisted drafting, editorial review, scheduling, and publishing for Facebook, LinkedIn, and X.",
  keywords: [
    "RSS social media automation",
    "RSS to social media",
    "social media automation",
    "AI social media content",
    "social media scheduling",
    "content repurposing platform",
    "Facebook publishing",
    "LinkedIn publishing",
    "X publishing",
    "editorial workflow",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "REZZUM | RSS-to-Social Media Automation Platform",
    description:
      "Convert RSS content into high-quality social media drafts with built-in review, scheduling, and publishing workflows.",
    url: "/",
    siteName: "REZZUM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "REZZUM | RSS-to-Social Media Automation Platform",
    description:
      "Automate RSS-to-social publishing with AI drafts, human review, scheduling, and delivery to Facebook, LinkedIn, and X.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const workflowSteps = [
  {
    number: "01",
    title: "Connect your RSS sources",
    description:
      "Add company, product, and industry feeds, then define quality filters so only relevant content enters your publishing pipeline.",
    icon: FeedsIcon,
  },
  {
    number: "02",
    title: "Generate platform-ready drafts",
    description:
      "REZZUM transforms approved articles into channel-specific drafts with source context preserved for fast, accurate editing.",
    icon: SparkIcon,
  },
  {
    number: "03",
    title: "Review, schedule, and publish",
    description:
      "Maintain editorial control with a human approval workflow before each post is scheduled or published to connected accounts.",
    icon: ScheduleIcon,
  },
];

const features = [
  {
    title: "Intelligent RSS ingestion",
    description:
      "Ingest company blogs, newsroom feeds, and industry sources in one workflow with clean, deduplicated article intake.",
    icon: FeedsIcon,
  },
  {
    title: "AI-assisted content generation",
    description:
      "Generate professional social drafts from article content with platform context, tone guidance, and source traceability.",
    icon: SparkIcon,
  },
  {
    title: "Editorial review and scheduling",
    description:
      "Use a structured approval flow for editing, approval, rejection, and scheduling before publication.",
    icon: ReviewIcon,
  },
  {
    title: "Multi-channel publishing",
    description:
      "Publish approved content to Facebook, LinkedIn, and X from one queue with delivery tracking and operational reliability.",
    icon: PublishIcon,
  },
];

const primaryNavLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "REZZUM",
  url: "/",
  description:
    "RSS-to-social media automation platform with AI drafting, editorial review, scheduling, and publishing.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader primaryNavLinks={primaryNavLinks} />

      <main id="main-content">
        <section className="px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full bg-[var(--tertiary-soft)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">
                For B2B SaaS and agency teams
              </div>
              <h1 className="mt-8 max-w-4xl font-[var(--font-display)] text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                Turn RSS content into{" "}
                <span className="text-gradient">client-ready social media campaigns</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                REZZUM helps teams scale social publishing with AI-assisted drafts, human review,
                and reliable scheduling from a single workflow.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="button-primary inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold"
                >
                  Start your workflow
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href="#workflow"
                  className="button-secondary inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-semibold"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                <div className="rounded-full bg-white/70 px-4 py-2 shadow-[0_8px_24px_rgb(42_52_57_/_0.05)]">
                  Built for Facebook, LinkedIn, and X
                </div>
                <div className="rounded-full bg-white/70 px-4 py-2 shadow-[0_8px_24px_rgb(42_52_57_/_0.05)]">
                  Human approval before publishing
                </div>
                <div className="rounded-full bg-white/70 px-4 py-2 shadow-[0_8px_24px_rgb(42_52_57_/_0.05)]">
                  Scheduling built into every campaign
                </div>
              </div>

            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[rgb(0_83_218_/_0.09)] blur-3xl" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[rgb(98_91_119_/_0.10)] blur-3xl" />
              <div className="surface-card relative overflow-hidden rounded-xl p-5 sm:p-6">
                <div className="rounded-xl bg-[var(--surface-low)] p-5 sm:p-6">
                  <div className="surface-card inline-flex items-center gap-2 rounded-lg px-3 py-2">
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(255_136_0_/_0.14)] text-[rgb(255_136_0)] shadow-[inset_0_0_0_1px_rgb(255_136_0_/_0.25)]"
                      aria-label="RSS"
                    >
                      <Rss className="h-5 w-5 stroke-[2.4]" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--muted-soft)]" />
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(10_102_194_/_0.14)] text-[rgb(10_102_194)] shadow-[inset_0_0_0_1px_rgb(10_102_194_/_0.24)]"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon className="h-5 w-5" />
                    </div>
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white shadow-[inset_0_0_0_1px_rgb(15_23_42_/_0.35)]"
                      aria-label="X"
                    >
                      <XIcon className="h-5 w-5" />
                    </div>
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(24_119_242_/_0.14)] text-[rgb(24_119_242)] shadow-[inset_0_0_0_1px_rgb(24_119_242_/_0.24)]"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                    Why teams subscribe
                  </p>
                  <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                    One focused system for predictable social output
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    Replace manual handoffs with a streamlined workflow that keeps content quality
                    high and publishing cadence consistent.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <article className="rounded-lg bg-white p-4">
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">
                        Save time every week
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Convert RSS updates into editable social drafts in minutes, not hours.
                      </p>
                    </article>
                    <article className="rounded-lg bg-white p-4">
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">
                        Maintain editorial quality
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Keep human approval in the loop before any post goes live.
                      </p>
                    </article>
                    <article className="rounded-lg bg-white p-4">
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">
                        Publish with confidence
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Schedule and deliver across Facebook, LinkedIn, and X from one reliable queue.
                      </p>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-[var(--surface-low)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                How it works
              </p>
              <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                One workflow from RSS ingestion to publish-ready social content
              </h2>
              <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
                Capture content, generate drafts, approve with confidence, and publish on schedule.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {workflowSteps.map(({ number, title, description, icon: Icon }) => (
                <article key={title} className="surface-card rounded-xl p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-[var(--font-display)] text-5xl font-semibold tracking-[-0.05em] text-[rgb(0_83_218_/_0.18)]">
                      {number}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mt-8 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <div className="max-w-xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Core features
                </p>
                <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                Built for high-quality, scalable social media operations
                </h2>
                <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
                Manage ingestion, generation, review, scheduling, and publishing in one trusted
                platform.
                </p>
                <div className="mt-8 rounded-xl bg-[var(--surface-low)] p-6">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                    Current platform scope
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                      <LinkedInIcon className="h-4 w-4" />
                      LinkedIn
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                      <XIcon className="h-4 w-4" />
                      X
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {features.map(({ title, description, icon: Icon }) => (
                  <article key={title} className="surface-card rounded-xl p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-6 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                      {title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-xl bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] px-6 py-10 text-white shadow-[0_22px_46px_rgb(0_83_218_/_0.18)] sm:px-10 sm:py-12">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="max-w-2xl">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Call to action
                  </p>
                  <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-white">
                    Convert more content into consistent social growth
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-white/82">
                    Replace fragmented tools with one workflow your team can trust from draft to
                    delivery.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[var(--primary-strong)]"
                  >
                    Start publishing smarter
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-lg bg-white/14 px-6 py-3.5 text-sm font-semibold text-white"
                  >
                    Review features
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </div>
  );
}
