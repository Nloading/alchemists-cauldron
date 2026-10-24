# Alchemist's Cauldron

Browser potion-brewing game. Mix ingredients, match three target ranges and brew potions before time or lives run out.

**Play online:** https://<your-username>.github.io/alchemists-cauldron/

Built with TypeScript, Vite and SCSS. No frameworks or game libraries.

## Implemented

- **Story 1 (setup):** Vite, strict TypeScript, ESLint, Prettier, Husky hooks (commit message and pre-push checks), PR template, GitHub Pages deploy.
- **Level 1:**
  - ingredient shelf with random limited stock (2–15), cauldron with ordered ingredients
  - three animated parameter bars with recipe zones and a glow when in range
  - 20 recipes, random pick, brew check with ±8 tolerance
  - timestamp-based timer, lives, game over with a reason
  - pause (manual and when the tab is hidden)
  - Top-10 leaderboard in localStorage
- **Level 2:** not implemented yet.
- **Level 3:** not implemented yet.

## How to play

1. Click **Start Game**.
2. Look at the recipe: three target ranges.
3. Click ingredients on the shelf to add them to the cauldron (maximum 4).
4. Watch the bars. Move every value into its green zone.
5. Click **Brew**. Success gives +200 score and +10 seconds. Failure costs one life.
6. The game ends when time runs out, lives reach zero, or ingredients run out.
7. If your score is in the Top-10, enter a name (2–15 characters: letters, digits, space, `_`, `-`).

Other controls: **Pause**, **Help**, **Leaderboard**.

## Run locally

Requires Node.js 20+.

    npm install
    npm run dev

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm run format`, `npm run format:check`, `npm run typecheck`.

## Project structure

    src/
      data/      ingredients, recipes, settings, bar config
      logic/     pure game rules (no DOM)
      state/     game state store and actions
      storage/   localStorage helpers
      ui/        DOM rendering only
      styles/    SCSS
      assets/    background image

## Git workflow

Story branches (`story-1`, `story-2`, `story-3`), feature branches per task, small commits following Conventional Commits. Final story PRs are not merged.

## Notes and decisions

- Level 1 time cap: the bonus never raises the clock above the start time (150 s).
- Recipe zones on the bars show the exact recipe range; the ±8 tolerance applies only when brewing.
- Level 1 settings are the Medium column of the difficulty table.