// Dział 5 (pętle): dodatkowe zadania.

X('for', [
  OUT(1, c`for (int i = 0; i < 4; i++)
{
    Console.Write(i);
}`, ['0123', '1234', '01234', '123'], 'i przyjmuje 0, 1, 2, 3 – przy 4 warunek i < 4 jest fałszywy.', 'i takes 0, 1, 2, 3 – at 4 the condition i < 4 is false.'),
  OUT(1, c`for (int i = 10; i > 0; i -= 3)
{
    Console.Write(i + " ");
}`, ['10 7 4 1 ', '10 7 4 ', '10 7 4 1 -2 ', '9 6 3 '], 'Licznik maleje o 3: 10, 7, 4, 1. Następna wartość −2 nie spełnia i > 0.', 'The counter decreases by 3: 10, 7, 4, 1. The next value −2 does not meet i > 0.'),
  FILL(1, 'Uzupełnij pętlę, aby wypisała liczby od 5 do 1.', 'Complete the loop so that it prints the numbers from 5 down to 1.', c`for (int i = 5; i >= 1; ___)
{
    Console.Write(i);
}`, [['i--', 'i -= 1', 'i = i - 1', '--i']], '54321', 'Licznik ma maleć o 1 – i--.', 'The counter must go down by 1 – i--.'),
  OUT(2, c`int sum = 0;
for (int i = 1; i <= 10; i += 2) sum += i;
Console.WriteLine(sum);`, ['25', '55', '30', '20'], 'Sumujemy liczby nieparzyste 1 + 3 + 5 + 7 + 9 = 25.', 'We add the odd numbers 1 + 3 + 5 + 7 + 9 = 25.'),
  CODE(2, 'Wczytaj <code>n</code> i wypisz sumę kwadratów 1² + 2² + … + n².', 'Read <code>n</code> and print the sum of squares 1² + 2² + … + n².', null, [{ i: '3', o: '14' }, { i: '1', o: '1' }, { i: '10', o: '385' }], c`int n = int.Parse(Console.ReadLine());
int s = 0;
for (int i = 1; i <= n; i++) s += i * i;
Console.WriteLine(s);`, 'W pętli dodawaj i * i.', 'Add i * i in the loop.'),
  OUT(3, c`for (int i = 0, j = 10; i < j; i += 3, j -= 2)
{
    Console.Write($"{i}-{j} ");
}`, ['0-10 3-8 ', '0-10 3-8 6-6 ', '0-10 ', '0-10 3-8 6-6 9-4 '], 'Pętla for może mieć dwie zmienne. Po (3, 8) przychodzi (6, 6) – warunek 6 < 6 jest fałszywy.', 'A for loop can have two variables. After (3, 8) comes (6, 6) – the condition 6 < 6 is false.'),
  CODE(3, 'Wczytaj <code>n</code> (≥ 1) i wypisz n pierwszych wyrazów ciągu Fibonacciego (1 1 2 3 5 …) oddzielonych spacją. Użyj pętli for i typu long.', 'Read <code>n</code> (≥ 1) and print the first n Fibonacci numbers (1 1 2 3 5 …) separated by spaces. Use a for loop and the long type.', null, [{ i: '7', o: '1 1 2 3 5 8 13' }, { i: '1', o: '1' }, { i: '2', o: '1 1' }], c`int n = int.Parse(Console.ReadLine());
long a = 1, b = 1;
string s = "";
for (int i = 0; i < n; i++)
{
    s += (i > 0 ? " " : "") + a;
    long c = a + b;
    a = b;
    b = c;
}
Console.WriteLine(s);`, 'Trzymaj dwa ostatnie wyrazy w zmiennych a i b; nowy wyraz to a + b.', 'Keep the last two terms in a and b; the next term is a + b.', { pl: { check: "if (!/for\\s*\\(/.test(src)) return 'Użyj pętli for';" }, en: { check: "if (!/for\\s*\\(/.test(src)) return 'Use a for loop';" } }),
]);

X('while', [
  OUT(1, c`int n = 1;
while (n < 50) n *= 3;
Console.WriteLine(n);`, ['81', '27', '50', '243'], '1 → 3 → 9 → 27 → 81. Przy 81 warunek n < 50 jest fałszywy.', '1 → 3 → 9 → 27 → 81. At 81 the condition n < 50 is false.'),
  QZ(1, 'Kiedy lepiej użyć <code>while</code> niż <code>for</code>?', 'When is <code>while</code> a better choice than <code>for</code>?', ['Gdy nie wiemy z góry, ile razy pętla się wykona', 'Gdy znamy dokładną liczbę powtórzeń', 'Gdy chcemy wypisać tablicę', 'Nigdy – for jest zawsze lepsze'], ['When we do not know in advance how many times the loop will run', 'When we know the exact number of repetitions', 'When we want to print an array', 'Never – for is always better'], 'while sprawdza się, gdy pętla trwa „dopóki” coś zachodzi, np. do wpisania poprawnej danej.', 'while fits when the loop runs “as long as” something holds, e.g. until valid input is entered.'),
  OUT(2, c`int n = 1234;
int count = 0;
while (n > 0)
{
    n /= 10;
    count++;
}
Console.WriteLine(count);`, ['4', '3', '1234', '10'], 'Każdy obrót usuwa jedną cyfrę – pętla liczy cyfry liczby.', 'Each turn removes one digit – the loop counts the digits.'),
  BUG(2, c`int i = 0;
while (i < 5)
{
    Console.Write(i);
}`, 3, 'Console.Write(i++);', 'Licznik się nie zmienia, więc pętla jest nieskończona. Trzeba zwiększać i w pętli.', 'The counter never changes, so the loop is infinite. i must increase inside the loop.', { q: 'Pętla nigdy się nie kończy. Kliknij linię, którą trzeba poprawić.', qEn: 'The loop never ends. Click the line that has to be fixed.', pl: { cause: true } }),
  CODE(2, 'Gra „zgadnij liczbę”: tajna liczba to 37. Wczytuj liczby, aż użytkownik ją zgadnie. Po każdej złej wypisz <code>więcej</code> albo <code>mniej</code>, a na końcu <code>Brawo! Próby: N</code>.', 'A “guess the number” game: the secret number is 37. Read numbers until the user guesses it. After each wrong one print <code>more</code> or <code>less</code>, and at the end <code>Bravo! Tries: N</code>.', null, [{ i: '50\n20\n37', o: 'mniej\nwięcej\nBrawo! Próby: 3' }, { i: '37', o: 'Brawo! Próby: 1' }], c`int secret = 37, tries = 0, g;
do
{
    g = int.Parse(Console.ReadLine());
    tries++;
    if (g < secret) Console.WriteLine("więcej");
    else if (g > secret) Console.WriteLine("mniej");
} while (g != secret);
Console.WriteLine($"Brawo! Próby: {tries}");`, 'Pętla do-while: wczytaj, policz próbę, podpowiedz; powtarzaj, dopóki g != 37.', 'A do-while loop: read, count the try, give a hint; repeat while g != 37.', { en: { tests: [{ i: '50\n20\n37', o: 'less\nmore\nBravo! Tries: 3' }, { i: '37', o: 'Bravo! Tries: 1' }], sol: c`int secret = 37, tries = 0, g;
do
{
    g = int.Parse(Console.ReadLine());
    tries++;
    if (g < secret) Console.WriteLine("more");
    else if (g > secret) Console.WriteLine("less");
} while (g != secret);
Console.WriteLine($"Bravo! Tries: {tries}");` } }),
  OUT(3, c`int n = 6, steps = 0;
while (n != 1)
{
    n = n % 2 == 0 ? n / 2 : 3 * n + 1;
    steps++;
}
Console.WriteLine(steps);`, ['8', '6', '9', '16'], 'Ciąg Collatza z 6: 3, 10, 5, 16, 8, 4, 2, 1 – to 8 kroków.', 'The Collatz sequence from 6: 3, 10, 5, 16, 8, 4, 2, 1 – 8 steps.'),
  CODE(3, 'Wczytaj dwie liczby naturalne i wypisz ich NWD, używając algorytmu Euklidesa z odejmowaniem albo resztą w pętli <code>while</code> (bez rekurencji).', 'Read two natural numbers and print their GCD using Euclid\'s algorithm with subtraction or remainder in a <code>while</code> loop (no recursion).', null, [{ i: '48\n18', o: '6' }, { i: '17\n5', o: '1' }, { i: '100\n75', o: '25' }], c`int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
while (b != 0)
{
    int r = a % b;
    a = b;
    b = r;
}
Console.WriteLine(a);`, 'Dopóki b != 0: r = a % b; a = b; b = r.', 'While b != 0: r = a % b; a = b; b = r.', { pl: { check: "if (!/while/.test(src)) return 'Użyj pętli while';" }, en: { check: "if (!/while/.test(src)) return 'Use a while loop';" } }),
]);

X('breakcont', [
  OUT(1, c`for (int i = 1; i <= 10; i++)
{
    if (i == 4) break;
    Console.Write(i);
}`, ['123', '1234', '12345678910', '4'], 'break kończy pętlę, zanim 4 zostanie wypisane.', 'break ends the loop before 4 is printed.'),
  OUT(1, c`for (int i = 1; i <= 6; i++)
{
    if (i % 2 == 0) continue;
    Console.Write(i);
}`, ['135', '246', '123456', '1'], 'continue pomija parzyste – wypisują się tylko nieparzyste.', 'continue skips even numbers – only odd ones are printed.'),
  OUT(2, c`int c = 0;
for (int i = 0; i < 4; i++)
    for (int j = 0; j < i; j++)
        c++;
Console.WriteLine(c);`, ['6', '16', '4', '10'], 'Wewnętrzna pętla wykonuje się 0 + 1 + 2 + 3 = 6 razy.', 'The inner loop runs 0 + 1 + 2 + 3 = 6 times.'),
  CODE(2, 'Wczytaj <code>n</code> i narysuj trójkąt z cyfr: w wierszu k wypisz liczby od 1 do k bez spacji.<br>Np. dla 3:<br><code>1</code><br><code>12</code><br><code>123</code>', 'Read <code>n</code> and draw a triangle of digits: in row k print the numbers from 1 to k without spaces.<br>E.g. for 3:<br><code>1</code><br><code>12</code><br><code>123</code>', null, [{ i: '3', o: '1\n12\n123' }, { i: '1', o: '1' }, { i: '5', o: '1\n12\n123\n1234\n12345' }], c`int n = int.Parse(Console.ReadLine());
for (int r = 1; r <= n; r++)
{
    for (int k = 1; k <= r; k++) Console.Write(k);
    Console.WriteLine();
}`, 'Pętla zewnętrzna po wierszach, wewnętrzna od 1 do numeru wiersza.', 'The outer loop goes over rows, the inner one from 1 to the row number.'),
  OUT(3, c`int found = -1;
for (int i = 2; i < 10 && found < 0; i++)
{
    for (int j = 2; j < 10; j++)
    {
        if (i * j == 42) { found = i * 10 + j; break; }
    }
}
Console.WriteLine(found);`, ['67', '76', '42', '-1'], 'break przerywa tylko wewnętrzną pętlę; zewnętrzną kończy warunek found < 0. Pierwsza para to 6 · 7.', 'break stops only the inner loop; the outer one is ended by the condition found < 0. The first pair is 6 · 7.'),
  CODE(3, 'Wczytaj <code>n</code> i wypisz wszystkie liczby pierwsze mniejsze od n, oddzielone spacją. Użyj pętli zagnieżdżonych i <code>break</code> (bez osobnej metody).', 'Read <code>n</code> and print all primes smaller than n separated by spaces. Use nested loops and <code>break</code> (no separate method).', null, [{ i: '20', o: '2 3 5 7 11 13 17 19' }, { i: '3', o: '2' }, { i: '30', o: '2 3 5 7 11 13 17 19 23 29' }], c`int n = int.Parse(Console.ReadLine());
string s = "";
for (int i = 2; i < n; i++)
{
    bool prime = true;
    for (int d = 2; d * d <= i; d++)
    {
        if (i % d == 0) { prime = false; break; }
    }
    if (prime) s += (s == "" ? "" : " ") + i;
}
Console.WriteLine(s);`, 'Dla każdej liczby sprawdzaj dzielniki do √i; po znalezieniu dzielnika – break.', 'For each number check divisors up to √i; when one is found – break.', { pl: { check: "if (!/break/.test(src)) return 'Użyj break';" }, en: { check: "if (!/break/.test(src)) return 'Use break';" } }),
  OUT(3, c`int i = 0;
while (true)
{
    i++;
    if (i % 3 == 0) continue;
    if (i > 7) break;
    Console.Write(i);
}`, ['12457', '124578', '1245', '1234567'], 'while (true) kończy tylko break. Pomijamy 3 i 6, a przy 8 pętla się kończy.', 'while (true) is ended only by break. 3 and 6 are skipped, and at 8 the loop ends.'),
]);
