"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GeneratedPostStatus } from "@prisma/client";
import { generateSocialPost } from "@/server/generation/service";
import { publishPostNow } from "@/server/publishing/service";
import {
  createRegeneratedPostVersion,
  getGeneratedPostById,
  updateGeneratedPost,
} from "@/server/posts/repository";
import { getWorkspaceSettings } from "@/server/settings/service";

function getDraftText(formData: FormData) {
  return String(formData.get("draftText") ?? "").trim();
}

function getScheduledFor(formData: FormData) {
  const value = String(formData.get("scheduledFor") ?? "").trim();

  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Enter a valid schedule time.");
  }

  return parsed;
}

function getSocialAccountId(formData: FormData) {
  const value = String(formData.get("socialAccountId") ?? "").trim();

  return value || null;
}

function revalidateQueuePaths(postId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/queue");
  revalidatePath(`/queue/${postId}`);
  revalidatePath("/schedule");
}

export async function saveDraftAction(postId: string, formData: FormData) {
  await updateGeneratedPost(postId, {
    editedText: getDraftText(formData) || null,
    socialAccountId: getSocialAccountId(formData),
    reviewedAt: new Date(),
  });

  revalidateQueuePaths(postId);
}

export async function approveDraftAction(postId: string, formData: FormData) {
  await updateGeneratedPost(postId, {
    editedText: getDraftText(formData) || null,
    socialAccountId: getSocialAccountId(formData),
    status: GeneratedPostStatus.APPROVED,
    reviewedAt: new Date(),
    approvedAt: new Date(),
    rejectedAt: null,
  });

  revalidateQueuePaths(postId);
}

export async function rejectDraftAction(postId: string, formData: FormData) {
  await updateGeneratedPost(postId, {
    editedText: getDraftText(formData) || null,
    socialAccountId: getSocialAccountId(formData),
    status: GeneratedPostStatus.REJECTED,
    reviewedAt: new Date(),
    rejectedAt: new Date(),
  });

  revalidateQueuePaths(postId);
}

export async function scheduleDraftAction(postId: string, formData: FormData) {
  const scheduledFor = getScheduledFor(formData);

  if (!scheduledFor) {
    throw new Error("Select a schedule time before scheduling.");
  }

  await updateGeneratedPost(postId, {
    editedText: getDraftText(formData) || null,
    socialAccountId: getSocialAccountId(formData),
    status: GeneratedPostStatus.SCHEDULED,
    reviewedAt: new Date(),
    approvedAt: new Date(),
    scheduledFor,
  });

  revalidateQueuePaths(postId);
}

export async function publishDraftNowAction(postId: string, formData: FormData) {
  await updateGeneratedPost(postId, {
    editedText: getDraftText(formData) || null,
    socialAccountId: getSocialAccountId(formData),
    reviewedAt: new Date(),
  });

  await publishPostNow(postId);
  revalidateQueuePaths(postId);
}

export async function regenerateDraftAction(postId: string, formData: FormData) {
  const post = await getGeneratedPostById(postId);

  if (!post) {
    throw new Error("Post not found.");
  }

  const workspace = await getWorkspaceSettings();
  const draft = await generateSocialPost({
    article: post.article,
    feed: post.article.feed,
    workspace,
    platform: post.platform,
  });
  const regenerated = await createRegeneratedPostVersion({
    previousPostId: post.id,
    articleId: post.articleId,
    socialAccountId: getSocialAccountId(formData) ?? post.socialAccountId,
    platform: post.platform,
    tone: draft.tone,
    promptVersion: draft.promptVersion,
    generationModel: draft.generationModel,
    generatedText: draft.generatedText,
    versionNumber: post.versionNumber + 1,
  });

  revalidateQueuePaths(postId);
  redirect(`/queue/${regenerated.id}`);
}
