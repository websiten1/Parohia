"use client";

import { CalendarClient } from "./CalendarClient";

export default function CalendarPage() {
  // No kicker above the month heading — the tab bar already says where you are,
  // and "August 2026" carries itself.
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1 px-outer pb-tabbar pt-[max(env(safe-area-inset-top),24px)]">
        <CalendarClient />
      </main>
    </div>
  );
}
