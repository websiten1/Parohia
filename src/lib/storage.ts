"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Bookmark, NoteEntry } from "./types";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Every useLocalStorageState(key) call mounts its own independent useState,
// so writes from one component (e.g. the language toggle) wouldn't otherwise
// be seen by another mounted instance of the same key (e.g. LanguageProvider)
// until a remount re-read localStorage. This subscriber list broadcasts
// changes across all live instances of the same key within the tab.
const subscribers = new Map<string, Set<() => void>>();

function subscribe(key: string, cb: () => void) {
  if (!subscribers.has(key)) subscribers.set(key, new Set());
  subscribers.get(key)!.add(cb);
  return () => {
    subscribers.get(key)?.delete(cb);
  };
}

function notify(key: string) {
  subscribers.get(key)?.forEach((cb) => cb());
}

function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  // Tracks the serialized value this instance last wrote or read, so a
  // broadcast triggered by this instance's own write doesn't loop back into
  // another setValue call (readStorage returns a fresh object reference each
  // time even when the content is unchanged).
  const lastSerialized = useRef<string | null>(null);

  useEffect(() => {
    // Reading localStorage during SSR would throw and cause a hydration
    // mismatch, so state is intentionally hydrated from an effect here.
    const stored = readStorage(key, initial);
    lastSerialized.current = JSON.stringify(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(stored);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    const serialized = JSON.stringify(value);
    if (serialized === lastSerialized.current) return;
    lastSerialized.current = serialized;
    window.localStorage.setItem(key, serialized);
    notify(key);
  }, [key, value, hydrated]);

  useEffect(() => {
    return subscribe(key, () => {
      const stored = readStorage(key, initial);
      const serialized = JSON.stringify(stored);
      if (serialized === lastSerialized.current) return;
      lastSerialized.current = serialized;
      setValue(stored);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue, hydrated] as const;
}

export interface SettingsState {
  appearance: "light" | "system" | "dark";
  textSize: "standard" | "large" | "extra-large";
  calendarPreference: "new" | "old";
  notificationsFeastReminders: boolean;
  notificationsFastingReminders: boolean;
  notificationsSundayReminder: boolean;
  notificationsParishEvents: boolean;
  notificationsDiocesanAnnouncements: boolean;
  reducedMotion: boolean;
  reduceImagery: boolean;
  language: "en" | "ro";
}

const DEFAULT_SETTINGS: SettingsState = {
  appearance: "light",
  textSize: "standard",
  calendarPreference: "new",
  notificationsFeastReminders: true,
  notificationsFastingReminders: true,
  notificationsSundayReminder: true,
  notificationsParishEvents: false,
  notificationsDiocesanAnnouncements: true,
  reducedMotion: false,
  reduceImagery: false,
  language: "en",
};

export function useSettings() {
  const [settings, setSettings, hydrated] = useLocalStorageState<SettingsState>("parohia:settings", DEFAULT_SETTINGS);
  const update = useCallback(
    <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings]
  );
  return { settings, update, hydrated };
}

export function useBookmarks() {
  const [bookmarks, setBookmarks, hydrated] = useLocalStorageState<Bookmark[]>("parohia:bookmarks", []);

  const isBookmarked = useCallback(
    (entityType: Bookmark["entityType"], entityId: string) =>
      bookmarks.some((b) => b.entityType === entityType && b.entityId === entityId),
    [bookmarks]
  );

  const toggle = useCallback(
    (bookmark: Omit<Bookmark, "id" | "createdAt">) => {
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.entityType === bookmark.entityType && b.entityId === bookmark.entityId);
        if (exists) {
          return prev.filter((b) => !(b.entityType === bookmark.entityType && b.entityId === bookmark.entityId));
        }
        return [
          { ...bookmark, id: `${bookmark.entityType}-${bookmark.entityId}-${Date.now()}`, createdAt: new Date().toISOString() },
          ...prev,
        ];
      });
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(8);
      }
    },
    [setBookmarks]
  );

  return { bookmarks, toggle, isBookmarked, hydrated };
}

export function useNotes() {
  const [notes, setNotes, hydrated] = useLocalStorageState<NoteEntry[]>("parohia:notes", []);

  const addNote = useCallback(
    (note: Omit<NoteEntry, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      setNotes((prev) => [{ ...note, id: `note-${Date.now()}`, createdAt: now, updatedAt: now }, ...prev]);
    },
    [setNotes]
  );

  const removeNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotes]
  );

  return { notes, addNote, removeNote, hydrated };
}

export interface DownloadedItem {
  id: string;
  entityType: "prayer" | "reading";
  entityId: string;
  title: string;
  sizeLabel: string;
  downloadedAt: string;
}

export function useDownloads() {
  const [downloads, setDownloads, hydrated] = useLocalStorageState<DownloadedItem[]>("parohia:downloads", []);

  const isDownloaded = useCallback(
    (entityType: DownloadedItem["entityType"], entityId: string) =>
      downloads.some((d) => d.entityType === entityType && d.entityId === entityId),
    [downloads]
  );

  const add = useCallback(
    (item: Omit<DownloadedItem, "id" | "downloadedAt">) => {
      setDownloads((prev) => [
        { ...item, id: `${item.entityType}-${item.entityId}`, downloadedAt: new Date().toISOString() },
        ...prev.filter((d) => !(d.entityType === item.entityType && d.entityId === item.entityId)),
      ]);
    },
    [setDownloads]
  );

  const remove = useCallback(
    (entityType: DownloadedItem["entityType"], entityId: string) => {
      setDownloads((prev) => prev.filter((d) => !(d.entityType === entityType && d.entityId === entityId)));
    },
    [setDownloads]
  );

  return { downloads, add, remove, isDownloaded, hydrated };
}

export function usePlaybackPosition(readingId: string) {
  const key = `parohia:playback:${readingId}`;
  const [position, setPosition] = useLocalStorageState<number>(key, 0);
  return [position, setPosition] as const;
}
