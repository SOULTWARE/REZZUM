import { lookup } from "node:dns/promises";
import type { LookupAddress } from "node:dns";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import type { IncomingMessage } from "node:http";
import { isIP } from "node:net";
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
const MAX_REDIRECTS = 3;
const MAX_FEED_BYTES = 2 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RSS_ITEMS = 50;

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

function isPrivateIPv4(address: string) {
  const parts = address.split(".").map((part) => Number.parseInt(part, 10));

  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true;
  }

  const [first, second] = parts;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    first >= 224 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0 && (parts[2] === 0 || parts[2] === 2)) ||
    (first === 192 && second === 168) ||
    (first === 192 && second === 88 && parts[2] === 99) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51 && parts[2] === 100) ||
    (first === 203 && second === 0 && parts[2] === 113)
  );
}

function isPrivateIPv6(address: string) {
  const normalized = address.toLowerCase();
  const mappedIPv4 = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];

  if (mappedIPv4) {
    return isPrivateIPv4(mappedIPv4);
  }

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb") ||
    normalized.startsWith("ff")
  );
}

function isBlockedHostname(hostname: string) {
  const normalized = hostname.toLowerCase();

  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  );
}

function isBlockedIpAddress(address: string) {
  const version = isIP(address);

  if (version === 4) {
    return isPrivateIPv4(address);
  }

  if (version === 6) {
    return isPrivateIPv6(address);
  }

  return true;
}

async function assertPublicFeedUrl(feedUrl: string) {
  let url: URL;

  try {
    url = new URL(feedUrl);
  } catch {
    throw new FeedFetchError("RSS URL is not valid.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new FeedFetchError("RSS URL must use http or https.");
  }

  if (url.username || url.password) {
    throw new FeedFetchError("RSS URL must not include credentials.");
  }

  if (isBlockedHostname(url.hostname)) {
    throw new FeedFetchError("RSS URL host is not allowed.");
  }

  if (isIP(url.hostname)) {
    if (isBlockedIpAddress(url.hostname)) {
      throw new FeedFetchError("RSS URL host is not allowed.");
    }

    return {
      address: {
        address: url.hostname,
        family: isIP(url.hostname),
      } satisfies LookupAddress,
      url,
    };
  }

  const addresses = await lookup(url.hostname, { all: true, verbatim: true }).catch(() => []);

  if (addresses.length === 0) {
    throw new FeedFetchError("RSS host could not be resolved.");
  }

  if (addresses.some((address) => isBlockedIpAddress(address.address))) {
    throw new FeedFetchError("RSS URL resolves to a private or reserved network address.");
  }

  return {
    address: addresses[0],
    url,
  };
}

async function readLimitedText(response: IncomingMessage) {
  const contentLength = response.headers["content-length"];
  const contentLengthValue = Array.isArray(contentLength) ? contentLength[0] : contentLength;

  if (contentLengthValue && Number.parseInt(contentLengthValue, 10) > MAX_FEED_BYTES) {
    throw new FeedFetchError("RSS payload is too large.");
  }

  const chunks: Buffer[] = [];
  let receivedBytes = 0;

  for await (const chunk of response) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);

    receivedBytes += buffer.byteLength;
    if (receivedBytes > MAX_FEED_BYTES) {
      response.destroy();
      throw new FeedFetchError("RSS payload is too large.");
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function fetchPublicFeed(feedUrl: string, redirectCount = 0): Promise<{
  payload: string;
  statusCode: number;
}> {
  if (redirectCount > MAX_REDIRECTS) {
    throw new FeedFetchError("RSS fetch followed too many redirects.");
  }

  const { address, url } = await assertPublicFeedUrl(feedUrl);
  const request = url.protocol === "https:" ? httpsRequest : httpRequest;

  return new Promise((resolve, reject) => {
    const clientRequest = request(url, {
      headers: {
        "user-agent": "REZZUM RSS Ingestion/1.0",
        accept: "application/rss+xml, application/atom+xml, text/xml, application/xml;q=0.9, */*;q=0.8",
      },
      lookup: (_hostname, _options, callback) => {
        callback(null, address.address, address.family);
      },
      timeout: REQUEST_TIMEOUT_MS,
    }, (response) => {
      const statusCode = response.statusCode ?? 0;

      if ([301, 302, 303, 307, 308].includes(statusCode)) {
        const location = response.headers.location;
        const redirectLocation = Array.isArray(location) ? location[0] : location;

        response.resume();

        if (!redirectLocation) {
          reject(new FeedFetchError("RSS fetch redirect did not include a location."));
          return;
        }

        fetchPublicFeed(new URL(redirectLocation, url).toString(), redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      readLimitedText(response)
        .then((payload) => resolve({ payload, statusCode }))
        .catch(reject);
    });

    clientRequest.on("timeout", () => {
      clientRequest.destroy(new FeedFetchError("RSS fetch timed out."));
    });
    clientRequest.on("error", reject);
    clientRequest.end();
  });
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
  let response: Awaited<ReturnType<typeof fetchPublicFeed>>;

  try {
    response = await fetchPublicFeed(feedUrl);
  } catch (error) {
    if (error instanceof FeedFetchError) {
      throw error;
    }

    throw new FeedFetchError("RSS fetch failed. The source feed could not be reached.", {
      cause: error,
    });
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new FeedFetchError(`RSS fetch failed with status ${response.statusCode}.`);
  }

  let parsed: Record<string, unknown>;

  try {
    parsed = parser.parse(response.payload) as Record<string, unknown>;
  } catch (error) {
    throw new FeedFetchError("RSS payload could not be parsed.", {
      cause: error,
    });
  }

  if (parsed.rss && typeof parsed.rss === "object") {
    const channel = (parsed.rss as Record<string, unknown>).channel as Record<string, unknown>;

    return parseRssItems(channel).filter((item) => item.sourceUrl).slice(0, MAX_RSS_ITEMS);
  }

  if (parsed.feed && typeof parsed.feed === "object") {
    return parseAtomEntries(parsed.feed as Record<string, unknown>)
      .filter((item) => item.sourceUrl)
      .slice(0, MAX_RSS_ITEMS);
  }

  throw new FeedFetchError("RSS payload is not a supported RSS or Atom document.");
}
