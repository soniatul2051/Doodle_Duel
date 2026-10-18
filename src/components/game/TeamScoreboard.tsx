'use client';

import React from 'react';
import {
  Brush,
  Flame,
  Clock,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { GamePhase, RoundState, Team } from '@/types/game';

interface TeamScoreboardProps {
  teams: Team[];
  phase: GamePhase;
  currentRound: RoundState;
  maxRounds: number;
  completedRoundsCount: number;
  onRequestResetScores: () => void;
}

export function TeamScoreboard({
  teams,
  phase,
  currentRound,
  maxRounds,
  completedRoundsCount,
  onRequestResetScores,
}: TeamScoreboardProps) {
  const getTeamRoleBadge = (teamIndex: number) => {
    const isDrawingAndPrimaryGuessingTeam =
      teamIndex === currentRound.drawingTeamIndex;
    const isActiveStealingTeam =
      phase === 'stealing' &&
      teamIndex === currentRound.activeGuessingTeamIndex;

    if (isActiveStealingTeam) {
      return {
        label: 'Stealing Opportunity!',
        className:
          'bg-amber-500 text-slate-950 border-amber-600/30 animate-pulse',
        icon: <Flame className="w-3.5 h-3.5 fill-current" />,
      };
    }

    if (phase === 'stealing' && isDrawingAndPrimaryGuessingTeam) {
      return {
        label: 'Missed Primary Turn (Drew Word)',
        className: 'bg-slate-200 text-slate-600 border-slate-300',
        icon: <Clock className="w-3.5 h-3.5" />,
      };
    }

    if (isDrawingAndPrimaryGuessingTeam) {
      return {
        label: 'Drawing & Guessing',
        className: 'bg-indigo-600 text-white border-indigo-700/30',
        icon: <Brush className="w-3.5 h-3.5" />,
      };
    }

    return {
      label: 'Opposing (Steal Standby)',
      className: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    };
  };

  return (
    <section
      aria-label="Live Scoreboard"
      className="bg-white rounded-3xl border-2 border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4"
    >
      {/* Top Progress Bar & Round Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Round {Math.min(currentRound.roundNumber, maxRounds)} of{' '}
                {maxRounds}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                {completedRoundsCount} completed
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestResetScores}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Scores
        </button>
      </div>

      {/* Team Score Cards Grid */}
      <div
        className={`grid gap-3 ${
          teams.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : teams.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {teams.map((team, idx) => {
          const badge = getTeamRoleBadge(idx);
          const isHighlighted =
            (phase !== 'stealing' && idx === currentRound.drawingTeamIndex) ||
            (phase === 'stealing' &&
              idx === currentRound.activeGuessingTeamIndex);

          return (
            <div
              key={team.id}
              className={`relative rounded-2xl p-3.5 sm:p-4 border-2 transition-all ${
                isHighlighted
                  ? 'bg-slate-50/90 border-slate-300 shadow-xs'
                  : 'bg-white border-slate-100 opacity-85'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: team.color }}
                    />
                    <h3 className="font-extrabold text-slate-900 text-base truncate">
                      {team.name}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold border ${badge.className}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className="block text-2xl sm:text-3xl font-black tabular-nums leading-none"
                    style={{ color: team.color }}
                    data-testid={`team-score-${idx}`}
                  >
                    {team.score}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {team.score === 1 ? 'Point' : 'Points'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
