import Constants, { ExecutionEnvironment } from 'expo-constants';
import type { PurchaseService } from './PurchaseService';
import { mockPurchaseService } from './mockPurchases';
import { createRevenueCatPurchaseService } from './revenueCatPurchases';

export type { PurchaseService } from './PurchaseService';
export type { PurchaseEntitlement, PurchaseOfferings, PurchasePackage } from './types';
export { MOCK_MONTHLY_PACKAGE } from './mockPurchases';

function isExpoGo(): boolean {
  return (
    Constants.appOwnership === 'expo' ||
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  );
}

/**
 * Selects the active purchase backend. Uses RevenueCat (Apple IAP / Play Billing)
 * when the native module is linked and a platform API key is configured; otherwise
 * falls back to the in-memory mock (Expo Go / development).
 */
export function createPurchaseService(): PurchaseService {
  if (isExpoGo()) {
    return mockPurchaseService;
  }
  return createRevenueCatPurchaseService() ?? mockPurchaseService;
}
