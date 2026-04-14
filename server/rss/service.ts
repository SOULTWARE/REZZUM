import { XMLParser } from "fast-xml-parser";

export type ParsedRssItem = {
  sourceEntryId: string | null;
  title: string;
  sourceUrl: string;
  canonicalUrl: string | null;
  excerpt: string | null;
  contentText: string | null;
  authorName: string | null;
  publishedAt: Date | null;
};

export class FeedFetchError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "FeedFetchError";
  }
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  removeNSPrefix: true,
  trimValues: true,
});

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function stripHtml(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getTextValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record["#text"] === "string" && record["#text"].trim()) {
      return record["#text"].trim();
    }
  }

  return null;
}

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    const textValue = getTextValue(value);

    if (textValue) {
      return textValue;
    }
  }

  return null;
}

function parseAtomEntries(feed: Record<string, unknown>) {
  return ensureArray(feed.entry).map((entry) => {
    const record = entry as Record<string, unknown>;
    const links = ensureArray(record.link as Record<string, unknown> | Array<Record<string, unknown>>);
    const alternateLink =
      links.find((link) => typeof link?.rel !== "string" || link.rel === "alternate") ?? links[0];
    const content = pickFirstString(
      record.content as string,
      (record.content as Record<string, unknown> | undefined)?.["#text"],
      record.summary as string,
    );

    return {
      sourceEntryId: pickFirstString(record.id, record.guid),
      title: pickFirstString(record.title) ?? "Untitled article",
      sourceUrl: pickFirstString(alternateLink?.href, record.id) ?? "",
      canonicalUrl: pickFirstString(alternateLink?.href),
      excerpt: stripHtml(pickFirstString(record.summary, record.subtitle)),
      contentText: stripHtml(content),
      authorName: pickFirstString(
        (record.author as Record<string, unknown> | undefined)?.name,
        record.author,
      ),
      publishedAt: parseDate(record.updated ?? record.published),
    } satisfies ParsedRssItem;
  });
}

function parseRssItems(channel: Record<string, unknown>) {
  return ensureArray(channel.item).map((item) => {
    const record = item as Record<string, unknown>;
    const content = pickFirstString(
      record["content:encoded"],
      record.encoded,
      record.description,
      record.content,
    );

    return {
      sourceEntryId: pickFirstString(record.guid, record.id),
      title: pickFirstString(record.title) ?? "Untitled article",
      sourceUrl: pickFirstString(record.link) ?? "",
      canonicalUrl: pickFirstString(record.link),
      excerpt: stripHtml(pickFirstString(record.description)),
      contentText: stripHtml(content),
      authorName: pickFirstString(record.creator, record.author),
      publishedAt: parseDate(record.pubDate ?? record.published),
    } satisfies ParsedRssItem;
  });
}

export async function fetchAndParseFeed(feedUrl: string) {
  let response: Response;

  try {
    response = await fetch(feedUrl, {
      headers: {
        "user-agent": "REZZUM RSS Ingestion/1.0",
        accept: "application/rss+xml, application/atom+xml, text/xml, application/xml;q=0.9, */*;q=0.8",
      },
      cache: "no-store",
    });
  } catch (error) {
    throw new FeedFetchError("RSS fetch failed. The source feed could not be reached.", {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new FeedFetchError(`RSS fetch failed with status ${response.status}.`);
  }

  let payload: string;

  try {
    payload = await response.text();
  } catch (error) {
    throw new FeedFetchError("RSS fetch succeeded, but the feed body could not be read.", {
      cause: error,
    });
  }

  let parsed: Record<string, unknown>;

  try {
    parsed = parser.parse(payload) as Record<string, unknown>;
  } catch (error) {
    throw new FeedFetchError("RSS payload could not be parsed.", {
      cause: error,
    });
  }

  if (parsed.rss && typeof parsed.rss === "object") {
    const channel = (parsed.rss as Record<string, unknown>).channel as Record<string, unknown>;

    return parseRssItems(channel).filter((item) => item.sourceUrl);
  }

  if (parsed.feed && typeof parsed.feed === "object") {
    return parseAtomEntries(parsed.feed as Record<string, unknown>).filter((item) => item.sourceUrl);
  }

  throw new FeedFetchError("RSS payload is not a supported RSS or Atom document.");
}
