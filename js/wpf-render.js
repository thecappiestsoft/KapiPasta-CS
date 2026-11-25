/* ===== KapiWPF: renderowanie okien (DOM) ===== */
(function (G) {
'use strict';
const WPF = G.WPF, CS = G.CS;
if (typeof document === 'undefined') return;
const P = WPF.App.prototype;
const { El, Brush } = WPF;
const px = v => (v === undefined || v === null || Number.isNaN(v) ? '' : v + 'px');
const h = (tag, cls, attrs) => { const d = document.createElement(tag); if (cls) d.className = cls; if (attrs) for (const k in attrs) d.setAttribute(k, attrs[k]); return d; };
const SVGNS = 'http://www.w3.org/2000/svg';
const sv = (tag, attrs) => { const d = document.createElementNS(SVGNS, tag); if (attrs) for (const k in attrs) d.setAttribute(k, attrs[k]); return d; };
const brushCss = b => (b instanceof Brush ? b.css() : b ? String(b) : '');
const accessText = s => String(s).replace(/_(\w)/, '<u>$1</u>').replace(/__/g, '_');
const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- windows ---------- */
P.renderWindow = function (o, isMain, modal) {
  const root = o.__ui.root;
  const W = Number.isNaN(root.p.Width) ? (root.__type === 'Page' ? 500 : 525) : root.p.Width;
  const H = Number.isNaN(root.p.Height) ? (root.__type === 'Page' ? 320 : 350) : root.p.Height;
  const frame = h('div', 'wwin');
  frame.style.width = W + 'px'; frame.style.height = H + 'px';
  const bar = h('div', 'wbar');
  bar.innerHTML = `<span class="wico"><i class="cpy"></i></span><span class="wtitle"></span><span class="wbtns"><i>—</i><i>☐</i><i class="wx">✕</i></span>`;
  bar.querySelector('.wtitle').textContent = root.p.Title || '';
  bar.querySelector('.wx').onclick = (ev) => { ev.stopPropagation(); this.close(o); };
  const client = h('div', 'wclient', { tabindex: '0' });
  client.style.background = root.p.Background ? brushCss(root.p.Background) : '#fff';
  frame.append(bar, client);
  root.dom = client; root.titleDom = bar.querySelector('.wtitle');
  this.applyText(root, client);
  const c = root.p.Content;
  if (c !== undefined && c !== null) client.appendChild(this.renderEl(c, root));
  // keyboard
  client.addEventListener('keydown', ev => {
    const k = WPF.keyName(ev); if (!k) return;
    this.keysDown = this.keysDown || new Set(); this.keysDown.add(k);
    const tgt = this.focusedEl(ev.target) || root;
    const a = this.args('KeyEventArgs', tgt, { key: k });
    this.bubble(tgt, 'PreviewKeyDown', a); if (!a.Handled) this.bubble(tgt, 'KeyDown', a);
    if (a.Handled || (['Up', 'Down', 'Left', 'Right', 'Space'].includes(k) && !(ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA'))) ev.preventDefault();
  });
  client.addEventListener('keyup', ev => { const k = WPF.keyName(ev); if (!k) return; if (this.keysDown) this.keysDown.delete(k); const tgt = this.focusedEl(ev.target) || root; this.bubble(tgt, 'KeyUp', this.args('KeyEventArgs', tgt, { key: k })); });
  client.addEventListener('mousedown', () => { if (document.activeElement === document.body || !client.contains(document.activeElement)) client.focus({ preventScroll: true }); });
  if (isMain) {
    this.mount.innerHTML = '';
    const wrap = h('div', 'wwrap'); this.wrap = wrap;
    const avail = Math.max(240, (this.mount.clientWidth || 600) - 8);
    const k = Math.min(1, avail / (W + 2)); this.scale = k;
    const outer = h('div', 'wouter'); outer.style.width = (W + 2) * k + 'px'; outer.style.height = (H + 32) * k + 'px';
    frame.style.transform = `scale(${k})`; frame.style.transformOrigin = '0 0';
    outer.appendChild(frame); wrap.appendChild(outer); this.mount.appendChild(wrap);
    this.mainFrame = frame;
    setTimeout(() => { try { client.focus({ preventScroll: true }); } catch (e) { } }, 50);
  } else {
    const host = this.mainFrame || this.mount;
    if (modal) { const ov = h('div', 'wmodal'); host.appendChild(ov); o.__ov = ov; frame.classList.add('wdlg'); }
    else frame.classList.add('wfloat');
    frame.style.left = Math.max(8, ((this.mainFrame ? this.mainFrame.offsetWidth : 500) - W) / 2) + 'px'; frame.style.top = '40px';
    host.appendChild(frame);
    if (!modal) { let dx = 0, dy = 0; bar.onmousedown = ev => { dx = ev.clientX - frame.offsetLeft; dy = ev.clientY - frame.offsetTop; const mv = e2 => { frame.style.left = (e2.clientX - dx) + 'px'; frame.style.top = (e2.clientY - dy) + 'px'; }; const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); }; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up); }; }
    setTimeout(() => { try { client.focus({ preventScroll: true }); } catch (e) { } }, 30);
  }
  o.__dom = frame;
  return frame;
};
WPF.keyName = ev => { if (/^[a-z]$/i.test(ev.key)) return ev.key.toUpperCase(); if (/^[0-9]$/.test(ev.key)) return (ev.location === 3 ? 'NumPad' : 'D') + ev.key; return { Backspace: 'Back', Tab: 'Tab', Enter: 'Enter', Escape: 'Escape', ' ': 'Space', ArrowLeft: 'Left', ArrowUp: 'Up', ArrowRight: 'Right', ArrowDown: 'Down', Delete: 'Delete', Home: 'Home', End: 'End', Shift: 'LeftShift', Control: 'LeftCtrl', F1: 'F1', F2: 'F2', F5: 'F5', '+': 'Add', '-': 'Subtract' }[ev.key] || null; };
P.focusedEl = function (dom) { let d = dom; while (d) { if (d.__el) return d.__el; d = d.parentElement; } return null; };
P.renderClosed = function () {
  if (!this.mainFrame) return;
  const ov = h('div', 'wclosed'); ov.innerHTML = `<div><i class="cpy" style="width:46px;height:36px"></i><br>${WPF.L('closed')}</div>`;
  const b = h('button', 'btn pri'); b.textContent = '↺ ' + WPF.L('restart'); b.onclick = () => this.opts.onRestart && this.opts.onRestart(); ov.firstChild.appendChild(h('br')); ov.firstChild.appendChild(b);
  this.mainFrame.appendChild(ov);
};
P.showBox = function (text, cap, buttons, icon, onAnswer) {
  if (!this.mount) return;
  const host = this.mainFrame || this.mount;
  const ov = h('div', 'wmodal'); const box = h('div', 'wwin wbox');
  const ic = icon ? { Error: '⛔', Hand: '⛔', Stop: '⛔', Question: '❓', Warning: '⚠️', Exclamation: '⚠️', Information: 'ℹ️', Asterisk: 'ℹ️' }[icon.e.members.find(m => m.v === icon.v).name] || '' : '';
  box.innerHTML = `<div class="wbar"><span class="wtitle"></span><span class="wbtns"><i class="wx">✕</i></span></div><div class="wclient wboxc"><div class="wboxt">${ic ? `<span class="wboxi">${ic}</span>` : ''}<span class="wboxm"></span></div><div class="wboxb"></div></div>`;
  box.querySelector('.wtitle').textContent = cap || '';
  box.querySelector('.wboxm').textContent = text;
  const close = ans => { ov.remove(); box.remove(); if (onAnswer) onAnswer(ans); };
  const names = { OK: 'OK', Cancel: WPF.L('cancel'), Yes: WPF.L('yes'), No: WPF.L('no') };
  buttons.forEach((b, i) => { const bt = h('button', 'w-btn'); bt.textContent = names[b]; if (i === 0) bt.classList.add('def'); bt.onclick = () => close(b); box.querySelector('.wboxb').appendChild(bt); });
  box.querySelector('.wx').onclick = () => close(buttons.includes('Cancel') ? 'Cancel' : buttons.includes('No') && buttons.length === 2 ? 'No' : 'OK');
  host.appendChild(ov); host.appendChild(box);
  box.style.left = Math.max(10, ((host.offsetWidth || 400) - 320) / 2) + 'px'; box.style.top = '60px';
  setTimeout(() => { const b = box.querySelector('.w-btn'); if (b) b.focus(); }, 20);
};

/* ---------- elements ---------- */
P.renderEl = function (e, parent) {
  if (!(e instanceof El)) { // plain content (string / number / object)
    const s = h('span', 'w-txt'); s.textContent = e === null || e === undefined ? '' : (typeof e === 'string' ? e : this.it.str(e)); return s;
  }
  e.parent = e.parent || parent;
  let d;
  const t = e.__type;
  switch (t) {
    case 'Grid': case 'StackPanel': case 'WrapPanel': case 'Canvas': case 'UniformGrid': case 'DockPanel': d = h('div', 'w-panel w-' + t.toLowerCase()); break;
    case 'Border': case 'Viewbox': d = h('div', 'w-border'); break;
    case 'ScrollViewer': d = h('div', 'w-scroll'); break;
    case 'GroupBox': d = h('fieldset', 'w-group'); break;
    case 'Expander': d = h('details', 'w-exp'); break;
    case 'TabControl': d = h('div', 'w-tabs'); break;
    case 'TextBlock': d = h('div', 'w-tb'); break;
    case 'Label': d = h('div', 'w-label'); break;
    case 'Button': case 'RepeatButton': case 'ToggleButton': d = h('button', 'w-btn'); d.type = 'button'; break;
    case 'TextBox': d = h(e.p.AcceptsReturn ? 'textarea' : 'input', 'w-input'); e.inputDom = d; break;
    case 'PasswordBox': d = h('input', 'w-input', { type: 'password' }); e.inputDom = d; break;
    case 'CheckBox': case 'RadioButton': { d = h('label', 'w-check'); const inp = h('input', '', { type: t === 'CheckBox' ? 'checkbox' : 'radio' }); e.inputDom = inp; d.appendChild(inp); d.appendChild(h('span', 'w-cc')); break; }
    case 'Slider': d = h('input', 'w-slider', { type: 'range' }); e.inputDom = d; break;
    case 'ProgressBar': d = h('div', 'w-prog'); d.appendChild(h('i')); break;
    case 'ComboBox': d = h('select', 'w-combo'); e.inputDom = d; break;
    case 'ListBox': d = h('div', 'w-list'); break;
    case 'Image': d = h('div', 'w-img'); break;
    case 'Separator': d = h('div', 'w-sep'); break;
    case 'Menu': d = h('div', 'w-menu'); break;
    case 'MenuItem': d = h('div', 'w-mi'); break;
    case 'StatusBar': case 'ToolBar': d = h('div', 'w-' + t.toLowerCase()); break;
    case 'StatusBarItem': case 'ComboBoxItem': case 'ListBoxItem': case 'TabItem': d = h('div', 'w-item'); break;
    case 'Frame': d = h('div', 'w-frame'); break;
    case 'Rectangle': case 'Ellipse': case 'Line': case 'Polygon': case 'Polyline': case 'Path': d = sv('svg', { class: 'w-shape' }); break;
    case 'Viewport3D': d = h('canvas', 'w-3d'); break;
    case 'Run': case 'Bold': case 'Italic': case 'Underline': case 'Span': case 'Hyperlink': d = h(t === 'Hyperlink' ? 'a' : 'span', 'w-run w-' + t.toLowerCase()); break;
    case 'LineBreak': d = h('br'); break;
    default: d = h('div', 'w-' + t.toLowerCase());
  }
  d.__el = e; e.dom = d;
  this.renderContent(e);
  this.wireEvents(e);
  for (const k in e.p) this.applyProp(e, k, true);
  this.applyText(e, d);
  if (e.p.RenderTransform) this.applyTransform(e);
  if (t === 'Viewport3D') this.start3D(e);
  return d;
};
P.applyText = function (e, d) {
  const p = e.p;
  if (p.FontSize) d.style.fontSize = p.FontSize + 'px';
  if (p.FontWeight) d.style.fontWeight = /bold|black|heavy/i.test(p.FontWeight) ? '700' : /semi|demi/i.test(p.FontWeight) ? '600' : /light|thin/i.test(p.FontWeight) ? '300' : '400';
  if (p.FontFamily) d.style.fontFamily = p.FontFamily + ', Segoe UI, sans-serif';
  if (p.FontStyle) d.style.fontStyle = p.FontStyle.toLowerCase();
  if (p.Foreground) d.style.color = brushCss(p.Foreground);
};
P.renderContent = function (e) {
  const d = e.dom; const t = e.__type;
  const content = c => (c === undefined || c === null ? null : this.renderEl(c, e));
  switch (t) {
    case 'Grid': case 'StackPanel': case 'WrapPanel': case 'Canvas': case 'UniformGrid': return this.renderKids(e);
    case 'DockPanel': return this.renderKids(e);
    case 'Border': case 'Viewbox': case 'ScrollViewer': case 'Label': case 'StatusBarItem': case 'ComboBoxItem': case 'ListBoxItem': case 'TabItem': {
      d.innerHTML = ''; const c = t === 'Border' || t === 'Viewbox' ? e.p.Child : e.p.Content;
      if (typeof c === 'string' && t === 'Label') { d.innerHTML = accessText(escH(c)); return; }
      const n = content(c); if (n) d.appendChild(n); if (n && e.p.Child instanceof El) this.layoutChild(e.p.Child, e); return;
    }
    case 'GroupBox': { d.innerHTML = ''; const lg = h('legend'); lg.textContent = typeof e.p.Header === 'string' ? e.p.Header : ''; d.appendChild(lg); const n = content(e.p.Content); if (n) d.appendChild(n); return; }
    case 'Expander': { d.innerHTML = ''; const sm = h('summary'); sm.textContent = typeof e.p.Header === 'string' ? e.p.Header : ''; d.appendChild(sm); if (e.p.IsExpanded) d.open = true; const n = content(e.p.Content); if (n) d.appendChild(n); return; }
    case 'Button': case 'RepeatButton': case 'ToggleButton': { d.innerHTML = ''; const c = e.p.Content; if (typeof c === 'string') d.innerHTML = accessText(escH(c)); else { const n = content(c); if (n) d.appendChild(n); } d.classList.toggle('on', !!e.p.IsChecked); return; }
    case 'CheckBox': case 'RadioButton': { const sp = d.querySelector('.w-cc'); sp.innerHTML = ''; const c = e.p.Content; if (typeof c === 'string') sp.innerHTML = accessText(escH(c)); else { const n = content(c); if (n) sp.appendChild(n); } e.inputDom.checked = !!e.p.IsChecked; e.inputDom.indeterminate = e.p.IsChecked === null; return; }
    case 'TextBlock': case 'Span': case 'Bold': case 'Italic': case 'Underline': case 'Hyperlink': {
      d.innerHTML = '';
      if (e.kids.length && !(t === 'TextBlock' && e.p.Text)) e.kids.forEach(k => d.appendChild(this.renderEl(k, e)));
      else d.textContent = e.p.Text || '';
      return;
    }
    case 'Run': d.textContent = e.p.Text || ''; return;
    case 'TextBox': case 'PasswordBox': { const v = t === 'TextBox' ? e.p.Text : e.p.Password; if (d.value !== v) d.value = v || ''; d.readOnly = !!e.p.IsReadOnly; if (e.p.MaxLength) d.maxLength = e.p.MaxLength; return; }
    case 'Slider': d.min = e.p.Minimum; d.max = e.p.Maximum; d.step = e.p.IsSnapToTickEnabled && e.p.TickFrequency ? e.p.TickFrequency : 'any'; d.value = e.p.Value; if (e.p.Orientation === 'Vertical') d.classList.add('vert'); return;
    case 'ProgressBar': { const p = (e.p.Value - e.p.Minimum) / ((e.p.Maximum - e.p.Minimum) || 1); d.firstChild.style.width = (e.p.IsIndeterminate ? 30 : Math.max(0, Math.min(1, p)) * 100) + '%'; d.classList.toggle('ind', !!e.p.IsIndeterminate); return; }
    case 'ComboBox': case 'ListBox': case 'TabControl': return this.renderItems(e);
    case 'Image': { const src = String(e.p.Source || ''); d.innerHTML = /kapi|capy/i.test(src) ? (G.capy ? G.capy({ size: 120 }) : '🦫') : `<div class="w-noimg">🖼️<br><small>${escH(src.split(/[\\/]/).pop())}</small></div>`; return; }
    case 'Menu': case 'StatusBar': case 'ToolBar': d.innerHTML = ''; e.items.forEach(it => { const n = this.renderEl(it, e); d.appendChild(n); }); return;
    case 'MenuItem': {
      d.innerHTML = '';
      const head = h('div', 'w-mh'); head.innerHTML = `<span class="w-mck">${e.p.IsChecked ? '✓' : ''}</span><span class="w-mt">${accessText(escH(typeof e.p.Header === 'string' ? e.p.Header : ''))}</span><span class="w-mg">${escH(e.p.InputGestureText || '')}</span>${e.items.length && e.parent && e.parent.__type === 'MenuItem' ? '<span class="w-ma">›</span>' : ''}`;
      d.appendChild(head);
      if (e.items.length) { const sub = h('div', 'w-sub'); e.items.forEach(it => sub.appendChild(this.renderEl(it, e))); d.appendChild(sub); d.classList.add('has-sub'); }
      return;
    }
    case 'Frame': return this.renderFrame(e);
    case 'Rectangle': case 'Ellipse': case 'Line': case 'Polygon': case 'Polyline': case 'Path': return this.renderShape(e);
  }
  if (e.p.Content !== undefined && !(e.p.Content === null)) { d.innerHTML = ''; const n = content(e.p.Content); if (n) d.appendChild(n); }
};
P.renderKids = function (e) {
  const d = e.dom; if (!d) return;
  d.innerHTML = '';
  const t = e.__type;
  if (t === 'Grid') {
    const conv = s => { s = String(s).trim(); if (s === 'Auto') return 'auto'; if (/^\d*\.?\d*\*$/.test(s)) return `minmax(0,${parseFloat(s) || 1}fr)`; return parseFloat(s) + 'px'; };
    d.style.gridTemplateRows = (e.rows && e.rows.length ? e.rows : ['*']).map(conv).join(' ');
    d.style.gridTemplateColumns = (e.cols && e.cols.length ? e.cols : ['*']).map(conv).join(' ');
    if (e.p.ShowGridLines) d.classList.add('lines');
  }
  if (t === 'UniformGrid') { const n = e.kids.length; const c = e.p.Columns || Math.ceil(Math.sqrt(n)) || 1; const r = e.p.Rows || Math.ceil(n / c) || 1; d.style.gridTemplateColumns = `repeat(${c}, minmax(0,1fr))`; d.style.gridTemplateRows = `repeat(${r}, minmax(0,1fr))`; }
  if (t === 'StackPanel' || t === 'WrapPanel') d.style.flexDirection = e.p.Orientation === 'Horizontal' ? 'row' : 'column';
  if (t === 'DockPanel') { this.renderDock(e); return; }
  e.kids.forEach(k => { const n = this.renderEl(k, e); d.appendChild(n); this.layoutChild(k, e); });
};
P.renderDock = function (e) {
  let cur = e.dom; cur.style.display = 'flex'; cur.style.flexDirection = 'column';
  const kids = e.kids; const last = e.p.LastChildFill !== false;
  kids.forEach((k, i) => {
    const n = this.renderEl(k, e);
    const dock = k.att['DockPanel.Dock'] || 'Left';
    if (i === kids.length - 1 && last) { n.style.flex = '1 1 auto'; n.style.minWidth = '0'; n.style.minHeight = '0'; cur.appendChild(n); this.layoutChild(k, e, true); return; }
    const box = h('div', 'w-dockrest');
    box.style.display = 'flex'; box.style.flex = '1 1 auto'; box.style.minHeight = '0'; box.style.minWidth = '0';
    const horiz = dock === 'Left' || dock === 'Right';
    cur.style.flexDirection = horiz ? (dock === 'Left' ? 'row' : 'row-reverse') : (dock === 'Top' ? 'column' : 'column-reverse');
    n.style.flex = '0 0 auto'; cur.appendChild(n); cur.appendChild(box); this.layoutChild(k, e, true);
    cur = box;
  });
};
P.layoutChild = function (k, parent, dock) {
  const d = k.dom; if (!d) return; parent = parent || k.parent; if (!parent) return;
  const t = parent.__type; const ha = k.p.HorizontalAlignment, va = k.p.VerticalAlignment;
  const shape = WPF.TYPES[k.__type] && WPF.TYPES[k.__type].shape;
  if (t === 'Grid') {
    d.style.gridRow = `${(k.att['Grid.Row'] || 0) + 1} / span ${k.att['Grid.RowSpan'] || 1}`;
    d.style.gridColumn = `${(k.att['Grid.Column'] || 0) + 1} / span ${k.att['Grid.ColumnSpan'] || 1}`;
    const defH = Number.isNaN(k.p.Width) ? 'stretch' : 'center', defV = Number.isNaN(k.p.Height) ? 'stretch' : 'center';
    d.style.justifySelf = { Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' }[ha] || (shape && k.__type !== 'Rectangle' && k.__type !== 'Ellipse' ? 'start' : defH);
    d.style.alignSelf = { Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch' }[va] || (shape && k.__type !== 'Rectangle' && k.__type !== 'Ellipse' ? 'start' : defV);
  } else if (t === 'StackPanel' || t === 'WrapPanel') {
    const horiz = parent.p.Orientation === 'Horizontal';
    if (!horiz) d.style.alignSelf = { Left: 'flex-start', Center: 'center', Right: 'flex-end', Stretch: 'stretch' }[ha] || (t === 'StackPanel' ? (Number.isNaN(k.p.Width) ? 'stretch' : 'center') : 'flex-start');
    else d.style.alignSelf = { Top: 'flex-start', Center: 'center', Bottom: 'flex-end', Stretch: 'stretch' }[va] || (t === 'StackPanel' ? (Number.isNaN(k.p.Height) ? 'stretch' : 'center') : 'flex-start');
    if (t === 'WrapPanel') { if (parent.p.ItemWidth) d.style.width = parent.p.ItemWidth + 'px'; if (parent.p.ItemHeight) d.style.height = parent.p.ItemHeight + 'px'; }
  } else if (t === 'Canvas') {
    d.style.position = 'absolute';
    const L = k.att['Canvas.Left'], Tp = k.att['Canvas.Top'], R = k.att['Canvas.Right'], B = k.att['Canvas.Bottom'];
    d.style.left = L !== undefined && !Number.isNaN(L) ? L + 'px' : ''; d.style.top = Tp !== undefined && !Number.isNaN(Tp) ? Tp + 'px' : '';
    d.style.right = (L === undefined || Number.isNaN(L)) && R !== undefined ? R + 'px' : ''; d.style.bottom = (Tp === undefined || Number.isNaN(Tp)) && B !== undefined ? B + 'px' : '';
    if (L === undefined && R === undefined) d.style.left = '0'; if (Tp === undefined && B === undefined) d.style.top = '0';
  } else if (t === 'Border' || t === 'Window' || t === 'Page' || t === 'ScrollViewer' || t === 'UserControl' || t === 'Frame') {
    d.style.alignSelf = { Top: 'flex-start', Center: 'center', Bottom: 'flex-end' }[va] || '';
    d.style.marginLeft = ha === 'Center' || ha === 'Right' ? 'auto' : ''; d.style.marginRight = ha === 'Center' ? 'auto' : '';
    if (ha && ha !== 'Stretch') d.style.width = Number.isNaN(k.p.Width) ? 'fit-content' : k.p.Width + 'px';
  } else if (dock) {
    const dk = k.att['DockPanel.Dock'] || 'Left';
    if (dk === 'Left' || dk === 'Right') d.style.alignSelf = { Top: 'flex-start', Center: 'center', Bottom: 'flex-end' }[va] || 'stretch';
    else d.style.alignSelf = { Left: 'flex-start', Center: 'center', Right: 'flex-end' }[ha] || 'stretch';
  }
  const z = k.att['Panel.ZIndex'] !== undefined ? k.att['Panel.ZIndex'] : k.att['Canvas.ZIndex'];
  if (z !== undefined) { d.style.zIndex = z; if (t !== 'Canvas') d.style.position = 'relative'; }
};
P.renderItems = function (e) {
  const d = e.dom; if (!d) return; const t = e.__type;
  const list = e.selList(); const label = it => (it instanceof El ? it.contentText() : (e.p.DisplayMemberPath && it instanceof CS.Obj ? this.it.str(this.it.getMember(it, e.p.DisplayMemberPath, {}, { cls: it.cls, self: it, sc: new CS.Scope(null) })) : this.it.str(it)));
  if (t === 'ComboBox') {
    d.innerHTML = ''; if (e.p.SelectedIndex < 0) { const o = h('option'); o.textContent = ''; o.value = -1; o.hidden = true; d.appendChild(o); }
    list.forEach((it, i) => { const o = h('option'); o.value = i; o.textContent = label(it); d.appendChild(o); });
    d.value = e.p.SelectedIndex; return;
  }
  if (t === 'ListBox') {
    d.innerHTML = '';
    list.forEach((it, i) => { const r = h('div', 'w-li' + (i === e.p.SelectedIndex ? ' sel' : '')); if (it instanceof El && it.p.Content instanceof El) r.appendChild(this.renderEl(it.p.Content, it)); else r.textContent = label(it); r.onclick = () => { if (!this.running) return; e.set('SelectedIndex', i); this.renderItems(e); }; d.appendChild(r); });
    return;
  }
  if (t === 'TabControl') {
    d.innerHTML = ''; const hd = h('div', 'w-tabh'); const body = h('div', 'w-tabb');
    list.forEach((it, i) => { const b = h('button', 'w-tab' + (i === e.p.SelectedIndex ? ' on' : '')); b.type = 'button'; b.textContent = it instanceof El ? (typeof it.p.Header === 'string' ? it.p.Header : '') : label(it); b.onclick = () => { e.set('SelectedIndex', i); this.renderItems(e); }; hd.appendChild(b); });
    const cur = list[e.p.SelectedIndex]; if (cur instanceof El && cur.p.Content !== undefined) { const n = this.renderEl(cur.p.Content, cur); body.appendChild(n); }
    d.append(hd, body);
  }
};
P.renderFrame = function (e) {
  const d = e.dom; d.innerHTML = '';
  const showNav = e.p.NavigationUIVisibility === 'Visible' || (e.p.NavigationUIVisibility !== 'Hidden' && e.hist && e.hist.length);
  if (showNav) { const bar = h('div', 'w-navbar'); const b = h('button', 'w-nav'); b.textContent = '◀'; b.disabled = !(e.hist && e.hist.length); b.onclick = () => this.goBack(e); const b2 = h('button', 'w-nav'); b2.textContent = '▶'; b2.disabled = true; const tt = h('span'); tt.textContent = e.page ? (e.page.p.Title || '') : ''; bar.append(b, b2, tt); d.appendChild(bar); }
  if (e.page) { const pg = h('div', 'w-page'); e.page.dom = pg; pg.__el = e.page; if (e.page.p.Background) pg.style.background = brushCss(e.page.p.Background); this.applyText(e.page, pg); if (e.page.p.Content !== undefined) pg.appendChild(this.renderEl(e.page.p.Content, e.page)); d.appendChild(pg); }
};
P.renderShape = function (e) {
  const d = e.dom; d.innerHTML = ''; const p = e.p; const t = e.__type;
  const sw = p.StrokeThickness === undefined ? (p.Stroke ? 1 : 0) : p.StrokeThickness;
  const defs = sv('defs'); d.appendChild(defs);
  const paint = (b, id) => { if (!b) return 'none'; if (b instanceof Brush && b.__type !== 'SolidColorBrush') { const gid = 'g' + e.id + id; const g = sv(b.__type === 'LinearGradientBrush' ? 'linearGradient' : 'radialGradient', b.__type === 'LinearGradientBrush' ? { id: gid, x1: b.start[0], y1: b.start[1], x2: b.end[0], y2: b.end[1] } : { id: gid }); b.stops.forEach(s => g.appendChild(sv('stop', { offset: s.o, 'stop-color': s.c }))); defs.appendChild(g); return `url(#${gid})`; } return brushCss(b); };
  let W = Number.isNaN(p.Width) ? null : p.Width, H = Number.isNaN(p.Height) ? null : p.Height;
  let s;
  if (t === 'Rectangle') { s = sv('rect', { x: sw / 2, y: sw / 2, rx: p.RadiusX || 0, ry: p.RadiusY || 0 }); s.setAttribute('width', `calc(100% - ${sw}px)`); s.setAttribute('height', `calc(100% - ${sw}px)`); }
  else if (t === 'Ellipse') { s = sv('ellipse'); s.setAttribute('cx', '50%'); s.setAttribute('cy', '50%'); s.setAttribute('rx', `calc(50% - ${sw / 2}px)`); s.setAttribute('ry', `calc(50% - ${sw / 2}px)`); }
  else if (t === 'Line') { s = sv('line', { x1: p.X1 || 0, y1: p.Y1 || 0, x2: p.X2 || 0, y2: p.Y2 || 0 }); W = W || Math.max(p.X1 || 0, p.X2 || 0) + sw; H = H || Math.max(p.Y1 || 0, p.Y2 || 0) + sw; s.setAttribute('stroke-linecap', /Round/.test(p.StrokeEndLineCap || '') ? 'round' : 'butt'); }
  else if (t === 'Polygon' || t === 'Polyline') { const pts = String(p.Points || '').trim(); s = sv(t.toLowerCase(), { points: pts }); const nums = pts.split(/[ ,]+/).map(Number); let mx = 0, my = 0; for (let i = 0; i + 1 < nums.length; i += 2) { mx = Math.max(mx, nums[i]); my = Math.max(my, nums[i + 1]); } W = W || mx + sw; H = H || my + sw; }
  else if (t === 'Path') { const dd = String(p.Data || '').replace(/^F[01]\s*/, ''); s = sv('path', { d: dd }); W = W || 200; H = H || 200; }
  s.setAttribute('fill', t === 'Line' || t === 'Polyline' ? (p.Fill && t === 'Polyline' ? paint(p.Fill, 'f') : 'none') : paint(p.Fill, 'f'));
  if (p.Stroke) s.setAttribute('stroke', paint(p.Stroke, 's')); s.setAttribute('stroke-width', sw);
  if (p.StrokeDashArray) s.setAttribute('stroke-dasharray', String(p.StrokeDashArray).split(/[ ,]+/).map(x => x * Math.max(1, sw)).join(' '));
  d.appendChild(s);
  d.style.overflow = 'visible';
  if (W) d.style.width = W + 'px'; if (H) d.style.height = H + 'px';
  if (t === 'Path' && !Number.isNaN(p.Width) === false) { try { const bb = s.getBBox(); } catch (x) { } }
};
P.applyTransform = function (e) {
  const d = e.dom; if (!d) return; const tr = e.p.RenderTransform;
  const one = x => { if (!(x instanceof El)) return ''; const q = x.p; switch (x.__type) { case 'RotateTransform': return `rotate(${q.Angle || 0}deg)`; case 'ScaleTransform': return `scale(${q.ScaleX === undefined ? 1 : q.ScaleX},${q.ScaleY === undefined ? 1 : q.ScaleY})`; case 'TranslateTransform': return `translate(${q.X || 0}px,${q.Y || 0}px)`; case 'SkewTransform': return `skew(${q.AngleX || 0}deg,${q.AngleY || 0}deg)`; case 'TransformGroup': return x.kids.map(one).reverse().join(' '); } return ''; };
  const center = x => (x instanceof El && (x.p.CenterX !== undefined || x.p.CenterY !== undefined)) ? `${x.p.CenterX || 0}px ${x.p.CenterY || 0}px` : null;
  d.style.transform = one(tr);
  const o = e.p.RenderTransformOrigin; d.style.transformOrigin = o ? String(o).split(',').map(v => parseFloat(v) * 100 + '%').join(' ') : (center(tr) || '0 0');
  if (tr instanceof El) { tr.owner = e; }
};
P.wireEvents = function (e) {
  const d = e.dom, t = e.__type, app = this;
  const pos = ev => ({ cx: ev.clientX, cy: ev.clientY, x: ev.offsetX, y: ev.offsetY });
  const mouse = (name, extra) => ev => { if (!app.running) return; if (ev.__done && ev.__done.has(name)) return; (ev.__done = ev.__done || new Set()).add(name); app.lastMouse = { x: ev.clientX, y: ev.clientY }; app.bubble(e, name, app.args(name === 'MouseWheel' ? 'MouseWheelEventArgs' : 'MouseButtonEventArgs', e, Object.assign(pos(ev), { button: ev.button === 2 ? 2 : ev.button === 1 ? 1 : 0, left: ev.buttons & 1, delta: ev.deltaY ? -Math.sign(ev.deltaY) * 120 : 0 }, extra))); };
  if (!['Run', 'LineBreak'].includes(t)) {
    d.addEventListener('mousedown', ev => { mouse('MouseDown')(ev); if (ev.button === 0) mouse('MouseLeftButtonDown')(ev); else if (ev.button === 2) mouse('MouseRightButtonDown')(ev); });
    d.addEventListener('mouseup', ev => { mouse('MouseUp')(ev); if (ev.button === 0) mouse('MouseLeftButtonUp')(ev); });
    d.addEventListener('mousemove', ev => { app.lastMouse = { x: ev.clientX, y: ev.clientY }; mouse('MouseMove')(ev); });
    d.addEventListener('dblclick', ev => mouse('MouseDoubleClick', { clicks: 2 })(ev));
    d.addEventListener('wheel', ev => { if (e.h.MouseWheel) { ev.preventDefault(); mouse('MouseWheel')(ev); } }, { passive: false });
    d.addEventListener('mouseenter', () => { e.hover = true; if (app.running) app.fire(e, 'MouseEnter', app.args('MouseEventArgs', e)); });
    d.addEventListener('mouseleave', () => { e.hover = false; if (app.running) app.fire(e, 'MouseLeave', app.args('MouseEventArgs', e)); });
    d.addEventListener('focusin', ev => { if (ev.target === (e.inputDom || d)) { app.focused = e; app.fire(e, 'GotFocus', app.args('RoutedEventArgs', e)); } });
    d.addEventListener('focusout', ev => { if (ev.target === (e.inputDom || d)) app.fire(e, 'LostFocus', app.args('RoutedEventArgs', e)); });
  }
  switch (t) {
    case 'Button': case 'RepeatButton': d.addEventListener('click', ev => { ev.stopPropagation(); if (!app.running || !e.p.IsEnabled) return; app.fire(e, 'Click', app.args('RoutedEventArgs', e)); }); break;
    case 'ToggleButton': d.addEventListener('click', ev => { ev.stopPropagation(); if (!app.running) return; e.set('IsChecked', !e.p.IsChecked); app.fire(e, 'Click', app.args('RoutedEventArgs', e)); }); break;
    case 'Hyperlink': d.addEventListener('click', ev => { ev.preventDefault(); if (!app.running) return; app.fire(e, 'Click', app.args('RoutedEventArgs', e)); if (e.p.NavigateUri) { let f = e; while (f && f.__type !== 'Frame') f = f.parent; if (f) app.navigate(f, e.p.NavigateUri); } }); break;
    case 'TextBox': case 'PasswordBox': d.addEventListener('input', () => { if (!app.running) return; const k = t === 'TextBox' ? 'Text' : 'Password'; e.typing = true; e.set(k, d.value); e.typing = false; if (t === 'PasswordBox') app.fire(e, 'PasswordChanged', app.args('RoutedEventArgs', e)); app.writeBack(e, k); }); break;
    case 'CheckBox': case 'RadioButton': e.inputDom.addEventListener('change', () => { if (!app.running) { e.inputDom.checked = !!e.p.IsChecked; return; } e.set('IsChecked', t === 'RadioButton' ? true : e.inputDom.checked); app.writeBack(e, 'IsChecked'); app.fire(e, 'Click', app.args('RoutedEventArgs', e)); }); break;
    case 'Slider': d.addEventListener('input', () => { if (!app.running) return; e.sliding = true; e.set('Value', parseFloat(d.value)); e.sliding = false; app.writeBack(e, 'Value'); }); break;
    case 'ComboBox': d.addEventListener('change', () => { if (!app.running) return; e.set('SelectedIndex', +d.value); }); break;
    case 'MenuItem': d.addEventListener('click', ev => { if (ev.target.closest('.w-mi') !== d) return; ev.stopPropagation(); if (!app.running) return; if (e.items.length) { const open = d.classList.contains('open'); d.parentElement.querySelectorAll(':scope > .w-mi.open').forEach(x => x.classList.remove('open')); if (!open) d.classList.add('open'); return; } let r = d.closest('.w-menu'); if (r) r.querySelectorAll('.open').forEach(x => x.classList.remove('open')); if (e.p.IsCheckable) e.set('IsChecked', !e.p.IsChecked); app.fire(e, 'Click', app.args('RoutedEventArgs', e)); let p = e.parent; while (p && p.__type === 'MenuItem') { if (p.h.Click) app.dispatch(p.h.Click, [p, app.args('RoutedEventArgs', e)]); p = p.parent; } }); break;
  }
};
P.applyProp = function (e, n, initial) {
  const d = e.dom; if (!d || !this.mount) return;
  const p = e.p; const v = p[n]; const t = e.__type;
  const isShape = WPF.TYPES[t] && WPF.TYPES[t].shape;
  switch (n) {
    case 'Title': if (e.titleDom) e.titleDom.textContent = v || ''; return;
    case 'Width': case 'Height': if (t === 'Window' || t === 'Page') return; d.style[n.toLowerCase()] = px(v); if (isShape && !initial) this.renderShape(e); return;
    case 'MinWidth': case 'MinHeight': case 'MaxWidth': case 'MaxHeight': d.style[n[0].toLowerCase() + n.slice(1)] = px(v); return;
    case 'Margin': if (Array.isArray(v)) d.style.margin = `${v[1]}px ${v[2]}px ${v[3]}px ${v[0]}px`; return;
    case 'Padding': if (Array.isArray(v)) d.style.padding = `${v[1]}px ${v[2]}px ${v[3]}px ${v[0]}px`; return;
    case 'BorderThickness': if (Array.isArray(v)) { d.style.borderStyle = 'solid'; d.style.borderWidth = `${v[1]}px ${v[2]}px ${v[3]}px ${v[0]}px`; } return;
    case 'BorderBrush': d.style.borderColor = brushCss(v); if (!p.BorderThickness && t === 'Border') { d.style.borderStyle = 'solid'; } return;
    case 'CornerRadius': d.style.borderRadius = String(v).split(',').map(x => parseFloat(x) + 'px').join(' '); return;
    case 'Background': if (t === 'Window') { d.style.background = brushCss(v); return; } d.style.background = brushCss(v); if (t === 'Button' && v) d.classList.add('custom'); return;
    case 'Foreground': d.style.color = brushCss(v); return;
    case 'FontSize': case 'FontWeight': case 'FontFamily': case 'FontStyle': this.applyText(e, d); return;
    case 'Opacity': d.style.opacity = v; return;
    case 'Visibility': d.style.visibility = v === 'Hidden' ? 'hidden' : ''; d.style.display = v === 'Collapsed' ? 'none' : ''; return;
    case 'IsEnabled': if ('disabled' in d) d.disabled = !v; if (e.inputDom) e.inputDom.disabled = !v; d.classList.toggle('w-dis', !v); return;
    case 'ToolTip': if (v !== undefined && v !== null) d.title = typeof v === 'string' ? v : this.it.str(v); return;
    case 'Cursor': d.style.cursor = { Hand: 'pointer', Arrow: 'default', Cross: 'crosshair', Wait: 'wait', IBeam: 'text', None: 'none', SizeAll: 'move' }[v] || ''; return;
    case 'HorizontalAlignment': case 'VerticalAlignment': if (!initial) this.layoutChild(e); return;
    case 'TextWrapping': d.style.whiteSpace = v === 'NoWrap' ? 'pre' : 'pre-wrap'; return;
    case 'TextAlignment': d.style.textAlign = String(v).toLowerCase(); return;
    case 'HorizontalContentAlignment': d.style.justifyContent = { Left: 'flex-start', Center: 'center', Right: 'flex-end' }[v] || ''; d.style.textAlign = String(v).toLowerCase(); return;
    case 'RenderTransform': this.applyTransform(e); return;
    case 'Angle': case 'ScaleX': case 'ScaleY': case 'X': case 'Y': case 'CenterX': case 'CenterY': { let o = e; while (o && !o.owner && o.parent && o.parent.__type === 'TransformGroup') o = o.parent; if (o && o.owner) this.applyTransform(o.owner); return; }
    case 'Content': case 'Header': case 'Child': case 'Text': case 'Password': case 'IsChecked': case 'Minimum': case 'Maximum': case 'IsReadOnly': case 'IsIndeterminate': case 'Source': case 'IsExpanded':
      if (initial) return;
      if ((n === 'Text' || n === 'Password') && e.typing) return;
      if (n === 'Value' && e.sliding) return;
      if (t === 'Run' || t === 'TextBlock' || t === 'TextBox' || t === 'PasswordBox' || t === 'CheckBox' || t === 'RadioButton' || t === 'ToggleButton' || t === 'Slider' || t === 'ProgressBar' || t === 'MenuItem') { this.renderContent(e); return; }
      this.renderContent(e); return;
    case 'Value': if (initial) return; if (e.sliding) return; this.renderContent(e); return;
    case 'SelectedIndex': if (!initial) this.renderItems(e); return;
    case 'Fill': case 'Stroke': case 'StrokeThickness': case 'X1': case 'X2': case 'Y1': case 'Y2': case 'Points': case 'Data': case 'RadiusX': case 'RadiusY': if (!initial) this.renderShape(e); return;
  }
};
P.repaintAll = function () { };

/* ---------- 3D ---------- */
const V3 = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
const vec = s => String(s || '0,0,0').split(/[ ,]+/).map(Number);
function rotAxis(p, axis, deg) { const k = V3.norm(axis), t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); const kxp = V3.cross(k, p), kd = V3.dot(k, p); return [p[0] * c + kxp[0] * s + k[0] * kd * (1 - c), p[1] * c + kxp[1] * s + k[1] * kd * (1 - c), p[2] * c + kxp[2] * s + k[2] * kd * (1 - c)]; }
P.start3D = function (e) {
  const cv = e.dom; const app = this;
  const W = Number.isNaN(e.p.Width) ? 300 : e.p.Width, H = Number.isNaN(e.p.Height) ? 220 : e.p.Height;
  cv.width = W * 2; cv.height = H * 2; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.minHeight = '120px';
  const draw = () => {
    if (!cv.isConnected) return;
    const ctx = cv.getContext('2d'); const w = cv.width, hh = cv.height; ctx.clearRect(0, 0, w, hh);
    let cam = e.p.Camera; if (Array.isArray(cam)) cam = cam[0];
    const cp = cam ? vec(cam.p.Position || '0,0,5') : [0, 0, 5], look = V3.norm(cam ? vec(cam.p.LookDirection || '0,0,-1') : [0, 0, -1]), up = cam ? vec(cam.p.UpDirection || '0,1,0') : [0, 1, 0];
    const fov = (cam && cam.p.FieldOfView ? cam.p.FieldOfView : 45) * Math.PI / 180;
    const r = V3.norm(V3.cross(look, up)), u = V3.cross(r, look); const sc = (w / 2) / Math.tan(fov / 2);
    const tris = [], lights = { amb: [0, 0, 0], dir: [] };
    const xf = (tr, pt) => { if (!tr) return pt; const L = Array.isArray(tr) ? tr : [tr]; for (const t of L) { if (!(t instanceof El)) continue; if (t.__type === 'Transform3DGroup') { pt = xf(t.kids, pt); continue; } if (t.__type === 'RotateTransform3D') { let rot = t.p.Rotation; if (Array.isArray(rot)) rot = rot[0]; if (!rot && t.kids[0]) rot = t.kids[0]; if (rot) { const c = vec(t.p.CenterX !== undefined ? `${t.p.CenterX},${t.p.CenterY || 0},${t.p.CenterZ || 0}` : '0,0,0'); pt = V3.sub(rotAxis(V3.sub(pt, c), vec(rot.p.Axis || '0,1,0'), rot.p.Angle || 0), c.map(x => -x)); } } if (t.__type === 'ScaleTransform3D') pt = [pt[0] * (+t.p.ScaleX || 1), pt[1] * (+t.p.ScaleY || 1), pt[2] * (+t.p.ScaleZ || 1)]; if (t.__type === 'TranslateTransform3D') pt = [pt[0] + (+t.p.OffsetX || 0), pt[1] + (+t.p.OffsetY || 0), pt[2] + (+t.p.OffsetZ || 0)]; } return pt; };
    const col = m => { if (Array.isArray(m)) m = m[0]; if (!m) return null; let b = m.p.Brush; if (Array.isArray(b)) b = b[0]; if (b instanceof El) b = b.p.Color; if (b instanceof Brush) b = b.color; return b ? (WPF.parseColor(b) || b) : null; };
    const visit = (n, trs) => {
      if (!(n instanceof El)) { if (Array.isArray(n)) n.forEach(x => visit(x, trs)); return; }
      const T2 = n.p.Transform ? [n.p.Transform].concat(trs) : trs;
      switch (n.__type) {
        case 'ModelVisual3D': if (n.p.Content) visit(n.p.Content, T2); n.kids.forEach(k => visit(k, T2)); return;
        case 'Model3DGroup': n.kids.forEach(k => visit(k, T2)); if (n.p.Children) visit(n.p.Children, T2); return;
        case 'AmbientLight': { const c = rgb(n.p.Color || 'gray'); lights.amb = lights.amb.map((x, i) => x + c[i]); return; }
        case 'DirectionalLight': lights.dir.push({ c: rgb(n.p.Color || 'white'), d: V3.norm(vec(n.p.Direction || '0,0,-1')) }); return;
        case 'PointLight': lights.dir.push({ c: rgb(n.p.Color || 'white'), d: V3.norm(V3.sub([0, 0, 0], vec(n.p.Position || '0,0,5'))) }); return;
        case 'GeometryModel3D': {
          let g = n.p.Geometry; if (Array.isArray(g)) g = g[0]; if (!(g instanceof El)) return;
          const pos = vec(g.p.Positions); const pts = []; for (let i = 0; i + 2 < pos.length; i += 3) { let q = [pos[i], pos[i + 1], pos[i + 2]]; for (const t of T2) q = xf(t, q); pts.push(q); }
          let idx = String(g.p.TriangleIndices || '').trim() ? vec(g.p.TriangleIndices) : pts.map((_, i) => i);
          const front = col(n.p.Material) || '#888', back = col(n.p.BackMaterial);
          for (let i = 0; i + 2 < idx.length; i += 3) { const a = pts[idx[i]], b = pts[idx[i + 1]], c = pts[idx[i + 2]]; if (!a || !b || !c) continue; tris.push({ a, b, c, front, back }); }
          return;
        }
      }
    };
    const rgb = c => { const x = WPF.parseColor(c) || c; const tmp = document.createElement('canvas').getContext('2d'); tmp.fillStyle = x; const s = tmp.fillStyle; const m = /^#(..)(..)(..)/.exec(s); if (m) return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]; const m2 = /\d+(\.\d+)?/g; const p = s.match(m2) || [0, 0, 0]; return [p[0] / 255, p[1] / 255, p[2] / 255]; };
    (e.kids || []).forEach(k => visit(k, []));
    const proj = q => { const d = V3.sub(q, cp); const z = V3.dot(d, look); return [w / 2 + V3.dot(d, r) * sc / z, hh / 2 - V3.dot(d, u) * sc / z, z]; };
    const out = [];
    for (const t of tris) {
      const n = V3.norm(V3.cross(V3.sub(t.b, t.a), V3.sub(t.c, t.a)));
      const toCam = V3.sub(t.a, cp); let facing = V3.dot(n, toCam) < 0; let base = t.front; let nn = n;
      if (!facing) { if (!t.back) continue; base = t.back; nn = n.map(x => -x); }
      const pa = proj(t.a), pb = proj(t.b), pc = proj(t.c); if (pa[2] <= 0.01 || pb[2] <= 0.01 || pc[2] <= 0.01) continue;
      const bc = rgb(base); let li = lights.amb.slice(); if (!lights.dir.length && !li.some(x => x)) li = [0.4, 0.4, 0.4];
      for (const L of lights.dir) { const k = Math.max(0, -V3.dot(nn, L.d)); li = li.map((x, i) => x + L.c[i] * k); }
      if (!lights.dir.length && !lights.amb.some(x => x)) { const k = Math.max(0, -V3.dot(nn, look)); li = li.map(x => x + 0.6 * k); }
      const fc = bc.map((x, i) => Math.round(Math.min(1, x * li[i]) * 255));
      out.push({ pa, pb, pc, z: (pa[2] + pb[2] + pc[2]) / 3, c: `rgb(${fc.join(',')})` });
    }
    out.sort((x, y) => y.z - x.z);
    for (const t of out) { ctx.beginPath(); ctx.moveTo(t.pa[0], t.pa[1]); ctx.lineTo(t.pb[0], t.pb[1]); ctx.lineTo(t.pc[0], t.pc[1]); ctx.closePath(); ctx.fillStyle = t.c; ctx.strokeStyle = t.c; ctx.lineWidth = 1; ctx.fill(); ctx.stroke(); }
    if (app.running) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
};
})(typeof window !== 'undefined' ? window : globalThis);
