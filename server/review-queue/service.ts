import { GeneratedPostStatus, SocialPlatform } from "@prisma/client";
import {
  ALL_REVIEW_QUEUE_FILTER,
  type ReviewQueueFilters,
} from "@/lib/review-queue/validation";
import { getGeneratedPostStatusLabel, getSocialPlatformLabel } from "@/lib/review-queue/constants";
import {
  getGeneratedPostById,
  listLatestGeneratedPosts,
  listLatestSiblingPosts,
  type GeneratedPostRecord,
} from "@/server/posts/repository";

export type ReviewQueueItem = GeneratedPostRecord;

type ReviewQueueOption = {
  value: string;
  label: string;
};

function comparePlatforms(left: SocialPlatform, right: SocialPlatform) {
  const platformOrder = [SocialPlatform.FACEBOOK, SocialPlatform.LINKEDIN, SocialPlatform.X];

  return platformOrder.indexOf(left) - platformOrder.indexOf(right);
}

function compareStatuses(left: GeneratedPostStatus, right: GeneratedPostStatus) {
  const statusOrder = [
    GeneratedPostStatus.DRAFT,
    GeneratedPostStatus.APPROVED,
    GeneratedPostStatus.REJECTED,
    GeneratedPostStatus.SCHEDULED,
    GeneratedPostStatus.PUBLISHING,
    GeneratedPostStatus.FAILED,
    GeneratedPostStatus.PUBLISHED,
  ];

  return statusOrder.indexOf(left) - statusOrder.indexOf(right);
}

function matchesFilters(item: ReviewQueueItem, filters: ReviewQueueFilters) {
  if (filters.platform !== ALL_REVIEW_QUEUE_FILTER && item.platform !== filters.platform) {
    return false;
  }

  if (filters.status !== ALL_REVIEW_QUEUE_FILTER && item.status !== filters.status) {
    return false;
  }

  if (filters.feed !== ALL_REVIEW_QUEUE_FILTER && item.article.feed.id !== filters.feed) {
    return false;
  }

  return true;
}

function buildPlatformOptions(items: ReviewQueueItem[]): ReviewQueueOption[] {
  return [...new Set(items.map((item) => item.platform))]
    .sort(comparePlatforms)
    .map((platform) => ({
      value: platform,
      label: getSocialPlatformLabel(platform),
    }));
}

function buildStatusOptions(items: ReviewQueueItem[]): ReviewQueueOption[] {
  return [...new Set(items.map((item) => item.status))]
    .sort(compareStatuses)
    .map((status) => ({
      value: status,
      label: getGeneratedPostStatusLabel(status),
    }));
}

function buildFeedOptions(items: ReviewQueueItem[]): ReviewQueueOption[] {
  const feeds = new Map<string, string>();

  for (const item of items) {
    feeds.set(item.article.feed.id, item.article.feed.name);
  }

  return [...feeds.entries()]
    .sort((left, right) => left[1].localeCompare(right[1]))
    .map(([value, label]) => ({ value, label }));
}

function getQueueWhereInput() {
  return {
    status: {
      in: [
        GeneratedPostStatus.DRAFT,
        GeneratedPostStatus.APPROVED,
        GeneratedPostStatus.REJECTED,
        GeneratedPostStatus.SCHEDULED,
        GeneratedPostStatus.PUBLISHING,
        GeneratedPostStatus.FAILED,
        GeneratedPostStatus.PUBLISHED,
      ],
    },
  };
}

export async function getReviewQueue(userId: string, filters: ReviewQueueFilters) {
  const allItems = await listLatestGeneratedPosts(userId, getQueueWhereInput());
  const items = allItems.filter((item) => matchesFilters(item, filters));

  return {
    filters,
    items,
    totalItems: allItems.length,
    isDemoData: false,
    filterOptions: {
      platforms: buildPlatformOptions(allItems),
      statuses: buildStatusOptions(allItems),
      feeds: buildFeedOptions(allItems),
    },
  };
}

export async function getReviewQueuePost(userId: string, postId: string) {
  const post = await getGeneratedPostById(postId, userId);

  if (!post) {
    return null;
  }

  const siblingPosts = await listLatestSiblingPosts(userId, post.article.id);

  return {
    post,
    siblingPosts,
    isDemoData: false,
  };
}
