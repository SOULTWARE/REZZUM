export const FEED_REFRESH_INTERVAL_OPTIONS = [
  { value: 15, label: "Every 15 minutes", description: "Best for fast-moving sources." },
  { value: 60, label: "Every hour", description: "A balanced default for most feeds." },
  { value: 180, label: "Every 3 hours", description: "Useful for lower-volume feeds." },
  { value: 720, label: "Twice a day", description: "A calmer refresh cadence." },
  { value: 1440, label: "Daily", description: "For occasional updates and long-form sources." },
] as const;

export const FEED_REFRESH_INTERVAL_VALUES = FEED_REFRESH_INTERVAL_OPTIONS.map(
  (option) => option.value,
);

export const DEFAULT_REFRESH_INTERVAL_MINUTES = 60;
export const DEFAULT_MINIMUM_WORD_COUNT = 300;

export type FeedRefreshIntervalMinutes =
  (typeof FEED_REFRESH_INTERVAL_OPTIONS)[number]["value"];

export type FeedFormValues = {
  name: string;
  rssUrl: string;
  includeKeywords: string;
  excludeKeywords: string;
  minimumWordCount: number;
  refreshIntervalMinutes: FeedRefreshIntervalMinutes;
};

export const EMPTY_FEED_FORM_VALUES: FeedFormValues = {
  name: "",
  rssUrl: "",
  includeKeywords: "",
  excludeKeywords: "",
  minimumWordCount: DEFAULT_MINIMUM_WORD_COUNT,
  refreshIntervalMinutes: DEFAULT_REFRESH_INTERVAL_MINUTES,
};

export function getRefreshIntervalLabel(value: number) {
  return (
    FEED_REFRESH_INTERVAL_OPTIONS.find((option) => option.value === value)?.label ??
    "Custom"
  );
}

export function parseKeywordText(value: string) {
  const seen = new Set<string>();

  return value
    .split(/[\n,]/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0)
    .filter((keyword) => {
      const normalized = keyword.toLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}

export function joinKeywordList(keywords: string[]) {
  return keywords.join(", ");
}

export function normalizeFeedUrl(value: string) {
  const url = new URL(value.trim());

  url.protocol = url.protocol.toLowerCase();
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
}
