import { z } from "zod";
import {
  DEFAULT_FEED_FEEL,
  DEFAULT_FEED_LANGUAGE,
  DEFAULT_MINIMUM_WORD_COUNT,
  DEFAULT_REFRESH_INTERVAL_MINUTES,
  FEED_REFRESH_INTERVAL_VALUES,
  normalizeFeedUrl,
  parseKeywordText,
  type FeedFormValues,
} from "@/lib/feeds/constants";

const FEED_NAME_MAX_LENGTH = 120;
const FEED_FEEL_MAX_LENGTH = 120;
const FEED_LANGUAGE_MAX_LENGTH = 64;
const MAXIMUM_WORD_COUNT = 50000;
const MAXIMUM_STYLE_LENGTH = 2000;
const MAXIMUM_AUTO_PUBLISH_INTERVAL_MINUTES = 7 * 24 * 60;

const optionalAccountIdSchema = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z.string().trim().max(191).default(""),
);

const feedFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Enter a feed name.")
      .max(FEED_NAME_MAX_LENGTH, "Feed names must be 120 characters or fewer."),
    rssUrl: z
      .string()
      .trim()
      .url("Enter a valid RSS URL.")
      .refine((value) => {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      }, "Use an http or https RSS URL."),
    defaultLanguage: z
      .string()
      .trim()
      .min(1, "Enter a default language.")
      .max(FEED_LANGUAGE_MAX_LENGTH, "Language must be 64 characters or fewer.")
      .default(DEFAULT_FEED_LANGUAGE),
    defaultFeel: z
      .string()
      .trim()
      .min(1, "Enter the post feel.")
      .max(FEED_FEEL_MAX_LENGTH, "Feel must be 120 characters or fewer.")
      .default(DEFAULT_FEED_FEEL),
    styleNotes: z
      .string()
      .trim()
      .max(MAXIMUM_STYLE_LENGTH, `Style notes must be ${MAXIMUM_STYLE_LENGTH} characters or fewer.`)
      .default(""),
    includeKeywords: z.string().trim().default(""),
    excludeKeywords: z.string().trim().default(""),
    generateFacebook: z.coerce.boolean().default(true),
    generateLinkedIn: z.coerce.boolean().default(true),
    generateX: z.coerce.boolean().default(false),
    facebookAccountId: optionalAccountIdSchema,
    linkedinAccountId: optionalAccountIdSchema,
    xAccountId: optionalAccountIdSchema,
    autoPublishEnabled: z.coerce.boolean().default(false),
    autoPublishIntervalMinutes: z.coerce
      .number()
      .int("Use a whole number for auto-publish interval.")
      .min(15, "Auto-publish interval must be at least 15 minutes.")
      .max(
        MAXIMUM_AUTO_PUBLISH_INTERVAL_MINUTES,
        `Auto-publish interval must be ${MAXIMUM_AUTO_PUBLISH_INTERVAL_MINUTES} minutes or less.`,
      )
      .default(DEFAULT_REFRESH_INTERVAL_MINUTES),
    minimumWordCount: z.coerce
      .number()
      .int("Use a whole number for minimum word count.")
      .min(0, "Minimum word count cannot be negative.")
      .max(
        MAXIMUM_WORD_COUNT,
        `Minimum word count must be ${MAXIMUM_WORD_COUNT.toLocaleString()} or less.`,
      )
      .default(DEFAULT_MINIMUM_WORD_COUNT),
    refreshIntervalMinutes: z.coerce
      .number()
      .int()
      .refine(
        (value) =>
          FEED_REFRESH_INTERVAL_VALUES.some((allowedValue) => allowedValue === value),
        "Select a supported refresh interval.",
      )
      .default(DEFAULT_REFRESH_INTERVAL_MINUTES),
  })
  .superRefine((data, context) => {
    if (!data.generateFacebook && !data.generateLinkedIn && !data.generateX) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enable at least one publishing platform.",
        path: ["generateFacebook"],
      });
    }

    if (
      data.autoPublishEnabled &&
      !data.facebookAccountId &&
      !data.linkedinAccountId &&
      !data.xAccountId
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one destination account before enabling auto-publish.",
        path: ["autoPublishEnabled"],
      });
    }
  })
  .transform((data) => ({
    ...data,
    normalizedRssUrl: normalizeFeedUrl(data.rssUrl),
    includeKeywords: parseKeywordText(data.includeKeywords),
    excludeKeywords: parseKeywordText(data.excludeKeywords),
    facebookAccountId: data.facebookAccountId || null,
    linkedinAccountId: data.linkedinAccountId || null,
    xAccountId: data.xAccountId || null,
    autoPublishIntervalMinutes: data.autoPublishEnabled
      ? data.autoPublishIntervalMinutes
      : null,
  }));

export type FeedInput = z.output<typeof feedFormSchema>;

export type FeedFormFieldErrors = Partial<Record<keyof FeedFormValues, string[]>>;

export type FeedActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: FeedFormFieldErrors;
};

export const INITIAL_FEED_ACTION_STATE: FeedActionState = {
  status: "idle",
};

export function validateFeedFormData(formData: FormData) {
  const parsed = feedFormSchema.safeParse({
    name: formData.get("name"),
    rssUrl: formData.get("rssUrl"),
    defaultLanguage: formData.get("defaultLanguage"),
    defaultFeel: formData.get("defaultFeel"),
    styleNotes: formData.get("styleNotes"),
    includeKeywords: formData.get("includeKeywords"),
    excludeKeywords: formData.get("excludeKeywords"),
    generateFacebook: formData.get("generateFacebook"),
    generateLinkedIn: formData.get("generateLinkedIn"),
    generateX: formData.get("generateX"),
    facebookAccountId: formData.get("facebookAccountId"),
    linkedinAccountId: formData.get("linkedinAccountId"),
    xAccountId: formData.get("xAccountId"),
    autoPublishEnabled: formData.get("autoPublishEnabled"),
    autoPublishIntervalMinutes: formData.get("autoPublishIntervalMinutes"),
    minimumWordCount: formData.get("minimumWordCount"),
    refreshIntervalMinutes: formData.get("refreshIntervalMinutes"),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      state: {
        status: "error" as const,
        message: "Review the highlighted fields and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  return {
    success: true as const,
    data: parsed.data,
  };
}
