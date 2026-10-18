'use client';

import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Flame,
  ArrowRightCircle,
  ShieldAlert,
} from 'lucide-react';
import {
  GamePhase,
  GameSettings,
  RoundState,
  Team,
} from '@/types/game';
import { Button } from '@/components/ui/Button';

interface RoundControlsProps {
  phase: GamePhase;
  currentRound: RoundState;
  teams: Team[];
  settings: GameSettings;
  onCorrectGuess: () => void;
  onPassOrNobodyGuessed: () => void;
  onEndRoundNoPoints: () => void;
}

export function RoundControls({
  phase,
  currentRound,
  teams,
  settings,
  onCorrectGuess,
  onPassOrNobodyGuessed,
  onEndRoundNoPoints,
}: RoundControlsProps) {
  if (phase !== 'drawing' && phase !== 'stealing') {
    return null;
  }

  const isDisabled = currentRound.roundResolved;
  const drawingTeam = teams[currentRound.drawingTeamIndex];
  const initialGuessingTeam = teams[currentRound.initialGuessingTeamIndex];
  const activeStealingTeam = teams[currentRound.activeGuessingTeamIndex];
  const hasStealRemaining =
    currentRound.stealQueueTeamIndices.length > 0 &&
    settings.stealRuleMode !== 'disabled';

  const pointsText =
    settings.pointsPerCorrect === 1
      ? '+1 Point'
      : `+${settings.pointsPerCorrect} Points`;

  if (phase === 'drawing') {
    const nextStealTeam = hasStealRemaining
      ? teams[currentRound.stealQueueTeamIndices[0]]
      : null;

    return (
      <section
        aria-label="Active Round Scoring Controls"
        className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Active Round Judgment — {drawingTeam?.name}&apos;s Turn
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              A member of <strong>{drawingTeam?.name}</strong> is drawing while
              the remaining members of{' '}
              <strong>{initialGuessingTeam?.name}</strong> guess first.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Reward: {pointsText}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Button
            variant="success"
            size="xl"
            disabled={isDisabled}
            onClick={onCorrectGuess}
            leftIcon={<CheckCircle2 className="w-6 h-6" />}
            fullWidth
          >
            Correct Guess! ({initialGuessingTeam?.name} {pointsText})
          </Button>

          <Button
            variant={hasStealRemaining ? 'warning' : 'danger'}
            size="xl"
            disabled={isDisabled}
            onClick={onPassOrNobodyGuessed}
            leftIcon={
              hasStealRemaining ? (
                <Flame className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )
            }
            fullWidth
          >
            {hasStealRemaining
              ? `Nobody Guessed It (Steal: ${nextStealTeam?.name})`
              : 'Nobody Guessed It (0 Points)'}
          </Button>
        </div>

        {hasStealRemaining && (
          <p className="text-xs text-slate-500 text-center">
            If <strong>{initialGuessingTeam?.name}</strong> cannot guess the
            word in time, click <strong>&ldquo;Nobody Guessed It&rdquo;</strong>{' '}
            to give <strong>{nextStealTeam?.name}</strong> a{' '}
            {settings.stealDurationSeconds}s steal opportunity.
          </p>
        )}
      </section>
    );
  }

  // STEALING PHASE (Opposing Team's Steal Turn)
  const nextInQueueTeam =
    currentRound.stealQueueTeamIndices.length > 0
      ? teams[currentRound.stealQueueTeamIndices[0]]
      : null;

  return (
    <section
      aria-label="Steal Opportunity Controls"
      className="bg-amber-50/90 rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm space-y-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950">
            <Flame className="w-3.5 h-3.5 fill-current" />
            Steal Opportunity Active
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Can {activeStealingTeam?.name} Steal the Point?
          </h3>
          <p className="text-xs sm:text-sm text-slate-700">
            <strong>{drawingTeam?.name}</strong> could not guess their word in
            time. If <strong>{activeStealingTeam?.name}</strong> guesses
            correctly before the steal timer expires, they earn {pointsText}!
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-amber-300 text-xs font-bold text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Opposing team steal attempt!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Button
          variant="success"
          size="xl"
          disabled={isDisabled}
          onClick={onCorrectGuess}
          leftIcon={<CheckCircle2 className="w-6 h-6" />}
          fullWidth
        >
          Correct Guess! ({activeStealingTeam?.name} Steals {pointsText})
        </Button>

        {nextInQueueTeam ? (
          <Button
            variant="warning"
            size="xl"
            disabled={isDisabled}
            onClick={onPassOrNobodyGuessed}
            leftIcon={<ArrowRightCircle className="w-6 h-6" />}
            fullWidth
          >
            Pass to Next Team ({nextInQueueTeam.name})
          </Button>
        ) : (
          <Button
            variant="danger"
            size="xl"
            disabled={isDisabled}
            onClick={onEndRoundNoPoints}
            leftIcon={<XCircle className="w-6 h-6" />}
            fullWidth
          >
            Nobody Guessed It (0 Points)
          </Button>
        )}
      </div>

      {nextInQueueTeam && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            disabled={isDisabled}
            onClick={onEndRoundNoPoints}
          >
            End Round Immediately (Award 0 Points)
          </Button>
        </div>
      )}
    </section>
  );
}
