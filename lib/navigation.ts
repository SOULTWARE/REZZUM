import {
  AccountsIcon,
  DashboardIcon,
  FeedsIcon,
  QueueIcon,
  ScheduleIcon,
  SettingsIcon,
} from "@/components/icons";

export type NavigationItem = {
  href: string;
  label: string;
  description: string;
  icon: typeof DashboardIcon;
};

export const primaryNavigation: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "A high-level view of the RSS-to-social workflow and current workspace state.",
    icon: DashboardIcon,
  },
  {
    href: "/feeds",
    label: "Feeds",
    description: "Manage RSS sources and the filtering rules that decide what enters the pipeline.",
    icon: FeedsIcon,
  },
  {
    href: "/queue",
    label: "Queue",
    description: "Review generated drafts before they move into scheduling or immediate publishing.",
    icon: QueueIcon,
  },
  {
    href: "/schedule",
    label: "Schedule",
    description: "Track upcoming publishing windows, delivery states, and operational history.",
    icon: ScheduleIcon,
  },
  {
    href: "/accounts",
    label: "Accounts",
    description: "Connect and monitor the social destinations REZZUM can publish to.",
    icon: AccountsIcon,
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    href: "/settings",
    label: "Settings",
    description: "Control workspace defaults, generation preferences, and future publishing safeguards.",
    icon: SettingsIcon,
  },
];

const navigation = [...primaryNavigation, ...secondaryNavigation];

export function getNavigationItem(pathname: string) {
  return navigation.find((item) => item.href === pathname) ?? primaryNavigation[0];
}
