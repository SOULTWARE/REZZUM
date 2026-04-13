"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/actions";
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

function revalidateFeedPaths(feedId?: string) {
  revalidatePath("/feeds");
  revalidatePath("/dashboard");
  revalidatePath("/queue");
  revalidatePath("/schedule");

  if (feedId) {
    revalidatePath(`/feeds/${feedId}/edit`);
  }
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
  try {
    const result = await syncFeedNow(feedId);

    if (result.articleIssues.length > 0) {
      const firstIssue = result.articleIssues[0];

      revalidateFeedPaths(feedId);

      return {
        status: "warning",
        message: `Feed synced with ${result.articleIssues.length} article issue${
          result.articleIssues.length === 1 ? "" : "s"
        }.`,
        detail: `${firstIssue.articleTitle}: ${firstIssue.message}`,
        refresh: true,
      } satisfies ActionResult;
    }

    revalidateFeedPaths(feedId);

    return {
      status: "success",
      message: `Feed sync completed. ${result.generatedPostCount} draft${
        result.generatedPostCount === 1 ? "" : "s"
      } updated.`,
      detail: `${result.fetchedItemCount} article${
        result.fetchedItemCount === 1 ? "" : "s"
      } checked during this sync.`,
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateFeedPaths(feedId);

    return {
      status: "error",
      message: "Feed sync failed.",
      detail: error instanceof Error ? error.message : "Unknown feed sync failure.",
      refresh: true,
    } satisfies ActionResult;
  }
}

export async function pauseFeedAction(feedId: string) {
  try {
    await pauseManagedFeed(feedId);
    revalidateFeedPaths(feedId);

    return {
      status: "success",
      message: "Feed paused.",
      detail: "Automatic polling has been stopped for this source.",
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateFeedPaths(feedId);

    return {
      status: "error",
      message: "Feed pause failed.",
      detail: error instanceof Error ? error.message : "Unknown feed pause failure.",
      refresh: true,
    } satisfies ActionResult;
  }
}

export async function activateFeedAction(feedId: string) {
  try {
    await activateManagedFeed(feedId);
    revalidateFeedPaths(feedId);

    return {
      status: "success",
      message: "Feed activated.",
      detail: "Polling is back on and the next sync window has been queued.",
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateFeedPaths(feedId);

    return {
      status: "error",
      message: "Feed activation failed.",
      detail: error instanceof Error ? error.message : "Unknown feed activation failure.",
      refresh: true,
    } satisfies ActionResult;
  }
}

export async function deleteFeedAction(feedId: string) {
  try {
    await deleteManagedFeed(feedId);
    revalidateFeedPaths();

    return {
      status: "success",
      message: "Feed deleted.",
      detail: "The feed and its related workflow records were removed.",
      refresh: true,
    } satisfies ActionResult;
  } catch (error) {
    revalidateFeedPaths(feedId);

    return {
      status: "error",
      message: "Feed deletion failed.",
      detail: error instanceof Error ? error.message : "Unknown feed deletion failure.",
      refresh: true,
    } satisfies ActionResult;
  }
}
