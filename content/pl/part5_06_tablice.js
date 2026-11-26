// Dział 6 (tablice i teksty): dodatkowe zadania.

X('tablice1', [
  OUT(1, c`int[] t = { 4, 8, 15, 16 };
Console.WriteLine(t.Length);
Console.WriteLine(t[t.Length - 1]);`, ['4\n16', '3\n16', '4\n15', '16\n4'], 'Length to liczba elementów (4); ostatni element ma indeks Length − 1.', 'Length is the number of elements (4); the last element has index Length − 1.'),
  OUT(1, c`string[] s = new string[3];
s[1] = "Kapi";
Console.WriteLine(s[1] + s.Length);`, ['Kapi3', 'Kapi', '3', 'Kapi2'], 'Tablica ma 3 miejsca; do s[1] wpisaliśmy "Kapi", a doklejenie liczby daje tekst Kapi3.', 'The array has 3 slots; "Kapi" went into s[1], and appending a number gives the text Kapi3.'),
  FILL(1, 'Uzupełnij, aby utworzyć tablicę 5 liczb całkowitych.', 'Fill in the gap to create an array of 5 integers.', c`int[] t = new ___[5];
Console.WriteLine(t.Length);`, [['int']], '5', 'new int[5] tworzy tablicę pięciu zer.', 'new int[5] creates an array of five zeros.'),
  QZ(1, 'Jaki indeks ma <b>pierwszy</b> element tablicy w C#?', 'What is the index of the <b>first</b> element of an array in C#?', ['0', '1', '-1', 'zależy od tablicy'], ['0', '1', '-1', 'it depends on the array'], 'Indeksy zaczynają się od 0.', 'Indexes start at 0.'),
  OUT(2, c`int[] a = { 1, 2, 3 };
int[] b = a;
b[0] = 99;
Console.WriteLine(a[0]);`, ['99', '1', '0', 'Błąd'], 'Tablica jest typem referencyjnym: a i b wskazują tę samą tablicę.', 'An array is a reference type: a and b point to the same array.', { en: { opts: ['99', '1', '0', 'An error'] } }),
  CODE(2, 'Wczytaj <code>n</code> i n liczb. Wypisz, ile z nich jest dodatnich, ile ujemnych i ile zer, w formacie <code>+P -U 0Z</code>.', 'Read <code>n</code> and n numbers. Print how many are positive, negative and zero as <code>+P -N 0Z</code>.', null, [{ i: '5\n3\n-1\n0\n7\n-4', o: '+2 -2 01' }, { i: '1\n0', o: '+0 -0 01' }], c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
int p = 0, u = 0, z = 0;
for (int i = 0; i < n; i++)
{
    t[i] = int.Parse(Console.ReadLine());
    if (t[i] > 0) p++; else if (t[i] < 0) u++; else z++;
}
Console.WriteLine($"+{p} -{u} 0{z}");`, 'Trzy liczniki i if / else if / else.', 'Three counters and if / else if / else.'),
  OUT(3, c`int[] t = { 5, 3, 8, 1 };
Array.Sort(t);
Array.Reverse(t);
Console.WriteLine(string.Join(",", t) + " " + Array.IndexOf(t, 3));`, ['8,5,3,1 2', '1,3,5,8 1', '8,5,3,1 1', '5,3,8,1 1'], 'Sort układa rosnąco, Reverse odwraca – malejąco 8,5,3,1; liczba 3 jest teraz na indeksie 2.', 'Sort orders ascending, Reverse flips – descending 8,5,3,1; the number 3 is now at index 2.'),
  CODE(3, 'Wczytaj <code>n</code> i n liczb. Wypisz <b>drugą największą różną</b> wartość, a gdy nie istnieje (wszystkie równe) – <code>brak</code>. Nie sortuj.', 'Read <code>n</code> and n numbers. Print the <b>second largest distinct</b> value, or <code>none</code> if it does not exist (all equal). Do not sort.', null, [{ i: '5\n4\n9\n7\n9\n1', o: '7' }, { i: '3\n2\n2\n2', o: 'brak' }, { i: '2\n-5\n-3', o: '-5' }], c`int n = int.Parse(Console.ReadLine());
int max = int.MinValue, second = int.MinValue;
bool has = false;
for (int i = 0; i < n; i++)
{
    int x = int.Parse(Console.ReadLine());
    if (x > max) { if (max != int.MinValue) { second = max; has = true; } max = x; }
    else if (x < max && (!has || x > second)) { second = x; has = true; }
}
Console.WriteLine(has ? second.ToString() : "brak");`, 'Trzymaj max i second; gdy pojawi się nowe max, stare max staje się second.', 'Keep max and second; when a new max appears, the old max becomes second.', { pl: { check: "if (/Sort|OrderBy/.test(src)) return 'Bez sortowania';" }, en: { check: "if (/Sort|OrderBy/.test(src)) return 'No sorting';", tests: [{ i: '5\n4\n9\n7\n9\n1', o: '7' }, { i: '3\n2\n2\n2', o: 'none' }, { i: '2\n-5\n-3', o: '-5' }], sol: c`int n = int.Parse(Console.ReadLine());
int max = int.MinValue, second = int.MinValue;
bool has = false;
for (int i = 0; i < n; i++)
{
    int x = int.Parse(Console.ReadLine());
    if (x > max) { if (max != int.MinValue) { second = max; has = true; } max = x; }
    else if (x < max && (!has || x > second)) { second = x; has = true; }
}
Console.WriteLine(has ? second.ToString() : "none");` } }),
]);

X('tablice2', [
  OUT(1, c`int[,] m = { { 1, 2, 3 }, { 4, 5, 6 } };
Console.WriteLine(m[1, 2]);`, ['6', '5', '2', '3'], 'Wiersz 1 (drugi), kolumna 2 (trzecia) – to 6.', 'Row 1 (the second), column 2 (the third) – that is 6.'),
  QZ(1, 'Ile elementów ma tablica <code>new int[3, 4]</code>?', 'How many elements does <code>new int[3, 4]</code> have?', ['12', '7', '3', '4'], null, '3 wiersze · 4 kolumny = 12 komórek.', '3 rows · 4 columns = 12 cells.'),
  OUT(2, c`int[,] m = { { 1, 2 }, { 3, 4 }, { 5, 6 } };
int s = 0;
for (int r = 0; r < m.GetLength(0); r++) s += m[r, 1];
Console.WriteLine(s);`, ['12', '9', '21', '6'], 'Sumujemy kolumnę 1: 2 + 4 + 6 = 12.', 'We add column 1: 2 + 4 + 6 = 12.'),
  OUT(3, c`int[,] m = { { 1, 2, 3 }, { 4, 5, 6 }, { 7, 8, 9 } };
int d = 0, a = 0;
for (int i = 0; i < 3; i++)
{
    d += m[i, i];
    a += m[i, 2 - i];
}
Console.WriteLine(d + " " + a);`, ['15 15', '15 12', '12 15', '45 15'], 'Główna przekątna 1 + 5 + 9 = 15, druga przekątna 3 + 5 + 7 = 15.', 'The main diagonal 1 + 5 + 9 = 15, the other diagonal 3 + 5 + 7 = 15.'),
  CODE(3, 'Wczytaj <code>n</code> i wypisz macierz n×n, w której na przekątnej są 1, nad nią 2, a pod nią 0 (liczby oddzielone spacją).', 'Read <code>n</code> and print an n×n matrix with 1 on the diagonal, 2 above it and 0 below it (numbers separated by spaces).', null, [{ i: '3', o: '1 2 2\n0 1 2\n0 0 1' }, { i: '1', o: '1' }], c`int n = int.Parse(Console.ReadLine());
int[,] m = new int[n, n];
for (int r = 0; r < n; r++)
    for (int c = 0; c < n; c++)
        m[r, c] = r == c ? 1 : (c > r ? 2 : 0);
for (int r = 0; r < n; r++)
{
    string line = "";
    for (int c = 0; c < n; c++) line += (c > 0 ? " " : "") + m[r, c];
    Console.WriteLine(line);
}`, 'Porównaj numer wiersza r z numerem kolumny c.', 'Compare the row number r with the column number c.'),
  CODE(3, 'Wczytaj <code>n</code> i narysuj trójkąt Pascala z n wierszy (liczby oddzielone spacją). Użyj tablicy poszarpanej <code>int[][]</code>.', 'Read <code>n</code> and draw Pascal\'s triangle with n rows (numbers separated by spaces). Use a jagged array <code>int[][]</code>.', null, [{ i: '5', o: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1' }, { i: '1', o: '1' }], c`int n = int.Parse(Console.ReadLine());
int[][] p = new int[n][];
for (int i = 0; i < n; i++)
{
    p[i] = new int[i + 1];
    p[i][0] = p[i][i] = 1;
    for (int j = 1; j < i; j++) p[i][j] = p[i - 1][j - 1] + p[i - 1][j];
    Console.WriteLine(string.Join(" ", p[i]));
}`, 'Każdy wewnętrzny element to suma dwóch elementów nad nim.', 'Each inner element is the sum of the two elements above it.', { pl: { check: "if (!/\\[\\]\\[\\]/.test(src)) return 'Użyj int[][]';" }, en: { check: "if (!/\\[\\]\\[\\]/.test(src)) return 'Use int[][]';" } }),
]);

X('stringi', [
  OUT(1, c`string s = "Kapibara";
Console.WriteLine(s.Length);
Console.WriteLine(s[0] + "" + s[s.Length - 1]);`, ['8\nKa', '8\nK', '7\nKa', '8\nKr'], 'Długość to 8; pierwszy znak K, ostatni a.', 'The length is 8; the first character is K, the last is a.'),
  OUT(1, c`string s = "pasta";
Console.WriteLine(s.ToUpper());
Console.WriteLine(s.Replace("a", "o"));`, ['PASTA\nposto', 'PASTA\npasta', 'Pasta\nposto', 'pasta\nposto'], 'ToUpper daje wielkie litery, Replace zamienia każde a na o.', 'ToUpper gives capitals, Replace changes every a into o.'),
  QZ(1, 'Co zwraca <code>"kapi".Contains("ap")</code>?', 'What does <code>"kapi".Contains("ap")</code> return?', ['True', 'False', '1', '"ap"'], null, 'Contains sprawdza, czy tekst zawiera podany fragment.', 'Contains checks whether the text contains the given fragment.'),
  OUT(2, c`string s = "a,b,,c";
string[] p = s.Split(',');
Console.WriteLine(p.Length);
Console.WriteLine(string.Join("|", p));`, ['4\na|b||c', '3\na|b|c', '4\na|b|c', '5\na|b||c'], 'Między dwoma przecinkami jest pusty tekst – to też element tablicy.', 'Between two commas there is an empty string – it is also an array element.'),
  CODE(2, 'Wczytaj zdanie i wypisz liczbę samogłosek (a, e, i, o, u, y – małe i wielkie).', 'Read a sentence and print the number of vowels (a, e, i, o, u, y – lower and upper case).', null, [{ i: 'Kapibara lubi arbuzy', o: '9' }, { i: 'xyz', o: '1' }, { i: 'AEIOU', o: '5' }], c`string s = Console.ReadLine().ToLower();
int c = 0;
foreach (char ch in s)
    if ("aeiouy".Contains(ch)) c++;
Console.WriteLine(c);`, '"aeiouy".Contains(ch) sprawdza, czy znak jest samogłoską.', '"aeiouy".Contains(ch) checks whether a character is a vowel.'),
  OUT(3, c`string a = "kapi";
string b = "KAPI".ToLower();
Console.WriteLine(a == b);
Console.WriteLine(string.Compare("apple", "banana") < 0);
Console.WriteLine("abc".CompareTo("abd"));`, ['True\nTrue\n-1', 'False\nTrue\n-1', 'True\nFalse\n1', 'True\nTrue\n1'], '== porównuje zawartość tekstów. Compare/CompareTo zwraca liczbę ujemną, gdy pierwszy tekst jest wcześniej alfabetycznie.', '== compares the contents of strings. Compare/CompareTo returns a negative number when the first text comes earlier alphabetically.'),
  CODE(3, 'Wczytaj zdanie i wypisz je tak, by każde słowo zaczynało się wielką literą, a reszta była mała (pojedyncze spacje między słowami).', 'Read a sentence and print it so that every word starts with a capital letter and the rest is lower case (single spaces between words).', null, [{ i: 'kapI lubi ARBUZY', o: 'Kapi Lubi Arbuzy' }, { i: 'a', o: 'A' }], c`string[] w = Console.ReadLine().Split(' ');
for (int i = 0; i < w.Length; i++)
    if (w[i].Length > 0) w[i] = char.ToUpper(w[i][0]) + w[i].Substring(1).ToLower();
Console.WriteLine(string.Join(" ", w));`, 'Split, potem char.ToUpper(w[0]) + w.Substring(1).ToLower(), na końcu string.Join.', 'Split, then char.ToUpper(w[0]) + w.Substring(1).ToLower(), finally string.Join.'),
]);
