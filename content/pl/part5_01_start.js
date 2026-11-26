// Dział 1 (start): dodatkowe zadania – razem 15 podstawowych, 15 średnich, 10 zaawansowanych.

X('hello', [
  OUT(1, c`Console.Write("Ka");
Console.Write("pi");
Console.WriteLine("!");`, ['Kapi!', 'Ka\npi\n!', 'Ka pi !', 'Kapi'], 'Write nie przechodzi do nowej linii, dopiero WriteLine kończy linię.', 'Write does not move to a new line; only WriteLine ends the line.'),
  OUT(1, c`Console.WriteLine("1 + 2");
Console.WriteLine(1 + 2);`, ['1 + 2\n3', '3\n3', '1 + 2\n1 + 2', '12\n3'], 'Tekst w cudzysłowie wypisuje się dosłownie, a wyrażenie bez cudzysłowu jest obliczane.', 'Text in quotes is printed literally; an expression without quotes is calculated.'),
  OUT(2, c`Console.WriteLine("A\tB");
Console.WriteLine("C\\D");`, ['A\tB\nC\\D', 'A\\tB\nC\\\\D', 'A B\nCD', 'AtB\nC\\D'], '\\t to tabulator, a \\\\ w tekście oznacza jeden ukośnik.', '\\t is a tab and \\\\ inside a string means a single backslash.'),
  OUT(2, c`Console.WriteLine("Kapi" + 2 + 3);
Console.WriteLine(2 + 3 + "Kapi");`, ['Kapi23\n5Kapi', 'Kapi5\n5Kapi', 'Kapi23\n23Kapi', 'Kapi5\n23Kapi'], 'Działania wykonują się od lewej: najpierw tekst + 2 daje tekst, a w drugiej linii 2 + 3 = 5, dopiero potem doklejamy tekst.', 'Operators run left to right: text + 2 gives text, while in the second line 2 + 3 = 5 is calculated first and then the text is appended.'),
  FILL(2, 'Uzupełnij, aby program wypisał <code>Ahoj</code> i przeszedł do nowej linii.', 'Fill in the gap so that the program prints <code>Ahoj</code> and moves to a new line.', c`Console.___("Ahoj");`, [['WriteLine']], 'Ahoj', 'WriteLine wypisuje tekst i kończy linię.', 'WriteLine prints the text and ends the line.'),
  OUT(3, c`Console.WriteLine(@"C:\temp\new");
Console.WriteLine("C:\\temp\\new");`, ['C:\\temp\\new\nC:\\temp\\new', 'C:\temp\nnew\nC:\\temp\\new', 'C:\\temp\\new\nC:\temp\new', '@C:\\temp\\new\nC:\\temp\\new'], 'Tekst dosłowny @"..." nie zamienia sekwencji ucieczki, więc oba wiersze wypisują tę samą ścieżkę.', 'A verbatim string @"..." does not process escape sequences, so both lines print the same path.'),
  CODE(3, 'Wypisz ramkę z gwiazdek wokół napisu <code>KAPI</code> – dokładnie trzy linie:<br><code>********</code><br><code>* KAPI *</code><br><code>********</code>', 'Print a frame of asterisks around <code>KAPI</code> – exactly three lines:<br><code>********</code><br><code>* KAPI *</code><br><code>********</code>', null, [{ i: '', o: '********\n* KAPI *\n********' }], c`Console.WriteLine("********");
Console.WriteLine("* KAPI *");
Console.WriteLine("********");`, 'Trzy wywołania Console.WriteLine.', 'Three calls to Console.WriteLine.'),
]);

X('struktura', [
  QZ(1, 'Czym kończy się w C# każda instrukcja?', 'What ends every statement in C#?', [';', '.', ':', 'nowa linia'], [';', '.', ':', 'a new line'], 'Średnik kończy instrukcję. Nowa linia nic nie znaczy dla kompilatora.', 'A semicolon ends a statement. A new line means nothing to the compiler.'),
  QZ(1, 'Czy C# rozróżnia wielkość liter (np. <code>console</code> i <code>Console</code>)?', 'Is C# case-sensitive (e.g. <code>console</code> vs <code>Console</code>)?', ['Tak – to dwie różne nazwy', 'Nie – wielkość liter nie ma znaczenia', 'Tylko w nazwach zmiennych', 'Tylko w komentarzach'], ['Yes – these are two different names', 'No – letter case does not matter', 'Only in variable names', 'Only in comments'], 'C# rozróżnia wielkość liter, dlatego console.WriteLine to błąd CS0103.', 'C# is case-sensitive, so console.WriteLine is error CS0103.'),
  OUT(2, c`// Console.WriteLine("A");
Console.WriteLine("B"); // Console.WriteLine("C");
/* Console.WriteLine("D"); */`, ['B', 'A\nB', 'B\nC', 'A\nB\nC\nD'], 'Komentarze // i /* */ są pomijane przez kompilator – zostaje tylko wypisanie B.', 'Comments // and /* */ are ignored by the compiler – only B is printed.'),
  BUG(2, c`Console.WriteLine("Start");
console.WriteLine("Stop");`, 1, 'Console.WriteLine("Stop");', 'Nazwa klasy to Console z wielkiej litery – console nie istnieje (CS0103).', 'The class is called Console with a capital C – console does not exist (CS0103).'),
  QZ(2, 'Do czego służy <code>using System;</code> na początku pliku?', 'What is <code>using System;</code> at the top of a file for?', ['Pozwala pisać Console zamiast System.Console', 'Uruchamia program', 'Dołącza plik System.cs', 'Włącza tryb debugowania'], ['It lets you write Console instead of System.Console', 'It runs the program', 'It includes the file System.cs', 'It turns on debug mode'], 'using importuje przestrzeń nazw – jej klasy można pisać bez pełnej nazwy.', 'using imports a namespace – its classes can be used without the full name.'),
  QZ(2, 'Od której metody zaczyna się program w klasycznym szablonie (bez instrukcji najwyższego poziomu)?', 'Which method does a program start from in the classic template (without top-level statements)?', ['static void Main', 'Start', 'Program', 'Run'], null, 'Punktem wejścia jest statyczna metoda Main.', 'The entry point is the static Main method.'),
  OUT(3, c`class Program
{
    static void Main()
    {
        Console.Write(Program.Two() + Program.Two());
    }
    static int Two() => 2;
}`, ['4', '22', 'Two()Two()', 'Błąd kompilacji'], 'Two() zwraca liczbę 2, więc dodawanie daje 4 (a nie sklejenie tekstu).', 'Two() returns the number 2, so the addition gives 4 (not joined text).', { en: { opts: ['4', '22', 'Two()Two()', 'A compile error'] } }),
]);

X('kompilacja', [
  QZ(1, 'Co robi kompilator C#?', 'What does the C# compiler do?', ['Tłumaczy kod źródłowy na kod pośredni (IL), który uruchamia .NET', 'Wykonuje kod linia po linii bez tłumaczenia', 'Tylko koloruje składnię', 'Wysyła program do internetu'], ['Translates source code into intermediate code (IL) that .NET runs', 'Runs the code line by line without translating', 'Only colours the syntax', 'Sends the program to the internet'], 'Kompilator tworzy IL, a środowisko .NET (JIT) zamienia go na kod maszynowy.', 'The compiler produces IL and the .NET runtime (JIT) turns it into machine code.'),
  QZ(2, 'Czym jest <b>punkt przerwania</b> (breakpoint) w debuggerze?', 'What is a <b>breakpoint</b> in a debugger?', ['Miejscem, w którym program się zatrzyma, aby można było obejrzeć zmienne', 'Błędem kompilacji', 'Końcem programu', 'Komentarzem w kodzie'], ['A place where the program stops so you can inspect variables', 'A compile error', 'The end of the program', 'A comment in the code'], 'Breakpoint (F9 w Visual Studio) wstrzymuje wykonanie przed wskazaną linią.', 'A breakpoint (F9 in Visual Studio) pauses execution before the given line.'),
  QZ(3, 'Który skrót w Visual Studio wykonuje <b>jedną instrukcję</b> i wchodzi do wywoływanej metody?', 'Which Visual Studio shortcut runs <b>one statement</b> and steps into a called method?', ['F11 (Step Into)', 'F10 (Step Over)', 'F5 (Start)', 'Ctrl+S'], null, 'F11 wchodzi do metody, F10 przechodzi nad nią, F5 uruchamia/kontynuuje.', 'F11 steps into a method, F10 steps over it, F5 starts/continues.'),
  QZ(2, 'Program działa, ale wynik jest zły. Jak w Visual Studio najszybciej sprawdzić, jaką wartość ma zmienna w trakcie działania?', 'The program runs but the result is wrong. What is the quickest way in Visual Studio to check the value of a variable while the program runs?', ['Postawić punkt przerwania (F9), uruchomić debugowanie (F5) i sprawdzić zmienną w oknie Locals lub po najechaniu myszą', 'Przepisać program od nowa', 'Skompilować program jeszcze raz', 'Usunąć zmienną i dodać ją ponownie'], ['Set a breakpoint (F9), start debugging (F5) and check the variable in the Locals window or by hovering over it', 'Rewrite the program from scratch', 'Compile the program again', 'Delete the variable and add it again'], 'Debugger zatrzymuje program na punkcie przerwania; wartości zmiennych widać w oknach Locals/Watch i w podpowiedzi po najechaniu.', 'The debugger stops the program at a breakpoint; variable values are visible in the Locals/Watch windows and in the tooltip on hover.'),
  BUG(3, c`int a = 10;
int b = 0;
Console.WriteLine("Start");
Console.WriteLine(a / b);
Console.WriteLine("Koniec");`, 3, 'Console.WriteLine(b != 0 ? a / b : 0);', 'Program kompiluje się, ale w czasie działania dzielenie przez zero kończy się wyjątkiem DivideByZeroException – to błąd wykonania, nie kompilacji.', 'The program compiles, but at runtime division by zero throws DivideByZeroException – a runtime error, not a compile error.', { q: 'Program się kompiluje, ale kończy wyjątkiem. Kliknij linię, w której występuje.', qEn: 'The program compiles but ends with an exception. Click the line where it happens.', en: { code: c`int a = 10;
int b = 0;
Console.WriteLine("Start");
Console.WriteLine(a / b);
Console.WriteLine("End");` } }),
  QZ(3, 'Czym różni się błąd kompilacji od wyjątku (błędu wykonania)?', 'How does a compile error differ from an exception (runtime error)?', ['Błąd kompilacji wykrywa kompilator przed uruchomieniem; wyjątek pojawia się dopiero w trakcie działania', 'Nie ma różnicy', 'Wyjątki wykrywa kompilator, błędy kompilacji – użytkownik', 'Błąd kompilacji zawsze zamyka Visual Studio'], ['A compile error is found by the compiler before running; an exception appears only while the program runs', 'There is no difference', 'Exceptions are found by the compiler, compile errors by the user', 'A compile error always closes Visual Studio'], 'Programu z błędem kompilacji nie da się uruchomić. Wyjątek zależy od danych i momentu wykonania.', 'A program with a compile error cannot be run at all. An exception depends on the data and the moment of execution.'),
  QZ(3, 'Czym jest <b>biblioteka</b> (np. pakiet NuGet) w .NET?', 'What is a <b>library</b> (e.g. a NuGet package) in .NET?', ['Gotowym, skompilowanym kodem (klasy, metody), którego możesz użyć we własnym programie', 'Folderem z plikami tekstowymi', 'Innym kompilatorem', 'Listą błędów'], ['Ready, compiled code (classes, methods) you can use in your own program', 'A folder with text files', 'Another compiler', 'A list of errors'], 'Biblioteka to plik .dll z klasami. NuGet pobiera biblioteki i dodaje je do projektu.', 'A library is a .dll file with classes. NuGet downloads libraries and adds them to the project.'),
]);
