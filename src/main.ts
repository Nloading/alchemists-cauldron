import './styles/style.scss';
import { DIFFICULTY_SETTINGS } from './data/difficulty';
import { getShelfIngredients } from './data/ingredients';
import { isCauldronFull } from './logic/add-ingredient';
import { calculateCauldron } from './logic/calculate-cauldron';
import { qualifiesForTop10 } from './logic/leaderboard';
import {
  addIngredientToCauldron,
  brew,
  exitToMenu,
  pauseGame,
  resumeGame,
  startGame,
  tick,
} from './state/actions';
import { getState, subscribe } from './state/game-state';
import { clearLeaderboard, loadLeaderboard, submitEntry } from './storage/leaderboard';
import { createBars } from './ui/bars';
import { createCauldron } from './ui/cauldron';
import { createConfirmDialog } from './ui/confirm-dialog';
import { createControls } from './ui/controls';
import { createGameOver } from './ui/game-over';
import { createHelpDialog } from './ui/help-dialog';
import { createHud } from './ui/hud';
import { createLayout } from './ui/layout';
import { createLeaderboardDialog } from './ui/leaderboard-dialog';
import { createPauseDialog } from './ui/pause-dialog';
import { createRecipePanel } from './ui/recipe-panel';
import { createShelf } from './ui/shelf';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Root element #app was not found');
}

const layout = createLayout(root);
const hud = createHud(layout.hud);
const shelf = createShelf(layout.shelf, addIngredientToCauldron);
const cauldron = createCauldron(layout.cauldron);
const recipe = createRecipePanel(layout.recipe);
const bars = createBars(layout.bars);

const confirmDialog = createConfirmDialog(root);
const leaderboard = createLeaderboardDialog(root, {
  onClearRequest: () => {
    confirmDialog.ask('Clear the whole leaderboard? This cannot be undone.', () => {
      clearLeaderboard();
      leaderboard.show([]);
    });
  },
});

function openLeaderboard(): void {
  leaderboard.show(loadLeaderboard());
}

const help = createHelpDialog(root);
const controls = createControls(layout.controls, {
  onBrew: brew,
  onStart: startGame,
  onPause: pauseGame,
  onLeaderboard: openLeaderboard,
  onHelp: help.show,
});
const gameOver = createGameOver(root, {
  onPlayAgain: startGame,
  onSubmit: (name) => {
    submitEntry(name, getState().score, Date.now());
  },
  onShowLeaderboard: openLeaderboard,
});
const pauseDialog = createPauseDialog(root, { onResume: resumeGame, onExit: exitToMenu });

let renderedShelfSize = -1;

function render(): void {
  const state = getState();
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  const max = settings.maxCauldronIngredients;
  const added = state.cauldronIngredients.length;
  const inMenu = state.status === 'menu';
  const paused = state.status === 'paused';
  const isOver = state.status === 'game-over';
  const blocked = state.status !== 'playing' || isCauldronFull(state.cauldronIngredients, max);
  const shelfSize = inMenu ? 0 : settings.shelfSize;

  if (shelfSize !== renderedShelfSize) {
    shelf.setIngredients(getShelfIngredients(shelfSize));
    renderedShelfSize = shelfSize;
  }

  layout.game.classList.toggle('game--paused', paused);
  layout.game.inert = paused || isOver;
  layout.shelf.classList.toggle('panel--idle', inMenu);
  layout.recipe.classList.toggle('panel--idle', inMenu);

  hud.update({
    score: state.score,
    lives: state.lives,
    timeLeft: state.timeLeft,
    startTime: settings.startTimeMs,
    difficultyLabel: settings.label,
  });
  shelf.update(state.shelfStock, blocked);
  cauldron.update(state.cauldronIngredients);
  recipe.update(state.activeRecipe, added, max);
  bars.update(calculateCauldron(state.cauldronIngredients), state.activeRecipe);
  controls.update(state.status, added > 0, state.lastBrew);

  const canSubmit = isOver && qualifiesForTop10(loadLeaderboard(), state.score);
  gameOver.update(isOver, state.score, state.gameOverReason, canSubmit);
  pauseDialog.update(paused);
}

subscribe(render);
render();

// Heartbeat only: remaining time is always computed from timestamps, not counted by ticks.
window.setInterval(tick, 250);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseGame();
  }
});