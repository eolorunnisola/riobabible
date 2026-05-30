import { BibleTranslation } from '@/src/types';

export type BibleDatabase = Record<string, Record<string, Record<string, string>>>;

const cache: Partial<Record<BibleTranslation, BibleDatabase>> = {};

const MODULES: Record<BibleTranslation, () => BibleDatabase> = {
  NIV: () => require('../../../assets/bible/niv.json'),
  ESV: () => require('../../../assets/bible/esv.json'),
  KJV: () => require('../../../assets/bible/kjv.json'),
  NLT: () => require('../../../assets/bible/nlt.json'),
};

/** Translations with a reliable full-text index */
export const RELIABLE_TRANSLATIONS: BibleTranslation[] = ['NIV', 'NLT', 'ESV', 'KJV'];

export function loadBibleDatabase(translation: BibleTranslation): BibleDatabase {
  if (cache[translation]) return cache[translation]!;
  try {
    const data = MODULES[translation]();
    cache[translation] = data;
    return data;
  } catch {
    return {};
  }
}

export function getVerseText(
  db: BibleDatabase,
  bookId: string,
  chapter: string,
  verse: string,
): string | null {
  return db[bookId]?.[chapter]?.[verse] ?? null;
}

export function resolveTranslationForLookup(
  preferred: BibleTranslation,
): BibleTranslation {
  if (RELIABLE_TRANSLATIONS.includes(preferred)) {
    const db = loadBibleDatabase(preferred);
    if (Object.keys(db).length >= 60) return preferred;
  }
  return 'NIV';
}
