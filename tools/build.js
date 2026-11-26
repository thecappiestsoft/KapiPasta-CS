#!/usr/bin/env node
/* Build & verify KapiPasta - C# course content.
   Reads content/pl/*.js (full Polish course) and content/en/*.js (English overrides keyed by lesson id),
   RUNS every example, quiz, fill-in, bug and solution with the same interpreter the browser uses (KapiSharp / KapiWPF),
   and writes js/data/course.js.
   Usage:  node tools/build.js          # verify + build
           node tools/build.js --check  # verify only (exit 1 on problems)                                   */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const CS = require('./cs.js'); const WPF = CS.WPF;
const CHECK = process.argv.includes('--check');
const problems = []; let lang = 'pl';
const P = (w, m) => problems.push(`[${lang}] ${w}: ${m}`);
const norm = s => String(s || '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
const clone = o => JSON.parse(JSON.stringify(o));

function load(dir, sandbox) {
  const files = fs.readdirSync(path.join(ROOT, 'content', dir)).filter(f => f.endsWith('.js')).sort();
  for (const f of files) { const p = path.join(ROOT, 'content', dir, f); vm.runInNewContext(fs.readFileSync(p, 'utf8'), Object.assign(sandbox, { c: String.raw, console }), { filename: p }); }
  return sandbox;
}
const run = (code, inp = '', files = {}) => CS.run(code, { stdin: inp, files: Object.assign({}, files), maxSteps: 3000000 });
function fmtErr(r, file = 'Program.cs') {
  if (r.kind === 'internal' || /KapiSharp internal error|\/home\/|\.js:\d+/.test(String(r.err || ''))) P('interpreter', 'internal error leaked into course data: ' + String(r.err).slice(0, 160));
  if (r.kind === 'compile') return `${file}(${r.line},${r.col}): error ${r.etype}: ${r.msg}`;
  if (r.kind === 'runtime') return `${r.err}${r.line ? `\n   at Program.Main() in ${file}:line ${r.line}` : ''}`;
  if (r.kind === 'timeout') return 'Timeout';
  return r.err;
}
const DEFAULT_CS = `using System.Windows;\npublic partial class MainWindow : Window\n{\n    public MainWindow()\n    {\n        InitializeComponent();\n    }\n}`;
function wpfStart(files, opts = {}) {
  let err = null; const app = new WPF.App(Object.assign({ files, onError: e => { err = e; } }, opts));
  try { app.start(); } catch (e) { err = e; }
  return { app, err };
}
function wpfErr(e) {
  if (e instanceof WPF.XamlError) return { kind: 'xaml', line: e.line, code: e.code, msg: e.message, file: e.file || 'MainWindow.xaml', text: `${e.file || 'MainWindow.xaml'}(${e.line},${e.col}): ${e.code === 'XML' ? 'XmlException' : 'error ' + e.code}: ${e.message}` };
  if (e instanceof CS.CsError) return { kind: 'compile', line: e.line, code: e.code, msg: e.message, text: `MainWindow.xaml.cs(${e.line},${e.col}): error ${e.code}: ${e.message}` };
  if (e instanceof CS.CsThrow) return { kind: 'runtime', line: e.line, code: e.ex.cls.name, msg: e.ex.f.Message, text: `Unhandled exception. System.${e.ex.cls.name}: ${e.ex.f.Message}` };
  return { kind: 'internal', line: 0, code: 'Internal', msg: String(e && e.stack || e), text: String(e) };
}
function wpfCheck(t, files) {
  const { app, err } = wpfStart(files, { autoAnswer: t.answers });
  if (err) return 'start error: ' + wpfErr(err).text;
  try { const ui = app.ui(); const msg = new Function('ui', 'app', t.ui)(ui, app); if (app.error) return 'runtime: ' + wpfErr(app.error).text; return msg || ''; } catch (e) { return 'check threw: ' + e.message; }
}
function runChecks(t, code) {
  const tests = t.tests && t.tests.length ? t.tests : [{ i: '', o: null }];
  for (const tc of tests) {
    const r = run(code, tc.i, t.files);
    if (r.err) return `error: ${fmtErr(r)}`;
    if (t.check) { const m = new Function('src', 'out', 'files', 'input', t.check)(code, r.out, r.files || {}, tc.i); if (m) return 'check: ' + m; }
    if (tc.o !== null && tc.o !== undefined && norm(r.out) !== norm(tc.o)) return `output ${JSON.stringify(norm(r.out))} != ${JSON.stringify(norm(tc.o))}`;
  }
  return '';
}
let ntask = 0;
function verify(CH) {
  const ids = new Set();
  for (const ch of CH) for (const L of ch.lessons) {
    if (ids.has(L.id)) P(L.id, 'duplicate lesson id'); ids.add(L.id);
    L.ex.forEach((ex, i) => {
      const w = `${L.id} ex${i}`;
      if (!ex.scene) P(w, 'missing scene');
      if (ex.wpf) { const { err } = wpfStart(ex.wpf); if (err) P(w, 'wpf example error ' + wpfErr(err).text); return; }
      const r = run(ex.code, ex.inp || '', ex.files);
      if (r.err && !(ex.scene && ex.scene.s === 'err' && !ex.scene.caught) && !ex.allowErr) P(w, 'example error ' + fmtErr(r));
      ex.out = norm(r.out);
      if (r.err) { ex.err = r.kind === 'compile' ? `error ${r.etype}: ${r.msg}` : r.err; }
    });
    L.tasks.forEach((t, j) => {
      ntask++;
      const w = `${L.id} t${j} (${t.t})`;
      t.id = `${L.id}-${j}`;
      if (![1, 2, 3].includes(t.l)) P(w, 'bad level');
      if (!t.q) P(w, 'missing q');
      const xaml = t.lang === 'xaml';
      switch (t.t) {
        case 'quiz': {
          if (!(t.a >= 0 && t.a < t.opts.length)) P(w, 'bad answer index');
          if (new Set(t.opts).size !== t.opts.length) P(w, 'duplicate opts');
          if (t.opts.some(o => !String(o).trim())) P(w, 'empty option');
          if (t.out) { const r = run(t.code, t.inp || ''); if (r.err) P(w, 'quiz code error ' + fmtErr(r)); const o = norm(r.out); if (o !== norm(t.opts[t.a])) P(w, `answer mismatch: got ${JSON.stringify(o)} vs ${JSON.stringify(t.opts[t.a])}`); t.opts.forEach((op, k) => { if (k !== t.a && norm(op) === o) P(w, 'another option also correct'); }); }
          if (t.err) { const r = xaml ? null : run(t.code, t.inp || ''); const et = xaml ? wpfErr(wpfStart({ 'MainWindow.xaml': t.code, 'MainWindow.xaml.cs': t.cs || DEFAULT_CS }).err || {}).code : r.etype; if (et !== t.opts[t.a]) P(w, `error type mismatch: got ${et} vs ${t.opts[t.a]}`); }
          if (t.compiles !== undefined) { const r = run(t.code); const ok = r.kind !== 'compile'; if (ok !== t.compiles) P(w, `compiles=${ok} expected ${t.compiles} ${r.err || ''}`); }
          break;
        }
        case 'fill': {
          if ((t.code.match(/___/g) || []).length !== t.ans.length) P(w, 'blank count mismatch');
          let k = 0; const full = t.code.replace(/___/g, () => t.ans[k++][0]);
          if (t.run === false) break;
          if (xaml) { const { err } = wpfStart({ 'MainWindow.xaml': full, 'MainWindow.xaml.cs': t.cs || DEFAULT_CS }); if (err) P(w, 'filled xaml error ' + wpfErr(err).text); break; }
          const r = run(full, t.inp || ''); if (r.err) P(w, 'filled code error ' + fmtErr(r));
          if (t.expect !== undefined && norm(r.out) !== norm(t.expect)) P(w, `filled output ${JSON.stringify(norm(r.out))} != ${JSON.stringify(t.expect)}`);
          break;
        }
        case 'bug': {
          const lines = t.code.split('\n'); if (t.line < 0 || t.line >= lines.length) { P(w, 'bad line'); break; }
          if (xaml) {
            const files = { 'MainWindow.xaml': t.code, 'MainWindow.xaml.cs': t.cs || DEFAULT_CS };
            const { err } = wpfStart(files); if (!err) { P(w, 'xaml bug does not error'); break; }
            const e = wpfErr(err); if (e.line !== t.line + 1 && !t.cause) P(w, `xaml error on line ${e.line}, expected ${t.line + 1}: ${e.text}`);
            t.err = e.text; t.ekind = 'xaml';
            if (t.fixcheck === false) break;
            const fixed = lines.slice(); fixed[t.line] = lines[t.line].replace(/^(\s*).*$/, '$1') + t.fix.trim(); const r2 = wpfStart({ 'MainWindow.xaml': fixed.join('\n'), 'MainWindow.xaml.cs': t.cs || DEFAULT_CS }); if (r2.err) P(w, 'fix does not work: ' + wpfErr(r2.err).text);
            break;
          }
          const r = run(t.code, t.inp || '');
          if (t.noerr) { if (r.err) P(w, 'logic bug program errors: ' + fmtErr(r)); t.got = norm(r.out); delete t.err; }
          else { if (!r.err) { P(w, 'bug program does not error'); break; } if (r.line !== t.line + 1 && !t.cause) P(w, `error on line ${r.line}, expected ${t.line + 1}: ${fmtErr(r)}`); t.err = fmtErr(r); t.ekind = r.kind; }
          if (t.fixcheck === false) break;
          const fixed = lines.slice(); fixed[t.line] = lines[t.line].replace(/^(\s*).*$/, '$1') + t.fix.trim();
          const r2 = run(fixed.join('\n'), t.inp || ''); if (r2.err) P(w, 'fix does not work: ' + fmtErr(r2));
          if (t.noerr && t.expect !== undefined && norm(r2.out) !== norm(t.expect)) P(w, `fixed output ${JSON.stringify(norm(r2.out))} != ${JSON.stringify(t.expect)}`);
          break;
        }
        case 'code': {
          if (t.wpf) { const m = wpfCheck(t, t.sol); if (m) P(w, 'solution fails: ' + m); if (!wpfCheck(t, t.start)) P(w, 'start code already passes'); break; }
          const m = runChecks(t, t.sol); if (m) P(w, 'solution fails: ' + m);
          if (!runChecks(t, t.start)) P(w, 'start code already passes');
          break;
        }
        default: P(w, 'unknown type ' + t.t);
      }
    });
  }
}
function merge(base, tr) {
  const out = clone(base);
  for (const ch of out) {
    const tc = tr.ch[ch.id]; if (!tc) P(ch.id, 'missing chapter translation'); else for (const k in tc) ch[k] = tc[k];
    for (const L of ch.lessons) {
      const tl = tr.les[L.id]; if (!tl) { P(L.id, 'missing lesson translation'); continue; }
      for (const k of ['title', 'theory', 'more']) if (tl[k] !== undefined) L[k] = tl[k];
      if (tl.ex) { if (tl.ex.length !== L.ex.length) P(L.id, `ex count ${tl.ex.length} != ${L.ex.length}`); tl.ex.forEach((e, i) => { if (!L.ex[i]) return; const { cap, scene, ...rest } = e; Object.assign(L.ex[i], rest); if (scene) L.ex[i].scene = Object.assign({}, L.ex[i].scene, scene); if (cap !== undefined) L.ex[i].scene.cap = cap; }); }
      if (tl.tasks) { if (tl.tasks.length !== L.tasks.length) P(L.id, `task count ${tl.tasks.length} != ${L.tasks.length}`); tl.tasks.forEach((t, i) => { if (L.tasks[i]) Object.assign(L.tasks[i], t); }); }
      else if (L.tasks.length) P(L.id, 'missing task translations');
    }
  }
  return out;
}
/* extra tasks: content/pl/part5+ call X('lessonId', [[plTask, enOverrides], ...]) – appended at the end of the lesson
   (never reorder published tasks: task ids are lessonId-index) */
const EXTRA = [], EXTRA_LES = [];
const X = (lessonId, tasks) => EXTRA.push({ lessonId, tasks });
/* XL('chapterId', plLesson, enLesson): a new lesson appended at the end of a chapter (tasks come from X) */
const XL = (chId, pl, en) => EXTRA_LES.push({ chId, pl, en });
const PL = load('pl', { CH: [], X, XL }).CH;
for (const { chId, pl } of EXTRA_LES) { const ch = PL.find(c => c.id === chId); if (!ch) { P(chId, 'XL(): unknown chapter'); continue; } ch.lessons.push(Object.assign({ tasks: [] }, pl)); }
const EXTRA_EN = {};
for (const { lessonId, tasks } of EXTRA) {
  const L = PL.flatMap(ch => ch.lessons).find(l => l.id === lessonId); if (!L) { P(lessonId, 'X(): unknown lesson'); continue; }
  for (const [pl, en] of tasks) { L.tasks.push(pl); (EXTRA_EN[lessonId] = EXTRA_EN[lessonId] || []).push(en || {}); }
}
/* every chapter: 15 basic + 15 intermediate + 10 advanced tasks (40) – so a chapter grade 1-6 is easy to read */
const PER_LEVEL = [15, 15, 10];
for (const ch of PL) { const c = [0, 0, 0]; ch.lessons.forEach(L => L.tasks.forEach(t => c[t.l - 1]++)); if (c.join() !== PER_LEVEL.join()) P(ch.id, `tasks per level ${c.join('/')} (expected ${PER_LEVEL.join('/')})`); }
lang = 'pl'; verify(PL);
const hasEN = fs.readdirSync(path.join(ROOT, 'content', 'en')).some(f => f.endsWith('.js'));
let EN = [];
if (hasEN && !process.argv.includes('--pl')) { const TRS = load('en', { TR: { ch: {}, les: {} } }).TR; for (const { pl, en } of EXTRA_LES) TRS.les[pl.id] = Object.assign({}, en, { tasks: [] }); for (const id in EXTRA_EN) { const tl = TRS.les[id] || (TRS.les[id] = {}); tl.tasks = (tl.tasks || []).concat(EXTRA_EN[id]); } lang = 'en'; EN = merge(PL, TRS); verify(EN); }
else console.log('(EN skipped)');
// seal answers: the browser gets hashes for checking and a sealed blob for texts shown after answering (js/seal.js)
const Seal = require('../js/seal.js');
function shuffleSeeded(arr, seed) { const a = arr.slice(); let x = 0; for (const ch of seed) x = (Math.imul(x ^ ch.charCodeAt(0), 16777619) + 0x9e3779b9) >>> 0; for (let i = a.length - 1; i > 0; i--) { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; const j = x % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const SECRET = ['a', 'ans', 'line', 'sol', 'fix', 'why', 'expect'];
function sealCourse(C, lg) {
  const out = clone(C);
  for (const ch of out) for (const L of ch.lessons) for (const t of L.tasks) {
    const sec = {}; for (const k of SECRET) if (t[k] !== undefined) sec[k] = t[k];
    if (t.t === 'quiz') { t.ah = Seal.h(t.id, t.opts[t.a]); delete sec.a; t.opts = shuffleSeeded(t.opts, t.id); }
    if (t.t === 'fill') { t.ansh = t.ans.map((v, i) => v.map(x => Seal.h(t.id + '#' + i, Seal.nrm(x)))); t.answ = t.ans.map(v => Math.max(...v.map(x => x.length))); }
    if (t.t === 'bug') t.lh = Seal.h(t.id, t.line);
    if (t.t === 'code' && !t.wpf) t.rl = /ReadLine/.test(t.sol) ? 1 : 0;
    for (const k of SECRET) delete t[k];
    t.lg = lg; t.x = Seal.seal(t.id + '/' + lg, sec);
  }
  return out;
}
// self-test: every sealed task opens back to the same answers and the hashes match
function sealSelfTest(C, S) {
  C.forEach((ch, ci) => ch.lessons.forEach((L, li) => L.tasks.forEach((t, ti) => {
    const st = S[ci].lessons[li].tasks[ti]; const o = Seal.open(st);
    for (const k of SECRET) if (k !== 'a' && JSON.stringify(o[k]) !== JSON.stringify(t[k])) P(t.id, 'seal round-trip failed for ' + k);
    if (t.t === 'quiz' && Seal.h(t.id, t.opts[t.a]) !== st.ah) P(t.id, 'quiz hash');
    if (t.t === 'bug' && Seal.h(t.id, t.line) !== st.lh) P(t.id, 'bug hash');
    for (const k of SECRET) if (k in st) P(t.id, 'answer field left in output: ' + k);
  })));
}
const PLs = sealCourse(PL, 'pl'), ENs = sealCourse(EN, 'en'); sealSelfTest(PL, PLs); sealSelfTest(EN, ENs);
console.log(`chapters: ${PL.length}, lessons: ${PL.reduce((a, c) => a + c.lessons.length, 0)}, tasks: ${PL.reduce((a, c) => a + c.lessons.reduce((b, L) => b + L.tasks.length, 0), 0)} (checked ${ntask} incl. EN)`);
if (problems.length) { console.log(`\n${problems.length} problem(s):`); problems.forEach(p => console.log(' - ' + p)); process.exit(1); }
if (!CHECK) {
  const js = '// GENERATED by tools/build.js – do not edit by hand. Edit content/*/ and run: node tools/build.js\nwindow.COURSE = ' + JSON.stringify({ pl: PLs, en: ENs }) + ';\n';
  fs.writeFileSync(path.join(ROOT, 'js', 'data', 'course.js'), js);
  console.log('written js/data/course.js', Math.round(js.length / 1024) + ' KB');
} else console.log('OK');
