/** Proxies signup to n8n — avoids browser CORS issues. Override with N8N_SIGNUP_WEBHOOK in Vercel env. */
const DEFAULT_WEBHOOK = 'https://emmanuelo.app.n8n.cloud/webhook/rioba-signup';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const webhookUrl = process.env.N8N_SIGNUP_WEBHOOK || DEFAULT_WEBHOOK;

  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (!email) {
    return res.status(400).json({ ok: false, error: 'email required' });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email,
        source: req.body?.source || 'rioba-signup',
      }),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(text || '{}');
  } catch {
    return res.status(502).json({ ok: false, error: 'Signup service unavailable' });
  }
};
