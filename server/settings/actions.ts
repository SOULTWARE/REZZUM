"use server";

import { revalidatePath } from "next/cache";
import { updateWorkspaceSettings } from "@/server/settings/service";

function normalizeAccountId(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

export async function updateWorkspaceSettingsAction(formData: FormData) {
  const defaultLanguage = String(formData.get("defaultLanguage") ?? "").trim() || "English";
  const defaultFeel = String(formData.get("defaultFeel") ?? "").trim() || "Professional";
  const defaultStyle = String(formData.get("defaultStyle") ?? "").trim();
  const intervalRaw = String(formData.get("defaultAutoPublishIntervalMinutes") ?? "").trim();
  const defaultAutoPublishIntervalMinutes = intervalRaw ? Number.parseInt(intervalRaw, 10) : null;

  await updateWorkspaceSettings({
    defaultLanguage,
    defaultFeel,
    defaultStyle,
    defaultAutoPublishIntervalMinutes:
      defaultAutoPublishIntervalMinutes && defaultAutoPublishIntervalMinutes > 0
        ? defaultAutoPublishIntervalMinutes
        : null,
    defaultLinkedInAccountId: normalizeAccountId(formData.get("defaultLinkedInAccountId")),
    defaultXAccountId: normalizeAccountId(formData.get("defaultXAccountId")),
  });

  revalidatePath("/settings");
  revalidatePath("/feeds/new");
  revalidatePath("/dashboard");
}
