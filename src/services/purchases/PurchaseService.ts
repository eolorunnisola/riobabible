import type { PurchaseEntitlement, PurchaseOfferings, PurchasePackage } from './types';

/**
 * Store-agnostic purchase API. Production builds must use Apple IAP / Google Play Billing
 * (e.g. via RevenueCat) — never external checkout for digital subscriptions.
 */
export interface PurchaseService {
  getOfferings(): Promise<PurchaseOfferings>;
  purchasePackage(pkg: PurchasePackage): Promise<PurchaseEntitlement>;
  restorePurchases(): Promise<PurchaseEntitlement>;
  getEntitlement(): Promise<PurchaseEntitlement>;
}
