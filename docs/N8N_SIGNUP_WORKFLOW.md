# n8n workflow — Rioba signup → App Store email

When someone submits their email on **`/signup`**, this workflow receives the address and sends them a welcome email with your App Store / Play Store links.

---

## Architecture

```
signup page  --POST JSON-->  n8n Webhook  -->  Gmail (OAuth)  -->  Respond 200
                              { email, source }
```

---

## 1. Prerequisites

- [n8n](https://n8n.io) running (Cloud, self-hosted, or Docker)
- An email sender configured in n8n:
  - **Gmail** node with **OAuth2** (recommended — uses `riobabible@gmail.com` after you connect)
- Your live store URLs (replace placeholders below):
  - **iOS:** `https://apps.apple.com/app/id6775082834`
  - **Android:** `https://play.google.com/store/apps/details?id=com.rioba.app`

Find the iOS link in App Store Connect → your app → **View on App Store** (after approval).

---

## 2. Import the workflow

1. Open n8n → **Workflows** → **Import from file**
2. Choose `n8n/rioba-signup-email.workflow.json` from this repo
3. Open the workflow and update these nodes:

| Node | What to change |
|------|----------------|
| **Send Rioba welcome email** | Connect **Gmail OAuth2** credentials; the App Store link is `https://apps.apple.com/app/id6775082834` |
| **Webhook** | Note the production URL after activating (step 3) |

4. On the **Send Rioba welcome email** node:
   - Click **Credential to connect with** → **Create new** → **Gmail OAuth2 API**
   - Sign in with `riobabible@gmail.com` (or your sending account)
   - In Google Cloud Console, ensure the OAuth client has the **Gmail API** enabled and scope `https://www.googleapis.com/auth/gmail.send`

---

## 3. Activate and copy the webhook URL

1. Toggle the workflow **Active** (top right)
2. Open the **Webhook** node → copy **Production URL**  
   Example: `https://your-name.app.n8n.cloud/webhook/rioba-signup`
3. Paste that URL into your signup page (step 4)

**Test URL** (only works in test mode): use the **Test URL** while developing, then switch to **Production URL** when live.

---

## 4. Connect the signup page

In `website/signup.js`, set:

```javascript
const SIGNUP_ENDPOINT = 'https://YOUR-N8N-DOMAIN/webhook/rioba-signup';
```

Redeploy the `website` folder to Vercel.

---

## 5. CORS (required for browser form)

Your signup page is on **https://www.riobabible.co**; n8n is on another domain. The browser will block the request unless n8n allows your site origin.

**Option A — n8n Webhook options (recommended)**  
On the **Webhook** node → **Options** → **Response Headers**, add:

| Name | Value |
|------|--------|
| `Access-Control-Allow-Origin` | `https://www.riobabible.co` |
| `Access-Control-Allow-Methods` | `POST, OPTIONS` |
| `Access-Control-Allow-Headers` | `Content-Type` |

**Option B — n8n environment variable** (self-hosted)  
Set `N8N_DEFAULT_CORS=TRUE` or configure CORS in your n8n config.

**Option C — Vercel serverless proxy**  
Proxy POST `/api/signup` on your domain → n8n webhook (avoids CORS). Not included by default; ask if you want this added.

---

## 6. Test end-to-end

1. In n8n, click **Test workflow** on the Webhook node (or use **Listen for test event**)
2. From terminal:

```bash
curl -X POST 'https://YOUR-N8N/webhook-test/rioba-signup' \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","source":"rioba-signup"}'
```

3. Check your inbox for the welcome email
4. Submit the form on https://www.riobabible.co

---

## 7. Optional enhancements

| Goal | n8n approach |
|------|----------------|
| Block duplicate signups | Add **Google Sheets** or **Airtable** node before email; IF row exists → skip send |
| Log all signups | Append row to Google Sheets after send |
| SMS instead of email | Replace **Send Email** with **Twilio** node (needs phone field on form) |
| Delay email 1 minute | Add **Wait** node before send |
| Slack alert on signup | Add **Slack** node in parallel |

---

## 8. Email copy (editable in workflow)

**Subject:** `Your Rioba download link`

**Body highlights:**
- Thank them for signing up
- Primary button → App Store
- Secondary link → Google Play
- Support: riobabible@gmail.com
- Note: spiritual encouragement only, not professional counseling

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Form shows “Something went wrong” | Check browser DevTools → Network; verify webhook URL, CORS, workflow is **Active** |
| 404 on webhook | Use **Production URL**, not Test URL, when workflow is active |
| Email not received | Check spam; verify Gmail OAuth is connected; check n8n **Executions** for errors |
| CORS error in console | Add `Access-Control-Allow-Origin` header on Webhook node |

---

## If Gmail OAuth fails on import

After importing, open **Send Rioba welcome email** and select your **Gmail OAuth2** credential. n8n cannot ship OAuth tokens in the JSON file — you must connect once in the UI.

---

## Optional: remove “Sent with n8n” footer

The workflow sets **Append n8n attribution** to **off** in the Gmail node options. If you still see it, open the node → **Options** → disable **Append n8n attribution**.

---

## Security notes

- Do not commit your production webhook URL to public repos if the workflow has no auth (anyone could trigger emails). For production, consider:
  - A secret header checked in an **IF** node, or
  - A Vercel `/api/signup` proxy that adds the secret server-side
