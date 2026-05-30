import type { PurchaseService } from './PurchaseService';
import { mockPurchaseService } from './mockPurchases';
import { createRevenueCatPurchaseService } from './revenueCatPurchases';

export type { PurchaseService } from './PurchaseService';
export type { PurchaseEntitlement, PurchaseOfferings, PurchasePackage } from './types';
export { MOCK_MONTHLY_PACKAGE } from './mockPurchases';

/**
 * Selects the active purchase backend. Defaults to mock when the native module is
 * unavailable (Expo Go). Production builds should use RevenueCat + StoreKit / Play Billing.
 */
export function createPurchaseService(): PurchaseService {
  if (__DEV__) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Purchases = require('react-native-purchases');
      if (Purchases?.default ?? Purchases) {
        return createRevenueCatPurchaseService();
      }
    } catch {
      // Native module not linked — expected in Expo Go.
    }
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('react-native-purchases');
      return createRevenueCatPurchaseService();
    } catch {
      console.warn(
        '[Purchases] react-native-purchases is not available; using mock (not valid for production).',
      );
    }
  }

  return mockPurchaseService;
}
