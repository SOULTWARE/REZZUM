import type { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";

export const workspaceSettingsInclude = {
  defaultFacebookAccount: true,
  defaultLinkedInAccount: true,
  defaultXAccount: true,
} satisfies Prisma.WorkspaceSettingsInclude;

export type WorkspaceSettingsRecord = Prisma.WorkspaceSettingsGetPayload<{
  include: typeof workspaceSettingsInclude;
}>;

export async function getWorkspaceSettingsRecord() {
  const settings = await db.workspaceSettings.findUnique({
    where: { id: "singleton" },
    include: workspaceSettingsInclude,
  });

  if (settings) {
    return settings;
  }

  return db.workspaceSettings.create({
    data: {
      id: "singleton",
    },
    include: workspaceSettingsInclude,
  });
}

export async function updateWorkspaceSettingsRecord(data: {
  defaultLanguage: string;
  defaultFeel: string;
  defaultStyle: string;
  defaultAutoPublishIntervalMinutes: number | null;
  defaultFacebookAccountId: string | null;
  defaultLinkedInAccountId: string | null;
  defaultXAccountId: string | null;
}) {
  return db.workspaceSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: {
      id: "singleton",
      ...data,
    },
    include: workspaceSettingsInclude,
  });
}
