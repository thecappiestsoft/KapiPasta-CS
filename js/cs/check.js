/* ===== KapiSharp: analiza statyczna przed uruchomieniem =====
   Wyłapuje typowe błędy kompilacji, zanim program wypisze cokolwiek:
   CS0103 (nieznana nazwa), CS0246 (nieznany typ), CS0161 (brak return), CS0163/CS8070 (switch bez break),
   CS0128/CS0136 (powtórzona zmienna), CS0103 w metodach klas dla zmiennych z top-level. */
(function (G) {
'use strict';
const CS = G.CS;
const { CsError, tname } = CS;

function check(it) {
  const U = it.U;
  const err = (code, msg, nd) => { throw new CsError(code, msg, nd.line, nd.col); };
  const NSN = new Set(['System', 'Collections', 'Generic', 'Linq', 'IO', 'Text', 'Windows', 'Controls', 'Media', 'Threading', 'Tasks', 'Input', 'Shapes', 'Diagnostics']);
  const isType = n => it.classes.has(n) || it.enums.has(n) || it.delegates.has(n) || it.knownType(n) || CS.PRIMS.has(n) || CS.ALIAS[n];
  const skipNames = it.statics.length > 0 || !!(it.host && it.host.lenient);

  function checkType(t, nd) {
    if (!t) return;
    if (t.n === '[]' || t.n === '?') return checkType(t.el, nd);
    if (t.a) t.a.forEach(x => checkType(x, nd));
    if (t.n === 'var' || t.n === 'dynamic' || t.n === 'void') return;
    if (t.n.includes('.')) return;
    if (!isType(t.n)) err('CS0246', `The type or namespace name '${t.n}' could not be found (are you missing a using directive or an assembly reference?)`, nd);
  }

  /* ---- reachability ---- */
  function hasBreak(s) {
    let found = false;
    const walk = (x) => {
      if (!x || found) return;
      switch (x.k) {
        case 'Break': found = true; return;
        case 'Block': x.stmts.forEach(walk); return;
        case 'If': walk(x.a); walk(x.b); return;
        case 'Try': walk(x.body); x.catches.forEach(c => walk(c.body)); walk(x.fin); return;
        case 'Using': walk(x.body); return;
        // loops and switches capture their own breaks
      }
    };
    walk(s); return found;
  }
  const isTrue = e => e && e.k === 'Lit' && e.v === true;
  function endR(s) {
    if (!s) return true;
    switch (s.k) {
      case 'Return': case 'Throw': case 'Break': case 'Continue': return false;
      case 'Block': { let r = true; for (const x of s.stmts) { if (!r) break; r = endR(x); } return r; }
      case 'If': return !s.b || endR(s.a) || endR(s.b);
      case 'While': return isTrue(s.c) ? hasBreak(s.body) : true;
      case 'Do': return isTrue(s.c) ? hasBreak(s.body) : true;
      case 'For': return (!s.c || isTrue(s.c)) ? hasBreak(s.body) : true;
      case 'Switch': {
        const hasDef = s.sections.some(x => x.labels.some(l => l.k === 'default'));
        if (!hasDef) return true;
        return s.sections.some(sec => sec.body.some(st => hasBreak(st)));
      }
      case 'Try': if (s.fin && !endR(s.fin)) return false; return endR(s.body) || s.catches.some(c => endR(c.body));
      case 'Using': return endR(s.body);
      case 'ExprStmt': return !(s.e.k === 'Call' && s.e.fn.k === 'Member' && s.e.fn.obj.k === 'Name' && s.e.fn.obj.n === 'Environment' && s.e.fn.n === 'Exit');
    }
    return true;
  }

  /* ---- scopes ---- */
  class Sc { constructor(p, boundary) { this.p = p; this.n = new Map(); this.boundary = boundary; } }
  function declare(sc, name, nd, kind) {
    if (name === '_') return;
    if (sc.n.has(name)) err('CS0128', `A local variable or function named '${name}' is already defined in this scope`, nd);
    let p = sc.p;
    if (!sc.boundary) while (p) { if (p.n.has(name) && p.n.get(name) !== 'fn') err('CS0136', `A local or parameter named '${name}' cannot be declared in this scope because that name is used in an enclosing local scope to define a local or parameter`, nd); if (p.boundary) break; p = p.p; }
    sc.n.set(name, kind || 'var');
  }
  function known(sc, name) { let p = sc; while (p) { if (p.n.has(name)) return true; p = p.p; } return false; }

  let C = null; // current class
  function classHas(cls, n) {
    let c = cls;
    while (c) {
      if (c.native) { if (c.nget && c.nget[n]) return true; c = c.base; continue; }
      if (c.hostBase) return true;
      if (c.fields.has(n) || c.props.has(n) || c.methods.has(n)) return true;
      if (c.decl && c.decl.members.some(m => m.k === 'Nested' && m.decl.name === n)) return true;
      c = c.base;
    }
    return false;
  }
  function nameOk(sc, n) {
    if (known(sc, n)) return true;
    if (C && (classHas(C, n) || (C.outerCls && classHas(C.outerCls, n)))) return true;
    if (C && ['GetType', 'ToString', 'Equals', 'GetHashCode', 'MemberwiseClone'].includes(n)) return true;
    if (isType(n) || NSN.has(n)) return true;
    if (it.host && it.host.global && it.host.global(n) !== undefined) return true;
    if (skipNames) return true;
    return false;
  }

  function block(stmts, sc) {
    for (const s of stmts) if (s.k === 'LocalFunc') declare(sc, s.m.name, s, 'fn');
    for (const s of stmts) stmt(s, sc);
  }
  function sub(s, sc) { if (s.k === 'Block') block(s.stmts, new Sc(sc)); else { const n = new Sc(sc); stmt(s, n); } }
  function stmt(s, sc) {
    switch (s.k) {
      case 'Block': block(s.stmts, new Sc(sc)); return;
      case 'Empty': case 'Break': case 'Continue': return;
      case 'ExprStmt': expr(s.e, sc); return;
      case 'Decl': checkType(s.type, s); for (const d of s.decls) { if (d.init) expr(d.init, sc); declare(sc, d.name, d); } return;
      case 'If': expr(s.c, sc); sub(s.a, sc); if (s.b) sub(s.b, sc); return;
      case 'While': case 'Do': expr(s.c, sc); sub(s.body, sc); return;
      case 'For': { const n = new Sc(sc); s.init.forEach(x => stmt(x, n)); if (s.c) expr(s.c, n); s.it.forEach(x => expr(x, n)); sub(s.body, n); return; }
      case 'Foreach': { checkType(s.type, s); expr(s.coll, sc); const n = new Sc(sc); declare(n, s.name, { line: s.nline, col: s.ncol }); sub(s.body, n); return; }
      case 'Switch': {
        expr(s.e, sc);
        s.sections.forEach((sec, k) => {
          const n = new Sc(sc);
          sec.labels.forEach(l => { if (l.pat) pat(l.pat, n); if (l.when) expr(l.when, n); });
          block(sec.body, n);
          if (endR({ k: 'Block', stmts: sec.body })) {
            const lb = sec.labels[sec.labels.length - 1];
            const txt = lb.k === 'default' ? 'default:' : `case ${lb.text || ''}:`;
            if (k === s.sections.length - 1) err('CS8070', `Control cannot fall out of switch from final case label ('${txt}')`, lb);
            err('CS0163', `Control cannot fall through from one case label ('${txt}') to another`, lb);
          }
        });
        return;
      }
      case 'Return': if (s.e) expr(s.e, sc); return;
      case 'Throw': if (s.e) expr(s.e, sc); return;
      case 'Try': {
        sub(s.body, sc);
        for (const c of s.catches) { if (c.type) checkType(c.type, c); const n = new Sc(sc); if (c.name) declare(n, c.name, c); if (c.when) expr(c.when, n); block(c.body.stmts, n); }
        if (s.fin) sub(s.fin, sc); return;
      }
      case 'Using': { const n = new Sc(sc); if (s.d) stmt(s.d, n); if (s.e) expr(s.e, n); sub(s.body, n); return; }
      case 'LocalFunc': method(s.m, sc); return;
    }
  }
  function pat(p, sc) {
    if (!p) return;
    switch (p.k) {
      case 'PatType': checkType(p.type, p); declare(sc, p.name, p); return;
      case 'PatVar': declare(sc, p.name, p); return;
      case 'PatNot': pat(p.p, sc); return;
      case 'PatAnd': case 'PatOr': pat(p.a, sc); pat(p.b, sc); return;
      case 'PatRel': case 'PatConst': expr(p.e, sc); return;
      case 'PatTypeOrConst': { const e = p.e; if (e.k === 'Name' && !isType(e.n)) expr(e, sc); else if (e.k === 'Member') expr(e, sc); return; }
    }
  }
  function expr(e, sc) {
    if (!e || typeof e !== 'object') return;
    switch (e.k) {
      case 'Name':
        if (!nameOk(sc, e.n)) err('CS0103', `The name '${e.n}' does not exist in the current context`, e);
        return;
      case 'Lit': case 'This': case 'Base': case 'TypeRef': return;
      case 'Member': expr(e.obj, sc); return;
      case 'Call':
        expr(e.fn, sc);
        for (const a of e.args) { if (a.decl) { checkType(a.decl.type, a.decl); declare(sc, a.decl.name, a.decl); } else expr(a.e, sc); }
        return;
      case 'Index': expr(e.obj, sc); e.ix.forEach(x => expr(x, sc)); return;
      case 'Assign': expr(e.l, sc); expr(e.r, sc); return;
      case 'Bin': expr(e.l, sc); expr(e.r, sc); return;
      case 'Un': case 'PreInc': case 'PostInc': case 'Paren': case 'FromEnd': case 'Throw': expr(e.e, sc); return;
      case 'Cond': expr(e.c, sc); expr(e.a, sc); expr(e.b, sc); return;
      case 'Cast': checkType(e.type, e); expr(e.e, sc); return;
      case 'As': checkType(e.type, e); expr(e.e, sc); return;
      case 'Is': expr(e.e, sc); pat(e.pat, sc); return;
      case 'Interp': e.parts.forEach(p => { if (typeof p !== 'string') { expr(p.e, sc); if (p.align) expr(p.align, sc); } }); return;
      case 'Lambda': {
        const n = new Sc(sc, true);
        e.params.forEach(p => { if (p.type) checkType(p.type, e); n.n.set(p.name, 'var'); });
        if (e.body.k === 'Block') block(e.body.stmts, n); else expr(e.body, n);
        return;
      }
      case 'New': if (e.type) checkType(e.type, e); e.args.forEach(a => a.e && expr(a.e, sc)); if (e.init) init(e.init, sc); return;
      case 'NewArr': if (e.el) checkType(e.el, e); e.sizes.forEach(x => expr(x, sc)); if (e.init) expr(e.init, sc); return;
      case 'ArrInit': e.items.forEach(x => expr(x, sc)); return;
      case 'CollExpr': e.items.forEach(x => expr(x.k === 'Spread' ? x.e : x, sc)); return;
      case 'TypeOf': case 'Default': if (e.type) checkType(e.type, e); return;
      case 'SwitchExpr': expr(e.e, sc); e.arms.forEach(a => { const n = new Sc(sc); pat(a.pat, n); if (a.when) expr(a.when, n); expr(a.e, n); }); return;
      case 'Tuple': e.items.forEach(x => expr(x, sc)); return;
    }
  }
  function init(ini, sc) { for (const it2 of ini.items) { if (it2.k === 'set') { if (it2.v.k === 'ObjInitNested') init(it2.v.init, sc); else expr(it2.v, sc); } else if (it2.k === 'idx') { expr(it2.key, sc); expr(it2.v, sc); } else it2.args.forEach(x => expr(x, sc)); } }
  function method(m, outer, extra) {
    const sc = new Sc(outer || null, true);
    (m.params || []).forEach(p => { checkType(p.type, p); declare(sc, p.name, p); if (p.def) expr(p.def, sc); });
    if (extra) extra.forEach(n => sc.n.set(n, 'var'));
    if (m.ret) checkType(m.ret, m);
    if (m.exprBody) { expr(m.exprBody, sc); return; }
    if (!m.body) return;
    const body = new Sc(sc);
    block(m.body.stmts, body);
    if (m.ret && m.ret.n !== 'void' && !m.isCtor && endR(m.body)) {
      err('CS0161', `'${C && !m.local ? C.name + '.' : ''}${m.name}(${(m.params || []).map(p => tname(p.type)).join(', ')})': not all code paths return a value`, m.local ? m : (m.nameLine ? { line: m.nameLine, col: m.col } : m));
    }
  }

  // classes
  for (const [, cls] of it.classes) {
    if (!cls.decl) continue;
    C = cls;
    for (const m of cls.decl.members) {
      if (m.k === 'Field') { checkType(m.type, m); if (m.init) expr(m.init, new Sc(null, true)); }
      else if (m.k === 'Prop') {
        checkType(m.type, m);
        if (m.init) expr(m.init, new Sc(null, true));
        if (m.get && (m.get.body || m.get.exprBody)) method({ name: 'get_' + m.name, params: [], ret: m.type, body: m.get.body, exprBody: m.get.exprBody, line: m.line, col: m.col }, null);
        if (m.set && (m.set.body || m.set.exprBody)) method({ name: 'set_' + m.name, params: [], ret: { n: 'void' }, body: m.set.body, exprBody: m.set.exprBody }, null, ['value']);
      }
      else if (m.k === 'Method') method(m, null);
      else if (m.k === 'Ctor') {
        const sc = new Sc(null, true); m.params.forEach(p => { checkType(p.type, p); declare(sc, p.name, p); });
        if (m.init) m.init.args.forEach(a => a.e && expr(a.e, sc));
        block(m.body.stmts, new Sc(sc));
      }
      else if (m.k === 'Dtor') block(m.body.stmts, new Sc(null, true));
    }
  }
  // top-level statements
  C = null;
  if (U.top.length) { const sc = new Sc(null, true); sc.n.set('args', 'var'); block(U.top, sc); }
}
CS.check = check;
})(typeof window !== 'undefined' ? window : globalThis);
