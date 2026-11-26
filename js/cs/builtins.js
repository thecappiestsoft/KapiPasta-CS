/* ===== KapiSharp: biblioteka standardowa (Console, Math, Convert, string, kolekcje, LINQ, pliki, wyjątki) ===== */
(function (G) {
'use strict';
const CS = G.CS;
const { N, Obj, Arr, Coll, EnumVal, KVP, Fn, MRef, Multi, TypeVal, TypeObj, Ref, CsThrow, Interp, mk, I, num, INTS, NUMS, tname, CLR } = CS;
const P = Interp.prototype;
const NOPE = Interp.NOPE;

/* ---------- native exception classes ---------- */
const EXC = {};
const DEFMSG = {
  DivideByZeroException: 'Attempted to divide by zero.', InvalidOperationException: 'Operation is not valid due to the current state of the object.',
  ArgumentException: 'Value does not fall within the expected range.', FormatException: 'One of the identified items was in an invalid format.',
  IndexOutOfRangeException: 'Index was outside the bounds of the array.', NullReferenceException: 'Object reference not set to an instance of an object.',
  NotImplementedException: 'The method or operation is not implemented.', ArgumentOutOfRangeException: 'Specified argument was out of the range of valid values.',
  ArgumentNullException: 'Value cannot be null.', OverflowException: 'Arithmetic operation resulted in an overflow.', KeyNotFoundException: 'The given key was not present in the dictionary.',
  InvalidCastException: 'Specified cast is not valid.', NotSupportedException: 'Specified method is not supported.', IOException: 'I/O error occurred.', FileNotFoundException: 'Unable to find the specified file.',
  ArithmeticException: 'Overflow or underflow in the arithmetic operation.', SystemException: 'System error.', StackOverflowException: 'Operation caused a stack overflow.', OutOfMemoryException: 'Insufficient memory to continue the execution of the program.',
};
function defExc(name, base, ns) {
  const C = { name, native: true, ns: ns || 'System', base: base ? EXC[base] : null, kind: 'class', fields: new Map(), props: new Map(), methods: new Map(), ctors: [], ops: new Map(), ifaces: [], sv: {}, sinit: true,
    nget: { Message: o => o.f.Message, InnerException: o => o.f.InnerException, ParamName: o => o.f.ParamName === undefined ? null : o.f.ParamName, StackTrace: o => '   at Program.Main()', Source: () => 'KapiPasta' },
    nctor(o, args) {
      // find nearest native class to decide default message
      let nc = o.cls; while (nc && !nc.native) nc = nc.base;
      const a = args.map(x => (x instanceof Ref ? x.get() : x));
      const def = () => DEFMSG[nc.name] || `Exception of type '${this.clrName(o)}' was thrown.`;
      if (['ArgumentOutOfRangeException', 'ArgumentNullException'].includes(nc.name)) {
        const pn = typeof a[0] === 'string' ? a[0] : null; const msg = typeof a[1] === 'string' ? a[1] : DEFMSG[nc.name];
        o.f.ParamName = pn; o.f.Message = pn ? `${msg} (Parameter '${pn}')` : msg; o.f.InnerException = null; return;
      }
      if (nc.name === 'ArgumentException' && typeof a[1] === 'string') { o.f.ParamName = a[1]; o.f.Message = `${a[0] === null ? DEFMSG.ArgumentException : a[0]} (Parameter '${a[1]}')`; o.f.InnerException = null; return; }
      o.f.Message = (a[0] === undefined || a[0] === null) ? def() : this.str(a[0]);
      o.f.InnerException = a[1] instanceof Obj ? a[1] : null;
    },
    nativeToString(o) { return this.clrName(o) + ': ' + o.f.Message + (o.f.InnerException ? ' ---> ' + this.str(o.f.InnerException) : ''); }
  };
  EXC[name] = C; return C;
}
defExc('Exception', null); defExc('SystemException', 'Exception'); defExc('ArithmeticException', 'SystemException');
defExc('DivideByZeroException', 'ArithmeticException'); defExc('OverflowException', 'ArithmeticException');
['FormatException', 'IndexOutOfRangeException', 'NullReferenceException', 'InvalidOperationException', 'ArgumentException', 'InvalidCastException', 'NotImplementedException', 'NotSupportedException', 'StackOverflowException', 'OutOfMemoryException'].forEach(n => defExc(n, 'SystemException'));
defExc('ArgumentNullException', 'ArgumentException'); defExc('ArgumentOutOfRangeException', 'ArgumentException');
defExc('KeyNotFoundException', 'SystemException', 'System.Collections.Generic'); defExc('IOException', 'SystemException', 'System.IO'); defExc('FileNotFoundException', 'IOException', 'System.IO');
defExc('SwitchExpressionException', 'InvalidOperationException', 'System.Runtime.CompilerServices'); defExc('ApplicationException', 'Exception');
const OBJECT_CLS = { name: 'Object', native: true, ns: 'System', base: null, kind: 'class', fields: new Map(), props: new Map(), methods: new Map(), ctors: [], ops: new Map(), ifaces: [], sv: {}, sinit: true };
EXC.object = OBJECT_CLS;
CS.EXC = EXC;

/* ---------- builtin enums ---------- */
function mkEnum(name, names, vals) { const E = { name, kind: 'enum', members: names.map((n, k) => ({ name: n, v: vals ? vals[k] : k })), byName: new Map(), builtin: true }; E.members.forEach(m => E.byName.set(m.name, m.v)); return E; }
const BENUMS = {
  ConsoleColor: mkEnum('ConsoleColor', ['Black', 'DarkBlue', 'DarkGreen', 'DarkCyan', 'DarkRed', 'DarkMagenta', 'DarkYellow', 'Gray', 'DarkGray', 'Blue', 'Green', 'Cyan', 'Red', 'Magenta', 'Yellow', 'White']),
  MidpointRounding: mkEnum('MidpointRounding', ['ToEven', 'AwayFromZero', 'ToZero', 'ToNegativeInfinity', 'ToPositiveInfinity']),
  StringSplitOptions: mkEnum('StringSplitOptions', ['None', 'RemoveEmptyEntries', 'TrimEntries']),
  StringComparison: mkEnum('StringComparison', ['CurrentCulture', 'CurrentCultureIgnoreCase', 'InvariantCulture', 'InvariantCultureIgnoreCase', 'Ordinal', 'OrdinalIgnoreCase']),
  DayOfWeek: mkEnum('DayOfWeek', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  ConsoleKey: mkEnum('ConsoleKey', ['Enter', 'Escape', 'Spacebar', 'LeftArrow', 'UpArrow', 'RightArrow', 'DownArrow'], [13, 27, 32, 37, 38, 39, 40]),
};
const CONSOLE_COLORS = ['#000000', '#000080', '#008000', '#008080', '#800000', '#800080', '#808000', '#c0c0c0', '#808080', '#3b78ff', '#16c60c', '#61d6d6', '#e74856', '#b4009e', '#f9f1a5', '#f2f2f2'];
CS.CONSOLE_COLORS = CONSOLE_COLORS;

const KNOWN = new Set(['List', 'Dictionary', 'Queue', 'Stack', 'HashSet', 'SortedList', 'SortedDictionary', 'LinkedList', 'IEnumerable', 'IList', 'ICollection', 'IDictionary', 'IReadOnlyList', 'KeyValuePair', 'Func', 'Action', 'Predicate', 'Comparison',
  'Random', 'StringBuilder', 'StreamWriter', 'StreamReader', 'Console', 'Math', 'MathF', 'Convert', 'Array', 'Enum', 'Environment', 'DateTime', 'TimeSpan', 'Thread', 'File', 'Path', 'Directory', 'Enumerable', 'Tuple', 'ConsoleKeyInfo',
  'Object', 'IComparable', 'ICloneable', 'IDisposable', 'IEquatable', 'IComparer', 'EventArgs', 'EventHandler', 'Delegate', 'Type', 'Task', 'Nullable', 'Char', 'String', 'Int32', 'Double', 'Boolean', 'GC', 'Debug']);
class BObj { constructor(kind, o) { this.kind = kind; Object.assign(this, o); this.id = ++BObj.n; } }
BObj.n = 0;
CS.BObj = BObj;

P.nativeClass = function (n) { if (EXC[n]) return EXC[n]; if (n === 'object' || n === 'Object') return OBJECT_CLS; if (this.host && this.host.nativeClass) return this.host.nativeClass(n); return null; };
P.knownType = function (n) { return KNOWN.has(n) || !!EXC[n] || !!(this.host && this.host.knownType && this.host.knownType(n)); };
CS.installBuiltins = function (it) { for (const k in BENUMS) it.enums.set(k, BENUMS[k]); };

P.convBuiltin = function (v, t, explicit) {
  const n = t.n;
  if (['List', 'IList', 'ICollection', 'IEnumerable', 'IReadOnlyList'].includes(n)) { if (v === null) return null; if (v instanceof Coll || v instanceof Arr || (n === 'IEnumerable' && typeof v === 'string')) { if (n === 'List' && !(v instanceof Coll && v.kind === 'List')) return NOPE; return v; } return NOPE; }
  if (['Dictionary', 'IDictionary', 'Queue', 'Stack', 'HashSet', 'SortedDictionary', 'SortedList', 'LinkedList'].includes(n)) { if (v === null) return null; if (v instanceof Coll && (v.kind === n || (n === 'IDictionary' && v.kind === 'Dictionary'))) return v; return NOPE; }
  if (n === 'KeyValuePair') return v instanceof KVP ? v : NOPE;
  if (n === 'Tuple') return v;
  if (n === 'Type') return v instanceof TypeObj || v === null ? v : NOPE;
  if (['Random', 'StringBuilder', 'StreamWriter', 'StreamReader', 'DateTime', 'TimeSpan', 'ConsoleKeyInfo'].includes(n)) { if (v === null && !['DateTime', 'TimeSpan'].includes(n)) return null; return v instanceof BObj && v.kind === n ? v : NOPE; }
  if (n === 'IComparable' || n === 'IEquatable') return v;
  if (n === 'IDisposable') return v;
  if (n === 'EventArgs') return v;
  if (n === 'Object') return v;
  if (this.host && this.host.conv) { const r = this.host.conv(v, t, explicit); if (r !== undefined) return r; }
  if (v && v.__host) return v;
  return NOPE;
};

/* ---------- helpers ---------- */
const S = v => typeof v === 'string';
const isInt = v => v instanceof N && INTS.has(v.t) && v.t !== 'char' && typeof v.v !== 'bigint';
P.argInt = function (v, nd, k = 1) { if (v instanceof N && INTS.has(v.t)) return num(v); this.err('CS1503', `Argument ${k}: cannot convert from '${this.typeOf(v)}' to 'int'`, nd); };
P.argStr = function (v, nd, k = 1) { if (v === null || S(v)) return v; this.err('CS1503', `Argument ${k}: cannot convert from '${this.typeOf(v)}' to 'string'`, nd); };
P.argConv = function (v, t, k, nd) { const r = this.conv(v, t, false, nd, true); if (r === NOPE) this.err('CS1503', `Argument ${k}: cannot convert from '${this.typeOf(v)}' to '${tname(t)}'`, nd); return this.cloneV(r); };
P.deref = function (args) { return args.map(a => (a instanceof Ref ? a.get() : a)); };
P.chk = function (args, min, max, name, nd) { if (args.length < min || args.length > max) this.err('CS1501', `No overload for method '${name}' takes ${args.length} arguments`, nd); };
P.list = function (v, nd) { // any enumerable -> JS array
  if (v instanceof Arr) return v.a.slice();
  if (v instanceof Coll) return [...this.iter(v, nd)];
  if (S(v)) return [...v].map(c => mk('char', c.charCodeAt(0)));
  if (v === null) this.throwEx('ArgumentNullException', "Value cannot be null. (Parameter 'source')", nd);
  return [...this.iter(v, nd)];
};
P.cmp = function (a, b, nd) {
  if (a === null && b === null) return 0; if (a === null) return -1; if (b === null) return 1;
  if (a instanceof N && b instanceof N) { const x = typeof a.v === 'bigint' || typeof b.v === 'bigint' ? [BigInt(a.v), BigInt(b.v)] : [num(a), num(b)]; return x[0] < x[1] ? -1 : x[0] > x[1] ? 1 : 0; }
  if (S(a) && S(b)) return COLL.compare(a, b);
  if (typeof a === 'boolean') return a === b ? 0 : a ? 1 : -1;
  if (a instanceof EnumVal) return a.v - b.v;
  if (a instanceof Obj) {
    const m = this.methodsByName(a.cls, 'CompareTo'); if (m.length) return num(this.invokeVirtual(this.pick(m, [b], nd, 'CompareTo'), a, [b], nd));
    this.throwEx('InvalidOperationException', 'Failed to compare two elements in the array.', nd);
  }
  return 0;
};
const COLL = new Intl.Collator('en', { caseFirst: 'lower' });
P.key = function (v, nd) {
  if (v === null || v === undefined) this.throwEx('ArgumentNullException', "Value cannot be null. (Parameter 'key')", nd);
  if (S(v)) return 's' + v;
  if (v instanceof N) return (v.t === 'char' ? 'c' : 'n') + String(v.v);
  if (typeof v === 'boolean') return 'b' + v;
  if (v instanceof EnumVal) return 'e' + v.e.name + v.v;
  if (v instanceof Obj) {
    if (v.cls.isStruct) return 'S' + v.cls.name + JSON.stringify(Object.keys(v.f).map(k => this.key(v.f[k], nd)));
    const eq = this.methodsByName(v.cls, 'GetHashCode'); if (eq.length) return 'h' + this.str(this.invoke(eq[0], v, [], nd)) + '|' + (this.methodsByName(v.cls, 'Equals').length ? '' : v.id);
    return 'o' + v.id;
  }
  if (v && v.id) return 'x' + v.id;
  return 'u' + String(v);
};
P.call1 = function (f, args, nd) { return this.callDelegate(f, args, nd); };
P.mkList = function (items, el, kind = 'List') { const c = new Coll(kind, [el || this.elType(items)]); c.a = items; return c; };
P.elType = function (items) { const v = items.find(x => x !== null && x !== undefined); return v === undefined ? { n: 'object' } : this.typeDesc(v); };
P.enumName = function (k) { return k; };

/* ---------- parsing numbers (invariant culture) ---------- */
P.parseInt = function (s, t, nd) {
  if (s === null) this.throwEx('ArgumentNullException', "Value cannot be null. (Parameter 's')", nd);
  const m = /^\s*([+-]?)(\d+)\s*$/.exec(s);
  if (!m) this.throwEx('FormatException', `The input string '${s}' was not in a correct format.`, nd);
  const b = BigInt(m[1] + m[2]);
  const R = { int: [-2147483648n, 2147483647n], long: [-9223372036854775808n, 9223372036854775807n], short: [-32768n, 32767n], byte: [0n, 255n], uint: [0n, 4294967295n], sbyte: [-128n, 127n], ushort: [0n, 65535n], ulong: [0n, 18446744073709551615n] }[t];
  if (b < R[0] || b > R[1]) this.throwEx('OverflowException', `Value was either too large or too small for ${t === 'int' ? 'an Int32' : t === 'long' ? 'an Int64' : t === 'uint' ? 'a UInt32' : 'a ' + CLR[t]}.`, nd);
  return mk(t, t === 'long' || t === 'ulong' ? b : Number(b));
};
P.parseFloat = function (s, t, nd) {
  if (s === null) this.throwEx('ArgumentNullException', "Value cannot be null. (Parameter 's')", nd);
  const c = s.trim().replace(/,/g, '');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(c)) { if (/^[+-]?(∞|Infinity)$/.test(c)) return mk(t, c.startsWith('-') ? -Infinity : Infinity); if (c === 'NaN') return mk(t, NaN); this.throwEx('FormatException', `The input string '${s}' was not in a correct format.`, nd); }
  const v = Number(c); return t === 'decimal' ? mk('decimal', v, false, ((c.split('.')[1] || '').replace(/e.*/i, '')).length) : mk(t, v);
};
function bankers(x, d = 0) { const m = 10 ** d; const y = x * m; const r = Math.round(y); const diff = Math.abs(y - Math.trunc(y)); if (Math.abs(diff - 0.5) < 1e-9 * Math.max(1, Math.abs(y))) { const f = Math.floor(y); return (f % 2 === 0 ? f : f + 1) / m; } return r / m; }
function awayRound(x, d = 0) { const m = 10 ** d; const y = Math.abs(x) * m; const r = Math.round(y + 1e-9 * Math.max(1, y)); return Math.sign(x) * Math.floor(y + 0.5 + 1e-12) / m; }
CS.bankers = bankers;

/* ---------- composite format "{0,5:F2}" ---------- */
P.composite = function (fmt, args, nd) {
  let out = '', i = 0;
  while (i < fmt.length) {
    const c = fmt[i];
    if (c === '{') {
      if (fmt[i + 1] === '{') { out += '{'; i += 2; continue; }
      const j = fmt.indexOf('}', i); if (j < 0) this.throwEx('FormatException', 'Input string was not in a correct format.', nd);
      const m = /^(\d+)\s*(?:,\s*(-?\d+))?\s*(?::(.*))?$/.exec(fmt.slice(i + 1, j));
      if (!m) this.throwEx('FormatException', 'Input string was not in a correct format.', nd);
      const k = +m[1]; if (k >= args.length) this.throwEx('FormatException', 'Index (zero based) must be greater than or equal to zero and less than the size of the argument list.', nd);
      let s = this.str(args[k], m[3], nd);
      if (m[2]) { const w = +m[2]; s = w < 0 ? s.padEnd(-w) : s.padStart(w); }
      out += s; i = j + 1; continue;
    }
    if (c === '}') { if (fmt[i + 1] === '}') { out += '}'; i += 2; continue; } this.throwEx('FormatException', 'Input string was not in a correct format.', nd); }
    out += c; i++;
  }
  return out;
};
P.writeArgs = function (args, nd) {
  const a = this.deref(args);
  if (!a.length) return '';
  if (a.length === 1) { const v = a[0]; if (v instanceof Arr && v.el.n === 'char') return v.a.map(x => String.fromCharCode(x.v)).join(''); return this.str(v); }
  if (S(a[0])) return this.composite(a[0], a.slice(1).length === 1 && a[1] instanceof Arr && a[1].el.n === 'object' ? a[1].a : a.slice(1), nd);
  this.err('CS1501', `No overload for method 'WriteLine' takes ${a.length} arguments`, nd);
};

/* ---------- static members ---------- */
const STATIC_METHODS = {
  Console: 'WriteLine Write ReadLine ReadKey Read Clear ResetColor Beep SetCursorPosition', Math: 'Abs Max Min Pow Sqrt Cbrt Round Floor Ceiling Truncate Sign Clamp Log Log10 Log2 Exp Sin Cos Tan Asin Acos Atan Atan2 DivRem',
  Convert: 'ToInt32 ToInt64 ToInt16 ToDouble ToSingle ToDecimal ToString ToBoolean ToChar ToByte', string: 'Join Concat Format IsNullOrEmpty IsNullOrWhiteSpace Compare Equals Copy',
  int: 'Parse TryParse', long: 'Parse TryParse', double: 'Parse TryParse IsNaN IsInfinity', float: 'Parse TryParse', decimal: 'Parse TryParse', bool: 'Parse TryParse', short: 'Parse TryParse', byte: 'Parse TryParse',
  char: 'IsDigit IsLetter IsLetterOrDigit IsUpper IsLower IsWhiteSpace IsPunctuation ToUpper ToLower GetNumericValue Parse IsSymbol',
  Array: 'Sort Reverse IndexOf LastIndexOf Resize Copy Fill Clear Exists Find FindAll FindIndex TrueForAll Empty ConvertAll ForEach BinarySearch', File: 'WriteAllText AppendAllText ReadAllText ReadAllLines WriteAllLines AppendAllLines Exists Delete Copy',
  Enum: 'GetValues GetNames Parse TryParse IsDefined GetName', Environment: 'Exit', Thread: 'Sleep', Task: 'Delay', DateTime: 'Parse', TimeSpan: 'FromSeconds FromMilliseconds FromMinutes FromHours FromDays',
  object: 'ReferenceEquals Equals', Object: 'ReferenceEquals Equals', Enumerable: 'Range Repeat Empty', Path: 'Combine GetExtension GetFileName', Directory: 'Exists GetFiles CreateDirectory', GC: 'Collect', Debug: 'WriteLine',
};
P.getBuiltinStatic = function (tn, n, nd, fr, soft) {
  switch (tn) {
    case 'int': if (n === 'MaxValue') return new N('int', 2147483647, true); if (n === 'MinValue') return new N('int', -2147483648, true); break;
    case 'long': if (n === 'MaxValue') return mk('long', 9223372036854775807n); if (n === 'MinValue') return mk('long', -9223372036854775808n); break;
    case 'short': if (n === 'MaxValue') return mk('short', 32767); if (n === 'MinValue') return mk('short', -32768); break;
    case 'byte': if (n === 'MaxValue') return mk('byte', 255); if (n === 'MinValue') return mk('byte', 0); break;
    case 'sbyte': if (n === 'MaxValue') return mk('sbyte', 127); if (n === 'MinValue') return mk('sbyte', -128); break;
    case 'ushort': if (n === 'MaxValue') return mk('ushort', 65535); if (n === 'MinValue') return mk('ushort', 0); break;
    case 'uint': if (n === 'MaxValue') return mk('uint', 4294967295); if (n === 'MinValue') return mk('uint', 0); break;
    case 'double': { const m = { MaxValue: Number.MAX_VALUE, MinValue: -Number.MAX_VALUE, Epsilon: 5e-324, PositiveInfinity: Infinity, NegativeInfinity: -Infinity, NaN: NaN, Pi: Math.PI }; if (n in m) return mk('double', m[n]); break; }
    case 'float': { const m = { MaxValue: 3.4028234663852886e38, MinValue: -3.4028234663852886e38, Epsilon: 1.401298464324817e-45, PositiveInfinity: Infinity, NegativeInfinity: -Infinity, NaN: NaN }; if (n in m) return mk('float', m[n]); break; }
    case 'decimal': if (n === 'MaxValue') return mk('decimal', 79228162514264337593543950335, false, 0); if (n === 'MinValue') return mk('decimal', -79228162514264337593543950335, false, 0); if (n === 'Zero') return mk('decimal', 0, false, 0); if (n === 'One') return mk('decimal', 1, false, 0); break;
    case 'char': if (n === 'MaxValue') return mk('char', 65535); if (n === 'MinValue') return mk('char', 0); break;
    case 'string': if (n === 'Empty') return ''; break;
    case 'bool': if (n === 'TrueString') return 'True'; if (n === 'FalseString') return 'False'; break;
    case 'Math': case 'MathF': { const m = { PI: Math.PI, E: Math.E, Tau: 2 * Math.PI }; if (n in m) return mk(tn === 'MathF' ? 'float' : 'double', m[n]); break; }
    case 'Console':
      if (n === 'ForegroundColor') return new EnumVal(BENUMS.ConsoleColor, this.fg === null ? 7 : this.fg);
      if (n === 'BackgroundColor') return new EnumVal(BENUMS.ConsoleColor, this.bg === null ? 0 : this.bg);
      if (n === 'WindowWidth' || n === 'BufferWidth') return I(120); if (n === 'WindowHeight') return I(30);
      if (n === 'KeyAvailable') return false; if (n === 'Title') return this.title || 'KapiPasta'; if (n === 'CursorLeft' || n === 'CursorTop') return I(0);
      break;
    case 'Environment': if (n === 'NewLine') return '\n'; if (n === 'TickCount' || n === 'TickCount64') return I(Date.now() % 2147483647); if (n === 'UserName') return 'kapi'; if (n === 'MachineName') return 'KAPIPASTA'; if (n === 'ProcessorCount') return I(4); if (n === 'Version') return '8.0.0'; break;
    case 'DateTime': if (n === 'Now' || n === 'UtcNow') return new BObj('DateTime', { d: new Date() }); if (n === 'Today') { const d = new Date(); d.setHours(0, 0, 0, 0); return new BObj('DateTime', { d }); } if (n === 'MinValue') return new BObj('DateTime', { d: new Date(1, 0, 1) }); break;
    case 'Random': if (n === 'Shared') return new BObj('Random', { rnd: Math.random }); break;
    case 'TimeSpan': if (n === 'Zero') return new BObj('TimeSpan', { ms: 0 }); break;
  }
  if (this.host && this.host.staticMember) { const r = this.host.staticMember(tn, n, nd); if (r !== undefined) return r; }
  const ms = STATIC_METHODS[tn];
  if (ms && ms.split(' ').includes(n)) return (args, nd2) => this.callStatic(tn, n, args, nd2 || nd, fr);
  if (soft) return NOPE;
  if (EXC[tn]) this.err('CS0117', `'${tn}' does not contain a definition for '${n}'`, nd);
  this.err('CS0117', `'${tn === 'int' ? 'int' : tn}' does not contain a definition for '${n}'`, nd);
};
P.builtinStaticRef = function (tn, n, nd, fr) {
  if (tn === 'Console') {
    if (n === 'ForegroundColor' || n === 'BackgroundColor') return new Ref(() => this.getBuiltinStatic(tn, n, nd), v => { if (!(v instanceof EnumVal) || v.e !== BENUMS.ConsoleColor) this.err('CS0029', `Cannot implicitly convert type '${this.typeOf(v)}' to 'System.ConsoleColor'`, nd); if (n === 'ForegroundColor') this.fg = v.v; else this.bg = v.v; }, { n: 'ConsoleColor' });
    if (n === 'Title') return new Ref(() => this.title, v => { this.title = v; }, { n: 'string' });
    if (n === 'CursorVisible' || n === 'CursorLeft' || n === 'CursorTop' || n === 'OutputEncoding' || n === 'InputEncoding') return new Ref(() => null, () => { }, { n: 'object' });
  }
  if (this.host && this.host.staticRef) { const r = this.host.staticRef(tn, n, nd); if (r) return r; }
  this.err('CS0200', `Property or indexer '${tn}.${n}' cannot be assigned to -- it is read only`, nd);
};
P.callStatic = function (tn, n, args, nd, fr, soft, targs) {
  const a = this.deref(args);
  const A = k => a[k];
  if (this.host && this.host.callStatic) { const r = this.host.callStatic(tn, n, args, nd, this); if (r !== NOPE) return r; }
  switch (tn) {
    case 'Console': switch (n) {
      case 'WriteLine': this.write(this.writeArgs(args, nd) + '\n'); return;
      case 'Write': if (!a.length) this.err('CS1501', 'No overload for method \'Write\' takes 0 arguments', nd); this.write(this.writeArgs(args, nd)); return;
      case 'ReadLine': this.chk(a, 0, 0, n, nd); if (!this.stdin.length) { this.readEOF = (this.readEOF || 0) + 1; return null; } { const l = this.stdin.shift(); if (this.opts.echo) { const f = this.fg; this.fg = 'in'; this.write(l + '\n'); this.fg = f; } return l; }
      case 'Read': { if (!this.stdin.length) return I(-1); const l = this.stdin[0]; if (!l.length) { this.stdin.shift(); return I(10); } this.stdin[0] = l.slice(1); return I(l.charCodeAt(0)); }
      case 'ReadKey': return new BObj('ConsoleKeyInfo', { ch: 13 });
      case 'Clear': if (this.opts.onClear) this.opts.onClear(); return;
      case 'ResetColor': this.fg = null; this.bg = null; return;
      case 'Beep': case 'SetCursorPosition': return;
    } break;
    case 'Debug': if (n === 'WriteLine') { this.write(this.writeArgs(args, nd) + '\n'); return; } break;
    case 'Math': case 'MathF': {
      const one = () => { this.chk(a, 1, 1, n, nd); if (!(A(0) instanceof N)) this.err('CS1503', `Argument 1: cannot convert from '${this.typeOf(A(0))}' to 'double'`, nd); return num(A(0)); };
      const dbl = v => mk(tn === 'MathF' ? 'float' : 'double', v);
      switch (n) {
        case 'Abs': { this.chk(a, 1, 1, n, nd); const v = A(0); if (!(v instanceof N)) break; if (typeof v.v === 'bigint') return mk(v.t, v.v < 0n ? -v.v : v.v); if (v.t === 'int' && v.v === -2147483648) this.throwEx('OverflowException', 'Negating the minimum value of a twos complement number is invalid.', nd); return mk(['byte', 'sbyte', 'short', 'ushort', 'char'].includes(v.t) ? 'int' : v.t, Math.abs(v.v), false, v.s); }
        case 'Max': case 'Min': { this.chk(a, 2, 2, n, nd); const x = A(0), y = A(1); if (!(x instanceof N) || !(y instanceof N)) this.err('CS1503', `Argument ${x instanceof N ? 2 : 1}: cannot convert from '${this.typeOf(x instanceof N ? y : x)}' to 'double'`, nd); const t = promoT(x.t, y.t); const c = this.cmp(x, y); const r = n === 'Max' ? (c >= 0 ? x : y) : (c <= 0 ? x : y); if (t === 'double' && (Number.isNaN(num(x)) || Number.isNaN(num(y)))) return mk('double', NaN); return mk(t, r.v, false, r.s); }
        case 'Pow': this.chk(a, 2, 2, n, nd); return dbl(Math.pow(num(A(0)), num(A(1))));
        case 'Sqrt': return dbl(Math.sqrt(one())); case 'Cbrt': return dbl(Math.cbrt(one()));
        case 'Exp': return dbl(Math.exp(one())); case 'Log10': return dbl(Math.log10(one())); case 'Log2': return dbl(Math.log2(one()));
        case 'Log': if (a.length === 2) return dbl(Math.log(num(A(0))) / Math.log(num(A(1)))); return dbl(Math.log(one()));
        case 'Sin': return dbl(Math.sin(one())); case 'Cos': return dbl(Math.cos(one())); case 'Tan': return dbl(Math.tan(one()));
        case 'Asin': return dbl(Math.asin(one())); case 'Acos': return dbl(Math.acos(one())); case 'Atan': return dbl(Math.atan(one()));
        case 'Atan2': return dbl(Math.atan2(num(A(0)), num(A(1))));
        case 'Floor': case 'Ceiling': case 'Truncate': { this.chk(a, 1, 1, n, nd); const v = A(0); const f = n === 'Floor' ? Math.floor : n === 'Ceiling' ? Math.ceil : Math.trunc; if (v.t === 'decimal') return mk('decimal', f(v.v), false, 0); return mk('double', f(num(v))); }
        case 'Round': {
          this.chk(a, 1, 3, n, nd); const v = A(0); let d = 0, mode = 0;
          if (a.length >= 2) { if (A(1) instanceof EnumVal) mode = A(1).v; else d = num(A(1)); }
          if (a.length === 3) mode = A(2).v;
          const r = mode === 1 ? awayRound(num(v), d) : mode === 2 ? Math.trunc(num(v) * 10 ** d) / 10 ** d : mode === 3 ? Math.floor(num(v) * 10 ** d) / 10 ** d : mode === 4 ? Math.ceil(num(v) * 10 ** d) / 10 ** d : bankers(num(v), d);
          if (v.t === 'decimal') return mk('decimal', r, false, Math.min(v.s || 0, d)); return mk('double', r);
        }
        case 'Sign': return I(Math.sign(one()));
        case 'Clamp': { this.chk(a, 3, 3, n, nd); const t = promoT(promoT(A(0).t, A(1).t), A(2).t); const v = Math.min(Math.max(num(A(0)), num(A(1))), num(A(2))); return mk(t, v); }
        case 'DivRem': break;
      } break;
    }
    case 'Convert': {
      this.chk(a, 1, 2, n, nd);
      const v = A(0);
      const toInt = (t) => {
        if (v === null) return mk(t, 0);
        if (S(v)) { if (a.length === 2) { const base = num(A(1)); const r = parseInt(v, base); if (Number.isNaN(r)) this.throwEx('FormatException', `Could not find any recognizable digits.`, nd); return mk(t, r); } return this.parseInt(v, t, nd); }
        if (typeof v === 'boolean') return mk(t, v ? 1 : 0);
        if (v instanceof N) { if (v.t === 'double' || v.t === 'float' || v.t === 'decimal') { const r = bankers(num(v)); if (t === 'int' && (r > 2147483647 || r < -2147483648 || Number.isNaN(r))) this.throwEx('OverflowException', 'Value was either too large or too small for an Int32.', nd); return mk(t, r); } if (t === 'int' && typeof v.v === 'bigint' && (v.v > 2147483647n || v.v < -2147483648n)) this.throwEx('OverflowException', 'Value was either too large or too small for an Int32.', nd); return mk(t, v.v); }
        if (v instanceof EnumVal) return mk(t, v.v);
        this.throwEx('InvalidCastException', `Unable to cast object of type '${this.clrName(v)}' to type 'System.IConvertible'.`, nd);
      };
      switch (n) {
        case 'ToInt32': return toInt('int'); case 'ToInt64': return toInt('long'); case 'ToInt16': return toInt('short'); case 'ToByte': return toInt('byte');
        case 'ToDouble': case 'ToSingle': case 'ToDecimal': { const t = n === 'ToDouble' ? 'double' : n === 'ToSingle' ? 'float' : 'decimal'; if (v === null) return mk(t, 0); if (S(v)) return this.parseFloat(v, t, nd); if (typeof v === 'boolean') return mk(t, v ? 1 : 0); if (v instanceof N) { if (v.t === 'char') this.throwEx('InvalidCastException', "Invalid cast from 'Char' to 'Double'.", nd); return mk(t, num(v), false, v.t === 'decimal' ? v.s : undefined); } break; }
        case 'ToString': if (a.length === 2 && v instanceof N && A(1) instanceof N) return (typeof v.v === 'bigint' ? BigInt.asUintN(64, v.v) : (num(v) >>> 0)).toString(num(A(1))); return this.str(v);
        case 'ToBoolean': if (typeof v === 'boolean') return v; if (S(v)) { const t = v.trim().toLowerCase(); if (t === 'true') return true; if (t === 'false') return false; this.throwEx('FormatException', `String '${v}' was not recognized as a valid Boolean.`, nd); } if (v instanceof N) return num(v) !== 0; if (v === null) return false; break;
        case 'ToChar': if (v instanceof N) return mk('char', num(v)); if (S(v)) { if (v.length !== 1) this.throwEx('FormatException', 'String must be exactly one character long.', nd); return mk('char', v.charCodeAt(0)); } break;
      } break;
    }
    case 'int': case 'long': case 'short': case 'byte': case 'uint': case 'sbyte': case 'ushort': case 'ulong':
      if (n === 'Parse') { this.chk(a, 1, 1, n, nd); return this.parseInt(this.argStr(A(0), nd), tn, nd); }
      if (n === 'TryParse') { this.chk(args, 2, 2, n, nd); if (!(args[1] instanceof Ref)) this.err('CS1620', 'Argument 2 must be passed with the \'out\' keyword', nd); try { const r = this.parseInt(this.argStr(A(0), nd), tn, nd); args[1].set(r); return true; } catch (e) { if (!(e instanceof CsThrow)) throw e; args[1].set(mk(tn, 0)); return false; } }
      break;
    case 'double': case 'float': case 'decimal':
      if (n === 'Parse') { this.chk(a, 1, 2, n, nd); return this.parseFloat(this.argStr(A(0), nd), tn, nd); }
      if (n === 'TryParse') { if (!(args[args.length - 1] instanceof Ref)) this.err('CS1620', `Argument ${args.length} must be passed with the 'out' keyword`, nd); const out = args[args.length - 1]; try { const r = this.parseFloat(this.argStr(A(0), nd), tn, nd); out.set(r); return true; } catch (e) { if (!(e instanceof CsThrow)) throw e; out.set(mk(tn, 0)); return false; } }
      if (n === 'IsNaN') return Number.isNaN(num(A(0))); if (n === 'IsInfinity') return !Number.isFinite(num(A(0))) && !Number.isNaN(num(A(0)));
      if (n === 'IsPositiveInfinity') return num(A(0)) === Infinity;
      break;
    case 'bool':
      if (n === 'Parse') { const s = (A(0) || '').trim().toLowerCase(); if (s === 'true') return true; if (s === 'false') return false; this.throwEx('FormatException', `String '${A(0)}' was not recognized as a valid Boolean.`, nd); }
      if (n === 'TryParse') { const s = (A(0) || '').trim().toLowerCase(); const ok = s === 'true' || s === 'false'; args[1].set(s === 'true'); return ok; }
      break;
    case 'char': {
      let c = A(0); let s;
      if (S(c) && a.length === 2) { s = c[num(A(1))] || ''; } else if (c instanceof N) s = String.fromCharCode(c.v); else if (n !== 'Parse') this.err('CS1503', `Argument 1: cannot convert from '${this.typeOf(c)}' to 'char'`, nd);
      switch (n) {
        case 'IsDigit': return /^[0-9]$/.test(s); case 'IsLetter': return /^\p{L}$/u.test(s); case 'IsLetterOrDigit': return /^[\p{L}\p{Nd}]$/u.test(s);
        case 'IsUpper': return /^\p{Lu}$/u.test(s); case 'IsLower': return /^\p{Ll}$/u.test(s); case 'IsWhiteSpace': return /^\s$/.test(s);
        case 'IsPunctuation': return /^\p{P}$/u.test(s); case 'IsSymbol': return /^\p{S}$/u.test(s);
        case 'ToUpper': return mk('char', s.toUpperCase().charCodeAt(0)); case 'ToLower': return mk('char', s.toLowerCase().charCodeAt(0));
        case 'GetNumericValue': return mk('double', /^[0-9]$/.test(s) ? +s : -1);
        case 'Parse': if (!S(c) || c.length !== 1) this.throwEx('FormatException', 'String must be exactly one character long.', nd); return mk('char', c.charCodeAt(0));
      } break;
    }
    case 'string': switch (n) {
      case 'Join': { const sep = this.str(A(0)); let items = a.slice(1); if (items.length === 1 && (items[0] instanceof Arr || items[0] instanceof Coll)) items = this.list(items[0], nd); return items.map(x => this.str(x)).join(sep); }
      case 'Concat': { let items = a; if (items.length === 1 && (items[0] instanceof Arr || items[0] instanceof Coll)) items = this.list(items[0], nd); return items.map(x => this.str(x)).join(''); }
      case 'Format': return this.composite(this.argStr(A(0), nd), a.slice(1).length === 1 && a[1] instanceof Arr ? a[1].a : a.slice(1), nd);
      case 'IsNullOrEmpty': return A(0) === null || A(0) === '';
      case 'IsNullOrWhiteSpace': return A(0) === null || /^\s*$/.test(A(0));
      case 'Compare': { const x = A(0), y = A(1); if (a.length === 3 && A(2) === true) return I(COLL.compare(x.toLowerCase(), y.toLowerCase())); return I(this.cmp(x, y)); }
      case 'Equals': return A(0) === A(1);
      case 'Copy': return A(0);
    } break;
    case 'Array': {
      const arr = A(0);
      switch (n) {
        case 'Sort': { if (!(arr instanceof Arr)) break; if (a.length >= 2 && (A(1) instanceof Fn || A(1) instanceof MRef)) { const f = A(1); arr.a.sort((x, y) => num(this.call1(f, [x, y], nd))); return; } arr.a.sort((x, y) => this.cmp(x, y, nd)); return; }
        case 'Reverse': if (arr instanceof Arr) { arr.a.reverse(); return; } break;
        case 'IndexOf': return I(arr.a.findIndex(x => this.eq2(x, A(1))));
        case 'LastIndexOf': { for (let k = arr.a.length - 1; k >= 0; k--) if (this.eq2(arr.a[k], A(1))) return I(k); return I(-1); }
        case 'Resize': { const r = args[0]; const old = r.get(); const sz = num(A(1)); const el = old ? old.el : (r.type && r.type.el) || { n: 'object' }; const na = new Arr(el, Array.from({ length: sz }, (_, k) => old && k < old.a.length ? old.a[k] : this.defaultOf(el))); r.set(na); return; }
        case 'Copy': { const src = A(0), dst = A(1); const len = num(A(2)); if (len > src.a.length || len > dst.a.length) this.throwEx('ArgumentException', 'Source array was not long enough. Check the source index, length, and the array\'s lower bounds. (Parameter \'sourceArray\')', nd); for (let k = 0; k < len; k++) dst.a[k] = src.a[k]; return; }
        case 'Fill': arr.a.fill(A(1)); return;
        case 'Clear': for (let k = 0; k < arr.a.length; k++) arr.a[k] = this.defaultOf(arr.el); return;
        case 'Exists': return arr.a.some(x => this.call1(A(1), [x], nd));
        case 'TrueForAll': return arr.a.every(x => this.call1(A(1), [x], nd));
        case 'Find': { const r = arr.a.find(x => this.call1(A(1), [x], nd)); return r === undefined ? this.defaultOf(arr.el) : r; }
        case 'FindIndex': return I(arr.a.findIndex(x => this.call1(A(1), [x], nd)));
        case 'FindAll': return new Arr(arr.el, arr.a.filter(x => this.call1(A(1), [x], nd)));
        case 'ForEach': arr.a.forEach(x => this.call1(A(1), [x], nd)); return;
        case 'ConvertAll': { const r = arr.a.map(x => this.call1(A(1), [x], nd)); return new Arr(this.elType(r), r); }
        case 'BinarySearch': { let lo = 0, hi = arr.a.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1; const c = this.cmp(arr.a[mid], A(1)); if (c === 0) return I(mid); if (c < 0) lo = mid + 1; else hi = mid - 1; } return I(~lo); }
        case 'Empty': return new Arr(targs ? targs[0] : { n: 'object' }, []);
      } break;
    }
    case 'File': return this.fileOp(n, a, nd);
    case 'Path': if (n === 'Combine') return a.map(x => this.str(x)).join('/'); if (n === 'GetExtension') { const m = /\.[^./\\]*$/.exec(A(0)); return m ? m[0] : ''; } if (n === 'GetFileName') return A(0).split(/[\\/]/).pop(); break;
    case 'Directory': if (n === 'Exists') return true; if (n === 'CreateDirectory') return null; if (n === 'GetFiles') return new Arr({ n: 'string' }, Object.keys(this.files)); break;
    case 'Enum': {
      const E = targs ? this.enums.get(targs[0].n) : (A(0) instanceof TypeObj ? this.enums.get(A(0).ty.n) : null);
      const off = targs ? 0 : 1;
      if (!E && n !== 'GetName') this.err('CS1503', 'Argument 1: cannot convert to \'System.Type\'', nd);
      switch (n) {
        case 'GetValues': return new Arr({ n: E.name }, E.members.map(m => new EnumVal(E, m.v)));
        case 'GetNames': return new Arr({ n: 'string' }, E.members.map(m => m.name));
        case 'GetName': { const v = a[a.length - 1]; const EE = v instanceof EnumVal ? v.e : E; const m = EE.members.find(x => x.v === (v instanceof EnumVal ? v.v : num(v))); return m ? m.name : null; }
        case 'IsDefined': { const v = a[off]; if (S(v)) return E.byName.has(v); return E.members.some(m => m.v === (v instanceof EnumVal ? v.v : num(v))); }
        case 'Parse': case 'TryParse': {
          const s = a[off]; let ign = a[off + 1] === true;
          const m = E.members.find(x => ign ? x.name.toLowerCase() === String(s).trim().toLowerCase() : x.name === String(s).trim()) || (/^\s*-?\d+\s*$/.test(s) ? { v: +s } : null);
          if (n === 'TryParse') { const out = args[args.length - 1]; out.set(new EnumVal(E, m ? m.v : 0)); return !!m; }
          if (!m) this.throwEx('ArgumentException', `Requested value '${s}' was not found.`, nd);
          return new EnumVal(E, m.v);
        }
      } break;
    }
    case 'Environment': if (n === 'Exit') throw new CS.Exit(); break;
    case 'Thread': case 'Task': if (n === 'Sleep' || n === 'Delay') { if (this.opts.onSleep) this.opts.onSleep(num(A(0))); return; } break;
    case 'GC': return;
    case 'TimeSpan': { const k = { FromSeconds: 1000, FromMilliseconds: 1, FromMinutes: 60000, FromHours: 3600000, FromDays: 86400000 }[n]; if (k) return new BObj('TimeSpan', { ms: num(A(0)) * k }); break; }
    case 'Enumerable':
      if (n === 'Range') { const s = num(A(0)), c = num(A(1)); if (c > 1e6) this.throwEx('OutOfMemoryException', 'Too many elements.', nd); return this.mkList(Array.from({ length: c }, (_, k) => I(s + k)), { n: 'int' }, 'IEnumerable'); }
      if (n === 'Repeat') return this.mkList(Array.from({ length: num(A(1)) }, () => A(0)), null, 'IEnumerable');
      if (n === 'Empty') return this.mkList([], targs ? targs[0] : { n: 'object' }, 'IEnumerable');
      break;
    case 'object': case 'Object': if (n === 'ReferenceEquals') return A(0) === A(1); if (n === 'Equals') return this.eq2(A(0), A(1)); break;
    case 'DateTime': if (n === 'Parse') return new BObj('DateTime', { d: new Date(A(0)) }); break;
  }
  if (soft) return NOPE;
  if (this.classes.has(tn)) {
    const ms = this.methodsByName(this.classes.get(tn), n);
    if (ms.length) { const m = this.pick(ms, args, nd, n); if (!m.isStatic) this.err('CS0120', `An object reference is required for the non-static field, method, or property '${tn}.${n}(${m.params.map(p => tname(p.type)).join(', ')})'`, nd); if (!this.canAccess(m, fr)) this.err('CS0122', `'${tn}.${n}(${m.params.map(p => tname(p.type)).join(', ')})' is inaccessible due to its protection level`, nd); this.ensureStatic(m.cls); return this.invoke(m, null, args, nd); }
    // delegate stored in static field
    const C = this.classes.get(tn); const f = this.findField(C, n); if (f && f.isStatic) { this.ensureStatic(f.cls); return this.callDelegate(f.cls.sv[n], args, nd, n); }
  }
  if (STATIC_METHODS[tn] && STATIC_METHODS[tn].split(' ').includes(n)) this.err('CS1501', `No overload for method '${n}' takes ${a.length} arguments`, nd);
  this.err('CS0117', `'${tn}' does not contain a definition for '${n}'`, nd);
};
function promoT(a, b) { const order = ['sbyte', 'byte', 'short', 'ushort', 'char', 'int', 'uint', 'long', 'ulong', 'float', 'double', 'decimal']; if (a === 'char' && b === 'char') return 'char'; const r = order[Math.max(order.indexOf(a), order.indexOf(b))]; return ['sbyte', 'byte', 'short', 'ushort', 'char'].includes(r) ? 'int' : r; }
P.eq2 = function (a, b) {
  if (a instanceof Obj && !a.cls.native) { const ms = this.methodsByName(a.cls, 'Equals'); if (ms.length) return this.invokeVirtual(ms[0], a, [b], null); if (a.cls.isStruct) return this.valEquals(a, b); return a === b; }
  if (a instanceof N && b instanceof N) return a.t === b.t ? a.v === b.v : num(a) === num(b);
  if (a instanceof EnumVal && b instanceof EnumVal) return a.e === b.e && a.v === b.v;
  return a === b;
};

/* ---------- files (virtual, in memory) ---------- */
P.fileOp = function (n, a, nd) {
  const path = a[0];
  const need = () => { if (!(path in this.files)) this.throwEx('FileNotFoundException', `Could not find file '${path}'.`, nd); return this.files[path]; };
  const lines = v => this.list(v, nd).map(x => this.str(x));
  switch (n) {
    case 'WriteAllText': this.files[path] = this.str(a[1]); return;
    case 'AppendAllText': this.files[path] = (this.files[path] || '') + this.str(a[1]); return;
    case 'ReadAllText': return need();
    case 'ReadAllLines': { const t = need(); const l = t.replace(/\r/g, '').split('\n'); if (l.length && l[l.length - 1] === '') l.pop(); return new Arr({ n: 'string' }, l); }
    case 'WriteAllLines': this.files[path] = lines(a[1]).map(x => x + '\n').join(''); return;
    case 'AppendAllLines': this.files[path] = (this.files[path] || '') + lines(a[1]).map(x => x + '\n').join(''); return;
    case 'Exists': return path in this.files;
    case 'Delete': delete this.files[path]; return;
    case 'Copy': this.files[a[1]] = need(); return;
  }
};

/* ---------- constructors of builtin types ---------- */
P.newBuiltin = function (t, args, nd, fr) {
  const a = this.deref(args);
  const n = t.n;
  const C = this.nativeClass(n);
  if (C && (EXC[n] || n === 'object' || n === 'Object')) { const o = new Obj(C); if (C.nctor) C.nctor.call(this, o, a, nd); return o; }
  switch (n) {
    case 'List': case 'Queue': case 'Stack': case 'HashSet': case 'Dictionary': case 'SortedDictionary': case 'SortedList': case 'LinkedList': {
      if (!t.a || !t.a.length) this.err('CS0305', `Using the generic type '${n}<T>' requires 1 type arguments`, nd);
      const kind = (n === 'SortedDictionary' || n === 'SortedList') ? 'Dictionary' : n === 'LinkedList' ? 'List' : n;
      const c = new Coll(kind, t.a); if (n === 'SortedDictionary' || n === 'SortedList') c.sorted = true;
      if (a.length === 1 && !(a[0] instanceof N)) {
        if (kind === 'Dictionary') { for (const kv of this.list(a[0], nd)) this.collCall(c, 'Add', [kv.Key, kv.Value], nd, fr); }
        else for (const x of this.list(a[0], nd)) this.collCall(c, kind === 'Queue' ? 'Enqueue' : kind === 'Stack' ? 'Push' : 'Add', [x], nd, fr);
      }
      return c;
    }
    case 'KeyValuePair': return new KVP(a[0], a[1]);
    case 'Random': return new BObj('Random', { rnd: a.length ? seeded(num(a[0])) : Math.random });
    case 'StringBuilder': return new BObj('StringBuilder', { s: a.length && S(a[0]) ? a[0] : '' });
    case 'StreamWriter': { const path = a[0]; const append = a[1] === true; if (!append) this.files[path] = ''; else this.files[path] = this.files[path] || ''; const w = new BObj('StreamWriter', { path, open: true }); w.__dispose = () => { w.open = false; }; return w; }
    case 'StreamReader': { const path = a[0]; if (!(path in this.files)) this.throwEx('FileNotFoundException', `Could not find file '${path}'.`, nd); const txt = this.files[path]; const r = new BObj('StreamReader', { txt, pos: 0 }); r.__dispose = () => { }; return r; }
    case 'DateTime': { const [y, mo, d, h, mi, s] = a.map(x => num(x)); return new BObj('DateTime', { d: new Date(y, (mo || 1) - 1, d || 1, h || 0, mi || 0, s || 0) }); }
    case 'TimeSpan': { const v = a.map(x => num(x)); const ms = v.length === 3 ? ((v[0] * 60 + v[1]) * 60 + v[2]) * 1000 : v.length === 1 ? v[0] / 10000 : 0; return new BObj('TimeSpan', { ms }); }
    case 'string': if (a.length === 2 && a[0] instanceof N) return String.fromCharCode(a[0].v).repeat(Math.max(0, num(a[1]))); if (a.length === 1 && a[0] instanceof Arr) return a[0].a.map(x => String.fromCharCode(x.v)).join(''); break;
    case 'Tuple': return new CS.Tup(a);
    case 'EventArgs': return new BObj('EventArgs', {});
  }
  if (this.host && this.host.newObj) { const r = this.host.newObj(t, a, nd, this); if (r !== undefined) return r; }
  this.err('CS0143', `The type '${tname(t)}' has no constructors defined`, nd);
};
function seeded(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

/* ---------- instance members ---------- */
P.getBuiltinMember = function (o, n, nd, fr) {
  if (S(o)) { if (n === 'Length') return I(o.length); }
  else if (o instanceof Arr) { if (n === 'Length') return I(o.a.length); if (n === 'Rank') return I(o.dims.length); if (n === 'LongLength') return mk('long', o.a.length); }
  else if (o instanceof Coll) {
    if (n === 'Count') return I(o.kind === 'Dictionary' || o.kind === 'HashSet' ? o.m.size : o.a.length);
    if (o.kind === 'Dictionary' && n === 'Keys') return this.mkList(this.dictEntries(o).map(e => e[0]), o.ta[0], 'KeyCollection');
    if (o.kind === 'Dictionary' && n === 'Values') return this.mkList(this.dictEntries(o).map(e => e[1]), o.ta[1], 'ValueCollection');
    if (n === 'Capacity') return I(Math.max(4, o.a.length));
    if (o.kind === 'List' && (n === 'First' || n === 'Last')) return o.a.length ? o.a[n === 'First' ? 0 : o.a.length - 1] : null;
  }
  else if (o instanceof KVP) { if (n === 'Key') return o.Key; if (n === 'Value') return o.Value; }
  else if (o instanceof CS.Tup) { const m = /^Item(\d+)$/.exec(n); if (m) return o.items[+m[1] - 1]; }
  else if (o instanceof TypeObj) { if (n === 'Name') return o.ty.n === '[]' ? tname(o.ty.el).replace(/^./, c => c) + '[]' : (CLR[o.ty.n] || o.ty.n); if (n === 'FullName') return (CLR[o.ty.n] ? 'System.' + CLR[o.ty.n] : (o.cls && o.cls.ns ? o.cls.ns + '.' : '') + o.ty.n); if (n === 'BaseType') { const C = this.classes.get(o.ty.n); return C && C.base ? new TypeObj({ n: C.base.name }, C.base) : new TypeObj({ n: 'Object' }, null); } }
  else if (o instanceof BObj) {
    switch (o.kind) {
      case 'StringBuilder': if (n === 'Length') return I(o.s.length); break;
      case 'StreamReader': if (n === 'EndOfStream') return o.pos >= o.txt.length; break;
      case 'DateTime': { const d = o.d; const m = { Year: d.getFullYear(), Month: d.getMonth() + 1, Day: d.getDate(), Hour: d.getHours(), Minute: d.getMinutes(), Second: d.getSeconds(), Millisecond: d.getMilliseconds(), DayOfYear: Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5) }; if (n in m) return I(m[n]); if (n === 'DayOfWeek') return new EnumVal(BENUMS.DayOfWeek, d.getDay()); if (n === 'Date') { const x = new Date(d); x.setHours(0, 0, 0, 0); return new BObj('DateTime', { d: x }); } if (n === 'Ticks') return mk('long', BigInt(d.getTime()) * 10000n + 621355968000000000n); break; }
      case 'TimeSpan': { const ms = o.ms; const m = { TotalMilliseconds: ms, TotalSeconds: ms / 1000, TotalMinutes: ms / 60000, TotalHours: ms / 3600000, TotalDays: ms / 864e5 }; if (n in m) return mk('double', m[n]); const k = { Milliseconds: Math.trunc(ms % 1000), Seconds: Math.trunc(ms / 1000) % 60, Minutes: Math.trunc(ms / 60000) % 60, Hours: Math.trunc(ms / 3600000) % 24, Days: Math.trunc(ms / 864e5) }; if (n in k) return I(k[n]); break; }
      case 'ConsoleKeyInfo': if (n === 'KeyChar') return mk('char', o.ch); if (n === 'Key') return new EnumVal(BENUMS.ConsoleKey, 13); break;
      case 'Random': break;
    }
  }
  else if (o && o.__host) { const v = o.__get(n, nd); if (v !== undefined) return v; this.err('CS1061', `'${o.__type}' does not contain a definition for '${n}' and no accessible extension method '${n}' accepting a first argument of type '${o.__type}' could be found (are you missing a using directive or an assembly reference?)`, nd); }
  else if (o instanceof Obj && o.cls.hostBase) { const v = this.hostMember(o, n); if (v !== undefined) return v; }
  // method group?
  const tn = this.typeOf(o);
  if (this.hasInstMethod(o, n)) return (args, nd2) => this.callBuiltinInst(o, n, args, nd2 || nd, fr);
  this.err('CS1061', `'${tn}' does not contain a definition for '${n}' and no accessible extension method '${n}' accepting a first argument of type '${tn}' could be found (are you missing a using directive or an assembly reference?)`, nd);
};
P.hasInstMethod = function (o, n) { return ['ToString', 'Equals', 'GetType', 'GetHashCode', 'CompareTo', 'Add', 'Contains', 'Invoke', 'ToUpper', 'ToLower'].includes(n); };
P.dictEntries = function (o) { const e = [...o.m.values()]; if (o.sorted) e.sort((x, y) => this.cmp(x[0], y[0])); return e; };
P.builtinRef = function (o, n, nd, fr) {
  if (o instanceof BObj && o.kind === 'StringBuilder' && n === 'Length') return new Ref(() => I(o.s.length), v => { o.s = o.s.slice(0, num(v)).padEnd(num(v), '\0'); }, { n: 'int' });
  if (o && o.__host && o.__ref) { const r = o.__ref(n, nd); if (r) return r; }
  const tn = this.typeOf(o);
  if ((S(o) && n === 'Length') || (o instanceof Arr && n === 'Length') || (o instanceof Coll && n === 'Count') || (o instanceof KVP)) this.err('CS0200', `Property or indexer '${tn}.${n}' cannot be assigned to -- it is read only`, nd);
  this.err('CS1061', `'${tn}' does not contain a definition for '${n}' and no accessible extension method '${n}' accepting a first argument of type '${tn}' could be found (are you missing a using directive or an assembly reference?)`, nd);
};
P.collIndexRef = function (o, ix, nd) {
  const k0 = ix[0];
  if (o.kind === 'Dictionary') {
    const key = this.argConv(k0, o.ta[0], 1, nd); const k = this.key(key, nd);
    return new Ref(() => { if (!o.m.has(k)) this.throwEx('KeyNotFoundException', `The given key '${this.str(key)}' was not present in the dictionary.`, nd); return o.m.get(k)[1]; },
      v => { o.m.set(k, [key, this.argConv(v, o.ta[1], 1, nd)]); o.ver++; }, o.ta[1]);
  }
  if (o.kind === 'List' || o.kind === 'IEnumerable' || o.kind === 'KeyCollection' || o.kind === 'ValueCollection') {
    let i = this.idxNum(k0, nd); if (i && i.fromEnd !== undefined) i = o.a.length - i.fromEnd;
    const bad = () => this.throwEx('ArgumentOutOfRangeException', "Index was out of range. Must be non-negative and less than the size of the collection. (Parameter 'index')", nd);
    return new Ref(() => { if (i < 0 || i >= o.a.length) bad(); return o.a[i]; }, v => { if (o.kind !== 'List') this.err('CS0200', 'Property or indexer cannot be assigned to -- it is read only', nd); if (i < 0 || i >= o.a.length) bad(); o.a[i] = this.argConv(v, o.ta[0], 1, nd); o.ver++; }, o.ta[0]);
  }
  this.err('CS0021', `Cannot apply indexing with [] to an expression of type '${this.typeOf(o)}'`, nd);
};

P.callBuiltinInst = function (o, n, args, nd, fr) {
  const a = this.deref(args);
  const A = k => a[k];
  // universal object methods
  if (n === 'GetType' && !a.length) { if (o instanceof Obj) return new TypeObj({ n: o.cls.name }, o.cls); return new TypeObj(this.typeDesc(o), null); }
  if (o && o.__host) return o.__call(n, a, nd, args);
  if (o instanceof Obj && o.cls.hostBase) { const r = this.hostCall(o, n, a, nd); if (r !== NOPE) return r; }
  if (S(o)) return this.strCall(o, n, a, nd, args);
  if (o instanceof N) {
    switch (n) {
      case 'ToString': if (a.length && S(A(0))) return o.t === 'char' ? String.fromCharCode(o.v) : this.str(o, A(0), nd); return this.str(o);
      case 'CompareTo': return I(this.cmp(o, A(0)));
      case 'Equals': return this.eq2(o, A(0));
      case 'GetHashCode': return I(num(o) | 0);
    }
  }
  if (typeof o === 'boolean') { if (n === 'ToString') return o ? 'True' : 'False'; if (n === 'Equals') return o === A(0); if (n === 'CompareTo') return I(this.cmp(o, A(0))); }
  if (o instanceof EnumVal) { if (n === 'ToString') return a.length && A(0) === 'D' ? String(o.v) : this.str(o); if (n === 'HasFlag') return (o.v & A(0).v) === A(0).v; if (n === 'Equals') return this.eq2(o, A(0)); if (n === 'CompareTo') return I(o.v - A(0).v); if (n === 'GetHashCode') return I(o.v); }
  if (o instanceof Fn || o instanceof MRef || o instanceof Multi) { if (n === 'Invoke') return this.callDelegate(o, args, nd); }
  if (o instanceof BObj) { const r = this.bobjCall(o, n, a, nd, args); if (r !== NOPE) return r; }
  if (o instanceof Coll) { const r = this.collCall(o, n, args, nd, fr); if (r !== NOPE) return r; }
  if (o instanceof Arr) {
    switch (n) {
      case 'GetLength': { const d = num(A(0)); if (d < 0 || d >= o.dims.length) this.throwEx('IndexOutOfRangeException', 'Index was outside the bounds of the array.', nd); return I(o.dims[d]); }
      case 'GetUpperBound': return I(o.dims[num(A(0))] - 1); case 'GetLowerBound': return I(0);
      case 'Clone': return new Arr(o.el, o.a.slice(), o.dims.slice());
      case 'CopyTo': { const dst = A(0), off = num(A(1)); o.a.forEach((x, k) => { dst.a[off + k] = x; }); return; }
      case 'SetValue': o.a[num(A(1))] = A(0); return; case 'GetValue': return o.a[num(A(0))];
    }
  }
  if (o instanceof KVP && n === 'ToString') return this.str(o);
  if (o instanceof Obj && n === 'MemberwiseClone') { const c = new Obj(o.cls); Object.assign(c.f, o.f); return c; }
  if (o instanceof TypeObj && n === 'ToString') return this.getBuiltinMember(o, 'FullName', nd);
  // LINQ on any enumerable
  if (o instanceof Arr || o instanceof Coll || S(o)) { const r = this.linq(o, n, args, nd, fr); if (r !== NOPE) return r; }
  // object fallbacks
  if (n === 'ToString' && !a.length) return this.str(o);
  if (n === 'Equals' && a.length === 1) return o instanceof Obj && o.cls.isStruct ? this.valEquals(o, A(0)) : o === A(0);
  if (n === 'GetHashCode') return I(o && o.id ? o.id : 0);
  const tn = this.typeOf(o);
  this.err('CS1061', `'${tn}' does not contain a definition for '${n}' and no accessible extension method '${n}' accepting a first argument of type '${tn}' could be found (are you missing a using directive or an assembly reference?)`, nd);
};

/* ---------- string methods ---------- */
P.strCall = function (s, n, a, nd, raw) {
  const A = k => a[k];
  const chOrStr = v => (v instanceof N && v.t === 'char') ? String.fromCharCode(v.v) : v;
  const ign = () => a.some(x => x instanceof EnumVal && /IgnoreCase/.test(this.str(x))) || a[1] === true;
  switch (n) {
    case 'ToUpper': case 'ToUpperInvariant': return s.toUpperCase();
    case 'ToLower': case 'ToLowerInvariant': return s.toLowerCase();
    case 'Trim': case 'TrimStart': case 'TrimEnd': {
      const chars = a.length ? a.flatMap(x => x instanceof Arr ? x.a.map(c => String.fromCharCode(c.v)) : [chOrStr(x)]) : null;
      const isT = c => chars ? chars.includes(c) : /\s/.test(c);
      let i = 0, j = s.length; if (n !== 'TrimEnd') while (i < j && isT(s[i])) i++; if (n !== 'TrimStart') while (j > i && isT(s[j - 1])) j--; return s.slice(i, j);
    }
    case 'Substring': {
      const st = this.argInt(A(0), nd);
      if (st < 0 || st > s.length) this.throwEx('ArgumentOutOfRangeException', st < 0 ? "StartIndex cannot be less than zero. (Parameter 'startIndex')" : "startIndex cannot be larger than length of string. (Parameter 'startIndex')", nd);
      if (a.length > 1) { const len = this.argInt(A(1), nd, 2); if (len < 0 || st + len > s.length) this.throwEx('ArgumentOutOfRangeException', len < 0 ? "Length cannot be less than zero. (Parameter 'length')" : "Index and length must refer to a location within the string. (Parameter 'length')", nd); return s.substr(st, len); }
      return s.slice(st);
    }
    case 'IndexOf': { const x = chOrStr(A(0)); if (x === null) this.throwEx('ArgumentNullException', "Value cannot be null. (Parameter 'value')", nd); const st = a.length > 1 && A(1) instanceof N ? num(A(1)) : 0; if (ign()) return I(s.toLowerCase().indexOf(x.toLowerCase(), st)); return I(s.indexOf(x, st)); }
    case 'LastIndexOf': return I(s.lastIndexOf(chOrStr(A(0))));
    case 'IndexOfAny': { const cs = A(0).a.map(c => String.fromCharCode(c.v)); for (let k = 0; k < s.length; k++) if (cs.includes(s[k])) return I(k); return I(-1); }
    case 'Contains': { const x = chOrStr(A(0)); if (x === null) this.throwEx('ArgumentNullException', "Value cannot be null. (Parameter 'value')", nd); if (!S(x)) this.err('CS1503', `Argument 1: cannot convert from '${this.typeOf(A(0))}' to 'string'`, nd); return ign() ? s.toLowerCase().includes(x.toLowerCase()) : s.includes(x); }
    case 'StartsWith': { const x = chOrStr(A(0)); return ign() ? s.toLowerCase().startsWith(x.toLowerCase()) : s.startsWith(x); }
    case 'EndsWith': { const x = chOrStr(A(0)); return ign() ? s.toLowerCase().endsWith(x.toLowerCase()) : s.endsWith(x); }
    case 'Replace': { const x = chOrStr(A(0)), y = chOrStr(A(1)); if (x === '') this.throwEx('ArgumentException', "String cannot be of zero length. (Parameter 'oldValue')", nd); return s.split(x).join(y === null ? '' : y); }
    case 'Split': {
      let seps = [], opt = 0, count = Infinity;
      for (const x of a) { if (x instanceof EnumVal) opt = x.v; else if (x instanceof Arr) seps.push(...x.a.map(v => (v instanceof N ? String.fromCharCode(v.v) : v))); else if (x instanceof N && x.t === 'char') seps.push(String.fromCharCode(x.v)); else if (x instanceof N) count = num(x); else if (S(x)) seps.push(x); }
      let parts;
      if (!seps.length || seps.every(x => x === '')) parts = s.split(/\s/); else { parts = [s]; for (const sp of seps) parts = parts.flatMap(p => p.split(sp)); }
      if (count < parts.length) { /* rough */ }
      if (opt & 2) parts = parts.map(p => p.trim());
      if (opt & 1) parts = parts.filter(p => p !== '');
      return new Arr({ n: 'string' }, parts);
    }
    case 'PadLeft': case 'PadRight': { const w = this.argInt(A(0), nd); const c = a.length > 1 ? chOrStr(A(1)) : ' '; return n === 'PadLeft' ? s.padStart(w, c) : s.padEnd(w, c); }
    case 'Insert': { const i = num(A(0)); if (i < 0 || i > s.length) this.throwEx('ArgumentOutOfRangeException', "Specified argument was out of the range of valid values. (Parameter 'startIndex')", nd); return s.slice(0, i) + this.str(A(1)) + s.slice(i); }
    case 'Remove': { const i = num(A(0)); if (i < 0 || i > s.length) this.throwEx('ArgumentOutOfRangeException', "startIndex must be less than length of string. (Parameter 'startIndex')", nd); return a.length > 1 ? s.slice(0, i) + s.slice(i + num(A(1))) : s.slice(0, i); }
    case 'ToCharArray': return new Arr({ n: 'char' }, [...s].map(c => mk('char', c.charCodeAt(0))));
    case 'Equals': return ign() && S(A(0)) ? s.toLowerCase() === A(0).toLowerCase() : s === A(0);
    case 'CompareTo': return I(this.cmp(s, A(0)));
    case 'ToString': return s;
    case 'GetHashCode': { let h = 0; for (const c of s) h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0; return I(h); }
    case 'Normalize': return s.normalize();
    case 'Clone': return s;
  }
  const r = this.linq(s, n, raw, nd); if (r !== NOPE) return r;
  this.err('CS1061', `'string' does not contain a definition for '${n}' and no accessible extension method '${n}' accepting a first argument of type 'string' could be found (are you missing a using directive or an assembly reference?)`, nd);
};

/* ---------- builtin objects ---------- */
P.bobjCall = function (o, n, a, nd, raw) {
  const A = k => a[k];
  switch (o.kind) {
    case 'Random': {
      const r = o.rnd;
      if (n === 'Next') { if (!a.length) return I(Math.floor(r() * 2147483647)); if (a.length === 1) { const mx = num(A(0)); if (mx < 0) this.throwEx('ArgumentOutOfRangeException', "'maxValue' must be greater than or equal to 0. (Parameter 'maxValue')", nd); return I(Math.floor(r() * mx)); } const lo = num(A(0)), hi = num(A(1)); if (lo > hi) this.throwEx('ArgumentOutOfRangeException', "'minValue' cannot be greater than maxValue. (Parameter 'minValue')", nd); return I(lo + Math.floor(r() * (hi - lo))); }
      if (n === 'NextDouble') return mk('double', r());
      if (n === 'NextInt64') return mk('long', BigInt(Math.floor(r() * 2 ** 52)));
      if (n === 'Shuffle') { const arr = A(0); for (let k = arr.a.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [arr.a[k], arr.a[j]] = [arr.a[j], arr.a[k]]; } return; }
      break;
    }
    case 'StringBuilder':
      switch (n) {
        case 'Append': o.s += a.length === 2 && A(0) instanceof N && A(0).t === 'char' ? String.fromCharCode(A(0).v).repeat(num(A(1))) : this.str(A(0)); return o;
        case 'AppendLine': o.s += (a.length ? this.str(A(0)) : '') + '\n'; return o;
        case 'AppendFormat': o.s += this.composite(A(0), a.slice(1), nd); return o;
        case 'Insert': o.s = o.s.slice(0, num(A(0))) + this.str(A(1)) + o.s.slice(num(A(0))); return o;
        case 'Remove': o.s = o.s.slice(0, num(A(0))) + o.s.slice(num(A(0)) + num(A(1))); return o;
        case 'Replace': { const x = A(0) instanceof N ? String.fromCharCode(A(0).v) : A(0); const y = A(1) instanceof N ? String.fromCharCode(A(1).v) : A(1); o.s = o.s.split(x).join(y); return o; }
        case 'Clear': o.s = ''; return o;
        case 'ToString': return o.s;
      } break;
    case 'StreamWriter':
      if (!o.open && (n === 'Write' || n === 'WriteLine')) this.throwEx('ObjectDisposedException', 'Cannot write to a closed TextWriter.', nd);
      if (n === 'Write') { this.files[o.path] += this.writeArgs(raw, nd); return; }
      if (n === 'WriteLine') { this.files[o.path] += this.writeArgs(raw, nd) + '\n'; return; }
      if (n === 'Close' || n === 'Dispose') { o.open = false; return; } if (n === 'Flush') return;
      break;
    case 'StreamReader':
      if (n === 'ReadLine') { if (o.pos >= o.txt.length) return null; let j = o.txt.indexOf('\n', o.pos); if (j < 0) j = o.txt.length; const l = o.txt.slice(o.pos, j).replace(/\r$/, ''); o.pos = j + 1; return l; }
      if (n === 'ReadToEnd') { const r = o.txt.slice(o.pos); o.pos = o.txt.length; return r; }
      if (n === 'Peek') return I(o.pos < o.txt.length ? o.txt.charCodeAt(o.pos) : -1);
      if (n === 'Read') return I(o.pos < o.txt.length ? o.txt.charCodeAt(o.pos++) : -1);
      if (n === 'Close' || n === 'Dispose') return;
      break;
    case 'DateTime': {
      const d = o.d; const p2 = x => String(x).padStart(2, '0');
      if (n === 'ToString' || n === 'ToShortDateString' || n === 'ToLongTimeString' || n === 'ToShortTimeString') {
        let f = A(0) || (n === 'ToShortDateString' ? 'MM/dd/yyyy' : n === 'ToShortTimeString' ? 'HH:mm' : n === 'ToLongTimeString' ? 'HH:mm:ss' : 'MM/dd/yyyy HH:mm:ss');
        if (f === 'd') f = 'MM/dd/yyyy'; if (f === 't') f = 'HH:mm'; if (f === 'T') f = 'HH:mm:ss';
        return f.replace(/yyyy|MM|dd|HH|mm|ss|yy|M|d|H|m|s|dddd|MMMM/g, t => ({ yyyy: d.getFullYear(), yy: String(d.getFullYear()).slice(2), MM: p2(d.getMonth() + 1), M: d.getMonth() + 1, dd: p2(d.getDate()), d: d.getDate(), HH: p2(d.getHours()), H: d.getHours(), mm: p2(d.getMinutes()), m: d.getMinutes(), ss: p2(d.getSeconds()), s: d.getSeconds() }[t]));
      }
      const add = { AddDays: 864e5, AddHours: 36e5, AddMinutes: 6e4, AddSeconds: 1e3, AddMilliseconds: 1 }[n];
      if (add) return new BObj('DateTime', { d: new Date(d.getTime() + num(A(0)) * add) });
      if (n === 'AddMonths') { const x = new Date(d); x.setMonth(x.getMonth() + num(A(0))); return new BObj('DateTime', { d: x }); }
      if (n === 'AddYears') { const x = new Date(d); x.setFullYear(x.getFullYear() + num(A(0))); return new BObj('DateTime', { d: x }); }
      if (n === 'Subtract') return new BObj('TimeSpan', { ms: d - A(0).d });
      break;
    }
    case 'TimeSpan': if (n === 'ToString') { const ms = o.ms; const p2 = x => String(Math.trunc(x)).padStart(2, '0'); return `${p2(ms / 3600000)}:${p2(ms / 60000 % 60)}:${p2(ms / 1000 % 60)}`; } break;
  }
  return NOPE;
};

/* ---------- collections ---------- */
P.collCall = function (o, n, args, nd, fr) {
  const a = this.deref(args);
  const A = k => a[k];
  const T0 = o.ta[0], T1 = o.ta[1];
  const bump = () => { o.ver++; };
  if (o.kind === 'List') switch (n) {
    case 'Add': this.chk(a, 1, 1, n, nd); o.a.push(this.argConv(A(0), T0, 1, nd)); bump(); return;
    case 'AddRange': for (const x of this.list(A(0), nd)) o.a.push(this.argConv(x, T0, 1, nd)); bump(); return;
    case 'Insert': { const i = num(A(0)); if (i < 0 || i > o.a.length) this.throwEx('ArgumentOutOfRangeException', "Index must be within the bounds of the List. (Parameter 'index')", nd); o.a.splice(i, 0, this.argConv(A(1), T0, 2, nd)); bump(); return; }
    case 'Remove': { const i = o.a.findIndex(x => this.eq2(x, A(0))); if (i < 0) return false; o.a.splice(i, 1); bump(); return true; }
    case 'RemoveAt': { const i = num(A(0)); if (i < 0 || i >= o.a.length) this.throwEx('ArgumentOutOfRangeException', "Index was out of range. Must be non-negative and less than the size of the collection. (Parameter 'index')", nd); o.a.splice(i, 1); bump(); return; }
    case 'RemoveAll': { const before = o.a.length; o.a = o.a.filter(x => !this.call1(A(0), [x], nd)); bump(); return I(before - o.a.length); }
    case 'RemoveRange': o.a.splice(num(A(0)), num(A(1))); bump(); return;
    case 'Clear': o.a = []; bump(); return;
    case 'Contains': return o.a.some(x => this.eq2(x, A(0)));
    case 'IndexOf': return I(o.a.findIndex(x => this.eq2(x, A(0))));
    case 'LastIndexOf': { for (let k = o.a.length - 1; k >= 0; k--) if (this.eq2(o.a[k], A(0))) return I(k); return I(-1); }
    case 'Sort': if (a.length && (A(0) instanceof Fn || A(0) instanceof MRef)) { const f = A(0); o.a.sort((x, y) => num(this.call1(f, [x, y], nd))); } else o.a.sort((x, y) => this.cmp(x, y, nd)); bump(); return;
    case 'Reverse': o.a.reverse(); bump(); return;
    case 'ToArray': return new Arr(T0, o.a.slice());
    case 'Find': { const r = o.a.find(x => this.call1(A(0), [x], nd)); return r === undefined ? this.defaultOf(T0) : r; }
    case 'FindIndex': return I(o.a.findIndex(x => this.call1(A(0), [x], nd)));
    case 'FindLast': { const r = [...o.a].reverse().find(x => this.call1(A(0), [x], nd)); return r === undefined ? this.defaultOf(T0) : r; }
    case 'FindAll': return this.mkList(o.a.filter(x => this.call1(A(0), [x], nd)), T0);
    case 'Exists': return o.a.some(x => this.call1(A(0), [x], nd));
    case 'TrueForAll': return o.a.every(x => this.call1(A(0), [x], nd));
    case 'ForEach': { const ver = o.ver; for (const x of o.a.slice()) { this.call1(A(0), [x], nd); if (o.ver !== ver) this.throwEx('InvalidOperationException', 'Collection was modified; enumeration operation may not execute.', nd); } return; }
    case 'GetRange': return this.mkList(o.a.slice(num(A(0)), num(A(0)) + num(A(1))), T0);
    case 'ConvertAll': { const r = o.a.map(x => this.call1(A(0), [x], nd)); return this.mkList(r); }
    case 'BinarySearch': { let lo = 0, hi = o.a.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1; const c = this.cmp(o.a[mid], A(0)); if (c === 0) return I(mid); if (c < 0) lo = mid + 1; else hi = mid - 1; } return I(~lo); }
    case 'AddFirst': case 'AddLast': o.a[n === 'AddFirst' ? 'unshift' : 'push'](A(0)); bump(); return;
    case 'RemoveFirst': o.a.shift(); bump(); return; case 'RemoveLast': o.a.pop(); bump(); return;
  }
  if (o.kind === 'Dictionary') switch (n) {
    case 'Add': { this.chk(a, 2, 2, n, nd); const k = this.argConv(A(0), T0, 1, nd); const key = this.key(k, nd); if (o.m.has(key)) this.throwEx('ArgumentException', `An item with the same key has already been added. Key: ${this.str(k)}`, nd); o.m.set(key, [k, this.argConv(A(1), T1, 2, nd)]); bump(); return; }
    case 'TryAdd': { const k = A(0); const key = this.key(k, nd); if (o.m.has(key)) return false; o.m.set(key, [k, this.argConv(A(1), T1, 2, nd)]); bump(); return true; }
    case 'ContainsKey': return o.m.has(this.key(A(0), nd));
    case 'ContainsValue': return [...o.m.values()].some(e => this.eq2(e[1], A(0)));
    case 'Remove': { const k = this.key(A(0), nd); const had = o.m.delete(k); if (had) bump(); return had; }
    case 'Clear': o.m.clear(); bump(); return;
    case 'TryGetValue': { if (!(args[1] instanceof Ref)) this.err('CS1620', 'Argument 2 must be passed with the \'out\' keyword', nd); const e = o.m.get(this.key(A(0), nd)); args[1].set(e ? e[1] : this.defaultOf(T1)); return !!e; }
    case 'GetValueOrDefault': { const e = o.m.get(this.key(A(0), nd)); return e ? e[1] : (a.length > 1 ? A(1) : this.defaultOf(T1)); }
  }
  if (o.kind === 'HashSet') switch (n) {
    case 'Add': { const v = this.argConv(A(0), T0, 1, nd); const k = this.key(v, nd); if (o.m.has(k)) return false; o.m.set(k, v); bump(); return true; }
    case 'Contains': return o.m.has(this.key(A(0), nd));
    case 'Remove': { const had = o.m.delete(this.key(A(0), nd)); if (had) bump(); return had; }
    case 'Clear': o.m.clear(); bump(); return;
    case 'UnionWith': for (const x of this.list(A(0), nd)) o.m.set(this.key(x, nd), x); bump(); return;
    case 'IntersectWith': { const keep = new Set(this.list(A(0), nd).map(x => this.key(x, nd))); for (const k of [...o.m.keys()]) if (!keep.has(k)) o.m.delete(k); bump(); return; }
    case 'ExceptWith': for (const x of this.list(A(0), nd)) o.m.delete(this.key(x, nd)); bump(); return;
    case 'IsSubsetOf': { const other = new Set(this.list(A(0), nd).map(x => this.key(x, nd))); return [...o.m.keys()].every(k => other.has(k)); }
    case 'Overlaps': return this.list(A(0), nd).some(x => o.m.has(this.key(x, nd)));
  }
  if (o.kind === 'Queue') switch (n) {
    case 'Enqueue': o.a.push(this.argConv(A(0), T0, 1, nd)); bump(); return;
    case 'Dequeue': if (!o.a.length) this.throwEx('InvalidOperationException', 'Queue empty.', nd); bump(); return o.a.shift();
    case 'Peek': if (!o.a.length) this.throwEx('InvalidOperationException', 'Queue empty.', nd); return o.a[0];
    case 'TryDequeue': if (!o.a.length) { args[0].set(this.defaultOf(T0)); return false; } args[0].set(o.a.shift()); bump(); return true;
    case 'Contains': return o.a.some(x => this.eq2(x, A(0)));
    case 'Clear': o.a = []; bump(); return;
    case 'ToArray': return new Arr(T0, o.a.slice());
  }
  if (o.kind === 'Stack') switch (n) {
    case 'Push': o.a.push(this.argConv(A(0), T0, 1, nd)); bump(); return;
    case 'Pop': if (!o.a.length) this.throwEx('InvalidOperationException', 'Stack empty.', nd); bump(); return o.a.pop();
    case 'Peek': if (!o.a.length) this.throwEx('InvalidOperationException', 'Stack empty.', nd); return o.a[o.a.length - 1];
    case 'TryPop': if (!o.a.length) { args[0].set(this.defaultOf(T0)); return false; } args[0].set(o.a.pop()); bump(); return true;
    case 'Contains': return o.a.some(x => this.eq2(x, A(0)));
    case 'Clear': o.a = []; bump(); return;
    case 'ToArray': return new Arr(T0, o.a.slice().reverse());
  }
  return this.linq(o, n, args, nd, fr);
};

/* ---------- LINQ ---------- */
P.linq = function (src, n, args, nd, fr) {
  const a = this.deref(args);
  const f = a[0];
  const items = () => this.list(src, nd);
  const res = (arr, el) => this.mkList(arr, el, 'IEnumerable');
  const call = (fn, x, k) => this.call1(fn, fn instanceof Fn && fn.params.length === 2 ? [x, I(k)] : [x], nd);
  const empty = () => this.throwEx('InvalidOperationException', 'Sequence contains no elements', nd);
  const sel = (x, k) => (f ? call(f, x, k) : x);
  const numVals = () => { const it = items(); const v = it.map((x, k) => sel(x, k)); return v; };
  switch (n) {
    case 'Where': return res(items().filter((x, k) => call(f, x, k)));
    case 'Select': { const r = items().map((x, k) => call(f, x, k)); return res(r); }
    case 'SelectMany': return res(items().flatMap(x => this.list(call(f, x), nd)));
    case 'OrderBy': case 'OrderByDescending': { const it = items().map((x, k) => [x, f ? call(f, x) : x, k]); it.sort((p, q) => { const c = this.cmp(p[1], q[1], nd); return (n === 'OrderBy' ? c : -c) || p[2] - q[2]; }); const r = res(it.map(p => p[0])); r.keys = [[f, n === 'OrderBy' ? 1 : -1]]; return r; }
    case 'ThenBy': case 'ThenByDescending': { const keys = (src.keys || []).concat([[f, n === 'ThenBy' ? 1 : -1]]); const it = items().map((x, k) => [x, k]); it.sort((p, q) => { for (const [kf, d] of keys) { const c = this.cmp(this.call1(kf, [p[0]], nd), this.call1(kf, [q[0]], nd), nd); if (c) return c * d; } return p[1] - q[1]; }); const r = res(it.map(p => p[0])); r.keys = keys; return r; }
    case 'Order': return res(items().sort((x, y) => this.cmp(x, y, nd)));
    case 'OrderDescending': return res(items().sort((x, y) => this.cmp(y, x, nd)));
    case 'First': case 'FirstOrDefault': case 'Last': case 'LastOrDefault': case 'Single': case 'SingleOrDefault': {
      let it = items(); if (f && (f instanceof Fn || f instanceof MRef)) it = it.filter(x => this.call1(f, [x], nd));
      if (!it.length) { if (n.endsWith('OrDefault')) return src instanceof Arr ? this.defaultOf(src.el) : src instanceof Coll ? this.defaultOf(src.ta[0]) : null; this.throwEx('InvalidOperationException', f ? 'Sequence contains no matching element' : 'Sequence contains no elements', nd); }
      if (n.startsWith('Single') && it.length > 1) this.throwEx('InvalidOperationException', 'Sequence contains more than one element', nd);
      return n.startsWith('Last') ? it[it.length - 1] : it[0];
    }
    case 'ElementAt': { const it = items(); const k = num(f); if (k < 0 || k >= it.length) this.throwEx('ArgumentOutOfRangeException', "Index was out of range. Must be non-negative and less than the size of the collection. (Parameter 'index')", nd); return it[k]; }
    case 'Any': return f ? items().some(x => this.call1(f, [x], nd)) : items().length > 0;
    case 'All': return items().every(x => this.call1(f, [x], nd));
    case 'Count': case 'LongCount': { const c = f ? items().filter(x => this.call1(f, [x], nd)).length : items().length; return n === 'Count' ? I(c) : mk('long', c); }
    case 'Contains': if (src instanceof Arr || src instanceof Coll || S(src)) return items().some(x => this.eq2(x, (S(src) && S(f)) ? mk('char', f.charCodeAt(0)) : f)); break;
    case 'Sum': { const v = numVals(); if (!v.length) return I(0); let acc = v[0]; for (let k = 1; k < v.length; k++) { acc = this.binop('+', acc, v[k], nd); if (acc.t === 'int' && false) { } } if (acc instanceof N && acc.t === 'char') acc = I(acc.v); return acc; }
    case 'Average': { const v = numVals(); if (!v.length) empty(); const t = v[0].t === 'decimal' ? 'decimal' : v[0].t === 'float' ? 'float' : 'double'; return mk(t, v.reduce((s, x) => s + num(x), 0) / v.length); }
    case 'Max': case 'Min': { const v = numVals(); if (!v.length) { if (src instanceof Coll && src.ta[0] && !CS.NUMS.has(src.ta[0].n)) return null; empty(); } return v.reduce((m, x) => { const c = this.cmp(x, m, nd); return (n === 'Max' ? c > 0 : c < 0) ? x : m; }); }
    case 'MaxBy': case 'MinBy': { const it = items(); if (!it.length) return null; return it.reduce((m, x) => { const c = this.cmp(this.call1(f, [x], nd), this.call1(f, [m], nd), nd); return (n === 'MaxBy' ? c > 0 : c < 0) ? x : m; }); }
    case 'Aggregate': { const it = items(); if (a.length === 2) return it.reduce((acc, x) => this.call1(a[1], [acc, x], nd), a[0]); if (!it.length) empty(); return it.slice(1).reduce((acc, x) => this.call1(f, [acc, x], nd), it[0]); }
    case 'Distinct': { const seen = new Set(); return res(items().filter(x => { const k = this.key(x, nd); if (seen.has(k)) return false; seen.add(k); return true; })); }
    case 'DistinctBy': { const seen = new Set(); return res(items().filter(x => { const k = this.key(this.call1(f, [x], nd), nd); if (seen.has(k)) return false; seen.add(k); return true; })); }
    case 'Take': return res(items().slice(0, Math.max(0, num(f))));
    case 'Skip': return res(items().slice(Math.max(0, num(f))));
    case 'TakeLast': return res(items().slice(-num(f)));
    case 'TakeWhile': { const out = []; for (const x of items()) { if (!this.call1(f, [x], nd)) break; out.push(x); } return res(out); }
    case 'SkipWhile': { const it = items(); let k = 0; while (k < it.length && this.call1(f, [it[k]], nd)) k++; return res(it.slice(k)); }
    case 'Reverse': return res(items().reverse());
    case 'Concat': return res(items().concat(this.list(f, nd)));
    case 'Union': { const seen = new Set(); return res(items().concat(this.list(f, nd)).filter(x => { const k = this.key(x, nd); if (seen.has(k)) return false; seen.add(k); return true; })); }
    case 'Intersect': { const o = new Set(this.list(f, nd).map(x => this.key(x, nd))); const seen = new Set(); return res(items().filter(x => { const k = this.key(x, nd); if (!o.has(k) || seen.has(k)) return false; seen.add(k); return true; })); }
    case 'Except': { const o = new Set(this.list(f, nd).map(x => this.key(x, nd))); return res(items().filter(x => !o.has(this.key(x, nd)))); }
    case 'SequenceEqual': { const x = items(), y = this.list(f, nd); return x.length === y.length && x.every((v, k) => this.eq2(v, y[k])); }
    case 'ToList': return this.mkList(items(), src instanceof Coll ? src.ta[0] : src instanceof Arr ? src.el : S(src) ? { n: 'char' } : null);
    case 'ToArray': { const it = items(); return new Arr(src instanceof Coll && src.ta[0] ? src.ta[0] : src instanceof Arr ? src.el : this.elType(it), it); }
    case 'ToHashSet': { const c = new Coll('HashSet', [this.elType(items())]); for (const x of items()) c.m.set(this.key(x, nd), x); return c; }
    case 'ToDictionary': { const it = items(); const c = new Coll('Dictionary', [this.elType(it.map(x => this.call1(f, [x], nd))), a[1] ? this.elType(it.map(x => this.call1(a[1], [x], nd))) : this.elType(it)]); for (const x of it) { const k = this.call1(f, [x], nd); const kk = this.key(k, nd); if (c.m.has(kk)) this.throwEx('ArgumentException', `An item with the same key has already been added. Key: ${this.str(k)}`, nd); c.m.set(kk, [k, a[1] ? this.call1(a[1], [x], nd) : x]); } return c; }
    case 'GroupBy': { const groups = new Map(); for (const x of items()) { const k = f ? this.call1(f, [x], nd) : x; const kk = this.key(k, nd); if (!groups.has(kk)) groups.set(kk, { k, items: [] }); groups.get(kk).items.push(x); } return res([...groups.values()].map(g => { const c = this.mkList(g.items, null, 'Grouping'); c.Key = g.k; return c; })); }
    case 'Zip': { const x = items(), y = this.list(f, nd); const L = Math.min(x.length, y.length); return res(Array.from({ length: L }, (_, k) => a[1] ? this.call1(a[1], [x[k], y[k]], nd) : new CS.Tup([x[k], y[k]]))); }
    case 'Cast': case 'OfType': return res(items());
    case 'AsEnumerable': return src;
    case 'DefaultIfEmpty': { const it = items(); return res(it.length ? it : [a.length ? f : null]); }
    case 'Prepend': return res([f, ...items()]);
    case 'Append': return res([...items(), f]);
    case 'Chunk': { const it = items(), k = num(f), out = []; for (let i = 0; i < it.length; i += k) out.push(new Arr(this.elType(it), it.slice(i, i + k))); return res(out); }
  }
  return NOPE;
};
// Grouping.Key
const _gbm = P.getBuiltinMember;
P.getBuiltinMember = function (o, n, nd, fr) { if (o instanceof Coll && o.kind === 'Grouping' && n === 'Key') return o.Key; return _gbm.call(this, o, n, nd, fr); };
const _str = P.str;
P.str = function (v, fmt, nd) {
  if (v instanceof Coll && (v.kind === 'IEnumerable' || v.kind === 'Grouping')) return 'System.Linq.Enumerable+Iterator`1[' + (v.ta[0] ? (CLR[v.ta[0].n] ? 'System.' + CLR[v.ta[0].n] : v.ta[0].n) : 'System.Object') + ']';
  if (v instanceof Coll && (v.kind === 'KeyCollection' || v.kind === 'ValueCollection')) return 'System.Collections.Generic.Dictionary`2+' + v.kind + '[...]';
  if (v instanceof BObj) { if (v.kind === 'StringBuilder') return v.s; if (v.kind === 'DateTime' || v.kind === 'TimeSpan') return this.bobjCall(v, 'ToString', fmt ? [fmt] : [], nd); if (v.kind === 'Random') return 'System.Random'; return 'System.' + v.kind; }
  if (v instanceof TypeObj) return CLR[v.ty.n] ? 'System.' + CLR[v.ty.n] : v.ty.n;
  if (v instanceof Obj) { let c = v.cls; const m = this.findMethod(v.cls, 'ToString', 0); if (!m) { while (c) { if (c.nativeToString) return c.nativeToString.call(this, v); c = c.base; } } }
  return _str.call(this, v, fmt, nd);
};
// typeOf for builtin objects
const _typeOf = P.typeOf;
P.typeOf = function (v) { if (v instanceof BObj) return v.kind; if (v instanceof TypeObj) return 'Type'; return _typeOf.call(this, v); };
P.hostMember = function () { return undefined; };
P.hostCall = function () { return NOPE; };
P.hostRef = function () { return null; };

/* ---------- public API ---------- */
CS.run = function (src, opts = {}) {
  const res = { out: '', segs: [], err: null, msg: null, etype: null, line: null, col: null, kind: null, files: null, steps: 0 };
  let it = null;
  try {
    const U = CS.parse(src);
    it = new CS.Interp(U, opts);
    if (CS.check) CS.check(it);
    it.run();
  } catch (e) { CS.classify(e, res, it); }
  if (it) { res.files = it.files; res.steps = it.steps; res.readEOF = it.readEOF || 0; if (res.kind !== 'compile') { res.segs = it.out; res.out = it.out.map(s => s.t).join(''); } }
  return res;
};
CS.classify = function (e, res, it) {
  if (e instanceof CS.CsError) { res.kind = 'compile'; res.etype = e.code; res.line = e.line; res.col = e.col; res.msg = e.message; res.err = `Program.cs(${e.line},${e.col}): error ${e.code}: ${e.message}`; return; }
  if (e instanceof CsThrow) {
    const ex = e.ex; let c = ex.cls; let nm = c.name;
    res.kind = 'runtime'; res.etype = nm; res.line = e.line; res.exName = it ? it.clrName(ex) : nm;
    res.msg = ex.f.Message; res.err = `Unhandled exception. ${res.exName}: ${ex.f.Message}`;
    let nc = c; while (nc && !nc.native) nc = nc.base; res.ebase = nc ? nc.name : 'Exception';
    return;
  }
  if (e instanceof CS.Exit) return;
  if (e instanceof CS.Timeout) { res.kind = 'timeout'; res.etype = 'Timeout'; res.err = 'Timeout'; return; }
  if (e instanceof CS.StackOverflow || CS.isStackErr(e)) { res.kind = 'runtime'; res.etype = 'StackOverflowException'; res.line = e.line || null; res.err = 'Stack overflow.'; res.msg = 'Stack overflow.'; return; }
  res.kind = 'internal'; res.etype = 'InternalError'; res.err = 'KapiSharp internal error: ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : String(e));
};
})(typeof window !== 'undefined' ? window : globalThis);
