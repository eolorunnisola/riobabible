import topicReferences from '@/src/data/bible/topicReferences.json';
import { getDayOfYear } from '@/src/utils/dateKey';

const CATEGORY_ORDER = [
  'hope',
  'weariness',
  'anxiety',
  'fear',
  'grief',
  'loneliness',
  'forgiveness',
  'purpose',
  'general',
  'identity',
  'work',
  'relationships',
] as const;

function flattenReferences(): string[] {
  const seen = new Set<string>();
  const refs: string[] = [];
  const topics = topicReferences as Record<string, string[]>;

  for (const category of CATEGORY_ORDER) {
    for (const ref of topics[category] ?? []) {
      const key = ref.replace(/\s+/g, '').toUpperCase();
      if (seen.has(key)) continue;
      seen.add(key);
      refs.push(ref);
    }
  }

  for (const list of Object.values(topics)) {
    for (const ref of list) {
      const key = ref.replace(/\s+/g, '').toUpperCase();
      if (seen.has(key)) continue;
      seen.add(key);
      refs.push(ref);
    }
  }

  return refs;
}

const ALL_REFS = flattenReferences();

/** Deterministic verse reference for a calendar day. */
export function pickDailyVerseReference(date = new Date()): string {
  const day = getDayOfYear(date);
  return ALL_REFS[day % ALL_REFS.length] ?? 'PSA 46:1';
}
