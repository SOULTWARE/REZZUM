"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAuthSession } from "@/server/auth/session";
import { updateWorkspaceSettings } from "@/server/settings/service";

const MAXIMUM_AUTO_PUBLISH_INTERVAL_MINUTES = 7 * 24 * 60;

const optionalAccountIdSchema = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z.string().trim().max(191).transform((value) => value || null),
);

const workspaceSettingsSchema = z.object({
  defaultLanguage: z.preprocess(
    (value) => {
      const textValue = typeof value === "string" ? value.trim() : "";

      return textValue || "English";
    },
    z.string().max(64),
  ),
  defaultFeel: z.preprocess(
    (value) => {
      const textValue = typeof value === "string" ? value.trim() : "";

      return textValue || "Professional";
    },
    z.string().max(120),
  ),
  defaultStyle: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z.string().max(2000),
  ),
  defaultAutoPublishIntervalMinutes: z.preprocess(
    (value) => {
      const textValue = typeof value === "string" ? value.trim() : "";

      return textValue ? Number.parseInt(textValue, 10) : null;
    },
    z
      .number()
      .int()
      .min(15)
      .max(MAXIMUM_AUTO_PUBLISH_INTERVAL_MINUTES)
      .nullable(),
  ),
  defaultFacebookAccountId: optionalAccountIdSchema,
  defaultLinkedInAccountId: optionalAccountIdSchema,
  defaultXAccountId: optionalAccountIdSchema,
});

export async function updateWorkspaceSettingsAction(formData: FormData) {
  const session = await requireAuthSession();
  const parsed = workspaceSettingsSchema.parse({
    defaultLanguage: formData.get("defaultLanguage"),
    defaultFeel: formData.get("defaultFeel"),
    defaultStyle: formData.get("defaultStyle"),
    defaultAutoPublishIntervalMinutes: formData.get("defaultAutoPublishIntervalMinutes"),
    defaultFacebookAccountId: formData.get("defaultFacebookAccountId"),
    defaultLinkedInAccountId: formData.get("defaultLinkedInAccountId"),
    defaultXAccountId: formData.get("defaultXAccountId"),
  });

  await updateWorkspaceSettings(session.user.id, {
    ...parsed,
  });

  revalidatePath("/settings");
  revalidatePath("/feeds/new");
  revalidatePath("/dashboard");
}
