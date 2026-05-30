# Rioba website (Privacy & Support)

Static pages for GitHub and [Vercel](https://vercel.com) hosting — used for App Store / Play Store links and public legal support URLs.

## Pages

| URL | File |
|-----|------|
| `/` | `index.html` |
| `/privacy` | `privacy.html` |
| `/support` | `support.html` |

**Support email:** [riobabible@gmail.com](mailto:riobabible@gmail.com) (also set in `src/constants/app.ts` for the mobile app).

## Deploy to Vercel

### Option A — Deploy only this folder

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), import the repository.
3. Set **Root Directory** to `website`.
4. Leave **Build Command** empty and **Output Directory** as `.` (static files).
5. Deploy.

Your site will be live at `https://your-project.vercel.app/privacy` and `/support`.

### Option B — Vercel CLI

```bash
cd website
npx vercel
```

Follow prompts to link the project. Use `npx vercel --prod` for production.

## Custom domain

In the Vercel project → **Settings → Domains**, add e.g. `rioba.app` or `www.rioba.app`, then use:

- `https://yourdomain.com/privacy`
- `https://yourdomain.com/support`

in App Store Connect and Google Play listing fields.

## Local preview

```bash
cd website
npx serve .
```

Open `http://localhost:3000/privacy` and `/support`.
