import type { Metadata } from "next";
import { AccountSettingsPanel } from "@/components/account-settings-panel";
import { BillingSettingsPanel } from "@/components/billing-settings-panel";
import { PageContainer } from "@/components/page-container";
import { getCurrentSubscriptionForUser } from "@/server/billing/polar";
import { db } from "@/server/db/client";
import { getConnectedAccountOptions } from "@/server/accounts/service";
import { emailVerificationEnabled } from "@/server/auth";
import { requireAuthSession } from "@/server/auth/session";
import { updateWorkspaceSettingsAction } from "@/server/settings/actions";
import { getWorkspaceSettings } from "@/server/settings/service";

export const metadata: Metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

function getStatusBanner(searchParams: { [key: string]: string | string[] | undefined }) {
  const error = typeof searchParams.error === "string" ? searchParams.error : null;
  const billing = typeof searchParams.billing === "string" ? searchParams.billing : null;
  const billingDetail =
    typeof searchParams.billingDetail === "string" ? searchParams.billingDetail : null;

  if (searchParams.emailUpdated === "1") {
    return {
      className: "border-[rgb(0_83_218_/_0.14)] bg-[rgb(240_247_255)] text-[var(--primary-strong)]",
      message: "Your email address has been updated and verified.",
    };
  }

  if (searchParams.verified === "1") {
    return {
      className: "border-[rgb(0_83_218_/_0.14)] bg-[rgb(240_247_255)] text-[var(--primary-strong)]",
      message: "Your email address has been verified.",
    };
  }

  if (error === "TOKEN_EXPIRED") {
    return {
      className: "border-[rgb(181_125_20_/_0.18)] bg-[rgb(255_250_240)] text-[rgb(108_79_10)]",
      message: "That verification link expired. Request a new one from your account settings.",
    };
  }

  if (error === "INVALID_TOKEN") {
    return {
      className: "border-[rgb(159_64_61_/_0.18)] bg-[rgb(255_245_245)] text-[rgb(117_33_33)]",
      message: "That verification link is invalid. Request a fresh email and try again.",
    };
  }

  if (billing === "success") {
    return {
      className: "border-[rgb(0_83_218_/_0.14)] bg-[rgb(240_247_255)] text-[var(--primary-strong)]",
      message: "Your billing flow completed successfully.",
    };
  }

  if (billing === "changed") {
    return {
      className: "border-[rgb(0_83_218_/_0.14)] bg-[rgb(240_247_255)] text-[var(--primary-strong)]",
      message: "Your subscription has been updated.",
    };
  }

  if (billing === "canceled") {
    return {
      className: "border-[rgb(181_125_20_/_0.18)] bg-[rgb(255_250_240)] text-[rgb(108_79_10)]",
      message: "Your subscription will cancel at the end of the current billing period.",
    };
  }

  if (billing === "unchanged") {
    return {
      className: "border-[rgb(0_83_218_/_0.14)] bg-[rgb(240_247_255)] text-[var(--primary-strong)]",
      message: "You are already on that subscription plan.",
    };
  }

  if (
    billing === "missing-plan" ||
    billing === "no-subscription" ||
    billing === "portal-unavailable" ||
    billing === "unavailable"
  ) {
    return {
      className: "border-[rgb(159_64_61_/_0.18)] bg-[rgb(255_245_245)] text-[rgb(117_33_33)]",
      message:
        billing === "missing-plan"
          ? "Choose a valid subscription plan and try again."
          : billing === "no-subscription"
            ? "No active subscription was found for this account."
            : billing === "portal-unavailable"
              ? `We could not open the Polar customer portal right now.${billingDetail ? ` ${billingDetail}` : ""}`
              : `Billing is unavailable right now.${billingDetail ? ` ${billingDetail}` : " Verify your Polar configuration and try again."}`,
    };
  }

  return null;
}

export default async function SettingsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const session = await requireAuthSession();
  const currentSubscriptionResult = await getCurrentSubscriptionForUser(session.user.id)
    .then((subscription) => ({
      subscription,
      unavailable: false,
    }))
    .catch(() => ({
      subscription: null,
      unavailable: true,
    }));
  const [
    resolvedSearchParams,
    settings,
    linkedinAccounts,
    xAccounts,
    credentialAccount,
  ] =
    await Promise.all([
      searchParams,
      getWorkspaceSettings(),
      getConnectedAccountOptions("LINKEDIN"),
      getConnectedAccountOptions("X"),
      db.account.findFirst({
        select: {
          id: true,
          password: true,
        },
        where: {
          providerId: "credential",
          userId: session.user.id,
        },
      }),
    ]);
  const statusBanner = getStatusBanner(resolvedSearchParams);

  return (
    <PageContainer>
      {statusBanner ? (
        <div
          className={`mb-6 rounded-xl border px-4 py-4 text-sm font-medium ${statusBanner.className}`}
        >
          {statusBanner.message}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="grid gap-6">
          <AccountSettingsPanel
            emailVerificationEnabled={emailVerificationEnabled}
            hasPassword={Boolean(credentialAccount?.password)}
            user={{
              email: session.user.email,
              emailVerified: session.user.emailVerified,
              image: session.user.image ?? null,
              name: session.user.name || session.user.email,
            }}
          />

          <form action={updateWorkspaceSettingsAction} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Workspace defaults
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              Generation and delivery defaults
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              These values fill new feeds automatically and act as fallbacks when a feed does not
              override them.
            </p>

            <div className="mt-8 grid gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Default language
                  </span>
                  <input
                    name="defaultLanguage"
                    type="text"
                    defaultValue={settings.defaultLanguage}
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Default feel
                  </span>
                  <input
                    name="defaultFeel"
                    type="text"
                    defaultValue={settings.defaultFeel}
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Default style
                </span>
                <textarea
                  name="defaultStyle"
                  rows={6}
                  defaultValue={settings.defaultStyle}
                  className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm leading-7 text-slate-900"
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Default LinkedIn destination
                  </span>
                  <select
                    name="defaultLinkedInAccountId"
                    defaultValue={settings.defaultLinkedInAccountId ?? ""}
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                  >
                    <option value="">No default destination</option>
                    {linkedinAccounts.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Default X destination
                  </span>
                  <select
                    name="defaultXAccountId"
                    defaultValue={settings.defaultXAccountId ?? ""}
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                  >
                    <option value="">No default destination</option>
                    {xAccounts.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Default auto-publish interval (minutes)
                </span>
                <input
                  name="defaultAutoPublishIntervalMinutes"
                  type="number"
                  min={15}
                  defaultValue={settings.defaultAutoPublishIntervalMinutes ?? ""}
                  className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                />
              </label>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="button-primary inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold"
              >
                Save workspace defaults
              </button>
            </div>
          </form>
        </div>

        <aside className="grid gap-6">
          <BillingSettingsPanel
            currentSubscription={currentSubscriptionResult.subscription}
            unavailable={currentSubscriptionResult.unavailable}
          />

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Automation
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
              Cron endpoints
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-500">
              <p>
                Feed polling: <code>/api/cron/feeds</code>
              </p>
              <p>
                Due publishes: <code>/api/cron/publish</code>
              </p>
              <p>
                Both cron endpoints accept <code>GET</code> and <code>POST</code>.
              </p>
              <p>
                Local development uses the built-in cron worker from <code>pnpm dev</code>.
              </p>
              <p>
                Linux and AWS deployments should run <code>pnpm cron:worker</code> as a separate
                background process.
              </p>
              <p>
                Send <code>Authorization: Bearer $CRON_SECRET</code> only if you use the HTTP cron
                endpoints.
              </p>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Notes
            </p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-500">
              <p>Email/password verification emails are sent through the configured SMTP transport.</p>
              <p>LinkedIn connections import company pages the authenticated member can publish as.</p>
              <p>X uses OAuth 2.0 PKCE and stores the connected account for direct publishing.</p>
              <p>Feed-specific settings override these defaults whenever they are present.</p>
            </div>
          </section>
        </aside>
      </section>
    </PageContainer>
  );
}
