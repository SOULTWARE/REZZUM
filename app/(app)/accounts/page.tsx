import type { Metadata } from "next";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountEmptyState } from "@/components/accounts/account-empty-state";
import { AccountsIcon, PlusIcon } from "@/components/icons";
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
      <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Connected destinations
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Manage the accounts REZZUM can publish to
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
              LinkedIn and X are the first supported platforms. The data model is ready for
              future OAuth tokens, provider IDs, reconnection, and account validation flows.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70"
          >
            <PlusIcon className="h-4 w-4" />
            Connect new account
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Connected",
              value: String(overview.connectedCount),
              detail: "Destinations currently ready for future publish jobs.",
            },
            {
              label: "Needs attention",
              value: String(overview.attentionCount),
              detail: "Pending and expired accounts that need OAuth follow-up.",
            },
            {
              label: "Live platforms",
              value: String(overview.activePlatformCount),
              detail: "The MVP starts with LinkedIn and X only.",
            },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-[1.25rem] bg-[var(--surface-low)] p-4 sm:p-5"
            >
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                {card.label}
              </p>
              <p className="mt-3 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
                {card.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{card.detail}</p>
            </article>
          ))}
        </div>
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
              detail: "Primary network for professional publishing and long-form post distribution.",
            },
            {
              title: "X",
              detail: "Short-form distribution for faster publishing cadence and timely commentary.",
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
