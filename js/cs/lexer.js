/* ===== KapiSharp: mini-interpreter C# – lekser =====
   Zamienia tekst programu na tokeny. Błędy zgłasza w stylu kompilatora C# (CSxxxx). */
(function (G) {
'use strict';
const CS = G.CS = G.CS || {};

class CsError extends Error {
  constructor(code, msg, line, col) { super(msg); this.code = code; this.line = line || 0; this.col = col || 0; this.compile = true; }
}
CS.CsError = CsError;

const KEYWORDS = new Set(('abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event ' +
  'explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override ' +
  'params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong ' +
  'unchecked unsafe ushort using virtual void volatile while').split(' '));
CS.KEYWORDS = KEYWORDS;
CS.PRIMS = new Set('bool byte sbyte char decimal double float int uint long ulong short ushort object string void'.split(' '));

const OPS = ['>>=', '<<=', '??=', '...', '=>', '==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<', '??', '?.', '::', '..',
  '{', '}', '(', ')', '[', ']', ';', ',', '.', ':', '?', '+', '-', '*', '/', '%', '&', '|', '^', '!', '~', '=', '<', '>', '@', '#'];

const ID_START = /[\p{L}_]/u, ID_PART = /[\p{L}\p{N}_]/u;

function lex(src, lineOff = 0, colOff = 0) {
  const toks = [];
  let i = 0, line = 1 + lineOff, col = 1 + colOff, ls = 0;
  const n = src.length;
  const err = (code, msg, l = line, c = col) => { throw new CsError(code, msg, l, c); };
  const adv = k => { for (let j = 0; j < k; j++) { if (src[i] === '\n') { line++; col = 1; } else col++; i++; } };
  const push = (t, v, l, c, extra) => { const tk = { t, v, line: l, col: c, eline: line, ecol: col, sp: ls !== i - 0 }; if (extra) Object.assign(tk, extra); toks.push(tk); return tk; };
  while (i < n) {
    const ch = src[i];
    // whitespace
    if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n' || ch === '﻿') { adv(1); continue; }
    // comments
    if (ch === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') adv(1); continue; }
    if (ch === '/' && src[i + 1] === '*') {
      const l0 = line, c0 = col; adv(2);
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) adv(1);
      if (i >= n) err('CS1035', 'End-of-file found, \'*/\' expected', l0, c0);
      adv(2); continue;
    }
    // preprocessor (#region, #nullable ...) – ignore the whole line
    if (ch === '#' && (toks.length === 0 || toks[toks.length - 1].eline < line)) { while (i < n && src[i] !== '\n') adv(1); continue; }
    const l = line, c = col;
    // strings: $"..", @"..", $@"..", @$"..", ".."
    if (ch === '"' || ((ch === '$' || ch === '@') && (src[i + 1] === '"' || ((src[i + 1] === '$' || src[i + 1] === '@') && src[i + 2] === '"' && src[i + 1] !== ch)))) {
      let interp = false, verb = false;
      while (src[i] !== '"') { if (src[i] === '$') interp = true; if (src[i] === '@') verb = true; adv(1); }
      adv(1); // opening quote
      const parts = []; let buf = '';
      for (;;) {
        if (i >= n) err('CS1039', 'Unterminated string literal', l, c);
        const d = src[i];
        if (!verb && d === '\n') err('CS1010', 'Newline in constant', l, c);
        if (d === '"') {
          if (verb && src[i + 1] === '"') { buf += '"'; adv(2); continue; }
          adv(1); break;
        }
        if (!verb && d === '\\') { buf += escape(); continue; }
        if (interp && d === '{') {
          if (src[i + 1] === '{') { buf += '{'; adv(2); continue; }
          parts.push(buf); buf = '';
          const hl = line, hc = col + 1; adv(1);
          // read hole until matching }
          let depth = 0, code = '', align = null, fmt = null, stage = 0, seg = '';
          for (;;) {
            if (i >= n) err('CS8076', 'Missing close delimiter \'}\' for interpolated expression started with \'{\'.', hl, hc);
            const e = src[i];
            if (stage < 2 && (e === '"' || e === '\'')) { // nested literal
              const q = e; seg += e; adv(1);
              while (i < n && src[i] !== q) { if (src[i] === '\\') { seg += src[i]; adv(1); } seg += src[i]; adv(1); }
              seg += q; adv(1); continue;
            }
            if (stage < 2 && (e === '(' || e === '[' || e === '{')) depth++;
            if (stage < 2 && (e === ')' || e === ']')) depth--;
            if (e === '}' && depth === 0) { adv(1); break; }
            if (stage < 2 && e === '}') depth--;
            if (depth === 0 && stage === 0 && e === ',') { code = seg; seg = ''; stage = 1; adv(1); continue; }
            if (depth === 0 && stage < 2 && e === ':' && !(stage === 0 && /\?[^:]*$/.test(seg))) { if (stage === 0) code = seg; else align = seg; seg = ''; stage = 2; adv(1); continue; }
            if (!verb && e === '\n' && stage < 2) err('CS1010', 'Newline in constant', l, c);
            seg += e; adv(1);
          }
          if (stage === 0) code = seg; else if (stage === 1) align = seg; else fmt = seg;
          if (!code.trim()) err('CS1733', 'Expected expression', hl, hc);
          parts.push({ code, align: align !== null ? align.trim() : null, fmt, line: hl, col: hc });
          continue;
        }
        if (interp && d === '}') { if (src[i + 1] === '}') { buf += '}'; adv(2); continue; } err('CS8086', 'A \'}\' character must be escaped (by doubling) in an interpolated string.'); }
        buf += d; adv(1);
      }
      if (interp) { parts.push(buf); push('istr', parts, l, c); } else push('str', buf, l, c);
      continue;
    }
    if (ch === '\'') {
      adv(1); let v;
      if (src[i] === '\\') v = escape(); else if (src[i] === '\'' || src[i] === '\n' || i >= n) err('CS1011', 'Empty character literal', l, c); else { v = src[i]; adv(1); }
      if (src[i] !== '\'') err('CS1012', 'Too many characters in character literal', l, c);
      adv(1); push('chr', v, l, c); continue;
    }
    // numbers
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      let s = '', real = false, kind = null;
      if (ch === '0' && (src[i + 1] === 'x' || src[i + 1] === 'X')) {
        adv(2); while (/[0-9a-fA-F_]/.test(src[i] || '')) { s += src[i]; adv(1); }
        let v = parseInt(s.replace(/_/g, ''), 16); let suf = '';
        while (/[uUlL]/.test(src[i] || '')) { suf += src[i].toLowerCase(); adv(1); }
        push('num', { v, k: suf.includes('l') ? 'long' : (v > 2147483647 ? 'uint' : 'int'), raw: '0x' + s }, l, c); continue;
      }
      if (ch === '0' && (src[i + 1] === 'b' || src[i + 1] === 'B')) {
        adv(2); while (/[01_]/.test(src[i] || '')) { s += src[i]; adv(1); }
        push('num', { v: parseInt(s.replace(/_/g, ''), 2), k: 'int', raw: '0b' + s }, l, c); continue;
      }
      while (/[0-9_]/.test(src[i] || '')) { s += src[i]; adv(1); }
      let scale = 0;
      if (src[i] === '.' && /[0-9]/.test(src[i + 1] || '')) { real = true; s += '.'; adv(1); while (/[0-9_]/.test(src[i] || '')) { s += src[i]; scale++; adv(1); } }
      if (src[i] === 'e' || src[i] === 'E') { real = true; s += 'e'; adv(1); if (src[i] === '+' || src[i] === '-') { s += src[i]; adv(1); } while (/[0-9]/.test(src[i] || '')) { s += src[i]; adv(1); } }
      let suf = ''; while (/[fFdDmMuUlL]/.test(src[i] || '')) { suf += src[i].toLowerCase(); adv(1); }
      if (ID_PART.test(src[i] || '')) err('CS1013', 'Invalid number', l, c);
      const clean = s.replace(/_/g, '');
      if (suf === 'f') kind = 'float'; else if (suf === 'd') kind = 'double'; else if (suf === 'm') kind = 'decimal';
      else if (real) kind = 'double';
      else if (suf.includes('u') && suf.includes('l')) kind = 'ulong'; else if (suf === 'l') kind = 'long'; else if (suf === 'u') kind = 'uint';
      else kind = 'int';
      let v;
      if (kind === 'long' || kind === 'ulong' || (kind === 'int' && clean.length > 9)) {
        const b = BigInt(clean);
        if (kind === 'int') { if (b > 2147483647n) { if (b <= 4294967295n) { kind = 'uint'; v = Number(b); } else { kind = 'long'; v = b; } } else v = Number(b); }
        else v = b;
      } else v = Number(clean);
      push('num', { v, k: kind, scale, raw: s + suf }, l, c); continue;
    }
    // identifiers / keywords (also @verbatim identifiers)
    if (ID_START.test(ch) || (ch === '@' && ID_START.test(src[i + 1] || ''))) {
      let s = ''; const verbatim = ch === '@'; if (verbatim) adv(1);
      while (i < n && ID_PART.test(src[i])) { s += src[i]; adv(1); }
      push(!verbatim && KEYWORDS.has(s) ? 'kw' : 'id', s, l, c); continue;
    }
    // operators
    let op = null;
    for (const o of OPS) if (src.startsWith(o, i)) { op = o; break; }
    if (!op) err('CS1056', `Unexpected character '${ch}'`, l, c);
    adv(op.length); push('op', op, l, c);
  }
  toks.push({ t: 'eof', v: '<EOF>', line, col, eline: line, ecol: col });
  // mark tokens immediately followed by another without whitespace (needed for '>' '>' shift)
  for (let k = 0; k < toks.length - 1; k++) toks[k].adj = toks[k].eline === toks[k + 1].line && toks[k].ecol === toks[k + 1].col;
  return toks;

  function escape() {
    adv(1); const e = src[i];
    const map = { n: '\n', t: '\t', r: '\r', '0': '\0', '\\': '\\', '"': '"', '\'': '\'', a: '\x07', b: '\b', f: '\f', v: '\v', e: '\x1b' };
    if (e in map) { adv(1); return map[e]; }
    if (e === 'u' || e === 'x') { adv(1); let h = ''; while (h.length < 4 && /[0-9a-fA-F]/.test(src[i] || '')) { h += src[i]; adv(1); } return String.fromCharCode(parseInt(h || '0', 16)); }
    err('CS1009', 'Unrecognized escape sequence');
  }
}
CS.lex = lex;
})(typeof window !== 'undefined' ? window : globalThis);
