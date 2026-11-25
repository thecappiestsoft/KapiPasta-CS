/* ===== KapiSharp: parser (tokeny -> drzewo składni) ===== */
(function (G) {
'use strict';
const CS = G.CS;
const { CsError, PRIMS } = CS;
const MODS = new Set(['public', 'private', 'protected', 'internal', 'static', 'abstract', 'sealed', 'virtual', 'override', 'readonly', 'const', 'new', 'partial', 'extern', 'async', 'unsafe', 'volatile', 'required', 'file']);
const ALIAS = { Int32: 'int', Int64: 'long', Int16: 'short', Byte: 'byte', SByte: 'sbyte', UInt32: 'uint', UInt64: 'ulong', UInt16: 'ushort', Double: 'double', Single: 'float', Decimal: 'decimal', Boolean: 'bool', Char: 'char', String: 'string', Object: 'object' };
CS.ALIAS = ALIAS;
const ASSIGN_OPS = new Set(['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '??=']);

function makeParser(T) {
  let i = 0;
  const pk = (k = 0) => T[Math.min(i + k, T.length - 1)];
  const nx = () => T[i++];
  const is = (v, k = 0) => { const t = pk(k); return (t.t === 'op' || t.t === 'kw') && t.v === v; };
  const isId = (k = 0, v) => { const t = pk(k); return t.t === 'id' && (v === undefined || t.v === v); };
  const prev = () => T[Math.max(0, i - 1)];
  const fail = (code, msg, t = pk()) => { throw new CsError(code, msg, t.line, t.col); };
  const expectedAfterPrev = (code, msg) => { const p = prev(); throw new CsError(code, msg, p.eline, p.ecol); };
  function eat(v) {
    if (is(v)) return nx();
    const t = pk();
    if (v === ';') expectedAfterPrev('CS1002', '; expected');
    if (v === ')') expectedAfterPrev('CS1026', ') expected');
    if (v === '}') fail('CS1513', '} expected');
    if (v === '{') fail('CS1514', '{ expected');
    if (v === ']') expectedAfterPrev('CS1003', 'Syntax error, \']\' expected');
    if (v === '(') fail('CS1003', 'Syntax error, \'(\' expected');
    fail('CS1003', `Syntax error, '${v}' expected`, t);
  }
  const opt = v => (is(v) ? nx() : null);
  function ident() {
    const t = pk();
    if (t.t === 'id') { i++; return t.v; }
    if (t.t === 'kw') fail('CS1041', `Identifier expected; '${t.v}' is a keyword`);
    fail('CS1001', 'Identifier expected');
  }
  const node = (k, t, o) => Object.assign({ k, line: t.line, col: t.col }, o);

  /* ---------- types ---------- */
  function tryType() { const s = i; try { const t = type(true); if (t) return t; } catch (e) { if (!(e instanceof CsError)) throw e; } i = s; return null; }
  function type(soft) {
    const t = pk(); let ty;
    if (t.t === 'kw' && PRIMS.has(t.v)) { i++; ty = { n: t.v }; }
    else if (t.t === 'id') {
      i++; let name = t.v;
      if (name === 'global' && is('::')) { i++; name = ident(); }
      let args;
      while (true) {
        if (is('<')) {
          const s = i; i++; const a = [];
          let ok = true;
          try { if (!is('>')) { a.push(type()); while (opt(',')) a.push(type()); } if (!is('>')) ok = false; else i++; } catch (e) { if (!(e instanceof CsError)) throw e; ok = false; }
          if (!ok) { i = s; break; }
          args = a;
        }
        if (is('.') && isId(1)) { i++; const p = ident(); if (['System', 'Collections', 'Generic', 'IO', 'Linq', 'Text', 'Windows', 'Controls', 'Media', 'Threading', 'Shapes', 'Input', 'Data', 'Globalization', 'Animation', 'Media3D', 'Navigation', 'Documents', 'ObjectModel', 'Diagnostics', 'Tasks'].includes(name)) { name = p; args = undefined; continue; } name = name + '.' + p; args = undefined; continue; }
        break;
      }
      ty = { n: ALIAS[name] || name }; if (args) ty.a = args;
    } else { if (soft) return null; fail('CS1031', 'Type expected'); }
    if (is('?') && !(soft && startsExprAfterQ())) { i++; ty = { n: '?', el: ty }; }
    while (is('[') && (is(']', 1) || is(',', 1))) {
      i++; let r = 1; while (opt(',')) r++; eat(']'); ty = { n: '[]', el: ty, r };
    }
    return ty;
  }
  // after `T ?` decide if '?' is nullable or conditional operator (soft parsing only)
  function startsExprAfterQ() { const t = pk(1); return t.t === 'num' || t.t === 'str' || t.t === 'chr' || (t.t === 'kw' && ['true', 'false', 'null', 'new', 'this'].includes(t.v)) || (t.t === 'op' && ['(', '-', '!'].includes(t.v)) || (t.t === 'id' && !(pk(2).t === 'op' && ['=', ';', ',', ')'].includes(pk(2).v))); }

  /* ---------- compilation unit ---------- */
  function unit() {
    const U = { usings: [], statics: [], types: [], top: [], line: 1 };
    let sawType = false;
    while (pk().t !== 'eof') {
      if (is('using') && !is('(', 1) && !(isId(1, 'var')) && !isUsingDecl()) {
        i++; if (opt('static')) { const t = type(); U.statics.push(t.n); } else { if (isId() && is('=', 1)) { i += 2; type(); } else type(); }
        eat(';'); continue;
      }
      if (is('namespace')) {
        i++; type();
        if (opt(';')) continue;
        eat('{'); while (!is('}') && pk().t !== 'eof') { if (is('using')) { i++; type(); eat(';'); continue; } const td = typeDecl(); if (!td) fail('CS1022', 'Type or namespace definition, or end-of-file expected'); U.types.push(td); } eat('}'); sawType = true; continue;
      }
      const td = typeDecl();
      if (td) { U.types.push(td); sawType = true; continue; }
      if (is('}')) fail('CS1022', 'Type or namespace definition, or end-of-file expected');
      const t0 = pk();
      const st = statement();
      if (sawType) throw new CsError('CS8803', 'Top-level statements must precede namespace and type declarations.', t0.line, t0.col);
      U.top.push(st);
    }
    return U;
  }
  function isUsingDecl() { const s = i; i++; const t = tryType(); const r = t && isId() && is('=', 1); i = s; return r; }
  function mods() { const m = new Set(); while ((pk().t === 'kw' || pk().t === 'id') && MODS.has(pk().v) && !(pk().v === 'new' && (is('(', 1) || is('[', 1)))) { if (pk().t === 'id' && !(pk(1).t === 'kw' || pk(1).t === 'id')) break; m.add(nx().v); } return m; }
  function access(m, def) { return m.has('public') ? 'public' : m.has('protected') ? 'protected' : m.has('internal') ? 'internal' : m.has('private') ? 'private' : def; }

  function typeDecl(inClass) {
    const s = i; const t0 = pk();
    while (is('[')) { let d = 0; do { if (is('[')) d++; if (is(']')) d--; i++; } while (d > 0); } // attributes
    const m = mods();
    if (is('class') || is('struct') || is('interface') || is('enum') || isId(0, 'record')) {
      let kind = nx().v; if (kind === 'record') { kind = opt('struct') ? 'struct' : (opt('class'), 'class'); }
      const nameTok = pk(); const name = ident();
      if (is('<')) { i++; while (!is('>')) i++; i++; }
      const D = node('Type', nameTok, { kind, name, mods: m, access: access(m, 'internal'), bases: [], members: [] });
      if (kind === 'enum') {
        if (opt(':')) type();
        eat('{'); D.values = [];
        while (!is('}')) { const tk = pk(); const nm = ident(); let e = null; if (opt('=')) e = expr(); D.values.push({ name: nm, e, line: tk.line }); if (!opt(',')) break; }
        eat('}'); opt(';'); return D;
      }
      if (opt(':')) { D.bases.push(type()); while (opt(',')) D.bases.push(type()); }
      while (isId(0, 'where')) { while (!is('{')) i++; }
      eat('{');
      while (!is('}')) { if (pk().t === 'eof') fail('CS1513', '} expected'); member(D); }
      eat('}'); opt(';');
      return D;
    }
    if (is('delegate')) { i++; const rt = type(); const nm = ident(); if (is('<')) { while (!is('>')) i++; i++; } const ps = params(); eat(';'); return node('Delegate', t0, { name: nm, ret: rt, params: ps }); }
    i = s; return null;
  }
  function params() {
    eat('('); const ps = [];
    if (!is(')')) do {
      while (is('[')) { while (!is(']')) i++; i++; }
      const t = pk(); let mod = null;
      if (is('ref') || is('out') || is('params') || is('in') || is('this')) mod = nx().v;
      const ty = type(); const nm = ident(); let def = null;
      if (opt('=')) def = expr();
      ps.push({ name: nm, type: ty, mod, def, line: t.line, col: t.col });
    } while (opt(','));
    eat(')'); return ps;
  }
  function member(D) {
    const nested = typeDecl(true);
    if (nested) { D.members.push({ k: 'Nested', decl: nested }); return; }
    while (is('[')) { let d = 0; do { if (is('[')) d++; if (is(']')) d--; i++; } while (d > 0); }
    const t0 = pk(); const m = mods(); const acc = access(m, D.kind === 'interface' ? 'public' : 'private');
    const base = { mods: m, access: acc, isStatic: m.has('static') || m.has('const'), line: t0.line, col: t0.col };
    // destructor
    if (is('~')) { i++; ident(); eat('('); eat(')'); const body = block(); D.members.push(Object.assign({ k: 'Dtor', body }, base)); return; }
    // constructor
    if (isId(0, D.name) && is('(', 1)) {
      const nt = pk(); i++; const ps = params(); let init = null;
      if (opt(':')) { const kt = pk(); const which = nx().v; if (which !== 'base' && which !== 'this') fail('CS1018', 'Keyword \'this\' or \'base\' expected', kt); init = { which, args: args(), line: kt.line }; }
      let body; if (opt('=>')) { body = node('Block', nt, { stmts: [node('ExprStmt', nt, { e: expr() })] }); eat(';'); } else body = block();
      D.members.push(Object.assign({ k: 'Ctor', params: ps, init, body }, base)); return;
    }
    if (is('event')) { i++; const ty = type(); const nm = ident(); eat(';'); D.members.push(Object.assign({ k: 'Field', type: ty, name: nm, init: null, isEvent: true }, base)); return; }
    // operator overload
    const ty = type();
    if (is('operator')) {
      i++; const opT = nx(); let op = opT.v; if (op === '>' && is('>') && opT.adj) { i++; op = '>>'; }
      const ps = params(); let body, exprBody = null;
      if (opt('=>')) { exprBody = expr(); eat(';'); } else body = block();
      D.members.push(Object.assign({ k: 'Method', name: 'op_' + op, ret: ty, params: ps, body, exprBody, isOp: true }, base)); return;
    }
    if (ty.n === 'implicit' || ty.n === 'explicit') fail('CS1003', 'Conversion operators are not supported here');
    if (is('this') && is('[', 1)) fail('CS0000', 'Indexers are not supported in KapiPasta');
    const nameTok = pk(); const name = ident();
    if (is('<') && D.kind !== 'enum') { let d = 0; do { if (is('<')) d++; if (is('>')) d--; i++; } while (d > 0); }
    if (is('(')) {
      const ps = params(); let body = null, exprBody = null;
      if (opt('=>')) { exprBody = expr(); eat(';'); }
      else if (is('{')) body = block();
      else eat(';');
      D.members.push(Object.assign({ k: 'Method', name, ret: ty, params: ps, body, exprBody, nameLine: nameTok.line }, base)); return;
    }
    if (is('{') || is('=>')) { // property
      const P = Object.assign({ k: 'Prop', type: ty, name, get: null, set: null, auto: false, init: null }, base);
      if (opt('=>')) { P.get = { exprBody: expr(), access: acc }; eat(';'); D.members.push(P); return; }
      eat('{');
      while (!is('}')) {
        const am = mods(); const accT = pk(); const which = ident();
        if (which !== 'get' && which !== 'set' && which !== 'init') fail('CS1014', 'A get or set accessor expected', accT);
        const A = { access: access(am, acc), line: accT.line };
        if (opt(';')) { A.auto = true; } else if (opt('=>')) { A.exprBody = expr(); eat(';'); } else A.body = block();
        if (which === 'get') P.get = A; else P.set = A;
      }
      eat('}');
      P.auto = !!((P.get && P.get.auto) || (P.set && P.set.auto));
      if (opt('=')) { P.init = expr(); eat(';'); }
      D.members.push(P); return;
    }
    // field(s)
    let nm = name, nt = nameTok;
    for (;;) {
      let init = null; if (opt('=')) init = is('{') ? arrayInit() : expr();
      D.members.push(Object.assign({ k: 'Field', type: ty, name: nm, init, isConst: m.has('const'), isReadonly: m.has('readonly'), line: nt.line, col: nt.col }, base, { line: nt.line, col: nt.col }));
      if (!opt(',')) break;
      nt = pk(); nm = ident();
    }
    eat(';');
  }

  /* ---------- statements ---------- */
  function block() { const t = pk(); eat('{'); const stmts = []; while (!is('}')) { if (pk().t === 'eof') fail('CS1513', '} expected'); stmts.push(statement()); } eat('}'); return node('Block', t, { stmts }); }
  function embedded() { const t = pk(); const s = statement(); if (s.k === 'Decl' && !s.isUsing) throw new CsError('CS1023', 'Embedded statement cannot be a declaration or labeled statement', t.line, t.col); return s; }
  function statement() {
    const t = pk();
    if (t.t === 'op') {
      if (t.v === '{') return block();
      if (t.v === ';') { i++; return node('Empty', t); }
    }
    if (t.t === 'kw') switch (t.v) {
      case 'if': { i++; eat('('); const c = expr(); eat(')'); const a = embedded(); let b = null; if (opt('else')) b = embedded(); return node('If', t, { c, a, b }); }
      case 'while': { i++; eat('('); const c = expr(); eat(')'); return node('While', t, { c, body: embedded() }); }
      case 'do': { i++; const body = embedded(); eat('while'); eat('('); const c = expr(); eat(')'); eat(';'); return node('Do', t, { c, body }); }
      case 'for': {
        i++; eat('('); const init = [];
        if (!is(';')) { const d = tryDecl(); if (d) init.push(d); else { init.push(node('ExprStmt', pk(), { e: expr() })); while (opt(',')) init.push(node('ExprStmt', pk(), { e: expr() })); } }
        eat(';'); const c = is(';') ? null : expr(); eat(';');
        const it = []; if (!is(')')) { it.push(expr()); while (opt(',')) it.push(expr()); }
        eat(')'); return node('For', t, { init, c, it, body: embedded() });
      }
      case 'foreach': {
        i++; eat('('); const ty = type(); const nt = pk(); const name = ident();
        if (!is('in')) fail('CS1515', '\'in\' expected'); i++;
        const coll = expr(); eat(')'); return node('Foreach', t, { type: ty, name, nline: nt.line, ncol: nt.col, coll, body: embedded() });
      }
      case 'switch': {
        i++; eat('('); const e = expr(); eat(')'); eat('{'); const sections = [];
        while (!is('}')) {
          const sec = { labels: [], body: [], line: pk().line };
          while (is('case') || is('default')) {
            const lt = nx();
            if (lt.v === 'default') { eat(':'); sec.labels.push({ k: 'default', line: lt.line }); continue; }
            const pat = pattern(); let when = null; if (isId(0, 'when')) { i++; when = expr(); }
            eat(':'); sec.labels.push({ k: 'case', pat, when, line: lt.line, col: lt.col, text: srcText(lt, prev()) });
          }
          if (!sec.labels.length) fail('CS1525', `Invalid expression term '${pk().v}'`);
          while (!is('case') && !is('default') && !is('}')) { if (pk().t === 'eof') fail('CS1513', '} expected'); sec.body.push(statement()); }
          sections.push(sec);
        }
        eat('}'); return node('Switch', t, { e, sections });
      }
      case 'break': i++; eat(';'); return node('Break', t);
      case 'continue': i++; eat(';'); return node('Continue', t);
      case 'return': { i++; const e = is(';') ? null : expr(); eat(';'); return node('Return', t, { e }); }
      case 'throw': { i++; const e = is(';') ? null : expr(); eat(';'); return node('Throw', t, { e }); }
      case 'try': {
        i++; const body = block(); const catches = []; let fin = null;
        while (is('catch')) {
          const ct = nx(); let ty = null, name = null, when = null;
          if (opt('(')) { ty = type(); if (isId()) name = ident(); eat(')'); }
          if (isId(0, 'when')) { i++; eat('('); when = expr(); eat(')'); }
          catches.push({ type: ty, name, when, body: block(), line: ct.line });
        }
        if (opt('finally')) fin = block();
        if (!catches.length && !fin) fail('CS1524', 'Expected catch or finally');
        return node('Try', t, { body, catches, fin });
      }
      case 'using': {
        i++;
        if (opt('(')) { let d = tryDecl(); let e = null; if (!d) e = expr(); eat(')'); return node('Using', t, { d, e, body: embedded() }); }
        const d = tryDecl(); if (!d) fail('CS1003', 'Syntax error'); eat(';'); d.isUsing = true; return d;
      }
      case 'const': { i++; const d = tryDecl(true); if (!d) fail('CS1001', 'Identifier expected'); eat(';'); d.isConst = true; return d; }
      case 'goto': fail('CS0000', 'goto is not supported in KapiPasta');
      case 'checked': case 'unchecked': if (is('{', 1)) { i++; return block(); } break;
      case 'lock': { i++; eat('('); expr(); eat(')'); return embedded(); }
    }
    // local function
    const lf = tryLocalFunc(); if (lf) return lf;
    const d = tryDecl();
    if (d) { eat(';'); return d; }
    const e = expr();
    if (!['Assign', 'Call', 'PreInc', 'PostInc', 'New', 'Await', 'Throw'].includes(e.k)) {
      if (is(';')) throw new CsError('CS0201', 'Only assignment, call, increment, decrement, await, and new object expressions can be used as a statement', e.line, e.col);
    }
    eat(';');
    return node('ExprStmt', t, { e });
  }
  function srcText(a, b) { return T.slice(T.indexOf(a) + 1, T.indexOf(b)).map(x => x.t === 'str' ? JSON.stringify(x.v) : x.t === 'chr' ? `'${x.v}'` : x.t === 'num' ? x.v.raw : x.v).join(' ').replace(/ \. /g, '.').replace(/ :$/, ''); }
  function tryLocalFunc() {
    const s = i; const t0 = pk();
    const m = new Set(); while (is('static') || is('async') || is('unsafe')) m.add(nx().v);
    const ty = tryType();
    if (ty && isId() && (is('(', 1) || is('<', 1))) {
      const nm = ident(); if (is('<')) { while (!is('>')) i++; i++; }
      if (!is('(')) { i = s; return null; }
      // make sure this is a parameter list, not a call: look for ')' followed by '{' or '=>'
      let d = 0, j = i; do { const tk = T[j]; if (tk.v === '(' && tk.t === 'op') d++; if (tk.v === ')' && tk.t === 'op') d--; j++; } while (d > 0 && j < T.length);
      if (!(T[j] && T[j].t === 'op' && (T[j].v === '{' || T[j].v === '=>'))) { i = s; return null; }
      const ps = params(); let body = null, exprBody = null;
      if (opt('=>')) { exprBody = expr(); eat(';'); } else body = block();
      return node('LocalFunc', t0, { m: { k: 'Method', name: nm, ret: ty, params: ps, body, exprBody, mods: m, isStatic: m.has('static'), access: 'private', line: t0.line, col: t0.col, local: true } });
    }
    i = s; return null;
  }
  function tryDecl(forceType) {
    const s = i; const t0 = pk();
    const ty = tryType();
    if (!ty || !isId()) { i = s; return null; }
    const after = pk(1);
    if (!(after.t === 'op' && ['=', ';', ',', ')'].includes(after.v)) && !(after.t === 'kw' && after.v === 'in')) { i = s; return null; }
    if (after.v === ')' && !forceType) { /* e.g. for(int i) – unusual */ }
    const decls = [];
    do {
      const nt = pk(); const name = ident(); let init = null;
      if (opt('=')) init = is('{') ? arrayInit() : expr();
      decls.push({ name, init, line: nt.line, col: nt.col });
    } while (opt(','));
    return node('Decl', t0, { type: ty, decls });
  }

  /* ---------- expressions ---------- */
  function expr() { return assignment(); }
  function lambdaAhead() {
    if (isId() && is('=>', 1)) return true;
    if (isId(0, 'async')) return false;
    if (!is('(')) return false;
    let d = 0, j = i;
    do { const tk = T[j]; if (tk.t === 'op' && tk.v === '(') d++; if (tk.t === 'op' && tk.v === ')') d--; j++; } while (d > 0 && j < T.length);
    return T[j] && T[j].t === 'op' && T[j].v === '=>';
  }
  function lambda() {
    const t = pk(); const ps = [];
    if (isId()) ps.push({ name: ident() });
    else { eat('('); if (!is(')')) do { const ty = (isId() && (is(',', 1) || is(')', 1))) ? null : type(); ps.push({ name: ident(), type: ty }); } while (opt(',')); eat(')'); }
    eat('=>');
    const body = is('{') ? block() : expr();
    return node('Lambda', t, { params: ps, body });
  }
  function assignment() {
    if (lambdaAhead()) return lambda();
    const t = pk();
    const l = conditional();
    if (pk().t === 'op' && ASSIGN_OPS.has(pk().v)) {
      let op = nx().v;
      if (op === '>' ) op = '>';
      if (!['Name', 'Member', 'Index', 'This'].includes(l.k)) throw new CsError('CS0131', 'The left-hand side of an assignment must be a variable, property or indexer', l.line, l.col);
      const r = (op === '=' && is('{')) ? arrayInit() : assignment();
      return node('Assign', t, { op, l, r });
    }
    // '>' '>' '=' shift-assign
    if (is('>') && is('>', 1) && is('=', 2) && pk().adj && pk(1).adj) { i += 3; const r = assignment(); return node('Assign', t, { op: '>>=', l, r }); }
    return l;
  }
  function conditional() {
    const t = pk(); const c = coalesce();
    if (is('?')) { i++; const a = assignment(); eat(':'); const b = assignment(); return node('Cond', t, { c, a, b }); }
    return c;
  }
  function coalesce() {
    const t = pk(); const l = binary(0);
    if (is('??')) { i++; const r = is('throw') ? throwExpr() : coalesce(); return node('Bin', t, { op: '??', l, r }); }
    return l;
  }
  function throwExpr() { const t = nx(); return node('Throw', t, { e: expr() }); }
  const LEVELS = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '>', '<=', '>=', 'is', 'as'], ['<<', '>>'], ['+', '-'], ['*', '/', '%']];
  function binary(lv) {
    if (lv >= LEVELS.length) return switchExpr();
    let l = binary(lv + 1);
    for (;;) {
      const tk = pk(); let op = (tk.t === 'op' || tk.t === 'kw') ? tk.v : null;
      if (lv === 7 && op === '>' && is('>', 1) && tk.adj && !is('=', 2)) op = '>>';
      else if (lv === 7 && op === '>') op = null;
      if (lv === 6 && op === '>' && is('>', 1) && tk.adj) op = null;
      if (!op || !LEVELS[lv].includes(op)) return l;
      if (op === '>>') i += 2; else i++;
      if (op === 'is') { const p = pattern(); l = node('Is', tk, { e: l, pat: p }); continue; }
      if (op === 'as') { const ty = type(); l = node('As', tk, { e: l, type: ty }); continue; }
      const r = binary(lv + 1);
      l = node('Bin', tk, { op, l, r });
    }
  }
  function switchExpr() {
    let e = unary();
    while (is('switch') && is('{', 1)) {
      const t = nx(); eat('{'); const arms = [];
      while (!is('}')) { const at = pk(); const pat = pattern(); let when = null; if (isId(0, 'when')) { i++; when = expr(); } eat('=>'); const r = is('throw') ? throwExpr() : expr(); arms.push({ pat, when, e: r, line: at.line }); if (!opt(',')) break; }
      eat('}'); e = node('SwitchExpr', t, { e, arms });
    }
    return e;
  }
  function pattern() { return orPat(); }
  function orPat() { let l = andPat(); while (isId(0, 'or')) { const t = nx(); l = node('PatOr', t, { a: l, b: andPat() }); } return l; }
  function andPat() { let l = notPat(); while (isId(0, 'and')) { const t = nx(); l = node('PatAnd', t, { a: l, b: notPat() }); } return l; }
  function notPat() { if (isId(0, 'not')) { const t = nx(); return node('PatNot', t, { p: notPat() }); } return primPat(); }
  function primPat() {
    const t = pk();
    if (isId(0, '_') && !is('.', 1)) { i++; return node('PatAny', t); }
    if (is('null')) { i++; return node('PatConst', t, { e: node('Lit', t, { v: null }) }); }
    if (isId(0, 'var')) { i++; return node('PatVar', t, { name: ident() }); }
    if (t.t === 'op' && ['<', '>', '<=', '>='].includes(t.v)) { i++; return node('PatRel', t, { op: t.v, e: binary(7) }); }
    if (is('(')) { const s = i; i++; try { const p = pattern(); eat(')'); return p; } catch (e) { if (!(e instanceof CsError)) throw e; i = s; } }
    // type pattern with designation?
    const s = i; const ty = tryType();
    if (ty && isId() && !isId(0, 'when') && !isId(0, 'and') && !isId(0, 'or')) return node('PatType', t, { type: ty, name: ident() });
    if (ty && (pk().t !== 'op' || [')', ':', ',', '=>', '}'].includes(pk().v) || isId(0, 'when')) && !(pk().t === 'op' && pk().v === '.')) {
      // could be a type name or a constant (enum member, const) – decided at runtime
      i = s; const e = binary(7); return node('PatTypeOrConst', t, { type: ty, e });
    }
    i = s; return node('PatConst', t, { e: binary(7) });
  }
  function unary() {
    const t = pk();
    if (t.t === 'op') {
      if (['-', '+', '!', '~'].includes(t.v)) { i++; return node('Un', t, { op: t.v, e: unary() }); }
      if (t.v === '++' || t.v === '--') { i++; const e = unary(); return node('PreInc', t, { op: t.v, e }); }
      if (t.v === '(') { const c = tryCast(); if (c) return c; }
      if (t.v === '^') { i++; return node('FromEnd', t, { e: unary() }); }
    }
    if (isId(0, 'await')) { i++; return unary(); }
    return postfix(primary());
  }
  function tryCast() {
    const s = i; i++;
    const ty = tryType();
    if (ty && is(')')) {
      i++; const a = pk();
      const prim = PRIMS.has(ty.n) || ty.n === '[]' || ty.n === '?';
      const startsOperand = a.t === 'id' || a.t === 'num' || a.t === 'str' || a.t === 'chr' || a.t === 'istr' || (a.t === 'kw' && !['is', 'as', 'switch', 'in'].includes(a.v)) || (a.t === 'op' && ['(', '!', '~'].includes(a.v));
      if (startsOperand || (prim && a.t === 'op' && ['-', '+', '++', '--'].includes(a.v))) return node('Cast', T[s], { type: ty, e: unary() });
    }
    i = s; return null;
  }
  function args() {
    eat('('); const a = [];
    if (!is(')')) do {
      const t = pk(); let mod = null;
      if (isId() && is(':', 1) && !is('::', 1)) { i += 2; }
      if (is('ref') || is('out') || is('in')) mod = nx().v;
      if (mod === 'out' && (isId(0, 'var') || pk().t === 'kw' || isId()) ) {
        const s = i; const ty = tryType();
        if (ty && isId() && (is(',', 1) || is(')', 1))) { const nt = pk(); a.push({ mod, decl: { type: ty, name: ident(), line: nt.line, col: nt.col }, line: t.line, col: t.col }); continue; }
        i = s;
      }
      a.push({ mod, e: expr(), line: t.line, col: t.col });
    } while (opt(','));
    eat(')'); return a;
  }
  function postfix(e) {
    for (;;) {
      const t = pk();
      if (is('.')) {
        i++; const nt = pk(); const n = ident();
        if (is('<') && isGenericCall()) { i++; const ta = []; ta.push(type()); while (opt(',')) ta.push(type()); eat('>'); e = node('Member', nt, { obj: e, n, targs: ta }); continue; }
        e = node('Member', nt, { obj: e, n }); continue;
      }
      if (is('?.')) { i++; const nt = pk(); const n = ident(); e = node('Member', nt, { obj: e, n, nc: true }); continue; }
      if (is('(')) { const a = args(); e = node('Call', t, { fn: e, args: a }); continue; }
      if (is('[')) { i++; const ix = [expr()]; while (opt(',')) ix.push(expr()); eat(']'); e = node('Index', t, { obj: e, ix }); continue; }
      if (is('?') && is('[', 1)) { i += 2; const ix = [expr()]; eat(']'); e = node('Index', t, { obj: e, ix, nc: true }); continue; }
      if (is('++') || is('--')) { i++; e = node('PostInc', t, { op: t.v, e }); continue; }
      if (is('!') && (is(')', 1) || is('.', 1) || is(';', 1) || is(',', 1))) { i++; continue; }
      return e;
    }
  }
  function isGenericCall() { const s = i; i++; let ok = false; try { type(); while (opt(',')) type(); ok = is('>') && is('(', 1); } catch (e) { if (!(e instanceof CsError)) throw e; } i = s; return ok; }
  function arrayInit() {
    const t = pk(); eat('{'); const items = [];
    while (!is('}')) { items.push(is('{') ? arrayInit() : expr()); if (!opt(',')) break; }
    eat('}'); return node('ArrInit', t, { items });
  }
  function objInit() {
    // after 'new T(...)' : { A = 1, B = 2 } or { 1, 2, 3 } or { {"a",1} } or { ["a"] = 1 }
    const t = pk(); eat('{'); const items = []; let kind = null;
    while (!is('}')) {
      if (isId() && is('=', 1)) { const nt = pk(); const n = ident(); i++; const v = is('{') ? objInitValue() : expr(); items.push({ k: 'set', n, v, line: nt.line }); kind = 'obj'; }
      else if (is('[')) { i++; const key = expr(); eat(']'); eat('='); items.push({ k: 'idx', key, v: expr() }); kind = 'coll'; }
      else if (is('{')) { const it = pk(); i++; const a = [expr()]; while (opt(',')) a.push(expr()); eat('}'); items.push({ k: 'add', args: a, line: it.line }); kind = 'coll'; }
      else { items.push({ k: 'add', args: [expr()] }); kind = 'coll'; }
      if (!opt(',')) break;
    }
    eat('}'); return node('ObjInit', t, { items, kind });
  }
  function objInitValue() { return node('ObjInitNested', pk(), { init: objInit() }); }
  function primary() {
    const t = pk();
    switch (t.t) {
      case 'num': i++; return node('Lit', t, { num: t.v });
      case 'str': i++; return node('Lit', t, { v: t.v });
      case 'chr': i++; return node('Lit', t, { chr: t.v });
      case 'istr': {
        i++; const parts = t.v.map(p => {
          if (typeof p === 'string') return p;
          const sub = parse.expr(p.code, p.line - 1, p.col - 1);
          return { e: sub, align: p.align ? parse.expr(p.align, p.line - 1, p.col - 1) : null, fmt: p.fmt };
        });
        return node('Interp', t, { parts });
      }
      case 'id': {
        i++;
        if (t.v === 'nameof' && is('(')) { i++; let last = t.v; let d = 1; while (d > 0) { const x = nx(); if (x.v === '(') d++; else if (x.v === ')') d--; else if (x.t === 'id') last = x.v; } return node('Lit', t, { v: last }); }
        return node('Name', t, { n: CS.ALIAS[t.v] && is('.') ? CS.ALIAS[t.v] : t.v });
      }
      case 'kw':
        switch (t.v) {
          case 'true': i++; return node('Lit', t, { v: true });
          case 'false': i++; return node('Lit', t, { v: false });
          case 'null': i++; return node('Lit', t, { v: null });
          case 'this': i++; return node('This', t);
          case 'base': i++; return node('Base', t);
          case 'typeof': { i++; eat('('); const ty = type(); eat(')'); return node('TypeOf', t, { type: ty }); }
          case 'default': { i++; if (opt('(')) { const ty = type(); eat(')'); return node('Default', t, { type: ty }); } return node('Default', t, { type: null }); }
          case 'new': return newExpr();
          case 'throw': return throwExpr();
          case 'delegate': { i++; const ps = is('(') ? params() : []; return node('Lambda', t, { params: ps, body: block() }); }
          case 'checked': case 'unchecked': { i++; eat('('); const e = expr(); eat(')'); return e; }
        }
        if (PRIMS.has(t.v)) { i++; return node('TypeRef', t, { type: { n: t.v } }); }
        fail('CS1525', `Invalid expression term '${t.v}'`);
      case 'op':
        if (t.v === '(') {
          i++;
          // tuple?
          const e = expr();
          if (is(',')) { const items = [e]; while (opt(',')) items.push(expr()); eat(')'); return node('Tuple', t, { items }); }
          eat(')'); return node('Paren', t, { e });
        }
        if (t.v === '[') { i++; const items = []; while (!is(']')) { if (is('..')) { i++; items.push(node('Spread', pk(), { e: expr() })); } else items.push(expr()); if (!opt(',')) break; } eat(']'); return node('CollExpr', t, { items }); }
        fail('CS1525', `Invalid expression term '${t.v}'`);
      case 'eof': fail('CS1733', 'Expected expression');
    }
    fail('CS1525', `Invalid expression term '${t.v}'`);
  }
  function newExpr() {
    const t = nx();
    if (is('(')) { const a = args(); let init = null; if (is('{')) init = objInit(); return node('New', t, { type: null, args: a, init }); }
    if (is('[') && is(']', 1)) { i += 2; const init = arrayInit(); return node('NewArr', t, { el: null, sizes: [], rank: 1, init }); }
    // parse element / class type without array ranks
    const s = i; let ty;
    { const tk = pk(); if (tk.t === 'kw' && PRIMS.has(tk.v)) { i++; ty = { n: tk.v }; } else { ty = type(); if (ty.n === '[]') { /* new int[] {..} parsed by type() */ const init = is('{') ? arrayInit() : null; if (!init) fail('CS1586', 'Array creation must have array size or array initializer'); let el = ty, ranks = []; while (el.n === '[]') { ranks.push(el.r); el = el.el; } return node('NewArr', t, { el: ranks.length > 1 ? wrapRanks(el, ranks.slice(1)) : el, sizes: [], rank: ranks[0], init }); } } }
    if (is('?')) { i++; ty = { n: '?', el: ty }; }
    if (is('[')) {
      if (is(']', 1) || is(',', 1)) { // new int[,] {..} / new int[] {..}
        i++; let r = 1; while (opt(',')) r++; eat(']');
        const extra = []; while (is('[')) { i++; let rr = 1; while (opt(',')) rr++; eat(']'); extra.push(rr); }
        const init = arrayInit(); return node('NewArr', t, { el: extra.length ? wrapRanks(ty, extra) : ty, sizes: [], rank: r, init });
      }
      i++; const sizes = [expr()]; while (opt(',')) sizes.push(expr()); eat(']');
      const extra = []; while (is('[')) { i++; let rr = 1; while (opt(',')) rr++; eat(']'); extra.push(rr); }
      const init = is('{') ? arrayInit() : null;
      return node('NewArr', t, { el: extra.length ? wrapRanks(ty, extra) : ty, sizes, rank: sizes.length, init });
    }
    if (is('(')) { const a = args(); const init = is('{') ? objInit() : null; return node('New', t, { type: ty, args: a, init }); }
    if (is('{')) return node('New', t, { type: ty, args: [], init: objInit() });
    fail('CS1526', 'A new expression requires an argument list or (), [], or {} after type');
  }
  function wrapRanks(el, ranks) { let ty = el; for (let k = ranks.length - 1; k >= 0; k--) ty = { n: '[]', el: ty, r: ranks[k] }; return ty; }

  return {
    unit,
    exprOnly() { const e = expr(); if (pk().t !== 'eof') fail('CS1003', `Syntax error, unexpected '${pk().v}'`); return e; }
  };
}
function parse(src) { return makeParser(CS.lex(src)).unit(); }
parse.expr = function (code, lineOff, colOff) { return makeParser(CS.lex(code, lineOff, colOff)).exprOnly(); };
CS.parse = parse;
})(typeof window !== 'undefined' ? window : globalThis);
