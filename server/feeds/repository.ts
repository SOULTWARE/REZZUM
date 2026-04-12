import type { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";

export const feedWithFilterInclude = {
  filter: true,
} satisfies Prisma.RssFeedInclude;

export type FeedRecord = Prisma.RssFeedGetPayload<{
  include: typeof feedWithFilterInclude;
}>;

export async function listFeeds() {
  return db.rssFeed.findMany({
    include: feedWithFilterInclude,
    orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getFeedById(feedId: string) {
  return db.rssFeed.findUnique({
    where: { id: feedId },
    include: feedWithFilterInclude,
  });
}

export async function createFeedRecord(data: {
  name: string;
  rssUrl: string;
  normalizedRssUrl: string;
  refreshIntervalMinutes: number;
  minimumWordCount: number;
  includeKeywords: string[];
  excludeKeywords: string[];
  nextSyncAt: Date;
}) {
  return db.rssFeed.create({
    data: {
      name: data.name,
      rssUrl: data.rssUrl,
      normalizedRssUrl: data.normalizedRssUrl,
      refreshIntervalMinutes: data.refreshIntervalMinutes,
      nextSyncAt: data.nextSyncAt,
      filter: {
        create: {
          minimumWordCount: data.minimumWordCount,
          includeKeywords: data.includeKeywords,
          excludeKeywords: data.excludeKeywords,
        },
      },
    },
    include: feedWithFilterInclude,
  });
}

export async function updateFeedRecord(
  feedId: string,
  data: {
    name: string;
    rssUrl: string;
    normalizedRssUrl: string;
    refreshIntervalMinutes: number;
    minimumWordCount: number;
    includeKeywords: string[];
    excludeKeywords: string[];
    nextSyncAt: Date;
  },
) {
  return db.rssFeed.update({
    where: { id: feedId },
    data: {
      name: data.name,
      rssUrl: data.rssUrl,
      normalizedRssUrl: data.normalizedRssUrl,
      refreshIntervalMinutes: data.refreshIntervalMinutes,
      nextSyncAt: data.nextSyncAt,
      filter: {
        upsert: {
          create: {
            minimumWordCount: data.minimumWordCount,
            includeKeywords: data.includeKeywords,
            excludeKeywords: data.excludeKeywords,
          },
          update: {
            minimumWordCount: data.minimumWordCount,
            includeKeywords: data.includeKeywords,
            excludeKeywords: data.excludeKeywords,
          },
        },
      },
    },
    include: feedWithFilterInclude,
  });
}
