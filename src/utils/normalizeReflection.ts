import { SavedReflection } from '@/src/types';
import { formatReflectionDate, getWeekKey } from '@/src/utils/weekKey';

export type NormalizedReflection = SavedReflection & {
  savedAt: number;
  weekKey: string;
};

export function normalizeReflection(item: SavedReflection): NormalizedReflection {
  let savedAt = item.savedAt;
  if (!savedAt) {
    const parsed = Date.parse(item.date);
    savedAt = Number.isNaN(parsed) ? Date.now() : parsed;
  }

  const weekKey = item.weekKey ?? getWeekKey(savedAt);

  return {
    ...item,
    savedAt,
    weekKey,
    date: item.date?.trim() ? item.date : formatReflectionDate(savedAt),
    liked: item.liked ?? true,
  };
}

export function normalizeReflectionList(items: SavedReflection[]): NormalizedReflection[] {
  return items.filter((r) => r.type !== 'journal').map(normalizeReflection);
}
