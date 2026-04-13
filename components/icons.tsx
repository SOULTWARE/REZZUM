import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: Readonly<IconProps>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export function RezzumLogo(props: Readonly<IconProps>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <rect width="40" height="40" rx="14" fill="url(#rezzum-gradient)" />
      <path
        d="M12 13.5H23.2C25.851 13.5 28 15.649 28 18.3C28 20.951 25.851 23.1 23.2 23.1H17.7L12 28.5V13.5Z"
        fill="white"
        fillOpacity="0.96"
      />
      <path
        d="M18.2 11.5H27.1C28.7016 11.5 30 12.7984 30 14.4C30 16.0016 28.7016 17.3 27.1 17.3H18.2V11.5Z"
        fill="white"
        fillOpacity="0.22"
      />
      <defs>
        <linearGradient id="rezzum-gradient" x1="6" y1="4" x2="32" y2="36">
          <stop stopColor="#0053DA" />
          <stop offset="1" stopColor="#0048C1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DashboardIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="11" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="17.5" width="7" height="3" rx="1.5" />
    </BaseIcon>
  );
}

export function FeedsIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M5 18.5A1.5 1.5 0 1 0 5 21.5A1.5 1.5 0 1 0 5 18.5Z" />
      <path d="M4.5 11.5C8.642 11.5 12 14.858 12 19" />
      <path d="M4.5 4.5C12.508 4.5 19 10.992 19 19" />
    </BaseIcon>
  );
}

export function QueueIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M7 4.5H17L20 7.5V18.5C20 19.6046 19.1046 20.5 18 20.5H7C5.89543 20.5 5 19.6046 5 18.5V6.5C5 5.39543 5.89543 4.5 7 4.5Z" />
      <path d="M9 10.5H16" />
      <path d="M9 14.5H16" />
    </BaseIcon>
  );
}

export function ScheduleIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <rect x="4.5" y="5.5" width="15" height="15" rx="2" />
      <path d="M8 3.5V7.5" />
      <path d="M16 3.5V7.5" />
      <path d="M4.5 10.5H19.5" />
      <path d="M9.5 14.5L11 16L14.5 12.5" />
    </BaseIcon>
  );
}

export function AccountsIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M16.5 19.5V18.5C16.5 16.567 14.933 15 13 15H8C6.067 15 4.5 16.567 4.5 18.5V19.5" />
      <path d="M10.5 11.5C12.433 11.5 14 9.933 14 8C14 6.067 12.433 4.5 10.5 4.5C8.567 4.5 7 6.067 7 8C7 9.933 8.567 11.5 10.5 11.5Z" />
      <path d="M18 11.5C19.3807 11.5 20.5 10.3807 20.5 9C20.5 7.61929 19.3807 6.5 18 6.5" />
      <path d="M20.5 19.5V18.5C20.5 17.135 19.555 15.9917 18.285 15.692" />
    </BaseIcon>
  );
}

export function SettingsIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M19.25 12C19.25 11.62 19.22 11.25 19.15 10.89L21 9.45L19 6L16.78 6.74C16.23 6.29 15.61 5.94 14.93 5.72L14.45 3.5H9.55L9.07 5.72C8.39 5.94 7.77 6.29 7.22 6.74L5 6L3 9.45L4.85 10.89C4.78 11.25 4.75 11.62 4.75 12C4.75 12.38 4.78 12.75 4.85 13.11L3 14.55L5 18L7.22 17.26C7.77 17.71 8.39 18.06 9.07 18.28L9.55 20.5H14.45L14.93 18.28C15.61 18.06 16.23 17.71 16.78 17.26L19 18L21 14.55L19.15 13.11C19.22 12.75 19.25 12.38 19.25 12Z" />
    </BaseIcon>
  );
}

export function LinkedInIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M7.5 8.5A1.5 1.5 0 1 0 7.5 5.5A1.5 1.5 0 1 0 7.5 8.5Z" />
      <path d="M6 10.5V18.5" />
      <path d="M10.5 10.5V18.5" />
      <path d="M10.5 13C10.5 11.6193 11.6193 10.5 13 10.5C14.3807 10.5 15.5 11.6193 15.5 13V18.5" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    </BaseIcon>
  );
}

export function XIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M6 5.5L18 18.5" />
      <path d="M18 5.5L6 18.5" />
    </BaseIcon>
  );
}

export function FacebookIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M13.5 9H16V5.5H13.5C11.567 5.5 10 7.067 10 9V11H8V14.5H10V18.5H13.5V14.5H16L16.5 11H13.5V9Z" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    </BaseIcon>
  );
}

export function MenuIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M4 7.5H20" />
      <path d="M4 12H20" />
      <path d="M4 16.5H20" />
    </BaseIcon>
  );
}

export function MenuCloseIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </BaseIcon>
  );
}

export function SparkIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3.5L13.75 8.25L18.5 10L13.75 11.75L12 16.5L10.25 11.75L5.5 10L10.25 8.25L12 3.5Z" />
      <path d="M18.5 3.5L19.2 5.3L21 6L19.2 6.7L18.5 8.5L17.8 6.7L16 6L17.8 5.3L18.5 3.5Z" />
    </BaseIcon>
  );
}

export function ReviewIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 19.5L8 18.75L17.75 9C18.4404 8.30964 18.4404 7.19036 17.75 6.5V6.5C17.0596 5.80964 15.9404 5.80964 15.25 6.5L5.5 16.25L4.5 19.5Z" />
      <path d="M13.5 8.5L16.5 11.5" />
      <path d="M12 19.5H19.5" />
    </BaseIcon>
  );
}

export function PublishIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M20 4L11 13" />
      <path d="M20 4L14 20L11 13L4 10L20 4Z" />
    </BaseIcon>
  );
}

export function ArrowRightIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12H19" />
      <path d="M12.5 5.5L19 12L12.5 18.5" />
    </BaseIcon>
  );
}

export function PlusIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M12 5V19" />
      <path d="M5 12H19" />
    </BaseIcon>
  );
}

export function RefreshIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M20 6.5V11.5H15" />
      <path d="M4 17.5V12.5H9" />
      <path d="M6.2 9.5C7.5 6.6 10.7 4.8 13.9 5.2C16.1 5.4 18.1 6.6 19.3 8.4" />
      <path d="M17.8 14.5C16.5 17.4 13.3 19.2 10.1 18.8C7.9 18.6 5.9 17.4 4.7 15.6" />
    </BaseIcon>
  );
}

export function SaveIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M5.5 4.5H16.5L19.5 7.5V18.5C19.5 19.6046 18.6046 20.5 17.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V5.5C4.5 4.94772 4.94772 4.5 5.5 4.5Z" />
      <path d="M8 4.5V9.5H15.5" />
      <path d="M8 20V14.5H16" />
    </BaseIcon>
  );
}

export function ApproveIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12.5L9.5 17L19 7.5" />
    </BaseIcon>
  );
}

export function RejectIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </BaseIcon>
  );
}

export function CalendarIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <rect x="4.5" y="5.5" width="15" height="15" rx="2" />
      <path d="M8 3.5V7.5" />
      <path d="M16 3.5V7.5" />
      <path d="M4.5 10.5H19.5" />
      <path d="M12 13.5V17.5" />
      <path d="M10 15.5H14" />
    </BaseIcon>
  );
}

export function DisconnectIcon(props: Readonly<IconProps>) {
  return (
    <BaseIcon {...props}>
      <path d="M10.5 6.5H8C6.067 6.5 4.5 8.067 4.5 10V14C4.5 15.933 6.067 17.5 8 17.5H10.5" />
      <path d="M14.5 8L19 12L14.5 16" />
      <path d="M10.5 12H19" />
    </BaseIcon>
  );
}
