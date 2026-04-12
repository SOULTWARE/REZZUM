import { Prisma } from "@prisma/client";
import type { FeedInput } from "@/lib/feeds/validation";
import {
  createFeedRecord,
  getFeedById,
  listFeeds,
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

export async function listManagedFeeds() {
  return listFeeds();
}

export async function getManagedFeed(feedId: string) {
  return getFeedById(feedId);
}

export async function createManagedFeed(input: FeedInput) {
  try {
    return await createFeedRecord({
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

export async function updateManagedFeed(feedId: string, input: FeedInput) {
  try {
    return await updateFeedRecord(feedId, {
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
