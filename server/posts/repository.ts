import type { Prisma } from "@prisma/client";
import { GeneratedPostStatus, GenerationTone, SocialPlatform } from "@prisma/client";
import { db } from "@/server/db/client";

const DEFAULT_POST_LIST_LIMIT = 1000;
const DEFAULT_SIBLING_POST_LIMIT = 20;
const DEFAULT_DUE_POST_LIMIT = 25;

export const generatedPostInclude = {
  article: {
    include: {
      feed: {
        include: {
          filter: true,
          facebookAccount: true,
          linkedinAccount: true,
          xAccount: true,
        },
      },
    },
  },
  socialAccount: true,
} satisfies Prisma.GeneratedPostInclude;

export type GeneratedPostRecord = Prisma.GeneratedPostGetPayload<{
  include: typeof generatedPostInclude;
}>;

function scopePostWhere(userId: string, where: Prisma.GeneratedPostWhereInput = {}) {
  return {
    AND: [
      where,
      {
        article: {
          feed: {
            userId,
          },
        },
      },
    ],
  } satisfies Prisma.GeneratedPostWhereInput;
}

export async function listLatestGeneratedPosts(
  userId: string,
  where: Prisma.GeneratedPostWhereInput = {},
  limit = DEFAULT_POST_LIST_LIMIT,
) {
  return db.generatedPost.findMany({
    where: {
      ...scopePostWhere(userId, where),
      nextVersions: {
        none: {},
      },
    },
    include: generatedPostInclude,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function countGeneratedPostsByStatus(userId: string) {
  return db.generatedPost.groupBy({
    by: ["status"],
    where: {
      article: {
        feed: {
          userId,
        },
      },
      nextVersions: {
        none: {},
      },
    },
    _count: {
      _all: true,
    },
  });
}

export async function getGeneratedPostById(postId: string, userId?: string) {
  return db.generatedPost.findFirst({
    where: userId ? scopePostWhere(userId, { id: postId }) : { id: postId },
    include: generatedPostInclude,
  });
}

export async function listLatestSiblingPosts(userId: string, articleId: string) {
  return db.generatedPost.findMany({
    where: {
      articleId,
      article: {
        feed: {
          userId,
        },
      },
      nextVersions: {
        none: {},
      },
    },
    include: generatedPostInclude,
    orderBy: [{ platform: "asc" }, { updatedAt: "desc" }],
    take: DEFAULT_SIBLING_POST_LIMIT,
  });
}

export async function upsertInitialGeneratedPost(data: {
  articleId: string;
  socialAccountId: string | null;
  platform: SocialPlatform;
  tone: GenerationTone;
  promptVersion: string;
  generationModel: string;
  generatedText: string;
}) {
  const existing = await db.generatedPost.findFirst({
    where: {
      articleId: data.articleId,
      platform: data.platform,
      nextVersions: {
        none: {},
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  if (existing) {
    return db.generatedPost.update({
      where: { id: existing.id },
      data: {
        socialAccountId: data.socialAccountId,
        tone: data.tone,
        promptVersion: data.promptVersion,
        generationModel: data.generationModel,
        generatedText: data.generatedText,
        editedText: null,
        generationStartedAt: new Date(),
        generatedAt: new Date(),
        status: GeneratedPostStatus.DRAFT,
        reviewedAt: null,
        approvedAt: null,
        rejectedAt: null,
        scheduledFor: null,
        publishedAt: null,
        failedAt: null,
        failureReason: null,
        publishedExternalId: null,
      },
      include: generatedPostInclude,
    });
  }

  return db.generatedPost.create({
    data: {
      articleId: data.articleId,
      socialAccountId: data.socialAccountId,
      platform: data.platform,
      tone: data.tone,
      promptVersion: data.promptVersion,
      generationModel: data.generationModel,
      generatedText: data.generatedText,
      generationStartedAt: new Date(),
      generatedAt: new Date(),
      status: GeneratedPostStatus.DRAFT,
    },
    include: generatedPostInclude,
  });
}

export async function createRegeneratedPostVersion(data: {
  previousPostId: string;
  articleId: string;
  socialAccountId: string | null;
  platform: SocialPlatform;
  tone: GenerationTone;
  promptVersion: string;
  generationModel: string;
  generatedText: string;
  versionNumber: number;
}) {
  return db.generatedPost.create({
    data: {
      articleId: data.articleId,
      socialAccountId: data.socialAccountId,
      platform: data.platform,
      tone: data.tone,
      promptVersion: data.promptVersion,
      generationModel: data.generationModel,
      generatedText: data.generatedText,
      generationStartedAt: new Date(),
      generatedAt: new Date(),
      status: GeneratedPostStatus.DRAFT,
      previousVersionId: data.previousPostId,
      versionNumber: data.versionNumber,
    },
    include: generatedPostInclude,
  });
}

export async function updateGeneratedPost(
  postId: string,
  data: Prisma.GeneratedPostUncheckedUpdateInput,
  userId?: string,
) {
  if (userId) {
    const post = await getGeneratedPostById(postId, userId);

    if (!post) {
      throw new Error("Draft not found.");
    }
  }

  return db.generatedPost.update({
    where: { id: postId },
    data,
    include: generatedPostInclude,
  });
}

export async function listDueScheduledPosts(now: Date, limit = DEFAULT_DUE_POST_LIMIT) {
  if (limit <= 0) {
    return [];
  }

  return db.generatedPost.findMany({
    where: {
      status: GeneratedPostStatus.SCHEDULED,
      scheduledFor: {
        lte: now,
      },
      nextVersions: {
        none: {},
      },
    },
    include: generatedPostInclude,
    orderBy: [{ scheduledFor: "asc" }],
    take: limit,
  });
}

export async function listStalePublishingPosts(cutoff: Date, limit = DEFAULT_DUE_POST_LIMIT) {
  if (limit <= 0) {
    return [];
  }

  return db.generatedPost.findMany({
    where: {
      status: GeneratedPostStatus.PUBLISHING,
      updatedAt: {
        lte: cutoff,
      },
      nextVersions: {
        none: {},
      },
    },
    include: generatedPostInclude,
    orderBy: [{ updatedAt: "asc" }],
    take: limit,
  });
}

export async function getLatestScheduledOrPublishedAt(params: {
  platform: SocialPlatform;
  socialAccountId: string;
}) {
  const latest = await db.generatedPost.findFirst({
    where: {
      platform: params.platform,
      socialAccountId: params.socialAccountId,
      nextVersions: {
        none: {},
      },
      OR: [
        {
          scheduledFor: {
            not: null,
          },
        },
        {
          publishedAt: {
            not: null,
          },
        },
      ],
    },
    orderBy: [{ scheduledFor: "desc" }, { publishedAt: "desc" }],
    select: {
      scheduledFor: true,
      publishedAt: true,
    },
  });

  return latest?.scheduledFor ?? latest?.publishedAt ?? null;
}
