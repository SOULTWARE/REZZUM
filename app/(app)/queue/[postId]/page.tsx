import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { ReviewEditor } from "@/components/review-queue/review-editor";
import { getReviewQueuePost } from "@/server/review-queue/service";

export const metadata: Metadata = {
  title: "Review Draft",
};

export default async function QueueEditorPage({
  params,
}: Readonly<{
  params: Promise<{ postId: string }>;
}>) {
  const { postId } = await params;
  const result = await getReviewQueuePost(postId);

  if (!result) {
    notFound();
  }

  return (
    <PageContainer>
      <ReviewEditor post={result.post} siblingPosts={result.siblingPosts} />
    </PageContainer>
  );
}
