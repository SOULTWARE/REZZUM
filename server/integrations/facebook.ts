import { SocialAccountStatus, SocialPlatform } from "@prisma/client";
import { upsertSocialAccount } from "@/server/accounts/repository";
import { getAbsoluteUrl } from "@/server/integrations/oauth";
import { decryptSecret, encryptSecret } from "@/server/security/crypto";

const FACEBOOK_API_VERSION = process.env.FACEBOOK_API_VERSION?.trim() || "v25.0";
const FACEBOOK_SCOPES = [
  "public_profile",
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
] as const;

type FacebookTokenResponse = {
  access_token: string;
  expires_in?: number;
  token_type?: string;
};

type FacebookPage = {
  access_token?: string;
  id: string;
  link?: string;
  name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
  username?: string;
};

function getFacebookClientId() {
  const clientId = process.env.FACEBOOK_CLIENT_ID?.trim();

  if (!clientId) {
    throw new Error("FACEBOOK_CLIENT_ID is required.");
  }

  return clientId;
}

function getFacebookClientSecret() {
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET?.trim();

  if (!clientSecret) {
    throw new Error("FACEBOOK_CLIENT_SECRET is required.");
  }

  return clientSecret;
}

function getGraphUrl(pathname: string) {
  return `https://graph.facebook.com/${FACEBOOK_API_VERSION}${pathname}`;
}

function getRedirectUri(baseUrl?: string) {
  return getAbsoluteUrl("/api/auth/facebook/callback", baseUrl);
}

export function getFacebookAuthorizationUrl(state: string, baseUrl?: string) {
  const url = new URL("https://www.facebook.com/dialog/oauth");

  url.searchParams.set("client_id", getFacebookClientId());
  url.searchParams.set("redirect_uri", getRedirectUri(baseUrl));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", FACEBOOK_SCOPES.join(","));
  url.searchParams.set("state", state);
  url.searchParams.set("auth_type", "rerequest");
  url.searchParams.set("return_scopes", "true");

  return url.toString();
}

async function exchangeFacebookCodeForToken(code: string, baseUrl?: string) {
  const url = new URL(getGraphUrl("/oauth/access_token"));

  url.searchParams.set("client_id", getFacebookClientId());
  url.searchParams.set("client_secret", getFacebookClientSecret());
  url.searchParams.set("redirect_uri", getRedirectUri(baseUrl));
  url.searchParams.set("code", code);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Facebook token exchange failed with ${response.status}.`);
  }

  return (await response.json()) as FacebookTokenResponse;
}

async function fetchFacebookPages(accessToken: string) {
  const url = new URL(getGraphUrl("/me/accounts"));

  url.searchParams.set(
    "fields",
    "id,name,access_token,link,username,picture{url}",
  );
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Facebook Page lookup failed with ${response.status}.`);
  }

  const payload = (await response.json()) as {
    data?: FacebookPage[];
  };

  return payload.data ?? [];
}

export async function connectFacebookPages(code: string, baseUrl?: string) {
  const token = await exchangeFacebookCodeForToken(code, baseUrl);
  const pages = await fetchFacebookPages(token.access_token);

  if (pages.length === 0) {
    throw new Error(
      "No Facebook Pages were returned for this account. Confirm the app has Page permissions and the member can create Page content.",
    );
  }

  const connectedAccounts = [];

  for (const page of pages) {
    if (!page.access_token) {
      continue;
    }

    connectedAccounts.push(
      await upsertSocialAccount({
        platform: SocialPlatform.FACEBOOK,
        providerAccountId: page.id,
        status: SocialAccountStatus.CONNECTED,
        displayName: page.name,
        handle: page.username ? `facebook.com/${page.username}` : null,
        profileUrl: page.link ?? (page.username ? `https://www.facebook.com/${page.username}` : null),
        providerUsername: page.username ?? null,
        accessTokenEncrypted: encryptSecret(page.access_token),
        refreshTokenEncrypted: null,
        tokenExpiresAt: null,
        scopes: [...FACEBOOK_SCOPES],
        externalUrn: page.id,
        connectedAt: new Date(),
        lastValidatedAt: new Date(),
        metadataJson: {
          page,
          profileImageUrl: page.picture?.data?.url ?? null,
        },
      }),
    );
  }

  if (connectedAccounts.length === 0) {
    throw new Error("Facebook returned Pages without Page access tokens.");
  }

  return connectedAccounts;
}

export async function publishToFacebook(params: {
  accessTokenEncrypted: string | null;
  pageId: string | null;
  text: string;
}) {
  const accessToken = decryptSecret(params.accessTokenEncrypted);

  if (!accessToken || !params.pageId) {
    throw new Error("Facebook account is missing a Page access token or Page id.");
  }

  const response = await fetch(getGraphUrl(`/${params.pageId}/feed`), {
    body: new URLSearchParams({
      access_token: accessToken,
      message: params.text,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Facebook publish failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as {
    id?: string;
  };

  return {
    externalId: payload.id ?? null,
    providerMessage: payload.id ? `Facebook post ${payload.id}` : null,
  };
}
