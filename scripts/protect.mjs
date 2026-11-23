#!/usr/bin/env node
// Builds a password-protected copy of src/ into dist/.
//
// Each HTML page is encrypted with AES-256-GCM using a key derived from your
// password (PBKDF2-SHA256, 600,000 iterations). The published pages contain only
// ciphertext and a login form, so "view source" reveals nothing. Visitors enter
// the password once per browser tab; the derived key (never the password) is kept
// in sessionStorage so moving between pages doesn't ask again.
//
// Password source, in order: SITE_PASSWORD env var, then site-password.txt in the
// repo root (gitignored). Usage:  node scripts/protect.mjs

import { webcrypto as crypto } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'src');
const OUT = path.join(root, 'dist');
const PW_FILE = path.join(root, 'site-password.txt');
const ITERATIONS = 600_000;

let password = process.env.SITE_PASSWORD;
if (!password && fs.existsSync(PW_FILE)) password = fs.readFileSync(PW_FILE, 'utf8').trim();
if (!password) {
  console.error(`No password found. Write it in ${path.relative(process.cwd(), PW_FILE)} (one line) or set SITE_PASSWORD.`);
  process.exit(1);
}
if (password.length < 10) console.warn('Warning: passwords under 10 characters are easy to guess offline. Use a longer one.');

const salt = crypto.getRandomValues(new Uint8Array(16)); // one salt per build, so one key unlocks every page
const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);

const b64 = (u8) => Buffer.from(u8).toString('base64');
async function encrypt(text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text)));
  return { iv: b64(iv), ct: b64(ct) };
}

const shell = (title, payload) => `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<style>
:root{--bg:#FAFAFA;--surface:#fff;--text:#0F172A;--muted:#475569;--line:#CBD5E1;--accent:#0F766E;--accent-ink:#fff;--focus:#1D4ED8;--err:#B91C1C}
@media (prefers-color-scheme:dark){:root{--bg:#0F172A;--surface:#111C33;--text:#F1F5F9;--muted:#A8B4C7;--line:#334155;--accent:#5EEAD4;--accent-ink:#042F2E;--focus:#93C5FD;--err:#FCA5A5}}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:1rem;background:var(--bg);color:var(--text);font:1.0625rem/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{width:min(26rem,100%);background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:2rem}
h1{font-size:1.4rem;margin:0 0 .25rem;letter-spacing:-.02em}p{margin:0 0 1.25rem;color:var(--muted)}
label{display:block;font-weight:600;margin-bottom:.35rem}
input{width:100%;font:inherit;color:var(--text);background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:.65rem .75rem;min-height:44px}
input[aria-invalid=true]{border-color:var(--err)}
button{margin-top:1rem;width:100%;min-height:44px;font:inherit;font-weight:600;border:0;border-radius:999px;background:var(--accent);color:var(--accent-ink);cursor:pointer}
button[disabled]{opacity:.7;cursor:progress}
:focus-visible{outline:3px solid var(--focus);outline-offset:3px}
#msg{min-height:1.5em;margin:.75rem 0 0;color:var(--err);font-size:.92rem}
.foot{margin:1.25rem 0 0;font-size:.9rem}
.foot a{color:var(--accent)}
</style>
</head>
<body>
<main>
  <h1>Pooja Kudesia · UX portfolio</h1>
  <p>This portfolio includes work under NDA. Enter the password you were sent.</p>
  <form id="f" novalidate>
    <label for="pw">Password</label>
    <input id="pw" type="password" autocomplete="current-password" required aria-describedby="msg">
    <button type="submit">View portfolio</button>
    <p id="msg" role="alert"></p>
  </form>
  <p class="foot">Need access? <a href="https://www.linkedin.com/in/poojakudesia" rel="noopener">Message me on LinkedIn</a>.</p>
</main>
<script>
(() => {
  const P = ${JSON.stringify({ salt: b64(salt), it: ITERATIONS, ...payload })};
  const K = 'pk-portfolio-key';
  const u8 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const store = { get(){try{return sessionStorage.getItem(K)}catch{return null}}, set(v){try{sessionStorage.setItem(K,v)}catch{}}, del(){try{sessionStorage.removeItem(K)}catch{}} };

  async function open(rawKey) {
    const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u8(P.iv) }, key, u8(P.ct));
    const html = new TextDecoder().decode(pt);
    document.open(); document.write(html); document.close();
  }
  async function derive(pw) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
    const k = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: u8(P.salt), iterations: P.it, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
    return new Uint8Array(await crypto.subtle.exportKey('raw', k));
  }

  const saved = store.get();
  if (saved) open(u8(saved)).catch(() => store.del());

  const f = document.getElementById('f'), pw = document.getElementById('pw'), msg = document.getElementById('msg'), btn = f.querySelector('button');
  pw.focus();
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!pw.value) { msg.textContent = 'Enter the password.'; pw.setAttribute('aria-invalid', 'true'); pw.focus(); return; }
    btn.disabled = true; btn.textContent = 'Checking…'; msg.textContent = '';
    try {
      const raw = await derive(pw.value);
      await open(raw);
      store.set(btoa(String.fromCharCode(...raw)));
    } catch {
      btn.disabled = false; btn.textContent = 'View portfolio';
      msg.textContent = 'That password is incorrect. Try again.';
      pw.setAttribute('aria-invalid', 'true'); pw.select();
    }
  });
})();
</script>
</body>
</html>
`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });
let n = 0;
for (const f of fs.readdirSync(OUT).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(OUT, f), 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [, 'Pooja Kudesia · Portfolio'])[1];
  fs.writeFileSync(path.join(OUT, f), shell(title, await encrypt(html)));
  n++;
}
console.log(`Encrypted ${n} pages into ${path.relative(process.cwd(), OUT)}/. Publish that folder, not src/.`);
