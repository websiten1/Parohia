"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [stored, setSettings, hydrated] = useLocalStorageState<SettingsState>("parohia:settings", DEFAULT_SETTINGS);
  /**
   * Merged over the defaults rather than used as-is. A stored object written
   * by an older build is missing any setting added since, and reading one of
   * those straight back returns `undefined` — which took down every page that
   * called t() when `language` went missing. Merging makes a partial or stale
   * record harmless.
   */
  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...stored }), [stored]);
  const update = useCallback(
    <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
      setSettings((prev) => ({ ...DEFAULT_SETTINGS, ...prev, [key]: value }));
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

const SELECTED_PARISH_KEY = "parohia:selectedParishId";

/** Null while unhydrated or genuinely unset — callers should treat both as "no parish chosen yet". */
export function useSelectedParishId() {
  const [id, setId, hydrated] = useLocalStorageState<string | null>(SELECTED_PARISH_KEY, null);
  return [id, setId, hydrated] as const;
}

/** Synchronous read for the one-time redirect check on the splash screen, before React state hydrates. */
export function readSelectedParishId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(SELECTED_PARISH_KEY) ?? "null");
  } catch {
    return null;
  }
}

const ONBOARDING_SKIPPED_KEY = "parohia:onboardingSkipped";

/**
 * Records that the visitor chose to go straight into the app instead of
 * answering onboarding. Without this the entry route would send them back to
 * the first question on every launch, which is exactly what choosing "skip"
 * was meant to avoid. They can still pick a parish later from Today or Menu.
 */
export function markOnboardingSkipped(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_SKIPPED_KEY, "true");
}

export function readOnboardingSkipped(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ONBOARDING_SKIPPED_KEY) === "true";
}

export type AccountRole = "parishioner" | "priest";

/**
 * Prototype-only account record — there is no real backend or authentication
 * behind this. It exists so the login/onboarding flow has somewhere to keep
 * what the visitor entered, and so returning to the app resumes at the right
 * step instead of restarting onboarding. Never treat this as secure storage.
 */
export interface Account {
  role: AccountRole;
  name: string;
  email: string;
  age?: string;
  state?: string;
  city?: string;
  /**
   * Priest-only: the single parish this account administers. A priest
   * account is bound to exactly one parish for its lifetime in this
   * prototype — there is no cross-parish switcher — which is what makes the
   * "a priest can only edit their own parish" permissions model true by
   * construction rather than a check that could be bypassed.
   */
  parishId?: string;
}

const ACCOUNT_KEY = "parohia:account";

export function useAccount() {
  const [account, setAccount, hydrated] = useLocalStorageState<Account | null>(ACCOUNT_KEY, null);
  return [account, setAccount, hydrated] as const;
}

export function readAccount(): Account | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNT_KEY) ?? "null");
  } catch {
    return null;
  }
}

/**
 * Where the splash screen should send a visitor: straight into the app if
 * they already picked a parish, back into onboarding at the right step if
 * they have an account but stopped partway, or to the very start otherwise.
 */
export function readEntryRoute(): string {
  const account = readAccount();
  if (account?.role === "priest") return account.parishId ? "/priest" : "/login/priest";
  if (readSelectedParishId()) return "/today";
  // Anyone who skipped is taken at their word and never asked again.
  if (readOnboardingSkipped()) return "/today";
  if (account?.state && account.city) return "/login/parish";
  if (account) return "/login/location";
  return "/login";
}
