import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { FeedForm } from "@/components/feeds/feed-form";
import { joinKeywordList, type FeedFormValues } from "@/lib/feeds/constants";
import { getSocialPlatformLabel } from "@/lib/review-queue/constants";
import { getConnectedAccountOptions } from "@/server/accounts/service";
import { requireAuthSession } from "@/server/auth/session";
import { getUserPlanAccess } from "@/server/billing/limits";
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
  const session = await requireAuthSession();
  const { feedId } = await params;
  const feed = await getManagedFeed(session.user.id, feedId);
  const planAccess = await getUserPlanAccess(session.user.id);
  const facebookAccounts = await getConnectedAccountOptions(session.user.id, "FACEBOOK");
  const linkedinAccounts = await getConnectedAccountOptions(session.user.id, "LINKEDIN");
  const xAccounts = await getConnectedAccountOptions(session.user.id, "X");

  if (!feed) {
    notFound();
  }

  const initialValues: FeedFormValues = {
    name: feed.name,
    rssUrl: feed.rssUrl,
    defaultLanguage: feed.defaultLanguage ?? "English",
    defaultFeel: feed.defaultFeel ?? "Professional",
    styleNotes: feed.styleNotes ?? "",
    includeKeywords: joinKeywordList(feed.filter?.includeKeywords ?? []),
    excludeKeywords: joinKeywordList(feed.filter?.excludeKeywords ?? []),
    generateFacebook: feed.generateFacebook,
    generateLinkedIn: feed.generateLinkedIn,
    generateX: feed.generateX,
    facebookAccountId: feed.facebookAccountId ?? "",
    linkedinAccountId: feed.linkedinAccountId ?? "",
    xAccountId: feed.xAccountId ?? "",
    autoPublishEnabled: feed.autoPublishEnabled,
    autoPublishIntervalMinutes: feed.autoPublishIntervalMinutes ?? 60,
    minimumWordCount: feed.filter?.minimumWordCount ?? 0,
    refreshIntervalMinutes: feed.refreshIntervalMinutes as FeedFormValues["refreshIntervalMinutes"],
  };

  const boundAction = updateFeedAction.bind(null, feed.id);

  return (
    <PageContainer>
      <FeedForm
        action={boundAction}
        initialValues={initialValues}
        accountOptions={{
          facebook: facebookAccounts,
          linkedin: linkedinAccounts,
          x: xAccounts,
        }}
        planLimits={{
          label: planAccess.limits.label,
          postLimit: planAccess.limits.postLimit,
          rssFeedLimit: planAccess.limits.rssFeedLimit,
          allowedPlatforms: planAccess.limits.allowedPlatforms.map(getSocialPlatformLabel),
        }}
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
