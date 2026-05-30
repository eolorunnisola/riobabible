import { DailyEncouragement, SavedReflection } from '@/src/types';
import { formatReflectionDate, getWeekKey } from '@/src/utils/weekKey';
import { DEFAULT_GUIDANCE } from './defaultGuidance';

const mockSavedAt = (label: string) => {
  const parsed = Date.parse(label);
  const savedAt = Number.isNaN(parsed) ? Date.now() : parsed;
  return { savedAt, weekKey: getWeekKey(savedAt), date: formatReflectionDate(savedAt) };
};

export const MOCK_GUIDANCE = DEFAULT_GUIDANCE;

export const MOCK_REFLECTIONS: SavedReflection[] = [
  {
    id: 'r1',
    title: 'When anxiety feels loud',
    preview: 'Lord, You see how tired I am. Teach me to bring You what I cannot carry alone.',
    body: 'When anxiety feels loud, it can be hard to hear anything else — including God’s gentle voice. Lord, You see how tired I am. Teach me to bring You what I cannot carry alone. Help me to name my fears honestly, to receive Your Word without shame, and to take one small step of trust today. Remind me that Your mercies are new each morning, and that I do not walk this path by myself.',
    type: 'response',
    ...mockSavedAt('May 26, 2026'),
    liked: true,
  },
  {
    id: 'r2',
    title: 'Matthew 11:28',
    preview: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    body: 'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.',
    type: 'verse',
    ...mockSavedAt('May 24, 2026'),
    verseReference: 'Matthew 11:28',
    liked: true,
  },
  {
    id: 'r3',
    title: 'Journal — Trust in transition',
    preview: 'I wrote about waiting without seeing the full path yet.',
    body: 'I wrote about waiting without seeing the full path yet. I am in a season where answers feel delayed and my heart wants certainty. Today I am choosing to trust that God sees the whole road even when I only see the next step. I want to be honest about my fear and still open my hands in prayer.',
    type: 'journal',
    ...mockSavedAt('May 22, 2026'),
  },
].filter((r) => r.type !== 'journal') as SavedReflection[];

export const MOCK_DAILY: DailyEncouragement[] = [
  {
    id: 'd1',
    theme: 'Peace in uncertainty',
    verse: {
      reference: 'Philippians 4:6–7',
      text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
    },
    prayer:
      'Father, quiet my racing thoughts. Help me bring each worry to You with thanksgiving, trusting Your peace to guard my heart.',
    reflectionQuestion: 'What worry can you name honestly before God today?',
  },
  {
    id: 'd2',
    theme: 'Strength for today',
    verse: {
      reference: 'Isaiah 41:10',
      text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.',
    },
    prayer: 'God, I do not need strength for every tomorrow—only for today. Walk with me in this hour.',
    reflectionQuestion: 'Where do you need God’s help most right now?',
  },
  {
    id: 'd3',
    theme: 'Gentle hope',
    verse: {
      reference: 'Lamentations 3:22–23',
      text: 'Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning.',
    },
    prayer: 'Lord, thank You that Your mercies meet me again today. Renew my hope as I begin.',
    reflectionQuestion: 'What mercy from God can you thank Him for this morning?',
  },
];

export const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'self-harm',
  'hurt myself',
  'abuse',
  'end my life',
];

export function detectCrisisContent(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}
