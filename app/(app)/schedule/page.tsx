import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { ScheduleIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Schedule",
};

const publishingRules = [
  "Scheduled posts stay editable until they are published.",
  "Publishing must be idempotent and preserve attempt history.",
  "Status transitions should remain obvious once real data is connected.",
];

export default function SchedulePage() {
  return (
    <PageContainer>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card rounded-[1.25rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Scheduled
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            0
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            No posts are reserved for future publishing windows.
          </p>
        </article>
        <article className="surface-card rounded-[1.25rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Published
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            0
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Delivery history will appear after publishing services are wired up.
          </p>
        </article>
        <article className="surface-card rounded-[1.25rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Failed
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            0
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Retry history and provider responses will live alongside failed runs.
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.9fr)]">
        <PageEmptyState
          eyebrow="Publishing calendar"
          title="There are no scheduled posts"
          description="Once review and account connections exist, this page will show upcoming sends and publishing outcomes."
          icon={<ScheduleIcon className="h-6 w-6" />}
        />

        <aside className="surface-card rounded-[1.5rem] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Publishing rules
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            Scheduling constraints
          </h2>
          <div className="mt-6 space-y-3">
            {publishingRules.map((item) => (
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
    </PageContainer>
  );
}
