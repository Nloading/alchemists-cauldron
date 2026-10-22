const CRITICAL_MS = 15_000;

export function computeTimeLeft(endTime: number, now: number): number {
  return Math.max(0, endTime - now);
}

export function addTimeBonus(timeLeft: number, bonus: number, max: number): number {
  return Math.min(timeLeft + bonus, max);
}

export function isTimeCritical(timeLeft: number): boolean {
  return timeLeft < CRITICAL_MS;
}

export function formatTime(timeLeft: number): string {
  const totalSeconds = Math.ceil(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}