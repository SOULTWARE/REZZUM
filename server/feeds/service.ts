import { Prisma, SocialPlatform } from "@prisma/client";
import type { FeedInput } from "@/lib/feeds/validation";
import { getSocialAccount } from "@/server/accounts/service";
import {
  createFeedRecord,
  deleteFeedRecord,
  getFeedById,
  listFeeds,
  updateFeedStatusRecord,
  updateFeedRecord,
} from "@/server/feeds/repository";

export class FeedConflictError extends Error {
  constructor() {
    super("A feed with this RSS URL already exists.");
    this.name = "FeedConflictError";
  }
}

function buildNextSyncAt(refreshIntervalMinutes: number) {
  return new Date(Date.now() + refreshIntervalMinutes * 60_000);
}

async function assertFeedAccountsBelongToUser(userId: string, input: FeedInput) {
  const accounts = [
    { id: input.facebookAccountId, platform: SocialPlatform.FACEBOOK },
    { id: input.linkedinAccountId, platform: SocialPlatform.LINKEDIN },
    { id: input.xAccountId, platform: SocialPlatform.X },
  ];

  for (const accountRef of accounts) {
    if (!accountRef.id) {
      continue;
    }

    const account = await getSocialAccount(userId, accountRef.id);

    if (!account || account.platform !== accountRef.platform) {
      throw new Error("Selected destination account is not available for this workspace.");
    }
  }
}

export async function listManagedFeeds(userId: string) {
  return listFeeds(userId);
}

export async function getManagedFeed(userId: string, feedId: string) {
  return getFeedById(userId, feedId);
}

export async function createManagedFeed(userId: string, input: FeedInput) {
  try {
    await assertFeedAccountsBelongToUser(userId, input);

    return await createFeedRecord(userId, {
      ...input,
      nextSyncAt: buildNextSyncAt(input.refreshIntervalMinutes),
      minimumWordCount: input.minimumWordCount,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new FeedConflictError();
    }

    throw error;
  }
}

export async function updateManagedFeed(userId: string, feedId: string, input: FeedInput) {
  try {
    await assertFeedAccountsBelongToUser(userId, input);

    return await updateFeedRecord(userId, feedId, {
      ...input,
      nextSyncAt: buildNextSyncAt(input.refreshIntervalMinutes),
      minimumWordCount: input.minimumWordCount,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new FeedConflictError();
    }

    throw error;
  }
}

export async function pauseManagedFeed(userId: string, feedId: string) {
  return updateFeedStatusRecord(userId, feedId, {
    status: "PAUSED",
    nextSyncAt: null,
  });
}

export async function activateManagedFeed(userId: string, feedId: string) {
  const feed = await getFeedById(userId, feedId);

  if (!feed) {
    throw new Error("Feed not found.");
  }

  return updateFeedStatusRecord(userId, feedId, {
    status: "ACTIVE",
    nextSyncAt: buildNextSyncAt(feed.refreshIntervalMinutes),
    syncError: null,
  });
}

export async function deleteManagedFeed(userId: string, feedId: string) {
  return deleteFeedRecord(userId, feedId);
}
