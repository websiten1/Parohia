"use client";

import { useBookmarks } from "@/lib/storage";
import type { Bookmark } from "@/lib/types";
import { BookmarkIcon } from "./icons";

interface Props {
  entityType: Bookmark["entityType"];
  entityId: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/** Toggles saved state with an icon fill transition; no confirmation modal. */
export function BookmarkButton({ entityType, entityId, title, subtitle, className }: Props) {
  const { toggle, isBookmarked } = useBookmarks();
  const saved = isBookmarked(entityType, entityId);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove bookmark" : "Add bookmark"}
      aria-pressed={saved}
      onClick={() => toggle({ entityType, entityId, title, subtitle })}
      className={className ?? "press flex h-[36px] w-[36px] items-center justify-center rounded-sm"}
    >
      <BookmarkIcon
        filled={saved}
        className={`h-[20px] w-[20px] transition-colors duration-150 ${saved ? "text-burgundy" : "text-text"}`}
      />
    </button>
  );
}
