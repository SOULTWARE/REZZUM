export type ActionResultStatus = "success" | "warning" | "error";

export type ActionResult = {
  status: ActionResultStatus;
  message: string;
  detail?: string;
  redirectTo?: string;
  refresh?: boolean;
};

export function isActionError(result: ActionResult) {
  return result.status === "error";
}
