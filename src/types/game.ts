export type WordDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export type SpecificWordDifficulty = 'easy' | 'medium' | 'hard';

export type WordCategory =
  | 'Animals'
  | 'Food and Drinks'
  | 'Objects'
  | 'Movies and Characters'
  | 'Places'
  | 'Sports'
  | 'Nature'
  | 'Actions'
  | 'Professions'
  | 'Technology'
  | 'Random/Mixed';

export type SpecificWordCategory = Exclude<WordCategory, 'Random/Mixed'>;

export type PreviewAvailability = 'before_timer' | 'always' | 'disabled';

export type StealRuleMode = 'all_teams_including_drawing_team' | 'other_teams_only' | 'disabled';

export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface WordEntry {
  id: string;
  word: string;
  category: SpecificWordCategory;
  difficulty: SpecificWordDifficulty;
  hint: string;
  drawingDescription: string;
  drawingSteps: string[];
}

export interface GameSettings {
  teams: { id: string; name: string; color: string }[];
  difficulty: WordDifficulty;
  categories: WordCategory[];
  timerDurationSeconds: number;
  prepTimeSeconds: number;
  stealDurationSeconds: number;
  stealRuleMode: StealRuleMode;
  revealWordToStealingTeamGuessers: boolean;
  pointsPerCorrect: number;
  bonusPointForDrawingTeamOnGuess: boolean;
  allowWordRepetition: boolean;
  previewAvailability: PreviewAvailability;
  maxRounds: number;
  soundEnabled: boolean;
}

export type GamePhase =
  | 'setup'
  | 'word_selected'
  | 'preparation'
  | 'drawing'
  | 'stealing'
  | 'round_result'
  | 'game_over';

export type RoundOutcomeType =
  | 'guessed_by_initial_team'
  | 'guessed_by_steal_team'
  | 'nobody_guessed';

export interface RoundResult {
  roundNumber: number;
  word: WordEntry;
  drawingTeamId: string;
  initialGuessingTeamId: string;
  winningTeamId: string | null;
  pointsAwarded: number;
  drawingTeamBonusAwarded: number;
  outcomeType: RoundOutcomeType;
  timeRemainingSeconds: number;
  timestamp: number;
}

export interface RoundState {
  roundNumber: number;
  drawingTeamIndex: number;
  initialGuessingTeamIndex: number;
  activeGuessingTeamIndex: number;
  stealQueueTeamIndices: number[];
  currentWord: WordEntry | null;
  wordLocked: boolean;
  wordRevealedToDrawer: boolean;
  timerStartedAt: number | null;
  timerEndsAt: number | null;
  timerTotalSeconds: number;
  remainingSecondsOnPause: number | null;
  roundResolved: boolean;
  lastResult: RoundResult | null;
}

export interface GameState {
  phase: GamePhase;
  settings: GameSettings;
  teams: Team[];
  currentRound: RoundState;
  usedWordIds: string[];
  lastWordId: string | null;
  roundHistory: RoundResult[];
  createdAt: number;
  updatedAt: number;
}

export interface DrawingPreviewData {
  word: string;
  category: string;
  imageUrl: string;
  source: 'gemini' | 'svg-fallback';
  modelUsed?: string;
  drawingSteps: string[];
  drawingDescription: string;
  cachedAt: number;
  notice?: string;
}
