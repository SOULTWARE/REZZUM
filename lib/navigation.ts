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
    description: "Feeds, queue, schedule, and accounts at a glance.",
    icon: DashboardIcon,
  },
  {
    href: "/feeds",
    label: "Feeds",
    description: "Manage RSS sources and the rules that shape incoming content.",
    icon: FeedsIcon,
  },
  {
    href: "/queue",
    label: "Queue",
    description: "Review drafts, compare variants, and make edits before publishing.",
    icon: QueueIcon,
  },
  {
    href: "/schedule",
    label: "Schedule",
    description: "Track scheduled, published, and failed posts.",
    icon: ScheduleIcon,
  },
  {
    href: "/accounts",
    label: "Accounts",
    description: "Manage the social accounts REZZUM publishes to.",
    icon: AccountsIcon,
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    href: "/settings",
    label: "Settings",
    description: "Manage workspace defaults and publishing preferences.",
    icon: SettingsIcon,
  },
];

const navigation = [...primaryNavigation, ...secondaryNavigation];

export function getNavigationItem(pathname: string) {
  return (
    navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    primaryNavigation[0]
  );
}
