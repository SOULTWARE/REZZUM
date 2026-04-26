import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { FeedForm } from "@/components/feeds/feed-form";
import { EMPTY_FEED_FORM_VALUES } from "@/lib/feeds/constants";
import { getSocialPlatformLabel } from "@/lib/review-queue/constants";
import { getConnectedAccountOptions } from "@/server/accounts/service";
import { requireAuthSession } from "@/server/auth/session";
import { getUserPlanAccess } from "@/server/billing/limits";
import { createFeedAction } from "@/server/feeds/actions";
import { getWorkspaceSettings } from "@/server/settings/service";

export const metadata: Metadata = {
  title: "New Feed",
};

export const dynamic = "force-dynamic";

export default async function NewFeedPage() {
  const session = await requireAuthSession();
  const planAccess = await getUserPlanAccess(session.user.id);
  const facebookAccounts = await getConnectedAccountOptions("FACEBOOK");
  const linkedinAccounts = await getConnectedAccountOptions("LINKEDIN");
  const xAccounts = await getConnectedAccountOptions("X");
  const workspace = await getWorkspaceSettings();
  const canUseX = planAccess.limits.allowedPlatforms.includes("X");

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
          facebookAccountId: workspace.defaultFacebookAccountId ?? "",
          linkedinAccountId: workspace.defaultLinkedInAccountId ?? "",
          xAccountId: workspace.defaultXAccountId ?? "",
          generateX: canUseX,
        }}
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
      />
    </PageContainer>
  );
}
