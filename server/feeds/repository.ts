import type { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";

export const feedWithFilterInclude = {
  filter: true,
  linkedinAccount: true,
  xAccount: true,
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
  defaultLanguage: string;
  defaultFeel: string;
  styleNotes: string;
  generateLinkedIn: boolean;
  generateX: boolean;
  linkedinAccountId: string | null;
  xAccountId: string | null;
  autoPublishEnabled: boolean;
  autoPublishIntervalMinutes: number | null;
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
      defaultLanguage: data.defaultLanguage,
      defaultFeel: data.defaultFeel,
      styleNotes: data.styleNotes,
      generateLinkedIn: data.generateLinkedIn,
      generateX: data.generateX,
      linkedinAccountId: data.linkedinAccountId,
      xAccountId: data.xAccountId,
      autoPublishEnabled: data.autoPublishEnabled,
      autoPublishIntervalMinutes: data.autoPublishIntervalMinutes,
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
    defaultLanguage: string;
    defaultFeel: string;
    styleNotes: string;
    generateLinkedIn: boolean;
    generateX: boolean;
    linkedinAccountId: string | null;
    xAccountId: string | null;
    autoPublishEnabled: boolean;
    autoPublishIntervalMinutes: number | null;
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
      defaultLanguage: data.defaultLanguage,
      defaultFeel: data.defaultFeel,
      styleNotes: data.styleNotes,
      generateLinkedIn: data.generateLinkedIn,
      generateX: data.generateX,
      linkedinAccountId: data.linkedinAccountId,
      xAccountId: data.xAccountId,
      autoPublishEnabled: data.autoPublishEnabled,
      autoPublishIntervalMinutes: data.autoPublishIntervalMinutes,
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

export async function updateFeedStatusRecord(
  feedId: string,
  data: {
    status: "ACTIVE" | "PAUSED";
    nextSyncAt: Date | null;
    syncError?: string | null;
  },
) {
  return db.rssFeed.update({
    where: { id: feedId },
    data: {
      status: data.status,
      nextSyncAt: data.nextSyncAt,
      syncError: data.syncError ?? undefined,
    },
    include: feedWithFilterInclude,
  });
}

export async function deleteFeedRecord(feedId: string) {
  return db.rssFeed.delete({
    where: { id: feedId },
  });
}
