import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { AccountsIcon, LinkedInIcon, XIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Accounts",
};

const accountTargets = [
  {
    name: "LinkedIn",
    status: "Disconnected",
    detail: "Primary network for long-form professional posts.",
    icon: LinkedInIcon,
  },
  {
    name: "X",
    status: "Disconnected",
    detail: "Secondary network for short-form distribution.",
    icon: XIcon,
  },
];

export default function AccountsPage() {
  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.95fr)]">
        <PageEmptyState
          eyebrow="Connected destinations"
          title="No social accounts are connected"
          description="Publishing stays unavailable until at least one destination is linked. The MVP starts with LinkedIn and X."
          icon={<AccountsIcon className="h-6 w-6" />}
        />

        <aside className="space-y-4">
          {accountTargets.map(({ name, status, detail, icon: Icon }) => (
            <article key={name} className="surface-card rounded-[1.5rem] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--foreground)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--foreground)]">
                      {name}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{detail}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[var(--surface-low)] px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  {status}
                </span>
              </div>
            </article>
          ))}
        </aside>
      </section>
    </PageContainer>
  );
}
