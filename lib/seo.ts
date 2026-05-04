import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://rezzum.online";

export const siteConfig = {
  name: "REZZUM",
  shortName: "REZZUM",
  defaultTitle: "REZZUM | RSS-to-Social Media Automation Platform",
  description:
    "REZZUM turns RSS feeds into AI-assisted, reviewable, schedulable social media drafts for Facebook, LinkedIn, and X.",
  keywords: [
    "RSS social media automation",
    "RSS to social media",
    "AI social media content",
    "social media scheduling",
    "content repurposing platform",
    "Facebook publishing",
    "LinkedIn publishing",
    "X publishing",
    "editorial workflow",
  ],
  creator: "REZZUM",
  locale: "en_US",
  ogImagePath: "/opengraph-image",
};

export const publicSeoRoutes = [
  {
    pathname: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    pathname: "/pricing",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    pathname: "/about",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    pathname: "/faq",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    pathname: "/privacy",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    pathname: "/terms",
    changeFrequency: "yearly",
    priority: 0.3,
  },
] as const;

type PageMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredUrl) {
    return process.env.NODE_ENV === "production"
      ? DEFAULT_SITE_URL
      : "http://localhost:3000";
  }

  try {
    return new URL(configuredUrl).origin;
  } catch {
    const normalizedUrl =
      configuredUrl.startsWith("localhost") ||
      configuredUrl.startsWith("127.0.0.1")
        ? `http://${configuredUrl}`
        : `https://${configuredUrl}`;

    return new URL(normalizedUrl).origin;
  }
}

export function getAbsoluteUrl(pathname = "/") {
  return new URL(pathname, `${stripTrailingSlash(getSiteUrl())}/`).toString();
}

export function createPageMetadata({
  title,
  description,
  pathname,
  keywords = [],
  noIndex = false,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const mergedKeywords = Array.from(
    new Set([...siteConfig.keywords, ...keywords]),
  );
  const image = {
    url: siteConfig.ogImagePath,
    width: 1200,
    height: 630,
    alt: "REZZUM RSS-to-social media automation platform",
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: siteConfig.name,
      images: [image],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImagePath],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: getAbsoluteUrl("/"),
    logo: getAbsoluteUrl("/logo-1024.png"),
    description: siteConfig.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getAbsoluteUrl("/"),
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteUrl("/logo-1024.png"),
      },
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: getAbsoluteUrl("/"),
    image: getAbsoluteUrl("/logo-1024.png"),
    description: siteConfig.description,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "20",
      priceCurrency: "USD",
      offerCount: "3",
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; pathname: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.pathname),
    })),
  };
}

export function faqJsonLd(
  items: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
