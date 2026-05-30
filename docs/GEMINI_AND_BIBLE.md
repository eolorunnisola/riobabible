# Gemini API + Local Bible Pipeline

## Architecture

```
User message
    → Crisis keyword check (local)
    → Gemini: classify issue + pick verse references
    → Local Bible JSON (from your PDFs): fetch exact verse text
    → Gemini: explain ONLY those verses (empathy, perspective, steps, prayer)
    → Safety disclaimer when needed
    → Response screen
```

**The Bible text is the source.** Gemini classifies and explains; it must not invent verses.

## 1. Gemini API key

1. Create a key at [Google AI Studio](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

3. Set:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

4. Restart Metro with a clean cache:

```bash
npx expo start --clear
```

Without a key, the app falls back to mock guidance and shows an alert.

## 2. Build the Bible index from your PDFs

Your files in `bible_translations/` are parsed into `assets/bible/{translation}.json`.

```bash
# One translation (recommended first)
node scripts/build-bible-index.mjs --translation=NIV

# All PDFs
npm run build:bible
```

**Fully indexed:** **NIV** (~23k verses), **NLT** (~31k verses).

**Partial / not yet supported:** ESV, KJV, NKJV (different PDF layouts).

The app falls back to **NIV** when a chosen translation index is missing or incomplete.

## 3. Code map

| Path | Role |
|------|------|
| `src/services/gemini/classify.ts` | Issue category + 2–4 references |
| `src/services/bible/lookup.ts` | Load verse text from JSON |
| `src/services/gemini/compose.ts` | Structured response from verses only |
| `src/services/guidance/generateGuidance.ts` | Full pipeline |
| `src/data/bible/topicReferences.json` | Topic → default references |
| `app/(tabs)/index.tsx` | Calls pipeline on submit |
| `app/response/[id].tsx` | Displays stored guidance |

## 4. Response format

Each guidance object includes:

- **Summary of issue** — `issueSummary`
- **Empathy** — `empathy`
- **Biblical perspective** — `biblicalPerspective`
- **2–4 verses** — `verses[]` (text from local DB)
- **Explanation** — `explanation`
- **Prayer** — `prayer` (if auto-include is on in Profile → Settings)
- **Practical next step** — `nextStep`
- **Disclaimer** — when grief/mental health topics apply

## 5. Production notes

- Do **not** commit `.env` (already gitignored).
- For production, prefer a small backend so the API key is not in the client bundle.
- Re-run `npm run build:bible` after replacing PDFs.
