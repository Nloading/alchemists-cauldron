import './styles/style.scss';
import { LEVEL_1_SETTINGS } from './data/difficulty';
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
import { createControls } from './ui/controls';
import { createHud } from './ui/hud';
import { createLayout } from './ui/layout';
import { createRecipePanel } from './ui/recipe-panel';
import { createShelf } from './ui/shelf';
import { createPauseDialog } from './ui/pause-dialog';
import { createGameOver } from './ui/game-over';
import { createLeaderboardDialog } from './ui/leaderboard-dialog';
import { createConfirmDialog } from './ui/confirm-dialog';
import { createHelpDialog } from './ui/help-dialog';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Root element #app was not found');
}

const layout = createLayout(root);
const hud = createHud(layout.hud);
const shelf = createShelf(
  layout.shelf,
  getShelfIngredients(LEVEL_1_SETTINGS.shelfSize),
  addIngredientToCauldron,
);
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

function render(): void {
  const state = getState();
  const max = LEVEL_1_SETTINGS.maxCauldronIngredients;
  const added = state.cauldronIngredients.length;
  const inMenu = state.status === 'menu';
  const paused = state.status === 'paused';
  const blocked =
    inMenu ||
    paused ||
    state.status === 'game-over' ||
    isCauldronFull(state.cauldronIngredients, max);

  layout.game.classList.toggle('game--paused', paused);
  layout.game.inert = paused || state.status === 'game-over';

  hud.update({
    score: state.score,
    lives: state.lives,
    timeLeft: state.timeLeft,
    startTime: LEVEL_1_SETTINGS.startTimeMs,
  });
  shelf.update(state.shelfStock, blocked);
  cauldron.update(state.cauldronIngredients);
  recipe.update(state.activeRecipe, added, max);
  bars.update(calculateCauldron(state.cauldronIngredients), state.activeRecipe);
  controls.update(state.status, added > 0 && !blocked, state.lastBrew);
  const isOver = state.status === 'game-over';
  const canSubmit = isOver && qualifiesForTop10(loadLeaderboard(), state.score);
  gameOver.update(isOver, state.score, state.gameOverReason, canSubmit);
  pauseDialog.update(paused);
}

subscribe(render);
render();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseGame();
  }
});

// Heartbeat only: remaining time is always computed from timestamps, not counted by ticks.
window.setInterval(tick, 250);
