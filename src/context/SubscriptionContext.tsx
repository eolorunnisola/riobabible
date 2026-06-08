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
import {
  FREE_TIER_LIMITS,
  PREMIUM_TRIAL_DAYS,
} from '@/src/constants/subscription';
import {
  createPurchaseService,
  type PurchaseEntitlement,
  type PurchasePackage,
} from '@/src/services/purchases';
import { useAuth } from '@/src/context/AuthContext';
import { getLocalDateKey } from '@/src/utils/dateKey';

export type SubscriptionTier = 'free' | 'premium';

export { FREE_TIER_LIMITS, PREMIUM_TRIAL_DAYS };

/** Features unlocked by Premium (paywall & comparison UI). */
export const PREMIUM_FEATURES: { icon: string; title: string; description: string }[] = [
  {
    icon: 'chatbubbles-outline',
    title: 'Unlimited guidance',
    description: 'Ask as many questions as your heart needs — no daily cap.',
  },
  {
    icon: 'book-outline',
    title: 'Full journal history',
    description: 'Revisit and search every reflection you have ever written.',
  },
  {
    icon: 'calendar-outline',
    title: 'Devotional plans',
    description: 'Multi-day guided plans for seasons of growth and struggle.',
  },
  {
    icon: 'create-outline',
    title: 'Weekly faith reflections',
    description: 'Editable weekly notes that grow with your saved verses and prayers.',
  },
  {
    icon: 'color-palette-outline',
    title: 'All color themes',
    description: 'Unlock every app palette beyond Sage Mist.',
  },
];

// Anonymous / signed-out fallback keys (legacy). When a user is signed in these
// are namespaced per uid so one account's trial/usage never leaks to another.
const LEGACY_TRIAL_KEY = 'bibleadvice.subscription.trialEndsAt';
const LEGACY_USAGE_KEY = 'bibleadvice.subscription.chatUsage';

function trialKey(uid: string | null): string {
  return uid ? `@bibleadvice/users/${uid}/subscription/trialEndsAt` : LEGACY_TRIAL_KEY;
}

function usageKey(uid: string | null): string {
  return uid ? `@bibleadvice/users/${uid}/subscription/chatUsage` : LEGACY_USAGE_KEY;
}

type ChatUsageRecord = { date: string; count: number };

type SubscriptionContextValue = {
  tier: SubscriptionTier;
  isPremium: boolean;
  ready: boolean;
  /** Store entitlement (production source of truth). */
  realEntitlement: PurchaseEntitlement;
  trialActive: boolean;
  trialEndsAt: number | null;
  daysLeftInTrial: number;
  chatsUsedToday: number;
  remainingChats: number;
  chatLimitReached: boolean;
  freeTierLimits: typeof FREE_TIER_LIMITS;
  trialDays: number;
  monthlyPackage: PurchasePackage | null;
  startTrial: () => Promise<void>;
  purchasePremium: () => Promise<boolean>;
  restore: () => Promise<boolean>;
  recordChatUsed: () => void;
  refreshEntitlement: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function daysLeft(endsAt: number): number {
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 86_400_000));
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const purchaseService = useRef(createPurchaseService()).current;
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [ready, setReady] = useState(false);
  const [realEntitlement, setRealEntitlement] = useState<PurchaseEntitlement>({
    isPremium: false,
    isTrial: false,
  });
  const [trialEndsAt, setTrialEndsAt] = useState<number | null>(null);
  const [chatUsage, setChatUsage] = useState<ChatUsageRecord>({ date: getLocalDateKey(), count: 0 });
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasePackage | null>(null);

  const refreshEntitlement = useCallback(async () => {
    const entitlement = await purchaseService.getEntitlement();
    setRealEntitlement(entitlement);
    if (entitlement.expiresAt && entitlement.isTrial) {
      setTrialEndsAt(entitlement.expiresAt);
    }
  }, [purchaseService]);

  useEffect(() => {
    let cancelled = false;

    // Account changed (sign-in / sign-out / switch). Reset any previous account's
    // state immediately so nothing leaks across the transition, then reload.
    setReady(false);
    setRealEntitlement({ isPremium: false, isTrial: false });
    setTrialEndsAt(null);
    setChatUsage({ date: getLocalDateKey(), count: 0 });

    (async () => {
      // Bind (or detach) the store SDK to this app user so entitlements are
      // scoped per account, not per device.
      try {
        if (uid) await purchaseService.logIn(uid);
        else await purchaseService.logOut();
      } catch {
        // Non-fatal — entitlement read below still reflects the correct user.
      }

      const [trialRaw, usageRaw, offerings, entitlement] = await Promise.all([
        AsyncStorage.getItem(trialKey(uid)),
        AsyncStorage.getItem(usageKey(uid)),
        purchaseService.getOfferings(),
        purchaseService.getEntitlement(),
      ]);

      if (cancelled) return;

      let nextTrialEnds: number | null = null;
      if (trialRaw) {
        const ends = Number(trialRaw);
        if (!Number.isNaN(ends) && ends > Date.now()) nextTrialEnds = ends;
      }
      // A store-reported trial expiry is the source of truth when present.
      if (entitlement.expiresAt && entitlement.isTrial) nextTrialEnds = entitlement.expiresAt;
      setTrialEndsAt(nextTrialEnds);
      setRealEntitlement(entitlement);

      if (usageRaw) {
        try {
          const parsed = JSON.parse(usageRaw) as ChatUsageRecord;
          const today = getLocalDateKey();
          setChatUsage(parsed.date === today ? parsed : { date: today, count: 0 });
        } catch {
          setChatUsage({ date: getLocalDateKey(), count: 0 });
        }
      }

      setMonthlyPackage(offerings.packages[0] ?? null);
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, purchaseService]);

  const trialActive = useMemo(() => {
    if (realEntitlement.isTrial && realEntitlement.expiresAt && realEntitlement.expiresAt > Date.now()) {
      return true;
    }
    return trialEndsAt !== null && trialEndsAt > Date.now();
  }, [realEntitlement, trialEndsAt]);

  const effectiveTrialEndsAt = useMemo(() => {
    if (realEntitlement.expiresAt && realEntitlement.isTrial) return realEntitlement.expiresAt;
    return trialEndsAt;
  }, [realEntitlement, trialEndsAt]);

  const isPremium = useMemo(() => {
    if (realEntitlement.isPremium) return true;
    if (trialActive) return true;
    return false;
  }, [realEntitlement.isPremium, trialActive]);

  const tier: SubscriptionTier = isPremium ? 'premium' : 'free';

  const chatsUsedToday = chatUsage.date === getLocalDateKey() ? chatUsage.count : 0;
  const remainingChats = Math.max(0, FREE_TIER_LIMITS.dailyChatLimit - chatsUsedToday);
  const chatLimitReached = !isPremium && chatsUsedToday >= FREE_TIER_LIMITS.dailyChatLimit;

  const startTrial = useCallback(async () => {
    const ends = Date.now() + PREMIUM_TRIAL_DAYS * 86_400_000;
    setTrialEndsAt(ends);
    await AsyncStorage.setItem(trialKey(uid), String(ends));
  }, [uid]);

  const purchasePremium = useCallback(async () => {
    const pkg = monthlyPackage ?? (await purchaseService.getOfferings()).packages[0];
    if (!pkg) return false;

    const entitlement = await purchaseService.purchasePackage(pkg);
    setRealEntitlement(entitlement);
    if (entitlement.expiresAt) {
      setTrialEndsAt(entitlement.expiresAt);
      await AsyncStorage.setItem(trialKey(uid), String(entitlement.expiresAt));
    }
    return entitlement.isPremium;
  }, [monthlyPackage, purchaseService, uid]);

  const restore = useCallback(async () => {
    const entitlement = await purchaseService.restorePurchases();
    setRealEntitlement(entitlement);
    if (entitlement.expiresAt && entitlement.isTrial) {
      setTrialEndsAt(entitlement.expiresAt);
      await AsyncStorage.setItem(trialKey(uid), String(entitlement.expiresAt));
    }
    return entitlement.isPremium;
  }, [purchaseService, uid]);

  const recordChatUsed = useCallback(() => {
    const today = getLocalDateKey();
    setChatUsage((prev) => {
      const next: ChatUsageRecord =
        prev.date === today
          ? { date: today, count: prev.count + 1 }
          : { date: today, count: 1 };
      void AsyncStorage.setItem(usageKey(uid), JSON.stringify(next));
      return next;
    });
  }, [uid]);

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      tier,
      isPremium,
      ready,
      realEntitlement,
      trialActive,
      trialEndsAt: effectiveTrialEndsAt,
      daysLeftInTrial: effectiveTrialEndsAt ? daysLeft(effectiveTrialEndsAt) : 0,
      chatsUsedToday,
      remainingChats,
      chatLimitReached,
      freeTierLimits: FREE_TIER_LIMITS,
      trialDays: PREMIUM_TRIAL_DAYS,
      monthlyPackage,
      startTrial,
      purchasePremium,
      restore,
      recordChatUsed,
      refreshEntitlement,
    }),
    [
      tier,
      isPremium,
      ready,
      realEntitlement,
      trialActive,
      effectiveTrialEndsAt,
      chatsUsedToday,
      remainingChats,
      chatLimitReached,
      monthlyPackage,
      startTrial,
      purchasePremium,
      restore,
      recordChatUsed,
      refreshEntitlement,
    ],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
