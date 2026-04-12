import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { QueueIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Queue",
};

const reviewStates = [
  "Drafts should remain traceable to the source article and platform.",
  "Review actions need room for approve, reject, edit, and regenerate flows.",
  "Generation metadata should stay visible when posts arrive here.",
];

export default function QueuePage() {
  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.9fr)]">
        <PageEmptyState
          eyebrow="Review queue"
          title="Nothing is waiting for review"
          description="Accepted articles and generated drafts will appear here once ingestion and generation are connected."
          icon={<QueueIcon className="h-6 w-6" />}
        />

        <aside className="surface-card rounded-[1.5rem] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Review model
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            Queue expectations
          </h2>
          <div className="mt-6 space-y-3">
            {reviewStates.map((item) => (
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
