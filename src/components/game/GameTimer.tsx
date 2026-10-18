'use client';

import React from 'react';
import { Timer, AlertTriangle, Flame, Sparkles, ArrowRight } from 'lucide-react';
import { GamePhase } from '@/types/game';
import { useAccurateCountdown } from '@/lib/timer';

interface GameTimerProps {
  phase: GamePhase;
  timerEndsAt: number | null;
  totalSeconds: number;
  stealDurationSeconds: number;
  drawingTeamName: string;
  activeGuessingTeamName: string;
  soundEnabled: boolean;
  onTimerExpire: () => void;
}

export function GameTimer({
  phase,
  timerEndsAt,
  totalSeconds,
  stealDurationSeconds,
  drawingTeamName,
  activeGuessingTeamName,
  soundEnabled,
  onTimerExpire,
}: GameTimerProps) {
  const isTimerActive =
    (phase === 'preparation' || phase === 'drawing' || phase === 'stealing') &&
    timerEndsAt !== null;

  const { remainingSeconds, progressPercent, isUrgent } = useAccurateCountdown({
    timerEndsAt,
    totalSeconds,
    isActive: isTimerActive,
    soundEnabled,
    onExpire: onTimerExpire,
  });

  if (phase === 'word_selected') {
    return (
      <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-slate-600">
          <Timer className="w-5 h-5 text-indigo-600 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">
            <strong>{drawingTeamName} — Main Guessing ({totalSeconds}s)</strong>{' '}
            • Waiting for drawer to click{' '}
            <span className="text-indigo-700 font-extrabold">
              &ldquo;I Know This Word — Done!&rdquo;
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Main: {totalSeconds}s
          </span>
          <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
            Steal: {stealDurationSeconds}s
          </span>
        </div>
      </div>
    );
  }

  const isStealing = phase === 'stealing';
  const isPrep = phase === 'preparation';

  const containerStyle = isUrgent
    ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm'
    : isStealing
    ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
    : isPrep
    ? 'bg-indigo-50 border-indigo-200 text-indigo-950'
    : 'bg-white border-slate-200 text-slate-900';

  const barColor = isUrgent
    ? 'bg-rose-600'
    : isStealing
    ? 'bg-amber-500'
    : isPrep
    ? 'bg-indigo-500'
    : 'bg-emerald-500';

  return (
    <div
      className={`rounded-2xl border-2 p-4 transition-colors ${containerStyle}`}
      role="timer"
      aria-live="off"
    >
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          {isUrgent ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce shrink-0" />
          ) : isStealing ? (
            <Flame className="w-5 h-5 text-amber-600 shrink-0 fill-current" />
          ) : isPrep ? (
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
          ) : (
            <Timer className="w-5 h-5 text-emerald-600 shrink-0" />
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-sm sm:text-base font-black tracking-tight"
                data-testid="timer-phase-heading"
              >
                {isPrep
                  ? `${drawingTeamName} — Get Ready to Draw!`
                  : isStealing
                  ? `${activeGuessingTeamName} — Steal Chance!`
                  : `${activeGuessingTeamName} — Main Guessing`}
              </span>

              {isStealing && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950">
                  {drawingTeamName} missed
                  <ArrowRight className="w-3 h-3" />
                  Fresh {totalSeconds}s Steal Timer
                </span>
              )}
            </div>

            {isUrgent ? (
              <span className="text-xs font-bold text-rose-600 block">
                Hurry! Under 10 seconds remaining!
              </span>
            ) : (
              <span className="text-xs text-slate-500 block">
                {isStealing
                  ? `Opposing team steal countdown (${totalSeconds}s full duration)`
                  : isPrep
                  ? 'Preparation countdown before drawing starts'
                  : `Primary team guessing countdown (${totalSeconds}s total)`}
              </span>
            )}
          </div>
        </div>

        <div
          className={`text-3xl sm:text-4xl font-black tabular-nums tracking-tight shrink-0 ${
            isUrgent ? 'text-rose-600 animate-pulse' : ''
          }`}
          data-testid="countdown-seconds"
        >
          {remainingSeconds}s
        </div>
      </div>

      {/* Smooth Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-150 rounded-full ${barColor}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
