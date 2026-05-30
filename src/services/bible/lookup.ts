import { BibleTranslation, BibleVerse } from '@/src/types';
import topicReferences from '@/src/data/bible/topicReferences.json';
import {
  getVerseText,
  loadBibleDatabase,
  resolveTranslationForLookup,
} from './database';
import { formatReference, parseReference } from './reference';

export function getReferencesForCategory(category: string): string[] {
  const key = category.toLowerCase();
  const refs =
    (topicReferences as Record<string, string[]>)[key] ??
    (topicReferences as Record<string, string[]>).general;
  return refs ?? [];
}

export function retrieveVerses(
  references: string[],
  preferredTranslation: BibleTranslation,
): { verses: BibleVerse[]; lookupTranslation: BibleTranslation } {
  const lookupTranslation = resolveTranslationForLookup(preferredTranslation);
  const db = loadBibleDatabase(lookupTranslation);
  const verses: BibleVerse[] = [];

  for (const ref of references) {
    const parsed = parseReference(ref);
    if (!parsed) continue;

    const end = parsed.verseEnd ? parseInt(parsed.verseEnd, 10) : parseInt(parsed.verseStart, 10);
    const start = parseInt(parsed.verseStart, 10);
    const parts: string[] = [];

    for (let v = start; v <= end; v++) {
      const text = getVerseText(db, parsed.bookId, parsed.chapter, String(v));
      if (text) parts.push(text);
    }

    if (parts.length === 0) continue;

    const suffix =
      lookupTranslation !== preferredTranslation
        ? ` — text from ${lookupTranslation} (rebuild ${preferredTranslation} index)`
        : '';

    verses.push({
      reference: formatReference(
        parsed.bookId,
        parsed.chapter,
        end > start ? `${parsed.verseStart}-${parsed.verseEnd}` : parsed.verseStart,
        preferredTranslation,
      ) + suffix,
      text: parts.join(' '),
    });
  }

  return { verses, lookupTranslation };
}
