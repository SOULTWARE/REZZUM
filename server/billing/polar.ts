import { getAbsoluteAppUrl } from "@/server/app-url";

export type BillingPlanSlug = "starter" | "pro";

type PolarManagedUser = {
  email: string;
  id: string;
  name: string | null;
};

type PolarCheckoutResponse = {
  url: string;
};

type PolarCustomerSessionResponse = {
  customer_portal_url: string;
  token: string;
};

type PolarSubscription = {
  amount: number;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  currency: string;
  current_period_end: string | null;
  id: string;
  product: {
    id: string;
    name: string | null;
  } | null;
  product_id: string;
  recurring_interval: string;
  started_at: string | null;
  status: string;
};

type PolarCustomerState = {
  active_subscriptions: PolarSubscription[];
  email: string;
  external_id: string | null;
  id: string;
  name: string | null;
};

export type BillingSubscriptionSummary = {
  amount: number;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  currency: string;
  currentPeriodEnd: string | null;
  id: string;
  interval: string;
  plan: BillingPlanSlug | null;
  productId: string;
  productName: string;
  startedAt: string | null;
  status: string;
};

class PolarApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PolarApiError";
  }
}

const billingPlans = {
  starter: {
    amount: 5,
    label: "Starter",
    productId: () => process.env.POLAR_PRODUCT_STARTER_ID?.trim() || "",
  },
  pro: {
    amount: 20,
    label: "Pro",
    productId: () => process.env.POLAR_PRODUCT_PRO_ID?.trim() || "",
  },
} satisfies Record<
  BillingPlanSlug,
  {
    amount: number;
    label: string;
    productId: () => string;
  }
>;

function getPolarBaseUrl() {
  return process.env.POLAR_SERVER?.trim() === "sandbox"
    ? "https://sandbox-api.polar.sh/v1"
    : "https://api.polar.sh/v1";
}

function getPolarAccessToken() {
  return process.env.POLAR_ACCESS_TOKEN?.trim() || "";
}

function getPolarConfig() {
  return {
    accessToken: getPolarAccessToken(),
    baseUrl: getPolarBaseUrl(),
    productIds: {
      pro: billingPlans.pro.productId(),
      starter: billingPlans.starter.productId(),
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (!isRecord(payload)) {
    return fallback;
  }

  const detail = payload.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  const error = payload.error;

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}

async function polarRequest<TResponse>(
  path: string,
  init: RequestInit,
  options?: {
    accessToken?: string;
  },
) {
  const config = getPolarConfig();
  const accessToken = options?.accessToken ?? config.accessToken;

  if (!accessToken) {
    throw new PolarApiError("Polar billing is not configured.", 500);
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (response.status === 204) {
    return null as TResponse;
  }

  const payload = (await response.json().catch(() => null)) as TResponse | {
    detail?: string;
    error?: string;
  } | null;

  if (!response.ok) {
    throw new PolarApiError(
      getErrorMessage(payload, "Polar billing request failed."),
      response.status,
    );
  }

  return payload as TResponse;
}

function getPlanProductId(plan: BillingPlanSlug) {
  return billingPlans[plan].productId();
}

function getManagedProductIds() {
  const config = getPolarConfig();

  return new Set(
    Object.values(config.productIds).filter((productId): productId is string => Boolean(productId)),
  );
}

function getPlanForProductId(productId: string) {
  const entries = Object.entries(billingPlans) as Array<
    [BillingPlanSlug, (typeof billingPlans)[BillingPlanSlug]]
  >;

  for (const [plan, config] of entries) {
    if (config.productId() === productId) {
      return plan;
    }
  }

  return null;
}

function normalizeSubscription(subscription: PolarSubscription): BillingSubscriptionSummary {
  return {
    amount: subscription.amount,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at,
    currency: subscription.currency,
    currentPeriodEnd: subscription.current_period_end,
    id: subscription.id,
    interval: subscription.recurring_interval,
    plan: getPlanForProductId(subscription.product_id),
    productId: subscription.product_id,
    productName: subscription.product?.name?.trim() || "Subscription",
    startedAt: subscription.started_at,
    status: subscription.status,
  };
}

function selectManagedSubscription(subscriptions: PolarSubscription[]) {
  const managedProductIds = getManagedProductIds();
  const managedSubscription = subscriptions.find((subscription) =>
    managedProductIds.has(subscription.product_id),
  );

  return managedSubscription ?? subscriptions[0] ?? null;
}

function getSettingsReturnUrl(status: string, appBaseUrl?: string) {
  return getAbsoluteAppUrl(`/settings?billing=${status}`, appBaseUrl);
}

export function isBillingEnabled() {
  const config = getPolarConfig();

  return Boolean(
    config.accessToken && config.productIds.starter && config.productIds.pro,
  );
}

export function getBillingPlans() {
  return (
    Object.entries(billingPlans) as Array<
      [BillingPlanSlug, (typeof billingPlans)[BillingPlanSlug]]
    >
  ).map(([slug, plan]) => ({
    amount: plan.amount,
    label: plan.label,
    slug,
  }));
}

export function getBillingPlan(plan: BillingPlanSlug) {
  const config = billingPlans[plan];

  return {
    amount: config.amount,
    label: config.label,
    slug: plan,
  };
}

export function resolveBillingPlanSlug(value: string | null | undefined): BillingPlanSlug | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "starter" || normalized === "startter") {
    return "starter";
  }

  if (normalized === "pro") {
    return "pro";
  }

  return null;
}

export function resolveInternalReturnPath(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export async function getCurrentSubscriptionForUser(userId: string) {
  if (!isBillingEnabled()) {
    return null;
  }

  try {
    const customerState = await polarRequest<PolarCustomerState>(
      `/customers/external/${encodeURIComponent(userId)}/state`,
      {
        method: "GET",
      },
    );
    const subscription = selectManagedSubscription(customerState.active_subscriptions);

    return subscription ? normalizeSubscription(subscription) : null;
  } catch (error) {
    if (error instanceof PolarApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function createCheckoutForPlan(input: {
  appBaseUrl?: string;
  plan: BillingPlanSlug;
  returnPath?: string;
  user: PolarManagedUser;
}) {
  const productId = getPlanProductId(input.plan);

  if (!productId || !isBillingEnabled()) {
    throw new PolarApiError("Polar billing is not configured.", 500);
  }

  const response = await polarRequest<PolarCheckoutResponse>("/checkouts", {
    body: JSON.stringify({
      customer_email: input.user.email,
      customer_name: input.user.name || input.user.email,
      external_customer_id: input.user.id,
      metadata: {
        app_user_id: input.user.id,
        selected_plan: input.plan,
      },
      products: [productId],
      return_url: getAbsoluteAppUrl(
        resolveInternalReturnPath(input.returnPath, "/pricing"),
        input.appBaseUrl,
      ),
      success_url: getSettingsReturnUrl("success", input.appBaseUrl),
    }),
    method: "POST",
  });

  return response.url;
}

export async function createCustomerPortalSession(input: {
  appBaseUrl?: string;
  returnPath?: string;
  userId: string;
}) {
  const response = await polarRequest<PolarCustomerSessionResponse>("/customer-sessions", {
    body: JSON.stringify({
      external_customer_id: input.userId,
      return_url: getAbsoluteAppUrl(
        resolveInternalReturnPath(input.returnPath, "/settings"),
        input.appBaseUrl,
      ),
    }),
    method: "POST",
  });

  return response;
}

export async function cancelSubscriptionForUser(input: {
  appBaseUrl?: string;
  userId: string;
}) {
  const currentSubscription = await getCurrentSubscriptionForUser(input.userId);

  if (!currentSubscription) {
    return false;
  }

  const customerSession = await createCustomerPortalSession({
    appBaseUrl: input.appBaseUrl,
    returnPath: "/settings",
    userId: input.userId,
  });

  await polarRequest(
    `/customer-portal/subscriptions/${currentSubscription.id}`,
    {
      method: "DELETE",
    },
    {
      accessToken: customerSession.token,
    },
  );

  return true;
}

export async function changeSubscriptionForUser(input: {
  appBaseUrl?: string;
  plan: BillingPlanSlug;
  user: PolarManagedUser;
}) {
  const targetProductId = getPlanProductId(input.plan);

  if (!targetProductId || !isBillingEnabled()) {
    throw new PolarApiError("Polar billing is not configured.", 500);
  }

  const currentSubscription = await getCurrentSubscriptionForUser(input.user.id);

  if (!currentSubscription) {
    return {
      checkoutUrl: await createCheckoutForPlan({
        appBaseUrl: input.appBaseUrl,
        plan: input.plan,
        returnPath: "/settings",
        user: input.user,
      }),
      type: "checkout" as const,
    };
  }

  if (currentSubscription.productId === targetProductId) {
    return {
      type: "noop" as const,
    };
  }

  const customerSession = await createCustomerPortalSession({
    appBaseUrl: input.appBaseUrl,
    returnPath: "/settings",
    userId: input.user.id,
  });

  await polarRequest(
    `/customer-portal/subscriptions/${currentSubscription.id}`,
    {
      body: JSON.stringify({
        product_id: targetProductId,
      }),
      method: "PATCH",
    },
    {
      accessToken: customerSession.token,
    },
  );

  return {
    type: "updated" as const,
  };
}
