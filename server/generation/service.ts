import { GenerationTone, SocialPlatform } from "@prisma/client";
import type { Article, RssFeed } from "@prisma/client";
import type { WorkspaceSettingsRecord } from "@/server/settings/repository";

const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
const PROMPT_VERSION = "v2.0.0";

function getPlatformGuidance(platform: SocialPlatform) {
  if (platform === SocialPlatform.X) {
    return {
      maxCharacters: 280,
      instruction:
        "Write one concise X post. Keep it under 260 characters to leave room for the link. No hashtags unless clearly useful. No thread.",
    };
  }

  return {
    maxCharacters: 3000,
    instruction:
      "Write one LinkedIn company-page post. Aim for 600-1200 characters, clear structure, and a credible editorial tone. No bullet list unless it genuinely improves the post.",
  };
}

export function mapFeelToTone(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("bold")) {
    return GenerationTone.BOLD;
  }

  if (normalized.includes("educat") || normalized.includes("teach")) {
    return GenerationTone.EDUCATIONAL;
  }

  return GenerationTone.PROFESSIONAL;
}

export function resolveFeedPersonalization(params: {
  feed: Pick<
    RssFeed,
    | "defaultLanguage"
    | "defaultFeel"
    | "styleNotes"
    | "autoPublishEnabled"
    | "autoPublishIntervalMinutes"
  >;
  workspace: WorkspaceSettingsRecord;
}) {
  return {
    language: params.feed.defaultLanguage?.trim() || params.workspace.defaultLanguage,
    feel: params.feed.defaultFeel?.trim() || params.workspace.defaultFeel,
    style:
      params.feed.styleNotes?.trim() ||
      params.workspace.defaultStyle ||
      "Clear, trustworthy, and aligned with the source article.",
    autoPublishIntervalMinutes:
      params.feed.autoPublishEnabled && params.feed.autoPublishIntervalMinutes
        ? params.feed.autoPublishIntervalMinutes
        : params.workspace.defaultAutoPublishIntervalMinutes,
  };
}

export async function generateSocialPost(params: {
  article: Pick<Article, "title" | "sourceUrl" | "excerpt" | "contentText">;
  feed: Pick<
    RssFeed,
    | "name"
    | "defaultLanguage"
    | "defaultFeel"
    | "styleNotes"
    | "autoPublishEnabled"
    | "autoPublishIntervalMinutes"
  >;
  workspace: WorkspaceSettingsRecord;
  platform: SocialPlatform;
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for post generation.");
  }

  const personalization = resolveFeedPersonalization({
    feed: params.feed,
    workspace: params.workspace,
  });
  const platformGuidance = getPlatformGuidance(params.platform);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are generating production social copy for a company publishing workflow. Return only the final post text with no surrounding commentary.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                `Platform: ${params.platform}`,
                `Feed name: ${params.feed.name}`,
                `Language: ${personalization.language}`,
                `Feel: ${personalization.feel}`,
                `Style notes: ${personalization.style}`,
                platformGuidance.instruction,
                "The post must stay faithful to the article and should not invent facts.",
                "Include the article URL naturally in the post body if the platform allows it.",
                `Source title: ${params.article.title}`,
                `Source excerpt: ${params.article.excerpt ?? "None"}`,
                `Source content: ${params.article.contentText ?? "None"}`,
                `Source URL: ${params.article.sourceUrl}`,
              ].join("\n"),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "text",
        },
      },
      max_output_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`OpenAI generation failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as {
    output_text?: string;
  };
  const generatedText = payload.output_text?.trim();

  if (!generatedText) {
    throw new Error("OpenAI generation returned an empty draft.");
  }

  if (generatedText.length > platformGuidance.maxCharacters && params.platform === SocialPlatform.X) {
    return {
      generatedText: `${generatedText.slice(0, platformGuidance.maxCharacters - 1).trimEnd()}…`,
      tone: mapFeelToTone(personalization.feel),
      generationModel: DEFAULT_OPENAI_MODEL,
      promptVersion: PROMPT_VERSION,
    };
  }

  return {
    generatedText,
    tone: mapFeelToTone(personalization.feel),
    generationModel: DEFAULT_OPENAI_MODEL,
    promptVersion: PROMPT_VERSION,
  };
}
