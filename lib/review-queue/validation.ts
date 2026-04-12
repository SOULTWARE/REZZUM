import { GeneratedPostStatus, SocialPlatform } from "@prisma/client";
import { z } from "zod";

export const ALL_REVIEW_QUEUE_FILTER = "all" as const;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const platformFilterSchema = z.preprocess(
  getSingleValue,
  z.union([z.literal(ALL_REVIEW_QUEUE_FILTER), z.nativeEnum(SocialPlatform)]).catch(
    ALL_REVIEW_QUEUE_FILTER,
  ),
);

const statusFilterSchema = z.preprocess(
  getSingleValue,
  z
    .union([z.literal(ALL_REVIEW_QUEUE_FILTER), z.nativeEnum(GeneratedPostStatus)])
    .catch(ALL_REVIEW_QUEUE_FILTER),
);

const feedFilterSchema = z.preprocess(
  getSingleValue,
  z
    .union([z.literal(ALL_REVIEW_QUEUE_FILTER), z.string().trim().min(1).max(120)])
    .catch(ALL_REVIEW_QUEUE_FILTER),
);

const reviewQueueFiltersSchema = z.object({
  platform: platformFilterSchema,
  status: statusFilterSchema,
  feed: feedFilterSchema,
});

export type ReviewQueueFilters = z.infer<typeof reviewQueueFiltersSchema>;

export function parseReviewQueueFilters(
  input: Record<string, string | string[] | undefined>,
) {
  return reviewQueueFiltersSchema.parse(input);
}

export function hasActiveReviewQueueFilters(filters: ReviewQueueFilters) {
  return (
    filters.platform !== ALL_REVIEW_QUEUE_FILTER ||
    filters.status !== ALL_REVIEW_QUEUE_FILTER ||
    filters.feed !== ALL_REVIEW_QUEUE_FILTER
  );
}
