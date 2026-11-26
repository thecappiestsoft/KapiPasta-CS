// Treść kursu KapiPasta - C# (PL). Format opisany w README.md -> "Edycja treści".
// Kod C# zapisujemy jako c`...` (String.raw), więc \n w kodzie zostaje dosłownie \n.
// Po zmianach uruchom: node tools/build.js

CH.push({
 id: 'start', icon: { pirate: '🏝️', kitchen: '🍽️', hero: '🏢' },
 name: { pirate: 'Port Startowy', kitchen: 'Przystawka: Hello World', hero: 'Baza Bohaterów', neutral: 'Start' },
 topic: 'Visual Studio, Hello World, składnia, kompilacja',
 outcomes: 'Wykorzystuje środowisko programistyczne dla aplikacji konsolowych; rozróżnia kompilatory i interpretery; charakteryzuje zadania kompilatora, interpretera i debuggera; charakteryzuje etapy kompilacji; charakteryzuje pojęcie biblioteki; kompiluje i uruchamia programy.',
 lessons: [
 { id: 'hello', title: 'Visual Studio i Hello World',
  theory: `<p>Programy w C# piszemy najczęściej w <b>Visual Studio</b> (Windows) albo w <b>Visual Studio Code</b> z rozszerzeniem C# Dev Kit. Oba są darmowe (Visual Studio w wersji <i>Community</i>). Przy instalacji Visual Studio zaznacz pakiet <b>„Programowanie aplikacji klasycznych dla platformy .NET”</b> – dostaniesz kompilator C#, środowisko .NET i projektant okien WPF.</p>
<p>Nowy projekt: <b>Plik → Nowy → Projekt → Aplikacja konsolowa</b>. Visual Studio utworzy plik <code>Program.cs</code> z jedną linią:</p>
<pre>Console.WriteLine("Hello, World!");</pre>
<p><code>Console.WriteLine(...)</code> wypisuje tekst w konsoli i przechodzi do nowej linii. <code>Console.Write(...)</code> wypisuje bez przechodzenia do nowej linii. Tekst (<i>string</i>) zawsze zapisujemy w <b>cudzysłowie</b> <code>"..."</code>.</p>
<p>Program uruchamiamy klawiszem <b>F5</b> (z debugerem) albo <b>Ctrl+F5</b> (bez debugera). W VS Code – poleceniem <code>dotnet run</code> w terminalu.</p>`,
  more: `<p>Każda instrukcja w C# kończy się <b>średnikiem</b> <code>;</code>. Wielkość liter ma znaczenie: <code>Console</code> to nie to samo co <code>console</code>.</p><p>W tekście można użyć <b>sekwencji ucieczki</b>: <code>\\n</code> – nowa linia, <code>\\t</code> – tabulator, <code>\\"</code> – cudzysłów, <code>\\\\</code> – ukośnik.</p>`,
  ex: [
   { code: c`Console.WriteLine("Hello, World!");
Console.WriteLine("Jestem Kapi i uczę się C#!");`,
     scene: { s: 'say', cap: 'Kapi trzyma tabliczkę: każde Console.WriteLine to osobna linia na tabliczce.' } },
   { code: c`Console.Write("Kapi ");
Console.Write("lubi ");
Console.WriteLine("pomarańcze!");
Console.WriteLine("Raz\tdwa\ttrzy");
Console.WriteLine("Kapi mówi: \"Cześć!\"");`,
     scene: { s: 'say', cap: 'Write pisze dalej w tej samej linii, a WriteLine na końcu przechodzi do nowej. \\t robi odstęp, \\" wstawia cudzysłów.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Console.WriteLine("Kapi");
Console.WriteLine("pływa");`, opts: ['Kapi\npływa', 'Kapipływa', 'Kapi pływa', '"Kapi"\n"pływa"'], a: 0, out: true,
     why: 'Każde WriteLine kończy linię, więc słowa są w dwóch liniach.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Console.Write("Ala");
Console.Write("Kapi");
Console.WriteLine("!");`, opts: ['AlaKapi!', 'Ala\nKapi\n!', 'Ala Kapi !', 'AlaKapi\n!'], a: 0, out: true,
     why: 'Write nie przechodzi do nowej linii i nie dodaje spacji.' },
   { t: 'fill', l: 1, q: 'Uzupełnij, aby program wypisał <code>Ahoj!</code> i przeszedł do nowej linii.', code: c`Console.___("Ahoj!");`, ans: [['WriteLine']], expect: 'Ahoj!',
     why: 'Do wypisania tekstu z przejściem do nowej linii służy Console.WriteLine.' },
   { t: 'bug', l: 1, q: 'Program miał się przywitać, ale kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Console.WriteLine("Dzień dobry");
Console.WriteLine("Jestem Kapi")
Console.WriteLine("Do zobaczenia");`, line: 1, fix: 'Console.WriteLine("Jestem Kapi");',
     why: 'Brakuje średnika na końcu instrukcji. Kompilator zgłasza CS1002: ; expected.' },
   { t: 'quiz', l: 2, q: 'Który skrót w Visual Studio uruchamia program <b>z debugerem</b>?', opts: ['F5', 'Ctrl+F5', 'F10', 'Ctrl+S'], a: 0,
     why: 'F5 = Start Debugging, Ctrl+F5 = Start Without Debugging, F10 = krok w debugerze.' },
   { t: 'code', l: 1, q: 'Napisz program, który wypisze w dwóch liniach:<br><code>Kapi</code><br><code>kocha kąpiele</code>',
     start: '// Twój kod\n', tests: [{ i: '', o: 'Kapi\nkocha kąpiele' }], sol: c`Console.WriteLine("Kapi");
Console.WriteLine("kocha kąpiele");`, hint: 'Użyj dwóch poleceń Console.WriteLine.' },
   { t: 'code', l: 3, q: 'Używając <b>jednego</b> <code>Console.WriteLine</code> i sekwencji <code>\\n</code>, wypisz trzy linie: <code>raz</code>, <code>dwa</code>, <code>trzy</code>.',
     start: 'Console.WriteLine("raz dwa trzy");\n', tests: [{ i: '', o: 'raz\ndwa\ntrzy' }], check: "if ((src.match(/Console\\.Write/g) || []).length !== 1) return 'Użyj dokładnie jednego Console.WriteLine';",
     sol: c`Console.WriteLine("raz\ndwa\ntrzy");`, hint: '\\n w tekście oznacza nową linię.' },
  ] },
 { id: 'struktura', title: 'Struktura programu i składnia',
  theory: `<p>Od .NET 6 program może składać się z samych <b>instrukcji najwyższego poziomu</b> (top-level statements) – tak jak w poprzedniej lekcji. To skrót. Kompilator i tak „owija” je w klasę i metodę <code>Main</code>. Klasyczny szablon wygląda tak:</p>
<pre>using System;

namespace KapiPasta
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello!");
        }
    }
}</pre>
<ul><li><code>using System;</code> – dołącza przestrzeń nazw (bibliotekę) z klasą <code>Console</code>.</li>
<li><code>namespace</code> – „katalog” na nasze klasy.</li>
<li><code>class Program</code> – klasa; w C# cały kod mieszka w klasach.</li>
<li><code>static void Main</code> – <b>punkt startowy</b> programu. Od niego zaczyna się wykonywanie.</li>
<li>Bloki kodu zamykamy w klamrach <code>{ }</code>, instrukcje kończymy średnikiem <code>;</code>.</li></ul>
<p><b>Komentarze</b>: <code>// do końca linii</code> oraz <code>/* wiele linii */</code>. Kompilator je pomija.</p>`,
  more: `<p>Zasady pisania (konwencje): nazwy klas i metod piszemy <b>PascalCase</b> (<code>MojaKlasa</code>, <code>PoliczSume</code>), zmienne <b>camelCase</b> (<code>liczbaKapibar</code>). Wcięcia (4 spacje) nie są wymagane przez kompilator, ale bardzo ułatwiają czytanie – Visual Studio formatuje kod skrótem <b>Ctrl+K, Ctrl+D</b>.</p>`,
  ex: [
   { code: c`using System;

namespace KapiPasta
{
    class Program
    {
        static void Main(string[] args)
        {
            // komentarz: kompilator go pomija
            Console.WriteLine("Program startuje w Main!");
            /* komentarz
               w kilku liniach */
            Console.WriteLine("Koniec Main.");
        }
    }
}`, scene: { s: 'compile', cap: 'Kapi niesie plik Program.cs przez kolejne etapy: kompilator C# tworzy kod pośredni IL, a JIT zamienia go na kod maszynowy procesora.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Od której metody zaczyna się wykonywanie klasycznego programu w C#?', opts: ['Main', 'Start', 'Program', 'Run'], a: 0, why: 'Punktem wejścia programu jest statyczna metoda Main.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`// Console.WriteLine("A");
Console.WriteLine("B"); // Console.WriteLine("C");
/* Console.WriteLine("D"); */`, opts: ['B', 'A\nB', 'B\nC', 'A\nB\nC\nD'], a: 0, out: true, why: 'Komentarze są pomijane – zostaje tylko WriteLine("B").' },
   { t: 'bug', l: 1, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`class Program
{
    static void Main()
    {
        console.WriteLine("Hej!");
    }
}`, line: 4, fix: 'Console.WriteLine("Hej!");', why: 'C# rozróżnia wielkość liter: klasa nazywa się Console, a nie console (CS0103).' },
   { t: 'bug', l: 2, q: 'Brakuje jednego znaku. Kliknij linię, którą wskaże kompilator.', code: c`class Program
{
    static void Main()
    {
        Console.WriteLine("Kapi");
    }`, line: 5, fix: '    }\n}', cause: true, why: 'Każda klamra { musi mieć parę }. Brakuje klamry zamykającej klasę (CS1513).' },
   { t: 'fill', l: 2, q: 'Uzupełnij nagłówek metody startowej.', code: c`class Program
{
    static ___ Main(string[] args)
    {
        Console.WriteLine("Start!");
    }
}`, ans: [['void']], expect: 'Start!', why: 'Main nic nie zwraca, więc ma typ void.' },
   { t: 'quiz', l: 2, q: 'Do czego służy <code>using System;</code>?', opts: ['Dołącza przestrzeń nazw System, np. z klasą Console', 'Uruchamia program', 'Tworzy nową klasę System', 'Włącza debugger'], a: 0, why: 'using dołącza przestrzeń nazw, dzięki czemu możemy pisać Console zamiast System.Console.' },
  ] },
 { id: 'kompilacja', title: 'Kompilacja, debugowanie, biblioteki',
  theory: `<p><b>Kompilator</b> tłumaczy cały kod źródłowy na inny język <i>przed</i> uruchomieniem i zgłasza błędy składni od razu. <b>Interpreter</b> czyta i wykonuje program linijka po linijce w czasie działania (tak działa np. Python).</p>
<p>C# jest językiem <b>kompilowanym</b>, ale dwuetapowo:</p>
<ol><li>Kompilator C# (Roslyn, <code>csc</code>) zamienia <code>.cs</code> na <b>kod pośredni IL</b> zapisany w pliku <code>.dll</code>/<code>.exe</code>.</li>
<li>Podczas uruchamiania <b>JIT</b> (Just-In-Time) w środowisku .NET zamienia IL na <b>kod maszynowy</b> konkretnego procesora.</li></ol>
<p>Etapy pracy kompilatora: analiza leksykalna (podział na tokeny) → analiza składniowa (drzewo programu) → analiza semantyczna (typy, nazwy) → generowanie kodu.</p>
<p><b>Debugger</b> pozwala zatrzymać program w wybranym miejscu (<b>punkt przerwania</b> – F9), wykonywać go krok po kroku (<b>F10</b> – krok z przeskokiem, <b>F11</b> – krok z wejściem do metody) i podglądać wartości zmiennych (okna <i>Zmienne lokalne</i> i <i>Czujka</i>).</p>
<p><b>Biblioteka</b> to gotowy, skompilowany kod do wielokrotnego użycia (np. <code>System.Console</code>, <code>System.Math</code>). W .NET biblioteki to pliki <code>.dll</code>, a dodatkowe pobieramy jako pakiety <b>NuGet</b>.</p>`,
  more: `<p>Błędy dzielimy na: <b>błędy kompilacji</b> (np. brak średnika – program w ogóle się nie uruchomi, kody <code>CSxxxx</code>), <b>błędy wykonania – wyjątki</b> (np. dzielenie przez zero – program startuje, ale się zatrzymuje) oraz <b>błędy logiczne</b> (program działa, ale daje zły wynik – tu najbardziej pomaga debugger).</p>`,
  ex: [
   { code: c`Console.WriteLine("Zaczynam");
int x = 10;
int y = 0;
Console.WriteLine(x / y);
Console.WriteLine("Tego już nie zobaczysz");`, scene: { s: 'err', err: 'DivideByZeroException', caught: false, cap: 'Program skompilował się bez błędów, ale podczas działania doszło do dzielenia przez zero. To błąd wykonania – wyjątek.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Czym jest <b>IL</b> w .NET?', opts: ['Kodem pośrednim tworzonym przez kompilator C#', 'Kodem maszynowym procesora', 'Plikiem z kodem źródłowym .cs', 'Rodzajem błędu kompilacji'], a: 0, why: 'Kompilator tworzy IL, a JIT zamienia go na kod maszynowy podczas uruchamiania.' },
   { t: 'quiz', l: 1, q: 'Który klawisz w Visual Studio ustawia <b>punkt przerwania</b> w bieżącej linii?', opts: ['F9', 'F5', 'F11', 'F2'], a: 0, why: 'F9 – punkt przerwania, F10/F11 – kroki w debugerze.' },
   { t: 'quiz', l: 2, q: 'Program kompiluje się, ale w trakcie działania zatrzymuje się z komunikatem <code>DivideByZeroException</code>. Jaki to rodzaj błędu?', opts: ['Błąd wykonania (wyjątek)', 'Błąd kompilacji', 'Błąd logiczny', 'Błąd składni'], a: 0, why: 'Wyjątek pojawia się dopiero podczas działania programu.' },
   { t: 'quiz', l: 2, q: 'Co się stanie po próbie uruchomienia tego programu?', code: c`Console.WriteLine("Kapi")
Console.WriteLine("Pasta");`, opts: ['Kompilator zgłosi błąd i program w ogóle się nie uruchomi', 'Program wypisze Kapi i Pasta', 'Program wypisze Kapi, a potem zgłosi wyjątek', 'Program wypisze KapiPasta w jednej linii'], a: 0, compiles: false, why: 'Brak średnika to błąd składni. Wykrywa go kompilator, zanim program się uruchomi – nie wykona się żadna linia.' },
   { t: 'quiz', l: 3, q: 'Czym różni się kompilator od interpretera?', opts: ['Kompilator tłumaczy cały program przed uruchomieniem, interpreter wykonuje go na bieżąco', 'Interpreter jest zawsze szybszy od kompilatora', 'Kompilator działa tylko w Visual Studio Code', 'Nie ma różnicy'], a: 0, why: 'Dlatego błędy składni w C# widzimy przed uruchomieniem programu.' },
   { t: 'bug', l: 3, q: 'Program działa, ale wypisuje zły wynik (błąd logiczny). Pole kwadratu o boku 4 to 16. Kliknij linię z błędem.', code: c`int bok = 4;
int pole = bok + bok;
Console.WriteLine("Pole: " + pole);`, line: 1, fix: 'int pole = bok * bok;', noerr: true, expect: 'Pole: 16', why: 'Pole kwadratu to bok razy bok, a nie bok plus bok.' },
  ] },
 ] });

CH.push({
 id: 'dane', icon: { pirate: '🗝️', kitchen: '🧂', hero: '🛡️' },
 name: { pirate: 'Wyspa Zmiennych', kitchen: 'Spiżarnia Typów', hero: 'Arsenał Danych', neutral: 'ZmienneITypy' },
 topic: 'zmienne, typy, stałe, literały, konwersje, Console.ReadLine',
 outcomes: 'Korzysta z typów danych; stosuje proste typy danych; deklaruje zmienne różnych typów; wykonuje operacje wejścia i wyjścia; stosuje rzutowanie i konwersję typów.',
 lessons: [
 { id: 'zmienne', title: 'Zmienne',
  theory: `<p><b>Zmienna</b> to nazwane miejsce w pamięci, w którym przechowujemy wartość. W C# każda zmienna ma <b>typ</b>, który podajemy przy deklaracji:</p>
<pre>int liczbaPomaranczy = 5;
string imie = "Kapi";</pre>
<p>Zapis <code>typ nazwa = wartość;</code> to <b>deklaracja z inicjalizacją</b>. Wartość możemy później zmienić: <code>liczbaPomaranczy = 7;</code> (bez podawania typu!).</p>
<p>Słowo <code>var</code> pozwala kompilatorowi samemu ustalić typ na podstawie wartości: <code>var wiek = 4;</code> to nadal <code>int</code>.</p>
<p>Nazwy zmiennych: litery, cyfry i <code>_</code>, nie mogą zaczynać się cyfrą ani być słowem kluczowym. Przyjęło się pisać je <b>camelCase</b>.</p>
<p><b>Interpolacja</b> wstawia wartości do tekstu: <code>$"Mam {wiek} lata"</code>.</p>`,
  more: `<p>Zmiennej trzeba nadać wartość, zanim ją odczytamy – inaczej kompilator zgłosi <code>CS0165: Use of unassigned local variable</code>. Zmienna istnieje tylko w bloku <code>{ }</code>, w którym ją zadeklarowano (to jej <b>zasięg</b>).</p>`,
  ex: [
   { code: c`string imie = "Kapi";
int wiek = 4;
double waga = 45.5;
bool lubiKapiel = true;
Console.WriteLine($"{imie} ma {wiek} lata i waży {waga} kg.");
Console.WriteLine("Lubi kąpiel? " + lubiKapiel);
wiek = wiek + 1;
Console.WriteLine($"Za rok: {wiek}");`,
     scene: { s: 'boxes', vars: [['imie', '"Kapi"', 'string'], ['wiek', '5', 'int'], ['waga', '45.5', 'double'], ['lubiKapiel', 'true', 'bool']], cap: 'Każda zmienna to pudełko z nazwą i typem. Kolor pudełka mówi, jakiego typu wartości może przechować.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int a = 3;
a = 8;
Console.WriteLine(a);`, opts: ['8', '3', '11', 'a'], a: 0, out: true, why: 'Druga instrukcja nadpisuje wartość zmiennej.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`string imie = "Kapi";
Console.WriteLine($"Cześć, {imie}!");`, opts: ['Cześć, Kapi!', 'Cześć, {imie}!', 'Cześć, imie!', '$"Cześć, Kapi!"'], a: 0, out: true, why: 'W interpolowanym tekście $"..." nawiasy {} są zastępowane wartością.' },
   { t: 'fill', l: 1, q: 'Uzupełnij typy, aby program się skompilował.', code: c`___ imie = "Ola";
___ wiek = 12;
Console.WriteLine($"{imie}: {wiek}");`, ans: [['string', 'var'], ['int', 'var']], expect: 'Ola: 12', why: 'Tekst to string, liczba całkowita to int (albo var dla obu).' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`int punkty = 10;
punkty = punkty + 5;
Console.WriteLine(Punkty);`, line: 2, fix: 'Console.WriteLine(punkty);', why: 'Wielkość liter ma znaczenie – zmienna nazywa się punkty, nie Punkty (CS0103).' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`int x;
Console.WriteLine(x);
x = 5;`, line: 1, fix: 'Console.WriteLine(5);', why: 'Zmienna x jest odczytywana, zanim dostała wartość (CS0165).' },
   { t: 'code', l: 1, q: 'Utwórz zmienne <code>imie</code> = <code>"Kapi"</code> i <code>pomarancze</code> = <code>3</code>, a potem wypisz: <code>Kapi ma 3 pomarańcze</code>.',
     start: '// Twój kod\n', tests: [{ i: '', o: 'Kapi ma 3 pomarańcze' }], check: "if (!/\\bimie\\b/.test(src) || !/\\bpomarancze\\b/.test(src)) return 'Użyj zmiennych imie i pomarancze';",
     sol: c`string imie = "Kapi";
int pomarancze = 3;
Console.WriteLine($"{imie} ma {pomarancze} pomarańcze");`, hint: 'Użyj interpolacji: $"{imie} ma {pomarancze} pomarańcze".' },
  ] },
 { id: 'typy', title: 'Typy danych, stałe i literały',
  theory: `<p>Najważniejsze <b>typy proste</b> w C#:</p>
<ul><li><code>int</code> – liczba całkowita (32 bity, od −2 147 483 648 do 2 147 483 647), <code>long</code> – większa (64 bity), <code>byte</code> – od 0 do 255,</li>
<li><code>double</code> – liczba zmiennoprzecinkowa (domyślna dla liczb z kropką), <code>float</code> – mniej dokładna, <code>decimal</code> – dokładna, do pieniędzy,</li>
<li><code>char</code> – jeden znak w <b>apostrofach</b>: <code>'K'</code>,</li>
<li><code>bool</code> – <code>true</code> albo <code>false</code>,</li>
<li><code>string</code> – tekst w <b>cudzysłowie</b>: <code>"Kapi"</code> (to typ referencyjny, ale używamy go jak prostego).</li></ul>
<p><b>Literały</b> to wartości wpisane wprost w kod. Ich typ zależy od zapisu: <code>5</code> → int, <code>5L</code> → long, <code>5.0</code> → double, <code>5.0f</code> → float, <code>5.0m</code> → decimal, <code>'5'</code> → char, <code>"5"</code> → string.</p>
<p><b>Stała</b> (<code>const</code>) to wartość, której nie można zmienić: <code>const double VAT = 0.23;</code>. Próba zmiany kończy się błędem kompilacji.</p>`,
  more: `<p>Zakresy typów sprawdzisz przez <code>int.MaxValue</code>, <code>long.MaxValue</code> itd. Gdy wynik nie mieści się w <code>int</code>, liczba „przekręca się” jak licznik: <code>int.MaxValue + 1</code> w zmiennej daje −2147483648 (przepełnienie). W polskiej wersji Windows liczby z przecinkiem mogą być wypisywane z <b>przecinkiem</b> (3,14) – w KapiPasta używamy kropki, jak w kulturze niezmiennej (InvariantCulture).</p>`,
  ex: [
   { code: c`int pomarancze = 12;
long ziarenka = 3000000000L;
double temperatura = 36.6;
float masa = 45.5f;
decimal cena = 19.99m;
char ocena = 'A';
bool glodny = true;
string imie = "Kapi";
const int DNI_TYGODNIA = 7;
Console.WriteLine($"{imie}: {pomarancze}, {ziarenka}, {temperatura}, {masa}, {cena}, {ocena}, {glodny}, {DNI_TYGODNIA}");
Console.WriteLine(int.MaxValue);`,
     scene: { s: 'boxes', vars: [['pomarancze', '12', 'int'], ['ziarenka', '3000000000', 'long'], ['temperatura', '36.6', 'double'], ['cena', '19.99', 'decimal'], ['ocena', "'A'", 'char'], ['glodny', 'true', 'bool'], ['imie', '"Kapi"', 'string']], cap: 'Spiżarnia Kapi: każdy składnik trzymamy w pudełku odpowiedniego typu – liczby całkowite osobno, ułamki osobno, znaki i teksty osobno.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: "Jakiego typu jest literał <code>'K'</code>?", opts: ['char', 'string', 'int', 'bool'], a: 0, why: 'Pojedynczy znak w apostrofach to char.' },
   { t: 'quiz', l: 1, q: 'Który typ najlepiej nadaje się do przechowywania kwot pieniędzy?', opts: ['decimal', 'int', 'float', 'char'], a: 0, why: 'decimal liczy dokładnie w systemie dziesiętnym, bez błędów zaokrągleń typowych dla double/float.' },
   { t: 'bug', l: 1, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`string imie = "Kapi";
int wiek = "4";
Console.WriteLine(imie + wiek);`, line: 1, fix: 'int wiek = 4;', why: '"4" to tekst (string), a zmienna jest typu int (CS0029).' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`float waga = 45.5;
Console.WriteLine(waga);`, line: 0, fix: 'float waga = 45.5f;', why: 'Literał 45.5 jest typu double. Dla float trzeba dopisać f (CS0664).' },
   { t: 'quiz', l: 2, q: 'Co się stanie?', code: c`const int MAX = 10;
MAX = 20;
Console.WriteLine(MAX);`, opts: ['Błąd kompilacji', 'Wypisze 20', 'Wypisze 10', 'Wypisze 30'], a: 0, compiles: false, why: 'Stałej (const) nie można zmienić.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`int x = int.MaxValue;
x = x + 1;
Console.WriteLine(x);`, opts: ['-2147483648', '2147483648', '2147483647', 'Błąd kompilacji'], a: 0, out: true, why: 'int przepełnia się i „przekręca” na najmniejszą wartość.' },
   { t: 'code', l: 2, q: 'Zadeklaruj stałą <code>VAT</code> = <code>0.23m</code> oraz zmienną <code>cena</code> = <code>100m</code> (decimal). Wypisz cenę z VAT: <code>123.00</code>.',
     start: '// Twój kod\n', tests: [{ i: '', o: '123.00' }], check: "if (!/const\\s+decimal\\s+VAT/.test(src)) return 'Zadeklaruj stałą: const decimal VAT = 0.23m;';",
     sol: c`const decimal VAT = 0.23m;
decimal cena = 100m;
Console.WriteLine(cena + cena * VAT);`, hint: 'decimal pamięta liczbę miejsc po przecinku: 100m * 0.23m = 23.00.' },
  ] },
 { id: 'konwersje', title: 'Rzutowanie i konwersja typów',
  theory: `<p><b>Konwersja niejawna</b> odbywa się automatycznie, gdy nic nie tracimy: <code>int</code> → <code>long</code> → <code>double</code>. Np. <code>double d = 5;</code> jest poprawne.</p>
<p><b>Rzutowanie jawne</b> zapisujemy typem w nawiasie. Jest potrzebne, gdy możemy stracić dane: <code>int i = (int)3.99;</code> daje <b>3</b> (część ułamkowa jest <b>obcinana</b>, nie zaokrąglana!). <code>(char)65</code> daje <code>'A'</code>, a <code>(int)'A'</code> – 65.</p>
<p><b>Tekst na liczbę</b>: <code>int.Parse("42")</code>, <code>double.Parse("3.5")</code> albo <code>Convert.ToInt32("42")</code>. Gdy tekst nie jest liczbą, program zgłosi wyjątek <code>FormatException</code>. Bezpieczniej jest użyć <code>int.TryParse(tekst, out int liczba)</code> – zwraca <code>true</code>/<code>false</code>.</p>
<p><b>Liczba na tekst</b>: <code>x.ToString()</code> albo po prostu interpolacja <code>$"{x}"</code>.</p>`,
  more: `<p>Uwaga na różnicę: <code>(int)2.5</code> obcina do 2, a <code>Convert.ToInt32(2.5)</code> <b>zaokrągla</b> – i to „bankowo” (do najbliższej parzystej): 2.5 → 2, 3.5 → 4. Tak samo działa <code>Math.Round</code>.</p>`,
  ex: [
   { code: c`double srednia = 4.75;
int calkowita = (int)srednia;
Console.WriteLine(calkowita);
int litera = 'K';
Console.WriteLine(litera + " " + (char)(litera + 1));
string tekst = "42";
int liczba = int.Parse(tekst);
Console.WriteLine(liczba + 8);
Console.WriteLine(Convert.ToInt32(3.5) + " " + Convert.ToInt32(2.5));
if (int.TryParse("abc", out int wynik)) Console.WriteLine("Liczba!");
else Console.WriteLine("To nie jest liczba, wynik = " + wynik);`,
     scene: { s: 'cast', ft: 'double', fv: '4.75', tt: 'int', tv: '4', lost: '0.75', cap: 'Kapi przelewa duży kubek (double) do małego (int). Część ułamkowa 0.75 się wylewa – rzutowanie obcina, nie zaokrągla.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`double x = 9.99;
int y = (int)x;
Console.WriteLine(y);`, opts: ['9', '10', '9.99', 'Błąd'], a: 0, out: true, why: 'Rzutowanie (int) obcina część ułamkową.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`string a = "5";
string b = "3";
Console.WriteLine(a + b);
Console.WriteLine(int.Parse(a) + int.Parse(b));`, opts: ['53\n8', '8\n8', '53\n53', '8\n53'], a: 0, out: true, why: 'Dodawanie tekstów skleja je; po zamianie na liczby dodaje się arytmetycznie.' },
   { t: 'quiz', l: 2, q: 'Jaki wyjątek zgłosi program?', code: c`int n = int.Parse("pięć");
Console.WriteLine(n);`, opts: ['FormatException', 'DivideByZeroException', 'IndexOutOfRangeException', 'NullReferenceException'], a: 0, err: true, why: '"pięć" nie jest zapisem liczby.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`double cena = 19.99;
int zlote = cena;
Console.WriteLine(zlote);`, line: 1, fix: 'int zlote = (int)cena;', why: 'double → int może tracić dane, więc trzeba rzutować jawnie: (int)cena (CS0266).' },
   { t: 'fill', l: 2, q: 'Uzupełnij, aby zamienić tekst na liczbę całkowitą.', code: c`string wiek = "15";
int w = int.___(wiek);
Console.WriteLine(w + 1);`, ans: [['Parse']], expect: '16', why: 'int.Parse zamienia tekst na liczbę int.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`Console.WriteLine((int)'a');
Console.WriteLine((char)('a' + 2));`, opts: ['97\nc', 'a\nc', '97\n99', 'Błąd kompilacji'], a: 0, out: true, why: 'Kod znaku a to 97; 97 + 2 = 99 to kod litery c.' },
   { t: 'code', l: 3, q: 'Program dostaje w jednej linii tekst. Jeśli to liczba całkowita, wypisz jej podwojenie. W przeciwnym razie wypisz <code>Błąd</code>. Użyj <code>int.TryParse</code>.',
     start: 'string s = Console.ReadLine();\n', tests: [{ i: '21', o: '42' }, { i: 'kapi', o: 'Błąd' }, { i: '-5', o: '-10' }], check: "if (!/TryParse/.test(src)) return 'Użyj int.TryParse';",
     sol: c`string s = Console.ReadLine();
if (int.TryParse(s, out int n))
    Console.WriteLine(n * 2);
else
    Console.WriteLine("Błąd");`, hint: 'if (int.TryParse(s, out int n)) { ... } else { ... }' },
  ] },
 { id: 'wejscie', title: 'Wejście i wyjście w konsoli',
  theory: `<p><code>Console.ReadLine()</code> czeka, aż użytkownik wpisze linię i naciśnie Enter, a potem zwraca ją jako <b>string</b>. Liczby trzeba więc zamienić: <code>int a = int.Parse(Console.ReadLine());</code>.</p>
<p>W KapiPasta dane wejściowe wpisujesz w polu <b>„Dane wejściowe”</b> – każda linia to jedno wywołanie <code>ReadLine()</code>.</p>
<p>Formatowanie wyniku:</p>
<ul><li><code>$"{x:F2}"</code> – 2 miejsca po przecinku, <code>{x:N0}</code> – separator tysięcy, <code>{x:D3}</code> – zera wiodące (007),</li>
<li><code>$"{nazwa,10}"</code> – pole o szerokości 10 (wyrównanie do prawej), <code>{nazwa,-10}</code> – do lewej,</li>
<li>styl „klasyczny”: <code>Console.WriteLine("{0} ma {1} lat", imie, wiek);</code>.</li></ul>`,
  more: `<p>Kolory w konsoli: <code>Console.ForegroundColor = ConsoleColor.Green;</code>, a przywrócenie domyślnych – <code>Console.ResetColor();</code>. Gdy zabraknie danych, <code>ReadLine()</code> zwraca <code>null</code> – wtedy <code>int.Parse(null)</code> zgłosi <code>ArgumentNullException</code>.</p>`,
  ex: [
   { code: c`Console.Write("Jak masz na imię? ");
string imie = Console.ReadLine();
Console.Write("Ile masz lat? ");
int wiek = int.Parse(Console.ReadLine());
Console.WriteLine($"Cześć {imie}! Za 10 lat będziesz mieć {wiek + 10} lat.");
double kurs = 4.31579;
Console.WriteLine($"Kurs: {kurs:F2} | {1234567:N0} | {7:D3}");
Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Kapi jest zielony z zazdrości!");
Console.ResetColor();`, inp: 'Ola\n14',
     scene: { s: 'say', cap: 'Kapi słucha, co wpiszesz (ReadLine), i odpowiada na tabliczce. Liczby z wejścia najpierw zamienia int.Parse.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Jakiego typu wartość zwraca <code>Console.ReadLine()</code>?', opts: ['string', 'int', 'double', 'char'], a: 0, why: 'ReadLine zawsze zwraca tekst (string), a gdy brak danych – null.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program dla wejścia <code>7</code>?', code: c`string s = Console.ReadLine();
Console.WriteLine(s + 1);`, inp: '7', opts: ['71', '8', '7', 'Błąd'], a: 0, out: true, why: 's to tekst "7", więc + skleja: "7" + 1 = "71".' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`double cena = 7.5;
Console.WriteLine($"Cena: {cena:F2} zł");`, opts: ['Cena: 7.50 zł', 'Cena: 7.5 zł', 'Cena: 7 zł', 'Cena: {cena:F2} zł'], a: 0, out: true, why: 'F2 – zawsze 2 miejsca po przecinku.' },
   { t: 'fill', l: 2, q: 'Uzupełnij, aby wczytać liczbę całkowitą.', code: c`int n = int.Parse(Console.___());
Console.WriteLine(n * n);`, ans: [['ReadLine']], inp: '9', expect: '81', why: 'Console.ReadLine() czyta linię tekstu.' },
   { t: 'code', l: 1, q: 'Wczytaj imię i wypisz <code>Ahoj, IMIĘ!</code> (np. dla <code>Kapi</code>: <code>Ahoj, Kapi!</code>).',
     start: '// Twój kod\n', tests: [{ i: 'Kapi', o: 'Ahoj, Kapi!' }, { i: 'Ola', o: 'Ahoj, Ola!' }], sol: c`string imie = Console.ReadLine();
Console.WriteLine($"Ahoj, {imie}!");`, hint: 'string imie = Console.ReadLine();' },
   { t: 'code', l: 2, q: 'Wczytaj dwie liczby całkowite (każda w osobnej linii) i wypisz ich sumę i iloczyn w formacie <code>Suma: S, iloczyn: I</code>.',
     start: '// Twój kod\n', tests: [{ i: '3\n4', o: 'Suma: 7, iloczyn: 12' }, { i: '10\n-2', o: 'Suma: 8, iloczyn: -20' }],
     sol: c`int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
Console.WriteLine($"Suma: {a + b}, iloczyn: {a * b}");`, hint: 'Dwa razy int.Parse(Console.ReadLine()).' },
   { t: 'code', l: 3, q: 'Wczytaj cenę (liczba z kropką, np. <code>12.5</code>) i liczbę sztuk. Wypisz <code>Do zapłaty: X zł</code>, gdzie X ma dokładnie 2 miejsca po przecinku.',
     start: '// Twój kod\n', tests: [{ i: '12.5\n3', o: 'Do zapłaty: 37.50 zł' }, { i: '0.99\n10', o: 'Do zapłaty: 9.90 zł' }],
     sol: c`double cena = double.Parse(Console.ReadLine());
int sztuk = int.Parse(Console.ReadLine());
Console.WriteLine($"Do zapłaty: {cena * sztuk:F2} zł");`, hint: 'double.Parse oraz formatowanie {x:F2}.' },
  ] },
 ] });

CH.push({
 id: 'operatory', icon: { pirate: '⚓', kitchen: '🥣', hero: '⚡' },
 name: { pirate: 'Zatoka Operatorów', kitchen: 'Blender Operatorów', hero: 'Laboratorium Mocy', neutral: 'Operatory' },
 topic: 'arytmetyka, przypisania, porównania, logika, operatory bitowe, priorytety',
 outcomes: 'Stosuje operatory arytmetyczne, przypisania, porównania, logiczne, operatory do obsługi łańcuchów i bitowe; wykorzystuje priorytety operatorów do właściwego budowania wyrażeń.',
 lessons: [
 { id: 'arytm', title: 'Operatory arytmetyczne i przypisania',
  theory: `<p>Operatory arytmetyczne: <code>+ - * /</code> i <code>%</code> (reszta z dzielenia).</p>
<p>⚠️ <b>Dzielenie liczb całkowitych</b> daje liczbę całkowitą: <code>7 / 2</code> to <b>3</b>! Aby dostać 3.5, przynajmniej jedna liczba musi być typu <code>double</code>: <code>7 / 2.0</code> albo <code>(double)7 / 2</code>.</p>
<p><code>%</code> daje resztę: <code>7 % 2</code> = 1 (przydaje się do sprawdzania parzystości: <code>n % 2 == 0</code>).</p>
<p>Operatory przypisania: <code>x += 5</code> (to samo co <code>x = x + 5</code>), <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code>. <b>Inkrementacja</b> <code>x++</code> zwiększa o 1, <b>dekrementacja</b> <code>x--</code> zmniejsza o 1.</p>
<p>Operator <code>+</code> działa też na tekstach – <b>skleja</b> je: <code>"Ka" + "pi"</code> → <code>"Kapi"</code>.</p>`,
  more: `<p><code>x++</code> (postinkrementacja) zwraca starą wartość, a potem zwiększa; <code>++x</code> (preinkrementacja) najpierw zwiększa. <code>int a = 5; int b = a++;</code> → b = 5, a = 6. Biblioteka <code>Math</code> ma gotowe funkcje: <code>Math.Pow(2, 10)</code>, <code>Math.Sqrt(16)</code>, <code>Math.Abs(-3)</code>, <code>Math.Round(2.567, 2)</code>, <code>Math.Max(a, b)</code>.</p>`,
  ex: [
   { code: c`int pomarancze = 14;
int kapibary = 4;
Console.WriteLine($"Każda dostanie: {pomarancze / kapibary}");
Console.WriteLine($"Zostanie: {pomarancze % kapibary}");
Console.WriteLine($"Dokładnie: {(double)pomarancze / kapibary}");`,
     scene: { s: 'share', n: 14, k: 4, cap: 'Kapi rozdziela 14 pomarańczy do 4 koszyków. / mówi, ile trafi do każdego koszyka, a % – ile zostanie poza koszykami.' } },
   { code: c`int punkty = 10;
punkty += 5;
punkty *= 2;
punkty--;
Console.WriteLine(punkty);
string s = "Ka" + "pi";
s += "Pasta";
Console.WriteLine(s);
Console.WriteLine(Math.Pow(2, 10) + " " + Math.Sqrt(81) + " " + Math.Round(3.14159, 2));`, lvl: 2,
     scene: { s: 'cards', items: [['punkty += 5', '15'], ['punkty *= 2', '30'], ['punkty--', '29'], ['"Ka" + "pi" + "Pasta"', '"KapiPasta"', 'sklejanie']], cap: 'Każda karta to jedna operacja – Kapi pokazuje wartość po jej wykonaniu.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Console.WriteLine(7 / 2);`, opts: ['3', '3.5', '4', '3,5'], a: 0, out: true, why: 'Oba argumenty są int, więc dzielenie jest całkowite.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Console.WriteLine(17 % 5);`, opts: ['2', '3', '3.4', '5'], a: 0, out: true, why: '17 = 3·5 + 2, reszta to 2.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int x = 5;
x += 3;
x *= 2;
Console.WriteLine(x);`, opts: ['16', '13', '11', '10'], a: 0, out: true, why: '5 + 3 = 8, potem 8 · 2 = 16.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`Console.WriteLine(7 / 2.0);
Console.WriteLine(1 / 3 * 3);`, opts: ['3.5\n0', '3\n1', '3.5\n1', '3\n0'], a: 0, out: true, why: '7 / 2.0 to dzielenie double. 1 / 3 = 0 (całkowite), a 0 · 3 = 0.' },
   { t: 'bug', l: 2, q: 'Program ma policzyć średnią z dwóch ocen: 4 i 5, czyli 4.5. Wypisuje jednak 4. Kliknij linię z błędem.', code: c`int a = 4;
int b = 5;
double srednia = (a + b) / 2;
Console.WriteLine(srednia);`, line: 2, fix: 'double srednia = (a + b) / 2.0;', noerr: true, expect: '4.5', why: '(a + b) / 2 to dzielenie całkowite – wynik 4 jest zamieniany na double dopiero potem. Wystarczy 2.0.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`int a = 5;
int b = a++;
int c = ++a;
Console.WriteLine($"{a} {b} {c}");`, opts: ['7 5 7', '7 6 7', '6 5 6', '7 5 6'], a: 0, out: true, why: 'b dostaje starą wartość 5 (a → 6), potem ++a zwiększa do 7 i zwraca 7.' },
   { t: 'code', l: 2, q: 'Wczytaj liczbę sekund (int) i wypisz ją w formacie <code>M min S s</code>, np. dla 135: <code>2 min 15 s</code>.',
     start: 'int sekundy = int.Parse(Console.ReadLine());\n', tests: [{ i: '135', o: '2 min 15 s' }, { i: '59', o: '0 min 59 s' }, { i: '600', o: '10 min 0 s' }],
     sol: c`int sekundy = int.Parse(Console.ReadLine());
Console.WriteLine($"{sekundy / 60} min {sekundy % 60} s");`, hint: 'Minuty to sekundy / 60, a reszta to sekundy % 60.' },
  ] },
 { id: 'logika', title: 'Porównania, logika, bity i priorytety',
  theory: `<p><b>Operatory porównania</b> dają wartość <code>bool</code>: <code>==</code> (równe), <code>!=</code> (różne), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Uwaga: <code>=</code> to przypisanie, <code>==</code> to porównanie!</p>
<p><b>Operatory logiczne</b>: <code>&amp;&amp;</code> (i – oba warunki prawdziwe), <code>||</code> (lub – co najmniej jeden), <code>!</code> (nie – zaprzeczenie). <code>&amp;&amp;</code> i <code>||</code> są „leniwe”: gdy wynik jest znany po lewej stronie, prawa nie jest liczona.</p>
<p><b>Operatory bitowe</b> działają na pojedynczych bitach liczb: <code>&amp;</code> (AND), <code>|</code> (OR), <code>^</code> (XOR), <code>~</code> (negacja), <code>&lt;&lt;</code> / <code>&gt;&gt;</code> (przesunięcia; <code>1 &lt;&lt; 3</code> = 8).</p>
<p><b>Priorytety</b> (od najwyższego): <code>! ++ --</code> → <code>* / %</code> → <code>+ -</code> → <code>&lt;&lt; &gt;&gt;</code> → <code>&lt; &gt; &lt;= &gt;=</code> → <code>== !=</code> → <code>&amp;</code> → <code>^</code> → <code>|</code> → <code>&amp;&amp;</code> → <code>||</code> → <code>?:</code> → <code>= +=</code>... W razie wątpliwości – <b>nawiasy</b>!</p>
<p><b>Operator warunkowy</b> <code>warunek ? a : b</code> zwraca <code>a</code>, gdy warunek jest prawdziwy, w przeciwnym razie <code>b</code>.</p>`,
  ex: [
   { code: c`int wiek = 15;
bool maBilet = true;
Console.WriteLine(wiek >= 13 && maBilet);
Console.WriteLine(wiek < 10 || wiek > 60);
Console.WriteLine(!maBilet);
Console.WriteLine(2 + 3 * 4);
Console.WriteLine((2 + 3) * 4);
string opis = wiek >= 18 ? "dorosły" : "nastolatek";
Console.WriteLine(opis);`,
     scene: { s: 'cards', items: [['wiek >= 13 && maBilet', 'True', 'oba prawdziwe'], ['wiek < 10 || wiek > 60', 'False', 'żaden'], ['!maBilet', 'False'], ['2 + 3 * 4', '14', '* przed +'], ['(2 + 3) * 4', '20', 'nawiasy']], cap: 'Kapi sprawdza warunki jak bramkarz przy wejściu na statek: && wymaga spełnienia obu warunków, || wystarczy jeden.' } },
   { code: c`int a = 5;   // 0101
int b = 3;   // 0011
Console.WriteLine(a & b);
Console.WriteLine(a | b);
Console.WriteLine(a ^ b);
Console.WriteLine(1 << 3);`, lvl: 2,
     scene: { s: 'bits', rows: [['a', '0101', '5'], ['b', '0011', '3'], ['a & b', '0001', '1'], ['a | b', '0111', '7'], ['a ^ b', '0110', '6']], cap: 'Bity jak światełka: & zapala tylko tam, gdzie oba są zapalone, | – gdzie choć jedno, ^ – gdzie dokładnie jedno.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int x = 7;
Console.WriteLine(x > 5 && x < 10);`, opts: ['True', 'False', 'true', '1'], a: 0, out: true, why: 'Oba warunki są prawdziwe. C# wypisuje bool jako True/False.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Console.WriteLine(10 - 2 * 3);`, opts: ['4', '24', '-4', '6'], a: 0, out: true, why: 'Mnożenie ma wyższy priorytet: 10 − 6 = 4.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`int t = 30;
string s = t > 25 ? "gorąco" : "chłodno";
Console.WriteLine(s);`, opts: ['gorąco', 'chłodno', 'True', 'Błąd'], a: 0, out: true, why: 'Warunek t > 25 jest prawdziwy, więc wybrana jest pierwsza wartość.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`bool a = true, b = false;
Console.WriteLine(!a || b && a);`, opts: ['False', 'True', 'Błąd kompilacji', 'false'], a: 0, out: true, why: '! najpierw: !a = False. Potem && przed ||: b && a = False. False || False = False.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`Console.WriteLine(6 & 3);
Console.WriteLine(6 | 3);
Console.WriteLine(5 << 2);`, opts: ['2\n7\n20', '9\n9\n10', '2\n7\n10', '3\n6\n20'], a: 0, out: true, why: '110 & 011 = 010 (2), 110 | 011 = 111 (7), 5 · 2² = 20.' },
   { t: 'fill', l: 2, q: 'Uzupełnij warunek „liczba jest parzysta”.', code: c`int n = 14;
Console.WriteLine(n ___ 2 == 0);`, ans: [['%']], expect: 'True', why: 'Liczba parzysta daje resztę 0 z dzielenia przez 2.' },
   { t: 'code', l: 2, q: 'Wczytaj rok i wypisz <code>True</code>, jeśli jest przestępny, inaczej <code>False</code>. Rok jest przestępny, gdy dzieli się przez 4 i nie dzieli przez 100, albo dzieli się przez 400.',
     start: 'int rok = int.Parse(Console.ReadLine());\n', tests: [{ i: '2024', o: 'True' }, { i: '1900', o: 'False' }, { i: '2000', o: 'True' }, { i: '2023', o: 'False' }],
     sol: c`int rok = int.Parse(Console.ReadLine());
Console.WriteLine((rok % 4 == 0 && rok % 100 != 0) || rok % 400 == 0);`, hint: '(rok % 4 == 0 && rok % 100 != 0) || rok % 400 == 0' },
  ] },
 ] });

CH.push({
 id: 'warunki', icon: { pirate: '🧭', kitchen: '🍳', hero: '🔀' },
 name: { pirate: 'Rozstaje Warunków', kitchen: 'Decyzje Szefa Kuchni', hero: 'Wybory Bohatera', neutral: 'Warunki' },
 topic: 'if, else if, else, switch, switch expression',
 outcomes: 'Stosuje instrukcję warunkową i instrukcję wyboru; buduje złożone warunki logiczne.',
 lessons: [
 { id: 'if', title: 'Instrukcja if / else',
  theory: `<p>Instrukcja <code>if</code> wykonuje blok kodu tylko wtedy, gdy warunek jest prawdziwy:</p>
<pre>if (temperatura &gt; 30)
{
    Console.WriteLine("Kapi idzie się kąpać!");
}
else
{
    Console.WriteLine("Kapi wygrzewa się na słońcu.");
}</pre>
<p>Warunek zawsze w <b>nawiasach okrągłych</b> i musi mieć typ <code>bool</code>. Blok w <b>klamrach</b> (gdy jest jedna instrukcja, klamry można pominąć – ale lepiej ich nie pomijać).</p>
<p>Więcej przypadków obsługuje <code>else if</code>. Warunki sprawdzane są <b>po kolei</b> – wykona się tylko pierwszy pasujący blok.</p>`,
  more: `<p>Typowy błąd: <code>if (x = 5)</code> – to przypisanie, a nie porównanie. W C# to błąd kompilacji (int nie jest bool). Inny błąd: średnik zaraz po nawiasie – <code>if (x &gt; 5);</code> – kończy instrukcję if pustą instrukcją, a blok poniżej wykona się zawsze.</p>`,
  ex: [
   { code: c`int temperatura = 32;
if (temperatura > 30)
{
    Console.WriteLine("Kapi idzie się kąpać!");
}
else
{
    Console.WriteLine("Kapi wygrzewa się na słońcu.");
}`,
     scene: { s: 'fork', cond: 'temperatura > 30', val: 'True', yes: 'kąpiel 💦', no: 'słońce ☀️', cap: 'Warunek jest prawdziwy, więc Kapi wybiera lewą ścieżkę (if). Prawa (else) zostaje pominięta.' } },
   { code: c`int punkty = 73;
string ocena;
if (punkty >= 90) ocena = "celujący";
else if (punkty >= 75) ocena = "bardzo dobry";
else if (punkty >= 60) ocena = "dobry";
else ocena = "trzeba poćwiczyć";
Console.WriteLine(ocena);`,
     scene: { s: 'ladder', steps: [['punkty >= 90', false], ['punkty >= 75', false], ['punkty >= 60', true], ['else', null]], res: 'dobry', cap: 'Kapi sprawdza drzwi po kolei i wchodzi przez pierwsze, które się otworzą. Dalszych już nie sprawdza.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int x = 4;
if (x > 5)
{
    Console.WriteLine("duże");
}
else
{
    Console.WriteLine("małe");
}`, opts: ['małe', 'duże', 'duże\nmałe', 'nic'], a: 0, out: true, why: '4 > 5 jest fałszem, więc wykonuje się else.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int n = 85;
if (n >= 50) Console.WriteLine("A");
else if (n >= 80) Console.WriteLine("B");
else Console.WriteLine("C");`, opts: ['A', 'B', 'A\nB', 'C'], a: 0, out: true, why: 'Pierwszy pasujący warunek (n >= 50) wygrywa – dalsze nie są sprawdzane.' },
   { t: 'bug', l: 1, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`int wiek = 18;
if (wiek = 18)
{
    Console.WriteLine("Pełnoletni!");
}`, line: 1, fix: 'if (wiek == 18)', why: '= to przypisanie. Do porównania służy == (CS0029: int nie jest bool).' },
   { t: 'bug', l: 3, q: 'Program wypisuje „Zimno!” nawet przy 25 stopniach. Kliknij linię z błędem.', code: c`int t = 25;
if (t < 10);
{
    Console.WriteLine("Zimno!");
}`, line: 1, fix: 'if (t < 10)', noerr: true, expect: '', why: 'Średnik po if kończy instrukcję – blok w klamrach wykonuje się zawsze.' },
   { t: 'fill', l: 2, q: 'Uzupełnij program, który sprawdza, czy liczba jest dodatnia, ujemna, czy równa zero.', code: c`int n = -3;
if (n > 0) Console.WriteLine("dodatnia");
___ (n < 0) Console.WriteLine("ujemna");
___ Console.WriteLine("zero");`, ans: [['else if'], ['else']], expect: 'ujemna', why: 'Kolejne warunki to else if, a „wszystko inne” to else.' },
   { t: 'code', l: 1, q: 'Wczytaj liczbę całkowitą i wypisz <code>parzysta</code> albo <code>nieparzysta</code>.',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '8', o: 'parzysta' }, { i: '7', o: 'nieparzysta' }, { i: '-4', o: 'parzysta' }],
     sol: c`int n = int.Parse(Console.ReadLine());
if (n % 2 == 0) Console.WriteLine("parzysta");
else Console.WriteLine("nieparzysta");`, hint: 'n % 2 == 0' },
   { t: 'code', l: 2, q: 'Wczytaj trzy liczby całkowite (każda w osobnej linii) i wypisz największą. Nie używaj <code>Math.Max</code>.',
     start: 'int a = int.Parse(Console.ReadLine());\nint b = int.Parse(Console.ReadLine());\nint c = int.Parse(Console.ReadLine());\n', tests: [{ i: '3\n9\n5', o: '9' }, { i: '10\n2\n7', o: '10' }, { i: '-1\n-5\n-2', o: '-1' }], check: "if (/Math\\.Max/.test(src)) return 'Bez Math.Max – użyj if';",
     sol: c`int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
int c = int.Parse(Console.ReadLine());
int max = a;
if (b > max) max = b;
if (c > max) max = c;
Console.WriteLine(max);`, hint: 'Załóż, że max = a, a potem porównaj z b i c.' },
  ] },
 { id: 'switch', title: 'Instrukcja wyboru switch',
  theory: `<p>Gdy porównujemy jedną wartość z wieloma stałymi, wygodniejszy od wielu <code>if</code> jest <code>switch</code>:</p>
<pre>switch (dzien)
{
    case 1:
        Console.WriteLine("Poniedziałek");
        break;
    case 6:
    case 7:
        Console.WriteLine("Weekend!");
        break;
    default:
        Console.WriteLine("Inny dzień");
        break;
}</pre>
<p>Każda sekcja <code>case</code> musi kończyć się <code>break</code> (albo <code>return</code>/<code>throw</code>). C# <b>nie pozwala</b> „przelecieć” do następnego case – to błąd kompilacji CS0163. Kilka etykiet nad jednym blokiem (jak <code>case 6: case 7:</code>) jest w porządku. <code>default</code> obsługuje wszystkie pozostałe wartości.</p>
<p><code>switch</code> działa z liczbami, znakami, tekstami i typami wyliczeniowymi.</p>`,
  more: `<p>Nowoczesne C# ma też <b>wyrażenie switch</b>, które od razu zwraca wartość:</p><pre>string nazwa = dzien switch
{
    1 =&gt; "Poniedziałek",
    6 or 7 =&gt; "Weekend",
    &gt; 7 =&gt; "Błąd",
    _ =&gt; "Inny dzień"
};</pre><p><code>_</code> oznacza „każda inna wartość”.</p>`,
  ex: [
   { code: c`string danie = "pasta";
switch (danie)
{
    case "pasta":
        Console.WriteLine("Kapi gotuje 10 minut 🍝");
        break;
    case "pizza":
        Console.WriteLine("Kapi piecze 15 minut 🍕");
        break;
    default:
        Console.WriteLine("Kapi nie zna tego przepisu");
        break;
}`,
     scene: { s: 'ladder', steps: [['case "pasta"', true], ['case "pizza"', null], ['default', null]], res: 'Kapi gotuje 10 minut 🍝', cap: 'switch od razu skacze do pasującej etykiety case. break kończy całą instrukcję.' } },
   { code: c`int dzien = 6;
string nazwa = dzien switch
{
    1 => "Poniedziałek",
    5 => "Piątek",
    6 or 7 => "Weekend 🏖️",
    _ => "Zwykły dzień"
};
Console.WriteLine(nazwa);`, lvl: 2,
     scene: { s: 'cards', items: [['1 =>', '"Poniedziałek"'], ['5 =>', '"Piątek"'], ['6 or 7 =>', '"Weekend 🏖️"', 'pasuje!'], ['_ =>', '"Zwykły dzień"']], cap: 'Wyrażenie switch działa jak automat: dopasowuje wartość do wzorca i od razu zwraca wynik.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int n = 2;
switch (n)
{
    case 1: Console.WriteLine("jeden"); break;
    case 2: Console.WriteLine("dwa"); break;
    default: Console.WriteLine("dużo"); break;
}`, opts: ['dwa', 'jeden', 'dwa\ndużo', 'dużo'], a: 0, out: true, why: 'Wykonuje się tylko sekcja case 2, a break kończy switch.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`char znak = 'x';
switch (znak)
{
    case 'a': Console.WriteLine("A"); break;
    default: Console.WriteLine("?"); break;
}`, opts: ['?', 'A', 'x', 'nic'], a: 0, out: true, why: 'Żaden case nie pasuje, więc wykonuje się default.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`int ocena = 5;
switch (ocena)
{
    case 5:
        Console.WriteLine("bardzo dobry");
    case 4:
        Console.WriteLine("dobry");
        break;
}`, line: 3, fix: 'case 5: Console.WriteLine("bardzo dobry"); break;', why: 'Sekcja case 5 nie kończy się break – C# nie pozwala przejść do case 4 (CS0163).' },
   { t: 'fill', l: 2, q: 'Uzupełnij, aby obsłużyć wszystkie pozostałe przypadki.', code: c`string kolor = "fioletowy";
switch (kolor)
{
    case "czerwony": Console.WriteLine("stop"); break;
    case "zielony": Console.WriteLine("jedź"); break;
    ___: Console.WriteLine("nieznany"); break;
}`, ans: [['default']], expect: 'nieznany', why: 'default obsługuje wartości, które nie pasują do żadnego case.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`int t = 28;
string s = t switch
{
    < 0 => "mróz",
    < 15 => "chłodno",
    < 25 => "ciepło",
    _ => "upał"
};
Console.WriteLine(s);`, opts: ['upał', 'ciepło', 'chłodno', 'mróz'], a: 0, out: true, why: '28 nie spełnia warunków < 0, < 15 ani < 25, więc trafia do _.' },
   { t: 'code', l: 2, q: 'Wczytaj numer miesiąca (1–12) i wypisz porę roku: <code>zima</code> (12, 1, 2), <code>wiosna</code> (3–5), <code>lato</code> (6–8), <code>jesień</code> (9–11). Dla innej liczby wypisz <code>błąd</code>. Użyj <code>switch</code>.',
     start: 'int m = int.Parse(Console.ReadLine());\n', tests: [{ i: '1', o: 'zima' }, { i: '4', o: 'wiosna' }, { i: '8', o: 'lato' }, { i: '10', o: 'jesień' }, { i: '12', o: 'zima' }, { i: '13', o: 'błąd' }], check: "if (!/switch/.test(src)) return 'Użyj switch';",
     sol: c`int m = int.Parse(Console.ReadLine());
switch (m)
{
    case 12: case 1: case 2: Console.WriteLine("zima"); break;
    case 3: case 4: case 5: Console.WriteLine("wiosna"); break;
    case 6: case 7: case 8: Console.WriteLine("lato"); break;
    case 9: case 10: case 11: Console.WriteLine("jesień"); break;
    default: Console.WriteLine("błąd"); break;
}`, hint: 'Kilka etykiet case może prowadzić do jednego bloku: case 12: case 1: case 2: ...' },
  ] },
 ] });
