'use client';

import { useEffect, useRef, useState } from 'react';

export function calculateRemainingMs(
  timerEndsAt: number | null,
  now: number = Date.now()
): number {
  if (!timerEndsAt) return 0;
  return Math.max(0, timerEndsAt - now);
}

export function calculateRemainingSeconds(
  timerEndsAt: number | null,
  now: number = Date.now()
): number {
  const ms = calculateRemainingMs(timerEndsAt, now);
  return Math.max(0, Math.ceil(ms / 1000));
}

export function calculateTimerProgress(
  timerEndsAt: number | null,
  totalSeconds: number,
  now: number = Date.now()
): number {
  if (!timerEndsAt || totalSeconds <= 0) return 0;
  const remainingMs = calculateRemainingMs(timerEndsAt, now);
  const totalMs = totalSeconds * 1000;
  return Math.min(100, Math.max(0, (remainingMs / totalMs) * 100));
}

export type SoundEffectType =
  | 'start'
  | 'tick_urgent'
  | 'correct'
  | 'steal_alert'
  | 'time_up';

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function playSoundEffect(type: SoundEffectType, enabled: boolean): void {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'start') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.14);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'tick_urgent') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const startAt = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startAt);
        gain.gain.setValueAtTime(0.14, startAt);
        gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(startAt + 0.22);
      });
    } else if (type === 'steal_alert') {
      const notes = [587.33, 440, 587.33];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const startAt = now + idx * 0.09;
        osc.frequency.setValueAtTime(freq, startAt);
        gain.gain.setValueAtTime(0.08, startAt);
        gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(startAt + 0.12);
      });
    } else if (type === 'time_up') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.35);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  } catch {
    // Ignore audio context restrictions
  }
}

interface UseAccurateCountdownOptions {
  timerEndsAt: number | null;
  totalSeconds: number;
  isActive: boolean;
  soundEnabled: boolean;
  onExpire: () => void;
}

export function useAccurateCountdown({
  timerEndsAt,
  totalSeconds,
  isActive,
  soundEnabled,
  onExpire,
}: UseAccurateCountdownOptions) {
  const safeTotalMs = Math.max(0, totalSeconds * 1000);

  const [clockSnapshot, setClockSnapshot] = useState<{
    forTimerEndsAt: number | null;
    remainingMs: number;
  }>(() => ({
    forTimerEndsAt: timerEndsAt,
    remainingMs: safeTotalMs,
  }));

  const expiredForTimestampRef = useRef<number | null>(null);
  const lastUrgentSecondTickedRef = useRef<number | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!isActive || !timerEndsAt) {
      lastUrgentSecondTickedRef.current = null;
      return;
    }

    let cancelled = false;

    const syncClock = () => {
      if (cancelled) return;
      const now = Date.now();
      const ms = calculateRemainingMs(timerEndsAt, now);
      setClockSnapshot({
        forTimerEndsAt: timerEndsAt,
        remainingMs: ms,
      });

      const secs = Math.max(0, Math.ceil(ms / 1000));
      if (
        secs > 0 &&
        secs <= 10 &&
        lastUrgentSecondTickedRef.current !== secs
      ) {
        lastUrgentSecondTickedRef.current = secs;
        playSoundEffect('tick_urgent', soundEnabled);
      }

      if (ms <= 0 && expiredForTimestampRef.current !== timerEndsAt) {
        expiredForTimestampRef.current = timerEndsAt;
        onExpireRef.current();
      }
    };

    // Run immediately when timer starts or switches from main timer to steal timer
    syncClock();

    const intervalId = window.setInterval(syncClock, 100);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncClock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', syncClock);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', syncClock);
    };
  }, [isActive, timerEndsAt, soundEnabled]);

  // If timerEndsAt just changed (e.g. switched from Main Guessing to Steal Chance),
  // immediately report the full configured duration (safeTotalMs) until the effect ticks
  const effectiveRemainingMs =
    isActive && timerEndsAt
      ? clockSnapshot.forTimerEndsAt === timerEndsAt
        ? Math.max(0, clockSnapshot.remainingMs)
        : safeTotalMs
      : safeTotalMs;

  const remainingSeconds = Math.max(0, Math.ceil(effectiveRemainingMs / 1000));
  const progressPercent =
    totalSeconds > 0
      ? Math.min(
          100,
          Math.max(0, (effectiveRemainingMs / (totalSeconds * 1000)) * 100)
        )
      : 0;
  const isUrgent = isActive && remainingSeconds > 0 && remainingSeconds <= 10;

  return {
    remainingSeconds,
    remainingMs: effectiveRemainingMs,
    progressPercent,
    isUrgent,
  };
}
