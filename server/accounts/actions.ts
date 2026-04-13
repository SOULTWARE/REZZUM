"use server";

import { revalidatePath } from "next/cache";
import { disconnectAccount } from "@/server/accounts/service";

export async function disconnectAccountAction(accountId: string) {
  await disconnectAccount(accountId);

  revalidatePath("/accounts");
  revalidatePath("/settings");
  revalidatePath("/feeds/new");
}
