'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle,
  RefreshCw,
  Lightbulb,
  Lock,
  Brush,
  Users,
  Flame,
} from 'lucide-react';
import {
  GamePhase,
  RoundState,
  Team,
} from '@/types/game';
import { Button } from '@/components/ui/Button';

interface WordCardProps {
  phase: GamePhase;
  currentRound: RoundState;
  teams: Team[];
  onGenerateWord: () => void;
  onConfirmWordAndStartTimer: () => void;
  onToggleWordReveal: () => void;
}

const difficultyBadgeStyles: Record<string, string> = {
  easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-800 border-amber-200',
  hard: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function WordCard({
  phase,
  currentRound,
  teams,
  onGenerateWord,
  onConfirmWordAndStartTimer,
  onToggleWordReveal,
}: WordCardProps) {
  const [showHint, setShowHint] = useState(false);

  const drawingTeam = teams[currentRound.drawingTeamIndex];
  const activeGuessingTeam = teams[currentRound.activeGuessingTeamIndex];
  const nextStealTeam =
    currentRound.stealQueueTeamIndices.length > 0
      ? teams[currentRound.stealQueueTeamIndices[0]]
      : null;

  const wordEntry = currentRound.currentWord;
  const isWordLocked = currentRound.wordLocked;
  const isRevealed = currentRound.wordRevealedToDrawer;

  return (
    <section
      aria-label="Secret Word Card"
      className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5"
    >
      {/* Active Turn Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5 font-extrabold text-slate-900">
            <Brush
              className="w-4 h-4 shrink-0"
              style={{ color: drawingTeam?.color }}
            />
            Drawing Team:{' '}
            <span
              className="px-2 py-0.5 rounded-lg text-white"
              style={{ backgroundColor: drawingTeam?.color }}
            >
              {drawingTeam?.name}
            </span>
          </span>

          <span className="text-slate-300 font-bold">•</span>

          {phase === 'stealing' ? (
            <span className="inline-flex items-center gap-1.5 font-extrabold text-amber-900">
              <Flame className="w-4 h-4 text-amber-600 shrink-0" />
              Stealing Team:{' '}
              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black">
                {activeGuessingTeam?.name}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-extrabold text-slate-900">
              <Users
                className="w-4 h-4 shrink-0"
                style={{ color: drawingTeam?.color }}
              />
              Primary Guessing:{' '}
              <span
                className="px-2 py-0.5 rounded-lg text-white"
                style={{ backgroundColor: drawingTeam?.color }}
              >
                {drawingTeam?.name} (Teammates)
              </span>
              {nextStealTeam && (
                <span className="text-xs font-semibold text-slate-500 ml-1">
                  • Steal Standby: {nextStealTeam.name}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Visible Word Privacy Status Indicator */}
        {wordEntry && (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                isRevealed
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              {isRevealed ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  Word Revealed on Screen
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                  Word Hidden from Guessers
                </>
              )}
            </span>

            {isWordLocked && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}
          </div>
        )}
      </div>

      {/* Empty State: Before Word is Generated */}
      {!wordEntry ? (
        <div className="text-center py-8 sm:py-10 px-4 rounded-2xl bg-gradient-to-b from-indigo-50/50 to-slate-50 border-2 border-dashed border-indigo-200 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {drawingTeam?.name}&apos;s Turn to Draw &amp; Guess!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              One player from <strong>{drawingTeam?.name}</strong> views the
              secret word and sketches it while the rest of{' '}
              <strong>{drawingTeam?.name}</strong> guesses first!
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="xl"
              onClick={onGenerateWord}
              leftIcon={<Sparkles className="w-5 h-5" />}
            >
              Generate Word
            </Button>
          </div>
        </div>
      ) : (
        /* Word Display State */
        <div className="space-y-5">
          {/* Category, Difficulty & Reveal Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-violet-50 text-violet-700 border border-violet-200">
                Category: {wordEntry.category}
              </span>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider border ${
                  difficultyBadgeStyles[wordEntry.difficulty] || ''
                }`}
              >
                {wordEntry.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowHint((prev) => !prev)}
                leftIcon={<Lightbulb className="w-4 h-4 text-amber-500" />}
              >
                {showHint ? 'Hide Clue' : 'Show Clue'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={onToggleWordReveal}
                leftIcon={
                  isRevealed ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )
                }
              >
                {isRevealed ? 'Hide Word' : 'Peek Word'}
              </Button>
            </div>
          </div>

          {/* Main Large Secret Word Box */}
          <div className="relative rounded-3xl p-6 sm:p-8 text-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 border-2 border-slate-200 shadow-inner">
            {isRevealed ? (
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 block">
                  {drawingTeam?.name} Drawer&apos;s Secret Word
                </span>
                <p
                  className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight break-words"
                  data-testid="secret-word-text"
                >
                  {wordEntry.word}
                </p>
              </div>
            ) : (
              <div className="py-2 space-y-2">
                <p
                  className="text-xl sm:text-2xl font-black text-slate-700"
                  data-testid="secret-word-hidden"
                >
                  ••••• SECRET WORD HIDDEN •••••
                </p>
                <p className="text-xs text-slate-500">
                  Hidden from guessing teammates during the active timer. Click{' '}
                  <strong>&ldquo;Peek Word&rdquo;</strong> if the drawer needs a
                  quick reminder.
                </p>
              </div>
            )}

            {showHint && (
              <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs sm:text-sm text-amber-900 bg-amber-50/80 rounded-xl px-4 py-2.5 inline-flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Hint:</strong> {wordEntry.hint}
                </span>
              </div>
            )}
          </div>

          {/* Pre-Timer Action Buttons (Step 2 & Step 3) */}
          {phase === 'word_selected' && !isWordLocked && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Button
                variant="success"
                size="xl"
                fullWidth
                onClick={onConfirmWordAndStartTimer}
                leftIcon={<CheckCircle className="w-5 h-5" />}
              >
                I Know This Word — Done!
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={onGenerateWord}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="sm:w-auto shrink-0"
              >
                Generate Another Word
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
