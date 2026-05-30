import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DEFAULT_GUIDANCE } from '@/src/data/defaultGuidance';
import { MOCK_REFLECTIONS } from '@/src/data/mock';
import {
  ChatMessage,
  ChatSession,
  DevotionalPlanProgress,
  GuidanceResponse,
  JournalEntry,
  ProfileStats,
  SavedReflection,
  UserPreferences,
  UserProfile,
  WeeklyFaithReflection,
} from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';
import {
  isFirebaseConfigured,
  loadCloudAppData,
  saveCloudAppData,
  type UserAppData,
} from '@/src/services/firebase';
import { chatTitleFromText } from '@/src/utils/chatTitle';
import { journalTitleFromBody } from '@/src/utils/journalTitle';
import { sessionHasUserMessage } from '@/src/utils/chatSession';
import { isColorThemeId } from '@/src/theme/colorThemes';
import { normalizeReflection, normalizeReflectionList } from '@/src/utils/normalizeReflection';
import { AppStorageKeys, getStorageKeys } from '@/src/utils/storageKeys';
import {
  buildWeeklyReflectionTemplate,
  groupReflectionsByWeek,
} from '@/src/utils/weeklyReflection';

const defaultPreferences: UserPreferences = {
  translation: 'NIV',
  tone: 'gentle',
  prayerPreference: 'scripture-focused',
  autoIncludePrayer: true,
  colorTheme: 'sage',
  onboardingComplete: false,
};

const defaultProfile: UserProfile = {
  displayName: 'Friend in Faith',
  avatarUri: null,
  joinedAt: Date.now(),
};

function createEmptySession(): ChatSession {
  const now = Date.now();
  return {
    id: `chat-${now}`,
    title: 'New conversation',
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

type AppContextValue = {
  preferences: UserPreferences;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
  ready: boolean;
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  profileStats: ProfileStats;
  conversations: ChatSession[];
  activeConversationId: string;
  messages: ChatMessage[];
  canStartNewChat: boolean;
  createNewChat: () => boolean;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void;
  reflections: SavedReflection[];
  saveReflection: (item: SavedReflection, options?: { syncWeeklyFaith?: boolean }) => void;
  removeReflection: (id: string) => void;
  isReflectionSaved: (id: string) => boolean;
  getGuidance: (id: string) => GuidanceResponse | undefined;
  saveGuidance: (guidance: GuidanceResponse) => void;
  getReflection: (id: string) => SavedReflection | undefined;
  weeklyFaithReflections: Record<string, WeeklyFaithReflection>;
  getWeeklyFaithReflection: (weekKey: string) => WeeklyFaithReflection | undefined;
  updateWeeklyFaithReflection: (weekKey: string, body: string) => void;
  journalEntries: JournalEntry[];
  saveJournalEntry: (body: string, title?: string) => string;
  updateJournalEntry: (id: string, patch: Partial<Pick<JournalEntry, 'title' | 'body'>>) => void;
  deleteJournalEntry: (id: string) => void;
  getJournalEntry: (id: string) => JournalEntry | undefined;
  devotionalProgress: Record<string, DevotionalPlanProgress>;
  getPlanProgress: (planId: string) => DevotionalPlanProgress | undefined;
  toggleDayComplete: (planId: string, day: number, totalDays: number) => void;
  /** True when EXPO_PUBLIC_FIREBASE_* env vars are set */
  firebaseEnabled: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

function computeStats(
  profile: UserProfile,
  reflections: SavedReflection[],
  journalEntries: JournalEntry[],
): ProfileStats {
  const msPerDay = 86400000;
  const daysOnApp = Math.max(
    1,
    Math.floor((Date.now() - profile.joinedAt) / msPerDay) + 1,
  );
  const savedScriptures = reflections.filter((r) => r.type === 'verse').length;
  return { daysOnApp, savedScriptures, journalEntries: journalEntries.length };
}

function migrateJournalReflections(reflections: SavedReflection[]): JournalEntry[] {
  return reflections
    .filter((r) => r.type === 'journal')
    .map((r) => {
      const when = Date.parse(r.date);
      const ts = Number.isNaN(when) ? Date.now() : when;
      return {
        id: r.id,
        title: r.title,
        body: r.body ?? r.preview,
        createdAt: ts,
        updatedAt: ts,
      };
    });
}

function getLocalDataVersion(chats: ChatSession[]): number {
  return chats.reduce((max, c) => Math.max(max, c.updatedAt), 0);
}

async function persistAllLocal(keys: AppStorageKeys, data: UserAppData): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(keys.prefs, JSON.stringify(data.preferences)),
    AsyncStorage.setItem(keys.profile, JSON.stringify(data.profile)),
    AsyncStorage.setItem(keys.chats, JSON.stringify(data.conversations)),
    AsyncStorage.setItem(keys.activeChat, data.activeConversationId),
    AsyncStorage.setItem(keys.guidance, JSON.stringify(data.guidanceById)),
    AsyncStorage.setItem(keys.reflections, JSON.stringify(data.reflections)),
    AsyncStorage.setItem(keys.journals, JSON.stringify(data.journalEntries)),
    AsyncStorage.setItem(
      keys.weeklyReflections,
      JSON.stringify(data.weeklyFaithReflections ?? {}),
    ),
    AsyncStorage.setItem(
      keys.devotionalProgress,
      JSON.stringify(data.devotionalProgress ?? {}),
    ),
  ]);
}

function buildDefaultGuidance(): Record<string, GuidanceResponse> {
  return { 'guidance-1': { ...DEFAULT_GUIDANCE } };
}

function backfillWeeklyFaithReflections(
  reflections: SavedReflection[],
  weekly: Record<string, WeeklyFaithReflection>,
): Record<string, WeeklyFaithReflection> {
  const next = { ...weekly };
  for (const { weekKey, items } of groupReflectionsByWeek(reflections)) {
    if (next[weekKey]) continue;
    const now = Date.now();
    next[weekKey] = {
      weekKey,
      body: buildWeeklyReflectionTemplate(weekKey, items),
      createdAt: now,
      updatedAt: now,
    };
  }
  return next;
}

function deriveTitleFromMessages(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === 'user' && m.content.trim());
  return firstUser ? chatTitleFromText(firstUser.content) : 'New conversation';
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, authReady, firebaseRequired, isAuthenticated } = useAuth();
  const initialSession = useMemo(() => createEmptySession(), []);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [conversations, setConversations] = useState<ChatSession[]>([initialSession]);
  const [activeConversationId, setActiveConversationId] = useState(initialSession.id);
  const [reflections, setReflections] = useState<SavedReflection[]>(MOCK_REFLECTIONS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [weeklyFaithReflections, setWeeklyFaithReflections] = useState<
    Record<string, WeeklyFaithReflection>
  >({});
  const [devotionalProgress, setDevotionalProgress] = useState<
    Record<string, DevotionalPlanProgress>
  >({});
  const [guidanceById, setGuidanceById] = useState<Record<string, GuidanceResponse>>(buildDefaultGuidance);
  const guidanceByIdRef = useRef<Record<string, GuidanceResponse>>(buildDefaultGuidance());
  const activeConversationIdRef = useRef(activeConversationId);
  const messageIdSeq = useRef(0);
  const storageKeysRef = useRef<AppStorageKeys>(getStorageKeys(null));
  const [ready, setReady] = useState(false);

  const applyLoadedState = useCallback(
    (data: {
      preferences: UserPreferences;
      profile: UserProfile;
      conversations: ChatSession[];
      activeConversationId: string;
      guidanceById: Record<string, GuidanceResponse>;
      reflections: SavedReflection[];
      journalEntries: JournalEntry[];
      weeklyFaithReflections: Record<string, WeeklyFaithReflection>;
      devotionalProgress: Record<string, DevotionalPlanProgress>;
    }) => {
      setPreferences(data.preferences);
      setProfile(data.profile);
      setConversations(data.conversations);
      setActiveConversationId(data.activeConversationId);
      activeConversationIdRef.current = data.activeConversationId;
      guidanceByIdRef.current = data.guidanceById;
      setGuidanceById(data.guidanceById);
      setReflections(data.reflections);
      setJournalEntries(data.journalEntries);
      setWeeklyFaithReflections(data.weeklyFaithReflections);
      setDevotionalProgress(data.devotionalProgress);
    },
    [],
  );

  const resetToDefaults = useCallback(() => {
    const session = createEmptySession();
    const guidance = buildDefaultGuidance();
    applyLoadedState({
      preferences: { ...defaultPreferences },
      profile: { ...defaultProfile },
      conversations: [session],
      activeConversationId: session.id,
      guidanceById: guidance,
      reflections: firebaseRequired ? [] : MOCK_REFLECTIONS,
      journalEntries: [],
      weeklyFaithReflections: {},
      devotionalProgress: {},
    });
  }, [applyLoadedState, firebaseRequired]);

  useEffect(() => {
    guidanceByIdRef.current = guidanceById;
  }, [guidanceById]);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  const persistChats = useCallback(async (chats: ChatSession[], activeId: string) => {
    const keys = storageKeysRef.current;
    await Promise.all([
      AsyncStorage.setItem(keys.chats, JSON.stringify(chats)),
      AsyncStorage.setItem(keys.activeChat, activeId),
    ]);
  }, []);

  const loadDataForUser = useCallback(
    async (userId: string | null, useCloud: boolean) => {
      const keys = getStorageKeys(userId);
      storageKeysRef.current = keys;

      const [
        prefsRaw,
        profileRaw,
        chatsRaw,
        activeRaw,
        msgsRaw,
        guidanceRaw,
        reflectionsRaw,
        journalsRaw,
        weeklyRaw,
        devotionalRaw,
      ] = await Promise.all([
        AsyncStorage.getItem(keys.prefs),
        AsyncStorage.getItem(keys.profile),
        AsyncStorage.getItem(keys.chats),
        AsyncStorage.getItem(keys.activeChat),
        AsyncStorage.getItem(keys.messages),
        AsyncStorage.getItem(keys.guidance),
        AsyncStorage.getItem(keys.reflections),
        AsyncStorage.getItem(keys.journals),
        AsyncStorage.getItem(keys.weeklyReflections),
        AsyncStorage.getItem(keys.devotionalProgress),
      ]);

      let nextPrefs = { ...defaultPreferences };
      if (prefsRaw) {
        const parsed = JSON.parse(prefsRaw);
        nextPrefs = {
          ...defaultPreferences,
          ...parsed,
          autoIncludePrayer: parsed.autoIncludePrayer ?? true,
          colorTheme:
            typeof parsed.colorTheme === 'string' && isColorThemeId(parsed.colorTheme)
              ? parsed.colorTheme
              : defaultPreferences.colorTheme,
        };
      }

      let nextProfile = { ...defaultProfile };
      if (profileRaw) {
        nextProfile = { ...defaultProfile, ...JSON.parse(profileRaw) };
      }
      if (user?.displayName && userId) {
        nextProfile = { ...nextProfile, displayName: user.displayName };
      }

      let chats: ChatSession[] = [];
      if (chatsRaw) {
        chats = JSON.parse(chatsRaw) as ChatSession[];
      } else if (msgsRaw) {
        const legacyMessages = JSON.parse(msgsRaw) as ChatMessage[];
        const migrated = createEmptySession();
        migrated.messages = legacyMessages;
        migrated.title = deriveTitleFromMessages(legacyMessages);
        migrated.updatedAt = legacyMessages.at(-1)?.timestamp ?? migrated.updatedAt;
        chats = [migrated];
      }
      if (chats.length === 0) {
        chats = [createEmptySession()];
      }

      const activeId =
        activeRaw && chats.some((c) => c.id === activeRaw) ? activeRaw : chats[0].id;

      let nextGuidance = buildDefaultGuidance();
      if (guidanceRaw) {
        nextGuidance = JSON.parse(guidanceRaw) as Record<string, GuidanceResponse>;
      }

      let nextReflections: SavedReflection[] = userId ? [] : MOCK_REFLECTIONS;
      if (reflectionsRaw) {
        nextReflections = JSON.parse(reflectionsRaw) as SavedReflection[];
      }
      nextReflections = normalizeReflectionList(nextReflections);

      let nextWeekly: Record<string, WeeklyFaithReflection> = {};
      if (weeklyRaw) {
        nextWeekly = JSON.parse(weeklyRaw) as Record<string, WeeklyFaithReflection>;
      }
      nextWeekly = backfillWeeklyFaithReflections(nextReflections, nextWeekly);

      let nextJournals: JournalEntry[] = [];
      if (journalsRaw) {
        nextJournals = JSON.parse(journalsRaw) as JournalEntry[];
      } else if (nextReflections.length > 0) {
        nextJournals = migrateJournalReflections(nextReflections);
      }

      let nextDevotional: Record<string, DevotionalPlanProgress> = {};
      if (devotionalRaw) {
        nextDevotional = JSON.parse(devotionalRaw) as Record<string, DevotionalPlanProgress>;
      }

      if (useCloud) {
        try {
          const cloud = await loadCloudAppData();
          if (cloud) {
            const localVersion = getLocalDataVersion(chats);
            if (cloud.updatedAt > localVersion) {
              nextPrefs = { ...defaultPreferences, ...cloud.preferences };
              nextProfile = { ...defaultProfile, ...cloud.profile };
              if (user?.displayName) {
                nextProfile.displayName = user.displayName;
              }
              chats = cloud.conversations.length ? cloud.conversations : [createEmptySession()];
              const mergedActive =
                cloud.activeConversationId &&
                chats.some((c) => c.id === cloud.activeConversationId)
                  ? cloud.activeConversationId
                  : chats[0].id;
              const cloudJournals =
                cloud.journalEntries?.length > 0
                  ? cloud.journalEntries
                  : migrateJournalReflections(cloud.reflections);

              applyLoadedState({
                preferences: nextPrefs,
                profile: nextProfile,
                conversations: chats,
                activeConversationId: mergedActive,
                guidanceById: cloud.guidanceById,
                reflections: normalizeReflectionList(cloud.reflections),
                journalEntries: cloudJournals,
                weeklyFaithReflections: backfillWeeklyFaithReflections(
                  normalizeReflectionList(cloud.reflections),
                  cloud.weeklyFaithReflections ?? {},
                ),
                devotionalProgress: cloud.devotionalProgress ?? {},
              });

              await persistAllLocal(keys, {
                preferences: nextPrefs,
                profile: nextProfile,
                conversations: chats,
                activeConversationId: mergedActive,
                guidanceById: cloud.guidanceById,
                reflections: normalizeReflectionList(cloud.reflections),
                journalEntries: cloudJournals,
                weeklyFaithReflections: backfillWeeklyFaithReflections(
                  normalizeReflectionList(cloud.reflections),
                  cloud.weeklyFaithReflections ?? {},
                ),
                devotionalProgress: cloud.devotionalProgress ?? {},
                updatedAt: cloud.updatedAt,
              });
              return;
            }
          }
        } catch (error) {
          console.warn('[Firebase] Could not load cloud data:', error);
        }
      }

      applyLoadedState({
        preferences: nextPrefs,
        profile: nextProfile,
        conversations: chats,
        activeConversationId: activeId,
        guidanceById: nextGuidance,
        reflections: nextReflections,
        journalEntries: nextJournals,
        weeklyFaithReflections: nextWeekly,
        devotionalProgress: nextDevotional,
      });
    },
    [applyLoadedState, user?.displayName],
  );

  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;

    (async () => {
      setReady(false);

      if (firebaseRequired && !isAuthenticated) {
        resetToDefaults();
        if (!cancelled) setReady(true);
        return;
      }

      const userId = isAuthenticated && user ? user.uid : null;
      try {
        await loadDataForUser(userId, Boolean(userId && isFirebaseConfigured()));
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    authReady,
    user?.uid,
    isAuthenticated,
    firebaseRequired,
    loadDataForUser,
    resetToDefaults,
  ]);

  useEffect(() => {
    if (!ready || !isFirebaseConfigured() || !isAuthenticated) return;

    const timeout = setTimeout(() => {
      void saveCloudAppData({
        preferences,
        profile,
        conversations,
        activeConversationId,
        guidanceById,
        reflections,
        journalEntries,
        weeklyFaithReflections,
        devotionalProgress,
        updatedAt: Date.now(),
      }).catch((error) => {
        console.warn('[Firebase] Could not sync to cloud:', error);
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [
    ready,
    preferences,
    profile,
    conversations,
    activeConversationId,
    guidanceById,
    reflections,
    journalEntries,
    weeklyFaithReflections,
    devotionalProgress,
    isAuthenticated,
  ]);

  const messages = useMemo(() => {
    const active = conversations.find((c) => c.id === activeConversationId);
    return active?.messages ?? [];
  }, [conversations, activeConversationId]);

  const canStartNewChat = useMemo(() => {
    const active = conversations.find((c) => c.id === activeConversationId);
    return !active || sessionHasUserMessage(active);
  }, [conversations, activeConversationId]);

  const updateConversations = useCallback(
    (updater: (prev: ChatSession[]) => ChatSession[]) => {
      setConversations((prev) => {
        const next = updater(prev);
        void persistChats(next, activeConversationIdRef.current);
        return next;
      });
    },
    [persistChats],
  );

  const createNewChat = useCallback(() => {
    const active = conversations.find((c) => c.id === activeConversationIdRef.current);
    if (active && !sessionHasUserMessage(active)) {
      return false;
    }

    const session = createEmptySession();
    setConversations((prev) => {
      const next = [
        session,
        ...prev.filter((c) => c.id !== session.id && sessionHasUserMessage(c)),
      ];
      void persistChats(next, session.id);
      return next;
    });
    setActiveConversationId(session.id);
    activeConversationIdRef.current = session.id;
    return true;
  }, [conversations, persistChats]);

  const selectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      activeConversationIdRef.current = id;
      setConversations((prev) => {
        void persistChats(prev, id);
        return prev;
      });
    },
    [persistChats],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        let next = prev.filter((c) => c.id !== id);
        if (next.length === 0) {
          next = [createEmptySession()];
        }

        let activeId = activeConversationIdRef.current;
        if (activeId === id) {
          activeId = next[0].id;
          setActiveConversationId(activeId);
          activeConversationIdRef.current = activeId;
        }

        void persistChats(next, activeId);
        return next;
      });
    },
    [persistChats],
  );

  const persistPrefs = useCallback(async (prefs: UserPreferences) => {
    await AsyncStorage.setItem(storageKeysRef.current.prefs, JSON.stringify(prefs));
  }, []);

  const persistProfile = useCallback(async (p: UserProfile) => {
    await AsyncStorage.setItem(storageKeysRef.current.profile, JSON.stringify(p));
  }, []);

  const updatePreferences = useCallback(
    (patch: Partial<UserPreferences>) => {
      setPreferences((prev) => {
        const next = { ...prev, ...patch };
        void persistPrefs(next);
        return next;
      });
    },
    [persistPrefs],
  );

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...patch };
        void persistProfile(next);
        return next;
      });
    },
    [persistProfile],
  );

  const completeOnboarding = useCallback(() => {
    updatePreferences({ onboardingComplete: true });
    updateProfile({ joinedAt: Date.now() });
  }, [updatePreferences, updateProfile]);

  const addMessage = useCallback(
    (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      messageIdSeq.current += 1;
      const id = `msg-${Date.now()}-${messageIdSeq.current}`;
      const entry: ChatMessage = { ...msg, id, timestamp: Date.now() };
      const activeId = activeConversationIdRef.current;

      updateConversations((prev) =>
        prev.map((session) => {
          if (session.id !== activeId) return session;

          const nextMessages = [...session.messages, entry];
          let title = session.title;
          if (
            msg.role === 'user' &&
            (session.title === 'New conversation' || session.messages.length === 0)
          ) {
            title = chatTitleFromText(msg.content);
          }

          return {
            ...session,
            messages: nextMessages,
            title,
            updatedAt: Date.now(),
          };
        }),
      );

      return id;
    },
    [updateConversations],
  );

  const updateMessage = useCallback(
    (id: string, patch: Partial<ChatMessage>) => {
      const activeId = activeConversationIdRef.current;
      updateConversations((prev) =>
        prev.map((session) => {
          if (session.id !== activeId) return session;
          return {
            ...session,
            messages: session.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
            updatedAt: Date.now(),
          };
        }),
      );
    },
    [updateConversations],
  );

  const persistReflections = useCallback(async (items: SavedReflection[]) => {
    await AsyncStorage.setItem(storageKeysRef.current.reflections, JSON.stringify(items));
  }, []);

  const persistWeeklyReflections = useCallback(
    async (items: Record<string, WeeklyFaithReflection>) => {
      await AsyncStorage.setItem(
        storageKeysRef.current.weeklyReflections,
        JSON.stringify(items),
      );
    },
    [],
  );

  const saveReflection = useCallback(
    (item: SavedReflection, options?: { syncWeeklyFaith?: boolean }) => {
      const normalized = normalizeReflection({ ...item, liked: true });
      const syncWeeklyFaith = options?.syncWeeklyFaith ?? true;

      setReflections((prev) => {
        const next = [normalized, ...prev.filter((r) => r.id !== normalized.id)];
        void persistReflections(next);

        if (syncWeeklyFaith) {
          setWeeklyFaithReflections((weekly) => {
            if (weekly[normalized.weekKey]) return weekly;
            const weekItems = next.filter((r) => r.weekKey === normalized.weekKey);
            const now = Date.now();
            const created: WeeklyFaithReflection = {
              weekKey: normalized.weekKey,
              body: buildWeeklyReflectionTemplate(normalized.weekKey, weekItems),
              createdAt: now,
              updatedAt: now,
            };
            const nextWeekly = { ...weekly, [normalized.weekKey]: created };
            void persistWeeklyReflections(nextWeekly);
            return nextWeekly;
          });
        }

        return next;
      });
    },
    [persistReflections, persistWeeklyReflections],
  );

  const removeReflection = useCallback(
    (id: string) => {
      setReflections((prev) => {
        const next = prev.filter((r) => r.id !== id);
        void persistReflections(next);
        return next;
      });
    },
    [persistReflections],
  );

  const isReflectionSaved = useCallback(
    (id: string) => reflections.some((r) => r.id === id),
    [reflections],
  );

  const persistGuidance = useCallback(async (map: Record<string, GuidanceResponse>) => {
    await AsyncStorage.setItem(storageKeysRef.current.guidance, JSON.stringify(map));
  }, []);

  const saveGuidance = useCallback(
    (guidance: GuidanceResponse) => {
      const next = { ...guidanceByIdRef.current, [guidance.id]: guidance };
      guidanceByIdRef.current = next;
      setGuidanceById(next);
      void persistGuidance(next);
    },
    [persistGuidance],
  );

  const getGuidance = useCallback((id: string) => guidanceByIdRef.current[id], []);

  const getReflection = useCallback(
    (id: string) => reflections.find((r) => r.id === id),
    [reflections],
  );

  const getWeeklyFaithReflection = useCallback(
    (weekKey: string) => weeklyFaithReflections[weekKey],
    [weeklyFaithReflections],
  );

  const updateWeeklyFaithReflection = useCallback(
    (weekKey: string, body: string) => {
      setWeeklyFaithReflections((prev) => {
        const existing = prev[weekKey];
        const now = Date.now();
        const nextEntry: WeeklyFaithReflection = existing
          ? { ...existing, body, updatedAt: now }
          : {
              weekKey,
              body,
              createdAt: now,
              updatedAt: now,
            };
        const next = { ...prev, [weekKey]: nextEntry };
        void persistWeeklyReflections(next);
        return next;
      });
    },
    [persistWeeklyReflections],
  );

  const persistJournals = useCallback(async (items: JournalEntry[]) => {
    await AsyncStorage.setItem(storageKeysRef.current.journals, JSON.stringify(items));
  }, []);

  const persistDevotionalProgress = useCallback(
    async (items: Record<string, DevotionalPlanProgress>) => {
      await AsyncStorage.setItem(
        storageKeysRef.current.devotionalProgress,
        JSON.stringify(items),
      );
    },
    [],
  );

  const saveJournalEntry = useCallback(
    (body: string, title?: string) => {
      const now = Date.now();
      const entry: JournalEntry = {
        id: `journal-${now}`,
        title: title?.trim() || journalTitleFromBody(body),
        body,
        createdAt: now,
        updatedAt: now,
      };
      setJournalEntries((prev) => {
        const next = [entry, ...prev];
        void persistJournals(next);
        return next;
      });
      return entry.id;
    },
    [persistJournals],
  );

  const updateJournalEntry = useCallback(
    (id: string, patch: Partial<Pick<JournalEntry, 'title' | 'body'>>) => {
      setJournalEntries((prev) => {
        const next = prev.map((entry) => {
          if (entry.id !== id) return entry;
          const body = patch.body ?? entry.body;
          return {
            ...entry,
            ...patch,
            body,
            title: patch.title?.trim() || (patch.body ? journalTitleFromBody(body) : entry.title),
            updatedAt: Date.now(),
          };
        });
        void persistJournals(next);
        return next;
      });
    },
    [persistJournals],
  );

  const deleteJournalEntry = useCallback(
    (id: string) => {
      setJournalEntries((prev) => {
        const next = prev.filter((entry) => entry.id !== id);
        void persistJournals(next);
        return next;
      });
    },
    [persistJournals],
  );

  const getJournalEntry = useCallback(
    (id: string) => journalEntries.find((entry) => entry.id === id),
    [journalEntries],
  );

  const getPlanProgress = useCallback(
    (planId: string) => devotionalProgress[planId],
    [devotionalProgress],
  );

  const toggleDayComplete = useCallback(
    (planId: string, day: number, totalDays: number) => {
      setDevotionalProgress((prev) => {
        const existing = prev[planId];
        const now = Date.now();
        let completedDays = existing?.completedDays ?? [];
        const wasComplete = completedDays.includes(day);

        if (wasComplete) {
          completedDays = completedDays.filter((d) => d !== day);
        } else {
          completedDays = [...completedDays, day].sort((a, b) => a - b);
        }

        const allDone =
          completedDays.length >= totalDays &&
          Array.from({ length: totalDays }, (_, i) => i + 1).every((d) =>
            completedDays.includes(d),
          );

        const nextRecord: DevotionalPlanProgress = {
          planId,
          completedDays,
          startedAt: existing?.startedAt ?? now,
          updatedAt: now,
          completedAt: allDone ? existing?.completedAt ?? now : undefined,
        };

        const next = { ...prev, [planId]: nextRecord };
        void persistDevotionalProgress(next);
        return next;
      });
    },
    [persistDevotionalProgress],
  );

  const profileStats = useMemo(
    () => computeStats(profile, reflections, journalEntries),
    [profile, reflections, journalEntries],
  );

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
      completeOnboarding,
      ready,
      profile,
      updateProfile,
      profileStats,
      conversations,
      activeConversationId,
      messages,
      canStartNewChat,
      createNewChat,
      selectConversation,
      deleteConversation,
      addMessage,
      updateMessage,
      reflections,
      saveReflection,
      removeReflection,
      isReflectionSaved,
      getGuidance,
      saveGuidance,
      getReflection,
      weeklyFaithReflections,
      getWeeklyFaithReflection,
      updateWeeklyFaithReflection,
      journalEntries,
      saveJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      getJournalEntry,
      devotionalProgress,
      getPlanProgress,
      toggleDayComplete,
      firebaseEnabled: isFirebaseConfigured(),
    }),
    [
      preferences,
      updatePreferences,
      completeOnboarding,
      ready,
      profile,
      updateProfile,
      profileStats,
      conversations,
      activeConversationId,
      messages,
      canStartNewChat,
      createNewChat,
      selectConversation,
      deleteConversation,
      addMessage,
      updateMessage,
      reflections,
      saveReflection,
      removeReflection,
      isReflectionSaved,
      getGuidance,
      saveGuidance,
      getReflection,
      weeklyFaithReflections,
      getWeeklyFaithReflection,
      updateWeeklyFaithReflection,
      journalEntries,
      saveJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      getJournalEntry,
      devotionalProgress,
      getPlanProgress,
      toggleDayComplete,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
