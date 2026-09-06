/**
 * Icons for the home screen, drawn to match the reference sheet.
 *
 * Category glyphs are white line-art sitting on the pastel circles;
 * navigation glyphs are solid gray. Size always comes from the caller so
 * everything scales with the 850px reference grid.
 */
type P = { className?: string; style?: React.CSSProperties };

const line = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

/* ---------- Upcoming Events categories (white line-art) ---------- */

export function YouthIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" {...line} className={className} style={style}>
      <circle cx="9" cy="9.2" r="2.9" />
      <path d="M3.6 18.4c0-2.7 2.4-4.6 5.4-4.6s5.4 1.9 5.4 4.6" />
      <path d="M16.1 7.1a2.5 2.5 0 0 1 0 4.9" />
      <path d="M17.2 13.9c2 .5 3.4 2 3.4 4.1" />
    </svg>
  );
}

export function LiturgyIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" {...line} className={className} style={style}>
      <path d="M7 4.2h10v2.3a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4.2Z" />
      <path d="M12 11.5v5.6" />
      <path d="M8.4 19.8h7.2" />
      <path d="M9.8 17.1h4.4l1.4 2.7H8.4l1.4-2.7Z" />
    </svg>
  );
}

export function StudyIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" {...line} className={className} style={style}>
      <path d="M12 6.6c-1.7-1.4-3.8-2-6.4-2v13.1c2.6 0 4.7.6 6.4 2 1.7-1.4 3.8-2 6.4-2V4.6c-2.6 0-4.7.6-6.4 2Z" />
      <path d="M12 6.6v13.1" />
    </svg>
  );
}

export function DiningIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" {...line} className={className} style={style}>
      <path d="M8.2 4v6.2a1.9 1.9 0 0 1-3.8 0V4" />
      <path d="M6.3 4v16" />
      <path d="M16.5 4c-1.6 0-2.6 1.7-2.6 4.1 0 1.9.9 3 2.6 3.2V20" />
    </svg>
  );
}

/* ---------- Search ---------- */

export function SearchGlyph({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" {...line} strokeWidth={1.9} className={className} style={style}>
      <circle cx="10.6" cy="10.6" r="6.4" />
      <path d="M15.4 15.4 20 20" />
    </svg>
  );
}

/** The small warm sparkle sitting on the magnifier in the reference. */
export function SearchSparkle({ className, style }: P) {
  return (
    <svg viewBox="0 0 12 12" className={className} style={style} aria-hidden="true">
      <path d="M6 0.6l1.1 3.3L10.4 5l-3.3 1.1L6 9.4 4.9 6.1 1.6 5l3.3-1.1L6 .6Z" fill="currentColor" />
    </svg>
  );
}

/* ---------- Header ---------- */

export function BellGlyph({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" {...line} strokeWidth={1.8} className={className} style={style}>
      <path d="M12 3.4a5.6 5.6 0 0 0-5.6 5.6c0 4.2-1.3 5.6-1.9 6.3-.2.3 0 .8.4.8h14.2c.4 0 .6-.5.4-.8-.6-.7-1.9-2.1-1.9-6.3A5.6 5.6 0 0 0 12 3.4Z" />
      <path d="M10.2 19.2a2 2 0 0 0 3.6 0" />
    </svg>
  );
}

/* ---------- Bottom navigation (solid gray) ---------- */

export function SunGlyph({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" fill="currentColor">
      <circle cx="12" cy="12" r="4.4" />
      <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M12 2.4v2.5M12 19.1v2.5M2.4 12h2.5M19.1 12h2.5" />
        <path d="M5.2 5.2 7 7M17 17l1.8 1.8M18.8 5.2 17 7M7 17l-1.8 1.8" />
      </g>
    </svg>
  );
}

export function CalendarGlyph({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" fill="currentColor">
      <path d="M5.6 4.6h12.8c1 0 1.8.8 1.8 1.8v12c0 1-.8 1.8-1.8 1.8H5.6c-1 0-1.8-.8-1.8-1.8v-12c0-1 .8-1.8 1.8-1.8Z" opacity=".28" />
      <path d="M3.8 8.9h16.4v1.9H3.8zM7.4 2.6h1.9v3.4H7.4zM14.7 2.6h1.9v3.4h-1.9z" />
      <path d="M6.6 12.6h2.2v2.2H6.6zM10.9 12.6h2.2v2.2h-2.2zM15.2 12.6h2.2v2.2h-2.2zM6.6 16.2h2.2v2.2H6.6zM10.9 16.2h2.2v2.2h-2.2z" />
    </svg>
  );
}

export function MessagesGlyph({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" fill="currentColor">
      <path d="M3 7.3c0-1.6 1.3-2.9 2.9-2.9h8.4c1.6 0 2.9 1.3 2.9 2.9v4.4c0 1.6-1.3 2.9-2.9 2.9H8.1L4.3 17.6c-.5.4-1.3 0-1.3-.6V7.3Z" />
      <path d="M18.6 8.6h.5c1.6 0 2.9 1.3 2.9 2.9v4c0 1.6-1.3 2.9-2.9 2.9h-.4l-2.7 2.1c-.5.4-1.2 0-1.2-.6v-1.5h-1.9c-1.1 0-2.1-.6-2.5-1.6h5.3c1.6 0 2.9-1.3 2.9-2.9V8.6Z" opacity=".55" />
    </svg>
  );
}

export function GearGlyph({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" fill="currentColor">
      <path d="M19.4 12c0-.5 0-1-.1-1.4l2-1.5-2-3.4-2.3.9c-.7-.6-1.5-1-2.4-1.3L14.3 3H9.7l-.3 2.3c-.9.3-1.7.7-2.4 1.3l-2.3-.9-2 3.4 2 1.5c-.1.4-.1.9-.1 1.4s0 1 .1 1.4l-2 1.5 2 3.4 2.3-.9c.7.6 1.5 1 2.4 1.3l.3 2.3h4.6l.3-2.3c.9-.3 1.7-.7 2.4-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.4Zm-7.4 3.4A3.4 3.4 0 1 1 12 8.6a3.4 3.4 0 0 1 0 6.8Z" />
    </svg>
  );
}
