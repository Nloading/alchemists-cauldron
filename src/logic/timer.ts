export function computeTimeLeft(endTime: number, now: number): number {
  return Math.max(0, endTime - now);
}
