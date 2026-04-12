import { FeedStatus, GeneratedPostStatus } from "@prisma/client";
import { ALL_REVIEW_QUEUE_FILTER } from "@/lib/review-queue/validation";
import { getAccountsOverview } from "@/server/accounts/service";
import { listManagedFeeds } from "@/server/feeds/service";
import { getReviewQueue } from "@/server/review-queue/service";
import { getScheduleOverview } from "@/server/schedule/service";

export async function getDashboardOverview() {
  const [feeds, queue, schedule, accounts] = await Promise.all([
    listManagedFeeds(),
    getReviewQueue({
      platform: ALL_REVIEW_QUEUE_FILTER,
      status: ALL_REVIEW_QUEUE_FILTER,
      feed: ALL_REVIEW_QUEUE_FILTER,
    }),
    getScheduleOverview(),
    getAccountsOverview(),
  ]);

  const activeFeeds = feeds.filter((feed) => feed.status === FeedStatus.ACTIVE);
  const attentionFeeds = feeds.filter(
    (feed) => feed.status === FeedStatus.ERROR || feed.status === FeedStatus.PAUSED,
  );
  const upcomingSyncs = feeds
    .filter((feed) => feed.nextSyncAt)
    .sort((a, b) => {
      if (!a.nextSyncAt || !b.nextSyncAt) {
        return 0;
      }

      return a.nextSyncAt.getTime() - b.nextSyncAt.getTime();
    });
  const draftPosts = queue.items.filter((item) => item.status === GeneratedPostStatus.DRAFT);
  const approvedPosts = queue.items.filter((item) => item.status === GeneratedPostStatus.APPROVED);

  return {
    feeds,
    totalFeeds: feeds.length,
    activeFeedCount: activeFeeds.length,
    attentionFeedCount: attentionFeeds.length,
    upcomingSyncCount: upcomingSyncs.length,
    recentFeeds: feeds.slice(0, 4),
    nextFeedForSync: upcomingSyncs[0] ?? null,
    queueCount: queue.items.length,
    draftPostCount: draftPosts.length,
    approvedPostCount: approvedPosts.length,
    scheduledPostCount: schedule.scheduledItems.length,
    publishedPostCount: schedule.publishedItems.length,
    connectedAccountCount: accounts.connectedCount,
    activePlatformCount: accounts.activePlatformCount,
    recentActivity: queue.items.slice(0, 6),
  };
}
