"use client";

import { useRouter } from "next/navigation";
import { PullToRefresh } from "@/components/PullToRefresh";

export function PullToRefreshToday({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <PullToRefresh
      onRefresh={async () => {
        await new Promise((r) => setTimeout(r, 500));
        router.refresh();
      }}
    >
      {children}
    </PullToRefresh>
  );
}
