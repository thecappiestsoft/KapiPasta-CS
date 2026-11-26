// Dział 8 (klasy i obiekty): dodatkowe zadania.

X('klasy1', [
  OUT(1, c`Box a = new Box();
Box b = new Box();
a.Size = 3;
b.Size = 7;
Console.WriteLine(a.Size + b.Size);

class Box { public int Size; }`, ['10', '7', '3', '0'], 'Każdy obiekt ma własne pole Size: 3 + 7 = 10.', 'Each object has its own Size field: 3 + 7 = 10.'),
  QZ(1, 'Jaką wartość ma pole <code>int</code> nowego obiektu, jeśli go nie ustawimy?', 'What value does an <code>int</code> field of a new object have if we do not set it?', ['0', 'null', 'losową', 'pola nie da się odczytać'], ['0', 'null', 'a random value', 'the field cannot be read'], 'Pola dostają wartości domyślne: 0 dla liczb, false dla bool, null dla referencji.', 'Fields get default values: 0 for numbers, false for bool, null for references.'),
  OUT(2, c`Dog d = new Dog { Name = "Rex", Age = 3 };
Console.WriteLine(d.Info());

class Dog
{
    public string Name;
    public int Age;
    public string Info() => $"{Name} ({Age})";
}`, ['Rex (3)', 'Name (Age)', ' (0)', 'Rex 3'], 'Inicjalizator obiektu { Name = ..., Age = ... } ustawia pola zaraz po utworzeniu.', 'The object initializer { Name = ..., Age = ... } sets the fields right after creation.'),
  OUT(3, c`Counter a = new Counter();
Counter b = a;
a.Add();
b.Add();
a = new Counter();
a.Add();
Console.WriteLine(a.N + " " + b.N);

class Counter
{
    public int N;
    public void Add() => N++;
}`, ['1 2', '3 3', '1 1', '2 2'], 'Najpierw a i b to ten sam obiekt (N = 2). Potem a wskazuje nowy obiekt z N = 1, a b nadal stary.', 'At first a and b are the same object (N = 2). Then a points to a new object with N = 1, while b keeps the old one.'),
  CODE(3, 'Dopisz klasę <code>Point</code> z polami <code>X</code>, <code>Y</code> (double) i metodą <code>Distance(Point other)</code> zwracającą odległość euklidesową.', 'Add a class <code>Point</code> with fields <code>X</code>, <code>Y</code> (double) and a method <code>Distance(Point other)</code> returning the Euclidean distance.', 'Point a = new Point { X = 0, Y = 0 };\nPoint b = new Point { X = 3, Y = 4 };\nConsole.WriteLine(a.Distance(b));\nConsole.WriteLine(b.Distance(new Point { X = 3, Y = 0 }));\n', [{ i: '', o: '5\n4' }], c`Point a = new Point { X = 0, Y = 0 };
Point b = new Point { X = 3, Y = 4 };
Console.WriteLine(a.Distance(b));
Console.WriteLine(b.Distance(new Point { X = 3, Y = 0 }));

class Point
{
    public double X, Y;
    public double Distance(Point other) => Math.Sqrt((X - other.X) * (X - other.X) + (Y - other.Y) * (Y - other.Y));
}`, 'Math.Sqrt(dx * dx + dy * dy).', 'Math.Sqrt(dx * dx + dy * dy).'),
]);

X('konstruktory', [
  OUT(1, c`Cat c = new Cat("Tom");
Console.WriteLine(c.Name);

class Cat
{
    public string Name;
    public Cat(string n) { Name = n.ToUpper(); }
}`, ['TOM', 'Tom', 'n', 'Błąd'], 'Konstruktor zapisuje imię wielkimi literami.', 'The constructor stores the name in capitals.', { en: { opts: ['TOM', 'Tom', 'n', 'An error'] } }),
  QZ(1, 'Jaki typ zwracany ma konstruktor?', 'What is the return type of a constructor?', ['Nie ma typu zwracanego – nawet void', 'void', 'object', 'typ klasy'], ['It has no return type – not even void', 'void', 'object', 'the class type'], 'Konstruktor ma nazwę klasy i nie deklaruje żadnego typu zwracanego.', 'A constructor has the class name and declares no return type at all.'),
  OUT(3, c`new B();

class A
{
    public A() { Console.Write("A"); Hello(); }
    public virtual void Hello() => Console.Write("a");
}
class B : A
{
    public B() { Console.Write("B"); }
    public override void Hello() => Console.Write("b");
}`, ['AbB', 'AaB', 'ABb', 'BA'], 'Najpierw konstruktor A, który woła wirtualną Hello – a ta wykonuje się w wersji B (obiekt jest typu B). Dopiero potem konstruktor B.', 'First the constructor of A, which calls the virtual Hello – it runs the B version (the object is a B). Only then the constructor of B.'),
  OUT(3, c`Item x = new Item("pen");
Item y = new Item(x);
y.Tags[0] = "red";
Console.WriteLine(x.Tags[0]);

class Item
{
    public string Name;
    public string[] Tags = { "blue" };
    public Item(string n) { Name = n; }
    public Item(Item o) { Name = o.Name; Tags = o.Tags; }
}`, ['red', 'blue', 'pen', 'null'], 'Konstruktor kopiujący skopiował tylko referencję do tablicy (płytka kopia) – oba obiekty dzielą tę samą tablicę Tags.', 'The copy constructor copied only the array reference (a shallow copy) – both objects share the same Tags array.'),
]);

X('hermetyzacja', [
  QZ(1, 'Jaki modyfikator dostępu mają składowe klasy, jeśli go nie napiszemy?', 'Which access modifier do class members have if we do not write one?', ['private', 'public', 'protected', 'internal'], null, 'Domyślnie składowe klasy są private.', 'By default class members are private.'),
  OUT(2, c`Temp t = new Temp();
t.Celsius = 25;
Console.WriteLine(t.Fahrenheit);

class Temp
{
    public double Celsius { get; set; }
    public double Fahrenheit => Celsius * 9 / 5 + 32;
}`, ['77', '25', '45', '57'], 'Właściwość tylko do odczytu liczy wartość przy każdym odczycie: 25 · 9 / 5 + 32 = 77.', 'A read-only property computes the value on every read: 25 · 9 / 5 + 32 = 77.'),
  OUT(3, c`Acc a = new Acc();
a.Balance = 100;
a.Balance = -50;
a.Balance += 20;
Console.WriteLine(a.Balance + " " + a.Rejected);

class Acc
{
    private int b;
    public int Rejected { get; private set; }
    public int Balance
    {
        get => b;
        set { if (value < 0) Rejected++; else b = value; }
    }
}`, ['120 1', '70 0', '120 0', '70 1'], 'Setter odrzucił −50 (Rejected = 1). += odczytuje 100 i zapisuje 120.', 'The setter rejected −50 (Rejected = 1). += reads 100 and writes 120.'),
  CODE(3, 'Dopisz klasę <code>Stack3</code> – stos na najwyżej 3 liczby, z prywatną tablicą. Metoda <code>bool Push(int x)</code> zwraca false, gdy stos jest pełny; <code>int Pop()</code> zdejmuje ostatni element; właściwość <code>Count</code> tylko do odczytu.', 'Add a class <code>Stack3</code> – a stack for at most 3 numbers, with a private array. <code>bool Push(int x)</code> returns false when the stack is full; <code>int Pop()</code> removes the last element; a read-only property <code>Count</code>.', 'Stack3 s = new Stack3();\nConsole.WriteLine($"{s.Push(1)} {s.Push(2)} {s.Push(3)} {s.Push(4)}");\nConsole.WriteLine(s.Pop() + " " + s.Count);\n', [{ i: '', o: 'True True True False\n3 2' }], c`Stack3 s = new Stack3();
Console.WriteLine($"{s.Push(1)} {s.Push(2)} {s.Push(3)} {s.Push(4)}");
Console.WriteLine(s.Pop() + " " + s.Count);

class Stack3
{
    private int[] items = new int[3];
    public int Count { get; private set; }
    public bool Push(int x)
    {
        if (Count == 3) return false;
        items[Count++] = x;
        return true;
    }
    public int Pop() => items[--Count];
}`, 'Count jest jednocześnie liczbą elementów i indeksem następnego wolnego miejsca.', 'Count is both the number of elements and the index of the next free slot.', { pl: { check: "if (!/private\\s+int\\[\\]/.test(src)) return 'Tablica ma być prywatna';" }, en: { check: "if (!/private\\s+int\\[\\]/.test(src)) return 'The array must be private';" } }),
]);

X('statyczne', [
  OUT(1, c`Console.WriteLine(MathX.Square(4) + MathX.Pi2);

static class MathX
{
    public static int Square(int x) => x * x;
    public static int Pi2 = 6;
}`, ['22', '16', '6', '166'], 'Składowe statyczne wywołujemy przez nazwę klasy: 16 + 6 = 22.', 'Static members are used through the class name: 16 + 6 = 22.'),
  OUT(3, c`Id a = new Id(), b = new Id(), c = new Id();
Console.WriteLine(a.Value + b.Value + c.Value + " " + Id.Next);

class Id
{
    public static int Next = 1;
    public int Value;
    public Id() { Value = Next; Next *= 2; }
}`, ['7 8', '3 4', '6 8', '7 4'], 'Każdy obiekt bierze bieżące Next (1, 2, 4), a potem Next się podwaja – na końcu 8.', 'Each object takes the current Next (1, 2, 4), then Next doubles – 8 at the end.'),
]);
