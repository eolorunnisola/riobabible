export type AppStorageKeys = {
  prefs: string;
  profile: string;
  chats: string;
  activeChat: string;
  messages: string;
  guidance: string;
  reflections: string;
  journals: string;
  weeklyReflections: string;
  devotionalProgress: string;
};

const LEGACY: AppStorageKeys = {
  prefs: '@bibleadvice/preferences',
  profile: '@bibleadvice/profile',
  chats: '@bibleadvice/chats',
  activeChat: '@bibleadvice/activeChatId',
  messages: '@bibleadvice/messages',
  guidance: '@bibleadvice/guidance',
  reflections: '@bibleadvice/reflections',
  journals: '@bibleadvice/journals',
  weeklyReflections: '@bibleadvice/weeklyReflections',
  devotionalProgress: '@bibleadvice/devotionalProgress',
};

/** Legacy keys when offline / no account; per-user keys when signed in. */
export function getStorageKeys(userId: string | null): AppStorageKeys {
  if (!userId) return LEGACY;
  const base = `@bibleadvice/users/${userId}`;
  return {
    prefs: `${base}/preferences`,
    profile: `${base}/profile`,
    chats: `${base}/chats`,
    activeChat: `${base}/activeChatId`,
    messages: `${base}/messages`,
    guidance: `${base}/guidance`,
    reflections: `${base}/reflections`,
    journals: `${base}/journals`,
    weeklyReflections: `${base}/weeklyReflections`,
    devotionalProgress: `${base}/devotionalProgress`,
  };
}
