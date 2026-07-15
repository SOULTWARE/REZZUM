import { SocialAccountStatus, SocialPlatform } from "@prisma/client";
import {
  disconnectSocialAccount,
  getSocialAccountById,
  getSocialAccountByIdInternal,
  listSocialAccounts,
  listSocialAccountsInternal,
} from "@/server/accounts/repository";

const STATUS_ORDER = [
  SocialAccountStatus.CONNECTED,
  SocialAccountStatus.PENDING,
  SocialAccountStatus.EXPIRED,
  SocialAccountStatus.DISCONNECTED,
] as const;

function compareStatuses(
  left: (typeof STATUS_ORDER)[number],
  right: (typeof STATUS_ORDER)[number],
) {
  return STATUS_ORDER.indexOf(left) - STATUS_ORDER.indexOf(right);
}

export async function getAccountsOverview(userId: string) {
  const accounts = await listSocialAccounts(userId);
  const orderedAccounts = [...accounts].sort((left, right) => {
    const statusComparison = compareStatuses(left.status, right.status);

    if (statusComparison !== 0) {
      return statusComparison;
    }

    return left.displayName.localeCompare(right.displayName);
  });

  const connectedCount = orderedAccounts.filter(
    (account) => account.status === SocialAccountStatus.CONNECTED,
  ).length;
  const attentionCount = orderedAccounts.filter(
    (account) =>
      account.status === SocialAccountStatus.EXPIRED ||
      account.status === SocialAccountStatus.PENDING,
  ).length;
  const activePlatformCount = new Set(
    orderedAccounts
      .filter((account) => account.status === SocialAccountStatus.CONNECTED)
      .map((account) => account.platform),
  ).size;

  return {
    accounts: orderedAccounts,
    totalCount: orderedAccounts.length,
    connectedCount,
    attentionCount,
    activePlatformCount,
  };
}

export async function getConnectedAccountOptions(userId: string, platform?: SocialPlatform) {
  const accounts = await listSocialAccounts(userId);

  return accounts
    .filter(
      (account) =>
        account.status === SocialAccountStatus.CONNECTED &&
        (platform ? account.platform === platform : true),
    )
    .map((account) => ({
      value: account.id,
      label: account.displayName,
      platform: account.platform,
    }));
}

export async function getConnectedSocialAccountsInternal(userId: string) {
  const accounts = await listSocialAccountsInternal(userId);

  return accounts.filter((account) => account.status === SocialAccountStatus.CONNECTED);
}

export async function getSocialAccount(userId: string, accountId: string) {
  return getSocialAccountById(userId, accountId);
}

export async function getSocialAccountInternal(accountId: string) {
  return getSocialAccountByIdInternal(accountId);
}

export async function disconnectAccount(userId: string, accountId: string) {
  return disconnectSocialAccount(userId, accountId);
}
