// Dział 9 (dziedziczenie, polimorfizm, abstrakcja, interfejsy): dodatkowe zadania.

X('dziedzicz', [
  OUT(1, c`Car c = new Car();
c.Wheels = 4;
c.Drive();

class Vehicle { public int Wheels; }
class Car : Vehicle
{
    public void Drive() => Console.WriteLine($"Driving on {Wheels} wheels");
}`, ['Driving on 4 wheels', 'Driving on 0 wheels', 'Driving on Wheels wheels', 'Błąd kompilacji'], 'Car dziedziczy pole Wheels po Vehicle i może z niego korzystać.', 'Car inherits the Wheels field from Vehicle and can use it.', { en: { opts: ['Driving on 4 wheels', 'Driving on 0 wheels', 'Driving on Wheels wheels', 'A compile error'] } }),
  QZ(1, 'Ile klas bazowych może mieć klasa w C#?', 'How many base classes can a class have in C#?', ['Jedną', 'Dowolnie wiele', 'Dwie', 'Żadnej – C# nie ma dziedziczenia'], ['One', 'Any number', 'Two', 'None – C# has no inheritance'], 'C# pozwala na dziedziczenie tylko po jednej klasie (wiele interfejsów jest dozwolonych).', 'C# allows inheriting from only one class (many interfaces are allowed).'),
  OUT(2, c`object o = new Kapi();
Console.WriteLine(o is Animal);
Console.WriteLine(o is Kapi);
Console.WriteLine(o is string);

class Animal { }
class Kapi : Animal { }`, ['True\nTrue\nFalse', 'False\nTrue\nFalse', 'True\nFalse\nFalse', 'True\nTrue\nTrue'], 'Kapi jest Animal (dziedziczenie) i oczywiście Kapi, ale nie jest string.', 'A Kapi is an Animal (inheritance) and of course a Kapi, but it is not a string.'),
  OUT(3, c`new C("x");

class A { public A(string s) { Console.Write("A" + s); } }
class B : A { public B(string s) : base(s + "1") { Console.Write("B" + s); } }
class C : B { public C(string s) : base(s + "2") { Console.Write("C" + s); } }`, ['Ax21Bx2Cx', 'CxBx2Ax21', 'AxBxCx', 'Ax1Bx2Cx'], 'Argumenty płyną w dół: C dostaje "x", B – "x2", A – "x21". Konstruktory wykonują się od A do C.', 'Arguments flow down: C gets "x", B gets "x2", A gets "x21". The constructors run from A to C.'),
  BUG(3, c`Admin a = new Admin();
a.Reset();
Console.WriteLine(a.Login);

class User
{
    private string login = "kapi";
    public string Login => login;
}
class Admin : User
{
    public void Reset() { login = ""; }
}`, 11, 'public void Reset() { /* login jest private – zmień na protected w klasie User */ }', 'Pole private nie jest widoczne w klasie pochodnej (CS0122). Trzeba je oznaczyć jako protected.', 'A private field is not visible in a derived class (CS0122). It should be protected.', { pl: { fixcheck: false }, en: { fix: 'public void Reset() { /* login is private – make it protected in the User class */ }' } }),
]);

X('polimorfizm', [
  OUT(1, c`Shape[] s = { new Sq(), new Tri(), new Sq() };
foreach (Shape x in s) Console.Write(x.Corners());

class Shape { public virtual int Corners() => 0; }
class Sq : Shape { public override int Corners() => 4; }
class Tri : Shape { public override int Corners() => 3; }`, ['434', '000', '444', '343'], 'Dla każdego obiektu wykonuje się jego własna wersja Corners().', 'For each object its own version of Corners() runs.'),
  QZ(1, 'Którego słowa używamy w klasie pochodnej, aby nadpisać metodę <code>virtual</code>?', 'Which keyword do we use in a derived class to override a <code>virtual</code> method?', ['override', 'virtual', 'new', 'base'], null, 'virtual w klasie bazowej, override w pochodnej.', 'virtual in the base class, override in the derived class.'),
  OUT(3, c`Base b = new Derived();
Derived d = (Derived)b;
Console.WriteLine(b.Who() + d.Who() + b.Name() + d.Name());

class Base
{
    public virtual string Who() => "B";
    public string Name() => "b";
}
class Derived : Base
{
    public override string Who() => "D";
    public new string Name() => "d";
}`, ['DDbd', 'BDbd', 'DDdd', 'DDbb'], 'Who jest wirtualna – zawsze wersja D. Name jest ukryta (new) – decyduje typ zmiennej: b (Base) → b, d (Derived) → d.', 'Who is virtual – always the D version. Name is hidden (new) – the variable type decides: b (Base) → b, d (Derived) → d.'),
  OUT(3, c`Animal a = new Cat();
Console.WriteLine(a.ToString());
Console.WriteLine(a as Dog == null);

class Animal { public override string ToString() => "animal"; }
class Cat : Animal { public override string ToString() => "cat:" + base.ToString(); }
class Dog : Animal { }`, ['cat:animal\nTrue', 'animal\nTrue', 'cat:animal\nFalse', 'cat\nTrue'], 'Cat.ToString dokleja wynik wersji bazowej. Operator as zwraca null, gdy obiekt nie jest Dog.', 'Cat.ToString appends the base version. The as operator returns null when the object is not a Dog.'),
]);

X('abstrakcja', [
  QZ(1, 'Czy klasa abstrakcyjna może mieć zwykłe (nieabstrakcyjne) metody z kodem?', 'Can an abstract class have ordinary (non-abstract) methods with code?', ['Tak', 'Nie', 'Tylko statyczne', 'Tylko prywatne'], ['Yes', 'No', 'Only static ones', 'Only private ones'], 'Klasa abstrakcyjna może łączyć metody abstrakcyjne i zwykłe.', 'An abstract class can mix abstract and ordinary methods.'),
  OUT(2, c`Animal[] zoo = { new Cow(), new Hen() };
int legs = 0;
foreach (var a in zoo) legs += a.Legs;
Console.WriteLine(legs + " " + zoo[1].Sound());

abstract class Animal
{
    public abstract int Legs { get; }
    public abstract string Sound();
}
class Cow : Animal { public override int Legs => 4; public override string Sound() => "moo"; }
class Hen : Animal { public override int Legs => 2; public override string Sound() => "cluck"; }`, ['6 cluck', '6 moo', '4 cluck', '0 cluck'], 'Abstrakcyjna może być też właściwość. Suma nóg 4 + 2 = 6, drugi obiekt to Hen.', 'A property can be abstract too. Legs 4 + 2 = 6, the second object is a Hen.'),
  CODE(3, 'Dopisz abstrakcyjną klasę <code>Shape</code> z abstrakcyjnymi metodami <code>double Area()</code> i <code>double Perimeter()</code> oraz zwykłą metodą <code>string Info()</code> zwracającą <code>pole P, obwód O</code> (obie z formatem F2). Dopisz klasy <code>Rect(a, b)</code> i <code>Circle(r)</code>.', 'Add an abstract class <code>Shape</code> with abstract methods <code>double Area()</code> and <code>double Perimeter()</code> and an ordinary method <code>string Info()</code> returning <code>area A, perimeter P</code> (both with format F2). Add the classes <code>Rect(a, b)</code> and <code>Circle(r)</code>.', 'Shape[] s = { new Rect(2, 3), new Circle(1) };\nforeach (Shape x in s) Console.WriteLine(x.Info());\n', [{ i: '', o: 'pole 6.00, obwód 10.00\npole 3.14, obwód 6.28' }], c`Shape[] s = { new Rect(2, 3), new Circle(1) };
foreach (Shape x in s) Console.WriteLine(x.Info());

abstract class Shape
{
    public abstract double Area();
    public abstract double Perimeter();
    public string Info() => $"pole {Area():F2}, obwód {Perimeter():F2}";
}
class Rect : Shape
{
    double a, b;
    public Rect(double a, double b) { this.a = a; this.b = b; }
    public override double Area() => a * b;
    public override double Perimeter() => 2 * (a + b);
}
class Circle : Shape
{
    double r;
    public Circle(double r) { this.r = r; }
    public override double Area() => Math.PI * r * r;
    public override double Perimeter() => 2 * Math.PI * r;
}`, 'Info() w klasie bazowej woła abstrakcyjne Area() i Perimeter() – działa to dzięki polimorfizmowi.', 'Info() in the base class calls the abstract Area() and Perimeter() – it works thanks to polymorphism.', { pl: { check: "if (!/abstract\\s+class\\s+Shape/.test(src)) return 'Shape ma być abstrakcyjna';" }, en: { check: "if (!/abstract\\s+class\\s+Shape/.test(src)) return 'Shape should be abstract';", tests: [{ i: '', o: 'area 6.00, perimeter 10.00\narea 3.14, perimeter 6.28' }], sol: c`Shape[] s = { new Rect(2, 3), new Circle(1) };
foreach (Shape x in s) Console.WriteLine(x.Info());

abstract class Shape
{
    public abstract double Area();
    public abstract double Perimeter();
    public string Info() => $"area {Area():F2}, perimeter {Perimeter():F2}";
}
class Rect : Shape
{
    double a, b;
    public Rect(double a, double b) { this.a = a; this.b = b; }
    public override double Area() => a * b;
    public override double Perimeter() => 2 * (a + b);
}
class Circle : Shape
{
    double r;
    public Circle(double r) { this.r = r; }
    public override double Area() => Math.PI * r * r;
    public override double Perimeter() => 2 * Math.PI * r;
}` } }),
]);

X('interfejsy', [
  QZ(1, 'Jak zwyczajowo zaczyna się nazwa interfejsu w C#?', 'How does the name of an interface usually start in C#?', ['Od wielkiej litery I, np. IComparable', 'Od słowa Interface', 'Od podkreślnika _', 'Od małej litery'], ['With a capital I, e.g. IComparable', 'With the word Interface', 'With an underscore _', 'With a lower-case letter'], 'Konwencja .NET: nazwy interfejsów zaczynają się od I.', 'The .NET convention: interface names start with I.'),
  OUT(1, c`IGreeter g = new Pl();
Console.WriteLine(g.Greet());
g = new En();
Console.WriteLine(g.Greet());

interface IGreeter { string Greet(); }
class Pl : IGreeter { public string Greet() => "Cześć"; }
class En : IGreeter { public string Greet() => "Hello"; }`, ['Cześć\nHello', 'Hello\nHello', 'Cześć\nCześć', 'IGreeter\nIGreeter'], 'Ta sama zmienna typu interfejsu może wskazywać różne klasy, które go implementują.', 'The same interface-typed variable can point to different classes that implement it.'),
  CODE(3, 'Klasa <code>Player</code> ma implementować <code>IComparable&lt;Player&gt;</code> tak, aby sortowanie układało graczy malejąco po punktach, a przy remisie – alfabetycznie po imieniu. Program już sortuje listę i wypisuje wynik.', 'The <code>Player</code> class should implement <code>IComparable&lt;Player&gt;</code> so that sorting orders players by points descending, and on a tie – alphabetically by name. The program already sorts the list and prints it.', 'var list = new List<Player> { new Player("Ola", 30), new Player("Kapi", 50), new Player("Bob", 30) };\nlist.Sort();\nforeach (var p in list) Console.WriteLine($"{p.Name} {p.Points}");\n\nclass Player\n{\n    public string Name; public int Points;\n    public Player(string n, int p) { Name = n; Points = p; }\n}\n', [{ i: '', o: 'Kapi 50\nBob 30\nOla 30' }], c`var list = new List<Player> { new Player("Ola", 30), new Player("Kapi", 50), new Player("Bob", 30) };
list.Sort();
foreach (var p in list) Console.WriteLine($"{p.Name} {p.Points}");

class Player : IComparable<Player>
{
    public string Name; public int Points;
    public Player(string n, int p) { Name = n; Points = p; }
    public int CompareTo(Player other)
    {
        if (Points != other.Points) return other.Points.CompareTo(Points);
        return Name.CompareTo(other.Name);
    }
}`, 'CompareTo zwraca liczbę ujemną, gdy this ma być przed other. Dla malejących punktów porównaj other.Points z Points.', 'CompareTo returns a negative number when this should come before other. For descending points compare other.Points with Points.'),
]);
