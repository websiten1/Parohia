/**
 * What colour the browser paints the status-bar strip with.
 *
 * In regular mobile Safari the page never renders under the status bar —
 * Safari draws that strip itself and fills it with `theme-color`. A single
 * static value therefore cannot work here: the same colour would have to suit
 * a dark full-bleed video on Today and a pale violet wash on Calendar. So the
 * value is updated per route to match the top of that page's gradient, which
 * is what makes the strip disappear into the page.
 *
 * Values are the first stop of each wash in globals.css — keep them in step.
 */
const WASH_TOP = {
  violet: { light: "#ddd3f2", dark: "#2b2540" },
  blue: { light: "#d0e2f7", dark: "#222d3e" },
  cyan: { light: "#cfe8e6", dark: "#1e3436" },
  peach: { light: "#fbe2c6", dark: "#3a2c1c" },
  green: { light: "#d7e9d2", dark: "#24331f" },
  rose: { light: "#f7d9e1", dark: "#3a2029" },
  coral: { light: "#fbdcd0", dark: "#3b241c" },
  reading: { light: "#f3ece1", dark: "#241f1b" },
  default: { light: "#d6e4f6", dark: "#232833" },
} as const;

type WashKey = keyof typeof WASH_TOP;

/** Today is a full-bleed dark video, so its strip is dark in either appearance. */
const TODAY_STRIP = "#141820";

const ROUTE_WASH: [string, WashKey][] = [
  ["/calendar", "violet"],
  ["/anunturi", "blue"],
  ["/notifications", "blue"],
  ["/parish-finder", "blue"],
  ["/program-liturgic", "cyan"],
  ["/readings", "cyan"],
  ["/reading", "reading"],
  ["/prayers", "violet"],
  ["/prayer", "reading"],
  ["/fasting", "green"],
  ["/resources", "peach"],
  ["/events", "peach"],
  ["/event", "peach"],
  ["/saint", "rose"],
  ["/menu", "rose"],
  ["/priest", "coral"],
  ["/login/priest", "coral"],
  ["/login", "violet"],
];

export function statusStripColor(pathname: string, isDark: boolean): string {
  if (pathname === "/" || pathname.startsWith("/today")) return TODAY_STRIP;
  const hit = ROUTE_WASH.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + "/"));
  const wash = WASH_TOP[hit?.[1] ?? "default"];
  return isDark ? wash.dark : wash.light;
}
