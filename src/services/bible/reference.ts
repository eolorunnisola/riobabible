import { ID_TO_BOOK } from './books';

export type ParsedReference = {
  bookId: string;
  chapter: string;
  verseStart: string;
  verseEnd?: string;
  raw: string;
};

/**
 * Parses references like "MAT 11:28", "MAT 11:28-30", "1PE 5:7", "PSA 23:1-3"
 */
export function parseReference(ref: string): ParsedReference | null {
  const cleaned = ref.trim().toUpperCase().replace(/\./g, '');
  const match = cleaned.match(/^(\d?[A-Z]{2,4})\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;

  const [, bookId, chapter, verseStart, verseEnd] = match;
  if (!ID_TO_BOOK[bookId]) return null;

  return {
    bookId,
    chapter,
    verseStart,
    verseEnd,
    raw: ref,
  };
}

export function formatReference(
  bookId: string,
  chapter: string,
  verse: string,
  translation: string,
): string {
  const bookName = ID_TO_BOOK[bookId] ?? bookId;
  return `${bookName} ${chapter}:${verse} (${translation})`;
}
