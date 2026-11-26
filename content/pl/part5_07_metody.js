// Dział 7 (metody): dodatkowe zadania.

X('metody1', [
  OUT(1, c`static int Triple(int x) => x * 3;
Console.WriteLine(Triple(Triple(2)));`, ['18', '6', '12', '9'], 'Najpierw Triple(2) = 6, potem Triple(6) = 18.', 'First Triple(2) = 6, then Triple(6) = 18.'),
  OUT(1, c`static void Hello(string who)
{
    Console.WriteLine("Hi " + who);
}
Hello("Kapi");
Hello("Ola");`, ['Hi Kapi\nHi Ola', 'Hi Kapi', 'Hi who\nHi who', 'Hello Kapi\nHello Ola'], 'Metodę można wywołać wiele razy z różnymi argumentami.', 'A method can be called many times with different arguments.'),
  FILL(1, 'Uzupełnij typ zwracany metody, która zwraca sumę dwóch liczb całkowitych.', 'Fill in the return type of a method that returns the sum of two integers.', c`static ___ Add(int a, int b)
{
    return a + b;
}
Console.WriteLine(Add(2, 5));`, [['int']], '7', 'Suma dwóch int to int.', 'The sum of two ints is an int.'),
  CODE(2, 'Napisz metodę <code>static bool IsPrime(int n)</code> i wypisz wynik dla wczytanej liczby (<code>True</code>/<code>False</code>).', 'Write a method <code>static bool IsPrime(int n)</code> and print the result for the number read (<code>True</code>/<code>False</code>).', null, [{ i: '13', o: 'True' }, { i: '1', o: 'False' }, { i: '91', o: 'False' }], c`static bool IsPrime(int n)
{
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++) if (n % d == 0) return false;
    return true;
}
Console.WriteLine(IsPrime(int.Parse(Console.ReadLine())));`, 'Sprawdzaj dzielniki od 2 do √n; dla n < 2 zwróć false.', 'Check divisors from 2 to √n; for n < 2 return false.', { pl: { check: "if (!/bool\\s+IsPrime\\s*\\(/.test(src)) return 'Napisz metodę bool IsPrime(int n)';" }, en: { check: "if (!/bool\\s+IsPrime\\s*\\(/.test(src)) return 'Write the method bool IsPrime(int n)';" } }),
  OUT(3, c`int x = 10;
static int F(int x)
{
    x = x * 2;
    return x + 1;
}
Console.WriteLine(F(x) + " " + x);`, ['21 10', '21 20', '11 10', '20 10'], 'Parametr x w metodzie to osobna, lokalna kopia – zmienna x z zewnątrz się nie zmienia.', 'The parameter x in the method is a separate local copy – the outer variable x does not change.'),
  CODE(3, 'Napisz metodę <code>static string Bar(int value, int max)</code>, która rysuje pasek z 10 znaków: <code>#</code> za każde pełne 10% wartości i <code>-</code> za resztę. Wczytaj value i max i wypisz <code>[pasek] P%</code> (P – procent zaokrąglony w dół).', 'Write a method <code>static string Bar(int value, int max)</code> that draws a 10-character bar: <code>#</code> for every full 10% of the value and <code>-</code> for the rest. Read value and max and print <code>[bar] P%</code> (P – the percentage rounded down).', null, [{ i: '37\n100', o: '[###-------] 37%' }, { i: '5\n5', o: '[##########] 100%' }, { i: '0\n8', o: '[----------] 0%' }], c`static string Bar(int value, int max)
{
    int p = value * 100 / max;
    int full = p / 10;
    return "[" + new string('#', full) + new string('-', 10 - full) + "] " + p + "%";
}
int v = int.Parse(Console.ReadLine());
int m = int.Parse(Console.ReadLine());
Console.WriteLine(Bar(v, m));`, 'p = value * 100 / max; liczba # to p / 10; new string(\'#\', n) powtarza znak.', 'p = value * 100 / max; the number of # is p / 10; new string(\'#\', n) repeats a character.'),
]);

X('przeciazanie', [
  QZ(1, 'Które dwie metody można umieścić razem w jednej klasie (poprawne przeciążenie)?', 'Which two methods can be placed together in one class (a valid overload)?', ['int Max(int a, int b) i double Max(double a, double b)', 'int Max(int a, int b) i double Max(int a, int b)', 'int Max(int a, int b) i int Max(int x, int y)', 'void Max() i void Max()'], ['int Max(int a, int b) and double Max(double a, double b)', 'int Max(int a, int b) and double Max(int a, int b)', 'int Max(int a, int b) and int Max(int x, int y)', 'void Max() and void Max()'], 'Przeciążenia muszą różnić się listą parametrów (typy lub liczba). Same nazwy parametrów ani typ zwracany nie wystarczą.', 'Overloads must differ in their parameter list (types or count). Parameter names or the return type alone are not enough.'),
  OUT(2, c`Console.WriteLine(P.Show(5) + P.Show(5L) + P.Show('5') + P.Show(5.0f));

class P
{
    public static string Show(int x) => "i";
    public static string Show(long x) => "l";
    public static string Show(double x) => "d";
    public static string Show(string x) => "s";
}`, ['ilid', 'ilsd', 'idid', 'iiid'], "char '5' konwertuje się niejawnie na int (najbliższe dopasowanie), a float na double.", "The char '5' converts implicitly to int (the closest match), and float to double."),
  OUT(3, c`Console.WriteLine(Calc.Sum() + Calc.Sum(1) + Calc.Sum(1, 2, 3));

class Calc
{
    public static int Sum(int a = 10, int b = 20) => a + b;
    public static int Sum(params int[] t) { int s = 0; foreach (int x in t) s += x; return s; }
}`, ['57', '36', '30', '66'], 'Sum() i Sum(1) pasują do wersji z parametrami domyślnymi (30 i 21), a Sum(1, 2, 3) – tylko do params (6). 30 + 21 + 6 = 57.', 'Sum() and Sum(1) match the version with default parameters (30 and 21), and Sum(1, 2, 3) only params (6). 30 + 21 + 6 = 57.'),
]);

X('refout', [
  OUT(1, c`static void SetZero(ref int x) { x = 0; }
int n = 42;
SetZero(ref n);
Console.WriteLine(n);`, ['0', '42', 'Błąd kompilacji', '-42'], 'ref przekazuje oryginalną zmienną – metoda ją wyzerowała.', 'ref passes the original variable – the method set it to zero.', { en: { opts: ['0', '42', 'A compile error', '-42'] } }),
  OUT(1, c`bool ok = int.TryParse("abc", out int v);
Console.WriteLine(ok + " " + v);`, ['False 0', 'True 0', 'False abc', 'FormatException'], 'TryParse nie rzuca wyjątku: zwraca false, a parametr out dostaje 0.', 'TryParse does not throw: it returns false and the out parameter gets 0.'),
  OUT(3, c`static void Inc(int[] t, int x) { t[0]++; x++; }
int[] arr = { 1 };
int num = 1;
Inc(arr, num);
Console.WriteLine(arr[0] + " " + num);`, ['2 1', '1 1', '2 2', '1 2'], 'Tablica jest przekazywana przez referencję do tego samego obiektu, więc zmiana t[0] jest widoczna. int jest kopiowany.', 'The array reference points to the same object, so changing t[0] is visible. The int is copied.'),
  CODE(3, 'Napisz metodę <code>static bool Stats(int[] t, out int min, out int max, out double avg)</code>, która dla pustej tablicy zwraca false. Wczytaj n i n liczb i wypisz <code>min max avg</code> (avg z formatem F1) albo <code>pusto</code>.', 'Write a method <code>static bool Stats(int[] t, out int min, out int max, out double avg)</code> that returns false for an empty array. Read n and n numbers and print <code>min max avg</code> (avg with format F1) or <code>empty</code>.', null, [{ i: '4\n3\n9\n1\n4', o: '1 9 4.3' }, { i: '0', o: 'pusto' }], c`static bool Stats(int[] t, out int min, out int max, out double avg)
{
    min = 0; max = 0; avg = 0;
    if (t.Length == 0) return false;
    min = t[0]; max = t[0]; int s = 0;
    foreach (int x in t) { if (x < min) min = x; if (x > max) max = x; s += x; }
    avg = (double)s / t.Length;
    return true;
}
int n = int.Parse(Console.ReadLine());
int[] a = new int[n];
for (int i = 0; i < n; i++) a[i] = int.Parse(Console.ReadLine());
if (Stats(a, out int mn, out int mx, out double av)) Console.WriteLine($"{mn} {mx} {av:F1}");
else Console.WriteLine("pusto");`, 'Parametry out trzeba przypisać na każdej ścieżce – także przy pustej tablicy.', 'out parameters must be assigned on every path – also for an empty array.', { pl: { check: "if (!/out\\s+int\\s+min/.test(src)) return 'Użyj parametrów out';" }, en: { check: "if (!/out\\s+int\\s+min/.test(src)) return 'Use out parameters';", tests: [{ i: '4\n3\n9\n1\n4', o: '1 9 4.3' }, { i: '0', o: 'empty' }], sol: c`static bool Stats(int[] t, out int min, out int max, out double avg)
{
    min = 0; max = 0; avg = 0;
    if (t.Length == 0) return false;
    min = t[0]; max = t[0]; int s = 0;
    foreach (int x in t) { if (x < min) min = x; if (x > max) max = x; s += x; }
    avg = (double)s / t.Length;
    return true;
}
int n = int.Parse(Console.ReadLine());
int[] a = new int[n];
for (int i = 0; i < n; i++) a[i] = int.Parse(Console.ReadLine());
if (Stats(a, out int mn, out int mx, out double av)) Console.WriteLine($"{mn} {mx} {av:F1}");
else Console.WriteLine("empty");` } }),
]);

X('rekurencja', [
  OUT(1, c`static int F(int n) => n == 0 ? 0 : n + F(n - 1);
Console.WriteLine(F(3));`, ['6', '3', '0', '9'], 'F(3) = 3 + F(2) = 3 + 2 + F(1) = 3 + 2 + 1 + 0 = 6.', 'F(3) = 3 + F(2) = 3 + 2 + F(1) = 3 + 2 + 1 + 0 = 6.'),
  OUT(2, c`static void Up(int n)
{
    if (n == 0) return;
    Up(n - 1);
    Console.Write(n);
}
Up(4);`, ['1234', '4321', '0123', '43210'], 'Wypisanie jest po wywołaniu rekurencyjnym, więc liczby wychodzą w kolejności powrotów: 1, 2, 3, 4.', 'Printing happens after the recursive call, so the numbers appear as the calls return: 1, 2, 3, 4.'),
  OUT(3, c`static int Digits(int n) => n < 10 ? n : n % 10 + Digits(n / 10);
Console.WriteLine(Digits(98765));`, ['35', '5', '9', '98765'], 'Rekurencyjna suma cyfr: 5 + 6 + 7 + 8 + 9 = 35.', 'A recursive digit sum: 5 + 6 + 7 + 8 + 9 = 35.'),
  CODE(3, 'Wieże Hanoi: wczytaj liczbę krążków <code>n</code> i wypisz wszystkie ruchy w formacie <code>A -> C</code> (przenosimy z A na C, pomocniczy B). Napisz rekurencyjną metodę <code>Hanoi(int n, char from, char to, char via)</code>.', 'Towers of Hanoi: read the number of disks <code>n</code> and print all moves as <code>A -> C</code> (move from A to C, helper B). Write a recursive method <code>Hanoi(int n, char from, char to, char via)</code>.', null, [{ i: '2', o: 'A -> B\nA -> C\nB -> C' }, { i: '1', o: 'A -> C' }, { i: '3', o: 'A -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C' }], c`static void Hanoi(int n, char from, char to, char via)
{
    if (n == 0) return;
    Hanoi(n - 1, from, via, to);
    Console.WriteLine($"{from} -> {to}");
    Hanoi(n - 1, via, to, from);
}
Hanoi(int.Parse(Console.ReadLine()), 'A', 'C', 'B');`, 'Przenieś n − 1 krążków na pomocniczy, największy na cel, potem n − 1 na cel.', 'Move n − 1 disks to the helper, the largest to the target, then n − 1 to the target.', { pl: { check: "if (!/Hanoi\\s*\\([^)]*\\)[\\s\\S]*Hanoi\\s*\\(n\\s*-\\s*1/.test(src)) return 'Metoda Hanoi ma wywoływać samą siebie';" }, en: { check: "if (!/Hanoi\\s*\\([^)]*\\)[\\s\\S]*Hanoi\\s*\\(n\\s*-\\s*1/.test(src)) return 'The Hanoi method should call itself';" } }),
]);
