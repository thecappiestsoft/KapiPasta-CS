/* ===== KapiWPF: symulator WPF/XAML w przeglądarce =====
   Parsuje XAML, buduje drzewo kontrolek, renderuje je jako HTML/SVG/canvas i łączy z code-behind w C#
   (uruchamianym przez KapiSharp). Działa też bez DOM (tryb „headless” do sprawdzania zadań). */
(function (G) {
'use strict';
const CS = G.CS;
const WPF = G.WPF = {};
const HAS_DOM = typeof document !== 'undefined';
const { N, Obj, Arr, Coll, EnumVal, Fn, MRef, Multi, Ref, mk, num } = CS;

class XamlError extends Error { constructor(code, msg, line, col) { super(msg); this.code = code; this.line = line; this.col = col; } }
WPF.XamlError = XamlError;

/* ---------- XML ---------- */
function parseXml(src) {
  let i = 0, line = 1, col = 1;
  const n = src.length;
  const adv = k => { for (let j = 0; j < k; j++) { if (src[i] === '\n') { line++; col = 1; } else col++; i++; } };
  const err = (msg, l = line, c = col) => { throw new XamlError('XML', `${msg} Line ${l}, position ${c}.`, l, c); };
  const ent = s => s.replace(/&(lt|gt|amp|quot|apos|#\d+|#x[0-9a-fA-F]+);/g, (m, e) => ({ lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" }[e] || String.fromCharCode(e[1] === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1))));
  const root = { tag: '#root', children: [], attrs: [] };
  const stack = [root];
  while (i < n) {
    if (src.startsWith('<!--', i)) { const j = src.indexOf('-->', i); if (j < 0) err('Unexpected end of file while parsing Comment has occurred.'); adv(j + 3 - i); continue; }
    if (src.startsWith('<?', i)) { const j = src.indexOf('?>', i); adv(j + 2 - i); continue; }
    if (src.startsWith('<![CDATA[', i)) { const j = src.indexOf(']]>', i); stack[stack.length - 1].children.push({ tag: '#text', text: src.slice(i + 9, j) }); adv(j + 3 - i); continue; }
    if (src[i] === '<' && src[i + 1] === '/') {
      const l0 = line, c0 = col; adv(2); let name = ''; while (i < n && /[^\s>]/.test(src[i])) { name += src[i]; adv(1); }
      while (i < n && src[i] !== '>') adv(1); adv(1);
      const top = stack.pop();
      if (!top || top.tag !== name) err(`The '${top ? top.tag : '?'}' start tag on line ${top ? top.line : '?'} position ${top ? top.col : '?'} does not match the end tag of '${name}'.`, l0, c0 + 2);
      continue;
    }
    if (src[i] === '<') {
      const l0 = line, c0 = col; adv(1);
      let name = ''; while (i < n && /[^\s/>]/.test(src[i])) { name += src[i]; adv(1); }
      if (!name) err('Name cannot begin with the \'' + src[i] + '\' character.', l0, c0 + 1);
      const el = { tag: name, attrs: [], children: [], line: l0, col: c0 + 1 };
      for (;;) {
        while (i < n && /\s/.test(src[i])) adv(1);
        if (i >= n) err(`Unexpected end of file has occurred. The following elements are not closed: ${name}.`);
        if (src[i] === '/' && src[i + 1] === '>') { adv(2); stack[stack.length - 1].children.push(el); break; }
        if (src[i] === '>') { adv(1); stack[stack.length - 1].children.push(el); stack.push(el); break; }
        const al = line, ac = col; let an = ''; while (i < n && /[^\s=/>]/.test(src[i])) { an += src[i]; adv(1); }
        while (/\s/.test(src[i])) adv(1);
        if (src[i] !== '=') err(`'${src[i]}' is an unexpected token. The expected token is '='.`);
        adv(1); while (/\s/.test(src[i])) adv(1);
        const q = src[i]; if (q !== '"' && q !== '\'') err(`'${src[i]}' is an unexpected token. The expected token is '"' or '''.`);
        adv(1); let v = ''; while (i < n && src[i] !== q) { if (src[i] === '<') err(`'<', hexadecimal value 0x3C, is an invalid attribute character.`); v += src[i]; adv(1); }
        if (i >= n) err('Unexpected end of file while parsing Name has occurred.');
        adv(1);
        if (el.attrs.some(a => a.name === an)) err(`'${an}' is a duplicate attribute name.`, al, ac);
        el.attrs.push({ name: an, value: ent(v), line: al, col: ac });
      }
      continue;
    }
    let t = ''; const tl = line, tc = col; while (i < n && src[i] !== '<') { t += src[i]; adv(1); }
    if (t.trim()) { if (stack.length === 1) err('Data at the root level is invalid.', tl, tc); stack[stack.length - 1].children.push({ tag: '#text', text: ent(t), line: tl, col: tc }); }
  }
  if (stack.length > 1) err(`Unexpected end of file has occurred. The following elements are not closed: ${stack.slice(1).map(x => x.tag).reverse().join(', ')}.`);
  const roots = root.children.filter(c => c.tag !== '#text');
  if (!roots.length) err('Root element is missing.');
  return roots[0];
}
WPF.parseXml = parseXml;

/* ---------- types, properties ---------- */
const FE = 'Name Width Height MinWidth MinHeight MaxWidth MaxHeight Margin HorizontalAlignment VerticalAlignment Visibility Opacity IsEnabled ToolTip Cursor Style Tag RenderTransform RenderTransformOrigin LayoutTransform DataContext Focusable ClipToBounds Uid SnapsToDevicePixels UseLayoutRounding FlowDirection IsHitTestVisible Effect OpacityMask Resources Triggers';
const CTRL = FE + ' Background Foreground BorderBrush BorderThickness Padding FontSize FontWeight FontFamily FontStyle HorizontalContentAlignment VerticalContentAlignment IsTabStop TabIndex Template';
const EVT = 'Click MouseDown MouseUp MouseLeftButtonDown MouseLeftButtonUp MouseRightButtonDown MouseMove MouseEnter MouseLeave MouseWheel KeyDown KeyUp PreviewKeyDown TextChanged Checked Unchecked ValueChanged SelectionChanged Loaded GotFocus LostFocus Closing Closed SizeChanged MouseDoubleClick';
const T = {};
const def = (names, props, opt = {}) => names.split(' ').forEach(nm => { T[nm] = Object.assign({ props: new Set((props + ' ' + EVT).split(' ').filter(Boolean)) }, opt); });
def('Window', CTRL + ' Title Content ResizeMode WindowStartupLocation WindowState Topmost Icon ShowInTaskbar SizeToContent WindowStyle AllowsTransparency DialogResult', { content: 'one' });
def('Page', CTRL + ' Title Content WindowTitle ShowsNavigationUI KeepAlive', { content: 'one' });
def('UserControl', CTRL + ' Content', { content: 'one' });
def('Grid', FE + ' Background ShowGridLines RowDefinitions ColumnDefinitions', { content: 'many', panel: 1 });
def('StackPanel', FE + ' Background Orientation', { content: 'many', panel: 1 });
def('WrapPanel', FE + ' Background Orientation ItemWidth ItemHeight', { content: 'many', panel: 1 });
def('DockPanel', FE + ' Background LastChildFill', { content: 'many', panel: 1 });
def('Canvas', FE + ' Background', { content: 'many', panel: 1 });
def('UniformGrid', FE + ' Background Rows Columns', { content: 'many', panel: 1 });
def('Border', FE + ' Background BorderBrush BorderThickness CornerRadius Padding Child', { content: 'one' });
def('ScrollViewer', CTRL + ' VerticalScrollBarVisibility HorizontalScrollBarVisibility Content', { content: 'one' });
def('Viewbox', FE + ' Stretch Child', { content: 'one' });
def('GroupBox', CTRL + ' Header Content', { content: 'one' });
def('Expander', CTRL + ' Header Content IsExpanded', { content: 'one' });
def('TextBlock', FE + ' Text Background Foreground FontSize FontWeight FontFamily FontStyle TextWrapping TextAlignment Padding TextDecorations LineHeight TextTrimming Inlines', { content: 'inline' });
def('Label', CTRL + ' Content Target', { content: 'one' });
def('Button', CTRL + ' Content IsDefault IsCancel Command CommandParameter', { content: 'one' });
def('RepeatButton', CTRL + ' Content Delay Interval', { content: 'one' });
def('ToggleButton', CTRL + ' Content IsChecked', { content: 'one' });
def('TextBox', CTRL + ' Text IsReadOnly AcceptsReturn TextWrapping MaxLength TextAlignment VerticalScrollBarVisibility CaretBrush', { content: 'text' });
def('PasswordBox', CTRL + ' Password PasswordChar MaxLength PasswordChanged', { content: 'none' });
def('CheckBox', CTRL + ' Content IsChecked IsThreeState', { content: 'one' });
def('RadioButton', CTRL + ' Content IsChecked GroupName', { content: 'one' });
def('Slider', CTRL + ' Value Minimum Maximum TickFrequency IsSnapToTickEnabled TickPlacement SmallChange LargeChange Orientation', { content: 'none' });
def('ProgressBar', CTRL + ' Value Minimum Maximum IsIndeterminate Orientation', { content: 'none' });
def('ComboBox', CTRL + ' SelectedIndex SelectedItem Text IsEditable ItemsSource DisplayMemberPath SelectedValue IsDropDownOpen', { content: 'items' });
def('ListBox', CTRL + ' SelectedIndex SelectedItem ItemsSource DisplayMemberPath SelectionMode SelectedValue', { content: 'items' });
def('ComboBoxItem ListBoxItem TabItem', CTRL + ' Content IsSelected Header', { content: 'one' });
def('TabControl', CTRL + ' SelectedIndex TabStripPlacement', { content: 'items' });
def('Image', FE + ' Source Stretch', { content: 'none' });
def('Separator', FE + ' Background', { content: 'none' });
def('Menu', CTRL + ' IsMainMenu', { content: 'items' });
def('MenuItem', CTRL + ' Header IsCheckable IsChecked InputGestureText Icon Command', { content: 'items' });
def('ToolBar StatusBar', CTRL + ' Header', { content: 'items' });
def('StatusBarItem', CTRL + ' Content', { content: 'one' });
def('Frame', CTRL + ' Source NavigationUIVisibility Content', { content: 'one' });
def('Rectangle Ellipse', FE + ' Fill Stroke StrokeThickness RadiusX RadiusY Stretch StrokeDashArray', { content: 'none', shape: 1 });
def('Line', FE + ' Fill Stroke StrokeThickness X1 Y1 X2 Y2 StrokeDashArray StrokeStartLineCap StrokeEndLineCap', { content: 'none', shape: 1 });
def('Polygon Polyline', FE + ' Fill Stroke StrokeThickness Points Stretch StrokeLineJoin', { content: 'none', shape: 1 });
def('Path', FE + ' Fill Stroke StrokeThickness Data Stretch', { content: 'none', shape: 1 });
def('Run', 'Text Foreground FontWeight FontSize FontStyle Background Name', { content: 'text' });
def('Bold Italic Underline Span', 'Foreground FontSize Name', { content: 'inline' });
def('LineBreak', 'Name', { content: 'none' });
def('Hyperlink', 'NavigateUri Foreground Name Click', { content: 'inline' });
def('Viewport3D', FE + ' Camera Children', { content: 'many' });
// non-visual
const NV = 'RowDefinition ColumnDefinition SolidColorBrush LinearGradientBrush RadialGradientBrush GradientStop RotateTransform ScaleTransform TranslateTransform SkewTransform TransformGroup Storyboard DoubleAnimation ColorAnimation ThicknessAnimation EventTrigger BeginStoryboard Style Setter Trigger PerspectiveCamera OrthographicCamera ModelVisual3D Model3DGroup GeometryModel3D MeshGeometry3D DiffuseMaterial EmissiveMaterial SpecularMaterial DirectionalLight AmbientLight PointLight RotateTransform3D AxisAngleRotation3D ScaleTransform3D TranslateTransform3D Transform3DGroup DropShadowEffect BlurEffect ImageBrush'.split(' ');
NV.forEach(nm => { if (!T[nm]) T[nm] = { props: null, nv: true }; });
WPF.TYPES = T;
const ATTACHED = { Grid: ['Row', 'Column', 'RowSpan', 'ColumnSpan'], Canvas: ['Left', 'Top', 'Right', 'Bottom', 'ZIndex'], DockPanel: ['Dock'], Panel: ['ZIndex'], ToolTipService: ['ShowDuration', 'InitialShowDelay'], Storyboard: ['TargetName', 'TargetProperty', 'Target'], KeyboardNavigation: ['TabNavigation'], ScrollViewer: ['VerticalScrollBarVisibility', 'HorizontalScrollBarVisibility'] };

const PT = {
  Width: 'd', Height: 'd', MinWidth: 'd', MinHeight: 'd', MaxWidth: 'd', MaxHeight: 'd', Opacity: 'd', FontSize: 'd', Value: 'd', Minimum: 'd', Maximum: 'd', StrokeThickness: 'd', RadiusX: 'd', RadiusY: 'd',
  X1: 'd', Y1: 'd', X2: 'd', Y2: 'd', Angle: 'd', CenterX: 'd', CenterY: 'd', ScaleX: 'd', ScaleY: 'd', X: 'd', Y: 'd', TickFrequency: 'd', Offset: 'd', ActualWidth: 'd', ActualHeight: 'd', FieldOfView: 'd', CornerRadius: 'd', ItemWidth: 'd', ItemHeight: 'd', AngleX: 'd', AngleY: 'd',
  Text: 's', Title: 's', Password: 's', Source: 's', NavigateUri: 's', GroupName: 's', InputGestureText: 's', Name: 's', Points: 's', Data: 's', DisplayMemberPath: 's', ToolTip: 'c', Tag: 'any',
  IsChecked: 'b?', IsEnabled: 'b', IsReadOnly: 'b', IsSnapToTickEnabled: 'b', AcceptsReturn: 'b', IsDefault: 'b', IsCancel: 'b', IsCheckable: 'b', LastChildFill: 'b', ShowGridLines: 'b', IsIndeterminate: 'b', IsExpanded: 'b', IsSelected: 'b', IsEditable: 'b', Topmost: 'b', IsThreeState: 'b',
  SelectedIndex: 'i', Rows: 'i', Columns: 'i', MaxLength: 'i', TabIndex: 'i',
  Background: 'brush', Foreground: 'brush', Fill: 'brush', Stroke: 'brush', BorderBrush: 'brush', Color: 'color',
  Margin: 'thick', Padding: 'thick', BorderThickness: 'thick',
  Content: 'c', Header: 'c', Child: 'c',
  Visibility: 'e:Visibility', Orientation: 'e:Orientation', HorizontalAlignment: 'e:HorizontalAlignment', VerticalAlignment: 'e:VerticalAlignment', TextWrapping: 'e:TextWrapping', TextAlignment: 'e:TextAlignment',
  FontWeight: 'fw', FontStyle: 's', FontFamily: 's', Cursor: 's', ResizeMode: 's', WindowStartupLocation: 's', NavigationUIVisibility: 's', Stretch: 's', HorizontalContentAlignment: 'e:HorizontalAlignment', VerticalContentAlignment: 'e:VerticalAlignment',
};
const ENUMS = {
  Visibility: ['Visible', 'Hidden', 'Collapsed'], Orientation: ['Horizontal', 'Vertical'], HorizontalAlignment: ['Left', 'Center', 'Right', 'Stretch'], VerticalAlignment: ['Top', 'Center', 'Bottom', 'Stretch'],
  TextWrapping: ['WrapWithOverflow', 'NoWrap', 'Wrap'], TextAlignment: ['Left', 'Right', 'Center', 'Justify'], MessageBoxButton: ['OK', 'OKCancel', 'YesNoCancel', 'YesNo'],
  MessageBoxResult: [['None', 0], ['OK', 1], ['Cancel', 2], ['Yes', 6], ['No', 7]], MessageBoxImage: [['None', 0], ['Error', 16], ['Hand', 16], ['Stop', 16], ['Question', 32], ['Warning', 48], ['Exclamation', 48], ['Information', 64], ['Asterisk', 64]],
  MouseButton: ['Left', 'Middle', 'Right', 'XButton1', 'XButton2'], Dock: ['Left', 'Top', 'Right', 'Bottom'], MouseButtonState: ['Released', 'Pressed'],
  Key: [['None', 0], ['Back', 2], ['Tab', 3], ['Enter', 6], ['Return', 6], ['Escape', 13], ['Space', 18], ['PageUp', 19], ['PageDown', 20], ['End', 21], ['Home', 22], ['Left', 23], ['Up', 24], ['Right', 25], ['Down', 26], ['Delete', 32],
    ...'0123456789'.split('').map((d, k) => ['D' + d, 34 + k]), ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c, k) => [c, 44 + k]), ...'0123456789'.split('').map((d, k) => ['NumPad' + d, 74 + k]), ['Add', 85], ['Subtract', 87], ['F1', 90], ['F2', 91], ['F5', 94], ['LeftShift', 116], ['LeftCtrl', 118]],
  WindowState: ['Normal', 'Minimized', 'Maximized'], SelectionMode: ['Single', 'Multiple', 'Extended'], ResizeMode: ['NoResize', 'CanMinimize', 'CanResize', 'CanResizeWithGrip'],
};
const KEYMAP = { Backspace: 'Back', Tab: 'Tab', Enter: 'Enter', Escape: 'Escape', ' ': 'Space', PageUp: 'PageUp', PageDown: 'PageDown', End: 'End', Home: 'Home', ArrowLeft: 'Left', ArrowUp: 'Up', ArrowRight: 'Right', ArrowDown: 'Down', Delete: 'Delete', Shift: 'LeftShift', Control: 'LeftCtrl', F1: 'F1', F2: 'F2', F5: 'F5', '+': 'Add', '-': 'Subtract' };
function mkEnums() { const out = {}; for (const k in ENUMS) { const E = { name: k, kind: 'enum', members: ENUMS[k].map((m, i) => Array.isArray(m) ? { name: m[0], v: m[1] } : { name: m, v: i }), byName: new Map(), builtin: true }; E.members.forEach(m => { if (!E.byName.has(m.name)) E.byName.set(m.name, m.v); }); out[k] = E; } return out; }
const HOST_TYPES = new Set(['Window', 'Page', 'UserControl', 'Button', 'TextBox', 'TextBlock', 'Label', 'CheckBox', 'RadioButton', 'Slider', 'ProgressBar', 'ComboBox', 'ComboBoxItem', 'ListBox', 'ListBoxItem', 'Image', 'Grid', 'StackPanel', 'Canvas', 'WrapPanel', 'DockPanel', 'Border',
  'Rectangle', 'Ellipse', 'Line', 'Polygon', 'Polyline', 'Path', 'Shape', 'UIElement', 'FrameworkElement', 'Control', 'Panel', 'ContentControl', 'Brush', 'Brushes', 'SolidColorBrush', 'LinearGradientBrush', 'Color', 'Colors', 'Thickness', 'MessageBox', 'RoutedEventArgs', 'MouseButtonEventArgs', 'MouseEventArgs', 'KeyEventArgs', 'TextChangedEventArgs',
  'SelectionChangedEventArgs', 'RoutedPropertyChangedEventArgs', 'MouseWheelEventArgs', 'Point', 'DispatcherTimer', 'DoubleAnimation', 'ColorAnimation', 'Duration', 'RepeatBehavior', 'Storyboard', 'RotateTransform', 'ScaleTransform', 'TranslateTransform', 'IValueConverter', 'CultureInfo', 'NavigationService', 'Frame', 'Menu', 'MenuItem', 'FontWeights',
  'DependencyProperty', 'Keyboard', 'Mouse', 'Application', 'ObservableCollection', 'INotifyPropertyChanged', 'PropertyChangedEventArgs', 'PropertyChangedEventHandler', 'Uri', 'UriKind', 'ItemCollection', 'UIElementCollection', 'TabControl', 'TabItem', 'GroupBox', 'ScrollViewer', 'UniformGrid', 'Run', 'Hyperlink', 'PasswordBox', 'Separator', 'Cursors', 'Fonts', 'CancelEventArgs', 'Key', 'ModifierKeys']);

/* ---------- colors / brushes ---------- */
const NAMED = { Transparent: 'rgba(0,0,0,0)' };
const KNOWN_COLORS = new Set('AliceBlue AntiqueWhite Aqua Aquamarine Azure Beige Bisque Black BlanchedAlmond Blue BlueViolet Brown BurlyWood CadetBlue Chartreuse Chocolate Coral CornflowerBlue Cornsilk Crimson Cyan DarkBlue DarkCyan DarkGoldenrod DarkGray DarkGreen DarkKhaki DarkMagenta DarkOliveGreen DarkOrange DarkOrchid DarkRed DarkSalmon DarkSeaGreen DarkSlateBlue DarkSlateGray DarkTurquoise DarkViolet DeepPink DeepSkyBlue DimGray DodgerBlue Firebrick FloralWhite ForestGreen Fuchsia Gainsboro GhostWhite Gold Goldenrod Gray Green GreenYellow Honeydew HotPink IndianRed Indigo Ivory Khaki Lavender LavenderBlush LawnGreen LemonChiffon LightBlue LightCoral LightCyan LightGoldenrodYellow LightGray LightGreen LightPink LightSalmon LightSeaGreen LightSkyBlue LightSlateGray LightSteelBlue LightYellow Lime LimeGreen Linen Magenta Maroon MediumAquamarine MediumBlue MediumOrchid MediumPurple MediumSeaGreen MediumSlateBlue MediumSpringGreen MediumTurquoise MediumVioletRed MidnightBlue MintCream MistyRose Moccasin NavajoWhite Navy OldLace Olive OliveDrab Orange OrangeRed Orchid PaleGoldenrod PaleGreen PaleTurquoise PaleVioletRed PapayaWhip PeachPuff Peru Pink Plum PowderBlue Purple Red RosyBrown RoyalBlue SaddleBrown Salmon SandyBrown SeaGreen SeaShell Sienna Silver SkyBlue SlateBlue SlateGray Snow SpringGreen SteelBlue Tan Teal Thistle Tomato Transparent Turquoise Violet Wheat White WhiteSmoke Yellow YellowGreen'.toLowerCase().split(' '));
function parseColor(s) {
  s = String(s).trim();
  if (/^#[0-9a-fA-F]{8}$/.test(s)) { const a = parseInt(s.slice(1, 3), 16) / 255; return `rgba(${parseInt(s.slice(3, 5), 16)},${parseInt(s.slice(5, 7), 16)},${parseInt(s.slice(7, 9), 16)},${+a.toFixed(3)})`; }
  if (/^#[0-9a-fA-F]{6}$/.test(s) || /^#[0-9a-fA-F]{3}$/.test(s)) return s;
  if (/^#[0-9a-fA-F]{4}$/.test(s)) { const h = s.slice(1).split('').map(c => c + c); return parseColor('#' + h.join('')); }
  if (NAMED[s]) return NAMED[s];
  if (/^[A-Za-z]+$/.test(s) && KNOWN_COLORS.has(s.toLowerCase())) return s.toLowerCase();
  return null;
}
class Brush { constructor(kind, o) { this.__host = true; this.__type = kind; Object.assign(this, o); } __get(n) { if (n === 'Color') return new ColorV(this.color); if (n === 'Opacity') return mk('double', this.opacity === undefined ? 1 : this.opacity); } __ref(n) { if (n === 'Color') return new Ref(() => new ColorV(this.color), v => { this.color = v.css; if (this.onChange) this.onChange(); }); if (n === 'Opacity') return new Ref(() => mk('double', 1), v => { this.opacity = num(v); if (this.onChange) this.onChange(); }); } __call(n) { if (n === 'ToString') return this.toStr(); if (n === 'Clone') return new Brush(this.__type, { color: this.color, stops: this.stops }); } toStr() { return this.__type === 'SolidColorBrush' ? colorHex(this.color) : 'System.Windows.Media.' + this.__type; } css() { if (this.__type === 'SolidColorBrush') return this.color; if (this.__type === 'LinearGradientBrush') { const a = Math.round(Math.atan2((this.end[1] - this.start[1]), (this.end[0] - this.start[0])) * 180 / Math.PI) + 90; return `linear-gradient(${a}deg, ${this.stops.map(s => `${s.c} ${s.o * 100}%`).join(', ')})`; } if (this.__type === 'RadialGradientBrush') return `radial-gradient(circle, ${this.stops.map(s => `${s.c} ${s.o * 100}%`).join(', ')})`; return this.color || 'transparent'; } }
class ColorV { constructor(css) { this.__host = true; this.__type = 'Color'; this.css = css; } __get(n) { const rgb = cssRgb(this.css); const m = { R: rgb[0], G: rgb[1], B: rgb[2], A: Math.round(rgb[3] * 255) }; if (n in m) return mk('byte', m[n]); } __call(n) { if (n === 'ToString') return colorHex(this.css); } toStr() { return colorHex(this.css); } }
let CTX2 = null;
function cssRgb(c) {
  if (/^#/.test(c)) { let h = c.slice(1); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]; }
  const m = /rgba?\(([^)]+)\)/.exec(c); if (m) { const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; }
  if (HAS_DOM) { CTX2 = CTX2 || document.createElement('canvas').getContext('2d'); CTX2.fillStyle = '#000'; CTX2.fillStyle = c; return cssRgb(CTX2.fillStyle); }
  return [0, 0, 0, 1];
}
function colorHex(c) { const [r, g, b, a] = cssRgb(c); const h = x => Math.round(x).toString(16).padStart(2, '0').toUpperCase(); return '#' + h(a * 255) + h(r) + h(g) + h(b); }
const BRUSH_CACHE = {};
function namedBrush(name) { return BRUSH_CACHE[name] || (BRUSH_CACHE[name] = new Brush('SolidColorBrush', { color: parseColor(name) || name.toLowerCase(), frozen: true, name })); }
function brushFrom(v) { if (v instanceof Brush) return v; if (v instanceof ColorV) return new Brush('SolidColorBrush', { color: v.css }); if (typeof v === 'string') { const c = parseColor(v); if (!c) return null; return /^[A-Za-z]+$/.test(v) ? namedBrush(v[0].toUpperCase() + v.slice(1)) : new Brush('SolidColorBrush', { color: c }); } return null; }
WPF.parseColor = parseColor;

/* ---------- helpers ---------- */
const thick = s => { const p = String(s).split(/[ ,]+/).filter(Boolean).map(Number); if (p.length === 1) return [p[0], p[0], p[0], p[0]]; if (p.length === 2) return [p[0], p[1], p[0], p[1]]; return [p[0], p[1], p[2], p[3]]; };
const dbl = s => { if (s === 'Auto' || s === 'NaN') return NaN; const v = parseFloat(s); return v; };
const dur = s => { if (!s) return 1000; if (s === 'Forever') return Infinity; const p = String(s).split(':').map(Number); if (p.length === 3) return ((p[0] * 60 + p[1]) * 60 + p[2]) * 1000; return p[0] * 1000; };
const csv = v => (v instanceof N ? num(v) : v);
function toCS(v, t) {
  if (v === undefined) return undefined;
  switch (t) {
    case 'd': return mk('double', v === null || v === undefined || Number.isNaN(v) ? NaN : v);
    case 'i': return CS.I(v);
    case 'b': return !!v;
    case 'b?': return v === null ? null : !!v;
    case 's': return v === null || v === undefined ? '' : String(v);
  }
  if (t && t.startsWith('e:')) { const E = WPF._enums[t.slice(2)]; return new EnumVal(E, E.byName.get(v) || 0); }
  return v;
}
function fromCS(v, t, app, nd) {
  if (t === 'd') { if (v instanceof N) return num(v); if (typeof v === 'string') throw app.convErr(v, 'double', nd); return v; }
  if (t === 'i') { if (v instanceof N) return num(v); return v; }
  if (t === 'b' || t === 'b?') { if (typeof v === 'boolean' || v === null) return v; throw app.convErr(v, 'bool', nd); }
  if (t === 's') { if (v === null) return ''; if (typeof v === 'string') return v; throw app.convErr(v, 'string', nd); }
  if (t === 'brush') { if (v === null) return null; if (v instanceof Brush) return v; throw app.convErr(v, 'System.Windows.Media.Brush', nd); }
  if (t === 'thick') { if (v && v.__type === 'Thickness') return [v.l, v.t, v.r, v.b]; if (v instanceof N) return thick(String(num(v))); return v; }
  if (t && t.startsWith('e:')) { if (v instanceof EnumVal) return v.e.members.find(m => m.v === v.v).name; return v; }
  if (t === 'fw') { if (v && v.__type === 'FontWeight') return v.w; return v; }
  if (t === 'c') return v instanceof N || typeof v === 'boolean' ? app.it.str(v) : v;
  return v;
}

/* ---------- element ---------- */
let EID = 0;
class El {
  constructor(app, type, node) {
    this.app = app; this.__host = true; this.__type = type; this.p = {}; this.kids = []; this.parent = null; this.h = {}; this.dom = null; this.node = node; this.id = ++EID; this.att = {}; this.items = [];
    const D = { Width: NaN, Height: NaN, Opacity: 1, IsEnabled: true, Visibility: 'Visible', FontSize: type === 'Window' || type === 'Page' ? 12 : undefined };
    if (type === 'Slider') Object.assign(D, { Minimum: 0, Maximum: 10, Value: 0 });
    if (type === 'ProgressBar') Object.assign(D, { Minimum: 0, Maximum: 100, Value: 0 });
    if (type === 'ComboBox' || type === 'ListBox' || type === 'TabControl') D.SelectedIndex = -1;
    if (type === 'CheckBox' || type === 'RadioButton' || type === 'ToggleButton') D.IsChecked = false;
    if (type === 'StackPanel') D.Orientation = 'Vertical';
    if (type === 'WrapPanel') D.Orientation = 'Horizontal';
    if (type === 'TextBox' || type === 'TextBlock') D.Text = '';
    if (type === 'PasswordBox') D.Password = '';
    if (type === 'DockPanel') D.LastChildFill = true;
    Object.assign(this.p, D);
  }
  get name() { return this.p.Name || null; }
  pt(n) { return PT[n] || 'any'; }
  __get(n, nd) {
    const app = this.app;
    switch (n) {
      case 'Children': if (!T[this.__type] || !T[this.__type].panel) break; return app.coll(this, 'kids');
      case 'Items': return app.coll(this, 'items');
      case 'Inlines': return app.coll(this, 'kids');
      case 'ActualWidth': return mk('double', this.dom && HAS_DOM ? this.dom.offsetWidth : (Number.isNaN(this.p.Width) ? 0 : this.p.Width));
      case 'ActualHeight': return mk('double', this.dom && HAS_DOM ? this.dom.offsetHeight : (Number.isNaN(this.p.Height) ? 0 : this.p.Height));
      case 'SelectedItem': { const it = this.selList()[this.p.SelectedIndex]; return it === undefined ? null : (it instanceof El && (it.__type === 'ComboBoxItem' || it.__type === 'ListBoxItem') && this.p.ItemsSource === undefined ? it : it); }
      case 'SelectedValue': { const it = this.selList()[this.p.SelectedIndex]; return it === undefined ? null : (it instanceof El ? it.contentText() : it); }
      case 'Text': if (this.__type === 'ComboBox') { const it = this.selList()[this.p.SelectedIndex]; return it === undefined ? (this.p.Text || '') : (it instanceof El ? it.contentText() : app.it.str(it)); } break;
      case 'Parent': return this.parent;
      case 'Content': if (this.__type === 'Frame') return this.page || null; break;
      case 'NavigationService': return app.navService(this);
      case 'RenderTransform': return this.p.RenderTransform || null;
      case 'IsFocused': return HAS_DOM && this.dom && document.activeElement === (this.inputDom || this.dom);
      case 'IsMouseOver': return !!this.hover;
      case 'Resources': return app.resProxy(this);
      case 'ItemsSource': return this.p.ItemsSource || null;
      case 'DataContext': return this.dataContext();
    }
    if (n in PT || n in this.p) { const v = this.p[n]; if (v === undefined) return toCS(PT[n] === 'd' ? NaN : PT[n] === 'b' ? false : PT[n] === 'i' ? 0 : PT[n] === 's' ? '' : PT[n] === 'c' ? null : PT[n] === 'b?' ? false : null, PT[n]); return toCS(v, PT[n]); }
    if (this.h[n] !== undefined || EVT.split(' ').includes(n)) return this.h[n] || null;
    if (T[this.__type] && T[this.__type].props && T[this.__type].props.has(n)) return null;
    return undefined;
  }
  __ref(n, nd) {
    if (EVT.split(' ').includes(n) || n === 'Tick') return new Ref(() => this.h[n] || null, v => { this.h[n] = v; });
    if (n === 'Content' && this.__type === 'Frame') return new Ref(() => this.page || null, v => this.app.navigate(this, v));
    if (n === 'ItemsSource') return new Ref(() => this.p.ItemsSource || null, v => { this.p.ItemsSource = v; this.app.refreshItems(this); });
    if (n === 'DataContext') return new Ref(() => this.dataContext(), v => { this.p.DataContext = v; this.app.refreshBindings(); });
    if (n === 'SelectedItem') return new Ref(() => this.__get(n), v => { const k = this.selList().findIndex(x => x === v || (x instanceof El && x.contentText() === v)); this.set('SelectedIndex', k); });
    if (n === 'IsDefault' || n === 'Cursor' || n === 'Tag' || n in PT || (T[this.__type] && T[this.__type].props && T[this.__type].props.has(n)) || T[this.__type] === undefined) {
      return new Ref(() => this.__get(n, nd), v => this.set(n, fromCS(v, PT[n], this.app, nd), true));
    }
    return null;
  }
  __call(n, a, nd) {
    const app = this.app;
    switch (n) {
      case 'Focus': if (HAS_DOM && (this.inputDom || this.dom)) (this.inputDom || this.dom).focus(); app.focused = this; return true;
      case 'BeginAnimation': app.anim.begin(this, a[0], a[1]); return;
      case 'ToString': return this.toStr();
      case 'GetType': return new CS.TypeObj({ n: this.__type }, null);
      case 'Navigate': return app.navigate(this, a[0]);
      case 'GoBack': return app.goBack(this);
      case 'FindName': return app.find(a[0]) || null;
      case 'Clear': if (this.__type === 'TextBox') { this.set('Text', '', true); return; } break;
      case 'AppendText': this.set('Text', (this.p.Text || '') + a[0], true); return;
      case 'SelectAll': return;
      case 'FindResource': case 'TryFindResource': return app.findResource(this, a[0], n === 'FindResource', nd);
      case 'RaiseEvent': return;
      case 'Equals': return this === a[0];
      case 'GetHashCode': return CS.I(this.id);
      case 'UpdateLayout': return;
    }
    app.it.err('CS1061', `'${this.__type}' does not contain a definition for '${n}' and no accessible extension method '${n}' accepting a first argument of type '${this.__type}' could be found (are you missing a using directive or an assembly reference?)`, nd);
  }
  toStr() { const c = this.contentText(); const ns = ['Window', 'Page'].includes(this.__type) ? 'System.Windows.' : 'System.Windows.Controls.'; if (this.__type === 'TextBox' || this.__type === 'TextBlock') return ns + this.__type + ': ' + (this.p.Text || ''); if (c && this.__type !== 'Window') return ns + this.__type + ': ' + c; return ns + this.__type; }
  contentText() { const c = this.p.Content !== undefined ? this.p.Content : this.p.Header; if (c instanceof El) return c.contentText(); if (c === undefined || c === null) return this.__type === 'TextBlock' ? this.p.Text : ''; return typeof c === 'string' ? c : this.app.it.str(c); }
  selList() { if (this.p.ItemsSource) return this.app.srcItems(this.p.ItemsSource); return this.items; }
  dataContext() { let e = this; while (e) { if (e.p.DataContext !== undefined) return e.p.DataContext; e = e.parent; } return this.app.winObj && this.app.winObj.__dc !== undefined ? this.app.winObj.__dc : null; }
  set(n, v, fromCode) {
    const old = this.p[n];
    if (n === 'Value' && (this.__type === 'Slider' || this.__type === 'ProgressBar')) { const mn = this.p.Minimum, mx = this.p.Maximum; v = Math.min(mx, Math.max(mn, v)); }
    if (n === 'SelectedIndex') { v = Math.trunc(v); }
    this.p[n] = v;
    if (n === 'IsChecked' && this.__type === 'RadioButton' && v === true) this.app.radioGroup(this);
    this.app.applyProp(this, n);
    if (old !== v) {
      if (n === 'Text' && this.__type === 'TextBox') this.app.fire(this, 'TextChanged', this.app.args('TextChangedEventArgs', this));
      if (n === 'Value' && this.__type === 'Slider') this.app.fire(this, 'ValueChanged', this.app.args('RoutedPropertyChangedEventArgs', this, { OldValue: mk('double', old), NewValue: mk('double', v) }));
      if (n === 'IsChecked') this.app.fire(this, v ? 'Checked' : 'Unchecked', this.app.args('RoutedEventArgs', this));
      if (n === 'SelectedIndex') this.app.fire(this, 'SelectionChanged', this.app.args('SelectionChangedEventArgs', this));
      if (fromCode) this.app.dirty = true;
    }
  }
}
WPF.El = El;

/* host collection proxy (Children / Items) */
class HColl {
  constructor(app, el, key) { this.__host = true; this.__type = key === 'kids' ? 'UIElementCollection' : 'ItemCollection'; this.app = app; this.el = el; this.key = key; this.__coll = true; }
  get list() { return this.el[this.key]; }
  __get(n) { if (n === 'Count') return CS.I(this.list.length); }
  __ref() { return null; }
  __index(ix) { const k = num(ix[0]); return new Ref(() => { if (k < 0 || k >= this.list.length) this.app.it.throwEx('ArgumentOutOfRangeException', "Index was out of range. Must be non-negative and less than the size of the collection. (Parameter 'index')"); return this.list[k]; }, () => { }); }
  *__iter() { for (const x of this.list.slice()) yield x; }
  __call(n, a, nd) {
    const L = this.list, app = this.app;
    switch (n) {
      case 'Add': { const v = a[0]; if (v instanceof El) { if (v.parent) app.it.throwEx('ArgumentException', "Specified element is already the logical child of another element. Disconnect it first.", nd); v.parent = this.el; } L.push(v); app.childrenChanged(this.el, this.key); return this.key === 'items' ? CS.I(L.length - 1) : CS.I(L.length - 1); }
      case 'Insert': { const v = a[1]; if (v instanceof El) v.parent = this.el; L.splice(num(a[0]), 0, v); app.childrenChanged(this.el, this.key); return; }
      case 'Remove': { const k = L.indexOf(a[0]); if (k >= 0) { L.splice(k, 1); if (a[0] instanceof El) { a[0].parent = null; app.detach(a[0]); } app.childrenChanged(this.el, this.key); } return; }
      case 'RemoveAt': { const [x] = L.splice(num(a[0]), 1); if (x instanceof El) { x.parent = null; app.detach(x); } app.childrenChanged(this.el, this.key); return; }
      case 'Clear': L.forEach(x => { if (x instanceof El) { x.parent = null; app.detach(x); } }); L.length = 0; app.childrenChanged(this.el, this.key); return;
      case 'Contains': return L.includes(a[0]);
      case 'IndexOf': return CS.I(L.indexOf(a[0]));
    }
    return app.it.linq(new CS.Coll('List', [{ n: 'object' }]), n, a, nd);
  }
}

/* ---------- the app ---------- */
WPF.App = class App {
  constructor(opts) {
    this.files = opts.files || {}; this.mount = HAS_DOM ? opts.mount || null : null; this.opts = opts;
    this.log = opts.onLog || (() => { }); this.onError = opts.onError || (() => { });
    this.names = {}; this.bindings = []; this.timers = []; this.anims = []; this.windows = []; this.answers = null; this.suspended = null; this.running = false;
    this.resources = {}; this.dirty = false; this.scale = 1;
    this.anim = new Animator(this);
  }
  convErr(v, to, nd) { try { this.it.err('CS0029', `Cannot implicitly convert type '${this.it.typeOf(v)}' to '${to}'`, nd); } catch (e) { return e; } }
  /* ===== start ===== */
  start() {
    const xamls = {}, cs = [];
    for (const f in this.files) { if (/\.xaml$/i.test(f) && !/App\.xaml$/i.test(f)) xamls[f] = this.files[f]; else if (/\.cs$/i.test(f)) cs.push(this.files[f]); }
    this.xaml = {}; this.xamlByFile = {};
    for (const f in xamls) {
      let root;
      try { root = parseXml(xamls[f]); } catch (e) { e.file = f; throw e; }
      const cls = (root.attrs.find(a => a.name === 'x:Class') || {}).value;
      const cn = cls ? cls.split('.').pop() : f.replace(/\.xaml$/i, '');
      this.validate(root, f);
      this.xaml[cn] = { root, file: f }; this.xamlByFile[f.replace(/^.*\//, '')] = cn;
    }
    const code = cs.join('\n');
    const U = CS.parse(code || '');
    const app = this;
    const host = this.host();
    this.it = new CS.Interp(U, { host, maxSteps: 2000000, maxDepth: 300, onWrite: s => this.log(s) });
    const it = this.it;
    for (const k in WPF._enums) it.enums.set(k, WPF._enums[k]);
    it.hostMember = (o, n) => app.winMember(o, n);
    it.hostCall = (o, n, a, nd) => app.winCall(o, n, a, nd);
    it.hostRef = (o, n, nd) => app.winRef(o, n, nd);
    CS.check(it);
    // main window
    const mainName = Object.keys(this.xaml).find(k => this.xaml[k].root.tag === 'Window' && /MainWindow/.test(this.xaml[k].file)) || Object.keys(this.xaml).find(k => this.xaml[k].root.tag === 'Window') || Object.keys(this.xaml)[0];
    if (!mainName) throw new XamlError('XLS', 'Brak pliku MainWindow.xaml', 1, 1);
    this.running = true;
    this.mainName = mainName;
    this.winObj = this.instantiate(mainName);
    this.mainWin = this.winObj;
    if (this.mount) this.renderWindow(this.winObj, true);
    this.refreshBindings();
    this.loaded(this.winObj);
    return this;
  }
  instantiate(cn) {
    const it = this.it; const C = it.classes.get(cn);
    if (!C) { const o = { __plain: true, cls: { name: cn }, f: {} }; this.buildFor(o, cn); return o; }
    const o = new Obj(C); it.initFieldDefaults(o, C); it.construct(C, o, [], { line: 1, col: 1 });
    if (!o.__ui) this.it.err('CS0103', `${cn}: InitializeComponent() is not called in the constructor – the window would be empty`, { line: (C.decl || {}).line || 1, col: 1 });
    return o;
  }
  loaded(o) { const ui = o.__ui; if (!ui) return; this.fire(ui.root, 'Loaded', this.args('RoutedEventArgs', ui.root)); this.walk(ui.root, e => { if (e !== ui.root && e.h.Loaded) this.fire(e, 'Loaded', this.args('RoutedEventArgs', e)); else if (e !== ui.root && e.triggers) this.triggerEvent(e, 'Loaded'); }); }
  walk(e, f) { if (!(e instanceof El)) return; f(e); e.kids.forEach(k => this.walk(k, f)); e.items.forEach(k => this.walk(k, f)); ['Content', 'Child', 'Header'].forEach(p => { if (e.p[p] instanceof El) this.walk(e.p[p], f); }); if (e.page) this.walk(e.page, f); }
  find(name, root) { if (root) { let r = null; this.walk(root, e => { if (!r && e.p.Name === name) r = e; }); return r; } return this.names[name] || null; }
  /* ===== host object for the interpreter ===== */
  host() {
    const app = this;
    const nat = {};
    const mkBase = (name) => ({ name, native: true, hostBase: true, ns: 'System.Windows', base: null, kind: 'class', fields: new Map(), props: new Map(), methods: new Map(), ctors: [], ops: new Map(), ifaces: [], sv: {}, sinit: true, nctor() { } });
    ['Window', 'Page', 'UserControl'].forEach(n => { nat[n] = mkBase(n); });
    const ifaceC = n => ({ name: n, native: true, isIface: true, base: null, kind: 'interface', fields: new Map(), props: new Map(), methods: new Map(), ctors: [], ops: new Map(), ifaces: [], sv: {}, sinit: true });
    nat.IValueConverter = ifaceC('IValueConverter'); nat.INotifyPropertyChanged = ifaceC('INotifyPropertyChanged');
    return {
      lenient: false,
      nativeClass: n => nat[n] || null,
      knownType: n => HOST_TYPES.has(n) || !!T[n],
      conv: (v, t) => { if (v === null) return null; if (v && v.__host) return v; if (v instanceof Obj && (t.n === 'object' || HOST_TYPES.has(t.n))) return v; if (t.n === 'ObservableCollection' && v instanceof Coll) return v; return undefined; },
      global: n => {
        if (n === 'InitializeComponent') return undefined;
        return undefined;
      },
      staticMember: (tn, n, nd) => app.staticMember(tn, n, nd),
      staticRef: (tn, n, nd) => null,
      callStatic: (tn, n, args, nd, it) => app.callStatic(tn, n, args, nd),
      newObj: (t, a, nd) => app.newObj(t, a, nd),
    };
  }
  staticMember(tn, n, nd) {
    if (tn === 'Brushes') return parseColor(n) ? namedBrush(n) : undefined;
    if (tn === 'Colors') return new ColorV(parseColor(n) || n.toLowerCase());
    if (tn === 'FontWeights') return { __host: true, __type: 'FontWeight', w: n, __get() { }, __call() { return n; }, toStr: () => n };
    if (tn === 'Canvas' || tn === 'Grid' || tn === 'FrameworkElement' || tn === 'UIElement' || tn === 'Rectangle' || tn === 'Button' || tn === 'Control' || tn === 'TextBlock' || tn === 'RotateTransform' || tn === 'ScaleTransform' || tn === 'TranslateTransform' || tn === 'Shape' || tn === 'Panel' || tn === 'Ellipse' || tn === 'Window')
      if (/Property$/.test(n)) return { __host: true, __type: 'DependencyProperty', owner: tn, prop: n.replace(/Property$/, ''), __get() { }, __call() { }, toStr() { return this.prop; } };
    if (tn === 'RepeatBehavior' && n === 'Forever') return { __host: true, __type: 'RepeatBehavior', forever: true, __get() { } };
    if (tn === 'Keyboard' && n === 'Modifiers') return CS.I(0);
    if (tn === 'Application' && n === 'Current') return { __host: true, __type: 'Application', __get: (m) => m === 'MainWindow' ? app.mainWin : undefined, __call: (m) => { if (m === 'Shutdown') app.close(app.mainWin); } };
    if (tn === 'Duration' && n === 'Forever') return { __host: true, __type: 'Duration', ms: Infinity, __get() { } };
    return undefined;
  }
  callStatic(tn, n, args, nd) {
    const it = this.it; const a = it.deref(args);
    const NOPE = CS.Interp.NOPE;
    if (tn === 'MessageBox' && n === 'Show') return this.messageBox(a, nd);
    if (tn === 'Canvas' || tn === 'Grid' || tn === 'DockPanel' || tn === 'Panel') {
      const m = /^(Set|Get)(\w+)$/.exec(n);
      if (m) {
        const el = a[0]; if (!(el instanceof El)) it.throwEx('ArgumentNullException', "Value cannot be null. (Parameter 'element')", nd);
        const key = tn + '.' + m[2];
        if (m[1] === 'Get') { const v = el.att[key]; return tn === 'Canvas' && m[2] !== 'ZIndex' ? mk('double', v === undefined ? NaN : v) : (tn === 'DockPanel' ? new EnumVal(WPF._enums.Dock, ['Left', 'Top', 'Right', 'Bottom'].indexOf(v || 'Left')) : CS.I(v || 0)); }
        el.att[key] = a[1] instanceof EnumVal ? it.str(a[1]) : num(a[1]); this.applyAttached(el); this.dirty = true; return;
      }
    }
    if (tn === 'Color' && (n === 'FromRgb' || n === 'FromArgb')) { const v = a.map(x => num(x)); return new ColorV(n === 'FromRgb' ? `rgb(${v[0]},${v[1]},${v[2]})` : `rgba(${v[1]},${v[2]},${v[3]},${(v[0] / 255).toFixed(3)})`); }
    if (tn === 'Keyboard' && n === 'IsKeyDown') return !!this.keysDown && this.keysDown.has(it.str(a[0]));
    if (tn === 'Mouse' && n === 'GetPosition') return this.point(this.lastMouse ? this.lastMouse.x : 0, this.lastMouse ? this.lastMouse.y : 0);
    if (tn === 'ColorConverter' && n === 'ConvertFromString') return new ColorV(parseColor(a[0]));
    return NOPE;
  }
  newObj(t, a, nd) {
    const it = this.it; const n = t.n;
    if (T[n] && !T[n].nv && n !== 'Window' && n !== 'Page') { const e = new El(this, n, null); return e; }
    switch (n) {
      case 'SolidColorBrush': return new Brush('SolidColorBrush', { color: a[0] instanceof ColorV ? a[0].css : 'black' });
      case 'LinearGradientBrush': return new Brush('LinearGradientBrush', { start: [0, 0], end: [1, 1], stops: [{ c: a[0] ? a[0].css : 'white', o: 0 }, { c: a[1] ? a[1].css : 'black', o: 1 }] });
      case 'Thickness': { const v = a.map(x => num(x)); const [l, tt, r, b] = v.length === 1 ? [v[0], v[0], v[0], v[0]] : v; return { __host: true, __type: 'Thickness', l, t: tt, r, b, __get(p) { const m = { Left: l, Top: tt, Right: r, Bottom: b }; if (p in m) return mk('double', m[p]); } }; }
      case 'Point': return this.point(num(a[0] || CS.I(0)), num(a[1] || CS.I(0)));
      case 'DispatcherTimer': return this.timer();
      case 'DoubleAnimation': case 'ColorAnimation': return this.anim.make(n, a);
      case 'Duration': return { __host: true, __type: 'Duration', ms: a[0] && a[0].ms !== undefined ? a[0].ms : 1000, __get() { } };
      case 'RepeatBehavior': return { __host: true, __type: 'RepeatBehavior', count: num(a[0]), __get() { } };
      case 'RotateTransform': case 'ScaleTransform': case 'TranslateTransform': { const e = new El(this, n, null); if (n === 'RotateTransform') { e.p.Angle = a[0] ? num(a[0]) : 0; } if (n === 'ScaleTransform') { e.p.ScaleX = a[0] ? num(a[0]) : 1; e.p.ScaleY = a[1] ? num(a[1]) : 1; } if (n === 'TranslateTransform') { e.p.X = a[0] ? num(a[0]) : 0; e.p.Y = a[1] ? num(a[1]) : 0; } return e; }
      case 'ObservableCollection': { const c = new Coll('List', t.a || [{ n: 'object' }]); if (a[0]) c.a = it.list(a[0], nd); c.observable = true; return c; }
      case 'Uri': return { __host: true, __type: 'Uri', s: a[0], __get() { }, toStr() { return a[0]; } };
      case 'PropertyChangedEventArgs': return { __host: true, __type: 'PropertyChangedEventArgs', PropertyName: a[0], __get(p) { if (p === 'PropertyName') return a[0]; } };
      case 'RoutedEventArgs': return this.args('RoutedEventArgs', null);
    }
    if (n === 'Window' || n === 'Page') return undefined;
    return undefined;
  }
  point(x, y) { return { __host: true, __type: 'Point', x, y, __get(p) { if (p === 'X') return mk('double', this.x); if (p === 'Y') return mk('double', this.y); }, __ref(p) { const self = this; if (p === 'X' || p === 'Y') return new Ref(() => mk('double', self[p.toLowerCase()]), v => { self[p.toLowerCase()] = num(v); }); }, __call(m) { if (m === 'ToString') return this.toStr(); }, toStr() { return CS.fmtDouble(this.x) + ',' + CS.fmtDouble(this.y); } }; }
  timer() {
    const app = this;
    const t = { __host: true, __type: 'DispatcherTimer', ms: 1000, on: false, h: null, id: null,
      __get(n) { if (n === 'Interval') return new CS.BObj('TimeSpan', { ms: this.ms }); if (n === 'IsEnabled') return this.on; if (n === 'Tick') return this.h; },
      __ref(n) { const self = this; if (n === 'Interval') return new Ref(() => new CS.BObj('TimeSpan', { ms: self.ms }), v => { self.ms = Math.max(10, v.ms); if (self.on) { self.stop(); self.start(); } }); if (n === 'Tick') return new Ref(() => self.h, v => { self.h = v; }); if (n === 'IsEnabled') return new Ref(() => self.on, v => { v ? self.start() : self.stop(); }); },
      __call(n) { if (n === 'Start') return this.start(); if (n === 'Stop') return this.stop(); },
      start() { if (this.on) return; this.on = true; app.timers.push(this); if (HAS_DOM && app.mount) this.id = setInterval(() => app.dispatch(this.h, [this, app.args('EventArgs', null)]), this.ms); },
      stop() { this.on = false; if (this.id) clearInterval(this.id); this.id = null; app.timers = app.timers.filter(x => x !== this); },
      tick() { app.dispatch(this.h, [this, app.args('EventArgs', null)]); }
    };
    return t;
  }
  args(type, src, extra) {
    const app = this;
    const a = { __host: true, __type: type, Source: src, OriginalSource: src, Handled: false, __get(n) { if (n === 'Handled') return this.Handled; if (n === 'Source' || n === 'OriginalSource') return this.Source; if (n === 'Key' && this.key !== undefined) return new EnumVal(WPF._enums.Key, WPF._enums.Key.byName.get(this.key) || 0); if (n === 'ChangedButton') return new EnumVal(WPF._enums.MouseButton, this.button || 0); if (n === 'ClickCount') return CS.I(this.clicks || 1); if (n === 'Delta') return CS.I(this.delta || 0); if (n === 'LeftButton') return new EnumVal(WPF._enums.MouseButtonState, this.left ? 1 : 0); if (n === 'AddedItems') return new CS.Coll('List', [{ n: 'object' }]); if (n === 'Cancel') return !!this.cancel; if (extra && n in extra) return extra[n]; if (n === 'RoutedEvent') return null; },
      __ref(n) { const self = this; if (n === 'Handled') return new Ref(() => self.Handled, v => { self.Handled = v; }); if (n === 'Cancel') return new Ref(() => !!self.cancel, v => { self.cancel = v; }); },
      __call(n, a2) { if (n === 'GetPosition') { const rel = a2[0]; return app.relPos(this, rel); } if (n === 'ToString') return 'System.Windows.' + type; } };
    if (extra) Object.assign(a, extra);
    return a;
  }
  relPos(ev, rel) {
    let x = ev.x || 0, y = ev.y || 0;
    if (HAS_DOM && rel instanceof El && rel.dom && ev.cx !== undefined) { const r = rel.dom.getBoundingClientRect(); x = (ev.cx - r.left) / this.scale; y = (ev.cy - r.top) / this.scale; }
    else if (rel instanceof El && ev.target instanceof El && rel !== ev.target) { /* headless: assume coordinates relative to rel */ }
    return this.point(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
  }
  coll(el, key) { return new HColl(this, el, key); }
  resProxy(el) { const app = this; return { __host: true, __type: 'ResourceDictionary', __get() { }, __index(ix) { const k = ix[0]; return new Ref(() => app.findResource(el, k, true), v => { (el.res || (el.res = {}))[k] = v; }); }, __call(n, a) { if (n === 'Add') { (el.res || (el.res = {}))[a[0]] = a[1]; } if (n === 'Contains') return !!(el.res && el.res[a[0]]); } }; }
  findResource(el, key, must, nd) { let e = el; while (e) { if (e.res && key in e.res) return e.res[key]; e = e.parent; } if (key in this.resources) return this.resources[key]; if (must) this.it.throwEx('ResourceReferenceKeyNotFoundException', `'${key}' resource not found.`, nd); return null; }
  navService(el) { const app = this; let fr = el; while (fr && fr.__type !== 'Frame') fr = fr.parent; return { __host: true, __type: 'NavigationService', __get(n) { if (n === 'CanGoBack') return !!(fr && fr.hist && fr.hist.length); if (n === 'CanGoForward') return false; }, __call(n, a) { if (!fr) return; if (n === 'Navigate') return app.navigate(fr, a[0]); if (n === 'GoBack') return app.goBack(fr); } }; }
  srcItems(src) { if (src instanceof Coll || src instanceof Arr) return this.it.list(src); if (src && src.__coll) return src.list; return []; }

  /* ===== windows / code-behind ===== */
  winMember(o, n) {
    if (o.__ui && o.__ui.names[n]) return o.__ui.names[n];
    const root = o.__ui && o.__ui.root;
    if (n === 'DataContext') return root ? root.dataContext() : (o.__dc || null);
    if (n === 'NavigationService') return root ? this.navService(root) : null;
    if (n === 'DialogResult') return o.__dr === undefined ? null : o.__dr;
    if (n === 'Owner') return o.__owner || null;
    if (n === 'Resources') return root ? this.resProxy(root) : null;
    if (n === 'IsLoaded') return !!o.__ui;
    if (root) { const v = root.__get(n); if (v !== undefined) return v; }
    return undefined;
  }
  winRef(o, n, nd) {
    if (n === 'DataContext') return new Ref(() => this.winMember(o, n), v => { if (o.__ui) o.__ui.root.p.DataContext = v; else o.__dc = v; this.refreshBindings(); });
    if (n === 'DialogResult') return new Ref(() => this.winMember(o, n), v => { o.__dr = v; if (o.__dialog) this.closeDialog(o); });
    if (n === 'Owner') return new Ref(() => o.__owner || null, v => { o.__owner = v; });
    if (o.__ui && o.__ui.names[n]) return null;
    if (o.__ui) { const r = o.__ui.root.__ref(n, nd); if (r) return r; }
    return null;
  }
  winCall(o, n, a, nd) {
    const it = this.it;
    switch (n) {
      case 'InitializeComponent': this.buildFor(o, o.cls.name, nd); return;
      case 'Close': this.close(o); return;
      case 'Show': this.showWindow(o, false); return;
      case 'ShowDialog': return this.showDialog(o, nd);
      case 'Hide': if (o.__dom) o.__dom.style.display = 'none'; return;
      case 'Activate': return true;
      case 'FindName': return (o.__ui && o.__ui.names[a[0]]) || null;
      case 'FindResource': case 'TryFindResource': return this.findResource(o.__ui.root, a[0], n === 'FindResource', nd);
      case 'OnPropertyChanged': this.refreshBindings(); return CS.Interp.NOPE;
    }
    if (o.__ui) { const root = o.__ui.root; if (['Focus', 'BeginAnimation', 'Navigate'].includes(n)) return root.__call(n, a, nd); }
    return CS.Interp.NOPE;
  }
  buildFor(o, cn, nd) {
    const X = this.xaml[cn];
    if (!X) { if (this.it) this.it.err('CS0103', `The name 'InitializeComponent' does not exist in the current context`, nd || { line: 1, col: 1 }); return; }
    const ui = { names: {}, root: null, obj: o };
    o.__ui = ui;
    this.curUi = ui;
    ui.root = this.build(X.root, null, ui, X.file);
    // resolve StaticResource / Binding after build
    this.postBuild(ui);
    for (const k in ui.names) if (!this.names[k] || o === this.winObj || !this.winObj) this.names[k] = ui.names[k];
  }
  validate(node, file) {
    if (node.tag === '#text') return;
    const tag = node.tag.includes(':') ? node.tag : node.tag;
    if (node.tag.includes('.')) { node.children.forEach(c => this.validate(c, file)); return; }
    if (node.tag.includes(':')) { node.children.forEach(c => this.validate(c, file)); return; }
    const D = T[tag];
    if (!D) throw Object.assign(new XamlError('MC3074', `The tag '${tag}' does not exist in XML namespace 'http://schemas.microsoft.com/winfx/2006/xaml/presentation'. Line ${node.line} Position ${node.col}.`, node.line, node.col), { file });
    if (D.props) for (const a of node.attrs) {
      const an = a.name;
      if (/^(xmlns|x:|d:|mc:|xml:)/.test(an)) continue;
      if (an.includes('.')) { const [owner, prop] = an.split('.'); if ((ATTACHED[owner] && ATTACHED[owner].includes(prop)) || owner === tag) continue; throw Object.assign(new XamlError('MC3072', `The property '${an}' does not exist in XML namespace 'http://schemas.microsoft.com/winfx/2006/xaml/presentation'. Line ${a.line} Position ${a.col}.`, a.line, a.col), { file }); }
      if (!D.props.has(an)) throw Object.assign(new XamlError('MC3072', `The property '${an}' does not exist in XML namespace 'http://schemas.microsoft.com/winfx/2006/xaml/presentation'. Line ${a.line} Position ${a.col}.`, a.line, a.col), { file });
    }
    node.children.forEach(c => this.validate(c, file));
  }
  /* build an El tree from XAML nodes */
  build(node, parent, ui, file) {
    if (node.tag === '#text') return node.text.trim();
    let tag = node.tag;
    if (tag.includes(':') && !tag.includes('.')) { // local:Klasa – instance of a C# class (converter etc.)
      return { __local: tag.split(':')[1], node };
    }
    const e = new El(this, tag, node);
    e.parent = parent; e.file = file;
    const D = T[tag] || {};
    for (const a of node.attrs) {
      const an = a.name, v = a.value;
      if (an === 'x:Name' || an === 'Name') { e.p.Name = v; if (ui.names[v]) throw Object.assign(new XamlError('MC3093', `The name '${v}' is already used. Line ${a.line} Position ${a.col}.`, a.line, a.col), { file }); ui.names[v] = e; continue; }
      if (an === 'x:Key') { e.key = v; continue; }
      if (/^(xmlns|x:|d:|mc:|xml:)/.test(an)) continue;
      if (an.includes('.')) { const [owner, prop] = an.split('.'); if (owner === 'Storyboard') { e.sb = e.sb || {}; e.sb[prop] = v; continue; } e.att[an] = /^(Row|Column|RowSpan|ColumnSpan|ZIndex)$/.test(prop) ? +v : /^(Left|Top|Right|Bottom)$/.test(prop) ? dbl(v) : v; continue; }
      if (tag === 'Setter' || tag === 'Style' || tag === 'Trigger' || tag === 'EventTrigger' || tag === 'DataTrigger') { e.p[an] = v; continue; }
      if (EVT.split(' ').includes(an) || an === 'PasswordChanged') { e.hx = e.hx || {}; e.hx[an] = { name: v, line: a.line, col: a.col }; continue; }
      this.setFromString(e, an, v, a, ui);
    }
    // children
    const kids = node.children;
    for (const c of kids) {
      if (c.tag === '#text') {
        const t = c.text.replace(/\s+/g, ' ');
        if (tag === 'TextBlock' || tag === 'Run' || tag === 'Bold' || tag === 'Italic' || tag === 'Underline' || tag === 'Span' || tag === 'Hyperlink') { const r = new El(this, 'Run', null); r.p.Text = t; r.parent = e; e.kids.push(r); }
        else if (tag === 'TextBox') e.p.Text = c.text;
        else if (D.content === 'one' || D.content === 'items') { if (D.content === 'items') e.items.push(t.trim()); else e.p.Content = t.trim(); }
        else if (tag === 'Setter' || tag === 'GradientStop') { }
        else throw Object.assign(new XamlError('MC3088', `Property elements cannot be in the middle of an element's content. They must be before or after the content. Line ${c.line} Position ${c.col}.`, c.line, c.col), { file });
        continue;
      }
      if (c.tag.startsWith(tag + '.') || (c.tag.includes('.') && !c.tag.includes(':'))) { this.propElement(e, c, ui, file); continue; }
      const ch = this.build(c, e, ui, file);
      if (ch && ch.__local) { e.locals = e.locals || []; e.locals.push(ch); continue; }
      if (D.panel || tag === 'Viewport3D' || D.content === 'inline') e.kids.push(ch);
      else if (D.content === 'items') e.items.push(ch);
      else if (D.content === 'one') { if (e.p.Content !== undefined && tag !== 'Border') throw Object.assign(new XamlError('MC3089', `The object '${tag}' already has a child and cannot add '${c.tag}'. '${tag}' can accept only one child. Line ${c.line} Position ${c.col}.`, c.line, c.col), { file }); if (tag === 'Border' || tag === 'Viewbox') e.p.Child = ch; else e.p.Content = ch; }
      else if (D.nv) { (e.kids).push(ch); }
      else throw Object.assign(new XamlError('MC3089', `The object '${tag}' cannot have children ('${c.tag}'). Line ${c.line} Position ${c.col}.`, c.line, c.col), { file });
    }
    if (tag === 'ComboBox' || tag === 'ListBox' || tag === 'TabControl') { const k = e.items.findIndex(x => x instanceof El && x.p.IsSelected); if (k >= 0) e.p.SelectedIndex = k; else if (tag === 'TabControl' && e.items.length) e.p.SelectedIndex = 0; }
    return e;
  }
  setFromString(e, an, v, a, ui) {
    const m = /^\{(\w+)\s*([^}]*(\{[^}]*\}[^}]*)*)\}$/.exec(v.trim());
    if (m && !v.startsWith('{}')) {
      const kind = m[1], rest = m[2];
      if (kind === 'StaticResource' || kind === 'DynamicResource') { e.res_ = e.res_ || []; e.res_.push({ prop: an, key: rest.trim(), line: a.line, col: a.col }); return; }
      if (kind === 'Binding') { const b = { el: e, prop: an, path: '', line: a.line, col: a.col }; this.parseBinding(b, rest); this.bindings.push(b); return; }
      if (kind === 'x:Null') { e.p[an] = null; return; }
    }
    if (v.startsWith('{}')) v = v.slice(2);
    const t = PT[an] || 'any';
    let val = v;
    if (t === 'd') { val = dbl(v); if (Number.isNaN(val) && v !== 'Auto' && v !== 'NaN') throw new XamlError('XAML', `'${v}' is not a valid value for property '${an}'. Line ${a.line} Position ${a.col}.`, a.line, a.col); }
    else if (t === 'i') val = parseInt(v, 10);
    else if (t === 'b' || t === 'b?') { if (!/^(true|false)$/i.test(v)) throw new XamlError('XAML', `'${v}' is not a valid value for property '${an}'. Line ${a.line} Position ${a.col}.`, a.line, a.col); val = /^true$/i.test(v); }
    else if (t === 'brush') { val = brushFrom(v); if (!val) throw new XamlError('XAML', `Token is not valid. '${v}' is not a valid value for property '${an}'. Line ${a.line} Position ${a.col}.`, a.line, a.col); }
    else if (t === 'thick') val = thick(v);
    else if (t === 'color') val = parseColor(v);
    else if (t.startsWith('e:')) { const E = WPF._enums[t.slice(2)]; if (E && !E.byName.has(v)) throw new XamlError('XAML', `'${v}' is not a valid value for property '${an}'. Line ${a.line} Position ${a.col}.`, a.line, a.col); }
    if (an === 'RowDefinitions' || an === 'ColumnDefinitions') { e[an === 'RowDefinitions' ? 'rows' : 'cols'] = v.split(',').map(s => s.trim()); return; }
    e.p[an] = val;
  }
  parseBinding(b, rest) {
    const parts = []; let depth = 0, cur = '';
    for (const ch of rest) { if (ch === '{') depth++; if (ch === '}') depth--; if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; continue; } cur += ch; }
    if (cur.trim()) parts.push(cur);
    parts.forEach((p, k) => {
      p = p.trim(); const eq = p.indexOf('=');
      if (eq < 0) { if (k === 0) b.path = p; return; }
      const key = p.slice(0, eq).trim(); let val = p.slice(eq + 1).trim();
      if (key === 'Path') b.path = val; else if (key === 'ElementName') b.elementName = val; else if (key === 'StringFormat') b.format = val.replace(/^'|'$/g, '').replace(/^\{\}/, ''); else if (key === 'Mode') b.mode = val; else if (key === 'UpdateSourceTrigger') b.ust = val;
      else if (key === 'Converter') { const mm = /StaticResource\s+(\w+)/.exec(val); b.converter = mm ? mm[1] : val; } else if (key === 'ConverterParameter') b.param = val; else if (key === 'FallbackValue') b.fallback = val;
    });
  }
  propElement(e, c, ui, file) {
    const prop = c.tag.split('.')[1];
    const items = c.children.filter(x => x.tag !== '#text');
    if (prop === 'Resources') { e.res = e.res || {}; for (const r of items) { const key = (r.attrs.find(a => a.name === 'x:Key') || {}).value; const v = this.buildRes(r, e, ui, file); if (r.tag === 'Style' && !key) { const tt = (r.attrs.find(a => a.name === 'TargetType') || {}).value; e.res['__style:' + (tt || '').replace(/\{x:Type\s+(\w+)\}/, '$1')] = v; } else e.res[key] = v; } return; }
    if (prop === 'RowDefinitions' || prop === 'ColumnDefinitions') { e[prop === 'RowDefinitions' ? 'rows' : 'cols'] = items.map(d => { const at = d.attrs.find(a => a.name === (prop === 'RowDefinitions' ? 'Height' : 'Width')); return at ? at.value : '*'; }); return; }
    if (prop === 'Triggers') { e.triggers = (e.triggers || []).concat(items.map(t => this.build(t, e, ui, file))); return; }
    if (prop === 'Style' && items[0]) { e.p.Style = this.buildRes(items[0], e, ui, file); return; }
    const vals = items.map(x => this.build(x, e, ui, file));
    if (['Background', 'Foreground', 'Fill', 'Stroke', 'BorderBrush'].includes(prop)) { e.p[prop] = this.brushFromEl(vals[0]); return; }
    if (prop === 'Content' || prop === 'Child' || prop === 'Header') { e.p[prop] = vals[0]; return; }
    if (prop === 'Items' || prop === 'Inlines') { vals.forEach(v => (prop === 'Items' ? e.items : e.kids).push(v)); return; }
    if (prop === 'Children') { vals.forEach(v => e.kids.push(v)); return; }
    if (prop === 'ToolTip') { e.p.ToolTip = vals[0] instanceof El ? vals[0].contentText() : vals[0]; return; }
    e.p[prop] = vals.length === 1 ? vals[0] : vals; // Camera, RenderTransform, Geometry, Material, Transform, Content (3D) ...
  }
  brushFromEl(b) {
    if (!(b instanceof El)) return b;
    if (b.__type === 'SolidColorBrush') { const br = new Brush('SolidColorBrush', { color: b.p.Color || 'black' }); if (b.p.Name) this.names[b.p.Name] = br; br.el = b; return br; }
    if (b.__type === 'LinearGradientBrush' || b.__type === 'RadialGradientBrush') { const pt = s => (s || '0,0').split(',').map(Number); return new Brush(b.__type, { start: pt(b.p.StartPoint || '0,0'), end: pt(b.p.EndPoint || '1,1'), stops: b.kids.filter(k => k.__type === 'GradientStop').map(k => ({ c: k.p.Color || 'black', o: k.p.Offset === undefined ? 0 : k.p.Offset })) }); }
    return b;
  }
  buildRes(r, owner, ui, file) {
    if (r.tag.includes(':')) return { __local: r.tag.split(':')[1], node: r };
    const el = this.build(r, owner, ui, file);
    if (r.tag === 'Style') {
      const at = k => (r.attrs.find(a => a.name === k) || {}).value;
      const st = { target: (at('TargetType') || '').replace(/\{x:Type\s+(\w+)\}/, '$1'), basedOn: at('BasedOn'), setters: [], triggers: [] };
      for (const ch of r.children) {
        if (ch.tag === 'Setter') st.setters.push({ prop: ch.attrs.find(a => a.name === 'Property').value, value: (ch.attrs.find(a => a.name === 'Value') || {}).value, node: ch, valEl: ch.children.filter(x => x.tag !== '#text').map(x => x.children).flat().filter(x => x.tag !== '#text')[0] });
        if (ch.tag === 'Style.Triggers') for (const tg of ch.children) if (tg.tag === 'Trigger') st.triggers.push({ prop: tg.attrs.find(a => a.name === 'Property').value, value: tg.attrs.find(a => a.name === 'Value').value, setters: tg.children.filter(x => x.tag === 'Setter').map(s => ({ prop: s.attrs.find(a => a.name === 'Property').value, value: s.attrs.find(a => a.name === 'Value').value })) });
      }
      return { __style: true, ...st };
    }
    if (['SolidColorBrush', 'LinearGradientBrush', 'RadialGradientBrush'].includes(r.tag)) return this.brushFromEl(el);
    return el;
  }
  postBuild(ui) {
    const app = this;
    this.walk(ui.root, e => {
      // local resources (converters, C# objects)
      if (e.res) for (const k in e.res) { const v = e.res[k]; if (v && v.__local) e.res[k] = this.newLocal(v); }
      if (e.res_) for (const r of e.res_) { const v = this.findResource(e, r.key, false); if (v === null) throw new XamlError('XAML', `Cannot find resource named '${r.key}'. Resource names are case sensitive. Line ${r.line} Position ${r.col}.`, r.line, r.col); if (r.prop === 'Style') e.p.Style = v; else e.p[r.prop] = v instanceof El && ['SolidColorBrush', 'LinearGradientBrush'].includes(v.__type) ? this.brushFromEl(v) : v; }
      // implicit styles
      let s = null; let p = e; while (p && !s) { if (p.res && p.res['__style:' + e.__type]) s = p.res['__style:' + e.__type]; p = p.parent; }
      if (!s && this.resources['__style:' + e.__type]) s = this.resources['__style:' + e.__type];
      const styles = []; if (s && !e.p.Style) styles.push(s); if (e.p.Style && e.p.Style.__style) { let st = e.p.Style; const chain = []; while (st) { chain.unshift(st); st = st.basedOn ? this.findResource(e, st.basedOn.replace(/\{StaticResource\s+(\w+)\}/, '$1'), false) : null; } styles.push(...chain); }
      for (const st of styles) for (const set of st.setters) { if (e.node && e.node.attrs.some(a => a.name === set.prop)) continue; if (set.valEl) { e.p[set.prop] = this.brushFromEl(this.build(set.valEl, e, ui, e.file)); continue; } const fake = { line: set.node.line, col: set.node.col }; this.setFromString(e, set.prop, set.value, fake, ui); }
      e.styleTriggers = styles.flatMap(st => st.triggers);
      // event handlers from XAML
      if (e.hx) for (const ev in e.hx) {
        const hname = e.hx[ev].name; const obj = ui.obj;
        if (!(obj instanceof Obj) || !this.it.methodsByName(obj.cls, hname).length) throw new CS.CsError('CS1061', `'${obj.cls ? obj.cls.name : 'MainWindow'}' does not contain a definition for '${hname}' and no accessible extension method '${hname}' accepting a first argument of type '${obj.cls ? obj.cls.name : 'MainWindow'}' could be found (are you missing a using directive or an assembly reference?)`, e.hx[ev].line, e.hx[ev].col);
        e.h[ev] = new CS.MRef(obj, this.it.methodsByName(obj.cls, hname), hname);
      }
      // radio default grouping, frame source
      if (e.__type === 'Frame' && e.p.Source) { const cn = this.xamlByFile[e.p.Source] || e.p.Source.replace(/\.xaml$/i, ''); e._src = cn; }
      if (e.__type === 'Slider' || e.__type === 'ProgressBar') e.p.Value = Math.min(e.p.Maximum, Math.max(e.p.Minimum, e.p.Value));
    });
    // bindings with ElementName need names resolved
    for (const b of this.bindings) if (b.elementName && !b.src) b.src = ui.names[b.elementName] || this.names[b.elementName];
    // frames
    this.walk(ui.root, e => { if (e._src && !e.page) { const cn = e._src; e._src = null; this.navigate(e, cn, true); } });
  }
  newLocal(v) { const it = this.it; const C = it.classes.get(v.__local); if (!C) throw new XamlError('MC3050', `Cannot find the type 'local:${v.__local}'. Note that type names are case sensitive.`, v.node.line, v.node.col); const o = new Obj(C); it.initFieldDefaults(o, C); it.construct(C, o, [], v.node); return o; }

  /* ===== bindings ===== */
  bindingValue(b) {
    const it = this.it;
    let v;
    if (b.elementName) { const s = b.src || this.names[b.elementName]; if (!s) return undefined; b.src = s; v = b.path ? s.__get(b.path) : s; }
    else {
      let dc = b.el.dataContext(); if (dc === null || dc === undefined) return undefined;
      v = dc;
      for (const seg of (b.path || '').split('.').filter(Boolean)) { if (v === null || v === undefined) return undefined; try { v = v instanceof Obj ? it.getMember(v, seg, { line: b.line, col: b.col }, { cls: v.cls, self: v, sc: new CS.Scope(null) }) : (v.__get ? v.__get(seg) : undefined); } catch (e) { return undefined; } }
    }
    if (b.converter) { const conv = this.findResource(b.el, b.converter, false); if (conv instanceof Obj) { v = it.callMethod(conv, 'Convert', [v, new CS.TypeObj({ n: 'object' }, null), b.param === undefined ? null : b.param, { __host: true, __type: 'CultureInfo', __get() { } }], { line: b.line, col: b.col }, { cls: conv.cls, self: conv, sc: new CS.Scope(null) }); } }
    if (b.format) { try { v = it.composite(b.format.includes('{0') ? b.format : '{0:' + b.format + '}', [v], null); } catch (e) { } }
    return v;
  }
  refreshBindings() {
    for (const b of this.bindings) {
      if (!b.el || b.writing) continue;
      let v; try { v = this.bindingValue(b); } catch (e) { this.report(e); return; }
      if (v === undefined) continue;
      const t = PT[b.prop] || 'any';
      let jv;
      if (t === 'd') jv = v instanceof N ? num(v) : parseFloat(v);
      else if (t === 's' || t === 'c') jv = v instanceof El ? v : (typeof v === 'string' ? v : this.it.str(v));
      else if (t === 'b' || t === 'b?') jv = v === true || v === 'True';
      else if (t === 'brush') jv = v instanceof Brush ? v : brushFrom(this.it.str(v));
      else if (t === 'i') jv = num(v);
      else if (b.prop === 'ItemsSource') { b.el.p.ItemsSource = v; this.refreshItems(b.el); continue; }
      else jv = v instanceof N ? num(v) : v;
      if (jv === undefined || (typeof jv === 'number' && Number.isNaN(jv) && t !== 'd')) continue;
      if (b.el.p[b.prop] !== jv) { b.el.p[b.prop] = jv; this.applyProp(b.el, b.prop); }
    }
    this.walk(this.mainWin && this.mainWin.__ui ? this.mainWin.__ui.root : null, e => { if (e.p.ItemsSource) this.refreshItems(e); });
  }
  writeBack(el, prop) {
    for (const b of this.bindings) {
      if (b.el !== el || b.prop !== prop) continue;
      if (b.mode === 'OneWay' || b.mode === 'OneTime') continue;
      if (!(el.__type === 'TextBox' || el.__type === 'Slider' || el.__type === 'CheckBox' || b.mode === 'TwoWay')) continue;
      const val = el.p[prop];
      b.writing = true;
      try {
        if (b.elementName) { const s = b.src; if (!s || !b.path) continue; const t = PT[b.path]; if (t === 'd') { const x = parseFloat(val); if (!Number.isNaN(x)) s.set(b.path, x); } else s.set(b.path, val); }
        else { const dc = el.dataContext(); if (dc instanceof Obj && b.path && !b.path.includes('.')) { const r = this.it.memberRef(dc, b.path, { line: b.line, col: b.col }, { cls: dc.cls, self: dc, sc: new CS.Scope(null) }, null); const cur = r.get(); let v = val; if (cur instanceof N) { const x = Number(String(val).replace(',', '.')); if (Number.isNaN(x)) continue; v = mk(cur.t, x); } else if (typeof val === 'number') v = mk('double', val); r.set(v); } }
      } catch (e) { if (!(e instanceof CS.CsThrow)) this.report(e); } finally { b.writing = false; }
    }
    this.refreshBindings();
  }

  /* ===== events ===== */
  guard(f) {
    try { return f(); }
    catch (e) {
      if (e && e.__suspend) return;
      this.report(e);
    }
  }
  report(e) { this.running = false; this.timers.slice().forEach(t => t.stop()); this.anim.stopAll(); this.error = e; this.onError(e, this); }
  dispatch(fn, args, fromReplay) {
    if (!fn || !this.running) return;
    this.it.steps = 0;
    const call = { fn, args };
    if (!fromReplay) { this.answers = []; this.answerPos = 0; }
    this.curCall = call;
    try { this.it.callDelegate(fn, args, { line: 0, col: 0 }); }
    catch (e) {
      if (e && e.__suspend) { this.suspended = { fn, args }; return; }
      if (e instanceof CS.Timeout) { this.report(e); return; }
      this.report(e); return;
    }
    if (this.dirty || true) { this.dirty = false; this.refreshBindings(); this.repaintAll(); }
  }
  fire(el, ev, a) {
    if (!this.running || !el) return;
    const h = el.h[ev];
    if (h) this.dispatch(h, [el, a]);
    if (el.styleTriggers && el.styleTriggers.length && (ev === 'MouseEnter' || ev === 'MouseLeave')) this.applyStyleTriggers(el);
    this.triggerEvent(el, ev);
  }
  bubble(el, ev, a) { let e = el; while (e && !a.Handled) { if (e.h[ev]) this.dispatch(e.h[ev], [e, a]); e = e.parent; } const win = this.mainWin && this.mainWin.__ui && this.mainWin.__ui.root; if (win && !a.Handled && !this.isIn(el, win) && win.h[ev]) this.dispatch(win.h[ev], [win, a]); }
  isIn(el, root) { let e = el; while (e) { if (e === root) return true; e = e.parent; } return false; }
  triggerEvent(target, ev) {
    const ui = target.__ui ? target.__ui : null; const root = ui ? ui.root : target;
    const check = (e) => (e.triggers || []).forEach(tg => {
      if (tg.__type !== 'EventTrigger') return;
      const re = String(tg.p.RoutedEvent || '').split('.').pop();
      if (re !== ev) return;
      if (!(e === root || (ui ? e === ui.root : e === target))) return;
      tg.kids.forEach(bs => bs.kids.forEach(sb => this.anim.storyboard(sb, e)));
    });
    if (ui) { check(ui.root); } else check(target);
  }
  messageBox(a, nd) {
    const it = this.it;
    const text = it.str(a[0]), cap = a[1] !== undefined && typeof a[1] === 'string' ? a[1] : '';
    const btn = a.find(x => x instanceof EnumVal && x.e.name === 'MessageBoxButton'); const icon = a.find(x => x instanceof EnumVal && x.e.name === 'MessageBoxImage');
    const kind = btn ? btn.e.members.find(m => m.v === btn.v).name : 'OK';
    const R = WPF._enums.MessageBoxResult; const res = n => new EnumVal(R, R.byName.get(n));
    this.log(`[MessageBox] ${cap ? cap + ': ' : ''}${text}\n`);
    if (kind === 'OK') { this.showBox(text, cap, ['OK'], icon, null); return res('OK'); }
    if (this.answers && this.answerPos < this.answers.length) { const ans = this.answers[this.answerPos++]; return res(ans); }
    if (!this.mount) { const ans = (this.opts.autoAnswer || { YesNo: 'Yes', OKCancel: 'OK', YesNoCancel: 'Yes' })[kind]; this.answers.push(ans); this.answerPos++; return res(ans); }
    const choices = { OKCancel: ['OK', 'Cancel'], YesNo: ['Yes', 'No'], YesNoCancel: ['Yes', 'No', 'Cancel'] }[kind];
    const call = this.curCall;
    this.showBox(text, cap, choices, icon, ans => { this.answers.push(ans); this.answerPos = 0; this.dispatch(call.fn, call.args, true); });
    throw { __suspend: true };
  }
  showDialog(o, nd) {
    if (this.answers && this.answerPos < this.answers.length) { const ans = this.answers[this.answerPos++]; if (ans && ans.obj) { o.f = ans.obj.f; o.__ui = ans.obj.__ui; o.__ui.obj = o; o.__dr = ans.dr; } return ans ? ans.dr : null; }
    if (!o.__ui) this.it.err('CS0000', 'The dialog window did not call InitializeComponent()', nd);
    if (!this.mount) { const ans = { obj: o, dr: this.opts.dialogResult !== undefined ? this.opts.dialogResult : true }; this.answers.push(ans); this.answerPos++; o.__dr = ans.dr; return ans.dr; }
    const call = this.curCall;
    o.__dialog = { modal: true, done: dr => { this.answers.push({ obj: o, dr }); this.answerPos = 0; this.dispatch(call.fn, call.args, true); } };
    this.renderWindow(o, false, true);
    this.loaded(o);
    throw { __suspend: true };
  }
  showWindow(o) { if (!o.__ui) return; if (this.mount) this.renderWindow(o, false, false); this.loaded(o); }
  closeDialog(o) { const d = o.__dialog; if (o.__dom) o.__dom.remove(); if (o.__ov) o.__ov.remove(); o.__dialog = null; if (d) d.done(o.__dr === undefined ? false : o.__dr); }
  close(o) {
    if (o.__dialog) { this.closeDialog(o); return; }
    if (o === this.mainWin) { this.running = false; this.timers.slice().forEach(t => t.stop()); this.anim.stopAll(); this.closed = true; if (this.mount) this.renderClosed(); this.log('[Application closed]\n'); return; }
    if (o.__dom) o.__dom.remove();
  }
  navigate(frame, target, initial) {
    let page = null;
    if (target instanceof Obj) page = target;
    else if (typeof target === 'string' || (target && target.__type === 'Uri')) { const s = typeof target === 'string' ? target : target.s; const cn = this.xamlByFile[s.replace(/^.*\//, '')] || s.replace(/\.xaml$/i, ''); page = this.instantiate(cn); }
    else if (target && target.__plain) page = target;
    if (!page || !page.__ui) return false;
    if (frame.page && !initial) { frame.hist = frame.hist || []; frame.hist.push(frame.pageObj); }
    frame.pageObj = page; frame.page = page.__ui.root; frame.page.parent = frame;
    for (const k in page.__ui.names) this.names[k] = page.__ui.names[k];
    if (this.mount && frame.dom) this.renderFrame(frame);
    this.loaded(page);
    return true;
  }
  goBack(frame) { if (!frame.hist || !frame.hist.length) return; const p = frame.hist.pop(); frame.pageObj = p; frame.page = p.__ui.root; if (this.mount && frame.dom) this.renderFrame(frame); }
  radioGroup(r) {
    const grp = r.p.GroupName; const scope = grp ? (this.mainWin && this.mainWin.__ui.root) : r.parent;
    this.walk(scope, e => { if (e !== r && e.__type === 'RadioButton' && (grp ? e.p.GroupName === grp : e.parent === r.parent && !e.p.GroupName) && e.p.IsChecked) { e.p.IsChecked = false; this.applyProp(e, 'IsChecked'); this.fire(e, 'Unchecked', this.args('RoutedEventArgs', e)); } });
  }

  /* ===== headless test API (used by task checks) ===== */
  ui() {
    const app = this;
    const get = n => { const e = typeof n === 'string' ? app.find(n) : n; if (!e) throw new Error('No element named ' + n); return e; };
    const all = () => { const out = []; app.walk(app.mainWin.__ui.root, e => out.push(e)); return out; };
    return {
      el: get,
      has: n => !!app.find(n),
      all, root: () => app.mainWin.__ui.root,
      byType: t => all().filter(e => e.__type === t),
      text: n => { const e = get(n); return e.__type === 'TextBlock' ? app.inlineText(e) : e.__type === 'TextBox' ? e.p.Text : e.contentText(); },
      prop: (n, p) => { const e = get(n); return e.p[p]; },
      click: n => { const e = get(n); if (e.__type === 'CheckBox' || e.__type === 'ToggleButton') e.set('IsChecked', !e.p.IsChecked); if (e.__type === 'RadioButton') e.set('IsChecked', true); app.fire(e, 'Click', app.args('RoutedEventArgs', e)); app.triggerEvent(e, 'Click'); },
      type: (n, txt) => { const e = get(n); e.set('Text', txt); app.writeBack(e, 'Text'); },
      slide: (n, v) => { const e = get(n); e.set('Value', v); app.writeBack(e, 'Value'); },
      select: (n, k) => { const e = get(n); e.set('SelectedIndex', k); },
      key: (k, n) => { const e = n ? get(n) : app.mainWin.__ui.root; app.bubble(e, 'KeyDown', app.args('KeyEventArgs', e, { key: k })); },
      mouse: (ev, n, x, y) => { const e = get(n); app.bubble(e, ev, app.args('MouseButtonEventArgs', e, { x, y, left: true })); },
      tick: (k = 1) => { for (let i = 0; i < k; i++) app.timers.slice().forEach(t => t.tick()); },
      timers: () => app.timers.length,
      menu: n => { const e = get(n); app.fire(e, 'Click', app.args('RoutedEventArgs', e)); },
      log: () => app.logText || '',
      error: () => app.error,
    };
  }
  inlineText(e) { if (e.kids.length && e.__type === 'TextBlock' && !e.p.Text) return e.kids.map(k => k.__type === 'LineBreak' ? '\n' : k.__type === 'Run' ? k.p.Text : this.inlineText(k)).join(''); if (e.__type === 'Run') return e.p.Text; if (e.kids.length) return e.kids.map(k => this.inlineText(k)).join(''); return e.p.Text || ''; }
  refreshItems(e) { if (this.mount && e.dom) this.renderItems(e); }
  childrenChanged(e, key) { if (this.mount && e.dom) { if (key === 'items') this.renderItems(e); else this.renderKids(e); } }
  detach() { }
  applyAttached(e) { if (this.mount && e.dom) this.layoutChild(e); }
  applyStyleTriggers(e) { if (!this.mount || !e.dom) return; for (const tg of e.styleTriggers) { if (tg.prop === 'IsMouseOver') { const on = !!e.hover === (tg.value === 'True'); for (const s of tg.setters) { if (on) { e._saved = e._saved || {}; if (!(s.prop in e._saved)) e._saved[s.prop] = e.p[s.prop]; this.setFromString(e, s.prop, s.value, { line: 0, col: 0 }, null); } else if (e._saved && s.prop in e._saved) { e.p[s.prop] = e._saved[s.prop]; delete e._saved[s.prop]; } this.applyProp(e, s.prop); } } } }
};
WPF._enums = mkEnums();
// rendering hooks (replaced by wpf-render.js in the browser)
Object.assign(WPF.App.prototype, { applyProp() { }, repaintAll() { }, renderKids() { }, renderItems() { }, renderFrame() { }, renderWindow() { }, renderClosed() { }, showBox() { }, layoutChild() { } });
WPF.Brush = Brush; WPF.ColorV = ColorV; WPF.namedBrush = namedBrush; WPF.colorHex = colorHex;

/* ---------- animations ---------- */
class Animator {
  constructor(app) { this.app = app; this.list = []; this.raf = null; }
  make(kind, a) {
    const o = { __host: true, __type: kind, from: undefined, to: undefined, ms: 1000, auto: false, rep: 1, __get(n) { if (n === 'From') return this.from === undefined ? null : mk('double', this.from); if (n === 'To') return this.to === undefined ? null : mk('double', this.to); if (n === 'AutoReverse') return this.auto; },
      __ref(n) { const self = this; const map = { From: v => { self.from = v === null ? undefined : (v instanceof ColorV ? v.css : num(v)); }, To: v => { self.to = v === null ? undefined : (v instanceof ColorV ? v.css : num(v)); }, By: v => { self.by = num(v); }, Duration: v => { self.ms = v.ms !== undefined ? v.ms : 1000; }, AutoReverse: v => { self.auto = v; }, RepeatBehavior: v => { self.rep = v.forever ? Infinity : (v.count || 1); }, BeginTime: v => { self.delay = v.ms || 0; } }; if (map[n]) return new Ref(() => self.__get(n), map[n]); if (n === 'Completed') return new Ref(() => self.done || null, v => { self.done = v; }); },
      __call() { } };
    if (a.length >= 3) { o.from = a[0] instanceof ColorV ? a[0].css : num(a[0]); o.to = a[1] instanceof ColorV ? a[1].css : num(a[1]); o.ms = a[2].ms !== undefined ? a[2].ms : 1000; }
    else if (a.length === 2) { o.to = a[0] instanceof ColorV ? a[0].css : num(a[0]); o.ms = a[1].ms !== undefined ? a[1].ms : 1000; }
    return o;
  }
  begin(el, dp, an) {
    if (!dp) return;
    const prop = dp.owner === 'Canvas' ? 'Canvas.' + dp.prop : dp.prop;
    if (an === null) { this.list = this.list.filter(x => !(x.el === el && x.prop === prop)); return; }
    this.add({ el, prop, from: an.from, to: an.to, by: an.by, ms: an.ms, auto: an.auto, rep: an.rep, delay: an.delay || 0, done: an.done, color: an.__type === 'ColorAnimation' });
  }
  storyboard(sb, scope) {
    const app = this.app;
    const sbAt = sb.sb || {}; const sbRep = sb.p.RepeatBehavior; const sbAuto = sb.p.AutoReverse === 'True';
    for (const an of sb.kids) {
      const tn = (an.sb && an.sb.TargetName) || sbAt.TargetName; const tp = (an.sb && an.sb.TargetProperty) || sbAt.TargetProperty || '';
      let el = tn ? app.find(tn) : scope;
      if (!el) { app.report(new XamlError('XAML', `'${tn}' name cannot be found in the name scope of 'System.Windows.Window'.`, an.node ? an.node.line : 0, 0)); return; }
      const P = tp.replace(/[()]/g, '').split('.').filter(Boolean);
      let prop = P[P.length - 1];
      if (/Canvas\.(Left|Top)/.test(tp.replace(/[()]/g, ''))) prop = 'Canvas.' + prop;
      else if (/RenderTransform/.test(tp)) { el = el.p.RenderTransform; if (el && el.__type === 'TransformGroup') el = el.kids.find(k => k.p[prop] !== undefined) || el.kids[0]; }
      else if (/(Fill|Background|Foreground|Stroke)/.test(tp) && prop === 'Color') { const bp = P.find(x => /^(Fill|Background|Foreground|Stroke)$/.test(x.split('.').pop())); const k = (bp || 'Fill').split('.').pop(); if (!(el.p[k] instanceof Brush) || el.p[k].frozen) el.p[k] = new Brush('SolidColorBrush', { color: el.p[k] ? el.p[k].color : 'black' }); this.add({ el, prop: k, brush: true, from: an.p.From ? parseColor(an.p.From) : undefined, to: parseColor(an.p.To), ms: dur(an.p.Duration), auto: an.p.AutoReverse === 'True' || sbAuto, rep: rep(an.p.RepeatBehavior || sbRep), delay: dur(an.p.BeginTime || '0'), color: true }); continue; }
      if (!el) continue;
      const num_ = s => (s === undefined ? undefined : parseFloat(s));
      this.add({ el, prop, from: an.__type === 'ColorAnimation' ? (an.p.From ? parseColor(an.p.From) : undefined) : num_(an.p.From), to: an.__type === 'ColorAnimation' ? parseColor(an.p.To) : num_(an.p.To), by: num_(an.p.By), ms: dur(an.p.Duration), auto: an.p.AutoReverse === 'True' || sbAuto, rep: rep(an.p.RepeatBehavior || sbRep), delay: dur(an.p.BeginTime || '0'), color: an.__type === 'ColorAnimation' });
    }
    function rep(s) { if (!s) return 1; if (s === 'Forever') return Infinity; const m = /^(\d+(?:\.\d+)?)x$/.exec(s); return m ? +m[1] : 1; }
  }
  cur(a) { const el = a.el; if (a.prop.startsWith('Canvas.')) { const v = el.att[a.prop]; return v === undefined || Number.isNaN(v) ? 0 : v; } if (a.brush) return el.p[a.prop].color; const v = el.p[a.prop]; if (v === undefined || Number.isNaN(v)) { if (el.dom && HAS_DOM && (a.prop === 'Width' || a.prop === 'Height')) return a.prop === 'Width' ? el.dom.offsetWidth : el.dom.offsetHeight; return a.prop === 'Opacity' ? 1 : 0; } return v; }
  add(a) {
    this.list = this.list.filter(x => !(x.el === a.el && x.prop === a.prop));
    a.start = null; a.base = this.cur(a);
    if (a.from === undefined) a.from = a.base;
    if (a.to === undefined && a.by !== undefined) a.to = a.from + a.by;
    this.list.push(a);
    if (!HAS_DOM || !this.app.mount) { this.set(a, a.auto ? a.from : a.to); this.list = this.list.filter(x => x !== a); return; }
    if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t));
  }
  set(a, v) {
    const el = a.el;
    if (a.prop.startsWith('Canvas.')) { el.att[a.prop] = v; this.app.applyAttached(el); return; }
    if (a.brush) { el.p[a.prop].color = v; this.app.applyProp(el, a.prop); return; }
    if (a.color) { el.p[a.prop] = brushFrom(v) || el.p[a.prop]; this.app.applyProp(el, a.prop); return; }
    el.p[a.prop] = v; this.app.applyProp(el, a.prop);
    if (el.owner3d) el.owner3d.dirty = true;
  }
  frame(t) {
    this.raf = null;
    if (!this.list.length) return;
    for (const a of this.list.slice()) {
      if (a.start === null) a.start = t + (a.delay || 0);
      let e = (t - a.start) / a.ms; if (e < 0) continue;
      const cycle = a.auto ? 2 : 1; const k = Math.floor(e / cycle);
      if (k >= a.rep) { this.set(a, a.auto ? a.from : a.to); this.list = this.list.filter(x => x !== a); if (a.done) this.app.dispatch(a.done, [null, this.app.args('EventArgs', null)]); continue; }
      let ph = e - k * cycle; if (ph > 1) ph = 2 - ph;
      const v = a.color || a.brush ? mixColor(a.from, a.to, ph) : a.from + (a.to - a.from) * ph;
      this.set(a, v);
    }
    if (this.list.length) this.raf = requestAnimationFrame(tt => this.frame(tt));
  }
  stopAll() { this.list = []; if (this.raf && HAS_DOM) cancelAnimationFrame(this.raf); this.raf = null; }
}
function mixColor(a, b, t) { const x = cssRgb(a || 'black'), y = cssRgb(b || 'black'); return `rgba(${Math.round(x[0] + (y[0] - x[0]) * t)},${Math.round(x[1] + (y[1] - x[1]) * t)},${Math.round(x[2] + (y[2] - x[2]) * t)},${(x[3] + (y[3] - x[3]) * t).toFixed(3)})`; }

/* ---------- XAML syntax highlight ---------- */
WPF.hlXaml = function (code, esc) {
  const re = /(<!--[\s\S]*?-->)|(<\/?)([\w:.]+)|("[^"]*")|([\w:.]+)(?==)|(\/?>)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index)); last = re.lastIndex;
    if (m[1]) out += `<span class="c">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="xp">${esc(m[2])}</span><span class="xt">${esc(m[3])}</span>`;
    else if (m[4]) out += m[4].startsWith('"{') ? `<span class="xb">${esc(m[4])}</span>` : `<span class="s">${esc(m[4])}</span>`;
    else if (m[5]) out += `<span class="xa">${esc(m[5])}</span>`;
    else if (m[6]) out += `<span class="xp">${esc(m[6])}</span>`;
  }
  return out + esc(code.slice(last));
};
WPF.L = k => (typeof G.tr === 'function' ? G.tr('w_' + k) : ({ closed: 'Application closed', restart: 'Run again', cancel: 'Cancel', yes: 'Yes', no: 'No' })[k]);
})(typeof window !== 'undefined' ? window : globalThis);
