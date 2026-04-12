import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { FeedsIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Feeds",
};

const filterCapabilities = [
  "Name each feed and store its source URL.",
  "Filter by included keywords, excluded keywords, and minimum content length.",
  "Track sync metadata without mixing it into the route layer.",
];

export default function FeedsPage() {
  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)]">
        <PageEmptyState
          eyebrow="Feed library"
          title="No RSS feeds have been added"
          description="Feed creation and management will populate this workspace once the next milestone is implemented."
          icon={<FeedsIcon className="h-6 w-6" />}
        />

        <aside className="surface-card rounded-[1.5rem] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Feed scope
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            What belongs here
          </h2>
          <div className="mt-6 space-y-3">
            {filterCapabilities.map((item) => (
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
