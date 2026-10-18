'use client';

import React from 'react';
import {
  CheckCircle2,
  Flame,
  XCircle,
  ArrowRight,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { RoundResult as RoundResultType, Team } from '@/types/game';
import { Button } from '@/components/ui/Button';

interface RoundResultProps {
  result: RoundResultType;
  teams: Team[];
  maxRounds: number;
  onNextRound: () => void;
}

export function RoundResult({
  result,
  teams,
  maxRounds,
  onNextRound,
}: RoundResultProps) {
  const drawingTeam = teams.find((t) => t.id === result.drawingTeamId);
  const winningTeam = result.winningTeamId
    ? teams.find((t) => t.id === result.winningTeamId)
    : null;

  const isFinalRound = result.roundNumber >= maxRounds;

  const nextDrawingTeamIndex =
    (teams.findIndex((t) => t.id === result.drawingTeamId) + 1) % teams.length;
  const nextDrawingTeam = teams[nextDrawingTeamIndex];
  const nextOpposingTeam = teams[(nextDrawingTeamIndex + 1) % teams.length];

  return (
    <section
      aria-label="Round Result Summary"
      className="bg-white rounded-3xl border-2 border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 text-center"
    >
      {/* Outcome Banner */}
      {result.outcomeType === 'guessed_by_initial_team' && winningTeam && (
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            Correct Guess!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {winningTeam.name} Earns +{result.pointsAwarded}{' '}
            {result.pointsAwarded === 1 ? 'Point' : 'Points'}!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            <strong>{winningTeam.name}&apos;s</strong> teammates guessed their
            drawer&apos;s sketch with{' '}
            <strong>{result.timeRemainingSeconds}s</strong> left on the clock!
          </p>
        </div>
      )}

      {result.outcomeType === 'guessed_by_steal_team' && winningTeam && (
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Flame className="w-9 h-9 fill-current" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <Flame className="w-3.5 h-3.5" />
            Point Stolen!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {winningTeam.name} Steals +{result.pointsAwarded}{' '}
            {result.pointsAwarded === 1 ? 'Point' : 'Points'}!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            After <strong>{drawingTeam?.name}</strong> could not guess their
            word, <strong>{winningTeam.name}</strong> clutched the steal
            opportunity!
          </p>
        </div>
      )}

      {result.outcomeType === 'nobody_guessed' && (
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <XCircle className="w-9 h-9" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            Round Over
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black text-slate-900"
            data-testid="no-points-heading"
          >
            No points this round
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Neither <strong>{drawingTeam?.name}</strong> nor the opposing steal
            team guessed the word in time. Zero points awarded.
          </p>
        </div>
      )}

      {/* Revealed Secret Word Box */}
      <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border-2 border-slate-200/80 space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block">
          The Secret Word Was
        </span>
        <p className="text-2xl sm:text-3xl font-black text-indigo-700">
          {result.word.word}
        </p>
        <p className="text-xs text-slate-500">
          Category: <strong>{result.word.category}</strong> • Difficulty:{' '}
          <strong className="uppercase">{result.word.difficulty}</strong>
        </p>
      </div>

      {/* Next Up Preview or Final Results */}
      {!isFinalRound && nextDrawingTeam && nextOpposingTeam && (
        <div className="text-xs sm:text-sm text-slate-600 bg-indigo-50/60 border border-indigo-100 rounded-2xl py-2.5 px-4 max-w-md mx-auto">
          Up next in <strong>Round {result.roundNumber + 1}</strong>:{' '}
          <strong>{nextDrawingTeam.name}&apos;s</strong> turn to draw &amp;
          guess ({nextOpposingTeam.name} on steal standby)!
        </div>
      )}

      <div className="pt-2 max-w-sm mx-auto">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          onClick={onNextRound}
          rightIcon={
            isFinalRound ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )
          }
        >
          {isFinalRound ? 'See Final Standings' : 'Next Round'}
        </Button>
      </div>
    </section>
  );
}
