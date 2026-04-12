import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  FeedsIcon,
  LinkedInIcon,
  PublishIcon,
  QueueIcon,
  RezzumLogo,
  ReviewIcon,
  ScheduleIcon,
  SparkIcon,
  XIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "REZZUM",
};

const workflowSteps = [
  {
    number: "01",
    title: "Connect RSS sources",
    description:
      "Add the feeds you publish or track, then control what qualifies with keywords and minimum content rules.",
    icon: FeedsIcon,
  },
  {
    number: "02",
    title: "Generate platform drafts",
    description:
      "REZZUM turns accepted articles into platform-aware drafts while preserving the article source and generation context.",
    icon: SparkIcon,
  },
  {
    number: "03",
    title: "Review, schedule, publish",
    description:
      "Every post stays in a human review flow before it is approved, scheduled, or sent to a connected account.",
    icon: ScheduleIcon,
  },
];

const features = [
  {
    title: "RSS feed ingestion",
    description:
      "Bring in company blogs, publication feeds, and industry sources from a single workflow built for deduplicated article intake.",
    icon: FeedsIcon,
  },
  {
    title: "AI generation",
    description:
      "Draft social posts from article content with platform context, tone direction, and generation metadata attached from the start.",
    icon: SparkIcon,
  },
  {
    title: "Review and scheduling",
    description:
      "Give every generated post a clear checkpoint for editing, approval, rejection, and scheduling before publication.",
    icon: ReviewIcon,
  },
  {
    title: "Multi-platform publishing",
    description:
      "Move approved content to LinkedIn and X from one queue, with the publishing model ready for status tracking and idempotent delivery.",
    icon: PublishIcon,
  },
];

const footerLinks = [
  { href: "#workflow", label: "Workflow" },
  { href: "#features", label: "Features" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="surface-panel mx-auto flex w-full max-w-7xl items-center justify-between rounded-[1.5rem] px-4 py-3 sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <RezzumLogo className="h-10 w-10" />
            <div>
              <p className="font-[var(--font-display)] text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                REZZUM
              </p>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-soft)]">
                RSS to social
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#workflow"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Workflow
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Features
            </a>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] sm:inline-flex"
            >
              Open app
            </Link>
            <Link
              href="/dashboard"
              className="button-primary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--tertiary-soft)] px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">
                <SparkIcon className="h-3.5 w-3.5" />
                Built for the REZZUM MVP
              </div>
              <h1 className="mt-8 max-w-4xl font-[var(--font-display)] text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                Turn RSS feeds into <span className="text-gradient">review-ready social posts</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                REZZUM is an RSS-to-social content transformation platform. It ingests
                articles, drafts platform-aware posts, and keeps publishing in a controlled
                human review workflow.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="button-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
                >
                  Open dashboard
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href="#workflow"
                  className="button-secondary inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                <div className="rounded-full bg-white/70 px-4 py-2 shadow-[0_8px_24px_rgb(42_52_57_/_0.05)]">
                  LinkedIn and X first
                </div>
                <div className="rounded-full bg-white/70 px-4 py-2 shadow-[0_8px_24px_rgb(42_52_57_/_0.05)]">
                  Human review before publish
                </div>
                <div className="rounded-full bg-white/70 px-4 py-2 shadow-[0_8px_24px_rgb(42_52_57_/_0.05)]">
                  Scheduling built into the flow
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-[rgb(0_83_218_/_0.09)] blur-3xl" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[rgb(98_91_119_/_0.10)] blur-3xl" />
              <div className="surface-card relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
                <div className="rounded-[1.5rem] bg-[var(--surface-low)] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                        Transformation flow
                      </p>
                      <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                        Source to scheduled draft
                      </h2>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                      MVP
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <article className="rounded-[1.5rem] bg-white p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                            Source article
                          </p>
                          <h3 className="mt-3 font-[var(--font-display)] text-xl font-semibold text-[var(--foreground)]">
                            Product release feed
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                            New release notes, changelogs, and blog articles enter one intake
                            flow before they become social drafts.
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
                          <FeedsIcon className="h-5 w-5" />
                        </div>
                      </div>
                    </article>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <article className="rounded-[1.5rem] bg-white p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                            <LinkedInIcon className="h-4 w-4" />
                            LinkedIn draft
                          </div>
                          <span className="rounded-full bg-[var(--tertiary-soft)] px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]">
                            AI draft
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[var(--foreground)]">
                          Turn release notes into a clearer product narrative with source links
                          and review metadata preserved.
                        </p>
                      </article>

                      <article className="rounded-[1.5rem] bg-white p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                            <XIcon className="h-4 w-4" />
                            X draft
                          </div>
                          <span className="rounded-full bg-[var(--primary-soft)] px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
                            Queue
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[var(--foreground)]">
                          Draft concise updates for fast distribution without skipping the human
                          review step.
                        </p>
                      </article>
                    </div>

                    <article className="rounded-[1.5rem] bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] p-5 text-white">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                            Review and scheduling
                          </p>
                          <p className="mt-3 max-w-xl text-sm leading-7 text-white/88">
                            Posts stay editable until publish, with the review queue and schedule
                            acting as the final checkpoint before delivery.
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-3 rounded-full bg-white/14 px-4 py-2 text-sm font-semibold">
                          <QueueIcon className="h-4 w-4" />
                          Review required
                        </div>
                      </div>
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
                One workflow from feed intake to publish-ready content
              </h2>
              <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
                REZZUM is designed around the MVP pipeline: feed configuration, draft
                generation, human review, and controlled scheduling.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {workflowSteps.map(({ number, title, description, icon: Icon }) => (
                <article key={title} className="surface-card rounded-[1.75rem] p-6 sm:p-7">
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

        <section id="features" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <div className="max-w-xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Core features
                </p>
                <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  Built for credible RSS-to-social operations
                </h2>
                <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
                  The MVP focuses on the pieces that make the workflow real: ingestion,
                  generation, review, scheduling, and multi-platform delivery.
                </p>
                <div className="mt-8 rounded-[1.75rem] bg-[var(--surface-low)] p-6">
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
                  <article key={title} className="surface-card rounded-[1.75rem] p-6">
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
            <div className="rounded-[2rem] bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] px-6 py-10 text-white shadow-[0_22px_46px_rgb(0_83_218_/_0.18)] sm:px-10 sm:py-12">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="max-w-2xl">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Call to action
                  </p>
                  <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-white">
                    Build a cleaner path from article intake to social distribution
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-white/82">
                    Start with the REZZUM workspace and lay the foundation for feeds,
                    generation, review, scheduling, and connected publishing.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--primary-strong)]"
                  >
                    Open the app
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full bg-white/14 px-6 py-3.5 text-sm font-semibold text-white"
                  >
                    Review features
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--ghost-line)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <RezzumLogo className="h-9 w-9" />
              <div>
                <p className="font-[var(--font-display)] text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  REZZUM
                </p>
                <p className="text-sm text-[var(--muted)]">
                  RSS-to-social transformation for the MVP workflow.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-[var(--muted)]">
            {footerLinks.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-[var(--foreground)]">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
