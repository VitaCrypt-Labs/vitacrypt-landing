// VitaCrypt waitlist submission → Telegram bot (Cloudflare Pages Function)
// Secrets required (Pages project → secrets):
//   TG_BOT_TOKEN — bot token from BotFather (e.g. @paulburgcom_request_bot)
//   TG_CHAT_ID   — chat id to receive submissions (personal chat id)

const ALLOWED_ORIGINS = [
  'https://vitacrypt.xyz',
  'https://www.vitacrypt.xyz'
];

// Best-effort in-memory rate limit. Lives only in one warm isolate and is
// not shared across colos/isolates — it raises the bar against a single
// attacker, not a distributed flood. Telegram's own 30 msg/s also caps blast.
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

function corsHeaders(request) {
  const h = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  const origin = request.headers.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Vary'] = 'Origin';
  }
  return h;
}

function json(request, status, obj, extra = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(request), ...extra }
  });
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function onRequest({ request }) {
  return json(request, 405, { error: 'Method not allowed' }, { Allow: 'POST, OPTIONS' });
}

export async function onRequestPost({ request, env }) {
  // Rate limit by client IP
  const now = Date.now();
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (rateLimited(ip, now)) {
    return json(request, 429, { error: 'Too many requests. Try again later or email marketing@vitacrypt.xyz' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(request, 400, { error: 'Invalid JSON' });
  }
  if (!body || typeof body !== 'object') body = {};
  const { name, email, audience, message, consent, company } = body;

  // Honeypot: bots fill `company`; silently accept then drop
  if (company) return json(request, 200, { ok: true });

  // Required fields
  if (!name || !email || !audience) {
    return json(request, 400, { error: 'Missing required fields' });
  }
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return json(request, 400, { error: 'Invalid name' });
  }
  if (typeof email !== 'string' || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(request, 400, { error: 'Invalid email' });
  }
  if (!['investor', 'user', 'press', 'partner'].includes(audience)) {
    return json(request, 400, { error: 'Invalid audience' });
  }
  if (message != null && (typeof message !== 'string' || message.length > 500)) {
    return json(request, 400, { error: 'Message too long' });
  }
  // GDPR consent must be explicitly true
  if (consent !== true && consent !== 'on' && consent !== 'true') {
    return json(request, 400, { error: 'Consent required' });
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

  const TOKEN = env.TG_BOT_TOKEN;
  const CHAT_ID = env.TG_CHAT_ID;
  if (!TOKEN || !CHAT_ID) {
    console.error('Telegram secrets missing (TG_BOT_TOKEN / TG_CHAT_ID)');
    return json(request, 500, { error: 'Server misconfigured' });
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
      return json(request, 502, { error: 'Telegram delivery failed' });
    }
    return json(request, 200, { ok: true });
  } catch (e) {
    console.error('Fetch failed:', e?.message || e);
    return json(request, 500, { error: 'Network error' });
  }
}
