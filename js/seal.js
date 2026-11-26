/* ===== KapiSeal: answers are not stored as plain text in the course data =====
   tools/build.js replaces answer fields of every task (a, ans, line, sol, fix, why, expect) with:
   - verification hashes (ah, ansh, lh) – the app checks a student's answer by hashing it,
   - a sealed blob (x) – opened only when the app needs the text (after a correct answer or a revealed solution).
   This keeps answers out of the console and the page source for casual peeking.
   It is NOT cryptographic protection: everything needed to open the blob ships with the page.
   Real protection needs a server that keeps the answers (see README). */
(function (G) {
  'use strict';
  const K = 'KapiSeal/CappySoft.pl/2026';
  function fnv(str, seed) { let h = seed >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
  const hex = n => n.toString(16).padStart(8, '0');
  /* 64-bit-ish fingerprint of an answer for one task */
  function h(id, s) { const v = K + '|' + id + '|' + String(s); return hex(fnv(v, 0x811c9dc5)) + hex(fnv(v + '#', 0x01000193 ^ 0x9e3779b9)); }
  function stream(id, n) { const out = new Uint8Array(n); let x = fnv(K + id, 0x811c9dc5); for (let i = 0; i < n; i++) { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; out[i] = x & 255; } return out; }
  const enc = s => (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s) : Uint8Array.from(Buffer.from(s, 'utf8')));
  const dec = b => (typeof TextDecoder !== 'undefined' ? new TextDecoder().decode(b) : Buffer.from(b).toString('utf8'));
  function b64(b) { if (typeof btoa === 'undefined') return Buffer.from(b).toString('base64'); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); }
  function unb64(s) { if (typeof atob === 'undefined') return Uint8Array.from(Buffer.from(s, 'base64')); const r = atob(s); const b = new Uint8Array(r.length); for (let i = 0; i < r.length; i++) b[i] = r.charCodeAt(i); return b; }
  function seal(id, obj) { const b = enc(JSON.stringify(obj)); const k = stream(id, b.length); for (let i = 0; i < b.length; i++) b[i] ^= k[i]; return b64(b); }
  const cache = new Map();
  function open(t) {
    if (!t || !t.x) return {};
    const key = t.id + '|' + (t.lg || '') + '|' + t.x.length; if (cache.has(key)) return cache.get(key);
    const b = unb64(t.x); const k = stream(t.lg ? t.id + '/' + t.lg : t.id, b.length); for (let i = 0; i < b.length; i++) b[i] ^= k[i];
    let o = {}; try { o = JSON.parse(dec(b)); } catch (e) { o = {}; }
    cache.set(key, o); return o;
  }
  /* same normalisation as the fill-in check in the app */
  const nrm = s => String(s || '').replace(/\s+/g, '').replace(/'/g, '"');
  const Seal = { h, seal, open, nrm };
  if (typeof module !== 'undefined' && module.exports) module.exports = Seal; else G.Seal = Seal;
})(typeof window !== 'undefined' ? window : globalThis);
