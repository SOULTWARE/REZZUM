import { FeedStatus } from "@prisma/client";
import { listManagedFeeds } from "@/server/feeds/service";

export async function getDashboardOverview() {
  const feeds = await listManagedFeeds();

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

  return {
    feeds,
    totalFeeds: feeds.length,
    activeFeedCount: activeFeeds.length,
    attentionFeedCount: attentionFeeds.length,
    upcomingSyncCount: upcomingSyncs.length,
    recentFeeds: feeds.slice(0, 3),
    nextFeedForSync: upcomingSyncs[0] ?? null,
  };
}
