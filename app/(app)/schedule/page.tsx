import type { Metadata } from "next";
import { GeneratedPostStatus } from "@prisma/client";
import { ScheduleEmptyState } from "@/components/schedule/schedule-empty-state";
import { ScheduleErrorState } from "@/components/schedule/schedule-error-state";
import { ScheduleList } from "@/components/schedule/schedule-list";
import { PageContainer } from "@/components/page-container";
import { QueueIcon, ScheduleIcon, SparkIcon } from "@/components/icons";
import { getGeneratedPostStatusLabel } from "@/lib/review-queue/constants";
import { getScheduleOverview } from "@/server/schedule/service";

export const metadata: Metadata = {
  title: "Schedule",
};

export const dynamic = "force-dynamic";

function formatRelativeDate(value: Date | null) {
  if (!value) {
    return "No publish slot reserved";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMinutes = Math.round((value.getTime() - Date.now()) / 60_000);

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  return formatter.format(Math.round(diffHours / 24), "day");
}

export default async function SchedulePage() {
  const overview = await getScheduleOverview();
  const hasItems = overview.items.length > 0;
  const statusCounts = overview.items.reduce<Partial<Record<GeneratedPostStatus, number>>>(
    (accumulator, item) => {
      accumulator[item.status] = (accumulator[item.status] ?? 0) + 1;
      return accumulator;
    },
    {},
  );
  const topStatusSummary = (Object.entries(statusCounts) as Array<[GeneratedPostStatus, number]>)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);

  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-12">
        <article className="rounded-xl bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
              <ScheduleIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[var(--surface-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Scheduled
            </span>
          </div>
          <p className="font-[var(--font-display)] text-3xl font-bold text-slate-900">
            {overview.scheduledItems.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Reserved publish slots</p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            {overview.nextScheduledItem
              ? `${overview.nextScheduledItem.article.title} goes out ${formatRelativeDate(
                  overview.nextScheduledItem.scheduledFor,
                )}.`
              : "No posts are currently scheduled for delivery."}
          </p>
        </article>

        <article className="rounded-xl bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
              <QueueIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[rgb(223_213_247_/_0.5)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgb(79_73_100)]">
              Follow-up
            </span>
          </div>
          <p className="font-[var(--font-display)] text-3xl font-bold text-slate-900">
            {overview.publishedItems.length}/{overview.failedItems.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Published / failed</p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            Delivered posts remain visible, and failed sends stay in the timeline for recovery.
          </p>
        </article>

        <article className="relative overflow-hidden rounded-xl bg-[linear-gradient(145deg,_#0053da_0%,_#0048c1_100%)] p-6 text-white shadow-sm xl:col-span-6">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">
              Timeline state
            </p>
            <p className="mt-2 font-[var(--font-display)] text-4xl font-bold tracking-[-0.04em]">
              Publishing stays visible end to end
            </p>
            <div className="mt-5 flex flex-wrap gap-6">
              {topStatusSummary.length > 0 ? (
                topStatusSummary.map(([status, count]) => (
                  <div key={status} className="min-w-[104px]">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                      {getGeneratedPostStatusLabel(status)}
                    </p>
                    <p className="mt-1 text-lg font-bold">{count}</p>
                  </div>
                ))
              ) : (
                <div className="min-w-[120px]">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">Timeline</p>
                  <p className="mt-1 text-lg font-bold">0 items</p>
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute -right-5 -top-6 text-white/10">
            <SparkIcon className="h-44 w-44" />
          </div>
        </article>
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

          <aside className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              States
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
              Publish states
            </h2>
            <div className="mt-6 space-y-3">
              {[
                "Draft and approved posts can stay unscheduled while editing continues.",
                "Scheduled posts keep a reserved publish time until delivery.",
                "Published and failed posts stay visible for follow-up.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-[var(--surface-low)] px-4 py-3 text-sm leading-6 text-slate-500"
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
