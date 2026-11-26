// English translation of chapters 5–8.

Object.assign(TR.ch, {
 petle: { name: { pirate: 'Whirlpool of Loops', kitchen: 'Stirring in Loops', hero: 'Loop Training', neutral: 'Loops' }, topic: 'for, while, do-while, break, continue, nested loops',
  outcomes: 'Uses loop statements (for, while, do-while, foreach); uses break and continue; implements simple iterative algorithms.' },
 tablice: { name: { pirate: 'Treasure Chests', kitchen: 'Drawers and Strings', hero: 'Array Quarters', neutral: 'ArraysAndStrings' }, topic: 'arrays, foreach, 2D arrays, string, StringBuilder',
  outcomes: 'Uses compound data types (one- and multi-dimensional arrays) and operations on them; uses operators and methods for strings.' },
 metody: { name: { pirate: 'Method Bay', kitchen: 'Recipe Methods', hero: 'Superpower Methods', neutral: 'Methods' }, topic: 'methods, parameters, return, overloading, ref/out/params, recursion',
  outcomes: 'Splits a program into functions (methods); uses parameters and return values; uses method overloading; uses recursion.' },
 klasy: { name: { pirate: 'Class Shipyard', kitchen: 'Class Moulds', hero: 'Hero Factory', neutral: 'ClassesAndObjects' }, topic: 'classes, objects, fields, methods, constructors, encapsulation, properties, static',
  outcomes: 'Applies object-oriented principles; explains class, object, method, field, encapsulation; defines classes, fields, methods, constructors (including the copy constructor) and destructors; sets access modifiers; declares objects; defines and uses static members; distinguishes inherited and friend classes.' },
});

Object.assign(TR.les, {
 for: { title: 'The for loop',
  theory: `<p>The <code>for</code> loop repeats a block of code a given number of times:</p>
<pre>for (int i = 1; i &lt;= 5; i++)
{
    Console.WriteLine(i);
}</pre>
<p>The parentheses contain three parts separated by semicolons:</p>
<ol><li><b>initialization</b> – <code>int i = 1</code> (runs once, at the start),</li>
<li><b>condition</b> – <code>i &lt;= 5</code> (checked before every turn; when false, the loop ends),</li>
<li><b>step</b> – <code>i++</code> (runs after every turn).</li></ol>
<p>The variable <code>i</code> is the <b>loop counter</b> – it exists only inside the loop. The counter can also go down (<code>i--</code>) or change by another step (<code>i += 2</code>).</p>`,
  more: `<p>A typical pattern – <b>summing</b>: before the loop <code>int sum = 0;</code>, inside <code>sum += i;</code>. The <b>counting</b> pattern: <code>if (condition) count++;</code>. Watch out for the <b>off-by-one error</b>: <code>i &lt; 5</code> gives 5 turns from 0 to 4, while <code>i &lt;= 5</code> gives 6 turns from 0 to 5.</p>`,
  ex: [
   { code: c`for (int i = 1; i <= 5; i++)
{
    Console.WriteLine($"Kapi eats orange no. {i} 🍊");
}`, cap: 'Kapi walks over the successive values of the counter i and eats one orange at each.' },
   { code: c`int sum = 0;
for (int i = 1; i <= 4; i++)
{
    sum += i;
}
Console.WriteLine($"Sum 1..4 = {sum}");
for (int k = 10; k > 0; k -= 3) Console.Write(k + " ");`, scene: { acc: 'sum' }, cap: 'The accumulator sum grows with every turn: 1, 3, 6, 10. This is the classic summing pattern.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'i takes 0, 1, 2. At i = 3 the condition i < 3 is false.' },
   { q: 'How many times will the loop run?', code: c`for (int i = 1; i <= 10; i++)
{
    Console.WriteLine("Squeak!");
}`, why: 'i from 1 to 10 inclusive gives 10 turns.' },
   { q: 'What will the program print?', why: '10, 6, 2 – the next value −2 does not meet i >= 0.' },
   { q: 'Complete the loop so that it prints the numbers 1 to 5.', why: 'To include 5, the condition must be i <= 5.' },
   { q: 'The program should compute the sum of 1 to 5, which is 15. But it prints 10. Click the line with the bug.', code: c`int sum = 0;
for (int i = 1; i < 5; i++)
{
    sum += i;
}
Console.WriteLine(sum);`, why: 'i < 5 skips 5 – the classic off-by-one error.' },
   { q: 'Read a number <code>n</code> and print the 7 times table for 1..n as <code>1 x 7 = 7</code> (each on a new line).', hint: 'for (int i = 1; i <= n; i++) and interpolation $"{i} x 7 = {i * 7}".' },
   { q: 'Read <code>n</code> and print the <b>factorial</b> n! (the product 1·2·…·n). For n = 0 the result is 1. Use the <code>long</code> type (n ≤ 20).', sol: c`int n = int.Parse(Console.ReadLine());
long result = 1;
for (int i = 2; i <= n; i++) result *= i;
Console.WriteLine(result);`, hint: 'Start with long result = 1 and multiply result *= i in the loop.' },
  ] },
 while: { title: 'while and do-while loops',
  theory: `<p>The <code>while</code> loop repeats a block <b>as long as</b> the condition is true. We use it when we do not know in advance how many repetitions there will be:</p>
<pre>while (energy &gt; 0)
{
    energy -= 30;
}</pre>
<p>The condition is checked <b>before</b> every turn – if it is false from the start, the loop does not run at all.</p>
<p>The <code>do { ... } while (condition);</code> loop checks the condition <b>after</b> a turn, so it runs <b>at least once</b>. Useful e.g. when asking the user until they give valid data. Mind the semicolon after <code>while (...)</code>!</p>
<p>⚠️ If the condition never becomes false, you get an <b>infinite loop</b>.</p>`,
  ex: [
   { code: c`int energy = 100;
int swims = 0;
while (energy > 0)
{
    energy -= 30;
    swims++;
    Console.WriteLine($"Swim {swims}, energy: {energy}");
}
Console.WriteLine("Kapi goes to sleep 😴");`, cap: 'Kapi swims as long as he has energy. Each swim takes 30 – after the fourth one energy drops below zero and the loop ends.' },
   { code: c`int number;
int tries = 0;
do
{
    number = int.Parse(Console.ReadLine());
    tries++;
} while (number < 1 || number > 10);
Console.WriteLine($"Good! {number} after {tries} tries");`, cap: 'do-while asks at least once and repeats the question until the number falls in the range 1–10.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: '1 → 3 → 9 → 27. At 27 the condition x < 20 is false.' },
   { q: 'How many times will “Hey” be printed?', code: c`int n = 5;
while (n < 3)
{
    Console.WriteLine("Hey");
}`, opts: ['0', '1', '3', 'infinitely many'], why: 'The condition 5 < 3 is false from the start – while does not run even once.' },
   { q: 'What will the program print?', opts: ['5', '(nothing is printed)', '56', '345'], why: 'do-while runs at least once, then the condition 6 < 3 ends the loop.' },
   { q: 'The loop never ends (the program runs too long). Click the line that has to be fixed.', why: 'The counter decreases, so i < 5 is always true. You must increase it: i++.' },
   { q: 'Read a natural number and print the <b>sum of its digits</b>. E.g. for 4096: 19. Use a <code>while</code> loop and the <code>%</code> and <code>/</code> operators.', check: "if (!/while/.test(src)) return 'Use a while loop';", sol: c`int n = int.Parse(Console.ReadLine());
int sum = 0;
while (n > 0)
{
    sum += n % 10;
    n /= 10;
}
Console.WriteLine(sum);`, hint: 'n % 10 is the last digit, and n /= 10 removes it.' },
   { q: 'Read whole numbers (each on its own line) until you get <code>0</code>. Print their sum (without the zero) and how many positive numbers were read, as <code>sum=S positive=P</code>.', start: '// Your code\n', tests: [{ i: '5\n-2\n7\n0', o: 'sum=10 positive=2' }, { i: '0', o: 'sum=0 positive=0' }, { i: '1\n1\n1\n0\n9', o: 'sum=3 positive=3' }],
     sol: c`int sum = 0, positive = 0;
int x = int.Parse(Console.ReadLine());
while (x != 0)
{
    sum += x;
    if (x > 0) positive++;
    x = int.Parse(Console.ReadLine());
}
Console.WriteLine($"sum={sum} positive={positive}");`, hint: 'Read the first number before the loop and the next ones at the end of each turn.' },
  ] },
 breakcont: { title: 'break, continue and nested loops',
  theory: `<p><code>break</code> immediately <b>stops</b> the whole loop. <code>continue</code> <b>skips the rest of the current turn</b> and moves on to the next one.</p>
<p><b>Nested loops</b> are a loop inside a loop. The inner one runs completely during every turn of the outer one – that is how you build a multiplication table or draw shapes from asterisks:</p>
<pre>for (int r = 1; r &lt;= 3; r++)
{
    for (int c = 1; c &lt;= 4; c++)
        Console.Write("*");
    Console.WriteLine();
}</pre>
<p><code>break</code> in a nested loop stops only the <b>nearest</b> (inner) loop.</p>`,
  ex: [
   { cap: 'Kapi jumps over numbers divisible by 3 (continue) and ends his walk at 8 (break).' },
   { code: c`for (int r = 1; r <= 4; r++)
{
    for (int c = 1; c <= r; c++)
    {
        Console.Write("🍊");
    }
    Console.WriteLine();
}`, cap: 'The outer loop is the rows, the inner one – the oranges in a row. Row number r has r oranges.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'At i == 3 the loop is stopped before printing.' },
   { q: 'What will the program print?', why: 'continue skips only the turn with i == 3.' },
   { q: 'How many asterisks will the program print?', why: 'The inner loop (4 turns) runs 3 times: 3 · 4 = 12.' },
   { q: 'What will the program print?', why: 'break stops only the inner loop – the outer one keeps going.' },
   { q: 'Read <code>n</code> and draw an n×n square of <code>#</code> characters (n lines of n characters).', sol: c`int n = int.Parse(Console.ReadLine());
for (int r = 0; r < n; r++)
{
    for (int c = 0; c < n; c++) Console.Write("#");
    Console.WriteLine();
}`, hint: 'A loop in a loop: the outer one for rows, the inner one for characters in a row.' },
   { q: 'Read <code>n</code> and print all numbers from 1 to n divisible by 3 or 5, separated by spaces. But when the sum of printed numbers exceeds 50, stop (the number that exceeded the sum is still printed).', sol: c`int n = int.Parse(Console.ReadLine());
int sum = 0;
string result = "";
for (int i = 1; i <= n; i++)
{
    if (i % 3 != 0 && i % 5 != 0) continue;
    result += (result == "" ? "" : " ") + i;
    sum += i;
    if (sum > 50) break;
}
Console.WriteLine(result);`, hint: 'continue for numbers that do not match; break when sum > 50.' },
  ] },
 tablice1: { title: 'Arrays and foreach',
  theory: `<p>An <b>array</b> stores many values of the same type under one name. Its size is fixed.</p>
<pre>int[] points = new int[5];          // 5 zeros
string[] names = { "Kapi", "Ola", "Ala" };</pre>
<p>Elements are accessed by <b>index</b> in square brackets. Indexes start at <b>0</b>, so the last element has index <code>Length - 1</code>. Accessing outside the range throws <code>IndexOutOfRangeException</code>.</p>
<p><code>array.Length</code> is the number of elements. We traverse an array with <code>for</code> (when we need the index) or <code>foreach</code> (when values are enough):</p>
<pre>foreach (string name in names)
    Console.WriteLine(name);</pre>`,
  more: `<p>Useful methods: <code>Array.Sort(t)</code> – sorting, <code>Array.Reverse(t)</code> – reversing, <code>Array.IndexOf(t, x)</code> – the position of an element (−1 if missing), <code>string.Join(", ", t)</code> – joining elements into text. A <code>foreach</code> variable is read-only – you cannot assign a new value to it.</p>`,
  ex: [
   { code: c`string[] fruit = { "orange", "watermelon", "apple", "melon" };
Console.WriteLine($"Fruit count: {fruit.Length}");
Console.WriteLine($"First: {fruit[0]}, last: {fruit[fruit.Length - 1]}");
fruit[2] = "banana";
foreach (string f in fruit)
{
    Console.Write(f + " ");
}`, scene: { items: ['orange', 'watermelon', 'banana', 'melon'], label: 'fruit[2] = "banana"' }, cap: "Kapi's chests are numbered from 0. fruit[2] is the third chest – Kapi puts a banana in it." },
   { code: c`int[] numbers = { 7, 3, 9, 1, 5 };
int sum = 0;
int max = numbers[0];
for (int i = 0; i < numbers.Length; i++)
{
    sum += numbers[i];
    if (numbers[i] > max) max = numbers[i];
}
Console.WriteLine($"Sum: {sum}, max: {max}");
Array.Sort(numbers);
Console.WriteLine(string.Join(", ", numbers));`, cap: 'Kapi walks along the array and remembers the largest number so far. That is the find-the-maximum pattern.' },
  ],
  tasks: [
   { q: 'What will the program print?', opts: ['20', '10', '30', 'An error'], why: 'Indexes start at 0, so t[1] is the second element.' },
   { q: 'Which exception will the program throw?', opts: ['IndexOutOfRangeException', 'NullReferenceException', 'FormatException', 'The program works'], why: 'A 3-element array has indexes 0, 1, 2.' },
   { q: 'What will the program print?', why: 'A new int array is filled with zeros; we change only the element at index 1.' },
   { q: 'Fill in the gap to print all elements of the array.', code: c`string[] names = { "Kapi", "Ola" };
foreach (string n ___ names)
{
    Console.WriteLine(n);
}`, why: 'Syntax: foreach (type name in collection).' },
   { q: 'The program stops with an exception. Click the line with the bug.', why: 'At i == t.Length we go outside the array. The condition must be i < t.Length.' },
   { q: 'The first line contains a number <code>n</code>, the next ones n whole numbers. Read them into an array and print the <b>average</b> with 2 decimal places (<code>F2</code>).', sol: c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
for (int i = 0; i < n; i++) t[i] = int.Parse(Console.ReadLine());
int sum = 0;
foreach (int x in t) sum += x;
Console.WriteLine($"{(double)sum / n:F2}");`, hint: 'Remember (double) when dividing.' },
   { q: 'Read <code>n</code> and n numbers. Print the numbers in <b>reverse order</b>, separated by spaces, and in the second line – how many of them are greater than the average.', sol: c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
double sum = 0;
for (int i = 0; i < n; i++) { t[i] = int.Parse(Console.ReadLine()); sum += t[i]; }
double avg = sum / n;
string s = "";
for (int i = n - 1; i >= 0; i--) s += t[i] + (i > 0 ? " " : "");
Console.WriteLine(s);
int count = 0;
foreach (int x in t) if (x > avg) count++;
Console.WriteLine(count);`, hint: 'A loop from n - 1 down to 0 prints the array from the end.' },
  ] },
 tablice2: { title: 'Two-dimensional and jagged arrays',
  theory: `<p>A <b>two-dimensional array</b> (rectangular) is like a table with rows and columns:</p>
<pre>int[,] board = new int[3, 4];   // 3 rows, 4 columns
board[1, 2] = 7;</pre>
<p>The size in each dimension is given by <code>GetLength(0)</code> (rows) and <code>GetLength(1)</code> (columns), and <code>Length</code> is the number of all cells. Initialization: <code>int[,] m = { {1, 2}, {3, 4} };</code>.</p>
<p>A <b>jagged array</b> is an array of arrays – every row can have a different length:</p>
<pre>int[][] t = new int[3][];
t[0] = new int[] { 1 };
t[1] = new int[] { 1, 2, 3 };</pre>`,
  ex: [
   { code: c`int[,] map = new int[3, 4];
map[1, 2] = 7;
map[2, 0] = 1;
for (int r = 0; r < map.GetLength(0); r++)
{
    for (int c = 0; c < map.GetLength(1); c++)
    {
        Console.Write(map[r, c] + " ");
    }
    Console.WriteLine();
}
Console.WriteLine($"Cells: {map.Length}");`, cap: "Kapi's treasure map has 3 rows and 4 columns. The outer loop goes over rows, the inner one – over columns." },
   { code: c`int[][] stairs = new int[4][];
for (int i = 0; i < stairs.Length; i++)
{
    stairs[i] = new int[i + 1];
    for (int j = 0; j <= i; j++) stairs[i][j] = j + 1;
}
foreach (int[] row in stairs)
{
    Console.WriteLine(string.Join(" ", row));
}`, cap: 'In a jagged array every row has a different length – like steps Kapi climbs.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'Row 1 (the second), column 0 (the first) is 4.' },
   { q: 'What will the program print?', why: 'GetLength(0) – rows, GetLength(1) – columns, Length – all cells.' },
   { q: 'Complete the declaration of a 2×2 array.', why: 'A two-dimensional array is declared with the type int[,].' },
   { q: 'What will the program print?', why: 'The first row has 3 elements, the second 1: 4 in total.' },
   { q: 'Read <code>n</code> and print an n×n multiplication table. Separate numbers in a row with a space. First store the results in an <code>int[,]</code> array.', check: "if (!/\\[,\\]/.test(src)) return 'Use an int[,] array';", sol: c`int n = int.Parse(Console.ReadLine());
int[,] t = new int[n, n];
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        t[i, j] = (i + 1) * (j + 1);
for (int i = 0; i < n; i++)
{
    string row = "";
    for (int j = 0; j < n; j++) row += t[i, j] + (j < n - 1 ? " " : "");
    Console.WriteLine(row);
}` },
  ] },
 stringi: { title: 'String types: string and StringBuilder',
  theory: `<p><code>string</code> is a sequence of characters. The most important properties and methods:</p>
<ul><li><code>s.Length</code> – length, <code>s[0]</code> – first character (type <code>char</code>),</li>
<li><code>ToUpper()</code>, <code>ToLower()</code>, <code>Trim()</code> (removes spaces at the edges),</li>
<li><code>Substring(start, length)</code>, <code>IndexOf("x")</code>, <code>Contains("x")</code>, <code>StartsWith</code>, <code>EndsWith</code>,</li>
<li><code>Replace("a", "b")</code>, <code>Split(' ')</code> – splits text into an array, <code>string.Join</code> – joins it back,</li>
<li>comparison: <code>==</code> (case-sensitive).</li></ul>
<p>Strings are <b>immutable</b>: methods do not change the text, they return a new one. <code>s.ToUpper();</code> without assignment does nothing – you have to write <code>s = s.ToUpper();</code>.</p>`,
  more: `<p>When joining a lot of text in a loop, <code>StringBuilder</code> (namespace <code>System.Text</code>) is better: <code>var sb = new StringBuilder(); sb.Append("Kapi"); sb.AppendLine("!"); string result = sb.ToString();</code>. It does not create a new text with every append.</p>`,
  ex: [
   { code: c`string text = "  Kapi loves oranges  ";
string t = text.Trim();
Console.WriteLine($"[{t}] has {t.Length} characters");
Console.WriteLine(t.ToUpper());
Console.WriteLine(t.Substring(5, 5));
Console.WriteLine(t.Replace("oranges", "watermelons"));
Console.WriteLine(t.Contains("loves") + " " + t.IndexOf("loves"));
string[] words = t.Split(' ');
Console.WriteLine($"Words: {words.Length}, first letter: {t[0]}");`, scene: { items: ['K', 'a', 'p', 'i', ' ', 'l', 'o', 'v', 'e', 's'], hl: [5, 10], label: 't.Substring(5, 5) → "loves"' }, cap: 'Text is a row of characters numbered from 0. Substring(5, 5) cuts out 5 characters starting at position 5.' },
   { code: c`using System.Text;

var sb = new StringBuilder();
for (int i = 1; i <= 5; i++)
{
    sb.Append(i);
    if (i < 5) sb.Append(" -> ");
}
sb.AppendLine();
sb.Append("The end!");
Console.WriteLine(sb.ToString());
string name = "kapi";
string nice = char.ToUpper(name[0]) + name.Substring(1);
Console.WriteLine(nice);`, cap: "StringBuilder is Kapi's notebook: it keeps appending new pieces instead of rewriting everything each time." },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'The text has 9 characters; the character at index 4 is the fifth one – P.' },
   { q: 'What will the program print?', opts: ['kapi', 'KAPI', 'Kapi', 'An error'], why: 'string is immutable – the result of ToUpper() was not assigned to s.' },
   { q: 'What will the program print?', code: c`string s = "watermelon";
Console.WriteLine(s.Substring(2, 3));
Console.WriteLine(s.IndexOf('r'));`, opts: ['ter\n4', 'ate\n4', 'ter\n5', 'erm\n3'], why: 'Three characters from index 2: t, e, r. The letter r has index 4.' },
   { q: 'Fill in the gap to split the sentence into words and print their count.', code: c`string sentence = "Kapi swims in the river";
string[] words = sentence.___(' ');
Console.WriteLine(words.Length);`, expect: '5', why: 'Split divides the text at the given character.' },
   { q: 'The program stops with an exception. Click the line with the bug.', why: 'From index 2 only 2 characters are left, but we ask for 5 (ArgumentOutOfRangeException).' },
   { q: 'Read a sentence and print how many letters <code>a</code> (lower- and upper-case) it contains.', tests: [{ i: 'A cat and a bat', o: '5' }, { i: 'Kapi', o: '1' }, { i: 'xyz', o: '0' }], sol: c`string s = Console.ReadLine();
int count = 0;
foreach (char ch in s.ToLower())
{
    if (ch == 'a') count++;
}
Console.WriteLine(count);`, hint: "foreach (char ch in s.ToLower()) and compare with 'a'." },
   { q: 'Read a word and print <code>YES</code> if it is a <b>palindrome</b> (reads the same backwards, ignoring case), otherwise <code>NO</code>.', tests: [{ i: 'Kayak', o: 'YES' }, { i: 'kapi', o: 'NO' }, { i: 'a', o: 'YES' }], sol: c`string s = Console.ReadLine().ToLower();
bool ok = true;
for (int i = 0; i < s.Length / 2; i++)
{
    if (s[i] != s[s.Length - 1 - i]) ok = false;
}
Console.WriteLine(ok ? "YES" : "NO");`, hint: 'Compare s[i] with s[s.Length - 1 - i].' },
  ] },
 metody1: { title: 'Functions and methods',
  theory: `<p>A <b>method</b> (function) is a named piece of code that can be called many times. Methods make a program shorter and easier to read.</p>
<pre>static int Square(int x)
{
    return x * x;
}</pre>
<ul><li><code>int</code> before the name is the <b>return type</b>. When a method returns nothing – <code>void</code>.</li>
<li><code>(int x)</code> – <b>parameters</b>, the method’s input data.</li>
<li><code>return</code> ends the method and returns a value.</li></ul>
<p>A call: <code>int w = Square(5);</code>. The value <code>5</code> is an <b>argument</b>.</p>
<p>In a program with top-level statements we can write methods below the main code. In the classic template we write them in the <code>Program</code> class next to <code>Main</code> – then they must be <code>static</code>.</p>`,
  more: `<p>Variables declared in a method are <b>local variables</b> – they exist only while it runs. A method cannot see other methods’ local variables, so data is passed in parameters and results via <code>return</code>. A method that returns a value must have a <code>return</code> on every path (otherwise CS0161).</p>`,
  ex: [
   { code: c`static int Square(int x)
{
    return x * x;
}

static void Greet(string name)
{
    Console.WriteLine($"Ahoy, {name}!");
}

Greet("Kapi");
Greet("Ola");
int w = Square(7);
Console.WriteLine($"7 squared = {w}");
Console.WriteLine(Square(3) + Square(4));`, scene: { name: 'Square(x)' }, cap: "A method works like Kapi's machine: you drop in an argument, the gears turn, and the result (return) comes out the other side." },
   { code: c`class Program
{
    static double Average(int a, int b, int c)
    {
        return (a + b + c) / 3.0;
    }

    static bool Passed(double average)
    {
        return average >= 3.0;
    }

    static void Main()
    {
        double s = Average(4, 3, 2);
        Console.WriteLine($"Average: {s:F2}");
        Console.WriteLine(Passed(s) ? "Passed!" : "Retake");
    }
}`, scene: { name: 'Average(a, b, c)' }, cap: 'The same machine in the classic template: static methods in the Program class, called from Main.' },
  ],
  tasks: [
   { q: 'What will the program print?', code: c`static int Add(int a, int b)
{
    return a + b;
}
Console.WriteLine(Add(2, 3) * 2);`, why: 'Add(2, 3) returns 5, and 5 · 2 = 10.' },
   { q: 'What is the return type of a method that returns nothing?', why: 'void means “no return value”.' },
   { q: 'What will the program print?', code: c`static void Change(int x)
{
    x = 100;
}
int a = 5;
Change(a);
Console.WriteLine(a);`, opts: ['5', '100', '105', 'An error'], why: 'An int parameter gets a copy of the value – changing x does not change a.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`static int Bigger(int a, int b)
{
    if (a > b)
    {
        return a;
    }
}
Console.WriteLine(Bigger(3, 8));`, fix: 'return b;   // add before the last brace of the method', why: 'When a <= b, the method returns nothing. Every path needs a return (CS0161).' },
   { q: 'Complete the method so that it returns the number doubled.', code: c`static int Double(int x)
{
    ___ x * 2;
}
Console.WriteLine(Double(21));`, why: 'A value is returned with the return keyword.' },
   { q: 'Write a method <code>static bool IsEven(int n)</code> and use it: read a number and print <code>True</code>/<code>False</code>.', start: '// Your code\nint n = int.Parse(Console.ReadLine());\n', check: "if (!/bool\\s+IsEven\\s*\\(\\s*int/.test(src)) return 'Write the method bool IsEven(int n)';", sol: c`static bool IsEven(int n)
{
    return n % 2 == 0;
}
int n = int.Parse(Console.ReadLine());
Console.WriteLine(IsEven(n));` },
   { q: 'Write a method <code>static int Power(int b, int exponent)</code> that computes a power <b>with a loop</b> (without Math.Pow). Read two numbers and print the result.', start: '// Your code\n', check: "if (/Math\\.Pow/.test(src)) return 'No Math.Pow – use a loop';", sol: c`static int Power(int b, int exponent)
{
    int result = 1;
    for (int i = 0; i < exponent; i++) result *= b;
    return result;
}
int a = int.Parse(Console.ReadLine());
int e = int.Parse(Console.ReadLine());
Console.WriteLine(Power(a, e));`, hint: 'result = 1, then multiply result *= b exponent times.' },
  ] },
 przeciazanie: { title: 'Method overloading',
  theory: `<p><b>Overloading</b> means creating several methods with the <b>same name</b> but <b>different parameters</b> (a different number or different types). The compiler picks the right version based on the arguments:</p>
<pre>static int Add(int a, int b) =&gt; a + b;
static double Add(double a, double b) =&gt; a + b;
static int Add(int a, int b, int c) =&gt; a + b + c;</pre>
<p>That is how <code>Console.WriteLine</code> works – it has versions for <code>int</code>, <code>string</code>, <code>double</code> and many more types.</p>
<p>Note: methods <b>cannot</b> differ only by return type. Overloading works for methods in a <b>class</b> (local functions in top-level statements cannot be overloaded).</p>`,
  more: `<p>The <code>=&gt; expression</code> form is an <b>expression-bodied method</b> – a shortcut for <code>{ return expression; }</code>.</p>`,
  ex: [
   { code: c`Console.WriteLine(Calculator.Add(2, 3));
Console.WriteLine(Calculator.Add(2.5, 3.1));
Console.WriteLine(Calculator.Add(1, 2, 3));
Console.WriteLine(Calculator.Add("Kapi", "Pasta"));

class Calculator
{
    public static int Add(int a, int b) => a + b;
    public static double Add(double a, double b) => a + b;
    public static int Add(int a, int b, int c) => a + b + c;
    public static string Add(string a, string b) => a + b;
}`, scene: { items: [['Add(2, 3)', '5', '(int, int)'], ['Add(2.5, 3.1)', '5.6', '(double, double)'], ['Add(1, 2, 3)', '6', '(int, int, int)'], ['Add("Kapi", "Pasta")', '"KapiPasta"', '(string, string)']] }, cap: 'Kapi has four recipes with the same name. He knows which one to use by looking at the ingredients (argument types).' },
  ],
  tasks: [
   { q: 'What is method overloading?', opts: ['Several methods with the same name and different parameters', 'A method that calls itself', 'A method with very long code', 'A method without parameters'], why: 'The compiler tells overloads apart by the number and types of parameters.' },
   { q: 'What will the program print?', opts: ['int\ndouble\nstring', 'int\nint\nint', 'double\ndouble\nstring', 'A compile error'], why: 'The version that exactly matches the argument type is chosen.' },
   { q: 'What will the program print?', opts: ['long', 'double', 'A compile error', 'int'], why: 'int converts implicitly to both long and double, but the conversion to long is “better” (closer).' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`Console.WriteLine(M.Area(3));
class M
{
    public static int Area(int a) => a * a;
    public static double Area(int a) => a * a;
}`, fix: 'public static double Area(double a) => a * a;', why: 'The methods differ only by return type – not allowed (CS0111).' },
   { q: 'In a <code>Geometry</code> class write two <code>Area</code> methods: <code>Area(double r)</code> – the area of a circle (<code>Math.PI * r * r</code>) and <code>Area(double a, double b)</code> – the area of a rectangle. The program prints <code>Geometry.Area(1)</code> and <code>Geometry.Area(2, 3)</code> with format F2.',
     start: 'Console.WriteLine($"{Geometry.Area(1):F2}");\nConsole.WriteLine($"{Geometry.Area(2, 3):F2}");\n\nclass Geometry\n{\n}\n', sol: c`Console.WriteLine($"{Geometry.Area(1):F2}");
Console.WriteLine($"{Geometry.Area(2, 3):F2}");

class Geometry
{
    public static double Area(double r) => Math.PI * r * r;
    public static double Area(double a, double b) => a * b;
}`, hint: 'Two public static double Area(...) methods with a different number of parameters.' },
  ] },
 refout: { title: 'ref, out, params and default parameters',
  theory: `<p>By default, arguments of simple types are passed <b>by value</b> – the method gets a copy. Other options:</p>
<ul><li><code>ref</code> – passing <b>by reference</b>: the method works on the original variable. <code>ref</code> is written both in the definition and in the call: <code>Swap(ref a, ref b);</code></li>
<li><code>out</code> – an <b>output</b> parameter: the method must assign it. That is how <code>int.TryParse(s, out int n)</code> works.</li>
<li><code>params int[] numbers</code> – any number of arguments: <code>Sum(1, 2, 3, 4)</code>.</li>
<li><b>default parameter</b>: <code>void Greet(string name = "Kapi")</code> – you can call <code>Greet()</code>.</li></ul>`,
  ex: [
   { code: c`static void Swap(ref int a, ref int b)
{
    int tmp = a;
    a = b;
    b = tmp;
}
static void MinMax(int[] t, out int min, out int max)
{
    min = t[0]; max = t[0];
    foreach (int x in t) { if (x < min) min = x; if (x > max) max = x; }
}
static int Sum(params int[] numbers)
{
    int s = 0;
    foreach (int x in numbers) s += x;
    return s;
}
static void Greet(string name = "Kapi") => Console.WriteLine($"Hi, {name}!");

int x = 1, y = 2;
Swap(ref x, ref y);
Console.WriteLine($"x={x}, y={y}");
MinMax(new[] { 5, 2, 9 }, out int mn, out int mx);
Console.WriteLine($"min={mn}, max={mx}");
Console.WriteLine(Sum(1, 2, 3, 4));
Greet();
Greet("Ola");`, scene: { fn: 'Swap(ref a, ref b)' }, cap: 'With ref the method does not get a copy, but a key to the original drawers x and y – that is why the swap is visible after returning.' },
  ],
  tasks: [
   { q: 'What will the program print?', code: c`static void Add10(ref int x) { x += 10; }
int a = 5;
Add10(ref a);
Console.WriteLine(a);`, opts: ['15', '5', '10', 'An error'], why: 'ref passes the original variable – the change is visible.' },
   { q: 'What will the program print?', code: c`static int Count(params int[] t) => t.Length;
Console.WriteLine(Count() + Count(7, 7, 7));`, opts: ['3', '0', '21', 'A compile error'], why: 'Count() gets an empty array (0), Count(7, 7, 7) – 3 elements.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`static void Double(ref int x) { x *= 2; }
int n = 4;
Double(n);
Console.WriteLine(n);`, fix: 'Double(ref n);', why: 'An argument for a ref parameter must be passed with the ref keyword (CS1620).' },
   { q: 'Complete the TryParse call.', code: c`string s = "123";
if (int.TryParse(s, ___ int number))
{
    Console.WriteLine(number + 1);
}`, why: 'TryParse returns the result through an out parameter.' },
   { q: 'Write a method <code>static void Divide(int a, int b, out int quotient, out int remainder)</code>. Read a and b, call the method and print <code>quotient remainder</code>.', start: '// Your code\n', check: "if (!/out\\s+int\\s+quotient/.test(src)) return 'Use out parameters';", sol: c`static void Divide(int a, int b, out int quotient, out int remainder)
{
    quotient = a / b;
    remainder = a % b;
}
int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
Divide(a, b, out int q, out int r);
Console.WriteLine($"{q} {r}");`, hint: 'In the method assign quotient = a / b; remainder = a % b;' },
  ] },
 rekurencja: { title: 'Recursion',
  theory: `<p><b>Recursion</b> is when a method calls <b>itself</b>. Every recursive function needs:</p>
<ol><li>a <b>stop condition</b> (base case), e.g. <code>if (n &lt;= 1) return 1;</code>,</li>
<li>a <b>recursive call</b> for a “smaller” problem, e.g. <code>return n * Factorial(n - 1);</code>.</li></ol>
<p>Every call goes onto the <b>call stack</b>. When the stop condition is missing, the stack overflows and the program ends with <code>StackOverflowException</code>.</p>
<p>Classic examples: factorial, the Fibonacci sequence, GCD (Euclid’s algorithm), the Towers of Hanoi.</p>`,
  more: `<p>Recursive Fibonacci <code>F(n) = F(n−1) + F(n−2)</code> computes the same values many times and is very slow for large n. The loop (iterative) version is much faster – recursion is elegant, but not always best.</p>`,
  ex: [
   { code: c`static long Factorial(int n)
{
    if (n <= 1) return 1;            // stop condition
    return n * Factorial(n - 1);     // recursive call
}
Console.WriteLine(Factorial(4));
Console.WriteLine(Factorial(20));`, scene: { frames: ['Factorial(4)', 'Factorial(3)', 'Factorial(2)', 'Factorial(1)'] }, cap: 'Kapi goes down deeper and deeper (4, 3, 2, 1). At 1 he stops and climbs back up, multiplying the results: 1 → 2 → 6 → 24.' },
   { code: c`static int Gcd(int a, int b)
{
    if (b == 0) return a;
    return Gcd(b, a % b);
}
static int Fib(int n) => n < 2 ? n : Fib(n - 1) + Fib(n - 2);
Console.WriteLine(Gcd(48, 18));
for (int i = 0; i <= 10; i++) Console.Write(Fib(i) + " ");`, scene: { frames: ['Gcd(48, 18)', 'Gcd(18, 12)', 'Gcd(12, 6)', 'Gcd(6, 0)'] }, cap: "Euclid's algorithm: Gcd(a, b) = Gcd(b, a % b), until b becomes zero." },
  ],
  tasks: [
   { q: 'What is essential in every recursive method?', opts: ['A stop condition', 'A for loop', 'A string parameter', 'The static keyword'], why: 'Without a stop condition recursion never ends.' },
   { q: 'What will the program print?', why: '4 + 3 + 2 + 1 + 0 = 10.' },
   { q: 'What will the program print?', code: c`static void Countdown(int n)
{
    if (n == 0) return;
    Console.Write(n);
    Countdown(n - 1);
}
Countdown(3);`, why: 'First it prints, then it calls itself for n - 1.' },
   { q: 'The program ends with a stack overflow. Click the line that has to be fixed.', code: c`static int Sum(int n)
{
    return n + Sum(n - 1);
}
Console.WriteLine(Sum(5));`, fix: 'return n <= 0 ? 0 : n + Sum(n - 1);', why: 'The stop condition is missing – the method calls itself forever (StackOverflowException).' },
   { q: 'Write a recursive method <code>static int Power(int a, int n)</code>: a⁰ = 1, aⁿ = a · aⁿ⁻¹. Read a and n, print the result.', start: '// Your code\n', check: "if (!/Power\\s*\\([^)]*\\)[\\s\\S]*Power\\s*\\(/.test(src.replace(/^.*Console[^\\n]*$/m,''))) return 'The Power method should call itself';", sol: c`static int Power(int a, int n)
{
    if (n == 0) return 1;
    return a * Power(a, n - 1);
}
int a = int.Parse(Console.ReadLine());
int n = int.Parse(Console.ReadLine());
Console.WriteLine(Power(a, n));`, hint: 'if (n == 0) return 1; return a * Power(a, n - 1);' },
   { q: 'Write a recursive method <code>static string Reverse(string s)</code> that reverses text (empty text → empty). Read a word and print it reversed.', start: '// Your code\n', sol: c`static string Reverse(string s)
{
    if (s.Length <= 1) return s;
    return Reverse(s.Substring(1)) + s[0];
}
Console.WriteLine(Reverse(Console.ReadLine()));`, hint: 'Reversed text = Reverse(the rest) + the first character.' },
  ] },
 klasy1: { title: 'Classes and objects',
  theory: `<p>A <b>class</b> is a template (recipe, blueprint), and an <b>object</b> is a concrete instance created from that template. The class “Capybara” describes what every capybara has and can do, and objects are concrete capybaras: Kapi, Ola, Bob.</p>
<pre>class Capybara
{
    public string Name;            // field
    public int Age;                // field
    public void Introduce()        // method
    {
        Console.WriteLine($"I'm {Name}, I'm {Age}");
    }
}</pre>
<p><b>Fields</b> hold an object’s data (its state), and <b>methods</b> describe its behaviour. We create an object with <code>new</code>, and access members with a dot:</p>
<pre>Capybara k = new Capybara();
k.Name = "Kapi";
k.Introduce();</pre>
<p>Every object has its <b>own</b> field values. Classes (reference types) store a <b>reference</b> to the object in a variable – two variables can point to the same object.</p>`,
  more: `<p>Object-oriented programming rests on four pillars: <b>abstraction</b> (describing only what matters), <b>encapsulation</b> (hiding data), <b>inheritance</b> (derived classes) and <b>polymorphism</b> (one call – different behaviours). The next lessons cover them one by one. When splitting a problem into classes, look for <i>nouns</i> (Ship, Pirate, Treasure) – class candidates – and <i>verbs</i> (sails, digs) – method candidates.</p>`,
  ex: [
   { code: c`Capybara a = new Capybara();
a.Name = "Kapi";
a.Age = 4;
Capybara b = new Capybara();
b.Name = "Ola";
b.Age = 2;
a.Introduce();
b.Introduce();
b.Birthday();
b.Introduce();

class Capybara
{
    public string Name;
    public int Age;

    public void Introduce()
    {
        Console.WriteLine($"I'm {Name}, I'm {Age} years old");
    }

    public void Birthday()
    {
        Age++;
        Console.WriteLine($"🎂 Happy birthday, {Name}!");
    }
}`, scene: { cls: { name: 'Capybara', fields: ['string Name', 'int Age'], methods: ['Introduce()', 'Birthday()'] }, objs: [{ name: 'a', vals: ['Name = "Kapi"', 'Age = 4'] }, { name: 'b', vals: ['Name = "Ola"', 'Age = 3'] }] }, cap: 'The class is a blue blueprint, and new builds objects from it. Each object has its own Name and Age.' },
   { code: c`Ship s1 = new Ship();
s1.Name = "Black Pearl";
Ship s2 = s1;
s2.Name = "Golden Capybara";
Console.WriteLine(s1.Name);
Console.WriteLine(s1 == s2);

class Ship
{
    public string Name;
}`, scene: { c: 'Ship "Golden Capybara"' }, cap: 'The variables s1 and s2 are two labels on the same ship. A change through s2 is visible through s1.' },
  ],
  tasks: [
   { q: 'What is an object?', opts: ['A concrete instance of a class', 'A template describing fields and methods', 'Another name for a method', 'A simple type like int'], why: 'A class is a template, an object is an instance created with new.' },
   { q: 'What will the program print?', code: c`Dog d = new Dog();
d.Name = "Rex";
d.Bark();

class Dog
{
    public string Name;
    public void Bark() => Console.WriteLine(Name + ": Woof!");
}`, opts: ['Rex: Woof!', 'Name: Woof!', ': Woof!', 'An error'], why: 'The method uses the Name field of this object.' },
   { q: 'What will the program print?', code: c`Counter a = new Counter();
Counter b = a;
a.Value = 5;
b.Value += 1;
Console.WriteLine(a.Value);

class Counter { public int Value; }`, why: 'a and b point to the same object.' },
   { q: 'Complete the creation of an object.', code: c`Cat k = ___ Cat();
k.Name = "Tom";
Console.WriteLine(k.Name);

class Cat { public string Name; }`, expect: 'Tom', why: 'Objects are created with the new operator.' },
   { q: 'The program stops with an exception. Click the line with the bug.', code: c`Capybara k = null;
k.Name = "Kapi";
Console.WriteLine(k.Name);

class Capybara { public string Name; }`, fix: 'Capybara k = new Capybara();', why: 'The variable does not point to any object (null) – new is missing (NullReferenceException).' },
   { q: 'In the <code>Rectangle</code> class add fields <code>public double A, B;</code> and methods <code>Area()</code> and <code>Perimeter()</code> returning double. The program already creates an object and prints the results.',
     start: 'Rectangle p = new Rectangle();\np.A = 3; p.B = 4.5;\nConsole.WriteLine($"{p.Area()} {p.Perimeter()}");\n\nclass Rectangle\n{\n}\n', sol: c`Rectangle p = new Rectangle();
p.A = 3; p.B = 4.5;
Console.WriteLine($"{p.Area()} {p.Perimeter()}");

class Rectangle
{
    public double A, B;
    public double Area() => A * B;
    public double Perimeter() => 2 * (A + B);
}`, hint: 'public double Area() => A * B;' },
  ] },
 konstruktory: { title: 'Constructors and destructor',
  theory: `<p>A <b>constructor</b> is a special method called automatically when an object is created (<code>new</code>). It has <b>the same name as the class</b> and <b>no return type</b>. It sets the initial values of fields:</p>
<pre>public Capybara(string name, int age)
{
    Name = name;
    Age = age;
}</pre>
<p>Constructors can be <b>overloaded</b>. One constructor can call another with <code>: this(...)</code>. If you write no constructor, the compiler adds an empty <b>default constructor</b>. But once you write a constructor with parameters, the default one disappears.</p>
<p>The keyword <code>this</code> means “this object” – handy when a parameter has the same name as a field: <code>this.name = name;</code>.</p>
<p>A <b>copy constructor</b> creates an object as a copy of another: <code>public Capybara(Capybara other) : this(other.Name, other.Age) { }</code>.</p>
<p>A <b>destructor</b> (in C# – a finalizer) <code>~Capybara() { }</code> is called by the <b>garbage collector</b> when the object is no longer needed. We do not know exactly when, so it is rarely used in C# (releasing resources is done with <code>IDisposable</code> and <code>using</code>).</p>`,
  ex: [
   { code: c`Capybara a = new Capybara("Kapi", 4);
Capybara b = new Capybara("Ola");
Capybara c = new Capybara(a);
c.Name = "Kapi II";
Console.WriteLine(a);
Console.WriteLine(b);
Console.WriteLine(c);

class Capybara
{
    public string Name;
    public int Age;

    public Capybara(string name, int age)
    {
        Name = name;
        Age = age;
        Console.WriteLine($"🐣 {name} is born");
    }

    public Capybara(string name) : this(name, 0) { }

    public Capybara(Capybara other) : this(other.Name, other.Age) { }

    ~Capybara() { }

    public override string ToString() => $"{Name} ({Age} y.)";
}`, scene: { cls: { name: 'Capybara', fields: ['string Name', 'int Age'], methods: ['Capybara(name, age)', 'Capybara(name) : this(name, 0)', 'Capybara(Capybara other)', '~Capybara()'] } }, cap: 'Every new runs a constructor. The copy constructor makes a new object with another one’s data, so changing c does not change a.' },
  ],
  tasks: [
   { q: 'What is the name of the constructor of the <code>Ship</code> class?', code: undefined, opts: ['Ship', 'Constructor', 'New', 'Init'], why: 'A constructor has the same name as the class.' },
   { q: 'What will the program print?', code: c`Pirate p = new Pirate("Kapi");
Console.WriteLine(p.Name);

class Pirate
{
    public string Name;
    public Pirate(string name) { Name = "Captain " + name; }
}`, opts: ['Captain Kapi', 'Kapi', 'Captain', 'An error'], why: 'The constructor sets the field to "Captain " + name.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`Dish d = new Dish();
Console.WriteLine(d.Name);

class Dish
{
    public string Name;
    public Dish(string name) { Name = name; }
}`, fix: 'Dish d = new Dish("Pasta");', why: 'The class only has a constructor with a parameter – the default (parameterless) one does not exist (CS7036).' },
   { q: 'What will the program print?', why: ': this(v, v * 2) calls the constructor with two parameters.' },
   { q: 'When is a destructor (finalizer) <code>~Class()</code> called in C#?', opts: ['When the garbage collector frees the object – at an unknown moment', 'Right after leaving the block where the object was created', 'At every assignment of null', 'Never, C# has no destructors'], why: 'Memory in .NET is managed by the garbage collector, so the moment a finalizer runs is unpredictable.' },
   { q: 'Complete the constructor where the parameter has the same name as the field.', code: c`Capybara k = new Capybara("Kapi");
Console.WriteLine(k.Get());

class Capybara
{
    private string name;
    public Capybara(string name) { ___.name = name; }
    public string Get() => name;
}`, why: 'this.name is the object’s field, and name is the parameter.' },
   { q: 'In the <code>Treasure</code> class add a constructor <code>Treasure(string name, int value)</code> and a copy constructor <code>Treasure(Treasure other)</code>.', start: 'Treasure a = new Treasure("Gold", 100);\nTreasure b = new Treasure(a);\nb.Value *= 2;\nConsole.WriteLine($"{a.Name} {a.Value} | {b.Name} {b.Value}");\n\nclass Treasure\n{\n    public string Name;\n    public int Value;\n}\n', tests: [{ i: '', o: 'Gold 100 | Gold 200' }],
     sol: c`Treasure a = new Treasure("Gold", 100);
Treasure b = new Treasure(a);
b.Value *= 2;
Console.WriteLine($"{a.Name} {a.Value} | {b.Name} {b.Value}");

class Treasure
{
    public string Name;
    public int Value;
    public Treasure(string name, int value) { Name = name; Value = value; }
    public Treasure(Treasure other) : this(other.Name, other.Value) { }
}`, hint: 'The copy constructor can call the other one: : this(other.Name, other.Value).' },
  ] },
 hermetyzacja: { title: 'Access modifiers, encapsulation, properties',
  theory: `<p><b>Access modifiers</b> decide who can see a class member:</p>
<ul><li><code>public</code> – everyone,</li><li><code>private</code> – only this class (the default for class members),</li><li><code>protected</code> – this class and derived classes,</li><li><code>internal</code> – the whole project (assembly).</li></ul>
<p><b>Encapsulation</b> means hiding fields (<code>private</code>) and exposing them only through controlled methods or <b>properties</b>. That way an object guards the correctness of its data – e.g. an account balance cannot be negative.</p>
<p>A <b>property</b> looks like a field from outside, but has <code>get</code> and <code>set</code> accessors:</p>
<pre>private int age;
public int Age
{
    get { return age; }
    set { if (value &gt;= 0) age = value; }
}</pre>
<p><code>value</code> is the value being assigned. A shortcut – an <b>auto-property</b>: <code>public string Name { get; set; }</code>. Read-only from outside: <code>{ get; private set; }</code>.</p>`,
  ex: [
   { code: c`Account k = new Account("Kapi");
k.Deposit(100);
k.Withdraw(30);
k.Withdraw(500);
Console.WriteLine($"{k.Owner}: {k.Balance} coins");

class Account
{
    public string Owner { get; }
    public decimal Balance { get; private set; }

    public Account(string owner) { Owner = owner; }

    public void Deposit(decimal amount)
    {
        if (amount > 0) Balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount > Balance)
        {
            Console.WriteLine("❌ Not enough coins in the chest!");
            return;
        }
        Balance -= amount;
    }
}`, scene: { fn: 'Account (private)', glob: [['Deposit()', 'public'], ['Withdraw()', 'public'], ['Balance get', 'public']], loc: [['Balance set', 'private'], ['balance', '70']] }, cap: "Kapi's chest has a lock: from outside you can only deposit and withdraw through public methods, and the balance changes only inside." },
   { code: c`Student u = new Student();
u.Name = "Ola";
u.Grade = 7;
Console.WriteLine($"{u.Name}: {u.Grade}");
u.Grade = 5;
Console.WriteLine($"{u.Name}: {u.Grade}, note: {u.Note}");

class Student
{
    private int grade = 1;
    public string Name { get; set; } = "";
    public int Grade
    {
        get => grade;
        set
        {
            if (value >= 1 && value <= 6) grade = value;
            else Console.WriteLine($"Grade {value} is out of the scale!");
        }
    }
    public string Note => grade >= 5 ? "great" : "good";
}`, scene: { yes: 'grade = value', no: 'error message' }, cap: 'The setter works like a guard: it lets through only grades 1–6. The Note property has only get – it is computed on the fly.' },
  ],
  tasks: [
   { q: 'Which modifier makes a member visible <b>only inside its class</b>?', why: 'private limits access to the class where the member is declared.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`Chest s = new Chest();
s.gold = 1000;
Console.WriteLine(s.Count());

class Chest
{
    private int gold = 10;
    public int Count() => gold;
}`, fix: 's.Add(1000);   // a public method in the class is needed', why: 'The gold field is private – it cannot be used outside the class (CS0122).' },
   { q: 'What will the program print?', code: c`Thermometer t = new Thermometer();
t.Degrees = -500;
t.Degrees = 25;
Console.WriteLine(t.Degrees);

class Thermometer
{
    private int d;
    public int Degrees
    {
        get { return d; }
        set { if (value > -273) d = value; }
    }
}`, why: 'The setter rejected −500 and accepted 25.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`Player g = new Player();
g.Points = 999;
Console.WriteLine(g.Points);

class Player
{
    public int Points { get; private set; }
}`, fix: 'g.AddPoints(999);   // changes only through the class methods', why: 'The setter is private, so from outside you can only read Points (CS0272).' },
   { q: 'Complete the property so that it accepts only positive values.', code: c`Box p = new Box();
p.Weight = -3;
p.Weight = 4;
Console.WriteLine(p.Weight);

class Box
{
    private int weight;
    public int Weight
    {
        get { return weight; }
        set { if (___ > 0) weight = ___; }
    }
}`, why: 'Inside a setter the new value is called value.' },
   { q: 'Write a <code>Ship</code> class with a private field <code>fuel</code> (int, starting at 100), a read-only property <code>Fuel</code> and a method <code>bool Sail(int km)</code>: every km uses 2 units. If there is not enough fuel, the method returns false and changes nothing.', start: 'Ship s = new Ship();\nConsole.WriteLine(s.Sail(30));\nConsole.WriteLine(s.Sail(30));\nConsole.WriteLine(s.Fuel);\n',
     check: "if (!/private\\s+int\\s+fuel/.test(src)) return 'The fuel field must be private';", sol: c`Ship s = new Ship();
Console.WriteLine(s.Sail(30));
Console.WriteLine(s.Sail(30));
Console.WriteLine(s.Fuel);

class Ship
{
    private int fuel = 100;
    public int Fuel => fuel;
    public bool Sail(int km)
    {
        if (km * 2 > fuel) return false;
        fuel -= km * 2;
        return true;
    }
}`, hint: 'public int Fuel => fuel; and the condition km * 2 > fuel.' },
  ] },
 statyczne: { title: 'Static members and friend classes',
  theory: `<p>A <code>static</code> member belongs to the <b>class</b>, not to a specific object – there is one copy shared by all objects. It is accessed through the class name: <code>Capybara.Count</code>, <code>Math.Sqrt(9)</code>.</p>
<ul><li><b>static field</b> – e.g. a counter of created objects,</li>
<li><b>static method</b> – has no access to object fields (there is no <code>this</code>), sees only static members,</li>
<li><b>static class</b> (<code>static class</code>) – contains only static members, you cannot create its objects (like <code>Math</code> or <code>Console</code>).</li></ul>
<p><b>Friend classes</b> (<code>friend</code> functions) may be familiar from C++: classes or functions that can access another class’s private members. <b>C# has no <code>friend</code> keyword.</b> A similar effect is given by the <code>internal</code> modifier (access within the whole project) and <b>nested classes</b> – a class defined inside another one can see its private members. Unlike inheritance, “friendship” does not create an “is a kind of” relationship.</p>`,
  ex: [
   { code: c`Pirate a = new Pirate("Kapi");
Pirate b = new Pirate("Ola");
Pirate c = new Pirate("Bob");
Console.WriteLine($"Pirates on board: {Pirate.Count}");
Tools.Square(12);
Console.WriteLine(Tools.Square(12));
Vault s = new Vault();
Vault.Inspector.Check(s);

class Pirate
{
    public static int Count = 0;
    public string Name;
    public Pirate(string name) { Name = name; Count++; }
}

static class Tools
{
    public static int Square(int x) => x * x;
}

class Vault
{
    private int gold = 777;
    public class Inspector
    {
        public static void Check(Vault s) => Console.WriteLine($"The inspector can see the private gold: {s.gold}");
    }
}`, scene: { fn: 'Pirate objects', glob: [['Pirate.Count', '3']], loc: [['a.Name', '"Kapi"'], ['b.Name', '"Ola"'], ['c.Name', '"Bob"']] }, cap: 'The static field Count is one, shared by the whole crew. Every pirate has his own Name.' },
  ],
  tasks: [
   { q: 'How do you call the static method <code>Calc</code> of the <code>Calculator</code> class?', opts: ['Calculator.Calc()', 'new Calculator.Calc()', 'Calc.Calculator()', 'this.Calc()'], why: 'Static members are accessed through the class name.' },
   { q: 'What will the program print?', code: c`new Ball(); new Ball(); new Ball();
Console.WriteLine(Ball.Count);

class Ball
{
    public static int Count;
    public Ball() { Count++; }
}`, opts: ['3', '1', '0', 'An error'], why: 'A static field is shared – every constructor increases the same counter.' },
   { q: 'The compiler reports an error. Click the line that has to be fixed.', code: c`class Program
{
    int counter = 0;
    static void Main()
    {
        counter++;
        Console.WriteLine(counter);
    }
}`, fix: 'static int counter = 0;', why: 'The static Main method cannot see object fields – the compiler reports CS0120 where counter is used, but the cause is the missing static in the field declaration.' },
   { q: 'Does C# have a <code>friend</code> keyword (like C++)?', opts: ['No – internal or a nested class gives a similar effect', 'Yes, it works like in C++', 'Yes, but only for structs', 'Yes, it replaces private'], why: 'C# has no friend. A nested class can see the private members of its outer class, and internal opens access within the project.' },
   { q: 'What will happen?', code: c`Tools n = new Tools();

static class Tools
{
    public static int Two() => 2;
}`, opts: ['A compile error', 'It creates an object', 'It prints 2', 'A runtime exception'], why: 'You cannot create objects of a static class (CS0712).' },
   { q: 'In the <code>Ticket</code> class add a static field <code>nextNumber</code> (starting at 1) and in the constructor give every ticket the next <code>Number</code>.', start: 'Ticket a = new Ticket(), b = new Ticket(), c = new Ticket();\nConsole.WriteLine($"{a.Number} {b.Number} {c.Number}");\n\nclass Ticket\n{\n    public int Number;\n}\n',
     check: "if (!/static/.test(src)) return 'Use a static field';", sol: c`Ticket a = new Ticket(), b = new Ticket(), c = new Ticket();
Console.WriteLine($"{a.Number} {b.Number} {c.Number}");

class Ticket
{
    private static int nextNumber = 1;
    public int Number;
    public Ticket() { Number = nextNumber++; }
}`, hint: 'Number = nextNumber++;' },
  ] },
});
