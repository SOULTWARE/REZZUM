import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { SettingsIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Settings",
};

const settingsAreas = [
  "Workspace identity and product metadata.",
  "Default generation preferences and review policies.",
  "Publishing safeguards and operational defaults.",
];

export default function SettingsPage() {
  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)]">
        <PageEmptyState
          eyebrow="Workspace settings"
          title="Settings"
          description="Workspace defaults and publishing preferences will appear here."
          icon={<SettingsIcon className="h-6 w-6" />}
        />

        <aside className="surface-card rounded-[1.5rem] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Areas
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            Planned settings
          </h2>
          <div className="mt-6 space-y-3">
            {settingsAreas.map((item) => (
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
