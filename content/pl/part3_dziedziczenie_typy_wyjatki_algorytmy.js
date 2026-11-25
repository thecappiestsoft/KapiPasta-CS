// Rozdziały 9–12: dziedziczenie i polimorfizm, typy i kolekcje, wyjątki i pliki, algorytmy

CH.push({
 id: 'dziedziczenie', icon: { pirate: '🏴‍☠️', kitchen: '👨‍🍳', hero: '🧬' },
 name: { pirate: 'Ród Piratów', kitchen: 'Rodzina Przepisów', hero: 'Dziedzictwo Mocy', neutral: 'Dziedziczenie' },
 topic: 'dziedziczenie, base, protected, virtual/override, polimorfizm, abstract, interfejsy',
 outcomes: 'Definiuje klasy bazowe i pochodne; buduje hierarchię dziedziczenia; wydziela metody i pola do odpowiednich klas w hierarchii; stosuje metody wirtualne; definiuje klasy abstrakcyjne; planuje aplikację z zastosowaniem hermetyzacji, dziedziczenia i polimorfizmu.',
 lessons: [
 { id: 'dziedzicz', title: 'Dziedziczenie',
  theory: `<p><b>Dziedziczenie</b> pozwala utworzyć nową klasę (<b>pochodną</b>) na podstawie istniejącej (<b>bazowej</b>). Klasa pochodna dostaje pola i metody bazowej i może dodawać własne:</p>
<pre>class Zwierze
{
    public string Imie;
    public void Jedz() =&gt; Console.WriteLine($"{Imie} je");
}
class Kapibara : Zwierze      // Kapibara dziedziczy po Zwierze
{
    public void Plywaj() =&gt; Console.WriteLine($"{Imie} pływa");
}</pre>
<p>Relacja dziedziczenia to „<b>jest rodzajem</b>”: Kapibara <i>jest</i> Zwierzęciem. W C# klasa może mieć <b>tylko jedną</b> klasę bazową (wszystkie ostatecznie dziedziczą po <code>object</code>).</p>
<p>Konstruktor klasy pochodnej wywołuje konstruktor bazowej przez <code>: base(...)</code>. Składowe <code>protected</code> są widoczne w klasach pochodnych, ale nie na zewnątrz.</p>
<p>Wspólne pola i metody umieszczamy <b>jak najwyżej</b> w hierarchii (w klasie bazowej), a szczegółowe – w klasach pochodnych.</p>`,
  more: `<p>Klasy oznaczonej <code>sealed</code> nie można dziedziczyć (CS0509). Konstruktory wykonują się „od góry”: najpierw bazowy, potem pochodny.</p>`,
  ex: [
   { code: c`Kapibara k = new Kapibara("Kapi");
k.Jedz();
k.Plywaj();
Pies p = new Pies("Burek");
p.Jedz();
p.Aportuj();

class Zwierze
{
    public string Imie;
    protected int glod = 5;
    public Zwierze(string imie)
    {
        Imie = imie;
        Console.WriteLine($"[Zwierze] tworzę {imie}");
    }
    public void Jedz()
    {
        glod--;
        Console.WriteLine($"{Imie} je (głód: {glod})");
    }
}

class Kapibara : Zwierze
{
    public Kapibara(string imie) : base(imie) { Console.WriteLine("[Kapibara] gotowa!"); }
    public void Plywaj() => Console.WriteLine($"{Imie} pływa 💦");
}

class Pies : Zwierze
{
    public Pies(string imie) : base(imie) { }
    public void Aportuj() => Console.WriteLine($"{Imie} przynosi patyk (głód: {glod})");
}`,
     scene: { s: 'inherit', base: { name: 'Zwierze', members: ['Imie', '# glod', 'Jedz()'] }, kids: [{ name: 'Kapibara', members: ['Plywaj()'], says: 'pływam!' }, { name: 'Pies', members: ['Aportuj()'], says: 'hau!' }], cap: 'Kapibara i Pies dziedziczą Imie i Jedz() po Zwierze, a każde dodaje swoją umiejętność. Pole protected (#) widzą tylko klasy z rodziny.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Jak zapisać, że klasa <code>Pirat</code> dziedziczy po klasie <code>Marynarz</code>?', opts: ['class Pirat : Marynarz', 'class Pirat extends Marynarz', 'class Pirat inherits Marynarz', 'class Marynarz : Pirat'], a: 0, why: 'W C# po nazwie klasy piszemy dwukropek i klasę bazową.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Kot k = new Kot();
k.Imie = "Mruczek";
k.Przedstaw();

class Zwierze
{
    public string Imie;
    public void Przedstaw() => Console.WriteLine("Jestem " + Imie);
}
class Kot : Zwierze { }`, opts: ['Jestem Mruczek', 'Jestem', 'Błąd – Kot nie ma metody Przedstaw', 'Jestem Kot'], a: 0, out: true, why: 'Kot dziedziczy pole Imie i metodę Przedstaw.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`new B();

class A { public A() { Console.Write("A"); } }
class B : A { public B() { Console.Write("B"); } }`, opts: ['AB', 'BA', 'B', 'A'], a: 0, out: true, why: 'Najpierw wykonuje się konstruktor klasy bazowej.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Pirat p = new Pirat("Kapi");
Console.WriteLine(p.Imie);

class Marynarz
{
    public string Imie;
    public Marynarz(string imie) { Imie = imie; }
}
class Pirat : Marynarz
{
    public Pirat(string imie) { }
}`, line: 10, fix: 'public Pirat(string imie) : base(imie) { }', why: 'Marynarz nie ma konstruktora bez parametrów – trzeba jawnie wywołać : base(imie) (CS7036).' },
   { t: 'fill', l: 2, q: 'Uzupełnij wywołanie konstruktora klasy bazowej.', code: c`Kucharz k = new Kucharz("Kapi");
Console.WriteLine(k.Imie);

class Osoba
{
    public string Imie;
    public Osoba(string imie) { Imie = imie; }
}
class Kucharz : Osoba
{
    public Kucharz(string imie) : ___(imie) { }
}`, ans: [['base']], expect: 'Kapi', why: ': base(...) wywołuje konstruktor klasy bazowej.' },
   { t: 'quiz', l: 3, q: 'Co się stanie?', code: c`class Okret { protected int dziala = 10; }
class Fregata : Okret { public int Ile() => dziala; }
class Port { public int Policz(Okret o) => o.dziala; }`, opts: ['Błąd kompilacji w klasie Port', 'Wszystko się skompiluje', 'Błąd w klasie Fregata', 'Wyjątek w czasie działania'], a: 0, compiles: false, why: 'protected widzą tylko klasy pochodne. Port nie dziedziczy po Okret (CS1061/CS0122).' },
   { t: 'code', l: 2, q: 'Dopisz klasę <code>Superbohater</code> dziedziczącą po <code>Osoba</code>, z dodatkowym polem <code>Moc</code> (string), konstruktorem <code>(string imie, string moc)</code> i metodą <code>Pokaz()</code> wypisującą <code>IMIĘ ma moc: MOC</code>.',
     start: 'Superbohater s = new Superbohater("Kapi", "super pływanie");\ns.Pokaz();\n\nclass Osoba\n{\n    public string Imie;\n    public Osoba(string imie) { Imie = imie; }\n}\n', tests: [{ i: '', o: 'Kapi ma moc: super pływanie' }], check: "if (!/class\\s+Superbohater\\s*:\\s*Osoba/.test(src)) return 'Superbohater ma dziedziczyć po Osoba';",
     sol: c`Superbohater s = new Superbohater("Kapi", "super pływanie");
s.Pokaz();

class Osoba
{
    public string Imie;
    public Osoba(string imie) { Imie = imie; }
}
class Superbohater : Osoba
{
    public string Moc;
    public Superbohater(string imie, string moc) : base(imie) { Moc = moc; }
    public void Pokaz() => Console.WriteLine($"{Imie} ma moc: {Moc}");
}`, hint: 'class Superbohater : Osoba i konstruktor : base(imie).' },
  ] },
 { id: 'polimorfizm', title: 'Polimorfizm: virtual i override',
  theory: `<p><b>Polimorfizm</b> („wiele postaci”) oznacza, że to samo wywołanie metody może działać różnie, zależnie od rzeczywistego typu obiektu.</p>
<p>Metodę w klasie bazowej oznaczamy <code>virtual</code>, a w klasie pochodnej nadpisujemy ją słowem <code>override</code>:</p>
<pre>class Zwierze { public virtual string Glos() =&gt; "..."; }
class Kot : Zwierze { public override string Glos() =&gt; "Miau"; }</pre>
<p>Dzięki temu zmienna typu bazowego może przechowywać obiekty różnych klas pochodnych, a wywołanie <code>z.Glos()</code> uruchomi wersję właściwą dla obiektu. To pozwala trzymać różne obiekty w jednej tablicy lub liście i obsługiwać je jedną pętlą.</p>
<p>Wewnątrz metody nadpisanej można wywołać wersję bazową: <code>base.Glos()</code>.</p>
<p>Często nadpisujemy metodę <code>ToString()</code> z klasy <code>object</code> – wtedy <code>Console.WriteLine(obiekt)</code> wypisuje nasz opis.</p>`,
  more: `<p>Bez <code>virtual</code>/<code>override</code> metoda o tej samej nazwie w klasie pochodnej tylko <b>ukrywa</b> metodę bazową (słowo <code>new</code>). Wtedy decyduje <b>typ zmiennej</b>, a nie typ obiektu – zwykle nie o to chodzi. Operatory <code>is</code> i <code>as</code> sprawdzają typ obiektu: <code>if (z is Kot k) k.Mrucz();</code>.</p>`,
  ex: [
   { code: c`Zwierze[] zoo = { new Kapibara(), new Kot(), new Pies(), new Zwierze() };
foreach (Zwierze z in zoo)
{
    Console.WriteLine($"{z.GetType().Name}: {z.Glos()}");
}

class Zwierze
{
    public virtual string Glos() => "...";
}
class Kapibara : Zwierze
{
    public override string Glos() => "Kwik! 🐹";
}
class Kot : Zwierze
{
    public override string Glos() => "Miau";
}
class Pies : Zwierze
{
    public override string Glos() => "Hau, " + base.Glos();
}`,
     scene: { s: 'inherit', base: { name: 'Zwierze', members: ['virtual Glos()'] }, kids: [{ name: 'Kapibara', members: ['override Glos()'], says: 'Kwik!' }, { name: 'Kot', members: ['override Glos()'], says: 'Miau' }, { name: 'Pies', members: ['override Glos()'], says: 'Hau, ...' }], cap: 'Jedna pętla, jedno wywołanie z.Glos() – a każde zwierzę odpowiada po swojemu. To jest polimorfizm.' } },
   { code: c`Bohater b = new Kapitan();
Console.WriteLine(b.Atak());
Console.WriteLine(b.Okrzyk());
Console.WriteLine(b);
if (b is Kapitan k) Console.WriteLine(k.Rozkaz());

class Bohater
{
    public virtual string Atak() => "cios";
    public string Okrzyk() => "Do boju!";
    public override string ToString() => "Bohater";
}
class Kapitan : Bohater
{
    public override string Atak() => "super cios";
    public new string Okrzyk() => "Za mną, załogo!";
    public string Rozkaz() => "Cała naprzód!";
    public override string ToString() => "Kapitan Kapi";
}`, lvl: 2,
     scene: { s: 'fork', cond: 'b to Kapitan?', val: 'True', yes: 'override → wersja Kapitana', no: 'new → wersja Bohatera (wg typu zmiennej)', cap: 'override słucha prawdziwego typu obiektu, a new (ukrycie) – typu zmiennej. Dlatego Okrzyk() wypisze tekst Bohatera.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Figura f = new Kolo();
Console.WriteLine(f.Nazwa());

class Figura { public virtual string Nazwa() => "figura"; }
class Kolo : Figura { public override string Nazwa() => "koło"; }`, opts: ['koło', 'figura', 'Błąd', 'Kolo'], a: 0, out: true, why: 'Metoda jest wirtualna – wykonuje się wersja z rzeczywistego obiektu (Kolo).' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`A x = new B();
Console.WriteLine(x.F() + x.G());

class A { public virtual string F() => "A"; public string G() => "a"; }
class B : A { public override string F() => "B"; public new string G() => "b"; }`, opts: ['Ba', 'Bb', 'Aa', 'Ab'], a: 0, out: true, why: 'F jest nadpisana (override) → B. G jest ukryta (new) → decyduje typ zmiennej A → a.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię, którą trzeba poprawić.', code: c`Ptak p = new Pingwin();
Console.WriteLine(p.Lec());

class Ptak { public string Lec() => "lecę"; }
class Pingwin : Ptak { public override string Lec() => "nie umiem latać"; }`, line: 3, fix: 'class Ptak { public virtual string Lec() => "lecę"; }', cause: true, why: 'Można nadpisać (override) tylko metodę virtual, abstract lub override (CS0506). Poprawka: dodaj virtual w klasie Ptak.' },
   { t: 'fill', l: 1, q: 'Uzupełnij, aby obiekty wypisywały się ładnie w Console.WriteLine.', code: c`Danie d = new Danie();
Console.WriteLine(d);

class Danie
{
    public ___ string ToString() => "Spaghetti à la Kapi";
}`, ans: [['override']], expect: 'Spaghetti à la Kapi', why: 'ToString jest metodą wirtualną klasy object – nadpisujemy ją przez override.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`Zw[] t = { new Zw(), new Kp(), new Kp() };
int s = 0;
foreach (Zw z in t) s += z.Nogi();
Console.WriteLine(s);

class Zw { public virtual int Nogi() => 2; }
class Kp : Zw { public override int Nogi() => base.Nogi() * 2; }`, opts: ['10', '6', '12', '8'], a: 0, out: true, why: '2 + 4 + 4 = 10. base.Nogi() zwraca 2.' },
   { t: 'code', l: 2, q: 'Dopisz klasy <code>Pizza</code> i <code>Pasta</code> dziedziczące po <code>Danie</code>, które nadpisują <code>Czas()</code>: pizza 15, pasta 10. Program sumuje czas przygotowania.',
     start: 'Danie[] menu = { new Pizza(), new Pasta(), new Pasta() };\nint suma = 0;\nforeach (Danie d in menu) suma += d.Czas();\nConsole.WriteLine($"Razem: {suma} min");\n\nclass Danie\n{\n    public virtual int Czas() => 5;\n}\n', tests: [{ i: '', o: 'Razem: 35 min' }], check: "if ((src.match(/override/g)||[]).length < 2) return 'Użyj override w obu klasach';",
     sol: c`Danie[] menu = { new Pizza(), new Pasta(), new Pasta() };
int suma = 0;
foreach (Danie d in menu) suma += d.Czas();
Console.WriteLine($"Razem: {suma} min");

class Danie
{
    public virtual int Czas() => 5;
}
class Pizza : Danie { public override int Czas() => 15; }
class Pasta : Danie { public override int Czas() => 10; }`, hint: 'class Pizza : Danie { public override int Czas() => 15; }' },
  ] },
 { id: 'abstrakcja', title: 'Klasy i metody abstrakcyjne',
  theory: `<p><b>Klasa abstrakcyjna</b> (<code>abstract class</code>) to klasa „niedokończona” – nie można tworzyć jej obiektów, służy tylko jako baza dla klas pochodnych. Może zawierać zwykłe pola i metody oraz <b>metody abstrakcyjne</b>.</p>
<p><b>Metoda abstrakcyjna</b> nie ma ciała – jest tylko deklaracją: <code>public abstract double Pole();</code>. Każda (nieabstrakcyjna) klasa pochodna <b>musi</b> ją nadpisać przez <code>override</code> – inaczej błąd CS0534.</p>
<p>Przykład: nie istnieje „figura w ogóle”, ale każda figura ma pole. Klasa <code>Figura</code> jest więc abstrakcyjna, a <code>Kolo</code> i <code>Kwadrat</code> – konkretne.</p>`,
  ex: [
   { code: c`List<Figura> figury = new List<Figura> { new Kolo(1), new Kwadrat(2), new Kolo(0.5) };
foreach (Figura f in figury)
{
    f.Opisz();
}

abstract class Figura
{
    public abstract string Nazwa { get; }
    public abstract double Pole();
    public void Opisz() => Console.WriteLine($"{Nazwa}: pole = {Pole():F2}");
}
class Kolo : Figura
{
    private double r;
    public Kolo(double r) { this.r = r; }
    public override string Nazwa => "Koło";
    public override double Pole() => Math.PI * r * r;
}
class Kwadrat : Figura
{
    private double a;
    public Kwadrat(double a) { this.a = a; }
    public override string Nazwa => "Kwadrat";
    public override double Pole() => a * a;
}`,
     scene: { s: 'inherit', base: { name: 'abstract Figura', members: ['abstract Pole()', 'Opisz()'] }, kids: [{ name: 'Kolo', members: ['override Pole()'], says: 'πr²' }, { name: 'Kwadrat', members: ['override Pole()'], says: 'a²' }], cap: 'Figura to tylko plan: mówi „każda figura ma Pole()”, ale wzór podaje dopiero konkretna klasa.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Czy można utworzyć obiekt klasy abstrakcyjnej przez <code>new</code>?', opts: ['Nie', 'Tak, zawsze', 'Tak, jeśli nie ma metod abstrakcyjnych', 'Tylko w metodzie Main'], a: 0, why: 'Klasa abstrakcyjna służy tylko jako baza (CS0144).' },
   { t: 'bug', l: 1, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Pojazd p = new Pojazd();
Console.WriteLine(p.Kola());

abstract class Pojazd
{
    public abstract int Kola();
}`, line: 0, fix: 'Pojazd p = new Rower();   // potrzebna klasa pochodna', fixcheck: false, why: 'Nie można tworzyć obiektów klasy abstrakcyjnej (CS0144) – trzeba utworzyć obiekt klasy pochodnej.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Zwierze z = new Kapibara();
Console.WriteLine(z.Glos());

abstract class Zwierze
{
    public abstract string Glos();
}
class Kapibara : Zwierze
{
    public string Jedzenie() => "trawa";
}`, line: 7, fix: 'public override string Glos() => "Kwik";   // dopisz w klasie Kapibara', fixcheck: false, why: 'Kapibara nie nadpisuje abstrakcyjnej metody Glos() (CS0534).' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`Postac p = new Wojownik();
p.Przedstaw();

abstract class Postac
{
    protected abstract string Klasa();
    public void Przedstaw() => Console.WriteLine("Jestem: " + Klasa());
}
class Wojownik : Postac
{
    protected override string Klasa() => "wojownik";
}`, opts: ['Jestem: wojownik', 'Jestem: ', 'Błąd kompilacji', 'Jestem: Postac'], a: 0, out: true, why: 'Zwykła metoda Przedstaw w klasie abstrakcyjnej wywołuje abstrakcyjną Klasa(), którą dostarcza Wojownik.' },
   { t: 'fill', l: 2, q: 'Uzupełnij deklarację metody abstrakcyjnej.', code: c`Kwadrat k = new Kwadrat();
Console.WriteLine(k.Obwod());

abstract class Figura
{
    public ___ double Obwod();
}
class Kwadrat : Figura
{
    public override double Obwod() => 4 * 2.5;
}`, ans: [['abstract']], expect: '10', why: 'Metoda bez ciała w klasie abstrakcyjnej to metoda abstract.' },
   { t: 'code', l: 3, q: 'Dopisz abstrakcyjną klasę <code>Pracownik</code> z polem <code>Imie</code>, konstruktorem i abstrakcyjną metodą <code>decimal Pensja()</code>, oraz klasy <code>Kucharz</code> (pensja 5000) i <code>Kelner</code> (3000 + napiwki podane w konstruktorze).',
     start: 'Pracownik[] ekipa = { new Kucharz("Kapi"), new Kelner("Ola", 450) };\ndecimal suma = 0;\nforeach (var p in ekipa) { Console.WriteLine($"{p.Imie}: {p.Pensja()}"); suma += p.Pensja(); }\nConsole.WriteLine($"Razem: {suma}");\n', tests: [{ i: '', o: 'Kapi: 5000\nOla: 3450\nRazem: 8450' }], check: "if (!/abstract\\s+class\\s+Pracownik/.test(src)) return 'Pracownik ma być klasą abstrakcyjną';",
     sol: c`Pracownik[] ekipa = { new Kucharz("Kapi"), new Kelner("Ola", 450) };
decimal suma = 0;
foreach (var p in ekipa) { Console.WriteLine($"{p.Imie}: {p.Pensja()}"); suma += p.Pensja(); }
Console.WriteLine($"Razem: {suma}");

abstract class Pracownik
{
    public string Imie;
    public Pracownik(string imie) { Imie = imie; }
    public abstract decimal Pensja();
}
class Kucharz : Pracownik
{
    public Kucharz(string imie) : base(imie) { }
    public override decimal Pensja() => 5000;
}
class Kelner : Pracownik
{
    private decimal napiwki;
    public Kelner(string imie, decimal napiwki) : base(imie) { this.napiwki = napiwki; }
    public override decimal Pensja() => 3000 + napiwki;
}`, hint: 'abstract class Pracownik { ... public abstract decimal Pensja(); }' },
  ] },
 { id: 'interfejsy', title: 'Interfejsy',
  theory: `<p><b>Interfejs</b> to „umowa”: lista metod i właściwości, które klasa <b>obiecuje</b> zaimplementować. Interfejs nie ma pól ani (zazwyczaj) kodu metod. Nazwy interfejsów zaczynamy od litery <b>I</b>:</p>
<pre>interface IPlywajacy
{
    void Plyn();
}
class Kapibara : Zwierze, IPlywajacy
{
    public void Plyn() =&gt; Console.WriteLine("Pływam!");
}</pre>
<p>Klasa może dziedziczyć po <b>jednej</b> klasie, ale implementować <b>wiele</b> interfejsów. Dzięki temu różne, niespokrewnione klasy (Kapibara, Statek, Kaczka) mogą mieć wspólną umiejętność <code>IPlywajacy</code>.</p>
<p>Zmienna typu interfejsu może przechowywać obiekt dowolnej klasy, która go implementuje – to też polimorfizm.</p>`,
  more: `<p>Klasa abstrakcyjna czy interfejs? <b>Klasa abstrakcyjna</b> – gdy klasy są spokrewnione i mają wspólny kod lub pola („jest rodzajem”). <b>Interfejs</b> – gdy opisujemy umiejętność, którą mogą mieć zupełnie różne klasy („potrafi”). Popularne interfejsy z .NET: <code>IComparable</code> (porównywanie – używa go sortowanie), <code>IDisposable</code> (zwalnianie zasobów, <code>using</code>).</p>`,
  ex: [
   { code: c`List<IPlywajacy> flota = new List<IPlywajacy> { new Kapibara(), new Statek("Perła"), new Kaczka() };
foreach (IPlywajacy p in flota)
{
    p.Plyn();
}
Console.WriteLine(new Kaczka() is ILatajacy);

interface IPlywajacy { void Plyn(); }
interface ILatajacy { void Lec(); }

class Kapibara : IPlywajacy
{
    public void Plyn() => Console.WriteLine("Kapibara pływa pieskiem 🐹");
}
class Statek : IPlywajacy
{
    public string Nazwa { get; }
    public Statek(string nazwa) { Nazwa = nazwa; }
    public void Plyn() => Console.WriteLine($"Statek {Nazwa} płynie pod żaglami ⛵");
}
class Kaczka : IPlywajacy, ILatajacy
{
    public void Plyn() => Console.WriteLine("Kaczka pływa 🦆");
    public void Lec() => Console.WriteLine("Kaczka leci");
}`,
     scene: { s: 'inherit', base: { name: 'interface IPlywajacy', members: ['void Plyn()'] }, kids: [{ name: 'Kapibara', members: ['Plyn()'], says: 'pieskiem' }, { name: 'Statek', members: ['Plyn()'], says: 'pod żaglami' }, { name: 'Kaczka', members: ['Plyn()', 'Lec()'], says: '+ ILatajacy' }], cap: 'Kapibara, statek i kaczka nie są spokrewnione, ale wszystkie podpisały tę samą umowę: potrafią Plyn().' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Ile interfejsów może implementować jedna klasa w C#?', opts: ['Dowolnie wiele', 'Tylko jeden', 'Maksymalnie dwa', 'Żadnego'], a: 0, why: 'Klasa ma jedną klasę bazową, ale może implementować wiele interfejsów.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`IGlos g = new Kapibara();
Console.WriteLine(g.Glos());

interface IGlos { string Glos(); }
class Kapibara : IGlos { public string Glos() => "Kwik"; }`, opts: ['Kwik', 'IGlos', 'Błąd', 'Kapibara'], a: 0, out: true, why: 'Zmienna typu interfejsu wskazuje obiekt Kapibara.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`ISuperMoc m = new Kapi();
m.Uzyj();

interface ISuperMoc
{
    void Uzyj();
    string Nazwa();
}
class Kapi : ISuperMoc
{
    public void Uzyj() => Console.WriteLine("Fala uderzeniowa!");
}`, line: 8, fix: 'public string Nazwa() => "Fala";   // dopisz w klasie Kapi', fixcheck: false, why: 'Klasa nie implementuje wszystkich składowych interfejsu – brakuje Nazwa() (CS0535).' },
   { t: 'quiz', l: 2, q: 'Kiedy lepiej wybrać interfejs niż klasę abstrakcyjną?', opts: ['Gdy opisujemy umiejętność, którą mogą mieć niespokrewnione klasy', 'Gdy chcemy mieć wspólne pola', 'Gdy klasa ma mieć konstruktor', 'Nigdy – interfejsy są przestarzałe'], a: 0, why: 'Interfejs mówi „potrafi”, klasa abstrakcyjna – „jest rodzajem”.' },
   { t: 'fill', l: 2, q: 'Uzupełnij deklarację interfejsu.', code: c`ISzef s = new Kapi();
Console.WriteLine(s.Gotuj());

___ ISzef
{
    string Gotuj();
}
class Kapi : ISzef { public string Gotuj() => "Pasta gotowa!"; }`, ans: [['interface']], expect: 'Pasta gotowa!', why: 'Interfejs deklarujemy słowem interface.' },
   { t: 'code', l: 3, q: 'Napisz interfejs <code>IPunktowany</code> z metodą <code>int Punkty()</code> oraz klasy <code>Moneta</code> (10 pkt) i <code>Skrzynia</code> (100 pkt), które go implementują.',
     start: 'IPunktowany[] lup = { new Moneta(), new Moneta(), new Skrzynia() };\nint suma = 0;\nforeach (var x in lup) suma += x.Punkty();\nConsole.WriteLine(suma);\n', tests: [{ i: '', o: '120' }],
     sol: c`IPunktowany[] lup = { new Moneta(), new Moneta(), new Skrzynia() };
int suma = 0;
foreach (var x in lup) suma += x.Punkty();
Console.WriteLine(suma);

interface IPunktowany { int Punkty(); }
class Moneta : IPunktowany { public int Punkty() => 10; }
class Skrzynia : IPunktowany { public int Punkty() => 100; }`, hint: 'interface IPunktowany { int Punkty(); }' },
  ] },
 ] });

CH.push({
 id: 'typy2', icon: { pirate: '💰', kitchen: '🧺', hero: '🎒' },
 name: { pirate: 'Ładownia Kolekcji', kitchen: 'Magazyn Składników', hero: 'Ekwipunek Drużyny', neutral: 'EnumStructKolekcje' },
 topic: 'enum, struct, List, Dictionary, Queue, Stack, HashSet, LINQ',
 outcomes: 'Deklaruje własne typy danych (wyliczenia, struktury); stosuje typy złożone i operacje na nich; korzysta z biblioteki z podstawowymi algorytmami i kolekcjami.',
 lessons: [
 { id: 'enumy', title: 'Typy wyliczeniowe (enum)',
  theory: `<p><b>Typ wyliczeniowy</b> (<code>enum</code>) to własny typ z ograniczoną listą nazwanych wartości:</p>
<pre>enum Pogoda { Slonce, Deszcz, Burza, Mgla }</pre>
<p>Zmienna typu <code>Pogoda</code> może mieć tylko jedną z tych wartości: <code>Pogoda p = Pogoda.Deszcz;</code>. Kod jest czytelniejszy niż „magiczne liczby” (np. 2 zamiast <code>Burza</code>) i kompilator pilnuje literówek.</p>
<p>Pod spodem każda wartość to liczba całkowita – domyślnie od 0 (<code>(int)Pogoda.Burza</code> → 2). Można nadać własne: <code>enum Ocena { Niedostateczny = 1, Dopuszczajacy = 2 }</code>.</p>
<p>Wartość enum wypisuje się jako nazwa, a świetnie współpracuje ze <code>switch</code>. <code>Enum.GetValues&lt;Pogoda&gt;()</code> zwraca wszystkie wartości.</p>`,
  ex: [
   { code: c`Pogoda p = Pogoda.Burza;
Console.WriteLine(p);
Console.WriteLine((int)p);
switch (p)
{
    case Pogoda.Slonce: Console.WriteLine("Kapi się opala ☀️"); break;
    case Pogoda.Burza: Console.WriteLine("Kapi chowa się w norze ⛈️"); break;
    default: Console.WriteLine("Kapi spaceruje"); break;
}
foreach (Pogoda x in Enum.GetValues<Pogoda>())
{
    Console.Write($"{x}={(int)x} ");
}
Console.WriteLine();
Kierunek k = (Kierunek)90;
Console.WriteLine(k);

enum Pogoda { Slonce, Deszcz, Burza, Mgla }
enum Kierunek { Polnoc = 0, Wschod = 90, Poludnie = 180, Zachod = 270 }`,
     scene: { s: 'dict', pairs: [['Slonce', '0'], ['Deszcz', '1'], ['Burza', '2'], ['Mgla', '3']], hl: 'Burza', cap: 'Każda szuflada enum ma nazwę i ukryty numer. Kapi wybiera szufladę po nazwie – nie musi pamiętać liczb.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Danie d = Danie.Pasta;
Console.WriteLine(d);

enum Danie { Zupa, Pasta, Deser }`, opts: ['Pasta', '1', 'Danie.Pasta', '2'], a: 0, out: true, why: 'Wartość enum wypisuje się jako nazwa.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Console.WriteLine((int)Ranga.Kapitan);

enum Ranga { Majtek, Bosman, Kapitan }`, opts: ['2', '3', '1', 'Kapitan'], a: 0, out: true, why: 'Numeracja zaczyna się od 0: Majtek = 0, Bosman = 1, Kapitan = 2.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`Poziom p = Poziom.Sredni;
p++;
Console.WriteLine(p + " " + (int)p);

enum Poziom { Latwy = 1, Sredni = 5, Trudny = 6 }`, opts: ['Trudny 6', 'Sredni 6', 'Trudny 3', 'Latwy 2'], a: 0, out: true, why: 'Sredni = 5, a 5 + 1 = 6, czyli Trudny.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`Kolor k = Kolor.Zielony;
int numer = k;
Console.WriteLine(numer);

enum Kolor { Czerwony, Zielony }`, line: 1, fix: 'int numer = (int)k;', why: 'Enum nie zamienia się niejawnie na int – trzeba rzutować (CS0266).' },
   { t: 'code', l: 2, q: 'Program wczytuje numer dnia 0–6. Zamień go na wartość <code>DzienTygodnia</code> i wypisz <code>NAZWA – weekend</code> albo <code>NAZWA – dzień roboczy</code>.',
     start: 'int n = int.Parse(Console.ReadLine());\n\nenum DzienTygodnia { Pon, Wt, Sr, Czw, Pt, Sob, Ndz }\n', tests: [{ i: '5', o: 'Sob – weekend' }, { i: '0', o: 'Pon – dzień roboczy' }, { i: '6', o: 'Ndz – weekend' }],
     sol: c`int n = int.Parse(Console.ReadLine());
DzienTygodnia d = (DzienTygodnia)n;
if (d == DzienTygodnia.Sob || d == DzienTygodnia.Ndz) Console.WriteLine($"{d} – weekend");
else Console.WriteLine($"{d} – dzień roboczy");

enum DzienTygodnia { Pon, Wt, Sr, Czw, Pt, Sob, Ndz }`, hint: 'DzienTygodnia d = (DzienTygodnia)n;' },
  ] },
 { id: 'struktury', title: 'Struktury (struct)',
  theory: `<p><b>Struktura</b> (<code>struct</code>) wygląda podobnie jak klasa – ma pola, metody, konstruktory – ale jest <b>typem wartościowym</b>:</p>
<ul><li>przy przypisaniu i przekazaniu do metody <b>kopiuje się cała wartość</b> (klasa kopiuje tylko odwołanie),</li>
<li>nie może dziedziczyć po innej strukturze ani klasie (może implementować interfejsy),</li>
<li>nadaje się do małych, prostych danych: punkt (X, Y), kolor (R, G, B), współrzędne.</li></ul>
<p>Typy <code>int</code>, <code>double</code>, <code>bool</code>, <code>char</code> to też struktury!</p>
<pre>struct Punkt
{
    public int X, Y;
    public Punkt(int x, int y) { X = x; Y = y; }
}</pre>`,
  ex: [
   { code: c`PunktS a = new PunktS(1, 2);
PunktS b = a;
b.X = 99;
Console.WriteLine($"struct: a=({a.X},{a.Y}) b=({b.X},{b.Y})");

PunktK c = new PunktK(1, 2);
PunktK d = c;
d.X = 99;
Console.WriteLine($"class:  c=({c.X},{c.Y}) d=({d.X},{d.Y})");

struct PunktS
{
    public int X, Y;
    public PunktS(int x, int y) { X = x; Y = y; }
}
class PunktK
{
    public int X, Y;
    public PunktK(int x, int y) { X = x; Y = y; }
}`,
     scene: { s: 'struct', a: '(1, 2)', b: '(99, 2)', c: '(99, 2)', cap: 'Struktura to jak ksero mapy: b dostaje własną kopię, więc a się nie zmienia. Klasa to jak dwie etykiety na tej samej mapie.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`P a = new P();
a.V = 5;
P b = a;
b.V = 8;
Console.WriteLine(a.V);

struct P { public int V; }`, opts: ['5', '8', '13', '0'], a: 0, out: true, why: 'Struktura kopiuje się przy przypisaniu – a i b to osobne wartości.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program (tym razem class)?', code: c`P a = new P();
a.V = 5;
P b = a;
b.V = 8;
Console.WriteLine(a.V);

class P { public int V; }`, opts: ['8', '5', '13', '0'], a: 0, out: true, why: 'Dla klasy a i b wskazują ten sam obiekt.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`static void Przesun(Punkt p) { p.X += 10; }
Punkt q = new Punkt { X = 1 };
Przesun(q);
Console.WriteLine(q.X);

struct Punkt { public int X; }`, opts: ['1', '11', '10', 'Błąd'], a: 0, out: true, why: 'Metoda dostaje kopię struktury – oryginał się nie zmienia.' },
   { t: 'quiz', l: 2, q: 'Który typ <b>nie</b> jest strukturą (typem wartościowym)?', opts: ['string', 'int', 'double', 'bool'], a: 0, why: 'string jest typem referencyjnym (choć zachowuje się podobnie dzięki niezmienności).' },
   { t: 'code', l: 2, q: 'Zadeklaruj strukturę <code>Kolor</code> z polami <code>R, G, B</code> (byte), konstruktorem i metodą <code>ToString()</code> zwracającą zapis <code>#RRGGBB</code> (hex, wielkie litery – użyj <code>{R:X2}</code>).',
     start: 'Kolor k = new Kolor(255, 128, 0);\nKolor kopia = k;\nkopia.B = 255;\nConsole.WriteLine(k);\nConsole.WriteLine(kopia);\n', tests: [{ i: '', o: '#FF8000\n#FF80FF' }], check: "if (!/struct\\s+Kolor/.test(src)) return 'Kolor ma być strukturą (struct)';",
     sol: c`Kolor k = new Kolor(255, 128, 0);
Kolor kopia = k;
kopia.B = 255;
Console.WriteLine(k);
Console.WriteLine(kopia);

struct Kolor
{
    public byte R, G, B;
    public Kolor(byte r, byte g, byte b) { R = r; G = g; B = b; }
    public override string ToString() => $"#{R:X2}{G:X2}{B:X2}";
}`, hint: 'public override string ToString() => $"#{R:X2}{G:X2}{B:X2}";' },
  ] },
 { id: 'kolekcje', title: 'Kolekcje: List, Dictionary, Queue, Stack',
  theory: `<p>Tablice mają stały rozmiar. <b>Kolekcje</b> z przestrzeni <code>System.Collections.Generic</code> mogą rosnąć i maleć:</p>
<ul><li><code>List&lt;T&gt;</code> – lista: <code>Add</code>, <code>Insert</code>, <code>Remove</code>, <code>RemoveAt</code>, <code>Contains</code>, <code>Sort</code>, <code>Count</code>, indeks <code>lista[0]</code>,</li>
<li><code>Dictionary&lt;K, V&gt;</code> – słownik klucz → wartość: <code>dict["kapi"] = 4</code>, <code>ContainsKey</code>, <code>TryGetValue</code>,</li>
<li><code>Queue&lt;T&gt;</code> – kolejka FIFO (pierwszy przyszedł – pierwszy wychodzi): <code>Enqueue</code>, <code>Dequeue</code>,</li>
<li><code>Stack&lt;T&gt;</code> – stos LIFO (ostatni włożony – pierwszy wyjęty): <code>Push</code>, <code>Pop</code>, <code>Peek</code>,</li>
<li><code>HashSet&lt;T&gt;</code> – zbiór bez powtórzeń.</li></ul>
<p><code>T</code> to typ elementów, np. <code>List&lt;string&gt;</code>. Kolekcje przechodzimy pętlą <code>foreach</code>. Uwaga: nie wolno dodawać ani usuwać elementów w trakcie <code>foreach</code> po tej samej kolekcji (<code>InvalidOperationException</code>).</p>`,
  more: `<p><b>LINQ</b> (<code>using System.Linq;</code>) dodaje do kolekcji wygodne metody: <code>Where</code> (filtrowanie), <code>Select</code> (przekształcanie), <code>OrderBy</code>, <code>Sum</code>, <code>Max</code>, <code>Average</code>, <code>Count</code>, <code>First</code>, <code>Any</code>. Np. <code>liczby.Where(x =&gt; x % 2 == 0).Sum()</code>. Zapis <code>x =&gt; x * 2</code> to <b>wyrażenie lambda</b> – krótka, anonimowa funkcja.</p>`,
  ex: [
   { code: c`List<string> zaloga = new List<string> { "Kapi", "Ola" };
zaloga.Add("Bob");
zaloga.Insert(0, "Kapitan Kapi");
zaloga.Remove("Kapi");
Console.WriteLine($"{zaloga.Count}: {string.Join(", ", zaloga)}");
Console.WriteLine(zaloga.Contains("Ola") + " " + zaloga[1]);

Dictionary<string, int> skarby = new Dictionary<string, int>();
skarby["złoto"] = 100;
skarby["perły"] = 30;
skarby["złoto"] += 50;
foreach (var para in skarby)
{
    Console.WriteLine($"{para.Key}: {para.Value}");
}
if (skarby.TryGetValue("rubiny", out int ile)) Console.WriteLine(ile);
else Console.WriteLine("Brak rubinów");`,
     scene: { s: 'dict', pairs: [['"złoto"', '150'], ['"perły"', '30']], hl: '"złoto"', cap: 'Słownik to szafka z podpisanymi szufladami. Kapi otwiera szufladę po kluczu "złoto", a nie po numerze.' } },
   { code: c`Queue<string> kolejka = new Queue<string>();
kolejka.Enqueue("pizza");
kolejka.Enqueue("pasta");
kolejka.Enqueue("zupa");
Console.WriteLine("Najpierw: " + kolejka.Dequeue());

Stack<string> talerze = new Stack<string>();
talerze.Push("talerz 1");
talerze.Push("talerz 2");
talerze.Push("talerz 3");
Console.WriteLine("Z góry: " + talerze.Pop());
Console.WriteLine($"Zostało w kolejce: {kolejka.Count}, na stosie: {talerze.Count}");

List<int> liczby = new List<int> { 5, 12, 7, 20, 3 };
Console.WriteLine(liczby.Where(x => x > 6).Sum());
Console.WriteLine(string.Join(" ", liczby.OrderBy(x => x)));`, lvl: 2,
     scene: { s: 'queue', kind: 'queue', items: ['pizza', 'pasta', 'zupa'], ops: ['-', '+deser'], cap: 'Kolejka zamówień w kuchni Kapi: kto pierwszy przyszedł, ten pierwszy dostaje danie (FIFO).' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`List<int> l = new List<int> { 3, 1, 2 };
l.Add(5);
l.Remove(1);
Console.WriteLine(l.Count + " " + l[1]);`, opts: ['3 2', '4 1', '3 1', '4 2'], a: 0, out: true, why: 'Po Add: 3,1,2,5. Po Remove(1): 3,2,5 → Count 3, l[1] = 2.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`Stack<int> s = new Stack<int>();
s.Push(1); s.Push(2); s.Push(3);
Console.WriteLine(s.Pop() + s.Pop());`, opts: ['5', '3', '6', '32'], a: 0, out: true, why: 'Stos oddaje najpierw ostatnio włożone: 3, potem 2 → 5.' },
   { t: 'quiz', l: 2, q: 'Jaki wyjątek zgłosi program?', code: c`var d = new Dictionary<string, int>();
d["kapi"] = 4;
Console.WriteLine(d["ola"]);`, opts: ['KeyNotFoundException', 'IndexOutOfRangeException', 'NullReferenceException', 'Wypisze 0'], a: 0, err: true, why: 'Klucza "ola" nie ma w słowniku.' },
   { t: 'bug', l: 2, q: 'Program zatrzymuje się z wyjątkiem. Kliknij linię z błędem.', code: c`List<int> l = new List<int> { 1, 2, 3, 4 };
foreach (int x in l)
{
    if (x % 2 == 0) l.Remove(x);
}
Console.WriteLine(l.Count);`, line: 3, fix: 'l.RemoveAll(x => x % 2 == 0);', fixcheck: false, cause: true, why: 'Nie wolno zmieniać listy w trakcie foreach (InvalidOperationException). Użyj l.RemoveAll(x => x % 2 == 0) poza pętlą.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`var l = new List<int> { 4, 9, 2, 7 };
Console.WriteLine(l.Where(x => x > 3).Count());
Console.WriteLine(l.Select(x => x * 10).Max());`, opts: ['3\n90', '2\n90', '3\n9', '4\n90'], a: 0, out: true, why: 'Większe od 3: 4, 9, 7 → 3 sztuki. Maksimum po pomnożeniu przez 10 to 90.' },
   { t: 'code', l: 2, q: 'Wczytuj słowa (każde w osobnej linii) aż do słowa <code>koniec</code>. Wypisz każde różne słowo z liczbą wystąpień w kolejności pierwszego pojawienia się, w formacie <code>słowo: N</code>. Użyj <code>Dictionary&lt;string, int&gt;</code>.',
     start: '// Twój kod\n', tests: [{ i: 'kapi\nola\nkapi\nkoniec', o: 'kapi: 2\nola: 1' }, { i: 'koniec', o: '' }], check: "if (!/Dictionary/.test(src)) return 'Użyj Dictionary<string, int>';",
     sol: c`var licznik = new Dictionary<string, int>();
string s = Console.ReadLine();
while (s != "koniec")
{
    if (licznik.ContainsKey(s)) licznik[s]++;
    else licznik[s] = 1;
    s = Console.ReadLine();
}
foreach (var p in licznik) Console.WriteLine($"{p.Key}: {p.Value}");`, hint: 'if (licznik.ContainsKey(s)) licznik[s]++; else licznik[s] = 1;' },
   { t: 'code', l: 3, q: 'Kolejka do kapibarzej łaźni: wczytaj <code>n</code>, potem n imion i dodaj je do <code>Queue&lt;string&gt;</code>. Obsługuj klientów po kolei: wypisz <code>Kąpie się: IMIĘ (czeka jeszcze K)</code>.',
     start: '// Twój kod\n', tests: [{ i: '3\nKapi\nOla\nBob', o: 'Kąpie się: Kapi (czeka jeszcze 2)\nKąpie się: Ola (czeka jeszcze 1)\nKąpie się: Bob (czeka jeszcze 0)' }], check: "if (!/Queue/.test(src)) return 'Użyj Queue<string>';",
     sol: c`int n = int.Parse(Console.ReadLine());
var q = new Queue<string>();
for (int i = 0; i < n; i++) q.Enqueue(Console.ReadLine());
while (q.Count > 0)
{
    string im = q.Dequeue();
    Console.WriteLine($"Kąpie się: {im} (czeka jeszcze {q.Count})");
}`, hint: 'while (q.Count > 0) { string im = q.Dequeue(); ... }' },
  ] },
 ] });

CH.push({
 id: 'wyjatki', icon: { pirate: '🌊', kitchen: '🔥', hero: '🚨' },
 name: { pirate: 'Sztormowe Wyjątki', kitchen: 'Przypalone Wyjątki', hero: 'Awaryjna Misja', neutral: 'WyjatkiIPliki' },
 topic: 'try, catch, finally, throw, własne wyjątki, obsługa plików',
 outcomes: 'Programuje obsługę wyjątków; stosuje szkielet try-catch i instrukcję throw; opracowuje listę możliwych błędów wykonania aplikacji i definiuje ich obsługę; obsługuje pliki tekstowe.',
 lessons: [
 { id: 'trycatch', title: 'Przechwytywanie wyjątków: try / catch / finally',
  theory: `<p><b>Wyjątek</b> (exception) to błąd w trakcie działania programu, np. dzielenie przez zero, zły format liczby, brak pliku. Nieobsłużony wyjątek zatrzymuje program.</p>
<p>Wyjątki przechwytujemy blokiem <code>try</code>/<code>catch</code>:</p>
<pre>try
{
    int x = int.Parse(Console.ReadLine());   // tu może być błąd
}
catch (FormatException)
{
    Console.WriteLine("To nie jest liczba!");
}
finally
{
    Console.WriteLine("To wykona się zawsze");
}</pre>
<ul><li>W <code>try</code> umieszczamy kod, który może zgłosić wyjątek.</li>
<li><code>catch (TypWyjatku e)</code> obsługuje wybrany typ. Bloków catch może być kilka – od najbardziej szczegółowego do ogólnego <code>catch (Exception e)</code>.</li>
<li><code>e.Message</code> zawiera opis błędu.</li>
<li><code>finally</code> wykonuje się zawsze – czy był wyjątek, czy nie (np. do zamknięcia pliku).</li></ul>`,
  more: `<p>Najczęstsze wyjątki: <code>FormatException</code> (zły format tekstu), <code>DivideByZeroException</code>, <code>IndexOutOfRangeException</code>, <code>NullReferenceException</code>, <code>ArgumentOutOfRangeException</code>, <code>KeyNotFoundException</code>, <code>InvalidOperationException</code>, <code>OverflowException</code>, <code>FileNotFoundException</code>. Wszystkie dziedziczą po <code>Exception</code>. Nie łap wyjątków „na ślepo” i nie zostawiaj pustego <code>catch { }</code> – ukrywa to błędy.</p>`,
  ex: [
   { code: c`string[] dane = { "12", "kapi", "0" };
foreach (string d in dane)
{
    try
    {
        int n = int.Parse(d);
        Console.WriteLine($"100 / {n} = {100 / n}");
    }
    catch (FormatException)
    {
        Console.WriteLine($"'{d}' to nie liczba!");
    }
    catch (DivideByZeroException e)
    {
        Console.WriteLine("Błąd: " + e.Message);
    }
    finally
    {
        Console.WriteLine("--- sprawdzono: " + d);
    }
}
Console.WriteLine("Program działa dalej 🐹");`,
     scene: { s: 'err', err: 'catch (FormatException) / catch (DivideByZeroException)', caught: true, cap: 'Kapi ma tarczę: błędy odbijają się od bloków catch, a program płynie dalej. Bez try/catch statek by zatonął.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`try
{
    int[] t = new int[2];
    t[5] = 1;
    Console.WriteLine("A");
}
catch (IndexOutOfRangeException)
{
    Console.WriteLine("B");
}
Console.WriteLine("C");`, opts: ['B\nC', 'A\nB\nC', 'A\nC', 'C'], a: 0, out: true, why: 'Wyjątek przerywa try przed wypisaniem A; catch wypisuje B, a potem program idzie dalej.' },
   { t: 'quiz', l: 1, q: 'Kiedy wykonuje się blok <code>finally</code>?', opts: ['Zawsze – po try lub po catch', 'Tylko gdy wystąpił wyjątek', 'Tylko gdy nie było wyjątku', 'Nigdy, gdy jest catch'], a: 0, why: 'finally służy do sprzątania i wykonuje się zawsze.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`try
{
    Console.Write("1");
    int x = int.Parse("x");
    Console.Write("2");
}
catch (DivideByZeroException) { Console.Write("3"); }
catch (Exception) { Console.Write("4"); }
finally { Console.Write("5"); }`, opts: ['145', '1245', '135', '15'], a: 0, out: true, why: 'FormatException nie pasuje do pierwszego catch, ale pasuje do ogólnego Exception; finally zawsze.' },
   { t: 'fill', l: 1, q: 'Uzupełnij, aby obsłużyć błędny format liczby.', code: c`try
{
    int n = int.Parse("pięć");
    Console.WriteLine(n);
}
___ (FormatException)
{
    Console.WriteLine("Zły format");
}`, ans: [['catch']], expect: 'Zły format', why: 'Wyjątki obsługujemy w bloku catch.' },
   { t: 'quiz', l: 3, q: 'Co wypisze program?', code: c`static int Test()
{
    try { return 1; }
    finally { Console.Write("F"); }
}
Console.WriteLine(Test());`, opts: ['F1', '1F', '1', 'F'], a: 0, out: true, why: 'finally wykonuje się jeszcze przed opuszczeniem metody – nawet przy return.' },
   { t: 'code', l: 2, q: 'Wczytaj dwie linie i wypisz wynik dzielenia całkowitego. Obsłuż błędy: zły format → <code>Zły format liczby</code>, dzielenie przez zero → <code>Nie dziel przez zero!</code>.',
     start: 'string a = Console.ReadLine();\nstring b = Console.ReadLine();\n', tests: [{ i: '17\n5', o: '3' }, { i: '7\n0', o: 'Nie dziel przez zero!' }, { i: 'x\n2', o: 'Zły format liczby' }], check: "if (!/catch/.test(src)) return 'Użyj try/catch';",
     sol: c`string a = Console.ReadLine();
string b = Console.ReadLine();
try
{
    Console.WriteLine(int.Parse(a) / int.Parse(b));
}
catch (FormatException)
{
    Console.WriteLine("Zły format liczby");
}
catch (DivideByZeroException)
{
    Console.WriteLine("Nie dziel przez zero!");
}`, hint: 'Dwa bloki catch: FormatException i DivideByZeroException.' },
  ] },
 { id: 'throw', title: 'throw, własne wyjątki i lista błędów',
  theory: `<p>Instrukcja <code>throw</code> <b>zgłasza</b> wyjątek. Używamy jej, gdy metoda dostaje niepoprawne dane i nie może poprawnie działać:</p>
<pre>if (kwota &lt;= 0)
    throw new ArgumentException("Kwota musi być dodatnia");</pre>
<p>Możemy tworzyć <b>własne wyjątki</b> – klasy dziedziczące po <code>Exception</code>:</p>
<pre>class BrakPaliwaException : Exception
{
    public BrakPaliwaException(string msg) : base(msg) { }
}</pre>
<p>Projektując aplikację, warto przygotować <b>listę możliwych błędów wykonania</b> i dla każdego zdecydować o obsłudze, np.:</p>
<ul><li>użytkownik wpisze tekst zamiast liczby → <code>TryParse</code> albo <code>catch (FormatException)</code> i ponowne pytanie,</li>
<li>wartość spoza zakresu → <code>throw new ArgumentOutOfRangeException</code> w metodzie, komunikat w interfejsie,</li>
<li>brak pliku → <code>File.Exists</code> albo <code>catch (FileNotFoundException)</code> i utworzenie pliku domyślnego,</li>
<li>pusta kolekcja → sprawdzenie <code>Count &gt; 0</code> przed pobraniem elementu.</li></ul>`,
  more: `<p>Samo <code>throw;</code> w bloku catch zgłasza ten sam wyjątek dalej (po np. zapisaniu go w logu). Filtr <code>catch (Exception e) when (warunek)</code> łapie wyjątek tylko wtedy, gdy warunek jest prawdziwy.</p>`,
  ex: [
   { code: c`Statek s = new Statek(30);
try
{
    s.Plyn(10);
    s.Plyn(50);
}
catch (BrakPaliwaException e)
{
    Console.WriteLine("⚓ " + e.Message);
}
try
{
    s.Plyn(-5);
}
catch (ArgumentException e)
{
    Console.WriteLine("❌ " + e.Message);
}

class BrakPaliwaException : Exception
{
    public BrakPaliwaException(string msg) : base(msg) { }
}
class Statek
{
    private int paliwo;
    public Statek(int paliwo) { this.paliwo = paliwo; }
    public void Plyn(int mile)
    {
        if (mile <= 0) throw new ArgumentException("Liczba mil musi być dodatnia");
        if (mile > paliwo) throw new BrakPaliwaException($"Brak paliwa na {mile} mil (zostało {paliwo})");
        paliwo -= mile;
        Console.WriteLine($"Płyniemy {mile} mil, paliwo: {paliwo}");
    }
}`,
     scene: { s: 'err', err: 'throw new BrakPaliwaException(...)', caught: true, cap: 'Metoda Plyn podnosi czerwoną flagę (throw), gdy nie może wykonać zadania, a kapitan Kapi łapie ją w catch i decyduje, co dalej.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Jak zgłosić wyjątek w C#?', opts: ['throw new Exception("opis");', 'raise Exception("opis");', 'catch new Exception();', 'error("opis");'], a: 0, why: 'Wyjątek zgłaszamy instrukcją throw z nowym obiektem wyjątku.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`try
{
    throw new InvalidOperationException("Kapi śpi");
}
catch (Exception e)
{
    Console.WriteLine(e.Message);
}`, opts: ['Kapi śpi', 'InvalidOperationException', 'Exception', 'nic'], a: 0, out: true, why: 'Message zawiera tekst przekazany w konstruktorze.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`try
{
    throw new PustyGarnekException();
}
catch (PustyGarnekException e)
{
    Console.WriteLine(e.GetType().Name);
}

class PustyGarnekException : Exception { }`, opts: ['PustyGarnekException', 'Exception', 'Garnek', 'Błąd kompilacji'], a: 0, out: true, why: 'GetType().Name zwraca nazwę klasy obiektu wyjątku.' },
   { t: 'bug', l: 2, q: 'Kompilator zgłasza błąd. Kliknij linię z błędem.', code: c`try
{
    throw new Skarb();
}
catch (Exception) { Console.WriteLine("?"); }

class Skarb { }`, line: 2, fix: 'throw new Exception("Skarb!");', why: 'Zgłaszać można tylko obiekty klas dziedziczących po Exception (CS0155).' },
   { t: 'fill', l: 2, q: 'Uzupełnij własną klasę wyjątku.', code: c`try { throw new ZaGoraceException("Uwaga, gorące!"); }
catch (ZaGoraceException e) { Console.WriteLine(e.Message); }

class ZaGoraceException : ___
{
    public ZaGoraceException(string m) : base(m) { }
}`, ans: [['Exception']], expect: 'Uwaga, gorące!', why: 'Własne wyjątki dziedziczą po Exception.' },
   { t: 'code', l: 3, q: 'Napisz metodę <code>static int Wiek(string tekst)</code>, która zamienia tekst na liczbę i zgłasza <code>ArgumentOutOfRangeException</code>, gdy wiek jest spoza 0–150. Program wczytuje linię i wypisuje <code>OK: N</code>, <code>Poza zakresem</code> albo <code>To nie liczba</code>.',
     start: 'string s = Console.ReadLine();\n', tests: [{ i: '15', o: 'OK: 15' }, { i: '200', o: 'Poza zakresem' }, { i: 'abc', o: 'To nie liczba' }], check: "if (!/throw/.test(src)) return 'Użyj throw w metodzie Wiek';",
     sol: c`static int Wiek(string tekst)
{
    int w = int.Parse(tekst);
    if (w < 0 || w > 150) throw new ArgumentOutOfRangeException(nameof(tekst));
    return w;
}
string s = Console.ReadLine();
try { Console.WriteLine($"OK: {Wiek(s)}"); }
catch (ArgumentOutOfRangeException) { Console.WriteLine("Poza zakresem"); }
catch (FormatException) { Console.WriteLine("To nie liczba"); }`, hint: 'throw new ArgumentOutOfRangeException(nameof(tekst));' },
  ] },
 { id: 'pliki', title: 'Obsługa plików',
  theory: `<p>Klasa <code>File</code> (przestrzeń <code>System.IO</code>) ma proste metody do pracy z plikami tekstowymi:</p>
<ul><li><code>File.WriteAllText(sciezka, tekst)</code> – zapisuje (nadpisuje) plik,</li>
<li><code>File.AppendAllText(sciezka, tekst)</code> – dopisuje na końcu,</li>
<li><code>File.ReadAllText(sciezka)</code> – czyta cały plik jako jeden string,</li>
<li><code>File.ReadAllLines(sciezka)</code> – czyta plik jako tablicę linii,</li>
<li><code>File.WriteAllLines(sciezka, linie)</code>, <code>File.Exists(sciezka)</code>, <code>File.Delete(sciezka)</code>.</li></ul>
<p>Dla dużych plików używa się strumieni: <code>StreamWriter</code> (zapis) i <code>StreamReader</code> (odczyt linia po linii). Zamykamy je blokiem <code>using</code>, który automatycznie wywoła <code>Dispose()</code> – nawet przy wyjątku.</p>
<p>Brak pliku przy odczycie kończy się wyjątkiem <code>FileNotFoundException</code>.</p>
<p>W KapiPasta pliki są wirtualne – istnieją tylko w pamięci, w trakcie działania programu.</p>`,
  ex: [
   { code: c`using System.IO;

File.WriteAllText("dziennik.txt", "Dzień 1: wypłynęliśmy\n");
File.AppendAllText("dziennik.txt", "Dzień 2: sztorm!\n");
File.AppendAllText("dziennik.txt", "Dzień 3: wyspa ze skarbem\n");

string[] linie = File.ReadAllLines("dziennik.txt");
Console.WriteLine($"Wpisów: {linie.Length}");
foreach (string l in linie) Console.WriteLine("📜 " + l);

using (StreamWriter w = new StreamWriter("skarby.csv"))
{
    w.WriteLine("złoto;100");
    w.WriteLine("perły;30");
}
using (StreamReader r = new StreamReader("skarby.csv"))
{
    string wiersz;
    int suma = 0;
    while ((wiersz = r.ReadLine()) != null)
    {
        string[] pola = wiersz.Split(';');
        suma += int.Parse(pola[1]);
    }
    Console.WriteLine("Wartość skarbów: " + suma);
}
Console.WriteLine(File.Exists("mapa.txt"));`,
     scene: { s: 'file', name: 'dziennik.txt', lines: ['Dzień 1: wypłynęliśmy', 'Dzień 2: sztorm!', 'Dzień 3: wyspa ze skarbem'], cap: 'Kapi prowadzi dziennik pokładowy: WriteAllText zaczyna nowy zwój, AppendAllText dopisuje na końcu, a ReadAllLines czyta wszystkie linie.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Która metoda <b>dopisuje</b> tekst na końcu pliku (nie kasując zawartości)?', opts: ['File.AppendAllText', 'File.WriteAllText', 'File.ReadAllText', 'File.Create'], a: 0, why: 'WriteAllText nadpisuje plik, AppendAllText dopisuje.' },
   { t: 'quiz', l: 1, q: 'Co wypisze program?', code: c`File.WriteAllText("a.txt", "raz\n");
File.WriteAllText("a.txt", "dwa\n");
Console.Write(File.ReadAllText("a.txt"));`, opts: ['dwa', 'raz\ndwa', 'raz', 'dwa\nraz'], a: 0, out: true, why: 'Drugie WriteAllText nadpisało plik.' },
   { t: 'quiz', l: 2, q: 'Jaki wyjątek zgłosi program?', code: c`string t = File.ReadAllText("nie_ma_mnie.txt");`, opts: ['FileNotFoundException', 'NullReferenceException', 'FormatException', 'IOException nie istnieje'], a: 0, err: true, why: 'Pliku nie ma, więc odczyt kończy się FileNotFoundException.' },
   { t: 'fill', l: 2, q: 'Uzupełnij, aby wczytać plik linia po linii do tablicy.', code: c`File.WriteAllText("lista.txt", "pomarańcze\narbuz\n");
string[] t = File.___("lista.txt");
Console.WriteLine(t.Length);`, ans: [['ReadAllLines']], expect: '2', why: 'ReadAllLines zwraca tablicę linii.' },
   { t: 'code', l: 2, q: 'Plik <code>oceny.txt</code> zawiera w każdej linii jedną ocenę (liczbę całkowitą). Wypisz średnią z dokładnością do 2 miejsc oraz liczbę ocen w formacie <code>Średnia: X (N ocen)</code>.',
     start: '// plik oceny.txt już istnieje\n', files: { 'oceny.txt': '5\n4\n3\n5\n6\n' }, tests: [{ i: '', o: 'Średnia: 4.60 (5 ocen)' }],
     sol: c`string[] linie = File.ReadAllLines("oceny.txt");
int suma = 0;
foreach (string l in linie) suma += int.Parse(l);
Console.WriteLine($"Średnia: {(double)suma / linie.Length:F2} ({linie.Length} ocen)");`, hint: 'File.ReadAllLines("oceny.txt") i int.Parse dla każdej linii.' },
   { t: 'code', l: 3, q: 'Wczytaj <code>n</code> i n imion (każde w linii). Zapisz je do pliku <code>zaloga.txt</code> w kolejności alfabetycznej (jedno na linię), a potem odczytaj plik i wypisz jego zawartość. Sprawdzamy też zawartość pliku!',
     start: '// Twój kod\n', tests: [{ i: '3\nOla\nKapi\nBob', o: 'Bob\nKapi\nOla' }], check: "if (!files['zaloga.txt'] || files['zaloga.txt'].replace(/\\r/g,'').trim() !== input.split('\\n').slice(1).sort((a,b)=>a.localeCompare(b,'en')).join('\\n')) return 'Plik zaloga.txt ma zawierać posortowane imiona';",
     sol: c`int n = int.Parse(Console.ReadLine());
List<string> imiona = new List<string>();
for (int i = 0; i < n; i++) imiona.Add(Console.ReadLine());
imiona.Sort();
File.WriteAllLines("zaloga.txt", imiona);
Console.Write(File.ReadAllText("zaloga.txt"));`, hint: 'List<string>, Sort(), File.WriteAllLines, File.ReadAllText.' },
  ] },
 ] });

CH.push({
 id: 'algorytmy', icon: { pirate: '🗺️', kitchen: '📏', hero: '🧠' },
 name: { pirate: 'Mapa Algorytmów', kitchen: 'Techniki Kulinarne', hero: 'Strategie Herosa', neutral: 'Algorytmy' },
 topic: 'wyszukiwanie, sortowanie, liczby pierwsze, biblioteki algorytmów',
 outcomes: 'Implementuje algorytmy w programie; korzysta z biblioteki standardowej, matematycznej i biblioteki z podstawowymi algorytmami.',
 lessons: [
 { id: 'algo', title: 'Wyszukiwanie, sortowanie i liczby',
  theory: `<p><b>Algorytm</b> to przepis krok po kroku na rozwiązanie problemu. Klasyki, które warto umieć napisać samodzielnie:</p>
<ul><li><b>Wyszukiwanie liniowe</b> – sprawdzamy elementy po kolei, aż znajdziemy szukany (do n porównań).</li>
<li><b>Wyszukiwanie binarne</b> – w tablicy <b>posortowanej</b> porównujemy ze środkiem i odrzucamy połowę (około log₂ n porównań).</li>
<li><b>Sortowanie bąbelkowe</b> – porównujemy sąsiadów i zamieniamy, jeśli są w złej kolejności. Po każdym przejściu największy element „wypływa” na koniec.</li>
<li><b>Liczba pierwsza</b> – dzieli się tylko przez 1 i siebie. Wystarczy sprawdzić dzielniki do √n.</li>
<li><b>NWD</b> – algorytm Euklidesa: <code>NWD(a, b) = NWD(b, a % b)</code>.</li></ul>
<p>W praktyce korzystamy z <b>bibliotek</b>: <code>Array.Sort</code>, <code>List.Sort</code>, <code>Array.BinarySearch</code>, <code>Math.Sqrt</code>, <code>Math.Max</code>, LINQ (<code>Max</code>, <code>OrderBy</code>). Są szybkie i sprawdzone. Własne implementacje uczą jednak myślenia algorytmicznego – a o nie pytają na egzaminie zawodowym.</p>`,
  ex: [
   { code: c`int[] t = { 64, 25, 12, 22, 11 };
for (int i = 0; i < t.Length - 1; i++)
{
    for (int j = 0; j < t.Length - 1 - i; j++)
    {
        if (t[j] > t[j + 1])
        {
            int tmp = t[j];
            t[j] = t[j + 1];
            t[j + 1] = tmp;
        }
    }
}
Console.WriteLine(string.Join(" ", t));`,
     scene: { s: 'sort', arr: [64, 25, 12, 22, 11], cap: 'Kapibary ustawiają się od najniższej do najwyższej. Sąsiedzi porównują się i zamieniają miejscami – największa wypływa na koniec jak bąbelek.' } },
   { code: c`static int Liniowe(int[] t, int x)
{
    for (int i = 0; i < t.Length; i++)
        if (t[i] == x) return i;
    return -1;
}
static int Binarne(int[] t, int x)
{
    int lewy = 0, prawy = t.Length - 1;
    while (lewy <= prawy)
    {
        int srodek = (lewy + prawy) / 2;
        if (t[srodek] == x) return srodek;
        if (t[srodek] < x) lewy = srodek + 1;
        else prawy = srodek - 1;
    }
    return -1;
}
static bool CzyPierwsza(int n)
{
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++)
        if (n % d == 0) return false;
    return true;
}
int[] posortowane = { 3, 8, 15, 23, 42, 57, 91 };
Console.WriteLine(Liniowe(posortowane, 42) + " " + Binarne(posortowane, 42) + " " + Binarne(posortowane, 5));
for (int i = 1; i <= 30; i++) if (CzyPierwsza(i)) Console.Write(i + " ");`, lvl: 2,
     scene: { s: 'search', items: ['3', '8', '15', '23', '42', '57', '91'], target: '42', cap: 'Wyszukiwanie liniowe: Kapi zagląda do każdej norki po kolei, aż znajdzie 42. Binarne w posortowanej tablicy od razu skacze na środek.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Jaki warunek musi spełniać tablica, aby można było użyć wyszukiwania binarnego?', opts: ['Musi być posortowana', 'Musi mieć parzystą długość', 'Musi zawierać liczby dodatnie', 'Nie może mieć powtórzeń'], a: 0, why: 'Binarne wyszukiwanie odrzuca połowę na podstawie porządku elementów.' },
   { t: 'quiz', l: 2, q: 'Ile porównań w najgorszym przypadku wykona wyszukiwanie binarne w tablicy 1000 elementów?', opts: ['około 10', 'około 500', '1000', 'około 100'], a: 0, why: 'Za każdym razem odrzucamy połowę: 2¹⁰ = 1024, więc około 10 kroków.' },
   { t: 'quiz', l: 2, q: 'Co wypisze program?', code: c`int[] t = { 5, 1, 4 };
for (int j = 0; j < t.Length - 1; j++)
{
    if (t[j] > t[j + 1]) { int x = t[j]; t[j] = t[j + 1]; t[j + 1] = x; }
}
Console.WriteLine(string.Join(",", t));`, opts: ['1,4,5', '1,5,4', '5,1,4', '4,1,5'], a: 0, out: true, why: 'Jedno przejście bąbelkowe: (5,1) → zamiana, (5,4) → zamiana. 5 trafia na koniec.' },
   { t: 'bug', l: 3, q: 'Funkcja ma sprawdzać, czy liczba jest pierwsza, ale dla 9 zwraca True. Kliknij linię z błędem.', code: c`static bool Pierwsza(int n)
{
    if (n < 2) return false;
    for (int d = 2; d * d < n; d++)
        if (n % d == 0) return false;
    return true;
}
Console.WriteLine(Pierwsza(9));`, line: 3, fix: 'for (int d = 2; d * d <= n; d++)', noerr: true, expect: 'False', why: 'Dla n = 9 trzeba sprawdzić d = 3 (3 · 3 = 9). Warunek musi być d * d <= n.' },
   { t: 'code', l: 2, q: 'Wczytaj <code>n</code> i wypisz wszystkie liczby pierwsze ≤ n oddzielone spacją. Napisz metodę <code>CzyPierwsza</code>.',
     start: 'int n = int.Parse(Console.ReadLine());\n', tests: [{ i: '20', o: '2 3 5 7 11 13 17 19' }, { i: '2', o: '2' }],
     sol: c`static bool CzyPierwsza(int n)
{
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++) if (n % d == 0) return false;
    return true;
}
int n = int.Parse(Console.ReadLine());
List<int> p = new List<int>();
for (int i = 2; i <= n; i++) if (CzyPierwsza(i)) p.Add(i);
Console.WriteLine(string.Join(" ", p));`, hint: 'Zbieraj liczby do List<int> i wypisz string.Join(" ", lista).' },
   { t: 'code', l: 3, q: 'Zaimplementuj <b>sortowanie bąbelkowe</b> (bez Array.Sort, List.Sort i LINQ). Wczytaj n i n liczb, wypisz je posortowane malejąco.',
     start: 'int n = int.Parse(Console.ReadLine());\nint[] t = new int[n];\nfor (int i = 0; i < n; i++) t[i] = int.Parse(Console.ReadLine());\n', tests: [{ i: '5\n3\n9\n1\n7\n3', o: '9 7 3 3 1' }, { i: '1\n4', o: '4' }], check: "if (/\\.Sort\\(|OrderBy/.test(src)) return 'Napisz sortowanie samodzielnie';",
     sol: c`int n = int.Parse(Console.ReadLine());
int[] t = new int[n];
for (int i = 0; i < n; i++) t[i] = int.Parse(Console.ReadLine());
for (int i = 0; i < n - 1; i++)
    for (int j = 0; j < n - 1 - i; j++)
        if (t[j] < t[j + 1]) { int x = t[j]; t[j] = t[j + 1]; t[j + 1] = x; }
Console.WriteLine(string.Join(" ", t));`, hint: 'Dla kolejności malejącej zamieniaj, gdy t[j] < t[j + 1].' },
  ] },
 ] });
