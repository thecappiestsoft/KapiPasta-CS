// Rozdziały 5–8: pętle, tablice i teksty, metody, klasy i obiekty

CH.push({
 id: 'petle', icon: { pirate: '🌀', kitchen: '🥄', hero: '🔁' },
 name: { pirate: 'Wir Pętli', kitchen: 'Mieszanie w Pętli', hero: 'Trening w Pętli', neutral: 'Petle' },
 topic: 'for, while, do-while, break, continue, pętle zagnieżdżone',
 outcomes: 'Stosuje instrukcje pętli (for, while, do-while, foreach); stosuje instrukcje break i continue; implementuje proste algorytmy iteracyjne.',
 lessons: [
 { id: 'for', title: 'Pętla for',
  theory: `<p>Pętla <code>for</code> powtarza blok kodu określoną liczbę razy:</p>
<pre>for (int i = 1; i &lt;= 5; i++)
{
    Console.WriteLine(i);
}</pre>
<p>W nawiasie są trzy części oddzielone średnikami:</p>
<ol><li><b>inicjalizacja</b> – <code>int i = 1</code> (wykonuje się raz, na początku),</li>
<li><b>warunek</b> – <code>i &lt;= 5</code> (sprawdzany przed każdym obrotem; gdy jest fałszywy, pętla się kończy),</li>
<li><b>krok</b> – <code>i++</code> (wykonuje się po każdym obrocie).</li></ol>
<p>Zmienna <code>i</code> to <b>licznik pętli</b> – istnieje tylko wewnątrz pętli. Licznik może też maleć (<code>i--</code>) albo zmieniać się o inny krok (<code>i += 2</code>).</p>`,
  more: `<p>Typowy wzorzec – <b>sumowanie</b>: przed pętlą <code>int suma = 0;</code>, w pętli <code>suma += i;</code>. Wzorzec <b>zliczania</b>: <code>if (warunek) licznik++;</code>. Uwaga na <b>błąd o jeden</b> (off-by-one): <code>i &lt; 5</code> daje 5 obrotów od 0 do 4, a <code>i &lt;= 5</code> – 6 obrotów od 0 do 5.</p>`,
  ex: [
   { code: c`for (int i = 1; i <= 5; i++)
{
    Console.WriteLine($"Kapi zjada pomarańczę nr {i} 🍊");
}`,
     scene: { s: 'loop', items: ['1', '2', '3', '4', '5'], cap: 'Kapi przechodzi po kolejnych wartościach licznika i. Przy każdej zjada jedną pomarańczę.' } },
   { code: c`int suma = 0;
for (int i = 1; i <= 4; i++)
{
    suma += i;
}
Console.WriteLine($"Suma 1..4 = {suma}");
for (int k = 10; k > 0; k -= 3) Console.Write(k + " ");`,
     scene: { s: 'loop', items: ['1', '2', '3', '4'], acc: 'suma', accv: ['1', '3', '6', '10'], cap: 'Akumulator suma rośnie przy każdym obrocie: 1, 3, 6, 10. To klasyczny wzorzec sumowania.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`for (int i = 0; i < 3; i++)
{
    Console.Write(i);
}`, opts: ['012', '123', '0123', '01'], a: 0, out: true, why: 'i przyjmuje 0, 1, 2. Przy i = 3 warunek i < 3 jest fałszywy.' },
   { t: 'quiz', l: 1, q: 'Ile razy wykona się pętla?', code: c`for (int i = 1; i <= 10; i++)
{
    Console.WriteLine("Kwik!");
}`, opts: ['10', '9', '11', '1'], a: 0, why: 'i od 1 do 10 włącznie to 10 obrotów.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`for (int i = 10; i >= 0; i -= 4)
{
    Console.Write(i + " ");
}`, opts: ['10 6 2 ', '10 6 2 -2 ', '10 7 4 1 ', '10 6 '], a: 0, out: true, why: '10, 6, 2 – następna wartość −2 nie spełnia warunku i >= 0.' },
   { t: 'fill', l: 1, q: 'Uzupełnij pętlę, aby wypisała liczby od 1 do 5.', code: c`for (int i = 1; i ___ 5; i++)
{
    Console.Write(i);
}`, ans: [['<=']], expect: '12345', why: 'Aby objąć 5, warunek musi być i <= 5.' },
   { t: 'bug', l: 2, q: 'Program miał policzyć sumę liczb od 1 do 5, czyli 15. Wypisuje jednak 10. Kliknij linię z błędem.', code: c`int suma = 0;
for (int i = 1; i < 5; i++)
{
    suma += i;
}
Console.WriteLine(suma);`, line: 1, fix: 'for (int i = 1; i <= 5; i++)', noerr: true, expect: '15', why: 'i < 5 pomija 5 – to klasyczny błąd o jeden.' },
   { t: 'code', l: 1, q: 'Wczytaj liczbę <code>n</code> i wypisz tabliczkę mnożenia przez 7 dla 1..n w formacie <code>1 x 7 = 7</code> (każda w nowej linii).',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '3', o: '1 x 7 = 7\n2 x 7 = 14\n3 x 7 = 21' }, { i: '1', o: '1 x 7 = 7' }],
     sol: c`int n = int.Parse(Console.ReadLine());
for (int i = 1; i <= n; i++)
{
    Console.WriteLine($"{i} x 7 = {i * 7}");
}`, hint: 'for (int i = 1; i <= n; i++) i interpolacja $"{i} x 7 = {i * 7}".' },
   { t: 'code', l: 2, q: 'Wczytaj <code>n</code> i wypisz <b>silnię</b> n! (iloczyn 1·2·…·n). Dla n = 0 wynik to 1. Użyj typu <code>long</code> (n ≤ 20).',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '5', o: '120' }, { i: '0', o: '1' }, { i: '20', o: '2432902008176640000' }],
     sol: c`int n = int.Parse(Console.ReadLine());
long wynik = 1;
for (int i = 2; i <= n; i++) wynik *= i;
Console.WriteLine(wynik);`, hint: 'Zacznij od long wynik = 1 i w pętli mnóż wynik *= i.' },
  ] },
 { id: 'while', title: 'Pętle while i do-while',
  theory: `<p>Pętla <code>while</code> powtarza blok, <b>dopóki</b> warunek jest prawdziwy. Używamy jej, gdy nie wiemy z góry, ile będzie powtórzeń:</p>
<pre>while (energia &gt; 0)
{
    energia -= 30;
}</pre>
<p>Warunek sprawdzany jest <b>przed</b> każdym obrotem – jeśli od początku jest fałszywy, pętla nie wykona się ani razu.</p>
<p>Pętla <code>do { ... } while (warunek);</code> sprawdza warunek <b>po</b> obrocie, więc wykona się <b>co najmniej raz</b>. Przydaje się np. przy pytaniu użytkownika, aż poda poprawne dane. Uwaga na średnik po <code>while (...)</code>!</p>
<p>⚠️ Jeśli warunek nigdy nie stanie się fałszywy, powstaje <b>pętla nieskończona</b>.</p>`,
  ex: [
   { code: c`int energia = 100;
int plywania = 0;
while (energia > 0)
{
    energia -= 30;
    plywania++;
    Console.WriteLine($"Pływanie {plywania}, energia: {energia}");
}
Console.WriteLine("Kapi idzie spać 😴");`,
     scene: { s: 'loop', items: ['100', '70', '40', '10'], cap: 'Kapi pływa, dopóki ma energię. Każde pływanie zabiera 30 – po czwartym energia spada poniżej zera i pętla się kończy.' } },
   { code: c`int liczba;
int proba = 0;
do
{
    liczba = int.Parse(Console.ReadLine());
    proba++;
} while (liczba < 1 || liczba > 10);
Console.WriteLine($"Dobrze! {liczba} po {proba} próbach");`, inp: '42\n-1\n7',
     scene: { s: 'loop', items: ['42 ❌', '-1 ❌', '7 ✅'], cap: 'do-while pyta co najmniej raz i powtarza pytanie, dopóki liczba nie trafi w zakres 1–10.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int x = 1;
while (x < 20)
{
    x *= 3;
}
Console.WriteLine(x);`, opts: ['27', '9', '20', '81'], a: 0, out: true, why: '1 → 3 → 9 → 27. Przy 27 warunek x < 20 jest fałszywy.' },
   { t: 'quiz', l: 1, q: 'Ile razy wypisze się „Hej”?', code: c`int n = 5;
while (n < 3)
{
    Console.WriteLine("Hej");
}`, opts: ['0', '1', '3', 'nieskończenie wiele'], a: 0, why: 'Warunek 5 < 3 jest fałszywy od początku – while nie wykona się ani razu.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`int n = 5;
do
{
    Console.Write(n);
    n++;
} while (n < 3);`, opts: ['5', '', '56', '345'], a: 0, out: true, why: 'do-while wykonuje się co najmniej raz, potem warunek 6 < 3 kończy pętlę.' },
   { t: 'bug', l: 2, q: 'Pętla nigdy się nie kończy (program działa za długo). Kliknij linię, którą trzeba poprawić.', code: c`int i = 0;
while (i < 5)
{
    Console.WriteLine(i);
    i--;
}`, line: 4, fix: 'i++;', cause: true, why: 'Licznik maleje, więc i < 5 jest zawsze prawdziwe. Trzeba zwiększać licznik: i++.' },
   { t: 'code', l: 2, q: 'Wczytaj liczbę naturalną i wypisz <b>sumę jej cyfr</b>. Np. dla 4096: 19. Użyj pętli <code>while</code> oraz operatorów <code>%</code> i <code>/</code>.',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '4096', o: '19' }, { i: '7', o: '7' }, { i: '0', o: '0' }], check: "if (!/while/.test(src)) return 'Użyj pętli while';",
     sol: c`int n = int.Parse(Console.ReadLine());
int suma = 0;
while (n > 0)
{
    suma += n % 10;
    n /= 10;
}
Console.WriteLine(suma);`, hint: 'n % 10 to ostatnia cyfra, a n /= 10 ją usuwa.' },
   { t: 'code', l: 3, q: 'Wczytuj liczby całkowite (każda w osobnej linii), aż trafisz na <code>0</code>. Wypisz ich sumę (bez zera) i liczbę wczytanych liczb dodatnich w formacie <code>suma=S dodatnie=D</code>.',
     start: '// Twój kod\n', tests: [{ i: '5\n-2\n7\n0', o: 'suma=10 dodatnie=2' }, { i: '0', o: 'suma=0 dodatnie=0' }, { i: '1\n1\n1\n0\n9', o: 'suma=3 dodatnie=3' }],
     sol: c`int suma = 0, dodatnie = 0;
int x = int.Parse(Console.ReadLine());
while (x != 0)
{
    suma += x;
    if (x > 0) dodatnie++;
    x = int.Parse(Console.ReadLine());
}
Console.WriteLine($"suma={suma} dodatnie={dodatnie}");`, hint: 'Wczytaj pierwszą liczbę przed pętlą, a kolejne na końcu każdego obrotu.' },
  ] },
 { id: 'breakcont', title: 'break, continue i pętle zagnieżdżone',
  theory: `<p><code>break</code> natychmiast <b>przerywa</b> całą pętlę. <code>continue</code> <b>pomija resztę bieżącego obrotu</b> i przechodzi do następnego.</p>
<p><b>Pętle zagnieżdżone</b> to pętla w pętli. Wewnętrzna wykonuje się w całości przy każdym obrocie zewnętrznej – tak tworzy się np. tabliczkę mnożenia albo rysuje kształty z gwiazdek:</p>
<pre>for (int w = 1; w &lt;= 3; w++)
{
    for (int k = 1; k &lt;= 4; k++)
        Console.Write("*");
    Console.WriteLine();
}</pre>
<p><code>break</code> w pętli zagnieżdżonej przerywa tylko <b>najbliższą</b> (wewnętrzną) pętlę.</p>`,
  ex: [
   { code: c`for (int i = 1; i <= 10; i++)
{
    if (i % 3 == 0) continue;
    if (i > 7) break;
    Console.Write(i + " ");
}`,
     scene: { s: 'loop', items: ['1', '2', '3⏭', '4', '5', '6⏭', '7', '8⛔'], cap: 'Kapi przeskakuje liczby podzielne przez 3 (continue), a przy 8 kończy spacer (break).' } },
   { code: c`for (int w = 1; w <= 4; w++)
{
    for (int k = 1; k <= w; k++)
    {
        Console.Write("🍊");
    }
    Console.WriteLine();
}`,
     scene: { s: 'grid', rows: 4, cols: 4, tri: true, emo: '🍊', cap: 'Zewnętrzna pętla to wiersze, wewnętrzna – pomarańcze w wierszu. W wierszu nr w jest w pomarańczy.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`for (int i = 1; i <= 5; i++)
{
    if (i == 3) break;
    Console.Write(i);
}`, opts: ['12', '123', '1245', '12345'], a: 0, out: true, why: 'Przy i == 3 pętla jest przerywana przed wypisaniem.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`for (int i = 1; i <= 5; i++)
{
    if (i == 3) continue;
    Console.Write(i);
}`, opts: ['1245', '12', '12345', '345'], a: 0, out: true, why: 'continue pomija tylko obrót z i == 3.' },
   { t: 'quiz', l: 2, q: 'Ile gwiazdek wypisze program?', code: c`for (int a = 0; a < 3; a++)
    for (int b = 0; b < 4; b++)
        Console.Write("*");`, opts: ['12', '7', '3', '4'], a: 0, why: 'Wewnętrzna pętla (4 obroty) wykonuje się 3 razy: 3 · 4 = 12.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`for (int i = 1; i <= 3; i++)
{
    for (int j = 1; j <= 3; j++)
    {
        if (j == 2) break;
        Console.Write($"{i}{j} ");
    }
}`, opts: ['11 21 31 ', '11 ', '11 12 ', '11 21 31 12 22 32 '], a: 0, out: true, why: 'break przerywa tylko wewnętrzną pętlę – zewnętrzna działa dalej.' },
   { t: 'code', l: 2, q: 'Wczytaj <code>n</code> i narysuj kwadrat n×n ze znaków <code>#</code> (n linii po n znaków).',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '3', o: '###\n###\n###' }, { i: '1', o: '#' }],
     sol: c`int n = int.Parse(Console.ReadLine());
for (int w = 0; w < n; w++)
{
    for (int k = 0; k < n; k++) Console.Write("#");
    Console.WriteLine();
}`, hint: 'Pętla w pętli: zewnętrzna – wiersze, wewnętrzna – znaki w wierszu.' },
   { t: 'code', l: 3, q: 'Wczytaj <code>n</code> i wypisz wszystkie liczby od 1 do n, które są podzielne przez 3 lub 5, oddzielone spacją. Ale gdy suma wypisanych liczb przekroczy 50, zakończ (liczba, która przekroczyła sumę, ma być jeszcze wypisana).',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '10', o: '3 5 6 9 10' }, { i: '100', o: '3 5 6 9 10 12 15' }],
     sol: c`int n = int.Parse(Console.ReadLine());
int suma = 0;
string wynik = "";
for (int i = 1; i <= n; i++)
{
    if (i % 3 != 0 && i % 5 != 0) continue;
    wynik += (wynik == "" ? "" : " ") + i;
    suma += i;
    if (suma > 50) break;
}
Console.WriteLine(wynik);`, hint: 'continue dla liczb, które nie pasują; break, gdy suma > 50.' },
  ] },
 ] });

CH.push({
 id: 'tablice', icon: { pirate: '📦', kitchen: '🥫', hero: '🗃️' },
 name: { pirate: 'Skrzynie Tablic', kitchen: 'Szuflady i Teksty', hero: 'Kwatera Tablic', neutral: 'TabliceITeksty' },
 topic: 'tablice, foreach, tablice 2D, string, StringBuilder',
 outcomes: 'Stosuje złożone typy danych (tablice jedno- i wielowymiarowe) i operacje na nich; stosuje operatory i metody do obsługi łańcuchów znaków.',
 lessons: [
 { id: 'tablice1', title: 'Tablice i foreach',
  theory: `<p><b>Tablica</b> przechowuje wiele wartości tego samego typu pod jedną nazwą. Ma stały rozmiar.</p>
<pre>int[] punkty = new int[5];          // 5 zer
string[] imiona = { "Kapi", "Ola", "Ala" };</pre>
<p>Do elementów odwołujemy się przez <b>indeks</b> w nawiasach kwadratowych. Indeksy zaczynają się od <b>0</b>, więc ostatni element ma indeks <code>Length - 1</code>. Odwołanie poza zakres zgłasza wyjątek <code>IndexOutOfRangeException</code>.</p>
<p><code>tablica.Length</code> to liczba elementów. Tablicę przechodzimy pętlą <code>for</code> (gdy potrzebny jest indeks) albo <code>foreach</code> (gdy wystarczą same wartości):</p>
<pre>foreach (string imie in imiona)
    Console.WriteLine(imie);</pre>`,
  more: `<p>Przydatne metody: <code>Array.Sort(t)</code> – sortowanie, <code>Array.Reverse(t)</code> – odwrócenie, <code>Array.IndexOf(t, x)</code> – pozycja elementu (−1, gdy go brak), <code>string.Join(", ", t)</code> – sklejenie elementów w tekst. Zmienna <code>foreach</code> jest tylko do odczytu – nie można jej przypisać nowej wartości.</p>`,
  ex: [
   { code: c`string[] owoce = { "pomarańcza", "arbuz", "jabłko", "melon" };
Console.WriteLine($"Owoców: {owoce.Length}");
Console.WriteLine($"Pierwszy: {owoce[0]}, ostatni: {owoce[owoce.Length - 1]}");
owoce[2] = "banan";
foreach (string o in owoce)
{
    Console.Write(o + " ");
}`,
     scene: { s: 'row', items: ['pomarańcza', 'arbuz', 'banan', 'melon'], hl: [2, 3], label: 'owoce[2] = "banan"', cap: 'Skrzynie Kapi mają numery od 0. Element owoce[2] to trzecia skrzynia – Kapi wkłada do niej banana.' } },
   { code: c`int[] liczby = { 7, 3, 9, 1, 5 };
int suma = 0;
int max = liczby[0];
for (int i = 0; i < liczby.Length; i++)
{
    suma += liczby[i];
    if (liczby[i] > max) max = liczby[i];
}
Console.WriteLine($"Suma: {suma}, max: {max}");
Array.Sort(liczby);
Console.WriteLine(string.Join(", ", liczby));`, lvl: 2,
     scene: { s: 'loop', items: ['7', '3', '9', '1', '5'], acc: 'max', accv: ['7', '7', '9', '9', '9'], cap: 'Kapi idzie wzdłuż tablicy i pamięta największą dotąd liczbę. To wzorzec szukania maksimum.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int[] t = { 10, 20, 30 };
Console.WriteLine(t[1]);`, opts: ['20', '10', '30', 'Błąd'], a: 0, out: true, why: 'Indeksy zaczynają się od 0, więc t[1] to drugi element.' },
   { t: 'quiz', l: 1, q: 'Jaki wyjątek zgłosi program?', code: c`int[] t = new int[3];
t[3] = 5;`, opts: ['IndexOutOfRangeException', 'NullReferenceException', 'FormatException', 'Program zadziała'], a: 0, err: true, why: 'Tablica 3-elementowa ma indeksy 0, 1, 2.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`int[] t = new int[4];
t[1] = 5;
foreach (int x in t) Console.Write(x);`, opts: ['0500', '5', '5000', '0000'], a: 0, out: true, why: 'Nowa tablica int jest wypełniona zerami; zmieniamy tylko element o indeksie 1.' },
   { t: 'fill', l: 1, q: 'Uzupełnij, aby wypisać wszystkie elementy tablicy.', code: c`string[] imiona = { "Kapi", "Ola" };
foreach (string im ___ imiona)
{
    Console.WriteLine(im);
}`, ans: [['in']], expect: 'Kapi\nOla', why: 'Składnia: foreach (typ nazwa in kolekcja).' },
   { t: 'bug', l: 2, q: 'Program zatrzymuje się z wyjątkiem. Kliknij linię z błędem.', code: c`int[] t = { 4, 8, 15 };
for (int i = 0; i <= t.Length; i++)
{
    Console.WriteLine(t[i]);
}`, line: 1, fix: 'for (int i = 0; i < t.Length; i++)', cause: true, why: 'Przy i == t.Length wychodzimy poza tablicę. Warunek ma być i < t.Length.' },
   { t: 'code', l: 2, q: 'W pierwszej linii jest liczba <code>n</code>, a w kolejnych n liczb całkowitych. Wczytaj je do tablicy i wypisz <b>średnią</b> z dokładnością do 2 miejsc (<code>F2</code>).',
     start: 'int n = int.Parse(Console.ReadLine());\nint[] t = new int[n];\n', tests: [{ i: '4\n2\n4\n5\n6', o: '4.25' }, { i: '1\n7', o: '7.00' }],
     sol: c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
for (int i = 0; i < n; i++) t[i] = int.Parse(Console.ReadLine());
int suma = 0;
foreach (int x in t) suma += x;
Console.WriteLine($"{(double)suma / n:F2}");`, hint: 'Pamiętaj o (double) przy dzieleniu.' },
   { t: 'code', l: 3, q: 'Wczytaj <code>n</code> i n liczb. Wypisz liczby w <b>odwrotnej kolejności</b>, oddzielone spacją, a w drugiej linii – ile z nich jest większych od średniej.',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '5\n1\n2\n3\n4\n10', o: '10 4 3 2 1\n1' }, { i: '3\n5\n5\n5', o: '5 5 5\n0' }],
     sol: c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
double suma = 0;
for (int i = 0; i < n; i++) { t[i] = int.Parse(Console.ReadLine()); suma += t[i]; }
double sr = suma / n;
string s = "";
for (int i = n - 1; i >= 0; i--) s += t[i] + (i > 0 ? " " : "");
Console.WriteLine(s);
int ile = 0;
foreach (int x in t) if (x > sr) ile++;
Console.WriteLine(ile);`, hint: 'Pętla od n - 1 do 0 wypisze tablicę od końca.' },
  ] },
 { id: 'tablice2', title: 'Tablice dwuwymiarowe i postrzępione',
  theory: `<p><b>Tablica dwuwymiarowa</b> (prostokątna) przypomina tabelę z wierszami i kolumnami:</p>
<pre>int[,] plansza = new int[3, 4];   // 3 wiersze, 4 kolumny
plansza[1, 2] = 7;</pre>
<p>Rozmiar w wymiarach daje <code>GetLength(0)</code> (wiersze) i <code>GetLength(1)</code> (kolumny), a <code>Length</code> – liczbę wszystkich komórek. Inicjalizacja: <code>int[,] m = { {1, 2}, {3, 4} };</code>.</p>
<p><b>Tablica postrzępiona</b> (jagged) to tablica tablic – każdy wiersz może mieć inną długość:</p>
<pre>int[][] t = new int[3][];
t[0] = new int[] { 1 };
t[1] = new int[] { 1, 2, 3 };</pre>`,
  ex: [
   { code: c`int[,] mapa = new int[3, 4];
mapa[1, 2] = 7;
mapa[2, 0] = 1;
for (int w = 0; w < mapa.GetLength(0); w++)
{
    for (int k = 0; k < mapa.GetLength(1); k++)
    {
        Console.Write(mapa[w, k] + " ");
    }
    Console.WriteLine();
}
Console.WriteLine($"Komórek: {mapa.Length}");`,
     scene: { s: 'grid', rows: 3, cols: 4, emo: '🗺️', cap: 'Mapa skarbów Kapi ma 3 wiersze i 4 kolumny. Pętla zewnętrzna idzie po wierszach, a wewnętrzna – po kolumnach.' } },
   { code: c`int[][] schody = new int[4][];
for (int i = 0; i < schody.Length; i++)
{
    schody[i] = new int[i + 1];
    for (int j = 0; j <= i; j++) schody[i][j] = j + 1;
}
foreach (int[] wiersz in schody)
{
    Console.WriteLine(string.Join(" ", wiersz));
}`, lvl: 2,
     scene: { s: 'grid', rows: 4, cols: 4, tri: true, emo: '🪜', cap: 'W tablicy postrzępionej każdy wiersz ma inną długość – jak schodki, po których wspina się Kapi.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`int[,] m = { { 1, 2, 3 }, { 4, 5, 6 } };
Console.WriteLine(m[1, 0]);`, opts: ['4', '2', '1', '5'], a: 0, out: true, why: 'Wiersz 1 (drugi), kolumna 0 (pierwsza) to 4.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`int[,] m = new int[3, 5];
Console.WriteLine(m.GetLength(0) + " " + m.GetLength(1) + " " + m.Length);`, opts: ['3 5 15', '5 3 15', '3 5 8', '15 15 15'], a: 0, out: true, why: 'GetLength(0) – wiersze, GetLength(1) – kolumny, Length – wszystkie komórki.' },
   { t: 'fill', l: 2, q: 'Uzupełnij deklarację tablicy 2×2.', code: c`int___ m = new int[2, 2];
m[0, 1] = 9;
Console.WriteLine(m[0, 1]);`, ans: [['[,]']], expect: '9', why: 'Tablicę dwuwymiarową deklarujemy typem int[,].' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`int[][] t = new int[2][];
t[0] = new int[] { 1, 2, 3 };
t[1] = new int[] { 4 };
Console.WriteLine(t[0].Length + t[1].Length);`, opts: ['4', '2', '6', '13'], a: 0, out: true, why: 'Pierwszy wiersz ma 3 elementy, drugi 1: razem 4.' },
   { t: 'code', l: 2, q: 'Wczytaj <code>n</code> i wypisz tabliczkę mnożenia n×n. Liczby w wierszu oddziel spacją. Najpierw zapisz wyniki w tablicy <code>int[,]</code>.',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '3', o: '1 2 3\n2 4 6\n3 6 9' }, { i: '1', o: '1' }], check: "if (!/\\[,\\]/.test(src)) return 'Użyj tablicy int[,]';",
     sol: c`int n = int.Parse(Console.ReadLine());
int[,] t = new int[n, n];
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        t[i, j] = (i + 1) * (j + 1);
for (int i = 0; i < n; i++)
{
    string w = "";
    for (int j = 0; j < n; j++) w += t[i, j] + (j < n - 1 ? " " : "");
    Console.WriteLine(w);
}`, hint: 't[i, j] = (i + 1) * (j + 1);' },
  ] },
 { id: 'stringi', title: 'Typy łańcuchowe: string i StringBuilder',
  theory: `<p><code>string</code> to ciąg znaków. Najważniejsze właściwości i metody:</p>
<ul><li><code>s.Length</code> – długość, <code>s[0]</code> – pierwszy znak (typ <code>char</code>),</li>
<li><code>ToUpper()</code>, <code>ToLower()</code>, <code>Trim()</code> (usuwa spacje z brzegów),</li>
<li><code>Substring(start, dlugosc)</code>, <code>IndexOf("x")</code>, <code>Contains("x")</code>, <code>StartsWith</code>, <code>EndsWith</code>,</li>
<li><code>Replace("a", "b")</code>, <code>Split(' ')</code> – dzieli tekst na tablicę, <code>string.Join</code> – skleja z powrotem,</li>
<li>porównanie: <code>==</code> (uwzględnia wielkość liter).</li></ul>
<p>Stringi są <b>niezmienne</b> (immutable): metody nie zmieniają tekstu, tylko zwracają nowy. <code>s.ToUpper();</code> bez przypisania nic nie da – trzeba napisać <code>s = s.ToUpper();</code>.</p>`,
  more: `<p>Gdy w pętli skleja się bardzo dużo tekstu, lepszy jest <code>StringBuilder</code> (przestrzeń <code>System.Text</code>): <code>var sb = new StringBuilder(); sb.Append("Kapi"); sb.AppendLine("!"); string wynik = sb.ToString();</code>. Nie tworzy on nowego tekstu przy każdym dopisaniu.</p>`,
  ex: [
   { code: c`string tekst = "  Kapi lubi pomarańcze  ";
string t = tekst.Trim();
Console.WriteLine($"[{t}] ma {t.Length} znaków");
Console.WriteLine(t.ToUpper());
Console.WriteLine(t.Substring(5, 4));
Console.WriteLine(t.Replace("pomarańcze", "arbuzy"));
Console.WriteLine(t.Contains("lubi") + " " + t.IndexOf("lubi"));
string[] slowa = t.Split(' ');
Console.WriteLine($"Słów: {slowa.Length}, pierwsza litera: {t[0]}");`,
     scene: { s: 'row', items: ['K', 'a', 'p', 'i', ' ', 'l', 'u', 'b', 'i'], hl: [5, 9], label: 't.Substring(5, 4) → "lubi"', cap: 'Tekst to rząd znaków z numerami od 0. Substring(5, 4) wycina 4 znaki, zaczynając od pozycji 5.' } },
   { code: c`using System.Text;

var sb = new StringBuilder();
for (int i = 1; i <= 5; i++)
{
    sb.Append(i);
    if (i < 5) sb.Append(" -> ");
}
sb.AppendLine();
sb.Append("Koniec!");
Console.WriteLine(sb.ToString());
string imie = "kapi";
string ladne = char.ToUpper(imie[0]) + imie.Substring(1);
Console.WriteLine(ladne);`, lvl: 2,
     scene: { s: 'cards', items: [['sb.Append(1)', '"1"'], ['sb.Append(" -> ")', '"1 -> "'], ['...', '"1 -> 2 -> 3 -> 4 -> 5"'], ['char.ToUpper(\'k\') + "api"', '"Kapi"']], cap: 'StringBuilder to zeszyt Kapi: dopisuje kolejne kawałki, zamiast za każdym razem przepisywać wszystko od nowa.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`string s = "KapiPasta";
Console.WriteLine(s.Length);
Console.WriteLine(s[4]);`, opts: ['9\nP', '9\na', '8\nP', '10\nP'], a: 0, out: true, why: 'Tekst ma 9 znaków; znak o indeksie 4 to piąty znak – P.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`string s = "kapi";
s.ToUpper();
Console.WriteLine(s);`, opts: ['kapi', 'KAPI', 'Kapi', 'Błąd'], a: 0, out: true, why: 'string jest niezmienny – wynik ToUpper() nie został przypisany do s.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`string s = "pomarańcza";
Console.WriteLine(s.Substring(2, 3));
Console.WriteLine(s.IndexOf('r'));`, opts: ['mar\n4', 'oma\n4', 'mar\n5', 'ara\n3'], a: 0, out: true, why: 'Od indeksu 2 trzy znaki: m, a, r. Litera r ma indeks 4.' },
   { t: 'fill', l: 2, q: 'Uzupełnij, aby podzielić zdanie na słowa i wypisać ich liczbę.', code: c`string zdanie = "Kapi pływa w rzece";
string[] slowa = zdanie.___(' ');
Console.WriteLine(slowa.Length);`, ans: [['Split']], expect: '4', why: 'Split dzieli tekst w miejscach podanego znaku.' },
   { t: 'bug', l: 2, q: 'Program zatrzymuje się z wyjątkiem. Kliknij linię z błędem.', code: c`string s = "Kapi";
Console.WriteLine(s.Substring(1, 2));
Console.WriteLine(s.Substring(2, 5));`, line: 2, fix: 'Console.WriteLine(s.Substring(2, 2));', why: 'Od indeksu 2 zostały tylko 2 znaki, a prosimy o 5 (ArgumentOutOfRangeException).' },
   { t: 'code', l: 2, q: 'Wczytaj zdanie i wypisz, ile jest w nim liter <code>a</code> (małych i wielkich).',
     start: 'string s = Console.ReadLine();\n', tests: [{ i: 'Ala ma kota', o: '4' }, { i: 'Kapi', o: '1' }, { i: 'xyz', o: '0' }],
     sol: c`string s = Console.ReadLine();
int ile = 0;
foreach (char ch in s.ToLower())
{
    if (ch == 'a') ile++;
}
Console.WriteLine(ile);`, hint: 'foreach (char ch in s.ToLower()) i porównanie z \'a\'.' },
   { t: 'code', l: 3, q: 'Wczytaj słowo i wypisz <code>TAK</code>, jeśli jest <b>palindromem</b> (czyta się tak samo od tyłu, bez względu na wielkość liter), inaczej <code>NIE</code>.',
     start: 'string s = Console.ReadLine();\n', tests: [{ i: 'Kajak', o: 'TAK' }, { i: 'kapi', o: 'NIE' }, { i: 'a', o: 'TAK' }],
     sol: c`string s = Console.ReadLine().ToLower();
bool ok = true;
for (int i = 0; i < s.Length / 2; i++)
{
    if (s[i] != s[s.Length - 1 - i]) ok = false;
}
Console.WriteLine(ok ? "TAK" : "NIE");`, hint: 'Porównuj s[i] z s[s.Length - 1 - i].' },
  ] },
 ] });

CH.push({
 id: 'metody', icon: { pirate: '🦜', kitchen: '📜', hero: '💥' },
 name: { pirate: 'Zatoka Metod', kitchen: 'Przepisy-Metody', hero: 'Supermoce-Metody', neutral: 'Metody' },
 topic: 'metody, parametry, return, przeciążanie, ref/out/params, rekurencja',
 outcomes: 'Dzieli program na funkcje (metody); stosuje parametry i wartości zwracane; stosuje przeciążanie metod; stosuje rekurencję.',
 lessons: [
 { id: 'metody1', title: 'Funkcje i metody',
  theory: `<p><b>Metoda</b> (funkcja) to nazwany fragment kodu, który można wywoływać wiele razy. Dzięki metodom program jest krótszy i czytelniejszy.</p>
<pre>static int Kwadrat(int x)
{
    return x * x;
}</pre>
<ul><li><code>int</code> przed nazwą to <b>typ zwracany</b>. Gdy metoda nic nie zwraca – <code>void</code>.</li>
<li><code>(int x)</code> – <b>parametry</b>, czyli dane wejściowe metody.</li>
<li><code>return</code> kończy metodę i zwraca wartość.</li></ul>
<p>Wywołanie: <code>int w = Kwadrat(5);</code>. Wartość <code>5</code> to <b>argument</b>.</p>
<p>W programie z top-level statements metody możemy pisać pod kodem głównym. W klasycznym szablonie piszemy je w klasie <code>Program</code> obok <code>Main</code> – wtedy muszą być <code>static</code>.</p>`,
  more: `<p>Zmienne zadeklarowane w metodzie to <b>zmienne lokalne</b> – istnieją tylko podczas jej działania. Metoda nie widzi zmiennych lokalnych innych metod, dlatego dane przekazujemy parametrami, a wyniki – przez <code>return</code>. Metoda zwracająca wartość musi mieć <code>return</code> na każdej ścieżce (inaczej CS0161).</p>`,
  ex: [
   { code: c`static int Kwadrat(int x)
{
    return x * x;
}

static void Przywitaj(string imie)
{
    Console.WriteLine($"Ahoj, {imie}!");
}

Przywitaj("Kapi");
Przywitaj("Ola");
int w = Kwadrat(7);
Console.WriteLine($"7 do kwadratu = {w}");
Console.WriteLine(Kwadrat(3) + Kwadrat(4));`,
     scene: { s: 'machine', inp: ['7'], name: 'Kwadrat(x)', out: '49', cap: 'Metoda działa jak maszyna Kapi: wrzucasz argument, trybiki pracują, a z drugiej strony wypada wynik (return).' } },
   { code: c`class Program
{
    static double Srednia(int a, int b, int c)
    {
        return (a + b + c) / 3.0;
    }

    static bool CzyZdal(double srednia)
    {
        return srednia >= 3.0;
    }

    static void Main()
    {
        double s = Srednia(4, 3, 2);
        Console.WriteLine($"Średnia: {s:F2}");
        Console.WriteLine(CzyZdal(s) ? "Zdane!" : "Poprawka");
    }
}`, lvl: 2,
     scene: { s: 'machine', inp: ['4', '3', '2'], name: 'Srednia(a, b, c)', out: '3.00', cap: 'Ta sama maszyna w klasycznym szablonie: metody statyczne w klasie Program, a Main je wywołuje.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`static int Dodaj(int a, int b)
{
    return a + b;
}
Console.WriteLine(Dodaj(2, 3) * 2);`, opts: ['10', '7', '8', '5'], a: 0, out: true, why: 'Dodaj(2, 3) zwraca 5, a 5 · 2 = 10.' },
   { t: 'quiz', l: 1, q: 'Jaki typ zwracany ma metoda, która nic nie zwraca?', opts: ['void', 'null', 'int', 'empty'], a: 0, why: 'void oznacza „brak wartości zwracanej”.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`static void Zmien(int x)
{
    x = 100;
}
int a = 5;
Zmien(a);
Console.WriteLine(a);`, opts: ['5', '100', '105', 'Błąd'], a: 0, out: true, why: 'Parametr int dostaje kopię wartości – zmiana x nie zmienia a.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`static int Wieksza(int a, int b)
{
    if (a > b)
    {
        return a;
    }
}
Console.WriteLine(Wieksza(3, 8));`, line: 0, fix: 'return b;   // dopisz przed ostatnią klamrą metody', fixcheck: false, why: 'Gdy a <= b, metoda nic nie zwraca. Każda ścieżka musi mieć return (CS0161).' },
   { t: 'fill', l: 1, q: 'Uzupełnij metodę, aby zwracała podwojoną liczbę.', code: c`static int Podwoj(int x)
{
    ___ x * 2;
}
Console.WriteLine(Podwoj(21));`, ans: [['return']], expect: '42', why: 'Wartość zwracamy słowem return.' },
   { t: 'code', l: 1, q: 'Napisz metodę <code>static bool CzyParzysta(int n)</code> i użyj jej: wczytaj liczbę i wypisz <code>True</code>/<code>False</code>.',
     start: '// Twój kod\nint n = int.Parse(Console.ReadLine());\n', tests: [{ i: '4', o: 'True' }, { i: '7', o: 'False' }], check: "if (!/bool\\s+CzyParzysta\\s*\\(\\s*int/.test(src)) return 'Napisz metodę bool CzyParzysta(int n)';",
     sol: c`static bool CzyParzysta(int n)
{
    return n % 2 == 0;
}
int n = int.Parse(Console.ReadLine());
Console.WriteLine(CzyParzysta(n));`, hint: 'return n % 2 == 0;' },
   { t: 'code', l: 2, q: 'Napisz metodę <code>static int Potega(int podstawa, int wykladnik)</code>, która liczy potęgę <b>pętlą</b> (bez Math.Pow). Wczytaj dwie liczby i wypisz wynik.',
     start: '// Twój kod\n', tests: [{ i: '2\n10', o: '1024' }, { i: '5\n0', o: '1' }, { i: '3\n3', o: '27' }], check: "if (/Math\\.Pow/.test(src)) return 'Bez Math.Pow – użyj pętli';",
     sol: c`static int Potega(int podstawa, int wykladnik)
{
    int wynik = 1;
    for (int i = 0; i < wykladnik; i++) wynik *= podstawa;
    return wynik;
}
int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
Console.WriteLine(Potega(a, b));`, hint: 'wynik = 1, a potem wykladnik razy wynik *= podstawa.' },
  ] },
 { id: 'przeciazanie', title: 'Przeciążanie metod',
  theory: `<p><b>Przeciążanie</b> (overloading) to tworzenie kilku metod o <b>tej samej nazwie</b>, ale z <b>różnymi parametrami</b> (inna liczba lub inne typy). Kompilator sam wybiera właściwą wersję na podstawie argumentów:</p>
<pre>static int Dodaj(int a, int b) =&gt; a + b;
static double Dodaj(double a, double b) =&gt; a + b;
static int Dodaj(int a, int b, int c) =&gt; a + b + c;</pre>
<p>Tak działa np. <code>Console.WriteLine</code> – ma wersje dla <code>int</code>, <code>string</code>, <code>double</code> i wielu innych typów.</p>
<p>Uwaga: metody <b>nie mogą</b> różnić się tylko typem zwracanym. Przeciążać można metody w <b>klasie</b> (funkcji lokalnych w top-level statements przeciążać nie można).</p>`,
  more: `<p>Zapis <code>=&gt; wyrażenie</code> to <b>metoda z ciałem wyrażeniowym</b> (expression-bodied) – skrót dla <code>{ return wyrażenie; }</code>.</p>`,
  ex: [
   { code: c`Console.WriteLine(Kalkulator.Dodaj(2, 3));
Console.WriteLine(Kalkulator.Dodaj(2.5, 3.1));
Console.WriteLine(Kalkulator.Dodaj(1, 2, 3));
Console.WriteLine(Kalkulator.Dodaj("Kapi", "Pasta"));

class Kalkulator
{
    public static int Dodaj(int a, int b) => a + b;
    public static double Dodaj(double a, double b) => a + b;
    public static int Dodaj(int a, int b, int c) => a + b + c;
    public static string Dodaj(string a, string b) => a + b;
}`,
     scene: { s: 'cards', items: [['Dodaj(2, 3)', '5', '(int, int)'], ['Dodaj(2.5, 3.1)', '5.6', '(double, double)'], ['Dodaj(1, 2, 3)', '6', '(int, int, int)'], ['Dodaj("Kapi", "Pasta")', '"KapiPasta"', '(string, string)']], cap: 'Kapi ma cztery przepisy o tej samej nazwie. Po składnikach (typach argumentów) poznaje, którego użyć.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co to jest przeciążanie metod?', opts: ['Kilka metod o tej samej nazwie i różnych parametrach', 'Metoda, która wywołuje samą siebie', 'Metoda z bardzo długim kodem', 'Metoda bez parametrów'], a: 0, why: 'Kompilator rozróżnia przeciążenia po liczbie i typach parametrów.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`Console.WriteLine(K.Opisz(5));
Console.WriteLine(K.Opisz(5.0));
Console.WriteLine(K.Opisz("5"));
class K
{
    public static string Opisz(int x) => "int";
    public static string Opisz(double x) => "double";
    public static string Opisz(string x) => "string";
}`, opts: ['int\ndouble\nstring', 'int\nint\nint', 'double\ndouble\nstring', 'Błąd kompilacji'], a: 0, out: true, why: 'Wybrana jest wersja, która dokładnie pasuje do typu argumentu.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`Console.WriteLine(K.F(3));
class K
{
    public static string F(long x) => "long";
    public static string F(double x) => "double";
}`, opts: ['long', 'double', 'Błąd kompilacji', 'int'], a: 0, out: true, why: 'int można niejawnie zamienić i na long, i na double, ale konwersja na long jest „lepsza” (bliższa).' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Console.WriteLine(M.Pole(3));
class M
{
    public static int Pole(int a) => a * a;
    public static double Pole(int a) => a * a;
}`, line: 4, fix: 'public static double Pole(double a) => a * a;', why: 'Metody różnią się tylko typem zwracanym – to niedozwolone (CS0111).' },
   { t: 'code', l: 2, q: 'W klasie <code>Geometria</code> napisz dwie metody <code>Pole</code>: <code>Pole(double r)</code> – pole koła (<code>Math.PI * r * r</code>) i <code>Pole(double a, double b)</code> – pole prostokąta. Program wypisuje <code>Geometria.Pole(1)</code> i <code>Geometria.Pole(2, 3)</code> z formatem F2.',
     start: 'Console.WriteLine($"{Geometria.Pole(1):F2}");\nConsole.WriteLine($"{Geometria.Pole(2, 3):F2}");\n\nclass Geometria\n{\n}\n', tests: [{ i: '', o: '3.14\n6.00' }],
     sol: c`Console.WriteLine($"{Geometria.Pole(1):F2}");
Console.WriteLine($"{Geometria.Pole(2, 3):F2}");

class Geometria
{
    public static double Pole(double r) => Math.PI * r * r;
    public static double Pole(double a, double b) => a * b;
}`, hint: 'Dwie metody public static double Pole(...) z różną liczbą parametrów.' },
  ] },
 { id: 'refout', title: 'Parametry ref, out, params i domyślne',
  theory: `<p>Domyślnie argumenty typów prostych są przekazywane <b>przez wartość</b> – metoda dostaje kopię. Inne możliwości:</p>
<ul><li><code>ref</code> – przekazanie <b>przez referencję</b>: metoda działa na oryginalnej zmiennej. Słowo <code>ref</code> piszemy i w definicji, i w wywołaniu: <code>Zamien(ref a, ref b);</code></li>
<li><code>out</code> – parametr <b>wyjściowy</b>: metoda musi nadać mu wartość. Tak działa <code>int.TryParse(s, out int n)</code>.</li>
<li><code>params int[] liczby</code> – dowolna liczba argumentów: <code>Suma(1, 2, 3, 4)</code>.</li>
<li><b>parametr domyślny</b>: <code>void Powitaj(string imie = "Kapi")</code> – można wywołać <code>Powitaj()</code>.</li></ul>`,
  ex: [
   { code: c`static void Zamien(ref int a, ref int b)
{
    int tmp = a;
    a = b;
    b = tmp;
}
static void MinMax(int[] t, out int min, out int max)
{
    min = t[0]; max = t[0];
    foreach (int x in t) { if (x < min) min = x; if (x > max) max = x; }
}
static int Suma(params int[] liczby)
{
    int s = 0;
    foreach (int x in liczby) s += x;
    return s;
}
static void Powitaj(string imie = "Kapi") => Console.WriteLine($"Cześć, {imie}!");

int x = 1, y = 2;
Zamien(ref x, ref y);
Console.WriteLine($"x={x}, y={y}");
MinMax(new[] { 5, 2, 9 }, out int mn, out int mx);
Console.WriteLine($"min={mn}, max={mx}");
Console.WriteLine(Suma(1, 2, 3, 4));
Powitaj();
Powitaj("Ola");`,
     scene: { s: 'scope', fn: 'Zamien(ref a, ref b)', glob: [['x', '2'], ['y', '1']], loc: [], cap: 'Z ref metoda nie dostaje kopii, tylko klucz do oryginalnych szuflad x i y – dlatego zamiana jest widoczna po powrocie.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`static void Dodaj10(ref int x) { x += 10; }
int a = 5;
Dodaj10(ref a);
Console.WriteLine(a);`, opts: ['15', '5', '10', 'Błąd'], a: 0, out: true, why: 'ref przekazuje oryginalną zmienną – zmiana jest widoczna.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`static int Policz(params int[] t) => t.Length;
Console.WriteLine(Policz() + Policz(7, 7, 7));`, opts: ['3', '0', '21', 'Błąd kompilacji'], a: 0, out: true, why: 'Policz() dostaje pustą tablicę (0), Policz(7, 7, 7) – 3 elementy.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`static void Podwoj(ref int x) { x *= 2; }
int n = 4;
Podwoj(n);
Console.WriteLine(n);`, line: 2, fix: 'Podwoj(ref n);', why: 'Argument dla parametru ref trzeba przekazać ze słowem ref (CS1620).' },
   { t: 'fill', l: 2, q: 'Uzupełnij wywołanie TryParse.', code: c`string s = "123";
if (int.TryParse(s, ___ int liczba))
{
    Console.WriteLine(liczba + 1);
}`, ans: [['out']], expect: '124', why: 'TryParse zwraca wynik przez parametr out.' },
   { t: 'code', l: 3, q: 'Napisz metodę <code>static void Podziel(int a, int b, out int iloraz, out int reszta)</code>. Wczytaj a i b, wywołaj metodę i wypisz <code>iloraz reszta</code>.',
     start: '// Twój kod\n', tests: [{ i: '17\n5', o: '3 2' }, { i: '10\n2', o: '5 0' }], check: "if (!/out\\s+int\\s+iloraz/.test(src)) return 'Użyj parametrów out';",
     sol: c`static void Podziel(int a, int b, out int iloraz, out int reszta)
{
    iloraz = a / b;
    reszta = a % b;
}
int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
Podziel(a, b, out int q, out int r);
Console.WriteLine($"{q} {r}");`, hint: 'W metodzie przypisz iloraz = a / b; reszta = a % b;' },
  ] },
 { id: 'rekurencja', title: 'Rekurencja',
  theory: `<p><b>Rekurencja</b> to sytuacja, gdy metoda wywołuje <b>samą siebie</b>. Każda funkcja rekurencyjna potrzebuje:</p>
<ol><li><b>warunku stopu</b> (przypadku bazowego), np. <code>if (n &lt;= 1) return 1;</code>,</li>
<li><b>wywołania rekurencyjnego</b> dla „mniejszego” problemu, np. <code>return n * Silnia(n - 1);</code>.</li></ol>
<p>Każde wywołanie trafia na <b>stos wywołań</b>. Gdy warunku stopu brakuje, stos się przepełnia i program kończy się błędem <code>StackOverflowException</code>.</p>
<p>Klasyczne przykłady: silnia, ciąg Fibonacciego, NWD (algorytm Euklidesa), wieże Hanoi.</p>`,
  more: `<p>Rekurencyjny Fibonacci <code>F(n) = F(n−1) + F(n−2)</code> liczy te same wartości wiele razy i dla dużego n jest bardzo wolny. Wersja z pętlą (iteracyjna) jest dużo szybsza – rekurencja jest elegancka, ale nie zawsze najlepsza.</p>`,
  ex: [
   { code: c`static long Silnia(int n)
{
    if (n <= 1) return 1;          // warunek stopu
    return n * Silnia(n - 1);      // wywołanie rekurencyjne
}
Console.WriteLine(Silnia(4));
Console.WriteLine(Silnia(20));`,
     scene: { s: 'stack', frames: ['Silnia(4)', 'Silnia(3)', 'Silnia(2)', 'Silnia(1)'], rets: ['24', '6', '2', '1'], cap: 'Kapi schodzi coraz niżej (4, 3, 2, 1). Przy 1 zatrzymuje się i wraca na górę, mnożąc wyniki: 1 → 2 → 6 → 24.' } },
   { code: c`static int Nwd(int a, int b)
{
    if (b == 0) return a;
    return Nwd(b, a % b);
}
static int Fib(int n) => n < 2 ? n : Fib(n - 1) + Fib(n - 2);
Console.WriteLine(Nwd(48, 18));
for (int i = 0; i <= 10; i++) Console.Write(Fib(i) + " ");`, lvl: 2,
     scene: { s: 'stack', frames: ['Nwd(48, 18)', 'Nwd(18, 12)', 'Nwd(12, 6)', 'Nwd(6, 0)'], rets: ['6', '6', '6', '6'], cap: 'Algorytm Euklidesa: Nwd(a, b) = Nwd(b, a % b), aż b stanie się zerem.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co jest niezbędne w każdej metodzie rekurencyjnej?', opts: ['Warunek stopu', 'Pętla for', 'Parametr typu string', 'Słowo static'], a: 0, why: 'Bez warunku stopu rekurencja nigdy się nie kończy.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`static int F(int n)
{
    if (n == 0) return 0;
    return n + F(n - 1);
}
Console.WriteLine(F(4));`, opts: ['10', '4', '24', '0'], a: 0, out: true, why: '4 + 3 + 2 + 1 + 0 = 10.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`static void Odliczaj(int n)
{
    if (n == 0) return;
    Console.Write(n);
    Odliczaj(n - 1);
}
Odliczaj(3);`, opts: ['321', '123', '3210', '0123'], a: 0, out: true, why: 'Najpierw wypisanie, potem wywołanie dla n - 1.' },
   { t: 'bug', l: 2, q: 'Program kończy się błędem przepełnienia stosu. Kliknij linię, którą trzeba poprawić.', code: c`static int Suma(int n)
{
    return n + Suma(n - 1);
}
Console.WriteLine(Suma(5));`, line: 2, fix: 'return n <= 0 ? 0 : n + Suma(n - 1);', cause: true, why: 'Brakuje warunku stopu – metoda wywołuje się bez końca (StackOverflowException).' },
   { t: 'code', l: 2, q: 'Napisz rekurencyjną metodę <code>static int Potega(int a, int n)</code>: a⁰ = 1, aⁿ = a · aⁿ⁻¹. Wczytaj a i n, wypisz wynik.',
     start: '// Twój kod\n', tests: [{ i: '2\n8', o: '256' }, { i: '7\n0', o: '1' }], check: "if (!/Potega\\s*\\([^)]*\\)[\\s\\S]*Potega\\s*\\(/.test(src.replace(/^.*Console[^\\n]*$/m,''))) return 'Metoda Potega powinna wywoływać samą siebie';",
     sol: c`static int Potega(int a, int n)
{
    if (n == 0) return 1;
    return a * Potega(a, n - 1);
}
int a = int.Parse(Console.ReadLine());
int n = int.Parse(Console.ReadLine());
Console.WriteLine(Potega(a, n));`, hint: 'if (n == 0) return 1; return a * Potega(a, n - 1);' },
   { t: 'code', l: 3, q: 'Napisz rekurencyjną metodę <code>static string Odwroc(string s)</code>, która odwraca tekst (pusty tekst → pusty). Wczytaj słowo i wypisz odwrócone.',
     start: '// Twój kod\n', tests: [{ i: 'Kapi', o: 'ipaK' }, { i: 'a', o: 'a' }],
     sol: c`static string Odwroc(string s)
{
    if (s.Length <= 1) return s;
    return Odwroc(s.Substring(1)) + s[0];
}
Console.WriteLine(Odwroc(Console.ReadLine()));`, hint: 'Odwrócony tekst = Odwroc(reszta) + pierwszy znak.' },
  ] },
 ] });

CH.push({
 id: 'klasy', icon: { pirate: '⛵', kitchen: '🧁', hero: '🏭' },
 name: { pirate: 'Stocznia Klas', kitchen: 'Foremki Klas', hero: 'Fabryka Herosów', neutral: 'KlasyIObiekty' },
 topic: 'klasy, obiekty, pola, metody, konstruktory, hermetyzacja, właściwości, static',
 outcomes: 'Stosuje zasady programowania obiektowego; charakteryzuje pojęcia klasa, obiekt, metoda, pole, hermetyzacja; definiuje klasy, pola, metody, konstruktory (w tym kopiujący) i destruktor; określa zakres widoczności i kwalifikatory dostępu; deklaruje obiekty; definiuje i stosuje składniki statyczne; rozróżnia klasy dziedziczone i zaprzyjaźnione.',
 lessons: [
 { id: 'klasy1', title: 'Klasy i obiekty',
  theory: `<p><b>Klasa</b> to szablon (przepis, projekt), a <b>obiekt</b> to konkretny egzemplarz utworzony według tego szablonu. Klasa „Kapibara” opisuje, co każda kapibara ma i co umie, a obiekty to konkretne kapibary: Kapi, Ola, Bob.</p>
<pre>class Kapibara
{
    public string Imie;            // pole
    public int Wiek;               // pole
    public void Przedstaw()        // metoda
    {
        Console.WriteLine($"Jestem {Imie}, mam {Wiek} lata");
    }
}</pre>
<p><b>Pola</b> przechowują dane obiektu (jego stan), a <b>metody</b> opisują jego zachowanie. Obiekt tworzymy operatorem <code>new</code>, a do składowych odwołujemy się kropką:</p>
<pre>Kapibara k = new Kapibara();
k.Imie = "Kapi";
k.Przedstaw();</pre>
<p>Każdy obiekt ma <b>własne</b> wartości pól. Klasy (typy referencyjne) w zmiennej przechowują <b>odwołanie</b> do obiektu – dwie zmienne mogą wskazywać ten sam obiekt.</p>`,
  more: `<p>Programowanie obiektowe opiera się na czterech filarach: <b>abstrakcja</b> (opisujemy tylko to, co ważne), <b>hermetyzacja</b> (ukrywanie danych), <b>dziedziczenie</b> (klasy pochodne) i <b>polimorfizm</b> (jedno wywołanie – różne zachowania). Kolejne lekcje omawiają je po kolei. Dzieląc problem na klasy, szukaj <i>rzeczowników</i> (Statek, Pirat, Skarb) – to kandydaci na klasy – i <i>czasowników</i> (płynie, kopie) – to kandydaci na metody.</p>`,
  ex: [
   { code: c`Kapibara a = new Kapibara();
a.Imie = "Kapi";
a.Wiek = 4;
Kapibara b = new Kapibara();
b.Imie = "Ola";
b.Wiek = 2;
a.Przedstaw();
b.Przedstaw();
b.Urodziny();
b.Przedstaw();

class Kapibara
{
    public string Imie;
    public int Wiek;

    public void Przedstaw()
    {
        Console.WriteLine($"Jestem {Imie}, mam {Wiek} lata");
    }

    public void Urodziny()
    {
        Wiek++;
        Console.WriteLine($"🎂 Sto lat, {Imie}!");
    }
}`,
     scene: { s: 'class', cls: { name: 'Kapibara', fields: ['string Imie', 'int Wiek'], methods: ['Przedstaw()', 'Urodziny()'] }, objs: [{ name: 'a', vals: ['Imie = "Kapi"', 'Wiek = 4'] }, { name: 'b', vals: ['Imie = "Ola"', 'Wiek = 3'] }], cap: 'Klasa to niebieski projekt, a new buduje według niego obiekty. Każdy obiekt ma własne Imie i Wiek.' } },
   { code: c`Statek s1 = new Statek();
s1.Nazwa = "Czarna Perełka";
Statek s2 = s1;
s2.Nazwa = "Złota Kapibara";
Console.WriteLine(s1.Nazwa);
Console.WriteLine(s1 == s2);

class Statek
{
    public string Nazwa;
}`, lvl: 2,
     scene: { s: 'struct', a: '—', b: '—', c: 'Statek "Złota Kapibara"', cap: 'Zmienne s1 i s2 to dwie etykiety na tym samym statku. Zmiana przez s2 jest widoczna przez s1.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Czym jest obiekt?', opts: ['Konkretnym egzemplarzem klasy', 'Szablonem opisującym pola i metody', 'Inną nazwą metody', 'Typem prostym, jak int'], a: 0, why: 'Klasa to szablon, obiekt to egzemplarz utworzony przez new.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Pies p = new Pies();
p.Imie = "Burek";
p.Szczekaj();

class Pies
{
    public string Imie;
    public void Szczekaj() => Console.WriteLine(Imie + ": Hau!");
}`, opts: ['Burek: Hau!', 'Imie: Hau!', ': Hau!', 'Błąd'], a: 0, out: true, why: 'Metoda korzysta z pola Imie tego obiektu.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`Licznik a = new Licznik();
Licznik b = a;
a.Wartosc = 5;
b.Wartosc += 1;
Console.WriteLine(a.Wartosc);

class Licznik { public int Wartosc; }`, opts: ['6', '5', '1', '0'], a: 0, out: true, why: 'a i b wskazują ten sam obiekt.' },
   { t: 'fill', l: 1, q: 'Uzupełnij tworzenie obiektu.', code: c`Kot k = ___ Kot();
k.Imie = "Mruczek";
Console.WriteLine(k.Imie);

class Kot { public string Imie; }`, ans: [['new']], expect: 'Mruczek', why: 'Obiekty tworzymy operatorem new.' },
   { t: 'bug', l: 2, q: 'Program zatrzymuje się z wyjątkiem. Kliknij linię z błędem.', code: c`Kapibara k = null;
k.Imie = "Kapi";
Console.WriteLine(k.Imie);

class Kapibara { public string Imie; }`, line: 0, fix: 'Kapibara k = new Kapibara();', cause: true, why: 'Zmienna nie wskazuje żadnego obiektu (null) – brakuje new (NullReferenceException).' },
   { t: 'code', l: 2, q: 'Dopisz w klasie <code>Prostokat</code> pola <code>public double A, B;</code> oraz metody <code>Pole()</code> i <code>Obwod()</code> zwracające double. Program już tworzy obiekt i wypisuje wyniki.',
     start: 'Prostokat p = new Prostokat();\np.A = 3; p.B = 4.5;\nConsole.WriteLine($"{p.Pole()} {p.Obwod()}");\n\nclass Prostokat\n{\n}\n', tests: [{ i: '', o: '13.5 15' }],
     sol: c`Prostokat p = new Prostokat();
p.A = 3; p.B = 4.5;
Console.WriteLine($"{p.Pole()} {p.Obwod()}");

class Prostokat
{
    public double A, B;
    public double Pole() => A * B;
    public double Obwod() => 2 * (A + B);
}`, hint: 'public double Pole() => A * B;' },
  ] },
 { id: 'konstruktory', title: 'Konstruktory i destruktor',
  theory: `<p><b>Konstruktor</b> to specjalna metoda wywoływana automatycznie przy tworzeniu obiektu (<code>new</code>). Ma <b>tę samą nazwę co klasa</b> i <b>nie ma typu zwracanego</b>. Służy do nadania polom wartości początkowych:</p>
<pre>public Kapibara(string imie, int wiek)
{
    Imie = imie;
    Wiek = wiek;
}</pre>
<p>Konstruktory można <b>przeciążać</b>. Jeden konstruktor może wywołać drugi przez <code>: this(...)</code>. Jeśli nie napiszesz żadnego konstruktora, kompilator doda pusty <b>konstruktor domyślny</b>. Gdy jednak napiszesz konstruktor z parametrami, domyślny znika.</p>
<p>Słowo <code>this</code> oznacza „ten obiekt” – przydaje się, gdy parametr nazywa się tak samo jak pole: <code>this.imie = imie;</code>.</p>
<p><b>Konstruktor kopiujący</b> tworzy obiekt jako kopię innego: <code>public Kapibara(Kapibara inna) : this(inna.Imie, inna.Wiek) { }</code>.</p>
<p><b>Destruktor</b> (w C# – finalizator) <code>~Kapibara() { }</code> wywołuje <b>garbage collector</b>, gdy obiekt nie jest już potrzebny. Nie wiemy dokładnie kiedy, dlatego w C# używa się go rzadko (do zwalniania zasobów służy raczej <code>IDisposable</code> i <code>using</code>).</p>`,
  ex: [
   { code: c`Kapibara a = new Kapibara("Kapi", 4);
Kapibara b = new Kapibara("Ola");
Kapibara c = new Kapibara(a);
c.Imie = "Kapi II";
Console.WriteLine(a);
Console.WriteLine(b);
Console.WriteLine(c);

class Kapibara
{
    public string Imie;
    public int Wiek;

    public Kapibara(string imie, int wiek)
    {
        Imie = imie;
        Wiek = wiek;
        Console.WriteLine($"🐣 Rodzi się {imie}");
    }

    public Kapibara(string imie) : this(imie, 0) { }

    public Kapibara(Kapibara inna) : this(inna.Imie, inna.Wiek) { }

    ~Kapibara() { }

    public override string ToString() => $"{Imie} ({Wiek} l.)";
}`,
     scene: { s: 'class', cls: { name: 'Kapibara', fields: ['string Imie', 'int Wiek'], methods: ['Kapibara(imie, wiek)', 'Kapibara(imie) : this(imie, 0)', 'Kapibara(Kapibara inna)', '~Kapibara()'] }, objs: [{ name: 'a', vals: ['"Kapi", 4'] }, { name: 'b', vals: ['"Ola", 0'] }, { name: 'c', vals: ['"Kapi II", 4'] }], cap: 'Każdy new uruchamia konstruktor. Konstruktor kopiujący robi nowy obiekt z danymi innego, więc zmiana c nie zmienia a.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Jak nazywa się konstruktor klasy <code>Statek</code>?', opts: ['Statek', 'Konstruktor', 'New', 'Init'], a: 0, why: 'Konstruktor ma taką samą nazwę jak klasa.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Pirat p = new Pirat("Kapi");
Console.WriteLine(p.Imie);

class Pirat
{
    public string Imie;
    public Pirat(string imie) { Imie = "Kapitan " + imie; }
}`, opts: ['Kapitan Kapi', 'Kapi', 'Kapitan', 'Błąd'], a: 0, out: true, why: 'Konstruktor nadaje polu wartość "Kapitan " + imie.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Danie d = new Danie();
Console.WriteLine(d.Nazwa);

class Danie
{
    public string Nazwa;
    public Danie(string nazwa) { Nazwa = nazwa; }
}`, line: 0, fix: 'Danie d = new Danie("Pasta");', why: 'Klasa ma tylko konstruktor z parametrem – domyślny (bez parametrów) nie istnieje (CS7036).' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`Punkt p = new Punkt(3);
Console.WriteLine($"{p.X},{p.Y}");

class Punkt
{
    public int X, Y;
    public Punkt(int x, int y) { X = x; Y = y; }
    public Punkt(int v) : this(v, v * 2) { }
}`, opts: ['3,6', '3,0', '3,3', '0,0'], a: 0, out: true, why: ': this(v, v * 2) wywołuje konstruktor z dwoma parametrami.' },
   { t: 'quiz', l: 3, q: 'Kiedy w C# wywoływany jest destruktor (finalizator) <code>~Klasa()</code>?', opts: ['Gdy garbage collector zwalnia obiekt – w nieokreślonym momencie', 'Zaraz po wyjściu z bloku, w którym utworzono obiekt', 'Przy każdym przypisaniu null', 'Nigdy, C# nie ma destruktorów'], a: 0, why: 'Pamięcią w .NET zarządza garbage collector, więc moment wywołania finalizatora jest nieprzewidywalny.' },
   { t: 'fill', l: 2, q: 'Uzupełnij konstruktor, w którym parametr nazywa się tak samo jak pole.', code: c`Kapibara k = new Kapibara("Kapi");
Console.WriteLine(k.Pobierz());

class Kapibara
{
    private string imie;
    public Kapibara(string imie) { ___.imie = imie; }
    public string Pobierz() => imie;
}`, ans: [['this']], expect: 'Kapi', why: 'this.imie to pole obiektu, a imie – parametr.' },
   { t: 'code', l: 2, q: 'Dopisz w klasie <code>Skarb</code> konstruktor <code>Skarb(string nazwa, int wartosc)</code> oraz konstruktor kopiujący <code>Skarb(Skarb inny)</code>.',
     start: 'Skarb a = new Skarb("Złoto", 100);\nSkarb b = new Skarb(a);\nb.Wartosc *= 2;\nConsole.WriteLine($"{a.Nazwa} {a.Wartosc} | {b.Nazwa} {b.Wartosc}");\n\nclass Skarb\n{\n    public string Nazwa;\n    public int Wartosc;\n}\n', tests: [{ i: '', o: 'Złoto 100 | Złoto 200' }],
     sol: c`Skarb a = new Skarb("Złoto", 100);
Skarb b = new Skarb(a);
b.Wartosc *= 2;
Console.WriteLine($"{a.Nazwa} {a.Wartosc} | {b.Nazwa} {b.Wartosc}");

class Skarb
{
    public string Nazwa;
    public int Wartosc;
    public Skarb(string nazwa, int wartosc) { Nazwa = nazwa; Wartosc = wartosc; }
    public Skarb(Skarb inny) : this(inny.Nazwa, inny.Wartosc) { }
}`, hint: 'Konstruktor kopiujący może wywołać drugi: : this(inny.Nazwa, inny.Wartosc).' },
  ] },
 { id: 'hermetyzacja', title: 'Modyfikatory dostępu, hermetyzacja, właściwości',
  theory: `<p><b>Modyfikatory dostępu</b> określają, kto widzi składową klasy:</p>
<ul><li><code>public</code> – wszyscy,</li><li><code>private</code> – tylko ta klasa (domyślny dla składowych klasy),</li><li><code>protected</code> – ta klasa i klasy pochodne,</li><li><code>internal</code> – cały projekt (zestaw).</li></ul>
<p><b>Hermetyzacja</b> (enkapsulacja) polega na ukryciu pól (<code>private</code>) i udostępnieniu ich tylko przez kontrolowane metody lub <b>właściwości</b>. Dzięki temu obiekt pilnuje poprawności swoich danych – np. saldo konta nie może być ujemne.</p>
<p><b>Właściwość</b> (property) wygląda z zewnątrz jak pole, ale ma akcesory <code>get</code> i <code>set</code>:</p>
<pre>private int wiek;
public int Wiek
{
    get { return wiek; }
    set { if (value &gt;= 0) wiek = value; }
}</pre>
<p><code>value</code> to wartość przypisywana do właściwości. Skrót – <b>auto-właściwość</b>: <code>public string Imie { get; set; }</code>. Właściwość tylko do odczytu z zewnątrz: <code>{ get; private set; }</code>.</p>`,
  ex: [
   { code: c`Konto k = new Konto("Kapi");
k.Wplac(100);
k.Wyplac(30);
k.Wyplac(500);
Console.WriteLine($"{k.Wlasciciel}: {k.Saldo} zł");

class Konto
{
    public string Wlasciciel { get; }
    public decimal Saldo { get; private set; }

    public Konto(string wlasciciel) { Wlasciciel = wlasciciel; }

    public void Wplac(decimal kwota)
    {
        if (kwota > 0) Saldo += kwota;
    }

    public void Wyplac(decimal kwota)
    {
        if (kwota > Saldo)
        {
            Console.WriteLine("❌ Za mało monet w skrzyni!");
            return;
        }
        Saldo -= kwota;
    }
}`,
     scene: { s: 'scope', fn: 'Konto (private)', glob: [['Wplac()', 'public'], ['Wyplac()', 'public'], ['Saldo get', 'public']], loc: [['Saldo set', 'private'], ['saldo', '70']], cap: 'Skrzynia Kapi ma zamek: z zewnątrz można tylko wpłacać i wypłacać przez publiczne metody, a saldo zmienia się wyłącznie w środku.' } },
   { code: c`Uczen u = new Uczen();
u.Imie = "Ola";
u.Ocena = 7;
Console.WriteLine($"{u.Imie}: {u.Ocena}");
u.Ocena = 5;
Console.WriteLine($"{u.Imie}: {u.Ocena}, opis: {u.Opis}");

class Uczen
{
    private int ocena = 1;
    public string Imie { get; set; } = "";
    public int Ocena
    {
        get => ocena;
        set
        {
            if (value >= 1 && value <= 6) ocena = value;
            else Console.WriteLine($"Ocena {value} jest spoza skali!");
        }
    }
    public string Opis => ocena >= 5 ? "świetnie" : "dobrze";
}`, lvl: 2,
     scene: { s: 'fork', cond: 'value >= 1 && value <= 6', val: 'True', yes: 'ocena = value', no: 'komunikat o błędzie', cap: 'Setter działa jak strażnik: przepuszcza tylko oceny 1–6. Właściwość Opis ma tylko get – jest liczona na bieżąco.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Który modyfikator sprawia, że składowa jest widoczna <b>tylko w swojej klasie</b>?', opts: ['private', 'public', 'protected', 'internal'], a: 0, why: 'private ogranicza dostęp do klasy, w której składowa jest zadeklarowana.' },
   { t: 'bug', l: 1, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Skrzynia s = new Skrzynia();
s.zloto = 1000;
Console.WriteLine(s.Ile());

class Skrzynia
{
    private int zloto = 10;
    public int Ile() => zloto;
}`, line: 1, fix: 's.Dodaj(1000);   // potrzebna publiczna metoda w klasie', fixcheck: false, why: 'Pole zloto jest private – nie można go użyć spoza klasy (CS0122).' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`Termometr t = new Termometr();
t.Stopnie = -500;
t.Stopnie = 25;
Console.WriteLine(t.Stopnie);

class Termometr
{
    private int st;
    public int Stopnie
    {
        get { return st; }
        set { if (value > -273) st = value; }
    }
}`, opts: ['25', '-500', '0', '-475'], a: 0, out: true, why: 'Setter odrzucił −500 i przyjął 25.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Gracz g = new Gracz();
g.Punkty = 999;
Console.WriteLine(g.Punkty);

class Gracz
{
    public int Punkty { get; private set; }
}`, line: 1, fix: 'g.DodajPunkty(999);   // zmiana tylko przez metodę klasy', fixcheck: false, why: 'Setter jest private, więc spoza klasy można tylko odczytać Punkty (CS0272).' },
   { t: 'fill', l: 2, q: 'Uzupełnij właściwość, aby przyjmowała tylko dodatnie wartości.', code: c`Pudelko p = new Pudelko();
p.Waga = -3;
p.Waga = 4;
Console.WriteLine(p.Waga);

class Pudelko
{
    private int waga;
    public int Waga
    {
        get { return waga; }
        set { if (___ > 0) waga = ___; }
    }
}`, ans: [['value'], ['value']], expect: '4', why: 'W setterze nowa wartość nazywa się value.' },
   { t: 'code', l: 3, q: 'Napisz klasę <code>Statek</code> z prywatnym polem <code>paliwo</code> (int, start 100), właściwością tylko do odczytu <code>Paliwo</code> i metodą <code>bool Plyn(int km)</code>: każdy km zużywa 2 jednostki. Jeśli paliwa brakuje, metoda zwraca false i niczego nie zmienia.',
     start: 'Statek s = new Statek();\nConsole.WriteLine(s.Plyn(30));\nConsole.WriteLine(s.Plyn(30));\nConsole.WriteLine(s.Paliwo);\n', tests: [{ i: '', o: 'True\nFalse\n40' }], check: "if (!/private\\s+int\\s+paliwo/.test(src)) return 'Pole paliwo ma być private';",
     sol: c`Statek s = new Statek();
Console.WriteLine(s.Plyn(30));
Console.WriteLine(s.Plyn(30));
Console.WriteLine(s.Paliwo);

class Statek
{
    private int paliwo = 100;
    public int Paliwo => paliwo;
    public bool Plyn(int km)
    {
        if (km * 2 > paliwo) return false;
        paliwo -= km * 2;
        return true;
    }
}`, hint: 'public int Paliwo => paliwo; oraz warunek km * 2 > paliwo.' },
  ] },
 { id: 'statyczne', title: 'Składniki statyczne i klasy zaprzyjaźnione',
  theory: `<p>Składnik <code>static</code> należy do <b>klasy</b>, a nie do konkretnego obiektu – istnieje w jednym egzemplarzu, wspólnym dla wszystkich obiektów. Wywołujemy go przez nazwę klasy: <code>Kapibara.Licznik</code>, <code>Math.Sqrt(9)</code>.</p>
<ul><li><b>pole statyczne</b> – np. licznik utworzonych obiektów,</li>
<li><b>metoda statyczna</b> – nie ma dostępu do pól obiektu (nie ma <code>this</code>), widzi tylko składniki statyczne,</li>
<li><b>klasa statyczna</b> (<code>static class</code>) – zawiera tylko składniki statyczne, nie można tworzyć jej obiektów (jak <code>Math</code> czy <code>Console</code>).</li></ul>
<p><b>Klasy zaprzyjaźnione</b> (funkcje <code>friend</code>) znasz może z C++: to klasy lub funkcje, które mają dostęp do prywatnych składowych innej klasy. <b>W C# nie ma słowa <code>friend</code>.</b> Podobny efekt daje modyfikator <code>internal</code> (dostęp w całym projekcie) oraz <b>klasy zagnieżdżone</b> – klasa zdefiniowana wewnątrz innej widzi jej prywatne składowe. W przeciwieństwie do dziedziczenia „przyjaźń” nie tworzy relacji „jest rodzajem”.</p>`,
  ex: [
   { code: c`Pirat a = new Pirat("Kapi");
Pirat b = new Pirat("Ola");
Pirat c = new Pirat("Bob");
Console.WriteLine($"Piratów na statku: {Pirat.Liczba}");
Console.WriteLine(Narzedzia.Kwadrat(12));
Skarbiec s = new Skarbiec();
Skarbiec.Kontroler.Sprawdz(s);

class Pirat
{
    public static int Liczba = 0;
    public string Imie;
    public Pirat(string imie) { Imie = imie; Liczba++; }
}

static class Narzedzia
{
    public static int Kwadrat(int x) => x * x;
}

class Skarbiec
{
    private int zloto = 777;
    public class Kontroler
    {
        public static void Sprawdz(Skarbiec s) => Console.WriteLine($"Kontroler widzi prywatne złoto: {s.zloto}");
    }
}`,
     scene: { s: 'scope', fn: 'obiekty Pirat', glob: [['Pirat.Liczba', '3']], loc: [['a.Imie', '"Kapi"'], ['b.Imie', '"Ola"'], ['c.Imie', '"Bob"']], cap: 'Pole statyczne Liczba jest jedno, wspólne dla całej załogi. Imie ma każdy pirat własne.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Jak wywołać metodę statyczną <code>Policz</code> z klasy <code>Kalkulator</code>?', opts: ['Kalkulator.Policz()', 'new Kalkulator.Policz()', 'Policz.Kalkulator()', 'this.Policz()'], a: 0, why: 'Składniki statyczne wywołujemy przez nazwę klasy.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`new Kulka(); new Kulka(); new Kulka();
Console.WriteLine(Kulka.Ile);

class Kulka
{
    public static int Ile;
    public Kulka() { Ile++; }
}`, opts: ['3', '1', '0', 'Błąd'], a: 0, out: true, why: 'Pole statyczne jest wspólne – każdy konstruktor zwiększa ten sam licznik.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`class Program
{
    int licznik = 0;
    static void Main()
    {
        licznik++;
        Console.WriteLine(licznik);
    }
}`, line: 2, fix: 'static int licznik = 0;', cause: true, why: 'Statyczna metoda Main nie widzi pól obiektu – kompilator zgłasza CS0120 przy użyciu licznik, ale przyczyną jest brak static w deklaracji pola.' },
   { t: 'quiz', l: 2, q: 'Czy w C# istnieje słowo kluczowe <code>friend</code> (jak w C++)?', opts: ['Nie – podobny efekt daje internal lub klasa zagnieżdżona', 'Tak, działa jak w C++', 'Tak, ale tylko dla struktur', 'Tak, zastępuje private'], a: 0, why: 'C# nie ma friend. Klasa zagnieżdżona widzi prywatne składowe klasy zewnętrznej, a internal otwiera dostęp w obrębie projektu.' },
   { t: 'quiz', l: 3, q: 'Co się stanie?', code: c`Narzedzia n = new Narzedzia();

static class Narzedzia
{
    public static int Dwa() => 2;
}`, opts: ['Błąd kompilacji', 'Utworzy obiekt', 'Wypisze 2', 'Wyjątek w czasie działania'], a: 0, compiles: false, why: 'Nie można tworzyć obiektów klasy statycznej (CS0712).' },
   { t: 'code', l: 2, q: 'Dopisz w klasie <code>Bilet</code> pole statyczne <code>nastepnyNumer</code> (start 1) oraz w konstruktorze nadawaj każdemu biletowi kolejny <code>Numer</code>.',
     start: 'Bilet a = new Bilet(), b = new Bilet(), c = new Bilet();\nConsole.WriteLine($"{a.Numer} {b.Numer} {c.Numer}");\n\nclass Bilet\n{\n    public int Numer;\n}\n', tests: [{ i: '', o: '1 2 3' }], check: "if (!/static/.test(src)) return 'Użyj pola static';",
     sol: c`Bilet a = new Bilet(), b = new Bilet(), c = new Bilet();
Console.WriteLine($"{a.Numer} {b.Numer} {c.Numer}");

class Bilet
{
    private static int nastepnyNumer = 1;
    public int Numer;
    public Bilet() { Numer = nastepnyNumer++; }
}`, hint: 'Numer = nastepnyNumer++;' },
  ] },
 ] });
