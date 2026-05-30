/** Short label for a chat session from the first user message */
export function chatTitleFromText(text: string, maxWords = 5): string {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'New conversation';

  const words = cleaned.split(' ').slice(0, maxWords);
  const title = words.join(' ');
  return cleaned.length > title.length ? `${title}…` : title;
}

export function formatChatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
