export function formatDurationFromMs(miliseconds: number): string {
  let hours = miliseconds / 3600000;
  return formatDurationFromH(hours);
}

export function formatDurationFromH(hours: number): string {
  let exactHours = Math.floor(hours);
  let minutes = 60 * (hours - exactHours);
  return `${exactHours > 0 ? `${exactHours} h` : ""} ${minutes.toFixed(0)} m`;
}
