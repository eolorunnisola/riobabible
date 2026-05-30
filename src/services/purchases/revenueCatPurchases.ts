/**
 * TODO: RevenueCat / native store integration
 *
 * 1. Install: `npx expo install react-native-purchases`
 * 2. Add the config plugin in app.json and configure API keys per platform.
 * 3. Create products in App Store Connect & Google Play Console:
 *    - bibleadvice_premium_monthly with a 7-day introductory offer
 * 4. Map the `premium` entitlement in RevenueCat to the offering package.
 * 5. Build a development client (`npx expo run:ios` / `run:android`) — Expo Go cannot
 *    load the native Purchases module.
 *
 * Replace the body of `createRevenueCatPurchaseService()` below and return it from
 * `src/services/purchases/index.ts` when the native module is available.
 */
import type { PurchaseService } from './PurchaseService';
import { mockPurchaseService } from './mockPurchases';

export function createRevenueCatPurchaseService(): PurchaseService {
  // Stub: fall back to mock until RevenueCat is wired.
  return mockPurchaseService;
}
