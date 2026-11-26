// Dział 10 (enum, struct, kolekcje): dodatkowe zadania.

X('enumy', [
  OUT(1, c`Light l = Light.Green;
Console.WriteLine(l);
Console.WriteLine((int)Light.Yellow);

enum Light { Red, Yellow, Green }`, ['Green\n1', '2\n1', 'Green\nYellow', 'Light.Green\n1'], 'Enum wypisuje się jako nazwa; Red = 0, Yellow = 1, Green = 2.', 'An enum prints as its name; Red = 0, Yellow = 1, Green = 2.'),
  QZ(1, 'Po co stosujemy typ wyliczeniowy (enum)?', 'Why do we use an enumeration (enum)?', ['Aby zastąpić „magiczne liczby” czytelnymi nazwami z ograniczonej listy', 'Aby przyspieszyć pętle', 'Aby przechowywać teksty dowolnej długości', 'Aby tworzyć tablice dwuwymiarowe'], ['To replace “magic numbers” with readable names from a fixed list', 'To speed up loops', 'To store texts of any length', 'To create two-dimensional arrays'], 'Enum daje nazwy wartościom (np. Pogoda.Deszcz zamiast 1), a kompilator pilnuje poprawności.', 'An enum gives names to values (e.g. Weather.Rain instead of 1), and the compiler checks them.'),
  OUT(1, c`Size s = (Size)2;
Console.WriteLine(s);

enum Size { S, M, L, XL }`, ['L', '2', 'M', 'XL'], 'Rzutowanie liczby 2 na enum daje trzecią wartość – L.', 'Casting the number 2 to the enum gives the third value – L.'),
  OUT(2, c`Day d = Day.Sat;
bool weekend = d == Day.Sat || d == Day.Sun;
Console.WriteLine(weekend + " " + (d > Day.Fri));

enum Day { Mon, Tue, Wed, Thu, Fri, Sat, Sun }`, ['True True', 'True False', 'False True', 'False False'], 'Wartości enum można porównywać ==, a także <, > – według ich numerów.', 'Enum values can be compared with == as well as <, > – by their numbers.'),
  OUT(2, c`foreach (Coin c in Enum.GetValues<Coin>())
    Console.Write((int)c + " ");

enum Coin { One = 1, Two = 2, Five = 5, Ten = 10 }`, ['1 2 5 10 ', '0 1 2 3 ', 'One Two Five Ten ', '1 2 3 4 '], 'Wartości mają własne numery, więc rzutowanie na int daje 1, 2, 5, 10.', 'The values have their own numbers, so casting to int gives 1, 2, 5, 10.'),
  OUT(3, c`Level l = Level.High;
l++;
Console.WriteLine(l);
Console.WriteLine(Enum.IsDefined(typeof(Level), 7));

enum Level { Low = 1, Mid = 5, High = 9 }`, ['10\nFalse', 'High\nFalse', 'Low\nTrue', '10\nTrue'], 'High = 9, a 9 + 1 = 10 nie ma nazwy – enum wypisze samą liczbę. 7 też nie jest zdefiniowane.', 'High = 9, and 9 + 1 = 10 has no name – the enum prints just the number. 7 is not defined either.'),
  CODE(3, 'Wczytaj nazwę koloru (np. <code>Red</code>) i wypisz kolejny kolor z enum <code>Color { Red, Orange, Yellow, Green, Blue }</code> – po Blue wracamy do Red. Dla nieznanej nazwy wypisz <code>?</code>. Użyj <code>Enum.TryParse</code>.', 'Read a colour name (e.g. <code>Red</code>) and print the next colour of the enum <code>Color { Red, Orange, Yellow, Green, Blue }</code> – after Blue we go back to Red. For an unknown name print <code>?</code>. Use <code>Enum.TryParse</code>.', 'string s = Console.ReadLine();\n\nenum Color { Red, Orange, Yellow, Green, Blue }\n', [{ i: 'Red', o: 'Orange' }, { i: 'Blue', o: 'Red' }, { i: 'Pink', o: '?' }], c`string s = Console.ReadLine();
if (Enum.TryParse(s, out Color c)) Console.WriteLine((Color)(((int)c + 1) % 5));
else Console.WriteLine("?");

enum Color { Red, Orange, Yellow, Green, Blue }`, 'Następny kolor to (Color)(((int)c + 1) % 5).', 'The next colour is (Color)(((int)c + 1) % 5).'),
]);

X('struktury', [
  QZ(1, 'Czym różni się struct od class przy przypisaniu <code>b = a</code>?', 'How does a struct differ from a class on the assignment <code>b = a</code>?', ['struct kopiuje całą wartość, class kopiuje tylko referencję', 'Nie ma różnicy', 'class kopiuje wartość, struct referencję', 'struct nie pozwala na przypisanie'], ['A struct copies the whole value, a class copies only the reference', 'There is no difference', 'A class copies the value, a struct the reference', 'A struct does not allow assignment'], 'struct jest typem wartościowym, class – referencyjnym.', 'A struct is a value type, a class is a reference type.'),
  OUT(1, c`P a = new P { X = 1 };
P b = a;
b.X = 5;
Console.WriteLine(a.X + b.X);

struct P { public int X; }`, ['6', '10', '2', '5'], 'b to kopia a, więc a.X zostaje 1, b.X = 5: razem 6.', 'b is a copy of a, so a.X stays 1 and b.X = 5: 6 in total.'),
  QZ(1, 'Który z typów jest strukturą (typem wartościowym)?', 'Which of these types is a struct (value type)?', ['int', 'string', 'int[]', 'List<int>'], null, 'int to struktura System.Int32. string, tablice i listy to typy referencyjne.', 'int is the struct System.Int32. string, arrays and lists are reference types.'),
  OUT(2, c`P[] arr = { new P { X = 1 }, new P { X = 2 } };
arr[0].X = 10;
P copy = arr[1];
copy.X = 20;
Console.WriteLine(arr[0].X + " " + arr[1].X);

struct P { public int X; }`, ['10 2', '1 2', '10 20', '1 20'], 'arr[0].X zmienia element w tablicy bezpośrednio. copy to osobna kopia – arr[1] się nie zmienia.', 'arr[0].X changes the element in the array directly. copy is a separate copy – arr[1] does not change.'),
  OUT(2, c`Money a = new Money(5);
Money b = new Money(5);
Console.WriteLine(a.Equals(b));
Ref c = new Ref(5), d = new Ref(5);
Console.WriteLine(c.Equals(d));

struct Money { public int V; public Money(int v) { V = v; } }
class Ref { public int V; public Ref(int v) { V = v; } }`, ['True\nFalse', 'False\nFalse', 'True\nTrue', 'False\nTrue'], 'Equals dla struct porównuje wartości pól; dla klasy (bez nadpisania) – czy to ten sam obiekt.', 'Equals for a struct compares field values; for a class (not overridden) – whether it is the same object.'),
  OUT(3, c`static void Move(ref Pt p) { p.X += 1; }
static void Move2(Pt p) { p.X += 1; }
Pt q = new Pt();
Move(ref q);
Move2(q);
Move(ref q);
Console.WriteLine(q.X);

struct Pt { public int X; }`, ['2', '3', '1', '0'], 'Tylko wywołania z ref zmieniają oryginał (2 razy). Move2 pracuje na kopii.', 'Only the calls with ref change the original (twice). Move2 works on a copy.'),
  CODE(3, 'Dopisz strukturę <code>Fraction</code> (pola <code>Num</code>, <code>Den</code>) z konstruktorem, który skraca ułamek (NWD), metodą <code>Add(Fraction o)</code> zwracającą skróconą sumę i <code>ToString()</code> w postaci <code>a/b</code>.', 'Add a struct <code>Fraction</code> (fields <code>Num</code>, <code>Den</code>) with a constructor that reduces the fraction (GCD), a method <code>Add(Fraction o)</code> returning the reduced sum, and <code>ToString()</code> as <code>a/b</code>.', 'Fraction a = new Fraction(1, 2), b = new Fraction(1, 3);\nConsole.WriteLine(a.Add(b));\nConsole.WriteLine(new Fraction(4, 8));\nConsole.WriteLine(new Fraction(1, 4).Add(new Fraction(3, 4)));\n', [{ i: '', o: '5/6\n1/2\n1/1' }], c`Fraction a = new Fraction(1, 2), b = new Fraction(1, 3);
Console.WriteLine(a.Add(b));
Console.WriteLine(new Fraction(4, 8));
Console.WriteLine(new Fraction(1, 4).Add(new Fraction(3, 4)));

struct Fraction
{
    public int Num, Den;
    public Fraction(int n, int d)
    {
        int a = Math.Abs(n), b = Math.Abs(d);
        while (b != 0) { int r = a % b; a = b; b = r; }
        Num = n / a; Den = d / a;
    }
    public Fraction Add(Fraction o) => new Fraction(Num * o.Den + o.Num * Den, Den * o.Den);
    public override string ToString() => $"{Num}/{Den}";
}`, 'W konstruktorze policz NWD (algorytm Euklidesa) i podziel licznik oraz mianownik.', 'In the constructor compute the GCD (Euclid\'s algorithm) and divide the numerator and denominator.', { pl: { check: "if (!/struct\\s+Fraction/.test(src)) return 'Fraction ma być strukturą';" }, en: { check: "if (!/struct\\s+Fraction/.test(src)) return 'Fraction should be a struct';" } }),
]);

X('kolekcje', [
  OUT(1, c`List<string> l = new List<string>();
l.Add("a");
l.Add("b");
l.Insert(0, "c");
Console.WriteLine(string.Join("", l) + l.Count);`, ['cab3', 'abc3', 'cab2', 'acb3'], 'Insert(0, ...) wstawia na początek: c, a, b; Count = 3.', 'Insert(0, ...) puts the item at the start: c, a, b; Count = 3.'),
  OUT(1, c`var d = new Dictionary<string, int>();
d["x"] = 1;
d["y"] = 2;
d["x"] = 5;
Console.WriteLine(d.Count + " " + d["x"]);`, ['2 5', '3 5', '2 1', '3 1'], 'Przypisanie do istniejącego klucza nadpisuje wartość – kluczy jest nadal 2.', 'Assigning to an existing key overwrites the value – there are still 2 keys.'),
  QZ(1, 'Która kolekcja działa według zasady „ostatni włożony – pierwszy wyjęty” (LIFO)?', 'Which collection works “last in – first out” (LIFO)?', ['Stack<T>', 'Queue<T>', 'List<T>', 'Dictionary<K, V>'], null, 'Stos (Stack) oddaje najpierw ostatnio włożony element.', 'A stack returns the most recently added element first.'),
  OUT(2, c`var s = new HashSet<int> { 3, 1, 3, 2, 1 };
s.Add(2);
s.Add(4);
Console.WriteLine(s.Count + " " + s.Contains(3));`, ['4 True', '7 True', '5 True', '4 False'], 'HashSet nie przechowuje powtórzeń: {3, 1, 2} i dodana 4 – razem 4 elementy.', 'A HashSet stores no duplicates: {3, 1, 2} plus 4 – 4 elements in total.'),
  OUT(2, c`var q = new Queue<int>();
q.Enqueue(1); q.Enqueue(2); q.Enqueue(3);
q.Dequeue();
q.Enqueue(4);
Console.WriteLine(q.Peek() + " " + q.Count);`, ['2 3', '1 3', '4 3', '2 4'], 'Po Dequeue z przodu jest 2; Peek tylko podgląda. W kolejce: 2, 3, 4.', 'After Dequeue the front is 2; Peek only looks. The queue holds 2, 3, 4.'),
  OUT(3, c`var nums = new List<int> { 5, 2, 9, 4, 7, 1 };
var r = nums.Where(x => x % 2 == 1).OrderByDescending(x => x).Select(x => x * 10).Take(2);
Console.WriteLine(string.Join(" ", r));`, ['90 70', '10 50', '90 70 50 10', '50 90'], 'Nieparzyste: 5, 9, 7, 1 → malejąco 9, 7, 5, 1 → ·10 → pierwsze dwa: 90 70.', 'Odd numbers: 5, 9, 7, 1 → descending 9, 7, 5, 1 → ·10 → the first two: 90 70.'),
  OUT(3, c`var words = new List<string> { "kapi", "ola", "kot", "arbuz", "kapi" };
var g = words.GroupBy(w => w[0]).OrderBy(x => x.Key).Select(x => x.Key + ":" + x.Count());
Console.WriteLine(string.Join(" ", g));`, ['a:1 k:3 o:1', 'k:3 o:1 a:1', 'a:1 k:2 o:1', 'a:1 k:3 o:1 k:1'], 'GroupBy grupuje według pierwszej litery; słowa na k są trzy (kapi, kot, kapi).', 'GroupBy groups by the first letter; there are three words starting with k (kapi, kot, kapi).'),
  CODE(3, 'Sprawdź, czy nawiasy są poprawnie sparowane. Wczytaj linię z nawiasami <code>()[]{}</code> i wypisz <code>OK</code> albo <code>BŁĄD</code>. Użyj <code>Stack&lt;char&gt;</code>.', 'Check whether the brackets are correctly paired. Read a line of brackets <code>()[]{}</code> and print <code>OK</code> or <code>ERROR</code>. Use <code>Stack&lt;char&gt;</code>.', null, [{ i: '([]{()})', o: 'OK' }, { i: '([)]', o: 'BŁĄD' }, { i: '((', o: 'BŁĄD' }, { i: '', o: 'OK' }], c`string s = Console.ReadLine() ?? "";
var st = new Stack<char>();
bool ok = true;
foreach (char ch in s)
{
    if ("([{".Contains(ch)) st.Push(ch);
    else
    {
        char need = ch == ')' ? '(' : ch == ']' ? '[' : '{';
        if (st.Count == 0 || st.Pop() != need) { ok = false; break; }
    }
}
Console.WriteLine(ok && st.Count == 0 ? "OK" : "BŁĄD");`, 'Nawias otwierający kładź na stos; zamykający musi pasować do zdjętego ze szczytu.', 'Push an opening bracket; a closing one must match the one popped from the top.', { pl: { check: "if (!/Stack/.test(src)) return 'Użyj Stack<char>';" }, en: { check: "if (!/Stack/.test(src)) return 'Use Stack<char>';", tests: [{ i: '([]{()})', o: 'OK' }, { i: '([)]', o: 'ERROR' }, { i: '((', o: 'ERROR' }, { i: '', o: 'OK' }], sol: c`string s = Console.ReadLine() ?? "";
var st = new Stack<char>();
bool ok = true;
foreach (char ch in s)
{
    if ("([{".Contains(ch)) st.Push(ch);
    else
    {
        char need = ch == ')' ? '(' : ch == ']' ? '[' : '{';
        if (st.Count == 0 || st.Pop() != need) { ok = false; break; }
    }
}
Console.WriteLine(ok && st.Count == 0 ? "OK" : "ERROR");` } }),
  CODE(3, 'Wczytaj tekst (jedna linia) i wypisz 3 najczęstsze słowa (bez rozróżniania wielkości liter) w formacie <code>słowo N</code>, malejąco po liczbie, przy remisie alfabetycznie.', 'Read a text (one line) and print the 3 most frequent words (case-insensitive) as <code>word N</code>, descending by count, alphabetically on a tie.', null, [{ i: 'a b a c b a D d d', o: 'a 3\nd 3\nb 2' }, { i: 'kapi Kapi ola', o: 'kapi 2\nola 1' }], c`var d = new Dictionary<string, int>();
foreach (string w in Console.ReadLine().ToLower().Split(' '))
{
    if (w == "") continue;
    d[w] = d.ContainsKey(w) ? d[w] + 1 : 1;
}
foreach (var p in d.OrderByDescending(x => x.Value).ThenBy(x => x.Key).Take(3))
    Console.WriteLine($"{p.Key} {p.Value}");`, 'Dictionary do liczenia, potem OrderByDescending(...).ThenBy(...).Take(3).', 'A Dictionary for counting, then OrderByDescending(...).ThenBy(...).Take(3).'),
]);
