import {
  GameSettings,
  RoundOutcomeType,
  RoundResult,
  StealRuleMode,
  Team,
  WordEntry,
} from '@/types/game';

/**
 * Computes the ordered list of opposing team indices eligible to steal
 * after the drawing/primary-guessing team fails to guess within the timer.
 *
 * Correct Pictionary Team Rules:
 * - On Team A's turn (drawingTeamIndex = 0), one member of Team A draws and the
 *   remaining members of Team A are the primary guessing team (initialGuessingTeamIndex = 0).
 * - Opposing teams (e.g. Team B, index 1) may ONLY guess during the steal phase.
 * - Therefore, the steal queue contains the opposing team(s) in turn order and
 *   NEVER includes the drawing team.
 */
export function buildStealQueue(
  totalTeams: number,
  drawingTeamIndex: number,
  _initialGuessingTeamIndex: number,
  stealRuleMode: StealRuleMode
): number[] {
  if (stealRuleMode === 'disabled' || totalTeams < 2) {
    return [];
  }

  const queue: number[] = [];

  // Add all opposing teams in turn order after the drawing team
  for (let offset = 1; offset < totalTeams; offset++) {
    const idx = (drawingTeamIndex + offset) % totalTeams;
    if (idx !== drawingTeamIndex) {
      queue.push(idx);
    }
  }

  return queue;
}

/**
 * Pure helper to award points to a single winning team.
 * - When outcomeType === 'guessed_by_initial_team', the drawing/primary-guessing team earns +1 point (or pointsPerCorrect).
 * - When outcomeType === 'guessed_by_steal_team', the stealing opposing team earns +1 point (or pointsPerCorrect).
 * - When outcomeType === 'nobody_guessed', no team earns any points (0 points).
 * Never mutates input array; guarantees a team cannot receive multiple primary points for the same word.
 */
export function awardPoints(params: {
  teams: Team[];
  winningTeamId: string | null;
  drawingTeamId: string;
  pointsPerCorrect: number;
  bonusPointForDrawingTeamOnGuess: boolean;
  outcomeType: RoundOutcomeType;
}): {
  updatedTeams: Team[];
  pointsAwarded: number;
  drawingTeamBonusAwarded: number;
} {
  const {
    teams,
    winningTeamId,
    drawingTeamId,
    pointsPerCorrect,
    bonusPointForDrawingTeamOnGuess,
    outcomeType,
  } = params;

  if (!winningTeamId || outcomeType === 'nobody_guessed') {
    return {
      updatedTeams: teams.map((t) => ({ ...t })),
      pointsAwarded: 0,
      drawingTeamBonusAwarded: 0,
    };
  }

  const validPoints = Math.max(1, Math.floor(pointsPerCorrect));
  const shouldGiveDrawingBonus =
    bonusPointForDrawingTeamOnGuess &&
    outcomeType === 'guessed_by_initial_team' &&
    winningTeamId !== drawingTeamId;

  const drawingTeamBonusAwarded = shouldGiveDrawingBonus ? 1 : 0;

  const updatedTeams = teams.map((team) => {
    if (team.id === winningTeamId) {
      return {
        ...team,
        score: team.score + validPoints,
      };
    }
    if (shouldGiveDrawingBonus && team.id === drawingTeamId) {
      return {
        ...team,
        score: team.score + drawingTeamBonusAwarded,
      };
    }
    return { ...team };
  });

  return {
    updatedTeams,
    pointsAwarded: validPoints,
    drawingTeamBonusAwarded,
  };
}

/**
 * Creates a standardized RoundResult record and updates team scores via awardPoints.
 */
export function createRoundResolution(params: {
  roundNumber: number;
  word: WordEntry;
  teams: Team[];
  drawingTeamIndex: number;
  initialGuessingTeamIndex: number;
  winningTeamIndex: number | null;
  outcomeType: RoundOutcomeType;
  settings: GameSettings;
  timeRemainingSeconds: number;
  now?: number;
}): {
  updatedTeams: Team[];
  roundResult: RoundResult;
} {
  const {
    roundNumber,
    word,
    teams,
    drawingTeamIndex,
    initialGuessingTeamIndex,
    winningTeamIndex,
    outcomeType,
    settings,
    timeRemainingSeconds,
    now = Date.now(),
  } = params;

  const drawingTeam = teams[drawingTeamIndex];
  const initialGuessingTeam = teams[initialGuessingTeamIndex];
  const winningTeam =
    winningTeamIndex !== null && teams[winningTeamIndex]
      ? teams[winningTeamIndex]
      : null;

  const { updatedTeams, pointsAwarded, drawingTeamBonusAwarded } = awardPoints({
    teams,
    winningTeamId: winningTeam ? winningTeam.id : null,
    drawingTeamId: drawingTeam.id,
    pointsPerCorrect: settings.pointsPerCorrect,
    bonusPointForDrawingTeamOnGuess: settings.bonusPointForDrawingTeamOnGuess,
    outcomeType,
  });

  const roundResult: RoundResult = {
    roundNumber,
    word,
    drawingTeamId: drawingTeam.id,
    initialGuessingTeamId: initialGuessingTeam.id,
    winningTeamId: winningTeam ? winningTeam.id : null,
    pointsAwarded,
    drawingTeamBonusAwarded,
    outcomeType,
    timeRemainingSeconds: Math.max(0, Math.ceil(timeRemainingSeconds)),
    timestamp: now,
  };

  return {
    updatedTeams,
    roundResult,
  };
}

/**
 * Determines the winning team(s) at the end of the game.
 * Returns an array of teams tied for the highest score.
 */
export function determineWinners(teams: Team[]): {
  winners: Team[];
  isTie: boolean;
  highestScore: number;
} {
  if (teams.length === 0) {
    return { winners: [], isTie: false, highestScore: 0 };
  }

  const highestScore = Math.max(...teams.map((t) => t.score));
  const winners = teams.filter((t) => t.score === highestScore);

  return {
    winners,
    isTie: winners.length > 1,
    highestScore,
  };
}
