# Alchemist's Cauldron

Browser potion-brewing game. Mix ingredients, match three target ranges and brew potions before time or lives run out.

**Play online:** https://Nloading.github.io/alchemists-cauldron/

Built with TypeScript, Vite and SCSS. No frameworks or game libraries. All game elements (icons, bars, cauldron, hearts) are CSS shapes or text symbols; the only image is an empty room used as the page background.

## Implemented

All three levels are implemented.

### Story 1: project setup

- Vite bundler with dev and production builds
- strict TypeScript (`noImplicitAny`, `noUncheckedIndexedAccess`, no explicit `any`)
- ESLint (strict type-checked rules, `no-console`) and Prettier
- Husky hooks: `commit-msg` validates Conventional Commits, `pre-push` runs ESLint, Prettier and the type check
- pull request template and GitHub Pages deployment through GitHub Actions
- layered folder structure: game rules never touch the DOM

### Level 1: basic game

- start screen with **Start Game**, **Leaderboard** and **Help**
- ingredient shelf with random limited stock (2–15 per ingredient), spent ingredients are never refilled
- cauldron that keeps the exact order of added ingredients, with a counter such as `Ingredients: 2 / 4` that is highlighted when full
- three animated parameter bars (Temperature, Density, Magic Power) with a target zone, a value marker, a centre line for zero and a glow when the value is in range
- 20 recipes, a random recipe for the chosen difficulty at the start and after every successful brew
- brew check with a tolerance around the recipe ranges
- timestamp-based timer (correct after a background tab), shrinking time bar, red pulsing timer under 15 s
- lives, score, time bonus capped at the start time
- game over with a reason: time is up, no lives left, or out of ingredients
- pause with a blurred field, **Resume** and **Exit to Menu**; the game also pauses when the tab is hidden
- Top-10 leaderboard in `localStorage` with name validation, custom confirm dialog for **Clear Leaderboard**

### Level 2: extended game

- **Settings** panel with Easy, Medium and Hard, all values taken from one settings table
- one Top-10 leaderboard per difficulty, with a Difficulty column
- autosave to `localStorage` after every change; **Continue Game** restores the run in the paused state with the saved stock; finished games are never offered; broken or tampered saves are validated, discarded and never crash the game

### Level 3: full game

- **Drag and drop** with HTML5 drag events: the cauldron highlights as a drop zone; drops are ignored when paused, when the cauldron is full and for empty stock; clicking still works
- **Tooltip** on hover and keyboard focus with Temperature, Density and Magic Power; it opens to the left near the right edge and upward near the bottom, and is hidden while paused
- **Chemical reactions** stored in a typed `IReaction[]` array; values are recalculated from the ingredient list every time; a reaction fires only when it changes from not active to active
- **Pour Out** clears the cauldron for 10 seconds without losing a life
- **Visual feedback** made only with CSS animations: success burst with a floating time bonus, explosion with a screen shake on failure, floating ingredient icons in the cauldron, smooth bars
- **Keyboard shortcuts** in one handler that is gated by the game state

## How to play

1. Click **Settings** and choose Easy, Medium or Hard (optional, Medium is the default), then click **Start Game**.
2. Look at the recipe: three target ranges.
3. Add ingredients to the cauldron by clicking a card, dragging it into the cauldron, or pressing its number key.
4. Watch the bars and move every value into its green zone.
5. Click **Brew**. Success gives score, bonus time and a new recipe. Failure costs one life.
6. Made a wrong mix? **Pour Out** clears the cauldron for 10 seconds without losing a life.
7. The game ends when time runs out, lives reach zero, or the ingredients run out.
8. If your score is in the Top-10 of that difficulty, enter a name (2–15 characters: letters, digits, space, `_`, `-`).

Use **Continue Game** on the start screen to resume an unfinished game after a reload.

### Difficulty

| Setting                     | Easy  | Medium | Hard  |
| --------------------------- | :---: | :----: | :---: |
| Ingredients on shelf        |   4   |   6    |   8   |
| Max ingredients in cauldron |   4   |   4    |   5   |
| Starting time               | 180 s | 150 s  | 150 s |
| Recipe tolerance            |  ±12  |   ±8   |  ±5   |
| Lives                       |   5   |   3    |   3   |
| Score per brew              |  100  |  200   |  300  |
| Time bonus per brew         | +15 s | +10 s  | +5 s  |
| Reactions                   | none  |   2    |   3   |

### Reactions

| Difficulty | Reaction     | Trigger                               | Effect                                   |
| ---------- | ------------ | ------------------------------------- | ---------------------------------------- |
| Medium     | Bubbling     | Fairy Dust + Caustic Acid             | Magic Power +50%, remove 10 seconds once |
| Medium     | Solar Frost  | Dragon Tears + Frost Lotus            | Temperature set to 0, Density +20%       |
| Hard       | Volatile Mix | Phoenix Feather + Essence of the Void | Lose 1 life and clear the cauldron       |
| Hard       | Rooted Steam | Mandrake Root + Toad Slime            | Density +25%, Magic Power -10%           |
| Hard       | Ashen Bloom  | Phoenix Feather + Fairy Dust          | Temperature +10, Magic Power +25%        |

### Keyboard shortcuts

Shortcuts work only while a game is running. On the start screen and the Game Over screen the keyboard keeps its normal behavior, and shortcuts are ignored while typing in a text field.

| Key          | Action                                                           |
| ------------ | ---------------------------------------------------------------- |
| `1` – `8`    | Add the ingredient at that shelf position                        |
| `B`          | Brew                                                             |
| `O`          | Pour Out                                                         |
| `P` or `Esc` | Pause, and resume when paused (the only key on the pause screen) |

Shortcuts use physical key positions, so they work with any keyboard layout. `Enter` and `Space` operate focused buttons as usual.

## Run locally

Requires Node.js 20 or newer.

    npm install
    npm run dev

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm run format`, `npm run format:check`, `npm run typecheck`.

## Project structure

    src/
      data/      ingredients, recipes, difficulty table, reactions, bar config
      logic/     pure game rules, no DOM (sums, brew check, timer, reactions, leaderboard, save validation, shortcuts)
      state/     game state store and actions
      storage/   localStorage helpers (leaderboards, save)
      ui/        DOM rendering only
      styles/    SCSS
      assets/    page background image

## Git workflow

Story branches `story-1`, `story-2` and `story-3`, each created from the previous one. Every task has its own feature branch and pull request into the current story branch. Commits are small and follow Conventional Commits. Final story pull requests are opened against the previous story branch and are not merged.

## Notes and decisions

- **Time cap:** a time bonus never raises the clock above the starting time of the chosen difficulty.
- **Bars:** the target zone shows the exact recipe range; the tolerance applies only when brewing.
- **Reactions:** the task does not say which reactions each difficulty uses, so Medium uses Bubbling and Solar Frost, and Hard uses Volatile Mix, Rooted Steam and Ashen Bloom. They use ingredient triggers that exist on that difficulty. The other reactions from the table are not enabled.
- **Reaction effects** that change time, lives or clear the cauldron are stored as fields on the reaction; only value changes live in `apply`.
- **Pause screen shortcuts:** only the pause toggle works there, so a paused game can be resumed from the keyboard.
- **Timer:** remaining time is always computed from `Date.now()`. The only `setInterval` is a polling heartbeat; visual effects use CSS animations only.
- **Saves:** broken or inconsistent saved data is discarded and the game starts normally.
