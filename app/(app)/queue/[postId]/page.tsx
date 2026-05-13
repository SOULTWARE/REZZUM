import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { ReviewEditor } from "@/components/review-queue/review-editor";
import { getConnectedAccountOptions } from "@/server/accounts/service";
import { requireAuthSession } from "@/server/auth/session";
import {
  approveDraftAction,
  publishDraftNowAction,
  regenerateDraftAction,
  rejectDraftAction,
  saveDraftAction,
  scheduleDraftAction,
} from "@/server/review-queue/actions";
import { getReviewQueuePost } from "@/server/review-queue/service";

export const metadata: Metadata = {
  title: "Review Draft",
};

export default async function QueueEditorPage({
  params,
}: Readonly<{
  params: Promise<{ postId: string }>;
}>) {
  const session = await requireAuthSession();
  const { postId } = await params;
  const result = await getReviewQueuePost(session.user.id, postId);

  if (!result) {
    notFound();
  }

  return (
    <PageContainer>
      <ReviewEditor
        post={result.post}
        siblingPosts={result.siblingPosts}
        accountOptions={await getConnectedAccountOptions(session.user.id, result.post.platform)}
        saveAction={saveDraftAction.bind(null, result.post.id)}
        approveAction={approveDraftAction.bind(null, result.post.id)}
        rejectAction={rejectDraftAction.bind(null, result.post.id)}
        scheduleAction={scheduleDraftAction.bind(null, result.post.id)}
        publishNowAction={publishDraftNowAction.bind(null, result.post.id)}
        regenerateAction={regenerateDraftAction.bind(null, result.post.id)}
      />
    </PageContainer>
  );
}
