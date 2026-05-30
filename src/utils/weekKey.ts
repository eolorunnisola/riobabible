/** Sunday-start week key (YYYY-MM-DD of the week's first day). */
export function getWeekKey(timestamp = Date.now()): string {
  const date = new Date(timestamp);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseWeekKey(weekKey: string): Date {
  const [y, m, d] = weekKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatWeekFolderLabel(weekKey: string): string {
  const start = parseWeekKey(weekKey);
  return `Week of ${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

export function formatReflectionDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
