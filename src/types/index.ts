import type { ColorThemeId } from '@/src/theme/colorThemes';

export type BibleTranslation = 'NIV' | 'ESV' | 'KJV' | 'NLT';
export type GuidanceTone = 'gentle' | 'direct' | 'encouraging' | 'contemplative';
export type PrayerPreference = 'short' | 'detailed' | 'scripture-focused' | 'minimal';

export type UserProfile = {
  displayName: string;
  avatarUri: string | null;
  joinedAt: number;
};

export type UserPreferences = {
  translation: BibleTranslation;
  tone: GuidanceTone;
  prayerPreference: PrayerPreference;
  autoIncludePrayer: boolean;
  colorTheme: ColorThemeId;
  onboardingComplete: boolean;
};

export type ProfileStats = {
  daysOnApp: number;
  savedScriptures: number;
  journalEntries: number;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  loading?: boolean;
  /** Links assistant bubble to full guidance response screen */
  guidanceId?: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

export type BibleVerse = {
  reference: string;
  text: string;
};

export type GuidanceResponse = {
  id: string;
  /** Brief summary of what the user shared */
  issueSummary: string;
  /** Short label for saved reflections (2–4 words) */
  reflectionTitle?: string;
  empathy: string;
  /** How Scripture speaks to this situation */
  biblicalPerspective: string;
  verses: BibleVerse[];
  explanation: string;
  prayer: string;
  nextStep: string;
  journalPrompts: string[];
  /** Shown when topics touch mental health, trauma, etc. */
  disclaimer?: string;
  category?: string;
  createdAt: number;
  liked?: boolean;
  saved?: boolean;
};

export type SavedReflection = {
  id: string;
  title: string;
  preview: string;
  /** Full text for detail view (defaults to preview when omitted) */
  body?: string;
  /** Opens full guidance response when type is response */
  guidanceId?: string;
  type: 'journal' | 'response' | 'verse' | 'prayer';
  /** Display date label */
  date: string;
  /** When this item was saved (for weekly folders) */
  savedAt?: number;
  /** Sunday-start week bucket (YYYY-MM-DD) */
  weekKey?: string;
  verseReference?: string;
  liked?: boolean;
};

export type WeeklyFaithReflection = {
  weekKey: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type DailyEncouragement = {
  id: string;
  verse: BibleVerse;
  prayer: string;
  reflectionQuestion: string;
  theme: string;
};

export type DevotionalDay = {
  day: number;
  title: string;
  /** Verse references resolved against the local Bible DB at runtime */
  verseReferences: string[];
  reflection: string;
  prayer: string;
  /** Optional one-line action/journaling nudge */
  practice?: string;
};

export type DevotionalPlan = {
  id: string;
  title: string;
  subtitle: string;
  /** Ionicons name, e.g. 'leaf-outline' */
  icon: string;
  theme: string;
  days: DevotionalDay[];
};

export type DevotionalPlanProgress = {
  planId: string;
  /** day numbers the user has marked complete */
  completedDays: number[];
  startedAt: number;
  updatedAt: number;
  /** set when every day is complete */
  completedAt?: number;
};
