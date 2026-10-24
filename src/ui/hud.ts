import { formatTime, isTimeCritical } from '../logic/timer';
import { el } from './dom';

export interface IHudData {
  score: number;
  lives: number;
  timeLeft: number;
  startTime: number;
  difficultyLabel: string;
}

export interface IHudView {
  update: (data: Readonly<IHudData>) => void;
}

export function createHud(container: HTMLElement): IHudView {
  const score = el('span', 'hud__score');
  const difficulty = el('span', 'hud__difficulty');
  const timeLabel = el('span', 'hud__time');
  const timeFill = el('div', 'hud__time-fill');
  const timeTrack = el('div', 'hud__time-track');
  timeTrack.append(timeFill);
  const timeBox = el('div', 'hud__time-box');
  timeBox.append(timeLabel, timeTrack);
  const lives = el('span', 'hud__lives');
  lives.setAttribute('aria-label', 'Lives');

  container.replaceChildren(score, difficulty, timeBox, lives);

  return {
    update: (data): void => {
      score.textContent = 'Score: ' + String(data.score);
      difficulty.textContent = data.difficultyLabel;
      timeLabel.textContent = 'Time: ' + formatTime(data.timeLeft);
      const critical = data.timeLeft > 0 && isTimeCritical(data.timeLeft);
      timeLabel.classList.toggle('hud__time--critical', critical);
      timeFill.classList.toggle('hud__time-fill--critical', critical);
      timeFill.style.width = String((data.timeLeft / data.startTime) * 100) + '%';

      lives.replaceChildren(...Array.from({ length: data.lives }, () => el('span', 'heart', '♥')));
    },
  };
}
