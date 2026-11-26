// Dział 11 (wyjątki i pliki): dodatkowe zadania.

X('trycatch', [
  OUT(1, c`try
{
    Console.WriteLine("A");
}
catch (Exception)
{
    Console.WriteLine("B");
}
Console.WriteLine("C");`, ['A\nC', 'A\nB\nC', 'B\nC', 'A'], 'Nie było wyjątku, więc blok catch się nie wykonał.', 'There was no exception, so the catch block did not run.'),
  ERR(1, c`int[] t = { 1, 2, 3 };
Console.WriteLine(t[3]);`, ['IndexOutOfRangeException', 'NullReferenceException', 'ArgumentException', 'FormatException'], 'Tablica 3-elementowa ma indeksy 0–2.', 'A 3-element array has indexes 0–2.'),
  ERR(1, c`string s = null;
Console.WriteLine(s.Length);`, ['NullReferenceException', 'IndexOutOfRangeException', 'FormatException', 'Wypisze 0'], 's nie wskazuje żadnego tekstu – odczyt Length z null to NullReferenceException.', 's points to no text – reading Length of null is a NullReferenceException.', { en: { opts: ['NullReferenceException', 'IndexOutOfRangeException', 'FormatException', 'It prints 0'] } }),
  OUT(2, c`try
{
    try { throw new FormatException(); }
    finally { Console.Write("1"); }
}
catch (FormatException) { Console.Write("2"); }
finally { Console.Write("3"); }`, ['123', '213', '23', '13'], 'Wewnętrzny finally wykonuje się, zanim wyjątek trafi do zewnętrznego catch; na końcu zewnętrzny finally.', 'The inner finally runs before the exception reaches the outer catch; the outer finally comes last.'),
  OUT(2, c`try
{
    object o = "kapi";
    int n = (int)o;
}
catch (InvalidCastException) { Console.WriteLine("cast"); }
catch (Exception) { Console.WriteLine("other"); }`, ['cast', 'other', 'kapi', 'cast\nother'], 'Rzutowanie tekstu w obiekcie na int zgłasza InvalidCastException – łapie go pierwszy pasujący catch.', 'Casting text held in an object to int throws InvalidCastException – the first matching catch handles it.'),
  CODE(2, 'Wczytuj linie, dopóki użytkownik nie poda poprawnej liczby całkowitej. Po każdej błędnej wypisz <code>To nie liczba</code>, a na końcu <code>OK: N</code>. Użyj try/catch.', 'Read lines until the user enters a valid integer. After each wrong one print <code>Not a number</code>, and at the end <code>OK: N</code>. Use try/catch.', null, [{ i: 'abc\n4.5\n12', o: 'To nie liczba\nTo nie liczba\nOK: 12' }, { i: '7', o: 'OK: 7' }], c`while (true)
{
    try
    {
        int n = int.Parse(Console.ReadLine());
        Console.WriteLine($"OK: {n}");
        break;
    }
    catch (FormatException)
    {
        Console.WriteLine("To nie liczba");
    }
}`, 'Pętla while (true) z try/catch w środku; break po udanym Parse.', 'A while (true) loop with try/catch inside; break after a successful Parse.', { pl: { check: "if (!/catch/.test(src)) return 'Użyj try/catch';" }, en: { check: "if (!/catch/.test(src)) return 'Use try/catch';", tests: [{ i: 'abc\n4.5\n12', o: 'Not a number\nNot a number\nOK: 12' }, { i: '7', o: 'OK: 7' }], sol: c`while (true)
{
    try
    {
        int n = int.Parse(Console.ReadLine());
        Console.WriteLine($"OK: {n}");
        break;
    }
    catch (FormatException)
    {
        Console.WriteLine("Not a number");
    }
}` } }),
  OUT(3, c`static int F(int x)
{
    try
    {
        if (x == 0) throw new ArgumentException("zero");
        return 10 / x;
    }
    catch (ArgumentException e) { Console.Write(e.Message + " "); return -1; }
    finally { Console.Write("F "); }
}
Console.WriteLine(F(0) + F(5));`, ['zero F F 1', 'zero F 1', 'F zero F 1', 'zero F F -1'], 'F(0): catch wypisuje "zero ", finally "F ", zwraca −1. F(5): finally "F ", zwraca 2. Suma −1 + 2 = 1 wypisuje się na końcu.', 'F(0): catch prints "zero ", finally "F ", returns −1. F(5): finally "F ", returns 2. The sum −1 + 2 = 1 is printed last.'),
  OUT(3, c`int[] t = { 1, 0, 2 };
int ok = 0, bad = 0;
foreach (int x in t)
{
    try { int r = 6 / x; ok += r; }
    catch (DivideByZeroException) when (x == 0) { bad++; }
}
Console.WriteLine(ok + " " + bad);`, ['9 1', '6 1', '9 0', '3 1'], 'Filtr when łapie wyjątek tylko, gdy x == 0. 6/1 + 6/2 = 9, jeden błąd.', 'The when filter catches the exception only when x == 0. 6/1 + 6/2 = 9, one error.'),
]);

X('throw', [
  OUT(1, c`try
{
    throw new Exception("Ups");
}
catch (Exception e)
{
    Console.WriteLine("Złapano: " + e.Message);
}`, ['Złapano: Ups', 'Ups', 'Złapano: Exception', 'Złapano: '], 'throw zgłasza wyjątek z komunikatem, a catch odczytuje go z e.Message.', 'throw raises an exception with a message, and catch reads it from e.Message.', { en: { code: c`try
{
    throw new Exception("Oops");
}
catch (Exception e)
{
    Console.WriteLine("Caught: " + e.Message);
}`, opts: ['Caught: Oops', 'Oops', 'Caught: Exception', 'Caught: '] } }),
  QZ(1, 'Kiedy warto zgłosić wyjątek instrukcją <code>throw</code>?', 'When is it worth raising an exception with <code>throw</code>?', ['Gdy metoda dostała niepoprawne dane i nie może poprawnie wykonać zadania', 'Zawsze na końcu metody', 'Zamiast instrukcji return', 'Aby przyspieszyć program'], ['When a method gets invalid data and cannot do its job properly', 'Always at the end of a method', 'Instead of a return statement', 'To make the program faster'], 'Wyjątki służą do sygnalizowania sytuacji błędnych, nie do zwykłego sterowania programem.', 'Exceptions signal error situations; they are not for ordinary program flow.'),
  ERR(1, c`static int Div(int a, int b)
{
    if (b == 0) throw new ArgumentException("b = 0");
    return a / b;
}
Console.WriteLine(Div(4, 0));`, ['ArgumentException', 'DivideByZeroException', 'FormatException', 'Wypisze 0'], 'Metoda sama zgłasza ArgumentException, zanim dojdzie do dzielenia.', 'The method raises ArgumentException itself before the division happens.', { en: { opts: ['ArgumentException', 'DivideByZeroException', 'FormatException', 'It prints 0'] } }),
  OUT(2, c`try
{
    try { throw new InvalidOperationException("inner"); }
    catch (InvalidOperationException e) { Console.Write("log "); throw; }
}
catch (Exception e) { Console.Write(e.GetType().Name); }`, ['log InvalidOperationException', 'log Exception', 'InvalidOperationException', 'log '], 'Samo throw; w catch przekazuje ten sam wyjątek dalej – zewnętrzny catch widzi oryginalny typ.', 'A bare throw; in catch rethrows the same exception – the outer catch sees the original type.'),
  OUT(2, c`try { Check(-5); }
catch (ArgumentOutOfRangeException) { Console.Write("range "); }
catch (ArgumentException) { Console.Write("arg "); }

static void Check(int x)
{
    if (x < 0) throw new ArgumentOutOfRangeException(nameof(x));
}`, ['range ', 'arg ', 'range arg ', 'x'], 'ArgumentOutOfRangeException dziedziczy po ArgumentException – łapie go pierwszy pasujący catch, czyli bardziej szczegółowy.', 'ArgumentOutOfRangeException derives from ArgumentException – the first matching catch, the more specific one, handles it.'),
  CODE(3, 'Dopisz własny wyjątek <code>NotEnoughGoldException</code> z polem <code>Missing</code> i klasę <code>Chest</code> z metodą <code>Take(int n)</code>, która przy braku złota zgłasza ten wyjątek. Program już obsługuje wyjątek.', 'Add a custom exception <code>NotEnoughGoldException</code> with a <code>Missing</code> field and a class <code>Chest</code> with a method <code>Take(int n)</code> that throws it when there is not enough gold. The program already handles the exception.', 'Chest c = new Chest(50);\nforeach (int n in new[] { 20, 40, 30 })\n{\n    try { c.Take(n); Console.WriteLine($"took {n}, left {c.Gold}"); }\n    catch (NotEnoughGoldException e) { Console.WriteLine($"missing {e.Missing}"); }\n}\n', [{ i: '', o: 'took 20, left 30\nmissing 10\ntook 30, left 0' }], c`Chest c = new Chest(50);
foreach (int n in new[] { 20, 40, 30 })
{
    try { c.Take(n); Console.WriteLine($"took {n}, left {c.Gold}"); }
    catch (NotEnoughGoldException e) { Console.WriteLine($"missing {e.Missing}"); }
}

class NotEnoughGoldException : Exception
{
    public int Missing;
    public NotEnoughGoldException(int missing) : base("Not enough gold") { Missing = missing; }
}
class Chest
{
    public int Gold { get; private set; }
    public Chest(int g) { Gold = g; }
    public void Take(int n)
    {
        if (n > Gold) throw new NotEnoughGoldException(n - Gold);
        Gold -= n;
    }
}`, 'class NotEnoughGoldException : Exception { public int Missing; ... }', 'class NotEnoughGoldException : Exception { public int Missing; ... }'),
  OUT(3, c`static int Parse(string s)
{
    try { return int.Parse(s); }
    catch (FormatException e) { throw new ArgumentException("bad: " + s, e); }
}
try { Parse("x1"); }
catch (ArgumentException e) { Console.WriteLine(e.Message + " / " + (e.InnerException is FormatException)); }`, ['bad: x1 / True', 'bad: x1 / False', 'x1 / True', 'FormatException'], 'Nowy wyjątek opakowuje oryginalny – ten jest dostępny jako InnerException.', 'The new exception wraps the original one – it is available as InnerException.'),
]);

X('pliki', [
  QZ(1, 'Który wyjątek zgłasza <code>File.ReadAllText</code>, gdy pliku nie ma?', 'Which exception does <code>File.ReadAllText</code> throw when the file does not exist?', ['FileNotFoundException', 'NullReferenceException', 'FormatException', 'IndexOutOfRangeException'], null, 'Brak pliku to FileNotFoundException.', 'A missing file is a FileNotFoundException.'),
  OUT(1, c`File.WriteAllText("a.txt", "x");
File.AppendAllText("a.txt", "y");
File.AppendAllText("a.txt", "z");
Console.WriteLine(File.ReadAllText("a.txt"));`, ['xyz', 'z', 'yz', 'x'], 'WriteAllText tworzy plik z "x", a AppendAllText dopisuje na końcu.', 'WriteAllText creates the file with "x", and AppendAllText adds to the end.'),
  OUT(2, c`File.WriteAllLines("n.txt", new[] { "3", "4", "5" });
int s = 0;
foreach (string l in File.ReadAllLines("n.txt")) s += int.Parse(l);
Console.WriteLine(s + " " + File.Exists("n.txt") + " " + File.Exists("m.txt"));`, ['12 True False', '345 True False', '12 True True', '3 True False'], 'Zapisaliśmy trzy linie i zsumowaliśmy liczby. Plik m.txt nie istnieje.', 'We wrote three lines and added the numbers. The file m.txt does not exist.'),
  CODE(2, 'Plik <code>dane.csv</code> ma w każdej linii <code>imię;punkty</code>. Wypisz imię osoby z największą liczbą punktów i jej wynik: <code>IMIĘ PUNKTY</code>.', 'The file <code>data.csv</code> has <code>name;points</code> on every line. Print the name of the person with the most points and the score: <code>NAME POINTS</code>.', '// plik dane.csv już istnieje\n', [{ i: '', o: 'Kapi 92' }], c`string best = ""; int max = -1;
foreach (string l in File.ReadAllLines("dane.csv"))
{
    string[] p = l.Split(';');
    int pts = int.Parse(p[1]);
    if (pts > max) { max = pts; best = p[0]; }
}
Console.WriteLine($"{best} {max}");`, 'Split(\';\') i int.Parse dla drugiej części.', 'Split(\';\') and int.Parse for the second part.', { pl: { files: { 'dane.csv': 'Ola;75\nKapi;92\nBob;88\n' } }, en: { start: '// the file data.csv already exists\n', files: { 'data.csv': 'Ola;75\nKapi;92\nBob;88\n' }, sol: c`string best = ""; int max = -1;
foreach (string l in File.ReadAllLines("data.csv"))
{
    string[] p = l.Split(';');
    int pts = int.Parse(p[1]);
    if (pts > max) { max = pts; best = p[0]; }
}
Console.WriteLine($"{best} {max}");` } }),
  OUT(3, c`using (StreamWriter w = new StreamWriter("log.txt"))
{
    for (int i = 1; i <= 3; i++) w.Write(i + ",");
}
string t = File.ReadAllText("log.txt").TrimEnd(',');
Console.WriteLine(t.Split(',').Length + " " + t);`, ['3 1,2,3', '4 1,2,3,', '3 1,2,3,', '1 123'], 'TrimEnd(\',\') usuwa ostatni przecinek; zostają trzy liczby.', 'TrimEnd(\',\') removes the last comma; three numbers remain.'),
  CODE(3, 'Plik <code>in.txt</code> zawiera liczby całkowite, po kilka w linii, oddzielone spacjami. Zapisz do pliku <code>out.txt</code> tylko liczby parzyste, każdą w osobnej linii, a na ekranie wypisz ich liczbę. Sprawdzamy też plik!', 'The file <code>in.txt</code> contains integers, several per line, separated by spaces. Write only the even numbers to <code>out.txt</code>, one per line, and print how many there are. The file is checked too!', '// plik in.txt już istnieje\n', [{ i: '', o: '4' }], c`var even = new List<string>();
foreach (string l in File.ReadAllLines("in.txt"))
    foreach (string w in l.Split(' '))
        if (w != "" && int.Parse(w) % 2 == 0) even.Add(w);
File.WriteAllLines("out.txt", even);
Console.WriteLine(even.Count);`, 'Dwie pętle: po liniach i po słowach (Split(\' \')); zbieraj do List<string>, zapisz WriteAllLines.', 'Two loops: over lines and over words (Split(\' \')); collect into a List<string> and save with WriteAllLines.', { pl: { files: { 'in.txt': '1 2 3\n10 15 22\n7 8\n' }, check: "if (!files['out.txt'] || files['out.txt'].replace(/\\r/g,'').trim() !== '2\\n10\\n22\\n8') return 'Plik out.txt ma zawierać: 2, 10, 22, 8 (każda w linii)';" }, en: { start: '// the file in.txt already exists\n', check: "if (!files['out.txt'] || files['out.txt'].replace(/\\r/g,'').trim() !== '2\\n10\\n22\\n8') return 'out.txt should contain: 2, 10, 22, 8 (one per line)';" } }),
  ERR(3, c`using (StreamReader r = new StreamReader("missing.txt"))
{
    Console.WriteLine(r.ReadLine());
}`, ['FileNotFoundException', 'NullReferenceException', 'Wypisze pustą linię', 'IOException nie istnieje'], 'Otwarcie nieistniejącego pliku do odczytu kończy się FileNotFoundException.', 'Opening a non-existent file for reading ends with FileNotFoundException.', { en: { opts: ['FileNotFoundException', 'NullReferenceException', 'It prints an empty line', 'IOException does not exist'] } }),
]);
