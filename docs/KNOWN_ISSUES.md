# Known Issues / Open Follow-ups

_Last updated: 2026-06-16 pm (mobile drawer redesigned + bottom pip-bar removed across 3 pages; litepaper reframed evidence-first with FHE far-horizon)._

## Open — needs a human / external action
- **litepaper.html residual em-dashes (~25, technical/bibliographic).** The 2026-06-16 reframe pass
  promoted the three-tier evidence engine + clinical boundary + CPIC to the §06 lead, demoted FHE to a
  far-horizon roadmap (§01 relabelled "Privacy roadmap & threat model"), and converted the em-dashes I
  had introduced + the §01 threat-model list. Remaining em-dashes sit in dense technical lists, the
  §07/§08 stage/question headings, and the §09 reference bibliography (citation-style separators),
  historically accepted on this DD doc. Convert if a strict no-em-dash sweep is wanted; lower priority.
- **Evidence-engine "Live" claims rest on the Investor Memo, not repo-verifiable.** investor/index/
  platform now state the three-tier router / clinical boundary / CPIC as "Live / unit-tested /
  software-enforced" per Paul's confirmation. The actual implementation is in the separate app repo;
  if any of these is not yet truly live, the public claim must be softened.
- **Backend: remove PHQ-9 / GAD-7 from the questionnaire engine (separate app repo).** The
  2026-06-15 pivot brief (Part 3) de-clinicalizes screeners. The *site* copy was updated this pass
  (SOURCE 06, platform lifestyle row, investor traction table, litepaper survey tables — all PHQ-9/
  GAD-7 site mentions removed), but the actual scoring engine lives in the app repo, not
  `vitacrypt-landing`. Remove PHQ-9/GAD-7 (and any scoring against diagnostic thresholds) there and
  swap in the non-clinical lifestyle/wellbeing questionnaire described in the brief.
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
- **Waitlist rate-limiting is best-effort** (in-memory per Cloudflare isolate). Proper fix = Workers KV
  or a Cloudflare rate-limiting rule.
- **Cloudflare Pages quirks we work around (2026-10-31):** Pages 308s `/x.html` → `/x`, so
  `functions/*.html.js` serve the `.html` URLs 200; `_redirects` also applies to `env.ASSETS.fetch`
  inside a Function (a `/platform → /platform.html` rule there loops), so bare-path 301s live in
  Functions. `/beta.html`, `/agent.html`, `/press.html`, `/data.html` now 308 to their canonical
  (Vercel served them 200). `/platform.html/` (trailing slash) answers 200.
- **Vercel leftovers kept for rollback until mid-Dec 2026:** `api/`, `vercel.json`, `.vercelignore`,
  the Vercel project and its domains. Rollback = point the apex + www DNS records back to
  `vitacrypt-landing-ccv7vf74n-paulburgeths-projects.vercel.app` (once the Vercel team is unpaused).
