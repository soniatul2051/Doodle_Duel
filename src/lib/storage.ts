import {
  DrawingPreviewData,
  GameSettings,
  GameState,
} from '@/types/game';
import {
  createInitialGameState,
  DEFAULT_SETTINGS,
  validateSettings,
} from '@/lib/game-engine';
import { buildStealQueue } from '@/lib/scoring';

export const PREVIEW_CACHE_VERSION = 'v2';
export const PREVIEW_ILLUSTRATION_STYLE = 'cartoon-pictionary';

const STORAGE_KEYS = {
  GAME_STATE: 'doodle_duel_game_state_v2',
  SETTINGS: 'doodle_duel_settings_v2',
  PREVIEW_CACHE: 'doodle_duel_preview_cache_v2',
} as const;

const MAX_CACHED_PREVIEWS = 50;

export interface PreviewCacheKeyParams {
  word: string;
  category?: string;
  style?: string;
  version?: string;
}

/**
 * Builds a deterministic, collision-free cache key that includes:
 * - normalized word
 * - normalized category (disambiguating homographs such as "bat" in Animals vs Sports)
 * - illustration style
 * - prompt/model cache version
 */
export function buildPreviewCacheKey({
  word,
  category = 'General',
  style = PREVIEW_ILLUSTRATION_STYLE,
  version = PREVIEW_CACHE_VERSION,
}: PreviewCacheKeyParams): string {
  const normWord = word.trim().toLowerCase().replace(/\s+/g, ' ');
  const normCategory = category.trim().toLowerCase().replace(/\s+/g, ' ');
  const normStyle = style.trim().toLowerCase();
  const normVersion = version.trim().toLowerCase();
  return `${normVersion}::${normStyle}::${normCategory}::${normWord}`;
}

/**
 * Storage repository abstraction so a remote or database-backed adapter
 * can replace localStorage later without changing UI components.
 */
export interface GameStorageAdapter {
  loadGameState(): GameState | null;
  saveGameState(state: GameState): void;
  clearGameState(): void;
  loadSettings(): GameSettings;
  saveSettings(settings: GameSettings): void;
  getCachedPreview(word: string, category?: string): DrawingPreviewData | null;
  saveCachedPreview(preview: DrawingPreviewData): void;
}

function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  );
}

export const localGameStorage: GameStorageAdapter = {
  loadGameState(): GameState | null {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as GameState;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        !Array.isArray(parsed.teams) ||
        !parsed.currentRound ||
        !parsed.settings
      ) {
        return null;
      }

      // Ensure round state adheres to the rule that the drawing team is the primary guessing team
      const safeDrawingIdx =
        parsed.currentRound.drawingTeamIndex % Math.max(2, parsed.teams.length);
      const isStealing = parsed.phase === 'stealing';

      const normalizedRound = {
        ...parsed.currentRound,
        drawingTeamIndex: safeDrawingIdx,
        initialGuessingTeamIndex: safeDrawingIdx,
        activeGuessingTeamIndex: isStealing
          ? parsed.currentRound.activeGuessingTeamIndex
          : safeDrawingIdx,
        stealQueueTeamIndices: isStealing
          ? parsed.currentRound.stealQueueTeamIndices
          : buildStealQueue(
              parsed.teams.length,
              safeDrawingIdx,
              safeDrawingIdx,
              parsed.settings.stealRuleMode
            ),
      };

      return {
        ...parsed,
        currentRound: normalizedRound,
      };
    } catch {
      return null;
    }
  },

  saveGameState(state: GameState): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.GAME_STATE,
        JSON.stringify(state)
      );
      window.localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(state.settings)
      );
    } catch {
      // Handle storage quota exceeded gracefully
    }
  },

  clearGameState(): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch {
      // Ignore errors
    }
  },

  loadSettings(): GameSettings {
    if (!isBrowser()) return DEFAULT_SETTINGS;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<GameSettings>;
      const merged: GameSettings = {
        ...DEFAULT_SETTINGS,
        ...parsed,
        teams:
          Array.isArray(parsed.teams) && parsed.teams.length >= 2
            ? parsed.teams
            : DEFAULT_SETTINGS.teams,
        categories:
          Array.isArray(parsed.categories) && parsed.categories.length > 0
            ? parsed.categories
            : DEFAULT_SETTINGS.categories,
      };
      return validateSettings(merged).valid ? merged : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: GameSettings): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
    } catch {
      // Ignore quota errors
    }
  },

  getCachedPreview(
    word: string,
    category: string = 'General'
  ): DrawingPreviewData | null {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.PREVIEW_CACHE);
      if (!raw) return null;
      const map = JSON.parse(raw) as Record<string, DrawingPreviewData>;
      const key = buildPreviewCacheKey({ word, category });
      const entry = map[key];
      if (!entry) return null;

      // Verify the cached entry actually matches the requested word and category
      if (
        entry.word.trim().toLowerCase() !== word.trim().toLowerCase() ||
        !entry.imageUrl
      ) {
        return null;
      }

      return entry;
    } catch {
      return null;
    }
  },

  saveCachedPreview(preview: DrawingPreviewData): void {
    if (!isBrowser() || !preview.imageUrl) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.PREVIEW_CACHE);
      const map: Record<string, DrawingPreviewData> = raw
        ? (JSON.parse(raw) as Record<string, DrawingPreviewData>)
        : {};

      const key = buildPreviewCacheKey({
        word: preview.word,
        category: preview.category,
      });
      map[key] = preview;

      const entries = Object.entries(map);
      if (entries.length > MAX_CACHED_PREVIEWS) {
        entries.sort((a, b) => (b[1].cachedAt || 0) - (a[1].cachedAt || 0));
        const trimmed = Object.fromEntries(
          entries.slice(0, MAX_CACHED_PREVIEWS)
        );
        window.localStorage.setItem(
          STORAGE_KEYS.PREVIEW_CACHE,
          JSON.stringify(trimmed)
        );
      } else {
        window.localStorage.setItem(
          STORAGE_KEYS.PREVIEW_CACHE,
          JSON.stringify(map)
        );
      }
    } catch {
      try {
        const key = buildPreviewCacheKey({
          word: preview.word,
          category: preview.category,
        });
        window.localStorage.setItem(
          STORAGE_KEYS.PREVIEW_CACHE,
          JSON.stringify({ [key]: preview })
        );
      } catch {
        // Ignore
      }
    }
  },
};

export function loadOrInitializeGameState(): GameState {
  const savedState = localGameStorage.loadGameState();
  if (savedState) {
    return savedState;
  }
  const savedSettings = localGameStorage.loadSettings();
  return createInitialGameState(savedSettings);
}
