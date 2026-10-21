import { el } from './dom';

export interface ILayout {
  shelf: HTMLElement;
  cauldron: HTMLElement;
}

export function createLayout(root: HTMLElement): ILayout {
  const game = el('main', 'game');
  const shelf = el('section', 'panel panel--shelf');
  const cauldron = el('section', 'panel panel--cauldron');
  game.append(shelf, cauldron);
  root.replaceChildren(game);
  return { shelf, cauldron };
}