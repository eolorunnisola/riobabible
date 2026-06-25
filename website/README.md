# Rioba website

| Domain | Page |
|--------|------|
| **https://www.riobabible.co** | App Store download landing page (`index.html`) |
| **https://riobabible.co/privacy** | Privacy policy (`privacy.html`) |

`www` serves only the download page. Privacy lives on the apex domain. The email signup page is kept as `signup.html` for n8n campaigns but is not routed on www.

## Deploy to Vercel

1. Import `eolorunnisola/riobabible` on [Vercel](https://vercel.com/new)
2. Set **Root Directory** to `website`
3. Framework: **Other**, no build command, output `.`
4. Add domains `riobabible.co` and `www.riobabible.co`

## Local preview

```bash
cd website
npm start
```

Open http://localhost:4321/
