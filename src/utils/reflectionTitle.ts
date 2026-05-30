const CATEGORY_TITLES: Record<string, string> = {
  anxiety: 'Calming anxiety',
  fear: 'Facing fear',
  grief: 'Holding grief',
  loneliness: 'Feeling alone',
  anger: 'Managing anger',
  guilt: 'Releasing guilt',
  shame: 'Healing shame',
  doubt: 'Faithful doubting',
  relationships: 'Relationship peace',
  marriage: 'Marriage hope',
  parenting: 'Parenting grace',
  work: 'Work stress',
  finances: 'Financial trust',
  illness: 'Seeking healing',
  weariness: 'Soul rest',
  hope: 'Renewed hope',
  forgiveness: 'Finding forgiveness',
  temptation: 'Resisting temptation',
  identity: 'True identity',
  purpose: 'Life purpose',
  general: 'Seeking comfort',
};

/** 2–4 word title for saved guidance reflections */
export function reflectionTitleFromGuidance(input: {
  reflectionTitle?: string;
  issueSummary?: string;
  category?: string;
  empathy?: string;
}): string {
  const fromAi = input.reflectionTitle?.trim();
  if (fromAi) {
    return capWords(fromAi, 4);
  }

  const category = input.category?.toLowerCase();
  if (category && CATEGORY_TITLES[category]) {
    return CATEGORY_TITLES[category];
  }

  const source = input.issueSummary?.trim() || input.empathy?.trim() || '';
  if (!source) return 'Saved guidance';

  const stop = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'is',
    'are',
    'was',
    'were',
    'to',
    'of',
    'in',
    'on',
    'for',
    'with',
    'that',
    'this',
    'they',
    'their',
    'user',
    'feeling',
    'feels',
    'experiencing',
    'about',
  ]);

  const words = source
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w.toLowerCase()));

  if (words.length >= 2) {
    return capWords(words.slice(0, 3).join(' '), 3);
  }

  return capWords(words[0] ?? 'Saved guidance', 3);
}

function capWords(text: string, maxWords: number): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function verseReflectionId(guidanceId: string, reference: string): string {
  const slug = reference.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);
  return `verse-${guidanceId}-${slug || 'ref'}`;
}

export function prayerReflectionId(guidanceId: string): string {
  return `prayer-${guidanceId}`;
}
