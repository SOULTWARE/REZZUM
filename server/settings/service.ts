import { getWorkspaceSettingsRecord, updateWorkspaceSettingsRecord } from "@/server/settings/repository";

export async function getWorkspaceSettings() {
  return getWorkspaceSettingsRecord();
}

export async function updateWorkspaceSettings(input: {
  defaultLanguage: string;
  defaultFeel: string;
  defaultStyle: string;
  defaultAutoPublishIntervalMinutes: number | null;
  defaultFacebookAccountId: string | null;
  defaultLinkedInAccountId: string | null;
  defaultXAccountId: string | null;
}) {
  return updateWorkspaceSettingsRecord(input);
}
