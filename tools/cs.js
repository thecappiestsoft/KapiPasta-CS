// Loads the KapiSharp interpreter into Node (same files the browser uses).
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..', 'js', 'cs');
for (const f of ['lexer.js', 'parser.js', 'runtime.js', 'builtins.js', 'check.js']) {
  const p = path.join(dir, f); if (fs.existsSync(p)) vm.runInThisContext(fs.readFileSync(p, 'utf8'), { filename: p });
}
module.exports = globalThis.CS;
for (const f of ['wpf.js']) { const p = path.join(__dirname, '..', 'js', f); vm.runInThisContext(fs.readFileSync(p, 'utf8'), { filename: p }); }
module.exports.WPF = globalThis.WPF;
