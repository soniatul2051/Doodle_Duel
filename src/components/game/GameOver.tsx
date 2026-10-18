'use client';

import React from 'react';
import {
  Trophy,
  RotateCcw,
  Sliders,
  Sparkles,
  CheckCircle2,
  Flame,
  XCircle,
} from 'lucide-react';
import { RoundResult, Team } from '@/types/game';
import { determineWinners } from '@/lib/scoring';
import { Button } from '@/components/ui/Button';

interface GameOverProps {
  teams: Team[];
  roundHistory: RoundResult[];
  onPlayAgainSameTeams: () => void;
  onNewGameSetup: () => void;
}

export function GameOver({
  teams,
  roundHistory,
  onPlayAgainSameTeams,
  onNewGameSetup,
}: GameOverProps) {
  const { winners, isTie, highestScore } = determineWinners(teams);
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Winner Hero Card */}
      <section className="bg-white rounded-3xl border-2 border-slate-200/80 p-6 sm:p-10 shadow-sm text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5" />
            Match Complete • {roundHistory.length} Rounds Played
          </div>

          {highestScore === 0 ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                It&apos;s a 0–0 Draw!
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Tough words! No team scored a point this match. Ready for a
                rematch?
              </p>
            </>
          ) : isTie ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                It&apos;s a Tie at {highestScore}{' '}
                {highestScore === 1 ? 'Point' : 'Points'}!
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Shared Championship between{' '}
                <strong>{winners.map((w) => w.name).join(' & ')}</strong>!
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                {winners[0]?.name} Wins the Duel!
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Victory with a final score of{' '}
                <strong>
                  {highestScore} {highestScore === 1 ? 'point' : 'points'}
                </strong>
                !
              </p>
            </>
          )}
        </div>

        {/* Final Standings Podium List */}
        <div className="max-w-lg mx-auto space-y-2.5 pt-2">
          {sortedTeams.map((team, index) => {
            const isWinner =
              highestScore > 0 && team.score === highestScore;
            return (
              <div
                key={team.id}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 ${
                  isWinner
                    ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
                    style={{ backgroundColor: team.color }}
                  >
                    #{index + 1}
                  </span>
                  <div className="text-left">
                    <span className="font-extrabold text-slate-900 text-base block">
                      {team.name}
                    </span>
                    {isWinner && (
                      <span className="text-xs font-bold text-amber-700">
                        {isTie ? 'Co-Champion' : 'Grand Champion'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    {team.score}
                  </span>
                  <span className="text-xs font-bold text-slate-500 ml-1">
                    pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            variant="primary"
            size="xl"
            onClick={onPlayAgainSameTeams}
            leftIcon={<RotateCcw className="w-5 h-5" />}
          >
            Play Again (Same Teams)
          </Button>
          <Button
            variant="secondary"
            size="xl"
            onClick={onNewGameSetup}
            leftIcon={<Sliders className="w-5 h-5" />}
          >
            New Game (Change Setup)
          </Button>
        </div>
      </section>

      {/* Round-by-Round Recap */}
      {roundHistory.length > 0 && (
        <section className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Round-by-Round Recap
          </h2>
          <div className="divide-y divide-slate-100">
            {roundHistory.map((item) => {
              const drawer = teams.find((t) => t.id === item.drawingTeamId);
              const winner = item.winningTeamId
                ? teams.find((t) => t.id === item.winningTeamId)
                : null;
              return (
                <div
                  key={`${item.roundNumber}-${item.timestamp}`}
                  className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-lg font-extrabold bg-slate-100 text-slate-700">
                      R{item.roundNumber}
                    </span>
                    <span className="font-black text-slate-900">
                      {item.word.word}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      Drawn by <strong>{drawer?.name}</strong>
                    </span>
                  </div>

                  <div>
                    {item.outcomeType === 'guessed_by_initial_team' &&
                      winner && (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {winner.name} (+{item.pointsAwarded})
                        </span>
                      )}
                    {item.outcomeType === 'guessed_by_steal_team' && winner && (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                        <Flame className="w-3.5 h-3.5" />
                        Stolen by {winner.name} (+{item.pointsAwarded})
                      </span>
                    )}
                    {item.outcomeType === 'nobody_guessed' && (
                      <span className="inline-flex items-center gap-1 font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <XCircle className="w-3.5 h-3.5" />0 pts
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
