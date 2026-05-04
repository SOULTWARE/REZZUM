import { SocialAccountStatus, SocialPlatform } from "@prisma/client";
import { upsertSocialAccount } from "@/server/accounts/repository";
import { decryptSecret, encryptSecret } from "@/server/security/crypto";
import { getAbsoluteUrl } from "@/server/integrations/oauth";

const LINKEDIN_VERSION = process.env.LINKEDIN_VERSION?.trim() || "202604";
const LINKEDIN_SCOPES = [
  "openid",
  "profile",
  "email",
  "w_organization_social",
  "r_organization_social",
  "rw_organization_admin",
] as const;

type LinkedInTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
};

function getLinkedInHeaders(accessToken: string) {
  return {
    authorization: `Bearer ${accessToken}`,
    "X-Restli-Protocol-Version": "2.0.0",
    "Linkedin-Version": LINKEDIN_VERSION,
    "Content-Type": "application/json",
  };
}

function getRedirectUri(baseUrl?: string) {
  return getAbsoluteUrl("/api/auth/linkedin/callback", baseUrl);
}

export function getLinkedInAuthorizationUrl(state: string, baseUrl?: string) {
  const clientId = process.env.LINKEDIN_CLIENT_ID?.trim();

  if (!clientId) {
    throw new Error("LINKEDIN_CLIENT_ID is required.");
  }

  const url = new URL("https://www.linkedin.com/oauth/v2/authorization");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", getRedirectUri(baseUrl));
  url.searchParams.set("state", state);
  url.searchParams.set("scope", LINKEDIN_SCOPES.join(" "));

  return url.toString();
}

export async function exchangeLinkedInCodeForToken(code: string, baseUrl?: string) {
  const clientId = process.env.LINKEDIN_CLIENT_ID?.trim();
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("LinkedIn client credentials are required.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(baseUrl),
    client_id: clientId,
    client_secret: clientSecret,
  });
  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`LinkedIn token exchange failed with ${response.status}.`);
  }

  return (await response.json()) as LinkedInTokenResponse;
}

async function fetchLinkedInUserInfo(accessToken: string) {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`LinkedIn user info request failed with ${response.status}.`);
  }

  return (await response.json()) as {
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
  };
}

async function fetchLinkedInOrganizations(accessToken: string) {
  const response = await fetch(
    "https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED",
    {
      headers: getLinkedInHeaders(accessToken),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`LinkedIn organization lookup failed with ${response.status}.`);
  }

  const payload = (await response.json()) as {
    elements?: Array<{
      organization?: string;
      organizationTarget?: string;
    }>;
  };

  const organizationUrns = [
    ...new Set(
      (payload.elements ?? [])
        .map((item) => item.organizationTarget ?? item.organization)
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  const organizations = [];

  for (const organizationUrn of organizationUrns) {
    const organizationId = organizationUrn.split(":").at(-1);

    if (!organizationId) {
      continue;
    }

    const organizationResponse = await fetch(
      `https://api.linkedin.com/rest/organizations/${organizationId}`,
      {
        headers: getLinkedInHeaders(accessToken),
        cache: "no-store",
      },
    );

    if (!organizationResponse.ok) {
      continue;
    }

    const organization = (await organizationResponse.json()) as {
      id?: number;
      localizedName?: string;
      vanityName?: string;
    };

    organizations.push({
      id: String(organization.id ?? organizationId),
      urn: `urn:li:organization:${organization.id ?? organizationId}`,
      name: organization.localizedName ?? `LinkedIn Organization ${organizationId}`,
      vanityName: organization.vanityName ?? null,
    });
  }

  return organizations;
}

export async function connectLinkedInOrganizations(code: string, baseUrl?: string) {
  const token = await exchangeLinkedInCodeForToken(code, baseUrl);
  const user = await fetchLinkedInUserInfo(token.access_token);
  const organizations = await fetchLinkedInOrganizations(token.access_token);

  if (organizations.length === 0) {
    throw new Error(
      "No administered LinkedIn organization pages were returned for this account. Confirm the app has organization scopes and the member is a page administrator.",
    );
  }

  const connectedAccounts = [];

  for (const organization of organizations) {
    connectedAccounts.push(
      await upsertSocialAccount({
        platform: SocialPlatform.LINKEDIN,
        providerAccountId: organization.id,
        status: SocialAccountStatus.CONNECTED,
        displayName: organization.name,
        handle: organization.vanityName ? `linkedin.com/company/${organization.vanityName}` : null,
        profileUrl: organization.vanityName
          ? `https://www.linkedin.com/company/${organization.vanityName}`
          : null,
        providerUsername: organization.vanityName,
        accessTokenEncrypted: encryptSecret(token.access_token),
        refreshTokenEncrypted: token.refresh_token
          ? encryptSecret(token.refresh_token)
          : null,
        tokenExpiresAt: token.expires_in
          ? new Date(Date.now() + token.expires_in * 1000)
          : null,
        scopes: token.scope?.split(/\s+/).filter(Boolean) ?? [...LINKEDIN_SCOPES],
        externalUrn: organization.urn,
        connectedAt: new Date(),
        lastValidatedAt: new Date(),
        metadataJson: {
          organization,
          member: {
            sub: user.sub ?? null,
            name: user.name ?? null,
            email: user.email ?? null,
            picture: user.picture ?? null,
          },
        },
      }),
    );
  }

  return connectedAccounts;
}

export async function publishToLinkedIn(params: {
  accessTokenEncrypted: string | null;
  authorUrn: string | null;
  text: string;
}) {
  const accessToken = decryptSecret(params.accessTokenEncrypted);

  if (!accessToken || !params.authorUrn) {
    throw new Error("LinkedIn account is missing an access token or organization URN.");
  }

  const response = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: getLinkedInHeaders(accessToken),
    body: JSON.stringify({
      author: params.authorUrn,
      commentary: params.text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`LinkedIn publish failed: ${response.status} ${errorText}`);
  }

  return {
    externalId: response.headers.get("x-restli-id"),
    providerMessage: await response.text(),
  };
}
