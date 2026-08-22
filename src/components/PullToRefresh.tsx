"use client";

import { useRef, useState } from "react";
import { LoadingMark } from "./Feedback";

interface Props {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}

const THRESHOLD = 64;

/** Touch-driven pull-to-refresh: only engages when the page is already scrolled to top. */
export function PullToRefresh({ onRefresh, children }: Props) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    if (window.scrollY > 0 || refreshing) {
      startY.current = null;
      return;
    }
    startY.current = e.touches[0].clientY;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) setPull(Math.min(delta * 0.5, 90));
  }

  async function onTouchEnd() {
    if (pull > THRESHOLD) {
      setRefreshing(true);
      setPull(56);
      await onRefresh();
      setRefreshing(false);
    }
    setPull(0);
    startY.current = null;
  }

  return (
    <div className="flex flex-1 flex-col" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        className="flex items-center justify-center overflow-hidden transition-[height] duration-150"
        style={{ height: pull }}
        aria-hidden={pull === 0}
      >
        {pull > 8 && <LoadingMark className={`h-5 w-5 ${refreshing ? "" : "opacity-60"}`} />}
      </div>
      {children}
    </div>
  );
}
