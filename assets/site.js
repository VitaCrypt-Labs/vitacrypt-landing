// VitaCrypt landing, shared behaviour: mobile menu and the source ring chips. No data leaves the page.
(() => {
  const btn = document.querySelector('.menu');
  const drawer = document.getElementById('drawer');
  if (btn && drawer) {
    const set = (open) => { drawer.hidden = !open; btn.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; };
    btn.addEventListener('click', () => set(drawer.hidden));
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { set(false); btn.focus(); } });
  }
  const ring = document.querySelector('.ring');
  document.querySelectorAll('.chip[data-k]').forEach((chip) => chip.addEventListener('click', () => {
    const k = chip.dataset.k;
    document.querySelectorAll('.chip[data-k]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    document.querySelectorAll('.how[data-k]').forEach((p) => { p.hidden = p.dataset.k !== k; });
    if (ring) { ring.classList.add('focus'); ring.querySelectorAll('[data-k]').forEach((s) => s.classList.toggle('sel', s.dataset.k === k)); }
  }));
})();
