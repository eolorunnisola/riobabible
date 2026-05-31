import type { PurchaseService } from './PurchaseService';
import { mockPurchaseService } from './mockPurchases';
import { createRevenueCatPurchaseService } from './revenueCatPurchases';

export type { PurchaseService } from './PurchaseService';
export type { PurchaseEntitlement, PurchaseOfferings, PurchasePackage } from './types';
export { MOCK_MONTHLY_PACKAGE } from './mockPurchases';

/**
 * Selects the active purchase backend. Uses RevenueCat (Apple IAP / Play Billing)
 * when the native module is linked and a platform API key is configured; otherwise
 * falls back to the in-memory mock (Expo Go / development).
 */
export function createPurchaseService(): PurchaseService {
  return createRevenueCatPurchaseService() ?? mockPurchaseService;
}
