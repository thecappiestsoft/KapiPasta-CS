#!/usr/bin/env node
/* Bundle the whole app into ONE self-contained HTML file: dist/kapipasta-csharp.html
   (useful for sharing as a single file or hosting where only one file is allowed).
   Usage: node tools/build.js && node tools/bundle.js                                   */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
let html = read('index.html');
html = html.replace(/<link rel="stylesheet" href="(?!https?:)([^"]+)">/g, (_, f) => '<style>\n' + read(f) + '\n</style>');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, f) => '<script>\n' + read(f).replace(/<\/script/gi, '<\\/script') + '\n</script>');
fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const out = path.join(ROOT, 'dist', 'kapipasta-csharp.html');
fs.writeFileSync(out, html);
console.log('written', path.relative(ROOT, out), Math.round(html.length / 1024) + ' KB');
