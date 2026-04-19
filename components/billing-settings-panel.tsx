import Link from "next/link";
import {
  getBillingPlan,
  getBillingPlans,
  isBillingEnabled,
  type BillingSubscriptionSummary,
} from "@/server/billing/polar";

type BillingSettingsPanelProps = {
  currentSubscription: BillingSubscriptionSummary | null;
  unavailable?: boolean;
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    currency: currency.toUpperCase(),
    style: "currency",
  }).format(amount / 100);
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function BillingSettingsPanel({
  currentSubscription,
  unavailable = false,
}: Readonly<BillingSettingsPanelProps>) {
  const billingEnabled = isBillingEnabled();
  const currentPlan = currentSubscription?.plan ? getBillingPlan(currentSubscription.plan) : null;
  const renewalDate = formatDate(currentSubscription?.currentPeriodEnd ?? null);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Billing</p>
      <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
        Subscription
      </h2>

      {!billingEnabled ? (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900">
          Add <code>POLAR_ACCESS_TOKEN</code>, <code>POLAR_PRODUCT_STARTER_ID</code>, and{" "}
          <code>POLAR_PRODUCT_PRO_ID</code> to enable billing.
        </div>
      ) : unavailable ? (
        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-7 text-rose-700">
          We could not load your Polar subscription details right now.
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-xl border border-[var(--ghost-line)] bg-[var(--surface-low)] px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">
              {currentPlan
                ? `${currentPlan.label} plan`
                : currentSubscription?.productName || "No active subscription"}
            </p>
            <div className="mt-2 space-y-1 text-sm leading-6 text-slate-500">
              {currentSubscription ? (
                <>
                  <p>
                    {formatAmount(currentSubscription.amount, currentSubscription.currency)} /{" "}
                    {currentSubscription.interval}
                  </p>
                  <p>Status: {currentSubscription.cancelAtPeriodEnd ? "Cancels at period end" : "Active"}</p>
                  {renewalDate ? (
                    <p>
                      {currentSubscription.cancelAtPeriodEnd ? "Access ends" : "Renews"} on{" "}
                      {renewalDate}
                    </p>
                  ) : null}
                </>
              ) : (
                <p>No subscription is active for this account yet.</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {getBillingPlans().map((plan) => {
              const isCurrentPlan = currentSubscription?.plan === plan.slug;

              return (
                <form key={plan.slug} action="/api/billing/subscription/change" method="post">
                  <input name="plan" type="hidden" value={plan.slug} />
                  <button
                    type="submit"
                    className={`inline-flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold ${
                      isCurrentPlan ? "button-secondary" : "button-primary"
                    }`}
                  >
                    <span>{isCurrentPlan ? `Current: ${plan.label}` : `Change to ${plan.label}`}</span>
                    <span>${plan.amount}/mo</span>
                  </button>
                </form>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3">
            <form action="/api/billing/subscription/cancel" method="post">
              <button
                type="submit"
                disabled={!currentSubscription}
                className="inline-flex w-full items-center justify-center rounded-lg border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel subscription
              </button>
            </form>

            <Link
              href="/api/billing/portal"
              className="button-secondary inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold"
            >
              Open customer portal
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
