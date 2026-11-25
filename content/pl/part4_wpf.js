// Rozdziały 13–15: aplikacje okienkowe WPF (XAML + C#)
// Przykłady i zadania WPF uruchamia symulator KapiWPF (js/wpf.js).

const XH = c`xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`;
const CSW = (body, extra = '') => `using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace KapiPasta
{
    public partial class MainWindow : Window
    {
${body}
    }${extra}
}`;
const CTOR = `        public MainWindow()
        {
            InitializeComponent();
        }`;

CH.push({
 id: 'wpf1', icon: { pirate: '🗼', kitchen: '🪟', hero: '🖥️' },
 name: { pirate: 'Okna Latarni', kitchen: 'Okienko Restauracji', hero: 'Kokpit Bohatera', neutral: 'WpfPodstawy' },
 topic: 'WPF, XAML, kontrolki, Grid, StackPanel, Canvas, zdarzenia myszy i klawiatury',
 outcomes: 'Wykorzystuje środowisko programistyczne dla aplikacji desktopowych; dobiera IDE; rozpoznaje narzędzia; charakteryzuje pojęcie framework; stosuje frameworki (WPF) i język XAML; rozróżnia elementy interfejsu (okno, dialog modalny i niemodalny, kontrolki); programuje okna aplikacji i obsługę zdarzeń myszy i klawiatury.',
 lessons: [
 { id: 'wpfintro', title: 'Aplikacje okienkowe: WPF i XAML',
  theory: `<p><b>Aplikacja desktopowa</b> (okienkowa) ma graficzny interfejs użytkownika – <b>GUI</b>: okna, przyciski, pola tekstowe. Program nie wykonuje się „od góry do dołu”, tylko <b>czeka na zdarzenia</b> (kliknięcia, klawisze) i na nie reaguje.</p>
<p><b>Framework</b> to gotowy szkielet aplikacji: zestaw bibliotek, narzędzi i reguł, w który wpinamy własny kod. Do aplikacji desktopowych w .NET służą m.in.: <b>WPF</b> (Windows Presentation Foundation), Windows Forms (starszy), WinUI, .NET MAUI i Avalonia (wieloplatformowe). Inne języki mają swoje: Java – Swing/JavaFX, Python – Tkinter/PyQt, C++ – Qt.</p>
<p>Aplikację WPF tworzymy w <b>Visual Studio</b>: <i>Nowy projekt → Aplikacja WPF</i>. Przydatne narzędzia IDE: <b>Projektant</b> (podgląd okna), <b>Przybornik</b> (kontrolki do przeciągnięcia), okno <b>Właściwości</b>, edytor XAML i <b>Live Visual Tree</b> podczas debugowania.</p>
<p>Okno składa się z dwóch plików:</p>
<ul><li><code>MainWindow.xaml</code> – <b>wygląd</b> zapisany w języku <b>XAML</b> (odmiana XML): znaczniki to kontrolki, atrybuty to ich właściwości,</li>
<li><code>MainWindow.xaml.cs</code> – <b>code-behind</b> w C#: logika i obsługa zdarzeń.</li></ul>
<p>W XAML każdy znacznik musi być zamknięty: <code>&lt;TextBlock Text="Ahoj!"/&gt;</code> albo <code>&lt;Button&gt;OK&lt;/Button&gt;</code>. Okno (<code>Window</code>) może mieć tylko <b>jeden</b> element w środku – zwykle jest to kontener, np. <code>StackPanel</code> albo <code>Grid</code>.</p>`,
  more: `<p>Elementy interfejsu: <b>okno</b> (Window), <b>kontrolki</b> (Button, TextBox…), <b>kontenery</b> układu (Grid, StackPanel). Okna dialogowe dzielimy na <b>modalne</b> – blokują okno główne, dopóki ich nie zamkniesz (np. „Zapisz jako”, <code>ShowDialog()</code>) – i <b>niemodalne</b>, które pozwalają dalej korzystać z okna głównego (np. okno „Znajdź”, <code>Show()</code>). Konstruktor okna zawsze wywołuje <code>InitializeComponent()</code> – to ta metoda buduje okno z pliku XAML.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Pierwsze okno Kapi" Height="250" Width="400">
    <StackPanel Margin="15">
        <Image Source="kapi.png" Height="100"/>
        <TextBlock Text="Ahoj! Jestem okienkiem WPF 🪟"
                   FontSize="20" HorizontalAlignment="Center"/>
        <TextBlock Text="Ten tekst opisałem w XAML" Foreground="Gray"
                   HorizontalAlignment="Center"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     scene: { s: 'wpf', cap: 'Kapi patrzy z okna zbudowanego w XAML. Image, dwa TextBlocki i StackPanel, który ustawia je jeden pod drugim.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'W którym pliku opisujemy <b>wygląd</b> okna WPF?', opts: ['MainWindow.xaml', 'MainWindow.xaml.cs', 'Program.cs', 'App.config'], a: 0, why: 'Wygląd w XAML, logika w code-behind (.xaml.cs).' },
   { t: 'quiz', l: 1, q: 'Czym jest <b>framework</b>?', opts: ['Gotowym szkieletem aplikacji: bibliotekami i regułami, w które wpinamy własny kod', 'Edytorem kodu', 'Plikiem z wyglądem okna', 'Rodzajem błędu kompilacji'], a: 0, why: 'Np. WPF dostarcza okna, kontrolki, zdarzenia i system układu – piszemy tylko naszą część.' },
   { t: 'quiz', l: 2, q: 'Czym różni się okno <b>modalne</b> od niemodalnego?', opts: ['Modalne blokuje okno główne, dopóki go nie zamkniesz', 'Modalne nie ma paska tytułu', 'Niemodalne zawsze jest na pełnym ekranie', 'Nie ma różnicy'], a: 0, why: 'ShowDialog() otwiera okno modalne, Show() – niemodalne.' },
   { t: 'fill', l: 1, lang: 'xaml', q: 'Uzupełnij atrybut, aby TextBlock wyświetlał napis <code>Ahoj!</code>.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <TextBlock ___="Ahoj!" FontSize="24"/>
</Window>`, ans: [['Text']], why: 'Tekst TextBlocka ustawia właściwość Text.' },
   { t: 'bug', l: 1, lang: 'xaml', q: 'Projektant XAML zgłasza błąd. Kliknij linię z błędem.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <StackPanel>
        <TextBlock Text="Witaj"/>
        <Buton Content="OK"/>
    </StackPanel>
</Window>`, line: 6, fix: '<Button Content="OK"/>', why: 'Literówka w nazwie kontrolki: Buton zamiast Button (MC3074).' },
   { t: 'bug', l: 2, lang: 'xaml', q: 'Projektant XAML zgłasza błąd. Kliknij linię, którą trzeba poprawić.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <StackPanel>
        <TextBlock Text="Pierwszy">
        <TextBlock Text="Drugi"/>
    </StackPanel>
</Window>`, line: 5, fix: '<TextBlock Text="Pierwszy"/>', cause: true, why: 'Znacznik TextBlock nie został zamknięty – w XAML każdy znacznik musi kończyć się /> albo mieć znacznik zamykający.' },
   { t: 'code', l: 1, wpf: true, q: 'Dodaj do okna przycisk (<code>Button</code>) z napisem <code>Ahoj, załogo!</code> pod napisem TextBlock.',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="320">
    <StackPanel Margin="10">
        <TextBlock Text="Kapitan Kapi wita!" FontSize="18"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="320">
    <StackPanel Margin="10">
        <TextBlock Text="Kapitan Kapi wita!" FontSize="18"/>
        <Button Content="Ahoj, załogo!"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "const b = ui.byType('Button'); if (!b.length) return 'Brakuje przycisku <Button>'; if (b[0].contentText() !== 'Ahoj, załogo!') return 'Napis na przycisku: Ahoj, załogo!'; return '';", hint: '<Button Content="Ahoj, załogo!"/> wewnątrz StackPanel.' },
  ] },
 { id: 'kontrolki', title: 'Kontrolki i ich atrybuty',
  theory: `<p>Najczęściej używane <b>kontrolki</b> WPF:</p>
<ul><li><code>TextBlock</code> – tekst do czytania, <code>Label</code> – etykieta (np. opis pola),</li>
<li><code>TextBox</code> – pole do wpisywania tekstu (<code>Text</code>), <code>PasswordBox</code> – hasło,</li>
<li><code>Button</code> – przycisk (<code>Content</code>, zdarzenie <code>Click</code>),</li>
<li><code>CheckBox</code> i <code>RadioButton</code> – wybór (<code>IsChecked</code>; radio w jednej grupie wykluczają się),</li>
<li><code>Slider</code> – suwak (<code>Minimum</code>, <code>Maximum</code>, <code>Value</code>), <code>ProgressBar</code> – pasek postępu,</li>
<li><code>ComboBox</code> – lista rozwijana, <code>ListBox</code> – lista (<code>SelectedIndex</code>, <code>SelectedItem</code>),</li>
<li><code>Image</code> – obrazek (<code>Source</code>).</li></ul>
<p>Wspólne <b>atrybuty</b>: <code>Width</code>, <code>Height</code>, <code>Margin</code> (odstęp na zewnątrz), <code>Padding</code> (odstęp w środku), <code>FontSize</code>, <code>FontWeight</code>, <code>Foreground</code> (kolor tekstu), <code>Background</code> (tło), <code>HorizontalAlignment</code>, <code>VerticalAlignment</code>, <code>IsEnabled</code>, <code>Visibility</code> (Visible/Hidden/Collapsed), <code>ToolTip</code> (dymek).</p>
<p>Aby odwołać się do kontrolki z kodu C#, nadajemy jej nazwę: <code>x:Name="poleImie"</code>. Wtedy w code-behind piszemy <code>poleImie.Text</code>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Zamówienie u Kapi" Height="330" Width="420">
    <StackPanel Margin="12">
        <Label Content="Imię gościa:"/>
        <TextBox x:Name="poleImie" Text="Ola" ToolTip="Wpisz imię"/>
        <CheckBox x:Name="ser" Content="Dodatkowy ser 🧀" IsChecked="True" Margin="0,8,0,0"/>
        <StackPanel Orientation="Horizontal" Margin="0,6,0,0">
            <RadioButton Content="Mała" GroupName="rozmiar" Margin="0,0,10,0"/>
            <RadioButton Content="Duża" GroupName="rozmiar" IsChecked="True"/>
        </StackPanel>
        <ComboBox x:Name="danie" SelectedIndex="1" Margin="0,8,0,0">
            <ComboBoxItem Content="Pizza"/>
            <ComboBoxItem Content="Pasta"/>
            <ComboBoxItem Content="Sałatka"/>
        </ComboBox>
        <TextBlock Text="Ostrość:" Margin="0,8,0,0"/>
        <Slider x:Name="ostrosc" Minimum="0" Maximum="10" Value="3"/>
        <ProgressBar Value="65" Height="14" Margin="0,8,0,0"/>
        <Button Content="Zamów" Width="120" Margin="0,10,0,0" FontWeight="Bold"
                Background="Orange" Foreground="White" IsEnabled="True"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     scene: { s: 'wpf', cap: 'Formularz zamówienia w kuchni Kapi: pole tekstowe, pole wyboru, przyciski radiowe, lista rozwijana, suwak, pasek postępu i przycisk.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Która kontrolka służy do <b>wpisywania</b> tekstu przez użytkownika?', opts: ['TextBox', 'TextBlock', 'Label', 'Button'], a: 0, why: 'TextBlock i Label tylko wyświetlają tekst; wpisuje się go w TextBox.' },
   { t: 'quiz', l: 1, q: 'Czym różni się <code>Margin</code> od <code>Padding</code>?', opts: ['Margin to odstęp na zewnątrz kontrolki, Padding – wewnątrz', 'Margin to kolor ramki', 'To dwie nazwy tej samej właściwości', 'Padding działa tylko w Grid'], a: 0, why: 'Margin odsuwa kontrolkę od sąsiadów, Padding odsuwa zawartość od krawędzi kontrolki.' },
   { t: 'quiz', l: 2, q: 'Czym różni się <code>Visibility="Hidden"</code> od <code>Visibility="Collapsed"</code>?', opts: ['Hidden ukrywa, ale zostawia puste miejsce; Collapsed nie zajmuje miejsca', 'Collapsed tylko zwija tekst', 'Hidden usuwa kontrolkę z kodu', 'Nie ma różnicy'], a: 0, why: 'Collapsed „zwija” kontrolkę – układ zachowuje się, jakby jej nie było.' },
   { t: 'bug', l: 1, lang: 'xaml', q: 'Projektant XAML zgłasza błąd. Kliknij linię z błędem.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <StackPanel>
        <Button Contnet="Start"/>
    </StackPanel>
</Window>`, line: 5, fix: '<Button Content="Start"/>', why: 'Właściwość nazywa się Content – literówka Contnet (MC3072).' },
   { t: 'fill', l: 2, lang: 'xaml', q: 'Uzupełnij atrybuty, aby suwak miał zakres 0–100.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <Slider ___="0" ___="100" Value="50"/>
</Window>`, ans: [['Minimum'], ['Maximum']], why: 'Zakres suwaka ustawiają Minimum i Maximum.' },
   { t: 'code', l: 2, wpf: true, q: 'Zbuduj formularz: <code>TextBox</code> o nazwie <code>poleImie</code>, <code>CheckBox</code> o nazwie <code>zgoda</code> z napisem <code>Lubię pomarańcze</code> (domyślnie zaznaczony) i wyłączony przycisk <code>Wyślij</code> (<code>IsEnabled="False"</code>).',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Ankieta Kapi" Height="220" Width="320">
    <StackPanel Margin="10">
        <Label Content="Imię:"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Ankieta Kapi" Height="220" Width="320">
    <StackPanel Margin="10">
        <Label Content="Imię:"/>
        <TextBox x:Name="poleImie"/>
        <CheckBox x:Name="zgoda" Content="Lubię pomarańcze" IsChecked="True"/>
        <Button Content="Wyślij" IsEnabled="False"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "if (!ui.has('poleImie') || ui.el('poleImie').__type !== 'TextBox') return 'Dodaj TextBox x:Name=\"poleImie\"'; const z = ui.has('zgoda') && ui.el('zgoda'); if (!z || z.__type !== 'CheckBox') return 'Dodaj CheckBox x:Name=\"zgoda\"'; if (z.contentText() !== 'Lubię pomarańcze') return 'Napis CheckBoxa: Lubię pomarańcze'; if (z.p.IsChecked !== true) return 'CheckBox ma być zaznaczony'; const b = ui.byType('Button').find(x => x.contentText() === 'Wyślij'); if (!b) return 'Dodaj przycisk Wyślij'; if (b.p.IsEnabled !== false) return 'Przycisk ma być wyłączony (IsEnabled=\"False\")'; return '';", hint: '<CheckBox x:Name="zgoda" Content="..." IsChecked="True"/>' },
  ] },
 { id: 'uklad', title: 'Pozycjonowanie: Grid, StackPanel, Canvas',
  theory: `<p>WPF układa kontrolki za pomocą <b>kontenerów</b> (paneli):</p>
<ul><li><code>StackPanel</code> – jedna pod drugą (albo obok siebie: <code>Orientation="Horizontal"</code>),</li>
<li><code>Grid</code> – tabela z wierszami i kolumnami. Definiujemy je w <code>Grid.RowDefinitions</code> i <code>Grid.ColumnDefinitions</code>, a kontrolkę umieszczamy atrybutami <code>Grid.Row="1" Grid.Column="2"</code> (liczone od 0). <code>Grid.ColumnSpan</code> łączy komórki. Rozmiar: <code>Auto</code> (dopasowany), liczba (piksele), <code>*</code> (reszta miejsca, <code>2*</code> – dwa razy więcej),</li>
<li><code>WrapPanel</code> – obok siebie, z zawijaniem do nowej linii,</li>
<li><code>DockPanel</code> – przyklejanie do krawędzi (<code>DockPanel.Dock="Top"</code>), ostatni element wypełnia resztę,</li>
<li><code>Canvas</code> – pozycje bezwzględne w pikselach: <code>Canvas.Left</code>, <code>Canvas.Top</code> (dobre do gier i rysowania).</li></ul>
<p>Wyrównanie w komórce: <code>HorizontalAlignment</code> (Left/Center/Right/Stretch), <code>VerticalAlignment</code>. Odstępy: <code>Margin="10"</code> (wszystkie strony), <code>"10,5"</code> (poziomo, pionowo), <code>"lewy,góra,prawy,dół"</code>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kalkulator Kapi" Height="260" Width="300">
    <Grid Margin="8">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition/>
            <RowDefinition/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition/>
            <ColumnDefinition/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <TextBox Grid.Row="0" Grid.ColumnSpan="3" Text="42" FontSize="22"
                 TextAlignment="Right" Margin="2"/>
        <Button Grid.Row="1" Grid.Column="0" Content="7" Margin="2"/>
        <Button Grid.Row="1" Grid.Column="1" Content="8" Margin="2"/>
        <Button Grid.Row="1" Grid.Column="2" Content="9" Margin="2"/>
        <Button Grid.Row="2" Grid.Column="0" Grid.ColumnSpan="2" Content="0" Margin="2"/>
        <Button Grid.Row="2" Grid.Column="2" Content="=" Margin="2" Background="Orange"/>
    </Grid>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     scene: { s: 'wpf', cap: 'Grid jak plansza do gry: 3 wiersze i 3 kolumny. Pole tekstowe zajmuje cały pierwszy wiersz (ColumnSpan="3"), a „0” – dwie komórki.' } },
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Port Kapi" Height="260" Width="420">
    <DockPanel>
        <TextBlock DockPanel.Dock="Top" Text="⚓ Port Kapi" FontSize="18" Background="Navy"
                   Foreground="White" Padding="6"/>
        <StackPanel DockPanel.Dock="Left" Background="LightGray" Width="90">
            <Button Content="Mapa" Margin="4"/>
            <Button Content="Skarby" Margin="4"/>
        </StackPanel>
        <Canvas Background="LightSkyBlue">
            <TextBlock Canvas.Left="20" Canvas.Top="20" Text="⛵" FontSize="40"/>
            <TextBlock Canvas.Left="170" Canvas.Top="90" Text="🏝️" FontSize="50"/>
            <Image Canvas.Left="200" Canvas.Top="20" Source="kapi.png" Width="80"/>
        </Canvas>
    </DockPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) }, lvl: 2,
     scene: { s: 'wpf', cap: 'DockPanel przykleja pasek tytułu do góry i menu do lewej. Canvas wypełnia resztę, a statek, wyspa i Kapi mają współrzędne w pikselach.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Który kontener układa elementy <b>jeden pod drugim</b>?', opts: ['StackPanel', 'Canvas', 'Grid bez definicji', 'Image'], a: 0, why: 'StackPanel ma domyślnie orientację pionową.' },
   { t: 'quiz', l: 1, q: 'Jak umieścić przycisk w drugim wierszu i trzeciej kolumnie Grida?', opts: ['Grid.Row="1" Grid.Column="2"', 'Grid.Row="2" Grid.Column="3"', 'Row="1" Column="2"', 'Canvas.Left="2"'], a: 0, why: 'Wiersze i kolumny Grida liczymy od 0.' },
   { t: 'quiz', l: 2, q: 'Kolumny Grida mają szerokości <code>100</code>, <code>*</code> i <code>2*</code>, a okno ma 400 px. Ile ma trzecia kolumna?', opts: ['200 px', '100 px', '300 px', '133 px'], a: 0, why: 'Po odjęciu 100 px zostaje 300 px do podziału 1:2, więc trzecia kolumna ma 200 px.' },
   { t: 'fill', l: 2, lang: 'xaml', q: 'Uzupełnij, aby przyciski ułożyły się <b>obok siebie</b>.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <StackPanel Orientation="___">
        <Button Content="A"/>
        <Button Content="B"/>
    </StackPanel>
</Window>`, ans: [['Horizontal']], why: 'Orientation="Horizontal" układa elementy w poziomie.' },
   { t: 'bug', l: 2, lang: 'xaml', q: 'Projektant XAML zgłasza błąd. Kliknij linię z błędem.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <TextBlock Text="Pierwszy"/>
    <TextBlock Text="Drugi"/>
</Window>`, line: 5, fix: '<StackPanel><TextBlock Text="Pierwszy"/><TextBlock Text="Drugi"/></StackPanel>', fixcheck: false, why: 'Window może mieć tylko jeden element w środku (MC3089). Opakuj oba TextBlocki w StackPanel albo Grid.' },
   { t: 'code', l: 2, wpf: true, q: 'Zbuduj Grid 2×2 i umieść w nim cztery przyciski <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code>: A (wiersz 0, kolumna 0), B (0, 1), C (1, 0), D (1, 1).',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Siatka" Height="220" Width="300">
    <Grid>

    </Grid>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Siatka" Height="220" Width="300">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition/>
            <RowDefinition/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Button Content="A" Grid.Row="0" Grid.Column="0"/>
        <Button Content="B" Grid.Row="0" Grid.Column="1"/>
        <Button Content="C" Grid.Row="1" Grid.Column="0"/>
        <Button Content="D" Grid.Row="1" Grid.Column="1"/>
    </Grid>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "const g = ui.byType('Grid')[0]; if (!g || !g.rows || g.rows.length !== 2 || !g.cols || g.cols.length !== 2) return 'Grid ma mieć 2 wiersze i 2 kolumny (RowDefinitions, ColumnDefinitions)'; const exp = { A: [0,0], B: [0,1], C: [1,0], D: [1,1] }; for (const k in exp) { const b = ui.byType('Button').find(x => x.contentText() === k); if (!b) return 'Brakuje przycisku ' + k; if ((b.att['Grid.Row']||0) !== exp[k][0] || (b.att['Grid.Column']||0) !== exp[k][1]) return 'Przycisk ' + k + ' ma być w wierszu ' + exp[k][0] + ', kolumnie ' + exp[k][1]; } return '';", hint: 'Najpierw <Grid.RowDefinitions> i <Grid.ColumnDefinitions>, potem przyciski z Grid.Row i Grid.Column.' },
  ] },
 { id: 'zdarzenia', title: 'Programowanie zdarzeniowe: mysz i klawiatura',
  theory: `<p>W <b>programowaniu zdarzeniowym</b> program reaguje na <b>zdarzenia</b> (events): kliknięcie, ruch myszy, naciśnięcie klawisza, zmianę tekstu. Do zdarzenia podpinamy <b>metodę obsługi</b> (event handler).</p>
<p>W XAML: <code>&lt;Button Content="Kliknij" Click="Przycisk_Click"/&gt;</code>, a w code-behind:</p>
<pre>private void Przycisk_Click(object sender, RoutedEventArgs e)
{
    napis.Text = "Kliknięto!";
}</pre>
<p><code>sender</code> to kontrolka, która wywołała zdarzenie, a <code>e</code> – dodatkowe informacje. Ważne zdarzenia:</p>
<ul><li><code>Click</code> (Button, CheckBox, MenuItem), <code>TextChanged</code> (TextBox), <code>ValueChanged</code> (Slider), <code>SelectionChanged</code> (ComboBox, ListBox), <code>Checked</code>/<code>Unchecked</code>,</li>
<li><b>mysz</b>: <code>MouseDown</code>, <code>MouseUp</code>, <code>MouseMove</code>, <code>MouseEnter</code>, <code>MouseLeave</code> – pozycję daje <code>e.GetPosition(element)</code>,</li>
<li><b>klawiatura</b>: <code>KeyDown</code>, <code>KeyUp</code> – naciśnięty klawisz to <code>e.Key</code> (np. <code>Key.Left</code>, <code>Key.Enter</code>).</li></ul>
<p>Zdarzenie można też podpiąć w kodzie: <code>przycisk.Click += Przycisk_Click;</code>.</p>`,
  more: `<p>Zdarzenia myszy i klawiatury w WPF są <b>trasowane</b> (routed): „bąbelkują” od kontrolki w górę drzewa aż do okna. Dlatego <code>KeyDown</code> podpięty do <code>Window</code> łapie klawisze z całego okna. Ustawienie <code>e.Handled = true</code> zatrzymuje dalsze przekazywanie.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Licznik pomarańczy" Height="230" Width="360">
    <StackPanel Margin="15">
        <TextBlock x:Name="napis" Text="Kapi ma 0 pomarańczy" FontSize="18"/>
        <TextBox x:Name="pole" Text="Kapi" Margin="0,8" TextChanged="Pole_TextChanged"/>
        <Button Content="Daj pomarańczę 🍊" Click="Daj_Click" Padding="6"/>
        <TextBlock x:Name="echo" Foreground="Gray" Margin="0,8,0,0"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(`        int pomarancze = 0;

` + CTOR + `

        private void Daj_Click(object sender, RoutedEventArgs e)
        {
            pomarancze++;
            napis.Text = $"{pole.Text} ma {pomarancze} pomarańczy";
            if (pomarancze >= 5)
            {
                napis.Foreground = Brushes.Green;
            }
        }

        private void Pole_TextChanged(object sender, TextChangedEventArgs e)
        {
            echo.Text = "Wpisujesz: " + pole.Text;
        }`) },
     scene: { s: 'wpf', cap: 'Każde kliknięcie przycisku uruchamia metodę Daj_Click. Wpisywanie w polu tekstowym wywołuje zdarzenie TextChanged.' } },
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Sterowanie Kapi (strzałki + klik)" Height="280" Width="420"
        KeyDown="Window_KeyDown">
    <Canvas x:Name="plansza" Background="PaleGreen" MouseDown="Plansza_MouseDown">
        <Image x:Name="kapi" Source="kapi.png" Width="70" Canvas.Left="150" Canvas.Top="80"/>
        <TextBlock x:Name="info" Canvas.Left="8" Canvas.Top="6" Text="Kliknij planszę, użyj strzałek"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double x = Canvas.GetLeft(kapi);
            double y = Canvas.GetTop(kapi);
            if (e.Key == Key.Left) x -= 15;
            if (e.Key == Key.Right) x += 15;
            if (e.Key == Key.Up) y -= 15;
            if (e.Key == Key.Down) y += 15;
            Canvas.SetLeft(kapi, x);
            Canvas.SetTop(kapi, y);
            info.Text = $"Klawisz: {e.Key}, pozycja: {x}, {y}";
        }

        private void Plansza_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(plansza);
            Canvas.SetLeft(kapi, p.X - 35);
            Canvas.SetTop(kapi, p.Y - 30);
            info.Text = $"Klik w punkcie ({p.X:F0}, {p.Y:F0})";
        }`) }, lvl: 2,
     scene: { s: 'wpf', cap: 'Kapi biega po Canvas: strzałki obsługuje KeyDown okna, a kliknięcie myszą przenosi go w miejsce wskazane przez e.GetPosition.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Które zdarzenie przycisku zachodzi po jego kliknięciu?', opts: ['Click', 'Press', 'TextChanged', 'Loaded'], a: 0, why: 'Kliknięcie przycisku to zdarzenie Click.' },
   { t: 'quiz', l: 1, q: 'Co oznacza parametr <code>sender</code> w metodzie obsługi zdarzenia?', opts: ['Kontrolkę, która wywołała zdarzenie', 'Klawisz, który naciśnięto', 'Okno dialogowe', 'Tekst wpisany przez użytkownika'], a: 0, why: 'sender to nadawca zdarzenia, np. kliknięty przycisk.' },
   { t: 'quiz', l: 2, q: 'Jak w metodzie obsługi <code>KeyDown</code> sprawdzić, czy naciśnięto Enter?', opts: ['if (e.Key == Key.Enter)', 'if (sender == "Enter")', 'if (e.Text == "\\n")', 'if (Key.Pressed(Enter))'], a: 0, why: 'KeyEventArgs ma właściwość Key z typem wyliczeniowym Key.' },
   { t: 'bug', l: 2, lang: 'xaml', q: 'Aplikacja się nie kompiluje. Kliknij linię z błędem w XAML.', cs: CSW(CTOR + `

        private void Start_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("Start!");
        }`), code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <StackPanel>
        <Button Content="Start" Click="Strat_Click"/>
    </StackPanel>
</Window>`, line: 5, fix: '<Button Content="Start" Click="Start_Click"/>', why: 'Nazwa metody w atrybucie Click musi dokładnie pasować do metody w code-behind (CS1061).' },
   { t: 'fill', l: 1, lang: 'xaml', q: 'Podepnij metodę <code>Kapi_Click</code> do kliknięcia przycisku.', cs: CSW(CTOR + `

        private void Kapi_Click(object sender, RoutedEventArgs e) { }`), code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <Button Content="Kwik!" ___="Kapi_Click"/>
</Window>`, ans: [['Click']], why: 'Atrybut zdarzenia nazywa się tak jak zdarzenie: Click.' },
   { t: 'code', l: 1, wpf: true, q: 'Uzupełnij metodę <code>Powitaj_Click</code>: po kliknięciu przycisku TextBlock <code>napis</code> ma pokazać <code>Ahoj, IMIĘ!</code>, gdzie IMIĘ to tekst z pola <code>poleImie</code>.',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Powitanie" Height="200" Width="320">
    <StackPanel Margin="10">
        <TextBox x:Name="poleImie"/>
        <Button x:Name="przycisk" Content="Powitaj" Click="Powitaj_Click"/>
        <TextBlock x:Name="napis" FontSize="18"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Powitaj_Click(object sender, RoutedEventArgs e)
        {
            // Twój kod
        }`) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Powitanie" Height="200" Width="320">
    <StackPanel Margin="10">
        <TextBox x:Name="poleImie"/>
        <Button x:Name="przycisk" Content="Powitaj" Click="Powitaj_Click"/>
        <TextBlock x:Name="napis" FontSize="18"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Powitaj_Click(object sender, RoutedEventArgs e)
        {
            napis.Text = $"Ahoj, {poleImie.Text}!";
        }`) },
     ui: "ui.type('poleImie', 'Ola'); ui.click('przycisk'); if (ui.text('napis') !== 'Ahoj, Ola!') return 'Dla imienia Ola napis ma brzmieć: Ahoj, Ola! (jest: ' + ui.text('napis') + ')'; ui.type('poleImie', 'Kapi'); ui.click('przycisk'); if (ui.text('napis') !== 'Ahoj, Kapi!') return 'Napis powinien się zmieniać po każdym kliknięciu'; return '';", hint: 'napis.Text = $"Ahoj, {poleImie.Text}!";' },
   { t: 'code', l: 3, wpf: true, q: 'Gra: obsłuż <code>KeyDown</code> okna tak, aby klawisz <code>Right</code> przesuwał <code>statek</code> o 10 px w prawo (Canvas.Left), a <code>Left</code> – o 10 px w lewo. Po każdym ruchu TextBlock <code>pozycja</code> ma pokazywać aktualne Canvas.Left.',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Rejs" Height="200" Width="400" KeyDown="Window_KeyDown">
    <Canvas Background="LightBlue">
        <TextBlock x:Name="statek" Text="⛵" FontSize="40" Canvas.Left="100" Canvas.Top="60"/>
        <TextBlock x:Name="pozycja" Text="100"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            // Twój kod
        }`) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Rejs" Height="200" Width="400" KeyDown="Window_KeyDown">
    <Canvas Background="LightBlue">
        <TextBlock x:Name="statek" Text="⛵" FontSize="40" Canvas.Left="100" Canvas.Top="60"/>
        <TextBlock x:Name="pozycja" Text="100"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double x = Canvas.GetLeft(statek);
            if (e.Key == Key.Right) x += 10;
            if (e.Key == Key.Left) x -= 10;
            Canvas.SetLeft(statek, x);
            pozycja.Text = x.ToString();
        }`) },
     ui: "ui.key('Right'); ui.key('Right'); ui.key('Left'); const x = ui.el('statek').att['Canvas.Left']; if (x !== 110) return 'Po Right, Right, Left statek powinien mieć Canvas.Left = 110 (jest ' + x + ')'; if (ui.text('pozycja') !== '110') return 'TextBlock pozycja ma pokazać 110'; return '';", hint: 'double x = Canvas.GetLeft(statek); ... Canvas.SetLeft(statek, x);' },
  ] },
 ] });

CH.push({
 id: 'wpf2', icon: { pirate: '🚩', kitchen: '📋', hero: '📡' },
 name: { pirate: 'Flagi i Sygnały', kitchen: 'Menu Restauracji', hero: 'Centrum Dowodzenia', neutral: 'WpfDaneIStyle' },
 topic: 'binding, konwertery, style, zasoby, menu, MessageBox, okna dialogowe',
 outcomes: 'Stosuje wiązanie elementów (binding) i konwersję danych; stosuje style i zasoby; programuje system menu aplikacji; programuje okna dialogowe (modalne i niemodalne).',
 lessons: [
 { id: 'binding', title: 'Wiązanie elementów (Binding)',
  theory: `<p><b>Wiązanie danych</b> (data binding) automatycznie łączy właściwość jednej kontrolki z inną wartością – bez pisania obsługi zdarzeń. Gdy źródło się zmienia, cel aktualizuje się sam.</p>
<pre>&lt;Slider x:Name="suwak" Maximum="100"/&gt;
&lt;TextBlock Text="{Binding ElementName=suwak, Path=Value}"/&gt;</pre>
<ul><li><code>ElementName</code> – nazwa kontrolki-źródła, <code>Path</code> – jej właściwość,</li>
<li><code>StringFormat=F0</code> – formatowanie (np. bez miejsc po przecinku),</li>
<li><code>Mode</code> – kierunek: <code>OneWay</code> (źródło → cel), <code>TwoWay</code> (w obie strony; domyślny dla TextBox.Text), <code>OneTime</code>.</li></ul>
<p>Można też wiązać z <b>obiektem C#</b>: w kodzie ustawiamy <code>DataContext = mojObiekt;</code>, a w XAML piszemy <code>{Binding Imie}</code> – to odczyta właściwość <code>Imie</code> tego obiektu.</p>`,
  more: `<p>W prawdziwym WPF, aby widok sam odświeżał się po zmianie właściwości obiektu w kodzie, klasa musi implementować interfejs <code>INotifyPropertyChanged</code> i wywoływać zdarzenie <code>PropertyChanged</code>. Symulator KapiPasta odświeża wiązania automatycznie po każdym zdarzeniu, ale w Visual Studio pamiętaj o tym interfejsie (albo użyj gotowego MVVM Toolkit).</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Binding u Kapi" Height="270" Width="400">
    <StackPanel Margin="15">
        <TextBlock Text="Ile pomarańczy?"/>
        <Slider x:Name="suwak" Minimum="8" Maximum="30" Value="16"
                IsSnapToTickEnabled="True" TickFrequency="1"/>
        <TextBlock FontSize="22"
                   Text="{Binding ElementName=suwak, Path=Value, StringFormat=Kapi zje {0} pomarańczy}"/>
        <TextBox x:Name="pole" Text="Wpisz coś" Margin="0,10,0,0"/>
        <TextBlock Text="{Binding ElementName=pole, Path=Text}" FontStyle="Italic"
                   FontSize="{Binding ElementName=suwak, Path=Value}"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     scene: { s: 'wpf', cap: 'Przesuń suwak – napis i wielkość czcionki zmieniają się same, bez ani jednej linii kodu C#. Tak działa wiązanie danych.' } },
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Karta pirata" Height="240" Width="360">
    <StackPanel Margin="15">
        <TextBlock Text="{Binding Imie, StringFormat=Pirat: {0}}" FontSize="20"/>
        <TextBlock Text="{Binding Zloto, StringFormat=Złoto: {0} monet}"/>
        <TextBox Text="{Binding Imie, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" Margin="0,8"/>
        <Button Content="Znajdź skarb 💰" Click="Skarb_Click"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(`        Pirat pirat = new Pirat { Imie = "Kapi", Zloto = 10 };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = pirat;
        }

        private void Skarb_Click(object sender, RoutedEventArgs e)
        {
            pirat.Zloto += 50;
        }`, `

public class Pirat
{
    public string Imie { get; set; }
    public int Zloto { get; set; }
}`) }, lvl: 2,
     scene: { s: 'wpf', cap: 'DataContext wskazuje obiekt Pirat. Wpisz nowe imię – TextBox (TwoWay) zmienia obiekt, a TextBlock od razu to pokazuje.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Co robi zapis <code>Text="{Binding ElementName=suwak, Path=Value}"</code>?', opts: ['Wyświetla aktualną wartość kontrolki suwak i aktualizuje się sama', 'Wyświetla tekst Binding', 'Tworzy nowy suwak', 'Kopiuje wartość tylko raz przy starcie'], a: 0, why: 'Wiązanie łączy Text z właściwością Value suwaka.' },
   { t: 'quiz', l: 2, q: 'Który tryb wiązania przesyła zmiany <b>w obie strony</b>?', opts: ['TwoWay', 'OneWay', 'OneTime', 'Both'], a: 0, why: 'TwoWay – zmiana w celu (np. TextBox) aktualizuje też źródło.' },
   { t: 'quiz', l: 2, q: 'Co trzeba ustawić w kodzie, aby <code>{Binding Imie}</code> czytał właściwość obiektu <code>gracz</code>?', opts: ['DataContext = gracz;', 'Binding = gracz;', 'Source.Imie = gracz;', 'gracz.Bind();'], a: 0, why: 'Wiązania bez ElementName szukają źródła w DataContext.' },
   { t: 'fill', l: 1, lang: 'xaml', q: 'Uzupełnij wiązanie, aby TextBlock pokazywał tekst z pola <code>pole</code>.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <StackPanel>
        <TextBox x:Name="pole"/>
        <TextBlock Text="{Binding ___=pole, Path=Text}"/>
    </StackPanel>
</Window>`, ans: [['ElementName']], why: 'Źródło-kontrolkę wskazuje ElementName.' },
   { t: 'code', l: 2, wpf: true, q: 'Dodaj TextBlock o nazwie <code>wynik</code>, który przez <b>binding</b> pokazuje wartość suwaka <code>glosnosc</code> w formacie <code>Głośność: N</code> (bez miejsc po przecinku: <code>StringFormat=Głośność: {0:F0}</code>).',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Radio Kapi" Height="200" Width="320">
    <StackPanel Margin="10">
        <Slider x:Name="glosnosc" Minimum="0" Maximum="10" Value="4"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Radio Kapi" Height="200" Width="320">
    <StackPanel Margin="10">
        <Slider x:Name="glosnosc" Minimum="0" Maximum="10" Value="4"/>
        <TextBlock x:Name="wynik" Text="{Binding ElementName=glosnosc, Path=Value, StringFormat=Głośność: {0:F0}}"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "if (!ui.has('wynik')) return 'Dodaj TextBlock x:Name=\"wynik\"'; if (ui.text('wynik') !== 'Głośność: 4') return 'Na starcie ma być: Głośność: 4 (jest: ' + ui.text('wynik') + ')'; ui.slide('glosnosc', 7); if (ui.text('wynik') !== 'Głośność: 7') return 'Po przesunięciu suwaka na 7 ma być: Głośność: 7 – użyj Binding'; return '';", hint: 'Text="{Binding ElementName=glosnosc, Path=Value, StringFormat=Głośność: {0:F0}}"' },
  ] },
 { id: 'konwersja', title: 'Konwersja danych w aplikacji okienkowej',
  theory: `<p>Kontrolki przechowują <b>tekst</b> (<code>TextBox.Text</code> to string), a obliczenia potrzebują liczb. Dlatego w aplikacjach okienkowych ciągle konwertujemy dane:</p>
<ul><li>tekst → liczba: <code>double.TryParse(pole.Text, out double x)</code> (bezpiecznie, bez wyjątku),</li>
<li>liczba → tekst: <code>wynik.Text = x.ToString("F2");</code> albo interpolacja,</li>
<li><code>Slider.Value</code> jest typu <code>double</code>, <code>CheckBox.IsChecked</code> – <code>bool?</code> (może być null).</li></ul>
<p>Przy wiązaniach używamy <b>konwerterów</b> – klas implementujących interfejs <code>IValueConverter</code>. Metoda <code>Convert</code> zamienia wartość źródła na wartość do wyświetlenia, a <code>ConvertBack</code> – w drugą stronę. Konwerter rejestrujemy w zasobach okna i wskazujemy w wiązaniu: <code>Converter={StaticResource nazwa}</code>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        xmlns:local="clr-namespace:KapiPasta"
        Title="Termometr Kapi" Height="250" Width="380">
    <Window.Resources>
        <local:CelsjuszNaFahrenheit x:Key="naF"/>
    </Window.Resources>
    <StackPanel Margin="15">
        <TextBlock Text="Temperatura wody w °C:"/>
        <Slider x:Name="temp" Minimum="-10" Maximum="40" Value="25"/>
        <TextBlock FontSize="20" Text="{Binding ElementName=temp, Path=Value, Converter={StaticResource naF}}"/>
        <TextBox x:Name="poleKm" Text="12,5" Margin="0,10,0,0"/>
        <Button Content="Przelicz km na mile" Click="Przelicz_Click"/>
        <TextBlock x:Name="mile"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Przelicz_Click(object sender, RoutedEventArgs e)
        {
            string tekst = poleKm.Text.Replace(',', '.');
            if (double.TryParse(tekst, out double km))
            {
                mile.Text = $"{km} km = {km * 0.621:F2} mil";
            }
            else
            {
                mile.Text = "To nie jest liczba!";
            }
        }`, `

public class CelsjuszNaFahrenheit : System.Windows.Data.IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
    {
        double c = (double)value;
        double f = c * 9 / 5 + 32;
        string opis = c >= 20 ? "Kapi się kąpie 💦" : "Brrr, zimno";
        return $"{c:F0} °C = {f:F1} °F – {opis}";
    }

    public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}`) },
     scene: { s: 'cast', ft: 'Slider.Value (double)', fv: '25', tt: 'TextBlock.Text (string)', tv: '"25 °C = 77.0 °F"', cap: 'Konwerter przelewa liczbę z suwaka do tekstu, który rozumie TextBlock. Przycisk robi konwersję ręcznie przez TryParse.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Jakiego typu jest właściwość <code>TextBox.Text</code>?', opts: ['string', 'int', 'double', 'object'], a: 0, why: 'Pole tekstowe zawsze przechowuje tekst – liczby trzeba z niego przekonwertować.' },
   { t: 'quiz', l: 2, q: 'Jakiego typu jest <code>CheckBox.IsChecked</code>?', opts: ['bool? (może być null)', 'bool', 'string', 'int'], a: 0, why: 'CheckBox może mieć trzeci, nieokreślony stan – dlatego bool?.' },
   { t: 'quiz', l: 2, q: 'Jaki interfejs implementuje konwerter używany w wiązaniach?', opts: ['IValueConverter', 'IConvertible', 'IBinding', 'IComparable'], a: 0, why: 'IValueConverter ma metody Convert i ConvertBack.' },
   { t: 'quiz', l: 3, q: 'Która metoda pozwala bezpiecznie zamienić tekst z pola na liczbę, bez ryzyka wyjątku?', opts: ['double.TryParse(pole.Text, out double x)', 'double.Parse(pole.Text)', '(double)pole.Text', 'Convert.ToDouble(pole)'], a: 0, why: 'TryParse zwraca false zamiast zgłaszać FormatException.' },
   { t: 'code', l: 2, wpf: true, q: 'Uzupełnij <code>Licz_Click</code>: odczytaj liczby z pól <code>a</code> i <code>b</code> (int.TryParse) i wpisz sumę do TextBlocka <code>suma</code>. Gdy któreś pole nie jest liczbą, wpisz <code>Błąd</code>.',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Sumator" Height="200" Width="300">
    <StackPanel Margin="10">
        <TextBox x:Name="a"/>
        <TextBox x:Name="b"/>
        <Button x:Name="licz" Content="=" Click="Licz_Click"/>
        <TextBlock x:Name="suma"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Licz_Click(object sender, RoutedEventArgs e)
        {
            // Twój kod
        }`) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Sumator" Height="200" Width="300">
    <StackPanel Margin="10">
        <TextBox x:Name="a"/>
        <TextBox x:Name="b"/>
        <Button x:Name="licz" Content="=" Click="Licz_Click"/>
        <TextBlock x:Name="suma"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Licz_Click(object sender, RoutedEventArgs e)
        {
            if (int.TryParse(a.Text, out int x) && int.TryParse(b.Text, out int y))
                suma.Text = (x + y).ToString();
            else
                suma.Text = "Błąd";
        }`) },
     ui: "ui.type('a', '12'); ui.type('b', '30'); ui.click('licz'); if (ui.text('suma') !== '42') return 'Dla 12 i 30 ma być 42 (jest: ' + ui.text('suma') + ')'; ui.type('b', 'kapi'); ui.click('licz'); if (ui.text('suma') !== 'Błąd') return 'Gdy pole nie jest liczbą, ma być: Błąd'; return '';", hint: 'if (int.TryParse(a.Text, out int x) && int.TryParse(b.Text, out int y)) ...' },
  ] },
 { id: 'style', title: 'Stylowanie i zasoby',
  theory: `<p>Zamiast powtarzać te same atrybuty przy każdej kontrolce, definiujemy <b>styl</b> w <b>zasobach</b> okna:</p>
<pre>&lt;Window.Resources&gt;
    &lt;Style TargetType="Button"&gt;
        &lt;Setter Property="Background" Value="Orange"/&gt;
        &lt;Setter Property="Margin" Value="5"/&gt;
    &lt;/Style&gt;
&lt;/Window.Resources&gt;</pre>
<ul><li>Styl z samym <code>TargetType</code> działa <b>automatycznie</b> na wszystkie kontrolki tego typu (styl niejawny).</li>
<li>Styl z <code>x:Key="Duzy"</code> trzeba wskazać: <code>Style="{StaticResource Duzy}"</code>.</li>
<li><code>BasedOn</code> pozwala rozszerzyć inny styl.</li>
<li><b>Wyzwalacze</b> (<code>Style.Triggers</code>) zmieniają wygląd w określonym stanie, np. <code>IsMouseOver="True"</code> po najechaniu myszą.</li></ul>
<p>W zasobach trzymamy też kolory i pędzle: <code>&lt;SolidColorBrush x:Key="Glowny" Color="#FF8B5A2B"/&gt;</code>, używane przez <code>{StaticResource Glowny}</code>. Atrybut ustawiony bezpośrednio przy kontrolce ma pierwszeństwo przed stylem.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Menu w stylu Kapi" Height="280" Width="380">
    <Window.Resources>
        <SolidColorBrush x:Key="Brazowy" Color="#FF8B5A2B"/>
        <Style TargetType="Button">
            <Setter Property="Background" Value="#FFFFE0B2"/>
            <Setter Property="Margin" Value="4"/>
            <Setter Property="Padding" Value="6"/>
            <Style.Triggers>
                <Trigger Property="IsMouseOver" Value="True">
                    <Setter Property="Background" Value="Orange"/>
                    <Setter Property="Foreground" Value="White"/>
                </Trigger>
            </Style.Triggers>
        </Style>
        <Style x:Key="Naglowek" TargetType="TextBlock">
            <Setter Property="FontSize" Value="22"/>
            <Setter Property="FontWeight" Value="Bold"/>
            <Setter Property="Foreground" Value="{StaticResource Brazowy}"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="12">
        <TextBlock Style="{StaticResource Naglowek}" Text="🍝 Karta dań Kapi"/>
        <Button Content="Spaghetti"/>
        <Button Content="Lasagne"/>
        <Button Content="Tiramisu" Background="Pink"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     scene: { s: 'wpf', cap: 'Jeden styl obejmuje wszystkie przyciski. Najedź myszą – wyzwalacz IsMouseOver zmienia kolor. Tiramisu ma własne tło, które wygrywa ze stylem.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Gdzie najczęściej definiujemy style dla całego okna?', opts: ['W Window.Resources', 'W pliku Program.cs', 'W metodzie InitializeComponent', 'W atrybucie Title'], a: 0, why: 'Zasoby okna (Window.Resources) są dostępne dla wszystkich jego kontrolek.' },
   { t: 'quiz', l: 2, q: 'Styl ma <code>TargetType="Button"</code> i <b>nie ma</b> <code>x:Key</code>. Do których przycisków się zastosuje?', opts: ['Do wszystkich przycisków w oknie (bez własnego Style)', 'Do żadnego, dopóki go nie wskażemy', 'Tylko do pierwszego', 'Do wszystkich kontrolek w oknie'], a: 0, why: 'Styl bez klucza jest stylem niejawnym dla danego typu.' },
   { t: 'quiz', l: 2, q: 'Styl ustawia <code>Background="Orange"</code>, a przycisk ma atrybut <code>Background="Pink"</code>. Jaki kolor będzie miał przycisk?', opts: ['Pink', 'Orange', 'Mieszany', 'Domyślny szary'], a: 0, why: 'Wartość ustawiona bezpośrednio przy kontrolce ma pierwszeństwo przed stylem.' },
   { t: 'fill', l: 2, lang: 'xaml', q: 'Uzupełnij, aby użyć stylu o kluczu <code>Duzy</code>.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <Window.Resources>
        <Style x:Key="Duzy" TargetType="TextBlock">
            <Setter Property="FontSize" Value="30"/>
        </Style>
    </Window.Resources>
    <TextBlock Style="{___ Duzy}" Text="Kapi"/>
</Window>`, ans: [['StaticResource']], why: 'Zasób wskazujemy przez {StaticResource klucz}.' },
   { t: 'bug', l: 3, lang: 'xaml', q: 'Projektant XAML zgłasza błąd. Kliknij linię z błędem.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <Window.Resources>
        <SolidColorBrush x:Key="Morski" Color="Teal"/>
    </Window.Resources>
    <TextBlock Text="Ahoj" Foreground="{StaticResource Morze}"/>
</Window>`, line: 7, fix: '<TextBlock Text="Ahoj" Foreground="{StaticResource Morski}"/>', why: 'Nie ma zasobu o kluczu Morze – klucze rozróżniają wielkość liter i muszą się zgadzać.' },
   { t: 'code', l: 2, wpf: true, q: 'Dodaj w <code>Window.Resources</code> styl dla wszystkich <code>Button</code>: tło <code>LightGreen</code> i <code>FontSize</code> 16. Przyciski mają go dostać automatycznie.',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Styl" Height="220" Width="300">
    <StackPanel Margin="10">
        <Button x:Name="b1" Content="Raz"/>
        <Button x:Name="b2" Content="Dwa"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Styl" Height="220" Width="300">
    <Window.Resources>
        <Style TargetType="Button">
            <Setter Property="Background" Value="LightGreen"/>
            <Setter Property="FontSize" Value="16"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="10">
        <Button x:Name="b1" Content="Raz"/>
        <Button x:Name="b2" Content="Dwa"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "for (const n of ['b1','b2']) { const b = ui.el(n); const bg = b.p.Background; if (!bg || String(bg.color).toLowerCase() !== 'lightgreen') return 'Przycisk ' + n + ' ma mieć tło LightGreen (ze stylu)'; if (b.p.FontSize !== 16) return 'Przycisk ' + n + ' ma mieć FontSize 16'; if (b.node.attrs.some(a => a.name === 'Background' || a.name === 'FontSize')) return 'Nie ustawiaj atrybutów przy przyciskach – użyj stylu'; } return '';", hint: '<Window.Resources><Style TargetType="Button"><Setter Property="Background" Value="LightGreen"/>...' },
  ] },
 { id: 'dialogi', title: 'Menu i okna dialogowe',
  theory: `<p><b>Menu</b> tworzymy z kontrolek <code>Menu</code> i zagnieżdżonych <code>MenuItem</code>. Zwykle umieszczamy je u góry w <code>DockPanel</code>:</p>
<pre>&lt;Menu DockPanel.Dock="Top"&gt;
    &lt;MenuItem Header="_Plik"&gt;
        &lt;MenuItem Header="_Nowy" Click="Nowy_Click" InputGestureText="Ctrl+N"/&gt;
        &lt;Separator/&gt;
        &lt;MenuItem Header="_Zamknij" Click="Zamknij_Click"/&gt;
    &lt;/MenuItem&gt;
&lt;/Menu&gt;</pre>
<p>Podkreślnik <code>_</code> wskazuje klawisz skrótu (Alt+P).</p>
<p><b>Okna dialogowe</b>:</p>
<ul><li><code>MessageBox.Show("tekst", "tytuł", MessageBoxButton.YesNo, MessageBoxImage.Question)</code> zwraca <code>MessageBoxResult</code> (np. <code>Yes</code>/<code>No</code>),</li>
<li>własne okno: klasa dziedzicząca po <code>Window</code> z własnym plikiem XAML. <code>okno.ShowDialog()</code> otwiera je jako <b>modalne</b> (czeka na zamknięcie i zwraca <code>DialogResult</code>), a <code>okno.Show()</code> – jako <b>niemodalne</b>,</li>
<li>w oknie dialogowym ustawienie <code>DialogResult = true;</code> zamyka je z wynikiem „OK”.</li></ul>`,
  more: `<p>W symulatorze KapiPasta, gdy w metodzie pojawi się <code>MessageBox</code> z przyciskami Tak/Nie albo <code>ShowDialog()</code>, metoda obsługi jest po wybraniu odpowiedzi wykonywana ponownie z zapamiętanym wynikiem. Dlatego <b>przed</b> takim wywołaniem nie zmieniaj stanu programu (najpierw zapytaj, potem działaj) – to zresztą dobra praktyka także w prawdziwym WPF.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Dziennik kapitana" Height="300" Width="420">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="_Plik">
                <MenuItem Header="_Nowy wpis..." Click="Nowy_Click" InputGestureText="Ctrl+N"/>
                <Separator/>
                <MenuItem Header="_Zamknij" Click="Zamknij_Click"/>
            </MenuItem>
            <MenuItem Header="_Pomoc">
                <MenuItem Header="_O programie" Click="Info_Click"/>
            </MenuItem>
        </Menu>
        <ListBox x:Name="wpisy">
            <ListBoxItem Content="Dzień 1: wypływamy ⛵"/>
        </ListBox>
    </DockPanel>
</Window>`, 'OknoWpisu.xaml': c`<Window x:Class="KapiPasta.OknoWpisu"
        ` + XH + c`
        Title="Nowy wpis" Height="170" Width="300">
    <StackPanel Margin="10">
        <TextBlock Text="Co się dziś wydarzyło?"/>
        <TextBox x:Name="pole" Margin="0,6"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
            <Button Content="OK" Width="70" Click="Ok_Click" IsDefault="True"/>
            <Button Content="Anuluj" Width="70" Margin="6,0,0,0" Click="Anuluj_Click"/>
        </StackPanel>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Nowy_Click(object sender, RoutedEventArgs e)
        {
            OknoWpisu okno = new OknoWpisu();
            okno.Owner = this;
            if (okno.ShowDialog() == true)
            {
                wpisy.Items.Add(okno.Tekst);
            }
        }

        private void Info_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("Dziennik kapitana Kapi, wersja 1.0", "O programie",
                MessageBoxButton.OK, MessageBoxImage.Information);
        }

        private void Zamknij_Click(object sender, RoutedEventArgs e)
        {
            var odp = MessageBox.Show("Na pewno zamknąć dziennik?", "Pytanie",
                MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (odp == MessageBoxResult.Yes)
            {
                Close();
            }
        }`, `

    public partial class OknoWpisu : Window
    {
        public string Tekst => pole.Text;

        public OknoWpisu()
        {
            InitializeComponent();
        }

        private void Ok_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
        }

        private void Anuluj_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
        }
    }`) },
     scene: { s: 'wpf', cap: 'Plik → Nowy wpis otwiera okno modalne (ShowDialog): okno główne jest zablokowane, dopóki nie klikniesz OK albo Anuluj. Zamknij pyta przez MessageBox z przyciskami Tak/Nie.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Która metoda otwiera okno jako <b>modalne</b>?', opts: ['ShowDialog()', 'Show()', 'Open()', 'Modal()'], a: 0, why: 'ShowDialog() czeka na zamknięcie okna i zwraca DialogResult.' },
   { t: 'quiz', l: 1, q: 'Co oznacza podkreślnik w <code>Header="_Plik"</code>?', opts: ['Skrót klawiszowy Alt+P', 'Pogrubienie tekstu', 'Ukrycie pozycji menu', 'Separator'], a: 0, why: 'Litera po _ jest klawiszem dostępu (podkreślona w menu).' },
   { t: 'quiz', l: 2, q: 'Co zwraca <code>MessageBox.Show(..., MessageBoxButton.YesNo)</code>?', opts: ['MessageBoxResult (np. Yes albo No)', 'bool', 'string z tekstem przycisku', 'Nic – to void'], a: 0, why: 'Wynik porównujemy z MessageBoxResult.Yes.' },
   { t: 'quiz', l: 2, q: 'Jak w oknie dialogowym zamknąć je z wynikiem „OK”?', opts: ['DialogResult = true;', 'return true;', 'Close(true);', 'ShowDialog(true);'], a: 0, why: 'Ustawienie DialogResult zamyka okno modalne, a ShowDialog() zwraca tę wartość.' },
   { t: 'fill', l: 2, lang: 'xaml', q: 'Uzupełnij menu: pozycja <code>Zapisz</code> ma być wewnątrz pozycji <code>Plik</code>.', cs: CSW(CTOR + `

        private void Zapisz_Click(object sender, RoutedEventArgs e) { }`), code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <___ Header="_Plik">
                <MenuItem Header="_Zapisz" Click="Zapisz_Click"/>
            </MenuItem>
        </Menu>
        <TextBlock/>
    </DockPanel>
</Window>`, ans: [['MenuItem']], why: 'Pozycje menu (także rozwijane) to MenuItem.' },
   { t: 'code', l: 3, wpf: true, q: 'Obsłuż kliknięcie <code>usun</code>: zapytaj <code>MessageBox</code> z przyciskami Tak/Nie „Usunąć skarb?”. Tylko po odpowiedzi <code>Yes</code> ustaw tekst TextBlocka <code>skarb</code> na <code>(pusto)</code>.',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Skrzynia" Height="200" Width="300">
    <StackPanel Margin="10">
        <TextBlock x:Name="skarb" Text="💰 złoto"/>
        <Button x:Name="usun" Content="Usuń" Click="Usun_Click"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Usun_Click(object sender, RoutedEventArgs e)
        {
            // Twój kod
        }`) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Skrzynia" Height="200" Width="300">
    <StackPanel Margin="10">
        <TextBlock x:Name="skarb" Text="💰 złoto"/>
        <Button x:Name="usun" Content="Usuń" Click="Usun_Click"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Usun_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("Usunąć skarb?", "Pytanie", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
            {
                skarb.Text = "(pusto)";
            }
        }`) },
     answers: { YesNo: 'Yes' },
     ui: "ui.click('usun'); if (!app.answers || !app.answers.length) return 'Użyj MessageBox.Show z MessageBoxButton.YesNo'; if (ui.text('skarb') !== '(pusto)') return 'Po odpowiedzi Tak tekst ma być: (pusto)'; app.opts.autoAnswer = { YesNo: 'No' }; ui.el('skarb').set('Text', 'x'); ui.click('usun'); if (ui.text('skarb') !== 'x') return 'Po odpowiedzi Nie tekst nie może się zmienić'; return '';", hint: 'if (MessageBox.Show("Usunąć skarb?", "Pytanie", MessageBoxButton.YesNo) == MessageBoxResult.Yes) { ... }' },
  ] },
 ] });

CH.push({
 id: 'wpf3', icon: { pirate: '🎨', kitchen: '🎂', hero: '✨' },
 name: { pirate: 'Malowane Mapy', kitchen: 'Dekoracja Talerza', hero: 'Efekty Specjalne', neutral: 'WpfGrafika' },
 topic: 'kształty, pędzle, rysowanie, animacje, grafika 3D, aplikacje oparte na stronach',
 outcomes: 'Tworzy kształty; stosuje pędzle i rysuje; programuje animacje; tworzy grafikę 3D; tworzy interfejs aplikacji oparty na stronach (Page, Frame, nawigacja).',
 lessons: [
 { id: 'ksztalty', title: 'Kształty, pędzle i rysowanie',
  theory: `<p>WPF ma gotowe <b>kształty</b> (Shapes): <code>Rectangle</code> (prostokąt, <code>RadiusX/Y</code> zaokrągla rogi), <code>Ellipse</code> (elipsa / koło), <code>Line</code> (<code>X1,Y1,X2,Y2</code>), <code>Polygon</code> (wielokąt z <code>Points</code>), <code>Polyline</code> i <code>Path</code> (dowolna ścieżka, np. <code>Data="M 0,0 L 50,50 Z"</code>).</p>
<p>Wypełnienie to <code>Fill</code>, obrys – <code>Stroke</code> i <code>StrokeThickness</code>. Kolory podajemy <b>pędzlami</b> (Brush):</p>
<ul><li><code>SolidColorBrush</code> – jednolity kolor; w XAML wystarczy nazwa (<code>Fill="Orange"</code>) lub zapis <code>#AARRGGBB</code>,</li>
<li><code>LinearGradientBrush</code> – gradient liniowy (<code>StartPoint</code>, <code>EndPoint</code>, <code>GradientStop</code>),</li>
<li><code>RadialGradientBrush</code> – gradient kołowy.</li></ul>
<p>Rysować można też z kodu: tworzymy kształt przez <code>new Ellipse { Width = 20, Height = 20, Fill = Brushes.Red }</code>, ustawiamy pozycję <code>Canvas.SetLeft</code>/<code>SetTop</code> i dodajemy do <code>plansza.Children.Add(...)</code>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Wyspa Kapi" Height="300" Width="420">
    <Canvas>
        <Rectangle Width="420" Height="170">
            <Rectangle.Fill>
                <LinearGradientBrush StartPoint="0,0" EndPoint="0,1">
                    <GradientStop Color="DeepSkyBlue" Offset="0"/>
                    <GradientStop Color="LightCyan" Offset="1"/>
                </LinearGradientBrush>
            </Rectangle.Fill>
        </Rectangle>
        <Rectangle Canvas.Top="170" Width="420" Height="100" Fill="#FF1E88E5"/>
        <Ellipse Canvas.Left="320" Canvas.Top="20" Width="60" Height="60">
            <Ellipse.Fill>
                <RadialGradientBrush>
                    <GradientStop Color="Yellow" Offset="0"/>
                    <GradientStop Color="Orange" Offset="1"/>
                </RadialGradientBrush>
            </Ellipse.Fill>
        </Ellipse>
        <Ellipse Canvas.Left="90" Canvas.Top="140" Width="220" Height="70" Fill="SandyBrown"/>
        <Polygon Points="190,40 190,140 250,120" Fill="White" Stroke="Gray"/>
        <Line X1="190" Y1="35" X2="190" Y2="150" Stroke="SaddleBrown" StrokeThickness="4"/>
        <Path Data="M 20,230 Q 60,200 100,230 T 180,230" Stroke="White" StrokeThickness="3"/>
        <Image Source="kapi.png" Width="70" Canvas.Left="110" Canvas.Top="110"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     scene: { s: 'wpf', cap: 'Cała wyspa jest zbudowana z kształtów: niebo to prostokąt z gradientem, słońce – koło z gradientem kołowym, żagiel – Polygon, maszt – Line, fale – Path.' } },
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Malowanie kropkami – klikaj!" Height="280" Width="400">
    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal">
            <Button Content="Wyczyść" Click="Czysc_Click" Margin="4"/>
            <TextBlock x:Name="licznik" Text="Kropek: 0" Margin="8,6"/>
        </StackPanel>
        <Canvas x:Name="plotno" Background="White" MouseDown="Plotno_MouseDown"/>
    </DockPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(`        Random los = new Random();
        Brush[] kolory = { Brushes.Orange, Brushes.SaddleBrown, Brushes.Teal, Brushes.Crimson };

` + CTOR + `

        private void Plotno_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(plotno);
            int r = los.Next(10, 30);
            Ellipse kropka = new Ellipse
            {
                Width = r,
                Height = r,
                Fill = kolory[los.Next(kolory.Length)]
            };
            Canvas.SetLeft(kropka, p.X - r / 2);
            Canvas.SetTop(kropka, p.Y - r / 2);
            plotno.Children.Add(kropka);
            licznik.Text = $"Kropek: {plotno.Children.Count}";
        }

        private void Czysc_Click(object sender, RoutedEventArgs e)
        {
            plotno.Children.Clear();
            licznik.Text = "Kropek: 0";
        }`).replace('using System.Windows.Media;', 'using System.Windows.Media;\nusing System.Windows.Shapes;') }, lvl: 2,
     scene: { s: 'wpf', cap: 'Rysowanie z kodu: każde kliknięcie tworzy nowy obiekt Ellipse, ustawia jego pozycję na Canvas i dodaje go do Children.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Która właściwość ustawia <b>wypełnienie</b> kształtu?', opts: ['Fill', 'Stroke', 'Background', 'Foreground'], a: 0, why: 'Kształty mają Fill (wnętrze) i Stroke (obrys).' },
   { t: 'quiz', l: 1, q: 'Jak narysować <b>koło</b> o średnicy 50?', opts: ['<Ellipse Width="50" Height="50"/>', '<Circle Radius="25"/>', '<Rectangle Width="50"/>', '<Ellipse Radius="50"/>'], a: 0, why: 'WPF nie ma kontrolki Circle – koło to Ellipse o równej szerokości i wysokości.' },
   { t: 'quiz', l: 2, q: 'Kolor zapisano jako <code>#80FF0000</code>. Co oznacza pierwsza para cyfr <code>80</code>?', opts: ['Przezroczystość (kanał alfa) – około 50%', 'Ilość czerwieni', 'Grubość linii', 'Numer koloru w palecie'], a: 0, why: 'W WPF zapis to #AARRGGBB – pierwsza para to alfa.' },
   { t: 'bug', l: 2, lang: 'xaml', q: 'Projektant XAML zgłasza błąd. Kliknij linię z błędem.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <Canvas>
        <Ellipse Width="40" Height="40" Fill="Orange"/>
        <Rectangle Width="60" Height="30" Fill="Pomaranczowy"/>
    </Canvas>
</Window>`, line: 6, fix: '<Rectangle Width="60" Height="30" Fill="Orange"/>', why: 'Nazwy kolorów są po angielsku (Orange) – „Pomaranczowy” nie jest poprawnym pędzlem.' },
   { t: 'fill', l: 2, lang: 'xaml', q: 'Uzupełnij, aby prostokąt miał czarny obrys o grubości 3.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <Rectangle Width="100" Height="50" Fill="Yellow" ___="Black" ___="3"/>
</Window>`, ans: [['Stroke'], ['StrokeThickness']], why: 'Obrys to Stroke, jego grubość – StrokeThickness.' },
   { t: 'code', l: 2, wpf: true, q: 'Narysuj na Canvas <b>czerwone koło</b> (Ellipse 80×80, <code>Fill="Red"</code>, <code>x:Name="kolo"</code>) w punkcie Canvas.Left=50, Canvas.Top=40 oraz zielony prostokąt (<code>x:Name="trawa"</code>, 300×40, Fill="Green") z Canvas.Top=150.',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Rysunek" Height="260" Width="340">
    <Canvas>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Rysunek" Height="260" Width="340">
    <Canvas>
        <Ellipse x:Name="kolo" Width="80" Height="80" Fill="Red" Canvas.Left="50" Canvas.Top="40"/>
        <Rectangle x:Name="trawa" Width="300" Height="40" Fill="Green" Canvas.Top="150"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "if (!ui.has('kolo') || ui.el('kolo').__type !== 'Ellipse') return 'Dodaj Ellipse x:Name=\"kolo\"'; const k = ui.el('kolo'); if (k.p.Width !== 80 || k.p.Height !== 80) return 'Koło ma mieć 80×80'; if (!k.p.Fill || String(k.p.Fill.color).toLowerCase() !== 'red') return 'Koło ma być czerwone (Fill=\"Red\")'; if (k.att['Canvas.Left'] !== 50 || k.att['Canvas.Top'] !== 40) return 'Koło: Canvas.Left=50, Canvas.Top=40'; if (!ui.has('trawa') || ui.el('trawa').__type !== 'Rectangle') return 'Dodaj Rectangle x:Name=\"trawa\"'; const t = ui.el('trawa'); if (t.p.Width !== 300 || t.p.Height !== 40 || String(t.p.Fill && t.p.Fill.color).toLowerCase() !== 'green' || t.att['Canvas.Top'] !== 150) return 'Prostokąt: 300×40, Fill=Green, Canvas.Top=150'; return '';", hint: '<Ellipse x:Name="kolo" Width="80" Height="80" Fill="Red" Canvas.Left="50" Canvas.Top="40"/>' },
  ] },
 { id: 'animacje', title: 'Animacje',
  theory: `<p>Animacja w WPF to <b>płynna zmiana wartości właściwości w czasie</b>. Najważniejsze klasy:</p>
<ul><li><code>DoubleAnimation</code> – zmienia liczbę (np. <code>Width</code>, <code>Opacity</code>, <code>Canvas.Left</code>, kąt obrotu),</li>
<li><code>ColorAnimation</code> – zmienia kolor,</li>
<li><code>Storyboard</code> – „scenariusz” grupujący animacje, <code>Storyboard.TargetName</code> i <code>Storyboard.TargetProperty</code> mówią, co animować.</li></ul>
<p>Atrybuty: <code>From</code>, <code>To</code> (albo <code>By</code>), <code>Duration="0:0:2"</code> (godz:min:sek), <code>AutoReverse="True"</code> (powrót), <code>RepeatBehavior="Forever"</code> lub <code>"3x"</code>.</p>
<p>W XAML animację uruchamia <b>wyzwalacz zdarzenia</b>: <code>EventTrigger RoutedEvent="Loaded"</code> (po załadowaniu) albo <code>"Button.Click"</code>. W kodzie C#: <code>element.BeginAnimation(Canvas.LeftProperty, animacja);</code>.</p>
<p>Do obracania i skalowania służą <b>transformacje</b>: <code>RotateTransform</code> (<code>Angle</code>), <code>ScaleTransform</code>, <code>TranslateTransform</code> ustawiane w <code>RenderTransform</code>.</p>`,
  more: `<p>Do gier lepszy od animacji bywa <code>DispatcherTimer</code>: co określony czas (<code>Interval</code>) wywołuje zdarzenie <code>Tick</code>, w którym przesuwamy obiekty i sprawdzamy kolizje – to tzw. <b>pętla gry</b>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Tańcząca Kapi" Height="300" Width="420">
    <Canvas Background="LightYellow">
        <Image x:Name="kapi" Source="kapi.png" Width="90" Canvas.Left="20" Canvas.Top="60"
               RenderTransformOrigin="0.5,0.5">
            <Image.RenderTransform>
                <RotateTransform x:Name="obrot" Angle="0"/>
            </Image.RenderTransform>
            <Image.Triggers>
                <EventTrigger RoutedEvent="Loaded">
                    <BeginStoryboard>
                        <Storyboard RepeatBehavior="Forever">
                            <DoubleAnimation Storyboard.TargetName="kapi"
                                             Storyboard.TargetProperty="(Canvas.Left)"
                                             From="20" To="300" Duration="0:0:3" AutoReverse="True"/>
                            <DoubleAnimation Storyboard.TargetName="obrot"
                                             Storyboard.TargetProperty="Angle"
                                             From="-15" To="15" Duration="0:0:0.5" AutoReverse="True"
                                             RepeatBehavior="Forever"/>
                        </Storyboard>
                    </BeginStoryboard>
                </EventTrigger>
            </Image.Triggers>
        </Image>
        <Button x:Name="pulsuj" Content="Pulsuj!" Canvas.Left="160" Canvas.Top="200" Width="90" Click="Pulsuj_Click"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Pulsuj_Click(object sender, RoutedEventArgs e)
        {
            var anim = new System.Windows.Media.Animation.DoubleAnimation(90, 160, TimeSpan.FromSeconds(0.4));
            anim.AutoReverse = true;
            pulsuj.BeginAnimation(Button.WidthProperty, anim);
        }`) },
     scene: { s: 'wpf', cap: 'Storyboard w XAML przesuwa Kapi tam i z powrotem (Canvas.Left) i kołysze nim (RotateTransform.Angle). Przycisk uruchamia animację szerokości z kodu C#.' } },
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Złap pomarańczę! (strzałki)" Height="300" Width="400" KeyDown="Window_KeyDown">
    <Canvas x:Name="plansza" Background="Honeydew">
        <TextBlock x:Name="owoc" Text="🍊" FontSize="30" Canvas.Left="180" Canvas.Top="0"/>
        <Image x:Name="kapi" Source="kapi.png" Width="70" Canvas.Left="160" Canvas.Top="200"/>
        <TextBlock x:Name="wynik" Text="Punkty: 0" Canvas.Left="8" Canvas.Top="8" FontWeight="Bold"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer zegar = new System.Windows.Threading.DispatcherTimer();
        Random los = new Random();
        int punkty = 0;

        public MainWindow()
        {
            InitializeComponent();
            zegar.Interval = TimeSpan.FromMilliseconds(40);
            zegar.Tick += Zegar_Tick;
            zegar.Start();
        }

        private void Zegar_Tick(object sender, EventArgs e)
        {
            double y = Canvas.GetTop(owoc) + 5;
            double ox = Canvas.GetLeft(owoc);
            double kx = Canvas.GetLeft(kapi);
            if (y > 200 && ox > kx - 20 && ox < kx + 60)
            {
                punkty++;
                wynik.Text = $"Punkty: {punkty}";
                y = 0;
                Canvas.SetLeft(owoc, los.Next(0, 350));
            }
            else if (y > 260)
            {
                y = 0;
                Canvas.SetLeft(owoc, los.Next(0, 350));
            }
            Canvas.SetTop(owoc, y);
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double x = Canvas.GetLeft(kapi);
            if (e.Key == Key.Left) x = Math.Max(0, x - 20);
            if (e.Key == Key.Right) x = Math.Min(320, x + 20);
            Canvas.SetLeft(kapi, x);
        }`) }, lvl: 2,
     scene: { s: 'wpf', cap: 'Mini-gra: DispatcherTimer co 40 ms przesuwa pomarańczę w dół i sprawdza, czy Kapi ją złapał. Kliknij okno i steruj strzałkami!' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Która klasa animuje właściwość liczbową, np. szerokość?', opts: ['DoubleAnimation', 'ColorAnimation', 'Storyboard', 'RotateTransform'], a: 0, why: 'DoubleAnimation zmienia wartość typu double.' },
   { t: 'quiz', l: 1, q: 'Co oznacza <code>Duration="0:0:2"</code>?', opts: ['2 sekundy', '2 minuty', '2 milisekundy', '2 powtórzenia'], a: 0, why: 'Format to godziny:minuty:sekundy.' },
   { t: 'quiz', l: 2, q: 'Co robi <code>AutoReverse="True"</code>?', opts: ['Po dojściu do To animacja wraca do From', 'Odwraca kolory', 'Uruchamia animację od końca', 'Powtarza animację w nieskończoność'], a: 0, why: 'AutoReverse dodaje fazę powrotu.' },
   { t: 'quiz', l: 2, q: 'Jak w XAML uruchomić animację zaraz po pokazaniu okna?', opts: ['EventTrigger RoutedEvent="Loaded"', 'Storyboard.Start="True"', 'Animation.AutoPlay', 'Click="Loaded"'], a: 0, why: 'Zdarzenie Loaded zachodzi po załadowaniu elementu.' },
   { t: 'fill', l: 2, lang: 'xaml', q: 'Uzupełnij, aby animacja powtarzała się bez końca.', code: c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Kapi" Height="200" Width="300">
    <Rectangle x:Name="r" Width="50" Height="50" Fill="Orange">
        <Rectangle.Triggers>
            <EventTrigger RoutedEvent="Loaded">
                <BeginStoryboard>
                    <Storyboard ___="Forever">
                        <DoubleAnimation Storyboard.TargetName="r" Storyboard.TargetProperty="Opacity"
                                         From="1" To="0.2" Duration="0:0:1" AutoReverse="True"/>
                    </Storyboard>
                </BeginStoryboard>
            </EventTrigger>
        </Rectangle.Triggers>
    </Rectangle>
</Window>`, ans: [['RepeatBehavior']], why: 'RepeatBehavior="Forever" powtarza animację w nieskończoność.' },
   { t: 'code', l: 3, wpf: true, q: 'Uzupełnij <code>Zegar_Tick</code> tak, aby przy każdym tyknięciu zegara chmura <code>chmura</code> przesuwała się o 4 px w prawo (Canvas.Left), a gdy przekroczy 300 – wracała na 0.',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Wiatr" Height="200" Width="360">
    <Canvas Background="SkyBlue">
        <TextBlock x:Name="chmura" Text="☁️" FontSize="40" Canvas.Left="0" Canvas.Top="30"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer zegar = new System.Windows.Threading.DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            zegar.Interval = TimeSpan.FromMilliseconds(50);
            zegar.Tick += Zegar_Tick;
            zegar.Start();
        }

        private void Zegar_Tick(object sender, EventArgs e)
        {
            // Twój kod
        }`) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Wiatr" Height="200" Width="360">
    <Canvas Background="SkyBlue">
        <TextBlock x:Name="chmura" Text="☁️" FontSize="40" Canvas.Left="0" Canvas.Top="30"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer zegar = new System.Windows.Threading.DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            zegar.Interval = TimeSpan.FromMilliseconds(50);
            zegar.Tick += Zegar_Tick;
            zegar.Start();
        }

        private void Zegar_Tick(object sender, EventArgs e)
        {
            double x = Canvas.GetLeft(chmura) + 4;
            if (x > 300) x = 0;
            Canvas.SetLeft(chmura, x);
        }`) },
     ui: "ui.tick(3); let x = ui.el('chmura').att['Canvas.Left']; if (x !== 12) return 'Po 3 tyknięciach Canvas.Left ma wynosić 12 (jest ' + x + ')'; ui.tick(73); x = ui.el('chmura').att['Canvas.Left']; if (x > 300 || x < 0) return 'Po przekroczeniu 300 chmura ma wracać na 0'; return '';", hint: 'double x = Canvas.GetLeft(chmura) + 4; if (x > 300) x = 0; Canvas.SetLeft(chmura, x);' },
  ] },
 { id: 'grafika3d', title: 'Grafika 3D',
  theory: `<p>WPF potrafi wyświetlać proste sceny <b>3D</b> w kontrolce <code>Viewport3D</code>. Scena składa się z:</p>
<ul><li><b>kamery</b> – <code>PerspectiveCamera</code> z pozycją (<code>Position</code>), kierunkiem patrzenia (<code>LookDirection</code>) i kątem widzenia (<code>FieldOfView</code>),</li>
<li><b>świateł</b> – <code>AmbientLight</code> (rozproszone) i <code>DirectionalLight</code> (kierunkowe, z <code>Direction</code>),</li>
<li><b>modeli</b> – <code>GeometryModel3D</code> z <b>siatką</b> <code>MeshGeometry3D</code> i <b>materiałem</b> (<code>DiffuseMaterial</code> z pędzlem).</li></ul>
<p>Siatka to lista punktów 3D (<code>Positions="x,y,z x,y,z ..."</code>) i trójkątów zbudowanych z ich numerów (<code>TriangleIndices="0 1 2 ..."</code>). Trójkąt jest widoczny z tej strony, z której jego wierzchołki idą <b>przeciwnie do ruchu wskazówek zegara</b>.</p>
<p>Obiekt obracamy transformacją <code>RotateTransform3D</code> z <code>AxisAngleRotation3D</code> (<code>Axis</code> – oś, <code>Angle</code> – kąt). Animując <code>Angle</code>, uzyskujemy kręcący się model.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Piramida skarbów 3D" Height="300" Width="400">
    <Grid Background="Black">
        <Viewport3D>
            <Viewport3D.Camera>
                <PerspectiveCamera Position="0,1.2,5" LookDirection="0,-0.25,-1" FieldOfView="50"/>
            </Viewport3D.Camera>
            <ModelVisual3D>
                <ModelVisual3D.Content>
                    <Model3DGroup>
                        <AmbientLight Color="#FF404040"/>
                        <DirectionalLight Color="White" Direction="-1,-1,-2"/>
                        <GeometryModel3D>
                            <GeometryModel3D.Geometry>
                                <MeshGeometry3D
                                    Positions="0,1.5,0  -1,0,1  1,0,1  1,0,-1  -1,0,-1"
                                    TriangleIndices="0 1 2  0 2 3  0 3 4  0 4 1  1 4 3  1 3 2"/>
                            </GeometryModel3D.Geometry>
                            <GeometryModel3D.Material>
                                <DiffuseMaterial Brush="Gold"/>
                            </GeometryModel3D.Material>
                            <GeometryModel3D.Transform>
                                <RotateTransform3D>
                                    <RotateTransform3D.Rotation>
                                        <AxisAngleRotation3D x:Name="obrot" Axis="0,1,0" Angle="0"/>
                                    </RotateTransform3D.Rotation>
                                </RotateTransform3D>
                            </GeometryModel3D.Transform>
                        </GeometryModel3D>
                    </Model3DGroup>
                </ModelVisual3D.Content>
            </ModelVisual3D>
            <Viewport3D.Triggers>
                <EventTrigger RoutedEvent="Loaded">
                    <BeginStoryboard>
                        <Storyboard>
                            <DoubleAnimation Storyboard.TargetName="obrot" Storyboard.TargetProperty="Angle"
                                             From="0" To="360" Duration="0:0:6" RepeatBehavior="Forever"/>
                        </Storyboard>
                    </BeginStoryboard>
                </EventTrigger>
            </Viewport3D.Triggers>
        </Viewport3D>
    </Grid>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
     scene: { s: 'wpf', cap: 'Złota piramida z 5 punktów i 6 trójkątów obraca się wokół osi Y. Światło kierunkowe sprawia, że każda ściana ma inny odcień.' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'W jakiej kontrolce wyświetlamy scenę 3D w WPF?', opts: ['Viewport3D', 'Canvas3D', 'Scene', 'Grid3D'], a: 0, why: 'Scenę 3D umieszczamy w Viewport3D.' },
   { t: 'quiz', l: 1, q: 'Bez czego scena 3D będzie zupełnie niewidoczna (nie będzie od czego „oglądać”)?', opts: ['Bez kamery', 'Bez animacji', 'Bez stylu', 'Bez menu'], a: 0, why: 'Kamera określa, skąd i dokąd patrzymy na scenę.' },
   { t: 'quiz', l: 2, q: 'Z jakich elementów składa się siatka <code>MeshGeometry3D</code>?', opts: ['Z punktów (Positions) i trójkątów (TriangleIndices)', 'Z pikseli', 'Z prostokątów i kół', 'Z linii Line'], a: 0, why: 'Każda powierzchnia 3D to zbiór trójkątów rozpiętych na punktach.' },
   { t: 'quiz', l: 2, q: 'Ile trójkątów opisuje <code>TriangleIndices="0 1 2 2 3 0"</code>?', opts: ['2', '6', '3', '4'], a: 0, why: 'Każde trzy liczby to jeden trójkąt: (0,1,2) i (2,3,0).' },
   { t: 'quiz', l: 3, q: 'Która właściwość <code>AxisAngleRotation3D</code> określa, <b>wokół czego</b> obraca się model?', opts: ['Axis', 'Angle', 'Center', 'Direction'], a: 0, why: 'Axis to oś obrotu (np. 0,1,0 – oś Y), Angle – kąt.' },
  ] },
 { id: 'strony', title: 'Interfejs oparty na stronach',
  theory: `<p>Zamiast wielu okien aplikacja może mieć jedno okno i wiele <b>stron</b> (<code>Page</code>), między którymi się przechodzi – jak w przeglądarce albo kreatorze instalacji.</p>
<ul><li>Strona to plik XAML z korzeniem <code>&lt;Page&gt;</code> i klasa dziedzicząca po <code>Page</code>.</li>
<li>W oknie umieszczamy <code>&lt;Frame x:Name="ramka" Source="Start.xaml"/&gt;</code> – to „okienko”, w którym wyświetlają się strony.</li>
<li>Przejście z kodu: <code>NavigationService.Navigate(new Strona2());</code> (w stronie) albo <code>ramka.Navigate(new Strona2());</code> (w oknie).</li>
<li>Powrót: <code>NavigationService.GoBack()</code>; <code>CanGoBack</code> mówi, czy jest dokąd wrócić. Frame może pokazywać pasek nawigacji ze strzałkami.</li>
<li>W tekście można użyć linku: <code>&lt;Hyperlink NavigateUri="Strona2.xaml"&gt;Dalej&lt;/Hyperlink&gt;</code>.</li></ul>`,
  ex: [
   { wpf: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Książka kucharska Kapi" Height="300" Width="420">
    <Frame x:Name="ramka" Source="Start.xaml" NavigationUIVisibility="Visible"/>
</Window>`, 'Start.xaml': c`<Page x:Class="KapiPasta.Start"
      ` + XH + c`
      Title="Start">
    <StackPanel Margin="15" Background="LightYellow">
        <TextBlock Text="📖 Książka kucharska Kapi" FontSize="20"/>
        <Image Source="kapi.png" Height="80"/>
        <Button Content="Przepis na pastę →" Click="Pasta_Click" Margin="0,8,0,0"/>
        <TextBlock Margin="0,8,0,0">
            Albo kliknij <Hyperlink NavigateUri="Deser.xaml">deser</Hyperlink>.
        </TextBlock>
    </StackPanel>
</Page>`, 'Pasta.xaml': c`<Page x:Class="KapiPasta.Pasta"
      ` + XH + c`
      Title="Pasta">
    <StackPanel Margin="15">
        <TextBlock Text="🍝 Pasta à la Kapi" FontSize="20"/>
        <TextBlock Text="1. Ugotuj makaron&#10;2. Dodaj sos z pomarańczy&#10;3. Smacznego!"/>
        <Button Content="← Wróć" Click="Wroc_Click" Width="80" HorizontalAlignment="Left"/>
    </StackPanel>
</Page>`, 'Deser.xaml': c`<Page x:Class="KapiPasta.Deser"
      ` + XH + c`
      Title="Deser">
    <TextBlock Text="🍰 Tiramisu z arbuzem – przepis wkrótce!" FontSize="16" Margin="15"/>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Start : Page
    {
        public Start()
        {
            InitializeComponent();
        }

        private void Pasta_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Pasta());
        }
    }

    public partial class Pasta : Page
    {
        public Pasta()
        {
            InitializeComponent();
        }

        private void Wroc_Click(object sender, RoutedEventArgs e)
        {
            if (NavigationService.CanGoBack) NavigationService.GoBack();
        }
    }

    public partial class Deser : Page
    {
        public Deser()
        {
            InitializeComponent();
        }
    }`) },
     scene: { s: 'wpf', cap: 'Jedno okno, trzy strony: Frame pokazuje bieżącą stronę, przycisk przechodzi do przepisu (Navigate), a strzałka lub „Wróć” cofa (GoBack).' } },
  ],
  tasks: [
   { t: 'quiz', l: 1, q: 'Jaki element umieszczamy w oknie, aby wyświetlać w nim strony?', opts: ['Frame', 'Canvas', 'Image', 'Menu'], a: 0, why: 'Frame to kontener, w którym nawigujemy między stronami.' },
   { t: 'quiz', l: 1, q: 'Po jakiej klasie dziedziczy strona aplikacji WPF?', opts: ['Page', 'Window', 'Frame', 'Control'], a: 0, why: 'Strony to klasy dziedziczące po Page.' },
   { t: 'quiz', l: 2, q: 'Jak z kodu strony przejść do strony <code>Wyniki</code>?', opts: ['NavigationService.Navigate(new Wyniki());', 'new Wyniki().Show();', 'Frame.Open("Wyniki");', 'Page.Go(Wyniki);'], a: 0, why: 'NavigationService strony obsługuje przejścia.' },
   { t: 'quiz', l: 2, q: 'Jak sprawdzić, czy można wrócić do poprzedniej strony?', opts: ['NavigationService.CanGoBack', 'NavigationService.HasPrevious', 'Frame.Back == true', 'Page.Previous != null'], a: 0, why: 'CanGoBack ma wartość true, gdy w historii jest poprzednia strona.' },
   { t: 'code', l: 3, wpf: true, q: 'Na stronie <code>Start</code> uzupełnij <code>Dalej_Click</code> tak, aby przechodził do strony <code>Meta</code> (<code>NavigationService.Navigate</code>).',
     start: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Wyścig" Height="200" Width="320">
    <Frame x:Name="ramka" Source="Start.xaml"/>
</Window>`, 'Start.xaml': c`<Page x:Class="KapiPasta.Start"
      ` + XH + c`
      Title="Start">
    <Button x:Name="dalej" Content="Dalej" Click="Dalej_Click"/>
</Page>`, 'Meta.xaml': c`<Page x:Class="KapiPasta.Meta"
      ` + XH + c`
      Title="Meta">
    <TextBlock x:Name="koniec" Text="🏁 Meta!"/>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Start : Page
    {
        public Start() { InitializeComponent(); }

        private void Dalej_Click(object sender, RoutedEventArgs e)
        {
            // Twój kod
        }
    }

    public partial class Meta : Page
    {
        public Meta() { InitializeComponent(); }
    }`) },
     sol: { 'MainWindow.xaml': c`<Window x:Class="KapiPasta.MainWindow"
        ` + XH + c`
        Title="Wyścig" Height="200" Width="320">
    <Frame x:Name="ramka" Source="Start.xaml"/>
</Window>`, 'Start.xaml': c`<Page x:Class="KapiPasta.Start"
      ` + XH + c`
      Title="Start">
    <Button x:Name="dalej" Content="Dalej" Click="Dalej_Click"/>
</Page>`, 'Meta.xaml': c`<Page x:Class="KapiPasta.Meta"
      ` + XH + c`
      Title="Meta">
    <TextBlock x:Name="koniec" Text="🏁 Meta!"/>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Start : Page
    {
        public Start() { InitializeComponent(); }

        private void Dalej_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Meta());
        }
    }

    public partial class Meta : Page
    {
        public Meta() { InitializeComponent(); }
    }`) },
     ui: "if (ui.has('koniec')) return 'Na starcie ma być widoczna strona Start'; ui.click('dalej'); if (!ui.has('koniec')) return 'Po kliknięciu Dalej ma się pokazać strona Meta'; const f = ui.el('ramka'); if (!f.page || f.page.p.Title !== 'Meta') return 'Ramka ma wyświetlać stronę Meta'; return '';", hint: 'NavigationService.Navigate(new Meta());' },
  ] },
 ] });
