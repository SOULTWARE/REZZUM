"use server";

import { revalidatePath } from "next/cache";
import { GeneratedPostStatus } from "@prisma/client";
import type { ActionResult } from "@/lib/actions";
import { getSocialAccount } from "@/server/accounts/service";
import { requireAuthSession } from "@/server/auth/session";
import { assertPlatformsAllowed, getUserPlanAccess, type PlanAccess } from "@/server/billing/limits";
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

function buildActionError(message: string, error: unknown) {
  return {
    status: "error",
    message,
    detail: error instanceof Error ? error.message : "Unknown action failure.",
    refresh: false,
  } satisfies ActionResult;
}

async function ensurePostPlatformAllowed(userId: string, postId: string, access: PlanAccess) {
  const post = await getGeneratedPostById(postId, userId);

  if (!post) {
    throw new Error("Draft not found.");
  }

  assertPlatformsAllowed(access, [post.platform]);

  return post;
}

async function getValidatedSocialAccountId(userId: string, postId: string, formData: FormData) {
  const post = await getGeneratedPostById(postId, userId);
  const socialAccountId = getSocialAccountId(formData);

  if (!post) {
    throw new Error("Draft not found.");
  }

  if (!socialAccountId) {
    return null;
  }

  const account = await getSocialAccount(userId, socialAccountId);

  if (!account) {
    throw new Error("Destination account not found.");
  }

  if (account.platform !== post.platform) {
    throw new Error("Destination account does not match the draft platform.");
  }

  return socialAccountId;
}

export async function saveDraftAction(postId: string, formData: FormData) {
  const session = await requireAuthSession();

  try {
    await updateGeneratedPost(postId, {
      editedText: getDraftText(formData) || null,
      socialAccountId: await getValidatedSocialAccountId(session.user.id, postId, formData),
      reviewedAt: new Date(),
    }, session.user.id);

    revalidateQueuePaths(postId);

    return {
      status: "success",
      message: "Draft saved.",
      detail: "Your edits are stored and ready for review.",
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateQueuePaths(postId);

    return buildActionError("Draft save failed.", error);
  }
}

export async function approveDraftAction(postId: string, formData: FormData) {
  const session = await requireAuthSession();

  try {
    await updateGeneratedPost(postId, {
      editedText: getDraftText(formData) || null,
      socialAccountId: await getValidatedSocialAccountId(session.user.id, postId, formData),
      status: GeneratedPostStatus.APPROVED,
      reviewedAt: new Date(),
      approvedAt: new Date(),
      rejectedAt: null,
    }, session.user.id);

    revalidateQueuePaths(postId);

    return {
      status: "success",
      message: "Draft approved.",
      detail: "The post is now ready to schedule or publish.",
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateQueuePaths(postId);

    return buildActionError("Draft approval failed.", error);
  }
}

export async function rejectDraftAction(postId: string, formData: FormData) {
  const session = await requireAuthSession();

  try {
    await updateGeneratedPost(postId, {
      editedText: getDraftText(formData) || null,
      socialAccountId: await getValidatedSocialAccountId(session.user.id, postId, formData),
      status: GeneratedPostStatus.REJECTED,
      reviewedAt: new Date(),
      rejectedAt: new Date(),
    }, session.user.id);

    revalidateQueuePaths(postId);

    return {
      status: "success",
      message: "Draft rejected.",
      detail: "The current version was marked as rejected.",
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateQueuePaths(postId);

    return buildActionError("Draft rejection failed.", error);
  }
}

export async function scheduleDraftAction(postId: string, formData: FormData) {
  const session = await requireAuthSession();

  try {
    const access = await getUserPlanAccess(session.user.id);
    const scheduledFor = getScheduledFor(formData);

    if (!scheduledFor) {
      return {
        status: "error",
        message: "Schedule time required.",
        detail: "Select a schedule time before scheduling this draft.",
        refresh: false,
      } satisfies ActionResult;
    }

    await ensurePostPlatformAllowed(session.user.id, postId, access);
    await updateGeneratedPost(postId, {
      editedText: getDraftText(formData) || null,
      socialAccountId: await getValidatedSocialAccountId(session.user.id, postId, formData),
      status: GeneratedPostStatus.SCHEDULED,
      reviewedAt: new Date(),
      approvedAt: new Date(),
      scheduledFor,
    }, session.user.id);

    revalidateQueuePaths(postId);

    return {
      status: "success",
      message: "Draft scheduled.",
      detail: `Scheduled for ${scheduledFor.toLocaleString("en", {
        dateStyle: "medium",
        timeStyle: "short",
      })}.`,
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateQueuePaths(postId);

    return buildActionError("Draft scheduling failed.", error);
  }
}

export async function publishDraftNowAction(postId: string, formData: FormData) {
  const session = await requireAuthSession();

  try {
    const access = await getUserPlanAccess(session.user.id);

    await ensurePostPlatformAllowed(session.user.id, postId, access);
    await updateGeneratedPost(postId, {
      editedText: getDraftText(formData) || null,
      socialAccountId: await getValidatedSocialAccountId(session.user.id, postId, formData),
      reviewedAt: new Date(),
    }, session.user.id);

    const publishedPost = await publishPostNow(session.user.id, postId, access);
    revalidateQueuePaths(postId);

    if (publishedPost.status === GeneratedPostStatus.FAILED) {
      return {
        status: "error",
        message: "Publish failed.",
        detail: publishedPost.failureReason ?? "The provider rejected the publish request.",
        refresh: true,
      } satisfies ActionResult;
    }

    return {
      status: "success",
      message: "Draft published.",
      detail: "The post was sent to the connected social account.",
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateQueuePaths(postId);

    return buildActionError("Publish action failed.", error);
  }
}

export async function regenerateDraftAction(postId: string, formData: FormData) {
  const session = await requireAuthSession();

  try {
    const access = await getUserPlanAccess(session.user.id);
    const post = await getGeneratedPostById(postId, session.user.id);

    if (!post) {
      return {
        status: "error",
        message: "Draft not found.",
        detail: "The selected post no longer exists.",
        refresh: false,
      } satisfies ActionResult;
    }

    assertPlatformsAllowed(access, [post.platform]);
    const workspace = await getWorkspaceSettings(session.user.id);
    const draft = await generateSocialPost({
      article: post.article,
      feed: post.article.feed,
      workspace,
      platform: post.platform,
    });
    const regenerated = await createRegeneratedPostVersion({
      previousPostId: post.id,
      articleId: post.articleId,
      socialAccountId:
        (await getValidatedSocialAccountId(session.user.id, postId, formData)) ?? post.socialAccountId,
      platform: post.platform,
      tone: draft.tone,
      promptVersion: draft.promptVersion,
      generationModel: draft.generationModel,
      generatedText: draft.generatedText,
      versionNumber: post.versionNumber + 1,
    });

    revalidateQueuePaths(postId);
    revalidateQueuePaths(regenerated.id);

    return {
      status: "success",
      message: "Draft regenerated.",
      detail: "A new version is ready for review.",
      redirectTo: `/queue/${regenerated.id}`,
      refresh: false,
    } satisfies ActionResult;
  } catch (error) {
    revalidateQueuePaths(postId);

    return buildActionError("Draft regeneration failed.", error);
  }
}
