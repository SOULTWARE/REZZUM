import { SocialPlatform } from "@prisma/client";
import { getSocialAccount } from "@/server/accounts/service";
import { getWorkspaceSettingsRecord, updateWorkspaceSettingsRecord } from "@/server/settings/repository";

export async function getWorkspaceSettings(userId: string) {
  return getWorkspaceSettingsRecord(userId);
}

export async function updateWorkspaceSettings(userId: string, input: {
  defaultLanguage: string;
  defaultFeel: string;
  defaultStyle: string;
  defaultAutoPublishIntervalMinutes: number | null;
  defaultFacebookAccountId: string | null;
  defaultLinkedInAccountId: string | null;
  defaultXAccountId: string | null;
}) {
  const accounts = [
    { id: input.defaultFacebookAccountId, platform: SocialPlatform.FACEBOOK },
    { id: input.defaultLinkedInAccountId, platform: SocialPlatform.LINKEDIN },
    { id: input.defaultXAccountId, platform: SocialPlatform.X },
  ];

  for (const accountRef of accounts) {
    if (!accountRef.id) {
      continue;
    }

    const account = await getSocialAccount(userId, accountRef.id);

    if (!account || account.platform !== accountRef.platform) {
      throw new Error("Selected default account is not available for this workspace.");
    }
  }

  return updateWorkspaceSettingsRecord(userId, input);
}
