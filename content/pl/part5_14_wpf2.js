// Dział 14 (WPF – dane, style, dialogi): dodatkowe zadania.

X('binding', [
  QZ(1, 'Co daje wiązanie danych (binding) w WPF?', 'What does data binding give you in WPF?', ['Właściwość kontrolki aktualizuje się sama, gdy zmienia się źródło', 'Szybsze uruchamianie programu', 'Możliwość rysowania kształtów', 'Zapis danych do pliku'], ['A control property updates itself when the source changes', 'Faster program start-up', 'The ability to draw shapes', 'Saving data to a file'], 'Binding łączy cel ze źródłem – bez pisania obsługi zdarzeń.', 'Binding connects a target with a source – without writing event handlers.'),
  QZ(1, 'Co wskazuje <code>Path</code> w <code>{Binding ElementName=slider, Path=Value}</code>?', 'What does <code>Path</code> point to in <code>{Binding ElementName=slider, Path=Value}</code>?', ['Właściwość źródła, z której bierzemy wartość', 'Ścieżkę do pliku', 'Nazwę okna', 'Typ kontrolki'], ['The source property the value comes from', 'A file path', 'The window name', 'The control type'], 'ElementName wskazuje kontrolkę, a Path – jej właściwość.', 'ElementName points to the control, and Path to its property.'),
  XFILL(1, 'Uzupełnij wiązanie, aby TextBlock pokazywał wartość suwaka <code>s</code>.', 'Complete the binding so that the TextBlock shows the value of the slider <code>s</code>.', WX('Kapi', 200, 300, `    <StackPanel>
        <Slider x:Name="s" Maximum="10"/>
        <TextBlock Text="{Binding ElementName=s, Path=___}"/>
    </StackPanel>`), [['Value']], 'Wartość suwaka to właściwość Value.', 'The slider\'s value is the Value property.'),
  QZ(2, 'Do czego służy <code>StringFormat</code> w wiązaniu?', 'What is <code>StringFormat</code> in a binding for?', ['Do sformatowania wartości przed wyświetleniem, np. {0:F1} km', 'Do zamiany tekstu na liczbę', 'Do zmiany czcionki', 'Do sprawdzania poprawności danych'], ['To format the value before it is shown, e.g. {0:F1} km', 'To convert text into a number', 'To change the font', 'To validate data'], 'StringFormat działa jak string.Format – np. StringFormat=Cena: {0:F2} zł.', 'StringFormat works like string.Format – e.g. StringFormat=Price: {0:F2}.'),
  WC(3, 'Wyświetl w TextBlock <code>info</code> imię i wiek gracza przez <b>binding</b> do obiektu ustawionego jako <code>DataContext</code> (format <code>NAME, AGE</code>). Przycisk <code>older</code> zwiększa wiek o 1 – napis ma się odświeżyć.', 'Show the player\'s name and age in the TextBlock <code>info</code> through <b>binding</b> to an object set as the <code>DataContext</code> (format <code>NAME, AGE</code>). The button <code>older</code> increases the age by 1 – the text should refresh.',
    { 'MainWindow.xaml': WX('Player', 200, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="info"/>
        <Button x:Name="older" Content="+1" Click="Older_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(`        Player p = new Player { Name = "Kapi", Age = 5 };

` + CTOR + `

        private void Older_Click(object sender, RoutedEventArgs e)
        {
        }`, `

public class Player
{
    public string Name { get; set; }
    public int Age { get; set; }
}`) },
    { 'MainWindow.xaml': WX('Player', 200, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="info">
            <Run Text="{Binding Name}"/><Run Text=", "/><Run Text="{Binding Age}"/>
        </TextBlock>
        <Button x:Name="older" Content="+1" Click="Older_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(`        Player p = new Player { Name = "Kapi", Age = 5 };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = p;
        }

        private void Older_Click(object sender, RoutedEventArgs e)
        {
            p.Age++;
        }`, `

public class Player
{
    public string Name { get; set; }
    public int Age { get; set; }
}`) },
    "if (ui.text('info') !== 'Kapi, 5') return '«Na starcie ma być: Kapi, 5 (jest: |At start it should be: Kapi, 5 (it is: »' + ui.text('info') + ')'; ui.click('older'); ui.click('older'); if (ui.text('info') !== 'Kapi, 7') return '«Po dwóch kliknięciach ma być: Kapi, 7|After two clicks it should be: Kapi, 7»'; const c = app.it ? null : null; const src = String(app.opts.files['MainWindow.xaml']); if (!/Binding/.test(src)) return '«Użyj Binding w XAML|Use Binding in XAML»'; return '';",
    'DataContext = p; w konstruktorze, a w XAML np. <Run Text="{Binding Name}"/>. Albo jeden TextBlock z MultiBinding/StringFormat.', 'DataContext = p; in the constructor, and in XAML e.g. <Run Text="{Binding Name}"/>.'),
  WC(3, 'Zrób kalkulator BMI bez przycisku: dwa suwaki <code>mass</code> (30–150 kg) i <code>height</code> (100–220 cm). Przy każdej zmianie któregoś suwaka TextBlock <code>bmi</code> pokazuje BMI z jednym miejscem po przecinku (masa / wzrost² w metrach, format <code>F1</code>). Obsłuż <code>ValueChanged</code>.', 'Make a BMI calculator without a button: two sliders <code>mass</code> (30–150 kg) and <code>height</code> (100–220 cm). On every change of either slider the TextBlock <code>bmi</code> shows the BMI with one decimal place (mass / height² in metres, format <code>F1</code>). Handle <code>ValueChanged</code>.',
    { 'MainWindow.xaml': WX('BMI', 220, 320, `    <StackPanel Margin="10">
        <Slider x:Name="mass" Minimum="30" Maximum="150" Value="70"/>
        <Slider x:Name="height" Minimum="100" Maximum="220" Value="175"/>
        <TextBlock x:Name="bmi" FontSize="24"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    { 'MainWindow.xaml': WX('BMI', 220, 320, `    <StackPanel Margin="10">
        <Slider x:Name="mass" Minimum="30" Maximum="150" Value="70" ValueChanged="Changed"/>
        <Slider x:Name="height" Minimum="100" Maximum="220" Value="175" ValueChanged="Changed"/>
        <TextBlock x:Name="bmi" FontSize="24"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Changed(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (bmi == null || mass == null || height == null) return;
            double h = height.Value / 100;
            bmi.Text = (mass.Value / (h * h)).ToString("F1");
        }`) },
    "ui.slide('mass', 80); ui.slide('height', 200); if (ui.text('bmi') !== '20.0') return '«Dla 80 kg i 200 cm ma być 20.0 (jest: |For 80 kg and 200 cm it should be 20.0 (it is: »' + ui.text('bmi') + ')'; ui.slide('mass', 100); if (ui.text('bmi') !== '25.0') return '«Po zmianie masy na 100 ma być 25.0|After changing the mass to 100 it should be 25.0»'; return '';",
    'Jedna metoda obsługi dla obu suwaków; w niej sprawdź, czy kontrolki już istnieją (zdarzenie może przyjść w trakcie InitializeComponent).', 'One handler for both sliders; check inside that the controls already exist (the event may come during InitializeComponent).'),
]);

X('konwersja', [
  OUT(1, c`string text = "12";
int n = int.Parse(text) * 2;
Console.WriteLine(n + text);`, ['2412', '36', '24', '1224'], 'int.Parse zamienia "12" na liczbę; 24 + "12" skleja się w tekst 2412.', 'int.Parse turns "12" into a number; 24 + "12" is joined into the text 2412.'),
  QZ(1, 'Które dwie metody musi mieć klasa implementująca <code>IValueConverter</code>?', 'Which two methods must a class implementing <code>IValueConverter</code> have?', ['Convert i ConvertBack', 'Parse i ToString', 'Get i Set', 'Load i Save'], ['Convert and ConvertBack', 'Parse and ToString', 'Get and Set', 'Load and Save'], 'Convert – ze źródła do widoku, ConvertBack – z widoku do źródła.', 'Convert – from the source to the view, ConvertBack – from the view to the source.'),
  WC(3, 'Przelicznik walut: w polu <code>amount</code> użytkownik wpisuje kwotę w PLN (może użyć przecinka albo kropki). Po kliknięciu <code>calc</code> TextBlock <code>eur</code> pokazuje kwotę w EUR (kurs 4.25) z dwoma miejscami po przecinku, np. <code>23.53 EUR</code>. Dla błędnych danych pokaż <code>?</code>.', 'A currency converter: in the field <code>amount</code> the user types an amount in PLN (with a comma or a dot). After clicking <code>calc</code> the TextBlock <code>eur</code> shows the amount in EUR (rate 4.25) with two decimals, e.g. <code>23.53 EUR</code>. For invalid input show <code>?</code>.',
    { 'MainWindow.xaml': WX('Exchange', 200, 300, `    <StackPanel Margin="10">
        <TextBox x:Name="amount"/>
        <Button x:Name="calc" Content="=" Click="Calc_Click"/>
        <TextBlock x:Name="eur"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Calc_Click(object sender, RoutedEventArgs e)
        {
        }`) },
    { 'MainWindow.xaml': WX('Exchange', 200, 300, `    <StackPanel Margin="10">
        <TextBox x:Name="amount"/>
        <Button x:Name="calc" Content="=" Click="Calc_Click"/>
        <TextBlock x:Name="eur"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Calc_Click(object sender, RoutedEventArgs e)
        {
            string s = amount.Text.Replace(',', '.');
            if (double.TryParse(s, out double pln) && pln >= 0)
                eur.Text = $"{pln / 4.25:F2} EUR";
            else
                eur.Text = "?";
        }`) },
    "ui.type('amount', '100'); ui.click('calc'); if (ui.text('eur') !== '23.53 EUR') return '«Dla 100 ma być 23.53 EUR (jest: |For 100 it should be 23.53 EUR (it is: »' + ui.text('eur') + ')'; ui.type('amount', '42,5'); ui.click('calc'); if (ui.text('eur') !== '10.00 EUR') return '«Przecinek też ma działać: 42,5 → 10.00 EUR|A comma should work too: 42,5 → 10.00 EUR»'; ui.type('amount', 'abc'); ui.click('calc'); if (ui.text('eur') !== '?') return '«Dla błędnych danych ma być ?|For invalid input it should be ?»'; return '';",
    'Zamień przecinek na kropkę, potem double.TryParse; wynik sformatuj {x:F2}.', 'Replace the comma with a dot, then double.TryParse; format the result with {x:F2}.'),
  WC(3, 'Napisz konwerter <code>GradeToColor</code> (IValueConverter), który zamienia wartość suwaka <code>grade</code> (1–6) na pędzel: poniżej 3 – <code>Brushes.Red</code>, 3–4 – <code>Brushes.Orange</code>, 5 i więcej – <code>Brushes.Green</code>. Użyj go w wiązaniu tła prostokąta <code>box</code>.', 'Write a converter <code>GradeToColor</code> (IValueConverter) that turns the value of the slider <code>grade</code> (1–6) into a brush: below 3 – <code>Brushes.Red</code>, 3–4 – <code>Brushes.Orange</code>, 5 and more – <code>Brushes.Green</code>. Use it in the binding of the fill of the rectangle <code>box</code>.',
    { 'MainWindow.xaml': `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        xmlns:local="clr-namespace:KapiPasta"
        Title="Grade" Height="200" Width="300">
    <StackPanel Margin="10">
        <Slider x:Name="grade" Minimum="1" Maximum="6" Value="1" IsSnapToTickEnabled="True"/>
        <Rectangle x:Name="box" Height="50"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR) },
    { 'MainWindow.xaml': `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        xmlns:local="clr-namespace:KapiPasta"
        Title="Grade" Height="200" Width="300">
    <Window.Resources>
        <local:GradeToColor x:Key="g2c"/>
    </Window.Resources>
    <StackPanel Margin="10">
        <Slider x:Name="grade" Minimum="1" Maximum="6" Value="1" IsSnapToTickEnabled="True"/>
        <Rectangle x:Name="box" Height="50" Fill="{Binding ElementName=grade, Path=Value, Converter={StaticResource g2c}}"/>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public class GradeToColor : System.Windows.Data.IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            double g = (double)value;
            if (g < 3) return Brushes.Red;
            if (g < 5) return Brushes.Orange;
            return Brushes.Green;
        }

        public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }`) },
    "const col = () => { const f = ui.el('box').p.Fill; return f ? String(f.color).toLowerCase() : ''; }; if (col() !== 'red') return '«Dla oceny 1 ma być czerwony|For grade 1 it should be red»'; ui.slide('grade', 4); if (col() !== 'orange') return '«Dla oceny 4 ma być pomarańczowy|For grade 4 it should be orange»'; ui.slide('grade', 6); if (col() !== 'green') return '«Dla oceny 6 ma być zielony|For grade 6 it should be green»'; return '';",
    'Klasa konwertera w namespace KapiPasta, zasób <local:GradeToColor x:Key="g2c"/> i Fill="{Binding ..., Converter={StaticResource g2c}}".', 'A converter class in the KapiPasta namespace, a resource <local:GradeToColor x:Key="g2c"/> and Fill="{Binding ..., Converter={StaticResource g2c}}".'),
]);

X('style', [
  QZ(1, 'Gdzie zwykle definiujemy styl, aby działał w całym oknie?', 'Where do we usually define a style so that it works in the whole window?', ['W Window.Resources', 'W metodzie Main', 'W pliku App.config', 'W atrybucie Title'], null, 'Zasoby okna są dostępne dla wszystkich jego kontrolek.', 'Window resources are available to all its controls.'),
  XFILL(1, 'Uzupełnij, aby styl dotyczył wszystkich przycisków (bez klucza).', 'Fill in the gap so that the style applies to all buttons (no key).', WX('Kapi', 200, 300, `    <Window.Resources>
        <Style ___="Button">
            <Setter Property="Margin" Value="5"/>
        </Style>
    </Window.Resources>
    <Button Content="OK"/>`), [['TargetType']], 'TargetType mówi, do jakiego typu kontrolek styl się odnosi.', 'TargetType tells which type of controls the style applies to.'),
  QZ(2, 'Do czego służy <code>BasedOn="{StaticResource Base}"</code> w stylu?', 'What is <code>BasedOn="{StaticResource Base}"</code> in a style for?', ['Nowy styl dziedziczy wszystkie settery stylu Base i może dodać własne', 'Usuwa styl Base', 'Kopiuje kontrolkę', 'Ustawia tło na kolor Base'], ['The new style inherits all setters of the Base style and can add its own', 'It removes the Base style', 'It copies the control', 'It sets the background to the colour Base'], 'BasedOn pozwala budować style warstwami, bez powtarzania setterów.', 'BasedOn lets you build styles in layers without repeating setters.'),
  WC(3, 'Dodaj w zasobach styl z kluczem <code>Big</code> dla TextBlock (FontSize 28, FontWeight Bold) oraz styl <code>BigRed</code> oparty na <code>Big</code> (BasedOn), który dodaje Foreground <code>Red</code>. TextBlock <code>a</code> ma używać Big, a <code>b</code> – BigRed.', 'Add a style with the key <code>Big</code> for TextBlock (FontSize 28, FontWeight Bold) and a style <code>BigRed</code> based on <code>Big</code> (BasedOn) that adds Foreground <code>Red</code>. The TextBlock <code>a</code> should use Big, and <code>b</code> – BigRed.',
    { 'MainWindow.xaml': WX('Styles', 220, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="a" Text="Kapi"/>
        <TextBlock x:Name="b" Text="Pasta"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    { 'MainWindow.xaml': WX('Styles', 220, 300, `    <Window.Resources>
        <Style x:Key="Big" TargetType="TextBlock">
            <Setter Property="FontSize" Value="28"/>
            <Setter Property="FontWeight" Value="Bold"/>
        </Style>
        <Style x:Key="BigRed" TargetType="TextBlock" BasedOn="{StaticResource Big}">
            <Setter Property="Foreground" Value="Red"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="10">
        <TextBlock x:Name="a" Text="Kapi" Style="{StaticResource Big}"/>
        <TextBlock x:Name="b" Text="Pasta" Style="{StaticResource BigRed}"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    "const a = ui.el('a'), b = ui.el('b'); if (a.p.FontSize !== 28 || b.p.FontSize !== 28) return '«Oba napisy mają mieć FontSize 28|Both texts need FontSize 28»'; if (String(b.p.FontWeight).toLowerCase() !== 'bold') return '«BigRed ma dziedziczyć Bold z Big|BigRed should inherit Bold from Big»'; const fa = a.p.Foreground, fb = b.p.Foreground; if (!fb || String(fb.color).toLowerCase() !== 'red') return '«b ma być czerwony|b should be red»'; if (fa && String(fa.color).toLowerCase() === 'red') return '«a nie może być czerwony|a must not be red»'; if (!/BasedOn/.test(String(app.opts.files['MainWindow.xaml']))) return '«Użyj BasedOn|Use BasedOn»'; return '';",
    'BigRed: <Style x:Key="BigRed" TargetType="TextBlock" BasedOn="{StaticResource Big}">.', 'BigRed: <Style x:Key="BigRed" TargetType="TextBlock" BasedOn="{StaticResource Big}">.'),
]);

X('dialogi', [
  QZ(1, 'Jaką wartość zwróci <code>MessageBox.Show</code>, gdy użytkownik kliknie „Nie” w oknie z przyciskami YesNo?', 'What does <code>MessageBox.Show</code> return when the user clicks “No” in a YesNo box?', ['MessageBoxResult.No', 'false', '"Nie"', '0'], ['MessageBoxResult.No', 'false', '"No"', '0'], 'MessageBox zwraca wartość wyliczeniową MessageBoxResult.', 'MessageBox returns a value of the MessageBoxResult enumeration.'),
  QZ(1, 'Do czego służy element <code>Separator</code> w menu?', 'What is a <code>Separator</code> in a menu for?', ['Rysuje poziomą linię oddzielającą grupy pozycji', 'Zamyka menu', 'Dodaje skrót klawiszowy', 'Tworzy podmenu'], ['It draws a horizontal line between groups of items', 'It closes the menu', 'It adds a keyboard shortcut', 'It creates a submenu'], 'Separator porządkuje menu wizualnie.', 'A Separator organises the menu visually.'),
  WC(3, 'Menu <code>File</code> ma pozycje <code>New</code> (x:Name <code>miNew</code>) i <code>Exit</code> (x:Name <code>miExit</code>). New czyści TextBox <code>doc</code>, ale tylko po potwierdzeniu w MessageBox (YesNo) – i tylko gdy pole nie jest puste (dla pustego czyść bez pytania). Exit zamyka okno.', 'The <code>File</code> menu has the items <code>New</code> (x:Name <code>miNew</code>) and <code>Exit</code> (x:Name <code>miExit</code>). New clears the TextBox <code>doc</code>, but only after confirmation in a MessageBox (YesNo) – and only when the field is not empty (clear an empty one without asking). Exit closes the window.',
    { 'MainWindow.xaml': WX('Editor', 260, 360, `    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="_File">
            </MenuItem>
        </Menu>
        <TextBox x:Name="doc" AcceptsReturn="True"/>
    </DockPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    { 'MainWindow.xaml': WX('Editor', 260, 360, `    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="_File">
                <MenuItem x:Name="miNew" Header="_New" Click="New_Click"/>
                <Separator/>
                <MenuItem x:Name="miExit" Header="E_xit" Click="Exit_Click"/>
            </MenuItem>
        </Menu>
        <TextBox x:Name="doc" AcceptsReturn="True"/>
    </DockPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void New_Click(object sender, RoutedEventArgs e)
        {
            if (doc.Text == "" || MessageBox.Show("Clear the document?", "New", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
                doc.Text = "";
        }

        private void Exit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }`) },
    "if (!ui.has('miNew') || !ui.has('miExit')) return '«Dodaj pozycje menu miNew i miExit|Add the menu items miNew and miExit»'; ui.type('doc', 'text'); app.opts.autoAnswer = { YesNo: 'No' }; ui.menu('miNew'); if (ui.text('doc') !== 'text') return '«Po odpowiedzi Nie tekst ma zostać|After the answer No the text must stay»'; app.opts.autoAnswer = { YesNo: 'Yes' }; ui.menu('miNew'); if (ui.text('doc') !== '') return '«Po odpowiedzi Tak pole ma być puste|After the answer Yes the field should be empty»'; const n = (app.answers || []).length; ui.menu('miNew'); if ((app.answers || []).length > 0 && n === 0) return '«Dla pustego pola nie pytaj|Do not ask for an empty field»'; ui.menu('miExit'); if (!app.closed) return '«Exit ma zamknąć okno (Close())|Exit should close the window (Close())»'; return '';",
    'if (doc.Text == "" || MessageBox.Show(..., MessageBoxButton.YesNo) == MessageBoxResult.Yes) doc.Text = "";', 'if (doc.Text == "" || MessageBox.Show(..., MessageBoxButton.YesNo) == MessageBoxResult.Yes) doc.Text = "";', { pl: { answers: { YesNo: 'Yes' } } }),
  QZ(3, 'Co zwraca <code>ShowDialog()</code>, gdy okno dialogowe zamknięto przyciskiem X (bez ustawienia DialogResult)?', 'What does <code>ShowDialog()</code> return when the dialog was closed with the X button (without setting DialogResult)?', ['false', 'true', 'null zawsze', 'Wyjątek'], ['false', 'true', 'always null', 'An exception'], 'Zamknięcie okna bez ustawienia DialogResult daje false – to jak „Anuluj”.', 'Closing the window without setting DialogResult gives false – like “Cancel”.'),
]);
