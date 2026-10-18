'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Layers,
  Sliders,
  Play,
  AlertCircle,
  Flame,
  Eye,
  Check,
} from 'lucide-react';
import {
  GameSettings,
  PreviewAvailability,
  StealRuleMode,
  WordCategory,
  WordDifficulty,
} from '@/types/game';
import {
  TEAM_COLORS,
  validateSettings,
} from '@/lib/game-engine';
import { ALL_CATEGORIES, SPECIFIC_CATEGORIES } from '@/lib/words';
import { Button } from '@/components/ui/Button';

interface GameSetupProps {
  initialSettings: GameSettings;
  onStartGame: (settings: GameSettings) => void;
  onUpdateSettingsKeepMatch?: (settings: GameSettings) => void;
  isModalMode?: boolean;
  onCancelModal?: () => void;
}

const PRESET_MAIN_DURATIONS = [30, 60, 90, 120];
const PRESET_STEAL_DURATIONS = [15, 30, 45, 60];

const DIFFICULTY_OPTIONS: {
  value: WordDifficulty;
  label: string;
  desc: string;
}[] = [
  { value: 'easy', label: 'Easy', desc: 'Simple everyday nouns' },
  { value: 'medium', label: 'Medium', desc: 'Fun actions & concepts' },
  { value: 'hard', label: 'Hard', desc: 'Tricky & specific scenes' },
  { value: 'mixed', label: 'Mixed', desc: 'All difficulty levels' },
];

export function GameSetup({
  initialSettings,
  onStartGame,
  onUpdateSettingsKeepMatch,
  isModalMode = false,
  onCancelModal,
}: GameSetupProps) {
  const [draft, setDraft] = useState<GameSettings>(initialSettings);
  const [isCustomMainTimer, setIsCustomMainTimer] = useState<boolean>(
    !PRESET_MAIN_DURATIONS.includes(initialSettings.timerDurationSeconds)
  );
  const [isCustomStealTimer, setIsCustomStealTimer] = useState<boolean>(
    !PRESET_STEAL_DURATIONS.includes(initialSettings.stealDurationSeconds)
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleTeamNameChange = (index: number, name: string) => {
    setDraft((prev) => {
      const updated = prev.teams.map((t, idx) =>
        idx === index ? { ...t, name } : t
      );
      return { ...prev, teams: updated };
    });
    setErrors([]);
  };

  const handleAddTeam = () => {
    if (draft.teams.length >= 4) return;
    const nextIdx = draft.teams.length;
    const defaultLetter = String.fromCharCode(65 + nextIdx);
    setDraft((prev) => ({
      ...prev,
      teams: [
        ...prev.teams,
        {
          id: `team-${Date.now()}-${nextIdx + 1}`,
          name: `Team ${defaultLetter}`,
          color: TEAM_COLORS[nextIdx % TEAM_COLORS.length],
        },
      ],
    }));
    setErrors([]);
  };

  const handleRemoveTeam = (index: number) => {
    if (draft.teams.length <= 2) return;
    setDraft((prev) => ({
      ...prev,
      teams: prev.teams.filter((_, idx) => idx !== index),
    }));
    setErrors([]);
  };

  const handleToggleCategory = (category: WordCategory) => {
    setDraft((prev) => {
      if (category === 'Random/Mixed') {
        return { ...prev, categories: ['Random/Mixed'] };
      }

      const withoutRandom = prev.categories.filter(
        (c) => c !== 'Random/Mixed'
      );
      const exists = withoutRandom.includes(category);
      const nextCategories = exists
        ? withoutRandom.filter((c) => c !== category)
        : [...withoutRandom, category];

      if (
        nextCategories.length === 0 ||
        nextCategories.length === SPECIFIC_CATEGORIES.length
      ) {
        return { ...prev, categories: ['Random/Mixed'] };
      }

      return { ...prev, categories: nextCategories };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateSettings(draft);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    onStartGame(draft);
  };

  const handleApplyKeepMatch = () => {
    if (!onUpdateSettingsKeepMatch) return;
    const validation = validateSettings(draft);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    onUpdateSettingsKeepMatch(draft);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {!isModalMode && (
        <div className="text-center space-y-2 py-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Party Pictionary Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Set Up Your Doodle Duel
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Configure your teams, word categories, main guessing timer, and
            opposing team steal timer before starting the first round.
          </p>
        </div>
      )}

      {errors.length > 0 && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm font-medium">
            <p className="font-bold">Please fix the following before starting:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Teams, Difficulty & Customizable Timers */}
        <div className="lg:col-span-6 space-y-6">
          {/* A. Team Setup */}
          <section className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Teams (2–4)
                  </h2>
                  <p className="text-xs text-slate-500">
                    All teams start at 0 points and alternate turns
                  </p>
                </div>
              </div>
              {draft.teams.length < 4 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddTeam}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Team
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {draft.teams.map((team, idx) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs"
                    style={{ backgroundColor: team.color }}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`team-name-${idx}`} className="sr-only">
                      Team {idx + 1} Name
                    </label>
                    <input
                      id={`team-name-${idx}`}
                      type="text"
                      value={team.name}
                      maxLength={28}
                      onChange={(e) =>
                        handleTeamNameChange(idx, e.target.value)
                      }
                      placeholder={`Team ${String.fromCharCode(65 + idx)}`}
                      className="w-full bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 px-1.5">
                    0 pts
                  </span>
                  {draft.teams.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTeam(idx)}
                      aria-label={`Remove ${team.name}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* D. Customizable Timers (Main Guessing Time & Opposing Team Steal Time) */}
          <section
            aria-label="Timer Settings"
            className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Timer Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Independent timers for Main Guessing &amp; Steal Chance
                  </p>
                </div>
              </div>
              <div className="text-right text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl">
                Main: {draft.timerDurationSeconds}s • Steal:{' '}
                {draft.stealRuleMode === 'disabled'
                  ? 'Off'
                  : `${draft.stealDurationSeconds}s`}
              </div>
            </div>

            {/* 1. Main Team's Guessing Time */}
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-extrabold text-slate-900">
                  1. Main Team&apos;s Guessing Time
                </label>
                <span
                  className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full"
                  data-testid="selected-main-timer-badge"
                >
                  Selected: {draft.timerDurationSeconds}s
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Time given to the drawing team&apos;s members to guess the word
                first.
              </p>

              <div className="grid grid-cols-5 gap-2 pt-1">
                {PRESET_MAIN_DURATIONS.map((sec) => {
                  const active =
                    !isCustomMainTimer && draft.timerDurationSeconds === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        setIsCustomMainTimer(false);
                        setDraft((prev) => ({
                          ...prev,
                          timerDurationSeconds: sec,
                        }));
                      }}
                      className={`py-2 px-2 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                        active
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sec}s
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsCustomMainTimer(true)}
                  className={`py-2 px-2 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                    isCustomMainTimer
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Custom
                </button>
              </div>

              {isCustomMainTimer && (
                <div className="flex items-center gap-3 pt-1">
                  <label
                    htmlFor="custom-timer-input"
                    className="text-xs font-bold text-slate-700"
                  >
                    Custom Main Guessing Seconds (10–600):
                  </label>
                  <input
                    id="custom-timer-input"
                    type="number"
                    min={10}
                    max={600}
                    value={draft.timerDurationSeconds}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        timerDurationSeconds: Number(e.target.value) || 60,
                      }))
                    }
                    className="w-28 bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
              )}
            </div>

            {/* 2. Opposing Team's Steal Time */}
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  2. Opposing Team&apos;s Steal Time
                </label>
                <span
                  className="text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full"
                  data-testid="selected-steal-timer-badge"
                >
                  {draft.stealRuleMode === 'disabled'
                    ? 'Steal Disabled'
                    : `Selected: ${draft.stealDurationSeconds}s`}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Fresh countdown started automatically for the opposing team when
                the main team fails to guess in time.
              </p>

              <div className="grid grid-cols-5 gap-2 pt-1">
                {PRESET_STEAL_DURATIONS.map((sec) => {
                  const active =
                    !isCustomStealTimer &&
                    draft.stealDurationSeconds === sec &&
                    draft.stealRuleMode !== 'disabled';
                  return (
                    <button
                      key={sec}
                      type="button"
                      disabled={draft.stealRuleMode === 'disabled'}
                      onClick={() => {
                        setIsCustomStealTimer(false);
                        setDraft((prev) => ({
                          ...prev,
                          stealDurationSeconds: sec,
                        }));
                      }}
                      className={`py-2 px-2 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer disabled:opacity-40 ${
                        active
                          ? 'border-amber-600 bg-amber-500 text-slate-950'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sec}s
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={draft.stealRuleMode === 'disabled'}
                  onClick={() => setIsCustomStealTimer(true)}
                  className={`py-2 px-2 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer disabled:opacity-40 ${
                    isCustomStealTimer && draft.stealRuleMode !== 'disabled'
                      ? 'border-amber-600 bg-amber-500 text-slate-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Custom
                </button>
              </div>

              {isCustomStealTimer && draft.stealRuleMode !== 'disabled' && (
                <div className="flex items-center gap-3 pt-1">
                  <label
                    htmlFor="steal-seconds-input"
                    className="text-xs font-bold text-slate-700"
                  >
                    Custom Steal Seconds (5–120):
                  </label>
                  <input
                    id="steal-seconds-input"
                    type="number"
                    min={5}
                    max={120}
                    value={draft.stealDurationSeconds}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        stealDurationSeconds: Number(e.target.value) || 15,
                      }))
                    }
                    className="w-28 bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label
                  htmlFor="max-rounds-select"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Total Rounds
                </label>
                <select
                  id="max-rounds-select"
                  value={draft.maxRounds}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      maxRounds: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900"
                >
                  <option value={2}>2 Rounds (Quick Demo)</option>
                  <option value={4}>4 Rounds</option>
                  <option value={6}>6 Rounds (Standard)</option>
                  <option value={8}>8 Rounds</option>
                  <option value={10}>10 Rounds</option>
                  <option value={12}>12 Rounds (Marathon)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="prep-time-select"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Prep Countdown Before Drawing
                </label>
                <select
                  id="prep-time-select"
                  value={draft.prepTimeSeconds}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      prepTimeSeconds: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900"
                >
                  <option value={0}>None (Start Immediately)</option>
                  <option value={3}>3 Seconds Get-Ready</option>
                  <option value={5}>5 Seconds Get-Ready</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Difficulty, Categories & Advanced Rules */}
        <div className="lg:col-span-6 space-y-6">
          {/* B. Word Difficulty */}
          <section className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Word Difficulty
                </h2>
                <p className="text-xs text-slate-500">
                  Choose how challenging the secret words should be
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const isSelected = draft.difficulty === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, difficulty: opt.value }))
                    }
                    className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-extrabold text-sm flex items-center justify-between">
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* C. Word Categories */}
          <section className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Word Categories
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pick Random/Mixed or select specific categories
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((category) => {
                const isSelected = draft.categories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleToggleCategory(category)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-violet-600 bg-violet-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          {/* E. Scoring & Preview Options */}
          <section className="bg-white rounded-3xl border-2 border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Scoring &amp; Fair Play Rules
                </h2>
                <p className="text-xs text-slate-500">
                  Configure points, steal availability, and drawing previews
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="steal-mode-select"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Steal Mode
                </label>
                <select
                  id="steal-mode-select"
                  value={draft.stealRuleMode}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      stealRuleMode: e.target.value as StealRuleMode,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                >
                  <option value="all_teams_including_drawing_team">
                    Enabled (Opposing Team Steals)
                  </option>
                  <option value="other_teams_only">
                    Enabled (All Opposing Teams)
                  </option>
                  <option value="disabled">Disabled (No Steals)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="points-per-correct-input"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Points per Guess
                </label>
                <input
                  id="points-per-correct-input"
                  type="number"
                  min={1}
                  max={10}
                  value={draft.pointsPerCorrect}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      pointsPerCorrect: Number(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="preview-availability-select"
                  className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  Drawing Preview
                </label>
                <select
                  id="preview-availability-select"
                  value={draft.previewAvailability}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      previewAvailability: e.target
                        .value as PreviewAvailability,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                >
                  <option value="before_timer">
                    Before Timer Only
                  </option>
                  <option value="always">
                    Before &amp; During Round
                  </option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer">
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">
                    Prevent Duplicate Words in Session
                  </span>
                  <span className="text-slate-500">
                    Avoids repeating words until the category bank is exhausted
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={!draft.allowWordRepetition}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      allowWordRepetition: !e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </section>
        </div>
      </div>

      {/* Start / Save Action Footer */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        {isModalMode && onCancelModal && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onCancelModal}
          >
            Cancel
          </Button>
        )}

        {isModalMode && onUpdateSettingsKeepMatch && (
          <Button
            type="button"
            variant="success"
            size="lg"
            onClick={handleApplyKeepMatch}
            leftIcon={<Check className="w-5 h-5" />}
          >
            Save Timer &amp; Rules (Keep Current Scores)
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          size="xl"
          fullWidth={!isModalMode}
          leftIcon={<Play className="w-5 h-5 fill-current" />}
          rightIcon={<Sliders className="w-4 h-4 opacity-70" />}
        >
          {isModalMode ? 'Restart Match with New Settings' : 'Start Game'}
        </Button>
      </div>
    </form>
  );
}
