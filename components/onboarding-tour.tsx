"use client";

import { Joyride, EVENTS, STATUS, type EventData, type Step } from "react-joyride";

type WalkthroughScope = "full" | "page";

const shellWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="sidebar-brand"]',
    title: "Start with REZZUM",
    content:
      "This sidebar is your main control surface. Use it to move between content sources, drafts, publishing, accounts, and support.",
    placement: "right",
  },
  {
    target: '[data-onboarding="nav-dashboard"]',
    title: "Dashboard",
    content:
      "Dashboard gives you the current health of your RSS-to-social pipeline: syncs, drafts, schedules, and connected accounts.",
    placement: "right",
  },
  {
    target: '[data-onboarding="nav-feeds"]',
    title: "Feeds",
    content:
      "Feeds is where you add RSS sources, tune filters, and define how incoming articles should become social drafts.",
    placement: "right",
  },
  {
    target: '[data-onboarding="nav-queue"]',
    title: "Queue",
    content:
      "Queue is the review workspace. Check generated posts, edit platform variants, then approve or reject them before publishing.",
    placement: "right",
  },
  {
    target: '[data-onboarding="nav-schedule"]',
    title: "Schedule",
    content:
      "Schedule shows posts that are waiting to publish, already delivered, or failed and need follow-up.",
    placement: "right",
  },
  {
    target: '[data-onboarding="nav-accounts"]',
    title: "Accounts",
    content:
      "Accounts connects the social destinations REZZUM can publish to, including Facebook, LinkedIn, and X when your plan allows it.",
    placement: "right",
  },
  {
    target: '[data-onboarding="app-header"]',
    title: "Page context",
    content:
      "The header changes with each section and keeps the most relevant page actions within reach.",
    placement: "bottom-start",
  },
  {
    target: '[data-onboarding="app-main"]',
    title: "Workspace",
    content:
      "The main workspace contains the forms, tables, editors, and status panels for the section you opened.",
    placement: "top",
  },
  {
    target: '[data-onboarding="nav-support"]',
    title: "Support",
    content:
      "Support contains the product guide and common workflow answers when you need more detail.",
    placement: "right",
  },
  {
    target: '[data-onboarding="walkthrough-button"]',
    title: "Replay anytime",
    content:
      "Use this button to restart the walkthrough later. New users see it automatically once in this browser.",
    placement: "right",
  },
  {
    target: '[data-onboarding="account-menu"]',
    title: "Account menu",
    content:
      "Open your account menu for settings and sign out. Settings also holds workspace defaults and billing controls.",
    placement: "right",
  },
];

const dashboardWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="dashboard-summary"]',
    title: "Dashboard metrics",
    content:
      "These cards summarize feed syncs, draft volume, live sources, scheduled posts, and connected account coverage.",
    placement: "bottom",
  },
  {
    target: '[data-onboarding="dashboard-activity"]',
    title: "Recent activity",
    content:
      "Use this table to jump back into recent drafts, source articles, and the latest status changes across the pipeline.",
    placement: "top",
  },
  {
    target: '[data-onboarding="dashboard-sources"]',
    title: "Source coverage",
    content:
      "This section keeps the newest feed health and polling cadence visible without opening the full feed library.",
    placement: "top",
  },
  {
    target: '[data-onboarding="dashboard-notes"]',
    title: "Operating notes",
    content:
      "These notes highlight account coverage, publishing counts, and the next feed sync that may need attention.",
    placement: "left",
  },
];

const feedsWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="feeds-summary"]',
    title: "Feed health",
    content:
      "The summary cards show how many sources are configured, how many are active, and when the next sync is expected.",
    placement: "bottom",
  },
  {
    target: '[data-onboarding="feeds-library"]',
    title: "Feed library",
    content:
      "Each feed card exposes source details, sync controls, filtering rules, publishing destinations, and delivery mode.",
    placement: "top",
  },
];

const feedFormWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="feed-form-connection"]',
    title: "Connect the source",
    content:
      "Start with a readable feed name and the RSS URL REZZUM should poll for incoming articles.",
    placement: "right",
  },
  {
    target: '[data-onboarding="feed-form-personalization"]',
    title: "Shape the draft voice",
    content:
      "Language, feel, and style notes guide how generated posts should sound for this feed.",
    placement: "right",
  },
  {
    target: '[data-onboarding="feed-form-filtering"]',
    title: "Filter signal",
    content:
      "Include and exclude keywords keep low-value articles out of the generation pipeline before drafts are created.",
    placement: "right",
  },
  {
    target: '[data-onboarding="feed-form-publishing"]',
    title: "Choose destinations",
    content:
      "Pick which platforms this feed can generate for and whether the feed should stay manual or auto-publish.",
    placement: "left",
  },
  {
    target: '[data-onboarding="feed-form-preview"]',
    title: "Preview configuration",
    content:
      "The preview summarizes the current feed configuration before you save it.",
    placement: "left",
  },
];

const queueWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="queue-summary"]',
    title: "Queue state",
    content:
      "These cards show the draft volume in view, the platform and feed scope, and the most common draft statuses.",
    placement: "bottom",
  },
  {
    target: '[data-onboarding="queue-filters"]',
    title: "Queue filters",
    content:
      "Filter drafts by platform, status, or source feed when the review queue gets busy.",
    placement: "top",
  },
  {
    target: '[data-onboarding="queue-list"]',
    title: "Draft cards",
    content:
      "Draft cards pair source context with generated copy, status, platform, and a shortcut into the editor.",
    placement: "top",
  },
];

const draftEditorWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="draft-editor"]',
    title: "Draft editor",
    content:
      "This workspace is where generated copy becomes approved, scheduled, published, rejected, or regenerated.",
    placement: "top",
  },
  {
    target: '[data-onboarding="draft-platform-tabs"]',
    title: "Platform variants",
    content:
      "Switch between generated platform variants for the same source article when more than one destination exists.",
    placement: "bottom",
  },
  {
    target: '[data-onboarding="draft-destination"]',
    title: "Destination and schedule",
    content:
      "Choose the publishing account and optional scheduled time before approving or publishing the draft.",
    placement: "top",
  },
  {
    target: '[data-onboarding="draft-copy"]',
    title: "Editable copy",
    content:
      "Edit the generated text directly and watch the character limit before saving or approving.",
    placement: "top",
  },
  {
    target: '[data-onboarding="draft-actions"]',
    title: "Review actions",
    content:
      "Use these controls to reject, approve, schedule, publish immediately, save edits, or regenerate the draft.",
    placement: "top",
  },
];

const scheduleWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="schedule-summary"]',
    title: "Timeline overview",
    content:
      "The summary cards show upcoming publishing slots, delivered posts, failed sends, and timeline status counts.",
    placement: "bottom",
  },
  {
    target: '[data-onboarding="schedule-list"]',
    title: "Publishing timeline",
    content:
      "Timeline items keep scheduled, published, failed, approved, and draft posts visible in one place.",
    placement: "top",
  },
  {
    target: '[data-onboarding="schedule-followup"]',
    title: "Follow-up panel",
    content:
      "Failed sends and publish-state notes help you recover issues without losing pipeline context.",
    placement: "left",
  },
];

const accountsWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="accounts-platforms"]',
    title: "Connected platforms",
    content:
      "Connect or review the social accounts REZZUM can publish to. These cards show each platform destination state.",
    placement: "top",
  },
  {
    target: '[data-onboarding="accounts-coverage"]',
    title: "Connection coverage",
    content:
      "Coverage indicators show how complete your publishing setup is across the available platforms.",
    placement: "top",
  },
];

const settingsWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="settings-account"]',
    title: "Account settings",
    content:
      "Manage profile, email verification, and password controls for the signed-in account.",
    placement: "right",
  },
  {
    target: '[data-onboarding="settings-workspace"]',
    title: "Workspace defaults",
    content:
      "Defaults fill new feeds automatically and act as fallbacks when a feed does not override them.",
    placement: "right",
  },
  {
    target: '[data-onboarding="settings-billing"]',
    title: "Billing",
    content:
      "Billing shows the current plan, platform access, post limits, and subscription management actions.",
    placement: "left",
  },
  {
    target: '[data-onboarding="settings-automation"]',
    title: "Automation",
    content:
      "Cron notes document the endpoints and worker process responsible for feed polling and due publishes.",
    placement: "left",
  },
];

const supportWalkthroughSteps: Step[] = [
  {
    target: '[data-onboarding="support-hero"]',
    title: "Support center",
    content:
      "Support is the in-app reference for setup, workflow guidance, platform behavior, and troubleshooting.",
    placement: "bottom",
  },
  {
    target: '[data-onboarding="support-nav"]',
    title: "Guide navigation",
    content:
      "Use this index to jump to setup steps, workflow explanations, page guides, and common questions.",
    placement: "right",
  },
  {
    target: '[data-onboarding="support-content"]',
    title: "Workflow guide",
    content:
      "The guide explains how sources, accounts, generated drafts, review, scheduling, and publishing fit together.",
    placement: "top",
  },
];

function getPageWalkthroughSteps(pathname: string | null | undefined): Step[] {
  if (!pathname) {
    return [];
  }

  if (pathname === "/dashboard") {
    return dashboardWalkthroughSteps;
  }

  if (pathname === "/feeds") {
    return feedsWalkthroughSteps;
  }

  if (pathname === "/feeds/new" || (pathname.startsWith("/feeds/") && pathname.endsWith("/edit"))) {
    return feedFormWalkthroughSteps;
  }

  if (pathname === "/queue") {
    return queueWalkthroughSteps;
  }

  if (pathname.startsWith("/queue/")) {
    return draftEditorWalkthroughSteps;
  }

  if (pathname === "/schedule") {
    return scheduleWalkthroughSteps;
  }

  if (pathname === "/accounts") {
    return accountsWalkthroughSteps;
  }

  if (pathname === "/settings") {
    return settingsWalkthroughSteps;
  }

  if (pathname === "/support") {
    return supportWalkthroughSteps;
  }

  return [];
}

export function hasPageWalkthrough(pathname: string | null | undefined) {
  return getPageWalkthroughSteps(pathname).length > 0;
}

function getWalkthroughSteps(pathname: string | null | undefined, scope: WalkthroughScope) {
  const pageSteps = getPageWalkthroughSteps(pathname);

  if (scope === "page") {
    return pageSteps;
  }

  return [...shellWalkthroughSteps, ...pageSteps];
}

type OnboardingTourProps = {
  onFinish: () => void;
  pathname: string;
  run: boolean;
  scope: WalkthroughScope;
  tourKey: number;
};

export function OnboardingTour({
  onFinish,
  pathname,
  run,
  scope,
  tourKey,
}: Readonly<OnboardingTourProps>) {
  const steps = getWalkthroughSteps(pathname, scope);

  function handleEvent(data: EventData) {
    if (
      data.type === EVENTS.TOUR_END ||
      data.status === STATUS.FINISHED ||
      data.status === STATUS.SKIPPED
    ) {
      onFinish();
    }
  }

  return (
    <Joyride
      key={tourKey}
      continuous
      run={run && steps.length > 0}
      scrollToFirstStep
      onEvent={handleEvent}
      steps={steps}
      locale={{
        back: "Back",
        close: "Close",
        last: "Done",
        next: "Next",
        nextWithProgress: "Next ({current}/{total})",
        skip: "Skip",
      }}
      options={{
        buttons: ["back", "skip", "primary"],
        closeButtonAction: "skip",
        dismissKeyAction: false,
        overlayClickAction: false,
        overlayColor: "rgb(15 23 42 / 0.48)",
        primaryColor: "#0053da",
        scrollOffset: 96,
        showProgress: true,
        skipBeacon: true,
        spotlightPadding: 8,
        spotlightRadius: 10,
        targetWaitTimeout: 2000,
        textColor: "#2a3439",
        width: 390,
        zIndex: 1000,
      }}
      styles={{
        buttonBack: {
          color: "#566166",
          fontSize: 13,
          fontWeight: 700,
        },
        buttonPrimary: {
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          padding: "9px 14px",
        },
        buttonSkip: {
          color: "#566166",
          fontSize: 13,
          fontWeight: 700,
        },
        tooltip: {
          borderRadius: 16,
          boxShadow: "0 24px 80px rgb(15 23 42 / 0.22)",
        },
        tooltipContent: {
          color: "#566166",
          fontSize: 14,
          lineHeight: 1.6,
          padding: "8px 0 4px",
        },
        tooltipTitle: {
          color: "#0f172a",
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.25,
        },
      }}
    />
  );
}
