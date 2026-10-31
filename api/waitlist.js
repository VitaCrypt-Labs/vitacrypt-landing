// VitaCrypt waitlist submission → Telegram bot
// LEGACY Vercel copy, kept for rollback. Live handler: functions/api/waitlist.js (Cloudflare Pages).
// Env vars required (set in Vercel dashboard):
//   TG_BOT_TOKEN — bot token from BotFather (e.g. @paulburgcom_request_bot)
//   TG_CHAT_ID   — chat id to receive submissions (personal chat id)

const ALLOWED_ORIGINS = [
  'https://vitacrypt.xyz',
  'https://www.vitacrypt.xyz'
];

// Best-effort in-memory rate limit. Persists only on a warm instance and is
// not shared across regions/instances — it raises the bar against a single
// attacker hitting one warm function, not a distributed flood. For hard
// guarantees use Vercel KV / Upstash. Telegram's own 30 msg/s also caps blast.
const RL_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RL_MAX = 5;                    // 5 submissions / window / IP
const hits = new Map();              // ip -> number[] timestamps

function rateLimited(ip, now) {
  const arr = (hits.get(ip) || []).filter(t => now - t < RL_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) {            // crude memory cap
    for (const [k, v] of hits) { if (!v.length || now - v[v.length - 1] > RL_WINDOW_MS) hits.delete(k); }
  }
  return arr.length > RL_MAX;
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit by client IP
  const now = Date.now();
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip, now)) {
    return res.status(429).json({ error: 'Too many requests. Try again later or email marketing@vitacrypt.xyz' });
  }

  const body = req.body || {};
  const { name, email, audience, message, consent, company } = body;

  // Honeypot: bots fill `company`; silently accept then drop
  if (company) return res.status(200).json({ ok: true });

  // Required fields
  if (!name || !email || !audience) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (typeof email !== 'string' || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!['investor', 'user', 'press', 'partner'].includes(audience)) {
    return res.status(400).json({ error: 'Invalid audience' });
  }
  if (message != null && (typeof message !== 'string' || message.length > 500)) {
    return res.status(400).json({ error: 'Message too long' });
  }
  // GDPR consent must be explicitly true
  if (consent !== true && consent !== 'on' && consent !== 'true') {
    return res.status(400).json({ error: 'Consent required' });
  }

  // Escape Markdown V1 special chars (_, *, [, ], `, \)
  const esc = (s) => String(s).replace(/[_*[\]`\\]/g, '\\$&');

  const audienceLabel = {
    investor: 'Investor',
    user: 'User / patient',
    press: 'Press / journalist',
    partner: 'Partner (lab / clinic / academic)'
  }[audience];

  const text =
    `🧬 *VitaCrypt waitlist*\n\n` +
    `*Name:* ${esc(name.trim())}\n` +
    `*Email:* ${esc(email.trim())}\n` +
    `*Audience:* ${esc(audienceLabel)}\n` +
    `*Message:* ${esc(message ? message.trim() : '—')}\n` +
    `\n_Submitted via vitacrypt.xyz_`;

  const TOKEN = process.env.TG_BOT_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;
  if (!TOKEN || !CHAT_ID) {
    console.error('Telegram env vars missing (TG_BOT_TOKEN / TG_CHAT_ID)');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });
    if (!tgRes.ok) {
      const errBody = await tgRes.text();
      console.error('Telegram API error:', tgRes.status, errBody);
      return res.status(502).json({ error: 'Telegram delivery failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Fetch failed:', e?.message || e);
    return res.status(500).json({ error: 'Network error' });
  }
}
