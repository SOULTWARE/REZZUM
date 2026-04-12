export type ReviewEditorActionId =
  | "regenerate"
  | "saveDraft"
  | "approve"
  | "reject"
  | "schedule"
  | "publishNow";

export type ReviewEditorAction = {
  id: ReviewEditorActionId;
  label: string;
  placement: "toolbar" | "footer";
  tone: "secondary" | "ghost" | "success" | "danger" | "primary";
  disabled: boolean;
};

const ACTIONS_NOT_CONNECTED = true;

export function getReviewEditorActions(): ReviewEditorAction[] {
  return [
    {
      id: "regenerate",
      label: "Regenerate",
      placement: "toolbar",
      tone: "secondary",
      disabled: ACTIONS_NOT_CONNECTED,
    },
    {
      id: "saveDraft",
      label: "Save Draft",
      placement: "toolbar",
      tone: "ghost",
      disabled: ACTIONS_NOT_CONNECTED,
    },
    {
      id: "reject",
      label: "Reject",
      placement: "footer",
      tone: "danger",
      disabled: ACTIONS_NOT_CONNECTED,
    },
    {
      id: "approve",
      label: "Approve",
      placement: "footer",
      tone: "success",
      disabled: ACTIONS_NOT_CONNECTED,
    },
    {
      id: "schedule",
      label: "Schedule",
      placement: "footer",
      tone: "secondary",
      disabled: ACTIONS_NOT_CONNECTED,
    },
    {
      id: "publishNow",
      label: "Publish Now",
      placement: "footer",
      tone: "primary",
      disabled: ACTIONS_NOT_CONNECTED,
    },
  ];
}
