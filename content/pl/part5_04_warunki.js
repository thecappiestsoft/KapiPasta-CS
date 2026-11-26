// Dział 4 (warunki): dodatkowe zadania.

X('if', [
  OUT(1, c`int t = 25;
if (t > 30) Console.WriteLine("hot");
else if (t > 20) Console.WriteLine("warm");
else Console.WriteLine("cold");`, ['warm', 'hot', 'cold', 'hot\nwarm'], 'Pierwszy prawdziwy warunek to t > 20 – wykonuje się tylko jego gałąź.', 'The first true condition is t > 20 – only its branch runs.'),
  OUT(1, c`int n = 4;
if (n % 2 == 0)
{
    Console.WriteLine("even");
}
Console.WriteLine("end");`, ['even\nend', 'end', 'even', 'odd\nend'], '4 jest parzyste, więc wypisze even, a end wypisuje się zawsze – jest poza if.', '4 is even, so even is printed, and end is always printed – it is outside the if.'),
  QZ(1, 'Co się stanie, gdy warunek w <code>if</code> jest fałszywy i nie ma <code>else</code>?', 'What happens when the condition of an <code>if</code> is false and there is no <code>else</code>?', ['Blok if zostanie pominięty, program idzie dalej', 'Program zgłosi błąd', 'Program się zakończy', 'Blok wykona się mimo to'], ['The if block is skipped and the program continues', 'The program reports an error', 'The program ends', 'The block runs anyway'], 'else jest opcjonalne – bez niego fałszywy warunek po prostu pomija blok.', 'else is optional – without it a false condition simply skips the block.'),
  OUT(1, c`int a = 3, b = 3;
if (a > b) Console.WriteLine("a");
else if (a < b) Console.WriteLine("b");
else Console.WriteLine("=");`, ['=', 'a', 'b', 'a\nb'], 'Żaden z warunków a > b ani a < b nie jest prawdziwy, więc wykona się else.', 'Neither a > b nor a < b is true, so the else branch runs.'),
  FILL(1, 'Uzupełnij, aby program wypisał <code>minus</code> dla liczb ujemnych, a <code>plus</code> dla pozostałych.', 'Fill in the gaps so that the program prints <code>minus</code> for negative numbers and <code>plus</code> for the others.', c`int x = -5;
___ (x < 0) Console.WriteLine("minus");
___ Console.WriteLine("plus");`, [['if'], ['else']], 'minus', 'if sprawdza warunek, else obsługuje pozostałe przypadki.', 'if checks the condition, else handles the remaining cases.'),
  OUT(2, c`int x = 15;
string s = x % 3 == 0 ? (x % 5 == 0 ? "FizzBuzz" : "Fizz") : "-";
Console.WriteLine(s);`, ['FizzBuzz', 'Fizz', '-', 'Buzz'], 'Operator warunkowy ?: można zagnieżdżać: 15 dzieli się przez 3 i przez 5.', 'The ?: operator can be nested: 15 divides by both 3 and 5.'),
  BUG(2, c`int x = 3;
if (x > 5);
{
    Console.WriteLine("big");
}`, 1, 'if (x > 5)', 'Średnik po if kończy instrukcję – blok w klamrach wykonuje się zawsze. Usuń średnik.', 'The semicolon after if ends the statement – the block in braces always runs. Remove the semicolon.', { pl: { noerr: true, expect: '' } }),
  OUT(2, c`int p = 85;
if (p >= 50) Console.Write("pass ");
if (p >= 80) Console.Write("good ");
if (p >= 90) Console.Write("great");`, ['pass good ', 'pass ', 'good ', 'pass good great'], 'To trzy osobne if (bez else), więc sprawdza się każdy: 85 spełnia dwa pierwsze.', 'These are three separate ifs (no else), so each is checked: 85 meets the first two.'),
  CODE(2, 'Wczytaj trzy liczby (każda w linii) i wypisz największą. Nie używaj Math.Max.', 'Read three numbers (one per line) and print the largest. Do not use Math.Max.', null, [{ i: '3\n9\n4', o: '9' }, { i: '-1\n-5\n-2', o: '-1' }, { i: '7\n7\n2', o: '7' }], c`int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
int c = int.Parse(Console.ReadLine());
int max = a;
if (b > max) max = b;
if (c > max) max = c;
Console.WriteLine(max);`, 'Zapamiętaj pierwszą liczbę jako max i porównaj z nią pozostałe.', 'Store the first number as max and compare the others with it.', { pl: { check: "if (/Math\\.Max/.test(src)) return 'Bez Math.Max';" }, en: { check: "if (/Math\\.Max/.test(src)) return 'No Math.Max';" } }),
  CODE(2, 'Wczytaj liczbę punktów (0–100) i wypisz ocenę: 0–29 → 1, 30–49 → 2, 50–74 → 3, 75–89 → 4, 90–99 → 5, 100 → 6.', 'Read a number of points (0–100) and print the grade: 0–29 → 1, 30–49 → 2, 50–74 → 3, 75–89 → 4, 90–99 → 5, 100 → 6.', null, [{ i: '100', o: '6' }, { i: '92', o: '5' }, { i: '75', o: '4' }, { i: '50', o: '3' }, { i: '30', o: '2' }, { i: '0', o: '1' }], c`int p = int.Parse(Console.ReadLine());
if (p == 100) Console.WriteLine(6);
else if (p >= 90) Console.WriteLine(5);
else if (p >= 75) Console.WriteLine(4);
else if (p >= 50) Console.WriteLine(3);
else if (p >= 30) Console.WriteLine(2);
else Console.WriteLine(1);`, 'Drabinka if / else if – sprawdzaj od najwyższej oceny.', 'An if / else if ladder – check from the highest grade.'),
  OUT(3, c`int x = 5;
if (x > 3)
    if (x > 10) Console.WriteLine("A");
else Console.WriteLine("B");`, ['B', 'A', 'nic', 'A\nB'], 'else należy do najbliższego if (x > 10), mimo wcięcia. x > 3 jest prawdą, x > 10 – nie, więc B.', 'The else belongs to the nearest if (x > 10), despite the indentation. x > 3 is true, x > 10 is not, so B.', { en: { opts: ['B', 'A', 'nothing', 'A\nB'] } }),
  OUT(3, c`int? n = null;
if (n is int v && v > 0) Console.WriteLine("positive " + v);
else if (n == null) Console.WriteLine("none");
else Console.WriteLine("other");`, ['none', 'positive 0', 'other', 'NullReferenceException'], 'Wzorzec n is int v jest fałszywy dla null, więc sprawdza się n == null.', 'The pattern n is int v is false for null, so n == null is checked.'),
  CODE(3, 'Wczytaj długości trzech boków. Wypisz <code>brak</code>, jeśli nie da się zbudować trójkąta; <code>równoboczny</code>, <code>równoramienny</code> albo <code>różnoboczny</code>.', 'Read the lengths of three sides. Print <code>none</code> if they cannot make a triangle; otherwise <code>equilateral</code>, <code>isosceles</code> or <code>scalene</code>.', null, [{ i: '3\n3\n3', o: 'równoboczny' }, { i: '3\n4\n3', o: 'równoramienny' }, { i: '3\n4\n5', o: 'różnoboczny' }, { i: '1\n2\n3', o: 'brak' }], c`int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
int c = int.Parse(Console.ReadLine());
if (a + b <= c || a + c <= b || b + c <= a) Console.WriteLine("brak");
else if (a == b && b == c) Console.WriteLine("równoboczny");
else if (a == b || b == c || a == c) Console.WriteLine("równoramienny");
else Console.WriteLine("różnoboczny");`, 'Najpierw nierówność trójkąta: suma każdych dwóch boków musi być większa od trzeciego.', 'First the triangle inequality: every two sides together must be longer than the third.', { en: { tests: [{ i: '3\n3\n3', o: 'equilateral' }, { i: '3\n4\n3', o: 'isosceles' }, { i: '3\n4\n5', o: 'scalene' }, { i: '1\n2\n3', o: 'none' }], sol: c`int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
int c = int.Parse(Console.ReadLine());
if (a + b <= c || a + c <= b || b + c <= a) Console.WriteLine("none");
else if (a == b && b == c) Console.WriteLine("equilateral");
else if (a == b || b == c || a == c) Console.WriteLine("isosceles");
else Console.WriteLine("scalene");` } }),
  CODE(3, 'Wczytaj współczynniki a, b, c równania kwadratowego ax² + bx + c = 0 (a ≠ 0). Wypisz liczbę rozwiązań rzeczywistych: <code>0</code>, <code>1</code> albo <code>2</code>.', 'Read the coefficients a, b, c of the quadratic equation ax² + bx + c = 0 (a ≠ 0). Print the number of real solutions: <code>0</code>, <code>1</code> or <code>2</code>.', null, [{ i: '1\n-3\n2', o: '2' }, { i: '1\n2\n1', o: '1' }, { i: '1\n0\n5', o: '0' }], c`double a = double.Parse(Console.ReadLine());
double b = double.Parse(Console.ReadLine());
double c = double.Parse(Console.ReadLine());
double d = b * b - 4 * a * c;
if (d > 0) Console.WriteLine(2);
else if (d == 0) Console.WriteLine(1);
else Console.WriteLine(0);`, 'Policz deltę Δ = b² − 4ac i porównaj z zerem.', 'Compute the discriminant Δ = b² − 4ac and compare it with zero.'),
]);

X('switch', [
  OUT(1, c`int d = 3;
switch (d)
{
    case 1: Console.WriteLine("Mon"); break;
    case 2: Console.WriteLine("Tue"); break;
    case 3: Console.WriteLine("Wed"); break;
    default: Console.WriteLine("?"); break;
}`, ['Wed', 'Mon\nTue\nWed', '?', 'Wed\n?'], 'Wykonuje się tylko case 3, a break kończy switch.', 'Only case 3 runs, and break ends the switch.'),
  OUT(1, c`string c = "x";
switch (c)
{
    case "a": Console.WriteLine("A"); break;
    default: Console.WriteLine("other"); break;
}`, ['other', 'A', 'x', 'nic'], 'Żaden case nie pasuje do "x", więc wykona się default.', 'No case matches "x", so default runs.', { en: { opts: ['other', 'A', 'x', 'nothing'] } }),
  QZ(1, 'Co oznacza <code>default</code> w instrukcji switch?', 'What does <code>default</code> mean in a switch statement?', ['Gałąź wykonywaną, gdy żaden case nie pasuje', 'Pierwszy case', 'Wartość domyślną zmiennej', 'Koniec programu'], ['The branch that runs when no case matches', 'The first case', 'The default value of the variable', 'The end of the program'], 'default działa jak else w drabince if.', 'default works like else in an if ladder.'),
  FILL(1, 'Uzupełnij, aby po wypisaniu <code>B</code> switch się zakończył.', 'Fill in the gap so that the switch ends after printing <code>B</code>.', c`int x = 2;
switch (x)
{
    case 1: Console.WriteLine("A"); break;
    case 2: Console.WriteLine("B"); ___;
}`, [['break']], 'B', 'Każda sekcja case w C# musi kończyć się break (albo return/throw).', 'Every case section in C# must end with break (or return/throw).'),
  OUT(2, c`int m = 4;
switch (m)
{
    case 12: case 1: case 2: Console.WriteLine("winter"); break;
    case 3: case 4: case 5: Console.WriteLine("spring"); break;
    default: Console.WriteLine("other"); break;
}`, ['spring', 'winter', 'other', 'winter\nspring'], 'Kilka etykiet case może prowadzić do tego samego kodu.', 'Several case labels can lead to the same code.'),
  OUT(2, c`int n = 7;
string s = n switch
{
    0 => "zero",
    < 0 => "minus",
    > 0 and < 10 => "small",
    _ => "big"
};
Console.WriteLine(s);`, ['small', 'big', 'minus', 'zero'], 'Wyrażenie switch z wzorcami relacyjnymi: 7 jest > 0 i < 10.', 'A switch expression with relational patterns: 7 is > 0 and < 10.'),
  BUG(2, c`int x = 1;
switch (x)
{
    case 1:
        Console.WriteLine("one");
    case 2:
        Console.WriteLine("two");
        break;
}`, 4, 'Console.WriteLine("one"); break;', 'W C# nie wolno „przechodzić” z jednego case do następnego – brakuje break (CS0163).', 'In C# you cannot fall through from one case to the next – break is missing (CS0163).', { pl: { cause: true } }),
  OUT(2, c`char op = '*';
int r = op switch { '+' => 6 + 2, '-' => 6 - 2, '*' => 6 * 2, _ => 0 };
Console.WriteLine(r);`, ['12', '8', '4', '0'], 'Wyrażenie switch zwraca wartość z pasującej gałęzi: 6 * 2.', 'The switch expression returns the value of the matching arm: 6 * 2.'),
  CODE(2, 'Wczytaj numer miesiąca (1–12) i wypisz liczbę dni (rok nieprzestępny). Użyj switch.', 'Read a month number (1–12) and print the number of days (non-leap year). Use switch.', null, [{ i: '2', o: '28' }, { i: '4', o: '30' }, { i: '12', o: '31' }, { i: '9', o: '30' }], c`int m = int.Parse(Console.ReadLine());
switch (m)
{
    case 2: Console.WriteLine(28); break;
    case 4: case 6: case 9: case 11: Console.WriteLine(30); break;
    default: Console.WriteLine(31); break;
}`, 'Grupuj miesiące: case 4: case 6: case 9: case 11: ...', 'Group the months: case 4: case 6: case 9: case 11: ...', { pl: { check: "if (!/switch/.test(src)) return 'Użyj switch';" }, en: { check: "if (!/switch/.test(src)) return 'Use switch';" } }),
  OUT(3, c`object[] items = { 5, "kapi", 2.5, null };
foreach (object o in items)
{
    string d = o switch
    {
        int i when i > 3 => "big int",
        int => "int",
        string s => "text " + s.Length,
        null => "null",
        _ => "other"
    };
    Console.WriteLine(d);
}`, ['big int\ntext 4\nother\nnull', 'int\ntext 4\nother\nnull', 'big int\ntext\nother\nnull', 'big int\ntext 4\nother\nother'], 'Wzorce typów z warunkiem when sprawdzane są po kolei; 2.5 to double, więc trafia do _.', 'Type patterns with a when condition are checked in order; 2.5 is a double, so it falls into _.'),
  OUT(3, c`int x = 0, y = 5;
string where;
switch (x)
{
    case 0 when y == 0: where = "origin"; break;
    case 0: where = "on Y"; break;
    default: where = y == 0 ? "on X" : "elsewhere"; break;
}
Console.WriteLine(where);`, ['on Y', 'origin', 'on X', 'elsewhere'], 'case z warunkiem when pasuje tylko, gdy warunek jest prawdziwy: x = 0, ale y ≠ 0, więc trafiamy do zwykłego case 0.', 'A case with a when condition matches only when the condition is true: x = 0 but y ≠ 0, so we land in the plain case 0.'),
  CODE(3, 'Prosty kalkulator: wczytaj liczbę, znak (+, -, *, /) i drugą liczbę (każde w linii). Wypisz wynik. Przy dzieleniu przez zero wypisz <code>Błąd</code>, a przy nieznanym znaku <code>?</code>. Użyj wyrażenia switch.', 'A simple calculator: read a number, an operator (+, -, *, /) and another number (one per line). Print the result. For division by zero print <code>Error</code>, and for an unknown operator <code>?</code>. Use a switch expression.', null, [{ i: '6\n*\n7', o: '42' }, { i: '7\n/\n2', o: '3.5' }, { i: '1\n/\n0', o: 'Błąd' }, { i: '2\n%\n3', o: '?' }], c`double a = double.Parse(Console.ReadLine());
string op = Console.ReadLine();
double b = double.Parse(Console.ReadLine());
string r = op switch
{
    "+" => (a + b).ToString(),
    "-" => (a - b).ToString(),
    "*" => (a * b).ToString(),
    "/" => b == 0 ? "Błąd" : (a / b).ToString(),
    _ => "?"
};
Console.WriteLine(r);`, 'Każda gałąź zwraca tekst: (a + b).ToString(), a dla "/" użyj operatora ?:.', 'Every arm returns text: (a + b).ToString(), and for "/" use the ?: operator.', { pl: { check: "if (!/=>/.test(src)) return 'Użyj wyrażenia switch (=>)';" }, en: { check: "if (!/=>/.test(src)) return 'Use a switch expression (=>)';", tests: [{ i: '6\n*\n7', o: '42' }, { i: '7\n/\n2', o: '3.5' }, { i: '1\n/\n0', o: 'Error' }, { i: '2\n%\n3', o: '?' }], sol: c`double a = double.Parse(Console.ReadLine());
string op = Console.ReadLine();
double b = double.Parse(Console.ReadLine());
string r = op switch
{
    "+" => (a + b).ToString(),
    "-" => (a - b).ToString(),
    "*" => (a * b).ToString(),
    "/" => b == 0 ? "Error" : (a / b).ToString(),
    _ => "?"
};
Console.WriteLine(r);` } }),
  OUT(3, c`int score = 73;
string g = score switch
{
    >= 90 => "A",
    >= 75 => "B",
    >= 50 => "C",
    _ => "D"
};
Console.WriteLine(g);`, ['C', 'B', 'D', 'A'], 'Gałęzie sprawdzane są od góry: 73 nie jest ≥ 90 ani ≥ 75, ale jest ≥ 50.', 'Arms are checked from the top: 73 is not ≥ 90 or ≥ 75, but it is ≥ 50.'),
]);
