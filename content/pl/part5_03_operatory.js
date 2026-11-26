// Dział 3 (operatory): dodatkowe zadania.

X('arytm', [
  OUT(1, c`Console.WriteLine(17 / 5);
Console.WriteLine(17 % 5);`, ['3\n2', '3.4\n2', '3\n3', '3.4\n0.4'], 'Dzielenie liczb całkowitych daje część całkowitą (3), a % – resztę (2).', 'Dividing integers gives the whole part (3), and % gives the remainder (2).'),
  OUT(1, c`Console.WriteLine(2 + 3 * 4);
Console.WriteLine((2 + 3) * 4);`, ['14\n20', '20\n20', '14\n14', '20\n14'], 'Mnożenie ma wyższy priorytet niż dodawanie; nawiasy zmieniają kolejność.', 'Multiplication has higher priority than addition; brackets change the order.'),
  OUT(1, c`int x = 10;
x += 5;
x -= 3;
x *= 2;
Console.WriteLine(x);`, ['24', '12', '20', '30'], '10 + 5 = 15, 15 − 3 = 12, 12 · 2 = 24.', '10 + 5 = 15, 15 − 3 = 12, 12 · 2 = 24.'),
  OUT(1, c`Console.WriteLine(7.0 / 2);
Console.WriteLine(7 / 2.0);`, ['3.5\n3.5', '3\n3.5', '3.5\n3', '3\n3'], 'Jeśli choć jedna liczba jest double, dzielenie jest zmiennoprzecinkowe.', 'If at least one number is a double, the division is floating-point.'),
  QZ(1, 'Jak sprawdzić, czy liczba <code>n</code> jest parzysta?', 'How do you check whether the number <code>n</code> is even?', ['n % 2 == 0', 'n / 2 == 0', 'n % 2 == 1', 'n == 2'], null, 'Liczba parzysta daje resztę 0 z dzielenia przez 2.', 'An even number gives remainder 0 when divided by 2.'),
  FILL(1, 'Uzupełnij operator, aby program wypisał resztę z dzielenia 23 przez 4.', 'Fill in the operator so that the program prints the remainder of 23 divided by 4.', c`Console.WriteLine(23 ___ 4);`, [['%']], '3', 'Operator % (modulo) daje resztę z dzielenia.', 'The % (modulo) operator gives the remainder.'),
  OUT(2, c`int a = 5;
int b = a++;
int c = ++a;
Console.WriteLine(a + " " + b + " " + c);`, ['7 5 7', '7 6 7', '6 5 6', '7 5 6'], 'a++ zwraca starą wartość (5) i zwiększa a do 6; ++a najpierw zwiększa do 7, potem zwraca 7.', 'a++ returns the old value (5) and increases a to 6; ++a first increases to 7, then returns 7.'),
  OUT(2, c`Console.WriteLine(-7 / 2);
Console.WriteLine(-7 % 2);`, ['-3\n-1', '-4\n1', '-3\n1', '-4\n-1'], 'W C# dzielenie całkowite obcina w stronę zera (−3), a reszta ma znak dzielnej (−1).', 'In C# integer division truncates towards zero (−3), and the remainder has the sign of the dividend (−1).'),
  OUT(2, c`Console.WriteLine(Math.Pow(2, 10));
Console.WriteLine(Math.Sqrt(81));
Console.WriteLine(Math.Abs(-4) + Math.Max(3, 8));`, ['1024\n9\n12', '20\n9\n12', '1024\n9\n7', '1024\n81\n12'], 'Pow(2, 10) = 1024, Sqrt(81) = 9, Abs(−4) + Max(3, 8) = 4 + 8 = 12.', 'Pow(2, 10) = 1024, Sqrt(81) = 9, Abs(−4) + Max(3, 8) = 4 + 8 = 12.'),
  CODE(2, 'Wczytaj liczbę sekund i wypisz ją jako <code>M min S s</code> (np. 135 → <code>2 min 15 s</code>).', 'Read a number of seconds and print it as <code>M min S s</code> (e.g. 135 → <code>2 min 15 s</code>).', null, [{ i: '135', o: '2 min 15 s' }, { i: '59', o: '0 min 59 s' }, { i: '600', o: '10 min 0 s' }], c`int s = int.Parse(Console.ReadLine());
Console.WriteLine($"{s / 60} min {s % 60} s");`, 'Minuty to s / 60, sekundy to s % 60.', 'Minutes are s / 60, seconds are s % 60.'),
  OUT(3, c`int x = 5;
x = x++ * 2 + x;
Console.WriteLine(x);`, ['16', '15', '17', '12'], 'x++ daje 5 (x staje się 6), więc 5 · 2 + 6 = 16. Taki kod jest poprawny, ale nieczytelny – lepiej go unikać.', 'x++ gives 5 (x becomes 6), so 5 · 2 + 6 = 16. Such code is valid but hard to read – better avoid it.'),
  OUT(3, c`double a = 0.1 + 0.2;
Console.WriteLine(a == 0.3);
decimal b = 0.1m + 0.2m;
Console.WriteLine(b == 0.3m);`, ['False\nTrue', 'True\nTrue', 'False\nFalse', 'True\nFalse'], 'double przechowuje 0.1 i 0.2 w przybliżeniu, więc suma nie jest dokładnie 0.3. decimal liczy dokładnie.', 'double stores 0.1 and 0.2 approximately, so the sum is not exactly 0.3. decimal is exact.'),
  CODE(3, 'Wczytaj trzycyfrową liczbę i wypisz ją od tyłu jako liczbę (np. 120 → <code>21</code>, 345 → <code>543</code>). Użyj tylko operatorów / i %.', 'Read a three-digit number and print it reversed as a number (e.g. 120 → <code>21</code>, 345 → <code>543</code>). Use only the / and % operators.', null, [{ i: '345', o: '543' }, { i: '120', o: '21' }, { i: '908', o: '809' }], c`int n = int.Parse(Console.ReadLine());
int a = n / 100, b = n / 10 % 10, c = n % 10;
Console.WriteLine(c * 100 + b * 10 + a);`, 'Cyfra setek to n / 100, dziesiątek n / 10 % 10, jedności n % 10.', 'The hundreds digit is n / 100, tens n / 10 % 10, units n % 10.', { pl: { check: "if (/Reverse|ToString|Substring|\\[/.test(src)) return 'Użyj tylko / i %';" }, en: { check: "if (/Reverse|ToString|Substring|\\[/.test(src)) return 'Use only / and %';" } }),
  OUT(3, c`int a = 7, b = 3;
a = a + b;
b = a - b;
a = a - b;
Console.WriteLine(a + " " + b);`, ['3 7', '7 3', '10 7', '3 10'], 'To zamiana wartości bez trzeciej zmiennej: a = 10, b = 7, a = 3.', 'This swaps the values without a third variable: a = 10, b = 7, a = 3.'),
]);

X('logika', [
  OUT(1, c`int x = 7;
Console.WriteLine(x > 5 && x < 10);
Console.WriteLine(x < 5 || x == 7);`, ['True\nTrue', 'True\nFalse', 'False\nTrue', 'False\nFalse'], '7 > 5 i 7 < 10 – oba prawdziwe. W drugiej linii x == 7 jest prawdziwe, więc całe || też.', '7 > 5 and 7 < 10 are both true. In the second line x == 7 is true, so the whole || is true.'),
  OUT(1, c`bool ok = false;
Console.WriteLine(!ok);
Console.WriteLine(ok == false);`, ['True\nTrue', 'False\nTrue', 'True\nFalse', 'False\nFalse'], '! odwraca wartość logiczną; ok == false jest prawdziwe, bo ok ma wartość false.', '! flips a boolean; ok == false is true because ok is false.'),
  QZ(1, 'Który operator sprawdza, czy dwie wartości są <b>różne</b>?', 'Which operator checks whether two values are <b>different</b>?', ['!=', '<>', '=!', '=='], null, 'W C# „różne” to !=. Zapis <> nie istnieje.', 'In C# “not equal” is !=. The form <> does not exist.'),
  FILL(1, 'Uzupełnij warunek: liczba ma być od 1 do 10 włącznie.', 'Complete the condition: the number must be from 1 to 10 inclusive.', c`int n = 4;
Console.WriteLine(n >= 1 ___ n <= 10);`, [['&&']], 'True', 'Oba warunki muszą być spełnione naraz – to koniunkcja &&.', 'Both conditions must be true at the same time – that is the && operator.'),
  OUT(2, c`int count = 0;
bool a = false && (++count > 0);
bool b = true || (++count > 0);
Console.WriteLine(count);`, ['0', '1', '2', 'False'], '&& i || są leniwe: jeśli wynik jest już znany z lewej strony, prawa się nie wykonuje, więc count się nie zmienia.', '&& and || are short-circuit: when the left side decides the result, the right side does not run, so count does not change.'),
  OUT(2, c`Console.WriteLine(5 & 3);
Console.WriteLine(5 | 3);
Console.WriteLine(5 ^ 3);`, ['1\n7\n6', '1\n7\n2', '0\n8\n6', '8\n1\n6'], '5 = 101, 3 = 011. AND: 001 = 1, OR: 111 = 7, XOR: 110 = 6.', '5 = 101, 3 = 011. AND: 001 = 1, OR: 111 = 7, XOR: 110 = 6.'),
  OUT(2, c`Console.WriteLine(1 << 4);
Console.WriteLine(100 >> 2);`, ['16\n25', '4\n50', '16\n50', '5\n25'], 'Przesunięcie w lewo o 4 bity mnoży przez 2⁴ = 16; w prawo o 2 bity dzieli przez 4.', 'Shifting left by 4 bits multiplies by 2⁴ = 16; shifting right by 2 bits divides by 4.'),
  BUG(2, c`int age = 15;
bool teen = age >= 13 && age <= 19;
if (teen = false) Console.WriteLine("Nie nastolatek");
else Console.WriteLine("Nastolatek");`, 2, 'if (teen == false) Console.WriteLine("Nie nastolatek");', 'Jedno = to przypisanie, a nie porównanie – warunek zawsze jest fałszywy i zmienia teen. Porównanie to ==.', 'A single = is an assignment, not a comparison – the condition is always false and it changes teen. Comparison is ==.', { pl: { noerr: true, expect: 'Nastolatek' }, en: { code: c`int age = 15;
bool teen = age >= 13 && age <= 19;
if (teen = false) Console.WriteLine("Not a teen");
else Console.WriteLine("Teen");`, fix: 'if (teen == false) Console.WriteLine("Not a teen");', expect: 'Teen' } }),
  OUT(3, c`Console.WriteLine(true || false && false);
Console.WriteLine((true || false) && false);`, ['True\nFalse', 'False\nFalse', 'True\nTrue', 'False\nTrue'], '&& ma wyższy priorytet niż ||, więc pierwsza linia to true || (false && false) = true.', '&& has higher priority than ||, so the first line is true || (false && false) = true.'),
  OUT(3, c`int x = 0;
if (x != 0 && 10 / x > 1) Console.WriteLine("A");
else Console.WriteLine("B");`, ['B', 'A', 'DivideByZeroException', 'Błąd kompilacji'], 'Dzięki leniwemu && dzielenie 10 / x w ogóle się nie wykona, bo x != 0 jest fałszywe.', 'Thanks to the short-circuit &&, 10 / x never runs, because x != 0 is false.', { en: { opts: ['B', 'A', 'DivideByZeroException', 'A compile error'] } }),
  OUT(3, c`int flags = 0;
flags |= 1;
flags |= 4;
Console.WriteLine(flags);
Console.WriteLine((flags & 4) != 0);
flags &= ~1;
Console.WriteLine(flags);`, ['5\nTrue\n4', '5\nTrue\n5', '4\nFalse\n4', '5\nFalse\n4'], 'Bity jako flagi: |= włącza bit, & sprawdza, &= ~ wyłącza. 1 | 4 = 5, potem wyłączamy bit 1 → 4.', 'Bits as flags: |= turns a bit on, & tests it, &= ~ turns it off. 1 | 4 = 5, then bit 1 is cleared → 4.'),
  CODE(3, 'Wczytaj rok i wypisz <code>True</code>, jeśli jest przestępny, inaczej <code>False</code>. Rok jest przestępny, gdy dzieli się przez 4 i nie przez 100, albo dzieli się przez 400. Użyj jednego wyrażenia logicznego (bez if).', 'Read a year and print <code>True</code> if it is a leap year, otherwise <code>False</code>. A year is a leap year when it divides by 4 and not by 100, or divides by 400. Use one boolean expression (no if).', null, [{ i: '2024', o: 'True' }, { i: '1900', o: 'False' }, { i: '2000', o: 'True' }, { i: '2023', o: 'False' }], c`int y = int.Parse(Console.ReadLine());
Console.WriteLine(y % 4 == 0 && y % 100 != 0 || y % 400 == 0);`, 'y % 4 == 0 && y % 100 != 0 || y % 400 == 0', 'y % 4 == 0 && y % 100 != 0 || y % 400 == 0', { pl: { check: "if (/\\bif\\b|\\?/.test(src)) return 'Bez if i operatora ?: – jedno wyrażenie';" }, en: { check: "if (/\\bif\\b|\\?/.test(src)) return 'No if and no ?: – one expression';" } }),
]);
