import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { FeedForm } from "@/components/feeds/feed-form";
import { EMPTY_FEED_FORM_VALUES } from "@/lib/feeds/constants";
import { createFeedAction } from "@/server/feeds/actions";

export const metadata: Metadata = {
  title: "New Feed",
};

export default function NewFeedPage() {
  return (
    <PageContainer>
      <FeedForm
        mode="create"
        action={createFeedAction}
        initialValues={EMPTY_FEED_FORM_VALUES}
      />
    </PageContainer>
  );
}
