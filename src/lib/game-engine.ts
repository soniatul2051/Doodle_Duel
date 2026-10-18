import {
  GameSettings,
  GameState,
  RoundOutcomeType,
  RoundState,
  Team,
} from '@/types/game';
import { buildStealQueue, createRoundResolution } from '@/lib/scoring';
import { generateWord } from '@/lib/words';

export const TEAM_COLORS = [
  '#4F46E5', // Indigo (Team A)
  '#E11D48', // Rose (Team B)
  '#059669', // Emerald (Team C)
  '#D97706', // Amber (Team D)
];

export const DEFAULT_SETTINGS: GameSettings = {
  teams: [
    { id: 'team-1', name: 'Team A', color: TEAM_COLORS[0] },
    { id: 'team-2', name: 'Team B', color: TEAM_COLORS[1] },
  ],
  difficulty: 'mixed',
  categories: ['Random/Mixed'],
  timerDurationSeconds: 60,
  prepTimeSeconds: 0,
  stealDurationSeconds: 15,
  stealRuleMode: 'all_teams_including_drawing_team',
  revealWordToStealingTeamGuessers: false,
  pointsPerCorrect: 1,
  bonusPointForDrawingTeamOnGuess: false,
  allowWordRepetition: false,
  previewAvailability: 'before_timer',
  maxRounds: 6,
  soundEnabled: true,
};

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSettings(settings: GameSettings): ValidationResult {
  const errors: string[] = [];

  if (!settings.teams || settings.teams.length < 2 || settings.teams.length > 4) {
    errors.push('Please configure between 2 and 4 teams.');
  } else {
    const trimmedNames = settings.teams.map((t) => t.name.trim());
    if (trimmedNames.some((n) => n.length === 0)) {
      errors.push('All teams must have a non-empty name.');
    }
    if (trimmedNames.some((n) => n.length > 28)) {
      errors.push('Team names must be 28 characters or fewer.');
    }
    const uniqueNames = new Set(trimmedNames.map((n) => n.toLowerCase()));
    if (uniqueNames.size !== trimmedNames.length) {
      errors.push('Each team must have a distinct name.');
    }
  }

  if (
    !Number.isFinite(settings.timerDurationSeconds) ||
    settings.timerDurationSeconds < 10 ||
    settings.timerDurationSeconds > 600
  ) {
    errors.push('Timer duration must be between 10 and 600 seconds.');
  }

  if (
    !Number.isFinite(settings.stealDurationSeconds) ||
    settings.stealDurationSeconds < 5 ||
    settings.stealDurationSeconds > 120
  ) {
    errors.push('Steal timer duration must be between 5 and 120 seconds.');
  }

  if (
    !Number.isFinite(settings.pointsPerCorrect) ||
    settings.pointsPerCorrect < 1 ||
    settings.pointsPerCorrect > 10
  ) {
    errors.push('Points per correct answer must be between 1 and 10.');
  }

  if (
    !Number.isFinite(settings.maxRounds) ||
    settings.maxRounds < 1 ||
    settings.maxRounds > 50
  ) {
    errors.push('Maximum rounds must be between 1 and 50.');
  }

  if (!settings.categories || settings.categories.length === 0) {
    errors.push('Select at least one word category.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function createRoundState(params: {
  roundNumber: number;
  drawingTeamIndex: number;
  totalTeams: number;
  settings: GameSettings;
}): RoundState {
  const { roundNumber, drawingTeamIndex, totalTeams, settings } = params;
  const safeTotal = Math.max(2, totalTeams);
  const safeDrawingIdx = drawingTeamIndex % safeTotal;
  // The drawing team is also the primary guessing team (remaining members of the drawing team guess first)
  const initialGuessingIdx = safeDrawingIdx;

  const stealQueue = buildStealQueue(
    safeTotal,
    safeDrawingIdx,
    initialGuessingIdx,
    settings.stealRuleMode
  );

  return {
    roundNumber,
    drawingTeamIndex: safeDrawingIdx,
    initialGuessingTeamIndex: initialGuessingIdx,
    activeGuessingTeamIndex: initialGuessingIdx,
    stealQueueTeamIndices: stealQueue,
    currentWord: null,
    wordLocked: false,
    wordRevealedToDrawer: true,
    timerStartedAt: null,
    timerEndsAt: null,
    timerTotalSeconds: settings.timerDurationSeconds,
    remainingSecondsOnPause: null,
    roundResolved: false,
    lastResult: null,
  };
}

export function createInitialGameState(
  customSettings: GameSettings = DEFAULT_SETTINGS,
  now: number = 0
): GameState {
  const teams: Team[] = customSettings.teams.map((t, index) => ({
    id: t.id || `team-${index + 1}`,
    name: t.name.trim() || `Team ${String.fromCharCode(65 + index)}`,
    score: 0,
    color: t.color || TEAM_COLORS[index % TEAM_COLORS.length],
  }));

  return {
    phase: 'setup',
    settings: {
      ...customSettings,
      teams: teams.map(({ id, name, color }) => ({ id, name, color })),
    },
    teams,
    currentRound: createRoundState({
      roundNumber: 1,
      drawingTeamIndex: 0,
      totalTeams: teams.length,
      settings: customSettings,
    }),
    usedWordIds: [],
    lastWordId: null,
    roundHistory: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Starts a new game from the setup screen, initializing all team scores to 0
 * and advancing to the 'word_selected' phase (Step 1 & Step 2).
 */
export function startGame(
  state: GameState,
  newSettings?: GameSettings,
  now: number = Date.now()
): GameState {
  const settingsToUse = newSettings ?? state.settings;
  const validation = validateSettings(settingsToUse);
  if (!validation.valid) {
    throw new Error(validation.errors.join(' '));
  }

  const teams: Team[] = settingsToUse.teams.map((t, idx) => ({
    id: t.id || `team-${idx + 1}`,
    name: t.name.trim(),
    score: 0,
    color: t.color || TEAM_COLORS[idx % TEAM_COLORS.length],
  }));

  return {
    ...state,
    phase: 'word_selected',
    settings: {
      ...settingsToUse,
      teams: teams.map(({ id, name, color }) => ({ id, name, color })),
    },
    teams,
    currentRound: createRoundState({
      roundNumber: 1,
      drawingTeamIndex: 0,
      totalTeams: teams.length,
      settings: settingsToUse,
    }),
    roundHistory: [],
    updatedAt: now,
  };
}

/**
 * Generates or replaces the secret word for the current round BEFORE "Done!" is clicked.
 * Disabled once the word is locked or during an active round.
 */
export function selectRandomWordForRound(
  state: GameState,
  now: number = Date.now(),
  randomFn?: () => number
): GameState {
  if (
    state.phase !== 'word_selected' ||
    state.currentRound.wordLocked ||
    state.currentRound.roundResolved
  ) {
    return state;
  }

  const { word, updatedUsedWordIds } = generateWord({
    difficulty: state.settings.difficulty,
    categories: state.settings.categories,
    usedWordIds: state.usedWordIds,
    lastWordId: state.lastWordId,
    allowWordRepetition: state.settings.allowWordRepetition,
    randomFn,
  });

  return {
    ...state,
    usedWordIds: updatedUsedWordIds,
    lastWordId: word.id,
    currentRound: {
      ...state.currentRound,
      currentWord: word,
      wordRevealedToDrawer: true,
    },
    updatedAt: now,
  };
}

/**
 * Helper to compute timer start and end timestamps.
 */
export function startTimer(
  durationSeconds: number,
  now: number = Date.now()
): {
  timerStartedAt: number;
  timerEndsAt: number;
  timerTotalSeconds: number;
} {
  const safeSeconds = Math.max(1, Math.floor(durationSeconds));
  return {
    timerStartedAt: now,
    timerEndsAt: now + safeSeconds * 1000,
    timerTotalSeconds: safeSeconds,
  };
}

/**
 * Triggered ONLY when the drawing player clicks "I Know This Word — Done!".
 * - Confirms a word exists
 * - Locks the selected word for the current round
 * - Prevents repeated clicks from starting multiple timers
 * - Starts preparation countdown (if configured) or main drawing timer immediately
 */
export function startRound(
  state: GameState,
  now: number = Date.now()
): GameState {
  if (state.phase !== 'word_selected') {
    return state;
  }

  if (!state.currentRound.currentWord) {
    return state;
  }

  if (state.currentRound.wordLocked || state.currentRound.timerEndsAt !== null) {
    return state;
  }

  const hasPrep = state.settings.prepTimeSeconds > 0;
  const targetPhase = hasPrep ? 'preparation' : 'drawing';
  const duration = hasPrep
    ? state.settings.prepTimeSeconds
    : state.settings.timerDurationSeconds;

  const timerProps = startTimer(duration, now);

  return {
    ...state,
    phase: targetPhase,
    currentRound: {
      ...state.currentRound,
      wordLocked: true,
      // Auto-hide the secret word on screen when the round timer starts so nearby guessers don't peek
      wordRevealedToDrawer: false,
      ...timerProps,
    },
    updatedAt: now,
  };
}

/**
 * Transitions from optional preparation phase into active drawing phase.
 */
export function beginActiveDrawingAfterPrep(
  state: GameState,
  now: number = Date.now()
): GameState {
  if (state.phase !== 'preparation') {
    return state;
  }

  const timerProps = startTimer(state.settings.timerDurationSeconds, now);

  return {
    ...state,
    phase: 'drawing',
    currentRound: {
      ...state.currentRound,
      ...timerProps,
    },
    updatedAt: now,
  };
}

/**
 * Toggles whether the secret word is currently visible or masked on the screen.
 */
export function toggleSecretWordVisibility(
  state: GameState,
  forceValue?: boolean
): GameState {
  const nextVal =
    typeof forceValue === 'boolean'
      ? forceValue
      : !state.currentRound.wordRevealedToDrawer;

  return {
    ...state,
    currentRound: {
      ...state.currentRound,
      wordRevealedToDrawer: nextVal,
    },
  };
}

/**
 * Single, idempotent round-resolution function.
 * Guarantees that a round finishes exactly once and points are never awarded twice,
 * even if timer expiration and button clicks happen simultaneously.
 */
export function resolveRound(
  state: GameState,
  params: {
    outcomeType: RoundOutcomeType;
    winningTeamIndex: number | null;
    now?: number;
  }
): GameState {
  const { outcomeType, winningTeamIndex, now = Date.now() } = params;

  // Guard: only active rounds that haven't been resolved can be resolved
  if (
    state.currentRound.roundResolved ||
    (state.phase !== 'drawing' && state.phase !== 'stealing' && state.phase !== 'preparation')
  ) {
    return state;
  }

  const word = state.currentRound.currentWord;
  if (!word) {
    return state;
  }

  const remainingMs = state.currentRound.timerEndsAt
    ? Math.max(0, state.currentRound.timerEndsAt - now)
    : 0;
  const timeRemainingSeconds = Math.ceil(remainingMs / 1000);

  const { updatedTeams, roundResult } = createRoundResolution({
    roundNumber: state.currentRound.roundNumber,
    word,
    teams: state.teams,
    drawingTeamIndex: state.currentRound.drawingTeamIndex,
    initialGuessingTeamIndex: state.currentRound.initialGuessingTeamIndex,
    winningTeamIndex,
    outcomeType,
    settings: state.settings,
    timeRemainingSeconds,
    now,
  });

  return {
    ...state,
    phase: 'round_result',
    teams: updatedTeams,
    currentRound: {
      ...state.currentRound,
      roundResolved: true,
      wordRevealedToDrawer: true, // Reveal word after round ends
      timerStartedAt: null,
      timerEndsAt: null,
      lastResult: roundResult,
    },
    roundHistory: [...state.roundHistory, roundResult],
    updatedAt: now,
  };
}

/**
 * Begins the steal opportunity phase when the initial guessing team fails or passes
 * (Scenario B & Scenario D).
 * If steal is disabled or no teams remain in the steal queue, ends the round with 0 points (Scenario C).
 */
export function beginStealPhase(
  state: GameState,
  now: number = Date.now()
): GameState {
  if (state.currentRound.roundResolved) {
    return state;
  }

  if (state.phase !== 'drawing' && state.phase !== 'stealing') {
    return state;
  }

  const queue = state.currentRound.stealQueueTeamIndices;

  if (queue.length === 0 || state.settings.stealRuleMode === 'disabled') {
    return resolveRound(state, {
      outcomeType: 'nobody_guessed',
      winningTeamIndex: null,
      now,
    });
  }

  const [nextStealingTeamIndex, ...remainingQueue] = queue;
  const timerProps = startTimer(state.settings.stealDurationSeconds, now);

  // Only reveal the word during steal if explicitly configured in settings
  const shouldRevealWord = Boolean(
    state.settings.revealWordToStealingTeamGuessers
  );

  return {
    ...state,
    phase: 'stealing',
    currentRound: {
      ...state.currentRound,
      activeGuessingTeamIndex: nextStealingTeamIndex,
      stealQueueTeamIndices: remainingQueue,
      wordRevealedToDrawer: shouldRevealWord,
      ...timerProps,
    },
    updatedAt: now,
  };
}

/**
 * Handles when the current guessing or stealing team scores a Correct Guess.
 */
export function handleCorrectGuess(
  state: GameState,
  now: number = Date.now()
): GameState {
  if (state.currentRound.roundResolved) {
    return state;
  }

  if (state.phase === 'drawing') {
    return resolveRound(state, {
      outcomeType: 'guessed_by_initial_team',
      winningTeamIndex: state.currentRound.initialGuessingTeamIndex,
      now,
    });
  }

  if (state.phase === 'stealing') {
    return resolveRound(state, {
      outcomeType: 'guessed_by_steal_team',
      winningTeamIndex: state.currentRound.activeGuessingTeamIndex,
      now,
    });
  }

  return state;
}

/**
 * Handles when the active guessing team cannot guess ("Nobody Guessed It" / "Pass to Steal")
 * or when the timer expires.
 * - During 'drawing': starts steal phase if eligible teams exist, otherwise ends round with 0 points.
 * - During 'stealing' when timer expires: ends round with 0 points per Section 8 ("When time expires during a steal phase: Award no points and end the round").
 * - During 'stealing' when a stealing team manually passes and another team is in queue (3-4 team games): advances to next team in steal queue, or ends round with 0 points.
 */
export function endRoundOrSteal(
  state: GameState,
  reason: 'manual_pass' | 'timer_expired',
  now: number = Date.now()
): GameState {
  if (state.currentRound.roundResolved) {
    return state;
  }

  if (state.phase === 'drawing') {
    return beginStealPhase(state, now);
  }

  if (state.phase === 'stealing') {
    if (
      reason === 'manual_pass' &&
      state.currentRound.stealQueueTeamIndices.length > 0
    ) {
      return beginStealPhase(state, now);
    }

    return resolveRound(state, {
      outcomeType: 'nobody_guessed',
      winningTeamIndex: null,
      now,
    });
  }

  return state;
}

/**
 * Explicit alias for ending the round immediately with zero points.
 */
export function endRound(
  state: GameState,
  now: number = Date.now()
): GameState {
  return resolveRound(state, {
    outcomeType: 'nobody_guessed',
    winningTeamIndex: null,
    now,
  });
}

/**
 * Advances to the next round, rotating the active drawing team in turn order.
 * If all configured rounds are complete, transitions to 'game_over'.
 */
export function startNextRound(
  state: GameState,
  now: number = Date.now()
): GameState {
  if (state.phase !== 'round_result') {
    return state;
  }

  const nextRoundNumber = state.currentRound.roundNumber + 1;

  if (nextRoundNumber > state.settings.maxRounds) {
    return {
      ...state,
      phase: 'game_over',
      updatedAt: now,
    };
  }

  const nextDrawingTeamIndex =
    (state.currentRound.drawingTeamIndex + 1) % state.teams.length;

  return {
    ...state,
    phase: 'word_selected',
    currentRound: createRoundState({
      roundNumber: nextRoundNumber,
      drawingTeamIndex: nextDrawingTeamIndex,
      totalTeams: state.teams.length,
      settings: state.settings,
    }),
    updatedAt: now,
  };
}

/**
 * Resets scores and round state.
 * - mode === 'play_again': keeps current teams & settings, resets scores to 0, starts Round 1 immediately.
 * - mode === 'new_game_setup': returns to the 'setup' screen while preserving usedWordIds or clearing if desired.
 */
export function resetGame(
  state: GameState,
  mode: 'play_again' | 'new_game_setup' = 'new_game_setup',
  clearUsedWords: boolean = false,
  now: number = Date.now()
): GameState {
  const zeroedTeams = state.teams.map((t) => ({
    ...t,
    score: 0,
  }));

  const nextRound = createRoundState({
    roundNumber: 1,
    drawingTeamIndex: 0,
    totalTeams: zeroedTeams.length,
    settings: state.settings,
  });

  return {
    ...state,
    phase: mode === 'play_again' ? 'word_selected' : 'setup',
    teams: zeroedTeams,
    currentRound: nextRound,
    roundHistory: [],
    usedWordIds: clearUsedWords ? [] : state.usedWordIds,
    updatedAt: now,
  };
}

/**
 * Updates game settings (including Main Guessing timer and Steal Chance timer)
 * while preserving current scores and round progress when possible.
 * Any new round (or a round currently in 'word_selected' before the timer starts)
 * immediately uses the updated timer durations.
 */
export function updateGameSettings(
  state: GameState,
  newSettings: GameSettings,
  now: number = Date.now()
): GameState {
  const validation = validateSettings(newSettings);
  if (!validation.valid) {
    throw new Error(validation.errors.join(' '));
  }

  // Update team names/colors while preserving existing scores when team count matches
  const updatedTeams: Team[] = newSettings.teams.map((t, idx) => {
    const existing = state.teams[idx];
    return {
      id: existing?.id || t.id || `team-${idx + 1}`,
      name: t.name.trim(),
      score: existing ? existing.score : 0,
      color: t.color || TEAM_COLORS[idx % TEAM_COLORS.length],
    };
  });

  const normalizedSettings: GameSettings = {
    ...newSettings,
    teams: updatedTeams.map(({ id, name, color }) => ({ id, name, color })),
  };

  // If the round hasn't started its countdown yet, update timerTotalSeconds and stealQueue immediately
  const updatedRound: RoundState =
    state.phase === 'word_selected'
      ? {
          ...state.currentRound,
          timerTotalSeconds: normalizedSettings.timerDurationSeconds,
          stealQueueTeamIndices: buildStealQueue(
            updatedTeams.length,
            state.currentRound.drawingTeamIndex % updatedTeams.length,
            state.currentRound.drawingTeamIndex % updatedTeams.length,
            normalizedSettings.stealRuleMode
          ),
        }
      : state.currentRound;

  return {
    ...state,
    settings: normalizedSettings,
    teams: updatedTeams,
    currentRound: updatedRound,
    updatedAt: now,
  };
}

