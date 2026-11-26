// Dział 15 (WPF – grafika, animacje, 3D, strony): dodatkowe zadania.

X('ksztalty', [
  QZ(1, 'Która właściwość ustawia <b>grubość obrysu</b> kształtu?', 'Which property sets the <b>outline thickness</b> of a shape?', ['StrokeThickness', 'Stroke', 'Fill', 'Width'], null, 'Stroke to kolor obrysu, StrokeThickness – jego grubość.', 'Stroke is the outline colour, StrokeThickness its thickness.'),
  QZ(1, 'Jakim kształtem narysujesz trójkąt?', 'Which shape do you use to draw a triangle?', ['Polygon z trzema punktami', 'Rectangle', 'Ellipse', 'Line z RadiusX'], ['A Polygon with three points', 'Rectangle', 'Ellipse', 'Line with RadiusX'], 'Polygon łączy punkty z Points i zamyka figurę.', 'A Polygon connects the Points and closes the figure.'),
  XFILL(2, 'Uzupełnij, aby prostokąt miał zaokrąglone rogi o promieniu 10.', 'Fill in the gaps so that the rectangle has rounded corners with radius 10.', WX('Kapi', 200, 300, `    <Rectangle Width="120" Height="60" Fill="Orange" ___="10" ___="10"/>`), [['RadiusX'], ['RadiusY']], 'Zaokrąglenie rogów ustawiają RadiusX i RadiusY.', 'Rounded corners are set with RadiusX and RadiusY.'),
  WC(3, 'Narysuj z kodu C# w konstruktorze 5 kół (Ellipse 20×20, Fill = Brushes.Orange) w rzędzie na Canvas <code>board</code>: Canvas.Left = 10, 40, 70, 100, 130, Canvas.Top = 50. Użyj pętli.', 'In the constructor draw 5 circles (Ellipse 20×20, Fill = Brushes.Orange) in a row on the Canvas <code>board</code> from C# code: Canvas.Left = 10, 40, 70, 100, 130, Canvas.Top = 50. Use a loop.',
    { 'MainWindow.xaml': WX('Circles', 200, 300, `    <Canvas x:Name="board"/>`), 'MainWindow.xaml.cs': CSW(CTOR).replace('using System.Windows.Media;', 'using System.Windows.Media;\nusing System.Windows.Shapes;') },
    { 'MainWindow.xaml': WX('Circles', 200, 300, `    <Canvas x:Name="board"/>`), 'MainWindow.xaml.cs': CSW(`        public MainWindow()
        {
            InitializeComponent();
            for (int i = 0; i < 5; i++)
            {
                Ellipse c = new Ellipse { Width = 20, Height = 20, Fill = Brushes.Orange };
                Canvas.SetLeft(c, 10 + i * 30);
                Canvas.SetTop(c, 50);
                board.Children.Add(c);
            }
        }`).replace('using System.Windows.Media;', 'using System.Windows.Media;\nusing System.Windows.Shapes;') },
    "const e = ui.byType('Ellipse'); if (e.length !== 5) return '«Na Canvas ma być 5 kół (jest |The Canvas should hold 5 circles (there are »' + e.length + ')'; const xs = e.map(x => x.att['Canvas.Left']).join(','); if (xs !== '10,40,70,100,130') return '«Canvas.Left: 10, 40, 70, 100, 130 (jest |Canvas.Left: 10, 40, 70, 100, 130 (it is »' + xs + ')'; if (e.some(x => x.att['Canvas.Top'] !== 50 || x.p.Width !== 20)) return '«Koła 20×20, Canvas.Top = 50|Circles 20×20, Canvas.Top = 50»'; if (e.some(x => !x.p.Fill || String(x.p.Fill.color).toLowerCase() !== 'orange')) return '«Fill = Brushes.Orange|Fill = Brushes.Orange»'; return '';",
    'new Ellipse { ... }, Canvas.SetLeft(c, 10 + i * 30), board.Children.Add(c).', 'new Ellipse { ... }, Canvas.SetLeft(c, 10 + i * 30), board.Children.Add(c).'),
  WC(3, 'Przycisk <code>clear</code> ma usuwać z Canvas <code>board</code> wszystkie kształty <b>poza</b> prostokątem <code>frame</code>, a TextBlock <code>left</code> ma pokazać liczbę pozostałych dzieci Canvas.', 'The button <code>clear</code> should remove from the Canvas <code>board</code> all shapes <b>except</b> the rectangle <code>frame</code>, and the TextBlock <code>left</code> should show the number of remaining children of the Canvas.',
    { 'MainWindow.xaml': WX('Clear', 260, 320, `    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal">
            <Button x:Name="clear" Content="Clear" Click="Clear_Click"/>
            <TextBlock x:Name="left"/>
        </StackPanel>
        <Canvas x:Name="board">
            <Rectangle x:Name="frame" Width="200" Height="150" Stroke="Black"/>
            <Ellipse Width="20" Height="20" Fill="Red" Canvas.Left="30"/>
            <Ellipse Width="20" Height="20" Fill="Blue" Canvas.Left="60"/>
            <Line X1="0" Y1="0" X2="100" Y2="100" Stroke="Green"/>
        </Canvas>
    </DockPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
        }`) },
    { 'MainWindow.xaml': WX('Clear', 260, 320, `    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal">
            <Button x:Name="clear" Content="Clear" Click="Clear_Click"/>
            <TextBlock x:Name="left"/>
        </StackPanel>
        <Canvas x:Name="board">
            <Rectangle x:Name="frame" Width="200" Height="150" Stroke="Black"/>
            <Ellipse Width="20" Height="20" Fill="Red" Canvas.Left="30"/>
            <Ellipse Width="20" Height="20" Fill="Blue" Canvas.Left="60"/>
            <Line X1="0" Y1="0" X2="100" Y2="100" Stroke="Green"/>
        </Canvas>
    </DockPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            for (int i = board.Children.Count - 1; i >= 0; i--)
            {
                if (board.Children[i] != frame) board.Children.RemoveAt(i);
            }
            left.Text = board.Children.Count.ToString();
        }`) },
    "ui.click('clear'); const k = ui.el('board').kids; if (k.length !== 1 || k[0] !== ui.el('frame')) return '«Na Canvas ma zostać tylko frame|Only frame should stay on the Canvas»'; if (ui.text('left') !== '1') return '«TextBlock left ma pokazać 1|The TextBlock left should show 1»'; return '';",
    'Usuwaj od końca: for (int i = board.Children.Count - 1; i >= 0; i--) – wtedy indeksy się nie przesuwają.', 'Remove from the end: for (int i = board.Children.Count - 1; i >= 0; i--) – then the indexes do not shift.'),
]);

X('animacje', [
  QZ(1, 'Który element grupuje animacje i wskazuje, co animować (TargetName, TargetProperty)?', 'Which element groups animations and says what to animate (TargetName, TargetProperty)?', ['Storyboard', 'Canvas', 'Style', 'Trigger'], null, 'Storyboard to „scenariusz” animacji.', 'A Storyboard is the “script” of the animations.'),
  QZ(1, 'Co oznacza <code>RepeatBehavior="3x"</code>?', 'What does <code>RepeatBehavior="3x"</code> mean?', ['Animacja wykona się 3 razy', 'Animacja będzie 3 razy szybsza', 'Animacja zacznie się po 3 sekundach', 'Animacja ma 3 klatki'], ['The animation runs 3 times', 'The animation is 3 times faster', 'The animation starts after 3 seconds', 'The animation has 3 frames'], '"3x" to trzy powtórzenia, "Forever" – bez końca.', '"3x" is three repetitions, "Forever" – endless.'),
  QZ(2, 'Ile trwa jedna pełna animacja z <code>Duration="0:0:2"</code> i <code>AutoReverse="True"</code> (tam i z powrotem)?', 'How long does one full animation with <code>Duration="0:0:2"</code> and <code>AutoReverse="True"</code> take (there and back)?', ['4 sekundy', '2 sekundy', '1 sekundę', '0,5 sekundy'], ['4 seconds', '2 seconds', '1 second', '0.5 seconds'], 'Duration dotyczy jednego kierunku; AutoReverse dodaje drugi tyle samo.', 'Duration covers one direction; AutoReverse adds the same again.'),
  WC(3, 'Zegar: co tyknięcie <code>DispatcherTimer</code> (Interval 1 s) zwiększaj licznik sekund i pokazuj w TextBlock <code>clock</code> czas w formacie <code>mm:ss</code> (np. <code>01:05</code>). Przycisk <code>toggle</code> zatrzymuje i wznawia zegar.', 'A clock: on every tick of a <code>DispatcherTimer</code> (Interval 1 s) increase a seconds counter and show the time in the TextBlock <code>clock</code> as <code>mm:ss</code> (e.g. <code>01:05</code>). The button <code>toggle</code> stops and resumes the clock.',
    { 'MainWindow.xaml': WX('Clock', 200, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="clock" Text="00:00" FontSize="40"/>
        <Button x:Name="toggle" Content="Start/Stop" Click="Toggle_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer timer = new System.Windows.Threading.DispatcherTimer();
        int sec = 0;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void Toggle_Click(object sender, RoutedEventArgs e)
        {
        }`) },
    { 'MainWindow.xaml': WX('Clock', 200, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="clock" Text="00:00" FontSize="40"/>
        <Button x:Name="toggle" Content="Start/Stop" Click="Toggle_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer timer = new System.Windows.Threading.DispatcherTimer();
        int sec = 0;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromSeconds(1);
            timer.Tick += Timer_Tick;
            timer.Start();
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            sec++;
            clock.Text = $"{sec / 60:D2}:{sec % 60:D2}";
        }

        private void Toggle_Click(object sender, RoutedEventArgs e)
        {
            if (timer.IsEnabled) timer.Stop(); else timer.Start();
        }`) },
    "ui.tick(65); if (ui.text('clock') !== '01:05') return '«Po 65 tyknięciach ma być 01:05 (jest |After 65 ticks it should be 01:05 (it is »' + ui.text('clock') + ')'; ui.click('toggle'); ui.tick(5); if (ui.text('clock') !== '01:05') return '«Po zatrzymaniu czas ma stać|After stopping the time should not change»'; ui.click('toggle'); ui.tick(1); if (ui.text('clock') !== '01:06') return '«Po wznowieniu zegar ma iść dalej|After resuming the clock should go on»'; return '';",
    'Format {sec / 60:D2}:{sec % 60:D2}; timer.IsEnabled mówi, czy zegar chodzi.', 'Format {sec / 60:D2}:{sec % 60:D2}; timer.IsEnabled tells whether the clock runs.'),
  WC(3, 'Gra „unik”: TextBlock <code>rock</code> spada w dół o 10 px na każde tyknięcie zegara (Canvas.Top). Gdy jego Canvas.Top przekroczy 200, wraca na 0, a licznik <code>score</code> rośnie o 1. Strzałki Left/Right przesuwają <code>kapi</code> o 20 px (Canvas.Left, w zakresie 0–260).', 'A “dodge” game: the TextBlock <code>rock</code> falls 10 px on every timer tick (Canvas.Top). When its Canvas.Top goes over 200, it goes back to 0 and the counter <code>score</code> grows by 1. The Left/Right arrows move <code>kapi</code> by 20 px (Canvas.Left, within 0–260).',
    { 'MainWindow.xaml': `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        Title="Dodge" Height="300" Width="320" KeyDown="Window_KeyDown">
    <Canvas Background="Honeydew">
        <TextBlock x:Name="rock" Text="🪨" FontSize="24" Canvas.Left="100" Canvas.Top="0"/>
        <TextBlock x:Name="kapi" Text="🐹" FontSize="30" Canvas.Left="120" Canvas.Top="220"/>
        <TextBlock x:Name="score" Text="0" Canvas.Left="5" Canvas.Top="5"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer timer = new System.Windows.Threading.DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(50);
            timer.Tick += Timer_Tick;
            timer.Start();
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
        }`) },
    { 'MainWindow.xaml': `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        Title="Dodge" Height="300" Width="320" KeyDown="Window_KeyDown">
    <Canvas Background="Honeydew">
        <TextBlock x:Name="rock" Text="🪨" FontSize="24" Canvas.Left="100" Canvas.Top="0"/>
        <TextBlock x:Name="kapi" Text="🐹" FontSize="30" Canvas.Left="120" Canvas.Top="220"/>
        <TextBlock x:Name="score" Text="0" Canvas.Left="5" Canvas.Top="5"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer timer = new System.Windows.Threading.DispatcherTimer();
        int points = 0;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(50);
            timer.Tick += Timer_Tick;
            timer.Start();
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            double y = Canvas.GetTop(rock) + 10;
            if (y > 200)
            {
                y = 0;
                points++;
                score.Text = points.ToString();
            }
            Canvas.SetTop(rock, y);
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double x = Canvas.GetLeft(kapi);
            if (e.Key == Key.Left) x = Math.Max(0, x - 20);
            if (e.Key == Key.Right) x = Math.Min(260, x + 20);
            Canvas.SetLeft(kapi, x);
        }`) },
    "ui.tick(3); if (ui.el('rock').att['Canvas.Top'] !== 30) return '«Po 3 tyknięciach rock ma mieć Canvas.Top = 30|After 3 ticks rock should have Canvas.Top = 30»'; ui.tick(18); if (ui.el('rock').att['Canvas.Top'] !== 0 || ui.text('score') !== '1') return '«Po przekroczeniu 200 rock wraca na 0, a score = 1|After going over 200 rock returns to 0 and score = 1»'; for (let i = 0; i < 10; i++) ui.key('Left'); if (ui.el('kapi').att['Canvas.Left'] !== 0) return '«kapi nie może wyjść poza 0|kapi must not go below 0»'; for (let i = 0; i < 20; i++) ui.key('Right'); if (ui.el('kapi').att['Canvas.Left'] !== 260) return '«kapi nie może wyjść poza 260|kapi must not go above 260»'; return '';",
    'Tick: y = Canvas.GetTop(rock) + 10; KeyDown: Math.Max(0, x - 20) i Math.Min(260, x + 20).', 'Tick: y = Canvas.GetTop(rock) + 10; KeyDown: Math.Max(0, x - 20) and Math.Min(260, x + 20).'),
]);

X('grafika3d', [
  QZ(1, 'Które światło oświetla całą scenę równomiernie, bez kierunku?', 'Which light lights the whole scene evenly, without a direction?', ['AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight'], null, 'AmbientLight to światło rozproszone – bez cieni i kierunku.', 'AmbientLight is diffuse light – no shadows and no direction.'),
  QZ(2, 'Ile punktów i ile trójkątów potrzeba na kwadratową ścianę w <code>MeshGeometry3D</code>?', 'How many points and how many triangles does a square face need in a <code>MeshGeometry3D</code>?', ['4 punkty i 2 trójkąty', '4 punkty i 1 trójkąt', '6 punktów i 4 trójkąty', '2 punkty i 2 trójkąty'], ['4 points and 2 triangles', '4 points and 1 triangle', '6 points and 4 triangles', '2 points and 2 triangles'], 'Kwadrat dzielimy przekątną na dwa trójkąty, które dzielą dwa wierzchołki.', 'A square is split by a diagonal into two triangles that share two vertices.'),
  QZ(3, 'Trójkąt ma wierzchołki podane w kolejności zgodnej z ruchem wskazówek zegara, gdy patrzymy z kamery. Co zobaczymy?', 'A triangle\'s vertices are given clockwise as seen from the camera. What will we see?', ['Nic – widzimy jego tył, który domyślnie nie jest rysowany', 'Trójkąt w pełnym kolorze', 'Tylko krawędzie', 'Trójkąt dwa razy jaśniejszy'], ['Nothing – we see its back, which is not drawn by default', 'The triangle in full colour', 'Only the edges', 'A twice as bright triangle'], 'Przód trójkąta to strona, z której wierzchołki idą przeciwnie do ruchu wskazówek. Tył wymaga BackMaterial.', 'The front of a triangle is the side where the vertices go counter-clockwise. The back needs a BackMaterial.'),
]);

X('strony', [
  QZ(1, 'Czym różni się Page od Window?', 'How does a Page differ from a Window?', ['Page wyświetla się wewnątrz Frame (albo przeglądarki), Window to samodzielne okno', 'Page nie może mieć przycisków', 'Window nie może mieć XAML', 'Nie ma różnicy'], ['A Page is shown inside a Frame (or a browser), a Window is a standalone window', 'A Page cannot have buttons', 'A Window cannot have XAML', 'There is no difference'], 'Strony to „zawartość”, którą Frame podmienia przy nawigacji.', 'Pages are “content” that a Frame swaps when navigating.'),
  QZ(1, 'Która właściwość <code>Frame</code> wskazuje stronę wyświetlaną na starcie?', 'Which <code>Frame</code> property points to the page shown at start-up?', ['Source', 'Content', 'Start', 'Page'], null, 'Source="Start.xaml" ładuje stronę na początku.', 'Source="Start.xaml" loads the page at the beginning.'),
  QZ(2, 'Jak przekazać dane z jednej strony do drugiej przy nawigacji?', 'How do you pass data from one page to another when navigating?', ['Przez konstruktor: NavigationService.Navigate(new Wynik(punkty))', 'Przez Frame.Source z liczbą', 'Nie da się', 'Przez plik tekstowy – jedyny sposób'], ['Through the constructor: NavigationService.Navigate(new Result(points))', 'Through Frame.Source with a number', 'It is impossible', 'Through a text file – the only way'], 'Strona to zwykła klasa – nowy obiekt może dostać dane w konstruktorze.', 'A page is an ordinary class – a new object can get data in its constructor.'),
  WC(3, 'Kreator w dwóch krokach: na stronie <code>Step1</code> użytkownik wpisuje imię w <code>nameBox</code> i klika <code>next</code>. Strona <code>Step2</code> ma dostać imię w konstruktorze i pokazać w TextBlock <code>hello</code> tekst <code>Hi, IMIĘ!</code>.', 'A two-step wizard: on the page <code>Step1</code> the user types a name in <code>nameBox</code> and clicks <code>next</code>. The page <code>Step2</code> should get the name in its constructor and show <code>Hi, NAME!</code> in the TextBlock <code>hello</code>.',
    { 'MainWindow.xaml': WX('Wizard', 200, 300, `    <Frame x:Name="frame" Source="Step1.xaml"/>`), 'Step1.xaml': `<Page x:Class="KapiPasta.Step1"
      ${XH}
      Title="Step1">
    <StackPanel>
        <TextBox x:Name="nameBox"/>
        <Button x:Name="next" Content="Next" Click="Next_Click"/>
    </StackPanel>
</Page>`, 'Step2.xaml': `<Page x:Class="KapiPasta.Step2"
      ${XH}
      Title="Step2">
    <TextBlock x:Name="hello"/>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Step1 : Page
    {
        public Step1() { InitializeComponent(); }

        private void Next_Click(object sender, RoutedEventArgs e)
        {
        }
    }

    public partial class Step2 : Page
    {
        public Step2() { InitializeComponent(); }
    }`) },
    { 'MainWindow.xaml': WX('Wizard', 200, 300, `    <Frame x:Name="frame" Source="Step1.xaml"/>`), 'Step1.xaml': `<Page x:Class="KapiPasta.Step1"
      ${XH}
      Title="Step1">
    <StackPanel>
        <TextBox x:Name="nameBox"/>
        <Button x:Name="next" Content="Next" Click="Next_Click"/>
    </StackPanel>
</Page>`, 'Step2.xaml': `<Page x:Class="KapiPasta.Step2"
      ${XH}
      Title="Step2">
    <TextBlock x:Name="hello"/>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Step1 : Page
    {
        public Step1() { InitializeComponent(); }

        private void Next_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Step2(nameBox.Text));
        }
    }

    public partial class Step2 : Page
    {
        public Step2(string name)
        {
            InitializeComponent();
            hello.Text = $"Hi, {name}!";
        }
    }`) },
    "ui.type('nameBox', 'Ola'); ui.click('next'); if (!ui.has('hello')) return '«Po kliknięciu next ma się pokazać Step2|After clicking next Step2 should appear»'; if (ui.text('hello') !== 'Hi, Ola!') return '«Step2 ma pokazać: Hi, Ola! (jest: |Step2 should show: Hi, Ola! (it is: »' + ui.text('hello') + ')'; return '';",
    'Konstruktor Step2(string name) po InitializeComponent() ustawia hello.Text; w Step1: NavigationService.Navigate(new Step2(nameBox.Text)).', 'The constructor Step2(string name) sets hello.Text after InitializeComponent(); in Step1: NavigationService.Navigate(new Step2(nameBox.Text)).'),
  WC(3, 'Na stronie <code>Detail</code> dodaj przycisk <code>back</code>, który wraca do poprzedniej strony, ale tylko gdy jest to możliwe (CanGoBack). Strona Start przechodzi do Detail przyciskiem <code>open</code> (to już działa).', 'On the page <code>Detail</code> add a button <code>back</code> that goes back to the previous page, but only when possible (CanGoBack). The Start page goes to Detail with the button <code>open</code> (this already works).',
    { 'MainWindow.xaml': WX('Pages', 200, 300, `    <Frame x:Name="frame" Source="Start.xaml"/>`), 'Start.xaml': `<Page x:Class="KapiPasta.Start"
      ${XH}
      Title="Start">
    <Button x:Name="open" Content="Open" Click="Open_Click"/>
</Page>`, 'Detail.xaml': `<Page x:Class="KapiPasta.Detail"
      ${XH}
      Title="Detail">
    <StackPanel>
        <TextBlock Text="Detail"/>
    </StackPanel>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Start : Page
    {
        public Start() { InitializeComponent(); }
        private void Open_Click(object sender, RoutedEventArgs e) { NavigationService.Navigate(new Detail()); }
    }

    public partial class Detail : Page
    {
        public Detail() { InitializeComponent(); }
    }`) },
    { 'MainWindow.xaml': WX('Pages', 200, 300, `    <Frame x:Name="frame" Source="Start.xaml"/>`), 'Start.xaml': `<Page x:Class="KapiPasta.Start"
      ${XH}
      Title="Start">
    <Button x:Name="open" Content="Open" Click="Open_Click"/>
</Page>`, 'Detail.xaml': `<Page x:Class="KapiPasta.Detail"
      ${XH}
      Title="Detail">
    <StackPanel>
        <TextBlock Text="Detail"/>
        <Button x:Name="back" Content="Back" Click="Back_Click"/>
    </StackPanel>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Start : Page
    {
        public Start() { InitializeComponent(); }
        private void Open_Click(object sender, RoutedEventArgs e) { NavigationService.Navigate(new Detail()); }
    }

    public partial class Detail : Page
    {
        public Detail() { InitializeComponent(); }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            if (NavigationService.CanGoBack) NavigationService.GoBack();
        }
    }`) },
    "ui.click('open'); if (!ui.has('back')) return '«Na stronie Detail dodaj przycisk back|Add the button back on the Detail page»'; ui.click('back'); const f = ui.el('frame'); if (!f.page || f.page.p.Title !== 'Start') return '«Po kliknięciu back ma wrócić strona Start|After clicking back the Start page should return»'; return '';",
    'W Detail.xaml: <Button x:Name="back" Click="Back_Click"/>; w C#: if (NavigationService.CanGoBack) NavigationService.GoBack();', 'In Detail.xaml: <Button x:Name="back" Click="Back_Click"/>; in C#: if (NavigationService.CanGoBack) NavigationService.GoBack();'),
]);
