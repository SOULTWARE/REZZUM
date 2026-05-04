import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getPublicRequestUrl } from "@/server/app-url";
import { disconnectAccount } from "@/server/accounts/service";
import { requireAuthSession } from "@/server/auth/session";

export async function POST(
  request: Request,
  {
    params,
  }: Readonly<{
    params: Promise<{ accountId: string }>;
  }>,
) {
  await requireAuthSession();

  const { accountId } = await params;

  try {
    await disconnectAccount(accountId);
  } catch {
    return NextResponse.redirect(getPublicRequestUrl("/accounts?disconnectError=1", request));
  }

  revalidatePath("/accounts");
  revalidatePath("/settings");
  revalidatePath("/feeds/new");

  return NextResponse.redirect(getPublicRequestUrl("/accounts?disconnected=1", request));
}
