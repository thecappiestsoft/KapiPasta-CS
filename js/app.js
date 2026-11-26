/* ================= KapiPasta - C# ================= */
const LS = 'cskapi-v1', LST = 'cskapi-teacher-v1';
const DEF = { onboarded: false, name: '', cls: '', stage: 1, theme: 'pirate', ide: 'vs', mode: null, lang: 'pl', sound: true, unlockAll: false,
  xp: 0, done: {}, stars: {}, badges: {}, streak: { last: '', n: 0 }, today: { d: '', xp: 0 }, combo: 0, bestCombo: 0, codeRuns: 0, sbRuns: 0, drafts: {}, proofs: {}, time: {}, away: {}, created: 0, lastSeen: 0 };
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
let S = Object.assign({}, DEF, lsGet(LS) || {});
if (!['pirate', 'kitchen', 'hero'].includes(S.theme)) S.theme = 'pirate';
if (!['vs', 'vscode'].includes(S.ide)) S.ide = 'vs';
const normStage = v => ([1, 2, 3].includes(+v) ? +v : 1);
S.stage = normStage(S.stage);
if (!S.mode) S.mode = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
const save = () => { S.lastSeen = Date.now(); lsSet(LS, S); };
window.S = S;

function tr(k, p) {
  let s = (UI[S.lang] && UI[S.lang][k] !== undefined) ? UI[S.lang][k] : (UI.pl[k] !== undefined ? UI.pl[k] : k);
  if (p && typeof s === 'string') for (const x in p) s = s.split('{' + x + '}').join(p[x]);
  return s;
}
window.tr = tr;
const pick = a => a[Math.floor(Math.random() * a.length)];
const W = () => WORDS[S.theme][S.lang] || WORDS[S.theme].pl;
const COURSE_DATA = window.COURSE; try { delete window.COURSE; } catch (e) { window.COURSE = undefined; }
const course = () => (COURSE_DATA[S.lang] && COURSE_DATA[S.lang].length) ? COURSE_DATA[S.lang] : COURSE_DATA.pl;
/* answers are sealed by tools/build.js (js/seal.js): check by hash, open texts only when needed */
const sec = t => Seal.open(t);
const isRightOpt = (t, oi) => Seal.h(t.id, t.opts[oi]) === t.ah;
const todayStr = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const stageTasks = L => L.tasks.filter(t => t.l <= S.stage);
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L').replace(/[#+]/g, 's').split(/[^A-Za-z0-9]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join('').slice(0, 26);
const fname = (ci, li, L) => `${String(li + 1).padStart(2, '0')}_${slug(L.title)}.cs`;
const chName = ch => ch.name[S.theme];
const projName = (ci, ch) => `${String(ci + 1).padStart(2, '0')}.${slug(ch.name.neutral || ch.name[S.theme])}`;

/* ===== progress math ===== */
/* lesson stars show how much is done: ★ from 1/3 of the tasks, ★★ from 2/3, ★★★ = 100%.
   The capybara in a mortarboard (perfect) = 100% and every task right at the first try. */
function starsFor(ts, done) {
  const n = ts.length, d = ts.filter(t => done[t.id] && done[t.id].ok).length, first = ts.filter(t => done[t.id] && done[t.id].ok && done[t.id].first).length;
  const r = n ? d / n : 1; const stars = r >= 1 ? 3 : r >= 2 / 3 ? 2 : r >= 1 / 3 ? 1 : 0;
  return { d, n, first, stars, perfect: n > 0 && d === n && first === n };
}
function lessonStars(L) { const ts = stageTasks(L); if (!ts.length) return null; const st = starsFor(ts, S.done); return st.d ? st : null; }
const perfectIco = big => `<i class="cpy-grad ${big ? 'big' : ''}" title="${esc(tr('perfectTip'))}" aria-label="${esc(tr('perfectTip'))}"></i>`;
function starsHtml(st, big) { const h = `${'★'.repeat(st.stars)}<i>${'☆'.repeat(3 - st.stars)}</i>${st.perfect ? perfectIco() : ''}`; return big ? h : `<span class="stars ${st.stars === 3 ? 'max' : ''}" title="${esc(tr('starsTip', { d: st.d, n: st.n, f: st.first }))}">${h}</span>`; }
/* time spent on tasks: counted while the task is on screen and the tab is visible; one stretch counts at most 10 min */
const TT = { id: null, since: 0 };
const TT_CAP = 10 * 60 * 1000;
function timeTick(id) {
  const now = Date.now();
  if (TT.id && !(S.done[TT.id] && S.done[TT.id].ok)) { S.time = S.time || {}; S.time[TT.id] = (S.time[TT.id] || 0) + Math.min(now - TT.since, TT_CAP); }
  TT.id = id && !(S.done[id] && S.done[id].ok) ? id : null; TT.since = now;
}
function taskSec(id) { const d = S.done[id]; if (d && d.sec !== undefined) return d.sec; return Math.round(((S.time || {})[id] || 0) / 1000); }
function fmtDur(sec) { sec = Math.round(sec || 0); if (sec < 60) return sec + ' s'; const m = Math.floor(sec / 60); if (m < 60) return m + ' min' + (sec % 60 && m < 10 ? ' ' + (sec % 60) + ' s' : ''); return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min'; }
/* leaving the app during a task (other tab, other window, minimised): counted per task and shown to the teacher */
const AW = { id: null, since: 0 };
function taskOnScreen() { const t = V.view === 'lesson' && V.phase === 'tasks' && typeof curTask === 'function' ? curTask() : null; return t && !(S.done[t.id] && S.done[t.id].ok) ? t : null; }
function goneAway() {
  if (AW.id) return; const t = taskOnScreen(); timeTick(null); if (!t) return;
  AW.id = t.id; AW.since = Date.now(); S.away = S.away || {}; const a = S.away[t.id] || (S.away[t.id] = { n: 0, ms: 0 }); a.n++; save();
}
function cameBack() {
  if (document.hidden || !document.hasFocus()) return;
  if (AW.id) { const a = (S.away || {})[AW.id]; if (a) a.ms += Math.min(Date.now() - AW.since, 4 * 3600 * 1000); const t = taskOnScreen(); if (t && t.id === AW.id) toast('👀 ' + tr('awayNote', { n: a ? a.n : 1 }), 4000); AW.id = null; save(); }
  const t = taskOnScreen(); timeTick(t ? t.id : null);
}
document.addEventListener('visibilitychange', () => { if (document.hidden) goneAway(); else cameBack(); });
window.addEventListener('blur', () => setTimeout(() => { if (!document.hasFocus()) goneAway(); }, 150));
window.addEventListener('focus', cameBack);
function awayOf(id) { const a = (S.away || {})[id]; return a ? { n: a.n, sec: Math.round(a.ms / 1000) } : { n: 0, sec: 0 }; }
window.addEventListener('pagehide', () => { timeTick(null); save(); });
function lessonProg(L) { const ts = stageTasks(L); const d = ts.filter(t => S.done[t.id] && S.done[t.id].ok).length; return { d, n: ts.length }; }
function chapProg(ch) { let d = 0, n = 0; ch.lessons.forEach(L => { const p = lessonProg(L); d += p.d; n += p.n; }); return { d, n, p: n ? d / n : 0 }; }
function unlocked(ci) { if (ci === 0 || S.unlockAll) return true; return chapProg(course()[ci - 1]).p >= 0.5; }
const LVT = k => 50 * k * (k + 1);
function levelOf(xp) { let l = 0; while (xp >= LVT(l + 1)) l++; return { lv: l + 1, cur: xp - LVT(l), need: LVT(l + 1) - LVT(l) }; }
const lvTitle = lv => W().lv[Math.min(lv - 1, 9)];
function statsOf(st) {
  const C = course(); let okCount = 0, first = 0, codeOk = 0, bugOk = 0, wpfOk = 0;
  const types = {}; C.forEach(ch => ch.lessons.forEach(L => L.tasks.forEach(t => types[t.id] = t)));
  for (const id in st.done) { const d = st.done[id]; if (d.ok) { okCount++; if (d.first) first++; const t = types[id]; if (t && t.t === 'code') codeOk++; if (t && t.t === 'bug') bugOk++; if (t && (t.wpf || t.lang === 'xaml')) wpfOk++; } }
  const perfect = Object.values(st.stars || {}).filter(x => x >= 3).length;
  return { okCount, first, codeOk, bugOk, wpfOk, perfect, bestCombo: st.bestCombo || 0, streak: (st.streak && st.streak.n) || 0, xp: st.xp || 0, sbRuns: st.sbRuns || 0 };
}

/* ===== sound / fx ===== */
let AC = null;
function beep(type) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seq = { ok: [[660, .08], [880, .12]], bad: [[220, .15]], lvl: [[523, .1], [659, .1], [784, .1], [1046, .2]], click: [[500, .03]] }[type] || [];
    let t = AC.currentTime;
    seq.forEach(([f, d]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = type === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d); t += d; });
  } catch (e) { }
}
function confetti(n = 60) {
  const cols = { pirate: ['#d9a441', '#2d6a8f', '#e5534b', '#f4e3b1', '#3aa17e'], kitchen: ['#ff6b6b', '#ffd93d', '#6bcb77', '#ff9f43', '#fff'], hero: ['#e53935', '#ffd54f', '#1e88e5', '#8e24aa', '#43a047'] }[S.theme];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div'); c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw'; c.style.background = pick(cols);
    c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; c.style.animationDelay = Math.random() * .4 + 's';
    document.body.appendChild(c); setTimeout(() => c.remove(), 3600);
  }
}
function toast(html, ms = 2600) {
  let box = document.querySelector('.toasts'); if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; box.appendChild(t); setTimeout(() => t.remove(), ms);
}
function kapiSay(msg, mood = 'happy') {
  KAPI = { msg, mood };
  const p = document.getElementById('kp');
  if (p && p.offsetParent !== null) { p.innerHTML = kapiInner(); }
  else toast(`${capy({ size: 44, mood })}<span>${msg}</span>`, 3000);
}
let KAPI = null;
function kapiInner() {
  const k = KAPI || { msg: `<b>${tr('kapiSays')}</b><br>${pick(tr('tips'))}`, mood: 'happy' };
  return `<div class="bubble">${k.msg}</div><div class="kp-capy">${capy({ size: 160, mood: k.mood })}</div>`;
}

/* ===== XP / rewards ===== */
const BASE = { quiz: 10, fill: 15, bug: 15, code: 25 };
function touchStreak() {
  const td = todayStr(); if (S.streak.last === td) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  S.streak.n = (S.streak.last === todayStr(y)) ? S.streak.n + 1 : 1; S.streak.last = td;
}
function addXP(n) {
  const before = levelOf(S.xp).lv; S.xp += n;
  const td = todayStr(); if (S.today.d !== td) S.today = { d: td, xp: 0 };
  const wasGoal = S.today.xp >= 50; S.today.xp += n; touchStreak();
  const after = levelOf(S.xp).lv;
  if (after > before) setTimeout(() => { beep('lvl'); confetti(90); modal(`<div class="mb" style="text-align:center">${capy({ size: 170, mood: 'wow' })}<h2>🎉 ${tr('levelUp')}</h2><h1>${tr('level')} ${after} – ${lvTitle(after)}</h1></div><div class="mf"><button class="btn pri" data-act="close">${tr('ok')}</button></div>`); }, 700);
  if (!wasGoal && S.today.xp >= 50) setTimeout(() => toast('🎯 ' + tr('dailyDone')), 1200);
}
function checkBadges() {
  const st = statsOf(S);
  const all = BADGES.map(b => ({ id: b.id, ico: b.ico, name: b[S.lang][0], ok: b.f(st) }));
  course().forEach(ch => { const p = chapProg(ch); all.push({ id: 'ch_' + ch.id, ico: ch.icon[S.theme], name: chName(ch), ok: p.n > 0 && p.d === p.n }); });
  all.forEach(b => { if (b.ok && !S.badges[b.id]) { S.badges[b.id] = Date.now(); setTimeout(() => { beep('lvl'); toast(`<span style="font-size:26px">${b.ico}</span><span>${tr('newBadge')}<br>${b.name}</span>`, 3500); }, 900); } });
}
function award(t, extra = {}) {
  const prev = S.done[t.id] || { tries: 0 };
  if (prev.ok) { return 0; }
  timeTick(t.id); const sec = Math.round(((S.time || {})[t.id] || 0) / 1000);
  const first = (prev.tries || 0) === 0 && !prev.revealed;
  let xp = BASE[t.t] + (t.l - 1) * 5 + (first ? 5 : 0);
  if (prev.revealed || extra.self) xp = Math.round(xp / 2);
  S.done[t.id] = { ok: 1, first: first ? 1 : 0, tries: (prev.tries || 0) + 1, ts: Date.now(), sec };
  if (first) { S.combo++; S.bestCombo = Math.max(S.bestCombo, S.combo); } else S.combo = 0;
  addXP(xp);
  if (first && S.combo > 0 && S.combo % 5 === 0) { addXP(10); setTimeout(() => toast('🔥 ' + tr('combo', { n: S.combo, xp: 10 })), 500); }
  checkBadges(); save(); beep('ok');
  return xp;
}
function fail(t) { const d = S.done[t.id] || { tries: 0 }; if (!d.ok) { d.tries = (d.tries || 0) + 1; S.done[t.id] = d; } S.combo = 0; save(); beep('bad'); }
function reveal(t) { const d = S.done[t.id] || { tries: 0 }; if (!d.ok) { d.revealed = 1; S.done[t.id] = d; save(); } }

/* ===== syntax highlight (C# + XAML) ===== */
const KW = new Set(('abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while var get set value init record when nameof and or not async await yield partial dynamic global').split(' '));
const CTL = new Set('if else for foreach while do switch case default break continue return throw try catch finally goto yield await when in'.split(' '));
const TYPES = new Set('Console Math Convert List Dictionary Queue Stack HashSet String Int32 Double Random StringBuilder File StreamWriter StreamReader Exception DateTime TimeSpan Array Enum Environment Char KeyValuePair Func Action Window Page Button TextBox TextBlock MessageBox RoutedEventArgs Brushes Colors Canvas Grid StackPanel Thread Enumerable IEnumerable ConsoleColor MouseButtonEventArgs KeyEventArgs Key DispatcherTimer EventArgs SolidColorBrush Color Point'.split(' '));
function hlCs(code) {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(\$@"(?:""|[^"])*"|@\$"(?:""|[^"])*"|@"(?:""|[^"])*"|\$?"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])'?)|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDmMlLuU]*\b)|(#\w+)|([A-Za-z_\u00C0-\u024F][\w\u00C0-\u024F]*)(\s*\()?/g;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index)); last = re.lastIndex;
    if (m[1]) out += `<span class="c">${esc(m[1])}</span>`;
    else if (m[2]) out += m[2].startsWith('$') ? hlInterp(m[2]) : `<span class="s">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="n">${m[3]}</span>`;
    else if (m[4]) out += `<span class="c">${esc(m[4])}</span>`;
    else if (m[5]) {
      const w = m[5]; let cls = '';
      if (CTL.has(w)) cls = 'kc'; else if (KW.has(w)) cls = 'k'; else if (m[6]) cls = 'f'; else if (TYPES.has(w) || /^[A-Z]/.test(w) && /^\s+[a-z_]/.test(code.slice(re.lastIndex, re.lastIndex + 3)) || /^I[A-Z]/.test(w)) cls = 't'; else if (/^[A-Z]/.test(w)) cls = 't2';
      out += (cls ? `<span class="${cls}">${esc(w)}</span>` : esc(w)) + (m[6] ? esc(m[6]) : '');
    }
  }
  return out + esc(code.slice(last));
}
function hlInterp(s) { return `<span class="s">${esc(s).replace(/\{([^{}]*)\}/g, (x, inner) => `</span><span class="ip">{</span>${hlCs(unesc(inner))}<span class="ip">}</span><span class="s">`)}</span>`; }
const unesc = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
function hl(code, lang) { return lang === 'xaml' ? WPF.hlXaml(code, esc) : hlCs(code); }
function fileIco(name) { return /\.xaml$/i.test(name) ? '<span class="fi xa">⟨⟩</span>' : '<span class="fi cs">C#</span>'; }
function codeBlock(code, o = {}) {
  const lines = code.split('\n'); const hlines = hl(code, o.lang).split('\n');
  const gut = lines.map((_, i) => `<div>${i === 0 && o.run ? `<span class="rg" data-act="${o.run}" data-a="${o.runArg || ''}" title="Run">▶</span>` : ''}${i + 1}</div>`).join('');
  const body = hlines.map((h, i) => `<div class="ln" data-ln="${i}">${h || ' '}</div>`).join('');
  const title = o.title || 'Program.cs';
  return `<div class="code ${o.cls || ''}">${o.head !== false ? `<div class="code-head">${fileIco(title)} <span>${esc(title)}</span><span class="sp"></span>${o.right || ''}</div>` : ''}<div class="code-body"><div class="gutter">${gut}</div><div class="lines">${body}</div></div></div>`;
}

/* ===== running C# ===== */
const BASEDIR = 'C:\\KapiPasta';
const Run = {
  exec(code, stdin = '', files = {}, echo) {
    S.codeRuns++; saveSoon();
    try { return CS.run(code, { stdin, files: Object.assign({}, files), maxSteps: 3000000, echo }); }
    catch (e) { return { out: '', err: 'Internal error: ' + e.message, etype: 'InternalError', kind: 'internal' }; }
  }
};
function consoleText(r) {
  const parts = [];
  for (const sg of (r.segs || [])) { if (sg.fg === 'in') { parts.push(`<span class="cin">${esc(sg.t)}</span>`); continue; } const st = (sg.fg !== null && sg.fg !== undefined ? `color:${CS.CONSOLE_COLORS[sg.fg]};` : '') + (sg.bg !== null && sg.bg !== undefined ? `background:${CS.CONSOLE_COLORS[sg.bg]};` : ''); parts.push(st ? `<span style="${st}">${esc(sg.t)}</span>` : esc(sg.t)); }
  return parts.join('');
}
function errHint(etype) { const hk = 'hint_' + etype; const h = tr(hk); return h !== hk ? `<div class="errhint"><i class="cpy"></i> ${h}</div>` : ''; }
function runWin(title, r, o = {}) {
  const proj = 'KapiPasta';
  if (r.loading) return S.ide === 'vs' ? `<div class="vsdc"><div class="vsdc-h"><span class="vsdc-i">C:\\</span> ${tr('debugConsole')}</div><pre>${tr('running')}</pre></div>` : `<div class="term"><div class="term-h"><span class="on">${tr('terminal')}</span><span>${tr('problems')}</span><span>${tr('output')}</span></div><pre><span class="cmd">PS ${BASEDIR}&gt; dotnet run</span>\n${tr('running')}</pre></div>`;
  if (r.kind === 'compile' || r.kind === 'internal') {
    const file = o.file || 'Program.cs';
    if (S.ide === 'vs') return `<div class="errlist"><div class="el-h">❌ ${tr('errList')} <span class="chip">1</span></div><table><tr><th></th><th>${tr('errCode')}</th><th>${tr('errDesc')}</th><th>${tr('errFile')}</th><th>${tr('errLine')}</th></tr><tr><td>⛔</td><td><b>${esc(r.etype || '')}</b></td><td>${esc(r.msg || r.err)}</td><td>${esc(file)}</td><td>${r.line || ''}</td></tr></table>${errHint(r.etype)}<div class="el-out">------ Build started: Project: ${proj}, Configuration: Debug Any CPU ------\n${esc(r.err || '')}\n========== ${tr('buildFail')} ==========</div></div>`;
    return `<div class="term"><div class="term-h"><span class="on">${tr('terminal')}</span><span>${tr('problems')} <b class="badge-n">1</b></span><span>${tr('output')}</span></div><pre><span class="cmd">PS ${BASEDIR}&gt; dotnet run</span>\n<span class="err">${esc(BASEDIR + '\\' + file)}(${r.line},${r.col}): error ${esc(r.etype)}: ${esc(r.msg || r.err)} [${BASEDIR}\\${proj}.csproj]</span>\n\n<span class="err">The build failed. Fix the build errors and run again.</span></pre>${errHint(r.etype)}</div>`;
  }
  let body = consoleText(r);
  let exitCode = 0;
  if (r.kind === 'runtime') {
    exitCode = r.etype === 'StackOverflowException' ? -1073741571 : -532462766;
    const where = r.etype === 'StackOverflowException' ? '' : `\n   at Program.&lt;Main&gt;$(String[] args) in ${BASEDIR}\\${o.file || 'Program.cs'}:line ${r.line || '?'}`;
    body += `<span class="err">${esc(r.err)}${where}</span>\n`;
  }
  if (r.kind === 'timeout') body += `<span class="err">⏱ ${tr('timeout')}</span>\n`;
  const hint = r.kind === 'runtime' || r.kind === 'timeout' ? errHint(r.etype) : '';
  if (r.readEOF && r.kind === 'runtime') { }
  if (S.ide === 'vs') return `<div class="vsdc"><div class="vsdc-h"><span class="vsdc-i">C:\\</span> ${tr('debugConsole')}</div><pre>${body}\n<span class="fin">${BASEDIR}\\bin\\Debug\\net8.0\\${proj}.exe (process ${4000 + (r.steps || 0) % 999}) ${tr('exited')} ${exitCode}${exitCode ? ` (0x${(exitCode >>> 0).toString(16)})` : ' (0x0)'}.\n${tr('pressKey')}</span></pre>${hint}</div>`;
  return `<div class="term"><div class="term-h"><span class="on">${tr('terminal')}</span><span>${tr('problems')}</span><span>${tr('output')}</span></div><pre><span class="cmd">PS ${BASEDIR}&gt; dotnet run</span>\n${body}<span class="cmd">PS ${BASEDIR}&gt;</span> <span class="cursor">▌</span></pre>${hint}</div>`;
}
const norm = s => (s || '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');

/* ===== WPF preview ===== */
const APPS = {};
function wpfPanel(key, files, o = {}) {
  // returns HTML; the app is started after render by startWpf(key)
  return `<div class="wpfbox" id="wpf-${key}"><div class="wpf-h"><span>🪟 ${tr('wpfRun')}</span><span class="sp"></span><button class="btn sm ghost" data-act="wpfstop" data-a="${key}">■</button><button class="btn sm" data-act="wpfrun" data-a="${key}" style="color:var(--ok)">↺</button></div><div class="wpf-mount" id="wpfm-${key}"></div><div class="wpf-err" id="wpfe-${key}"></div><details class="wpf-log" ${o.openLog ? 'open' : ''}><summary>${tr('wpfLog')}</summary><pre id="wpfl-${key}"></pre></details><div class="muted wpf-tip">${tr('wpfHint')}</div></div>`;
}
function startWpf(key, files) {
  stopWpf(key);
  const mount = document.getElementById('wpfm-' + key); if (!mount) return null;
  const errBox = document.getElementById('wpfe-' + key), logBox = document.getElementById('wpfl-' + key);
  errBox.innerHTML = ''; logBox.textContent = '';
  const app = new WPF.App({ files, mount, onLog: s => { logBox.textContent += s; }, onError: e => { errBox.innerHTML = wpfErrHtml(e); kapiSay(tr('retry'), 'sad'); }, onRestart: () => startWpf(key, files) });
  APPS[key] = app;
  try { app.start(); } catch (e) { mount.innerHTML = ''; errBox.innerHTML = wpfErrHtml(e); APPS[key] = null; return null; }
  S.codeRuns++; saveSoon();
  return app;
}
function stopWpf(key) { const a = APPS[key]; if (a) { a.running = false; a.timers.slice().forEach(t => t.stop()); a.anim.stopAll(); APPS[key] = null; } }
function stopAllWpf() { for (const k in APPS) stopWpf(k); }
function wpfErrInfo(e) {
  if (e instanceof CS.CsError) return { kind: 'compile', code: e.code, msg: e.message, line: e.line, file: e.file || 'MainWindow.xaml.cs' };
  if (e instanceof WPF.XamlError) return { kind: 'xaml', code: e.code, msg: e.message, line: e.line, file: e.file || 'MainWindow.xaml' };
  if (e instanceof CS.CsThrow) return { kind: 'runtime', code: e.ex.cls.name, msg: `${e.ex.cls.native ? 'System.' : ''}${e.ex.cls.name}: ${e.ex.f.Message}`, line: e.line, file: 'MainWindow.xaml.cs' };
  if (e instanceof CS.Timeout) return { kind: 'runtime', code: 'Timeout', msg: tr('timeout') };
  if (e instanceof CS.StackOverflow) return { kind: 'runtime', code: 'StackOverflowException', msg: 'Stack overflow.', line: e.line };
  return { kind: 'internal', code: 'Error', msg: String(e && e.message || e) };
}
function wpfErrHtml(e) {
  const i = wpfErrInfo(e);
  const head = i.kind === 'xaml' ? tr('xamlTalks') : i.kind === 'runtime' ? tr('exTalks') : tr('compTalks');
  const hk = i.code === 'XML' ? 'XML' : i.code;
  return `<div class="pybox e">${head}<br><code>${esc(i.file || '')}${i.line ? ` (${tr('lineN', { n: i.line })})` : ''}: ${i.kind === 'runtime' ? '' : (i.code === 'XML' ? 'XmlException' : 'error ' + esc(i.code)) + ': '}${esc(i.msg)}</code></div>${errHint(hk)}`;
}

/* ===== view state ===== */
const V = { view: 'welcome', ci: 0, li: 0, phase: 'theory', ti: 0, tabs: [], open: {}, drawer: false, ans: {}, ftab: {} };
function openLesson(ci, li, phase = 'theory') {
  V.view = 'lesson'; V.ci = ci; V.li = li; V.phase = phase; V.ti = firstUndone(course()[ci].lessons[li]); V.ans = {};
  const key = ci + ':' + li; if (!V.tabs.includes(key)) V.tabs.push(key); if (V.tabs.length > 6) V.tabs.shift();
  V.open[course()[ci].id] = true; V.drawer = false; render(); scrollTop();
}
function firstUndone(L) { const ts = stageTasks(L); const i = ts.findIndex(t => !(S.done[t.id] && S.done[t.id].ok)); return i < 0 ? 0 : i; }
function go(view) { V.view = view; V.drawer = false; render(); scrollTop(); }
const scrollTop = () => { const e = document.querySelector('.editor-scroll'); if (e) e.scrollTop = 0; };

/* ===== render frame ===== */
function render() {
  stopAllScenes(); stopAllWpf();
  document.body.className = `${S.theme} ${S.mode} ide-${S.ide}`;
  document.documentElement.lang = S.lang;
  if (!S.onboarded) { document.getElementById('app').innerHTML = frame(onboardView()); return; }
  document.getElementById('app').innerHTML = frame(mainView());
  afterRender();
}
function renderMain() { stopAllScenes(); stopAllWpf(); const m = document.querySelector('.editor-scroll'); if (!m) return render(); const sc = m.scrollTop; m.innerHTML = mainView(); m.scrollTop = sc; afterRender(); const t = document.querySelector('.tabs'); if (t) t.outerHTML = tabsHtml(); const tr2 = document.getElementById('proj'); if (tr2) tr2.innerHTML = treeHtml(); const sb = document.querySelector('.statusbar'); if (sb) sb.outerHTML = statusHtml(); }
function modeBtn() { return `<button class="tb-btn" data-act="mode" title="${S.mode === 'dark' ? tr('modeLight') : tr('modeDark')}" aria-label="${S.mode === 'dark' ? tr('modeLight') : tr('modeDark')}">${S.mode === 'dark' ? '☀️' : '🌙'}</button>`; }
function langSeg() { return `<div class="seg" role="group" aria-label="language"><button class="${S.lang === 'pl' ? 'on' : ''}" data-act="lang" data-a="pl">PL</button><button class="${S.lang === 'en' ? 'on' : ''}" data-act="lang" data-a="en">EN</button></div>`; }
function frame(inner) {
  const C = course();
  const proj = V.view === 'lesson' ? chName(C[V.ci]) : 'KapiPasta';
  const ob = S.onboarded;
  const menu = (S.ide === 'vs' ? tr('vsMenu') : tr('vscMenu')).map(m => `<span>${m}</span>`).join('');
  const navBtns = ob ? `<button class="tb-btn ${V.view === 'sandbox' ? 'on' : ''}" data-act="go" data-a="sandbox" title="${tr('sandbox')}">🏖️</button><button class="tb-btn ${V.view === 'profile' ? 'on' : ''}" data-act="go" data-a="profile" title="${tr('profile')}">🏅</button><button class="tb-btn" data-act="progress" title="${tr('progress')}">💾</button><button class="tb-btn ${V.view === 'teacher' ? 'on' : ''}" data-act="go" data-a="teacher" title="${tr('teacher')}">🧑‍🏫</button>` : '';
  const titlebar = `<header class="titlebar">
 <button class="tb-btn menu-btn" data-act="drawer" aria-label="menu">☰</button>
 <button class="tb-logo" data-act="go" data-a="welcome"><span class="lg"><i class="cpy big"></i></span><span class="tb-name">KapiPasta - C#</span></button>
 <nav class="menubar desk-only">${menu}</nav>
 ${S.ide === 'vs' ? `<span class="vs-search desk-only">🔍 ${S.lang === 'pl' ? 'Wyszukaj' : 'Search'} (Ctrl+Q)</span><span class="tb-proj desk-only">${esc(proj)}</span>` : `<span class="vsc-cmd desk-only">🔍 ${esc(proj)}</span>`}
 <span class="tb-sp"></span>
 ${langSeg()}${modeBtn()}
 ${ob ? `<button class="tb-btn" data-act="settings" title="${tr('settings')}">⚙️</button>` : ''}
</header>`;
  const vsTool = S.ide === 'vs' && ob ? `<div class="vstool"><span class="vt-g desk-only">◀ ▶</span><span class="vt-sep desk-only"></span><span class="vt-dd desk-only">Debug ▾</span><span class="vt-dd desk-only">Any CPU ▾</span><button class="vt-run" data-act="runcur">▶ KapiPasta</button><span class="vt-sep"></span>${navBtns}<span class="tb-sp"></span><button class="tb-btn" data-act="go" data-a="welcome" title="Home">🏠</button></div>` : '';
  const tree = ob ? `<aside class="project ${V.drawer ? 'show' : ''}" id="proj">${treeHtml()}</aside>` : '';
  const kapi = ob ? `<aside class="kapi-panel"><div class="pane-title"><span><i class="cpy"></i> Kapi Assistant</span></div><div class="kp-body" id="kp">${kapiInner()}</div></aside>` : '';
  const main = `<div class="main-col">${ob ? tabsHtml() : ''}<div class="editor-scroll">${inner}</div></div>`;
  let ws;
  if (S.ide === 'vs') ws = `<div class="workspace">${main}${ob ? `<div class="vs-right">${tree}${kapi}</div>` : ''}</div>`;
  else ws = `<div class="workspace">${ob ? `<nav class="stripe">
  <button class="${V.view === 'welcome' || V.view === 'lesson' ? 'on' : ''}" data-act="go" data-a="welcome" title="${tr('explorer')}">📄</button>
  <button class="${V.view === 'sandbox' ? 'on' : ''}" data-act="go" data-a="sandbox" title="${tr('sandbox')}">🏖️</button>
  <button class="${V.view === 'profile' ? 'on' : ''}" data-act="go" data-a="profile" title="${tr('profile')}">🏅</button>
  <button data-act="progress" title="${tr('progress')}">💾</button>
  <span class="sp"></span>
  <button class="${V.view === 'teacher' ? 'on' : ''}" data-act="go" data-a="teacher" title="${tr('teacher')}">🧑‍🏫</button>
  <button data-act="settings" title="${tr('settings')}">⚙️</button>
 </nav>${tree}` : ''}${main}${kapi}</div>`;
  return `<div id="ide">${titlebar}${vsTool}${ws}${statusHtml()}<footer>${tr('footer')}</footer></div>`;
}
function statusHtml() {
  const lv = levelOf(S.xp);
  const left = S.ide === 'vs' ? `<span class="it">✔ ${S.lang === 'pl' ? 'Gotowe' : 'Ready'}</span>` : `<span class="it">⎇ main</span><span class="it">⊗ 0 ⚠ 0</span>`;
  return `<div class="statusbar">
 ${left}
 ${S.onboarded ? `<span class="it">⭐ ${tr('level')} ${lv.lv} · ${esc(lvTitle(lv.lv))}</span>
 <span class="it"><span class="xpbar"><i style="width:${Math.round(lv.cur / lv.need * 100)}%"></i></span> ${S.xp} XP</span>
 <span class="it">🔥 ${S.streak.n}</span>
 <span class="it">🎯 ${tr('daily')} ${Math.min(S.today.d === todayStr() ? S.today.xp : 0, 50)}/50</span>` : ''}
 <span class="tb-sp"></span><span class="it desk-only" title="${tr('rtNote')}">⚙ ${tr('rtReady')}</span><span class="it desk-only">UTF-8</span><span class="it desk-only">CRLF</span><span class="it desk-only">C#</span>
</div>`;
}
function tabsHtml() {
  const C = course();
  const t = [`<button class="tab ${V.view === 'welcome' ? 'on' : ''}" data-act="go" data-a="welcome">🏠 ${S.ide === 'vs' ? (S.lang === 'pl' ? 'Strona startowa' : 'Start Page') : 'Welcome'}</button>`];
  V.tabs.forEach(k => { const [ci, li] = k.split(':').map(Number); const L = C[ci] && C[ci].lessons[li]; if (!L) return; const on = V.view === 'lesson' && V.ci === ci && V.li === li;
    t.push(`<button class="tab ${on ? 'on' : ''}" data-act="lesson" data-a="${k}">${fileIco('.cs')}${fname(ci, li, L)}<span class="x" data-act="closetab" data-a="${k}">✕</span></button>`); });
  if (V.view === 'sandbox') t.push(`<button class="tab on">🏖️ Playground.cs</button>`);
  if (V.view === 'profile') t.push(`<button class="tab on">🏅 Badges.md</button>`);
  if (V.view === 'teacher') t.push(`<button class="tab on">🧑‍🏫 Teacher.cs</button>`);
  return `<div class="tabs">${t.join('')}</div>`;
}
function treeHtml() {
  const C = course();
  const title = S.ide === 'vs' ? tr('solExp') : tr('explorer');
  let h = `<div class="pane-title"><span>${title}</span><span class="chip">${tr('st' + S.stage)}</span></div><ul class="tree">`;
  if (S.ide === 'vs') h += `<li class="open"><div data-act="go" data-a="welcome"><span class="tw">▶</span><span class="sln">⧉</span> <span class="nm"><b>${S.lang === 'pl' ? 'Rozwiązanie' : 'Solution'} 'KapiPasta'</b> <span class="muted">(${C.length})</span></span></div><ul>`;
  else h += `<li class="open"><div data-act="go" data-a="welcome"><span class="tw">▶</span><span class="nm"><b>KAPIPASTA</b></span></div><ul>`;
  C.forEach((ch, ci) => {
    const p = chapProg(ch), ul = unlocked(ci), open = V.open[ch.id];
    h += `<li class="${open ? 'open' : ''} ${ul ? '' : 'lock'}"><div data-act="${ul ? 'fold' : 'locked'}" data-a="${ch.id}"><span class="tw">▶</span>${ul ? ch.icon[S.theme] : '🔒'} <span class="nm">${String(ci + 1).padStart(2, '0')}_${esc(chName(ch))}</span><span class="pct">${Math.round(p.p * 100)}%</span></div>`;
    if (open && ul) {
      h += '<ul>';
      ch.lessons.forEach((L, li) => { const lp = lessonProg(L); const st = lessonStars(L); const sel = V.view === 'lesson' && V.ci === ci && V.li === li;
        h += `<li><div class="${sel ? 'sel' : ''}" data-act="lesson" data-a="${ci}:${li}">${fileIco('.cs')}<span class="nm">${fname(ci, li, L)}</span>${st ? starsHtml(st) : `<span class="pct">${lp.d}/${lp.n}</span>`}</div></li>`; });
      h += '</ul>';
    }
    h += '</li>';
  });
  return h + '</ul></li></ul>';
}
function mainView() {
  switch (V.view) {
    case 'lesson': return lessonView();
    case 'sandbox': return sandboxView();
    case 'profile': return profileView();
    case 'teacher': return teacherView();
    default: return welcomeView();
  }
}

/* ===== onboarding ===== */
const THEMES = ['pirate', 'kitchen', 'hero'];
const THICO = { pirate: '🏴‍☠️', kitchen: '🍝', hero: '🦸' };
function stageChoices() { return [1, 2, 3].map(i => `<button class="choice ${S.stage === i ? 'on' : ''}" data-act="setstage" data-a="${i}"><span class="ce">${['🌱', '🚀', '🏆'][i - 1]}</span><b>${tr('st' + i)}</b><small>${tr('st' + i + 'd')}</small></button>`).join(''); }
function themeChoices() { return THEMES.map(x => `<button class="choice ${S.theme === x ? 'on' : ''}" data-act="settheme" data-a="${x}"><span class="ce">${THICO[x]}</span><b>${tr('th_' + x)}</b><small>${tr('th_' + x + 'd')}</small></button>`).join(''); }
function ideChoices() { return ['vs', 'vscode'].map(x => `<button class="choice ide-ch ${S.ide === x ? 'on' : ''}" data-act="setide" data-a="${x}"><span class="ce"><span class="ide-logo ${x}">${x === 'vs' ? '∞' : '⟩'}</span></span><b>${tr('ide_' + x)}</b><small>${tr('ide_' + x + 'd')}</small></button>`).join(''); }
function onboardView() {
  return `<div class="doc"><div class="banner">${capy({ size: 160, mood: 'wow' })}<div><h1>${tr('tagline')}</h1><p>${tr('intro')}</p></div></div>
<div class="readme"><label class="lbl">${tr('yourName')}</label><input class="inp" id="ob-name" maxlength="30" placeholder="${tr('namePh')}" value="${esc(S.name)}">
<label class="lbl">${tr('yourClass')}</label><input class="inp" id="ob-cls" maxlength="12" placeholder="${tr('classPh')}" value="${esc(S.cls)}">
<h3 style="margin-top:16px">${tr('chooseStage')}</h3><div class="choices">${stageChoices()}</div>
<h3 style="margin-top:16px">${tr('chooseTheme')}</h3><div class="choices">${themeChoices()}</div>
<h3 style="margin-top:16px">${tr('chooseIde')}</h3><div class="choices">${ideChoices()}</div>
<div class="row-btns" style="justify-content:space-between;margin-top:18px"><button class="btn ghost" data-act="teacherstart">${tr('teacherLink')}</button><button class="btn pri" data-act="startapp">${tr('start')}</button></div></div></div>`;
}

/* ===== welcome ===== */
function welcomeView() {
  const C = course(), lv = levelOf(S.xp);
  const tx = S.today.d === todayStr() ? S.today.xp : 0;
  const cols = ['#e5534b', '#e0a52b', '#57965c', '#3574f0', '#a855f7', '#20b2aa', '#ff7ac6', '#8b5cf6', '#d9a441', '#2d9cdb', '#f2994a', '#27ae60', '#9b51e0', '#eb5757', '#56ccf2'];
  let next = null; C.some((ch, ci) => unlocked(ci) && ch.lessons.some((L, li) => { const p = lessonProg(L); if (p.d < p.n) { next = [ci, li]; return true; } }));
  return `<div class="doc welcome">
<div class="banner">${capy({ size: 130 })}<div style="flex:1"><h1>${tr('hello', { name: esc(S.name || 'Kapi') })}</h1><div class="muted">${tr('kapiSays')} ${pick(tr('tips'))}</div>
${next ? `<div class="row-btns"><button class="btn pri" data-act="lesson" data-a="${next[0]}:${next[1]}">▶ ${esc(C[next[0]].lessons[next[1]].title)}</button></div>` : ''}</div>
<div class="ring" style="--p:${Math.min(100, tx * 2)}"><span>${Math.min(tx, 50)}/50</span></div></div>
<div class="statgrid">
 <div class="stat"><div class="l">⭐ ${tr('level')} ${lv.lv}</div><div class="v">${esc(lvTitle(lv.lv))}</div><div class="xpbar" style="width:100%;margin-top:6px"><i style="width:${Math.round(lv.cur / lv.need * 100)}%"></i></div></div>
 <div class="stat"><div class="l">💎 XP</div><div class="v">${S.xp}</div></div>
 <div class="stat"><div class="l">🔥 ${tr('streak')}</div><div class="v">${S.streak.n}</div></div>
 <div class="stat"><div class="l">🏅 ${tr('badges')}</div><div class="v">${Object.keys(S.badges).length}</div></div>
</div>
<div class="quick">
 <button class="qk" data-act="go" data-a="sandbox"><span class="e">🏖️</span><span><b>${tr('sandbox')}</b><small>${tr('sandboxD')}</small></span></button>
 <button class="qk" data-act="go" data-a="profile"><span class="e">🏅</span><span><b>${tr('profile')}</b><small>${tr('profileD')}</small></span></button>
 <button class="qk" data-act="progress"><span class="e">💾</span><span><b>${tr('progress')}</b><small>${tr('progressD')}</small></span></button>
 <button class="qk" data-act="go" data-a="teacher"><span class="e">🧑‍🏫</span><span><b>${tr('teacher')}</b><small>${tr('teacherD')}</small></span></button>
</div>
<div><h2>📁 ${W().ch}</h2><div class="projlist">${C.map((ch, ci) => { const p = chapProg(ch), ul = unlocked(ci);
  return `<button class="proj ${ul ? '' : 'lk'}" data-act="${ul ? 'opench' : 'locked'}" data-a="${ci}"><span class="pi" style="background:${cols[ci % cols.length]}">${ul ? ch.icon[S.theme] : '🔒'}</span><span style="flex:1;min-width:0"><span class="pn">${W().ch} ${ci + 1}: ${esc(chName(ch))}</span><br><span class="pp">${S.ide === 'vs' ? '' : '~/KapiPasta/'}${projName(ci, ch)}${S.ide === 'vs' ? '.csproj' : ''} · ${esc(ch.topic)}</span></span><span class="pb"><span class="pbar"><i style="width:${Math.round(p.p * 100)}%"></i></span><small class="muted">${p.d}/${p.n}</small></span></button>`; }).join('')}</div></div></div>`;
}

/* ===== lesson ===== */
function exFiles(ex) { return ex.wpf; }
function fileTabs(key, files, cur, editable) {
  return `<div class="ftabs">${Object.keys(files).map(f => `<button class="ftab ${f === cur ? 'on' : ''}" data-act="ftab" data-a="${key}|${esc(f)}">${fileIco(f)} ${esc(f)}</button>`).join('')}</div>`;
}
function lessonView() {
  const C = course(), ch = C[V.ci], L = ch.lessons[V.li], ts = stageTasks(L), lp = lessonProg(L);
  const head = `<div class="crumb">// ${esc(chName(ch))} › ${fname(V.ci, V.li, L)}</div><h1>${ch.icon[S.theme]} ${W().les} ${V.ci + 1}.${V.li + 1}: ${esc(L.title)}</h1>
<div class="lesson-nav"><button class="${V.phase === 'theory' ? 'on' : ''}" data-act="phase" data-a="theory">📖 ${tr('theory')}</button><button class="${V.phase !== 'theory' ? 'on' : ''}" data-act="phase" data-a="tasks">🧩 ${tr('tasks')} (${lp.d}/${lp.n})</button></div>`;
  if (V.phase === 'theory') {
    const exs = L.ex.filter(e => !e.lvl || e.lvl <= S.stage);
    let h = `<div class="readme">${L.theory}</div>`;
    if (L.more) h += S.stage >= 2 ? `<div class="readme more"><b>${tr('more')}</b>${L.more}</div>` : `<details class="readme more"><summary>${tr('more')}</summary>${L.more}</details>`;
    exs.forEach((ex, i) => {
      const k = L.id + '-ex' + i;
      h += `<h3>🧪 ${tr('example')} ${i + 1}</h3>`;
      if (ex.wpf) {
        const files = ex.wpf; const cur = V.ftab[k] || Object.keys(files)[0];
        h += `<div class="code-files">${fileTabs(k, files, cur)}${codeBlock(files[cur], { title: cur, lang: /\.xaml$/.test(cur) ? 'xaml' : 'cs', right: `<button class="btn sm ghost" data-act="tryex" data-a="${i}">✏️</button><button class="btn sm" data-act="runex" data-a="${i}" style="color:var(--ok)">▶ ${S.lang === 'pl' ? 'Uruchom' : 'Run'}</button>` })}</div>`;
        h += `<div id="exout-${i}">${V.ans[k] ? wpfPanel(k, files) : ''}</div>`;
        h += `<div class="scene-head"><i class="cpy"></i> Kapi Preview</div>` + renderScene(ex.scene || { s: 'wpf', cap: '' }, ex);
        return;
      }
      h += codeBlock(ex.code, { title: `Example${i + 1}.cs`, run: 'runex', runArg: i, right: `<button class="btn sm ghost" data-act="tryex" data-a="${i}">✏️</button><button class="btn sm" data-act="runex" data-a="${i}" style="color:var(--ok)">▶ ${S.lang === 'pl' ? 'Uruchom' : 'Run'}</button>` });
      if (ex.inp) h += `<div class="muted" style="font-size:12px">⌨️ stdin: <code>${esc(ex.inp.replace(/\n/g, ' ⏎ '))}</code></div>`;
      h += `<div id="exout-${i}">${V.ans[k] ? runWin(`Example${i + 1}.cs`, V.ans[k]) : ''}</div>`;
      h += `<div class="scene-head"><i class="cpy"></i> Kapi Preview</div>` + renderScene(ex.scene, ex);
    });
    h += `<div class="row-btns"><button class="btn pri" data-act="phase" data-a="tasks">${tr('toTasks', { n: ts.length })}</button></div>`;
    return `<div class="doc">${head}${h}</div>`;
  }
  if (V.phase === 'done') return `<div class="doc">${head}${doneView(L)}</div>`;
  if (V.ti >= ts.length || V.ti < 0) V.ti = 0;
  const t = ts[V.ti];
  const dots = ts.map((x, i) => { const d = S.done[x.id]; return `<i class="${d && d.ok ? 'ok' : d && d.tries ? 'fail' : ''} ${i === V.ti ? 'cur' : ''}" data-act="gotask" data-a="${i}" title="${i + 1}"></i>`; }).join('');
  return `<div class="doc">${head}<div class="tprog">${dots}</div>${taskView(t, ts)}</div>`;
}
function typeChip(t) { return `<span class="chip acc">${{ quiz: '❓', fill: '✍️', bug: '🐞', code: t.wpf ? '🪟' : '💻' }[t.t]} ${t.t === 'quiz' && t.out ? tr('t_quiz') : t.t === 'quiz' ? tr('t_quizGen') : t.wpf ? tr('t_wpf') : tr('t_' + t.t)}</span>`; }
function seeded(id) { let h = 2166136261; for (const c of id) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; }
function editorHtml(id, code, minLines = 8, lang) {
  const nl = Math.max(minLines, code.split('\n').length + 1);
  return `<div class="ed-wrap"><div class="gutter" id="${id}g">${Array.from({ length: nl }, (_, i) => `<div>${i + 1}</div>`).join('')}</div><textarea class="ed" id="${id}" data-lang="${lang || 'cs'}" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" rows="${nl}">${esc(code)}</textarea></div>${keysBar(lang)}`;
}
function taskView(t, ts) {
  const A = V.ans[t.id] || (V.ans[t.id] = {});
  const done = S.done[t.id] && S.done[t.id].ok;
  const lang = t.lang || 'cs';
  const fn = lang === 'xaml' ? 'MainWindow.xaml' : 'Program.cs';
  let h = `<div class="task"><div class="qh">${typeChip(t)}<span class="chip">${tr('q', { i: V.ti + 1, n: ts.length })}</span><span class="chip">${'●'.repeat(t.l)}${'○'.repeat(3 - t.l)}</span>${done ? `<span class="chip" style="color:var(--ok)">✔</span>${taskSec(t.id) ? `<span class="chip" title="${esc(tr('timeSpent'))}">⏱ ${fmtDur(taskSec(t.id))}</span>` : ''}` : ''}</div><div class="qt">${t.q}</div>`;
  if (t.t === 'quiz') {
    if (t.code) h += codeBlock(t.code, { title: fn, lang });
    if (t.inp) h += `<div class="muted" style="font-size:12px">⌨️ stdin: <code>${esc(t.inp.replace(/\n/g, ' ⏎ '))}</code></div>`;
    const rnd = seeded(t.id), order = t.opts.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    h += `<div class="opts">${order.map((oi, k) => { const cls = (A.right || done) && isRightOpt(t, oi) ? 'right' : (A.wrong || []).includes(oi) ? 'wrong' : '';
      return `<button class="opt ${cls}" data-act="quiz" data-a="${oi}" ${A.right ? 'disabled' : ''}><span class="lt">${'ABCD'[k]}</span>${esc(t.opts[oi])}</button>`; }).join('')}</div>`;
  } else if (t.t === 'fill') {
    const parts = t.code.split('___'); let html = '';
    parts.forEach((p, i) => { html += hl(p, lang); if (i < parts.length - 1) { const v = A.vals ? A.vals[i] : ''; const w = Math.max(3, (t.answ || [])[i] || 3) + 1;
      html += `<input class="blank ${A.res ? (A.res[i] ? 'okb' : 'badb') : ''}" data-blank="${i}" style="width:${w + 1}ch" value="${esc(v || '')}" autocapitalize="off" autocomplete="off" spellcheck="false" ${A.right ? 'disabled' : ''}>`; } });
    const lines = html.split('\n');
    h += `<div class="code"><div class="code-head">${fileIco(fn)} <span>${fn}</span></div><div class="code-body"><div class="gutter">${lines.map((_, i) => `<div>${i + 1}</div>`).join('')}</div><div class="lines">${lines.map(l => `<div class="ln">${l || ' '}</div>`).join('')}</div></div></div>`;
    if (!A.right) h += `<div class="row-btns"><button class="btn pri" data-act="checkfill">${tr('check')}</button>${(S.done[t.id] && S.done[t.id].tries >= 2) ? `<button class="btn ghost" data-act="revealfill">${tr('showAns')}</button>` : ''}</div>`;
  } else if (t.t === 'bug') {
    if (t.err) h += `<div class="pybox e">${t.ekind === 'xaml' ? tr('xamlTalks') : t.ekind === 'runtime' ? tr('exTalks') : tr('compTalks')}<br><code>${esc(t.err)}</code></div>`;
    else h += `<div class="pybox l">${tr('logicBug')}${t.got !== undefined ? `<br>${tr('prints')} <code>${esc(t.got).replace(/\n/g, ' ⏎ ')}</code>` : ''}</div>`;
    if (t.inp) h += `<div class="muted" style="font-size:12px">⌨️ stdin: <code>${esc(t.inp.replace(/\n/g, ' ⏎ '))}</code></div>`;
    h += `<div class="muted" style="font-size:13px">${tr('clickLine')}</div>`;
    h += codeBlock(t.code, { title: fn, cls: 'bug', lang }).replace(/<div class="ln" data-ln="(\d+)">/g, (m, n) => `<div class="ln ${A.right && Seal.h(t.id, +n) === t.lh ? 'right' : (A.wrong || []).includes(+n) ? 'wrong' : ''}" data-ln="${n}" data-act="${A.right ? '' : 'bugline'}" data-a="${n}">`);
  } else if (t.t === 'code' && t.wpf) {
    const files = S.drafts[t.id] && typeof S.drafts[t.id] === 'object' ? S.drafts[t.id] : Object.assign({}, t.start);
    const cur = A.ftab || Object.keys(files)[0]; A.ftab = cur;
    h += `<div class="code">${fileTabs('task', files, cur, true)}<div class="code-head">${fileIco(cur)} <span>${esc(cur)}</span><span class="sp"></span><button class="btn sm ghost" data-act="resetcode">${tr('reset')}</button></div>${editorHtml('ed', files[cur], 10, /\.xaml$/.test(cur) ? 'xaml' : 'cs')}</div>`;
    h += `<div class="row-btns"><button class="btn" data-act="runcode" style="color:var(--ok)">${tr('run')}</button><button class="btn pri" data-act="checkcode" ${A.busy ? 'disabled' : ''}>${tr('check')}</button>${t.hint ? `<button class="btn ghost" data-act="hint">${tr('hint')}</button>` : ''}${((S.done[t.id] && S.done[t.id].tries >= 2) || done) ? `<button class="btn ghost" data-act="showsol">${tr('showSol')}</button>` : ''}</div>`;
    if (A.hint) h += `<div class="pybox l">💡 ${t.hint}</div>`;
    if (A.sol) h += `<h3>${tr('solution')}</h3>` + Object.keys(sec(t).sol).map(f => codeBlock(sec(t).sol[f], { title: f, lang: /\.xaml$/.test(f) ? 'xaml' : 'cs' })).join('');
    if (A.run) h += wpfPanel('task', files);
    if (A.checkMsg) h += `<div class="tests"><div class="trow ${A.checkOk ? 'okt' : 'badt'}">${A.checkOk ? '✅ ' + tr('allOk') : '❌ ' + A.checkMsg}</div></div>`;
  } else if (t.t === 'code') {
    const draft = S.drafts[t.id] !== undefined && typeof S.drafts[t.id] === 'string' ? S.drafts[t.id] : t.start;
    const sample = (t.tests[0] && t.tests[0].i) || '';
    h += `<div class="code"><div class="code-head">${fileIco('Program.cs')} <span>Program.cs</span><span class="sp"></span><button class="btn sm ghost" data-act="resetcode">${tr('reset')}</button></div>${editorHtml('ed', draft, 8)}</div>`;
    if (sample || t.rl) h += `<label class="lbl">⌨️ ${tr('stdin')}</label><textarea class="stdin" id="stdin" placeholder="${esc(tr('stdinPh'))}">${esc(A.stdin !== undefined ? A.stdin : sample)}</textarea>`;
    if (t.files) h += `<div class="muted" style="font-size:12px">📁 ${Object.keys(t.files).map(esc).join(', ')}</div>`;
    h += `<div class="row-btns"><button class="btn" data-act="runcode" style="color:var(--ok)">${tr('run')}</button><button class="btn pri" data-act="checkcode" ${A.busy ? 'disabled' : ''}>${tr('check')}</button>${t.hint ? `<button class="btn ghost" data-act="hint">${tr('hint')}</button>` : ''}${((S.done[t.id] && S.done[t.id].tries >= 2) || done) ? `<button class="btn ghost" data-act="showsol">${tr('showSol')}</button>` : ''}</div>`;
    if (A.hint) h += `<div class="pybox l">💡 ${t.hint}</div>`;
    if (A.sol) h += `<h3>${tr('solution')}</h3>` + codeBlock(sec(t).sol, { title: 'Program.cs' });
    if (A.run) h += runWin('Program.cs', A.run);
    if (A.tests) h += `<div class="tests">${A.tests.map((r, i) => `<div class="trow ${r.ok ? 'okt' : 'badt'}">${r.ok ? '✅' : '❌'} ${tr('test', { i: i + 1 })} ${r.ok ? tr('testOk') : ''}${r.ok ? '' : `${r.i ? `<pre>${tr('input')}:\n${esc(r.i)}</pre>` : ''}${r.err ? `<pre class="err" style="color:var(--bad)">${esc(r.err)}${r.line ? ` (${tr('lineN', { n: r.line })})` : ''}</pre>${errHint(r.etype)}` : r.checkfail ? `<pre>${tr('checkFail')} ${esc(r.checkfail)}</pre>` : `<pre>${tr('expected')}:\n${esc(r.o)}\n${tr('got')}:\n${esc(r.got) || tr('noOut')}</pre>`}`}</div>`).join('')}</div>`;
  }
  if (A.right || (done && A.showDone)) h += feedback(t, A);
  else if (A.badMsg) h += `<div class="fb badf"><div class="big">🙈 ${A.badMsg}</div>${tr('retry')}</div>`;
  if (done && !A.right) h += `<div class="row-btns"><button class="btn pri" data-act="nexttask">${V.ti === ts.length - 1 ? tr('finish') : tr('next')}</button></div>`;
  return h + '</div>';
}
function feedback(t, A) {
  return `<div class="fb good"><div class="big">🎉 ${A.praise || ''} ${A.xp ? `<span class="xpfly">+${A.xp} XP</span>` : ''}</div>${sec(t).why ? `<div><b>${tr('why')}</b> ${sec(t).why}</div>` : ''}${t.t === 'bug' && sec(t).fix ? `<div style="margin-top:6px"><b>${tr('fixIs')}</b> <code>${esc(sec(t).fix)}</code></div>` : ''}
<div class="row-btns"><button class="btn pri" data-act="nexttask">${V.ti === stageTasks(course()[V.ci].lessons[V.li]).length - 1 ? tr('finish') : tr('next')}</button></div></div>`;
}
function keysBar(lang) { const k = lang === 'xaml' ? ['⇥', '<', '/>', '>', '"', '=', '{', '}', ':', '.'] : ['⇥', ';', '{', '}', '(', ')', '"', '[', ']', '=', '+', '<', '>', '.', '$', '\'']; return `<div class="keys">${k.map(x => `<button data-key="${esc(x)}">${esc(x)}</button>`).join('')}</div>`; }
function doneView(L) {
  const ts = stageTasks(L); const st = starsFor(ts, S.done), first = st.first, stars = st.stars, perfect = st.perfect;
  const secs = ts.reduce((a, t) => a + taskSec(t.id), 0);
  const C = course(); let nxt = null;
  if (V.li + 1 < C[V.ci].lessons.length) nxt = [V.ci, V.li + 1]; else if (V.ci + 1 < C.length && unlocked(V.ci + 1)) nxt = [V.ci + 1, 0];
  return `<div class="task" style="text-align:center">${capy({ size: 170, mood: 'wow' })}<h1>${tr('done')}</h1><div style="font-size:42px;letter-spacing:4px">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}${perfect ? perfectIco(true) : ''}</div>${perfect ? `<p style="font-weight:700;margin:4px 0">🎓 ${tr('perfectTip')}</p>` : ''}
<p class="muted">${tr('accuracy')}: ${first}/${ts.length} · ⏱ ${tr('timeSpent')}: ${fmtDur(secs)}</p>${!perfect ? `<p class="muted" style="font-size:13px">${tr('starsHow')}</p>` : ''}<div class="row-btns" style="justify-content:center">${nxt ? `<button class="btn pri" data-act="lesson" data-a="${nxt[0]}:${nxt[1]}">${tr('nextLesson')}</button>` : ''}<button class="btn" data-act="go" data-a="welcome">${tr('backMap')}</button><button class="btn ghost" data-act="gotask" data-a="0">${tr('again')}</button></div></div>`;
}
function finishLesson() {
  const L = course()[V.ci].lessons[V.li], ts = stageTasks(L);
  if (ts.every(t => S.done[t.id] && S.done[t.id].ok)) {
    const stars = starsFor(ts, S.done).stars;
    S.stars[L.id] = Math.max(S.stars[L.id] || 0, stars); checkBadges(); save(); V.phase = 'done'; confetti(); beep('lvl'); kapiSay(pick(tr('correct')), 'wow');
  } else { V.ti = firstUndone(L); }
  renderMain(); scrollTop();
}

/* ===== sandbox ===== */
const SB_XAML = `<Window x:Class="KapiPasta.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="KapiPasta" Height="260" Width="420">
    <StackPanel Margin="15">
        <Image Source="kapi.png" Height="90"/>
        <TextBlock x:Name="napis" Text="Cześć, jestem Kapi!" FontSize="18" HorizontalAlignment="Center"/>
        <Button Content="Kliknij mnie" Click="Przycisk_Click" Margin="0,10,0,0" Padding="8,4"/>
    </StackPanel>
</Window>`;
const SB_CS = `using System.Windows;

namespace KapiPasta
{
    public partial class MainWindow : Window
    {
        int klik = 0;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Przycisk_Click(object sender, RoutedEventArgs e)
        {
            klik++;
            napis.Text = $"Kapi dostał {klik} pomarańczy! 🍊";
        }
    }
}`;
let SB = { mode: 'console', code: null, stdin: '', run: null, files: null, ftab: 'MainWindow.xaml', wpfRun: false };
function sandboxView() {
  if (SB.code === null) SB.code = tr('sbHello');
  if (!SB.files) SB.files = { 'MainWindow.xaml': SB_XAML, 'MainWindow.xaml.cs': SB_CS };
  const seg = `<div class="seg big"><button class="${SB.mode === 'console' ? 'on' : ''}" data-act="sbmode" data-a="console">⌨️ ${tr('sbConsole')}</button><button class="${SB.mode === 'wpf' ? 'on' : ''}" data-act="sbmode" data-a="wpf">🪟 ${tr('sbWpf')}</button></div>`;
  if (SB.mode === 'wpf') {
    const cur = SB.ftab;
    return `<div class="doc"><div class="crumb">// Playground</div><h1>🏖️ ${tr('sbTitle')}</h1>${seg}
<div class="code">${fileTabs('sb', SB.files, cur, true)}<div class="code-head">${fileIco(cur)} <span>${cur}</span><span class="sp"></span><button class="btn sm" data-act="sbrun" style="color:var(--ok)">${tr('run')}</button></div>${editorHtml('ed', SB.files[cur], 14, /\.xaml$/.test(cur) ? 'xaml' : 'cs')}</div>
<div class="row-btns"><button class="btn pri" data-act="sbrun">${tr('run')}</button></div>${SB.wpfRun ? wpfPanel('sb', SB.files, { openLog: true }) : ''}</div>`;
  }
  return `<div class="doc"><div class="crumb">// Playground.cs</div><h1>🏖️ ${tr('sbTitle')}</h1>${seg}
<div class="code"><div class="code-head">${fileIco('.cs')} <span>Playground.cs</span><span class="sp"></span><button class="btn sm" data-act="sbrun" style="color:var(--ok)">${tr('run')}</button></div>${editorHtml('ed', SB.code, 14)}</div>
<label class="lbl">⌨️ ${tr('stdin')}</label><textarea class="stdin" id="stdin" placeholder="${esc(tr('stdinPh'))}">${esc(SB.stdin)}</textarea>
<div class="row-btns"><button class="btn pri" data-act="sbrun">${tr('run')}</button></div>${SB.run ? runWin('Playground.cs', SB.run, { file: 'Playground.cs' }) : ''}</div>`;
}

/* ===== profile ===== */
function profileView() {
  const st = statsOf(S), lv = levelOf(S.xp), total = course().reduce((a, ch) => a + chapProg(ch).n, 0);
  const list = BADGES.map(b => ({ ico: b.ico, n: b[S.lang][0], d: b[S.lang][1], ok: !!S.badges[b.id] }));
  course().forEach(ch => list.push({ ico: ch.icon[S.theme], n: chName(ch), d: '100% ' + W().ch, ok: !!S.badges['ch_' + ch.id] }));
  return `<div class="doc"><div class="crumb">// Badges.md</div><div class="banner">${capy({ size: 120 })}<div><h1>${esc(S.name)}</h1><div class="muted">${S.cls ? esc(S.cls) + ' · ' : ''}${tr('st' + S.stage)} · ${tr('level')} ${lv.lv} ${esc(lvTitle(lv.lv))}</div></div></div>
<h2>📊 ${tr('stats')}</h2><div class="statgrid"><div class="stat"><div class="l">💎 XP</div><div class="v">${S.xp}</div></div><div class="stat"><div class="l">✅ ${tr('tasksDone')}</div><div class="v">${st.okCount}/${total}</div></div>
<div class="stat"><div class="l">🎯 ${tr('accuracy')}</div><div class="v">${st.okCount ? Math.round(st.first / st.okCount * 100) : 0}%</div></div><div class="stat"><div class="l">🔥 ${tr('bestCombo')}</div><div class="v">${S.bestCombo}</div></div>
<div class="stat"><div class="l">📅 ${tr('streak')}</div><div class="v">${S.streak.n}</div></div><div class="stat"><div class="l">👀 ${tr('awayCount')}</div><div class="v">${Object.values(S.away || {}).reduce((x, a) => x + a.n, 0)}</div></div><div class="stat"><div class="l">⏱ ${tr('timeSpent')}</div><div class="v">${fmtDur(Object.keys(S.done).filter(id => S.done[id].ok).reduce((x, id) => x + taskSec(id), 0))}</div></div><div class="stat"><div class="l">▶ ${tr('codeRuns')}</div><div class="v">${S.codeRuns}</div></div></div>
<p class="muted" style="font-size:12px">ℹ️ ${tr('awayInfo')}</p><h2>🏅 ${tr('badges')}</h2><div class="badges">${list.map(b => `<div class="badge ${b.ok ? '' : 'off'}"><div class="bi">${b.ico}</div><b>${esc(b.n)}</b><small>${esc(b.d)}</small></div>`).join('')}</div>
<div class="row-btns" style="margin-top:18px"><button class="btn pri" data-act="progress">💾 ${tr('progress')}</button></div></div>`;
}

/* ===== modal ===== */
function modal(html, cls = '') { closeModal(); const o = document.createElement('div'); o.className = 'ov'; o.id = 'ov'; o.innerHTML = `<div class="modal ${cls}">${html}</div>`; o.addEventListener('click', e => { if (e.target === o) closeModal(); }); document.body.appendChild(o); }
function closeModal() { const o = document.getElementById('ov'); if (o) o.remove(); }
function confirmBox(msg, onYes) { modal(`<div class="mb">${capy({ size: 80, mood: 'think' })}<p>${msg}</p></div><div class="mf"><button class="btn" data-act="close">${tr('no')}</button><button class="btn pri" id="yesbtn">${tr('yes')}</button></div>`); document.getElementById('yesbtn').onclick = () => { closeModal(); onYes(); }; }
let SETTAB = 'look';
function settingsModal() {
  const sec = {
    look: `<h3>${tr('chooseTheme')}</h3><div class="choices">${themeChoices()}</div><h3 style="margin-top:14px">${tr('chooseIde')}</h3><div class="choices">${ideChoices()}</div>
      <div class="switch"><span>${tr('sound')}</span><input type="checkbox" data-set="sound" ${S.sound ? 'checked' : ''}></div>`,
    learn: `<label class="lbl">${tr('yourName')}</label><input class="inp" data-set="name" value="${esc(S.name)}" maxlength="30"><label class="lbl">${tr('yourClass')}</label><input class="inp" data-set="cls" value="${esc(S.cls)}" maxlength="12">
      <h3 style="margin-top:14px">${tr('chooseStage')}</h3><div class="choices">${stageChoices()}</div>
      <div class="switch"><span>${tr('unlockAll')}</span><input type="checkbox" data-set="unlockAll" ${S.unlockAll ? 'checked' : ''}></div>`,
    prog: `<div class="row-btns"><button class="btn pri" data-act="progress">💾 ${tr('progress')}</button></div><div class="row-btns"><button class="btn" style="color:var(--bad)" data-act="resetall">🗑️ ${tr('resetProg')}</button></div>`
  };
  modal(`<div class="mh">⚙️ ${tr('settings')}<button class="btn sm ghost" data-act="close">✕</button></div><div class="settings"><nav>${[['look', '🎨 ' + tr('look')], ['learn', '🎓 ' + tr('chooseStage')], ['prog', '💾 ' + tr('progress')]].map(([k, n]) => `<button class="${SETTAB === k ? 'on' : ''}" data-act="settab" data-a="${k}">${n}</button>`).join('')}</nav><section>${sec[SETTAB]}</section></div><div class="mf"><button class="btn pri" data-act="close">${tr('close')}</button></div>`, 'wide');
}

/* ===== events ===== */
document.addEventListener('click', async e => {
  const kb = e.target.closest('[data-key]');
  if (kb) { const ed = document.getElementById('ed'); if (ed) { const k = kb.dataset.key === '⇥' ? '    ' : kb.dataset.key; insertAt(ed, k); } return; }
  if (e.target.closest('[data-dice]')) { const d = e.target.closest('[data-dice]'); d.classList.remove('roll'); void d.offsetWidth; d.classList.add('roll'); d.textContent = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][Math.floor(Math.random() * 6)]; return; }
  const pb = e.target.closest('[data-play]'); if (pb) { playScene(pb.dataset.play); return; }
  const rb = e.target.closest('[data-reset]'); if (rb) { resetScene(rb.dataset.reset); return; }
  if (e.target.closest('.wpf-mount')) return;
  const el = e.target.closest('[data-act]'); if (!el || !el.dataset.act) { if (V.drawer && !e.target.closest('#proj')) { V.drawer = false; document.getElementById('proj')?.classList.remove('show'); } return; }
  const act = el.dataset.act, a = el.dataset.a;
  const C = course();
  switch (act) {
    case 'close': closeModal(); render(); break;
    case 'drawer': V.drawer = !V.drawer; document.getElementById('proj')?.classList.toggle('show', V.drawer); e.stopPropagation(); break;
    case 'go': if (a === 'teacher') return openTeacher(); go(a); break;
    case 'lang': S.lang = a; save(); render(); if (document.getElementById('ov')) closeModal(); break;
    case 'mode': S.mode = S.mode === 'dark' ? 'light' : 'dark'; save(); render(); break;
    case 'settings': SETTAB = 'look'; settingsModal(); break;
    case 'settab': SETTAB = a; settingsModal(); break;
    case 'setstage': S.stage = normStage(a); save(); if (S.onboarded) { settingsModal(); render(); } else render(); break;
    case 'settheme': S.theme = a; save(); render(); if (S.onboarded && document.getElementById('ov')) settingsModal(); break;
    case 'setide': S.ide = a; save(); render(); if (S.onboarded && document.getElementById('ov')) settingsModal(); break;
    case 'startapp': S.name = (document.getElementById('ob-name').value || '').trim() || 'Kapi'; S.cls = (document.getElementById('ob-cls').value || '').trim(); S.onboarded = true; S.created = Date.now(); touchStreak(); save(); confetti(); render(); kapiSay(tr('hello', { name: esc(S.name) }) + ' <i class="cpy"></i>'); break;
    case 'teacherstart': S.onboarded = true; save(); openTeacher(); break;
    case 'fold': V.open[a] = !V.open[a]; document.getElementById('proj').innerHTML = treeHtml(); break;
    case 'locked': beep('bad'); kapiSay('🔒 ' + tr('locked'), 'sad'); break;
    case 'opench': { const ci = +a; V.open[C[ci].id] = true; const L = C[ci].lessons; let li = L.findIndex(x => { const p = lessonProg(x); return p.d < p.n; }); openLesson(ci, li < 0 ? 0 : li); break; }
    case 'lesson': { const [ci, li] = a.split(':').map(Number); if (!unlocked(ci)) { kapiSay('🔒 ' + tr('locked'), 'sad'); break; } openLesson(ci, li); break; }
    case 'closetab': e.stopPropagation(); V.tabs = V.tabs.filter(x => x !== a); if (V.view === 'lesson' && a === V.ci + ':' + V.li) V.view = 'welcome'; render(); break;
    case 'phase': V.phase = a; if (a === 'tasks') V.ti = firstUndone(C[V.ci].lessons[V.li]); renderMain(); scrollTop(); break;
    case 'gotask': V.phase = 'tasks'; V.ti = +a; renderMain(); break;
    case 'ftab': {
      const [key, f] = a.split('|');
      if (key === 'sb') { syncEditor(); SB.ftab = f; renderMain(); break; }
      if (key === 'task') { syncEditor(); const t = curTask(); V.ans[t.id].ftab = f; renderMain(); break; }
      V.ftab[key] = f; renderMain(); break;
    }
    case 'runex': case 'runcur': {
      if (V.view === 'sandbox') return sbRun();
      if (V.view === 'lesson' && V.phase !== 'theory') { if (document.getElementById('ed')) return codeRun(); return; }
      if (V.view !== 'lesson') { go('sandbox'); return; }
      const L = C[V.ci].lessons[V.li]; const exs = L.ex.filter(x => !x.lvl || x.lvl <= S.stage); const i = act === 'runcur' ? 0 : +a; const ex = exs[i]; if (!ex) return;
      const k = L.id + '-ex' + i;
      if (ex.wpf) { V.ans[k] = true; document.getElementById('exout-' + i).innerHTML = wpfPanel(k, ex.wpf); startWpf(k, ex.wpf); beep('click'); break; }
      V.ans[k] = Run.exec(ex.code, ex.inp || '', ex.files || {}, true);
      document.getElementById('exout-' + i).innerHTML = runWin(`Example${i + 1}.cs`, V.ans[k]); beep('click');
      break; }
    case 'wpfrun': { const L = V.view === 'lesson' ? C[V.ci].lessons[V.li] : null; if (a === 'sb') { startWpf('sb', SB.files); break; } if (a === 'task') { const t = curTask(); startWpf('task', curFiles(t)); break; } const ex = L.ex.filter(x => !x.lvl || x.lvl <= S.stage)[+a.split('-ex')[1]]; if (ex) startWpf(a, ex.wpf); break; }
    case 'wpfstop': stopWpf(a); { const m = document.getElementById('wpfm-' + a); if (m) m.innerHTML = '<div class="muted" style="padding:20px;text-align:center">■</div>'; } break;
    case 'tryex': { const L = C[V.ci].lessons[V.li]; const ex = L.ex.filter(x => !x.lvl || x.lvl <= S.stage)[+a]; if (ex.wpf) { SB.mode = 'wpf'; SB.files = Object.assign({}, ex.wpf); SB.ftab = Object.keys(ex.wpf)[0]; SB.wpfRun = false; } else { SB.mode = 'console'; SB.code = ex.code; SB.stdin = ex.inp || ''; SB.run = null; } go('sandbox'); break; }
    case 'quiz': quizAnswer(+a); break;
    case 'checkfill': fillCheck(); break;
    case 'revealfill': { const t = curTask(); reveal(t); const A = V.ans[t.id]; A.vals = sec(t).ans.map(x => x[0]); A.res = null; renderMain(); break; }
    case 'bugline': bugAnswer(+a); break;
    case 'runcode': codeRun(); break;
    case 'checkcode': codeCheck(); break;
    case 'hint': V.ans[curTask().id].hint = true; renderMain(); break;
    case 'showsol': { const t = curTask(); if (!(S.done[t.id] && S.done[t.id].ok)) reveal(t); V.ans[t.id].sol = true; renderMain(); break; }
    case 'selfok': { const t = curTask(); const A = V.ans[t.id]; A.xp = award(t, { self: true }); A.right = true; A.praise = pick(tr('correct')); renderMain(); break; }
    case 'resetcode': { const t = curTask(); delete S.drafts[t.id]; save(); if (t.wpf) V.ans[t.id].ftab = null; renderMain(); break; }
    case 'nexttask': { const ts = stageTasks(C[V.ci].lessons[V.li]); if (V.ti < ts.length - 1) { V.ti++; renderMain(); scrollToTask(); } else finishLesson(); break; }
    case 'sbrun': sbRun(); break;
    case 'sbmode': syncEditor(); SB.mode = a; renderMain(); break;
    case 'progress': progressModal(); break;
    case 'resetall': confirmBox(tr('resetQ'), () => { const keep = { lang: S.lang, mode: S.mode, theme: S.theme, ide: S.ide }; S = Object.assign({}, DEF, keep); window.S = S; save(); V.view = 'welcome'; V.tabs = []; render(); }); break;
    case 'copy': copyText(el.dataset.src ? document.getElementById(el.dataset.src).textContent : ''); el.textContent = '✔ ' + tr('copied'); break;
    case 'dl': downloadProgress(); break;
    case 'pickfile': document.getElementById(a).click(); break;
    case 'impcode': importStudentText(document.getElementById('impta').value); break;
    default: if (typeof teacherAct === 'function') teacherAct(act, a, el);
  }
});
document.addEventListener('change', e => {
  const s = e.target.dataset.set;
  if (s) { S[s] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; save(); if (s !== 'name' && s !== 'cls') render(); return; }
  if (e.target.id === 'impfile' && e.target.files[0]) e.target.files[0].text().then(importStudentText);
  if (e.target.id === 'tfile') teacherFiles(e.target.files);
});
function curFiles(t) { const d = S.drafts[t.id]; return d && typeof d === 'object' ? d : Object.assign({}, t.start); }
function syncEditor() {
  const ed = document.getElementById('ed'); if (!ed) return;
  if (V.view === 'sandbox') { if (SB.mode === 'wpf') SB.files[SB.ftab] = ed.value; else SB.code = ed.value; return; }
  const t = curTask(); if (!t) return;
  if (t.wpf) { const f = curFiles(t); f[V.ans[t.id].ftab || Object.keys(f)[0]] = ed.value; S.drafts[t.id] = f; } else S.drafts[t.id] = ed.value;
  saveSoon();
}
document.addEventListener('input', e => {
  if (e.target.id === 'ob-name') S.name = e.target.value;
  if (e.target.id === 'ob-cls') S.cls = e.target.value;
  if (e.target.id === 'ed') {
    syncEditor();
    const v = e.target.value; const g = document.getElementById('edg'); const n = Math.max(8, v.split('\n').length + 1);
    if (g && g.children.length !== n) g.innerHTML = Array.from({ length: n }, (_, i) => `<div>${i + 1}</div>`).join(''); e.target.rows = n;
  }
  if (e.target.id === 'stdin') { if (V.view === 'sandbox') SB.stdin = e.target.value; else { const t = curTask(); if (t) V.ans[t.id].stdin = e.target.value; } }
  if (e.target.classList.contains('blank')) { const t = curTask(); const A = V.ans[t.id]; A.vals = A.vals || []; A.vals[+e.target.dataset.blank] = e.target.value; e.target.classList.remove('okb', 'badb'); }
});
document.addEventListener('keydown', e => {
  if (e.target.id === 'ed') {
    const ed = e.target;
    if (e.key === 'Tab') { e.preventDefault(); insertAt(ed, '    '); }
    else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); V.view === 'sandbox' ? sbRun() : codeRun(); }
    else if (e.key === 'Enter') {
      const pos = ed.selectionStart, before = ed.value.slice(0, pos), line = before.split('\n').pop();
      let ind = (line.match(/^\s*/) || [''])[0]; if (/[{(]\s*$/.test(line) || (ed.dataset.lang === 'xaml' && /<[^/!][^>]*[^/]>\s*$/.test(line))) ind += '    ';
      e.preventDefault(); insertAt(ed, '\n' + ind);
    } else if (e.key === '}') {
      const pos = ed.selectionStart, before = ed.value.slice(0, pos), line = before.split('\n').pop();
      if (/^\s{4,}$/.test(line)) { e.preventDefault(); ed.setRangeText(line.slice(4) + '}', pos - line.length, pos, 'end'); ed.dispatchEvent(new Event('input', { bubbles: true })); }
    }
  }
  if (e.key === 'F5' && S.onboarded) { e.preventDefault(); const r = document.querySelector('[data-act="runcur"]'); if (r) r.click(); }
  if (e.target.classList && e.target.classList.contains('blank') && e.key === 'Enter') { e.preventDefault(); fillCheck(); }
  if (e.key === 'Escape') closeModal();
});
let saveT; const saveSoon = () => { clearTimeout(saveT); saveT = setTimeout(save, 500); };
function insertAt(ed, s) { const a = ed.selectionStart, b = ed.selectionEnd; ed.setRangeText(s, a, b, 'end'); ed.dispatchEvent(new Event('input', { bubbles: true })); ed.focus(); }
function curTask() { if (V.view !== 'lesson') return null; return stageTasks(course()[V.ci].lessons[V.li])[V.ti]; }
function scrollToTask() { const t = document.querySelector('.task'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function afterRender() {
  { const t = V.view === 'lesson' && V.phase === 'tasks' && !document.hidden ? curTask() : null; const id = t ? t.id : null; if (id !== TT.id || !id) timeTick(id); }
  if (V.view === 'lesson' && V.phase === 'theory') {
    const L = course()[V.ci].lessons[V.li]; const exs = L.ex.filter(x => !x.lvl || x.lvl <= S.stage);
    exs.forEach((ex, i) => { const k = L.id + '-ex' + i; if (ex.wpf && V.ans[k]) startWpf(k, ex.wpf); });
  }
  if (V.view === 'sandbox' && SB.mode === 'wpf' && SB.wpfRun) startWpf('sb', SB.files);
  if (V.view === 'lesson' && V.phase === 'tasks') { const t = curTask(); if (t && t.wpf && V.ans[t.id] && V.ans[t.id].run) startWpf('task', curFiles(t)); }
}

/* ===== answer handlers ===== */
function good(t, A) { A.xp = award(t); A.right = true; A.praise = pick(tr('correct')); kapiSay(`<b>${A.praise}</b>${A.xp ? ` +${A.xp} XP` : ''}`, 'happy'); if (A.xp) confetti(25); }
function bad(t, A, msg) { fail(t); A.badMsg = msg || pick(tr('wrong')); kapiSay(A.badMsg + (sec(t).why && (S.done[t.id].tries >= 2) ? '<br><small>' + sec(t).why + '</small>' : ''), 'sad'); }
function quizAnswer(oi) {
  const t = curTask(), A = V.ans[t.id];
  if (isRightOpt(t, oi)) { A.badMsg = null; good(t, A); } else { A.wrong = (A.wrong || []).concat(oi); bad(t, A); }
  renderMain();
}
const nrm = s => (s || '').replace(/\s+/g, '').replace(/'/g, '"');
function fillCheck() {
  const t = curTask(), A = V.ans[t.id];
  document.querySelectorAll('.blank').forEach(b => { A.vals = A.vals || []; A.vals[+b.dataset.blank] = b.value; });
  A.res = t.ansh.map((acc, i) => acc.includes(Seal.h(t.id + '#' + i, Seal.nrm((A.vals || [])[i]))));
  if (A.res.every(Boolean)) { A.badMsg = null; good(t, A); } else bad(t, A);
  renderMain();
}
function bugAnswer(n) {
  const t = curTask(), A = V.ans[t.id];
  if (Seal.h(t.id, n) === t.lh) { A.badMsg = null; good(t, A); } else { A.wrong = (A.wrong || []).concat(n); bad(t, A); }
  renderMain();
}
function runTests(t, code) {
  const tests = t.tests.length ? t.tests : [{ i: '', o: null }]; const res = [];
  for (const tc of tests) {
    const r = Run.exec(code, tc.i, t.files || {});
    let checkfail = null;
    if (!r.err && t.check) { try { const msg = new Function('src', 'out', 'files', 'input', t.check)(code, r.out, r.files || {}, tc.i); if (msg) checkfail = msg; } catch (e) { checkfail = String(e.message); } }
    const ok = !r.err && !checkfail && (tc.o === null || tc.o === undefined || norm(r.out) === norm(tc.o));
    res.push({ ok, i: tc.i, o: tc.o, got: norm(r.out), err: r.err, etype: r.etype, line: r.line, checkfail });
  }
  return res;
}
function codeRun() {
  const t = curTask(); if (!t || t.t !== 'code') return; const A = V.ans[t.id];
  syncEditor();
  if (t.wpf) { A.run = true; A.checkMsg = null; renderMain(); return; }
  const code = document.getElementById('ed').value, stdin = (document.getElementById('stdin') || {}).value || '';
  A.run = { loading: true }; A.tests = null; renderMain();
  setTimeout(() => { A.run = Run.exec(code, stdin, t.files || {}, true); renderMain(); }, 30);
}
function codeCheck() {
  const t = curTask(); if (!t) return; const A = V.ans[t.id];
  syncEditor();
  if (t.wpf) {
    const files = curFiles(t);
    let msg = WPFCheck(t, files);
    A.checkOk = !msg; A.checkMsg = msg || 'ok';
    if (!msg) { A.badMsg = null; S.proofs = S.proofs || {}; S.proofs[t.id] = Object.assign({}, files); good(t, A); A.praise = tr('allOk') + ' ' + A.praise; } else bad(t, A);
    renderMain(); return;
  }
  const code = document.getElementById('ed').value; S.drafts[t.id] = code;
  A.busy = true; A.run = { loading: true }; A.tests = null; renderMain();
  setTimeout(() => {
    try { const res = runTests(t, code); A.tests = res; A.run = null; A.busy = false;
      if (res.every(x => x.ok)) { A.badMsg = null; S.proofs = S.proofs || {}; S.proofs[t.id] = code; good(t, A); A.praise = tr('allOk') + ' ' + A.praise; } else bad(t, A);
    } catch (e) { A.busy = false; A.run = null; }
    renderMain();
  }, 30);
}
function WPFCheck(t, files) {
  let err = null; const app = new WPF.App({ files, onError: e => { err = e; }, autoAnswer: t.answers });
  try { app.start(); } catch (e) { return wpfErrInfo(e).msg; }
  if (err) return wpfErrInfo(err).msg;
  try { const ui = app.ui(); const msg = new Function('ui', 'app', t.ui)(ui, app); if (err) return wpfErrInfo(err).msg; return msg || ''; } catch (e) { return e.message; }
}
function sbRun() {
  syncEditor();
  if (SB.mode === 'wpf') { SB.wpfRun = true; S.sbRuns++; checkBadges(); save(); renderMain(); return; }
  const si = document.getElementById('stdin'); if (si) SB.stdin = si.value;
  SB.run = { loading: true }; renderMain();
  setTimeout(() => { SB.run = Run.exec(SB.code, SB.stdin, {}, true); S.sbRuns++; checkBadges(); save(); renderMain(); }, 30);
}

/* ===== progress encode / decode ===== */
const SALT = 'CappySoft.pl/CsKapi#2026';
const PFX = 'CSKAPI1';
function fnv(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16).padStart(8, '0'); }
const xorb = b => { const k = new TextEncoder().encode(SALT); return b.map((x, i) => x ^ k[i % k.length] ^ (i * 7 & 255)); };
const b64e = b => { let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const b64d = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const r = atob(s); const b = new Uint8Array(r.length); for (let i = 0; i < r.length; i++) b[i] = r.charCodeAt(i); return b; };
async function zip(b, mode) { const st = mode === 'c' ? new CompressionStream('deflate-raw') : new DecompressionStream('deflate-raw'); return new Uint8Array(await new Response(new Blob([b]).stream().pipeThrough(st)).arrayBuffer()); }
function payload() {
  const done = {}; for (const id in S.done) { const d = S.done[id]; done[id] = [d.ok ? 1 : 0, d.first ? 1 : 0, d.tries || 0, d.ok ? taskSec(id) : Math.round(((S.time || {})[id] || 0) / 1000), awayOf(id).n, awayOf(id).sec]; }
  const proof = {}; for (const id in (S.proofs || {})) if (S.done[id] && S.done[id].ok) proof[id] = S.proofs[id];
  return { app: 'cskapi', v: 1, name: S.name, cls: S.cls, stage: S.stage, xp: S.xp, done, stars: S.stars, badges: Object.keys(S.badges), streak: S.streak.n, bestCombo: S.bestCombo, codeRuns: S.codeRuns, proof, created: S.created, ts: Date.now(), lang: S.lang, theme: S.theme, ide: S.ide };
}
async function encodeProgress(obj) {
  const json = JSON.stringify(obj); const sum = fnv(SALT + json); let bytes = new TextEncoder().encode(json); let fl = 'p';
  if (window.CompressionStream) { try { bytes = await zip(bytes, 'c'); fl = 'z'; } catch (e) { bytes = new TextEncoder().encode(json); } }
  return `${PFX}.${fl}.${sum}.${b64e(xorb(bytes))}`;
}
async function decodeProgress(text) {
  const m = (text || '').replace(/\s+/g, '').match(/CSKAPI1\.([pz])\.([0-9a-f]{8})\.([A-Za-z0-9_-]+)/); if (!m) throw new Error('fmt');
  let bytes = xorb(b64d(m[3])); if (m[1] === 'z') bytes = await zip(bytes, 'd');
  const json = new TextDecoder().decode(bytes); if (fnv(SALT + json) !== m[2]) throw new Error('sum');
  const o = JSON.parse(json); if (o.app !== 'cskapi') throw new Error('app'); return o;
}
let DL = null;
const IN_CLAUDE = !!(window.claude && window.claude.use);
const canSave = () => !!DL || !IN_CLAUDE;
async function saveFile(filename, data, mime = 'text/plain') {
  if (DL) { await DL.save({ filename, data }); return; }
  const url = URL.createObjectURL(new Blob([data], { type: mime + ';charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
(async () => { try { if (window.claude && claude.use) DL = await claude.use('downloads'); } catch (e) { DL = null; } })();
function fileName() { return `kapipasta-csharp-${(S.name || 'uczen').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w-]+/g, '_')}${S.cls ? '-' + S.cls.replace(/[^\w-]+/g, '') : ''}-${todayStr()}.txt`; }
async function progressModal() {
  const code = await encodeProgress(payload());
  const fileTxt = `# KapiPasta - C# – ${S.lang === 'en' ? 'student progress (encoded file, do not edit)' : 'postęp ucznia (plik zakodowany, nie edytuj)'}\n# ${S.name}${S.cls ? ' / ' + S.cls : ''} · ${new Date().toLocaleString()}\n${code.match(/.{1,76}/g).join('\n')}\n`;
  window._PF = fileTxt;
  modal(`<div class="mh">💾 ${tr('progress')}<button class="btn sm ghost" data-act="close">✕</button></div><div class="mb">
<h3>📤 ${tr('expTitle')}</h3><p class="muted">${tr('expDesc')}</p><p class="muted" style="font-size:12px">ℹ️ ${tr('awayInfo')}</p>
<div class="row-btns">${canSave() ? `<button class="btn pri" data-act="dl">${tr('dlFile')}</button>` : ''}<button class="btn" data-act="copy" data-src="pcode">${tr('copyCode')}</button></div>
${canSave() ? '' : `<p class="muted" style="font-size:12px">${tr('dlNo')}</p>`}<div class="codeout" id="pcode">${esc(code)}</div>
<h3 style="margin-top:18px">📥 ${tr('impTitle')}</h3><p class="muted">${tr('impDesc')}</p>
<input type="file" id="impfile" accept=".txt,.kapi,text/plain" hidden><div class="row-btns"><button class="btn" data-act="pickfile" data-a="impfile">${tr('pickFile')}</button></div>
<textarea class="inp" id="impta" placeholder="${tr('pasteCode')}"></textarea><div class="row-btns"><button class="btn pri" data-act="impcode">${tr('load')}</button></div></div>`);
}
async function downloadProgress() {
  if (!canSave()) return;
  try { await saveFile(fileName(), window._PF); toast('✔ ' + tr('saved')); }
  catch (e) { if (e && (e.code === 'unavailable' || e.code === 'not_granted')) { DL = null; progressModal(); } }
}
function copyText(s) {
  const done = () => toast('📋 ' + tr('copied'));
  try { navigator.clipboard.writeText(s).then(done, () => fallbackCopy(s)); } catch (e) { fallbackCopy(s); }
}
function fallbackCopy(s) { const ta = document.createElement('textarea'); ta.value = s; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('📋 ' + tr('copied')); } catch (e) { } ta.remove(); }
async function importStudentText(text) {
  let o; try { o = await decodeProgress(text); } catch (e) { toast('⚠️ ' + tr('badCode')); return; }
  confirmBox(tr('impQ', { name: esc(o.name), xp: o.xp }), () => {
    const done = {}, time = {}, away = {}; for (const id in o.done) { const d = o.done[id]; done[id] = { ok: d[0], first: d[1], tries: d[2] }; if (d[3] !== undefined) { if (d[0]) done[id].sec = d[3]; time[id] = d[3] * 1000; } if (d[4]) away[id] = { n: d[4], ms: (d[5] || 0) * 1000 }; }
    Object.assign(S, { name: o.name, cls: o.cls || '', stage: normStage(o.stage), xp: o.xp, done, stars: o.stars || {}, bestCombo: o.bestCombo || 0, codeRuns: o.codeRuns || 0, onboarded: true });
    S.proofs = o.proof || {}; S.time = time; S.away = away; S.badges = {}; (o.badges || []).forEach(b => S.badges[b] = Date.now()); S.streak = { last: todayStr(), n: o.streak || 1 };
    save(); render(); confetti(); toast('✔ ' + tr('impOk'));
  });
}

window.addEventListener('DOMContentLoaded', () => { render(); });
