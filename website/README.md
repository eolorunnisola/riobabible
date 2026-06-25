# Rioba website

| Domain | Page |
|--------|------|
| **https://www.riobabible.co** | Signup landing page (`index.html`) |
| **https://www.riobabible.co/privacy** | Privacy policy (`privacy.html`) |

`riobabible.co` redirects to `www` for both `/` and `/privacy`.

## Deploy to Vercel

1. Import `eolorunnisola/riobabible` on [Vercel](https://vercel.com/new)
2. Set **Root Directory** to `website`
3. Framework: **Other**, no build command, output `.`
4. Add both domains; set **www.riobabible.co** as the production domain for the signup page
5. DNS: **A** `@` → `76.76.21.21`, **CNAME** `www` → `cname.vercel-dns.com`
6. If using Cloudflare, set records to **DNS only** (grey cloud)

Signup form POSTs to n8n — see `docs/N8N_SIGNUP_WORKFLOW.md`. CORS must allow `https://www.riobabible.co`.

## Local preview

```bash
cd website
npm start
```

Open http://localhost:4321/
