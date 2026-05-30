/** Short title from journal body (first line or first few words). */
export function journalTitleFromBody(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return 'Untitled entry';

  const firstLine = trimmed.split(/\n/)[0]?.trim() ?? trimmed;
  if (firstLine.length <= 48) return firstLine;

  const words = firstLine.split(/\s+/).slice(0, 6).join(' ');
  return words.length > 48 ? `${words.slice(0, 45).trim()}…` : words;
}

export function formatJournalDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
