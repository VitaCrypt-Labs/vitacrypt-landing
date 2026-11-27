# Home page proposal mock-up. Icons, source colours and ring geometry are copied from the app's
# docs/design/mockups/build.py (the approved "blend" system), not redrawn.
import math, html
P = {
 'lab':'<path d="M9 3h6M10 3v11l-3.500 5a1.500 1.500 0 0 0 1.300 2.300h8.400a1.500 1.500 0 0 0 1.300-2.300L14 14V3"/>',
 'dna':'<path d="M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9M9 7h6M9 17h6"/>',
 'gut':'<circle cx="9" cy="10" r="5"/><circle cx="17.500" cy="7.500" r="2.500"/><circle cx="16" cy="16.500" r="3.500"/>',
 'body':'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 8.500h6M12 8.500v3"/>',
 'wear':'<rect x="6" y="7" width="12" height="10" rx="3"/><path d="M9 7l.500-4h5l.500 4M9 17l.500 4h5l.500-4"/>',
 'chk':'<circle cx="12" cy="12" r="9"/><path d="M8.500 14.500c1 1.200 2.200 1.800 3.500 1.800s2.500-.600 3.500-1.800M9 9.800v.400M15 9.800v.400"/>',
 'sur':'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9.500 9h5M9.500 13h5M9.500 17h3"/>',
 'air':'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600l1.400 1.400M17 17l1.400 1.400M5.600 18.400L7 17M17 7l1.400-1.400"/>',
}
NAME = {'lab':'Labs','dna':'DNA','gut':'Gut','body':'Body','wear':'Wearable','chk':'Check-ins','sur':'Surveys','air':'Air &amp; UV'}
ORDER = ['lab','dna','gut','body','wear','chk','sur','air']
COL = {'lab':'#3F5AF0','dna':'#7E4FE8','gut':'#19C2B0','body':'#C8A070','wear':'#6FC3FF','chk':'#EDE7D9','sur':'#E59BF0','air':'#7BD65A'}
DARKTXT = {'gut','body','wear','chk','sur','air'}
HOW = {
 'lab':'Upload a PDF or a photo of any lab report.',
 'dna':'Your 23andMe or AncestryDNA raw file.',
 'gut':'Upload a gut test report, such as Viome.',
 'body':'Smart scale, an InBody sheet, or values you type.',
 'wear':'A screenshot of your health app today. Phone sync is coming.',
 'chk':'How you feel each day, in about 30 seconds.',
 'sur':'Eight standard questionnaires on mood, stress, sleep and diet.',
 'air':'Air quality and UV for your city. Nothing to set up.',
}
BODY='M196 96Q220 88 244 96L272 110Q284 116 286 132L294 222Q295 232 287 233Q280 233 278 224L268 150L264 236L268 372Q268 384 257 384Q247 384 246 372L232 262Q220 256 208 262L194 372Q193 384 183 384Q172 384 172 372L176 236L172 150L162 224Q160 233 153 233Q145 232 146 222L154 132Q156 116 168 110Z'
def ic(k, cls='ic'): return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{P[k]}</svg>'
def ring(present, label):
    out=[f'<svg class="ring" viewBox="0 0 130 130" role="img" aria-label="{html.escape(label)}">']
    def pt(r,a): return (65+r*math.sin(math.radians(a)), 65-r*math.cos(math.radians(a)))
    for i,k in enumerate(ORDER):
        a0,a1=i*45+3.5,(i+1)*45-3.5
        def arc(r):
            x0,y0=pt(r,a0); x1,y1=pt(r,a1); return f'M{x0:.1f} {y0:.1f}A{r} {r} 0 0 1 {x1:.1f} {y1:.1f}'
        if k in present: out.append(f'<path d="{arc(52)}" fill="none" stroke="{COL[k]}" stroke-width="15"/>')
        else:
            for r in (59,45): out.append(f'<path d="{arc(r)}" fill="none" stroke="#8D8D99" stroke-width="1.5" stroke-dasharray="3 3.5"/>')
    out.append(f'<g transform="translate(13.400,15.700) scale(.235)" fill="none" stroke="#fff" stroke-width="6.400" stroke-linejoin="round"><circle cx="220" cy="62" r="22"/><path d="{BODY}"/></g></svg>')
    return ''.join(out)
ALEX=['lab','dna','gut','wear','sur','air']
def sq(k,on=True):
    if not on: return f'<span class="sq off">{ic(k)}</span>'
    fg = '#0C0C0E' if k in DARKTXT else '#fff'
    return f'<span class="sq" style="background:{COL[k]};color:{fg}">{ic(k)}</span>'
# Builds index.html (home) and the shared header/footer partials. Run from the repo root:
#   python3 docs/design/tools/build_index.py
# Icons, source colours and ring geometry come from the app's docs/design/mockups/build.py.
import re, pathlib
ROOT = pathlib.Path('.')
def ring2(present, label):
    out=[f'<svg class="ring" viewBox="0 0 130 130" role="img" aria-label="{html.escape(label)}">']
    def pt(r,a): return (65+r*math.sin(math.radians(a)), 65-r*math.cos(math.radians(a)))
    for i,k in enumerate(ORDER):
        a0,a1=i*45+3.5,(i+1)*45-3.5
        def arc(r):
            x0,y0=pt(r,a0); x1,y1=pt(r,a1); return f'M{x0:.1f} {y0:.1f}A{r} {r} 0 0 1 {x1:.1f} {y1:.1f}'
        if k in present: out.append(f'<path data-k="{k}" d="{arc(52)}" fill="none" stroke="{COL[k]}" stroke-width="15"/>')
        else: out.append(f'<g data-k="{k}">'+''.join(f'<path d="{arc(r)}" fill="none" stroke="#8D8D99" stroke-width="1.5" stroke-dasharray="3 3.5"/>' for r in (59,45))+'</g>')
    out.append(f'<g transform="translate(13.400,15.700) scale(.235)" fill="none" stroke="#fff" stroke-width="6.400" stroke-linejoin="round"><circle cx="220" cy="62" r="22"/><path d="{BODY}"/></g></svg>')
    return ''.join(out)
CLS = {'lab':'lab','dna':'dna','gut':'gut','body':'body','wear':'wear','chk':'chk','sur':'sur','air':'air'}
def chip(k):
    on = k in ALEX
    return f'<button type="button" class="chip{" on-"+CLS[k] if on else " off"}" data-k="{k}" aria-pressed="{"true" if k=="lab" else "false"}">{ic(k)}{NAME[k]}</button>'
chips=''.join(chip(k) for k in ORDER)
hows=''.join(f'<p class="how" data-k="{k}"{"" if k=="lab" else " hidden"}><b>{NAME[k]}</b> {"" if k in ALEX else "(not added on Alex&#39;s map) "}{HOW[k]}</p>' for k in ORDER)
I = lambda d: f'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">{d}</svg>'
ICON = {'up':'<path d="M12 19V5M6 11l6-6 6 6"/>','cmp':'<path d="M7 4v16M17 4v16M4 8h6M14 16h6"/>','plan':'<path d="M5 6h14M5 12h14M5 18h9"/>','chk':'<path d="M5 12l4 4 10-10"/>',
 'key':'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>','send':'<path d="M4 12h12M12 6l6 6-6 6"/>','del':'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',
 'menu':'<path d="M4 7h16M4 12h16M4 17h16"/>'}

NAV = [('/agent','Lab Agent'),('/platform.html','How it works'),('/data','Your data'),('/investor.html','Investors')]
def header(current=''):
    AC = ' aria-current="page"'
    links=''.join(f'<a href="{h}"{AC if h==current else ""}>{t}</a>' for h,t in NAV)
    dl=''.join(f'<a href="{h}">{t}</a>' for h,t in NAV+[('/beta','Apply for the beta'),('/press','Press kit')])
    return (f'<header class="top"><div class="wrap"><a class="wm" href="/"><img src="/img/vitacrypt-mark.svg" alt="" width="24" height="24"><span>Vita<i>Crypt</i></span></a>'
            f'<nav aria-label="Main">{links}</nav><a class="btn p" href="https://app.vitacrypt.xyz/demo">Try the demo</a>'
            f'<button class="menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">{I(ICON["menu"])}</button></div></header>\n'
            f'<nav id="drawer" class="drawer" aria-label="Menu" hidden>{dl}<a class="btn p" href="https://app.vitacrypt.xyz/demo">Try the demo</a></nav>')
FOOTER = ('<footer class="foot"><div class="wrap"><a class="wm" href="/"><img src="/img/vitacrypt-mark.svg" alt="" width="24" height="24"><span>Vita<i>Crypt</i></span></a>'
 '<p>Your whole health in one profile, with evidence-checked guidance.</p>'
 '<div class="row"><a href="/agent">Lab Agent</a><a href="/platform.html">How it works</a><a href="/beta">Beta</a><a href="/data">Your data</a><a href="/investor.html">Investors</a><a href="/press">Press kit</a></div>'
 '<div class="row"><a href="mailto:marketing@vitacrypt.xyz">marketing@vitacrypt.xyz</a><a href="mailto:investors@vitacrypt.xyz">investors@vitacrypt.xyz</a><a href="https://x.com/vita_crypt">X</a><a href="https://t.me/paul_burg">Telegram</a></div>'
 '<p>Not medical advice. No diagnoses, and never a dose chosen for you. Built by <a href="https://paulburg.com/">Paul Burg</a>.</p></div></footer>')
ASSETS = ('<!-- Fonts and shared styles (dark only, tokens from the app) -->\n'
 '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
 '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&display=swap">\n'
 '<link rel="stylesheet" href="/assets/site.css?v=4">\n<script src="/assets/site.js?v=4" defer></script>\n')
(ROOT/'docs/design/partials').mkdir(parents=True, exist_ok=True)
(ROOT/'docs/design/partials/assets.html').write_text(ASSETS)
for h,_ in NAV+[('/beta',''),('/press',''),('','')]:
    pass
(ROOT/'docs/design/partials/header.html').write_text(header())
(ROOT/'docs/design/partials/footer.html').write_text(FOOTER)

def head_from(fname, endmark='<!-- Fonts -->'):
    src=(ROOT/'docs/round-9'/(fname+'.20261126.bak')).read_text()
    head=src[:src.index(endmark)]
    head=head.replace('<meta name="theme-color" content="#06080C">','<meta name="theme-color" content="#0C0C0E">').replace('<meta name="color-scheme" content="dark light">','<meta name="color-scheme" content="dark">')
    return head

BODY_HTML = f'''{header()}
<main>
<section class="hero"><div class="wrap split">
 <div>
  <h1>Your whole health in one profile.</h1>
  <p class="lead">Eight kinds of health data, read together, with every link marked Cited or Hypothesis.</p>
  <div class="cta"><a class="btn p big" href="https://app.vitacrypt.xyz/demo">Try the demo<small>Fictional person · 3 min · no sign-up</small></a><a class="tb" href="/beta">Apply for the beta</a></div>
 </div>
 <div class="map" aria-label="Alex's map in the demo">
  <div class="mapbody">{ring2(ALEX,'Alex, the demo person: 6 of 8 sources connected. Body and Check-ins not added.')}
   <div class="count"><b>6 of 8</b><span>sources on Alex's map in the demo. Tap one to see what it adds.</span></div></div>
  <div class="chips" role="group" aria-label="Sources">{chips}</div>
  <div aria-live="polite">{hows}</div>
 </div>
</div></section>

<section><div class="wrap two">
 <div><h2>One link, from the demo</h2>
 <p class="lead">Alex's vitamin D is low. VitaCrypt links it to gene variants and a daylight habit, and says the combination is a hypothesis.</p>
 <p class="cap">Real screen, app.vitacrypt.xyz/demo, 26 Nov 2026. Alex is fictional.</p></div>
 <picture class="shot"><source media="(min-width:900px)" srcset="/img/app/today-desktop.jpg" width="840" height="650"><img src="/img/app/today-link-phone.jpg" width="780" height="885" loading="lazy" alt="VitaCrypt demo, Today screen: 1 link found, vitamin D 16 ng/mL below range, linked to Labs, DNA and Wearable, labelled Hypothesis"></picture>
</div></section>

<section><div class="wrap">
 <div class="persona"><span class="av">{ic('lab')}</span>Lab Agent</div>
 <h2 style="margin-top:12px">Follows up on every blood test</h2>
 <ol class="grid lab4">
  <li class="tile edge-agent"><span class="sq">{I(ICON['up'])}</span><h3 style="margin-top:12px">New lab</h3><p class="small">You upload it and tap to run.</p></li>
  <li class="tile edge-agent"><span class="sq">{I(ICON['cmp'])}</span><h3 style="margin-top:12px">Compare</h3><p class="small">With your last lab, your DNA and the research.</p></li>
  <li class="tile edge-plan"><span class="sq">{I(ICON['plan'])}</span><h3 style="margin-top:12px">Plan</h3><p class="small">Habits, a dated retest, questions for your clinician.</p></li>
  <li class="tile edge-agent"><span class="sq">{I(ICON['chk'])}</span><h3 style="margin-top:12px">Check</h3><p class="small">At your next lab: did the plan work?</p></li>
 </ol>
 <a class="tb" href="/agent">See the Lab Agent and the 3-minute video</a>
</div></section>

<section><div class="wrap two">
 <div><h2>Every link says how sure it is</h2><p class="lead">No diagnoses, never a dose.</p></div>
 <ul class="labels">
  <li><span class="ev c">Cited</span><p>Backed by papers you can open.</p></li>
  <li><span class="ev h">Hypothesis</span><p>Likely, but the evidence is thin.</p></li>
  <li><span class="ev a">Ask your clinician</span><p>A question for your doctor.</p></li>
 </ul>
</div></section>

<section><div class="wrap two">
 <div><h2>Your data</h2><p class="lead">Encrypted, and honest about who can read it.</p></div>
 <div><ul class="rows">
  <li><span class="sq">{I(ICON['key'])}</span><div><h3>A key per person</h3><p>Our server holds it today, so we can read your data to build insights.</p></div></li>
  <li><span class="sq">{I(ICON['send'])}</span><div><h3>Anthropic's Claude reads your labs</h3><p>Report text with name lines removed. The Lab Agent sends coded facts only.</p></div></li>
  <li><span class="sq">{I(ICON['del'])}</span><div><h3>Delete destroys the key</h3><p>Nothing stored can be read again.</p></div></li>
 </ul><a class="tb" href="/data">What we keep and send</a></div>
</div></section>

<section><div class="wrap two">
 <div><h2>Where it stands</h2><p class="lead">Early-stage, free beta in small groups. Each step passes before the next opens.</p></div>
 <ol class="gates">
  <li><time datetime="2026-11-30">30 Nov 2026</time><p><b>Founder test</b> on real labs.</p></li>
  <li><time datetime="2026-12-31">31 Dec 2026</time><p><b>5 friends</b> test alone; 3 of 5 finish a run.</p></li>
  <li><time datetime="2027-01-31">31 Jan 2027</time><p><b>15 to 20 testers</b>; half finish a run.</p></li>
  <li><span>Then</span><p><b>Founding cohort</b>: 100 places, USD 199 a year (planned, not charged).</p></li>
 </ol>
</div></section>

<div class="close"><div><h2>Start with Alex</h2><p class="cap">Investing? <a class="tb" href="/investor.html">The numbers and the plan</a> or <a class="tb" href="/investor.html#contact">talk to the founder</a>.</p></div>
 <div class="cta"><a class="btn p" href="https://app.vitacrypt.xyz/demo">Try the demo</a><a class="tb" href="/beta">Apply for the beta</a></div></div>
</main>
{FOOTER}
</body>
</html>
'''
head = head_from('index.html')
for a,b in [('Your whole health in one intelligent profile','Your whole health in one profile'),
            ('every signal you have, fused into actionable, AI-driven, evidence-checked guidance. Private by design.','labs, DNA, gut, body, wearable, check-ins, surveys and local air read together, with every link marked Cited or Hypothesis. A Lab Agent follows up on every blood test.'),
            ('unified into one profile with actionable, AI-driven, evidence-checked guidance. Private by design.','read together in one profile, with every link marked Cited or Hypothesis.'),
            ('actionable, AI-driven, evidence','actionable, evidence')]:
    head = head.replace(a,b)
(ROOT/'index.html').write_text(head + ASSETS + '</head>\n<body>\n' + BODY_HTML)
print('index.html', len((ROOT/'index.html').read_text()))
