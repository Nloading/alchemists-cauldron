import './styles/style.scss';
import { LEVEL_1_SETTINGS } from './data/difficulty';
import { getShelfIngredients } from './data/ingredients';
import { isCauldronFull } from './logic/add-ingredient';
import { calculateCauldron } from './logic/calculate-cauldron';
import { addIngredientToCauldron, brew } from './state/actions';
import { getState, subscribe } from './state/game-state';
import { createBars } from './ui/bars';
import { createCauldron } from './ui/cauldron';
import { createControls } from './ui/controls';
import { createHud } from './ui/hud';
import { createLayout } from './ui/layout';
import { createRecipePanel } from './ui/recipe-panel';
import { createShelf } from './ui/shelf';

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
const controls = createControls(layout.controls, brew);

function render(): void {
  const state = getState();
  const max = LEVEL_1_SETTINGS.maxCauldronIngredients;
  const added = state.cauldronIngredients.length;

  hud.update(state.score, state.lives);
  shelf.update(state.shelfStock, isCauldronFull(state.cauldronIngredients, max));
  cauldron.update(state.cauldronIngredients);
  recipe.update(state.activeRecipe, added, max);
  bars.update(calculateCauldron(state.cauldronIngredients), state.activeRecipe);
  controls.update(added > 0, state.lastBrew);
}

subscribe(render);
render();
