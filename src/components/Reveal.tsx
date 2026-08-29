"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Fades/rises a block in once it scrolls into view, instead of animating at
 * mount time (which is pointless for anything below the fold — the animation
 * would already be over by the time a user scrolls to it). Users who prefer
 * reduced motion see content immediately, with no scroll-triggered motion at all.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let cancelled = false;
      queueMicrotask(() => {
        if (!cancelled) setVisible(true);
      });
      return () => {
        cancelled = true;
      };
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={visible ? `anim-rise-fade-in ${className}` : `opacity-0 ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
