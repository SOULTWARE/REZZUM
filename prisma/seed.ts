import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { FeedStatus, PrismaClient } from "@prisma/client";
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

  console.log(`Seeded ${seededFeeds.length} REZZUM feeds.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
