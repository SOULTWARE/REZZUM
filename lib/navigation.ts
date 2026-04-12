import {
  AccountsIcon,
  ArrowRightIcon,
  DashboardIcon,
  FeedsIcon,
  PlusIcon,
  QueueIcon,
  SaveIcon,
  ScheduleIcon,
  SettingsIcon,
} from "@/components/icons";

export type NavigationItem = {
  href: string;
  label: string;
  description: string;
  icon: typeof DashboardIcon;
};

export type ShellAction = {
  label: string;
  href?: string;
  formId?: string;
  icon?: typeof DashboardIcon;
  tone: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  mobileHidden?: boolean;
};

export type ShellPage = {
  section: NavigationItem;
  title: string;
  description: string;
  actions: ShellAction[];
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

export const navigation = [...primaryNavigation, ...secondaryNavigation];

export function getNavigationItem(pathname: string) {
  return (
    navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    primaryNavigation[0]
  );
}

export function getShellPage(pathname: string): ShellPage {
  if (pathname === "/dashboard") {
    return {
      section: primaryNavigation[0],
      title: "Content Dashboard",
      description: "Feeds, queue, schedule, and accounts at a glance.",
      actions: [
        {
          label: "Accounts",
          href: "/accounts",
          icon: AccountsIcon,
          tone: "secondary",
          mobileHidden: true,
        },
        {
          label: "Add Feed",
          href: "/feeds/new",
          icon: PlusIcon,
          tone: "primary",
        },
      ],
    };
  }

  if (pathname === "/feeds") {
    return {
      section: primaryNavigation[1],
      title: "Feed Library",
      description: "Manage RSS sources, filters, and refresh cadence.",
      actions: [
        {
          label: "Add Feed",
          href: "/feeds/new",
          icon: PlusIcon,
          tone: "primary",
        },
      ],
    };
  }

  if (pathname === "/feeds/new") {
    return {
      section: primaryNavigation[1],
      title: "Configure New Feed",
      description: "Add a source and define how incoming content is filtered.",
      actions: [
        {
          label: "Back to Feeds",
          href: "/feeds",
          icon: ArrowRightIcon,
          tone: "secondary",
          mobileHidden: true,
        },
        {
          label: "Save Feed",
          formId: "feed-form",
          icon: SaveIcon,
          tone: "primary",
        },
      ],
    };
  }

  if (pathname.startsWith("/feeds/") && pathname.endsWith("/edit")) {
    return {
      section: primaryNavigation[1],
      title: "Edit Feed",
      description: "Update the source, filters, and refresh cadence.",
      actions: [
        {
          label: "Back to Feeds",
          href: "/feeds",
          icon: ArrowRightIcon,
          tone: "secondary",
          mobileHidden: true,
        },
        {
          label: "Save Changes",
          formId: "feed-form",
          icon: SaveIcon,
          tone: "primary",
        },
      ],
    };
  }

  if (pathname === "/queue") {
    return {
      section: primaryNavigation[2],
      title: "Review Queue",
      description: "Compare platform variants, edit copy, and review drafts.",
      actions: [],
    };
  }

  if (pathname.startsWith("/queue/")) {
    return {
      section: primaryNavigation[2],
      title: "Review Draft",
      description: "Edit the draft, compare variants, and review post details.",
      actions: [
        {
          label: "Back to Queue",
          href: "/queue",
          icon: ArrowRightIcon,
          tone: "secondary",
        },
      ],
    };
  }

  if (pathname === "/schedule") {
    return {
      section: primaryNavigation[3],
      title: "Publishing Schedule",
      description: "Track scheduled, published, and failed posts.",
      actions: [
        {
          label: "Open Queue",
          href: "/queue",
          icon: QueueIcon,
          tone: "secondary",
        },
      ],
    };
  }

  if (pathname === "/accounts") {
    return {
      section: primaryNavigation[4],
      title: "Connected Accounts",
      description: "Manage the publishing accounts available to REZZUM.",
      actions: [
        {
          label: "Connect New Account",
          icon: PlusIcon,
          tone: "primary",
          disabled: true,
        },
      ],
    };
  }

  if (pathname === "/settings") {
    return {
      section: secondaryNavigation[0],
      title: "Settings",
      description: "Manage workspace defaults and publishing preferences.",
      actions: [],
    };
  }

  const section = getNavigationItem(pathname);

  return {
    section,
    title: section.label,
    description: section.description,
    actions: [],
  };
}
