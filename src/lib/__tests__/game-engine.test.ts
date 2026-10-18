import { describe, expect, it } from 'vitest';
import {
  beginActiveDrawingAfterPrep,
  beginStealPhase,
  createInitialGameState,
  DEFAULT_SETTINGS,
  endRound,
  endRoundOrSteal,
  handleCorrectGuess,
  resetGame,
  resolveRound,
  selectRandomWordForRound,
  startGame,
  startNextRound,
  startRound,
  validateSettings,
} from '@/lib/game-engine';
import { determineWinners } from '@/lib/scoring';
import { generateWord, WORD_BANK } from '@/lib/words';
import {
  findLocalSvgIllustration,
  generateLocalSvgIllustration,
  hasExactLocalIllustration,
} from '@/lib/svg-illustrations';
import {
  buildWordIllustrationPrompt,
  classifyImageModel,
  generateWordIllustration,
  parseGeminiImageResponse,
} from '@/lib/gemini';
import { buildPreviewCacheKey } from '@/lib/storage';
import { calculateRemainingSeconds } from '@/lib/timer';

describe('Doodle Duel — Word Generator', () => {
  it('filters words by category and difficulty', () => {
    const result = generateWord({
      difficulty: 'easy',
      categories: ['Animals'],
      usedWordIds: [],
      lastWordId: null,
      allowWordRepetition: false,
    });

    expect(result.word.category).toBe('Animals');
    expect(result.word.difficulty).toBe('easy');
    expect(result.updatedUsedWordIds).toContain(result.word.id);
    expect(result.wasReset).toBe(false);
  });

  it('prevents duplicate words in session and resets when eligible pool is exhausted', () => {
    const easyAnimals = WORD_BANK.filter(
      (w) => w.category === 'Animals' && w.difficulty === 'easy'
    );
    expect(easyAnimals.length).toBeGreaterThan(1);

    let usedIds: string[] = [];
    let lastId: string | null = null;
    const seenInFirstCycle = new Set<string>();

    for (let i = 0; i < easyAnimals.length; i++) {
      const res = generateWord({
        difficulty: 'easy',
        categories: ['Animals'],
        usedWordIds: usedIds,
        lastWordId: lastId,
        allowWordRepetition: false,
      });
      seenInFirstCycle.add(res.word.id);
      usedIds = res.updatedUsedWordIds;
      lastId = res.word.id;
      expect(res.wasReset).toBe(false);
    }

    expect(seenInFirstCycle.size).toBe(easyAnimals.length);

    const afterExhaustion = generateWord({
      difficulty: 'easy',
      categories: ['Animals'],
      usedWordIds: usedIds,
      lastWordId: lastId,
      allowWordRepetition: false,
    });

    expect(afterExhaustion.wasReset).toBe(true);
    expect(afterExhaustion.word.id).not.toBe(lastId);
  });
});

describe('Doodle Duel — Team-Based Guessing & Steal Logic', () => {
  it('validates game settings properly', () => {
    expect(validateSettings(DEFAULT_SETTINGS).valid).toBe(true);
    expect(
      validateSettings({
        ...DEFAULT_SETTINGS,
        teams: [{ id: '1', name: 'Solo', color: '#000' }],
      }).valid
    ).toBe(false);
    expect(
      validateSettings({
        ...DEFAULT_SETTINGS,
        teams: [
          { id: '1', name: 'Same', color: '#000' },
          { id: '2', name: 'same', color: '#fff' },
        ],
      }).valid
    ).toBe(false);
  });

  it('does NOT start timer when word is generated; starts ONLY when Done! is clicked', () => {
    let state = createInitialGameState(DEFAULT_SETTINGS, 1000);
    state = startGame(state, DEFAULT_SETTINGS, 1000);

    expect(state.phase).toBe('word_selected');
    expect(state.currentRound.timerEndsAt).toBeNull();

    state = selectRandomWordForRound(state, 1500);
    expect(state.currentRound.currentWord).not.toBeNull();
    expect(state.phase).toBe('word_selected');
    expect(state.currentRound.wordLocked).toBe(false);
    expect(state.currentRound.timerEndsAt).toBeNull();

    const started = startRound(state, 2000);
    expect(started.phase).toBe('drawing');
    expect(started.currentRound.wordLocked).toBe(true);
    expect(started.currentRound.timerStartedAt).toBe(2000);
    expect(started.currentRound.timerEndsAt).toBe(2000 + 60 * 1000);

    const duplicateClick = startRound(started, 5000);
    expect(duplicateClick.currentRound.timerEndsAt).toBe(2000 + 60 * 1000);

    const wordBefore = started.currentRound.currentWord?.id;
    const tryReplace = selectRandomWordForRound(started, 6000);
    expect(tryReplace.currentRound.currentWord?.id).toBe(wordBefore);
  });

  it('supports optional preparation period before active drawing countdown', () => {
    const customSettings = { ...DEFAULT_SETTINGS, prepTimeSeconds: 3 };
    let state = startGame(
      createInitialGameState(customSettings),
      customSettings,
      1000
    );
    state = selectRandomWordForRound(state, 1100);
    state = startRound(state, 2000);

    expect(state.phase).toBe('preparation');
    expect(state.currentRound.timerEndsAt).toBe(2000 + 3000);

    state = beginActiveDrawingAfterPrep(state, 5000);
    expect(state.phase).toBe('drawing');
    expect(state.currentRound.timerEndsAt).toBe(5000 + 60 * 1000);
  });

  it("Team A's turn: Team A draws AND guesses first -> awards +1 to Team A, 0 to Team B", () => {
    let state = startGame(createInitialGameState(), DEFAULT_SETTINGS, 1000);
    state = selectRandomWordForRound(state, 1100);
    state = startRound(state, 2000);

    // Team A (index 0) is BOTH the drawing team AND the primary guessing team
    expect(state.currentRound.drawingTeamIndex).toBe(0);
    expect(state.currentRound.initialGuessingTeamIndex).toBe(0);
    expect(state.currentRound.activeGuessingTeamIndex).toBe(0);
    // Team B (index 1) is only in the steal queue
    expect(state.currentRound.stealQueueTeamIndices).toEqual([1]);

    // Team A guesses correctly within the timer
    state = handleCorrectGuess(state, 15000);

    expect(state.phase).toBe('round_result');
    expect(state.teams[0].score).toBe(1); // Team A gets +1 point
    expect(state.teams[1].score).toBe(0); // Team B gets 0 points
    expect(state.currentRound.lastResult?.outcomeType).toBe(
      'guessed_by_initial_team'
    );
    expect(state.currentRound.lastResult?.winningTeamId).toBe(
      state.teams[0].id
    );
  });

  it("If Team A cannot guess: Team B gets steal opportunity -> Team B earns +1 if it guesses, or 0 if it fails", () => {
    let state = startGame(createInitialGameState(), DEFAULT_SETTINGS, 1000);
    state = selectRandomWordForRound(state, 1100);
    state = startRound(state, 2000);

    // Team A fails to guess -> transitions to steal phase for Team B (index 1)
    const stealState = endRoundOrSteal(state, 'manual_pass', 25000);

    expect(stealState.phase).toBe('stealing');
    expect(stealState.teams[0].score).toBe(0);
    expect(stealState.teams[1].score).toBe(0);
    expect(stealState.currentRound.activeGuessingTeamIndex).toBe(1); // Team B stealing!
    expect(stealState.currentRound.stealQueueTeamIndices).toEqual([]);
    expect(stealState.currentRound.timerEndsAt).toBe(25000 + 15 * 1000);

    // Case 1: Team B guesses correctly during steal phase -> Team B earns +1
    const teamBStolen = handleCorrectGuess(stealState, 30000);
    expect(teamBStolen.phase).toBe('round_result');
    expect(teamBStolen.teams[0].score).toBe(0);
    expect(teamBStolen.teams[1].score).toBe(1);
    expect(teamBStolen.currentRound.lastResult?.outcomeType).toBe(
      'guessed_by_steal_team'
    );

    // Case 2: Team B also fails (timer expires) -> 0 points awarded
    const nobodyScored = endRoundOrSteal(stealState, 'timer_expired', 41000);
    expect(nobodyScored.phase).toBe('round_result');
    expect(nobodyScored.teams[0].score).toBe(0);
    expect(nobodyScored.teams[1].score).toBe(0);
    expect(nobodyScored.currentRound.lastResult?.outcomeType).toBe(
      'nobody_guessed'
    );
  });

  it("Team B's turn (Round 2): Team B draws AND guesses first -> Team A gets steal opportunity if Team B fails", () => {
    let state = startGame(createInitialGameState(), DEFAULT_SETTINGS, 1000);
    // Complete Round 1 (Team A's turn)
    state = selectRandomWordForRound(state, 1100);
    state = startRound(state, 1200);
    state = handleCorrectGuess(state, 5000); // Team A +1 (score: 1 - 0)
    expect(state.teams[0].score).toBe(1);
    expect(state.teams[1].score).toBe(0);

    // Advance to Round 2 (Team B's turn)
    state = startNextRound(state, 6000);
    expect(state.currentRound.roundNumber).toBe(2);
    expect(state.currentRound.drawingTeamIndex).toBe(1); // Team B draws
    expect(state.currentRound.initialGuessingTeamIndex).toBe(1); // Team B guesses first
    expect(state.currentRound.activeGuessingTeamIndex).toBe(1);
    expect(state.currentRound.stealQueueTeamIndices).toEqual([0]); // Team A on steal standby

    state = selectRandomWordForRound(state, 6100);
    state = startRound(state, 6200);

    // Branch 1: Team B guesses its own word within timer -> Team B gets +1
    const teamBGuessed = handleCorrectGuess(state, 12000);
    expect(teamBGuessed.teams[1].score).toBe(1);
    expect(teamBGuessed.teams[0].score).toBe(1);

    // Branch 2: Team B fails (timer expires) -> Team A gets steal opportunity -> Team A steals +1
    const stealForTeamA = endRoundOrSteal(state, 'timer_expired', 66200);
    expect(stealForTeamA.phase).toBe('stealing');
    expect(stealForTeamA.currentRound.activeGuessingTeamIndex).toBe(0); // Team A stealing!

    const teamAStolen = handleCorrectGuess(stealForTeamA, 70000);
    expect(teamAStolen.phase).toBe('round_result');
    expect(teamAStolen.teams[0].score).toBe(2); // Team A earned Round 1 + stole Round 2
    expect(teamAStolen.teams[1].score).toBe(0);
  });

  it('3-team game: drawing team guesses first, opposing teams steal in turn order', () => {
    const threeTeamSettings = {
      ...DEFAULT_SETTINGS,
      teams: [
        { id: 't1', name: 'Team A', color: '#111' },
        { id: 't2', name: 'Team B', color: '#222' },
        { id: 't3', name: 'Team C', color: '#333' },
      ],
    };

    let state = startGame(
      createInitialGameState(threeTeamSettings),
      threeTeamSettings,
      1000
    );
    state = selectRandomWordForRound(state, 1100);
    state = startRound(state, 2000);

    // Team A (0) draws & guesses first; opposing steal queue is [1 (Team B), 2 (Team C)]
    expect(state.currentRound.drawingTeamIndex).toBe(0);
    expect(state.currentRound.initialGuessingTeamIndex).toBe(0);
    expect(state.currentRound.stealQueueTeamIndices).toEqual([1, 2]);

    // Team A misses -> Team B (1) gets first steal chance
    state = beginStealPhase(state, 10000);
    expect(state.phase).toBe('stealing');
    expect(state.currentRound.activeGuessingTeamIndex).toBe(1);

    // Team B passes -> Team C (2) gets next steal chance
    state = endRoundOrSteal(state, 'manual_pass', 15000);
    expect(state.phase).toBe('stealing');
    expect(state.currentRound.activeGuessingTeamIndex).toBe(2);

    // Team C guesses correctly -> +1 to Team C only
    state = handleCorrectGuess(state, 18000);
    expect(state.teams[0].score).toBe(0);
    expect(state.teams[1].score).toBe(0);
    expect(state.teams[2].score).toBe(1);
  });

  it('prevents double scoring from rapid clicks or simultaneous timer expiration', () => {
    let state = startGame(createInitialGameState(), DEFAULT_SETTINGS, 1000);
    state = selectRandomWordForRound(state, 1100);
    state = startRound(state, 2000);

    state = handleCorrectGuess(state, 10000);
    expect(state.teams[0].score).toBe(1);

    const afterSecondClick = handleCorrectGuess(state, 10050);
    const afterTimeout = endRoundOrSteal(
      afterSecondClick,
      'timer_expired',
      10100
    );
    const afterDirectResolve = resolveRound(afterTimeout, {
      outcomeType: 'guessed_by_initial_team',
      winningTeamIndex: 0,
      now: 10200,
    });

    expect(afterDirectResolve.teams[0].score).toBe(1);
    expect(afterDirectResolve.roundHistory.length).toBe(1);
  });

  it('transitions to game_over after maxRounds and resets cleanly', () => {
    const twoRoundSettings = { ...DEFAULT_SETTINGS, maxRounds: 2 };
    let state = startGame(
      createInitialGameState(twoRoundSettings),
      twoRoundSettings,
      1000
    );

    // Round 1: Team A scores
    state = selectRandomWordForRound(state, 1100);
    state = startRound(state, 1200);
    state = handleCorrectGuess(state, 5000);

    // Round 2: Team B fails, nobody steals
    state = startNextRound(state, 6000);
    state = selectRandomWordForRound(state, 6100);
    state = startRound(state, 6200);
    state = endRound(state, 9000);

    state = startNextRound(state, 10000);
    expect(state.phase).toBe('game_over');

    const { winners, isTie, highestScore } = determineWinners(state.teams);
    expect(isTie).toBe(false);
    expect(highestScore).toBe(1);
    expect(winners[0].name).toBe('Team A');

    const restarted = resetGame(state, 'play_again', false, 12000);
    expect(restarted.phase).toBe('word_selected');
    expect(restarted.teams.every((t) => t.score === 0)).toBe(true);
  });
});

describe('Doodle Duel — Drawing Preview System, Prompts, Caching & Fallbacks', () => {
  const REQUIRED_PREVIEW_WORDS: Array<{ word: string; category: string }> = [
    { word: 'Elephant', category: 'Animals' },
    { word: 'Bicycle', category: 'Objects' },
    { word: 'Apple', category: 'Food and Drinks' },
    { word: 'Helicopter', category: 'Objects' },
    { word: 'Dog', category: 'Animals' },
    { word: 'Toothbrush', category: 'Objects' },
    { word: 'Swimming', category: 'Actions' },
    { word: 'Firefighter', category: 'Professions' },
  ];

  it('provides distinct, exact local SVG illustrations for all 8 required words', async () => {
    const seenDataUris = new Set<string>();

    for (const item of REQUIRED_PREVIEW_WORDS) {
      expect(hasExactLocalIllustration(item.word, item.category)).toBe(true);
      const svgUri = findLocalSvgIllustration(item.word, item.category);
      expect(svgUri).not.toBeNull();
      expect(svgUri!.startsWith('data:image/svg+xml;utf8,')).toBe(true);
      seenDataUris.add(svgUri!);

      // Also verify generateWordIllustration returns exact fallback when no API key is set
      const preview = await generateWordIllustration(item);
      expect(preview.source).toBe('svg-fallback');
      expect(preview.imageUrl).toBe(svgUri);
      expect(preview.drawingSteps.length).toBeGreaterThanOrEqual(3);
    }

    // Every single one of the 8 words must have its own unique illustration (never a shared generic placeholder)
    expect(seenDataUris.size).toBe(REQUIRED_PREVIEW_WORDS.length);
  });

  it('disambiguates ambiguous words like "Bat" by category in both prompts and SVG fallbacks', () => {
    const animalBatPrompt = buildWordIllustrationPrompt({
      word: 'Bat',
      category: 'Animals',
    });
    const sportsBatPrompt = buildWordIllustrationPrompt({
      word: 'Bat',
      category: 'Sports',
    });

    expect(animalBatPrompt).toContain('nocturnal flying mammal');
    expect(sportsBatPrompt).toContain('wooden baseball or cricket');
    expect(animalBatPrompt).toContain('Do NOT include any written words');

    const animalBatSvg = findLocalSvgIllustration('Bat', 'Animals');
    const sportsBatSvg = findLocalSvgIllustration('Bat', 'Sports');
    expect(animalBatSvg).not.toBeNull();
    expect(sportsBatSvg).not.toBeNull();
    expect(animalBatSvg).not.toBe(sportsBatSvg);
  });

  it('returns null / unavailable instead of an unrelated drawing when a word has no exact fallback and AI is unavailable', async () => {
    expect(
      generateLocalSvgIllustration('NonExistentGadget999', 'Objects')
    ).toBeNull();

    const res = await generateWordIllustration({
      word: 'NonExistentGadget999',
      category: 'Objects',
    });
    expect(res.source).toBe('unavailable');
    expect(res.imageUrl).toBeNull();
    expect(res.error).toBeDefined();
  });

  it('verifies image-generation models and rejects text-only models', () => {
    expect(classifyImageModel('imagen-4.0-generate-001').kind).toBe('imagen');
    expect(classifyImageModel('gemini-2.5-flash-image-preview').kind).toBe(
      'gemini-image'
    );
    expect(classifyImageModel('gemini-1.5-pro').kind).toBe('unsupported');
    expect(classifyImageModel('gemini-2.0-flash-lite').kind).toBe(
      'unsupported'
    );
  });

  it('parses both Imagen generateImages and Gemini generateContent image responses accurately', () => {
    const fakeBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const imagenParsed = parseGeminiImageResponse({
      generatedImages: [
        {
          image: {
            imageBytes: fakeBase64,
            mimeType: 'image/png',
          },
        },
      ],
    });
    expect(imagenParsed).toEqual({
      dataUri: `data:image/png;base64,${fakeBase64}`,
      mimeType: 'image/png',
    });

    const geminiParsed = parseGeminiImageResponse({
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  data: fakeBase64,
                  mimeType: 'image/webp',
                },
              },
            ],
          },
        },
      ],
    });
    expect(geminiParsed).toEqual({
      dataUri: `data:image/webp;base64,${fakeBase64}`,
      mimeType: 'image/webp',
    });

    expect(parseGeminiImageResponse({})).toBeNull();
  });

  it('builds collision-free cache keys incorporating word, category, style, and version', () => {
    const keyAnimalBat = buildPreviewCacheKey({
      word: 'Bat',
      category: 'Animals',
    });
    const keySportsBat = buildPreviewCacheKey({
      word: 'Bat',
      category: 'Sports',
    });
    const keyElephant = buildPreviewCacheKey({
      word: 'Elephant',
      category: 'Animals',
    });

    expect(keyAnimalBat).not.toBe(keySportsBat);
    expect(keyAnimalBat).not.toBe(keyElephant);
    expect(calculateRemainingSeconds(10000, 4500)).toBe(6);
  });
});
