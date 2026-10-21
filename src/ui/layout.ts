import { el } from './dom';

export interface ILayout {
  shelf: HTMLElement;
  cauldron: HTMLElement;
  bars: HTMLElement;
}

export function createLayout(root: HTMLElement): ILayout {
  const game = el('main', 'game');
  const shelf = el('section', 'panel panel--shelf');
  const cauldron = el('section', 'panel panel--cauldron');
  const bars = el('section', 'panel panel--bars');
  game.append(shelf, cauldron, bars);
  root.replaceChildren(game);
  return { shelf, cauldron, bars };
}
