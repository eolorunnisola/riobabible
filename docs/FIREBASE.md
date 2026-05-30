# Firebase setup (riobabible)

The app reads Firebase from **`.env`** via `EXPO_PUBLIC_FIREBASE_*` (see `src/services/firebase/config.ts`). When all variables are set, sign-in is required and user data syncs to Firestore at `users/{uid}/app/data`.

## 1. Console checklist

In [Firebase Console](https://console.firebase.google.com/) → project **riobabible**:

1. **Authentication** → Sign-in method → enable **Email/Password**.
2. **Firestore Database** → Create database (start in production mode).
3. **Project settings** → Your apps → add a **Web** app if you have not already → copy the **apiKey** into `.env` as `EXPO_PUBLIC_FIREBASE_API_KEY`.

Your web config should match:

| Variable | Value |
|----------|--------|
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `riobabible.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `riobabible` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `riobabible.firebasestorage.app` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `379761857091` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `1:379761857091:web:7d5ce878285445ff88faf6` |

`measurementId` (Analytics) is optional and not used by the app today.

## 2. Local `.env`

```bash
cp .env.example .env
# Paste EXPO_PUBLIC_FIREBASE_API_KEY from the Console, then:
```

Restart Expo after changing `.env` (`npx expo start -c` clears the cache).

## 3. Deploy security rules

From the project root (uses the project-local CLI via `firebase-tools`; no global install needed):

```bash
npm install
npx firebase login      # once per machine
npm run firebase:deploy
```

This deploys **Firestore rules** only (`firestore.rules`) — that is what the app needs for cloud sync.

**Storage rules** (`storage.rules`) are optional (profile photos, future use). The app does not call Firebase Storage today. If deploy fails with “Storage has not been set up”, you can ignore Storage until you need it:

1. [Enable Storage](https://console.firebase.google.com/project/riobabible/storage) in the Console → Get started.
2. Then run: `npm run firebase:deploy:storage`

## 4. What syncs to the cloud

Signed-in users sync one document per account:

- Preferences, profile, chat sessions, guidance responses
- Saved reflections, journal entries
- Weekly faith reflections, devotional plan progress

Path: `users/{firebaseAuthUid}/app/data`

## 5. Moving data from another Firebase project

Firestore data does **not** move automatically when you change `.env`. Options:

- **Export/import** in the old and new projects (Firebase Console or `gcloud firestore export/import`).
- **Start fresh** on riobabible: users sign up again; local AsyncStorage still holds data until they sign in on a new account.

## 6. Verify

1. Set `EXPO_PUBLIC_FIREBASE_API_KEY` and restart the app.
2. Register or sign in with email/password.
3. Use the app (chat, journal, etc.) → check Firestore for `users/{uid}/app/data`.
4. Sign out and sign in on another device/simulator with the same account → data should appear after load.
