"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FeedActionState } from "@/lib/feeds/validation";
import { validateFeedFormData } from "@/lib/feeds/validation";
import {
  createManagedFeed,
  FeedConflictError,
  updateManagedFeed,
} from "@/server/feeds/service";

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

  revalidatePath("/feeds");
  revalidatePath(`/feeds/${feedId}/edit`);
  redirect("/feeds");
}
