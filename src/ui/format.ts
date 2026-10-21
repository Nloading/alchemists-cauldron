export function formatSigned(value: number): string {
  if (value > 0) {
    return '+' + String(value);
  }
  if (value < 0) {
    return '-' + String(Math.abs(value));
  }
  return '0';
}
