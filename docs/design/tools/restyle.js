(() => {
  // Mock-only restyle of a live landing page in direction A (app tokens). Content is not removed.
  const d = document, root = d.documentElement;
  try { localStorage.setItem('vc-theme-d', 'dark'); } catch (e) {}
  root.setAttribute('data-theme', 'dark');
  const css = `
  :root,html[data-theme]{--bg:#0C0C0E!important;--bg-2:#121216!important;--surface:#18181C!important;--surface-2:#1E1E23!important;--line:#2E2E36!important;--line-soft:#232329!important;
   --ink:#F4F4F6!important;--ink-2:#D4D4DA!important;--ink-mute:#A3A3AF!important;--ink-faint:#8D8D99!important;--teal:#F4F4F6!important;--teal-deep:#F4F4F6!important;--teal-glow:transparent!important;--indigo:#A3A3AF!important;--indigo-glow:transparent!important}
  body{background:#0C0C0E!important}
  *,*::before,*::after{box-shadow:none!important;text-shadow:none!important}
  body::before,body::after,header.hero::before,header.hero::after,section::before{background-image:none!important}
  header.hero,.hero,nav.top{background:#0C0C0E!important;backdrop-filter:none!important}
  .serif,h1 em,h2 em,h1 .serif,h2 .serif{font-family:Geist,system-ui,sans-serif!important;font-style:normal!important;color:inherit!important;letter-spacing:-.02em!important}
  .btn-glow,.cta-pill,.btn.primary{background:#F4F4F6!important;color:#0C0C0E!important;border-color:#F4F4F6!important;background-image:none!important}
  a.btn,button.btn,.btn{min-height:44px;color:#0C0C0E}
  .btn-ghost,a.btn.btn-ghost{color:#F4F4F6!important;background:transparent!important}
  .btn{border-radius:999px!important}
  `;
  const st = d.createElement('style'); st.textContent = css; d.head.appendChild(st);
  // Raise text below the floor: mono labels to 12px, other text below 14px to 14px.
  [...d.querySelectorAll('body *')].forEach(e => {
    if (e.closest('svg')) return;
    const s = getComputedStyle(e); const fs = parseFloat(s.fontSize);
    const hasText = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!hasText && !/Instrument/i.test(s.fontFamily)) return;
    if (/Instrument/i.test(s.fontFamily)) { e.style.fontFamily = 'Geist, system-ui, sans-serif'; e.style.fontStyle = 'normal'; e.style.color = 'inherit'; e.style.letterSpacing = '-0.02em'; }
    const mono = /Mono/i.test(s.fontFamily);
    if (mono && fs < 12) e.style.fontSize = '12px';
    if (!mono && fs < 14) e.style.fontSize = '14px';
    if (/^([0-9A-F]{4}\s+){3,}/.test(e.textContent.trim())) e.style.visibility = 'hidden';
  });
  return 'ok';
})()
