/* ===== KapiSharp: runtime (wartości, typy, wykonywanie) ===== */
(function (G) {
'use strict';
const CS = G.CS;
const { CsError } = CS;

/* ---------- values ---------- */
class N { constructor(t, v, c, s) { this.t = t; this.v = v; if (c) this.c = true; if (s) this.s = s; } }
let OID = 0;
class Obj { constructor(cls) { this.cls = cls; this.f = Object.create(null); this.id = ++OID; } }
class Arr { constructor(el, a, dims) { this.el = el; this.a = a; this.dims = dims || [a.length]; this.id = ++OID; } }
class Coll { constructor(kind, targs) { this.kind = kind; this.ta = targs || []; this.a = []; this.m = null; this.ver = 0; this.id = ++OID; if (kind === 'Dictionary' || kind === 'HashSet') this.m = new Map(); } }
class EnumVal { constructor(e, v) { this.e = e; this.v = v; } }
class KVP { constructor(k, v) { this.Key = k; this.Value = v; } }
class Fn { constructor(params, body, sc, fr, method) { this.params = params; this.body = body; this.sc = sc; this.fr = fr; this.method = method; this.id = ++OID; } }
class MRef { constructor(self, cands, name) { this.self = self; this.cands = cands; this.name = name; this.id = ++OID; } }
class Multi { constructor(list) { this.list = list; } }
class TypeVal { constructor(ty, cls) { this.ty = ty; this.cls = cls; } }
class TypeObj { constructor(ty, cls) { this.ty = ty; this.cls = cls; } }
class NS { constructor(n) { this.n = n; } }
class Tup { constructor(items) { this.items = items; } }
class Ref { constructor(get, set, type) { this.get = get; this.set = set; this.type = type; } }
class CsThrow { constructor(ex, line) { this.ex = ex; this.line = line; } }
class Timeout { }
function isStackErr(e) { return e instanceof RangeError && typeof e.message === 'string' && e.message.indexOf('call stack') >= 0; }
CS.isStackErr = isStackErr;
class StackOverflow { constructor(line) { this.line = line; } }
class Exit { }
Object.assign(CS, { N, Obj, Arr, Coll, EnumVal, KVP, Fn, MRef, Multi, TypeVal, TypeObj, NS, Tup, Ref, CsThrow, Timeout, StackOverflow, Exit });

const INTS = new Set(['int', 'uint', 'short', 'ushort', 'byte', 'sbyte', 'char', 'long', 'ulong']);
const NUMS = new Set([...INTS, 'float', 'double', 'decimal']);
const BIG = new Set(['long', 'ulong']);
const VALUE_PRIMS = new Set([...NUMS, 'bool']);
const IMPLICIT = {
  sbyte: ['short', 'int', 'long', 'float', 'double', 'decimal'], byte: ['short', 'ushort', 'int', 'uint', 'long', 'ulong', 'float', 'double', 'decimal'],
  short: ['int', 'long', 'float', 'double', 'decimal'], ushort: ['int', 'uint', 'long', 'ulong', 'float', 'double', 'decimal'],
  int: ['long', 'float', 'double', 'decimal'], uint: ['long', 'ulong', 'float', 'double', 'decimal'], long: ['float', 'double', 'decimal'], ulong: ['float', 'double', 'decimal'],
  char: ['ushort', 'int', 'uint', 'long', 'ulong', 'float', 'double', 'decimal'], float: ['double'], double: [], decimal: []
};
const RANGE = { sbyte: [-128, 127], byte: [0, 255], short: [-32768, 32767], ushort: [0, 65535], int: [-2147483648, 2147483647], uint: [0, 4294967295], char: [0, 65535] };
const CLR = { int: 'Int32', uint: 'UInt32', long: 'Int64', ulong: 'UInt64', short: 'Int16', ushort: 'UInt16', byte: 'Byte', sbyte: 'SByte', char: 'Char', float: 'Single', double: 'Double', decimal: 'Decimal', bool: 'Boolean', string: 'String', object: 'Object' };
Object.assign(CS, { INTS, NUMS, CLR });

function mk(t, v, c, s) {
  switch (t) {
    case 'int': v = typeof v === 'bigint' ? Number(BigInt.asIntN(32, v)) : (Number.isFinite(v) ? Math.trunc(v) | 0 : (Number.isNaN(v) ? 0 : (v > 0 ? 2147483647 : -2147483648))); break;
    case 'uint': v = typeof v === 'bigint' ? Number(BigInt.asUintN(32, v)) : (Math.trunc(v) >>> 0); break;
    case 'short': v = (Number(typeof v === 'bigint' ? BigInt.asIntN(16, v) : Math.trunc(v)) << 16) >> 16; break;
    case 'ushort': case 'char': v = Number(typeof v === 'bigint' ? BigInt.asUintN(16, v) : Math.trunc(v)) & 0xFFFF; break;
    case 'byte': v = Number(typeof v === 'bigint' ? BigInt.asUintN(8, v) : Math.trunc(v)) & 255; break;
    case 'sbyte': v = (Number(typeof v === 'bigint' ? BigInt.asIntN(8, v) : Math.trunc(v)) << 24) >> 24; break;
    case 'long': v = BigInt.asIntN(64, typeof v === 'bigint' ? v : BigInt(Number.isFinite(v) ? Math.trunc(v) : 0)); break;
    case 'ulong': v = BigInt.asUintN(64, typeof v === 'bigint' ? v : BigInt(Number.isFinite(v) ? Math.trunc(v) : 0)); break;
    case 'float': v = Math.fround(Number(v)); break;
    case 'double': v = Number(v); break;
    case 'decimal': v = Number(v); if (s === undefined) s = decScale(v); break;
  }
  return new N(t, v, c, s);
}
function decScale(v) { if (Number.isInteger(v)) return 0; const s = String(v); if (/e/.test(s)) return 0; return Math.min(28, (s.split('.')[1] || '').length); }
const I = (v) => mk('int', v);
const num = n => typeof n.v === 'bigint' ? Number(n.v) : n.v;
CS.mk = mk; CS.I = I; CS.num = num;

function promo(a, b) {
  if (a === 'decimal' || b === 'decimal') { if (['float', 'double'].includes(a) || ['float', 'double'].includes(b)) return null; return 'decimal'; }
  if (a === 'double' || b === 'double') return 'double';
  if (a === 'float' || b === 'float') return 'float';
  if (a === 'ulong' || b === 'ulong') { const o = a === 'ulong' ? b : a; if (['sbyte', 'short', 'int', 'long'].includes(o)) return null; return 'ulong'; }
  if (a === 'long' || b === 'long') return 'long';
  if (a === 'uint' || b === 'uint') { const o = a === 'uint' ? b : a; if (['sbyte', 'short', 'int'].includes(o)) return 'long'; return 'uint'; }
  return 'int';
}

/* ---------- types ---------- */
function tname(t) {
  if (!t) return '?';
  if (typeof t === 'string') return t;
  if (t.n === '[]') return tname(t.el) + '[' + ','.repeat((t.r || 1) - 1) + ']';
  if (t.n === '?') return tname(t.el) + '?';
  if (t.a) return t.n + '<' + t.a.map(tname).join(', ') + '>';
  return t.n;
}
CS.tname = tname;
function shortNum(n) { return n; }

/* ---------- number formatting (invariant culture) ---------- */
function fmtDouble(v, isFloat) {
  if (Number.isNaN(v)) return 'NaN';
  if (v === Infinity) return '∞';
  if (v === -Infinity) return '-∞';
  if (v === 0) return Object.is(v, -0) ? '-0' : '0';
  let x = v;
  if (isFloat) { for (let p = 1; p <= 9; p++) { const s = parseFloat(v.toPrecision(p)); if (Math.fround(s) === v) { x = s; break; } } }
  const e = x.toExponential(); const [m, ex] = e.split('e'); const exp = +ex;
  if (exp >= 15 || exp < -5) { const digits = m.replace('.', '').replace('-', ''); const mant = (x < 0 ? '-' : '') + digits[0] + (digits.length > 1 ? '.' + digits.slice(1) : ''); return mant + 'E' + (exp < 0 ? '-' : '+') + String(Math.abs(exp)).padStart(2, '0'); }
  return String(x);
}
function group(intStr) { return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function toFixedSafe(v, d) { if (Math.abs(v) >= 1e21) return BigInt(Math.round(v)).toString() + (d > 0 ? '.' + '0'.repeat(d) : ''); return v.toFixed(Math.min(100, d)); }
function fmtNum(n, fmt) {
  const t = n.t; let v = num(n); const isInt = INTS.has(t) && t !== 'char';
  const m = /^([A-Za-z])(\d*)$/.exec(fmt);
  if (m) {
    const c = m[1].toUpperCase(); const p = m[2] === '' ? null : +m[2];
    switch (c) {
      case 'F': return toFixedSafe(v, p === null ? 2 : p).replace(/^-(0\.?0*)$/, '-$1');
      case 'N': { const s = toFixedSafe(Math.abs(v), p === null ? 2 : p); const [a, b] = s.split('.'); return (v < 0 && +s !== 0 ? '-' : '') + group(a) + (b ? '.' + b : ''); }
      case 'D': if (!isInt) throw new FmtErr(); { const s = typeof n.v === 'bigint' ? (n.v < 0n ? -n.v : n.v).toString() : String(Math.abs(v)); return (v < 0 ? '-' : '') + s.padStart(p || 0, '0'); }
      case 'X': if (!isInt) throw new FmtErr(); { let s = (typeof n.v === 'bigint' ? BigInt.asUintN(64, n.v) : (v >>> 0)).toString(16); if (m[1] === 'X') s = s.toUpperCase(); return s.padStart(p || 0, '0'); }
      case 'E': { const s = v.toExponential(p === null ? 6 : p); const [a, b] = s.split('e'); return a + (m[1] === 'e' ? 'e' : 'E') + (b[0] === '-' ? '-' : '+') + b.replace(/^[+-]/, '').padStart(3, '0'); }
      case 'P': { const s = toFixedSafe(Math.abs(v * 100), p === null ? 2 : p); const [a, b] = s.split('.'); return (v < 0 ? '-' : '') + group(a) + (b ? '.' + b : '') + ' %'; }
      case 'C': { const s = toFixedSafe(Math.abs(v), p === null ? 2 : p); const [a, b] = s.split('.'); return (v < 0 ? '-' : '') + '¤' + group(a) + (b ? '.' + b : ''); }
      case 'G': case 'R': return str0(n);
    }
  }
  // custom format: 0, #, ., ',' and literal text
  return customFmt(v, fmt);
}
class FmtErr { }
function customFmt(v, fmt) {
  const sections = fmt.split(';'); let f = sections[0];
  if (v < 0 && sections[1] !== undefined) { f = sections[1]; v = -v; }
  else if (v === 0 && sections[2] !== undefined) f = sections[2];
  let percent = f.includes('%'); if (percent) v *= 100;
  const mm = /^([^0#.,]*)([0#,]*)(\.([0#]*))?(.*)$/.exec(f);
  if (!mm) return String(v);
  const pre = mm[1], ip = mm[2], fp = mm[4] || '', post = mm[5];
  const useGroup = ip.includes(',');
  const minInt = (ip.match(/0/g) || []).length;
  const maxDec = fp.length, minDec = (fp.match(/0/g) || []).length;
  let s = toFixedSafe(Math.abs(v), maxDec);
  let [a, b = ''] = s.split('.');
  while (b.length > minDec && b.endsWith('0')) b = b.slice(0, -1);
  if (a === '0' && minInt === 0) a = '';
  a = a.padStart(minInt, '0');
  if (useGroup) a = group(a);
  const neg = v < 0 && (+s !== 0) && sections.length === 1 ? '-' : '';
  return pre.replace(/["']/g, '') + neg + a + (b ? '.' + b : '') + post.replace(/["']/g, '');
}
function str0(n) {
  switch (n.t) {
    case 'char': return String.fromCharCode(n.v);
    case 'double': return fmtDouble(n.v, false);
    case 'float': return fmtDouble(n.v, true);
    case 'decimal': return n.str || (n.s ? toFixedSafe(n.v, n.s) : (Number.isInteger(n.v) ? String(n.v) : String(n.v)));
    default: return String(n.v);
  }
}
Object.assign(CS, { fmtDouble, fmtNum, str0, FmtErr, customFmt });

/* ---------- scopes ---------- */
class Scope {
  constructor(p) { this.p = p; this.v = new Map(); }
  find(n) { let s = this; while (s) { const e = s.v.get(n); if (e) return e; s = s.p; } return null; }
}
CS.Scope = Scope;
const BRK = { k: 'brk' }, CNT = { k: 'cnt' };

/* ---------- the interpreter ---------- */
class Interp {
  constructor(U, opts) {
    this.U = U; this.opts = opts || {};
    this.out = []; this.outLen = 0; this.fg = null; this.bg = null;
    this.steps = 0; this.maxSteps = opts.maxSteps || 3000000; this.depth = 0; this.maxDepth = opts.maxDepth || 350;
    this.stdin = (opts.stdin || '').replace(/\r/g, '').split('\n'); if (this.stdin.length && this.stdin[this.stdin.length - 1] === '' && (opts.stdin || '').endsWith('\n')) this.stdin.pop();
    if (!opts.stdin) this.stdin = [];
    this.files = Object.assign(Object.create(null), opts.files || {});
    this.classes = new Map(); this.enums = new Map(); this.delegates = new Set(); this.statics = U.statics || [];
    this.host = opts.host || null;
    this.line = 0;
    CS.installBuiltins && CS.installBuiltins(this);
    this.buildTypes();
  }
  err(code, msg, nd) { throw new CsError(code, msg, nd ? nd.line : this.line, nd ? nd.col : 0); }
  tick(nd) { if (++this.steps > this.maxSteps) throw new Timeout(); if (nd) this.line = nd.line; }
  write(s) {
    s = String(s); this.outLen += s.length; if (this.outLen > 200000) throw new Timeout();
    const last = this.out[this.out.length - 1];
    if (last && last.fg === this.fg && last.bg === this.bg) last.t += s; else this.out.push({ t: s, fg: this.fg, bg: this.bg });
    if (this.opts.onWrite) this.opts.onWrite(s);
  }

  /* ===== type declarations ===== */
  buildTypes() {
    const all = [];
    const reg = (D, outer) => {
      if (D.k === 'Delegate') { this.delegates.add(D.name); return; }
      if (this.classes.has(D.name) || (this.enums.has(D.name) && !this.enums.get(D.name).builtin)) {
        const ex = this.classes.get(D.name);
        if (ex && ex.decl && ex.decl.mods.has('partial') && D.mods.has('partial')) { ex.decl.members.push(...D.members); D.bases.forEach(b => ex.decl.bases.push(b)); return; }
        if (!(ex && ex.native)) this.err('CS0101', `The namespace '<global namespace>' already contains a definition for '${D.name}'`, D);
      }
      if (D.kind === 'enum') { this.enums.set(D.name, this.buildEnum(D)); return; }
      const C = { name: D.name, kind: D.kind, decl: D, base: null, ifaces: [], fields: new Map(), props: new Map(), methods: new Map(), ctors: [], sctor: null, ops: new Map(),
        isAbstract: D.mods.has('abstract') || D.kind === 'interface', isStatic: D.mods.has('static'), isSealed: D.mods.has('sealed'), isStruct: D.kind === 'struct', isIface: D.kind === 'interface', sv: Object.create(null), sinit: false };
      this.classes.set(D.name, C); all.push(C); if (outer) C.outerCls = outer;
      for (const m of D.members) if (m.k === 'Nested') reg(m.decl, C);
    };
    for (const D of this.U.types) reg(D);
    for (const C of all) {
      for (const m of C.decl.members) {
        m.cls = C;
        const dup = (n, nd) => { if (C.fields.has(n) || C.props.has(n) || (C.methods.has(n) && nd.k !== 'Method')) this.err('CS0102', `The type '${C.name}' already contains a definition for '${n}'`, nd); };
        if (m.k === 'Field') { dup(m.name, m); C.fields.set(m.name, m); }
        else if (m.k === 'Prop') { dup(m.name, m); C.props.set(m.name, m); if (C.isIface) m.abstract = true; }
        else if (m.k === 'Method') {
          if (m.isOp) { (C.ops.get(m.name) || C.ops.set(m.name, []).get(m.name)).push(m); continue; }
          if (C.fields.has(m.name) || C.props.has(m.name)) dup(m.name, m);
          if (m.name === C.name) this.err('CS0542', `'${C.name}': member names cannot be the same as their enclosing type`, m);
          m.abstract = m.mods.has('abstract') || (C.isIface && !m.body && !m.exprBody);
          m.virt = m.mods.has('virtual') || m.abstract || m.mods.has('override');
          if (!m.abstract && !m.body && !m.exprBody && !m.mods.has('extern') && !m.mods.has('partial')) this.err('CS0501', `'${C.name}.${m.name}(${m.params.map(p => tname(p.type)).join(', ')})' must declare a body because it is not marked abstract, extern, or partial`, m);
          if (m.abstract && !C.isAbstract) this.err('CS0513', `'${C.name}.${m.name}(${m.params.map(p => tname(p.type)).join(', ')})' is abstract but it is contained in non-abstract type '${C.name}'`, m);
          const list = C.methods.get(m.name) || [];
          if (list.some(o => sig(o) === sig(m))) this.err('CS0111', `Type '${C.name}' already defines a member called '${m.name}' with the same parameter types`, m);
          list.push(m); C.methods.set(m.name, list);
        }
        else if (m.k === 'Ctor') { if (m.isStatic) C.sctor = m; else C.ctors.push(m); }
      }
    }
    for (const C of all) {
      for (const b of C.decl.bases) {
        const bn = b.n;
        const bc = this.classes.get(bn) || (this.nativeClass && this.nativeClass(bn));
        if (!bc) { if (this.isKnownIface(bn)) { C.ifaces.push({ name: bn, native: true }); continue; } this.err('CS0246', `The type or namespace name '${tname(b)}' could not be found (are you missing a using directive or an assembly reference?)`, C.decl); }
        if (bc.isIface) C.ifaces.push(bc);
        else {
          if (C.isStruct || C.isIface) this.err('CS0527', `Type '${bn}' in interface list is not an interface`, C.decl);
          if (C.base) this.err('CS1721', `Class '${C.name}' cannot have multiple base classes: '${C.base.name}' and '${bn}'`, C.decl);
          if (bc.isSealed) this.err('CS0509', `'${C.name}': cannot derive from sealed type '${bn}'`, C.decl);
          if (bc.isStatic) this.err('CS0709', `'${C.name}': cannot derive from static class '${bn}'`, C.decl);
          C.base = bc;
        }
      }
      if (!C.base && !C.isIface && !C.isStruct) C.base = null;
    }
    for (const C of all) { let b = C.base; while (b) { if (b.hostBase) { C.hostBase = true; C.hostKind = b.name; break; } b = b.base; } }
    // cycle check
    for (const C of all) { let b = C.base, k = 0; while (b) { if (b === C || k++ > 50) this.err('CS0146', `Circular base type dependency involving '${C.name}'`, C.decl); b = b.base; } }
    // override / abstract / interface checks
    for (const C of all) {
      if (C.isIface) continue;
      for (const [name, list] of C.methods) for (const m of list) {
        if (m.mods.has('override')) {
          const bm = this.findBaseMethod(C.base, m);
          if (!bm && ((name === 'ToString' && !m.params.length) || (name === 'GetHashCode' && !m.params.length) || (name === 'Equals' && m.params.length === 1))) continue;
          if (!bm) this.err('CS0115', `'${C.name}.${name}(${m.params.map(p => tname(p.type)).join(', ')})': no suitable method found to override`, m);
          if (!bm.virt && !bm.native) this.err('CS0506', `'${C.name}.${name}(${m.params.map(p => tname(p.type)).join(', ')})': cannot override inherited member '${bm.cls.name}.${name}(${bm.params.map(p => tname(p.type)).join(', ')})' because it is not marked virtual, abstract, or override`, m);
        }
      }
      for (const [, p] of C.props) if (p.mods.has('override')) { const bp = this.findProp(C.base, p.name); let nb = C.base; while (nb && !nb.native) nb = nb.base; if (!bp && !(nb && nb.nget && nb.nget[p.name])) this.err('CS0115', `'${C.name}.${p.name}': no suitable method found to override`, p); }
      if (!C.isAbstract) {
        // abstract members of bases
        const chain = []; let b = C.base; while (b) { chain.push(b); b = b.base; }
        for (const B of chain) {
          if (B.native) continue;
          for (const [, list] of B.methods) for (const am of list) if (am.abstract) {
            const impl = this.findImpl(C, am, B);
            if (!impl) this.err('CS0534', `'${C.name}' does not implement inherited abstract member '${B.name}.${am.name}(${am.params.map(p => tname(p.type)).join(', ')})'`, C.decl);
          }
          for (const [, p] of B.props) if (p.mods.has('abstract')) { let ok = false; let c = C; while (c && c !== B) { const q = c.props.get(p.name); if (q && q.mods.has('override')) { ok = true; break; } c = c.base; } if (!ok) this.err('CS0534', `'${C.name}' does not implement inherited abstract member '${B.name}.${p.name}.get'`, C.decl); }
        }
      }
      // interfaces
      for (const IF of this.allIfaces(C)) {
        if (IF.native) continue;
        for (const [, list] of IF.methods) for (const im of list) {
          if (!im.abstract) continue;
          if (!this.findImplUp(C, im)) this.err('CS0535', `'${C.name}' does not implement interface member '${IF.name}.${im.name}(${im.params.map(p => tname(p.type)).join(', ')})'`, C.decl);
        }
        for (const [, ip] of IF.props) { if (!this.findProp(C, ip.name)) this.err('CS0535', `'${C.name}' does not implement interface member '${IF.name}.${ip.name}'`, C.decl); }
      }
    }
  }
  isKnownIface(n) { return /^I[A-Z]/.test(n) && ['IComparable', 'IEnumerable', 'IDisposable', 'IEquatable', 'ICloneable', 'IComparer', 'INotifyPropertyChanged'].includes(n); }
  allIfaces(C) { const out = new Set(); const add = I => { if (out.has(I)) return; out.add(I); if (!I.native) for (const x of I.ifaces) add(x); }; let c = C; while (c) { (c.ifaces || []).forEach(add); c = c.base; } return [...out]; }
  findBaseMethod(B, m) { while (B) { const l = B.methods.get(m.name); if (l) { const f = l.find(x => sig(x) === sig(m)); if (f) return f; } B = B.base; } return null; }
  findImpl(C, am, stopAt) { let c = C; while (c && c !== stopAt) { const l = c.methods.get(am.name); if (l && l.some(x => sig(x) === sig(am) && x.mods.has('override'))) return true; c = c.base; } return false; }
  findImplUp(C, im) { let c = C; while (c) { const l = c.methods.get(im.name); if (l && l.some(x => sig(x) === sig(im) && !x.isStatic)) return true; c = c.base; } return false; }
  findProp(C, n) { while (C) { const p = C.props && C.props.get(n); if (p) return p; C = C.base; } return null; }
  findField(C, n) { while (C) { const f = C.fields && C.fields.get(n); if (f) return f; C = C.base; } return null; }
  buildEnum(D) {
    const E = { name: D.name, kind: 'enum', members: [], byName: new Map(), decl: D };
    let next = 0; const sc = new Scope(null);
    for (const m of D.values) {
      let v = next;
      if (m.e) { const r = this.ev(m.e, { cls: null, self: null, sc }); v = r instanceof EnumVal ? r.v : num(r); }
      E.members.push({ name: m.name, v }); E.byName.set(m.name, v); sc.v.set(m.name, { t: { n: 'int' }, v: I(v) }); next = v + 1;
    }
    return E;
  }

  /* ===== type helpers ===== */
  resolveType(t, nd) {
    if (!t) return t;
    if (t.n === '[]') { this.resolveType(t.el, nd); return t; }
    if (t.n === '?') { this.resolveType(t.el, nd); return t; }
    if (t.a) t.a.forEach(x => this.resolveType(x, nd));
    if (CS.PRIMS.has(t.n) || t.n === 'var' || t.n === 'dynamic') return t;
    if (this.classes.has(t.n) || this.enums.has(t.n) || this.delegates.has(t.n)) return t;
    if (this.knownType(t.n)) return t;
    this.err('CS0246', `The type or namespace name '${t.n}' could not be found (are you missing a using directive or an assembly reference?)`, nd);
  }
  typeOf(v) {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'string') return 'string';
    if (typeof v === 'boolean') return 'bool';
    if (v instanceof N) return v.t;
    if (v instanceof Obj) return v.cls.name;
    if (v instanceof EnumVal) return v.e.name;
    if (v instanceof Arr) return tname(v.el) + '[' + ','.repeat(v.dims.length - 1) + ']';
    if (v instanceof Coll) return v.kind + (v.ta.length ? '<' + v.ta.map(tname).join(', ') + '>' : '');
    if (v instanceof Fn || v instanceof MRef || v instanceof Multi) return 'lambda expression';
    if (v instanceof KVP) return 'KeyValuePair';
    if (v && v.__host) return v.__type || 'object';
    return 'object';
  }
  isSub(cls, target) {
    if (!cls || !target) return false;
    let c = cls; while (c) { if (c === target) return true; if (this.allIfacesOf(c).includes(target)) return true; c = c.base; }
    return false;
  }
  allIfacesOf(c) { const out = []; const add = I => { if (out.includes(I)) return; out.push(I); if (!I.native) I.ifaces.forEach(add); }; (c.ifaces || []).forEach(add); return out; }
  defaultOf(t) {
    if (!t) return null;
    if (t.n === '?') return null;
    if (NUMS.has(t.n)) return mk(t.n, 0);
    if (t.n === 'bool') return false;
    if (this.enums.has(t.n)) return new EnumVal(this.enums.get(t.n), 0);
    const C = this.classes.get(t.n);
    if (C && C.isStruct) return this.newStructDefault(C);
    if (t.n === 'KeyValuePair' || t.n === 'DateTime' || t.n === 'TimeSpan') return null;
    return null;
  }
  newStructDefault(C) { const o = new Obj(C); this.initFieldDefaults(o, C); return o; }
  cloneV(v) {
    if (v instanceof Obj && v.cls.isStruct) { const o = new Obj(v.cls); for (const k in v.f) o.f[k] = this.cloneV(v.f[k]); return o; }
    return v;
  }

  /* ===== conversions ===== */
  // returns converted value; on failure throws a compile error (implicit) or InvalidCastException (explicit), or returns NOPE when test=true
  conv(v, t, explicit, nd, test) {
    const NOPE = Interp.NOPE;
    if (!t) return v;
    const n = t.n;
    const fail = (kind) => {
      if (test) return NOPE;
      const from = this.typeOf(v), to = tname(t);
      if (kind === 'null') this.err('CS0037', `Cannot convert null to '${to}' because it is a non-nullable value type`, nd);
      if (kind === 'lit') this.err('CS0664', `Literal of type double cannot be implicitly converted to type '${to}'; use an '${to === 'float' ? 'F' : 'M'}' suffix to create a literal of this type`, nd);
      if (kind === 'cast') this.throwEx('InvalidCastException', `Unable to cast object of type '${this.clrName(v)}' to type '${to}'.`, nd);
      if (explicit) this.err('CS0030', `Cannot convert type '${from}' to '${to}'`, nd);
      if (kind === 'explicitExists') this.err('CS0266', `Cannot implicitly convert type '${from}' to '${to}'. An explicit conversion exists (are you missing a cast?)`, nd);
      this.err('CS0029', `Cannot implicitly convert type '${from}' to '${to}'`, nd);
    };
    if (n === 'var' || n === 'dynamic') return this.cloneV(v);
    if (n === 'object') return this.cloneV(v);
    if (n === '?') { if (v === null) return null; return this.conv(v, t.el, explicit, nd, test); }
    if (v === undefined) return v;
    if (n === 'string') { if (v === null || typeof v === 'string') return v; return fail(v instanceof N || typeof v === 'boolean' ? 'x' : (explicit ? 'cast' : 'x')); }
    if (n === 'bool') { if (typeof v === 'boolean') return v; if (v === null) return fail('null'); return fail(); }
    if (NUMS.has(n)) {
      if (v instanceof N) {
        if (v.t === n) return v;
        if (IMPLICIT[v.t] && IMPLICIT[v.t].includes(n)) return n === 'decimal' ? mk('decimal', num(v), false, v.t === 'decimal' ? v.s : 0) : mk(n, BIG.has(n) && typeof v.v !== 'bigint' ? v.v : v.v);
        if (v.c && RANGE[n] && INTS.has(v.t) && v.t !== 'char' && n !== 'char' && num(v) >= RANGE[n][0] && num(v) <= RANGE[n][1]) return mk(n, num(v));
        if (v.c && n === 'ulong' && INTS.has(v.t) && num(v) >= 0) return mk(n, v.v);
        if (explicit) {
          if ((v.t === 'double' || v.t === 'float' || v.t === 'decimal') && INTS.has(n)) { if (!Number.isFinite(v.v)) return mk(n, 0); return mk(n, Math.trunc(v.v)); }
          return mk(n, v.v);
        }
        if (v.c && v.t === 'double' && (n === 'float' || n === 'decimal')) return fail('lit');
        return fail('explicitExists');
      }
      if (v instanceof EnumVal) { if (explicit) return mk(n, v.v); return fail('explicitExists'); }
      if (v === null) return fail('null');
      if (explicit && v instanceof Obj) return fail('cast');
      return fail();
    }
    if (n === '[]') {
      if (v === null) return null;
      if (v instanceof Arr) { if (!t.el || tname(v.el) === tname(t.el) || t.el.n === 'object' || this.refCompat(v.el, t.el)) return v; return fail(); }
      if (v && v.__coll) return v;
      return fail();
    }
    if (this.enums.has(n)) {
      if (v instanceof EnumVal) { if (v.e.name === n) return v; if (explicit) return new EnumVal(this.enums.get(n), v.v); return fail('explicitExists'); }
      if (v instanceof N && INTS.has(v.t)) { if (explicit || (v.c && num(v) === 0)) return new EnumVal(this.enums.get(n), num(v)); return fail('explicitExists'); }
      if (v === null) return fail('null');
      return fail();
    }
    const C = this.classes.get(n) || (this.nativeClass && this.nativeClass(n));
    if (C) {
      if (v === null) { if (C.isStruct) return fail('null'); return null; }
      if (v instanceof Obj) {
        if (this.isSub(v.cls, C)) return this.cloneV(v);
        if (explicit) return fail('cast');
        if (this.isSub(C, v.cls)) return fail('explicitExists');
        return fail();
      }
      if (v && v.__host) return v;
      if (C.isIface && (v instanceof N || typeof v === 'string') && C.native) return v;
      return fail();
    }
    if (this.delegates.has(n) || ['Func', 'Action', 'Predicate', 'Comparison', 'EventHandler', 'RoutedEventHandler', 'Delegate'].includes(n)) {
      if (v === null || v instanceof Fn || v instanceof MRef || v instanceof Multi) return v; return fail();
    }
    if (this.convBuiltin) { const r = this.convBuiltin(v, t, explicit); if (r !== NOPE) return r; if (test) return NOPE; return fail(); }
    return v;
  }
  refCompat(a, b) { const A = this.classes.get(a.n), B = this.classes.get(b.n); return A && B && this.isSub(A, B); }
  convScore(v, t) {
    // 0 = not applicable; higher is better
    if (!t) return 1;
    const r = this.conv(v, t, false, null, true);
    if (r === Interp.NOPE) return 0;
    if (t.n === 'object' || t.n === 'dynamic') return 2;
    const vt = this.typeOf(v);
    if (vt === tname(t)) return 10;
    if (v instanceof N && NUMS.has(t.n)) { const order = ['int', 'long', 'float', 'double', 'decimal']; return 8 - Math.max(0, order.indexOf(t.n)); }
    if (v instanceof Obj && this.classes.get(t.n)) { let d = 0, c = v.cls; while (c && c.name !== t.n) { c = c.base; d++; } return Math.max(3, 9 - d); }
    return 5;
  }
  clrName(v) {
    if (v instanceof N) return 'System.' + CLR[v.t];
    if (typeof v === 'string') return 'System.String';
    if (typeof v === 'boolean') return 'System.Boolean';
    if (v instanceof Obj) return (v.cls.ns ? v.cls.ns + '.' : '') + v.cls.name;
    if (v instanceof Arr) return 'System.' + (CLR[v.el.n] || v.el.n) + '[]';
    return this.typeOf(v);
  }

  /* ===== string conversion ===== */
  str(v, fmt, nd) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'boolean') return v ? 'True' : 'False';
    if (v instanceof N) {
      if (fmt && v.t !== 'char') { try { return fmtNum(v, fmt); } catch (e) { if (e instanceof FmtErr) this.throwEx('FormatException', 'Format specifier was invalid.', nd); throw e; } }
      return str0(v);
    }
    if (v instanceof EnumVal) { const m = v.e.members.find(x => x.v === v.v); return m ? m.name : String(v.v); }
    if (v instanceof Obj) {
      const m = this.findMethod(v.cls, 'ToString', 0);
      if (m && !m.native) return this.str(this.invoke(m, v, [], nd));
      if (v.cls.nativeToString) return v.cls.nativeToString.call(this, v);
      return this.clrName(v);
    }
    if (v instanceof Arr) return this.clrName(v);
    if (v instanceof Coll) return 'System.Collections.Generic.' + v.kind + '`' + (v.ta.length || 1) + '[' + v.ta.map(t => (CLR[t.n] ? 'System.' + CLR[t.n] : t.n)).join(',') + ']';
    if (v instanceof KVP) return '[' + this.str(v.Key) + ', ' + this.str(v.Value) + ']';
    if (v instanceof Tup) return '(' + v.items.map(x => this.str(x)).join(', ') + ')';
    if (v instanceof Fn || v instanceof MRef) return 'System.Func';
    if (v && v.__host && v.toStr) return v.toStr();
    if (v && v.__str) return v.__str();
    return String(v);
  }
  findMethod(C, name, argc) { let c = C; while (c) { const l = c.methods.get(name); if (l) { const m = l.find(x => x.params.length === argc && !x.isStatic); if (m) return m; } c = c.base; } return null; }

  /* ===== exceptions ===== */
  makeEx(clsName, msg, extra) {
    const C = this.nativeClass(clsName);
    const o = new Obj(C); o.f.Message = msg; o.f.InnerException = null;
    if (extra) Object.assign(o.f, extra);
    return o;
  }
  throwEx(clsName, msg, nd) { throw new CsThrow(this.makeEx(clsName, msg), nd ? nd.line : this.line); }

  /* ===== running ===== */
  run() {
    const U = this.U;
    const prog = { name: 'Program', kind: 'class', fields: new Map(), props: new Map(), methods: new Map(), ctors: [], ops: new Map(), sv: Object.create(null), sinit: true, base: null, ifaces: [], isStatic: true };
    this.progCls = prog;
    if (U.top.length) {
      const sc = new Scope(null);
      sc.v.set('args', { t: { n: '[]', el: { n: 'string' } }, v: new Arr({ n: 'string' }, []) });
      const fr = { cls: prog, self: null, sc, top: true, m: { name: '<Main>$' } };
      const c = this.execBlock(U.top, fr, sc, true);
      return;
    }
    let main = null;
    for (const [, C] of this.classes) { const l = C.methods.get('Main'); if (l) { const m = l.find(x => x.isStatic); if (m) { main = m; break; } else if (!main) main = l[0]; } }
    if (!main) this.err('CS5001', 'Program does not contain a static \'Main\' method suitable for an entry point', { line: 1, col: 1 });
    if (!main.isStatic) this.err('CS5001', 'Program does not contain a static \'Main\' method suitable for an entry point', main);
    this.ensureStatic(main.cls);
    this.invoke(main, null, main.params.length ? [new Arr({ n: 'string' }, [])] : [], main);
  }
  ensureStatic(C) {
    if (!C || C.sinit || C.native) return; C.sinit = true;
    if (C.base) this.ensureStatic(C.base);
    const fr = { cls: C, self: null, sc: new Scope(null), isCtor: true, sctor: true };
    for (const [, f] of C.fields) if (f.isStatic) C.sv[f.name] = this.defaultOf(this.resolveType(f.type, f));
    for (const [, p] of C.props) if (p.isStatic && p.auto) C.sv['#' + p.name] = this.defaultOf(this.resolveType(p.type, p));
    for (const m of C.decl.members) {
      if (m.k === 'Field' && m.isStatic && m.init) C.sv[m.name] = this.conv(this.ev(m.init, fr, m.type), m.type, false, m.init);
      if (m.k === 'Prop' && m.isStatic && m.auto && m.init) C.sv['#' + m.name] = this.conv(this.ev(m.init, fr, m.type), m.type, false, m.init);
    }
    if (C.sctor) this.invoke(C.sctor, null, [], C.sctor);
  }

  /* ===== statements ===== */
  hoist(stmts, fr, sc) {
    for (const s of stmts) if (s.k === 'LocalFunc') {
      const m = s.m; m.cls = fr.cls;
      if (sc.v.has(m.name)) this.err('CS0128', `A local variable or function named '${m.name}' is already defined in this scope`, s);
      sc.v.set(m.name, { t: { n: 'Delegate' }, v: new Fn(m.params, null, sc, fr, m), fn: true, ro: 'fn' });
    }
  }
  execBlock(stmts, fr, sc, already) {
    const prevSc = fr.sc;
    if (!already) { sc = new Scope(fr.sc); }
    fr.sc = sc;
    try {
      this.hoist(stmts, fr, sc);
      for (const s of stmts) { const c = this.exec(s, fr); if (c) return c; }
    } finally { fr.sc = prevSc; }
    return undefined;
  }
  declare(fr, name, entry, nd) {
    if (fr.sc.v.has(name)) this.err('CS0128', `A local variable or function named '${name}' is already defined in this scope`, nd);
    fr.sc.v.set(name, entry);
  }
  exec(s, fr) {
    this.tick(s);
    switch (s.k) {
      case 'Block': return this.execBlock(s.stmts, fr);
      case 'Empty': case 'LocalFunc': return;
      case 'ExprStmt': this.ev(s.e, fr); return;
      case 'Decl': {
        const isVar = s.type.n === 'var';
        if (!isVar) this.resolveType(s.type, s);
        for (const d of s.decls) {
          let v, t = s.type;
          if (d.init) {
            v = this.ev(d.init, fr, isVar ? null : t);
            if (isVar) {
              if (v === null) this.err('CS0815', 'Cannot assign <null> to an implicitly-typed variable', d);
              if (v instanceof Fn) this.err('CS8917', 'The delegate type could not be inferred.', d);
              t = this.typeDesc(v); v = this.cloneV(v);
            } else v = this.conv(v, t, false, d.init);
            if (v instanceof N && v.c && !s.isConst) v = new N(v.t, v.v, false, v.s);
          } else {
            if (isVar) this.err('CS0818', 'Implicitly-typed variables must be initialized', d);
            if (s.isConst) this.err('CS0145', 'A const field requires a value to be provided', d);
          }
          this.declare(fr, d.name, d.init ? { t, v, ro: s.isConst ? 'const' : null } : { t, v: this.defaultOf(t), un: true }, d);
          if (s.isUsing && v) (fr.usings || (fr.usings = [])).push(v);
        }
        return;
      }
      case 'If': { const c = this.cond(s.c, fr); if (c) return this.execSub(s.a, fr); if (s.b) return this.execSub(s.b, fr); return; }
      case 'While': {
        for (;;) { this.tick(s); if (!this.cond(s.c, fr)) break; const c = this.execSub(s.body, fr); if (c === BRK) break; if (c === CNT) continue; if (c) return c; }
        return;
      }
      case 'Do': {
        for (;;) { this.tick(s); const c = this.execSub(s.body, fr); if (c === BRK) break; if (c && c !== CNT) return c; if (!this.cond(s.c, fr)) break; }
        return;
      }
      case 'For': {
        const prev = fr.sc; fr.sc = new Scope(prev);
        try {
          for (const st of s.init) this.exec(st, fr);
          for (;;) {
            this.tick(s);
            if (s.c && !this.cond(s.c, fr)) break;
            const c = this.execSub(s.body, fr);
            if (c === BRK) break; if (c && c !== CNT) return c;
            for (const e of s.it) this.ev(e, fr);
          }
        } finally { fr.sc = prev; }
        return;
      }
      case 'Foreach': {
        const coll = this.ev(s.coll, fr);
        if (coll === null) this.throwEx('NullReferenceException', 'Object reference not set to an instance of an object.', s.coll);
        const isVar = s.type.n === 'var'; if (!isVar) this.resolveType(s.type, s);
        const it = this.iter(coll, s.coll);
        const prev = fr.sc;
        try {
          for (const x of it) {
            this.tick(s);
            fr.sc = new Scope(prev);
            const v = isVar ? x : this.conv(x, s.type, true, s);
            fr.sc.v.set(s.name, { t: isVar ? this.typeDesc(x) : s.type, v: this.cloneV(v), ro: 'foreach' });
            const c = this.execSub(s.body, fr);
            fr.sc = prev;
            if (c === BRK) break; if (c && c !== CNT) return c;
          }
        } finally { fr.sc = prev; }
        return;
      }
      case 'Switch': {
        const v = this.ev(s.e, fr);
        let target = -1;
        outer: for (let k = 0; k < s.sections.length; k++) {
          for (const lb of s.sections[k].labels) {
            if (lb.k === 'default') continue;
            fr.sc = new Scope(fr.sc); // pattern vars
            const ok = this.match(v, lb.pat, fr, true) && (!lb.when || this.cond(lb.when, fr));
            if (ok) { target = k; s._sc = fr.sc; fr.sc = fr.sc.p; break outer; }
            fr.sc = fr.sc.p;
          }
        }
        if (target < 0) target = s.sections.findIndex(x => x.labels.some(l => l.k === 'default'));
        if (target < 0) return;
        const sec = s.sections[target];
        const prev = fr.sc; fr.sc = new Scope(s._sc || prev); s._sc = null;
        try {
          this.hoist(sec.body, fr, fr.sc);
          for (const st of sec.body) { const c = this.exec(st, fr); if (c === BRK) return; if (c) return c; }
        } finally { fr.sc = prev; }
        return;
      }
      case 'Break': return BRK;
      case 'Continue': return CNT;
      case 'Return': {
        if (s.e) { if (fr.m && fr.m.ret && fr.m.ret.n === 'void' && !fr.lambda) this.err('CS0127', `Since '${fr.cls ? fr.cls.name + '.' : ''}${fr.m.name}(${(fr.m.params || []).map(p => tname(p.type)).join(', ')})' returns void, a return keyword must not be followed by an object expression`, s); return { k: 'ret', v: this.ev(s.e, fr, fr.m && fr.m.ret) }; }
        if (fr.m && fr.m.ret && fr.m.ret.n !== 'void' && !fr.lambda && !fr.top) this.err('CS0126', `An object of a type convertible to '${tname(fr.m.ret)}' is required`, s);
        return { k: 'ret', v: undefined };
      }
      case 'Throw': {
        if (!s.e) { if (!fr.catching) this.err('CS0156', 'A throw statement with no arguments is not allowed outside of a catch clause', s); throw fr.catching; }
        const ex = this.ev(s.e, fr);
        if (ex === null) this.throwEx('NullReferenceException', 'Object reference not set to an instance of an object.', s);
        if (!(ex instanceof Obj) || !this.isSub(ex.cls, this.nativeClass('Exception'))) this.err('CS0155', 'The type caught or thrown must be derived from System.Exception', s.e);
        throw new CsThrow(ex, s.line);
      }
      case 'Try': {
        let res, pending = null;
        try {
          res = this.execBlock(s.body.stmts, fr);
        } catch (e) {
          if (!(e instanceof CsThrow)) {
            if (isStackErr(e)) throw new StackOverflow(this.line);
            throw e;
          }
          let handled = false;
          for (const c of s.catches) {
            let ok = true;
            if (c.type) { const C = this.nativeClass(c.type.n) || this.classes.get(c.type.n); if (!C) this.resolveType(c.type, c); ok = this.isSub(e.ex.cls, C); }
            if (!ok) continue;
            const prev = fr.sc; fr.sc = new Scope(prev);
            if (c.name) fr.sc.v.set(c.name, { t: c.type, v: e.ex });
            if (c.when && !this.cond(c.when, fr)) { fr.sc = prev; continue; }
            handled = true;
            const prevC = fr.catching; fr.catching = e;
            try { res = this.execBlock(c.body.stmts, fr); }
            catch (e2) { pending = e2; }
            finally { fr.catching = prevC; fr.sc = prev; }
            break;
          }
          if (!handled) pending = e;
        }
        if (s.fin) { const c = this.execBlock(s.fin.stmts, fr); if (c) return c; }
        if (pending) throw pending;
        return res;
      }
      case 'Using': {
        const prev = fr.sc; fr.sc = new Scope(prev);
        let res; const saved = fr.usings; fr.usings = [];
        try {
          if (s.d) this.exec(s.d, fr); else if (s.e) fr.usings.push(this.ev(s.e, fr));
          res = this.execSub(s.body, fr);
        } finally { for (const u of fr.usings) this.dispose(u); fr.usings = saved; fr.sc = prev; }
        return res;
      }
    }
    this.err('CS0000', 'Unsupported statement ' + s.k, s);
  }
  dispose(u) { if (u && u.__dispose) u.__dispose(); else if (u instanceof Obj) { const m = this.findMethod(u.cls, 'Dispose', 0); if (m) this.invoke(m, u, [], null); } }
  execSub(s, fr) {
    if (s.k === 'Block') return this.execBlock(s.stmts, fr);
    // embedded statements get their own scope (pattern variables etc.)
    const prev = fr.sc; fr.sc = new Scope(prev);
    try { return this.exec(s, fr); } finally { fr.sc = prev; }
  }
  cond(e, fr) {
    const v = this.ev(e, fr);
    if (typeof v !== 'boolean') this.err('CS0029', `Cannot implicitly convert type '${this.typeOf(v)}' to 'bool'`, e);
    return v;
  }
  typeDesc(v) {
    if (v instanceof N) return { n: v.t };
    if (typeof v === 'string') return { n: 'string' };
    if (typeof v === 'boolean') return { n: 'bool' };
    if (v instanceof Obj) return { n: v.cls.name };
    if (v instanceof EnumVal) return { n: v.e.name };
    if (v instanceof Arr) return { n: '[]', el: v.el, r: v.dims.length };
    if (v instanceof Coll) return { n: v.kind, a: v.ta };
    return { n: 'var' };
  }

  /* ===== iteration ===== */
  *iter(v, nd) {
    if (typeof v === 'string') { for (const ch of v) yield mk('char', ch.charCodeAt(0)); return; }
    if (v instanceof Arr) { for (const x of v.a) yield x; return; }
    if (v instanceof Coll) {
      const ver = v.ver;
      const check = () => { if (v.ver !== ver) this.throwEx('InvalidOperationException', 'Collection was modified; enumeration operation may not execute.', nd); };
      if (v.kind === 'Dictionary') { for (const [, kv] of [...v.m]) { check(); yield new KVP(kv[0], kv[1]); } check(); return; }
      if (v.kind === 'HashSet') { for (const [, x] of [...v.m]) { check(); yield x; } check(); return; }
      if (v.kind === 'Stack') { const a = v.a.slice().reverse(); for (const x of a) { check(); yield x; } check(); return; }
      const a = v.a; for (let k = 0; k < a.length; k++) { check(); yield a[k]; } check(); return;
    }
    if (v && v.__iter) { yield* v.__iter(); return; }
    this.err('CS1579', `foreach statement cannot operate on variables of type '${this.typeOf(v)}' because '${this.typeOf(v)}' does not contain a public instance or extension definition for 'GetEnumerator'`, nd);
  }

  /* ===== patterns ===== */
  match(v, p, fr, decl) {
    switch (p.k) {
      case 'PatAny': return true;
      case 'PatVar': fr.sc.v.set(p.name, { t: this.typeDesc(v), v }); return true;
      case 'PatNot': return !this.match(v, p.p, fr, false);
      case 'PatAnd': return this.match(v, p.a, fr, decl) && this.match(v, p.b, fr, decl);
      case 'PatOr': return this.match(v, p.a, fr, false) || this.match(v, p.b, fr, false);
      case 'PatRel': { const r = this.ev(p.e, fr); if (!(v instanceof N)) return false; return this.binop(p.op, v, r, p); }
      case 'PatConst': { const c = this.ev(p.e, fr); if (c === null) return v === null; if (v === null) return false; return this.eq(v, c, p, true); }
      case 'PatType': { this.resolveType(p.type, p); if (!this.isType(v, p.type)) return false; fr.sc.v.set(p.name, { t: p.type, v: this.conv(v, p.type, true, p) }); return true; }
      case 'PatTypeOrConst': {
        const n = p.type.n;
        if (!p.type.a && !this.classes.has(n) && !CS.PRIMS.has(n) && !this.knownType(n) && !this.enums.has(n)) { const c = this.ev(p.e, fr); if (c === null) return v === null; if (v === null) return false; return this.eq(v, c, p, true); }
        if (p.e.k === 'Member' && !this.classes.has(n)) { const c = this.ev(p.e, fr); if (!(c instanceof TypeVal)) return v !== null && this.eq(v, c, p, true); }
        return this.isType(v, p.type);
      }
    }
    return false;
  }
  isType(v, t) {
    if (v === null || v === undefined) return false;
    const n = t.n;
    if (n === 'object' || n === 'var') return true;
    if (n === '?') return this.isType(v, t.el);
    if (n === 'string') return typeof v === 'string';
    if (n === 'bool') return typeof v === 'boolean';
    if (NUMS.has(n)) return v instanceof N && v.t === n;
    if (this.enums.has(n)) return v instanceof EnumVal && v.e.name === n;
    const C = this.classes.get(n) || (this.nativeClass && this.nativeClass(n));
    if (C) return v instanceof Obj && this.isSub(v.cls, C);
    if (n === '[]') return v instanceof Arr;
    if (v instanceof Coll) return v.kind === n || ['IEnumerable', 'IList', 'ICollection'].includes(n);
    return false;
  }

  /* ===== expressions ===== */
  ev(e, fr, expect) {
    switch (e.k) {
      case 'Lit':
        if (e.num) { const x = e.num; return x.k === 'decimal' ? mk('decimal', x.v, true, x.scale) : new N(x.k, x.k === 'float' ? Math.fround(x.v) : x.v, true); }
        if (e.chr !== undefined) return new N('char', e.chr.charCodeAt(0), true);
        return e.v;
      case 'Paren': return this.ev(e.e, fr, expect);
      case 'Name': return this.evName(e, fr);
      case 'This': if (!fr.self) this.err('CS0026', 'Keyword \'this\' is not valid in a static property, static method, or static field initializer', e); return fr.self;
      case 'Base': this.err('CS0175', 'Use of keyword \'base\' is not valid in this context', e);
      case 'Interp': {
        let s = '';
        for (const p of e.parts) {
          if (typeof p === 'string') { s += p; continue; }
          const v = this.ev(p.e, fr);
          let t = this.str(v, p.fmt, p.e);
          if (p.fmt && v instanceof Obj) t = this.str(v);
          if (p.align) { const w = num(this.ev(p.align, fr)); t = w < 0 ? t.padEnd(-w) : t.padStart(w); }
          s += t;
        }
        return s;
      }
      case 'Member': return this.evMember(e, fr);
      case 'Call': return this.evCall(e, fr);
      case 'Index': return this.evIndex(e, fr);
      case 'Assign': return this.evAssign(e, fr);
      case 'Bin': {
        if (e.op === '&&') { const a = this.ev(e.l, fr); this.needBool(a, e.l, '&&'); if (!a) return false; const b = this.ev(e.r, fr); this.needBool(b, e.r, '&&'); return b; }
        if (e.op === '||') { const a = this.ev(e.l, fr); this.needBool(a, e.l, '||'); if (a) return true; const b = this.ev(e.r, fr); this.needBool(b, e.r, '||'); return b; }
        if (e.op === '??') { const a = this.ev(e.l, fr); if (a !== null && a !== undefined) return a; return this.ev(e.r, fr, expect); }
        const a = this.ev(e.l, fr), b = this.ev(e.r, fr);
        return this.binop(e.op, a, b, e);
      }
      case 'Un': {
        const v = this.ev(e.e, fr);
        if (e.op === '!') { if (typeof v !== 'boolean') this.err('CS0023', `Operator '!' cannot be applied to operand of type '${this.typeOf(v)}'`, e); return !v; }
        if (v instanceof Obj) { const r = this.userOp('op_' + e.op, [v], e); if (r !== Interp.NOPE) return r; }
        if (!(v instanceof N)) this.err('CS0023', `Operator '${e.op}' cannot be applied to operand of type '${this.typeOf(v)}'`, e);
        let t = v.t; if (['byte', 'sbyte', 'short', 'ushort', 'char'].includes(t)) t = 'int';
        if (e.op === '+') return mk(t, v.v, v.c, v.s);
        if (e.op === '-') { if (t === 'ulong') this.err('CS0023', 'Operator \'-\' cannot be applied to operand of type \'ulong\'', e); if (t === 'uint') t = 'long'; return mk(t, typeof v.v === 'bigint' ? -v.v : (BIG.has(t) ? -BigInt(v.v) : -v.v), v.c, v.s); }
        if (e.op === '~') { if (!INTS.has(t)) this.err('CS0023', `Operator '~' cannot be applied to operand of type '${v.t}'`, e); return mk(t, typeof v.v === 'bigint' ? ~v.v : ~v.v, v.c); }
        break;
      }
      case 'PreInc': case 'PostInc': {
        const r = this.lval(e.e, fr);
        const old = r.get();
        let nv;
        if (old instanceof N) { nv = this.binop(e.op === '++' ? '+' : '-', old, I(1), e); nv = mk(old.t, nv.v, false, old.s); }
        else if (old instanceof EnumVal) nv = new EnumVal(old.e, old.v + (e.op === '++' ? 1 : -1));
        else if (old instanceof Obj) { const u = this.userOp('op_' + e.op, [old], e); if (u === Interp.NOPE) this.err('CS0023', `Operator '${e.op}' cannot be applied to operand of type '${this.typeOf(old)}'`, e); nv = u; }
        else this.err('CS0023', `Operator '${e.op}' cannot be applied to operand of type '${this.typeOf(old)}'`, e);
        r.set(nv);
        return e.k === 'PreInc' ? nv : old;
      }
      case 'Cond': {
        const c = this.cond(e.c, fr);
        const v = c ? this.ev(e.a, fr, expect) : this.ev(e.b, fr, expect);
        // numeric branches promote (e.g. true ? 1 : 2.5 -> double)
        return v;
      }
      case 'Cast': {
        this.resolveType(e.type, e);
        const v = this.ev(e.e, fr, e.type);
        if (v instanceof Obj && this.classes.get(e.type.n) === undefined && NUMS.has(e.type.n)) this.err('CS0030', `Cannot convert type '${this.typeOf(v)}' to '${tname(e.type)}'`, e);
        return this.conv(v, e.type, true, e);
      }
      case 'Is': { const v = this.ev(e.e, fr); return this.match(v, e.pat, fr, true); }
      case 'As': { this.resolveType(e.type, e); const v = this.ev(e.e, fr); if (NUMS.has(e.type.n) || e.type.n === 'bool') this.err('CS0077', `The as operator must be used with a reference type or nullable type ('${tname(e.type)}' is a non-nullable value type)`, e); return this.isType(v, e.type) ? v : null; }
      case 'Lambda': return new Fn(e.params, e.body, fr.sc, fr, null);
      case 'New': return this.evNew(e, fr, expect);
      case 'NewArr': return this.evNewArr(e, fr, expect);
      case 'ArrInit': {
        if (!expect || expect.n === 'var') this.err('CS0820', 'Cannot initialize an implicitly-typed variable with an array initializer', e);
        if (expect.n !== '[]') this.err('CS0622', 'Can only use array initializer expressions to assign to array types. Try using a new expression instead.', e);
        return this.arrFromInit(expect.el, expect.r || 1, e, fr);
      }
      case 'CollExpr': {
        const items = []; for (const it of e.items) { if (it.k === 'Spread') { for (const x of this.iter(this.ev(it.e, fr), it)) items.push(x); } else items.push(this.ev(it, fr, expect && (expect.el || (expect.a && expect.a[0])))); }
        if (!expect || expect.n === 'var') this.err('CS9176', 'There is no target type for the collection expression.', e);
        if (expect.n === '[]') return new Arr(expect.el, items.map(x => this.conv(x, expect.el, false, e)));
        if (['List', 'IList', 'IEnumerable', 'ICollection'].includes(expect.n)) { const c = new Coll('List', expect.a); c.a = items.map(x => this.conv(x, expect.a[0], false, e)); return c; }
        if (expect.n === 'HashSet' || expect.n === 'Queue' || expect.n === 'Stack') { const c = this.newBuiltin({ n: expect.n, a: expect.a }, [], e); for (const x of items) this.callBuiltinInst(c, expect.n === 'Queue' ? 'Enqueue' : expect.n === 'Stack' ? 'Push' : 'Add', [x], e, fr); return c; }
        this.err('CS9174', `Cannot initialize type '${tname(expect)}' with a collection expression because the type is not constructible.`, e);
      }
      case 'TypeOf': this.resolveType(e.type, e); return new TypeObj(e.type, this.classes.get(e.type.n) || this.enums.get(e.type.n));
      case 'TypeRef': return new TypeVal(e.type, null);
      case 'Default': { const t = e.type || expect; if (!t) return null; this.resolveType(t, e); return this.defaultOf(t); }
      case 'Throw': { const ex = this.ev(e.e, fr); throw new CsThrow(ex, e.line); }
      case 'SwitchExpr': {
        const v = this.ev(e.e, fr);
        for (const arm of e.arms) {
          const prev = fr.sc; fr.sc = new Scope(prev);
          try {
            if (this.match(v, arm.pat, fr, true) && (!arm.when || this.cond(arm.when, fr))) return this.ev(arm.e, fr, expect);
          } finally { fr.sc = prev; }
        }
        this.throwEx('SwitchExpressionException', `Non-exhaustive switch expression failed to match its input.`, e);
      }
      case 'Tuple': return new Tup(e.items.map(x => this.ev(x, fr)));
      case 'FromEnd': { const v = this.ev(e.e, fr); return { fromEnd: num(v) }; }
    }
    this.err('CS0000', 'Unsupported expression ' + e.k, e);
  }
  needBool(v, nd, op) { if (typeof v !== 'boolean') this.err('CS0019', `Operator '${op}' cannot be applied to operands of type '${this.typeOf(v)}' and 'bool'`, nd); }

  /* ----- names ----- */
  evName(e, fr) {
    const n = e.n;
    const en = fr.sc.find(n);
    if (en) {
      if (en.ref) return en.ref.get();
      if (en.un) this.err('CS0165', `Use of unassigned local variable '${n}'`, e);
      return en.v;
    }
    const r = this.classMember(fr.cls, n, fr, e);
    if (r !== Interp.NOPE) return r;
    if (fr.outer) { const r2 = this.classMember(fr.outer, n, fr, e); if (r2 !== Interp.NOPE) return r2; }
    const tv = this.typeByName(n);
    if (tv) return tv;
    for (const st of this.statics) { const v = this.getStaticMember(st, n, e, fr, true); if (v !== Interp.NOPE) return v; }
    if (this.host && this.host.global) { const hv = this.host.global(n); if (hv !== undefined) return hv; }
    if (['System', 'Collections', 'Generic', 'Linq', 'IO', 'Text', 'Windows', 'Controls', 'Media', 'Threading', 'Tasks', 'Input', 'Shapes', 'Data', 'Globalization', 'Animation', 'Media3D', 'Navigation', 'Documents', 'ObjectModel', 'Diagnostics'].includes(n)) return new NS(n);
    this.err('CS0103', `The name '${n}' does not exist in the current context`, e);
  }
  typeByName(n) {
    if (this.classes.has(n)) { const C = this.classes.get(n); return new TypeVal({ n }, C); }
    if (this.enums.has(n)) return new TypeVal({ n }, this.enums.get(n));
    if (this.knownType(n)) return new TypeVal({ n }, this.nativeClass(n) || null);
    return null;
  }
  // field / property / method-group of the current class (static or instance)
  classMember(C, n, fr, nd) {
    let c = C;
    while (c) {
      if (c.native) { if (fr.self && c.nget && c.nget[n]) return c.nget[n].call(this, fr.self); if (fr.self && fr.self.__host) break; c = c.base; continue; }
      const f = c.fields.get(n);
      if (f) {
        if (f.isStatic) { this.ensureStatic(c); return c.sv[n]; }
        if (!fr.self) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${c.name}.${n}'`, nd);
        return fr.self.f[n];
      }
      const p = c.props.get(n);
      if (p) {
        if (!p.isStatic && !fr.self) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${c.name}.${n}'`, nd);
        return this.getProp(fr.self && !p.isStatic ? fr.self : null, p, nd, fr, true);
      }
      const ms = c.methods.get(n);
      if (ms) return new MRef(fr.self, this.methodsByName(C, n), n);
      c = c.base;
    }
    if (fr.self && fr.self.__host) { const hv = fr.self.__get(n); if (hv !== undefined) return hv; }
    if (C && C.hostBase && fr.self) { const hv = this.hostMember(fr.self, n); if (hv !== undefined) return hv; }
    return Interp.NOPE;
  }
  methodsByName(C, n) {
    // collect overloads walking up, skipping overridden duplicates
    const out = []; const seen = new Set(); let c = C;
    while (c) { if (!c.native) { const l = c.methods.get(n); if (l) for (const m of l) { const s = sig(m); if (!seen.has(s)) { seen.add(s); out.push(m); } } } c = c.base; }
    return out;
  }
  getProp(self, p, nd, fr, inside) {
    if (p.get === null && p.set) this.err('CS0154', `The property or indexer '${p.cls.name}.${p.name}' cannot be used in this context because it lacks the get accessor`, nd);
    if (!inside && p.get && p.get.access === 'private' && fr.cls !== p.cls) this.err('CS0271', `The property or indexer '${p.cls.name}.${p.name}' cannot be used in this context because the get accessor is inaccessible`, nd);
    if (p.abstract) { /* interface prop – resolve on runtime object */ }
    if (self && (p.mods.has('virtual') || p.mods.has('abstract') || p.mods.has('override') || p.abstract)) {
      const q = this.findProp(self.cls, p.name); if (q && q !== p) p = q;
    }
    if (p.auto || (p.get && p.get.auto)) { if (p.isStatic) { this.ensureStatic(p.cls); return p.cls.sv['#' + p.name]; } return self.f['#' + p.name]; }
    const acc = p.get;
    const pseudo = { name: 'get_' + p.name, params: [], ret: p.type, body: acc.body, exprBody: acc.exprBody, cls: p.cls, isStatic: p.isStatic };
    return this.invoke(pseudo, p.isStatic ? null : self, [], nd);
  }
  setProp(self, p, v, nd, fr) {
    if (self && (p.mods.has('virtual') || p.mods.has('abstract') || p.mods.has('override') || p.abstract)) { const q = this.findProp(self.cls, p.name); if (q && q !== p) p = q; }
    if (!p.set) {
      if (p.auto && fr && fr.isCtor && fr.cls === p.cls) { /* get-only auto prop assignable in ctor */ }
      else this.err('CS0200', `Property or indexer '${p.cls.name}.${p.name}' cannot be assigned to -- it is read only`, nd);
    } else if (p.set.access === 'private' && fr.cls !== p.cls) this.err('CS0272', `The property or indexer '${p.cls.name}.${p.name}' cannot be used in this context because the set accessor is inaccessible`, nd);
    else if (p.set.access === 'protected' && !this.isSub(fr.cls, p.cls)) this.err('CS0272', `The property or indexer '${p.cls.name}.${p.name}' cannot be used in this context because the set accessor is inaccessible`, nd);
    v = this.conv(v, p.type, false, nd);
    if (p.auto && (!p.set || p.set.auto)) { if (p.isStatic) { this.ensureStatic(p.cls); p.cls.sv['#' + p.name] = v; } else self.f['#' + p.name] = v; return; }
    const pseudo = { name: 'set_' + p.name, params: [{ name: 'value', type: p.type }], ret: { n: 'void' }, body: p.set.body, exprBody: p.set.exprBody, cls: p.cls, isStatic: p.isStatic, isSetter: true };
    this.invoke(pseudo, p.isStatic ? null : self, [v], nd);
  }
  canAccess(m, fr) {
    const a = m.access;
    if (a === 'public' || a === 'internal' || !a) return true;
    if (!fr.cls) return false;
    if (a === 'private') { let c = fr.cls; while (c) { if (c === m.cls) return true; c = c.outerCls; } return fr.cls === m.cls || (fr.cls.decl && m.cls.decl && this.isNested(fr.cls, m.cls)); }
    if (a === 'protected') return this.isSub(fr.cls, m.cls);
    return true;
  }
  isNested(inner, outer) { return outer.decl.members.some(x => x.k === 'Nested' && x.decl === inner.decl); }
  accessErr(m, nd) { this.err('CS0122', `'${m.cls.name}.${m.name}' is inaccessible due to its protection level`, nd); }

  /* ----- members ----- */
  evTarget(e, fr) {
    // evaluates the object part of a member access; returns {v, sc: staticClass}
    if (e.k === 'Base') { if (!fr.self) this.err('CS1511', 'Keyword \'base\' is not available in a static method', e); return { v: fr.self, base: true, sc: fr.cls.base }; }
    if (e.k === 'Name') {
      const en = fr.sc.find(e.n);
      if (en) { const v = en.ref ? en.ref.get() : (en.un ? this.err('CS0165', `Use of unassigned local variable '${e.n}'`, e) : en.v); return { v, sc: this.classes.get(en.t && en.t.n) }; }
      const f = this.findField(fr.cls, e.n); const v = this.evName(e, fr);
      return { v, sc: f ? this.classes.get(f.type.n) : (this.findProp(fr.cls, e.n) ? this.classes.get(this.findProp(fr.cls, e.n).type.n) : null) };
    }
    if (e.k === 'This') return { v: this.ev(e, fr), sc: fr.cls };
    if (e.k === 'Cast') return { v: this.ev(e, fr), sc: this.classes.get(e.type.n) };
    const v = this.ev(e, fr);
    return { v, sc: null };
  }
  evMember(e, fr) {
    const T = this.evTarget(e.obj, fr);
    const o = T.v;
    if (e.nc && (o === null || o === undefined)) return null;
    return this.getMember(o, e.n, e, fr, T);
  }
  getMember(o, n, e, fr, T) {
    if (o instanceof NS) { const tv = this.typeByName(n); if (tv) return tv; return new NS(n); }
    if (o instanceof TypeVal) return this.getStaticMember(o.ty.n, n, e, fr);
    if (n === 'HasValue' && (o === null || o instanceof N || typeof o === 'boolean' || o instanceof EnumVal || (o instanceof Obj && o.cls.isStruct))) return o !== null && o !== undefined;
    if (n === 'Value' && (o === null || o instanceof N || typeof o === 'boolean' || o instanceof EnumVal)) { if (o === null) this.throwEx('InvalidOperationException', 'Nullable object must have a value.', e); return o; }
    if (o === null || o === undefined) this.throwEx('NullReferenceException', 'Object reference not set to an instance of an object.', e);
    if (o instanceof Obj && !o.cls.native) {
      const C = (T && T.base) ? T.sc : o.cls;
      const f = this.findField(C, n);
      if (f) { if (!this.canAccess(f, fr)) this.accessErr(f, e); if (f.isStatic) this.err('CS0176', `Member '${f.cls.name}.${n}' cannot be accessed with an instance reference; qualify it with a type name instead`, e); return o.f[n]; }
      let p = this.findProp(C, n);
      if (p) { if (!this.canAccess(p, fr)) this.accessErr(p, e); if (T && T.base) return this.getPropNV(o, p, e, fr); return this.getProp(o, p, e, fr); }
      const ms = this.methodsByName(C, n); if (ms.length) return new MRef(o, ms, n);
    }
    if (o instanceof Obj) { let c = o.cls; while (c) { if (c.nget && c.nget[n]) return c.nget[n].call(this, o); c = c.base; } }
    return this.getBuiltinMember(o, n, e, fr);
  }
  getPropNV(o, p, e, fr) { // non-virtual (base.Prop)
    if (p.auto) return o.f['#' + p.name];
    const pseudo = { name: 'get_' + p.name, params: [], ret: p.type, body: p.get.body, exprBody: p.get.exprBody, cls: p.cls };
    return this.invoke(pseudo, o, [], e);
  }
  getStaticMember(tn, n, e, fr, soft) {
    const C = this.classes.get(tn);
    if (C) {
      let c = C;
      while (c) {
        const f = c.fields.get(n);
        if (f) { if (!f.isStatic) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${c.name}.${n}'`, e); if (!this.canAccess(f, fr)) this.accessErr(f, e); this.ensureStatic(c); return c.sv[n]; }
        const p = c.props.get(n);
        if (p) { if (!p.isStatic) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${c.name}.${n}'`, e); if (!this.canAccess(p, fr)) this.accessErr(p, e); return this.getProp(null, p, e, fr); }
        if (c.methods.get(n)) return new MRef(null, this.methodsByName(C, n), n);
        c = c.base;
      }
      for (const m of C.decl.members) if (m.k === 'Nested' && m.decl.name === n) return this.typeByName(n);
      if (soft) return Interp.NOPE;
      this.err('CS0117', `'${tn}' does not contain a definition for '${n}'`, e);
    }
    const E = this.enums.get(tn);
    if (E) { if (E.byName.has(n)) return new EnumVal(E, E.byName.get(n)); if (soft) return Interp.NOPE; this.err('CS0117', `'${tn}' does not contain a definition for '${n}'`, e); }
    return this.getBuiltinStatic(tn, n, e, fr, soft);
  }

  /* ----- calls ----- */
  evArgs(args, fr) {
    return args.map(a => {
      if (a.decl) {
        const t = a.decl.type; if (t.n !== 'var') this.resolveType(t, a.decl);
        const en = { t, v: this.defaultOf(t), un: true }; this.declare(fr, a.decl.name, en, a.decl);
        return new Ref(() => en.v, v => { en.v = t.n === 'var' ? v : this.conv(v, t, false, a.decl); if (t.n === 'var') en.t = this.typeDesc(v); en.un = false; }, t);
      }
      if (a.mod === 'ref' || a.mod === 'out') { const r = this.lval(a.e, fr, a.mod === 'out'); r.mod = a.mod; return r; }
      return this.ev(a.e, fr);
    });
  }
  evCall(e, fr) {
    this.tick(e);
    const fn = e.fn;
    if (fn.k === 'Name') {
      const en = fr.sc.find(fn.n);
      if (en) { const f = en.ref ? en.ref.get() : en.v; if (en.un) this.err('CS0165', `Use of unassigned local variable '${fn.n}'`, fn); return this.callDelegate(f, this.evArgs(e.args, fr), e, fn.n); }
      // methods of current class
      let C = fr.cls; let ms = C ? this.methodsByName(C, fn.n) : [];
      if (!ms.length && fr.outer) { C = fr.outer; ms = this.methodsByName(C, fn.n); }
      if (ms.length) {
        const args = this.evArgs(e.args, fr);
        const m = this.pick(ms, args, e, fn.n, C);
        if (!m.isStatic && !fr.self) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${m.cls.name}.${m.name}(${m.params.map(p => tname(p.type)).join(', ')})'`, fn);
        const self = m.isStatic ? null : fr.self;
        return this.invokeVirtual(m, self, args, e, false);
      }
      // delegate-typed field/property of current class
      if (C) { const r = this.classMember(C, fn.n, fr, fn); if (r !== Interp.NOPE) return this.callDelegate(r, this.evArgs(e.args, fr), e, fn.n); }
      if (this.host && this.host.global) { const hv = this.host.global(fn.n); if (typeof hv === 'function') return hv(this.evArgs(e.args, fr), e); }
      for (const st of this.statics) { const r = this.callStatic(st, fn.n, this.evArgs(e.args, fr), e, fr, true); if (r !== Interp.NOPE) return r; }
      if (fr.self && ['GetType', 'ToString', 'Equals', 'GetHashCode', 'MemberwiseClone'].includes(fn.n)) return this.callBuiltinInst(fr.self, fn.n, this.evArgs(e.args, fr), e, fr);
      if (fr.self && fr.self.__host) return fr.self.__call(fn.n, this.evArgs(e.args, fr), e);
      if (fr.cls && fr.cls.hostBase && fr.self) { const r = this.hostCall(fr.self, fn.n, this.evArgs(e.args, fr), e); if (r !== Interp.NOPE) return r; }
      this.err('CS0103', `The name '${fn.n}' does not exist in the current context`, fn);
    }
    if (fn.k === 'Member') {
      const T = this.evTarget(fn.obj, fr);
      const o = T.v;
      if (fn.nc && (o === null || o === undefined)) return null;
      const args = this.evArgs(e.args, fr);
      if (o instanceof TypeVal) return this.callStatic(o.ty.n, fn.n, args, fn, fr, false, fn.targs);
      if (o instanceof NS) this.err('CS0234', `The type or namespace name '${fn.n}' does not exist in the namespace '${o.n}' (are you missing an assembly reference?)`, fn);
      if (o === null || o === undefined) this.throwEx('NullReferenceException', 'Object reference not set to an instance of an object.', fn);
      return this.callMethod(o, fn.n, args, fn, fr, T);
    }
    // calling an expression result (delegate)
    const f = this.ev(fn, fr);
    return this.callDelegate(f, this.evArgs(e.args, fr), e);
  }
  callMethod(o, n, args, nd, fr, T) {
    if (o instanceof Obj && !o.cls.native) {
      const SC = T && T.sc ? T.sc : o.cls;
      let ms = this.methodsByName(SC, n);
      if (!ms.length && SC !== o.cls) ms = this.methodsByName(o.cls, n);
      if (ms.length) {
        const m = this.pick(ms, args, nd, n, SC);
        if (!this.canAccess(m, fr)) this.err('CS0122', `'${m.cls.name}.${m.name}(${m.params.map(p => tname(p.type)).join(', ')})' is inaccessible due to its protection level`, nd);
        if (m.isStatic) this.err('CS0176', `Member '${m.cls.name}.${m.name}(${m.params.map(p => tname(p.type)).join(', ')})' cannot be accessed with an instance reference; qualify it with a type name instead`, nd);
        return this.invokeVirtual(m, o, args, nd, T && T.base);
      }
      // delegate field / property
      const f = this.findField(o.cls, n); if (f && f.type && (f.isEvent || /^(Func|Action|Predicate)/.test(f.type.n) || this.delegates.has(f.type.n))) return this.callDelegate(o.f[n], args, nd, n);
      const p = this.findProp(o.cls, n); if (p && (/^(Func|Action|Predicate)/.test(p.type.n) || this.delegates.has(p.type.n))) return this.callDelegate(this.getProp(o, p, nd, fr), args, nd, n);
    }
    return this.callBuiltinInst(o, n, args, nd, fr);
  }
  callDelegate(f, args, nd, name) {
    if (f === null || f === undefined) this.throwEx('NullReferenceException', 'Object reference not set to an instance of an object.', nd);
    if (f instanceof Multi) { let r; for (const x of f.list) r = this.callDelegate(x, args, nd); return r; }
    if (f instanceof MRef) { const m = this.pick(f.cands, args, nd, f.name, null); return this.invokeVirtual(m, m.isStatic ? null : f.self, args, nd, false); }
    if (f instanceof Fn) {
      if (f.method) { this.pick([f.method], args, nd, f.method.name, null); return this.invoke(f.method, f.fr.self, args, nd, f.sc, f.fr); }
      return this.callLambda(f, args, nd);
    }
    if (typeof f === 'function') return f(args, nd);
    if (f && f.__host && f.__invoke) return f.__invoke(args);
    this.err('CS1955', `Non-invocable member '${name || '?'}' cannot be used like a method.`, nd);
  }
  callLambda(f, args, nd) {
    if (++this.depth > this.maxDepth) throw new StackOverflow(nd ? nd.line : this.line);
    try {
      const sc = new Scope(f.sc);
      f.params.forEach((p, k) => sc.v.set(p.name, { t: p.type || this.typeDesc(args[k]), v: args[k] instanceof Ref ? args[k].get() : args[k] }));
      const fr = { cls: f.fr.cls, self: f.fr.self, sc, m: { name: 'lambda' }, lambda: true, outer: f.fr.outer };
      if (f.body.k === 'Block') { const c = this.execBlock(f.body.stmts, fr); return c && c.k === 'ret' ? c.v : undefined; }
      return this.ev(f.body, fr);
    } finally { this.depth--; }
  }
  pick(ms, args, nd, name, C) {
    const n = args.length;
    const fits = ms.filter(m => {
      const ps = m.params; const hasParams = ps.length && ps[ps.length - 1].mod === 'params';
      const req = ps.filter(p => !p.def && p.mod !== 'params').length;
      return n >= req && (n <= ps.length || hasParams);
    });
    if (!fits.length) {
      if (ms.length === 1) {
        const m = ms[0]; const req = m.params.filter(p => !p.def && p.mod !== 'params');
        if (n < req.length) this.err('CS7036', `There is no argument given that corresponds to the required parameter '${req[n].name}' of '${m.cls ? m.cls.name + '.' : ''}${m.name}(${m.params.map(p => tname(p.type)).join(', ')})'`, nd);
      }
      this.err('CS1501', `No overload for method '${name}' takes ${n} arguments`, nd);
    }
    let best = null, bestScore = -1, firstBad = null;
    for (const m of fits) {
      let score = 0, ok = true;
      for (let k = 0; k < n; k++) {
        const p = k < m.params.length ? m.params[k] : m.params[m.params.length - 1];
        let pt = p.type;
        if (p.mod === 'params' && !(k === m.params.length - 1 && n === m.params.length && args[k] instanceof Arr)) pt = p.type.el;
        const a = args[k];
        if ((p.mod === 'ref' || p.mod === 'out') !== (a instanceof Ref)) { ok = false; if (!firstBad) firstBad = { m, k, a, p, refErr: true }; break; }
        const v = a instanceof Ref ? (p.mod === 'out' ? undefined : a.get()) : a;
        if (v === undefined) { score += 5; continue; }
        if (pt) this.resolveType(pt, nd);
        const s = this.convScore(v, pt);
        if (!s) { ok = false; if (!firstBad) firstBad = { m, k, a: v, p: Object.assign({}, p, { type: pt }) }; break; }
        score += s;
      }
      if (ok && score > bestScore) { best = m; bestScore = score; }
    }
    if (!best) {
      const b = firstBad;
      if (b.refErr) this.err('CS1620', `Argument ${b.k + 1} must be passed with the '${b.p.mod || 'ref'}' keyword`, nd);
      this.err('CS1503', `Argument ${b.k + 1}: cannot convert from '${this.typeOf(b.a)}' to '${tname(b.p.type)}'`, nd);
    }
    return best;
  }
  invokeVirtual(m, self, args, nd, nonVirtual) {
    if (self && !nonVirtual && (m.virt || m.abstract) && self instanceof Obj) {
      // find most-derived override with the same signature
      const s = sig(m); let c = self.cls;
      while (c) { const l = c.methods && c.methods.get(m.name); if (l) { const o = l.find(x => sig(x) === s && (x.mods.has('override') || x === m || (m.abstract && m.cls.isIface))); if (o) { m = o; break; } } if (c === m.cls) break; c = c.base; }
    }
    if (m.abstract && !m.body && !m.exprBody) this.err('CS0205', `Cannot call an abstract base member: '${m.cls.name}.${m.name}(${m.params.map(p => tname(p.type)).join(', ')})'`, nd);
    return this.invoke(m, self, args, nd);
  }
  invoke(m, self, args, nd, closure, defFr) {
    if (++this.depth > this.maxDepth) throw new StackOverflow(nd ? nd.line : this.line);
    const saveLine = this.line;
    try {
      if (m.native) return m.native.call(this, self, args, nd);
      const sc = new Scope(closure || null);
      const ps = m.params || [];
      for (let k = 0; k < ps.length; k++) {
        const p = ps[k];
        if (p.type && p.type.n !== 'var') this.resolveType(p.type, p);
        if (p.mod === 'params') {
          let arr;
          if (args.length === ps.length && args[k] instanceof Arr) arr = args[k];
          else arr = new Arr(p.type.el, args.slice(k).map(a => this.conv(a, p.type.el, false, nd)));
          sc.v.set(p.name, { t: p.type, v: arr }); break;
        }
        if (k >= args.length) { sc.v.set(p.name, { t: p.type, v: this.conv(this.ev(p.def, { cls: m.cls, self: null, sc: new Scope(null) }, p.type), p.type, false, p.def) }); continue; }
        const a = args[k];
        if (a instanceof Ref) {
          const r = a; const en = { t: p.type, ref: r };
          if (p.mod === 'out') { let assigned = false; en.ref = new Ref(() => { if (!assigned) this.err('CS0269', `Use of unassigned out parameter '${p.name}'`, nd); return r.get(); }, v => { assigned = true; r.set(this.conv(v, p.type, false, nd)); }); en.out = () => assigned; }
          sc.v.set(p.name, en);
        } else sc.v.set(p.name, { t: p.type, v: this.cloneV(this.conv(a, p.type, false, nd)) });
      }
      const fr = { cls: m.cls, self, sc, m, isCtor: !!m.isCtor || !!m.isSetter && false, outer: defFr ? (defFr.outer || defFr.cls) : null };
      if (m.isCtor) fr.isCtor = true;
      if (defFr) { fr.cls = defFr.cls; fr.self = defFr.self; }
      let r;
      if (m.exprBody) { r = this.ev(m.exprBody, fr, m.ret); }
      else if (m.body) {
        const c = this.execBlock(m.body.stmts, fr);
        if (c && c.k === 'ret') r = c.v;
        else if (m.ret && m.ret.n !== 'void' && !m.isCtor) this.err('CS0161', `'${m.cls ? m.cls.name + '.' : ''}${m.name}(${ps.map(p => tname(p.type)).join(', ')})': not all code paths return a value`, m);
      }
      for (const [k, en] of sc.v) if (en.out && !en.out()) this.err('CS0177', `The out parameter '${k}' must be assigned to before control leaves the current method`, m);
      if (m.ret && m.ret.n !== 'void' && r !== undefined) r = this.conv(r, this.resolveType(m.ret, m), false, nd);
      if (m.ret && m.ret.n === 'void') r = undefined;
      return r;
    } catch (e) {
      if (isStackErr(e)) throw new StackOverflow(nd ? nd.line : this.line);
      throw e;
    } finally { this.depth--; this.line = saveLine; }
  }

  /* ----- objects ----- */
  initFieldDefaults(o, C) {
    const chain = []; let c = C; while (c) { chain.unshift(c); c = c.base; }
    for (const k of chain) {
      if (k.native) { if (k.initNative) k.initNative(o); continue; }
      for (const [, f] of k.fields) if (!f.isStatic) o.f[f.name] = this.defaultOf(this.resolveType(f.type, f));
      for (const [, p] of k.props) if (!p.isStatic && p.auto) o.f['#' + p.name] = this.defaultOf(this.resolveType(p.type, p));
    }
  }
  runFieldInits(o, C) {
    const fr = { cls: C, self: o, sc: new Scope(null), isCtor: true };
    for (const m of C.decl.members) {
      if (m.k === 'Field' && !m.isStatic && m.init) o.f[m.name] = this.cloneV(this.conv(this.ev(m.init, fr, m.type), m.type, false, m.init));
      if (m.k === 'Prop' && !m.isStatic && m.auto && m.init) o.f['#' + m.name] = this.cloneV(this.conv(this.ev(m.init, fr, m.type), m.type, false, m.init));
    }
  }
  construct(C, o, args, nd) {
    if (C.native) { if (C.nctor) C.nctor.call(this, o, args, nd); return; }
    if (!C.ctors.length) {
      if (args.length && !(C.isStruct && false)) this.err('CS1729', `'${C.name}' does not contain a constructor that takes ${args.length} arguments`, nd);
      this.runFieldInits(o, C);
      if (C.base) this.baseCtor(C, o, [], nd);
      return;
    }
    if (C.isStruct && !args.length && !C.ctors.some(c => !c.params.length)) { this.runFieldInits(o, C); return; }
    const ms = C.ctors.map(c => Object.assign(c, { name: C.name, ret: { n: 'void' }, cls: C, isCtor: true }));
    const ct = this.pick(ms, args, nd, C.name, C);
    if (!this.canAccess(ct, { cls: nd && nd._fromCls }) && ct.access === 'private' && nd && nd._fromCls !== C) this.err('CS0122', `'${C.name}.${C.name}(${ct.params.map(p => tname(p.type)).join(', ')})' is inaccessible due to its protection level`, nd);
    // bind params once in a scope to evaluate :this()/:base() args
    const sc = new Scope(null);
    const tmp = { cls: C, self: o, sc, isCtor: true, m: ct };
    ct.params.forEach((p, k) => { this.resolveType(p.type, p); sc.v.set(p.name, k < args.length ? (args[k] instanceof Ref ? { t: p.type, ref: args[k] } : { t: p.type, v: this.conv(args[k], p.type, false, nd) }) : { t: p.type, v: p.def ? this.ev(p.def, tmp) : null }); });
    if (ct.init && ct.init.which === 'this') { const a2 = this.evArgs(ct.init.args, tmp); this.construct(C, o, a2, ct.init); }
    else {
      this.runFieldInits(o, C);
      if (C.base) { const a2 = ct.init ? this.evArgs(ct.init.args, tmp) : []; this.baseCtor(C, o, a2, ct.init || ct); }
    }
    // body
    if (++this.depth > this.maxDepth) throw new StackOverflow(nd ? nd.line : this.line);
    try { tmp.sc = new Scope(sc); const c = this.execBlock(ct.body.stmts, tmp, tmp.sc, true); } finally { this.depth--; }
  }
  baseCtor(C, o, args, nd) {
    const B = C.base;
    if (!B.native && B.ctors.length && !args.length && !B.ctors.some(c => c.params.every(p => p.def || p.mod === 'params'))) {
      const c0 = B.ctors[0]; this.err('CS7036', `There is no argument given that corresponds to the required parameter '${c0.params[0].name}' of '${B.name}.${B.name}(${c0.params.map(p => tname(p.type)).join(', ')})'`, nd);
    }
    this.construct(B, o, args, nd);
  }
  evNew(e, fr, expect) {
    let t = e.type;
    if (!t) { if (!expect || expect.n === 'var' || expect.n === 'object') this.err('CS8754', 'There is no target type for \'new()\'', e); t = expect; }
    this.resolveType(t, e);
    const args = this.evArgs(e.args, fr);
    let o;
    const C = this.classes.get(t.n);
    if (C) {
      if (C.isIface || C.isAbstract) this.err('CS0144', `Cannot create an instance of the abstract type or interface '${C.name}'`, e);
      if (C.isStatic) this.err('CS0712', `Cannot create an instance of the static class '${C.name}'`, e);
      this.ensureStatic(C);
      o = new Obj(C); this.initFieldDefaults(o, C);
      e._fromCls = fr.cls;
      this.construct(C, o, args, e);
      if (C.hostBase && this.host && this.host.attach) this.host.attach(o, C, this);
    } else if (this.enums.has(t.n)) { o = new EnumVal(this.enums.get(t.n), 0); }
    else if (NUMS.has(t.n) || t.n === 'bool') o = this.defaultOf(t);
    else o = this.newBuiltin(t, args, e, fr);
    if (e.init) this.applyInit(o, e.init, fr, t);
    return o;
  }
  applyInit(o, init, fr, t) {
    for (const it of init.items) {
      if (it.k === 'set') {
        if (it.v.k === 'ObjInitNested') { const inner = this.getMember(o, it.n, it, fr); this.applyInit(inner, it.v.init, fr); continue; }
        const r = this.memberRef(o, it.n, it, fr, null);
        r.set(this.ev(it.v, fr, r.type));
      } else if (it.k === 'idx') { const key = this.ev(it.key, fr); this.indexRef(o, [key], it, fr).set(this.ev(it.v, fr)); }
      else { const a = it.args.map(x => this.ev(x, fr, o instanceof Coll ? o.ta[0] : null)); this.callMethod(o, 'Add', a, it.args[0] || init, fr, null); }
    }
  }
  evNewArr(e, fr, expect) {
    let el = e.el;
    if (!el) { // new[] {..}
      const vals = e.init.items.map(x => this.ev(x, fr));
      const T = vals.find(v => v !== null);
      el = this.typeDesc(T);
      if (vals.some(v => v instanceof N && v.t === 'double')) el = { n: 'double' };
      return new Arr(el, vals.map(v => this.conv(v, el, false, e)));
    }
    this.resolveType(el, e);
    if (e.sizes.length) {
      const dims = e.sizes.map(s => { const v = this.ev(s, fr); if (!(v instanceof N) || !INTS.has(v.t)) this.err('CS0029', `Cannot implicitly convert type '${this.typeOf(v)}' to 'int'`, s); const n = num(v); if (n < 0) this.throwEx('OverflowException', 'Arithmetic operation resulted in an overflow.', s); return n; });
      const total = dims.reduce((a, b) => a * b, 1);
      if (total > 5000000) this.throwEx('OutOfMemoryException', 'Array dimensions exceeded supported range.', e);
      const a = new Array(total); for (let k = 0; k < total; k++) a[k] = this.defaultOf(el);
      const arr = new Arr(el, a, dims);
      if (e.init) { const fromInit = this.arrFromInit(el, e.rank, e.init, fr); if (fromInit.a.length !== total) this.err('CS0847', `An array initializer of length '${dims[0]}' is expected`, e.init); return fromInit; }
      return arr;
    }
    return this.arrFromInit(el, e.rank, e.init, fr);
  }
  arrFromInit(el, rank, init, fr) {
    this.resolveType(el, init);
    if (rank === 1) return new Arr(el, init.items.map(x => { if (x.k === 'ArrInit') { if (el.n !== '[]') this.err('CS0623', 'Array initializers can only be used in a variable or field initializer. Try using a new expression instead.', x); return this.arrFromInit(el.el, el.r, x, fr); } return this.cloneV(this.conv(this.ev(x, fr, el), el, false, x)); }));
    const dims = []; let cur = init; for (let d = 0; d < rank; d++) { dims.push(cur.items.length); cur = cur.items[0]; if (d < rank - 1 && (!cur || cur.k !== 'ArrInit')) this.err('CS0846', 'A nested array initializer is expected', init); }
    const flat = [];
    const walk = (node, d) => { if (node.items.length !== dims[d]) this.err('CS0847', `An array initializer of length '${dims[d]}' is expected`, node); for (const x of node.items) { if (d === rank - 1) flat.push(this.conv(this.ev(x, fr, el), el, false, x)); else walk(x, d + 1); } };
    walk(init, 0);
    return new Arr(el, flat, dims);
  }

  /* ----- indexing ----- */
  evIndex(e, fr) {
    const o = this.ev(e.obj, fr);
    if (e.nc && o === null) return null;
    const ix = e.ix.map(x => this.ev(x, fr));
    return this.indexRef(o, ix, e, fr).get();
  }
  idxNum(v, nd) { if (v && v.fromEnd !== undefined) return v; if (!(v instanceof N) || !INTS.has(v.t) || BIG.has(v.t)) { if (v instanceof N && BIG.has(v.t)) return Number(v.v); this.err('CS0029', `Cannot implicitly convert type '${this.typeOf(v)}' to 'int'`, nd); } return v.v; }
  indexRef(o, ix, nd, fr) {
    if (o === null || o === undefined) this.throwEx('NullReferenceException', 'Object reference not set to an instance of an object.', nd);
    if (o instanceof Arr) {
      if (ix.length !== o.dims.length) this.err('CS0022', `Wrong number of indices inside []; expected ${o.dims.length}`, nd);
      let off = 0;
      for (let d = 0; d < ix.length; d++) { let k = this.idxNum(ix[d], nd); if (k && k.fromEnd !== undefined) k = o.dims[d] - k.fromEnd; if (k < 0 || k >= o.dims[d]) this.throwEx('IndexOutOfRangeException', 'Index was outside the bounds of the array.', nd); off = off * o.dims[d] + k; }
      return new Ref(() => o.a[off], v => { o.a[off] = this.cloneV(this.conv(v, o.el, false, nd)); }, o.el);
    }
    if (typeof o === 'string') {
      let k = this.idxNum(ix[0], nd); if (k && k.fromEnd !== undefined) k = o.length - k.fromEnd;
      return new Ref(() => { if (k < 0 || k >= o.length) this.throwEx('IndexOutOfRangeException', 'Index was outside the bounds of the array.', nd); return mk('char', o.charCodeAt(k)); }, () => this.err('CS0200', 'Property or indexer \'string.this[int]\' cannot be assigned to -- it is read only', nd), { n: 'char' });
    }
    if (o instanceof Coll) return this.collIndexRef(o, ix, nd);
    if (o && o.__host && o.__index) return o.__index(ix);
    this.err('CS0021', `Cannot apply indexing with [] to an expression of type '${this.typeOf(o)}'`, nd);
  }

  /* ----- lvalues & assignment ----- */
  lval(e, fr, isOut) {
    if (e.k === 'Paren') return this.lval(e.e, fr, isOut);
    if (e.k === 'Name') {
      const en = fr.sc.find(e.n);
      if (en) {
        if (en.ref) return en.ref;
        return new Ref(() => { if (en.un && !isOut) this.err('CS0165', `Use of unassigned local variable '${e.n}'`, e); return en.v; }, v => {
          if (en.ro === 'const') this.err('CS0131', 'The left-hand side of an assignment must be a variable, property or indexer', e);
          if (en.ro === 'foreach') this.err('CS1656', `Cannot assign to '${e.n}' because it is a 'foreach iteration variable'`, e);
          if (en.ro === 'fn') this.err('CS1656', `Cannot assign to '${e.n}' because it is a 'method group'`, e);
          en.v = this.cloneV(this.conv(v, en.t, false, e)); en.un = false;
        }, en.t);
      }
      // field / property of current class
      let c = fr.cls;
      while (c) {
        if (c.native) { c = c.base; continue; }
        const f = c.fields.get(e.n);
        if (f) return this.fieldRef(f.isStatic ? null : fr.self, f, e, fr, true);
        const p = c.props.get(e.n);
        if (p) { const self = p.isStatic ? null : fr.self; if (!p.isStatic && !self) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${c.name}.${e.n}'`, e); return new Ref(() => this.getProp(self, p, e, fr, true), v => this.setProp(self, p, v, e, fr), p.type); }
        c = c.base;
      }
      if (fr.self && (fr.self.__host || (fr.cls && fr.cls.hostBase))) return this.memberRef(fr.self, e.n, e, fr, null);
      this.err('CS0103', `The name '${e.n}' does not exist in the current context`, e);
    }
    if (e.k === 'Member') {
      const T = this.evTarget(e.obj, fr);
      return this.memberRef(T.v, e.n, e, fr, T);
    }
    if (e.k === 'Index') { const o = this.ev(e.obj, fr); const ix = e.ix.map(x => this.ev(x, fr)); return this.indexRef(o, ix, e, fr); }
    if (e.k === 'This' && fr.self && fr.self.cls.isStruct) return new Ref(() => fr.self, v => { Object.assign(fr.self.f, this.cloneV(v).f); });
    this.err('CS0131', 'The left-hand side of an assignment must be a variable, property or indexer', e);
  }
  fieldRef(self, f, nd, fr, inside) {
    if (!f.isStatic && !self) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${f.cls.name}.${f.name}'`, nd);
    if (f.isStatic) this.ensureStatic(f.cls);
    const store = f.isStatic ? f.cls.sv : self.f;
    return new Ref(() => store[f.name], v => {
      if (f.isConst) this.err('CS0131', 'The left-hand side of an assignment must be a variable, property or indexer', nd);
      if (f.isReadonly && !(fr.isCtor && fr.cls === f.cls)) this.err('CS0191', 'A readonly field cannot be assigned to (except in a constructor or init-only setter of the type in which the field is defined or a variable initializer)', nd);
      store[f.name] = this.cloneV(this.conv(v, f.type, false, nd));
    }, f.type);
  }
  memberRef(o, n, nd, fr, T) {
    if (o instanceof TypeVal) {
      const C = this.classes.get(o.ty.n);
      if (C) { let c = C; while (c) { const f = c.fields.get(n); if (f) { if (!f.isStatic) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${c.name}.${n}'`, nd); if (!this.canAccess(f, fr)) this.accessErr(f, nd); return this.fieldRef(null, f, nd, fr); } const p = c.props.get(n); if (p) { if (!this.canAccess(p, fr)) this.accessErr(p, nd); return new Ref(() => this.getProp(null, p, nd, fr), v => this.setProp(null, p, v, nd, fr), p.type); } c = c.base; } this.err('CS0117', `'${C.name}' does not contain a definition for '${n}'`, nd); }
      return this.builtinStaticRef(o.ty.n, n, nd, fr);
    }
    if (o === null || o === undefined) this.throwEx('NullReferenceException', 'Object reference not set to an instance of an object.', nd);
    if (o instanceof Obj && !o.cls.native) {
      const f = this.findField(o.cls, n);
      if (f) { if (!this.canAccess(f, fr)) this.accessErr(f, nd); return this.fieldRef(f.isStatic ? null : o, f, nd, fr); }
      const p = this.findProp(o.cls, n);
      if (p) { if (!this.canAccess(p, fr)) this.accessErr(p, nd); return new Ref(() => this.getProp(o, p, nd, fr), v => this.setProp(o, p, v, nd, fr), p.type); }
      if (this.methodsByName(o.cls, n).length) this.err('CS1656', `Cannot assign to '${n}' because it is a 'method group'`, nd);
      if (o.cls.hostBase) { const r = this.hostRef(o, n, nd); if (r) return r; }
      this.err('CS1061', `'${o.cls.name}' does not contain a definition for '${n}' and no accessible extension method '${n}' accepting a first argument of type '${o.cls.name}' could be found (are you missing a using directive or an assembly reference?)`, nd);
    }
    return this.builtinRef(o, n, nd, fr);
  }
  evAssign(e, fr) {
    const r = this.lval(e.l, fr, e.op === '=');
    if (e.op === '=') {
      let v = this.ev(e.r, fr, r.type);
      r.set(v);
      return r.get ? (e.l.k === 'Name' ? v : v) : v;
    }
    if (e.op === '??=') { const cur = r.get(); if (cur !== null && cur !== undefined) return cur; const v = this.ev(e.r, fr, r.type); r.set(v); return v; }
    const cur = r.get();
    const rv = this.ev(e.r, fr);
    const op = e.op.slice(0, -1);
    // delegates / events
    if ((op === '+' || op === '-') && (cur === null || cur === undefined || cur instanceof Fn || cur instanceof MRef || cur instanceof Multi) && (rv instanceof Fn || rv instanceof MRef || rv instanceof Multi || rv === null) && typeof cur !== 'string') {
      if (op === '+') { if (cur === null || cur === undefined) r.set(rv); else r.set(new Multi([...(cur instanceof Multi ? cur.list : [cur]), ...(rv instanceof Multi ? rv.list : [rv])])); }
      else { if (cur instanceof Multi) { const l = cur.list.filter(x => !(x === rv || (x instanceof MRef && rv instanceof MRef && x.name === rv.name && x.self === rv.self))); r.set(l.length ? (l.length === 1 ? l[0] : new Multi(l)) : null); } else if (cur === rv || (cur instanceof MRef && rv instanceof MRef && cur.name === rv.name)) r.set(null); }
      return r.get();
    }
    let res = this.binop(op, cur, rv, e);
    if (cur instanceof N && res instanceof N && res.t !== cur.t) {
      // compound assignment: implicit cast back if rv implicitly convertible to the variable type (or shift)
      const ok = (rv instanceof N && (rv.t === cur.t || (IMPLICIT[rv.t] || []).includes(cur.t) || (rv.c && INTS.has(rv.t) && RANGE[cur.t] && num(rv) >= RANGE[cur.t][0] && num(rv) <= RANGE[cur.t][1]))) || op === '<<' || op === '>>';
      if (!ok) this.err('CS0266', `Cannot implicitly convert type '${res.t}' to '${cur.t}'. An explicit conversion exists (are you missing a cast?)`, e);
      res = mk(cur.t, Number.isFinite(num(res)) && INTS.has(cur.t) && !INTS.has(res.t) ? Math.trunc(num(res)) : res.v, false, res.s);
    }
    r.set(res);
    return res;
  }

  /* ----- operators ----- */
  userOp(name, args, nd) {
    for (const a of args) if (a instanceof Obj && !a.cls.native) {
      let c = a.cls; while (c) { const l = c.ops && c.ops.get(name); if (l) { const m = l.find(x => x.params.length === args.length && args.every((v, k) => this.convScore(v, x.params[k].type) > 0)); if (m) return this.invoke(Object.assign(m, { isStatic: true }), null, args, nd); } c = c.base; }
    }
    return Interp.NOPE;
  }
  eq(a, b, nd, pattern) {
    if (a === null || a === undefined) return b === null || b === undefined;
    if (b === null || b === undefined) return false;
    if (a instanceof N && b instanceof N) { const t = promo(a.t, b.t); if (!t) this.err('CS0019', `Operator '==' cannot be applied to operands of type '${a.t}' and '${b.t}'`, nd); const x = this.toT(a, t), y = this.toT(b, t); return x === y; }
    if (a instanceof EnumVal && b instanceof EnumVal) return a.e === b.e && a.v === b.v;
    if (a instanceof EnumVal && b instanceof N && pattern) return a.v === num(b);
    if (typeof a === 'string' && typeof b === 'string') return a === b;
    if (typeof a === 'boolean' && typeof b === 'boolean') return a === b;
    if (a instanceof Obj && a.cls.isStruct && pattern) return this.valEquals(a, b);
    if (pattern && (typeof a !== typeof b || (a instanceof N) !== (b instanceof N))) return false;
    if ((a instanceof N) !== (b instanceof N) || typeof a !== typeof b) this.err('CS0019', `Operator '==' cannot be applied to operands of type '${this.typeOf(a)}' and '${this.typeOf(b)}'`, nd);
    if (a instanceof Obj && a.cls.isStruct) this.err('CS0019', `Operator '==' cannot be applied to operands of type '${a.cls.name}' and '${this.typeOf(b)}'`, nd);
    return a === b;
  }
  valEquals(a, b) {
    if (a instanceof Obj && b instanceof Obj && a.cls === b.cls) { for (const k in a.f) { const x = a.f[k], y = b.f[k]; if (!this.valEquals(x, y)) return false; } return true; }
    if (a instanceof N && b instanceof N) return a.t === b.t && a.v === b.v;
    if (a instanceof EnumVal && b instanceof EnumVal) return a.e === b.e && a.v === b.v;
    return a === b;
  }
  toT(n, t) {
    if (t === 'long' || t === 'ulong') return typeof n.v === 'bigint' ? n.v : BigInt(n.v);
    return num(n);
  }
  binop(op, a, b, nd) {
    if (op === '==' || op === '!=') {
      if ((a instanceof Obj && !a.cls.native) || (b instanceof Obj && !b.cls.native)) { const u = this.userOp(op === '==' ? 'op_==' : 'op_!=', [a, b], nd); if (u !== Interp.NOPE) return u; }
      const r = this.eq(a, b, nd); return op === '==' ? r : !r;
    }
    if (op === '+' && (typeof a === 'string' || typeof b === 'string')) {
      return this.str(a) + this.str(b);
    }
    if (a instanceof Obj || b instanceof Obj) { const u = this.userOp('op_' + op, [a, b], nd); if (u !== Interp.NOPE) return u; }
    if (typeof a === 'boolean' && typeof b === 'boolean' && ['&', '|', '^'].includes(op)) return op === '&' ? a && b : op === '|' ? a || b : a !== b;
    if (a instanceof EnumVal || b instanceof EnumVal) {
      if (a instanceof EnumVal && b instanceof EnumVal && ['<', '>', '<=', '>='].includes(op)) return this.binop(op, I(a.v), I(b.v), nd);
      if (a instanceof EnumVal && b instanceof N && (op === '+' || op === '-')) return new EnumVal(a.e, a.v + (op === '+' ? num(b) : -num(b)));
      if (a instanceof EnumVal && b instanceof EnumVal && ['&', '|', '^'].includes(op)) return new EnumVal(a.e, op === '&' ? a.v & b.v : op === '|' ? a.v | b.v : a.v ^ b.v);
      if (a instanceof EnumVal && b instanceof EnumVal && op === '-') return I(a.v - b.v);
    }
    if (!(a instanceof N) || !(b instanceof N)) {
      if (a === null || b === null) { if (['<', '>', '<=', '>='].includes(op)) return false; if (a instanceof N || b instanceof N) return null; }
      this.err('CS0019', `Operator '${op}' cannot be applied to operands of type '${this.typeOf(a)}' and '${this.typeOf(b)}'`, nd);
    }
    let t;
    if (op === '<<' || op === '>>') { t = promo(a.t, 'int'); if (!INTS.has(b.t) || BIG.has(b.t)) this.err('CS0019', `Operator '${op}' cannot be applied to operands of type '${a.t}' and '${b.t}'`, nd); }
    else t = promo(a.t, b.t);
    if (!t) this.err('CS0019', `Operator '${op}' cannot be applied to operands of type '${a.t}' and '${b.t}'`, nd);
    const c = a.c && b.c;
    if (t === 'long' || t === 'ulong') {
      const x = this.toT(a, t), y = op === '<<' || op === '>>' ? BigInt(num(b) & 63) : this.toT(b, t);
      switch (op) {
        case '+': return mk(t, x + y, c); case '-': return mk(t, x - y, c); case '*': return mk(t, x * y, c);
        case '/': if (y === 0n) this.throwEx('DivideByZeroException', 'Attempted to divide by zero.', nd); return mk(t, x / y, c);
        case '%': if (y === 0n) this.throwEx('DivideByZeroException', 'Attempted to divide by zero.', nd); return mk(t, x % y, c);
        case '<': return x < y; case '>': return x > y; case '<=': return x <= y; case '>=': return x >= y;
        case '&': return mk(t, x & y, c); case '|': return mk(t, x | y, c); case '^': return mk(t, x ^ y, c);
        case '<<': return mk(t, x << y, c); case '>>': return mk(t, t === 'ulong' ? BigInt.asUintN(64, x) >> y : x >> y, c);
      }
    }
    const x = num(a), y = num(b);
    if (c && (t === 'int' || t === 'uint') && ['+', '-', '*'].includes(op)) { const exact = op === '+' ? x + y : op === '-' ? x - y : x * y; const R = t === 'int' ? [-2147483648, 2147483647] : [0, 4294967295]; if (exact < R[0] || exact > R[1]) this.err('CS0220', 'The operation overflows at compile time in checked mode', nd); }
    if (t === 'int' || t === 'uint') {
      switch (op) {
        case '+': return mk(t, x + y, c); case '-': return mk(t, x - y, c);
        case '*': return mk(t, t === 'int' ? Math.imul(x, y) : Number((BigInt(x) * BigInt(y)) & 0xFFFFFFFFn), c);
        case '/': if (y === 0) this.throwEx('DivideByZeroException', 'Attempted to divide by zero.', nd); return mk(t, Math.trunc(x / y), c);
        case '%': if (y === 0) this.throwEx('DivideByZeroException', 'Attempted to divide by zero.', nd); return mk(t, x % y, c);
        case '<': return x < y; case '>': return x > y; case '<=': return x <= y; case '>=': return x >= y;
        case '&': return mk(t, x & y, c); case '|': return mk(t, x | y, c); case '^': return mk(t, x ^ y, c);
        case '<<': return mk(t, x << (y & 31), c); case '>>': return mk(t, t === 'uint' ? x >>> (y & 31) : x >> (y & 31), c);
      }
    }
    if (t === 'decimal') {
      const sa = a.t === 'decimal' ? (a.s || 0) : 0, sb = b.t === 'decimal' ? (b.s || 0) : 0;
      switch (op) {
        case '+': return mk('decimal', +(x + y).toFixed(Math.max(sa, sb)), c, Math.max(sa, sb));
        case '-': return mk('decimal', +(x - y).toFixed(Math.max(sa, sb)), c, Math.max(sa, sb));
        case '*': { const s = Math.min(28, sa + sb); return mk('decimal', +(x * y).toFixed(Math.min(20, s)), c, s); }
        case '/': if (y === 0) this.throwEx('DivideByZeroException', 'Attempted to divide by zero.', nd); return decDiv(x, sa, y, sb, c);
        case '%': if (y === 0) this.throwEx('DivideByZeroException', 'Attempted to divide by zero.', nd); return mk('decimal', +(x % y).toFixed(Math.max(sa, sb)), c, Math.max(sa, sb));
        case '<': return x < y; case '>': return x > y; case '<=': return x <= y; case '>=': return x >= y;
      }
    }
    // float / double
    const f = t === 'float' ? Math.fround : (z => z);
    switch (op) {
      case '+': return mk(t, f(x + y), c); case '-': return mk(t, f(x - y), c); case '*': return mk(t, f(x * y), c);
      case '/': return mk(t, f(x / y), c); case '%': return mk(t, f(x % y), c);
      case '<': return x < y; case '>': return x > y; case '<=': return x <= y; case '>=': return x >= y;
    }
    this.err('CS0019', `Operator '${op}' cannot be applied to operands of type '${a.t}' and '${b.t}'`, nd);
  }
}
Interp.NOPE = { nope: true };
function sig(m) { return m.name + '(' + (m.params || []).map(p => (p.mod === 'ref' || p.mod === 'out' ? 'ref ' : '') + tname(p.type)).join(',') + ')'; }
function decDiv(x, sa, y, sb, c) {
  // exact-ish decimal division with up to 28 fractional digits
  const A = BigInt(Math.round(x * 10 ** sa)), B = BigInt(Math.round(y * 10 ** sb));
  let num_ = A * 10n ** BigInt(sb), den = B * 10n ** BigInt(sa);
  const neg = (num_ < 0n) !== (den < 0n); if (num_ < 0n) num_ = -num_; if (den < 0n) den = -den;
  const ip = num_ / den; let rem = num_ % den; let frac = '';
  const maxFrac = Math.max(0, 28 - (ip === 0n ? 0 : ip.toString().length - 1));
  while (rem !== 0n && frac.length < maxFrac) { rem *= 10n; frac += (rem / den).toString(); rem %= den; }
  if (rem !== 0n) { const next = (rem * 10n) / den; if (next >= 5n) { // round
      let digits = (ip.toString() + frac).split('').map(Number); let k = digits.length - 1; while (k >= 0) { if (digits[k] < 9) { digits[k]++; break; } digits[k] = 0; k--; } if (k < 0) digits.unshift(1);
      const s = digits.join(''); const il = s.length - frac.length; const str = (neg ? '-' : '') + s.slice(0, il) + (frac.length ? '.' + s.slice(il) : ''); return Object.assign(new N('decimal', Number(str), c, frac.length), { str });
    } }
  const str = (neg && (ip !== 0n || frac) ? '-' : '') + ip.toString() + (frac ? '.' + frac : '');
  return Object.assign(new N('decimal', Number(str), c, frac.length), { str });
}
CS.sig = sig;
CS.Interp = Interp;
})(typeof window !== 'undefined' ? window : globalThis);
