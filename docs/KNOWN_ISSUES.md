# Known Issues / Open Follow-ups

_Last updated: 2026-06-15 (OG image URL bumped to `og-preview-v2.jpg` to bust Telegram's stale-image cache; deployed — only the manual re-scrape remains)._

## Open — needs a human / external action
- **OG social-card cache — image URL bumped + deployed 2026-06-15 (only the manual re-scrape remains).** Telegram
  kept showing the old "Powered by FHE" card even after @WebpageBot: a re-scrape refreshes
  title/description but **not** a changed image at an *unchanged* URL — platforms cache the image
  binary keyed on its URL, and `og:image` had always been `img/og-preview.jpg` (only its contents
  changed on 2026-06-07). Proven not a CDN issue: live Cloudflare `ETag` == local `md5`. Fix: the
  already-correct card was copied to a new URL `img/og-preview-v2.jpg` and all 19 live refs
  repointed. **Deployed `dpl_3KPzvqBYLLfBYnWKq3ELqSyi65bH` — verified live (new URL 200, md5 ==
  local, all 4 pages serve `-v2`).** Now re-scrape each platform that has a cached preview
  (Telegram @WebpageBot, X Card Validator, LinkedIn Post Inspector, FB Sharing Debugger) — the new
  URL has no prior cache, so the new card loads. Convention: bump `-vN` on every future card change.
- **Litepaper §04 status badges vs investor traction table.** §04 marks Wearables / Labs /
  Microbiome as "MVP" while the investor page says Partial / Wired. The v2 litepaper brief did not
  cover §04, so it was left as-is — align in the next litepaper iteration.
- **Litepaper §07 lacks the clinical-advisor line.** The 2026-06-11 clinical-framing rule added
  "a clinical advisor joins ahead of the IRB validation study (2027)" to index + investor; no new
  litepaper brief was issued and the sitewide brief excludes /litepaper, so §07 was left as-is —
  add the advisor line in the next litepaper iteration (and bump the version when touched).
- **`vitacrypt-placeholder` is a separate Vercel project.** `placeholder/index.html` had its
  Telegram fixed in-repo (`t.me/paul_burg`), but the project was **not** redeployed (unknown live
  domain). It also posts the form to `formsubmit.co/waitlist@vitacrypt.xyz` (a contact outside the
  verified set). If the placeholder is still in use, deploy it separately and decide on that email.
- **Git not pushed to remote/main.** All rounds are committed on branch `investor-page`
  (`3c63411`, `a7a09b6`, `e2d4e26`, `61a2dbc` v2-brief pass, + docs commits) but not pushed.
  Production is live via `vercel --prod` (CLI deploy, latest: `vitacrypt-landing-82y28u8nl`,
  2026-06-10), so deploy state is decoupled from the git remote until someone pushes/merges.

## Accepted / out of scope (intentional)
- **litepaper.html body em-dashes (~50).** Not converted — it's a dense technical DD document;
  only its `<title>`/meta and contacts were touched. Convert later if site-wide punctuation
  uniformity is wanted.
- **Internal prompt docs** (`ENHANCED_LANDING_PROMPT.md`, `LANDING_PAGE_PROMPT.md`,
  `docs/research/`) still use FHE-first language. Historical specs, not user-facing — left as-is.
- **"blind computing (Nillion)"** references in litepaper/platform are a legitimate roadmap
  mention (defense-in-depth), not an overclaim — kept on purpose.

## Pre-existing / structural (carried over)
- **Self-contained pages duplicate nav/footer/waitlist form** across index/investor/platform
  (litepaper has a minimal footer). They drift; a change to a shared block must be applied to all.
  Candidate fix: extract `assets/shared.css` + `assets/app.js` when a change next touches all pages.
- **Waitlist rate-limiting is best-effort** (in-memory per Vercel instance). Proper fix = Vercel KV.
- **Waitlist env vars are Production-scoped only** — Preview/Dev deploys error on the form until
  `TG_BOT_TOKEN` / `TG_CHAT_ID` are added to those scopes.
