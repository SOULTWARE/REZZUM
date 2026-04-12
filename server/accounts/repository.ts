import type { Prisma } from "@prisma/client";
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
  lastValidatedAt: true,
  connectedAt: true,
  disconnectedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SocialAccountSelect;

export type SocialAccountRecord = Prisma.SocialAccountGetPayload<{
  select: typeof socialAccountDefaultSelect;
}>;

export async function listSocialAccounts() {
  return db.socialAccount.findMany({
    select: socialAccountDefaultSelect,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}
