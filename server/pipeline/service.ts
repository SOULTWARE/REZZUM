import { ArticleStatus, FeedStatus, GeneratedPostStatus, SocialPlatform } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";
import { generateSocialPost, resolveFeedPersonalization } from "@/server/generation/service";
import { upsertInitialGeneratedPost, updateGeneratedPost, getLatestScheduledOrPublishedAt } from "@/server/posts/repository";
import { fetchAndParseFeed, type ParsedRssItem } from "@/server/rss/service";
import { sha256 } from "@/server/security/crypto";
import { getWorkspaceSettings } from "@/server/settings/service";

type FeedForSync = {
  id: string;
  name: string;
  rssUrl: string;
  defaultLanguage: string | null;
  defaultFeel: string | null;
  styleNotes: string | null;
  generateLinkedIn: boolean;
  generateX: boolean;
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

async function createOrReuseArticle(feed: FeedForSync | null, item: ParsedRssItem) {
  if (!feed) {
    return null;
  }

  const canonicalUrl = normalizeUrl(item.canonicalUrl ?? item.sourceUrl);
  const contentHash = buildContentHash(item);

  const dedupeWhere: Prisma.ArticleWhereInput[] = [
    {
      feedId: feed.id,
      sourceUrl: item.sourceUrl,
    },
  ];

  if (canonicalUrl) {
    dedupeWhere.push({ canonicalUrl });
  }

  if (contentHash) {
    dedupeWhere.push({ contentHash });
  }

  const existing = await db.article.findFirst({
    where: {
      OR: dedupeWhere,
    },
  });

  if (existing) {
    return existing;
  }

  const evaluation = evaluateArticleAgainstFeed(item, {
    filter: feed.filter,
  });

  return db.article.create({
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
}

async function resolveTargetAccountId(params: {
  feed: FeedForSync | null;
  workspace: Awaited<ReturnType<typeof getWorkspaceSettings>>;
  platform: SocialPlatform;
}) {
  if (!params.feed) {
    return null;
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

export async function generatePostsForArticle(articleId: string) {
  const article = await db.article.findUnique({
    where: { id: articleId },
    include: {
      feed: {
        include: {
          filter: true,
          linkedinAccount: true,
          xAccount: true,
        },
      },
    },
  });

  if (!article || article.status !== ArticleStatus.READY) {
    return [];
  }

  const workspace = await getWorkspaceSettings();
  const personalization = resolveFeedPersonalization({
    feed: article.feed,
    workspace,
  });
  const platforms = [
    article.feed.generateLinkedIn ? SocialPlatform.LINKEDIN : null,
    article.feed.generateX ? SocialPlatform.X : null,
  ].filter(Boolean) as SocialPlatform[];
  const createdPosts = [];

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

async function ingestSingleFeed(feedId: string) {
  const feed = await db.rssFeed.findUnique({
    where: { id: feedId },
    include: {
      filter: true,
      linkedinAccount: true,
      xAccount: true,
    },
  });

  if (!feed) {
    throw new Error("Feed not found.");
  }

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

    for (const item of items) {
      const article = await createOrReuseArticle(feed, item);

      if (article?.status === ArticleStatus.READY) {
        await generatePostsForArticle(article.id);
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown feed sync failure.";

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

export async function syncFeedNow(feedId: string) {
  await ingestSingleFeed(feedId);
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
  });

  const results = [];

  for (const feed of feeds) {
    try {
      await ingestSingleFeed(feed.id);
      results.push({ feedId: feed.id, status: "synced" as const });
    } catch (error) {
      results.push({
        feedId: feed.id,
        status: "failed" as const,
        error: error instanceof Error ? error.message : "Unknown failure.",
      });
    }
  }

  return results;
}
