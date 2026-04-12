import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { AccountsIcon, FeedsIcon, QueueIcon, ScheduleIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Dashboard",
};

const overviewCards = [
  {
    label: "Connected feeds",
    value: "0",
    detail: "No RSS sources configured",
    icon: FeedsIcon,
  },
  {
    label: "Draft queue",
    value: "0",
    detail: "Nothing ready for review",
    icon: QueueIcon,
  },
  {
    label: "Scheduled posts",
    value: "0",
    detail: "No publishing windows booked",
    icon: ScheduleIcon,
  },
];

export default function DashboardPage() {
  return (
    <PageContainer>
      <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.map(({ label, value, detail, icon: Icon }) => (
          <article
            key={label}
            className="surface-card rounded-[1.25rem] p-5 text-sm text-[var(--muted)]"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-[var(--surface-low)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Empty
              </span>
            </div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              {label}
            </p>
            <p className="mt-3 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
              {value}
            </p>
            <p className="mt-2 leading-6">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
        <PageEmptyState
          eyebrow="Pipeline overview"
          title="Your publishing pipeline has not started yet"
          description="REZZUM will surface ingested articles, drafted posts, and publishing activity here once feeds and accounts are connected."
          icon={<QueueIcon className="h-6 w-6" />}
          actions={
            <>
              <Link
                href="/feeds"
                className="button-primary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                Add your first feed
              </Link>
              <Link
                href="/accounts"
                className="button-secondary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                Connect accounts
              </Link>
            </>
          }
        />

        <aside className="surface-card rounded-[1.5rem] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Quick setup
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            Start with the MVP workflow
          </h2>
          <div className="mt-6 space-y-4 text-sm text-[var(--muted)]">
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">1. Configure feeds</p>
              <p className="mt-1 leading-6">
                Add RSS sources and define the filters that decide what enters the pipeline.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">2. Review drafts</p>
              <p className="mt-1 leading-6">
                Approve, edit, or reject generated posts before they are published.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">3. Connect accounts</p>
              <p className="mt-1 leading-6">
                LinkedIn and X are the first publishing targets in the MVP.
              </p>
            </div>
          </div>
          <Link
            href="/accounts"
            className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:opacity-80"
          >
            Review supported destinations
          </Link>
        </aside>
      </section>

      <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Workspace status
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              Foundation pages are in place
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--tertiary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]">
            <AccountsIcon className="h-4 w-4" />
            Ready for the next milestone
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          This shell establishes the information architecture for the feeds, review queue,
          scheduling, account management, and settings flows described in the product docs.
        </p>
      </section>
    </PageContainer>
  );
}
