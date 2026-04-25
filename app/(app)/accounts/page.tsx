import Link from "next/link";
import type { Metadata } from "next";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountEmptyState } from "@/components/accounts/account-empty-state";
import { AccountsIcon, FacebookIcon, LinkedInIcon, SparkIcon, XIcon } from "@/components/icons";
import { PageContainer } from "@/components/page-container";
import { requireAuthSession } from "@/server/auth/session";
import { getUserPlanAccess } from "@/server/billing/limits";
import { getAccountsOverview } from "@/server/accounts/service";

export const metadata: Metadata = {
  title: "Accounts",
};

export const dynamic = "force-dynamic";

function formatPercentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function StarterPlatformCard({
  title,
  detail,
  icon,
  href,
  actionLabel = "Connect",
}: Readonly<{
  title: string;
  detail: string;
  icon: React.ReactNode;
  href: string;
  actionLabel?: string;
}>) {
  return (
    <article className="rounded-xl border border-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:border-[rgb(0_83_218_/_0.1)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--surface-high)] ring-4 ring-[var(--surface-low)] text-slate-900">
          {icon}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgb(95_95_98_/_0.08)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Pending
        </span>
      </div>
      <h2 className="font-[var(--font-display)] text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
      <div className="mt-5 flex items-center gap-3">
        <Link
          href={href}
          className="button-primary flex-1 rounded-lg py-2 text-center text-xs font-semibold text-white"
        >
          {actionLabel}
        </Link>
        <Link
          href={href}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-low)] text-slate-500"
        >
          <AccountsIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default async function AccountsPage() {
  const session = await requireAuthSession();
  const overview = await getAccountsOverview();
  const planAccess = await getUserPlanAccess(session.user.id);
  const canUseX = planAccess.limits.allowedPlatforms.includes("X");
  const hasAccounts = overview.totalCount > 0;
  const connectionRate = formatPercentage(overview.connectedCount, overview.totalCount);
  const platformCoverage = formatPercentage(overview.activePlatformCount, 3);

  return (
    <PageContainer>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {hasAccounts
          ? overview.accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                showPlatformLabel={overview.accounts.length > 1}
              />
            ))
          : null}

        <StarterPlatformCard
          title="Connect Facebook"
          detail="Authorize Facebook and import the Pages this member can publish as."
          icon={<FacebookIcon className="h-6 w-6" />}
          href="/api/auth/facebook/start"
        />
        <StarterPlatformCard
          title="Connect LinkedIn"
          detail="Authorize LinkedIn and import the company pages this member can publish as."
          icon={<LinkedInIcon className="h-6 w-6" />}
          href="/api/auth/linkedin/start"
        />
        <StarterPlatformCard
          title={canUseX ? "Connect X" : "Upgrade for X"}
          detail={
            canUseX
              ? "Authorize X with OAuth 2.0 PKCE for direct posting from the review queue."
              : "X publishing is available on the Pro plan."
          }
          icon={<XIcon className="h-6 w-6" />}
          href={canUseX ? "/api/auth/x/start" : "/pricing"}
          actionLabel={canUseX ? "Connect" : "View Pro"}
        />
        <AccountEmptyState />
      </section>

      <section className="flex flex-col gap-8 rounded-[1.5rem] border border-[rgb(223_213_247)] bg-[rgb(223_213_247_/_0.28)] p-8 md:flex-row md:items-center">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgb(98_91_119)] px-3 py-1 text-white">
            <SparkIcon className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
              Connection pulse
            </span>
          </div>
          <h2 className="font-[var(--font-display)] text-2xl font-bold tracking-[-0.03em] text-[rgb(60_54_80)]">
            Publishing coverage stays healthy when every destination is verified.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[rgb(89_82_110)]">
            REZZUM currently has {overview.connectedCount} connected account
            {overview.connectedCount === 1 ? "" : "s"} and {overview.attentionCount} connection
            {overview.attentionCount === 1 ? "" : "s"} that still need attention before
            scheduling and publishing can run without interruption.
          </p>
        </div>

        <div className="w-full rounded-xl border border-white/60 bg-white/50 p-4 backdrop-blur-md md:w-72">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                <span>Connection rate</span>
                <span>{connectionRate}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-high)]">
                <div
                  className="h-full bg-[rgb(98_91_119)]"
                  style={{ width: `${connectionRate}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                <span>Platform coverage</span>
                <span>{platformCoverage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-high)]">
                <div
                  className="h-full bg-[var(--primary)]"
                  style={{ width: `${platformCoverage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
