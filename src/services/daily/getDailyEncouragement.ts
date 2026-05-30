import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAILY_POOL, DailyPoolEntry } from '@/src/data/dailyPool';
import { retrieveVerses } from '@/src/services/bible/lookup';
import { DailyEncouragement, UserPreferences } from '@/src/types';
import { getDayOfYear, getLocalDateKey } from '@/src/utils/dateKey';
import { composeDailyFromVerse } from './composeDaily';
import { pickDailyVerseReference } from './pickVerseReference';

const STORAGE_KEY = '@bibleadvice/dailyEncouragement';

type StoredDaily = {
  dateKey: string;
  encouragement: DailyEncouragement;
};

function poolEntryForDate(date: Date): DailyPoolEntry {
  return DAILY_POOL[getDayOfYear(date) % DAILY_POOL.length];
}

async function verseFromReference(
  reference: string,
  preferences: UserPreferences,
): Promise<DailyEncouragement['verse'] | null> {
  const { verses } = retrieveVerses([reference], preferences.translation);
  const verse = verses[0];
  if (!verse?.text?.trim()) return null;
  return { reference: verse.reference, text: verse.text };
}

function buildEncouragement(
  dateKey: string,
  theme: string,
  verse: DailyEncouragement['verse'],
  prayer: string,
  reflectionQuestion: string,
): DailyEncouragement {
  return {
    id: `daily-${dateKey}`,
    theme,
    verse,
    prayer,
    reflectionQuestion,
  };
}

async function buildFromPool(
  dateKey: string,
  date: Date,
  preferences: UserPreferences,
): Promise<DailyEncouragement> {
  const entry = poolEntryForDate(date);
  const verse =
    (await verseFromReference(entry.reference, preferences)) ??
    (await verseFromReference(pickDailyVerseReference(date), preferences));

  if (!verse) {
    return buildEncouragement(
      dateKey,
      entry.theme,
      {
        reference: entry.reference,
        text: 'The Lord is near to all who call on him, to all who call on him in truth.',
      },
      entry.prayer,
      entry.reflectionQuestion,
    );
  }

  return buildEncouragement(dateKey, entry.theme, verse, entry.prayer, entry.reflectionQuestion);
}

async function generateForToday(
  dateKey: string,
  date: Date,
  preferences: UserPreferences,
): Promise<DailyEncouragement> {
  const reference = pickDailyVerseReference(date);
  const verse = await verseFromReference(reference, preferences);

  if (!verse) {
    return buildFromPool(dateKey, date, preferences);
  }

  const composed = await composeDailyFromVerse(verse, preferences);
  if (composed) {
    return buildEncouragement(
      dateKey,
      composed.theme,
      verse,
      composed.prayer,
      composed.reflectionQuestion,
    );
  }

  const pool = poolEntryForDate(date);
  return buildEncouragement(
    dateKey,
    pool.theme,
    verse,
    pool.prayer,
    pool.reflectionQuestion,
  );
}

async function loadStored(): Promise<StoredDaily | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredDaily;
  } catch {
    return null;
  }
}

async function persist(encouragement: DailyEncouragement, dateKey: string): Promise<void> {
  const payload: StoredDaily = { dateKey, encouragement };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/** Returns today's encouragement, generating and caching a new set when the calendar day changes. */
export async function getDailyEncouragement(
  preferences: UserPreferences,
): Promise<DailyEncouragement> {
  const dateKey = getLocalDateKey();
  const stored = await loadStored();

  if (stored?.dateKey === dateKey && stored.encouragement) {
    return stored.encouragement;
  }

  const encouragement = await generateForToday(dateKey, new Date(), preferences);
  await persist(encouragement, dateKey);
  return encouragement;
}
