// usage: node cdp.mjs jobs.json outdir
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
const [,, jobsFile, outDir] = process.argv; const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8')); fs.mkdirSync(outDir, { recursive: true });
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'vc-chrome-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${prof}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((res) => chrome.stderr.on('data', (b) => { const m = b.toString().match(/ws:\/\/[^\s]+/); if (m) res(m[0]); }));
const port = new URL(wsUrl).port; const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map(); const evWait = [];
ws.onmessage = (m) => { const j = JSON.parse(m.data); if (j.id && pend.has(j.id)) { pend.get(j.id)(j); pend.delete(j.id); } else if (j.method) evWait.filter(e => e.m === j.method).forEach(e => { e.r(j); evWait.splice(evWait.indexOf(e), 1); }); };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const waitEv = (m, ms = 20000) => Promise.race([new Promise(r => evWait.push({ m, r })), new Promise(r => setTimeout(r, ms))]);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description; };
await send('Page.enable'); await send('Runtime.enable');
const measure = fs.readFileSync(new URL('./measure.js', import.meta.url), 'utf8');
const inventory = fs.readFileSync(path.join(os.homedir(), '.claude/tools/design_inventory.js'), 'utf8');
const results = [];
for (const j of jobs) {
  const mobile = j.w < 700;
  await send('Emulation.setDeviceMetricsOverride', { width: j.w, height: j.h, deviceScaleFactor: j.dpr || 1, mobile });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: j.theme || 'dark' }, { name: 'prefers-reduced-motion', value: j.reduced ? 'reduce' : 'no-preference' }] });
  await send('Runtime.evaluate', { expression: 'try{localStorage.clear()}catch(e){}' });
  const p = waitEv('Page.loadEventFired'); await send('Page.navigate', { url: j.url }); await p; await sleep(1500);
  // scroll through to trigger lazy content and reveal animations
  await ev(`(async()=>{const H=document.documentElement.scrollHeight;for(let y=0;y<H;y+=innerHeight*0.6){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);await new Promise(r=>setTimeout(r,600));})()`);
  if (j.pre) { const pr = await ev(j.pre); if (typeof pr === "string") fs.writeFileSync(path.join(outDir, `${j.name}.pre.txt`), pr); }
  await sleep(500);
  const rec = { ...j };
  if (j.measure !== false) rec.m = JSON.parse(await ev(measure));
  if (j.inventory) fs.writeFileSync(path.join(outDir, `${j.name}.inv.md`), await ev(inventory));
  if (j.shot) {
    const H = await ev('document.documentElement.scrollHeight');
    const full = j.shot === 'full';
    await send('Emulation.setDeviceMetricsOverride', { width: j.w, height: full ? Math.min(H, 16000) : j.h, deviceScaleFactor: j.dpr || 1, mobile });
    await sleep(700);
    const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 72 });
    fs.writeFileSync(path.join(outDir, `${j.name}.jpg`), Buffer.from(s.result.data, 'base64'));
  }
  results.push(rec); process.stderr.write(`done ${j.name}\n`);
}
fs.writeFileSync(path.join(outDir, `results-${path.basename(jobsFile)}`), JSON.stringify(results, null, 1));
ws.close(); chrome.kill(); try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}
