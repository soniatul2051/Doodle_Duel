'use client';

import React from 'react';
import {
  Palette,
  RotateCcw,
  Settings,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { GamePhase, GameSettings } from '@/types/game';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  phase: GamePhase;
  settings: GameSettings;
  onOpenSettings: () => void;
  onRequestNewGame: () => void;
  onOpenRules: () => void;
  onToggleSound: () => void;
}

export function Header({
  phase,
  settings,
  onOpenSettings,
  onRequestNewGame,
  onOpenRules,
  onToggleSound,
}: HeaderProps) {
  const difficultyLabel =
    settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1);

  const modeSummary =
    phase === 'setup'
      ? 'Configuring Party Match'
      : `${settings.teams.length} Teams • ${difficultyLabel} • ${settings.timerDurationSeconds}s`;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 truncate">
                Doodle Duel
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                <Sparkles className="w-3 h-3" />
                {modeSummary}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate md:hidden">
              {modeSummary}
            </p>
            <p className="hidden md:block text-xs text-slate-500">
              Party Pictionary Word Generator & Team Scorekeeper
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            title={
              settings.soundEnabled
                ? 'Sound effects enabled (Click to mute)'
                : 'Sound effects muted (Click to unmute)'
            }
            aria-label={
              settings.soundEnabled
                ? 'Mute sound effects'
                : 'Unmute sound effects'
            }
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenRules}
            leftIcon={<BookOpen className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            Rules
          </Button>
          <button
            type="button"
            onClick={onOpenRules}
            aria-label="Game Rules"
            className="sm:hidden p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenSettings}
            leftIcon={<Settings className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Settings</span>
          </Button>

          {phase !== 'setup' && (
            <Button
              variant="primary"
              size="sm"
              onClick={onRequestNewGame}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              <span>New Game</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
