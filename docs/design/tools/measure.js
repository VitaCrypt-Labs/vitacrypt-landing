(() => {
  const w = window, d = document, VW = w.innerWidth, VH = w.innerHeight;
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05; };
  const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r,g,b] = m.slice(0,3).map(v => { v = v/255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }); return 0.2126*r + 0.7152*g + 0.0722*b; };
  const alpha = (c) => { const m = c.match(/[\d.]+/g); return m && m.length > 3 ? parseFloat(m[3]) : 1; };
  const bgOf = (e) => { let el = e; while (el) { const s = getComputedStyle(el); if (s.backgroundImage && s.backgroundImage !== 'none' && !s.backgroundImage.startsWith('url')) return {grad: true, c: s.backgroundColor}; if (alpha(s.backgroundColor) > 0.5) return {c: s.backgroundColor}; el = el.parentElement; } return {c: getComputedStyle(d.body).backgroundColor}; };
  const textEls = [...d.querySelectorAll('body *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1) && vis(e) && !e.closest('svg'));
  const sizes = {}, fams = {}; let small14 = 0, small12 = 0, words = 0; const lowContrast = [];
  const smallSamples = [];
  textEls.forEach(e => {
    const s = getComputedStyle(e); const fs = parseFloat(s.fontSize); const t = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').trim();
    const wc = t.split(/\s+/).filter(Boolean).length; words += wc;
    sizes[fs] = (sizes[fs] || 0) + wc; const fam = s.fontFamily.split(',')[0].replace(/["']/g,'').trim(); fams[fam] = (fams[fam] || 0) + wc;
    if (fs < 14) { small14 += wc; if (smallSamples.length < 12) smallSamples.push(`${fs}px "${t.slice(0,40)}"`); }
    if (fs < 12) small12 += wc;
    const bg = bgOf(e); const L1 = lum(s.color), L2 = lum(bg.c);
    if (L1 != null && L2 != null && alpha(s.color) > 0.3 && !bg.grad) { const cr = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05); const large = fs >= 24 || (fs >= 18.66 && parseInt(s.fontWeight) >= 700); if (cr < (large ? 3 : 4.5)) lowContrast.push(`${cr.toFixed(2)} ${fs}px "${t.slice(0,35)}"`); }
  });
  const inter = [...d.querySelectorAll('a[href],button,input,select,textarea,[role=button],summary')].filter(vis);
  const smallT = inter.filter(e => { const r = e.getBoundingClientRect(); return r.height < (VW < 700 ? 44 : 24) || r.width < (VW < 700 ? 44 : 24); });
  const overflow = [...d.querySelectorAll('body *')].filter(e => { if (!vis(e)) return false; const r = e.getBoundingClientRect(); return r.right > VW + 1 && getComputedStyle(e).position !== 'fixed'; }).filter(e => { let p = e.parentElement; while (p && p !== d.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') return false; p = p.parentElement; } return true; });
  const fixed = [...d.querySelectorAll('body *')].filter(e => ['fixed','sticky'].includes(getComputedStyle(e).position) && vis(e)).map(e => { const r = e.getBoundingClientRect(); return `${e.tagName.toLowerCase()}.${(e.className||'').toString().split(' ')[0]} ${Math.round(r.width)}x${Math.round(r.height)} (${Math.round(r.height/VH*100)}% vh)`; });
  const firstCTA = inter.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.top < VH && r.bottom > 0 && (e.tagName === 'BUTTON' || alpha(s.backgroundColor) > 0.5 || /btn|cta|pill/i.test(e.className)); }).map(e => (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 30));
  const h1 = [...d.querySelectorAll('h1')].map(h => h.innerText.trim().slice(0,80));
  const meta = { title: d.title, desc: d.querySelector('meta[name=description]')?.content, canonical: d.querySelector('link[rel=canonical]')?.href, ogImage: d.querySelector('meta[property="og:image"]')?.content, jsonld: d.querySelectorAll('script[type="application/ld+json"]').length, imgsNoAlt: [...d.images].filter(i => !i.hasAttribute('alt')).length, imgsNoDims: [...d.images].filter(i => !i.getAttribute('width')).length };
  return JSON.stringify({ path: location.pathname, vw: VW, theme: d.documentElement.dataset.theme || '-', bodyBg: getComputedStyle(d.body).backgroundColor, heightScreens: +(d.documentElement.scrollHeight / VH).toFixed(1), words, links: d.querySelectorAll('a[href]').length, buttons: d.querySelectorAll('button,[role=button]').length, interactiveVisible: inter.length, smallTargets: smallT.length, smallTargetSamples: smallT.slice(0,8).map(e => `${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)} "${(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,25)}"`), wordsUnder14: small14, wordsUnder12: small12, smallSamples, fontSizes: Object.keys(sizes).length, fontSizeList: Object.entries(sizes).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(' '), families: fams, overflow: overflow.length, overflowSamples: overflow.slice(0,5).map(e => `${e.tagName.toLowerCase()}.${(e.className||'').toString().split(' ')[0]} right=${Math.round(e.getBoundingClientRect().right)}`), docScrollW: d.documentElement.scrollWidth, fixed, firstViewportCTAs: firstCTA, h1, lowContrast: lowContrast.length, lowContrastSamples: lowContrast.slice(0,10), meta });
})()
