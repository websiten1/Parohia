"use client";

import { useEffect, useRef, useState } from "react";
import { usePlaybackPosition } from "@/lib/storage";
import { Forward15Icon, PauseIcon, PlayIcon, Replay15Icon } from "./icons";

interface Props {
  readingId: string;
  title: string;
  reference: string;
  durationLabel: string;
  audioUrl?: string;
}

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];

function parseDuration(label: string): number {
  const [m, s] = label.split(":").map(Number);
  return m * 60 + (s || 0);
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function speedLabel(speed: number): string {
  return `${speed.toFixed(2).replace(/0$/, "")}×`;
}

/**
 * Scripture audio player. Uses a real <audio> element when `audioUrl` is
 * provided; otherwise drives a simulated playback clock so play/pause, seek
 * and speed are still fully functional against the seeded duration — the
 * same controls wire straight into a real source once one exists.
 *
 * Rendered inline, no card chrome — matches the plain-page player treatment
 * in the reference (thin progress line, elapsed/duration flanking it).
 */
export function AudioPlayerCard({ readingId, title, reference, durationLabel, audioUrl }: Props) {
  const totalSeconds = parseDuration(durationLabel);
  const [storedPosition, setStoredPosition] = usePlaybackPosition(readingId);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    setElapsed(Math.min(storedPosition, totalSeconds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedPosition]);

  useEffect(() => {
    setStoredPosition(elapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audioRef.current?.pause();
      return;
    }
    if (audioUrl && audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[speedIdx];
      audioRef.current.play().catch(() => setPlaying(false));
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.25 * SPEEDS[speedIdx];
        if (next >= totalSeconds) {
          setPlaying(false);
          return totalSeconds;
        }
        return next;
      });
    }, 250);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speedIdx, audioUrl, totalSeconds]);

  function seek(deltaSeconds: number) {
    setElapsed((prev) => Math.min(totalSeconds, Math.max(0, prev + deltaSeconds)));
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(totalSeconds, Math.max(0, audioRef.current.currentTime + deltaSeconds));
    }
  }

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: reference,
      album: "Romanian Orthodox Episcopate of America",
    });
    navigator.mediaSession.setActionHandler("play", () => setPlaying(true));
    navigator.mediaSession.setActionHandler("pause", () => setPlaying(false));
    navigator.mediaSession.setActionHandler("seekbackward", () => seek(-15));
    navigator.mediaSession.setActionHandler("seekforward", () => seek(15));
    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, reference]);

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    setElapsed(value);
    if (audioRef.current) audioRef.current.currentTime = value;
  }

  const progressPct = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0;

  return (
    <div>
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} />}

      <input
        type="range"
        min={0}
        max={totalSeconds}
        step={0.25}
        value={elapsed}
        onChange={handleScrub}
        aria-label="Seek"
        className="h-[2px] w-full cursor-pointer appearance-none rounded-pill accent-navy"
        style={{
          background: `linear-gradient(to right, #071A33 ${progressPct}%, #E6E8EB ${progressPct}%)`,
        }}
      />
      <div className="mt-[6px] flex justify-between font-sans text-[12px] text-muted">
        <span>{formatTime(elapsed)}</span>
        <span>{formatTime(totalSeconds)}</span>
      </div>

      <div className="mt-[14px] flex items-center justify-center gap-[20px]">
        <button type="button" aria-label="Rewind 15 seconds" onClick={() => seek(-15)} className="press text-navy">
          <Replay15Icon className="h-[22px] w-[22px]" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((p) => !p)}
          className="press flex h-[46px] w-[46px] items-center justify-center rounded-full bg-navy text-white"
        >
          <span className="transition-opacity duration-[120ms]">
            {playing ? <PauseIcon className="h-[19px] w-[19px]" /> : <PlayIcon className="h-[19px] w-[19px]" />}
          </span>
        </button>
        <button type="button" aria-label="Forward 15 seconds" onClick={() => seek(15)} className="press text-navy">
          <Forward15Icon className="h-[22px] w-[22px]" />
        </button>
        <button
          type="button"
          onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
          aria-label="Playback speed"
          className="press ml-[6px] font-sans text-[13px] font-medium text-muted"
        >
          {speedLabel(SPEEDS[speedIdx])}
        </button>
      </div>
    </div>
  );
}
