import { GeneratedPostStatus, SocialPlatform } from "@prisma/client";
import { listLatestGeneratedPosts, type GeneratedPostRecord } from "@/server/posts/repository";

export type ScheduleItem = GeneratedPostRecord;

function comparePlatforms(left: SocialPlatform, right: SocialPlatform) {
  const order = [SocialPlatform.FACEBOOK, SocialPlatform.LINKEDIN, SocialPlatform.X];

  return order.indexOf(left) - order.indexOf(right);
}

function compareStatuses(left: GeneratedPostStatus, right: GeneratedPostStatus) {
  const order: Record<GeneratedPostStatus, number> = {
    [GeneratedPostStatus.SCHEDULED]: 0,
    [GeneratedPostStatus.APPROVED]: 1,
    [GeneratedPostStatus.DRAFT]: 2,
    [GeneratedPostStatus.PUBLISHED]: 3,
    [GeneratedPostStatus.FAILED]: 4,
    [GeneratedPostStatus.REJECTED]: 5,
  };

  return order[left] - order[right];
}

function getPublishTime(post: ScheduleItem) {
  return post.scheduledFor ?? post.publishedAt ?? post.failedAt ?? null;
}

function compareByPublishTime(left: ScheduleItem, right: ScheduleItem) {
  const leftTime = getPublishTime(left)?.getTime() ?? 0;
  const rightTime = getPublishTime(right)?.getTime() ?? 0;

  if (leftTime !== rightTime) {
    return leftTime - rightTime;
  }

  const statusComparison = compareStatuses(left.status, right.status);

  if (statusComparison !== 0) {
    return statusComparison;
  }

  return comparePlatforms(left.platform, right.platform);
}

export async function getScheduleOverview() {
  const supportedStatuses = new Set<GeneratedPostStatus>([
    GeneratedPostStatus.DRAFT,
    GeneratedPostStatus.APPROVED,
    GeneratedPostStatus.SCHEDULED,
    GeneratedPostStatus.PUBLISHED,
    GeneratedPostStatus.FAILED,
  ]);

  const items = (await listLatestGeneratedPosts())
    .filter((post) => supportedStatuses.has(post.status))
    .sort(compareByPublishTime);

  const scheduledItems = items.filter((post) => post.status === GeneratedPostStatus.SCHEDULED);
  const failedItems = items.filter((post) => post.status === GeneratedPostStatus.FAILED);
  const publishedItems = items.filter((post) => post.status === GeneratedPostStatus.PUBLISHED);
  const pendingItems = items.filter(
    (post) =>
      post.status === GeneratedPostStatus.DRAFT || post.status === GeneratedPostStatus.APPROVED,
  );

  return {
    items,
    scheduledItems,
    failedItems,
    publishedItems,
    pendingItems,
    nextScheduledItem: scheduledItems[0] ?? null,
    isDemoData: false,
  };
}
