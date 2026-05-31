# Deployment — App Store & Google Play

Rioba ships as a native build (EAS), not Expo Go, because in-app purchases need the
native RevenueCat module. Payments go through Apple IAP / Google Play Billing via
RevenueCat — never external checkout (Apple/Google reject external payment for
digital subscriptions).

Bundle identifier / package: `com.rioba.app` (set in `app.json`, permanent once published).

---

## 1. Accounts (one-time, paid)

- [ ] **Apple Developer Program** — $99/yr — https://developer.apple.com/programs/
- [ ] **Google Play Developer** — $25 one-time — https://play.google.com/console/signup
- [ ] **RevenueCat** account (free) — https://app.revenuecat.com
- [ ] **Expo / EAS** account (free) — `npx eas login`

## 2. EAS project setup

```bash
npm i -g eas-cli            # or: npx eas-cli@latest
eas login
eas init                    # writes extra.eas.projectId into app.json
```

Add your store secrets as EAS env (don't commit them):

```bash
eas env:create --name EXPO_PUBLIC_REVENUECAT_IOS_API_KEY --value appl_xxx
eas env:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY --value goog_xxx
# (also add the EXPO_PUBLIC_FIREBASE_* and EXPO_PUBLIC_GEMINI_API_KEY values)
```

Locally, copy `.env.example` → `.env` and fill the same keys for dev builds.

## 3. Create the subscription product (both stores)

Product id used by the app: **`rioba_premium_monthly`** with a **7-day free trial**
(see `src/constants/subscription.ts`). Use the same id in both stores for sanity.

**App Store Connect** → your app → Subscriptions:
- [ ] Create a Subscription Group, then an auto-renewable subscription `rioba_premium_monthly`, $4.99/month.
- [ ] Add an **Introductory Offer**: 7-day free trial.
- [ ] Fill localization, review screenshot, and the "Cleared for Sale" / paid agreements (App Store Connect → Agreements, Tax, and Banking — **payments won't work until the Paid Apps agreement is active**).

**Google Play Console** → your app → Monetize → Subscriptions:
- [ ] Create subscription `rioba_premium_monthly` with a monthly base plan, $4.99.
- [ ] Add a **free trial** offer (7 days) on the base plan.
- [ ] Set up a merchant/payments profile.

## 4. RevenueCat configuration

- [ ] Create a Project; add an **iOS app** (bundle `com.rioba.app`) and an **Android app** (package `com.rioba.app`).
- [ ] iOS: upload the App Store Connect **In-App Purchase key** (.p8) + issuer/key id, and the **App Store Server Notifications** URL RevenueCat gives you (paste into App Store Connect).
- [ ] Android: connect the **Google Play service account** credentials and configure **Real-time Developer Notifications** (Pub/Sub topic RevenueCat provides).
- [ ] Create an **Entitlement** with identifier exactly **`premium`** (the app reads this — see `revenueCatPurchases.ts`).
- [ ] Create **Products** for each store's `rioba_premium_monthly` and attach them to the `premium` entitlement.
- [ ] Create an **Offering** (e.g. "default") with a **monthly Package** containing those products.
- [ ] Copy the **public SDK keys** (Project → API keys → App specific): `appl_…` (iOS) and `goog_…` (Android) into the env vars above.

> The app reads entitlement id `premium` and the current offering's first package.
> Keep those names aligned or update `ENTITLEMENT_ID` in `src/services/purchases/revenueCatPurchases.ts`.

## 5. Build & test

```bash
# Dev client so you can test purchases on a real device (Expo Go won't work):
eas build --profile development --platform ios     # or android
# Install on device, then run the JS:
npx expo start --dev-client
```

- [ ] iOS: create a **Sandbox tester** (App Store Connect → Users and Access → Sandbox) and sign in on-device to test the trial + purchase + restore.
- [ ] Android: add yourself to a **Closed/Internal testing** track and a license-tester list to test billing.
- [ ] Verify on the Paywall: price shows, "Start free trial" grants `premium`, "Restore Purchases" works, and cancelling the native sheet doesn't error.

## 6. Production builds & submission

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
eas submit --profile production --platform ios       # uploads to App Store Connect / TestFlight
eas submit --profile production --platform android    # uploads to Play Console
```

Before submitting, complete in each console:
- [ ] App name, description, keywords, category, screenshots (6.7" + 5.5" iPhone, etc.), app icon.
- [ ] **Privacy policy URL** and **support URL** — already hosted under `website/` (privacy.html, support.html); deploy them and link the live URLs.
- [ ] App Privacy questionnaire (iOS) / Data safety form (Android) — declare Firebase auth/data + Gemini usage.
- [ ] iOS: App Review notes with sandbox login + how to reach the paywall.
- [ ] Bump `ios.buildNumber` / `android.versionCode` for each new upload (production profile `autoIncrement` handles this on EAS).

## 7. Going live

- [ ] iOS: submit for review (first review ~24–48h). Subscriptions are reviewed with the build.
- [ ] Android: roll out from internal → closed → production track.
- [ ] After approval, do one real-money sandbox/production purchase and confirm RevenueCat shows the transaction and the `premium` entitlement activates.

---

### Notes
- No backend required: RevenueCat hosts receipt validation + store webhooks and the
  app queries entitlement state directly via the SDK.
- If a RevenueCat key is missing or the native module isn't linked (Expo Go), the app
  silently falls back to `mockPurchaseService` — useful for development, never for release.
- To swap to raw native IAP later, implement `PurchaseService` in a new file and return
  it from `src/services/purchases/index.ts`; the rest of the app is unaffected.
