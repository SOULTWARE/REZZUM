import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { FeedForm } from "@/components/feeds/feed-form";
import { joinKeywordList, type FeedFormValues } from "@/lib/feeds/constants";
import { updateFeedAction } from "@/server/feeds/actions";
import { getManagedFeed } from "@/server/feeds/service";

export const metadata: Metadata = {
  title: "Edit Feed",
};

export const dynamic = "force-dynamic";

export default async function EditFeedPage({
  params,
}: Readonly<{
  params: Promise<{ feedId: string }>;
}>) {
  const { feedId } = await params;
  const feed = await getManagedFeed(feedId);

  if (!feed) {
    notFound();
  }

  const initialValues: FeedFormValues = {
    name: feed.name,
    rssUrl: feed.rssUrl,
    includeKeywords: joinKeywordList(feed.filter?.includeKeywords ?? []),
    excludeKeywords: joinKeywordList(feed.filter?.excludeKeywords ?? []),
    minimumWordCount: feed.filter?.minimumWordCount ?? 0,
    refreshIntervalMinutes: feed.refreshIntervalMinutes as FeedFormValues["refreshIntervalMinutes"],
  };

  const boundAction = updateFeedAction.bind(null, feed.id);

  return (
    <PageContainer>
      <FeedForm
        mode="edit"
        action={boundAction}
        initialValues={initialValues}
        metadata={{
          status: feed.status,
          createdAt: feed.createdAt,
          updatedAt: feed.updatedAt,
          nextSyncAt: feed.nextSyncAt,
        }}
      />
    </PageContainer>
  );
}
