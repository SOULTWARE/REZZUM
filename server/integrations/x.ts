import { SocialAccountStatus, SocialPlatform } from "@prisma/client";
import { upsertSocialAccount } from "@/server/accounts/repository";
import { createPkceChallenge, createPkceVerifier, getAbsoluteUrl } from "@/server/integrations/oauth";
import { decryptSecret, encryptSecret } from "@/server/security/crypto";

const X_SCOPES = ["tweet.read", "tweet.write", "users.read", "offline.access"] as const;

type XTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type: string;
};

function getXClientId() {
  const clientId = process.env.X_CLIENT_ID?.trim();

  if (!clientId) {
    throw new Error("X_CLIENT_ID is required.");
  }

  return clientId;
}

function getXClientSecret() {
  const clientSecret = process.env.X_CLIENT_SECRET?.trim();

  if (!clientSecret) {
    throw new Error("X_CLIENT_SECRET is required.");
  }

  return clientSecret;
}

function getRedirectUri() {
  return getAbsoluteUrl("/api/auth/x/callback");
}

export function createXAuthorizationRequest(state: string) {
  const verifier = createPkceVerifier();
  const challenge = createPkceChallenge(verifier);
  const url = new URL("https://x.com/i/oauth2/authorize");

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", getXClientId());
  url.searchParams.set("redirect_uri", getRedirectUri());
  url.searchParams.set("scope", X_SCOPES.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  return {
    verifier,
    authorizationUrl: url.toString(),
  };
}

export async function exchangeXCodeForToken(params: {
  code: string;
  verifier: string;
}) {
  const body = new URLSearchParams({
    code: params.code,
    grant_type: "authorization_code",
    client_id: getXClientId(),
    redirect_uri: getRedirectUri(),
    code_verifier: params.verifier,
  });
  const basicAuth = Buffer.from(`${getXClientId()}:${getXClientSecret()}`).toString("base64");
  const response = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: `Basic ${basicAuth}`,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`X token exchange failed with ${response.status}.`);
  }

  return (await response.json()) as XTokenResponse;
}

async function fetchAuthenticatedXUser(accessToken: string) {
  const response = await fetch("https://api.x.com/2/users/me?user.fields=profile_image_url", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`X user lookup failed with ${response.status}.`);
  }

  const payload = (await response.json()) as {
    data?: {
      id: string;
      name: string;
      username: string;
      profile_image_url?: string;
    };
  };

  if (!payload.data) {
    throw new Error("X user lookup returned no account.");
  }

  return payload.data;
}

export async function connectXAccount(params: {
  code: string;
  verifier: string;
}) {
  const token = await exchangeXCodeForToken(params);
  const user = await fetchAuthenticatedXUser(token.access_token);

  return upsertSocialAccount({
    platform: SocialPlatform.X,
    providerAccountId: user.id,
    status: SocialAccountStatus.CONNECTED,
    displayName: user.name,
    handle: `@${user.username}`,
    profileUrl: `https://x.com/${user.username}`,
    providerUsername: user.username,
    accessTokenEncrypted: encryptSecret(token.access_token),
    refreshTokenEncrypted: token.refresh_token ? encryptSecret(token.refresh_token) : null,
    tokenExpiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null,
    scopes: token.scope?.split(/\s+/).filter(Boolean) ?? [...X_SCOPES],
    connectedAt: new Date(),
    lastValidatedAt: new Date(),
    metadataJson: {
      profileImageUrl: user.profile_image_url ?? null,
    },
  });
}

export async function publishToX(params: {
  accessTokenEncrypted: string | null;
  text: string;
}) {
  const accessToken = decryptSecret(params.accessTokenEncrypted);

  if (!accessToken) {
    throw new Error("X account is missing an access token.");
  }

  const response = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      text: params.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`X publish failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as {
    data?: {
      id: string;
      text: string;
    };
  };

  return {
    externalId: payload.data?.id ?? null,
    providerMessage: payload.data?.text ?? null,
  };
}
