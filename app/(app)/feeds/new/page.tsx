import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { FeedForm } from "@/components/feeds/feed-form";
import { EMPTY_FEED_FORM_VALUES } from "@/lib/feeds/constants";
import { getConnectedAccountOptions } from "@/server/accounts/service";
import { createFeedAction } from "@/server/feeds/actions";
import { getWorkspaceSettings } from "@/server/settings/service";

export const metadata: Metadata = {
  title: "New Feed",
};

export const dynamic = "force-dynamic";

export default async function NewFeedPage() {
  const linkedinAccounts = await getConnectedAccountOptions("LINKEDIN");
  const xAccounts = await getConnectedAccountOptions("X");
  const workspace = await getWorkspaceSettings();

  return (
    <PageContainer>
      <FeedForm
        action={createFeedAction}
        initialValues={{
          ...EMPTY_FEED_FORM_VALUES,
          defaultLanguage: workspace.defaultLanguage,
          defaultFeel: workspace.defaultFeel,
          styleNotes: workspace.defaultStyle,
          autoPublishIntervalMinutes:
            workspace.defaultAutoPublishIntervalMinutes ??
            EMPTY_FEED_FORM_VALUES.autoPublishIntervalMinutes,
          linkedinAccountId: workspace.defaultLinkedInAccountId ?? "",
          xAccountId: workspace.defaultXAccountId ?? "",
        }}
        accountOptions={{
          linkedin: linkedinAccounts,
          x: xAccounts,
        }}
      />
    </PageContainer>
  );
}
