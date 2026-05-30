import { useCallback } from 'react';
import { router } from 'expo-router';
import { useApp } from '@/src/context/AppContext';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useToast } from '@/src/context/ToastContext';
import { FREE_TIER_LIMITS } from '@/src/constants/subscription';
import { canSaveBillableReflection } from '@/src/utils/subscriptionGates';
import type { SavedReflection } from '@/src/types';

type SaveOptions = {
  /** When true, skips the limit check (e.g. re-saving an existing item). */
  allowUpdate?: boolean;
};

export function useReflectionSave() {
  const { saveReflection, removeReflection, isReflectionSaved, reflections } = useApp();
  const { isPremium } = useSubscription();
  const { showToast } = useToast();

  const trySaveReflection = useCallback(
    (item: SavedReflection, options?: SaveOptions) => {
      const alreadySaved = isReflectionSaved(item.id);
      if (alreadySaved || options?.allowUpdate) {
        saveReflection(item, { syncWeeklyFaith: isPremium });
        return true;
      }

      if (
        !canSaveBillableReflection(reflections, isPremium, item.id)
      ) {
        showToast(
          `Free plan includes ${FREE_TIER_LIMITS.savedReflectionsLimit} saved items. Upgrade for unlimited saves.`,
        );
        router.push('/profile/paywall');
        return false;
      }

      saveReflection(item, { syncWeeklyFaith: isPremium });
      return true;
    },
    [isPremium, isReflectionSaved, reflections, saveReflection, showToast],
  );

  return { trySaveReflection, removeReflection, isReflectionSaved };
}
