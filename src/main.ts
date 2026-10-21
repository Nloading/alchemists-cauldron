import './styles/style.css';
import { getShelfIngredients } from './data/ingredients';
import { LEVEL_1_SETTINGS } from './data/difficulty';
import { isCauldronFull } from './logic/add-ingredient';
import { addIngredientToCauldron } from './state/actions';
import { getState, subscribe } from './state/game-state';
import { createCauldron } from './ui/cauldron';
import { createLayout } from './ui/layout';
import { createShelf } from './ui/shelf';
import { calculateCauldron } from './logic/calculate-cauldron';
import { createBars } from './ui/bars';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Root element #app was not found');
}

const layout = createLayout(root);
const shelf = createShelf(
  layout.shelf,
  getShelfIngredients(LEVEL_1_SETTINGS.shelfSize),
  addIngredientToCauldron,
);
const cauldron = createCauldron(layout.cauldron);

const bars = createBars(layout.bars);

function render(): void {
  const state = getState();
  const full = isCauldronFull(state.cauldronIngredients, LEVEL_1_SETTINGS.maxCauldronIngredients);
  shelf.update(state.shelfStock, full);
  cauldron.update(state.cauldronIngredients);
  bars.update(calculateCauldron(state.cauldronIngredients), state.activeRecipe);
}

subscribe(render);
render();
