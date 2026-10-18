# Doodle Duel — Party Pictionary Word Generator

**Doodle Duel** is a full-stack Pictionary Word Generator and team scorekeeping web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide React**, and the **Google Gen AI SDK (`@google/genai`)**.

---

## Features Implemented

1. **Configurable Match Setup (`GameSetup`)**
   - **2 to 4 Teams**: Default `Team A` and `Team B`, customizable team names, distinct color badges, and scores initialized to `0`.
   - **Word Difficulty**: `Easy`, `Medium`, `Hard`, or `Mixed`.
   - **10+ Word Categories**: `Animals`, `Food and Drinks`, `Objects`, `Movies and Characters`, `Places`, `Sports`, `Nature`, `Actions`, `Professions`, `Technology`, and `Random/Mixed`.
   - **Timer Duration**: `30s`, `60s`, `90s`, `120s`, or any custom duration (`10–600s`), plus optional `3s` / `5s` preparation period.
   - **Customizable Rules**: Configurable steal timer (`15s` default), steal eligibility rules, points per correct answer (`1` default), duplicate-word prevention, and drawing preview availability (`Before Timer Starts Only`, `Available Anytime`, or `Disabled`).

2. **Categorized Random Word Generator (`src/lib/words.ts`)**
   - Curated family-friendly word bank across all 10 categories and 3 difficulty levels.
   - Each word entry includes the secret word, category, difficulty, optional hint, drawing description, and a 3-step quick sketch guide.
   - Prevents duplicate words within the current session, resets the eligible pool automatically if exhausted, and prevents selecting the same word twice consecutively.

3. **Complete Turn & Countdown Loop (`src/lib/game-engine.ts`, `src/lib/timer.ts`)**
   - **Step 1 & 2**: Displays the active **Drawing Team** and **Guessing Team**, with a prominent **Generate Word** button.
   - **Step 3**: Generating a word does **not** start the clock. The countdown timer starts only when the drawing player clicks **"I Know This Word — Done!"**, locking the word and hiding it on screen so guessing teams cannot peek.
   - **Timestamp-Based Countdown**: Uses `Date.now()` delta calculations (`timerEndsAt`) and `visibilitychange` listeners to remain accurate even if the browser tab is throttled. Includes a visual pulsing warning during the final 10 seconds and optional Web Audio API sound effects with a mute toggle.

4. **Exact Team-Based Scoring & Steal Rules (`src/lib/scoring.ts`)**
   - **Scenario A (Guessing Team Succeeds)**: If Team A draws and Team B guesses correctly before time expires, Team B earns `+1` point (or configured points). Team A receives `0` points by default.
   - **Scenario B (Failed Guess & Steal Opportunity)**: If Team B cannot guess the word (either time expires or **"Nobody Guessed It"** is clicked), Team B loses its turn and a configurable **Steal Opportunity** (`15s` default) begins for the next eligible team (Team A's non-drawing guessers in a 2-team game, or waiting teams in turn order in a 3–4 team game). If the stealing team guesses correctly in time, they earn the point.
   - **Scenario C (Nobody Guesses)**: If both the initial guessing team and the stealing team fail, `0` points are awarded, **"No points this round"** is displayed, and the secret word is revealed.
   - **Idempotent Single Resolution**: All round outcomes pass through `resolveRound()` with a `roundResolved` lock so rapid clicks or simultaneous timer expiration can never award points twice.

5. **Drawing Preview with Google Gemini API & Built-In Vector Fallback (`src/lib/gemini.ts`, `src/lib/svg-illustrations.ts`)**
   - Clicking **"Don't Know? Show Drawing Preview"** opens a modal with a fair-play privacy warning, a visual illustration of the target word, and a 3-step sketch guide.
   - Calls the server-side `/api/generate-image` Route Handler (`POST`), which uses `@google/genai` when `GEMINI_API_KEY` and `GEMINI_IMAGE_MODEL` are configured.
   - Automatically falls back to bespoke, hand-drawn Pictionary-style vector SVG illustrations when Gemini is not configured or unavailable, and caches previews in `localStorage`.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional for AI Image Generation)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_IMAGE_MODEL=imagen-4.0-generate-001
```

- **How to obtain an API key**: Visit [Google AI Studio](https://aistudio.google.com/apikey) and create a Gemini API key.
- **Supported models**: Set `GEMINI_IMAGE_MODEL` to an image-generation model supported by your account (e.g., `imagen-4.0-generate-001` or a Gemini native image-output model).
- **No API key required to play**: If `GEMINI_API_KEY` or `GEMINI_IMAGE_MODEL` is omitted, Doodle Duel remains 100% playable and serves instant built-in vector SVG illustrations.

### 3. Run in Development

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Production Build & Start

```bash
npm run build
npm run start
```

### 5. Run Tests, Type Checks & Linter

```bash
npm test
npm run typecheck
npm run lint
```

---

## Project Architecture

```text
src/
  app/
    api/generate-image/route.ts   # Server-side POST Route Handler for Gemini & fallback previews
    globals.css                   # Tailwind v4 styles & reduced-motion support
    layout.tsx                    # Root layout & metadata
    page.tsx                      # Main Doodle Duel state coordinator
  components/
    game/
      Header.tsx                  # Branded header, mode badge, sound toggle, rules, settings, new game
      GameSetup.tsx               # Team setup (2-4), difficulty, categories, timer, steal & preview rules
      TeamScoreboard.tsx          # Live team scoreboard, role badges, and round counter
      GameTimer.tsx               # Timestamp-based countdown bar with 10s visual warning
      WordCard.tsx                # Secret word display, peek/hide toggle, and "I Know This Word — Done!"
      RoundControls.tsx           # Correct Guess, Nobody Guessed It / Steal phase controls
      DrawingPreview.tsx          # "Don't Know? Show Drawing Preview" modal & local cache
      RoundResult.tsx             # Post-round outcome summary & Next Round trigger
      GameOver.tsx                # Winner/tie announcement, standings podium, and round recap
      GameRulesModal.tsx          # Interactive rules & steal scoring breakdown
    ui/
      Button.tsx                  # Accessible button primitives
      Modal.tsx                   # Accessible dialog modal
      Toast.tsx                   # Live score & event toast notifications
  lib/
    words.ts                      # Categorized word bank & deduplicating random generator
    scoring.ts                    # Pure scoring & steal queue logic (Scenarios A, B, C, D)
    game-engine.ts                # Deterministic game state machine
    timer.ts                      # Timestamp countdown hook & Web Audio API sound effects
    storage.ts                    # localStorage persistence & preview cache adapter
    svg-illustrations.ts          # Built-in vector sketch generator
    gemini.ts                     # Server-only Google Gen AI SDK integration
    __tests__/
      game-engine.test.ts         # Vitest unit test suite
  types/
    game.ts                       # TypeScript interfaces
```
