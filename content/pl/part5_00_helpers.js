// Pomocnicze funkcje do zadań dodatkowych (part5_*). Każde zadanie = [zadanie PL, nadpisania EN].
// Kod w zadaniach dodatkowych jest neutralny językowo (liczby, symbole, angielskie nazwy),
// więc wersja EN zwykle tłumaczy tylko treść pytania i wyjaśnienie.

// quiz „co wypisze program” (pierwsza opcja = poprawna; build sprawdza ją, uruchamiając kod)
const OUT = (l, code, opts, why, whyEn, o = {}) => [Object.assign({ t: 'quiz', l, q: 'Co wypisze program?', code, opts, a: 0, out: true, why }, o.pl || {}),
  Object.assign({ q: 'What will the program print?', why: whyEn }, o.en || {})];
// quiz z pytaniem (bez uruchamiania, chyba że o.pl ustawi out/err/compiles)
const QZ = (l, q, qEn, opts, optsEn, why, whyEn, code, o = {}) => [Object.assign({ t: 'quiz', l, q, opts, a: 0, why }, code ? { code } : {}, o.pl || {}),
  Object.assign({ q: qEn, why: whyEn }, optsEn ? { opts: optsEn } : {}, o.en || {})];
// quiz „jaki błąd / wyjątek” – opcje to nazwy wyjątków albo kody CSxxxx
const ERR = (l, code, opts, why, whyEn, o = {}) => [Object.assign({ t: 'quiz', l, q: 'Czym zakończy się uruchomienie programu?', code, opts, a: 0, err: true, why }, o.pl || {}),
  Object.assign({ q: 'How will running the program end?', why: whyEn }, o.en || {})];
// uzupełnianie luk ___
const FILL = (l, q, qEn, code, ans, expect, why, whyEn, o = {}) => [Object.assign({ t: 'fill', l, q, code, ans }, expect !== undefined ? { expect } : {}, { why }, o.pl || {}),
  Object.assign({ q: qEn, why: whyEn }, o.en || {})];
// znajdź błąd: line = numer linii od 0
const BUG = (l, code, line, fix, why, whyEn, o = {}) => [Object.assign({ t: 'bug', l, q: o.q || (o.pl && o.pl.noerr ? 'Program działa, ale daje zły wynik. Kliknij linię z błędem.' : 'Program zgłasza błąd. Kliknij linię z błędem.'), code, line, fix, why }, o.pl || {}),
  Object.assign({ q: o.qEn || (o.pl && o.pl.noerr ? 'The program runs but gives a wrong result. Click the line with the bug.' : 'The program reports an error. Click the line with the bug.'), why: whyEn }, o.en || {})];
// pisanie kodu z testami
const CODE = (l, q, qEn, start, tests, sol, hint, hintEn, o = {}) => [Object.assign({ t: 'code', l, q, start: start === null ? '// Twój kod\n' : start, tests, sol, hint }, o.pl || {}),
  Object.assign({ q: qEn, hint: hintEn }, start === null ? { start: '// Your code\n' } : {}, o.en || {})];
