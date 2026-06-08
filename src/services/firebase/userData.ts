import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  ChatSession,
  GuidanceResponse,
  DevotionalPlanProgress,
  JournalEntry,
  SavedReflection,
  UserPreferences,
  UserProfile,
  WeeklyFaithReflection,
} from '@/src/types';
import { requireRegisteredUser } from './auth';
import { getFirestoreDb } from './firestore';

export type UserAppData = {
  preferences: UserPreferences;
  profile: UserProfile;
  conversations: ChatSession[];
  activeConversationId: string;
  guidanceById: Record<string, GuidanceResponse>;
  reflections: SavedReflection[];
  journalEntries: JournalEntry[];
  weeklyFaithReflections: Record<string, WeeklyFaithReflection>;
  devotionalProgress: Record<string, DevotionalPlanProgress>;
  updatedAt: number;
};

function userDocRef(uid: string) {
  return doc(getFirestoreDb(), 'users', uid, 'app', 'data');
}

/** Firestore rejects `undefined`; strip it recursively before writes. */
function stripUndefinedDeep<T>(value: T): T {
  if (value === undefined) {
    return value;
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as T;
  }
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (val !== undefined) {
      result[key] = stripUndefinedDeep(val);
    }
  }
  return result as T;
}

export async function loadUserAppData(uid: string): Promise<UserAppData | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return null;
  const raw = snap.data() as UserAppData;
  return {
    ...raw,
    journalEntries: raw.journalEntries ?? [],
    weeklyFaithReflections: raw.weeklyFaithReflections ?? {},
    devotionalProgress: raw.devotionalProgress ?? {},
  };
}

export async function saveUserAppData(uid: string, data: UserAppData): Promise<void> {
  const payload = stripUndefinedDeep({
    ...data,
    journalEntries: data.journalEntries ?? [],
    weeklyFaithReflections: data.weeklyFaithReflections ?? {},
    devotionalProgress: data.devotionalProgress ?? {},
  });

  await setDoc(userDocRef(uid), payload, { merge: true });
}

/** Permanently remove a user's synced app data document. */
export async function deleteUserAppData(uid: string): Promise<void> {
  await deleteDoc(userDocRef(uid));
}

export async function loadCloudAppData(): Promise<UserAppData | null> {
  const user = requireRegisteredUser();
  return loadUserAppData(user.uid);
}

export async function saveCloudAppData(data: UserAppData): Promise<void> {
  const user = requireRegisteredUser();
  await saveUserAppData(user.uid, data);
}
