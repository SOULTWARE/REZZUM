import { SocialPlatform } from "@prisma/client";
import {
  getCurrentSubscriptionForUser,
  type BillingPlanSlug,
  type BillingSubscriptionSummary,
} from "@/server/billing/polar";
import { db } from "@/server/db/client";

export type EffectivePlanSlug = "free" | BillingPlanSlug;

export type PlanLimits = {
  label: string;
  postLimit: number;
  rssFeedLimit: number;
  allowedPlatforms: readonly SocialPlatform[];
};

export type PlanAccess = {
  plan: EffectivePlanSlug;
  limits: PlanLimits;
  subscription: BillingSubscriptionSummary | null;
};

type PlanLimitCode = "integration_limit" | "post_limit" | "rss_feed_limit";

const PLAN_LIMITS = {
  free: {
    label: "Free",
    postLimit: 5,
    rssFeedLimit: 1,
    allowedPlatforms: [SocialPlatform.FACEBOOK, SocialPlatform.LINKEDIN],
  },
  starter: {
    label: "Starter",
    postLimit: 100,
    rssFeedLimit: 10,
    allowedPlatforms: [SocialPlatform.FACEBOOK, SocialPlatform.LINKEDIN],
  },
  pro: {
    label: "Pro",
    postLimit: 1000,
    rssFeedLimit: 100,
    allowedPlatforms: [SocialPlatform.FACEBOOK, SocialPlatform.LINKEDIN, SocialPlatform.X],
  },
} satisfies Record<EffectivePlanSlug, PlanLimits>;

export class PlanLimitError extends Error {
  constructor(
    message: string,
    readonly code: PlanLimitCode,
  ) {
    super(message);
    this.name = "PlanLimitError";
  }
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPlatform(platform: SocialPlatform) {
  if (platform === SocialPlatform.FACEBOOK) {
    return "Facebook";
  }

  if (platform === SocialPlatform.LINKEDIN) {
    return "LinkedIn";
  }

  return "X";
}

function resolvePlan(subscription: BillingSubscriptionSummary | null): EffectivePlanSlug {
  return subscription?.plan ?? "free";
}

export function getPlanLimits(plan: EffectivePlanSlug) {
  return PLAN_LIMITS[plan];
}

export function getPlanAccess(subscription: BillingSubscriptionSummary | null): PlanAccess {
  const plan = resolvePlan(subscription);

  return {
    plan,
    limits: getPlanLimits(plan),
    subscription,
  };
}

export async function getUserPlanAccess(userId: string) {
  const subscription = await getCurrentSubscriptionForUser(userId).catch(() => null);

  return getPlanAccess(subscription);
}

export async function getWorkspacePlanUsage(userId: string) {
  const [rssFeedCount, generatedPostCount] = await Promise.all([
    db.rssFeed.count({
      where: {
        archivedAt: null,
        userId,
      },
    }),
    db.generatedPost.count({
      where: {
        article: {
          feed: {
            userId,
          },
        },
        nextVersions: {
          none: {},
        },
      },
    }),
  ]);

  return {
    generatedPostCount,
    rssFeedCount,
  };
}

export function isPlatformAllowed(access: PlanAccess, platform: SocialPlatform) {
  return access.limits.allowedPlatforms.includes(platform);
}

export function filterAllowedPlatforms(access: PlanAccess, platforms: SocialPlatform[]) {
  return platforms.filter((platform) => isPlatformAllowed(access, platform));
}

export function assertPlatformsAllowed(access: PlanAccess, platforms: SocialPlatform[]) {
  const blockedPlatforms = platforms.filter((platform) => !isPlatformAllowed(access, platform));

  if (blockedPlatforms.length === 0) {
    return;
  }

  throw new PlanLimitError(
    `${access.limits.label} includes ${access.limits.allowedPlatforms.map(formatPlatform).join(
      " and ",
    )}. Upgrade to Pro to use ${blockedPlatforms.map(formatPlatform).join(" and ")}.`,
    "integration_limit",
  );
}

export async function ensureCanCreateFeed(userId: string) {
  const [access, usage] = await Promise.all([
    getUserPlanAccess(userId),
    getWorkspacePlanUsage(userId),
  ]);

  if (usage.rssFeedCount >= access.limits.rssFeedLimit) {
    throw new PlanLimitError(
      `${access.limits.label} allows up to ${formatCount(
        access.limits.rssFeedLimit,
      )} RSS feed${access.limits.rssFeedLimit === 1 ? "" : "s"}.`,
      "rss_feed_limit",
    );
  }

  return access;
}

export async function getRemainingPostSlots(userId: string, access: PlanAccess) {
  const usage = await getWorkspacePlanUsage(userId);

  return Math.max(access.limits.postLimit - usage.generatedPostCount, 0);
}

export async function ensureCanCreatePosts(
  userId: string,
  access: PlanAccess,
  requestedCount: number,
) {
  if (requestedCount <= 0) {
    return;
  }

  const usage = await getWorkspacePlanUsage(userId);
  const remaining = access.limits.postLimit - usage.generatedPostCount;

  if (remaining >= requestedCount) {
    return;
  }

  throw new PlanLimitError(
    `${access.limits.label} allows up to ${formatCount(
      access.limits.postLimit,
    )} generated post${access.limits.postLimit === 1 ? "" : "s"}.`,
    "post_limit",
  );
}
