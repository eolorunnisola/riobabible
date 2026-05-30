# Rioba

A premium React Native / Expo app for **faith-based life guidance, prayer, and reflection** — Scripture-centered encouragement, not professional counseling.

Built with **Expo SDK 54** (React Native 0.81).

## Run locally

```bash
npm install
cp .env.example .env   # Gemini + Firebase (riobabible) — see docs/FIREBASE.md
npm run build:bible    # index PDFs → assets/bible/*.json (NIV + NLT fully supported)
npm start
```

**Firebase (auth + cloud sync):** [docs/FIREBASE.md](docs/FIREBASE.md) — project `riobabible`, deploy rules with `npm run firebase:deploy`.

**Public web pages (Privacy & Support):** [website/](website/) — deploy the `website/` folder to Vercel for store listing URLs.

Press `i` for iOS Simulator or `a` for Android emulator.

## App structure

- **`src/theme`** — Colors (light/dark), typography, spacing, shadows
- **`src/components`** — Design system + feature UI
- **`app/onboarding`** — Welcome + translation, tone, prayer preferences
- **`app/(tabs)`** — Guidance chat, reflections, daily encouragement, journal, profile
- **`app/devotional`** — Premium multi-day devotional plans
- **`app/response/[id]`** — Structured guidance response
- **`app/crisis`** — Crisis intervention resources

## Notes

- Guidance uses Google Gemini with local Bible verse lookup.
- Crisis keyword detection routes to `/crisis`; expand keywords and localization as needed.
