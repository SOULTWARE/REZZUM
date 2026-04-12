import {
  ArticleStatus,
  FeedStatus,
  GeneratedPostStatus,
  GenerationTone,
  SocialPlatform,
} from "@prisma/client";

export type ReviewQueueRecord = {
  id: string;
  articleId: string;
  platform: SocialPlatform;
  tone: GenerationTone;
  status: GeneratedPostStatus;
  promptVersion: string;
  generationModel: string;
  generatedText: string;
  editedText: string | null;
  generationStartedAt: Date | null;
  generatedAt: Date | null;
  reviewedAt: Date | null;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  scheduledFor: Date | null;
  publishedAt: Date | null;
  failedAt: Date | null;
  failureReason: string | null;
  versionNumber: number;
  createdAt: Date;
  updatedAt: Date;
  article: {
    id: string;
    title: string;
    sourceEntryId: string | null;
    sourceUrl: string;
    canonicalUrl: string | null;
    contentHash: string | null;
    excerpt: string | null;
    contentText: string | null;
    authorName: string | null;
    publishedAt: Date | null;
    discoveredAt: Date;
    status: ArticleStatus;
    filteredOutReason: string | null;
    feed: {
      id: string;
      name: string;
      status: FeedStatus;
      refreshIntervalMinutes: number;
    };
  };
};

function minutesAgo(value: number) {
  return new Date(Date.now() - value * 60_000);
}

function hoursAgo(value: number) {
  return new Date(Date.now() - value * 60 * 60_000);
}

function hoursFromNow(value: number) {
  return new Date(Date.now() + value * 60 * 60_000);
}

export function getReviewQueueMockData(): ReviewQueueRecord[] {
  return [
    {
      id: "post_linkedin_product_release",
      articleId: "article_product_release",
      platform: SocialPlatform.LINKEDIN,
      tone: GenerationTone.PROFESSIONAL,
      status: GeneratedPostStatus.DRAFT,
      promptVersion: "v1.2.0",
      generationModel: "gpt-5.4-mini",
      generatedText:
        "REZZUM now gives operators a cleaner review queue before anything reaches publishing. The practical win is less context switching between feed setup, draft editing, and scheduling.\n\nThis release focuses on one thing: turning RSS-driven ideas into review-ready social copy with a workflow your team can actually trust.\n\nIf you rely on content distribution to stay visible, tighter review steps matter more than another analytics chart.",
      editedText: null,
      generationStartedAt: minutesAgo(26),
      generatedAt: minutesAgo(25),
      reviewedAt: null,
      approvedAt: null,
      rejectedAt: null,
      scheduledFor: null,
      publishedAt: null,
      failedAt: null,
      failureReason: null,
      versionNumber: 1,
      createdAt: minutesAgo(25),
      updatedAt: minutesAgo(18),
      article: {
        id: "article_product_release",
        title: "Shipping a review queue that keeps generated drafts tied to source context",
        sourceEntryId: "rezzum-product-release-q2",
        sourceUrl: "https://rezzum.example/blog/review-queue-release",
        canonicalUrl: "https://rezzum.example/blog/review-queue-release",
        contentHash: "hash_product_release",
        excerpt:
          "A product update on the new review flow for generated posts, with emphasis on source traceability, moderation speed, and schedule readiness.",
        contentText:
          "REZZUM's latest product release focuses on the review stage of the RSS-to-social workflow. Instead of forcing users to bounce between content sources and publishing tools, the new queue keeps every generated draft connected to its originating feed and article. The release introduces clearer state tracking, faster draft triage, and a cleaner handoff into scheduling.",
        authorName: "REZZUM Team",
        publishedAt: hoursAgo(6),
        discoveredAt: hoursAgo(5),
        status: ArticleStatus.PROCESSED,
        filteredOutReason: null,
        feed: {
          id: "feed_rezzum_updates",
          name: "REZZUM Product Updates",
          status: FeedStatus.ACTIVE,
          refreshIntervalMinutes: 60,
        },
      },
    },
    {
      id: "post_x_product_release",
      articleId: "article_product_release",
      platform: SocialPlatform.X,
      tone: GenerationTone.BOLD,
      status: GeneratedPostStatus.DRAFT,
      promptVersion: "v1.2.0",
      generationModel: "gpt-5.4-mini",
      generatedText:
        "New in REZZUM: review generated posts without losing the original article context.\n\nRSS in, draft out, editorial control still intact.\n\nThat should be the default for AI-assisted publishing.",
      editedText:
        "New in REZZUM: a cleaner review queue for RSS-to-social drafts.\n\nYou can check the source article, compare platform variants, and keep moderation in one place before anything gets scheduled.",
      generationStartedAt: minutesAgo(23),
      generatedAt: minutesAgo(22),
      reviewedAt: null,
      approvedAt: null,
      rejectedAt: null,
      scheduledFor: null,
      publishedAt: null,
      failedAt: null,
      failureReason: null,
      versionNumber: 2,
      createdAt: minutesAgo(22),
      updatedAt: minutesAgo(12),
      article: {
        id: "article_product_release",
        title: "Shipping a review queue that keeps generated drafts tied to source context",
        sourceEntryId: "rezzum-product-release-q2",
        sourceUrl: "https://rezzum.example/blog/review-queue-release",
        canonicalUrl: "https://rezzum.example/blog/review-queue-release",
        contentHash: "hash_product_release",
        excerpt:
          "A product update on the new review flow for generated posts, with emphasis on source traceability, moderation speed, and schedule readiness.",
        contentText:
          "REZZUM's latest product release focuses on the review stage of the RSS-to-social workflow. Instead of forcing users to bounce between content sources and publishing tools, the new queue keeps every generated draft connected to its originating feed and article. The release introduces clearer state tracking, faster draft triage, and a cleaner handoff into scheduling.",
        authorName: "REZZUM Team",
        publishedAt: hoursAgo(6),
        discoveredAt: hoursAgo(5),
        status: ArticleStatus.PROCESSED,
        filteredOutReason: null,
        feed: {
          id: "feed_rezzum_updates",
          name: "REZZUM Product Updates",
          status: FeedStatus.ACTIVE,
          refreshIntervalMinutes: 60,
        },
      },
    },
    {
      id: "post_linkedin_ai_briefing",
      articleId: "article_ai_briefing",
      platform: SocialPlatform.LINKEDIN,
      tone: GenerationTone.EDUCATIONAL,
      status: GeneratedPostStatus.APPROVED,
      promptVersion: "v1.1.4",
      generationModel: "gpt-5.4",
      generatedText:
        "AI teams are moving from single prompts to multi-step review pipelines. The important shift is not model quality alone. It is operational discipline around source selection, traceability, and human approval before publishing.",
      editedText:
        "The next wave of AI content systems is operational, not cosmetic.\n\nTeams are moving from one-off prompts to reviewable pipelines with source traceability, generation metadata, and clear approval checkpoints. That structure matters if you want consistent output without losing editorial control.",
      generationStartedAt: hoursAgo(3),
      generatedAt: hoursAgo(3),
      reviewedAt: hoursAgo(2),
      approvedAt: hoursAgo(2),
      rejectedAt: null,
      scheduledFor: null,
      publishedAt: null,
      failedAt: null,
      failureReason: null,
      versionNumber: 1,
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(2),
      article: {
        id: "article_ai_briefing",
        title: "Why operational discipline is becoming the differentiator in AI content systems",
        sourceEntryId: "applied-ai-ops-discipline",
        sourceUrl: "https://signals.example/ai/ops-discipline",
        canonicalUrl: "https://signals.example/ai/ops-discipline",
        contentHash: "hash_ai_briefing",
        excerpt:
          "An analysis of why source traceability, approval checkpoints, and durable draft state are overtaking pure generation speed.",
        contentText:
          "As teams adopt AI for content workflows, the tools that win are not necessarily the ones with the flashiest outputs. The differentiator is increasingly operational: source integrity, versioned drafts, moderation steps, and reliable publishing handoffs. AI content systems that skip those controls tend to break down as volume grows.",
        authorName: "Lena Ortiz",
        publishedAt: hoursAgo(10),
        discoveredAt: hoursAgo(8),
        status: ArticleStatus.PROCESSED,
        filteredOutReason: null,
        feed: {
          id: "feed_ai_briefing",
          name: "Applied AI Briefing",
          status: FeedStatus.ACTIVE,
          refreshIntervalMinutes: 180,
        },
      },
    },
    {
      id: "post_x_creator_watch",
      articleId: "article_creator_watch",
      platform: SocialPlatform.X,
      tone: GenerationTone.BOLD,
      status: GeneratedPostStatus.REJECTED,
      promptVersion: "v1.0.9",
      generationModel: "gpt-5.4-mini",
      generatedText:
        "Every creator brand is becoming a media company. If your content engine still depends on manual rewriting, the bottleneck is not distribution. It is workflow design.",
      editedText: null,
      generationStartedAt: hoursAgo(6),
      generatedAt: hoursAgo(6),
      reviewedAt: hoursAgo(4),
      approvedAt: null,
      rejectedAt: hoursAgo(4),
      scheduledFor: null,
      publishedAt: null,
      failedAt: null,
      failureReason: null,
      versionNumber: 1,
      createdAt: hoursAgo(6),
      updatedAt: hoursAgo(4),
      article: {
        id: "article_creator_watch",
        title: "Creator teams are rebuilding their distribution stack around owned workflows",
        sourceEntryId: "creator-owned-workflows",
        sourceUrl: "https://creators.example/distribution-stack",
        canonicalUrl: "https://creators.example/distribution-stack",
        contentHash: "hash_creator_watch",
        excerpt:
          "A look at how creator businesses are replacing fragile social workflows with systems that preserve editorial control.",
        contentText:
          "Creator businesses are investing in owned publishing workflows because platform volatility keeps rising. Teams that rely on manual copy transfer and inconsistent review paths lose time and introduce avoidable errors. Durable systems now emphasize repeatable source intake, adaptable generation, and clear moderation steps before scheduling.",
        authorName: "Mia Carter",
        publishedAt: hoursAgo(14),
        discoveredAt: hoursAgo(13),
        status: ArticleStatus.PROCESSED,
        filteredOutReason: null,
        feed: {
          id: "feed_creator_watch",
          name: "Creator Economy Watch",
          status: FeedStatus.PAUSED,
          refreshIntervalMinutes: 720,
        },
      },
    },
    {
      id: "post_linkedin_ai_schedule",
      articleId: "article_ai_schedule",
      platform: SocialPlatform.LINKEDIN,
      tone: GenerationTone.PROFESSIONAL,
      status: GeneratedPostStatus.SCHEDULED,
      promptVersion: "v1.1.4",
      generationModel: "gpt-5.4",
      generatedText:
        "Scheduling only works when draft state is explicit. If a post can still be edited, your system needs a clear approval boundary before it enters the publishing queue.",
      editedText:
        "Scheduling is downstream of review, not a replacement for it.\n\nThe teams getting consistent output are the ones that treat approval state, editable drafts, and publishing windows as separate concerns. That structure keeps last-minute edits from turning into operational surprises.",
      generationStartedAt: hoursAgo(9),
      generatedAt: hoursAgo(9),
      reviewedAt: hoursAgo(8),
      approvedAt: hoursAgo(7),
      rejectedAt: null,
      scheduledFor: hoursFromNow(16),
      publishedAt: null,
      failedAt: null,
      failureReason: null,
      versionNumber: 1,
      createdAt: hoursAgo(9),
      updatedAt: hoursAgo(1),
      article: {
        id: "article_ai_schedule",
        title: "Approval state is what keeps AI-assisted scheduling from becoming guesswork",
        sourceEntryId: "ai-scheduling-approval-state",
        sourceUrl: "https://signals.example/ai/approval-state",
        canonicalUrl: "https://signals.example/ai/approval-state",
        contentHash: "hash_ai_schedule",
        excerpt:
          "Why draft state, moderation checkpoints, and schedule boundaries need to stay explicit as AI content systems mature.",
        contentText:
          "As teams increase the volume of AI-generated posts, the handoff from review to scheduling becomes a real operational concern. Systems that collapse approval, editing, and scheduling into one step create confusion. Durable publishing workflows separate those responsibilities so users know exactly which drafts are still editable and which are already queued.",
        authorName: "Lena Ortiz",
        publishedAt: hoursAgo(18),
        discoveredAt: hoursAgo(17),
        status: ArticleStatus.PROCESSED,
        filteredOutReason: null,
        feed: {
          id: "feed_ai_briefing",
          name: "Applied AI Briefing",
          status: FeedStatus.ACTIVE,
          refreshIntervalMinutes: 180,
        },
      },
    },
  ];
}
