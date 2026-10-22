import { el } from './dom';

export interface IHudView {
  update: (score: number, lives: number) => void;
}

export function createHud(container: HTMLElement): IHudView {
  const score = el('span', 'hud__item');
  const lives = el('span', 'hud__item');
  container.replaceChildren(score, lives);

  return {
    update: (scoreValue, livesValue): void => {
      score.textContent = 'Score: ' + String(scoreValue);
      lives.textContent = 'Lives: ' + String(livesValue);
    },
  };
}