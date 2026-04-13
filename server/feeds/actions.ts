"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FeedActionState } from "@/lib/feeds/validation";
import { validateFeedFormData } from "@/lib/feeds/validation";
import {
  activateManagedFeed,
  createManagedFeed,
  deleteManagedFeed,
  FeedConflictError,
  pauseManagedFeed,
  updateManagedFeed,
} from "@/server/feeds/service";
import { reevaluateExistingArticlesForFeed, syncFeedNow } from "@/server/pipeline/service";

function buildConflictState(): FeedActionState {
  return {
    status: "error",
    message: "This RSS URL is already connected to your workspace.",
    fieldErrors: {
      rssUrl: ["Use a different RSS URL or edit the existing feed."],
    },
  };
}

function buildGenericErrorState(): FeedActionState {
  return {
    status: "error",
    message: "REZZUM could not save the feed right now. Try again.",
  };
}

export async function createFeedAction(
  _previousState: FeedActionState,
  formData: FormData,
) {
  const parsed = validateFeedFormData(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  try {
    await createManagedFeed(parsed.data);
  } catch (error) {
    if (error instanceof FeedConflictError) {
      return buildConflictState();
    }

    return buildGenericErrorState();
  }

  revalidatePath("/feeds");
  redirect("/feeds");
}

export async function updateFeedAction(
  feedId: string,
  _previousState: FeedActionState,
  formData: FormData,
) {
  const parsed = validateFeedFormData(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  try {
    await updateManagedFeed(feedId, parsed.data);
  } catch (error) {
    if (error instanceof FeedConflictError) {
      return buildConflictState();
    }

    return buildGenericErrorState();
  }

  await reevaluateExistingArticlesForFeed(feedId);

  revalidatePath("/feeds");
  revalidatePath(`/feeds/${feedId}/edit`);
  revalidatePath("/dashboard");
  revalidatePath("/queue");
  revalidatePath("/schedule");
  redirect("/feeds");
}

export async function syncFeedNowAction(feedId: string) {
  await syncFeedNow(feedId);

  revalidatePath("/feeds");
  revalidatePath("/dashboard");
  revalidatePath("/queue");
  revalidatePath("/schedule");
}

export async function pauseFeedAction(feedId: string) {
  await pauseManagedFeed(feedId);

  revalidatePath("/feeds");
  revalidatePath("/dashboard");
}

export async function activateFeedAction(feedId: string) {
  await activateManagedFeed(feedId);

  revalidatePath("/feeds");
  revalidatePath("/dashboard");
}

export async function deleteFeedAction(feedId: string) {
  await deleteManagedFeed(feedId);

  revalidatePath("/feeds");
  revalidatePath("/dashboard");
  revalidatePath("/queue");
  revalidatePath("/schedule");
}
