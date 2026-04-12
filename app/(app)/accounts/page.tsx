import type { Metadata } from "next";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountEmptyState } from "@/components/accounts/account-empty-state";
import { AccountsIcon } from "@/components/icons";
import { MetricCard } from "@/components/metric-card";
import { PageContainer } from "@/components/page-container";
import { getAccountsOverview } from "@/server/accounts/service";

export const metadata: Metadata = {
  title: "Accounts",
};

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const overview = await getAccountsOverview();
  const hasAccounts = overview.totalCount > 0;
  const hasConnectedAccounts = overview.connectedCount > 0;

  return (
    <PageContainer>
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Connected"
          value={String(overview.connectedCount)}
          detail="Accounts ready to publish."
        />
        <MetricCard
          label="Needs attention"
          value={String(overview.attentionCount)}
          detail="Accounts that need reconnection or setup."
        />
        <MetricCard
          label="Live platforms"
          value={String(overview.activePlatformCount)}
          detail="LinkedIn and X."
        />
      </section>

      {!hasConnectedAccounts ? <AccountEmptyState /> : null}

      {hasAccounts ? (
        <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {overview.accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              showPlatformLabel={overview.accounts.length > 1}
            />
          ))}
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {[
            {
              title: "LinkedIn",
              detail: "Professional publishing and long-form distribution.",
            },
            {
              title: "X",
              detail: "Short-form distribution and fast updates.",
            },
          ].map((platform) => (
            <article key={platform.title} className="surface-card rounded-[1.5rem] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--foreground)]">
                  <AccountsIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--foreground)]">
                    {platform.title}
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--muted)]">
                    {platform.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </PageContainer>
  );
}
