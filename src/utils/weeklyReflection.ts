import { SavedReflection } from '@/src/types';
import { formatWeekFolderLabel } from '@/src/utils/weekKey';

export function buildWeeklyReflectionTemplate(
  weekKey: string,
  items: SavedReflection[],
): string {
  const label = formatWeekFolderLabel(weekKey);
  const savedLines =
    items.length > 0
      ? items.map((item) => `• ${item.title}`).join('\n')
      : '• (Nothing saved yet this week)';

  return `Weekly faith reflection — ${label}

What stood out to me in Scripture or prayer this week?

Where did I sense God inviting me to trust, repent, rest, or take a step of obedience?

How do I want to carry this into the days ahead?

---
Saved this week:
${savedLines}
`;
}

export function groupReflectionsByWeek(
  reflections: SavedReflection[],
): { weekKey: string; items: SavedReflection[] }[] {
  const map = new Map<string, SavedReflection[]>();

  for (const item of reflections) {
    if (!item.weekKey) continue;
    const list = map.get(item.weekKey) ?? [];
    list.push(item);
    map.set(item.weekKey, list);
  }

  return [...map.entries()]
    .map(([weekKey, items]) => ({
      weekKey,
      items: items.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0)),
    }))
    .sort((a, b) => b.weekKey.localeCompare(a.weekKey));
}
