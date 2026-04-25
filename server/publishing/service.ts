import {
  GeneratedPostStatus,
  PublishAttemptStatus,
  SocialAccountStatus,
  SocialPlatform,
} from "@prisma/client";
import { getSocialAccount } from "@/server/accounts/service";
import {
  assertPlatformsAllowed,
  getWorkspaceAutomationPlanAccess,
  type PlanAccess,
} from "@/server/billing/limits";
import { db } from "@/server/db/client";
import { publishToFacebook } from "@/server/integrations/facebook";
import { publishToLinkedIn } from "@/server/integrations/linkedin";
import { publishToX } from "@/server/integrations/x";
import { getGeneratedPostById, listDueScheduledPosts, updateGeneratedPost } from "@/server/posts/repository";
import { sha256 } from "@/server/security/crypto";

function getPostText(post: Awaited<ReturnType<typeof getGeneratedPostById>>) {
  return post?.editedText?.trim() || post?.generatedText || "";
}

async function createPublishAttempt(postId: string) {
  return db.publishAttempt.create({
    data: {
      generatedPostId: postId,
      status: PublishAttemptStatus.PENDING,
      attemptedAt: new Date(),
      idempotencyKey: sha256(`${postId}:${Date.now()}`),
    },
  });
}

async function markAttemptSuccess(attemptId: string, params: {
  externalId: string | null;
  providerMessage: string | null;
}) {
  return db.publishAttempt.update({
    where: { id: attemptId },
    data: {
      status: PublishAttemptStatus.SUCCEEDED,
      completedAt: new Date(),
      publishedExternalId: params.externalId,
      providerMessage: params.providerMessage,
    },
  });
}

async function markAttemptFailure(attemptId: string, message: string) {
  return db.publishAttempt.update({
    where: { id: attemptId },
    data: {
      status: PublishAttemptStatus.FAILED,
      completedAt: new Date(),
      failureReason: message,
      providerMessage: message,
    },
  });
}

async function publishPost(postId: string, planAccess?: PlanAccess) {
  const post = await getGeneratedPostById(postId);

  if (!post) {
    throw new Error("Post not found.");
  }

  if (post.status === GeneratedPostStatus.PUBLISHED) {
    return post;
  }

  const access = planAccess ?? await getWorkspaceAutomationPlanAccess();

  assertPlatformsAllowed(access, [post.platform]);

  if (!post.socialAccountId) {
    throw new Error("No destination account is assigned to this post.");
  }

  const account = await getSocialAccount(post.socialAccountId);

  if (!account || account.status !== SocialAccountStatus.CONNECTED) {
    throw new Error("The destination account is not connected.");
  }

  if (account.platform !== post.platform) {
    throw new Error("The destination account does not match the post platform.");
  }

  const postText = getPostText(post);

  if (!postText) {
    throw new Error("The post has no content to publish.");
  }

  const attempt = await createPublishAttempt(post.id);

  try {
    const result =
      account.platform === SocialPlatform.FACEBOOK
        ? await publishToFacebook({
            accessTokenEncrypted: account.accessTokenEncrypted,
            pageId: account.providerAccountId,
            text: postText,
          })
        : account.platform === SocialPlatform.LINKEDIN
          ? await publishToLinkedIn({
              accessTokenEncrypted: account.accessTokenEncrypted,
              authorUrn: account.externalUrn,
              text: postText,
            })
          : await publishToX({
              account,
              text: postText,
            });

    await markAttemptSuccess(attempt.id, result);

    return updateGeneratedPost(post.id, {
      status: GeneratedPostStatus.PUBLISHED,
      publishedAt: new Date(),
      publishedExternalId: result.externalId,
      failedAt: null,
      failureReason: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown publish failure.";

    await markAttemptFailure(attempt.id, message);

    return updateGeneratedPost(post.id, {
      status: GeneratedPostStatus.FAILED,
      failedAt: new Date(),
      failureReason: message,
    });
  }
}

export async function publishPostNow(postId: string, planAccess?: PlanAccess) {
  return publishPost(postId, planAccess);
}

export async function publishDuePosts() {
  const posts = await listDueScheduledPosts(new Date());
  const access = await getWorkspaceAutomationPlanAccess();
  const results = [];

  for (const post of posts) {
    try {
      const publishedPost = await publishPost(post.id, access);

      results.push({
        postId: post.id,
        status: publishedPost.status,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown publish failure.";
      const failedPost = await updateGeneratedPost(post.id, {
        status: GeneratedPostStatus.FAILED,
        failedAt: new Date(),
        failureReason: message,
      });

      results.push({
        postId: post.id,
        status: failedPost.status,
      });
    }
  }

  return results;
}
