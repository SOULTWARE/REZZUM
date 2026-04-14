import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import {
  AccountsIcon,
  DashboardIcon,
  FeedsIcon,
  QueueIcon,
  ScheduleIcon,
  SettingsIcon,
  SparkIcon,
  SupportIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Support",
};

const supportSections = [
  {
    id: "start-here",
    label: "Start here",
    summary: "Use this when you are setting up a workspace for the first time.",
  },
  {
    id: "workflow",
    label: "Full workflow",
    summary: "See the end-to-end path from source article to published post.",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    summary: "Understand the high-level health and activity cards.",
  },
  {
    id: "feeds",
    label: "Feeds",
    summary: "Configure sources, filters, destinations, and sync cadence.",
  },
  {
    id: "queue",
    label: "Queue",
    summary: "Review, edit, approve, reject, schedule, or publish drafts.",
  },
  {
    id: "schedule",
    label: "Schedule",
    summary: "Track scheduled, published, and failed deliveries.",
  },
  {
    id: "accounts",
    label: "Accounts",
    summary: "Connect and maintain the destinations REZZUM can publish to.",
  },
  {
    id: "settings",
    label: "Settings",
    summary: "Define workspace defaults and automation behavior.",
  },
  {
    id: "faq",
    label: "FAQ",
    summary: "Answers to the most common support questions.",
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    summary: "Quick checks when drafts or publishing do not behave as expected.",
  },
] as const;

const gettingStartedSteps = [
  {
    title: "Connect publishing accounts first",
    description:
      "Open Accounts and authorize the LinkedIn pages or X profiles that REZZUM should publish to. Drafts and publishing actions depend on having valid destinations available.",
    href: "/accounts",
    cta: "Open accounts",
    icon: AccountsIcon,
  },
  {
    title: "Set workspace defaults",
    description:
      "Use Settings to define the default language, feel, style notes, preferred destinations, and optional auto-publish interval that new feeds should inherit.",
    href: "/settings",
    cta: "Open settings",
    icon: SettingsIcon,
  },
  {
    title: "Add one or more feeds",
    description:
      "Create a feed with a source URL, filtering rules, and destination accounts. This determines what enters the pipeline and how it should be written.",
    href: "/feeds/new",
    cta: "Add a feed",
    icon: FeedsIcon,
  },
  {
    title: "Review and ship drafts",
    description:
      "Once a feed picks up articles, move through Queue to edit copy, assign the destination account, and either approve, schedule, or publish immediately.",
    href: "/queue",
    cta: "Open queue",
    icon: QueueIcon,
  },
] as const;

const workflowSteps = [
  "A feed polls its RSS source on the configured cadence.",
  "Articles that pass the feed rules enter the generation pipeline.",
  "REZZUM creates review drafts for the supported platforms in scope.",
  "The Queue is where a human editor reviews, edits, regenerates, rejects, approves, schedules, or publishes those drafts.",
  "Scheduled and completed deliveries remain visible in Schedule so the team can track the timeline and recover from failures.",
] as const;

const pageGuides = [
  {
    id: "dashboard",
    title: "Dashboard",
    eyebrow: "Workspace overview",
    href: "/dashboard",
    icon: DashboardIcon,
    points: [
      "Use Dashboard to see feed activity, review volume, scheduled work, and account coverage in one place.",
      "The metric cards summarize pending syncs, drafts awaiting review, live source count, and connected accounts.",
      "Recent Activity helps you jump into the queue, feed library, or schedule without drilling into each page first.",
    ],
  },
  {
    id: "feeds",
    title: "Feeds",
    eyebrow: "Source management",
    href: "/feeds",
    icon: FeedsIcon,
    points: [
      "Feeds define which RSS sources REZZUM monitors and how incoming content should be filtered before draft generation.",
      "Use feed-level language, feel, and style notes when a source needs different writing behavior than the workspace defaults.",
      "Filtering controls such as keywords and minimum word count help keep weak or irrelevant articles out of the queue.",
      "A feed status of Active means it is eligible to poll, Paused stops normal processing, and Error means the source needs attention.",
    ],
  },
  {
    id: "queue",
    title: "Queue",
    eyebrow: "Human review",
    href: "/queue",
    icon: QueueIcon,
    points: [
      "Queue is the primary editing workspace. It shows generated drafts and supports filtering by status, platform, and feed.",
      "Open any draft to review the source article, compare platform variants, change the destination account, and edit the copy directly.",
      "From the editor you can Save Draft, Regenerate, Reject, Approve, Schedule, or Publish Now.",
      "A draft can stay in DRAFT or APPROVED without being scheduled until the team is ready to commit to a publish time.",
    ],
  },
  {
    id: "schedule",
    title: "Schedule",
    eyebrow: "Timeline and delivery",
    href: "/schedule",
    icon: ScheduleIcon,
    points: [
      "Schedule gives you the publishing timeline across scheduled, published, and failed posts.",
      "Use it to confirm what is reserved for delivery next and to identify posts that need recovery or follow-up.",
      "Published and failed items stay visible so the team can audit delivery outcomes instead of losing the trail after send time.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts",
    eyebrow: "Destination management",
    href: "/accounts",
    icon: AccountsIcon,
    points: [
      "Accounts is where LinkedIn and X connections are created and monitored.",
      "LinkedIn imports the company pages the authenticated member can publish as, while X uses OAuth 2.0 PKCE for direct posting.",
      "If an account is expired or disconnected, drafts may still exist, but scheduling and publishing to that destination will need attention.",
    ],
  },
  {
    id: "settings",
    title: "Settings",
    eyebrow: "Defaults and automation",
    href: "/settings",
    icon: SettingsIcon,
    points: [
      "Settings controls the workspace defaults that are applied when a feed does not override them.",
      "Default destinations reduce manual assignment during review, especially when most feeds publish to the same accounts.",
      "The page also documents the cron endpoints and worker process needed to keep polling and publishing moving in deployed environments.",
    ],
  },
] as const;

const statusGroups = [
  {
    title: "Feed statuses",
    items: [
      "Active: the source is eligible to poll and process new content.",
      "Paused: the feed is intentionally not processing new items right now.",
      "Error: the source or feed configuration needs attention before the pipeline can continue normally.",
      "Archived: the feed is retained for reference but is not part of the active workflow.",
    ],
  },
  {
    title: "Draft statuses",
    items: [
      "Draft: the copy is still being reviewed or edited.",
      "Approved: the team has accepted the content, but it may still be unscheduled.",
      "Scheduled: the post has a reserved publish time.",
      "Published: the post was delivered successfully.",
      "Rejected or Failed: the post was intentionally stopped or could not be delivered.",
    ],
  },
  {
    title: "Account statuses",
    items: [
      "Connected: the account is available for assignment and delivery.",
      "Pending: the connection has started but is not yet usable.",
      "Expired: the authorization needs to be refreshed before publishing can continue.",
      "Disconnected: the destination is not currently available to the workspace.",
    ],
  },
] as const;

const faqs = [
  {
    question: "Where should I start in a brand-new workspace?",
    answer:
      "Start with Accounts, then Settings, then create at least one feed. That sequence gives REZZUM a valid destination, a set of writing defaults, and a content source to monitor.",
  },
  {
    question: "Why are no drafts appearing in the queue?",
    answer:
      "Check that at least one feed is active, the RSS source is returning articles, the feed filters are not too strict, and your queue filters are not hiding the drafts that were generated.",
  },
  {
    question: "What is the difference between approving and scheduling?",
    answer:
      "Approving marks the draft as accepted. Scheduling assigns a publish time. A draft can be approved before the team knows exactly when it should go live.",
  },
  {
    question: "Can I edit AI-generated copy before it is sent?",
    answer:
      "Yes. Open the draft in Queue and edit the text directly. REZZUM keeps the original generation visible when the draft has been changed manually.",
  },
  {
    question: "When should I use regenerate?",
    answer:
      "Use regenerate when the structure, framing, or tone of the current draft is off enough that manual edits would take longer than creating a fresh version.",
  },
  {
    question: "How do I publish immediately instead of scheduling?",
    answer:
      "Open the draft in Queue, confirm the destination account, and use Publish Now. This bypasses waiting for a later scheduled slot.",
  },
  {
    question: "Why does a draft show an unavailable platform tab?",
    answer:
      "The source article does not currently have a sibling draft for that platform. The active platform can still be reviewed independently.",
  },
  {
    question: "Where do I confirm whether something actually went out?",
    answer:
      "Use Schedule. It keeps scheduled, published, and failed posts in one timeline so you can see what was delivered and what still needs follow-up.",
  },
] as const;

const troubleshootingChecks = [
  {
    title: "Drafts are missing",
    steps: [
      "Confirm the feed is Active and has a valid next sync.",
      "Review feed filters such as keywords and minimum word count.",
      "Clear queue filters to make sure the drafts are not hidden from view.",
    ],
  },
  {
    title: "The wrong account is selected",
    steps: [
      "Check the feed-level destination settings first.",
      "Review workspace defaults in Settings.",
      "Override the destination directly in the draft editor before approval or publishing.",
    ],
  },
  {
    title: "Publishing is not happening",
    steps: [
      "Verify the assigned account is still Connected.",
      "Confirm the draft is Scheduled or use Publish Now from the editor.",
      "In deployed environments, make sure the cron worker or cron endpoints are running so due publishes are processed.",
    ],
  },
  {
    title: "Draft quality is off target",
    steps: [
      "Adjust feed-level language, feel, or style notes for that source.",
      "Use Regenerate after you tighten the instructions.",
      "Lower noise in the feed by refining include and exclude keywords.",
    ],
  },
] as const;

function SupportSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <section id={id} className="scroll-mt-32 rounded-[1.5rem] bg-white p-6 shadow-sm sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em] text-slate-900">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function SupportPage() {
  return (
    <PageContainer>
      <section className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(145deg,_#0053da_0%,_#0048c1_100%)] px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">
            <SupportIcon className="h-4 w-4" />
            Support center
          </div>
          <h1 className="mt-5 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em] sm:text-[3.25rem]">
            Everything in REZZUM, explained end to end.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
            Use this guide to set up sources, connect destinations, review AI drafts, schedule
            delivery, and troubleshoot the most common workflow issues without leaving the app.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-8 -top-10 text-white/10">
          <SparkIcon className="h-48 w-48" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-32 xl:self-start">
          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm sm:p-5">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              On this page
            </p>
            <nav className="mt-4 space-y-1.5">
              {supportSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl px-3 py-3 transition-colors hover:bg-[var(--surface-low)]"
                >
                  <p className="text-sm font-semibold text-slate-900">{section.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{section.summary}</p>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="grid gap-6">
          <SupportSection
            id="start-here"
            eyebrow="Setup"
            title="Start here"
            description="If you are onboarding a new workspace, this is the fastest path to a working content pipeline."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {gettingStartedSteps.map(({ title, description, href, cta, icon: Icon }) => (
                <article key={title} className="rounded-2xl bg-[var(--surface-low)] p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
                  <Link
                    href={href}
                    className="mt-5 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] shadow-sm hover:opacity-85"
                  >
                    {cta}
                  </Link>
                </article>
              ))}
            </div>
          </SupportSection>

          <SupportSection
            id="workflow"
            eyebrow="Walkthrough"
            title="The full app workflow"
            description="REZZUM is built around a single pipeline. Once you understand the sequence below, the rest of the product becomes easier to navigate."
          >
            <div className="grid gap-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-2xl border border-slate-200/70 bg-white px-5 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-strong)]">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-7 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </SupportSection>

          {pageGuides.map(({ id, eyebrow, title, href, icon: Icon, points }) => (
            <SupportSection
              key={id}
              id={id}
              eyebrow={eyebrow}
              title={title}
              description={`Open ${title} when you need to work on this part of the pipeline directly.`}
            >
              <div className="rounded-2xl bg-[var(--surface-low)] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        This page is part of the core publishing workflow and should stay in your
                        regular operating rhythm.
                      </p>
                    </div>
                  </div>

                  <Link
                    href={href}
                    className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] shadow-sm hover:opacity-85"
                  >
                    Open {title}
                  </Link>
                </div>

                <div className="mt-6 grid gap-3">
                  {points.map((point) => (
                    <div
                      key={point}
                      className="rounded-xl bg-white px-4 py-3 text-sm leading-7 text-slate-600 shadow-sm"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </SupportSection>
          ))}

          <SupportSection
            id="faq"
            eyebrow="Common questions"
            title="FAQ"
            description="These are the questions most teams ask while they are learning the workflow or diagnosing a missing step."
          >
            <div className="grid gap-4">
              {faqs.map(({ question, answer }) => (
                <article key={question} className="rounded-2xl bg-[var(--surface-low)] p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{answer}</p>
                </article>
              ))}
            </div>
          </SupportSection>

          <SupportSection
            id="troubleshooting"
            eyebrow="Support checks"
            title="Troubleshooting and status reference"
            description="Use these checks before assuming the pipeline is broken. Most issues come down to feed state, destination availability, or automation not running."
          >
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div className="grid gap-4">
                {troubleshootingChecks.map(({ title, steps }) => (
                  <article key={title} className="rounded-2xl bg-[var(--surface-low)] p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    <div className="mt-4 space-y-3">
                      {steps.map((step) => (
                        <div
                          key={step}
                          className="rounded-xl bg-white px-4 py-3 text-sm leading-7 text-slate-600 shadow-sm"
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="grid gap-4">
                {statusGroups.map(({ title, items }) => (
                  <article key={title} className="rounded-2xl bg-slate-900 p-5 text-white">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="mt-4 space-y-3">
                      {items.map((item) => (
                        <div
                          key={item}
                          className="rounded-xl bg-white/8 px-4 py-3 text-sm leading-7 text-white/76"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </SupportSection>
        </div>
      </section>
    </PageContainer>
  );
}
