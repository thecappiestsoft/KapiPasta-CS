// Dział 12 (algorytmy): dwie nowe lekcje i dodatkowe zadania.

XL('algorytmy', { id: 'sortowanie', title: 'Sortowanie przez wybór i wstawianie',
  theory: `<p>Poza sortowaniem bąbelkowym warto znać dwa proste algorytmy sortowania:</p>
<ul><li><b>Sortowanie przez wybór</b> (selection sort): znajdź najmniejszy element w nieposortowanej części i zamień go z pierwszym elementem tej części. Powtarzaj, przesuwając granicę o jeden w prawo.</li>
<li><b>Sortowanie przez wstawianie</b> (insertion sort): bierz kolejne elementy i wstawiaj je na właściwe miejsce w posortowanej części po lewej – jak układanie kart w ręce.</li></ul>
<p>Oba wykonują około n²/2 porównań (złożoność <b>O(n²)</b>). Wstawianie jest bardzo szybkie dla danych <b>prawie posortowanych</b>. Biblioteczne <code>Array.Sort</code> działa w czasie <b>O(n log n)</b>.</p>
<p><b>Sortowanie przez zliczanie</b> działa jeszcze szybciej, gdy wartości są małymi liczbami całkowitymi (np. oceny 1–6): liczymy, ile razy występuje każda wartość, i wypisujemy je po kolei.</p>`,
  ex: [{ code: c`int[] t = { 29, 10, 14, 37, 13 };
for (int i = 0; i < t.Length - 1; i++)
{
    int min = i;
    for (int j = i + 1; j < t.Length; j++)
        if (t[j] < t[min]) min = j;
    int tmp = t[i]; t[i] = t[min]; t[min] = tmp;
    Console.WriteLine($"krok {i + 1}: {string.Join(" ", t)}");
}`, scene: { s: 'sort', arr: [29, 10, 14, 37, 13], cap: 'Kapi szuka najniższej kapibary w nieposortowanej części i stawia ją na początku. Lewa część rośnie o jedno miejsce w każdym kroku.' } }],
}, { title: 'Selection sort and insertion sort',
  theory: `<p>Besides bubble sort, two simple sorting algorithms are worth knowing:</p>
<ul><li><b>Selection sort</b>: find the smallest element in the unsorted part and swap it with the first element of that part. Repeat, moving the border one place to the right.</li>
<li><b>Insertion sort</b>: take the next elements and insert each into the right place in the sorted part on the left – like arranging cards in your hand.</li></ul>
<p>Both make about n²/2 comparisons (<b>O(n²)</b> complexity). Insertion is very fast for <b>almost sorted</b> data. The library <code>Array.Sort</code> runs in <b>O(n log n)</b>.</p>
<p><b>Counting sort</b> is even faster when the values are small integers (e.g. grades 1–6): count how many times each value occurs and print them in order.</p>`,
  ex: [{ code: c`int[] t = { 29, 10, 14, 37, 13 };
for (int i = 0; i < t.Length - 1; i++)
{
    int min = i;
    for (int j = i + 1; j < t.Length; j++)
        if (t[j] < t[min]) min = j;
    int tmp = t[i]; t[i] = t[min]; t[min] = tmp;
    Console.WriteLine($"step {i + 1}: {string.Join(" ", t)}");
}`, cap: 'Kapi looks for the shortest capybara in the unsorted part and puts it at the front. The left part grows by one place each step.' }] });

XL('algorytmy', { id: 'matematyka', title: 'Algorytmy liczbowe',
  theory: `<p>Klasyczne algorytmy na liczbach, o które pytają na egzaminach:</p>
<ul><li><b>NWD i NWW</b>: NWD liczymy algorytmem Euklidesa, a NWW(a, b) = a / NWD(a, b) · b.</li>
<li><b>Sito Eratostenesa</b>: aby znaleźć wszystkie liczby pierwsze do n, wykreślamy wielokrotności kolejnych liczb pierwszych. Zostają tylko pierwsze.</li>
<li><b>Systemy liczbowe</b>: zamiana na system o podstawie p – dzielimy liczbę przez p i zapisujemy reszty od końca. W C#: <code>Convert.ToString(n, 2)</code> i <code>Convert.ToInt32("1011", 2)</code>.</li>
<li><b>Szybkie potęgowanie</b>: aⁿ = (a^(n/2))² dla parzystych n – tylko log₂ n mnożeń.</li>
<li><b>Schemat Hornera</b>: wartość wielomianu liczymy jako ((a·x + b)·x + c)·x + d – bez potęgowania.</li></ul>`,
  ex: [{ code: c`int n = 30;
bool[] composite = new bool[n + 1];
for (int i = 2; i * i <= n; i++)
    if (!composite[i])
        for (int k = i * i; k <= n; k += i) composite[k] = true;
for (int i = 2; i <= n; i++)
    if (!composite[i]) Console.Write(i + " ");
Console.WriteLine();
Console.WriteLine(Convert.ToString(13, 2) + " " + Convert.ToInt32("1101", 2));`, scene: { s: 'cards', items: [['sito do 30', '2 3 5 7 11 13 17 19 23 29'], ['13 → dwójkowo', '1101', 'reszty: 1 0 1 1'], ['"1101" → dziesiętnie', '13', '8 + 4 + 1']], cap: 'Sito wykreśla wielokrotności 2, 3 i 5 – zostają liczby pierwsze. Zamiana systemów to dzielenie z resztą.' } }],
}, { title: 'Number algorithms',
  theory: `<p>Classic number algorithms that exams ask about:</p>
<ul><li><b>GCD and LCM</b>: GCD is computed with Euclid's algorithm, and LCM(a, b) = a / GCD(a, b) · b.</li>
<li><b>Sieve of Eratosthenes</b>: to find all primes up to n, cross out the multiples of successive primes. Only primes remain.</li>
<li><b>Number systems</b>: to convert to base p, divide the number by p and write the remainders backwards. In C#: <code>Convert.ToString(n, 2)</code> and <code>Convert.ToInt32("1011", 2)</code>.</li>
<li><b>Fast exponentiation</b>: aⁿ = (a^(n/2))² for even n – only log₂ n multiplications.</li>
<li><b>Horner's method</b>: a polynomial's value is computed as ((a·x + b)·x + c)·x + d – no powers needed.</li></ul>`,
  ex: [{ cap: 'The sieve crosses out multiples of 2, 3 and 5 – the primes remain. Converting between bases is division with remainder.', scene: { items: [['sieve up to 30', '2 3 5 7 11 13 17 19 23 29'], ['13 → binary', '1101', 'remainders: 1 0 1 1'], ['"1101" → decimal', '13', '8 + 4 + 1']] } }] });

X('algo', [
  QZ(1, 'Czym jest algorytm?', 'What is an algorithm?', ['Skończonym ciągiem kroków prowadzących do rozwiązania problemu', 'Językiem programowania', 'Rodzajem zmiennej', 'Programem do rysowania schematów'], ['A finite sequence of steps that solves a problem', 'A programming language', 'A kind of variable', 'A program for drawing diagrams'], 'Algorytm to przepis – można go zapisać w dowolnym języku albo na schemacie blokowym.', 'An algorithm is a recipe – it can be written in any language or as a flowchart.'),
  OUT(1, c`int[] t = { 4, 7, 1, 9, 3 };
int max = t[0];
foreach (int x in t) if (x > max) max = x;
Console.WriteLine(max);`, ['9', '4', '3', '1'], 'Wyszukiwanie maksimum: zapamiętujemy największą wartość widzianą do tej pory.', 'Finding the maximum: we remember the largest value seen so far.'),
  OUT(1, c`int[] t = { 5, 8, 2, 8, 1 };
int pos = -1;
for (int i = 0; i < t.Length; i++)
    if (t[i] == 8) { pos = i; break; }
Console.WriteLine(pos);`, ['1', '3', '8', '-1'], 'Wyszukiwanie liniowe kończy się na pierwszym trafieniu – indeks 1.', 'Linear search stops at the first match – index 1.'),
  QZ(1, 'Ile porównań w najgorszym przypadku wykona wyszukiwanie liniowe w tablicy 50 elementów?', 'How many comparisons does linear search make in the worst case in an array of 50 elements?', ['50', 'około 6', '25', '1'], ['50', 'about 6', '25', '1'], 'W najgorszym razie trzeba sprawdzić każdy element.', 'In the worst case every element has to be checked.'),
  OUT(1, c`int[] t = { 3, 6, 9 };
int s = 0;
foreach (int x in t) s += x;
Console.WriteLine(s / t.Length);`, ['6', '18', '3', '6.0'], 'Suma 18 podzielona przez 3 elementy – średnia 6.', 'The sum 18 divided by 3 elements – the average is 6.'),
  OUT(2, c`int[] t = { 1, 3, 5, 7, 9, 11, 13 };
int l = 0, r = t.Length - 1, steps = 0;
while (l <= r)
{
    steps++;
    int m = (l + r) / 2;
    if (t[m] == 11) break;
    if (t[m] < 11) l = m + 1; else r = m - 1;
}
Console.WriteLine(steps);`, ['2', '3', '6', '1'], 'Środek to 7 (< 11), potem przedział 9, 11, 13 i środek 11 – trafienie w 2. kroku.', 'The middle is 7 (< 11), then the range 9, 11, 13 with the middle 11 – found in step 2.'),
  BUG(2, c`int[] t = { 2, 4, 6, 8 };
int l = 0, r = t.Length - 1, found = -1;
while (l < r)
{
    int m = (l + r) / 2;
    if (t[m] == 8) { found = m; break; }
    if (t[m] < 8) l = m + 1; else r = m - 1;
}
Console.WriteLine(found);`, 2, 'while (l <= r)', 'Gdy l == r, został jeszcze jeden element do sprawdzenia. Warunek musi być l <= r – inaczej 8 nie zostanie znalezione.', 'When l == r there is still one element to check. The condition must be l <= r – otherwise 8 is not found.', { pl: { noerr: true, expect: '3' } }),
  CODE(2, 'Wczytaj <code>n</code> i n liczb. Wypisz, ile jest <b>liderów</b> – elementów większych od wszystkich elementów na prawo od nich (ostatni zawsze jest liderem). Zrób to jednym przejściem od końca.', 'Read <code>n</code> and n numbers. Print how many <b>leaders</b> there are – elements greater than all elements to their right (the last one is always a leader). Do it in one pass from the end.', null, [{ i: '6\n16\n17\n4\n3\n5\n2', o: '3' }, { i: '1\n7', o: '1' }, { i: '4\n1\n2\n3\n4', o: '1' }], c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
for (int i = 0; i < n; i++) t[i] = int.Parse(Console.ReadLine());
int max = int.MinValue, count = 0;
for (int i = n - 1; i >= 0; i--)
    if (t[i] > max) { max = t[i]; count++; }
Console.WriteLine(count);`, 'Idąc od końca, pamiętaj największą dotąd wartość – element większy od niej jest liderem.', 'Going from the end, remember the largest value so far – an element greater than it is a leader.'),
  CODE(3, 'Wczytaj <code>n</code> i n liczb (mogą być ujemne). Wypisz największą sumę <b>spójnego</b> fragmentu tablicy (algorytm Kadane, O(n)).', 'Read <code>n</code> and n numbers (they can be negative). Print the largest sum of a <b>contiguous</b> part of the array (Kadane\'s algorithm, O(n)).', null, [{ i: '8\n-2\n1\n-3\n4\n-1\n2\n1\n-5', o: '6' }, { i: '3\n-4\n-1\n-7', o: '-1' }, { i: '2\n5\n5', o: '10' }], c`int n = int.Parse(Console.ReadLine());
int best = int.MinValue, cur = 0;
for (int i = 0; i < n; i++)
{
    int x = int.Parse(Console.ReadLine());
    cur = Math.Max(x, cur + x);
    best = Math.Max(best, cur);
}
Console.WriteLine(best);`, 'cur = max(x, cur + x) – albo zaczynamy nowy fragment, albo przedłużamy bieżący.', 'cur = max(x, cur + x) – either start a new part or extend the current one.'),
  QZ(3, 'Jaka jest złożoność czasowa sortowania bąbelkowego dla n elementów?', 'What is the time complexity of bubble sort for n elements?', ['O(n²)', 'O(n)', 'O(log n)', 'O(n log n)'], null, 'Dwie zagnieżdżone pętle po n elementów – około n² porównań.', 'Two nested loops over n elements – about n² comparisons.'),
]);

X('sortowanie', [
  QZ(1, 'Na czym polega sortowanie przez wybór?', 'How does selection sort work?', ['Szukamy najmniejszego elementu w nieposortowanej części i stawiamy go na jej początku', 'Porównujemy sąsiadów i zamieniamy je', 'Wstawiamy elementy w miejsce w posortowanej części', 'Dzielimy tablicę na pół'], ['We find the smallest element in the unsorted part and put it at its start', 'We compare neighbours and swap them', 'We insert elements into place in the sorted part', 'We split the array in half'], 'Selection sort „wybiera” minimum w każdym kroku.', 'Selection sort “selects” the minimum in each step.'),
  QZ(1, 'Na czym polega sortowanie przez wstawianie?', 'How does insertion sort work?', ['Kolejny element wstawiamy na właściwe miejsce w posortowanej części po lewej', 'Szukamy maksimum i stawiamy je na końcu', 'Liczymy wystąpienia każdej wartości', 'Losujemy kolejność aż będzie dobra'], ['We insert the next element into the right place in the sorted part on the left', 'We find the maximum and put it at the end', 'We count occurrences of each value', 'We shuffle until the order is right'], 'Insertion sort działa jak układanie kart w ręce.', 'Insertion sort works like arranging cards in your hand.'),
  OUT(1, c`int[] t = { 5, 2, 9 };
Array.Sort(t);
Console.WriteLine(string.Join(" ", t));`, ['2 5 9', '9 5 2', '5 2 9', '2 9 5'], 'Array.Sort sortuje rosnąco.', 'Array.Sort sorts in ascending order.'),
  OUT(1, c`string[] s = { "pear", "apple", "fig" };
Array.Sort(s);
Console.WriteLine(s[0]);`, ['apple', 'pear', 'fig', 'appl'], 'Teksty sortują się alfabetycznie.', 'Strings are sorted alphabetically.'),
  QZ(1, 'Które sortowanie najszybciej posortuje dane <b>prawie</b> uporządkowane?', 'Which sort is fastest on <b>almost</b> sorted data?', ['Przez wstawianie', 'Przez wybór', 'Losowe', 'Każde tak samo'], ['Insertion sort', 'Selection sort', 'Random', 'All the same'], 'Wstawianie przesuwa elementy tylko o kilka miejsc, więc dla prawie posortowanych danych robi niewiele pracy.', 'Insertion moves elements only a few places, so it does little work on almost sorted data.'),
  OUT(2, c`int[] t = { 4, 3, 1, 2 };
for (int i = 1; i < t.Length; i++)
{
    int x = t[i], j = i - 1;
    while (j >= 0 && t[j] > x) { t[j + 1] = t[j]; j--; }
    t[j + 1] = x;
    if (i == 2) Console.WriteLine(string.Join(",", t));
}`, ['1,3,4,2', '3,4,1,2', '1,2,3,4', '3,1,4,2'], 'Po wstawieniu 3 mamy 3,4,1,2; po wstawieniu 1 (i = 2) – 1,3,4,2.', 'After inserting 3 we have 3,4,1,2; after inserting 1 (i = 2) – 1,3,4,2.'),
  OUT(2, c`var w = new List<string> { "ola", "kapi", "bob", "an" };
foreach (string s in w.OrderByDescending(s => s.Length).ThenBy(s => s))
    Console.Write(s + " ");`, ['kapi bob ola an ', 'kapi ola bob an ', 'an bob ola kapi ', 'an ola bob kapi '], 'Najpierw malejąco po długości (4, 3, 3, 2), przy remisie alfabetycznie: bob przed ola.', 'First by length descending (4, 3, 3, 2), on a tie alphabetically: bob before ola.'),
  CODE(2, 'Zaimplementuj <b>sortowanie przez wybór</b> (bez Array.Sort/LINQ). Wczytaj n i n liczb, wypisz je rosnąco oddzielone spacją.', 'Implement <b>selection sort</b> (no Array.Sort/LINQ). Read n and n numbers and print them in ascending order separated by spaces.', null, [{ i: '5\n29\n10\n14\n37\n13', o: '10 13 14 29 37' }, { i: '1\n5', o: '5' }], c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
for (int i = 0; i < n; i++) t[i] = int.Parse(Console.ReadLine());
for (int i = 0; i < n - 1; i++)
{
    int min = i;
    for (int j = i + 1; j < n; j++) if (t[j] < t[min]) min = j;
    int tmp = t[i]; t[i] = t[min]; t[min] = tmp;
}
Console.WriteLine(string.Join(" ", t));`, 'Dla każdego i znajdź indeks minimum w t[i..] i zamień.', 'For each i find the index of the minimum in t[i..] and swap.', { pl: { check: "if (/\\.Sort\\(|OrderBy/.test(src)) return 'Napisz sortowanie samodzielnie';" }, en: { check: "if (/\\.Sort\\(|OrderBy/.test(src)) return 'Write the sorting yourself';" } }),
  CODE(2, '<b>Sortowanie przez zliczanie</b>: wczytaj n i n ocen (1–6). Wypisz je posortowane rosnąco, oddzielone spacją. Użyj tablicy liczników <code>int[7]</code>.', '<b>Counting sort</b>: read n and n grades (1–6). Print them sorted ascending, separated by spaces. Use a counter array <code>int[7]</code>.', null, [{ i: '6\n5\n1\n3\n5\n6\n1', o: '1 1 3 5 5 6' }, { i: '1\n4', o: '4' }], c`int n = int.Parse(Console.ReadLine());
int[] cnt = new int[7];
for (int i = 0; i < n; i++) cnt[int.Parse(Console.ReadLine())]++;
var res = new List<int>();
for (int g = 1; g <= 6; g++)
    for (int k = 0; k < cnt[g]; k++) res.Add(g);
Console.WriteLine(string.Join(" ", res));`, 'cnt[ocena]++ dla każdej oceny, potem wypisz każdą ocenę cnt[g] razy.', 'cnt[grade]++ for each grade, then print each grade cnt[g] times.', { pl: { check: "if (/\\.Sort\\(|OrderBy/.test(src)) return 'Bez Sort – zliczaj';" }, en: { check: "if (/\\.Sort\\(|OrderBy/.test(src)) return 'No Sort – count';" } }),
  OUT(3, c`int[] t = { 3, 1, 2 };
int swaps = 0;
for (int i = 0; i < t.Length - 1; i++)
    for (int j = 0; j < t.Length - 1 - i; j++)
        if (t[j] > t[j + 1]) { int tmp = t[j]; t[j] = t[j + 1]; t[j + 1] = tmp; swaps++; }
Console.WriteLine(swaps);`, ['2', '3', '1', '0'], 'Bąbelkowe: (3,1) zamiana, (3,2) zamiana, potem już posortowane – 2 zamiany (tyle, ile inwersji).', 'Bubble sort: (3,1) swap, (3,2) swap, then it is sorted – 2 swaps (as many as inversions).'),
  CODE(3, 'Wczytaj n i n liczb. Wypisz liczbę <b>inwersji</b> – par (i, j), gdzie i < j i t[i] > t[j].', 'Read n and n numbers. Print the number of <b>inversions</b> – pairs (i, j) where i < j and t[i] > t[j].', null, [{ i: '4\n3\n1\n4\n2', o: '3' }, { i: '3\n1\n2\n3', o: '0' }, { i: '3\n3\n2\n1', o: '3' }], c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
for (int i = 0; i < n; i++) t[i] = int.Parse(Console.ReadLine());
int inv = 0;
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (t[i] > t[j]) inv++;
Console.WriteLine(inv);`, 'Dwie pętle: dla każdej pary i < j sprawdź t[i] > t[j].', 'Two loops: for every pair i < j check t[i] > t[j].'),
  CODE(3, 'Wczytaj n i n słów. Wypisz je posortowane <b>po długości</b> rosnąco, a przy tej samej długości alfabetycznie – każde w osobnej linii. Napisz własne sortowanie przez wstawianie z porównaniem dwóch kryteriów.', 'Read n and n words. Print them sorted <b>by length</b> ascending, and alphabetically for equal lengths – one per line. Write your own insertion sort comparing two criteria.', null, [{ i: '5\nkapi\nola\nbanan\nkot\nab', o: 'ab\nkot\nola\nkapi\nbanan' }], c`int n = int.Parse(Console.ReadLine());
string[] w = new string[n];
for (int i = 0; i < n; i++) w[i] = Console.ReadLine();
static bool Before(string a, string b) => a.Length != b.Length ? a.Length < b.Length : string.Compare(a, b) < 0;
for (int i = 1; i < n; i++)
{
    string x = w[i]; int j = i - 1;
    while (j >= 0 && Before(x, w[j])) { w[j + 1] = w[j]; j--; }
    w[j + 1] = x;
}
foreach (string s in w) Console.WriteLine(s);`, 'Metoda Before(a, b): najpierw porównaj długości, przy równych – string.Compare.', 'A method Before(a, b): compare lengths first, and for equal ones use string.Compare.', { pl: { check: "if (/\\.Sort\\(|OrderBy/.test(src)) return 'Napisz sortowanie samodzielnie';" }, en: { check: "if (/\\.Sort\\(|OrderBy/.test(src)) return 'Write the sorting yourself';" } }),
]);

X('matematyka', [
  QZ(1, 'Ile wynosi NWD(12, 18)?', 'What is GCD(12, 18)?', ['6', '3', '36', '2'], null, 'Największy wspólny dzielnik 12 i 18 to 6.', 'The greatest common divisor of 12 and 18 is 6.'),
  OUT(1, c`Console.WriteLine(Convert.ToString(10, 2));
Console.WriteLine(Convert.ToInt32("111", 2));`, ['1010\n7', '1010\n111', '10\n7', '0101\n7'], '10 = 8 + 2 → 1010; 111₂ = 4 + 2 + 1 = 7.', '10 = 8 + 2 → 1010; 111₂ = 4 + 2 + 1 = 7.'),
  QZ(1, 'Która liczba jest pierwsza?', 'Which number is prime?', ['29', '21', '27', '1'], null, '29 dzieli się tylko przez 1 i 29. 21 = 3 · 7, 27 = 3 · 9, a 1 nie jest liczbą pierwszą.', '29 divides only by 1 and 29. 21 = 3 · 7, 27 = 3 · 9, and 1 is not prime.'),
  OUT(1, c`Console.WriteLine(255.ToString("X"));
Console.WriteLine(Convert.ToInt32("FF", 16));`, ['FF\n255', '255\nFF', 'ff\n255', 'FF\nFF'], 'Format X zapisuje liczbę szesnastkowo; Convert.ToInt32(s, 16) zamienia z powrotem.', 'The X format writes a number in hex; Convert.ToInt32(s, 16) converts it back.'),
  OUT(2, c`static int Gcd(int a, int b) => b == 0 ? a : Gcd(b, a % b);
int x = 4, y = 6;
Console.WriteLine(x / Gcd(x, y) * y);`, ['12', '24', '2', '6'], 'NWW(4, 6) = 4 / NWD(4, 6) · 6 = 4 / 2 · 6 = 12.', 'LCM(4, 6) = 4 / GCD(4, 6) · 6 = 4 / 2 · 6 = 12.'),
  OUT(2, c`int n = 13;
string s = "";
while (n > 0) { s = (n % 2) + s; n /= 2; }
Console.WriteLine(s);`, ['1101', '1011', '13', '0110'], 'Reszty z dzielenia przez 2 to 1, 0, 1, 1 – czytane od końca dają 1101.', 'The remainders of division by 2 are 1, 0, 1, 1 – read backwards they give 1101.'),
  CODE(2, 'Wczytaj liczbę naturalną i podstawę p (2–16). Wypisz liczbę w systemie o podstawie p (cyfry 10–15 jako A–F) – bez Convert.ToString.', 'Read a natural number and a base p (2–16). Print the number in base p (digits 10–15 as A–F) – without Convert.ToString.', null, [{ i: '255\n16', o: 'FF' }, { i: '10\n2', o: '1010' }, { i: '0\n8', o: '0' }, { i: '100\n3', o: '10201' }], c`int n = int.Parse(Console.ReadLine());
int p = int.Parse(Console.ReadLine());
string digits = "0123456789ABCDEF", s = "";
do { s = digits[n % p] + s; n /= p; } while (n > 0);
Console.WriteLine(s);`, 'Dziel przez p i doklejaj cyfrę digits[n % p] na początek; do-while obsłuży n = 0.', 'Divide by p and prepend the digit digits[n % p]; do-while handles n = 0.', { pl: { check: "if (/Convert\\.ToString/.test(src)) return 'Bez Convert.ToString';" }, en: { check: "if (/Convert\\.ToString/.test(src)) return 'No Convert.ToString';" } }),
  CODE(2, 'Wczytaj liczbę i wypisz jej rozkład na czynniki pierwsze w postaci <code>2*2*3*5</code> (dla 60).', 'Read a number and print its prime factorization as <code>2*2*3*5</code> (for 60).', null, [{ i: '60', o: '2*2*3*5' }, { i: '13', o: '13' }, { i: '1024', o: '2*2*2*2*2*2*2*2*2*2' }], c`int n = int.Parse(Console.ReadLine());
var f = new List<int>();
for (int d = 2; d * d <= n; d++)
    while (n % d == 0) { f.Add(d); n /= d; }
if (n > 1) f.Add(n);
Console.WriteLine(string.Join("*", f));`, 'Dziel przez d, dopóki się da; to, co zostanie (> 1), też jest czynnikiem pierwszym.', 'Divide by d as long as possible; whatever remains (> 1) is also a prime factor.'),
  OUT(2, c`int[] a = { 2, 0, -1, 3 };
int x = 2, v = 0;
foreach (int c in a) v = v * x + c;
Console.WriteLine(v);`, ['17', '13', '14', '7'], 'Schemat Hornera dla 2x³ + 0x² − x + 3 przy x = 2: ((2·2 + 0)·2 − 1)·2 + 3 = 17.', 'Horner\'s method for 2x³ + 0x² − x + 3 at x = 2: ((2·2 + 0)·2 − 1)·2 + 3 = 17.'),
  CODE(3, 'Sito Eratostenesa: wczytaj n i wypisz liczbę liczb pierwszych ≤ n. Użyj tablicy <code>bool[]</code> (bez dzielenia każdej liczby osobno).', 'Sieve of Eratosthenes: read n and print the count of primes ≤ n. Use a <code>bool[]</code> array (no trial division of every number).', null, [{ i: '30', o: '10' }, { i: '2', o: '1' }, { i: '1000', o: '168' }], c`int n = int.Parse(Console.ReadLine());
bool[] comp = new bool[n + 1];
int count = 0;
for (int i = 2; i <= n; i++)
{
    if (comp[i]) continue;
    count++;
    for (long k = (long)i * i; k <= n; k += i) comp[k] = true;
}
Console.WriteLine(count);`, 'Dla każdej niewykreślonej i wykreśl i·i, i·i + i, …', 'For every i not crossed out, cross out i·i, i·i + i, …', { pl: { check: "if (!/bool\\s*\\[\\]/.test(src)) return 'Użyj tablicy bool[]';" }, en: { check: "if (!/bool\\s*\\[\\]/.test(src)) return 'Use a bool[] array';" } }),
  CODE(3, '<b>Szybkie potęgowanie</b>: wczytaj a, n i m. Wypisz aⁿ mod m, korzystając z aⁿ = (a^(n/2))² (rekurencyjnie albo w pętli). Użyj long.', '<b>Fast exponentiation</b>: read a, n and m. Print aⁿ mod m using aⁿ = (a^(n/2))² (recursively or in a loop). Use long.', null, [{ i: '2\n10\n1000', o: '24' }, { i: '3\n0\n7', o: '1' }, { i: '7\n123456789\n1000000007', o: '467332791' }], c`long a = long.Parse(Console.ReadLine());
long n = long.Parse(Console.ReadLine());
long m = long.Parse(Console.ReadLine());
long r = 1 % m;
a %= m;
while (n > 0)
{
    if (n % 2 == 1) r = r * a % m;
    a = a * a % m;
    n /= 2;
}
Console.WriteLine(r);`, 'Gdy bit n jest 1, pomnóż wynik przez a; w każdym kroku a = a² i n /= 2.', 'When the lowest bit of n is 1, multiply the result by a; in every step a = a² and n /= 2.'),
  OUT(3, c`static bool IsPal(int n)
{
    int r = 0, k = n;
    while (k > 0) { r = r * 10 + k % 10; k /= 10; }
    return r == n;
}
int c = 0;
for (int i = 10; i < 100; i++) if (IsPal(i) && i % 2 == 0) c++;
Console.WriteLine(c);`, ['4', '9', '5', '8'], 'Palindromy dwucyfrowe to 11, 22, …, 99; parzyste spośród nich: 22, 44, 66, 88.', 'Two-digit palindromes are 11, 22, …, 99; the even ones: 22, 44, 66, 88.'),
]);
