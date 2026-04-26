"use server";

import { revalidatePath } from "next/cache";
import { disconnectAccount } from "@/server/accounts/service";
import { requireAuthSession } from "@/server/auth/session";

export async function disconnectAccountAction(accountId: string) {
  await requireAuthSession();
  await disconnectAccount(accountId);

  revalidatePath("/accounts");
  revalidatePath("/settings");
  revalidatePath("/feeds/new");
}
