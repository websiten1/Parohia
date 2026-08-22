type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

/* ---------- Bottom nav ---------- */

type NavIconProps = IconProps & { active?: boolean };

export function NavHomeIcon({ className, active }: NavIconProps) {
  if (active) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6.5a2 2 0 0 0-2-2 2 2 0 0 0-2 2V21H5a1 1 0 0 1-1-1Z" />
      </svg>
    );
  }
  return (
    <svg {...base} className={className}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5.5a2 2 0 0 1 2-2 2 2 0 0 1 2 2V20h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function NavCalendarIcon({ className, active }: NavIconProps) {
  return (
    <svg {...base} fill={active ? "currentColor" : "none"} className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke={active ? "var(--color-surface)" : "currentColor"} />
      <line x1="8" y1="3.5" x2="8" y2="6.5" />
      <line x1="16" y1="3.5" x2="16" y2="6.5" />
      {active && <circle cx="12" cy="14.5" r="1.4" fill="var(--color-surface)" stroke="none" />}
    </svg>
  );
}

export function NavReadingsIcon({ className, active }: NavIconProps) {
  return (
    <svg {...base} fill={active ? "currentColor" : "none"} className={className}>
      <path d="M12 6.5c-1.5-1.2-3.6-1.7-5.5-1.5-1 .1-1.5.6-1.5 1.5v11c0 .9.5 1.4 1.5 1.5 1.9.2 4 .7 5.5 1.9 1.5-1.2 3.6-1.7 5.5-1.9 1-.1 1.5-.6 1.5-1.5v-11c0-.9-.5-1.4-1.5-1.5-1.9-.2-4 .3-5.5 1.5Z" />
      <line x1="12" y1="6.5" x2="12" y2="19.4" stroke={active ? "var(--color-surface)" : "currentColor"} />
    </svg>
  );
}

/** Rounded-frame media icon: used for the Resources tab. */
export function NavResourceIcon({ className, active }: NavIconProps) {
  return (
    <svg {...base} fill={active ? "currentColor" : "none"} className={className}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8.3" cy="9.3" r="1.3" fill={active ? "var(--color-surface)" : "currentColor"} stroke="none" />
      <path
        d="m4 16.5 4.8-4.8a1.5 1.5 0 0 1 2.1 0L14 14.8l1.6-1.6a1.5 1.5 0 0 1 2.1 0L20 15.5"
        stroke={active ? "var(--color-surface)" : "currentColor"}
      />
    </svg>
  );
}

/** Folded newspaper glyph: used for the News tab. */
export function NavNewsIcon({ className, active }: NavIconProps) {
  return (
    <svg {...base} fill={active ? "currentColor" : "none"} className={className}>
      <rect x="3.5" y="5.5" width="14" height="14" rx="1.5" />
      <path d="M17.5 8.5H19a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H7" />
      <line x1="6.5" y1="9" x2="11.5" y2="9" stroke={active ? "var(--color-surface)" : "currentColor"} />
      <line x1="6.5" y1="12" x2="14.5" y2="12" stroke={active ? "var(--color-surface)" : "currentColor"} />
      <line x1="6.5" y1="15" x2="14.5" y2="15" stroke={active ? "var(--color-surface)" : "currentColor"} />
    </svg>
  );
}

/** Classical column / archive glyph: used for the History tab. */
export function NavHistoryIcon({ className, active }: NavIconProps) {
  return (
    <svg {...base} fill={active ? "currentColor" : "none"} className={className}>
      <path d="M4 8.5 12 4l8 4.5" />
      <line x1="5" y1="9.5" x2="19" y2="9.5" stroke={active ? "var(--color-surface)" : "currentColor"} />
      <line x1="6.5" y1="11" x2="6.5" y2="17.5" />
      <line x1="10.5" y1="11" x2="10.5" y2="17.5" />
      <line x1="13.5" y1="11" x2="13.5" y2="17.5" />
      <line x1="17.5" y1="11" x2="17.5" y2="17.5" />
      <line x1="4.5" y1="19.5" x2="19.5" y2="19.5" />
    </svg>
  );
}

export function NavPersonIcon({ className, active }: NavIconProps) {
  return (
    <svg {...base} fill={active ? "currentColor" : "none"} className={className}>
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M5 20c0-3.6 3.1-6.3 7-6.3s7 2.7 7 6.3" />
    </svg>
  );
}

/* ---------- Chrome / structural ---------- */

export function BackIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 10a6 6 0 0 1 12 0v3.6c0 .5.18 1 .5 1.4l.8.9a1 1 0 0 1-.75 1.6H5.45a1 1 0 0 1-.75-1.6l.8-.9c.32-.4.5-.9.5-1.4Z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <line x1="8.2" y1="10.8" x2="15.8" y2="7.2" />
      <line x1="8.2" y1="13.2" x2="15.8" y2="16.8" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="20" y1="20" x2="15.3" y2="15.3" />
    </svg>
  );
}

export function BookmarkIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} className={className}>
      <path d="M6.5 4.5h11a1 1 0 0 1 1 1V20l-6.5-3.6L5.5 20V5.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function NoteIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3.5h9l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M14.5 3.5V8h4.5" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
      <line x1="8.5" y1="15.5" x2="13.5" y2="15.5" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.75v2.1M12 18.15v2.1M20.25 12h-2.1M5.85 12h-2.1M17.66 6.34l-1.49 1.49M7.83 16.17l-1.49 1.49M17.66 17.66l-1.49-1.49M7.83 7.83 6.34 6.34" />
    </svg>
  );
}

export function PersonIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M5 20c0-3.6 3.1-6.3 7-6.3s7 2.7 7 6.3" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8.5 6.2c0-1 1.1-1.6 1.9-1.1l9 5.8a1.3 1.3 0 0 1 0 2.2l-9 5.8c-.8.5-1.9-.1-1.9-1.1Z" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
    </svg>
  );
}

export function Replay15Icon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.8 6.2c0-.9-1-1.4-1.7-1L4.8 8.6a1.1 1.1 0 0 0 0 1.9l5.3 3.4c.7.4 1.7-.1 1.7-1Z" />
      <path d="M20.8 6.2c0-.9-1-1.4-1.7-1l-5.3 3.4a1.1 1.1 0 0 0 0 1.9l5.3 3.4c.7.4 1.7-.1 1.7-1Z" />
    </svg>
  );
}

export function Forward15Icon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.2 6.2c0-.9 1-1.4 1.7-1l5.3 3.4a1.1 1.1 0 0 1 0 1.9l-5.3 3.4c-.7.4-1.7-.1-1.7-1Z" />
      <path d="M3.2 6.2c0-.9 1-1.4 1.7-1l5.3 3.4a1.1 1.1 0 0 1 0 1.9l-5.3 3.4c-.7.4-1.7-.1-1.7-1Z" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}

export function LocationCrosshairIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2.5" x2="12" y2="5.5" />
      <line x1="12" y1="18.5" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5.5" y2="12" />
      <line x1="18.5" y1="12" x2="21.5" y2="12" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.5 3.5h2l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v2a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.5 5.6a2 2 0 0 1 2-2.1Z" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8.5" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
    </svg>
  );
}

export function DirectionsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12 20 4l-4 16-4-7-8-1Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5v11.5M8 11l4 4 4-4" />
      <path d="M4.5 17v2A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5v-2" />
    </svg>
  );
}

