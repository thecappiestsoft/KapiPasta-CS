// English translation of chapters 9–12.

Object.assign(TR.ch, {
 dziedziczenie: { name: { pirate: 'House of Pirates', kitchen: 'Family of Recipes', hero: 'Legacy of Powers', neutral: 'Inheritance' }, topic: 'inheritance, base, protected, virtual/override, polymorphism, abstract, interfaces',
  outcomes: 'Defines base and derived classes; builds an inheritance hierarchy; places methods and fields in the right classes of the hierarchy; uses virtual methods; defines abstract classes; plans an application using encapsulation, inheritance and polymorphism.' },
 typy2: { name: { pirate: 'Collection Hold', kitchen: 'Ingredient Pantry', hero: 'Team Equipment', neutral: 'EnumStructCollections' }, topic: 'enum, struct, List, Dictionary, Queue, Stack, HashSet, LINQ',
  outcomes: 'Declares custom data types (enumerations, structures); uses compound types and operations on them; uses a library of basic algorithms and collections.' },
 wyjatki: { name: { pirate: 'Stormy Exceptions', kitchen: 'Burnt Exceptions', hero: 'Emergency Mission', neutral: 'ExceptionsAndFiles' }, topic: 'try, catch, finally, throw, custom exceptions, files',
  outcomes: 'Programs exception handling; uses the try-catch skeleton and the throw statement; prepares a list of possible runtime errors and defines how to handle them; works with text files.' },
 algorytmy: { name: { pirate: 'Algorithm Map', kitchen: 'Cooking Techniques', hero: 'Hero Strategies', neutral: 'Algorithms' }, topic: 'searching, sorting, prime numbers, algorithm libraries',
  outcomes: 'Implements algorithms in a program; uses the standard library, the math library and a library of basic algorithms.' },
});

Object.assign(TR.les, {
 dziedzicz: { title: 'Inheritance',
  theory: `<p><b>Inheritance</b> lets you create a new class (<b>derived</b>) based on an existing one (<b>base</b>). The derived class gets the fields and methods of the base and can add its own:</p>
<pre>class Animal
{
    public string Name;
    public void Eat() =&gt; Console.WriteLine($"{Name} eats");
}
class Capybara : Animal      // Capybara inherits from Animal
{
    public void Swim() =&gt; Console.WriteLine($"{Name} swims");
}</pre>
<p>Inheritance is an “<b>is a kind of</b>” relationship: a Capybara <i>is</i> an Animal. In C# a class can have <b>only one</b> base class (all of them ultimately inherit from <code>object</code>).</p>
<p>A derived class constructor calls the base constructor with <code>: base(...)</code>. <code>protected</code> members are visible in derived classes but not outside.</p>
<p>Common fields and methods go <b>as high as possible</b> in the hierarchy (in the base class), and specific ones – in derived classes.</p>`,
  more: `<p>A class marked <code>sealed</code> cannot be inherited (CS0509). Constructors run “from the top”: first the base one, then the derived one.</p>`,
  ex: [
   { code: c`Capybara k = new Capybara("Kapi");
k.Eat();
k.Swim();
Dog p = new Dog("Rex");
p.Eat();
p.Fetch();

class Animal
{
    public string Name;
    protected int hunger = 5;
    public Animal(string name)
    {
        Name = name;
        Console.WriteLine($"[Animal] creating {name}");
    }
    public void Eat()
    {
        hunger--;
        Console.WriteLine($"{Name} eats (hunger: {hunger})");
    }
}

class Capybara : Animal
{
    public Capybara(string name) : base(name) { Console.WriteLine("[Capybara] ready!"); }
    public void Swim() => Console.WriteLine($"{Name} swims 💦");
}

class Dog : Animal
{
    public Dog(string name) : base(name) { }
    public void Fetch() => Console.WriteLine($"{Name} brings a stick (hunger: {hunger})");
}`, scene: { base: { name: 'Animal', members: ['Name', '# hunger', 'Eat()'] }, kids: [{ name: 'Capybara', members: ['Swim()'], says: 'I swim!' }, { name: 'Dog', members: ['Fetch()'], says: 'woof!' }] }, cap: 'Capybara and Dog inherit Name and Eat() from Animal, and each adds its own skill. The protected field (#) is seen only by classes in the family.' },
  ],
  tasks: [
   { q: 'How do you write that the class <code>Pirate</code> inherits from <code>Sailor</code>?', opts: ['class Pirate : Sailor', 'class Pirate extends Sailor', 'class Pirate inherits Sailor', 'class Sailor : Pirate'], why: 'In C# you write a colon and the base class after the class name.' },
   { q: 'What will the program print?', code: c`Cat k = new Cat();
k.Name = "Tom";
k.Introduce();

class Animal
{
    public string Name;
    public void Introduce() => Console.WriteLine("I am " + Name);
}
class Cat : Animal { }`, opts: ['I am Tom', 'I am', 'Error – Cat has no Introduce method', 'I am Cat'], why: 'Cat inherits the Name field and the Introduce method.' },
   { q: 'What will the program print?', why: 'The base class constructor runs first.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`Pirate p = new Pirate("Kapi");
Console.WriteLine(p.Name);

class Sailor
{
    public string Name;
    public Sailor(string name) { Name = name; }
}
class Pirate : Sailor
{
    public Pirate(string name) { }
}`, fix: 'public Pirate(string name) : base(name) { }', why: 'Sailor has no parameterless constructor – you must call : base(name) explicitly (CS7036).' },
   { q: 'Complete the call to the base class constructor.', code: c`Cook k = new Cook("Kapi");
Console.WriteLine(k.Name);

class Person
{
    public string Name;
    public Person(string name) { Name = name; }
}
class Cook : Person
{
    public Cook(string name) : ___(name) { }
}`, why: ': base(...) calls the base class constructor.' },
   { q: 'What will happen?', code: c`class Ship { protected int cannons = 10; }
class Frigate : Ship { public int Count() => cannons; }
class Port { public int Check(Ship o) => o.cannons; }`, opts: ['A compile error in the Port class', 'Everything compiles', 'An error in the Frigate class', 'A runtime exception'], why: 'protected is visible only to derived classes. Port does not inherit from Ship (CS1061/CS0122).' },
   { q: 'Add a class <code>Superhero</code> inheriting from <code>Person</code>, with an extra field <code>Power</code> (string), a constructor <code>(string name, string power)</code> and a method <code>Show()</code> printing <code>NAME has the power: POWER</code>.',
     start: 'Superhero s = new Superhero("Kapi", "super swimming");\ns.Show();\n\nclass Person\n{\n    public string Name;\n    public Person(string name) { Name = name; }\n}\n', tests: [{ i: '', o: 'Kapi has the power: super swimming' }], check: "if (!/class\\s+Superhero\\s*:\\s*Person/.test(src)) return 'Superhero should inherit from Person';",
     sol: c`Superhero s = new Superhero("Kapi", "super swimming");
s.Show();

class Person
{
    public string Name;
    public Person(string name) { Name = name; }
}
class Superhero : Person
{
    public string Power;
    public Superhero(string name, string power) : base(name) { Power = power; }
    public void Show() => Console.WriteLine($"{Name} has the power: {Power}");
}`, hint: 'class Superhero : Person and the constructor : base(name).' },
  ] },
 polimorfizm: { title: 'Polymorphism: virtual and override',
  theory: `<p><b>Polymorphism</b> (“many forms”) means that the same method call can behave differently depending on the actual type of the object.</p>
<p>A method in the base class is marked <code>virtual</code>, and in the derived class we override it with <code>override</code>:</p>
<pre>class Animal { public virtual string Voice() =&gt; "..."; }
class Cat : Animal { public override string Voice() =&gt; "Meow"; }</pre>
<p>Thanks to that, a variable of the base type can hold objects of different derived classes, and calling <code>z.Voice()</code> runs the version that belongs to the object. This lets you keep different objects in one array or list and handle them with a single loop.</p>
<p>Inside an overriding method you can call the base version: <code>base.Voice()</code>.</p>
<p>We often override the <code>ToString()</code> method of the <code>object</code> class – then <code>Console.WriteLine(obj)</code> prints our description.</p>`,
  more: `<p>Without <code>virtual</code>/<code>override</code>, a method with the same name in a derived class only <b>hides</b> the base method (the <code>new</code> keyword). Then the <b>variable type</b> decides, not the object type – usually not what we want. The <code>is</code> and <code>as</code> operators check an object’s type: <code>if (z is Cat k) k.Purr();</code>.</p>`,
  ex: [
   { code: c`Animal[] zoo = { new Capybara(), new Cat(), new Dog(), new Animal() };
foreach (Animal z in zoo)
{
    Console.WriteLine($"{z.GetType().Name}: {z.Voice()}");
}

class Animal
{
    public virtual string Voice() => "...";
}
class Capybara : Animal
{
    public override string Voice() => "Squeak! 🐹";
}
class Cat : Animal
{
    public override string Voice() => "Meow";
}
class Dog : Animal
{
    public override string Voice() => "Woof, " + base.Voice();
}`, scene: { base: { name: 'Animal', members: ['virtual Voice()'] }, kids: [{ name: 'Capybara', members: ['override Voice()'], says: 'Squeak!' }, { name: 'Cat', members: ['override Voice()'], says: 'Meow' }, { name: 'Dog', members: ['override Voice()'], says: 'Woof, ...' }] }, cap: 'One loop, one call z.Voice() – and every animal answers in its own way. That is polymorphism.' },
   { code: c`Hero b = new Captain();
Console.WriteLine(b.Attack());
Console.WriteLine(b.Shout());
Console.WriteLine(b);
if (b is Captain k) Console.WriteLine(k.Order());

class Hero
{
    public virtual string Attack() => "punch";
    public string Shout() => "To battle!";
    public override string ToString() => "Hero";
}
class Captain : Hero
{
    public override string Attack() => "super punch";
    public new string Shout() => "Follow me, crew!";
    public string Order() => "Full speed ahead!";
    public override string ToString() => "Captain Kapi";
}`, scene: { cond: 'b is Captain?', yes: "override → Captain's version", no: "new → Hero's version (by variable type)" }, cap: "override listens to the real object type, while new (hiding) – to the variable type. That is why Shout() prints the Hero's text." },
  ],
  tasks: [
   { q: 'What will the program print?', code: c`Shape f = new Circle();
Console.WriteLine(f.Name());

class Shape { public virtual string Name() => "shape"; }
class Circle : Shape { public override string Name() => "circle"; }`, opts: ['circle', 'shape', 'An error', 'Circle'], why: 'The method is virtual – the version of the actual object (Circle) runs.' },
   { q: 'What will the program print?', why: 'F is overridden (override) → B. G is hidden (new) → the variable type A decides → a.' },
   { q: 'The compiler reports an error. Click the line that has to be fixed.', code: c`Bird p = new Penguin();
Console.WriteLine(p.Fly());

class Bird { public string Fly() => "flying"; }
class Penguin : Bird { public override string Fly() => "I can't fly"; }`, fix: 'class Bird { public virtual string Fly() => "flying"; }', why: 'You can only override a virtual, abstract or override method (CS0506). The fix: add virtual in the Bird class.' },
   { q: 'Complete it so that objects print nicely in Console.WriteLine.', code: c`Dish d = new Dish();
Console.WriteLine(d);

class Dish
{
    public ___ string ToString() => "Spaghetti à la Kapi";
}`, why: 'ToString is a virtual method of the object class – we override it with override.' },
   { q: 'What will the program print?', why: '2 + 4 + 4 = 10. base.Nogi() returns 2.' },
   { q: 'Add the classes <code>Pizza</code> and <code>Pasta</code> inheriting from <code>Dish</code> that override <code>Time()</code>: pizza 15, pasta 10. The program sums up the preparation time.',
     start: 'Dish[] menu = { new Pizza(), new Pasta(), new Pasta() };\nint sum = 0;\nforeach (Dish d in menu) sum += d.Time();\nConsole.WriteLine($"Total: {sum} min");\n\nclass Dish\n{\n    public virtual int Time() => 5;\n}\n', tests: [{ i: '', o: 'Total: 35 min' }], check: "if ((src.match(/override/g)||[]).length < 2) return 'Use override in both classes';",
     sol: c`Dish[] menu = { new Pizza(), new Pasta(), new Pasta() };
int sum = 0;
foreach (Dish d in menu) sum += d.Time();
Console.WriteLine($"Total: {sum} min");

class Dish
{
    public virtual int Time() => 5;
}
class Pizza : Dish { public override int Time() => 15; }
class Pasta : Dish { public override int Time() => 10; }`, hint: 'class Pizza : Dish { public override int Time() => 15; }' },
  ] },
 abstrakcja: { title: 'Abstract classes and methods',
  theory: `<p>An <b>abstract class</b> (<code>abstract class</code>) is an “unfinished” class – you cannot create its objects, it only serves as a base for derived classes. It can contain ordinary fields and methods as well as <b>abstract methods</b>.</p>
<p>An <b>abstract method</b> has no body – it is only a declaration: <code>public abstract double Area();</code>. Every (non-abstract) derived class <b>must</b> override it with <code>override</code> – otherwise error CS0534.</p>
<p>Example: there is no “shape in general”, but every shape has an area. So the <code>Shape</code> class is abstract, and <code>Circle</code> and <code>Square</code> are concrete.</p>`,
  ex: [
   { code: c`List<Shape> shapes = new List<Shape> { new Circle(1), new Square(2), new Circle(0.5) };
foreach (Shape f in shapes)
{
    f.Describe();
}

abstract class Shape
{
    public abstract string Name { get; }
    public abstract double Area();
    public void Describe() => Console.WriteLine($"{Name}: area = {Area():F2}");
}
class Circle : Shape
{
    private double r;
    public Circle(double r) { this.r = r; }
    public override string Name => "Circle";
    public override double Area() => Math.PI * r * r;
}
class Square : Shape
{
    private double a;
    public Square(double a) { this.a = a; }
    public override string Name => "Square";
    public override double Area() => a * a;
}`, scene: { base: { name: 'abstract Shape', members: ['abstract Area()', 'Describe()'] }, kids: [{ name: 'Circle', members: ['override Area()'], says: 'πr²' }, { name: 'Square', members: ['override Area()'], says: 'a²' }] }, cap: 'Shape is only a plan: it says “every shape has Area()”, but the formula is given by a concrete class.' },
  ],
  tasks: [
   { q: 'Can you create an object of an abstract class with <code>new</code>?', opts: ['No', 'Yes, always', 'Yes, if it has no abstract methods', 'Only in the Main method'], why: 'An abstract class only serves as a base (CS0144).' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`Vehicle p = new Vehicle();
Console.WriteLine(p.Wheels());

abstract class Vehicle
{
    public abstract int Wheels();
}`, fix: 'Vehicle p = new Bike();   // a derived class is needed', why: 'You cannot create objects of an abstract class (CS0144) – create an object of a derived class.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`Animal z = new Capybara();
Console.WriteLine(z.Voice());

abstract class Animal
{
    public abstract string Voice();
}
class Capybara : Animal
{
    public string Food() => "grass";
}`, fix: 'public override string Voice() => "Squeak";   // add in the Capybara class', why: 'Capybara does not override the abstract method Voice() (CS0534).' },
   { q: 'What will the program print?', code: c`Character p = new Warrior();
p.Introduce();

abstract class Character
{
    protected abstract string Kind();
    public void Introduce() => Console.WriteLine("I am: " + Kind());
}
class Warrior : Character
{
    protected override string Kind() => "a warrior";
}`, opts: ['I am: a warrior', 'I am: ', 'A compile error', 'I am: Character'], why: 'The ordinary Introduce method in the abstract class calls the abstract Kind(), supplied by Warrior.' },
   { q: 'Complete the declaration of the abstract method.', code: c`Square k = new Square();
Console.WriteLine(k.Perimeter());

abstract class Shape
{
    public ___ double Perimeter();
}
class Square : Shape
{
    public override double Perimeter() => 4 * 2.5;
}`, why: 'A method without a body in an abstract class is an abstract method.' },
   { q: 'Add an abstract class <code>Employee</code> with a field <code>Name</code>, a constructor and an abstract method <code>decimal Salary()</code>, and the classes <code>Cook</code> (salary 5000) and <code>Waiter</code> (3000 + tips given in the constructor).',
     start: 'Employee[] team = { new Cook("Kapi"), new Waiter("Ola", 450) };\ndecimal sum = 0;\nforeach (var p in team) { Console.WriteLine($"{p.Name}: {p.Salary()}"); sum += p.Salary(); }\nConsole.WriteLine($"Total: {sum}");\n', tests: [{ i: '', o: 'Kapi: 5000\nOla: 3450\nTotal: 8450' }], check: "if (!/abstract\\s+class\\s+Employee/.test(src)) return 'Employee should be an abstract class';",
     sol: c`Employee[] team = { new Cook("Kapi"), new Waiter("Ola", 450) };
decimal sum = 0;
foreach (var p in team) { Console.WriteLine($"{p.Name}: {p.Salary()}"); sum += p.Salary(); }
Console.WriteLine($"Total: {sum}");

abstract class Employee
{
    public string Name;
    public Employee(string name) { Name = name; }
    public abstract decimal Salary();
}
class Cook : Employee
{
    public Cook(string name) : base(name) { }
    public override decimal Salary() => 5000;
}
class Waiter : Employee
{
    private decimal tips;
    public Waiter(string name, decimal tips) : base(name) { this.tips = tips; }
    public override decimal Salary() => 3000 + tips;
}`, hint: 'abstract class Employee { ... public abstract decimal Salary(); }' },
  ] },
 interfejsy: { title: 'Interfaces',
  theory: `<p>An <b>interface</b> is a “contract”: a list of methods and properties that a class <b>promises</b> to implement. An interface has no fields and (usually) no method code. Interface names start with the letter <b>I</b>:</p>
<pre>interface ISwimmer
{
    void Swim();
}
class Capybara : Animal, ISwimmer
{
    public void Swim() =&gt; Console.WriteLine("I'm swimming!");
}</pre>
<p>A class can inherit from <b>one</b> class but implement <b>many</b> interfaces. Thanks to that, different, unrelated classes (Capybara, Ship, Duck) can share the skill <code>ISwimmer</code>.</p>
<p>A variable of an interface type can hold an object of any class that implements it – that is polymorphism too.</p>`,
  more: `<p>Abstract class or interface? An <b>abstract class</b> – when the classes are related and share code or fields (“is a kind of”). An <b>interface</b> – when we describe a skill that completely different classes can have (“can do”). Popular .NET interfaces: <code>IComparable</code> (comparison – used by sorting), <code>IDisposable</code> (releasing resources, <code>using</code>).</p>`,
  ex: [
   { code: c`List<ISwimmer> fleet = new List<ISwimmer> { new Capybara(), new Ship("Pearl"), new Duck() };
foreach (ISwimmer p in fleet)
{
    p.Swim();
}
Console.WriteLine(new Duck() is IFlyer);

interface ISwimmer { void Swim(); }
interface IFlyer { void Fly(); }

class Capybara : ISwimmer
{
    public void Swim() => Console.WriteLine("The capybara doggy-paddles 🐹");
}
class Ship : ISwimmer
{
    public string Name { get; }
    public Ship(string name) { Name = name; }
    public void Swim() => Console.WriteLine($"The ship {Name} sails under canvas ⛵");
}
class Duck : ISwimmer, IFlyer
{
    public void Swim() => Console.WriteLine("The duck swims 🦆");
    public void Fly() => Console.WriteLine("The duck flies");
}`, scene: { base: { name: 'interface ISwimmer', members: ['void Swim()'] }, kids: [{ name: 'Capybara', members: ['Swim()'], says: 'doggy-paddle' }, { name: 'Ship', members: ['Swim()'], says: 'under sail' }, { name: 'Duck', members: ['Swim()', 'Fly()'], says: '+ IFlyer' }] }, cap: 'A capybara, a ship and a duck are not related, but they all signed the same contract: they can Swim().' },
  ],
  tasks: [
   { q: 'How many interfaces can one class implement in C#?', opts: ['As many as needed', 'Only one', 'At most two', 'None'], why: 'A class has one base class but can implement many interfaces.' },
   { q: 'What will the program print?', code: c`IVoice g = new Capybara();
Console.WriteLine(g.Voice());

interface IVoice { string Voice(); }
class Capybara : IVoice { public string Voice() => "Squeak"; }`, opts: ['Squeak', 'IVoice', 'An error', 'Capybara'], why: 'The interface-typed variable points to a Capybara object.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`ISuperPower m = new Kapi();
m.Use();

interface ISuperPower
{
    void Use();
    string Name();
}
class Kapi : ISuperPower
{
    public void Use() => Console.WriteLine("Shock wave!");
}`, fix: 'public string Name() => "Wave";   // add in the Kapi class', why: 'The class does not implement all interface members – Name() is missing (CS0535).' },
   { q: 'When is an interface a better choice than an abstract class?', opts: ['When we describe a skill that unrelated classes can have', 'When we want shared fields', 'When the class needs a constructor', 'Never – interfaces are obsolete'], why: 'An interface says “can do”, an abstract class – “is a kind of”.' },
   { q: 'Complete the interface declaration.', code: c`IChef s = new Kapi();
Console.WriteLine(s.Cook());

___ IChef
{
    string Cook();
}
class Kapi : IChef { public string Cook() => "Pasta is ready!"; }`, expect: 'Pasta is ready!', why: 'An interface is declared with the interface keyword.' },
   { q: 'Write an interface <code>IScored</code> with a method <code>int Points()</code> and the classes <code>Coin</code> (10 pts) and <code>Chest</code> (100 pts) that implement it.',
     start: 'IScored[] loot = { new Coin(), new Coin(), new Chest() };\nint sum = 0;\nforeach (var x in loot) sum += x.Points();\nConsole.WriteLine(sum);\n',
     sol: c`IScored[] loot = { new Coin(), new Coin(), new Chest() };
int sum = 0;
foreach (var x in loot) sum += x.Points();
Console.WriteLine(sum);

interface IScored { int Points(); }
class Coin : IScored { public int Points() => 10; }
class Chest : IScored { public int Points() => 100; }`, hint: 'interface IScored { int Points(); }' },
  ] },
 enumy: { title: 'Enumerations (enum)',
  theory: `<p>An <b>enumeration</b> (<code>enum</code>) is a custom type with a limited list of named values:</p>
<pre>enum Weather { Sun, Rain, Storm, Fog }</pre>
<p>A variable of type <code>Weather</code> can have only one of those values: <code>Weather p = Weather.Rain;</code>. The code is more readable than “magic numbers” (e.g. 2 instead of <code>Storm</code>) and the compiler catches typos.</p>
<p>Underneath, each value is an integer – by default starting at 0 (<code>(int)Weather.Storm</code> → 2). You can assign your own: <code>enum Grade { Fail = 1, Pass = 2 }</code>.</p>
<p>An enum value prints as its name, and it works great with <code>switch</code>. <code>Enum.GetValues&lt;Weather&gt;()</code> returns all values.</p>`,
  ex: [
   { code: c`Weather p = Weather.Storm;
Console.WriteLine(p);
Console.WriteLine((int)p);
switch (p)
{
    case Weather.Sun: Console.WriteLine("Kapi is sunbathing ☀️"); break;
    case Weather.Storm: Console.WriteLine("Kapi hides in his burrow ⛈️"); break;
    default: Console.WriteLine("Kapi goes for a walk"); break;
}
foreach (Weather x in Enum.GetValues<Weather>())
{
    Console.Write($"{x}={(int)x} ");
}
Console.WriteLine();
Direction k = (Direction)90;
Console.WriteLine(k);

enum Weather { Sun, Rain, Storm, Fog }
enum Direction { North = 0, East = 90, South = 180, West = 270 }`, scene: { pairs: [['Sun', '0'], ['Rain', '1'], ['Storm', '2'], ['Fog', '3']], hl: 'Storm' }, cap: 'Every enum drawer has a name and a hidden number. Kapi picks a drawer by name – he does not need to remember numbers.' },
  ],
  tasks: [
   { q: 'What will the program print?', code: c`Dish d = Dish.Pasta;
Console.WriteLine(d);

enum Dish { Soup, Pasta, Dessert }`, opts: ['Pasta', '1', 'Dish.Pasta', '2'], why: 'An enum value prints as its name.' },
   { q: 'What will the program print?', code: c`Console.WriteLine((int)Rank.Captain);

enum Rank { Deckhand, Boatswain, Captain }`, opts: ['2', '3', '1', 'Captain'], why: 'Numbering starts at 0: Deckhand = 0, Boatswain = 1, Captain = 2.' },
   { q: 'What will the program print?', code: c`Level p = Level.Medium;
p++;
Console.WriteLine(p + " " + (int)p);

enum Level { Easy = 1, Medium = 5, Hard = 6 }`, opts: ['Hard 6', 'Medium 6', 'Hard 3', 'Easy 2'], why: 'Medium = 5, and 5 + 1 = 6, which is Hard.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`Colour k = Colour.Green;
int number = k;
Console.WriteLine(number);

enum Colour { Red, Green }`, fix: 'int number = (int)k;', why: 'An enum does not convert implicitly to int – you need a cast (CS0266).' },
   { q: 'The program reads a day number 0–6. Convert it to a <code>Weekday</code> value and print <code>NAME – weekend</code> or <code>NAME – working day</code>.',
     start: 'int n = int.Parse(Console.ReadLine());\n\nenum Weekday { Mon, Tue, Wed, Thu, Fri, Sat, Sun }\n', tests: [{ i: '5', o: 'Sat – weekend' }, { i: '0', o: 'Mon – working day' }, { i: '6', o: 'Sun – weekend' }],
     sol: c`int n = int.Parse(Console.ReadLine());
Weekday d = (Weekday)n;
if (d == Weekday.Sat || d == Weekday.Sun) Console.WriteLine($"{d} – weekend");
else Console.WriteLine($"{d} – working day");

enum Weekday { Mon, Tue, Wed, Thu, Fri, Sat, Sun }`, hint: 'Weekday d = (Weekday)n;' },
  ] },
 struktury: { title: 'Structures (struct)',
  theory: `<p>A <b>structure</b> (<code>struct</code>) looks similar to a class – it has fields, methods, constructors – but it is a <b>value type</b>:</p>
<ul><li>on assignment and when passed to a method <b>the whole value is copied</b> (a class copies only the reference),</li>
<li>it cannot inherit from another struct or class (it can implement interfaces),</li>
<li>it is suited to small, simple data: a point (X, Y), a colour (R, G, B), coordinates.</li></ul>
<p>The types <code>int</code>, <code>double</code>, <code>bool</code>, <code>char</code> are structs too!</p>
<pre>struct Point
{
    public int X, Y;
    public Point(int x, int y) { X = x; Y = y; }
}</pre>`,
  ex: [
   { code: c`PointS a = new PointS(1, 2);
PointS b = a;
b.X = 99;
Console.WriteLine($"struct: a=({a.X},{a.Y}) b=({b.X},{b.Y})");

PointC c = new PointC(1, 2);
PointC d = c;
d.X = 99;
Console.WriteLine($"class:  c=({c.X},{c.Y}) d=({d.X},{d.Y})");

struct PointS
{
    public int X, Y;
    public PointS(int x, int y) { X = x; Y = y; }
}
class PointC
{
    public int X, Y;
    public PointC(int x, int y) { X = x; Y = y; }
}`, cap: 'A struct is like a photocopy of a map: b gets its own copy, so a does not change. A class is like two labels on the same map.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'A struct is copied on assignment – a and b are separate values.' },
   { q: 'What will the program print (this time a class)?', why: 'For a class, a and b point to the same object.' },
   { q: 'What will the program print?', code: c`static void Move(Point p) { p.X += 10; }
Point q = new Point { X = 1 };
Move(q);
Console.WriteLine(q.X);

struct Point { public int X; }`, opts: ['1', '11', '10', 'An error'], why: 'The method gets a copy of the struct – the original does not change.' },
   { q: 'Which type is <b>not</b> a struct (value type)?', why: 'string is a reference type (although it behaves similarly thanks to immutability).' },
   { q: 'Declare a struct <code>Colour</code> with fields <code>R, G, B</code> (byte), a constructor and a <code>ToString()</code> method returning <code>#RRGGBB</code> (hex, upper case – use <code>{R:X2}</code>).',
     start: 'Colour k = new Colour(255, 128, 0);\nColour copy = k;\ncopy.B = 255;\nConsole.WriteLine(k);\nConsole.WriteLine(copy);\n', check: "if (!/struct\\s+Colour/.test(src)) return 'Colour should be a struct';",
     sol: c`Colour k = new Colour(255, 128, 0);
Colour copy = k;
copy.B = 255;
Console.WriteLine(k);
Console.WriteLine(copy);

struct Colour
{
    public byte R, G, B;
    public Colour(byte r, byte g, byte b) { R = r; G = g; B = b; }
    public override string ToString() => $"#{R:X2}{G:X2}{B:X2}";
}` },
  ] },
 kolekcje: { title: 'Collections: List, Dictionary, Queue, Stack',
  theory: `<p>Arrays have a fixed size. <b>Collections</b> from the <code>System.Collections.Generic</code> namespace can grow and shrink:</p>
<ul><li><code>List&lt;T&gt;</code> – a list: <code>Add</code>, <code>Insert</code>, <code>Remove</code>, <code>RemoveAt</code>, <code>Contains</code>, <code>Sort</code>, <code>Count</code>, index <code>list[0]</code>,</li>
<li><code>Dictionary&lt;K, V&gt;</code> – a key → value dictionary: <code>dict["kapi"] = 4</code>, <code>ContainsKey</code>, <code>TryGetValue</code>,</li>
<li><code>Queue&lt;T&gt;</code> – a FIFO queue (first in – first out): <code>Enqueue</code>, <code>Dequeue</code>,</li>
<li><code>Stack&lt;T&gt;</code> – a LIFO stack (last in – first out): <code>Push</code>, <code>Pop</code>, <code>Peek</code>,</li>
<li><code>HashSet&lt;T&gt;</code> – a set without duplicates.</li></ul>
<p><code>T</code> is the element type, e.g. <code>List&lt;string&gt;</code>. Collections are traversed with <code>foreach</code>. Note: you must not add or remove elements during a <code>foreach</code> over the same collection (<code>InvalidOperationException</code>).</p>`,
  more: `<p><b>LINQ</b> (<code>using System.Linq;</code>) adds handy methods to collections: <code>Where</code> (filtering), <code>Select</code> (transforming), <code>OrderBy</code>, <code>Sum</code>, <code>Max</code>, <code>Average</code>, <code>Count</code>, <code>First</code>, <code>Any</code>. E.g. <code>numbers.Where(x =&gt; x % 2 == 0).Sum()</code>. The notation <code>x =&gt; x * 2</code> is a <b>lambda expression</b> – a short, anonymous function.</p>`,
  ex: [
   { code: c`List<string> crew = new List<string> { "Kapi", "Ola" };
crew.Add("Bob");
crew.Insert(0, "Captain Kapi");
crew.Remove("Kapi");
Console.WriteLine($"{crew.Count}: {string.Join(", ", crew)}");
Console.WriteLine(crew.Contains("Ola") + " " + crew[1]);

Dictionary<string, int> treasure = new Dictionary<string, int>();
treasure["gold"] = 100;
treasure["pearls"] = 30;
treasure["gold"] += 50;
foreach (var pair in treasure)
{
    Console.WriteLine($"{pair.Key}: {pair.Value}");
}
if (treasure.TryGetValue("rubies", out int count)) Console.WriteLine(count);
else Console.WriteLine("No rubies");`, scene: { pairs: [['"gold"', '150'], ['"pearls"', '30']], hl: '"gold"' }, cap: 'A dictionary is a cabinet with labelled drawers. Kapi opens the drawer by the key "gold", not by a number.' },
   { code: c`Queue<string> queue = new Queue<string>();
queue.Enqueue("pizza");
queue.Enqueue("pasta");
queue.Enqueue("soup");
Console.WriteLine("First: " + queue.Dequeue());

Stack<string> plates = new Stack<string>();
plates.Push("plate 1");
plates.Push("plate 2");
plates.Push("plate 3");
Console.WriteLine("From the top: " + plates.Pop());
Console.WriteLine($"Left in the queue: {queue.Count}, on the stack: {plates.Count}");

List<int> numbers = new List<int> { 5, 12, 7, 20, 3 };
Console.WriteLine(numbers.Where(x => x > 6).Sum());
Console.WriteLine(string.Join(" ", numbers.OrderBy(x => x)));`, scene: { items: ['pizza', 'pasta', 'soup'], ops: ['-', '+dessert'] }, cap: "The order queue in Kapi's kitchen: first come, first served (FIFO)." },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'After Add: 3,1,2,5. After Remove(1): 3,2,5 → Count 3, l[1] = 2.' },
   { q: 'What will the program print?', why: 'A stack returns the most recently pushed first: 3, then 2 → 5.' },
   { q: 'Which exception will the program throw?', opts: ['KeyNotFoundException', 'IndexOutOfRangeException', 'NullReferenceException', 'It prints 0'], why: 'The key "ola" is not in the dictionary.' },
   { q: 'The program stops with an exception. Click the line with the bug.', why: 'You must not modify a list during foreach (InvalidOperationException). Use l.RemoveAll(x => x % 2 == 0) outside the loop.' },
   { q: 'What will the program print?', why: 'Greater than 3: 4, 9, 7 → 3 items. The maximum after multiplying by 10 is 90.' },
   { q: 'Read words (each on its own line) until the word <code>end</code>. Print every distinct word with its number of occurrences, in order of first appearance, as <code>word: N</code>. Use <code>Dictionary&lt;string, int&gt;</code>.',
     start: '// Your code\n', tests: [{ i: 'kapi\nola\nkapi\nend', o: 'kapi: 2\nola: 1' }, { i: 'end', o: '' }], check: "if (!/Dictionary/.test(src)) return 'Use Dictionary<string, int>';",
     sol: c`var counter = new Dictionary<string, int>();
string s = Console.ReadLine();
while (s != "end")
{
    if (counter.ContainsKey(s)) counter[s]++;
    else counter[s] = 1;
    s = Console.ReadLine();
}
foreach (var p in counter) Console.WriteLine($"{p.Key}: {p.Value}");`, hint: 'if (counter.ContainsKey(s)) counter[s]++; else counter[s] = 1;' },
   { q: 'The queue to the capybara bath: read <code>n</code>, then n names, and add them to a <code>Queue&lt;string&gt;</code>. Serve the customers in turn: print <code>Bathing: NAME (still waiting K)</code>.',
     start: '// Your code\n', tests: [{ i: '3\nKapi\nOla\nBob', o: 'Bathing: Kapi (still waiting 2)\nBathing: Ola (still waiting 1)\nBathing: Bob (still waiting 0)' }], check: "if (!/Queue/.test(src)) return 'Use Queue<string>';",
     sol: c`int n = int.Parse(Console.ReadLine());
var q = new Queue<string>();
for (int i = 0; i < n; i++) q.Enqueue(Console.ReadLine());
while (q.Count > 0)
{
    string name = q.Dequeue();
    Console.WriteLine($"Bathing: {name} (still waiting {q.Count})");
}`, hint: 'while (q.Count > 0) { string name = q.Dequeue(); ... }' },
  ] },
 trycatch: { title: 'Catching exceptions: try / catch / finally',
  theory: `<p>An <b>exception</b> is an error while the program runs, e.g. division by zero, a bad number format, a missing file. An unhandled exception stops the program.</p>
<p>Exceptions are caught with a <code>try</code>/<code>catch</code> block:</p>
<pre>try
{
    int x = int.Parse(Console.ReadLine());   // an error may happen here
}
catch (FormatException)
{
    Console.WriteLine("That is not a number!");
}
finally
{
    Console.WriteLine("This always runs");
}</pre>
<ul><li>In <code>try</code> we put code that may throw an exception.</li>
<li><code>catch (ExceptionType e)</code> handles the chosen type. There can be several catch blocks – from the most specific to the general <code>catch (Exception e)</code>.</li>
<li><code>e.Message</code> contains the error description.</li>
<li><code>finally</code> always runs – whether there was an exception or not (e.g. to close a file).</li></ul>`,
  more: `<p>The most common exceptions: <code>FormatException</code> (bad text format), <code>DivideByZeroException</code>, <code>IndexOutOfRangeException</code>, <code>NullReferenceException</code>, <code>ArgumentOutOfRangeException</code>, <code>KeyNotFoundException</code>, <code>InvalidOperationException</code>, <code>OverflowException</code>, <code>FileNotFoundException</code>. All of them inherit from <code>Exception</code>. Do not catch exceptions “blindly” and do not leave an empty <code>catch { }</code> – it hides errors.</p>`,
  ex: [
   { code: c`string[] data = { "12", "kapi", "0" };
foreach (string d in data)
{
    try
    {
        int n = int.Parse(d);
        Console.WriteLine($"100 / {n} = {100 / n}");
    }
    catch (FormatException)
    {
        Console.WriteLine($"'{d}' is not a number!");
    }
    catch (DivideByZeroException e)
    {
        Console.WriteLine("Error: " + e.Message);
    }
    finally
    {
        Console.WriteLine("--- checked: " + d);
    }
}
Console.WriteLine("The program keeps going 🐹");`, cap: 'Kapi has a shield: errors bounce off the catch blocks and the program sails on. Without try/catch the ship would sink.' },
  ],
  tasks: [
   { q: 'What will the program print?', why: 'The exception interrupts try before printing A; catch prints B, and then the program continues.' },
   { q: 'When does the <code>finally</code> block run?', opts: ['Always – after try or after catch', 'Only when an exception occurred', 'Only when there was no exception', 'Never, when there is a catch'], why: 'finally is for cleaning up and always runs.' },
   { q: 'What will the program print?', why: 'FormatException does not match the first catch, but it matches the general Exception; finally always runs.' },
   { q: 'Complete it to handle a bad number format.', code: c`try
{
    int n = int.Parse("five");
    Console.WriteLine(n);
}
___ (FormatException)
{
    Console.WriteLine("Bad format");
}`, expect: 'Bad format', why: 'Exceptions are handled in a catch block.' },
   { q: 'What will the program print?', why: 'finally runs before leaving the method – even with return.' },
   { q: 'Read two lines and print the result of integer division. Handle errors: bad format → <code>Bad number format</code>, division by zero → <code>Do not divide by zero!</code>.',
     tests: [{ i: '17\n5', o: '3' }, { i: '7\n0', o: 'Do not divide by zero!' }, { i: 'x\n2', o: 'Bad number format' }], check: "if (!/catch/.test(src)) return 'Use try/catch';",
     sol: c`string a = Console.ReadLine();
string b = Console.ReadLine();
try
{
    Console.WriteLine(int.Parse(a) / int.Parse(b));
}
catch (FormatException)
{
    Console.WriteLine("Bad number format");
}
catch (DivideByZeroException)
{
    Console.WriteLine("Do not divide by zero!");
}`, hint: 'Two catch blocks: FormatException and DivideByZeroException.' },
  ] },
 throw: { title: 'throw, custom exceptions and an error list',
  theory: `<p>The <code>throw</code> statement <b>raises</b> an exception. We use it when a method gets invalid data and cannot work correctly:</p>
<pre>if (amount &lt;= 0)
    throw new ArgumentException("The amount must be positive");</pre>
<p>We can create <b>custom exceptions</b> – classes inheriting from <code>Exception</code>:</p>
<pre>class OutOfFuelException : Exception
{
    public OutOfFuelException(string msg) : base(msg) { }
}</pre>
<p>When designing an application it is worth preparing a <b>list of possible runtime errors</b> and deciding how to handle each, e.g.:</p>
<ul><li>the user types text instead of a number → <code>TryParse</code> or <code>catch (FormatException)</code> and ask again,</li>
<li>a value out of range → <code>throw new ArgumentOutOfRangeException</code> in the method, a message in the interface,</li>
<li>a missing file → <code>File.Exists</code> or <code>catch (FileNotFoundException)</code> and create a default file,</li>
<li>an empty collection → check <code>Count &gt; 0</code> before taking an element.</li></ul>`,
  more: `<p>A bare <code>throw;</code> in a catch block rethrows the same exception (e.g. after logging it). The filter <code>catch (Exception e) when (condition)</code> catches the exception only when the condition is true.</p>`,
  ex: [
   { code: c`Ship s = new Ship(30);
try
{
    s.Sail(10);
    s.Sail(50);
}
catch (OutOfFuelException e)
{
    Console.WriteLine("⚓ " + e.Message);
}
try
{
    s.Sail(-5);
}
catch (ArgumentException e)
{
    Console.WriteLine("❌ " + e.Message);
}

class OutOfFuelException : Exception
{
    public OutOfFuelException(string msg) : base(msg) { }
}
class Ship
{
    private int fuel;
    public Ship(int fuel) { this.fuel = fuel; }
    public void Sail(int miles)
    {
        if (miles <= 0) throw new ArgumentException("The number of miles must be positive");
        if (miles > fuel) throw new OutOfFuelException($"Not enough fuel for {miles} miles ({fuel} left)");
        fuel -= miles;
        Console.WriteLine($"Sailing {miles} miles, fuel: {fuel}");
    }
}`, scene: { err: 'throw new OutOfFuelException(...)' }, cap: 'The Sail method raises a red flag (throw) when it cannot do its job, and captain Kapi catches it in catch and decides what to do next.' },
  ],
  tasks: [
   { q: 'How do you raise an exception in C#?', opts: ['throw new Exception("description");', 'raise Exception("description");', 'catch new Exception();', 'error("description");'], why: 'An exception is raised with the throw statement and a new exception object.' },
   { q: 'What will the program print?', code: c`try
{
    throw new InvalidOperationException("Kapi is asleep");
}
catch (Exception e)
{
    Console.WriteLine(e.Message);
}`, opts: ['Kapi is asleep', 'InvalidOperationException', 'Exception', 'nothing'], why: 'Message contains the text passed to the constructor.' },
   { q: 'What will the program print?', code: c`try
{
    throw new EmptyPotException();
}
catch (EmptyPotException e)
{
    Console.WriteLine(e.GetType().Name);
}

class EmptyPotException : Exception { }`, opts: ['EmptyPotException', 'Exception', 'Pot', 'A compile error'], why: 'GetType().Name returns the class name of the exception object.' },
   { q: 'The compiler reports an error. Click the line with the bug.', code: c`try
{
    throw new Treasure();
}
catch (Exception) { Console.WriteLine("?"); }

class Treasure { }`, fix: 'throw new Exception("Treasure!");', why: 'Only objects of classes inheriting from Exception can be thrown (CS0155).' },
   { q: 'Complete the custom exception class.', code: c`try { throw new TooHotException("Careful, it's hot!"); }
catch (TooHotException e) { Console.WriteLine(e.Message); }

class TooHotException : ___
{
    public TooHotException(string m) : base(m) { }
}`, expect: "Careful, it's hot!", why: 'Custom exceptions inherit from Exception.' },
   { q: 'Write a method <code>static int Age(string text)</code> that converts text to a number and throws <code>ArgumentOutOfRangeException</code> when the age is outside 0–150. The program reads a line and prints <code>OK: N</code>, <code>Out of range</code> or <code>Not a number</code>.',
     tests: [{ i: '15', o: 'OK: 15' }, { i: '200', o: 'Out of range' }, { i: 'abc', o: 'Not a number' }], check: "if (!/throw/.test(src)) return 'Use throw in the Age method';",
     sol: c`static int Age(string text)
{
    int w = int.Parse(text);
    if (w < 0 || w > 150) throw new ArgumentOutOfRangeException(nameof(text));
    return w;
}
string s = Console.ReadLine();
try { Console.WriteLine($"OK: {Age(s)}"); }
catch (ArgumentOutOfRangeException) { Console.WriteLine("Out of range"); }
catch (FormatException) { Console.WriteLine("Not a number"); }`, hint: 'throw new ArgumentOutOfRangeException(nameof(text));' },
  ] },
 pliki: { title: 'Working with files',
  theory: `<p>The <code>File</code> class (namespace <code>System.IO</code>) has simple methods for working with text files:</p>
<ul><li><code>File.WriteAllText(path, text)</code> – writes (overwrites) a file,</li>
<li><code>File.AppendAllText(path, text)</code> – appends at the end,</li>
<li><code>File.ReadAllText(path)</code> – reads the whole file as one string,</li>
<li><code>File.ReadAllLines(path)</code> – reads the file as an array of lines,</li>
<li><code>File.WriteAllLines(path, lines)</code>, <code>File.Exists(path)</code>, <code>File.Delete(path)</code>.</li></ul>
<p>For large files we use streams: <code>StreamWriter</code> (writing) and <code>StreamReader</code> (reading line by line). We close them with a <code>using</code> block, which calls <code>Dispose()</code> automatically – even on an exception.</p>
<p>Reading a missing file ends with a <code>FileNotFoundException</code>.</p>
<p>In KapiPasta files are virtual – they exist only in memory while the program runs.</p>`,
  ex: [
   { code: c`using System.IO;

File.WriteAllText("logbook.txt", "Day 1: we set sail\n");
File.AppendAllText("logbook.txt", "Day 2: a storm!\n");
File.AppendAllText("logbook.txt", "Day 3: treasure island\n");

string[] lines = File.ReadAllLines("logbook.txt");
Console.WriteLine($"Entries: {lines.Length}");
foreach (string l in lines) Console.WriteLine("📜 " + l);

using (StreamWriter w = new StreamWriter("treasure.csv"))
{
    w.WriteLine("gold;100");
    w.WriteLine("pearls;30");
}
using (StreamReader r = new StreamReader("treasure.csv"))
{
    string row;
    int sum = 0;
    while ((row = r.ReadLine()) != null)
    {
        string[] fields = row.Split(';');
        sum += int.Parse(fields[1]);
    }
    Console.WriteLine("Treasure value: " + sum);
}
Console.WriteLine(File.Exists("map.txt"));`, scene: { name: 'logbook.txt', lines: ['Day 1: we set sail', 'Day 2: a storm!', 'Day 3: treasure island'] }, cap: "Kapi keeps a ship's logbook: WriteAllText starts a new scroll, AppendAllText adds at the end, and ReadAllLines reads all lines." },
  ],
  tasks: [
   { q: 'Which method <b>appends</b> text at the end of a file (without erasing its contents)?', why: 'WriteAllText overwrites the file, AppendAllText appends.' },
   { q: 'What will the program print?', code: c`File.WriteAllText("a.txt", "one\n");
File.WriteAllText("a.txt", "two\n");
Console.Write(File.ReadAllText("a.txt"));`, opts: ['two', 'one\ntwo', 'one', 'two\none'], why: 'The second WriteAllText overwrote the file.' },
   { q: 'Which exception will the program throw?', code: c`string t = File.ReadAllText("not_here.txt");`, opts: ['FileNotFoundException', 'NullReferenceException', 'FormatException', 'IOException does not exist'], why: 'The file does not exist, so reading ends with FileNotFoundException.' },
   { q: 'Complete it to read the file line by line into an array.', code: c`File.WriteAllText("list.txt", "oranges\nwatermelon\n");
string[] t = File.___("list.txt");
Console.WriteLine(t.Length);`, why: 'ReadAllLines returns an array of lines.' },
   { q: 'The file <code>grades.txt</code> contains one grade (an integer) per line. Print the average to 2 decimal places and the number of grades as <code>Average: X (N grades)</code>.',
     start: '// the file grades.txt already exists\n', files: { 'grades.txt': '5\n4\n3\n5\n6\n' }, tests: [{ i: '', o: 'Average: 4.60 (5 grades)' }],
     sol: c`string[] lines = File.ReadAllLines("grades.txt");
int sum = 0;
foreach (string l in lines) sum += int.Parse(l);
Console.WriteLine($"Average: {(double)sum / lines.Length:F2} ({lines.Length} grades)");`, hint: 'File.ReadAllLines("grades.txt") and int.Parse for every line.' },
   { q: 'Read <code>n</code> and n names (each on a line). Write them to the file <code>crew.txt</code> in alphabetical order (one per line), then read the file and print its contents. The file contents are checked too!',
     start: '// Your code\n', check: "if (!files['crew.txt'] || files['crew.txt'].replace(/\\r/g,'').trim() !== input.split('\\n').slice(1).sort((a,b)=>a.localeCompare(b,'en')).join('\\n')) return 'The file crew.txt should contain the sorted names';",
     sol: c`int n = int.Parse(Console.ReadLine());
List<string> names = new List<string>();
for (int i = 0; i < n; i++) names.Add(Console.ReadLine());
names.Sort();
File.WriteAllLines("crew.txt", names);
Console.Write(File.ReadAllText("crew.txt"));`, hint: 'List<string>, Sort(), File.WriteAllLines, File.ReadAllText.' },
  ] },
 algo: { title: 'Searching, sorting and numbers',
  theory: `<p>An <b>algorithm</b> is a step-by-step recipe for solving a problem. Classics worth being able to write yourself:</p>
<ul><li><b>Linear search</b> – check the elements one by one until you find the one you want (up to n comparisons).</li>
<li><b>Binary search</b> – in a <b>sorted</b> array compare with the middle and discard half (about log₂ n comparisons).</li>
<li><b>Bubble sort</b> – compare neighbours and swap them if they are in the wrong order. After each pass the largest element “bubbles up” to the end.</li>
<li><b>Prime number</b> – divisible only by 1 and itself. It is enough to check divisors up to √n.</li>
<li><b>GCD</b> – Euclid’s algorithm: <code>GCD(a, b) = GCD(b, a % b)</code>.</li></ul>
<p>In practice we use <b>libraries</b>: <code>Array.Sort</code>, <code>List.Sort</code>, <code>Array.BinarySearch</code>, <code>Math.Sqrt</code>, <code>Math.Max</code>, LINQ (<code>Max</code>, <code>OrderBy</code>). They are fast and well tested. Writing your own implementations, though, teaches algorithmic thinking – and that is what vocational exams ask about.</p>`,
  ex: [
   { cap: 'The capybaras line up from shortest to tallest. Neighbours compare themselves and swap places – the tallest one bubbles up to the end.' },
   { code: c`static int Linear(int[] t, int x)
{
    for (int i = 0; i < t.Length; i++)
        if (t[i] == x) return i;
    return -1;
}
static int Binary(int[] t, int x)
{
    int left = 0, right = t.Length - 1;
    while (left <= right)
    {
        int mid = (left + right) / 2;
        if (t[mid] == x) return mid;
        if (t[mid] < x) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
static bool IsPrime(int n)
{
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++)
        if (n % d == 0) return false;
    return true;
}
int[] sorted = { 3, 8, 15, 23, 42, 57, 91 };
Console.WriteLine(Linear(sorted, 42) + " " + Binary(sorted, 42) + " " + Binary(sorted, 5));
for (int i = 1; i <= 30; i++) if (IsPrime(i)) Console.Write(i + " ");`, cap: 'Linear search: Kapi looks into every burrow in turn until he finds 42. Binary search in a sorted array jumps straight to the middle.' },
  ],
  tasks: [
   { q: 'What condition must an array meet to use binary search?', opts: ['It must be sorted', 'It must have an even length', 'It must contain positive numbers', 'It must not have duplicates'], why: 'Binary search discards half based on the order of elements.' },
   { q: 'How many comparisons, in the worst case, does binary search make in an array of 1000 elements?', opts: ['about 10', 'about 500', '1000', 'about 100'], why: 'Each time we discard half: 2¹⁰ = 1024, so about 10 steps.' },
   { q: 'What will the program print?', why: 'One bubble pass: (5,1) → swap, (5,4) → swap. 5 ends up at the end.' },
   { q: 'The function should check whether a number is prime, but for 9 it returns True. Click the line with the bug.', code: c`static bool Prime(int n)
{
    if (n < 2) return false;
    for (int d = 2; d * d < n; d++)
        if (n % d == 0) return false;
    return true;
}
Console.WriteLine(Prime(9));`, why: 'For n = 9 you must check d = 3 (3 · 3 = 9). The condition must be d * d <= n.' },
   { q: 'Read <code>n</code> and print all primes ≤ n separated by spaces. Write an <code>IsPrime</code> method.',
     sol: c`static bool IsPrime(int n)
{
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++) if (n % d == 0) return false;
    return true;
}
int n = int.Parse(Console.ReadLine());
List<int> p = new List<int>();
for (int i = 2; i <= n; i++) if (IsPrime(i)) p.Add(i);
Console.WriteLine(string.Join(" ", p));`, hint: 'Collect the numbers in a List<int> and print string.Join(" ", list).' },
   { q: 'Implement <b>bubble sort</b> (without Array.Sort, List.Sort or LINQ). Read n and n numbers, print them sorted in descending order.', check: "if (/\\.Sort\\(|OrderBy/.test(src)) return 'Write the sorting yourself';", hint: 'For descending order swap when t[j] < t[j + 1].' },
  ] },
});
