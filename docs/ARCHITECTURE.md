# VitaCrypt — Architecture (plain-English)

_Written for the owner. No deep coding knowledge assumed._

## 1. What this is
A marketing/investor website for **VitaCrypt** — which unifies a person's whole
health (genetics, wearables, labs, microbiome, environment, lifestyle) into one
profile that returns actionable, evidence-checked guidance, **private by design**.
Positioning leads with the **unified profile + evidence-checked guidance**;
privacy/FHE is the *trust layer*, not the headline (see the honesty rule in §5).
The site is **static HTML** (no framework, no database) hosted on **Vercel**, with
one small serverless function for the waitlist form. Stage: working product,
pre-launch; first design-partner cohort targeted Q4 2026.

## 2. The pages (file map)
Everything lives at the repo root. Each page is **self-contained** (its own CSS
and JavaScript inline) — there is no shared stylesheet file yet.

| File | What it is |
|---|---|
| `index.html` | The landing page — the hook. Hero, a **4-pillar overview** block, the data-fabric/research/pipeline/case sections, roadmap, "why now", CTA. |
| `platform.html` | The deep-dive page — explains the **4 pillars** in depth (how each works, evidence, honest MVP-vs-roadmap scope). Links back to the landing for the live demo + case; links into the litepaper for specs. |
| `investor.html` | The **investor page** — public teaser that gates the deck. Opportunity, why-now (market + tailwinds), the moat, honest pre-launch traction, founder + hiring plan, a soft "the raise" (no amount/valuation/terms), CTA to request the deck. Cloned from `platform.html`'s shell (same CSS/nav/footer/modal), body swapped. |
| `litepaper.html` | The technical brief — cryptography, threat model, integration spec, validation plan. Dark-only by design. |
| `api/waitlist.js` | Serverless function: receives the waitlist form and forwards it to Telegram. |
| `sitemap.xml`, `robots.txt`, `llms.txt`, `vercel.json` | SEO + hosting config. |
| `img/` | Logos + the social-share image (`og-preview-v2.jpg`, 1200×630; old `og-preview.jpg` kept). |
| `docs/` | Internal notes (research findings, decisions, backups). **Excluded from deploy** via `.vercelignore` — not public. |

Navigation funnel: **landing (what it is) → platform (how it works) → litepaper (proof)**.
Side funnel for capital: **landing → investor.html (the case for backing it) → request the deck**.
"Investors" sits in every nav + mobile drawer; the landing also has a dedicated `#investors`
block. Self-contained pages still mean the nav/footer/drawer/form are duplicated across all
four — change all four to stay consistent.

## 3. How the waitlist form works (the one moving part)
1. Visitor clicks "Join waitlist" → a modal form opens (name, email, audience,
   message, consent checkbox + a hidden anti-bot "honeypot" field).
2. The browser sends it to `POST /api/waitlist`.
3. `api/waitlist.js` validates everything, then calls the **Telegram Bot API** to
   message the founder's chat (`@paul_burg`).
4. Secrets live in **Vercel environment variables**, never in the code:
   - `TG_BOT_TOKEN` — the bot token (BotFather, `@paulburgcom_request_bot`)
   - `TG_CHAT_ID` — where messages land (`1250810291`)
   - ⚠️ Currently set for **Production only**. Preview/Dev deployments will error
     on the form until those scopes are added.

If the function ever fails, the form shows a fallback: "email marketing@vitacrypt.xyz".

## 4. External dependencies (and why)
- **Vercel** — hosting + the serverless function. Deploy with `vercel --prod`.
- **Telegram Bot API** — receives waitlist submissions (no database needed).
- **Google Fonts** — Geist, Geist Mono, Instrument Serif (loaded non-blocking).
- **Google Analytics 4** (`G-NGT34ZL8HV`) — traffic stats, IP anonymized.
- **GitHub** (`VitaCrypt-Labs/vitacrypt-landing`) — source. Push to `main` is
  production-intent; Vercel is deployed manually (no auto-sync).

## 5. Non-obvious decisions (so future-you doesn't undo them)
- **Theme** = dark by default; on a visitor's first load it matches their
  device's light/dark setting (`prefers-color-scheme`); the toggle overrides and
  remembers the choice. Litepaper stays dark.
- **Status labels stay honest** — "Live" only for capabilities genuinely live in the
  working product (genetics, environment, surveys/lifestyle, recommendations,
  health-score trend); "Wired" / "Partial" / "Demonstrated" elsewhere; never "Live"
  for FHE-wide claims or unconnected integrations. Stage wording everywhere:
  "working product, pre-launch" (litepaper: "Working MVP, pre-launch") — never
  "pre-MVP" standalone, never "launched" or "beta live". The only public date is
  "first design-partner cohort, Q4 2026" (roadmap 2027 milestones stay).
- **Self-contained pages** (CSS/JS duplicated per page) — chosen for simplicity
  and to match the existing litepaper. The cost is 3-way upkeep for shared bits
  (nav, footer, form). Extract to `assets/shared.css` + `assets/app.js` when a
  change next touches all pages.
- **`docs/` is deploy-excluded** — it holds internal positioning notes
  (`RESEARCH_FINDINGS.md`) that must not be public.
- **Positioning + honesty (Jun 2026 — do not regress).** Every page leads with the
  *unified health profile + evidence-checked guidance*; privacy/FHE is the trust
  layer, written in **design/target tense** ("by design", "built to", "target"),
  never as a present-tense whole-system claim. The hard line: the platform is **not
  end-to-end blind today** (master key is server-side; LLM/OCR run on plaintext);
  blind compute is *proven on one genetic slice on staging (~0.5s, client holds the
  key)*; the FHE model is a *synthetic demo, not a validated PRS*; Zama bounty #95
  (96%) is *external evidence only*. Banned as present fact: "blind server", "0 bytes
  ever decrypted", "we can't read it", "read by no one", "server never sees your
  plaintext", "FHE end-to-end", "computed never seen". No em-dashes in visible copy.
- **Verified contacts — only these.** `investors@vitacrypt.xyz` + `t.me/paul_burg`
  (plus `marketing@vitacrypt.xyz` as the waitlist-form fallback, and the X / `@vita_crypt`
  social link). `hello@`, `press@`, and `t.me/vita_crypt` were retired site-wide — do
  not reintroduce. Schema `contactPoint` = investors@ only.

## 6. Fragile areas (touch with care)
- **Waitlist rate-limiting is best-effort** (in-memory, per Vercel instance). It
  blunts a naive loop but won't stop a distributed flood; worst case = spammed
  Telegram (rotate the bot token to recover). Proper fix = Vercel KV.
- **Cross-page anchor links** — the landing's "Explore →" cards and the platform's
  cross-links point at specific section IDs (`index.html#fabric`,
  `litepaper.html#threat`, etc.). If you rename a section's `id`, update the
  links that point to it.
- **The big inline `<style>`/`<script>` blocks** — editing one page's nav/footer/
  form does **not** update the others; change all three to stay consistent.
- **Roadmap dates + "MVP" honesty** — keep claims defensible (no "compliant",
  no "live", scope benchmarks honestly).

## 7. Day-to-day
- Edit an `.html` file → `git add` + `git commit` + `git push origin main` →
  `vercel --prod` to deploy → check `https://www.vitacrypt.xyz`.
- Backups of `index.html`/`litepaper.html` before earlier changes are in
  `docs/round-5/*.bak`; the Jun-2026 repositioning backups (all four pages +
  the old OG image) are in `docs/round-7/*.bak`.

### Regenerating the social card (current: `img/og-preview-v2.jpg`)
It is a **pre-rendered 1200×630 binary** — editing `img/og-preview-template.html`
alone changes nothing until the JPG is re-rendered. **Always render to a NEW
versioned filename** (`-v2` → `-v3` …): Telegram and other platforms cache the image
binary *keyed on its URL* and will NOT re-download a changed image at the same URL even
after a re-scrape — only a fresh URL forces a new fetch (learned 2026-06-15). To regenerate:
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --window-size=1200,630 --force-device-scale-factor=1 --virtual-time-budget=8000 \
  --screenshot=/tmp/og.png "file://$(pwd)/img/og-preview-template.html"
sips -s format jpeg -s formatOptions 82 /tmp/og.png --out img/og-preview-v3.jpg
```
Then repoint all refs (`og:image`, `og:image:secure_url`, `twitter:image`, the JSON-LD
image field in index/investor/platform/litepaper.html + `<image:loc>` in sitemap.xml) to
the new filename, `vercel --prod`, and re-scrape OG caches (X Card Validator / LinkedIn
Post Inspector / Telegram @WebpageBot / Facebook Sharing Debugger).
