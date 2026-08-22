"use client";

import { useDownloads } from "@/lib/storage";
import { DownloadIcon } from "./icons";

interface Props {
  entityType: "prayer" | "reading";
  entityId: string;
  title: string;
  className?: string;
}

/** Toggles offline download state; no real file transfer, just local state matching the spec's download UX. */
export function DownloadButton({ entityType, entityId, title, className }: Props) {
  const { isDownloaded, add, remove } = useDownloads();
  const downloaded = isDownloaded(entityType, entityId);

  return (
    <button
      type="button"
      aria-label={downloaded ? "Remove download" : "Download for offline use"}
      aria-pressed={downloaded}
      onClick={() =>
        downloaded ? remove(entityType, entityId) : add({ entityType, entityId, title, sizeLabel: "1.2 MB" })
      }
      className={className ?? "press flex h-[36px] w-[36px] items-center justify-center rounded-sm"}
    >
      <DownloadIcon className={`h-[19px] w-[19px] ${downloaded ? "text-burgundy" : "text-text"}`} />
    </button>
  );
}
