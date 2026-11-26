// English translation of chapters 1–4. Only fields that change are listed (same order of examples and tasks as the PL version).

Object.assign(TR.ch, {
 start: { name: { pirate: 'Starting Harbour', kitchen: 'Starter: Hello World', hero: 'Hero Base', neutral: 'Start' }, topic: 'Visual Studio, Hello World, syntax, compilation',
  outcomes: 'Uses a development environment for console applications; distinguishes compilers and interpreters; describes the tasks of a compiler, interpreter and debugger; describes the stages of compilation; explains what a library is; compiles and runs programs.' },
 dane: { name: { pirate: 'Variable Island', kitchen: 'Type Pantry', hero: 'Data Arsenal', neutral: 'VariablesAndTypes' }, topic: 'variables, types, constants, literals, conversions, Console.ReadLine',
  outcomes: 'Uses data types; uses simple data types; declares variables of different types; performs input and output operations; applies casting and type conversion.' },
 operatory: { name: { pirate: 'Operator Bay', kitchen: 'Operator Blender', hero: 'Power Lab', neutral: 'Operators' }, topic: 'arithmetic, assignment, comparison, logic, bitwise operators, precedence',
  outcomes: 'Uses arithmetic, assignment, comparison, logical, string and bitwise operators; uses operator precedence to build correct expressions.' },
 warunki: { name: { pirate: 'Crossroads of Conditions', kitchen: "Chef's Decisions", hero: "Hero's Choices", neutral: 'Conditions' }, topic: 'if, else if, else, switch, switch expression',
  outcomes: 'Uses conditional and selection statements; builds compound logical conditions.' },
});

Object.assign(TR.les, {
 hello: { title: 'Visual Studio and Hello World',
  theory: `<p>We usually write C# programs in <b>Visual Studio</b> (Windows) or in <b>Visual Studio Code</b> with the C# Dev Kit extension. Both are free (Visual Studio in the <i>Community</i> edition). When installing Visual Studio, select the <b>“.NET desktop development”</b> workload – you get the C# compiler, the .NET runtime and the WPF window designer.</p>
<p>New project: <b>File → New → Project → Console App</b>. Visual Studio creates <code>Program.cs</code> with one line:</p>
<pre>Console.WriteLine("Hello, World!");</pre>
<p><code>Console.WriteLine(...)</code> prints text to the console and moves to a new line. <code>Console.Write(...)</code> prints without moving to a new line. Text (a <i>string</i>) is always written in <b>double quotes</b> <code>"..."</code>.</p>
<p>Run the program with <b>F5</b> (with the debugger) or <b>Ctrl+F5</b> (without the debugger). In VS Code use <code>dotnet run</code> in the terminal.</p>`,
  more: `<p>Every C# statement ends with a <b>semicolon</b> <code>;</code>. Case matters: <code>Console</code> is not the same as <code>console</code>.</p><p>Inside text you can use <b>escape sequences</b>: <code>\\n</code> – new line, <code>\\t</code> – tab, <code>\\"</code> – double quote, <code>\\\\</code> – backslash.</p>`,
  ex: [
   { code: c`Console.WriteLine("Hello, World!");
Console.WriteLine("I'm Kapi and I'm learning C#!");`, cap: 'Kapi holds a sign: every Console.WriteLine is a separate line on the sign.' },
   { code: c`Console.Write("Kapi ");
Console.Write("loves ");
Console.WriteLine("oranges!");
Console.WriteLine("One\ttwo\tthree");
Console.WriteLine("Kapi says: \"Hi!\"");`, cap: 'Write keeps writing on the same line, WriteLine moves to a new one at the end. \\t makes a gap, \\" inserts a quote.' },
  ],
  tasks: [
   { q: 'What will the program print?', code: c`Console.WriteLine("Kapi");
Console.WriteLine("swims");`, opts: ['Kapi\nswims', 'Kapiswims', 'Kapi swims', '"Kapi"\n"swims"'], why: 'Each WriteLine ends the line, so the words are on two lines.' },
   { q: 'What will the program print?', code: c`Console.Write("Ala");
Console.Write("Kapi");
Console.WriteLine("!");`, opts: ['AlaKapi!', 'Ala\nKapi\n!', 'Ala Kapi !', 'AlaKapi\n!'], why: 'Write does not move to a new line and does not add spaces.' },
   { q: 'Fill in the gap so the program prints <code>Ahoy!</code> and moves to a new line.', code: c`Console.___("Ahoy!");`, expect: 'Ahoy!', why: 'Console.WriteLine prints text and moves to a new line.' },
   { q: 'The program should greet us, but the compiler reports an error. Click the line with the bug.', code: c`Console.WriteLine("Good morning");
Console.WriteLine("I'm Kapi")
Console.WriteLine("See you");`, fix: 'Console.WriteLine("I\'m Kapi");', why: 'The semicolon at the end of the statement is missing. The compiler reports CS1002: ; expected.' },
   { q: 'Which Visual Studio shortcut runs the program <b>with the debugger</b>?', why: 'F5 = Start Debugging, Ctrl+F5 = Start Without Debugging, F10 = step in the debugger.' },
   { q: 'Write a program that prints on two lines:<br><code>Kapi</code><br><code>loves baths</code>', start: '// Your code\n', tests: [{ i: '', o: 'Kapi\nloves baths' }], sol: c`Console.WriteLine("Kapi");
Console.WriteLine("loves baths");`, hint: 'Use two Console.WriteLine statements.' },
   { q: 'Using <b>one</b> <code>Console.WriteLine</code> and the <code>\\n</code> sequence, print three lines: <code>one</code>, <code>two</code>, <code>three</code>.', start: 'Console.WriteLine("one two three");\n', tests: [{ i: '', o: 'one\ntwo\nthree' }],
     check: "if ((src.match(/Console\\.Write/g) || []).length !== 1) return 'Use exactly one Console.WriteLine';", sol: c`Console.WriteLine("one\ntwo\nthree");`, hint: '\\n inside text means a new line.' },
  ] },
 struktura: { title: 'Program structure and syntax',
  theory: `<p>Since .NET 6 a program can consist only of <b>top-level statements</b> – like in the previous lesson. It is a shortcut: the compiler still wraps them in a class and a <code>Main</code> method. The classic template looks like this:</p>
<pre>using System;

namespace KapiPasta
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello!");
        }
    }
}</pre>
<ul><li><code>using System;</code> – imports a namespace (library) containing the <code>Console</code> class.</li>
<li><code>namespace</code> – a “folder” for our classes.</li>
<li><code>class Program</code> – a class; in C# all code lives in classes.</li>
<li><code>static void Main</code> – the <b>entry point</b> of the program. Execution starts here.</li>
<li>Code blocks are enclosed in braces <code>{ }</code>, statements end with a semicolon <code>;</code>.</li></ul>
<p><b>Comments</b>: <code>// to the end of the line</code> and <code>/* many lines */</code>. The compiler ignores them.</p>`,
  more: `<p>Conventions: class and method names use <b>PascalCase</b> (<code>MyClass</code>, <code>CountSum</code>), variables use <b>camelCase</b> (<code>capybaraCount</code>). Indentation (4 spaces) is not required by the compiler, but makes code much easier to read – Visual Studio formats code with <b>Ctrl+K, Ctrl+D</b>.</p>`,
  ex: [
   { code: c`using System;

namespace KapiPasta
{
    class Program
    {
        static void Main(string[] args)
        {
            // a comment: the compiler skips it
            Console.WriteLine("The program starts in Main!");
            /* a comment
               on several lines */
            Console.WriteLine("End of Main.");
        }
    }
}`, cap: 'Kapi carries Program.cs through the stages: the C# compiler produces intermediate IL code, and the JIT turns it into the processor’s machine code.' },
  ],
  tasks: [
   { q: 'Which method does a classic C# program start with?', why: 'The entry point of a program is the static Main method.' },
   { q: 'What will the program print?', why: 'Comments are skipped – only WriteLine("B") remains.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`class Program
{
    static void Main()
    {
        console.WriteLine("Hi!");
    }
}`, fix: 'Console.WriteLine("Hi!");', why: 'C# is case-sensitive: the class is called Console, not console (CS0103).' },
   { q: 'One character is missing. Click the line the compiler points to.', why: 'Every { needs a matching }. The brace closing the class is missing (CS1513).' },
   { q: 'Complete the header of the entry method.', code: c`class Program
{
    static ___ Main(string[] args)
    {
        Console.WriteLine("Start!");
    }
}`, why: 'Main returns nothing, so its type is void.' },
   { q: 'What does <code>using System;</code> do?', opts: ['Imports the System namespace, e.g. with the Console class', 'Runs the program', 'Creates a new System class', 'Turns on the debugger'], why: 'using imports a namespace, so we can write Console instead of System.Console.' },
  ] },
 kompilacja: { title: 'Compilation, debugging, libraries',
  theory: `<p>A <b>compiler</b> translates the whole source code into another language <i>before</i> running it and reports syntax errors immediately. An <b>interpreter</b> reads and executes the program line by line while it runs (that is how Python works, for example).</p>
<p>C# is a <b>compiled</b> language, but in two steps:</p>
<ol><li>The C# compiler (Roslyn, <code>csc</code>) turns <code>.cs</code> files into <b>intermediate language (IL)</b> stored in a <code>.dll</code>/<code>.exe</code> file.</li>
<li>When the program runs, the <b>JIT</b> (Just-In-Time) compiler in .NET turns IL into <b>machine code</b> for the specific processor.</li></ol>
<p>Compiler stages: lexical analysis (splitting into tokens) → syntax analysis (program tree) → semantic analysis (types, names) → code generation.</p>
<p>A <b>debugger</b> lets you stop the program at a chosen place (<b>breakpoint</b> – F9), run it step by step (<b>F10</b> – step over, <b>F11</b> – step into a method) and watch variable values (the <i>Locals</i> and <i>Watch</i> windows).</p>
<p>A <b>library</b> is ready-made, compiled code for reuse (e.g. <code>System.Console</code>, <code>System.Math</code>). In .NET libraries are <code>.dll</code> files, and extra ones are downloaded as <b>NuGet</b> packages.</p>`,
  more: `<p>Errors are divided into: <b>compile errors</b> (e.g. a missing semicolon – the program does not start at all, codes <code>CSxxxx</code>), <b>runtime errors – exceptions</b> (e.g. division by zero – the program starts but stops) and <b>logic errors</b> (the program runs but gives a wrong result – the debugger helps most here).</p>`,
  ex: [
   { code: c`Console.WriteLine("Starting");
int x = 10;
int y = 0;
Console.WriteLine(x / y);
Console.WriteLine("You won't see this");`, cap: 'The program compiled without errors, but while running it divided by zero. That is a runtime error – an exception.' },
  ],
  tasks: [
   { q: 'What is <b>IL</b> in .NET?', opts: ['Intermediate code produced by the C# compiler', 'The processor’s machine code', 'A .cs source code file', 'A kind of compile error'], why: 'The compiler produces IL, and the JIT turns it into machine code at run time.' },
   { q: 'Which Visual Studio key sets a <b>breakpoint</b> on the current line?', why: 'F9 – breakpoint, F10/F11 – debugger steps.' },
   { q: 'The program compiles, but while running it stops with <code>DivideByZeroException</code>. What kind of error is it?', opts: ['A runtime error (exception)', 'A compile error', 'A logic error', 'A syntax error'], why: 'An exception appears only while the program is running.' },
   { q: 'What happens when you try to run this program?', opts: ['The compiler reports an error and the program does not run at all', 'The program prints Kapi and Pasta', 'The program prints Kapi and then throws an exception', 'The program prints KapiPasta on one line'], why: 'A missing semicolon is a syntax error. The compiler finds it before the program runs – no line is executed.' },
   { q: 'How does a compiler differ from an interpreter?', opts: ['A compiler translates the whole program before running it, an interpreter executes it on the fly', 'An interpreter is always faster than a compiler', 'A compiler only works in Visual Studio Code', 'There is no difference'], why: 'That is why we see C# syntax errors before the program runs.' },
   { q: 'The program runs but prints a wrong result (a logic error). The area of a square with side 4 is 16. Click the line with the bug.', code: c`int side = 4;
int area = side + side;
Console.WriteLine("Area: " + area);`, fix: 'int area = side * side;', expect: 'Area: 16', why: 'The area of a square is side times side, not side plus side.' },
  ] },
 zmienne: { title: 'Variables',
  theory: `<p>A <b>variable</b> is a named place in memory where we store a value. In C# every variable has a <b>type</b>, given in the declaration:</p>
<pre>int orangeCount = 5;
string name = "Kapi";</pre>
<p><code>type name = value;</code> is a <b>declaration with initialization</b>. The value can be changed later: <code>orangeCount = 7;</code> (without the type!).</p>
<p>The <code>var</code> keyword lets the compiler infer the type from the value: <code>var age = 4;</code> is still an <code>int</code>.</p>
<p>Variable names: letters, digits and <code>_</code>; they cannot start with a digit or be a keyword. We usually write them in <b>camelCase</b>.</p>
<p><b>Interpolation</b> inserts values into text: <code>$"I am {age} years old"</code>.</p>`,
  more: `<p>A variable must get a value before it is read – otherwise the compiler reports <code>CS0165: Use of unassigned local variable</code>. A variable exists only in the block <code>{ }</code> where it was declared (its <b>scope</b>).</p>`,
  ex: [
   { code: c`string name = "Kapi";
int age = 4;
double weight = 45.5;
bool likesBaths = true;
Console.WriteLine($"{name} is {age} years old and weighs {weight} kg.");
Console.WriteLine("Likes baths? " + likesBaths);
age = age + 1;
Console.WriteLine($"Next year: {age}");`, scene: { vars: [['name', '"Kapi"', 'string'], ['age', '5', 'int'], ['weight', '45.5', 'double'], ['likesBaths', 'true', 'bool']] }, cap: 'Each variable is a box with a name and a type. The colour of the box tells what kind of value it can hold.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'The second statement overwrites the value of the variable.' },
   { q: 'What will the program print?', code: c`string name = "Kapi";
Console.WriteLine($"Hi, {name}!");`, opts: ['Hi, Kapi!', 'Hi, {name}!', 'Hi, name!', '$"Hi, Kapi!"'], why: 'In interpolated text $"..." the braces {} are replaced by the value.' },
   { q: 'Fill in the types so the program compiles.', code: c`___ name = "Ola";
___ age = 12;
Console.WriteLine($"{name}: {age}");`, why: 'Text is string, a whole number is int (or var for both).' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`int points = 10;
points = points + 5;
Console.WriteLine(Points);`, fix: 'Console.WriteLine(points);', why: 'Case matters – the variable is called points, not Points (CS0103).' },
   { q: 'The compiler reports an error. Click the line with the bug.', why: 'Variable x is read before it gets a value (CS0165).' },
   { q: 'Create variables <code>name</code> = <code>"Kapi"</code> and <code>oranges</code> = <code>3</code>, then print: <code>Kapi has 3 oranges</code>.', start: '// Your code\n', tests: [{ i: '', o: 'Kapi has 3 oranges' }],
     check: "if (!/\\bname\\b/.test(src) || !/\\boranges\\b/.test(src)) return 'Use the variables name and oranges';", sol: c`string name = "Kapi";
int oranges = 3;
Console.WriteLine($"{name} has {oranges} oranges");`, hint: 'Use interpolation: $"{name} has {oranges} oranges".' },
  ] },
 typy: { title: 'Data types, constants and literals',
  theory: `<p>The most important <b>simple types</b> in C#:</p>
<ul><li><code>int</code> – a whole number (32 bits, from −2,147,483,648 to 2,147,483,647), <code>long</code> – a bigger one (64 bits), <code>byte</code> – from 0 to 255,</li>
<li><code>double</code> – a floating-point number (the default for numbers with a dot), <code>float</code> – less precise, <code>decimal</code> – exact, for money,</li>
<li><code>char</code> – one character in <b>single quotes</b>: <code>'K'</code>,</li>
<li><code>bool</code> – <code>true</code> or <code>false</code>,</li>
<li><code>string</code> – text in <b>double quotes</b>: <code>"Kapi"</code> (a reference type, but we use it like a simple one).</li></ul>
<p><b>Literals</b> are values written directly in code. Their type depends on how they are written: <code>5</code> → int, <code>5L</code> → long, <code>5.0</code> → double, <code>5.0f</code> → float, <code>5.0m</code> → decimal, <code>'5'</code> → char, <code>"5"</code> → string.</p>
<p>A <b>constant</b> (<code>const</code>) is a value that cannot be changed: <code>const double VAT = 0.23;</code>. Trying to change it is a compile error.</p>`,
  more: `<p>You can check type ranges with <code>int.MaxValue</code>, <code>long.MaxValue</code> etc. When a result does not fit in an <code>int</code>, the number “wraps around” like a counter: <code>int.MaxValue + 1</code> stored in a variable gives −2147483648 (overflow). On a Windows system with, e.g., Polish settings, decimal numbers may be printed with a <b>comma</b> (3,14) – KapiPasta uses a dot, like the invariant culture.</p>`,
  ex: [
   { code: c`int oranges = 12;
long seeds = 3000000000L;
double temperature = 36.6;
float mass = 45.5f;
decimal price = 19.99m;
char grade = 'A';
bool hungry = true;
string name = "Kapi";
const int DAYS_IN_WEEK = 7;
Console.WriteLine($"{name}: {oranges}, {seeds}, {temperature}, {mass}, {price}, {grade}, {hungry}, {DAYS_IN_WEEK}");
Console.WriteLine(int.MaxValue);`, scene: { vars: [['oranges', '12', 'int'], ['seeds', '3000000000', 'long'], ['temperature', '36.6', 'double'], ['price', '19.99', 'decimal'], ['grade', "'A'", 'char'], ['hungry', 'true', 'bool'], ['name', '"Kapi"', 'string']] }, cap: "Kapi's pantry: every ingredient goes into a box of the right type – whole numbers separately, fractions separately, characters and texts separately." },
  ],
  tasks: [
   { q: "What is the type of the literal <code>'K'</code>?", why: 'A single character in single quotes is a char.' },
   { q: 'Which type is best for storing amounts of money?', why: 'decimal calculates exactly in base 10, without the rounding errors typical of double/float.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`string name = "Kapi";
int age = "4";
Console.WriteLine(name + age);`, fix: 'int age = 4;', why: '"4" is text (string), but the variable is an int (CS0029).' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`float weight = 45.5;
Console.WriteLine(weight);`, fix: 'float weight = 45.5f;', why: 'The literal 45.5 is a double. For float you have to add f (CS0664).' },
   { q: 'What will happen?', opts: ['A compile error', 'It prints 20', 'It prints 10', 'It prints 30'], why: 'A constant (const) cannot be changed.' },
   { q: 'What will the program print?', opts: ['-2147483648', '2147483648', '2147483647', 'A compile error'], why: 'int overflows and “wraps around” to the smallest value.' },
   { q: 'Declare a constant <code>VAT</code> = <code>0.23m</code> and a variable <code>price</code> = <code>100m</code> (decimal). Print the price with VAT: <code>123.00</code>.', start: '// Your code\n',
     check: "if (!/const\\s+decimal\\s+VAT/.test(src)) return 'Declare the constant: const decimal VAT = 0.23m;';", sol: c`const decimal VAT = 0.23m;
decimal price = 100m;
Console.WriteLine(price + price * VAT);`, hint: 'decimal remembers the number of decimal places: 100m * 0.23m = 23.00.' },
  ] },
 konwersje: { title: 'Casting and type conversion',
  theory: `<p><b>Implicit conversion</b> happens automatically when nothing is lost: <code>int</code> → <code>long</code> → <code>double</code>. E.g. <code>double d = 5;</code> is fine.</p>
<p><b>Explicit casting</b> is written with a type in parentheses. It is needed when data may be lost: <code>int i = (int)3.99;</code> gives <b>3</b> (the fractional part is <b>cut off</b>, not rounded!). <code>(char)65</code> gives <code>'A'</code>, and <code>(int)'A'</code> – 65.</p>
<p><b>Text to number</b>: <code>int.Parse("42")</code>, <code>double.Parse("3.5")</code> or <code>Convert.ToInt32("42")</code>. If the text is not a number, the program throws a <code>FormatException</code>. It is safer to use <code>int.TryParse(text, out int number)</code> – it returns <code>true</code>/<code>false</code>.</p>
<p><b>Number to text</b>: <code>x.ToString()</code> or simply interpolation <code>$"{x}"</code>.</p>`,
  more: `<p>Watch the difference: <code>(int)2.5</code> truncates to 2, while <code>Convert.ToInt32(2.5)</code> <b>rounds</b> – using “banker’s rounding” (to the nearest even number): 2.5 → 2, 3.5 → 4. <code>Math.Round</code> works the same way.</p>`,
  ex: [
   { code: c`double average = 4.75;
int whole = (int)average;
Console.WriteLine(whole);
int letter = 'K';
Console.WriteLine(letter + " " + (char)(letter + 1));
string text = "42";
int number = int.Parse(text);
Console.WriteLine(number + 8);
Console.WriteLine(Convert.ToInt32(3.5) + " " + Convert.ToInt32(2.5));
if (int.TryParse("abc", out int result)) Console.WriteLine("A number!");
else Console.WriteLine("Not a number, result = " + result);`, cap: 'Kapi pours a big cup (double) into a small one (int). The fractional part 0.75 spills out – casting truncates, it does not round.' },
  ],
  tasks: [
   { q: 'What will the program print?', opts: ['9', '10', '9.99', 'An error'], why: 'Casting with (int) cuts off the fractional part.' },
   { q: 'What will the program print?', why: 'Adding texts joins them; after converting to numbers they are added arithmetically.' },
   { q: 'Which exception will the program throw?', code: c`int n = int.Parse("five");
Console.WriteLine(n);`, why: '"five" is not a written number.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`double price = 19.99;
int coins = price;
Console.WriteLine(coins);`, fix: 'int coins = (int)price;', why: 'double → int may lose data, so you must cast explicitly: (int)price (CS0266).' },
   { q: 'Fill in the gap to turn text into a whole number.', code: c`string age = "15";
int a = int.___(age);
Console.WriteLine(a + 1);`, why: 'int.Parse converts text into an int.' },
   { q: 'What will the program print?', opts: ['97\nc', 'a\nc', '97\n99', 'A compile error'], why: 'The code of a is 97; 97 + 2 = 99 is the code of the letter c.' },
   { q: 'The program reads a line of text. If it is a whole number, print it doubled. Otherwise print <code>Error</code>. Use <code>int.TryParse</code>.', tests: [{ i: '21', o: '42' }, { i: 'kapi', o: 'Error' }, { i: '-5', o: '-10' }],
     check: "if (!/TryParse/.test(src)) return 'Use int.TryParse';", sol: c`string s = Console.ReadLine();
if (int.TryParse(s, out int n))
    Console.WriteLine(n * 2);
else
    Console.WriteLine("Error");` },
  ] },
 wejscie: { title: 'Console input and output',
  theory: `<p><code>Console.ReadLine()</code> waits until the user types a line and presses Enter, then returns it as a <b>string</b>. Numbers must therefore be converted: <code>int a = int.Parse(Console.ReadLine());</code>.</p>
<p>In KapiPasta you type input in the <b>“Input data”</b> field – each line is one <code>ReadLine()</code> call.</p>
<p>Formatting the output:</p>
<ul><li><code>$"{x:F2}"</code> – 2 decimal places, <code>{x:N0}</code> – thousands separator, <code>{x:D3}</code> – leading zeros (007),</li>
<li><code>$"{name,10}"</code> – a field 10 characters wide (right-aligned), <code>{name,-10}</code> – left-aligned,</li>
<li>the “classic” style: <code>Console.WriteLine("{0} is {1} years old", name, age);</code>.</li></ul>`,
  more: `<p>Console colours: <code>Console.ForegroundColor = ConsoleColor.Green;</code>, and to restore the defaults – <code>Console.ResetColor();</code>. When there is no more input, <code>ReadLine()</code> returns <code>null</code> – and then <code>int.Parse(null)</code> throws <code>ArgumentNullException</code>.</p>`,
  ex: [
   { code: c`Console.Write("What is your name? ");
string name = Console.ReadLine();
Console.Write("How old are you? ");
int age = int.Parse(Console.ReadLine());
Console.WriteLine($"Hi {name}! In 10 years you will be {age + 10}.");
double rate = 4.31579;
Console.WriteLine($"Rate: {rate:F2} | {1234567:N0} | {7:D3}");
Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Kapi is green with envy!");
Console.ResetColor();`, cap: 'Kapi listens to what you type (ReadLine) and answers on the sign. Numbers from the input are converted with int.Parse first.' },
  ],
  tasks: [
   { q: 'What type does <code>Console.ReadLine()</code> return?', why: 'ReadLine always returns text (string), or null when there is no more input.' },
   { q: 'What will the program print for the input <code>7</code>?', opts: ['71', '8', '7', 'An error'], why: 's is the text "7", so + joins: "7" + 1 = "71".' },
   { q: 'What will the program print?', code: c`double price = 7.5;
Console.WriteLine($"Price: {price:F2} $");`, opts: ['Price: 7.50 $', 'Price: 7.5 $', 'Price: 7 $', 'Price: {price:F2} $'], why: 'F2 – always 2 decimal places.' },
   { q: 'Fill in the gap to read a whole number.', why: 'Console.ReadLine() reads a line of text.' },
   { q: 'Read a name and print <code>Ahoy, NAME!</code> (e.g. for <code>Kapi</code>: <code>Ahoy, Kapi!</code>).', start: '// Your code\n', tests: [{ i: 'Kapi', o: 'Ahoy, Kapi!' }, { i: 'Ola', o: 'Ahoy, Ola!' }], sol: c`string name = Console.ReadLine();
Console.WriteLine($"Ahoy, {name}!");`, hint: 'string name = Console.ReadLine();' },
   { q: 'Read two whole numbers (each on its own line) and print their sum and product as <code>Sum: S, product: P</code>.', start: '// Your code\n', tests: [{ i: '3\n4', o: 'Sum: 7, product: 12' }, { i: '10\n-2', o: 'Sum: 8, product: -20' }], sol: c`int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
Console.WriteLine($"Sum: {a + b}, product: {a * b}");`, hint: 'int.Parse(Console.ReadLine()) twice.' },
   { q: 'Read a price (a number with a dot, e.g. <code>12.5</code>) and a quantity. Print <code>To pay: X $</code>, where X has exactly 2 decimal places.', start: '// Your code\n', tests: [{ i: '12.5\n3', o: 'To pay: 37.50 $' }, { i: '0.99\n10', o: 'To pay: 9.90 $' }], sol: c`double price = double.Parse(Console.ReadLine());
int count = int.Parse(Console.ReadLine());
Console.WriteLine($"To pay: {price * count:F2} $");`, hint: 'double.Parse and the {x:F2} format.' },
  ] },
 arytm: { title: 'Arithmetic and assignment operators',
  theory: `<p>Arithmetic operators: <code>+ - * /</code> and <code>%</code> (remainder).</p>
<p>⚠️ <b>Dividing whole numbers</b> gives a whole number: <code>7 / 2</code> is <b>3</b>! To get 3.5, at least one number must be a <code>double</code>: <code>7 / 2.0</code> or <code>(double)7 / 2</code>.</p>
<p><code>%</code> gives the remainder: <code>7 % 2</code> = 1 (handy for checking parity: <code>n % 2 == 0</code>).</p>
<p>Assignment operators: <code>x += 5</code> (same as <code>x = x + 5</code>), <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code>. <b>Increment</b> <code>x++</code> adds 1, <b>decrement</b> <code>x--</code> subtracts 1.</p>
<p>The <code>+</code> operator also works on texts – it <b>joins</b> them: <code>"Ka" + "pi"</code> → <code>"Kapi"</code>.</p>`,
  more: `<p><code>x++</code> (post-increment) returns the old value and then increases it; <code>++x</code> (pre-increment) increases first. <code>int a = 5; int b = a++;</code> → b = 5, a = 6. The <code>Math</code> library has ready functions: <code>Math.Pow(2, 10)</code>, <code>Math.Sqrt(16)</code>, <code>Math.Abs(-3)</code>, <code>Math.Round(2.567, 2)</code>, <code>Math.Max(a, b)</code>.</p>`,
  ex: [
   { code: c`int oranges = 14;
int capybaras = 4;
Console.WriteLine($"Each one gets: {oranges / capybaras}");
Console.WriteLine($"Left over: {oranges % capybaras}");
Console.WriteLine($"Exactly: {(double)oranges / capybaras}");`, cap: 'Kapi shares 14 oranges between 4 baskets. / tells how many go into each basket, % – how many stay outside.' },
   { code: c`int points = 10;
points += 5;
points *= 2;
points--;
Console.WriteLine(points);
string s = "Ka" + "pi";
s += "Pasta";
Console.WriteLine(s);
Console.WriteLine(Math.Pow(2, 10) + " " + Math.Sqrt(81) + " " + Math.Round(3.14159, 2));`, scene: { items: [['points += 5', '15'], ['points *= 2', '30'], ['points--', '29'], ['"Ka" + "pi" + "Pasta"', '"KapiPasta"', 'joining']] }, cap: 'Each card is one operation – Kapi shows the value after it.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'Both operands are int, so the division is integer division.' },
   { q: 'What will the program print?', why: '17 = 3·5 + 2, the remainder is 2.' },
   { q: 'What will the program print?', why: '5 + 3 = 8, then 8 · 2 = 16.' },
   { q: 'What will the program print?', why: '7 / 2.0 is double division. 1 / 3 = 0 (integer), and 0 · 3 = 0.' },
   { q: 'The program should compute the average of two grades: 4 and 5, which is 4.5. But it prints 4. Click the line with the bug.', code: c`int a = 4;
int b = 5;
double average = (a + b) / 2;
Console.WriteLine(average);`, fix: 'double average = (a + b) / 2.0;', why: '(a + b) / 2 is integer division – the result 4 is converted to double only afterwards. Use 2.0.' },
   { q: 'What will the program print?', why: 'b gets the old value 5 (a → 6), then ++a increases it to 7 and returns 7.' },
   { q: 'Read a number of seconds (int) and print it as <code>M min S s</code>, e.g. for 135: <code>2 min 15 s</code>.', start: 'int seconds = int.Parse(Console.ReadLine());\n', sol: c`int seconds = int.Parse(Console.ReadLine());
Console.WriteLine($"{seconds / 60} min {seconds % 60} s");`, hint: 'Minutes are seconds / 60, and the rest is seconds % 60.' },
  ] },
 logika: { title: 'Comparisons, logic, bits and precedence',
  theory: `<p><b>Comparison operators</b> give a <code>bool</code>: <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Note: <code>=</code> is assignment, <code>==</code> is comparison!</p>
<p><b>Logical operators</b>: <code>&amp;&amp;</code> (and – both true), <code>||</code> (or – at least one), <code>!</code> (not). <code>&amp;&amp;</code> and <code>||</code> are “lazy”: when the result is known from the left side, the right side is not evaluated.</p>
<p><b>Bitwise operators</b> work on individual bits: <code>&amp;</code> (AND), <code>|</code> (OR), <code>^</code> (XOR), <code>~</code> (negation), <code>&lt;&lt;</code> / <code>&gt;&gt;</code> (shifts; <code>1 &lt;&lt; 3</code> = 8).</p>
<p><b>Precedence</b> (highest first): <code>! ++ --</code> → <code>* / %</code> → <code>+ -</code> → <code>&lt;&lt; &gt;&gt;</code> → <code>&lt; &gt; &lt;= &gt;=</code> → <code>== !=</code> → <code>&amp;</code> → <code>^</code> → <code>|</code> → <code>&amp;&amp;</code> → <code>||</code> → <code>?:</code> → <code>= +=</code>... When in doubt – <b>parentheses</b>!</p>
<p>The <b>conditional operator</b> <code>condition ? a : b</code> returns <code>a</code> when the condition is true, otherwise <code>b</code>.</p>`,
  ex: [
   { code: c`int age = 15;
bool hasTicket = true;
Console.WriteLine(age >= 13 && hasTicket);
Console.WriteLine(age < 10 || age > 60);
Console.WriteLine(!hasTicket);
Console.WriteLine(2 + 3 * 4);
Console.WriteLine((2 + 3) * 4);
string desc = age >= 18 ? "adult" : "teenager";
Console.WriteLine(desc);`, scene: { items: [['age >= 13 && hasTicket', 'True', 'both true'], ['age < 10 || age > 60', 'False', 'none'], ['!hasTicket', 'False'], ['2 + 3 * 4', '14', '* before +'], ['(2 + 3) * 4', '20', 'parentheses']] }, cap: 'Kapi checks conditions like a guard at the gangway: && needs both conditions, || needs just one.' },
   { cap: 'Bits are like little lights: & lights up only where both are on, | – where at least one is, ^ – where exactly one is.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'Both conditions are true. C# prints bool as True/False.' },
   { q: 'What will the program print?', why: 'Multiplication has higher precedence: 10 − 6 = 4.' },
   { q: 'What will the program print?', code: c`int t = 30;
string s = t > 25 ? "hot" : "cool";
Console.WriteLine(s);`, opts: ['hot', 'cool', 'True', 'An error'], why: 'The condition t > 25 is true, so the first value is chosen.' },
   { q: 'What will the program print?', opts: ['False', 'True', 'A compile error', 'false'], why: '! first: !a = False. Then && before ||: b && a = False. False || False = False.' },
   { q: 'What will the program print?', why: '110 & 011 = 010 (2), 110 | 011 = 111 (7), 5 · 2² = 20.' },
   { q: 'Fill in the condition “the number is even”.', why: 'An even number gives remainder 0 when divided by 2.' },
   { q: 'Read a year and print <code>True</code> if it is a leap year, otherwise <code>False</code>. A year is a leap year if it is divisible by 4 and not by 100, or divisible by 400.', start: 'int year = int.Parse(Console.ReadLine());\n', sol: c`int year = int.Parse(Console.ReadLine());
Console.WriteLine((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);`, hint: '(year % 4 == 0 && year % 100 != 0) || year % 400 == 0' },
  ] },
 if: { title: 'The if / else statement',
  theory: `<p>The <code>if</code> statement runs a block of code only when the condition is true:</p>
<pre>if (temperature &gt; 30)
{
    Console.WriteLine("Kapi goes for a swim!");
}
else
{
    Console.WriteLine("Kapi sunbathes.");
}</pre>
<p>The condition is always in <b>parentheses</b> and must be a <code>bool</code>. The block is in <b>braces</b> (with a single statement they can be skipped – but it is better not to).</p>
<p>More cases are handled with <code>else if</code>. Conditions are checked <b>in order</b> – only the first matching block runs.</p>`,
  more: `<p>A typical mistake: <code>if (x = 5)</code> – that is assignment, not comparison. In C# it is a compile error (int is not bool). Another one: a semicolon right after the parenthesis – <code>if (x &gt; 5);</code> – ends the if with an empty statement, and the block below always runs.</p>`,
  ex: [
   { code: c`int temperature = 32;
if (temperature > 30)
{
    Console.WriteLine("Kapi goes for a swim!");
}
else
{
    Console.WriteLine("Kapi sunbathes.");
}`, scene: { cond: 'temperature > 30', yes: 'swim 💦', no: 'sun ☀️' }, cap: 'The condition is true, so Kapi takes the left path (if). The right one (else) is skipped.' },
   { code: c`int points = 73;
string grade;
if (points >= 90) grade = "excellent";
else if (points >= 75) grade = "very good";
else if (points >= 60) grade = "good";
else grade = "more practice needed";
Console.WriteLine(grade);`, scene: { steps: [['points >= 90', false], ['points >= 75', false], ['points >= 60', true], ['else', null]], res: 'good' }, cap: 'Kapi tries the doors one by one and walks through the first one that opens. He does not check the rest.' },
  ],
  tasks: [
   { q: 'What will the program print?', code: c`int x = 4;
if (x > 5)
{
    Console.WriteLine("big");
}
else
{
    Console.WriteLine("small");
}`, opts: ['small', 'big', 'big\nsmall', 'nothing'], why: '4 > 5 is false, so else runs.' },
   { q: 'What will the program print?', why: 'The first matching condition (n >= 50) wins – the rest are not checked.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`int age = 18;
if (age = 18)
{
    Console.WriteLine("Adult!");
}`, fix: 'if (age == 18)', why: '= is assignment. Comparison uses == (CS0029: int is not bool).' },
   { q: 'The program prints “Cold!” even at 25 degrees. Click the line with the bug.', code: c`int t = 25;
if (t < 10);
{
    Console.WriteLine("Cold!");
}`, why: 'The semicolon after if ends the statement – the block in braces always runs.' },
   { q: 'Complete the program that checks whether a number is positive, negative or zero.', code: c`int n = -3;
if (n > 0) Console.WriteLine("positive");
___ (n < 0) Console.WriteLine("negative");
___ Console.WriteLine("zero");`, expect: 'negative', why: 'Further conditions use else if, and “everything else” is else.' },
   { q: 'Read a whole number and print <code>even</code> or <code>odd</code>.', tests: [{ i: '8', o: 'even' }, { i: '7', o: 'odd' }, { i: '-4', o: 'even' }], sol: c`int n = int.Parse(Console.ReadLine());
if (n % 2 == 0) Console.WriteLine("even");
else Console.WriteLine("odd");` },
   { q: 'Read three whole numbers (each on its own line) and print the largest one. Do not use <code>Math.Max</code>.', check: "if (/Math\\.Max/.test(src)) return 'No Math.Max – use if';", hint: 'Assume max = a, then compare with b and c.' },
  ] },
 switch: { title: 'The switch statement',
  theory: `<p>When we compare one value with many constants, <code>switch</code> is more convenient than many <code>if</code>s:</p>
<pre>switch (day)
{
    case 1:
        Console.WriteLine("Monday");
        break;
    case 6:
    case 7:
        Console.WriteLine("Weekend!");
        break;
    default:
        Console.WriteLine("Another day");
        break;
}</pre>
<p>Every <code>case</code> section must end with <code>break</code> (or <code>return</code>/<code>throw</code>). C# does <b>not allow</b> “falling through” to the next case – it is compile error CS0163. Several labels over one block (like <code>case 6: case 7:</code>) are fine. <code>default</code> handles all other values.</p>
<p><code>switch</code> works with numbers, characters, strings and enumerations.</p>`,
  more: `<p>Modern C# also has the <b>switch expression</b>, which returns a value right away:</p><pre>string name = day switch
{
    1 =&gt; "Monday",
    6 or 7 =&gt; "Weekend",
    &gt; 7 =&gt; "Error",
    _ =&gt; "Another day"
};</pre><p><code>_</code> means “any other value”.</p>`,
  ex: [
   { code: c`string dish = "pasta";
switch (dish)
{
    case "pasta":
        Console.WriteLine("Kapi cooks for 10 minutes 🍝");
        break;
    case "pizza":
        Console.WriteLine("Kapi bakes for 15 minutes 🍕");
        break;
    default:
        Console.WriteLine("Kapi doesn't know this recipe");
        break;
}`, scene: { res: 'Kapi cooks for 10 minutes 🍝' }, cap: 'switch jumps straight to the matching case label. break ends the whole statement.' },
   { code: c`int day = 6;
string name = day switch
{
    1 => "Monday",
    5 => "Friday",
    6 or 7 => "Weekend 🏖️",
    _ => "An ordinary day"
};
Console.WriteLine(name);`, scene: { items: [['1 =>', '"Monday"'], ['5 =>', '"Friday"'], ['6 or 7 =>', '"Weekend 🏖️"', 'match!'], ['_ =>', '"An ordinary day"']] }, cap: 'A switch expression works like a vending machine: it matches the value to a pattern and returns the result immediately.' },
  ],
  tasks: [
   { q: 'What will the program print?', code: c`int n = 2;
switch (n)
{
    case 1: Console.WriteLine("one"); break;
    case 2: Console.WriteLine("two"); break;
    default: Console.WriteLine("many"); break;
}`, opts: ['two', 'one', 'two\nmany', 'many'], why: 'Only case 2 runs, and break ends the switch.' },
   { q: 'What will the program print?', opts: ['?', 'A', 'x', 'nothing'], why: 'No case matches, so default runs.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`int grade = 5;
switch (grade)
{
    case 5:
        Console.WriteLine("very good");
    case 4:
        Console.WriteLine("good");
        break;
}`, fix: 'case 5: Console.WriteLine("very good"); break;', why: 'The case 5 section does not end with break – C# does not let it fall into case 4 (CS0163).' },
   { q: 'Fill in the gap to handle all remaining cases.', code: c`string colour = "purple";
switch (colour)
{
    case "red": Console.WriteLine("stop"); break;
    case "green": Console.WriteLine("go"); break;
    ___: Console.WriteLine("unknown"); break;
}`, expect: 'unknown', why: 'default handles values that do not match any case.' },
   { q: 'What will the program print?', code: c`int t = 28;
string s = t switch
{
    < 0 => "frost",
    < 15 => "cool",
    < 25 => "warm",
    _ => "heatwave"
};
Console.WriteLine(s);`, opts: ['heatwave', 'warm', 'cool', 'frost'], why: '28 does not meet < 0, < 15 or < 25, so it goes to _.' },
   { q: 'Read a month number (1–12) and print the season: <code>winter</code> (12, 1, 2), <code>spring</code> (3–5), <code>summer</code> (6–8), <code>autumn</code> (9–11). For any other number print <code>error</code>. Use <code>switch</code>.',
     tests: [{ i: '1', o: 'winter' }, { i: '4', o: 'spring' }, { i: '8', o: 'summer' }, { i: '10', o: 'autumn' }, { i: '12', o: 'winter' }, { i: '13', o: 'error' }], check: "if (!/switch/.test(src)) return 'Use switch';",
     sol: c`int m = int.Parse(Console.ReadLine());
switch (m)
{
    case 12: case 1: case 2: Console.WriteLine("winter"); break;
    case 3: case 4: case 5: Console.WriteLine("spring"); break;
    case 6: case 7: case 8: Console.WriteLine("summer"); break;
    case 9: case 10: case 11: Console.WriteLine("autumn"); break;
    default: Console.WriteLine("error"); break;
}`, hint: 'Several case labels can lead to one block: case 12: case 1: case 2: ...' },
  ] },
});
