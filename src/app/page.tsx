'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';
import {
  AlertTriangle,
  Info,
  HelpCircle,
} from 'lucide-react';
import { GameSettings, GameState } from '@/types/game';
import {
  beginActiveDrawingAfterPrep,
  endRound,
  endRoundOrSteal,
  handleCorrectGuess,
  resetGame,
  selectRandomWordForRound,
  startGame,
  startNextRound,
  startRound,
  toggleSecretWordVisibility,
} from '@/lib/game-engine';
import {
  loadOrInitializeGameState,
  localGameStorage,
} from '@/lib/storage';
import { playSoundEffect } from '@/lib/timer';
import { Header } from '@/components/game/Header';
import { GameSetup } from '@/components/game/GameSetup';
import { TeamScoreboard } from '@/components/game/TeamScoreboard';
import { GameTimer } from '@/components/game/GameTimer';
import { WordCard } from '@/components/game/WordCard';
import { RoundControls } from '@/components/game/RoundControls';
import { DrawingPreview } from '@/components/game/DrawingPreview';
import { RoundResult } from '@/components/game/RoundResult';
import { GameOver } from '@/components/game/GameOver';
import { GameRulesModal } from '@/components/game/GameRulesModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ToastMessage, ToastTone, ToastViewport } from '@/components/ui/Toast';

const emptySubscribe = () => () => {};

export default function DoodleDuelPage() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [gameState, setGameState] = useState<GameState>(() =>
    loadOrInitializeGameState()
  );

  // Modals & Toasts
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<
    'new_game' | 'reset_scores' | null
  >(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback(
    (title: string, description?: string, tone: ToastTone = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, tone }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Persist game state changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localGameStorage.saveGameState(gameState);
  }, [gameState, isHydrated]);

  const handleStartGame = useCallback(
    (newSettings: GameSettings) => {
      setGameState((prev) => startGame(prev, newSettings));
      setIsSettingsModalOpen(false);
      pushToast(
        'Doodle Duel Started!',
        `Round 1 of ${newSettings.maxRounds} — ${newSettings.teams[0]?.name} is drawing first.`,
        'info'
      );
    },
    [pushToast]
  );

  const handleGenerateWord = useCallback(() => {
    setGameState((prev) => selectRandomWordForRound(prev));
  }, []);

  const handleConfirmWordDone = useCallback(() => {
    setGameState((prev) => {
      if (
        prev.phase !== 'word_selected' ||
        !prev.currentRound.currentWord ||
        prev.currentRound.wordLocked
      ) {
        return prev;
      }
      playSoundEffect('start', prev.settings.soundEnabled);
      return startRound(prev);
    });
  }, []);

  const handleToggleWordReveal = useCallback(() => {
    setGameState((prev) => toggleSecretWordVisibility(prev));
  }, []);

  const handleCorrectGuessClick = useCallback(() => {
    let scoredTeamName = '';
    let points = 1;
    let wasSteal = false;

    setGameState((prev) => {
      if (prev.currentRound.roundResolved) return prev;
      wasSteal = prev.phase === 'stealing';
      const winnerIdx =
        prev.phase === 'drawing'
          ? prev.currentRound.initialGuessingTeamIndex
          : prev.currentRound.activeGuessingTeamIndex;
      scoredTeamName = prev.teams[winnerIdx]?.name || 'Team';
      points = prev.settings.pointsPerCorrect;
      playSoundEffect('correct', prev.settings.soundEnabled);
      return handleCorrectGuess(prev);
    });

    if (scoredTeamName) {
      pushToast(
        wasSteal
          ? `${scoredTeamName} Stole the Point! (+${points})`
          : `Correct Guess! +${points} to ${scoredTeamName}`,
        'Scoreboard updated.',
        'success'
      );
    }
  }, [pushToast]);

  const handlePassOrNobodyGuessed = useCallback(() => {
    let nextPhaseType: 'stealing' | 'round_result' | null = null;
    let stealTeamName = '';

    setGameState((prev) => {
      if (prev.currentRound.roundResolved) return prev;
      const next = endRoundOrSteal(prev, 'manual_pass');
      nextPhaseType = next.phase === 'stealing' ? 'stealing' : 'round_result';
      if (next.phase === 'stealing') {
        stealTeamName =
          next.teams[next.currentRound.activeGuessingTeamIndex]?.name || '';
        playSoundEffect('steal_alert', prev.settings.soundEnabled);
      } else {
        playSoundEffect('time_up', prev.settings.soundEnabled);
      }
      return next;
    });

    if (nextPhaseType === 'stealing' && stealTeamName) {
      pushToast(
        `Steal Opportunity for ${stealTeamName}!`,
        'Guess correctly before the steal countdown expires to claim the point.',
        'warning'
      );
    } else if (nextPhaseType === 'round_result') {
      pushToast(
        'No points this round',
        'The secret word has been revealed.',
        'info'
      );
    }
  }, [pushToast]);

  const handleEndRoundZeroPoints = useCallback(() => {
    setGameState((prev) => {
      if (prev.currentRound.roundResolved) return prev;
      playSoundEffect('time_up', prev.settings.soundEnabled);
      return endRound(prev);
    });
    pushToast(
      'No points this round',
      'Round ended with 0 points awarded.',
      'info'
    );
  }, [pushToast]);

  const handleTimerExpire = useCallback(() => {
    let transitionedTo: string | null = null;
    let stealTeamName = '';

    setGameState((prev) => {
      if (prev.phase === 'preparation') {
        playSoundEffect('start', prev.settings.soundEnabled);
        transitionedTo = 'drawing';
        return beginActiveDrawingAfterPrep(prev);
      }

      if (prev.currentRound.roundResolved) {
        return prev;
      }

      if (prev.phase === 'drawing' || prev.phase === 'stealing') {
        const next = endRoundOrSteal(prev, 'timer_expired');
        transitionedTo = next.phase;
        if (next.phase === 'stealing') {
          stealTeamName =
            next.teams[next.currentRound.activeGuessingTeamIndex]?.name || '';
          playSoundEffect('steal_alert', prev.settings.soundEnabled);
        } else {
          playSoundEffect('time_up', prev.settings.soundEnabled);
        }
        return next;
      }

      return prev;
    });

    if (transitionedTo === 'stealing' && stealTeamName) {
      pushToast(
        `Time's Up! Steal Chance for ${stealTeamName}!`,
        'Initial guessing time expired — steal clock is now running!',
        'warning'
      );
    } else if (transitionedTo === 'round_result') {
      pushToast(
        "Time's Up! No points this round",
        'Nobody guessed the word before time expired.',
        'info'
      );
    }
  }, [pushToast]);

  const handleNextRound = useCallback(() => {
    setGameState((prev) => startNextRound(prev));
  }, []);

  const handleToggleSound = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: !prev.settings.soundEnabled,
      },
    }));
  }, []);

  const handleConfirmResetScores = () => {
    setGameState((prev) => resetGame(prev, 'play_again', false));
    setConfirmDialog(null);
    pushToast(
      'Scores Reset to Zero',
      'Starting fresh from Round 1 with the same teams.',
      'info'
    );
  };

  const handleConfirmNewGame = () => {
    setGameState((prev) => resetGame(prev, 'new_game_setup', false));
    setConfirmDialog(null);
    pushToast('Returned to Game Setup', 'Configure your new match.', 'info');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 animate-pulse mx-auto" />
          <p className="text-sm font-bold text-slate-600">
            Loading Doodle Duel...
          </p>
        </div>
      </div>
    );
  }

  const activeWordForPreview =
    gameState.phase === 'round_result'
      ? gameState.currentRound.lastResult?.word ?? null
      : gameState.currentRound.currentWord;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-indigo-50/20 to-amber-50/20 text-slate-900">
      <Header
        phase={gameState.phase}
        settings={gameState.settings}
        onOpenSettings={() => {
          if (gameState.phase === 'setup') return;
          setIsSettingsModalOpen(true);
        }}
        onRequestNewGame={() => setConfirmDialog('new_game')}
        onOpenRules={() => setIsRulesOpen(true)}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {gameState.phase === 'setup' ? (
          <GameSetup
            initialSettings={gameState.settings}
            onStartGame={handleStartGame}
          />
        ) : gameState.phase === 'game_over' ? (
          <GameOver
            teams={gameState.teams}
            roundHistory={gameState.roundHistory}
            onPlayAgainSameTeams={() =>
              setGameState((prev) => resetGame(prev, 'play_again', false))
            }
            onNewGameSetup={() =>
              setGameState((prev) => resetGame(prev, 'new_game_setup', false))
            }
          />
        ) : (
          <div className="space-y-5">
            {/* Live Team Scoreboard */}
            <TeamScoreboard
              teams={gameState.teams}
              phase={gameState.phase}
              currentRound={gameState.currentRound}
              maxRounds={gameState.settings.maxRounds}
              completedRoundsCount={gameState.roundHistory.length}
              onRequestResetScores={() => setConfirmDialog('reset_scores')}
            />

            {/* Countdown Timer (Shown in word_selected, preparation, drawing, stealing) */}
            {gameState.phase !== 'round_result' && (
              <GameTimer
                phase={gameState.phase}
                timerEndsAt={gameState.currentRound.timerEndsAt}
                totalSeconds={gameState.currentRound.timerTotalSeconds}
                soundEnabled={gameState.settings.soundEnabled}
                onTimerExpire={handleTimerExpire}
              />
            )}

            {/* Main Round Area: Either WordCard + Controls OR RoundResult */}
            {gameState.phase === 'round_result' &&
            gameState.currentRound.lastResult ? (
              <RoundResult
                result={gameState.currentRound.lastResult}
                teams={gameState.teams}
                maxRounds={gameState.settings.maxRounds}
                onNextRound={handleNextRound}
              />
            ) : (
              <>
                <WordCard
                  phase={gameState.phase}
                  currentRound={gameState.currentRound}
                  teams={gameState.teams}
                  onGenerateWord={handleGenerateWord}
                  onConfirmWordAndStartTimer={handleConfirmWordDone}
                  onToggleWordReveal={handleToggleWordReveal}
                />

                <RoundControls
                  phase={gameState.phase}
                  currentRound={gameState.currentRound}
                  teams={gameState.teams}
                  settings={gameState.settings}
                  onCorrectGuess={handleCorrectGuessClick}
                  onPassOrNobodyGuessed={handlePassOrNobodyGuessed}
                  onEndRoundNoPoints={handleEndRoundZeroPoints}
                />
              </>
            )}

            {/* Drawing Preview Button & Modal Below the Game Area */}
            <DrawingPreview
              wordEntry={activeWordForPreview}
              phase={gameState.phase}
              previewAvailability={gameState.settings.previewAvailability}
            />

            {/* Visible Game Rules & Steal Rule Quick Reference Panel */}
            <aside
              aria-label="Quick Scoring & Steal Rules Reference"
              className="rounded-2xl bg-slate-100/90 border border-slate-200/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600"
            >
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">
                    Scoring &amp; Steal Rule:
                  </strong>{' '}
                  On a team&apos;s turn, one member draws and their teammates
                  guess first for +{gameState.settings.pointsPerCorrect} pt. If
                  they fail or time expires, the opposing team gets a{' '}
                  <strong>
                    {gameState.settings.stealDurationSeconds}s Steal Opportunity
                  </strong>
                  !
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRulesOpen(true)}
                className="inline-flex items-center gap-1 font-extrabold text-indigo-600 hover:text-indigo-800 shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Full Rules
              </button>
            </aside>
          </div>
        )}
      </main>

      {/* Modals */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Match Settings"
        subtitle="Updating settings will start a fresh match with the new configuration"
        maxWidthClass="max-w-4xl"
      >
        <GameSetup
          initialSettings={gameState.settings}
          onStartGame={handleStartGame}
          isModalMode
          onCancelModal={() => setIsSettingsModalOpen(false)}
        />
      </Modal>

      {/* Confirmation Dialog for New Game or Reset Scores */}
      <Modal
        isOpen={confirmDialog !== null}
        onClose={() => setConfirmDialog(null)}
        title={
          confirmDialog === 'new_game'
            ? 'Start a New Game?'
            : 'Reset All Team Scores?'
        }
        subtitle="Please confirm before clearing current match progress"
        maxWidthClass="max-w-md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmDialog(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={
                confirmDialog === 'new_game'
                  ? handleConfirmNewGame
                  : handleConfirmResetScores
              }
            >
              {confirmDialog === 'new_game'
                ? 'Yes, Start New Game'
                : 'Yes, Reset Scores'}
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 text-sm text-slate-700">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p>
            {confirmDialog === 'new_game'
              ? 'Starting a new game will clear the current scoreboard and return you to the team and category setup screen. Your used-word history is preserved so words do not repeat.'
              : 'Resetting scores will set all team scores back to 0 and restart at Round 1 with your current teams and settings.'}
          </p>
        </div>
      </Modal>

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
