"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AssetIcon } from "./AssetIcon";

/**
 * The navigation defined by the home specification, shared by every page:
 * one grouped pill holding Home, Calendar and Messages, plus an independent
 * settings circle. No dividers between items, and the settings bubble is
 * never labelled.
 *
 * Geometry is the spec's, expressed against the 850px reference grid:
 * group 40,1574,591x139 r70 · settings 665,1576,129x129 · icon centres at
 * x 139 / 337 / 530.
 */
const SURFACE = "#FBF9F7";
const SHADOW = "0 12px 32px rgba(80,65,50,0.06)";
const u = (n: number) => `calc(${n} * var(--u))`;

const ITEMS = [
  { id: "home", label: "Home", href: "/today", cx: 139, icon: "home" as const, match: (p: string) => p === "/today" || p === "/" },
  { id: "calendar", label: "Calendar", href: "/calendar", cx: 337, icon: "calendar" as const, match: (p: string) => p.startsWith("/calendar") },
  { id: "messages", label: "Messages", href: "/anunturi", cx: 530, icon: "messages" as const, match: (p: string) => p.startsWith("/anunturi") || p.startsWith("/event") },
];

export function HomeNav({ absolute = false }: { absolute?: boolean }) {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: absolute ? "absolute" : "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        [absolute ? "top" : "bottom"]: absolute
          ? u(1574)
          : `calc(env(safe-area-inset-bottom, 0px) + ${u(70)})`,
        width: u(850),
        height: u(139),
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <nav
        aria-label="Primary"
        style={{
          position: "absolute",
          left: u(40),
          top: 0,
          width: u(591),
          height: u(139),
          borderRadius: u(70),
          background: SURFACE,
          boxShadow: SHADOW,
          pointerEvents: "auto",
        }}
      >
        {ITEMS.map(({ id, label, href, cx, icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={id}
              href={href}
              aria-current={active ? "page" : undefined}
              className="home-press"
              style={{
                position: "absolute",
                left: `calc(${cx - 40} * var(--u) - ${u(56)})`,
                top: u(26),
                width: u(112),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <AssetIcon name={icon} size={u(56)} color={active ? "#4D4D4D" : "#8F8F8F"} />
              <span
                style={{
                  marginTop: u(8),
                  fontSize: u(21.5),
                  fontWeight: 500,
                  color: active ? "#2C2C2C" : "#8F8F8F",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Independent settings bubble — icon only, never labelled. */}
      <Link
        href="/menu/settings"
        aria-label="Settings"
        className="home-press"
        style={{
          position: "absolute",
          left: u(665),
          top: u(2),
          width: u(129),
          height: u(129),
          borderRadius: "50%",
          background: SURFACE,
          boxShadow: SHADOW,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
        }}
      >
        <AssetIcon name="settings" size={u(56)} color="#8F8F8F" />
      </Link>
    </div>
  );
}
