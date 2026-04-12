import { z } from "zod";
import {
  DEFAULT_MINIMUM_WORD_COUNT,
  DEFAULT_REFRESH_INTERVAL_MINUTES,
  FEED_REFRESH_INTERVAL_VALUES,
  normalizeFeedUrl,
  parseKeywordText,
  type FeedFormValues,
} from "@/lib/feeds/constants";

const FEED_NAME_MAX_LENGTH = 120;
const MAXIMUM_WORD_COUNT = 50000;

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
    includeKeywords: z.string().trim().default(""),
    excludeKeywords: z.string().trim().default(""),
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
  .transform((data) => ({
    ...data,
    normalizedRssUrl: normalizeFeedUrl(data.rssUrl),
    includeKeywords: parseKeywordText(data.includeKeywords),
    excludeKeywords: parseKeywordText(data.excludeKeywords),
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
    includeKeywords: formData.get("includeKeywords"),
    excludeKeywords: formData.get("excludeKeywords"),
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
