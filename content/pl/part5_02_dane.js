// Dział 2 (dane): dodatkowe zadania.

X('zmienne', [
  OUT(1, c`int a = 3;
int b = a;
a = 10;
Console.WriteLine(b);`, ['3', '10', '13', '0'], 'b dostało kopię wartości a (3). Późniejsza zmiana a nie zmienia b.', 'b got a copy of the value of a (3). Changing a later does not change b.'),
  BUG(2, c`int points = 5;
points = points + 2;
int points = 10;
Console.WriteLine(points);`, 2, 'points = 10;', 'Zmiennej points nie można zadeklarować drugi raz w tym samym zakresie (CS0128). Wystarczy przypisanie.', 'The variable points cannot be declared twice in the same scope (CS0128). An assignment is enough.'),
  OUT(3, c`int x = 1;
x += x++ + ++x;
Console.WriteLine(x);`, ['5', '4', '6', '3'], 'x++ daje 1 (potem x = 2), ++x daje 3. x += 1 + 3, przy czym lewa strona x została odczytana na początku (1): 1 + 4 = 5.', 'x++ gives 1 (then x = 2), ++x gives 3. x += 1 + 3, and the left x was read first (1): 1 + 4 = 5.'),
  OUT(3, c`var a = 7;
var b = 2.0;
var c = a / 2;
var d = a / b;
Console.WriteLine(c + " " + d);`, ['3 3.5', '3.5 3.5', '3 3', '3.5 3'], 'var przyjmuje typ z wartości: a jest int, więc a / 2 to dzielenie całkowite (3); b jest double, więc a / b = 3.5.', 'var takes its type from the value: a is int, so a / 2 is integer division (3); b is double, so a / b = 3.5.'),
]);

X('typy', [
  QZ(1, 'Który typ najlepiej przechowa cenę w złotych z groszami, bez błędów zaokrągleń?', 'Which type is best for a price with cents, without rounding errors?', ['decimal', 'int', 'float', 'char'], null, 'decimal przechowuje liczby dziesiętne dokładnie – stosuje się go do pieniędzy.', 'decimal stores decimal numbers exactly – it is used for money.'),
  OUT(2, c`Console.WriteLine(byte.MaxValue + " " + short.MaxValue + " " + sbyte.MinValue);`, ['255 32767 -128', '256 32768 -128', '255 65535 0', '127 32767 -127'], 'byte ma zakres 0–255, short −32 768…32 767, sbyte −128…127.', 'byte ranges 0–255, short −32,768…32,767, sbyte −128…127.'),
  OUT(3, c`int max = int.MaxValue;
int x = max + 1;
Console.WriteLine(x == int.MinValue);
long y = (long)max + 1;
Console.WriteLine(y);`, ['True\n2147483648', 'False\n2147483648', 'True\n-2147483648', 'False\n-2147483648'], 'Domyślnie int się „przewija”: MaxValue + 1 = MinValue. Rzutowanie na long przed dodaniem daje poprawny wynik.', 'By default int wraps around: MaxValue + 1 = MinValue. Casting to long before adding gives the correct result.'),
]);

X('konwersje', [
  OUT(1, c`double d = 9.99;
int i = (int)d;
Console.WriteLine(i);`, ['9', '10', '9.99', '0'], 'Rzutowanie (int) obcina część ułamkową – nie zaokrągla.', 'Casting with (int) cuts off the fraction – it does not round.'),
  OUT(2, c`Console.WriteLine(Math.Round(2.5) + " " + Math.Round(3.5) + " " + Convert.ToInt32(2.5));`, ['2 4 2', '3 4 3', '3 4 2', '2 3 2'], 'Math.Round i Convert.ToInt32 domyślnie zaokrąglają „do parzystej” (zaokrąglenie bankierskie): 2.5 → 2, 3.5 → 4.', 'Math.Round and Convert.ToInt32 round “to even” by default (banker\'s rounding): 2.5 → 2, 3.5 → 4.'),
  ERR(3, c`string s = "12a";
int n = int.Parse(s);
Console.WriteLine(n);`, ['FormatException', 'OverflowException', 'InvalidCastException', 'Wypisze 12'], 'int.Parse wymaga tekstu, który jest liczbą – "12a" kończy się FormatException. Bezpieczniej użyć int.TryParse.', 'int.Parse needs text that is a number – "12a" ends with FormatException. int.TryParse is safer.', { en: { opts: ['FormatException', 'OverflowException', 'InvalidCastException', 'It prints 12'] } }),
  ERR(3, c`string s = "3000000000";
int n = int.Parse(s);
Console.WriteLine(n);`, ['OverflowException', 'FormatException', 'Wypisze 3000000000', 'Wypisze -1294967296'], 'Tekst jest poprawną liczbą, ale nie mieści się w int (max 2 147 483 647) – OverflowException.', 'The text is a valid number but does not fit in an int (max 2,147,483,647) – OverflowException.', { en: { opts: ['OverflowException', 'FormatException', 'It prints 3000000000', 'It prints -1294967296'] } }),
]);

X('wejscie', [
  CODE(2, 'Wczytaj imię i rok urodzenia (dwie linie). Wypisz <code>IMIĘ ma X lat</code>, licząc wiek w roku 2026.', 'Read a name and a birth year (two lines). Print <code>NAME is X</code>, counting the age in 2026.', null, [{ i: 'Ola\n2010', o: 'Ola ma 16 lat' }, { i: 'Kapi\n2020', o: 'Kapi ma 6 lat' }], c`string name = Console.ReadLine();
int year = int.Parse(Console.ReadLine());
Console.WriteLine($"{name} ma {2026 - year} lat");`, 'int.Parse(Console.ReadLine()) i interpolacja $"...".', 'int.Parse(Console.ReadLine()) and interpolation $"...".', { en: { tests: [{ i: 'Ola\n2010', o: 'Ola is 16' }, { i: 'Kapi\n2020', o: 'Kapi is 6' }], sol: c`string name = Console.ReadLine();
int year = int.Parse(Console.ReadLine());
Console.WriteLine($"{name} is {2026 - year}");` } }),
  CODE(3, 'W jednej linii są dwie liczby całkowite oddzielone spacją. Wypisz ich sumę, różnicę i iloczyn w formacie <code>S R I</code>.', 'One line contains two integers separated by a space. Print their sum, difference and product as <code>S D P</code>.', null, [{ i: '7 3', o: '10 4 21' }, { i: '-2 5', o: '3 -7 -10' }], c`string[] p = Console.ReadLine().Split(' ');
int a = int.Parse(p[0]);
int b = int.Parse(p[1]);
Console.WriteLine($"{a + b} {a - b} {a * b}");`, 'Split(\' \') dzieli linię na części.', 'Split(\' \') splits the line into parts.'),
]);
