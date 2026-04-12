import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  FeedStatus,
  PrismaClient,
  SocialAccountStatus,
  SocialPlatform,
} from "@prisma/client";
import { normalizeFeedUrl } from "../lib/feeds/constants";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the REZZUM seed.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const now = new Date();

const seededFeeds = [
  {
    name: "REZZUM Product Updates",
    rssUrl: "https://rezzum.example/blog/rss.xml",
    status: FeedStatus.ACTIVE,
    refreshIntervalMinutes: 60,
    lastSyncedAt: new Date(now.getTime() - 28 * 60_000),
    lastSyncAttemptAt: new Date(now.getTime() - 28 * 60_000),
    nextSyncAt: new Date(now.getTime() + 32 * 60_000),
    syncError: null,
    filter: {
      minimumWordCount: 250,
      includeKeywords: ["product update", "release", "workflow", "rss"],
      excludeKeywords: ["hiring", "sponsored"],
    },
  },
  {
    name: "Applied AI Briefing",
    rssUrl: "https://signals.example/ai/feed.xml",
    status: FeedStatus.ACTIVE,
    refreshIntervalMinutes: 180,
    lastSyncedAt: new Date(now.getTime() - 112 * 60_000),
    lastSyncAttemptAt: new Date(now.getTime() - 112 * 60_000),
    nextSyncAt: new Date(now.getTime() + 68 * 60_000),
    syncError: null,
    filter: {
      minimumWordCount: 500,
      includeKeywords: ["llm", "agents", "workflow automation"],
      excludeKeywords: ["event recap", "podcast"],
    },
  },
  {
    name: "Creator Economy Watch",
    rssUrl: "https://creators.example/feed",
    status: FeedStatus.PAUSED,
    refreshIntervalMinutes: 720,
    lastSyncedAt: new Date(now.getTime() - 2 * 24 * 60_000 * 60),
    lastSyncAttemptAt: new Date(now.getTime() - 2 * 24 * 60_000 * 60),
    nextSyncAt: null,
    syncError: null,
    filter: {
      minimumWordCount: 300,
      includeKeywords: ["creator business", "newsletter", "audience"],
      excludeKeywords: ["jobs"],
    },
  },
  {
    name: "Startup Funding Radar",
    rssUrl: "https://funding.example/rss",
    status: FeedStatus.ERROR,
    refreshIntervalMinutes: 15,
    lastSyncedAt: null,
    lastSyncAttemptAt: new Date(now.getTime() - 16 * 60_000),
    nextSyncAt: new Date(now.getTime() + 5 * 60_000),
    syncError: "Source returned malformed XML during the last sync attempt.",
    filter: {
      minimumWordCount: 0,
      includeKeywords: [],
      excludeKeywords: ["podcast", "sponsored"],
    },
  },
] as const;

const seededSocialAccounts = [
  {
    platform: SocialPlatform.LINKEDIN,
    status: SocialAccountStatus.CONNECTED,
    displayName: "REZZUM Company Page",
    handle: "linkedin.com/company/rezzum",
    profileUrl: "https://linkedin.com/company/rezzum",
    providerAccountId: "li_company_rezzum_001",
    providerUsername: "rezzum",
    accessTokenEncrypted: "dev_token_placeholder_linkedin_company",
    refreshTokenEncrypted: "dev_refresh_placeholder_linkedin_company",
    tokenExpiresAt: new Date(now.getTime() + 21 * 24 * 60 * 60_000),
    scopes: ["w_member_social", "r_organization_social"],
    lastValidatedAt: new Date(now.getTime() - 95 * 60_000),
    connectedAt: new Date(now.getTime() - 45 * 24 * 60 * 60_000),
    disconnectedAt: null,
  },
  {
    platform: SocialPlatform.X,
    status: SocialAccountStatus.PENDING,
    displayName: "REZZUM on X",
    handle: "@rezzumhq",
    profileUrl: "https://x.com/rezzumhq",
    providerAccountId: "x_rezzumhq_pending_001",
    providerUsername: "rezzumhq",
    accessTokenEncrypted: null,
    refreshTokenEncrypted: null,
    tokenExpiresAt: null,
    scopes: [],
    lastValidatedAt: null,
    connectedAt: null,
    disconnectedAt: null,
  },
  {
    platform: SocialPlatform.LINKEDIN,
    status: SocialAccountStatus.EXPIRED,
    displayName: "Ismail Founder Profile",
    handle: "linkedin.com/in/ismail-rezzum",
    profileUrl: "https://linkedin.com/in/ismail-rezzum",
    providerAccountId: "li_founder_ismail_001",
    providerUsername: "ismail-rezzum",
    accessTokenEncrypted: "dev_token_placeholder_linkedin_founder",
    refreshTokenEncrypted: "dev_refresh_placeholder_linkedin_founder",
    tokenExpiresAt: new Date(now.getTime() - 36 * 60 * 60_000),
    scopes: ["w_member_social"],
    lastValidatedAt: new Date(now.getTime() - 9 * 24 * 60 * 60_000),
    connectedAt: new Date(now.getTime() - 120 * 24 * 60 * 60_000),
    disconnectedAt: null,
  },
] as const;

async function main() {
  for (const feed of seededFeeds) {
    const normalizedRssUrl = normalizeFeedUrl(feed.rssUrl);

    await prisma.rssFeed.upsert({
      where: { normalizedRssUrl },
      update: {
        name: feed.name,
        rssUrl: feed.rssUrl,
        status: feed.status,
        refreshIntervalMinutes: feed.refreshIntervalMinutes,
        lastSyncedAt: feed.lastSyncedAt,
        lastSyncAttemptAt: feed.lastSyncAttemptAt,
        nextSyncAt: feed.nextSyncAt,
        syncError: feed.syncError,
        archivedAt: null,
        filter: {
          upsert: {
            update: {
              minimumWordCount: feed.filter.minimumWordCount,
              includeKeywords: [...feed.filter.includeKeywords],
              excludeKeywords: [...feed.filter.excludeKeywords],
            },
            create: {
              minimumWordCount: feed.filter.minimumWordCount,
              includeKeywords: [...feed.filter.includeKeywords],
              excludeKeywords: [...feed.filter.excludeKeywords],
            },
          },
        },
      },
      create: {
        name: feed.name,
        rssUrl: feed.rssUrl,
        normalizedRssUrl,
        status: feed.status,
        refreshIntervalMinutes: feed.refreshIntervalMinutes,
        lastSyncedAt: feed.lastSyncedAt,
        lastSyncAttemptAt: feed.lastSyncAttemptAt,
        nextSyncAt: feed.nextSyncAt,
        syncError: feed.syncError,
        archivedAt: null,
        filter: {
          create: {
            minimumWordCount: feed.filter.minimumWordCount,
            includeKeywords: [...feed.filter.includeKeywords],
            excludeKeywords: [...feed.filter.excludeKeywords],
          },
        },
      },
    });
  }

  for (const account of seededSocialAccounts) {
    await prisma.socialAccount.upsert({
      where: {
        platform_providerAccountId: {
          platform: account.platform,
          providerAccountId: account.providerAccountId,
        },
      },
      update: {
        status: account.status,
        displayName: account.displayName,
        handle: account.handle,
        profileUrl: account.profileUrl,
        providerUsername: account.providerUsername,
        accessTokenEncrypted: account.accessTokenEncrypted,
        refreshTokenEncrypted: account.refreshTokenEncrypted,
        tokenExpiresAt: account.tokenExpiresAt,
        scopes: [...account.scopes],
        lastValidatedAt: account.lastValidatedAt,
        connectedAt: account.connectedAt,
        disconnectedAt: account.disconnectedAt,
      },
      create: {
        platform: account.platform,
        status: account.status,
        displayName: account.displayName,
        handle: account.handle,
        profileUrl: account.profileUrl,
        providerAccountId: account.providerAccountId,
        providerUsername: account.providerUsername,
        accessTokenEncrypted: account.accessTokenEncrypted,
        refreshTokenEncrypted: account.refreshTokenEncrypted,
        tokenExpiresAt: account.tokenExpiresAt,
        scopes: [...account.scopes],
        lastValidatedAt: account.lastValidatedAt,
        connectedAt: account.connectedAt,
        disconnectedAt: account.disconnectedAt,
      },
    });
  }

  console.log(
    `Seeded ${seededFeeds.length} REZZUM feeds and ${seededSocialAccounts.length} social accounts.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
