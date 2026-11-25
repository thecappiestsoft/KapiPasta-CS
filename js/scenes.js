/* ===== Kapibara + sceny ===== */
const HATS = {
  // pirate tricorn hat with a tiny skull + golden earring
  pirate: '<g transform="translate(70,2)"><path d="M-2 26 Q6 4 22 6 Q38 4 46 26 Q22 16 -2 26 Z" fill="#2d2a32"/><path d="M-2 26 Q22 16 46 26" stroke="#d9a441" stroke-width="2" fill="none"/><circle cx="22" cy="14" r="4.2" fill="#fff"/><circle cx="20.6" cy="13.4" r="1" fill="#2d2a32"/><circle cx="23.4" cy="13.4" r="1" fill="#2d2a32"/><path d="M17 20 l10 -3 M17 17 l10 3" stroke="#fff" stroke-width="1.4"/></g><circle cx="79" cy="35" r="3" fill="none" stroke="#e8b53a" stroke-width="1.8"/>',
  // chef toque
  kitchen: '<g transform="translate(70,-8)"><rect x="8" y="22" width="26" height="11" rx="2" fill="#fff" stroke="#d9d9d9"/><circle cx="12" cy="17" r="8.5" fill="#fff" stroke="#e6e6e6"/><circle cx="22" cy="11" r="10" fill="#fff" stroke="#e6e6e6"/><circle cx="31" cy="17" r="8.5" fill="#fff" stroke="#e6e6e6"/><rect x="9" y="19" width="24" height="6" fill="#fff"/></g>',
  // hero: red mask (drawn under the eyes) – cape is drawn behind the body
  hero: ''
};
// hero: cape draped over the back (drawn over the body, under the head) + domino eye mask with tails
const CAPE = '<path d="M80 36 Q62 25 38 30 Q19 34 11 50 Q6 62 5 77 Q10 72 15 76 Q19 70 24 74 Q28 67 33 70 Q35 58 44 50 Q58 42 82 46 Z" fill="#e53935"/>'
  + '<path d="M64 32 Q42 34 30 50 Q24 58 22 70" stroke="#b71c1c" stroke-width="1.6" fill="none" opacity=".7"/><path d="M50 31 Q30 38 18 58" stroke="#ff8a80" stroke-width="1.4" fill="none" opacity=".6"/>'
  + '<circle cx="81" cy="41" r="2.6" fill="#ffd54f" stroke="#b71c1c" stroke-width=".8"/>';
const NECKLACE = '<path d="M73 50 Q76 64 88 68 Q98 70 104 64" stroke="#e0b23a" stroke-width="1.8" fill="none" stroke-dasharray="2.2 1.3" stroke-linecap="round"/>'
  + '<path d="M88 68 v3" stroke="#e0b23a" stroke-width="1.4"/><circle cx="88" cy="76.5" r="6" fill="#ffc21a" stroke="#e39a00" stroke-width="1"/>'
  + '<circle cx="86" cy="75" r="1.6" fill="#fff3b0" opacity=".8"/><circle cx="90.5" cy="78" r=".6" fill="#e39a00"/><circle cx="86.5" cy="79.5" r=".6" fill="#e39a00"/><circle cx="91" cy="74.5" r=".6" fill="#e39a00"/>'
  + '<path d="M88 70.6 q1 -2 0.4 -3" stroke="#6d4c1f" stroke-width="1" fill="none"/><path d="M88.4 70.2 q4 -4 7 -1 q-3 3 -7 1 Z" fill="#43a047"/>';
const MASK = '<clipPath id="kmask"><ellipse cx="92" cy="46" rx="24" ry="20"/><rect x="98" y="38" width="24" height="24" rx="11"/></clipPath>'
  + '<path d="M73 31 Q66 29 61 25 Q63 31 67 34 Q62 37 59 42 Q66 40 73 38 Z" fill="#c62828"/>'
  + '<path d="M68 34 Q84 28 100 30 Q110 31 115 37 Q116 40 113 41 Q107 40 103 44 Q97 48.5 89 46.5 Q79 45 68 43 Z" fill="#e53935" stroke="#b71c1c" stroke-width=".8" clip-path="url(#kmask)"/>'
  + '<ellipse cx="95.5" cy="39.5" rx="4.8" ry="3.8" fill="#b98258" stroke="#b71c1c" stroke-width=".8"/>';
function capy(o = {}) {
  const mood = o.mood || 'happy', hat = o.hat === undefined ? (window.S ? S.theme : 'kitchen') : o.hat;
  const eye = mood === 'happy' ? '<path d="M92 39 q3 -4 6 0" stroke="#2b1a10" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    : mood === 'sad' ? '<circle cx="95" cy="40" r="2.8" fill="#2b1a10"/><path d="M95 45 q-1 4 0 6 q1 -2 0 -6" fill="#6cc4ff"/>'
    : mood === 'wow' ? '<circle cx="95" cy="40" r="3.6" fill="#2b1a10"/><circle cx="96" cy="39" r="1.2" fill="#fff"/>'
    : '<circle cx="95" cy="40" r="2.8" fill="#2b1a10"/><circle cx="96" cy="39" r="1" fill="#fff"/>';
  const mouth = mood === 'sad' ? '<path d="M108 58 q4 -3 8 0" stroke="#5a3a24" stroke-width="1.6" fill="none"/>'
    : '<path d="M108 56 q4 4 8 0" stroke="#5a3a24" stroke-width="1.6" fill="none"/>';
  const item = o.item ? `<text x="112" y="80" font-size="20">${o.item}</text>` : '';
  const hero = hat === 'hero';
  return `<svg class="capy ${o.cls || ''}" viewBox="0 -8 130 108" width="${o.size || 110}" aria-hidden="true">
<ellipse cx="62" cy="93" rx="44" ry="5" fill="rgba(0,0,0,.15)"/>
<rect x="30" y="68" width="11" height="24" rx="5" fill="#8a5c3b"/><rect x="47" y="70" width="11" height="22" rx="5" fill="#7a4f31"/>
<rect x="76" y="68" width="11" height="24" rx="5" fill="#8a5c3b"/><rect x="90" y="70" width="10" height="21" rx="5" fill="#7a4f31"/>
<ellipse cx="60" cy="58" rx="45" ry="28" fill="#b98258"/><ellipse cx="55" cy="50" rx="30" ry="12" fill="#c8946a" opacity=".55"/>
${hero ? CAPE : ''}
<ellipse cx="92" cy="46" rx="24" ry="20" fill="#b98258"/>
<rect x="98" y="38" width="24" height="24" rx="11" fill="#a3714b"/>
<ellipse cx="82" cy="27" rx="6.5" ry="5.5" fill="#7a4f31"/><ellipse cx="82" cy="28" rx="3.5" ry="3" fill="#5d3a22"/>
${hero ? MASK : ''}${eye}<ellipse cx="117" cy="46" rx="1.8" ry="2.8" fill="#3b2414"/><ellipse cx="111" cy="46" rx="1.4" ry="2.4" fill="#3b2414"/>
${mouth}<circle cx="101" cy="54" r="4.5" fill="#ff8fa3" opacity=".45"/>${hero ? NECKLACE : ''}
${HATS[hat] || ''}${item}</svg>`;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* animated scene registry: id -> {n, step(k), reset()} */
const PLAYERS = {};
let PID = 0;
function player(n, step, reset) {
  const id = 'p' + (++PID);
  PLAYERS[id] = { n, step, reset, k: 0, timer: null };
  return id;
}
function ctrl(id) {
  return `<div class="pctrl"><button class="pbtn" data-play="${id}" aria-label="play">▶</button><button class="pbtn ghost" data-reset="${id}" aria-label="reset">↺</button><span class="pstep" id="${id}-st"></span></div>`;
}
function playScene(id) {
  const P = PLAYERS[id]; if (!P) return;
  if (P.timer) { clearInterval(P.timer); P.timer = null; return; }
  if (P.k >= P.n) { P.reset(); P.k = 0; }
  const tick = () => {
    if (P.k >= P.n) { clearInterval(P.timer); P.timer = null; return; }
    try { P.step(P.k); } catch (e) { clearInterval(P.timer); P.timer = null; delete PLAYERS[id]; return; }
    P.k++;
    const st = document.getElementById(id + '-st'); if (st) st.textContent = P.k + ' / ' + P.n;
  };
  tick(); P.timer = setInterval(tick, 900);
}
function stopAllScenes() { for (const id in PLAYERS) { clearInterval(PLAYERS[id].timer); delete PLAYERS[id]; } }
function resetScene(id) {
  const P = PLAYERS[id]; if (!P) return;
  clearInterval(P.timer); P.timer = null; P.k = 0; try { P.reset(); } catch (e) { }
  const st = document.getElementById(id + '-st'); if (st) st.textContent = '';
}
const $id = i => document.getElementById(i);
const TCLS = { int: 'int', long: 'int', short: 'int', byte: 'int', double: 'float', float: 'float', decimal: 'float', string: 'str', bool: 'bool', char: 'char' };

function renderScene(sc, ex) {
  const L = t => tr(t);
  const outLines = (ex.out || '').split('\n').filter(x => x !== '');
  const wrap = (inner, mood, extra = '') => `<div class="scene sc-${sc.s}">${extra}<div class="scene-row"><div class="scene-capy">${capy({ mood: mood || 'happy' })}</div><div class="scene-main">${inner}</div></div><div class="scene-cap">🐾 ${sc.cap || ''}</div></div>`;
  switch (sc.s) {
    case 'say': {
      const txt = ex.err ? `<span class="bad">${esc(ex.err)}</span>` : esc(ex.out || '');
      return wrap(`<div class="sign"><div class="sign-board">${txt.replace(/\n/g, '<br>') || '&nbsp;'}</div><div class="sign-pole"></div></div>`);
    }
    case 'boxes':
      return wrap(`<div class="boxes">${sc.vars.map(v => `<div class="vbox t-${TCLS[v[2]] || 'obj'}"><div class="vname">${esc(v[0])}</div><div class="vval">${esc(v[1])}</div><div class="vtype">${v[2]}</div></div>`).join('')}</div>`);
    case 'cards':
      return wrap(`<div class="cards">${sc.items.map(c => `<div class="ccard"><code>${esc(c[0])}</code><span class="arrow">→</span><b>${esc(c[1])}</b>${c[2] ? `<small>${esc(c[2])}</small>` : ''}</div>`).join('')}</div>`);
    case 'share': {
      const q = Math.floor(sc.n / sc.k), r = sc.n % sc.k;
      const id = player(sc.n, k => {
        const b = k < q * sc.k ? 'b' + (k % sc.k) : 'rest';
        const el = $id(id + '-' + b); if (el) el.insertAdjacentHTML('beforeend', '<span class="pop">🍊</span>');
      }, () => { for (let i = 0; i < sc.k; i++) $id(id + '-b' + i).innerHTML = ''; $id(id + '-rest').innerHTML = ''; });
      return wrap(`<div class="share">${Array.from({ length: sc.k }, (_, i) => `<div class="basket"><div class="bk-in" id="${id}-b${i}"></div><div class="bk-lbl">🧺 ${i + 1}</div></div>`).join('')}<div class="basket rest"><div class="bk-in" id="${id}-rest"></div><div class="bk-lbl">${L('left')}</div></div></div><div class="share-res"><code>${sc.n} / ${sc.k} = ${q}</code> <code>${sc.n} % ${sc.k} = ${r}</code></div>${ctrl(id)}`);
    }
    case 'fork':
      return `<div class="scene sc-fork"><div class="fork-cond"><code>if (${esc(sc.cond)})</code> → <b>${esc(sc.val)}</b></div><div class="fork-paths"><div class="path ${sc.val === 'True' ? 'on' : 'off'}">✔ True<br><span>${esc(sc.yes)}</span>${sc.val === 'True' ? capy({ size: 80 }) : ''}</div><div class="path ${sc.val !== 'True' ? 'on' : 'off'}">✖ else<br><span>${esc(sc.no)}</span>${sc.val !== 'True' ? capy({ size: 80 }) : ''}</div></div><div class="scene-cap">🐾 ${sc.cap}</div></div>`;
    case 'ladder':
      return wrap(`<div class="ladder">${sc.steps.map(s => `<div class="door ${s[1] === true ? 'on' : s[1] === false ? 'no' : 'skip'}"><code>${esc(s[0])}</code><span>${s[1] === true ? '✔ True' : s[1] === false ? '✖ False' : L('skipped')}</span></div>`).join('')}<div class="door res">🚪 → <b>${esc(sc.res)}</b></div></div>`);
    case 'row': {
      const n = sc.items.length, hl = sc.hl || [-1, -1];
      return wrap(`<div class="rowlbl">${esc(sc.label || '')}</div><div class="row">${sc.items.map((x, i) => `<div class="cell ${i >= hl[0] && i < hl[1] ? 'hl' : ''}"><small>${i}</small><span>${esc(x)}</span><small class="neg">${i - n}</small></div>`).join('')}</div>`, 'wow');
    }
    case 'loop': {
      const items = sc.items;
      const id = player(items.length, k => {
        items.forEach((_, i) => $id(`${id}-c${i}`).classList.toggle('cur', i === k));
        if (k > 0) $id(`${id}-c${k - 1}`).classList.add('done');
        const per = outLines.length / items.length;
        const upto = k === items.length - 1 ? outLines.length : Math.round((k + 1) * per);
        $id(id + '-out').textContent = outLines.slice(0, upto).join('\n');
        if (sc.acc) $id(id + '-acc').textContent = `${sc.acc} = ${sc.accv[k]}`;
        const cap = $id(id + '-cp'); cap.style.transform = `translateX(${k * 46}px)`;
      }, () => {
        items.forEach((_, i) => $id(`${id}-c${i}`).classList.remove('cur', 'done'));
        $id(id + '-out').textContent = ''; if (sc.acc) $id(id + '-acc').textContent = `${sc.acc} = ?`;
        $id(id + '-cp').style.transform = 'translateX(0)';
      });
      return `<div class="scene sc-loop"><div class="loop-track"><div class="row">${items.map((x, i) => `<div class="cell" id="${id}-c${i}"><span>${esc(x)}</span></div>`).join('')}</div><div class="walker" id="${id}-cp">${capy({ size: 58 })}</div></div>${sc.acc ? `<div class="acc" id="${id}-acc">${sc.acc} = ?</div>` : ''}<pre class="console" id="${id}-out"></pre>${ctrl(id)}<div class="scene-cap">🐾 ${sc.cap}</div></div>`;
    }
    case 'grid': {
      const cells = [];
      for (let r = 0; r < sc.rows; r++) for (let c = 0; c < sc.cols; c++) if (!sc.tri || c <= r) cells.push([r, c]);
      const id = player(cells.length, k => { const [r, c] = cells[k]; $id(`${id}-${r}-${c}`).textContent = sc.emo; $id(`${id}-${r}-${c}`).classList.add('pop'); },
        () => cells.forEach(([r, c]) => { const e = $id(`${id}-${r}-${c}`); e.textContent = ''; e.classList.remove('pop'); }));
      let g = '';
      for (let r = 0; r < sc.rows; r++) { g += '<div class="grow">'; for (let c = 0; c < sc.cols; c++) g += (!sc.tri || c <= r) ? `<div class="gcell" id="${id}-${r}-${c}"></div>` : '<div class="gcell empty"></div>'; g += '</div>'; }
      return wrap(`<div class="grid">${g}</div>${ctrl(id)}`);
    }
    case 'venn':
      return `<div class="scene sc-venn"><div class="venn"><div class="vc a"><b>${esc(sc.la)}</b>${sc.a.map(esc).join('<br>')}</div><div class="vmid">${sc.both.map(esc).join('<br>')}<small>&amp;</small></div><div class="vc b"><b>${esc(sc.lb)}</b>${sc.b.map(esc).join('<br>')}</div></div><div class="scene-cap">🐾 ${sc.cap}</div></div>`;
    case 'dict':
      return wrap(`<div class="lockers">${sc.pairs.map(p => `<div class="locker ${p[0] === sc.hl ? 'hl' : ''}"><div class="lk-key">🏷️ ${esc(p[0])}</div><div class="lk-val">${esc(p[1])}</div></div>`).join('')}</div>`);
    case 'machine': {
      const id = player(3, k => { $id(id).dataset.st = k + 1; }, () => { $id(id).dataset.st = 0; });
      return wrap(`<div class="machine" id="${id}" data-st="0"><div class="m-in">${sc.inp.map(x => `<span>${esc(x)}</span>`).join('')}</div><div class="m-box"><div class="gear">⚙️</div><code>${esc(sc.name)}</code></div><div class="m-out">return <b>${esc(sc.out)}</b></div></div>${ctrl(id)}`);
    }
    case 'scope':
      return wrap(`<div class="scope"><div class="room glob"><b>🏠 ${L('global')}</b>${sc.glob.map(v => `<div class="vbox"><div class="vname">${esc(v[0])}</div><div class="vval">${esc(v[1])}</div></div>`).join('')}</div><div class="room loc"><b>⛺ ${esc(sc.fn)} – ${L('local')}</b>${sc.loc.length ? sc.loc.map(v => `<div class="vbox"><div class="vname">${esc(v[0])}</div><div class="vval">${esc(v[1])}</div></div>`).join('') : '<small>global →🏠</small>'}</div></div>`);
    case 'dice':
      return wrap(`<button class="dice" data-dice="1" aria-label="roll">🎲</button><div class="dice-out">${esc(ex.out || '')}</div>`, 'wow');
    case 'file':
      return wrap(`<div class="scroll"><div class="scroll-name">📜 ${esc(sc.name)}</div>${sc.lines.map((l, i) => `<div class="scroll-line"><small>${i + 1}</small>${esc(l)}</div>`).join('')}</div>`);
    case 'err':
      return wrap(`<div class="errbox ${sc.caught ? 'caught' : ''}"><div class="err-ico">${sc.caught ? '🛡️' : '💥'}</div><code>${esc(sc.err)}</code><div class="err-st">${sc.caught ? L('caught') : L('crash')}</div></div>`, sc.caught ? 'happy' : 'sad');
    case 'search': {
      const ti = sc.items.indexOf(sc.target);
      const id = player(ti + 1, k => { const e = $id(`${id}-${k}`); e.classList.add(k === ti ? 'found' : 'miss'); e.querySelector('em').textContent = k === ti ? '✅' : '❌'; },
        () => sc.items.forEach((_, i) => { const e = $id(`${id}-${i}`); e.classList.remove('found', 'miss'); e.querySelector('em').textContent = '🕳️'; }));
      return wrap(`<div class="row">${sc.items.map((x, i) => `<div class="cell nora" id="${id}-${i}"><small>${i}</small><em>🕳️</em><span>${esc(x)}</span></div>`).join('')}</div><div class="rowlbl">🔎 "${esc(sc.target)}"</div>${ctrl(id)}`, 'think');
    }
    case 'sort': {
      const steps = []; const a = sc.arr.slice();
      for (let i = 0; i < a.length - 1; i++) for (let j = 0; j < a.length - 1 - i; j++) { const sw = a[j] > a[j + 1]; if (sw) [a[j], a[j + 1]] = [a[j + 1], a[j]]; steps.push({ j, sw, arr: a.slice(), fixed: a.length - 1 - i, last: j === a.length - 2 - i }); }
      const max = Math.max(...sc.arr);
      const bars = arr => arr.map(v => `<div class="bar" style="height:${30 + v / max * 90}px"><span>${v}</span><i class="cpy"></i></div>`).join('');
      const id = player(steps.length, k => {
        const s = steps[k]; const el = $id(id + '-bars'); el.innerHTML = bars(s.arr);
        [...el.children].forEach((b, i) => { if (i === s.j || i === s.j + 1) b.classList.add(s.sw ? 'swap' : 'cmp'); if (i > s.fixed || (s.last && i === s.fixed)) b.classList.add('fix'); });
        $id(id + '-msg').textContent = `t[${s.j}] ${s.sw ? '>' : '≤'} t[${s.j + 1}] → ${s.sw ? tr('swap') : tr('noswap')}`;
      }, () => { $id(id + '-bars').innerHTML = bars(sc.arr); $id(id + '-msg').textContent = ''; });
      return `<div class="scene sc-sort"><div class="bars" id="${id}-bars">${bars(sc.arr)}</div><div class="rowlbl" id="${id}-msg"></div>${ctrl(id)}<div class="scene-cap">🐾 ${sc.cap}</div></div>`;
    }
    case 'stack': {
      const n = sc.frames.length;
      const id = player(n * 2, k => {
        if (k < n) $id(`${id}-${k}`).classList.add('open');
        else { const i = 2 * n - 1 - k; const e = $id(`${id}-${i}`); e.classList.add('ret'); if (sc.rets[i]) e.querySelector('em').textContent = '↩ ' + sc.rets[i]; }
      }, () => sc.frames.forEach((_, i) => { const e = $id(`${id}-${i}`); e.classList.remove('open', 'ret'); e.querySelector('em').textContent = ''; }));
      return wrap(`<div class="stack">${sc.frames.map((f, i) => `<div class="frame" id="${id}-${i}" style="margin-left:${i * 14}px"><code>${esc(f)}</code><em></em></div>`).join('')}</div>${ctrl(id)}`, 'think');
    }
    case 'compile': {
      const st = sc.steps || ['📄 Program.cs', '🛠️ ' + L('sc_comp'), '📦 IL (.dll)', '⚙️ JIT', '💻 ' + L('sc_machine'), '▶ ' + L('sc_run')];
      const id = player(st.length, k => { st.forEach((_, i) => { const e = $id(`${id}-${i}`); e.classList.toggle('cur', i === k); if (i < k) e.classList.add('done'); }); $id(id + '-cp').style.transform = `translateX(${k * 100}%)`; },
        () => { st.forEach((_, i) => $id(`${id}-${i}`).classList.remove('cur', 'done')); $id(id + '-cp').style.transform = 'translateX(0)'; });
      return `<div class="scene sc-compile"><div class="pipe">${st.map((x, i) => `<div class="pstage" id="${id}-${i}">${esc(x)}</div>`).join('<span class="parr">→</span>')}</div><div class="pwalk"><div class="pwalker" id="${id}-cp" style="width:${100 / st.length}%">${capy({ size: 54 })}</div></div>${ctrl(id)}<div class="scene-cap">🐾 ${sc.cap}</div></div>`;
    }
    case 'class': {
      const c = sc.cls;
      return wrap(`<div class="cls-wrap"><div class="blueprint"><div class="bp-h">📐 class ${esc(c.name)}</div><div class="bp-s">${c.fields.map(f => `<div>${esc(f)}</div>`).join('')}</div><div class="bp-s">${c.methods.map(m => `<div>${esc(m)}</div>`).join('')}</div></div><div class="cls-arrow">new →</div><div class="objs">${(sc.objs || []).map(o => `<div class="obj"><div class="obj-h">🧸 ${esc(o.name)}</div>${o.vals.map(v => `<div>${esc(v)}</div>`).join('')}</div>`).join('')}</div></div>`, 'wow');
    }
    case 'inherit': {
      const node = (n, cls) => `<div class="inh ${cls}"><div class="inh-h">${esc(n.name)}</div>${(n.members || []).map(m => `<div class="inh-m">${esc(m)}</div>`).join('')}${n.says ? `<div class="inh-say">💬 ${esc(n.says)}</div>` : ''}</div>`;
      return `<div class="scene sc-inherit"><div class="inh-top">${node(sc.base, 'base')}</div><div class="inh-lines">${sc.kids.map(() => '<span>▲</span>').join('')}</div><div class="inh-kids">${sc.kids.map(k => node(k, 'kid')).join('')}</div><div class="scene-row" style="justify-content:center">${capy({ size: 70, mood: 'wow' })}</div><div class="scene-cap">🐾 ${sc.cap}</div></div>`;
    }
    case 'struct': {
      return wrap(`<div class="refval"><div class="rv"><b>struct</b> – ${L('sc_copy')}<div class="rv-row"><div class="vbox"><div class="vname">a</div><div class="vval">${esc(sc.a)}</div></div><div class="vbox"><div class="vname">b</div><div class="vval">${esc(sc.b)}</div></div></div></div><div class="rv"><b>class</b> – ${L('sc_ref')}<div class="rv-row"><div class="tag">c ➝</div><div class="vbox heap"><div class="vval">${esc(sc.c)}</div></div><div class="tag">⟵ d</div></div></div></div>`, 'think');
    }
    case 'cast': {
      return wrap(`<div class="cups"><div class="cup big"><small>${esc(sc.ft)}</small><b>${esc(sc.fv)}</b></div><div class="pour">➜</div><div class="cup small"><small>${esc(sc.tt)}</small><b>${esc(sc.tv)}</b></div>${sc.lost ? `<div class="spill">💧 ${esc(sc.lost)}</div>` : ''}</div>`, sc.lost ? 'sad' : 'happy');
    }
    case 'bits': {
      return wrap(`<div class="bits">${sc.rows.map(r => `<div class="brow"><code class="blbl">${esc(r[0])}</code>${r[1].split('').map(b => `<span class="bit b${b}">${b}</span>`).join('')}<code class="bval">${esc(r[2] || '')}</code></div>`).join('')}</div>`);
    }
    case 'queue': {
      const items = sc.items.slice(); const ops = sc.ops || [];
      const id = player(ops.length, k => {
        const op = ops[k]; const box = $id(id + '-q');
        if (op[0] === '+') box.insertAdjacentHTML('beforeend', `<div class="qi pop">${esc(op.slice(1))}</div>`);
        else { const el = sc.kind === 'stack' ? box.lastElementChild : box.firstElementChild; if (el) { el.classList.add('out'); setTimeout(() => el.remove(), 400); } }
        $id(id + '-op').textContent = op[0] === '+' ? (sc.kind === 'stack' ? 'Push(' : 'Enqueue(') + op.slice(1) + ')' : (sc.kind === 'stack' ? 'Pop()' : 'Dequeue()');
      }, () => { $id(id + '-q').innerHTML = items.map(x => `<div class="qi">${esc(x)}</div>`).join(''); $id(id + '-op').textContent = ''; });
      return wrap(`<div class="qwrap ${sc.kind}"><div class="qlbl">${sc.kind === 'stack' ? '⬆ Stack&lt;T&gt;' : '⬅ Queue&lt;T&gt; ⬅'}</div><div class="qbox" id="${id}-q">${items.map(x => `<div class="qi">${esc(x)}</div>`).join('')}</div><code class="qop" id="${id}-op"></code></div>${ctrl(id)}`);
    }
    case 'wpf':
      return `<div class="scene sc-wpf"><div class="scene-row"><div class="scene-capy">${capy({ mood: 'wow', size: 90 })}</div><div class="scene-main"><b>🪟 ${L('sc_window')}</b><div class="muted" style="font-size:13px">${sc.cap}</div></div></div></div>`;
  }
  return '';
}
