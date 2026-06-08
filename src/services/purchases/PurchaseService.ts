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
  /**
   * Associate the store SDK with the signed-in app user so entitlements are
   * scoped per account (not per device). Call on sign-in.
   */
  logIn(userId: string): Promise<void>;
  /** Detach the previous user on sign-out so their entitlement doesn't leak. */
  logOut(): Promise<void>;
}
