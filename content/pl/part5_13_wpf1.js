// Dział 13 (WPF – podstawy): dodatkowe zadania. Używa XH / CSW / CTOR z part4_wpf.js.

const WX = (title, h, w, body) => `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        Title="${title}" Height="${h}" Width="${w}">
${body}
</Window>`;
// tekst «pl|en» w kodzie sprawdzającym ui → dwie wersje
const UI2 = s => [s.replace(/«([^|»]*)\|([^»]*)»/g, '$1'), s.replace(/«([^|»]*)\|([^»]*)»/g, '$2')];
// zadanie z kodem WPF: start i sol to obiekty plików, ui to skrypt sprawdzający (z «pl|en»)
const WC = (l, q, qEn, start, sol, ui, hint, hintEn, o = {}) => { const [uPl, uEn] = UI2(ui); return [Object.assign({ t: 'code', l, wpf: true, q, start, sol, ui: uPl, hint }, o.pl || {}), Object.assign({ q: qEn, ui: uEn, hint: hintEn }, o.en || {})]; };
const XFILL = (l, q, qEn, code, ans, why, whyEn, o = {}) => [Object.assign({ t: 'fill', l, lang: 'xaml', q, code, ans, why }, o.pl || {}), Object.assign({ q: qEn, why: whyEn }, o.en || {})];
const XBUG = (l, code, line, fix, why, whyEn, o = {}) => [Object.assign({ t: 'bug', l, lang: 'xaml', q: 'Projektant XAML zgłasza błąd. Kliknij linię z błędem.', code, line, fix, why }, o.pl || {}), Object.assign({ q: 'The XAML designer reports an error. Click the line with the bug.', why: whyEn }, o.en || {})];

X('wpfintro', [
  QZ(2, 'Która metoda w konstruktorze okna buduje kontrolki na podstawie pliku XAML?', 'Which method in a window constructor builds the controls from the XAML file?', ['InitializeComponent()', 'Show()', 'LoadXaml()', 'Main()'], null, 'InitializeComponent() jest generowana z XAML i tworzy wszystkie kontrolki okna.', 'InitializeComponent() is generated from XAML and creates all the window\'s controls.'),
  QZ(3, 'Do czego służy atrybut <code>x:Class="KapiPasta.MainWindow"</code> w pliku XAML?', 'What is the <code>x:Class="KapiPasta.MainWindow"</code> attribute in a XAML file for?', ['Łączy XAML z klasą częściową (partial) MainWindow w code-behind', 'Nadaje oknu tytuł', 'Ustawia styl okna', 'Określa, który plik uruchomić jako pierwszy'], ['It connects the XAML with the partial class MainWindow in the code-behind', 'It sets the window title', 'It sets the window style', 'It decides which file starts first'], 'XAML i plik .xaml.cs tworzą razem jedną klasę (partial class) – x:Class wskazuje jej pełną nazwę.', 'The XAML and the .xaml.cs file together form one class (partial class) – x:Class gives its full name.'),
  XBUG(3, WX('Kapi', 200, 300, `    <StackPanel>
        <TextBlock Text="Ahoy"/>
        <TextBlock Text="Second"/>
    </StackPanel>
    <Button Content="OK"/>`), 8, '<!-- przenieś Button do StackPanel -->', 'Window może mieć tylko jedno dziecko – StackPanel już nim jest, więc Button jest drugim elementem (MC3089). Przenieś go do StackPanel.', 'A Window can have only one child – the StackPanel already is, so the Button is a second element (MC3089). Move it into the StackPanel.', { pl: { fixcheck: false }, en: { fix: '<!-- move the Button into the StackPanel -->' } }),
]);

X('kontrolki', [
  QZ(1, 'Która kontrolka pokazuje <b>rozwijaną listę</b> do wyboru jednej pozycji?', 'Which control shows a <b>drop-down list</b> to choose one item?', ['ComboBox', 'ListBox', 'CheckBox', 'Slider'], null, 'ComboBox to lista rozwijana; ListBox pokazuje całą listę naraz.', 'ComboBox is a drop-down list; ListBox shows the whole list at once.'),
  XFILL(2, 'Uzupełnij atrybut, aby pole wyboru było domyślnie zaznaczone.', 'Fill in the attribute so that the check box is checked by default.', WX('Kapi', 200, 300, `    <CheckBox Content="Cheese" ___="True"/>`), [['IsChecked']], 'Stan zaznaczenia CheckBoxa to właściwość IsChecked.', 'The checked state of a CheckBox is the IsChecked property.'),
  WC(3, 'Po kliknięciu <code>orderBtn</code> TextBlock <code>summary</code> ma pokazać <code>DANIE x ILOŚĆ</code>, gdzie DANIE to tekst wybranej pozycji ComboBoxa <code>dish</code>, a ILOŚĆ – wartość suwaka <code>qty</code> (liczba całkowita). Gdy nic nie wybrano, pokaż <code>?</code>.', 'After clicking <code>orderBtn</code> the TextBlock <code>summary</code> should show <code>DISH x QTY</code>, where DISH is the text of the selected item of the ComboBox <code>dish</code> and QTY is the value of the slider <code>qty</code> (an integer). If nothing is selected, show <code>?</code>.',
    { 'MainWindow.xaml': WX('Order', 240, 320, `    <StackPanel Margin="10">
        <ComboBox x:Name="dish">
            <ComboBoxItem Content="Pizza"/>
            <ComboBoxItem Content="Pasta"/>
        </ComboBox>
        <Slider x:Name="qty" Minimum="1" Maximum="5" Value="1" IsSnapToTickEnabled="True"/>
        <Button x:Name="orderBtn" Content="Order" Click="Order_Click"/>
        <TextBlock x:Name="summary"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Order_Click(object sender, RoutedEventArgs e)
        {
            // Twój kod
        }`) },
    { 'MainWindow.xaml': WX('Order', 240, 320, `    <StackPanel Margin="10">
        <ComboBox x:Name="dish">
            <ComboBoxItem Content="Pizza"/>
            <ComboBoxItem Content="Pasta"/>
        </ComboBox>
        <Slider x:Name="qty" Minimum="1" Maximum="5" Value="1" IsSnapToTickEnabled="True"/>
        <Button x:Name="orderBtn" Content="Order" Click="Order_Click"/>
        <TextBlock x:Name="summary"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Order_Click(object sender, RoutedEventArgs e)
        {
            if (dish.SelectedItem is ComboBoxItem item)
                summary.Text = $"{item.Content} x {(int)qty.Value}";
            else
                summary.Text = "?";
        }`) },
    "ui.click('orderBtn'); if (ui.text('summary') !== '?') return '«Bez wyboru ma być: ?|With nothing selected it should be: ?»'; ui.select('dish', 1); ui.slide('qty', 3); ui.click('orderBtn'); if (ui.text('summary') !== 'Pasta x 3') return '«Dla Pasta i 3 ma być: Pasta x 3 (jest: |For Pasta and 3 it should be: Pasta x 3 (it is: »' + ui.text('summary') + ')'; return '';",
    'dish.SelectedItem is ComboBoxItem item – potem item.Content; (int)qty.Value.', 'dish.SelectedItem is ComboBoxItem item – then item.Content; (int)qty.Value.', { en: { start: { 'MainWindow.xaml': WX('Order', 240, 320, `    <StackPanel Margin="10">
        <ComboBox x:Name="dish">
            <ComboBoxItem Content="Pizza"/>
            <ComboBoxItem Content="Pasta"/>
        </ComboBox>
        <Slider x:Name="qty" Minimum="1" Maximum="5" Value="1" IsSnapToTickEnabled="True"/>
        <Button x:Name="orderBtn" Content="Order" Click="Order_Click"/>
        <TextBlock x:Name="summary"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Order_Click(object sender, RoutedEventArgs e)
        {
            // Your code
        }`) } } }),
  WC(3, 'Przycisk <code>go</code> ma być aktywny (IsEnabled) tylko wtedy, gdy CheckBox <code>agree</code> jest zaznaczony. Obsłuż zdarzenia <code>Checked</code> i <code>Unchecked</code>.', 'The button <code>go</code> should be enabled (IsEnabled) only when the CheckBox <code>agree</code> is checked. Handle the <code>Checked</code> and <code>Unchecked</code> events.',
    { 'MainWindow.xaml': WX('Rules', 200, 300, `    <StackPanel Margin="10">
        <CheckBox x:Name="agree" Content="I agree"/>
        <Button x:Name="go" Content="Go" IsEnabled="False"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    { 'MainWindow.xaml': WX('Rules', 200, 300, `    <StackPanel Margin="10">
        <CheckBox x:Name="agree" Content="I agree" Checked="Agree_Changed" Unchecked="Agree_Changed"/>
        <Button x:Name="go" Content="Go" IsEnabled="False"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Agree_Changed(object sender, RoutedEventArgs e)
        {
            go.IsEnabled = agree.IsChecked == true;
        }`) },
    "if (ui.el('go').p.IsEnabled !== false) return '«Na starcie przycisk ma być wyłączony|At start the button should be disabled»'; ui.click('agree'); if (ui.el('go').p.IsEnabled !== true) return '«Po zaznaczeniu przycisk ma być aktywny|After checking, the button should be enabled»'; ui.click('agree'); if (ui.el('go').p.IsEnabled !== false) return '«Po odznaczeniu przycisk ma być znów wyłączony|After unchecking, the button should be disabled again»'; return '';",
    'W XAML: Checked="Agree_Changed" Unchecked="Agree_Changed"; w C#: go.IsEnabled = agree.IsChecked == true;', 'In XAML: Checked="Agree_Changed" Unchecked="Agree_Changed"; in C#: go.IsEnabled = agree.IsChecked == true;'),
]);

X('uklad', [
  QZ(2, 'Co oznacza <code>&lt;RowDefinition Height="Auto"/&gt;</code> w Gridzie?', 'What does <code>&lt;RowDefinition Height="Auto"/&gt;</code> mean in a Grid?', ['Wiersz ma taką wysokość, jakiej potrzebuje jego zawartość', 'Wiersz zajmuje całą resztę miejsca', 'Wiersz ma wysokość 0', 'Wiersz ma stałe 100 px'], ['The row is as tall as its content needs', 'The row takes all the remaining space', 'The row has height 0', 'The row is a fixed 100 px'], 'Auto dopasowuje rozmiar do zawartości, * zajmuje resztę miejsca.', 'Auto fits the size to the content, * takes the remaining space.'),
  WC(3, 'Zbuduj układ w <code>DockPanel</code>: TextBlock <code>header</code> przyklejony do góry, StackPanel <code>menu</code> (szerokość 100) przyklejony do lewej i Canvas <code>board</code> wypełniający resztę (jako ostatni element).', 'Build a layout in a <code>DockPanel</code>: a TextBlock <code>header</code> docked to the top, a StackPanel <code>menu</code> (width 100) docked to the left and a Canvas <code>board</code> filling the rest (as the last element).',
    { 'MainWindow.xaml': WX('Layout', 260, 400, `    <DockPanel>

    </DockPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    { 'MainWindow.xaml': WX('Layout', 260, 400, `    <DockPanel>
        <TextBlock x:Name="header" DockPanel.Dock="Top" Text="Kapi"/>
        <StackPanel x:Name="menu" DockPanel.Dock="Left" Width="100"/>
        <Canvas x:Name="board" Background="LightBlue"/>
    </DockPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    "for (const n of ['header','menu','board']) if (!ui.has(n)) return '«Brakuje elementu |Missing element »' + n; const d = ui.byType('DockPanel')[0]; const h = ui.el('header'), m = ui.el('menu'), b = ui.el('board'); if (String(h.att['DockPanel.Dock']) !== 'Top') return '«header ma mieć DockPanel.Dock=\"Top\"|header needs DockPanel.Dock=\"Top\"»'; if (String(m.att['DockPanel.Dock']) !== 'Left') return '«menu ma mieć DockPanel.Dock=\"Left\"|menu needs DockPanel.Dock=\"Left\"»'; if (m.p.Width !== 100) return '«menu ma mieć szerokość 100|menu should be 100 wide»'; if (b.__type !== 'Canvas' || d.kids[d.kids.length - 1] !== b) return '«board (Canvas) ma być ostatnim elementem DockPanel|board (Canvas) should be the last element of the DockPanel»'; return '';",
    'Kolejność ma znaczenie: najpierw Top, potem Left, na końcu element wypełniający.', 'Order matters: first Top, then Left, and the filling element last.'),
  WC(3, 'Zbuduj formularz w Gridzie 2×2: w kolumnie 0 etykiety <code>Name:</code> i <code>Age:</code> (Label), w kolumnie 1 pola TextBox <code>nameBox</code> (wiersz 0) i <code>ageBox</code> (wiersz 1). Kolumna 0 ma mieć szerokość <code>Auto</code>, kolumna 1 – <code>*</code>.', 'Build a form in a 2×2 Grid: column 0 holds the labels <code>Name:</code> and <code>Age:</code> (Label), column 1 the TextBoxes <code>nameBox</code> (row 0) and <code>ageBox</code> (row 1). Column 0 should have width <code>Auto</code>, column 1 – <code>*</code>.',
    { 'MainWindow.xaml': WX('Form', 200, 320, `    <Grid Margin="10">

    </Grid>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    { 'MainWindow.xaml': WX('Form', 200, 320, `    <Grid Margin="10">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto"/>
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>
        <Label Content="Name:" Grid.Row="0" Grid.Column="0"/>
        <TextBox x:Name="nameBox" Grid.Row="0" Grid.Column="1"/>
        <Label Content="Age:" Grid.Row="1" Grid.Column="0"/>
        <TextBox x:Name="ageBox" Grid.Row="1" Grid.Column="1"/>
    </Grid>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    "const g = ui.byType('Grid')[0]; if (!g.cols || g.cols.length !== 2 || !g.rows || g.rows.length !== 2) return '«Grid ma mieć 2 wiersze i 2 kolumny|The Grid needs 2 rows and 2 columns»'; if (String(g.cols[0]).trim() !== 'Auto' || !/^1?\\*$/.test(String(g.cols[1]).trim())) return '«Kolumny: Auto i *|Columns: Auto and *»'; const L = t => ui.byType('Label').find(x => x.contentText() === t); const a = L('Name:'), b = L('Age:'); if (!a || !b) return '«Dodaj etykiety Name: i Age:|Add the labels Name: and Age:»'; if ((a.att['Grid.Column']||0) !== 0 || (b.att['Grid.Row']||0) !== 1) return '«Etykiety mają być w kolumnie 0, Age: w wierszu 1|Labels go in column 0, Age: in row 1»'; for (const [n, r] of [['nameBox', 0], ['ageBox', 1]]) { if (!ui.has(n) || ui.el(n).__type !== 'TextBox') return '«Dodaj TextBox |Add the TextBox »' + n; const e = ui.el(n); if ((e.att['Grid.Row']||0) !== r || (e.att['Grid.Column']||0) !== 1) return n + '«: wiersz | : row »' + r + '«, kolumna 1|, column 1»'; } return '';",
    'Grid.ColumnDefinitions z Width="Auto" i Width="*", potem Grid.Row / Grid.Column przy kontrolkach.', 'Grid.ColumnDefinitions with Width="Auto" and Width="*", then Grid.Row / Grid.Column on the controls.'),
]);

X('zdarzenia', [
  QZ(2, 'Które zdarzenie zachodzi przy każdej zmianie tekstu w <code>TextBox</code>?', 'Which event happens on every change of text in a <code>TextBox</code>?', ['TextChanged', 'Click', 'KeyDown', 'Loaded'], null, 'TextChanged zachodzi po każdej zmianie zawartości pola.', 'TextChanged happens after every change of the field\'s content.'),
  WC(3, 'Licznik: przycisk <code>plus</code> zwiększa liczbę w TextBlock <code>value</code> o 1, a <code>minus</code> zmniejsza o 1, ale nigdy poniżej 0. Gdy wartość dojdzie do 10, TextBlock ma zmienić kolor tekstu na <code>Red</code> (Brushes.Red), poniżej 10 – na <code>Black</code>.', 'A counter: the <code>plus</code> button increases the number in the TextBlock <code>value</code> by 1, and <code>minus</code> decreases it by 1, but never below 0. When the value reaches 10, the TextBlock\'s text colour should change to <code>Red</code> (Brushes.Red), below 10 – to <code>Black</code>.',
    { 'MainWindow.xaml': WX('Counter', 200, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="value" Text="0" FontSize="30"/>
        <Button x:Name="plus" Content="+" Click="Plus_Click"/>
        <Button x:Name="minus" Content="-" Click="Minus_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(`        int n = 0;

` + CTOR + `

        private void Plus_Click(object sender, RoutedEventArgs e)
        {
        }

        private void Minus_Click(object sender, RoutedEventArgs e)
        {
        }`) },
    { 'MainWindow.xaml': WX('Counter', 200, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="value" Text="0" FontSize="30"/>
        <Button x:Name="plus" Content="+" Click="Plus_Click"/>
        <Button x:Name="minus" Content="-" Click="Minus_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(`        int n = 0;

` + CTOR + `

        private void Show()
        {
            value.Text = n.ToString();
            value.Foreground = n >= 10 ? Brushes.Red : Brushes.Black;
        }

        private void Plus_Click(object sender, RoutedEventArgs e)
        {
            n++;
            Show();
        }

        private void Minus_Click(object sender, RoutedEventArgs e)
        {
            if (n > 0) n--;
            Show();
        }`) },
    "ui.click('minus'); if (ui.text('value') !== '0') return '«Nie schodź poniżej 0|Do not go below 0»'; for (let i = 0; i < 10; i++) ui.click('plus'); if (ui.text('value') !== '10') return '«Po 10 kliknięciach + ma być 10 (jest |After 10 clicks of + it should be 10 (it is »' + ui.text('value') + ')'; const fg = ui.el('value').p.Foreground; if (!fg || String(fg.color).toLowerCase() !== 'red') return '«Przy 10 tekst ma być czerwony|At 10 the text should be red»'; ui.click('minus'); const fg2 = ui.el('value').p.Foreground; if (ui.text('value') !== '9' || !fg2 || String(fg2.color).toLowerCase() !== 'black') return '«Przy 9 tekst ma być czarny|At 9 the text should be black»'; return '';",
    'Wydziel metodę Show(), która ustawia Text i Foreground – wołaj ją z obu przycisków.', 'Extract a Show() method that sets Text and Foreground – call it from both buttons.'),
  WC(3, 'Lista zadań: po naciśnięciu <b>Enter</b> w polu <code>input</code> jego tekst ma trafić na koniec ListBoxa <code>todo</code>, a pole ma się wyczyścić. Pusty tekst ignoruj. Obsłuż <code>KeyDown</code> pola.', 'A to-do list: after pressing <b>Enter</b> in the field <code>input</code>, its text should go to the end of the ListBox <code>todo</code> and the field should be cleared. Ignore empty text. Handle the field\'s <code>KeyDown</code>.',
    { 'MainWindow.xaml': WX('To do', 260, 300, `    <StackPanel Margin="10">
        <TextBox x:Name="input"/>
        <ListBox x:Name="todo" Height="150"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
    { 'MainWindow.xaml': WX('To do', 260, 300, `    <StackPanel Margin="10">
        <TextBox x:Name="input" KeyDown="Input_KeyDown"/>
        <ListBox x:Name="todo" Height="150"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Input_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter && input.Text.Trim() != "")
            {
                todo.Items.Add(input.Text.Trim());
                input.Text = "";
            }
        }`) },
    "const items = () => ui.el('todo').items.map(x => typeof x === 'string' ? x : (x.contentText ? x.contentText() : String(x))); ui.type('input', 'buy oranges'); ui.key('Enter', 'input'); if (items().join('|') !== 'buy oranges') return '«Po Enter lista ma zawierać: buy oranges|After Enter the list should contain: buy oranges»'; if (ui.text('input') !== '') return '«Pole ma się wyczyścić|The field should be cleared»'; ui.key('Enter', 'input'); if (items().length !== 1) return '«Pusty tekst ignoruj|Ignore empty text»'; ui.type('input', 'swim'); ui.key('A', 'input'); if (items().length !== 1) return '«Dodawaj tylko po Enter|Add only on Enter»'; ui.key('Enter', 'input'); if (items().join('|') !== 'buy oranges|swim') return '«Nowe zadanie ma trafić na koniec|A new task should go to the end»'; return '';",
    'if (e.Key == Key.Enter && input.Text.Trim() != "") { todo.Items.Add(...); input.Text = ""; }', 'if (e.Key == Key.Enter && input.Text.Trim() != "") { todo.Items.Add(...); input.Text = ""; }'),
  WC(3, 'Kliknięcie myszą w Canvas <code>board</code> ma postawić tam kropkę: przesuń TextBlock <code>dot</code> tak, aby jego Canvas.Left i Canvas.Top były równe współrzędnym kliknięcia, i zwiększ licznik w TextBlock <code>clicks</code>.', 'A mouse click on the Canvas <code>board</code> should place a dot there: move the TextBlock <code>dot</code> so its Canvas.Left and Canvas.Top equal the click coordinates, and increase the counter in the TextBlock <code>clicks</code>.',
    { 'MainWindow.xaml': WX('Dots', 260, 360, `    <Canvas x:Name="board" Background="White" MouseDown="Board_MouseDown">
        <TextBlock x:Name="dot" Text="●" Canvas.Left="0" Canvas.Top="0"/>
        <TextBlock x:Name="clicks" Text="0" Canvas.Left="300" Canvas.Top="5"/>
    </Canvas>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Board_MouseDown(object sender, MouseButtonEventArgs e)
        {
        }`) },
    { 'MainWindow.xaml': WX('Dots', 260, 360, `    <Canvas x:Name="board" Background="White" MouseDown="Board_MouseDown">
        <TextBlock x:Name="dot" Text="●" Canvas.Left="0" Canvas.Top="0"/>
        <TextBlock x:Name="clicks" Text="0" Canvas.Left="300" Canvas.Top="5"/>
    </Canvas>`), 'MainWindow.xaml.cs': CSW(`        int count = 0;

` + CTOR + `

        private void Board_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(board);
            Canvas.SetLeft(dot, p.X);
            Canvas.SetTop(dot, p.Y);
            count++;
            clicks.Text = count.ToString();
        }`) },
    "ui.mouse('MouseDown', 'board', 40, 70); const d = ui.el('dot'); if (d.att['Canvas.Left'] !== 40 || d.att['Canvas.Top'] !== 70) return '«Po kliknięciu w (40, 70) kropka ma być w (40, 70)|After a click at (40, 70) the dot should be at (40, 70)»'; ui.mouse('MouseDown', 'board', 120, 30); if (ui.text('clicks') !== '2') return '«Po dwóch kliknięciach licznik ma pokazać 2|After two clicks the counter should show 2»'; if (d.att['Canvas.Left'] !== 120) return '«Kropka ma się przesuwać przy każdym kliknięciu|The dot should move on every click»'; return '';",
    'Point p = e.GetPosition(board); Canvas.SetLeft(dot, p.X); Canvas.SetTop(dot, p.Y);', 'Point p = e.GetPosition(board); Canvas.SetLeft(dot, p.X); Canvas.SetTop(dot, p.Y);'),
]);
