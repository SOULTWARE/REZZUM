import { ArticleStatus, FeedStatus, GeneratedPostStatus, Prisma, SocialPlatform } from "@prisma/client";
import type { Article } from "@prisma/client";
import {
  assertPlatformsAllowed,
  ensureCanCreatePosts,
  filterAllowedPlatforms,
  getRemainingPostSlots,
  getUserPlanAccess,
  type PlanAccess,
} from "@/server/billing/limits";
import { db } from "@/server/db/client";
import {
  generateSocialPost,
  GenerationError,
  resolveFeedPersonalization,
} from "@/server/generation/service";
import { upsertInitialGeneratedPost, updateGeneratedPost, getLatestScheduledOrPublishedAt } from "@/server/posts/repository";
import {
  fetchAndParseFeed,
  FeedFetchError,
  type ParsedRssItem,
} from "@/server/rss/service";
import { sha256 } from "@/server/security/crypto";
import { getWorkspaceSettings } from "@/server/settings/service";

type FeedForSync = {
  id: string;
  userId: string;
  name: string;
  rssUrl: string;
  defaultLanguage: string | null;
  defaultFeel: string | null;
  styleNotes: string | null;
  generateFacebook: boolean;
  generateLinkedIn: boolean;
  generateX: boolean;
  facebookAccountId: string | null;
  linkedinAccountId: string | null;
  xAccountId: string | null;
  autoPublishEnabled: boolean;
  autoPublishIntervalMinutes: number | null;
  refreshIntervalMinutes: number;
  filter: {
    includeKeywords: string[];
    excludeKeywords: string[];
    minimumWordCount: number;
  } | null;
};

type ArticleForEvaluation = Pick<Article, "title" | "excerpt" | "contentText">;

type FeedSyncArticleIssue = {
  articleTitle: string;
  message: string;
};

type FeedSyncResult = {
  feedId: string;
  fetchedItemCount: number;
  generatedArticleCount: number;
  generatedPostCount: number;
  articleIssues: FeedSyncArticleIssue[];
};

const DEFAULT_FEED_SYNC_BATCH_LIMIT = 10;
const DEFAULT_ARTICLE_REEVALUATION_LIMIT = 500;

function getPositiveIntegerEnv(name: string, fallback: number, max: number) {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, max);
}

function getFeedSyncBatchLimit() {
  return getPositiveIntegerEnv("CRON_FEED_SYNC_BATCH_SIZE", DEFAULT_FEED_SYNC_BATCH_LIMIT, 100);
}

function getArticleReevaluationLimit() {
  return getPositiveIntegerEnv(
    "FEED_ARTICLE_REEVALUATION_BATCH_SIZE",
    DEFAULT_ARTICLE_REEVALUATION_LIMIT,
    2000,
  );
}

function normalizeUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value.trim());

    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    url.protocol = url.protocol.toLowerCase();

    if (url.pathname !== "/") {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }

    return url.toString();
  } catch {
    return value.trim() || null;
  }
}

function countWords(value: string | null) {
  if (!value) {
    return 0;
  }

  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function matchesKeyword(value: string, keywords: string[]) {
  const normalized = value.toLowerCase();

  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

function evaluateArticleAgainstFeed(item: ParsedRssItem, feed: {
  filter: {
    includeKeywords: string[];
    excludeKeywords: string[];
    minimumWordCount: number;
  } | null;
}) {
  return evaluateContentAgainstFeed(item, feed);
}

function evaluateContentAgainstFeed(item: ArticleForEvaluation, feed: {
  filter: {
    includeKeywords: string[];
    excludeKeywords: string[];
    minimumWordCount: number;
  } | null;
}) {
  const filter = feed.filter;

  if (!filter) {
    return {
      status: ArticleStatus.READY,
      filteredOutReason: null,
    };
  }

  const text = [item.title, item.excerpt, item.contentText].filter(Boolean).join("\n");
  const wordCount = countWords(item.contentText ?? item.excerpt);

  if (filter.minimumWordCount > 0 && wordCount < filter.minimumWordCount) {
    return {
      status: ArticleStatus.FILTERED_OUT,
      filteredOutReason: `Article is below the ${filter.minimumWordCount}-word minimum.`,
    };
  }

  if (filter.includeKeywords.length > 0 && !matchesKeyword(text, filter.includeKeywords)) {
    return {
      status: ArticleStatus.FILTERED_OUT,
      filteredOutReason: "Article does not match the feed include keywords.",
    };
  }

  if (filter.excludeKeywords.length > 0 && matchesKeyword(text, filter.excludeKeywords)) {
    return {
      status: ArticleStatus.FILTERED_OUT,
      filteredOutReason: "Article matches the feed exclude keywords.",
    };
  }

  return {
    status: ArticleStatus.READY,
    filteredOutReason: null,
  };
}

function buildContentHash(item: ParsedRssItem) {
  const normalizedContent = [item.title, item.excerpt, item.contentText]
    .filter(Boolean)
    .join("\n")
    .trim();

  return normalizedContent ? sha256(normalizedContent) : null;
}

function buildArticleDedupeWhere(params: {
  feedId: string;
  sourceUrl: string;
  canonicalUrl: string | null;
  contentHash: string | null;
}) {
  const dedupeWhere: Prisma.ArticleWhereInput[] = [
    {
      feedId: params.feedId,
      sourceUrl: params.sourceUrl,
    },
  ];

  if (params.canonicalUrl) {
    dedupeWhere.push({
      feedId: params.feedId,
      canonicalUrl: params.canonicalUrl,
    });
  }

  if (params.contentHash) {
    dedupeWhere.push({
      feedId: params.feedId,
      contentHash: params.contentHash,
    });
  }

  return dedupeWhere;
}

async function findExistingArticleByDedupe(dedupeWhere: Prisma.ArticleWhereInput[]) {
  return db.article.findFirst({
    where: {
      OR: dedupeWhere,
    },
  });
}

async function reconcileExistingArticle(params: {
  existing: Article;
  item: ParsedRssItem;
  feed: FeedForSync;
}) {
  const evaluation = evaluateContentAgainstFeed(params.existing, {
    filter: params.feed.filter,
  });
  const nextTitle =
    params.existing.title === "Untitled article" && params.item.title !== "Untitled article"
      ? params.item.title
      : params.existing.title;
  const nextStatus =
    params.existing.status === ArticleStatus.PROCESSED
      ? params.existing.status
      : evaluation.status;
  const nextFilteredOutReason =
    params.existing.status === ArticleStatus.PROCESSED
      ? params.existing.filteredOutReason
      : evaluation.filteredOutReason;

  if (
    nextTitle !== params.existing.title ||
    nextStatus !== params.existing.status ||
    nextFilteredOutReason !== params.existing.filteredOutReason
  ) {
    return db.article.update({
      where: { id: params.existing.id },
      data: {
        title: nextTitle,
        status: nextStatus,
        filteredOutReason: nextFilteredOutReason,
      },
    });
  }

  return params.existing;
}

async function createOrReuseArticle(feed: FeedForSync | null, item: ParsedRssItem) {
  if (!feed) {
    return null;
  }

  const canonicalUrl = normalizeUrl(item.canonicalUrl ?? item.sourceUrl);
  const contentHash = buildContentHash(item);
  const dedupeWhere = buildArticleDedupeWhere({
    feedId: feed.id,
    sourceUrl: item.sourceUrl,
    canonicalUrl,
    contentHash,
  });
  const existing = await findExistingArticleByDedupe(dedupeWhere);

  if (existing) {
    return reconcileExistingArticle({
      existing,
      item,
      feed,
    });
  }

  const evaluation = evaluateArticleAgainstFeed(item, {
    filter: feed.filter,
  });

  try {
    return await db.article.create({
      data: {
        feedId: feed.id,
        sourceEntryId: item.sourceEntryId,
        title: item.title,
        sourceUrl: item.sourceUrl,
        canonicalUrl,
        contentHash,
        excerpt: item.excerpt,
        contentText: item.contentText,
        authorName: item.authorName,
        publishedAt: item.publishedAt,
        status: evaluation.status,
        filteredOutReason: evaluation.filteredOutReason,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const racedExisting = await findExistingArticleByDedupe(dedupeWhere);

      if (racedExisting) {
        return reconcileExistingArticle({
          existing: racedExisting,
          item,
          feed,
        });
      }
    }

    throw error;
  }
}

async function resolveTargetAccountId(params: {
  feed: FeedForSync | null;
  workspace: Awaited<ReturnType<typeof getWorkspaceSettings>>;
  platform: SocialPlatform;
}) {
  if (!params.feed) {
    return null;
  }

  if (params.platform === SocialPlatform.FACEBOOK) {
    return params.feed.facebookAccountId ?? params.workspace.defaultFacebookAccountId ?? null;
  }

  if (params.platform === SocialPlatform.LINKEDIN) {
    return params.feed.linkedinAccountId ?? params.workspace.defaultLinkedInAccountId ?? null;
  }

  return params.feed.xAccountId ?? params.workspace.defaultXAccountId ?? null;
}

async function maybeAutoSchedulePost(params: {
  postId: string;
  socialAccountId: string | null;
  platform: SocialPlatform;
  intervalMinutes: number | null;
}) {
  if (!params.socialAccountId || !params.intervalMinutes) {
    return;
  }

  const latestSlot = await getLatestScheduledOrPublishedAt({
    platform: params.platform,
    socialAccountId: params.socialAccountId,
  });
  const baseTime = latestSlot && latestSlot.getTime() > Date.now() ? latestSlot : new Date();
  const scheduledFor = new Date(baseTime.getTime() + params.intervalMinutes * 60_000);

  await updateGeneratedPost(params.postId, {
    status: GeneratedPostStatus.SCHEDULED,
    scheduledFor,
    approvedAt: new Date(),
    reviewedAt: new Date(),
  });
}

function formatArticleProcessingError(error: unknown) {
  if (error instanceof GenerationError) {
    return `Draft generation failed: ${error.message}`;
  }

  if (error instanceof FeedFetchError) {
    return error.message;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return "Article ingestion conflicted with an existing record and will be retried automatically.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Unknown article processing failure.";
}

function buildFeedSyncFailureMessage(error: unknown) {
  if (error instanceof FeedFetchError) {
    return error.message;
  }

  if (error instanceof GenerationError) {
    return `Feed sync reached OpenAI generation and failed: ${error.message}`;
  }

  if (error instanceof Error && error.message.trim()) {
    return `Feed sync failed: ${error.message}`;
  }

  return "Feed sync failed for an unknown reason.";
}

export async function generatePostsForArticle(articleId: string, planAccess?: PlanAccess) {
  const article = await db.article.findUnique({
    where: { id: articleId },
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
  });

  if (!article || article.status !== ArticleStatus.READY) {
    return [];
  }

  const userId = article.feed.userId;
  const access = planAccess ?? await getUserPlanAccess(userId);
  const workspace = await getWorkspaceSettings(userId);
  const personalization = resolveFeedPersonalization({
    feed: article.feed,
    workspace,
  });
  const requestedPlatforms = [
    article.feed.generateFacebook ? SocialPlatform.FACEBOOK : null,
    article.feed.generateLinkedIn ? SocialPlatform.LINKEDIN : null,
    article.feed.generateX ? SocialPlatform.X : null,
  ].filter(Boolean) as SocialPlatform[];
  const remainingSlots = await getRemainingPostSlots(userId, access);
  const platforms = filterAllowedPlatforms(access, requestedPlatforms).slice(0, remainingSlots);
  const createdPosts = [];

  if (requestedPlatforms.length > 0 && platforms.length === 0) {
    if (remainingSlots <= 0) {
      await ensureCanCreatePosts(userId, access, 1);
    }

    assertPlatformsAllowed(access, requestedPlatforms);
  }

  await ensureCanCreatePosts(userId, access, platforms.length);

  for (const platform of platforms) {
    const socialAccountId = await resolveTargetAccountId({
      feed: article.feed,
      workspace,
      platform,
    });
    const draft = await generateSocialPost({
      article,
      feed: article.feed,
      workspace,
      platform,
    });
    const post = await upsertInitialGeneratedPost({
      articleId: article.id,
      socialAccountId,
      platform,
      tone: draft.tone,
      promptVersion: draft.promptVersion,
      generationModel: draft.generationModel,
      generatedText: draft.generatedText,
    });

    if (article.feed.autoPublishEnabled) {
      await maybeAutoSchedulePost({
        postId: post.id,
        socialAccountId,
        platform,
        intervalMinutes: personalization.autoPublishIntervalMinutes ?? article.feed.refreshIntervalMinutes,
      });
    }

    createdPosts.push(post);
  }

  await db.article.update({
    where: { id: article.id },
    data: {
      status: ArticleStatus.PROCESSED,
    },
  });

  return createdPosts;
}

async function ingestSingleFeed(
  feedId: string,
  planAccess?: PlanAccess,
  userId?: string,
): Promise<FeedSyncResult> {
  const feed = await db.rssFeed.findUnique({
    where: userId
      ? {
          id_userId: {
            id: feedId,
            userId,
          },
        }
      : { id: feedId },
    include: {
      filter: true,
      facebookAccount: true,
      linkedinAccount: true,
      xAccount: true,
    },
  });

  if (!feed) {
    throw new Error("Feed not found.");
  }

  const access = planAccess ?? await getUserPlanAccess(feed.userId);
  const now = new Date();

  await db.rssFeed.update({
    where: { id: feed.id },
    data: {
      lastSyncAttemptAt: now,
      syncError: null,
    },
  });

  try {
    const items = await fetchAndParseFeed(feed.rssUrl);
    const result: FeedSyncResult = {
      feedId: feed.id,
      fetchedItemCount: items.length,
      generatedArticleCount: 0,
      generatedPostCount: 0,
      articleIssues: [],
    };

    for (const item of items) {
      try {
        const article = await createOrReuseArticle(feed, item);

        if (article?.status === ArticleStatus.READY) {
          const posts = await generatePostsForArticle(article.id, access);

          if (posts.length > 0) {
            result.generatedArticleCount += 1;
            result.generatedPostCount += posts.length;
          }
        }
      } catch (error) {
        result.articleIssues.push({
          articleTitle: item.title,
          message: formatArticleProcessingError(error),
        });
      }
    }

    await db.rssFeed.update({
      where: { id: feed.id },
      data: {
        status: FeedStatus.ACTIVE,
        lastSyncedAt: new Date(),
        nextSyncAt: new Date(Date.now() + feed.refreshIntervalMinutes * 60_000),
        syncError: null,
      },
    });

    return result;
  } catch (error) {
    const message = buildFeedSyncFailureMessage(error);

    await db.rssFeed.update({
      where: { id: feed.id },
      data: {
        status: FeedStatus.ERROR,
        nextSyncAt: new Date(Date.now() + feed.refreshIntervalMinutes * 60_000),
        syncError: message,
      },
    });

    throw error;
  }
}

export async function syncFeedNow(userId: string, feedId: string, planAccess?: PlanAccess) {
  return ingestSingleFeed(feedId, planAccess, userId);
}

export async function reevaluateExistingArticlesForFeed(
  userId: string,
  feedId: string,
  planAccess?: PlanAccess,
) {
  const feed = await db.rssFeed.findUnique({
    where: {
      id_userId: {
        id: feedId,
        userId,
      },
    },
    include: {
      filter: true,
      facebookAccount: true,
      linkedinAccount: true,
      xAccount: true,
    },
  });

  if (!feed) {
    throw new Error("Feed not found.");
  }

  const access = planAccess ?? await getUserPlanAccess(userId);
  const articles = await db.article.findMany({
    where: {
      feedId,
      status: {
        not: ArticleStatus.PROCESSED,
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: getArticleReevaluationLimit(),
  });

  const results = [];

  for (const article of articles) {
    const evaluation = evaluateContentAgainstFeed(article, {
      filter: feed.filter,
    });
    const shouldUpdate =
      article.status !== evaluation.status ||
      article.filteredOutReason !== evaluation.filteredOutReason;

    const nextArticle = shouldUpdate
      ? await db.article.update({
          where: { id: article.id },
          data: {
            status: evaluation.status,
            filteredOutReason: evaluation.filteredOutReason,
          },
        })
      : article;

    if (nextArticle.status === ArticleStatus.READY) {
      await generatePostsForArticle(nextArticle.id, access);
    }

    results.push({
      articleId: nextArticle.id,
      status: nextArticle.status,
      changed: shouldUpdate,
    });
  }

  return results;
}

export async function syncDueFeeds() {
  const feeds = await db.rssFeed.findMany({
    where: {
      status: FeedStatus.ACTIVE,
      OR: [
        {
          nextSyncAt: null,
        },
        {
          nextSyncAt: {
            lte: new Date(),
          },
        },
      ],
    },
    select: {
      id: true,
    },
    orderBy: [{ nextSyncAt: "asc" }],
    take: getFeedSyncBatchLimit(),
  });

  const results = [];

  for (const feed of feeds) {
    try {
      const result = await ingestSingleFeed(feed.id);

      results.push({
        feedId: feed.id,
        status: result.articleIssues.length > 0 ? ("partial" as const) : ("synced" as const),
        fetchedItemCount: result.fetchedItemCount,
        generatedPostCount: result.generatedPostCount,
        articleIssueCount: result.articleIssues.length,
      });
    } catch (error) {
      results.push({
        feedId: feed.id,
        status: "failed" as const,
        error: buildFeedSyncFailureMessage(error),
      });
    }
  }

  return results;
}
