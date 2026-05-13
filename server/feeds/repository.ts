import type { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";

export const feedWithFilterInclude = {
  filter: true,
  facebookAccount: true,
  linkedinAccount: true,
  xAccount: true,
} satisfies Prisma.RssFeedInclude;

export type FeedRecord = Prisma.RssFeedGetPayload<{
  include: typeof feedWithFilterInclude;
}>;

export async function listFeeds(userId: string) {
  return db.rssFeed.findMany({
    where: { userId },
    include: feedWithFilterInclude,
    orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getFeedById(userId: string, feedId: string) {
  return db.rssFeed.findUnique({
    where: {
      id_userId: {
        id: feedId,
        userId,
      },
    },
    include: feedWithFilterInclude,
  });
}

export async function createFeedRecord(userId: string, data: {
  name: string;
  rssUrl: string;
  normalizedRssUrl: string;
  defaultLanguage: string;
  defaultFeel: string;
  styleNotes: string;
  generateFacebook: boolean;
  generateLinkedIn: boolean;
  generateX: boolean;
  facebookAccountId: string | null;
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
      userId,
      rssUrl: data.rssUrl,
      normalizedRssUrl: data.normalizedRssUrl,
      defaultLanguage: data.defaultLanguage,
      defaultFeel: data.defaultFeel,
      styleNotes: data.styleNotes,
      generateFacebook: data.generateFacebook,
      generateLinkedIn: data.generateLinkedIn,
      generateX: data.generateX,
      facebookAccountId: data.facebookAccountId,
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
  userId: string,
  feedId: string,
  data: {
    name: string;
    rssUrl: string;
    normalizedRssUrl: string;
    defaultLanguage: string;
    defaultFeel: string;
    styleNotes: string;
    generateFacebook: boolean;
    generateLinkedIn: boolean;
    generateX: boolean;
    facebookAccountId: string | null;
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
    where: {
      id_userId: {
        id: feedId,
        userId,
      },
    },
    data: {
      name: data.name,
      rssUrl: data.rssUrl,
      normalizedRssUrl: data.normalizedRssUrl,
      defaultLanguage: data.defaultLanguage,
      defaultFeel: data.defaultFeel,
      styleNotes: data.styleNotes,
      generateFacebook: data.generateFacebook,
      generateLinkedIn: data.generateLinkedIn,
      generateX: data.generateX,
      facebookAccountId: data.facebookAccountId,
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
  userId: string,
  feedId: string,
  data: {
    status: "ACTIVE" | "PAUSED";
    nextSyncAt: Date | null;
    syncError?: string | null;
  },
) {
  return db.rssFeed.update({
    where: {
      id_userId: {
        id: feedId,
        userId,
      },
    },
    data: {
      status: data.status,
      nextSyncAt: data.nextSyncAt,
      syncError: data.syncError ?? undefined,
    },
    include: feedWithFilterInclude,
  });
}

export async function deleteFeedRecord(userId: string, feedId: string) {
  return db.rssFeed.delete({
    where: {
      id_userId: {
        id: feedId,
        userId,
      },
    },
  });
}
