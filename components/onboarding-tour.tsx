"use client";

import { Joyride, EVENTS, STATUS, type EventData, type Step } from "react-joyride";

const walkthroughSteps: Step[] = [
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

type OnboardingTourProps = {
  onFinish: () => void;
  run: boolean;
  tourKey: number;
};

export function OnboardingTour({ onFinish, run, tourKey }: Readonly<OnboardingTourProps>) {
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
      run={run}
      scrollToFirstStep
      onEvent={handleEvent}
      steps={walkthroughSteps}
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
