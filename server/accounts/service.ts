import { SocialAccountStatus, SocialPlatform } from "@prisma/client";
import {
  disconnectSocialAccount,
  getSocialAccountById,
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

export async function getAccountsOverview() {
  const accounts = await listSocialAccounts();
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

export async function getConnectedAccountOptions(platform?: SocialPlatform) {
  const accounts = await listSocialAccounts();

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

export async function getConnectedSocialAccountsInternal() {
  const accounts = await listSocialAccountsInternal();

  return accounts.filter((account) => account.status === SocialAccountStatus.CONNECTED);
}

export async function getSocialAccount(accountId: string) {
  return getSocialAccountById(accountId);
}

export async function disconnectAccount(accountId: string) {
  return disconnectSocialAccount(accountId);
}
