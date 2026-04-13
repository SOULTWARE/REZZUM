import { Prisma, SocialAccountStatus, SocialPlatform } from "@prisma/client";
import { db } from "@/server/db/client";

export const socialAccountDefaultSelect = {
  id: true,
  platform: true,
  status: true,
  displayName: true,
  handle: true,
  profileUrl: true,
  providerAccountId: true,
  providerUsername: true,
  tokenExpiresAt: true,
  scopes: true,
  externalUrn: true,
  metadataJson: true,
  lastValidatedAt: true,
  connectedAt: true,
  disconnectedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SocialAccountSelect;

export const socialAccountInternalSelect = {
  ...socialAccountDefaultSelect,
  accessTokenEncrypted: true,
  refreshTokenEncrypted: true,
} satisfies Prisma.SocialAccountSelect;

export type SocialAccountRecord = Prisma.SocialAccountGetPayload<{
  select: typeof socialAccountDefaultSelect;
}>;

export type SocialAccountInternalRecord = Prisma.SocialAccountGetPayload<{
  select: typeof socialAccountInternalSelect;
}>;

export async function listSocialAccounts() {
  return db.socialAccount.findMany({
    select: socialAccountDefaultSelect,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function listSocialAccountsInternal() {
  return db.socialAccount.findMany({
    select: socialAccountInternalSelect,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getSocialAccountById(accountId: string) {
  return db.socialAccount.findUnique({
    where: { id: accountId },
    select: socialAccountInternalSelect,
  });
}

export async function upsertSocialAccount(data: {
  platform: SocialPlatform;
  providerAccountId: string;
  status: SocialAccountStatus;
  displayName: string;
  handle?: string | null;
  profileUrl?: string | null;
  providerUsername?: string | null;
  accessTokenEncrypted?: string | null;
  refreshTokenEncrypted?: string | null;
  tokenExpiresAt?: Date | null;
  scopes?: string[];
  externalUrn?: string | null;
  metadataJson?: Prisma.InputJsonValue | null;
  connectedAt?: Date | null;
  lastValidatedAt?: Date | null;
  disconnectedAt?: Date | null;
}) {
  return db.socialAccount.upsert({
    where: {
      platform_providerAccountId: {
        platform: data.platform,
        providerAccountId: data.providerAccountId,
      },
    },
    update: {
      status: data.status,
      displayName: data.displayName,
      handle: data.handle,
      profileUrl: data.profileUrl,
      providerUsername: data.providerUsername,
      accessTokenEncrypted: data.accessTokenEncrypted,
      refreshTokenEncrypted: data.refreshTokenEncrypted,
      tokenExpiresAt: data.tokenExpiresAt,
      scopes: data.scopes ?? [],
      externalUrn: data.externalUrn,
      metadataJson: data.metadataJson ?? Prisma.JsonNull,
      connectedAt: data.connectedAt,
      lastValidatedAt: data.lastValidatedAt,
      disconnectedAt: data.disconnectedAt,
    },
    create: {
      platform: data.platform,
      providerAccountId: data.providerAccountId,
      status: data.status,
      displayName: data.displayName,
      handle: data.handle,
      profileUrl: data.profileUrl,
      providerUsername: data.providerUsername,
      accessTokenEncrypted: data.accessTokenEncrypted,
      refreshTokenEncrypted: data.refreshTokenEncrypted,
      tokenExpiresAt: data.tokenExpiresAt,
      scopes: data.scopes ?? [],
      externalUrn: data.externalUrn,
      metadataJson: data.metadataJson ?? Prisma.JsonNull,
      connectedAt: data.connectedAt,
      lastValidatedAt: data.lastValidatedAt,
      disconnectedAt: data.disconnectedAt,
    },
    select: socialAccountDefaultSelect,
  });
}

export async function disconnectSocialAccount(accountId: string) {
  return db.socialAccount.update({
    where: { id: accountId },
    data: {
      status: "DISCONNECTED",
      disconnectedAt: new Date(),
    },
    select: socialAccountDefaultSelect,
  });
}
