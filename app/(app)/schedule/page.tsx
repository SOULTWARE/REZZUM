import type { Metadata } from "next";
import { ScheduleEmptyState } from "@/components/schedule/schedule-empty-state";
import { ScheduleErrorState } from "@/components/schedule/schedule-error-state";
import { ScheduleList } from "@/components/schedule/schedule-list";
import { PageContainer } from "@/components/page-container";
import { getScheduleOverview } from "@/server/schedule/service";

export const metadata: Metadata = {
  title: "Schedule",
};

export const dynamic = "force-dynamic";

function formatDateTime(value: Date | null) {
  if (!value) {
    return "No publish slot reserved";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function SchedulePage() {
  const overview = await getScheduleOverview();
  const hasItems = overview.items.length > 0;

  return (
    <PageContainer>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card rounded-[1.25rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Scheduled
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            {overview.scheduledItems.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {overview.nextScheduledItem
              ? `${overview.nextScheduledItem.article.title} is set for ${formatDateTime(
                  overview.nextScheduledItem.scheduledFor,
                )}`
              : "No posts are reserved for future publishing windows."}
          </p>
        </article>
        <article className="surface-card rounded-[1.25rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Published
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            {overview.publishedItems.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Delivered posts remain visible here so operators can distinguish successful sends
            from scheduled or failed ones.
          </p>
        </article>
        <article className="surface-card rounded-[1.25rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Failed
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            {overview.failedItems.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Failed sends keep their publish context visible so future retry flows can be added
            without redesigning this page.
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.9fr)]">
        {hasItems ? (
          <section className="grid gap-4">
            <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                    Publishing pipeline
                  </p>
                  <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                    Scheduled drafts and publish outcomes
                  </h2>
                </div>
                {overview.isDemoData ? (
                  <span className="rounded-full bg-[var(--tertiary-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(79_73_100)]">
                    Demo publish state
                  </span>
                ) : null}
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                This view keeps the MVP simple: scheduled time, platform, and publish state stay
                visible without introducing a calendar interface before it is actually needed.
              </p>
            </section>

            <ScheduleList items={overview.items} />
          </section>
        ) : (
          <ScheduleEmptyState />
        )}

        <section className="grid gap-6">
          <ScheduleErrorState failedItems={overview.failedItems} />

          <aside className="surface-card rounded-[1.5rem] p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Scheduling model
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              MVP publishing states
            </h2>
            <div className="mt-6 space-y-3">
              {[
                "Draft and approved posts can remain unscheduled while editing continues.",
                "Scheduled posts reserve a future publish time but remain editable until delivery.",
                "Published and failed states stay visible so future queue workers can attach without changing the UI.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] bg-[var(--surface-low)] px-4 py-3 text-sm leading-6 text-[var(--muted)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </PageContainer>
  );
}
