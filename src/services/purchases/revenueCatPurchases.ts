/**
 * RevenueCat-backed purchase service. Wraps Apple IAP (StoreKit) and Google Play
 * Billing behind one SDK and exposes the store-agnostic {@link PurchaseService} API.
 *
 * Requires a development/production build — Expo Go cannot load the native module.
 * Returns `null` (so callers fall back to the mock) when the native module is
 * unavailable or no platform API key is configured.
 *
 * Setup checklist lives in docs/DEPLOYMENT.md.
 */
import { Platform } from 'react-native';
import type {
  CustomerInfo,
  PurchasesIntroPrice,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesStoreProduct,
} from 'react-native-purchases';
import { PREMIUM_TRIAL_DAYS } from '@/src/constants/subscription';
import type { PurchaseService } from './PurchaseService';
import type { PurchaseEntitlement, PurchaseOfferings, PurchasePackage } from './types';

/** Entitlement identifier configured in the RevenueCat dashboard. */
const ENTITLEMENT_ID = 'premium';

function platformApiKey(): string | undefined {
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
    default: undefined,
  });
}

function trialDaysFromProduct(product: PurchasesStoreProduct): number {
  const intro: PurchasesIntroPrice | null = product.introPrice;
  // Only a zero-price intro phase counts as a free trial.
  if (!intro || intro.price > 0) return 0;
  const units = intro.periodNumberOfUnits;
  switch (intro.periodUnit) {
    case 'DAY':
      return units;
    case 'WEEK':
      return units * 7;
    case 'MONTH':
      return units * 30;
    case 'YEAR':
      return units * 365;
    default:
      return units;
  }
}

function toPurchasePackage(pkg: PurchasesPackage): PurchasePackage {
  return {
    identifier: pkg.identifier,
    title: pkg.product.title,
    priceString: pkg.product.priceString,
    billingPeriod: 'monthly',
    trialDays: trialDaysFromProduct(pkg.product) || PREMIUM_TRIAL_DAYS,
  };
}

function toEntitlement(info: CustomerInfo): PurchaseEntitlement {
  const active = info.entitlements.active[ENTITLEMENT_ID];
  if (!active?.isActive) {
    return { isPremium: false, isTrial: false };
  }
  return {
    isPremium: true,
    isTrial: active.periodType === 'TRIAL' || active.periodType === 'INTRO',
    expiresAt: active.expirationDate ? Date.parse(active.expirationDate) : undefined,
    productId: active.productIdentifier,
  };
}

export function createRevenueCatPurchaseService(): PurchaseService | null {
  let Purchases: typeof import('react-native-purchases').default;
  let LOG_LEVEL: typeof import('react-native-purchases').LOG_LEVEL;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-purchases');
    Purchases = mod.default ?? mod;
    LOG_LEVEL = mod.LOG_LEVEL;
  } catch {
    // Native module not linked (e.g. Expo Go) — caller falls back to mock.
    return null;
  }

  const apiKey = platformApiKey();
  if (!apiKey) {
    console.warn(
      '[Purchases] No RevenueCat API key for this platform; falling back to mock. ' +
        'Set EXPO_PUBLIC_REVENUECAT_IOS_API_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY.',
    );
    return null;
  }

  if (__DEV__) {
    void Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  Purchases.configure({ apiKey });

  // RevenueCat needs the native package object to start a purchase; our public
  // PurchasePackage carries only the identifier, so we cache the mapping here.
  const nativePackages = new Map<string, PurchasesPackage>();

  return {
    async getOfferings(): Promise<PurchaseOfferings> {
      const offerings: PurchasesOfferings = await Purchases.getOfferings();
      const available = offerings.current?.availablePackages ?? [];
      nativePackages.clear();
      for (const pkg of available) {
        nativePackages.set(pkg.identifier, pkg);
      }
      return { packages: available.map(toPurchasePackage) };
    },

    async purchasePackage(pkg: PurchasePackage): Promise<PurchaseEntitlement> {
      let native = nativePackages.get(pkg.identifier);
      if (!native) {
        const offerings = await Purchases.getOfferings();
        native = offerings.current?.availablePackages.find(
          (p) => p.identifier === pkg.identifier,
        );
      }
      if (!native) {
        throw new Error('This subscription is not available right now.');
      }

      try {
        const { customerInfo } = await Purchases.purchasePackage(native);
        return toEntitlement(customerInfo);
      } catch (e) {
        if (e && typeof e === 'object' && (e as { userCancelled?: boolean }).userCancelled) {
          // User dismissed the native sheet — surface their current (unchanged) state.
          return toEntitlement(await Purchases.getCustomerInfo());
        }
        throw e;
      }
    },

    async restorePurchases(): Promise<PurchaseEntitlement> {
      return toEntitlement(await Purchases.restorePurchases());
    },

    async getEntitlement(): Promise<PurchaseEntitlement> {
      return toEntitlement(await Purchases.getCustomerInfo());
    },
  };
}
