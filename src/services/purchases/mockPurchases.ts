import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREMIUM_TRIAL_DAYS } from '@/src/constants/subscription';
import type { PurchaseService } from './PurchaseService';
import type { PurchaseEntitlement, PurchaseOfferings, PurchasePackage } from './types';

const ENTITLEMENT_KEY = 'bibleadvice.subscription.mockEntitlement';

export const MOCK_MONTHLY_PACKAGE: PurchasePackage = {
  identifier: 'bibleadvice_premium_monthly',
  title: 'Rioba Premium',
  priceString: '$4.99/month',
  billingPeriod: 'monthly',
  trialDays: PREMIUM_TRIAL_DAYS,
};

const EMPTY_ENTITLEMENT: PurchaseEntitlement = {
  isPremium: false,
  isTrial: false,
};

async function readEntitlement(): Promise<PurchaseEntitlement> {
  const raw = await AsyncStorage.getItem(ENTITLEMENT_KEY);
  if (!raw) return EMPTY_ENTITLEMENT;
  try {
    const parsed = JSON.parse(raw) as PurchaseEntitlement;
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      await AsyncStorage.removeItem(ENTITLEMENT_KEY);
      return EMPTY_ENTITLEMENT;
    }
    return parsed;
  } catch {
    return EMPTY_ENTITLEMENT;
  }
}

async function writeEntitlement(entitlement: PurchaseEntitlement): Promise<void> {
  await AsyncStorage.setItem(ENTITLEMENT_KEY, JSON.stringify(entitlement));
}

/** In-memory mock for Expo Go and development (no native billing module). */
export const mockPurchaseService: PurchaseService = {
  async getOfferings(): Promise<PurchaseOfferings> {
    return { packages: [MOCK_MONTHLY_PACKAGE] };
  },

  async purchasePackage(pkg: PurchasePackage): Promise<PurchaseEntitlement> {
    const trialMs = pkg.trialDays * 86_400_000;
    const entitlement: PurchaseEntitlement = {
      isPremium: true,
      isTrial: true,
      expiresAt: Date.now() + trialMs,
      productId: pkg.identifier,
    };
    await writeEntitlement(entitlement);
    return entitlement;
  },

  async restorePurchases(): Promise<PurchaseEntitlement> {
    return readEntitlement();
  },

  async getEntitlement(): Promise<PurchaseEntitlement> {
    return readEntitlement();
  },
};
