import type { Metadata } from "next";
import { ScheduleEmptyState } from "@/components/schedule/schedule-empty-state";
import { ScheduleErrorState } from "@/components/schedule/schedule-error-state";
import { ScheduleList } from "@/components/schedule/schedule-list";
import { MetricCard } from "@/components/metric-card";
import { PageContainer } from "@/components/page-container";
import { PageIntro } from "@/components/page-intro";
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
      <PageIntro
        eyebrow="Publishing pipeline"
        title="Scheduled drafts and publish outcomes"
        description="Keep the MVP simple: scheduled time, platform, and publish state stay visible without introducing a calendar interface before it is needed."
        badge={
          overview.isDemoData ? (
            <span className="rounded-full bg-[var(--tertiary-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(79_73_100)]">
              Demo publish state
            </span>
          ) : undefined
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Scheduled"
          value={String(overview.scheduledItems.length)}
          detail={
            overview.nextScheduledItem
              ? `${overview.nextScheduledItem.article.title} is set for ${formatDateTime(
                  overview.nextScheduledItem.scheduledFor,
                )}`
              : "No posts are reserved for future publishing windows."
          }
        />
        <MetricCard
          label="Published"
          value={String(overview.publishedItems.length)}
          detail="Delivered posts remain visible so operators can distinguish successful sends from scheduled or failed ones."
        />
        <MetricCard
          label="Failed"
          value={String(overview.failedItems.length)}
          detail="Failed sends keep their publish context visible so future retry flows can be added without redesigning this page."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.9fr)]">
        {hasItems ? (
          <section className="grid gap-4">
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
