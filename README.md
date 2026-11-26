# KapiPasta - C# 🦫

Aplikacja do nauki C# i WPF z grywalizacją i kapibarą Kapi. Wygląda jak IDE – do wyboru **Visual Studio** albo **Visual Studio Code** – ma 15 rozdziałów, 48 lekcji i 295 zadań (PL + EN). Kod uczniów uruchamia się naprawdę, w przeglądarce, przez własny interpreter **KapiSharp**, a aplikacje okienkowe – przez symulator **KapiWPF** (XAML + code-behind).

Siostrzana aplikacja: **KapiPasta - Python** (ta sama kapibara, ten sam system XP, odznak i panelu nauczyciela).

To statyczna strona: bez serwera, bez bazy i bez kroku budowania w przeglądarce. Wystarczy GitHub Pages.

© 2026 CappySoft.pl

---

## Co jest w środku

- **Etapy nauki:** 🌱 Odkrywca, 🚀 Praktyk, 🏆 Mistrz – uczeń widzi zadania do wybranego poziomu.
- **Klimaty grywalizacji:** 🏴‍☠️ Piraci, 🍝 Kuchnia KapiPasta, 🦸 Superbohaterowie (nazwy rozdziałów, poziomów, kapelusz Kapi, dekoracje).
- **Wygląd IDE:** Visual Studio (menu, pasek narzędzi z ▶ KapiPasta, Eksplorator rozwiązań, Lista błędów, Konsola debugowania) albo VS Code (pasek aktywności, Eksplorator, Terminal, niebieski pasek stanu). Jasny/ciemny motyw – przełącznik z samymi ikonami.
- **Typy zadań:** quiz „co wypisze program” (opcje sprawdzone przez uruchomienie kodu), uzupełnianie luk, znajdowanie błędu (kliknięcie linii), pisanie kodu z testami, zadania WPF (okno sprawdzane automatycznie).
- **Przykłady:** każdy z animowaną sceną z Kapi i przyciskiem ▶ Uruchom; przykłady WPF otwierają działające okno.
- **Piaskownica:** Console (z `Console.ReadLine`) i WPF (XAML + C#).
- **Postęp i nauczyciel:** zakodowany plik postępu, panel nauczyciela z PIN-em, tabelą klasy i eksportem CSV.
- **PL | EN:** cały interfejs i cała treść kursu.

## Struktura projektu

```
index.html                  ← strona startowa (GitHub Pages serwuje ją z katalogu głównego)
.nojekyll                   ← wyłącza Jekylla na GitHub Pages
css/
  styles.css                ← cały wygląd: IDE (.ide-vs/.ide-vscode × .light/.dark), klimaty, konsole, sceny, okna WPF
js/
  cs/lexer.js               ← KapiSharp: tokeny, literały, interpolacja
  cs/parser.js              ← KapiSharp: drzewo składni (top-level statements i klasyczny Main)
  cs/runtime.js             ← KapiSharp: typy, konwersje, przeciążanie, dziedziczenie, wyjątki
  cs/builtins.js            ← Console, Math, Convert, string, StringBuilder, kolekcje, LINQ, File, DateTime…
  cs/check.js               ← analiza statyczna (CS0103, CS0161, CS0128, CS0246…)
  wpf.js                    ← KapiWPF: parser XAML, kontrolki, binding, style, zdarzenia, animacje, 3D, strony
  wpf-render.js             ← KapiWPF: rysowanie okien w HTML/SVG/canvas
  data/course.js            ← WYGENEROWANE przez tools/build.js (lekcje PL+EN, odpowiedzi zaplombowane) – nie edytuj ręcznie
  seal.js                   ← „plomba” na odpowiedzi: skróty do sprawdzania + zakodowane teksty (też w build.js)
  i18n.js                   ← teksty interfejsu PL/EN, nazwy poziomów w klimatach, odznaki, podpowiedzi do błędów
  scenes.js                 ← kapibara (SVG) w kapeluszach klimatów i animowane sceny do przykładów
  app.js                    ← stan, XP/poziomy/odznaki, widoki IDE, edytor, zadania, piaskownica, eksport postępu
  teacher.js                ← panel nauczyciela (PIN, import plików, tabela klasy, CSV)
content/
  pl/part1_….js             ← PEŁNA treść kursu po polsku (rozdziały 1–4)
  pl/part2_….js             ← rozdziały 5–8
  pl/part3_….js             ← rozdziały 9–12
  pl/part4_wpf.js           ← rozdziały 13–15 (WPF)
  en/part*.js               ← tłumaczenie EN (nadpisuje pola wersji PL)
tools/
  cs.js                     ← ładuje KapiSharp i KapiWPF w Node (te same pliki co w przeglądarce)
  build.js                  ← sprawdza CAŁĄ treść (uruchamia każdy przykład i rozwiązanie) i generuje js/data/course.js
  bundle.js                 ← skleja wszystko w jeden plik dist/kapipasta-csharp.html (opcjonalnie)
.github/workflows/verify.yml ← CI: przy każdym pushu sprawdza treść kursu
```

## Uruchomienie lokalne

```bash
python3 -m http.server 8000      # albo: npx serve
# otwórz http://localhost:8000
```

Strona działa też po zwykłym otwarciu `index.html` (wszystko liczy się w przeglądarce). Z internetu pobierane są tylko czcionki Google Fonts – bez sieci użyte zostaną czcionki systemowe.

## Publikacja na GitHub Pages

1. Utwórz repozytorium i wrzuć do niego zawartość tego folderu (`index.html` musi być w katalogu głównym).
2. **Settings → Pages → Build and deployment → Source: „Deploy from a branch”**, gałąź `main`, folder `/ (root)`.
3. Po chwili aplikacja będzie pod adresem `https://<login>.github.io/<repo>/`.

## Edycja treści (lekcje i zadania)

Treść jest w plikach JavaScript w `content/`. Kod C# i XAML zapisujemy w szablonach `` c`...` `` (to `String.raw`, więc `\n` w kodzie zostaje jako `\n`). Po każdej zmianie uruchom:

```bash
node tools/build.js           # sprawdza + generuje js/data/course.js
node tools/build.js --check   # tylko sprawdza (tego używa CI)
node tools/build.js --pl      # sprawdza tylko wersję polską (szybciej przy pisaniu nowych lekcji)
```

`build.js` **uruchamia** każdy przykład i każde zadanie tym samym interpreterem, którego używa przeglądarka. Sprawdza, czy:
- poprawna odpowiedź quizu to faktycznie wynik programu (i czy inna opcja nie jest przypadkiem też poprawna),
- kod z uzupełnionymi lukami kompiluje się i daje oczekiwany wynik,
- błąd w zadaniu „znajdź błąd” występuje w zaznaczonej linii, a poprawka go usuwa,
- rozwiązanie wzorcowe przechodzi wszystkie testy, a kod startowy ich NIE przechodzi,
- okna WPF się uruchamiają, a skrypty `ui` (klikanie, wpisywanie, suwaki, klawisze, zegar) przechodzą dla rozwiązania.

Wyniki przykładów i komunikaty błędów (w stylu `Program.cs(5,9): error CS0103: …`) są dopisywane automatycznie. Build zgłasza błąd, jeśli do danych trafiłby wewnętrzny błąd interpretera albo pusta odpowiedź quizu. Na końcu odpowiedzi są plombowane (patrz „Bezpieczeństwo”) i sprawdzane, czy plomba się poprawnie otwiera.

### Rozdział

```js
CH.push({
 id: 'petle',                                        // stałe ID (używane w postępie uczniów!)
 icon: { pirate: '🌀', kitchen: '🥄', hero: '💪' },   // ikona w każdym klimacie
 name: { pirate: 'Wir Pętli', kitchen: 'Mieszanie w Pętli', hero: 'Trening Pętli', neutral: 'Petle' },
 topic: 'for, while, do-while, break, continue',
 outcomes: 'Efekty kształcenia – pokazywane w panelu nauczyciela',
 lessons: [ ... ] });
```

### Lekcja

```js
{ id: 'for', title: 'Pętla for',
  theory: `<p>HTML z teorią…</p>`,
  more: `<p>Dodatkowe treści – rozwinięte od etapu „Praktyk”</p>`,
  ex: [ { code: c`for (int i = 0; i < 3; i++) Console.WriteLine(i);`,
          inp: '',              // opcjonalne dane dla Console.ReadLine()
          lvl: 2,               // opcjonalnie: przykład tylko od etapu 2
          scene: { s: 'loop', items: ['🍊', '🍊', '🍊'], cap: 'Podpis sceny' } },
        { wpf: { 'MainWindow.xaml': c`<Window …>…</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
          scene: { s: 'wpf', cap: 'Przykład okienkowy' } } ],
  tasks: [ ... ] }
```

W `content/pl/part4_wpf.js` są pomocnicze stałe: `XH` (przestrzenie nazw XAML), `CSW(ciało, dodatki)` (szkielet `MainWindow.xaml.cs`) i `CTOR` (konstruktor z `InitializeComponent()`).

### Zadania

Każde zadanie ma `t` (typ), `l` (poziom 1–3: Odkrywca / Praktyk / Mistrz) i `q` (treść, HTML). Uczeń widzi zadania o poziomie ≤ wybranego etapu.

| typ | pola | opis |
|---|---|---|
| `quiz` | `code?`, `opts`, `a` (indeks poprawnej), `out: true` (opcje to wynik programu), `err: true` (opcje to typ wyjątku / kod błędu), `compiles: true/false`, `inp?`, `why` | kolejność opcji jest losowana w aplikacji |
| `fill` | `code` z `___` jako lukami, `ans: [[warianty luki 1], …]`, `expect?`, `run: false?`, `lang: 'xaml'?` + `cs?`, `why` | porównanie ignoruje spacje i rodzaj cudzysłowu |
| `bug` | `code`, `line` (0-indeksowana), `fix`, `why`, `noerr: true` (błąd logiczny, z `expect`), `cause: true` (kompilator zgłasza błąd w innej linii niż przyczyna), `fixcheck: false`, `lang: 'xaml'?` | komunikat błędu generuje się sam |
| `code` | `start`, `tests: [{ i: 'wejście', o: 'oczekiwane wyjście' }]`, `check?` (JS: `src`, `out`, `files`, `input` → tekst błędu albo nic), `files?` (pliki wirtualne), `sol`, `hint` | konsolowe |
| `code` + `wpf: true` | `start` i `sol` jako `{ 'MainWindow.xaml': …, 'MainWindow.xaml.cs': … }`, `ui` (JS z obiektami `ui`, `app`), `answers?` (np. `{ YesNo: 'Yes' }` dla MessageBox) | `ui.el/has/byType/text/click/type/slide/select/key/mouse/tick/menu` |

⚠️ **Nie zmieniaj kolejności zadań w opublikowanej lekcji.** ID zadania to `idLekcji-indeks`, więc postęp uczniów jest przypisany do pozycji. Nowe zadania najlepiej dopisywać na końcu lekcji.

### Sceny z kapibarą (`scene: { s: … }`)

`say` · `boxes` (zmienne) · `bits` (typy i zakresy) · `cast` (konwersje) · `cards` (wyrażenie → wynik) · `share` (dzielenie / i %) · `fork` (if/else) · `ladder` (else if, switch) · `loop` (pętla, opcjonalnie `acc`) · `grid` (pętle zagnieżdżone) · `row` (tablice, stringi) · `machine` (metoda) · `scope` (zasięg, ref) · `stack` (rekurencja) · `class` (klasa i obiekty) · `inherit` (dziedziczenie, interfejsy) · `struct` (wartość vs referencja) · `dict` · `queue` · `venn` · `dice` · `file` · `err` (wyjątki) · `search` · `sort` · `compile` (kompilacja) · `wpf` (okno).

Każda scena przyjmuje `cap` (podpis). Pozostałe pola zależą od typu – najlepiej skopiować istniejący przykład. Nowy typ sceny dodajesz jako kolejny `case` w `renderScene()` w `js/scenes.js`.

### Tłumaczenie (EN)

`content/en/*.js` wypełnia `TR.ch[idRozdziału]` i `TR.les[idLekcji]`. Wpisujesz tylko pola, które się zmieniają (`title`, `theory`, `q`, `why`, `code`, `opts`, `start`, `sol`, `tests`, `ui`…). Reszta (`a`, `line`, `l`, `t`…) jest brana z wersji polskiej. Tablice `ex` i `tasks` muszą mieć tę samą długość co w PL (puste `{}` = bez zmian), inaczej `build.js` zgłosi błąd. Wersja angielska jest weryfikowana tak samo jak polska.

## Interpreter KapiSharp – zakres

Obsługuje podzbiór C# 12 potrzebny w kursie: top-level statements i klasyczny `Main`, typy proste (w tym `long`, `decimal`, `char`, `byte`, nullable), `var`, interpolację z formatami (`F2`, `N2`, `X2`, wyrównanie), wszystkie operatory, `if/switch` (także wyrażenia `switch` i wzorce), pętle, tablice (1D, 2D, poszarpane), metody (przeciążanie, `ref/out/params`, parametry domyślne, funkcje lokalne, lambdy), klasy, konstruktory, właściwości, `static`, dziedziczenie, `virtual/override/new`, `abstract`, interfejsy, `enum`, `struct`, wyjątki (własne też), `List/Dictionary/Queue/Stack/HashSet`, LINQ, `StringBuilder`, `File`, `StreamReader/Writer` (pliki wirtualne), `Random`, `DateTime`.

Błędy wyglądają jak w Visual Studio (`CS0103`, `CS0029`, `CS0266`, `CS1002`, `CS0161`…), a wyjątki mają komunikaty .NET. Pętle nieskończone przerywa limit kroków, zbyt głęboka rekurencja kończy się `StackOverflowException`.

To **nie** jest pełny kompilator .NET – programy spoza zakresu kursu mogą zgłosić „nieobsługiwaną konstrukcję”.

## Symulator KapiWPF – zakres

XAML: `Window`, `Page`, `Frame`, panele (`Grid`, `StackPanel`, `WrapPanel`, `DockPanel`, `Canvas`, `Border`, `ScrollViewer`), kontrolki (`Button`, `TextBlock`, `Label`, `TextBox`, `PasswordBox`, `CheckBox`, `RadioButton`, `Slider`, `ProgressBar`, `ComboBox`, `ListBox`, `TabControl`, `Image`, `Menu`, `Expander`…), kształty i pędzle (gradienty), `Binding` (`ElementName`, `DataContext`, `StringFormat`, `Mode`, konwertery `IValueConverter`), style z wyzwalaczami, zasoby, `Storyboard` / `DoubleAnimation` / `ColorAnimation`, transformacje, `Viewport3D` (kamera, światła, siatki, obrót), `DispatcherTimer`, `MessageBox`, `ShowDialog()` / `Show()`, nawigacja stron.

Ograniczenie: gdy w metodzie pojawi się `MessageBox` z Tak/Nie albo `ShowDialog()`, symulator po odpowiedzi wykonuje metodę obsługi ponownie z zapamiętanym wynikiem – dlatego przed takim wywołaniem nie należy zmieniać stanu programu (lekcja to wyjaśnia).

## Interfejs, klimaty, grywalizacja

- **Teksty UI** → `js/i18n.js` (`UI.pl`, `UI.en`). W kodzie używaj `tr('klucz')`.
- **Wygląd IDE** → `css/styles.css`: klasy `.ide-vs/.ide-vscode` × `.light/.dark` definiują zmienne CSS (kolory IDE i kolorowania składni).
- **Klimaty** (`pirate`, `kitchen`, `hero`) → nazwy poziomów i słowa w `WORDS` (`js/i18n.js`), kapelusze Kapi w `capy()` (`js/scenes.js`), dekoracje w `css/styles.css`.
- **Odznaki** → `BADGES` w `js/i18n.js` (warunek `f` dostaje statystyki ucznia).
- **XP** → `BASE` i `award()` w `js/app.js`. Cel dnia (50 XP) → `addXP()`.

## Postęp ucznia i panel nauczyciela

- Postęp zapisuje się w `localStorage` przeglądarki (klucz `cskapi-v1`, panel nauczyciela `cskapi-teacher-v1`).
- **Mój postęp** eksportuje zakodowany plik `.txt` (format `CSKAPI1.<z|p>.<suma>.<dane>`): JSON → deflate → XOR → base64url + suma kontrolna FNV. Plik zawiera też **kod rozwiązań** zadań programistycznych (pole `proof`).
- **Czas i wyjścia z aplikacji:** dla każdego zadania zapisuje się czas rozwiązywania (liczony, gdy zadanie jest na ekranie, a karta widoczna; jeden ciągły odcinek liczy się maks. 10 min) oraz liczba wyjść z aplikacji w trakcie zadania (przełączenie karty, inne okno, zminimalizowanie) i czas poza nią. Uczeń widzi to w profilu i dostaje komunikat po powrocie; nauczyciel widzi kolumny ⏱ i 👀 w tabeli klasy, w szczegółach ucznia (per lekcja) i w CSV. W pliku postępu: `done[id] = [ok, za_1_razem, próby, sekundy, wyjścia, sekundy_poza]`. Uwaga: w opublikowanej stronie Claude kliknięcie poza ramką strony też liczy się jako wyjście.
- **Gwiazdki lekcji** (w eksploratorze, np. ★★☆): pokazują, ile zadań lekcji jest zrobione – ★ od 1/3, ★★ od 2/3, ★★★ = 100%. **Kapibara w birecie** 🎓 obok trzech gwiazdek = wszystkie zadania za pierwszym razem, bez pomyłek i bez podglądania rozwiązania. Liczone na bieżąco; podpowiedź po najechaniu pokazuje wynik.
- **Panel nauczyciela**: import wielu plików lub kodów, tabela klasy, mapa postępu w rozdziałach, efekty kształcenia, najtrudniejsze zadania, szczegóły ucznia, eksport CSV oraz kolumna 🛡️ **Wiarygodność postępu** (patrz niżej).
- PIN nauczyciela: min. 6 cyfr, zapisany jako PBKDF2-SHA256 (250 000 iteracji, losowa sól); po 5 błędnych próbach rośnie czas oczekiwania (30 s, 60 s, … do 1 h). Stare PIN-y (4 cyfry, stary skrót) działają i są przepisywane na nowy format przy pierwszym logowaniu.
- ⚠️ Nie zmieniaj `SALT` ani formatu `payload()` w `js/app.js`, bo stare pliki uczniów przestaną się wczytywać.

## Bezpieczeństwo – co chroni, a czego nie

Aplikacja to statyczna strona (GitHub Pages, bez serwera). Wszystko, co sprawdza odpowiedzi, działa na urządzeniu ucznia, więc **zdeterminowany uczeń zawsze może to obejść**. Zabezpieczenia podnoszą koszt oszukiwania i pozwalają nauczycielowi wyłapać fałszerstwa:

| zagrożenie | co jest zrobione | co zostaje |
|---|---|---|
| podgląd odpowiedzi w konsoli / kodzie strony | dane kursu nie są w `window`; pola `a`, `ans`, `line`, `sol`, `fix`, `why`, `expect` są usuwane przy budowaniu. Aplikacja sprawdza odpowiedź przez porównanie skrótu (`ah`, `ansh`, `lh`), a teksty pokazywane po odpowiedzi są zaplombowane (`x`, `js/seal.js`). Kolejność opcji quizu jest wymieszana | klucz do plomby jest w stronie – to zaciemnienie, nie szyfrowanie |
| sfałszowany plik postępu | panel liczy górną granicę XP z zaliczonych zadań, wykrywa nieznane zadania i brak rozwiązań, a „Sprawdź rozwiązania” uruchamia kod ucznia na testach (konsola i WPF) | quizy, luki i „znajdź błąd” nie mają dowodu – da się je oznaczyć jako zaliczone |
| odgadnięcie PIN-u | PBKDF2 + rosnące opóźnienie | PIN chroni tylko widok na tym komputerze; ktoś z dostępem do przeglądarki nauczyciela może odczytać dane |

Pełna ochrona wymaga serwera: odpowiedzi tylko na serwerze (sprawdzanie przez API), postęp zapisywany i podpisywany po stronie serwera (np. HMAC) oraz logowanie nauczyciela z limitem prób. To zmiana architektury (hosting, konta uczniów, RODO) – osobny etap.

## Jeden plik

```bash
node tools/build.js && node tools/bundle.js   # → dist/kapipasta-csharp.html
```

## Licencja

© 2026 CappySoft.pl – wszelkie prawa zastrzeżone (zmień według potrzeb).
