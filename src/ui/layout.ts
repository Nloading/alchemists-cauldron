import { el } from './dom';

export interface ILayout {
  hud: HTMLElement;
  shelf: HTMLElement;
  cauldron: HTMLElement;
  recipe: HTMLElement;
  bars: HTMLElement;
  controls: HTMLElement;
}

export function createLayout(root: HTMLElement): ILayout {
  const game = el('main', 'game');
  const hud = el('section', 'panel panel--hud');
  const shelf = el('section', 'panel panel--shelf');
  const cauldron = el('section', 'panel panel--cauldron');
  const recipe = el('section', 'panel panel--recipe');
  const bars = el('section', 'panel panel--bars');
  const controls = el('section', 'panel panel--controls');
  game.append(hud, shelf, cauldron, recipe, bars, controls);
  root.replaceChildren(game);
  return { hud, shelf, cauldron, recipe, bars, controls };
}
