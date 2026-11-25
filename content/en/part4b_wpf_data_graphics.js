// English translation of chapters 14–15 (WPF data, styles, dialogs, graphics). Uses XH / CSW / CTOR / WIN from part4a.

Object.assign(TR.ch, {
 wpf2: { name: { pirate: 'Flags and Signals', kitchen: 'Restaurant Menu', hero: 'Command Centre', neutral: 'WpfDataAndStyles' }, topic: 'binding, converters, styles, resources, menu, MessageBox, dialog windows',
  outcomes: 'Uses element binding and data conversion; uses styles and resources; programs an application menu system; programs dialog windows (modal and modeless).' },
 wpf3: { name: { pirate: 'Painted Maps', kitchen: 'Plate Decoration', hero: 'Special Effects', neutral: 'WpfGraphics' }, topic: 'shapes, brushes, drawing, animations, 3D graphics, page-based applications',
  outcomes: 'Creates shapes; uses brushes and draws; programs animations; creates 3D graphics; creates a page-based application interface (Page, Frame, navigation).' },
});

Object.assign(TR.les, {
 binding: { title: 'Element binding',
  theory: `<p><b>Data binding</b> automatically connects a property of one control with another value – without writing event handlers. When the source changes, the target updates itself.</p>
<pre>&lt;Slider x:Name="slider" Maximum="100"/&gt;
&lt;TextBlock Text="{Binding ElementName=slider, Path=Value}"/&gt;</pre>
<ul><li><code>ElementName</code> – the name of the source control, <code>Path</code> – its property,</li>
<li><code>StringFormat=F0</code> – formatting (e.g. no decimal places),</li>
<li><code>Mode</code> – the direction: <code>OneWay</code> (source → target), <code>TwoWay</code> (both ways; the default for TextBox.Text), <code>OneTime</code>.</li></ul>
<p>You can also bind to a <b>C# object</b>: in code set <code>DataContext = myObject;</code>, and in XAML write <code>{Binding Name}</code> – that reads the <code>Name</code> property of that object.</p>`,
  more: `<p>In real WPF, for the view to refresh by itself after an object property changes in code, the class must implement the <code>INotifyPropertyChanged</code> interface and raise the <code>PropertyChanged</code> event. The KapiPasta simulator refreshes bindings automatically after every event, but in Visual Studio remember that interface (or use the MVVM Toolkit).</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN('Binding at Kapi’s', 270, 400, `    <StackPanel Margin="15">
        <TextBlock Text="How many oranges?"/>
        <Slider x:Name="slider" Minimum="8" Maximum="30" Value="16"
                IsSnapToTickEnabled="True" TickFrequency="1"/>
        <TextBlock FontSize="22"
                   Text="{Binding ElementName=slider, Path=Value, StringFormat=Kapi will eat {0} oranges}"/>
        <TextBox x:Name="box" Text="Type something" Margin="0,10,0,0"/>
        <TextBlock Text="{Binding ElementName=box, Path=Text}" FontStyle="Italic"
                   FontSize="{Binding ElementName=slider, Path=Value}"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) }, cap: 'Move the slider – the label and the font size change by themselves, without a single line of C#. That is data binding.' },
   { wpf: { 'MainWindow.xaml': WIN('Pirate card', 240, 360, `    <StackPanel Margin="15">
        <TextBlock Text="{Binding Name, StringFormat=Pirate: {0}}" FontSize="20"/>
        <TextBlock Text="{Binding Gold, StringFormat=Gold: {0} coins}"/>
        <TextBox Text="{Binding Name, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}" Margin="0,8"/>
        <Button Content="Find treasure 💰" Click="Treasure_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(`        Pirate pirate = new Pirate { Name = "Kapi", Gold = 10 };

        public MainWindow()
        {
            InitializeComponent();
            DataContext = pirate;
        }

        private void Treasure_Click(object sender, RoutedEventArgs e)
        {
            pirate.Gold += 50;
        }`, `

public class Pirate
{
    public string Name { get; set; }
    public int Gold { get; set; }
}`) }, cap: 'DataContext points to a Pirate object. Type a new name – the TextBox (TwoWay) changes the object, and the TextBlock shows it at once.' },
  ],
  tasks: [
   { q: 'What does <code>Text="{Binding ElementName=slider, Path=Value}"</code> do?', opts: ['Displays the current value of the slider control and updates itself', 'Displays the text Binding', 'Creates a new slider', 'Copies the value only once at start-up'], why: 'Binding connects Text with the Value property of the slider.' },
   { q: 'Which binding mode sends changes <b>both ways</b>?', why: 'TwoWay – a change in the target (e.g. a TextBox) also updates the source.' },
   { q: 'What must be set in code so that <code>{Binding Name}</code> reads a property of the <code>player</code> object?', opts: ['DataContext = player;', 'Binding = player;', 'Source.Name = player;', 'player.Bind();'], why: 'Bindings without ElementName look for their source in DataContext.' },
   { q: 'Complete the binding so that the TextBlock shows the text from the field <code>box</code>.', code: WIN('Kapi', 200, 300, `    <StackPanel>
        <TextBox x:Name="box"/>
        <TextBlock Text="{Binding ___=box, Path=Text}"/>
    </StackPanel>`), why: 'The source control is given by ElementName.' },
   { q: 'Add a TextBlock named <code>result</code> which, via <b>binding</b>, shows the value of the slider <code>volume</code> as <code>Volume: N</code> (no decimal places: <code>StringFormat=Volume: {0:F0}</code>).',
     start: { 'MainWindow.xaml': WIN("Kapi's radio", 200, 320, `    <StackPanel Margin="10">
        <Slider x:Name="volume" Minimum="0" Maximum="10" Value="4"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': WIN("Kapi's radio", 200, 320, `    <StackPanel Margin="10">
        <Slider x:Name="volume" Minimum="0" Maximum="10" Value="4"/>
        <TextBlock x:Name="result" Text="{Binding ElementName=volume, Path=Value, StringFormat=Volume: {0:F0}}"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "if (!ui.has('result')) return 'Add a TextBlock x:Name=\"result\"'; if (ui.text('result') !== 'Volume: 4') return 'At start it should be: Volume: 4 (it is: ' + ui.text('result') + ')'; ui.slide('volume', 7); if (ui.text('result') !== 'Volume: 7') return 'After moving the slider to 7 it should be: Volume: 7 – use Binding'; return '';", hint: 'Text="{Binding ElementName=volume, Path=Value, StringFormat=Volume: {0:F0}}"' },
  ] },
 konwersja: { title: 'Data conversion in a desktop application',
  theory: `<p>Controls hold <b>text</b> (<code>TextBox.Text</code> is a string), but calculations need numbers. That is why desktop applications convert data all the time:</p>
<ul><li>text → number: <code>double.TryParse(box.Text, out double x)</code> (safely, without an exception),</li>
<li>number → text: <code>result.Text = x.ToString("F2");</code> or interpolation,</li>
<li><code>Slider.Value</code> is a <code>double</code>, <code>CheckBox.IsChecked</code> – a <code>bool?</code> (it can be null).</li></ul>
<p>With bindings we use <b>converters</b> – classes implementing the <code>IValueConverter</code> interface. The <code>Convert</code> method turns the source value into a value to display, and <code>ConvertBack</code> – the other way round. A converter is registered in the window’s resources and referenced in the binding: <code>Converter={StaticResource name}</code>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN("Kapi's thermometer", 250, 380, `    <Window.Resources>
        <local:CelsiusToFahrenheit x:Key="toF"/>
    </Window.Resources>
    <StackPanel Margin="15">
        <TextBlock Text="Water temperature in °C:"/>
        <Slider x:Name="temp" Minimum="-10" Maximum="40" Value="25"/>
        <TextBlock FontSize="20" Text="{Binding ElementName=temp, Path=Value, Converter={StaticResource toF}}"/>
        <TextBox x:Name="kmBox" Text="12.5" Margin="0,10,0,0"/>
        <Button Content="Convert km to miles" Click="Convert_Click"/>
        <TextBlock x:Name="miles"/>
    </StackPanel>`, `
        xmlns:local="clr-namespace:KapiPasta"`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Convert_Click(object sender, RoutedEventArgs e)
        {
            string text = kmBox.Text.Replace(',', '.');
            if (double.TryParse(text, out double km))
            {
                miles.Text = $"{km} km = {km * 0.621:F2} miles";
            }
            else
            {
                miles.Text = "That is not a number!";
            }
        }`, `

public class CelsiusToFahrenheit : System.Windows.Data.IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
    {
        double c = (double)value;
        double f = c * 9 / 5 + 32;
        string note = c >= 20 ? "Kapi is bathing 💦" : "Brrr, cold";
        return $"{c:F0} °C = {f:F1} °F – {note}";
    }

    public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}`) }, cap: 'The converter pours the number from the slider into text that the TextBlock understands. The button does the conversion by hand with TryParse.' },
  ],
  tasks: [
   { q: 'What is the type of the <code>TextBox.Text</code> property?', why: 'A text box always holds text – numbers have to be converted from it.' },
   { q: 'What is the type of <code>CheckBox.IsChecked</code>?', opts: ['bool? (it can be null)', 'bool', 'string', 'int'], why: 'A CheckBox can have a third, indeterminate state – hence bool?.' },
   { q: 'Which interface does a converter used in bindings implement?', why: 'IValueConverter has the Convert and ConvertBack methods.' },
   { q: 'Which method safely converts text from a field into a number, without risking an exception?', opts: ['double.TryParse(box.Text, out double x)', 'double.Parse(box.Text)', '(double)box.Text', 'Convert.ToDouble(box)'], why: 'TryParse returns false instead of throwing FormatException.' },
   { q: 'Complete <code>Calc_Click</code>: read numbers from the fields <code>a</code> and <code>b</code> (int.TryParse) and put their sum into the TextBlock <code>sum</code>. When a field is not a number, write <code>Error</code>.',
     start: { 'MainWindow.xaml': WIN('Adder', 200, 300, `    <StackPanel Margin="10">
        <TextBox x:Name="a"/>
        <TextBox x:Name="b"/>
        <Button x:Name="calc" Content="=" Click="Calc_Click"/>
        <TextBlock x:Name="sum"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Calc_Click(object sender, RoutedEventArgs e)
        {
            // Your code
        }`) },
     sol: { 'MainWindow.xaml': WIN('Adder', 200, 300, `    <StackPanel Margin="10">
        <TextBox x:Name="a"/>
        <TextBox x:Name="b"/>
        <Button x:Name="calc" Content="=" Click="Calc_Click"/>
        <TextBlock x:Name="sum"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Calc_Click(object sender, RoutedEventArgs e)
        {
            if (int.TryParse(a.Text, out int x) && int.TryParse(b.Text, out int y))
                sum.Text = (x + y).ToString();
            else
                sum.Text = "Error";
        }`) },
     ui: "ui.type('a', '12'); ui.type('b', '30'); ui.click('calc'); if (ui.text('sum') !== '42') return 'For 12 and 30 it should be 42 (it is: ' + ui.text('sum') + ')'; ui.type('b', 'kapi'); ui.click('calc'); if (ui.text('sum') !== 'Error') return 'When a field is not a number, it should be: Error'; return '';", hint: 'if (int.TryParse(a.Text, out int x) && int.TryParse(b.Text, out int y)) ...' },
  ] },
 style: { title: 'Styles and resources',
  theory: `<p>Instead of repeating the same attributes on every control, we define a <b>style</b> in the window’s <b>resources</b>:</p>
<pre>&lt;Window.Resources&gt;
    &lt;Style TargetType="Button"&gt;
        &lt;Setter Property="Background" Value="Orange"/&gt;
        &lt;Setter Property="Margin" Value="5"/&gt;
    &lt;/Style&gt;
&lt;/Window.Resources&gt;</pre>
<ul><li>A style with only <code>TargetType</code> applies <b>automatically</b> to all controls of that type (an implicit style).</li>
<li>A style with <code>x:Key="Big"</code> must be referenced: <code>Style="{StaticResource Big}"</code>.</li>
<li><code>BasedOn</code> lets you extend another style.</li>
<li><b>Triggers</b> (<code>Style.Triggers</code>) change the look in a given state, e.g. <code>IsMouseOver="True"</code> when the mouse hovers.</li></ul>
<p>Resources also hold colours and brushes: <code>&lt;SolidColorBrush x:Key="Main" Color="#FF8B5A2B"/&gt;</code>, used via <code>{StaticResource Main}</code>. An attribute set directly on a control takes precedence over the style.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN('Menu in Kapi style', 280, 380, `    <Window.Resources>
        <SolidColorBrush x:Key="Brown" Color="#FF8B5A2B"/>
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
        <Style x:Key="Heading" TargetType="TextBlock">
            <Setter Property="FontSize" Value="22"/>
            <Setter Property="FontWeight" Value="Bold"/>
            <Setter Property="Foreground" Value="{StaticResource Brown}"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="12">
        <TextBlock Style="{StaticResource Heading}" Text="🍝 Kapi's menu"/>
        <Button Content="Spaghetti"/>
        <Button Content="Lasagne"/>
        <Button Content="Tiramisu" Background="Pink"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) }, cap: 'One style covers all buttons. Hover with the mouse – the IsMouseOver trigger changes the colour. Tiramisu has its own background, which beats the style.' },
  ],
  tasks: [
   { q: 'Where do we usually define styles for the whole window?', opts: ['In Window.Resources', 'In the Program.cs file', 'In the InitializeComponent method', 'In the Title attribute'], why: 'Window resources (Window.Resources) are available to all its controls.' },
   { q: 'A style has <code>TargetType="Button"</code> and <b>no</b> <code>x:Key</code>. Which buttons does it apply to?', opts: ['All buttons in the window (without their own Style)', 'None, until we reference it', 'Only the first one', 'All controls in the window'], why: 'A style without a key is an implicit style for that type.' },
   { q: 'A style sets <code>Background="Orange"</code>, and a button has the attribute <code>Background="Pink"</code>. What colour will the button be?', opts: ['Pink', 'Orange', 'Mixed', 'The default grey'], why: 'A value set directly on a control takes precedence over the style.' },
   { q: 'Complete it to use the style with the key <code>Big</code>.', code: WIN('Kapi', 200, 300, `    <Window.Resources>
        <Style x:Key="Big" TargetType="TextBlock">
            <Setter Property="FontSize" Value="30"/>
        </Style>
    </Window.Resources>
    <TextBlock Style="{___ Big}" Text="Kapi"/>`), why: 'A resource is referenced with {StaticResource key}.' },
   { q: 'The XAML designer reports an error. Click the line with the bug.', code: WIN('Kapi', 200, 300, `    <Window.Resources>
        <SolidColorBrush x:Key="SeaBlue" Color="Teal"/>
    </Window.Resources>
    <TextBlock Text="Ahoy" Foreground="{StaticResource SeaGreen}"/>`), fix: '<TextBlock Text="Ahoy" Foreground="{StaticResource SeaBlue}"/>', why: 'There is no resource with the key SeaGreen – keys are case-sensitive and must match.' },
   { q: 'In <code>Window.Resources</code> add a style for all <code>Button</code>s: background <code>LightGreen</code> and <code>FontSize</code> 16. The buttons should get it automatically.',
     start: { 'MainWindow.xaml': WIN('Style', 220, 300, `    <StackPanel Margin="10">
        <Button x:Name="b1" Content="One"/>
        <Button x:Name="b2" Content="Two"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': WIN('Style', 220, 300, `    <Window.Resources>
        <Style TargetType="Button">
            <Setter Property="Background" Value="LightGreen"/>
            <Setter Property="FontSize" Value="16"/>
        </Style>
    </Window.Resources>
    <StackPanel Margin="10">
        <Button x:Name="b1" Content="One"/>
        <Button x:Name="b2" Content="Two"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "for (const n of ['b1','b2']) { const b = ui.el(n); const bg = b.p.Background; if (!bg || String(bg.color).toLowerCase() !== 'lightgreen') return 'Button ' + n + ' should have a LightGreen background (from the style)'; if (b.p.FontSize !== 16) return 'Button ' + n + ' should have FontSize 16'; if (b.node.attrs.some(a => a.name === 'Background' || a.name === 'FontSize')) return 'Do not set attributes on the buttons – use a style'; } return '';", hint: '<Window.Resources><Style TargetType="Button"><Setter Property="Background" Value="LightGreen"/>...' },
  ] },
 dialogi: { title: 'Menus and dialog windows',
  theory: `<p>A <b>menu</b> is built from the <code>Menu</code> control and nested <code>MenuItem</code>s. Usually it goes at the top of a <code>DockPanel</code>:</p>
<pre>&lt;Menu DockPanel.Dock="Top"&gt;
    &lt;MenuItem Header="_File"&gt;
        &lt;MenuItem Header="_New" Click="New_Click" InputGestureText="Ctrl+N"/&gt;
        &lt;Separator/&gt;
        &lt;MenuItem Header="_Close" Click="Close_Click"/&gt;
    &lt;/MenuItem&gt;
&lt;/Menu&gt;</pre>
<p>The underscore <code>_</code> marks the access key (Alt+F).</p>
<p><b>Dialog windows</b>:</p>
<ul><li><code>MessageBox.Show("text", "title", MessageBoxButton.YesNo, MessageBoxImage.Question)</code> returns a <code>MessageBoxResult</code> (e.g. <code>Yes</code>/<code>No</code>),</li>
<li>a custom window: a class inheriting from <code>Window</code> with its own XAML file. <code>window.ShowDialog()</code> opens it as <b>modal</b> (waits for it to close and returns <code>DialogResult</code>), and <code>window.Show()</code> – as <b>modeless</b>,</li>
<li>in a dialog window, setting <code>DialogResult = true;</code> closes it with the “OK” result.</li></ul>`,
  more: `<p>In the KapiPasta simulator, when a <code>MessageBox</code> with Yes/No buttons or <code>ShowDialog()</code> appears in a method, the event handler is run again with the remembered answer once you choose it. So do <b>not</b> change the program state before such a call (ask first, then act) – which is good practice in real WPF too.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN("Captain's log", 300, 420, `    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <MenuItem Header="_File">
                <MenuItem Header="_New entry..." Click="New_Click" InputGestureText="Ctrl+N"/>
                <Separator/>
                <MenuItem Header="_Close" Click="Close_Click"/>
            </MenuItem>
            <MenuItem Header="_Help">
                <MenuItem Header="_About" Click="About_Click"/>
            </MenuItem>
        </Menu>
        <ListBox x:Name="entries">
            <ListBoxItem Content="Day 1: we set sail ⛵"/>
        </ListBox>
    </DockPanel>`), 'EntryWindow.xaml': `<Window x:Class="KapiPasta.EntryWindow"
        ${XH}
        Title="New entry" Height="170" Width="300">
    <StackPanel Margin="10">
        <TextBlock Text="What happened today?"/>
        <TextBox x:Name="box" Margin="0,6"/>
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
            <Button Content="OK" Width="70" Click="Ok_Click" IsDefault="True"/>
            <Button Content="Cancel" Width="70" Margin="6,0,0,0" Click="Cancel_Click"/>
        </StackPanel>
    </StackPanel>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void New_Click(object sender, RoutedEventArgs e)
        {
            EntryWindow window = new EntryWindow();
            window.Owner = this;
            if (window.ShowDialog() == true)
            {
                entries.Items.Add(window.Entry);
            }
        }

        private void About_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("Captain Kapi's log, version 1.0", "About",
                MessageBoxButton.OK, MessageBoxImage.Information);
        }

        private void Close_Click(object sender, RoutedEventArgs e)
        {
            var answer = MessageBox.Show("Really close the log?", "Question",
                MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (answer == MessageBoxResult.Yes)
            {
                Close();
            }
        }`, `

    public partial class EntryWindow : Window
    {
        public string Entry => box.Text;

        public EntryWindow()
        {
            InitializeComponent();
        }

        private void Ok_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
        }
    }`) }, cap: 'File → New entry opens a modal window (ShowDialog): the main window is blocked until you click OK or Cancel. Close asks via a MessageBox with Yes/No buttons.' },
  ],
  tasks: [
   { q: 'Which method opens a window as <b>modal</b>?', why: 'ShowDialog() waits for the window to close and returns DialogResult.' },
   { q: 'What does the underscore in <code>Header="_File"</code> mean?', opts: ['The keyboard shortcut Alt+F', 'Bold text', 'Hiding the menu item', 'A separator'], why: 'The letter after _ is the access key (underlined in the menu).' },
   { q: 'What does <code>MessageBox.Show(..., MessageBoxButton.YesNo)</code> return?', opts: ['MessageBoxResult (e.g. Yes or No)', 'bool', 'a string with the button text', 'Nothing – it is void'], why: 'We compare the result with MessageBoxResult.Yes.' },
   { q: 'How do you close a dialog window with the “OK” result?', why: 'Setting DialogResult closes the modal window, and ShowDialog() returns that value.' },
   { q: 'Complete the menu: the <code>Save</code> item should be inside the <code>File</code> item.', cs: CSW(CTOR + `

        private void Save_Click(object sender, RoutedEventArgs e) { }`), code: WIN('Kapi', 200, 300, `    <DockPanel>
        <Menu DockPanel.Dock="Top">
            <___ Header="_File">
                <MenuItem Header="_Save" Click="Save_Click"/>
            </MenuItem>
        </Menu>
        <TextBlock/>
    </DockPanel>`), why: 'Menu items (including drop-down ones) are MenuItems.' },
   { q: 'Handle a click on <code>remove</code>: ask with a Yes/No <code>MessageBox</code> “Remove the treasure?”. Only after the answer <code>Yes</code> set the text of the TextBlock <code>treasure</code> to <code>(empty)</code>.',
     start: { 'MainWindow.xaml': WIN('Chest', 200, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="treasure" Text="💰 gold"/>
        <Button x:Name="remove" Content="Remove" Click="Remove_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Remove_Click(object sender, RoutedEventArgs e)
        {
            // Your code
        }`) },
     sol: { 'MainWindow.xaml': WIN('Chest', 200, 300, `    <StackPanel Margin="10">
        <TextBlock x:Name="treasure" Text="💰 gold"/>
        <Button x:Name="remove" Content="Remove" Click="Remove_Click"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Remove_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("Remove the treasure?", "Question", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
            {
                treasure.Text = "(empty)";
            }
        }`) },
     ui: "ui.click('remove'); if (!app.answers || !app.answers.length) return 'Use MessageBox.Show with MessageBoxButton.YesNo'; if (ui.text('treasure') !== '(empty)') return 'After the answer Yes the text should be: (empty)'; app.opts.autoAnswer = { YesNo: 'No' }; ui.el('treasure').set('Text', 'x'); ui.click('remove'); if (ui.text('treasure') !== 'x') return 'After the answer No the text must not change'; return '';", hint: 'if (MessageBox.Show("Remove the treasure?", "Question", MessageBoxButton.YesNo) == MessageBoxResult.Yes) { ... }' },
  ] },
 ksztalty: { title: 'Shapes, brushes and drawing',
  theory: `<p>WPF has ready-made <b>shapes</b>: <code>Rectangle</code> (<code>RadiusX/Y</code> rounds the corners), <code>Ellipse</code> (ellipse / circle), <code>Line</code> (<code>X1,Y1,X2,Y2</code>), <code>Polygon</code> (a polygon with <code>Points</code>), <code>Polyline</code> and <code>Path</code> (any path, e.g. <code>Data="M 0,0 L 50,50 Z"</code>).</p>
<p>The fill is <code>Fill</code>, the outline – <code>Stroke</code> and <code>StrokeThickness</code>. Colours are given with <b>brushes</b>:</p>
<ul><li><code>SolidColorBrush</code> – a solid colour; in XAML a name is enough (<code>Fill="Orange"</code>) or <code>#AARRGGBB</code>,</li>
<li><code>LinearGradientBrush</code> – a linear gradient (<code>StartPoint</code>, <code>EndPoint</code>, <code>GradientStop</code>),</li>
<li><code>RadialGradientBrush</code> – a radial gradient.</li></ul>
<p>You can also draw from code: create a shape with <code>new Ellipse { Width = 20, Height = 20, Fill = Brushes.Red }</code>, set its position with <code>Canvas.SetLeft</code>/<code>SetTop</code> and add it with <code>canvas.Children.Add(...)</code>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN("Kapi's island", 300, 420, `    <Canvas>
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
    </Canvas>`), 'MainWindow.xaml.cs': CSW(CTOR) }, cap: 'The whole island is built from shapes: the sky is a rectangle with a gradient, the sun – a circle with a radial gradient, the sail – a Polygon, the mast – a Line, the waves – a Path.' },
   { wpf: { 'MainWindow.xaml': WIN('Dot painting – click!', 280, 400, `    <DockPanel>
        <StackPanel DockPanel.Dock="Top" Orientation="Horizontal">
            <Button Content="Clear" Click="Clear_Click" Margin="4"/>
            <TextBlock x:Name="counter" Text="Dots: 0" Margin="8,6"/>
        </StackPanel>
        <Canvas x:Name="canvas" Background="White" MouseDown="Canvas_MouseDown"/>
    </DockPanel>`), 'MainWindow.xaml.cs': CSW(`        Random rnd = new Random();
        Brush[] colours = { Brushes.Orange, Brushes.SaddleBrown, Brushes.Teal, Brushes.Crimson };

` + CTOR + `

        private void Canvas_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(canvas);
            int r = rnd.Next(10, 30);
            Ellipse dot = new Ellipse
            {
                Width = r,
                Height = r,
                Fill = colours[rnd.Next(colours.Length)]
            };
            Canvas.SetLeft(dot, p.X - r / 2);
            Canvas.SetTop(dot, p.Y - r / 2);
            canvas.Children.Add(dot);
            counter.Text = $"Dots: {canvas.Children.Count}";
        }

        private void Clear_Click(object sender, RoutedEventArgs e)
        {
            canvas.Children.Clear();
            counter.Text = "Dots: 0";
        }`).replace('using System.Windows.Media;', 'using System.Windows.Media;\nusing System.Windows.Shapes;') }, cap: 'Drawing from code: every click creates a new Ellipse object, sets its position on the Canvas and adds it to Children.' },
  ],
  tasks: [
   { q: 'Which property sets the <b>fill</b> of a shape?', why: 'Shapes have Fill (the inside) and Stroke (the outline).' },
   { q: 'How do you draw a <b>circle</b> with a diameter of 50?', why: 'WPF has no Circle control – a circle is an Ellipse with equal width and height.' },
   { q: 'A colour is written as <code>#80FF0000</code>. What does the first pair of digits <code>80</code> mean?', opts: ['Transparency (the alpha channel) – about 50%', 'The amount of red', 'The line thickness', 'The colour number in a palette'], why: 'In WPF the notation is #AARRGGBB – the first pair is alpha.' },
   { q: 'The XAML designer reports an error. Click the line with the bug.', code: WIN('Kapi', 200, 300, `    <Canvas>
        <Ellipse Width="40" Height="40" Fill="Orange"/>
        <Rectangle Width="60" Height="30" Fill="Orangey"/>
    </Canvas>`), fix: '<Rectangle Width="60" Height="30" Fill="Orange"/>', why: 'Colour names must be the predefined ones (Orange) – “Orangey” is not a valid brush.' },
   { q: 'Complete it so that the rectangle has a black outline 3 thick.', why: 'The outline is Stroke, its thickness – StrokeThickness.' },
   { q: 'Draw on the Canvas a <b>red circle</b> (Ellipse 80×80, <code>Fill="Red"</code>, <code>x:Name="circle"</code>) at Canvas.Left=50, Canvas.Top=40 and a green rectangle (<code>x:Name="grass"</code>, 300×40, Fill="Green") at Canvas.Top=150.',
     start: { 'MainWindow.xaml': WIN('Drawing', 260, 340, `    <Canvas>
    </Canvas>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': WIN('Drawing', 260, 340, `    <Canvas>
        <Ellipse x:Name="circle" Width="80" Height="80" Fill="Red" Canvas.Left="50" Canvas.Top="40"/>
        <Rectangle x:Name="grass" Width="300" Height="40" Fill="Green" Canvas.Top="150"/>
    </Canvas>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "if (!ui.has('circle') || ui.el('circle').__type !== 'Ellipse') return 'Add an Ellipse x:Name=\"circle\"'; const k = ui.el('circle'); if (k.p.Width !== 80 || k.p.Height !== 80) return 'The circle should be 80×80'; if (!k.p.Fill || String(k.p.Fill.color).toLowerCase() !== 'red') return 'The circle should be red (Fill=\"Red\")'; if (k.att['Canvas.Left'] !== 50 || k.att['Canvas.Top'] !== 40) return 'Circle: Canvas.Left=50, Canvas.Top=40'; if (!ui.has('grass') || ui.el('grass').__type !== 'Rectangle') return 'Add a Rectangle x:Name=\"grass\"'; const t = ui.el('grass'); if (t.p.Width !== 300 || t.p.Height !== 40 || String(t.p.Fill && t.p.Fill.color).toLowerCase() !== 'green' || t.att['Canvas.Top'] !== 150) return 'Rectangle: 300×40, Fill=Green, Canvas.Top=150'; return '';", hint: '<Ellipse x:Name="circle" Width="80" Height="80" Fill="Red" Canvas.Left="50" Canvas.Top="40"/>' },
  ] },
 animacje: { title: 'Animations',
  theory: `<p>An animation in WPF is a <b>smooth change of a property value over time</b>. The most important classes:</p>
<ul><li><code>DoubleAnimation</code> – changes a number (e.g. <code>Width</code>, <code>Opacity</code>, <code>Canvas.Left</code>, a rotation angle),</li>
<li><code>ColorAnimation</code> – changes a colour,</li>
<li><code>Storyboard</code> – a “script” grouping animations; <code>Storyboard.TargetName</code> and <code>Storyboard.TargetProperty</code> say what to animate.</li></ul>
<p>Attributes: <code>From</code>, <code>To</code> (or <code>By</code>), <code>Duration="0:0:2"</code> (hours:min:sec), <code>AutoReverse="True"</code> (go back), <code>RepeatBehavior="Forever"</code> or <code>"3x"</code>.</p>
<p>In XAML an animation is started by an <b>event trigger</b>: <code>EventTrigger RoutedEvent="Loaded"</code> (after loading) or <code>"Button.Click"</code>. In C# code: <code>element.BeginAnimation(Canvas.LeftProperty, animation);</code>.</p>
<p>Rotating and scaling is done with <b>transforms</b>: <code>RotateTransform</code> (<code>Angle</code>), <code>ScaleTransform</code>, <code>TranslateTransform</code> set in <code>RenderTransform</code>.</p>`,
  more: `<p>For games a <code>DispatcherTimer</code> is often better than animations: every given interval (<code>Interval</code>) it raises the <code>Tick</code> event, where we move objects and check collisions – the so-called <b>game loop</b>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN('Dancing Kapi', 300, 420, `    <Canvas Background="LightYellow">
        <Image x:Name="kapi" Source="kapi.png" Width="90" Canvas.Left="20" Canvas.Top="60"
               RenderTransformOrigin="0.5,0.5">
            <Image.RenderTransform>
                <RotateTransform x:Name="spin" Angle="0"/>
            </Image.RenderTransform>
            <Image.Triggers>
                <EventTrigger RoutedEvent="Loaded">
                    <BeginStoryboard>
                        <Storyboard RepeatBehavior="Forever">
                            <DoubleAnimation Storyboard.TargetName="kapi"
                                             Storyboard.TargetProperty="(Canvas.Left)"
                                             From="20" To="300" Duration="0:0:3" AutoReverse="True"/>
                            <DoubleAnimation Storyboard.TargetName="spin"
                                             Storyboard.TargetProperty="Angle"
                                             From="-15" To="15" Duration="0:0:0.5" AutoReverse="True"
                                             RepeatBehavior="Forever"/>
                        </Storyboard>
                    </BeginStoryboard>
                </EventTrigger>
            </Image.Triggers>
        </Image>
        <Button x:Name="pulse" Content="Pulse!" Canvas.Left="160" Canvas.Top="200" Width="90" Click="Pulse_Click"/>
    </Canvas>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Pulse_Click(object sender, RoutedEventArgs e)
        {
            var anim = new System.Windows.Media.Animation.DoubleAnimation(90, 160, TimeSpan.FromSeconds(0.4));
            anim.AutoReverse = true;
            pulse.BeginAnimation(Button.WidthProperty, anim);
        }`) }, cap: 'A Storyboard in XAML moves Kapi back and forth (Canvas.Left) and rocks him (RotateTransform.Angle). The button starts a width animation from C# code.' },
   { wpf: { 'MainWindow.xaml': `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        Title="Catch the orange! (arrows)" Height="300" Width="400" KeyDown="Window_KeyDown">
    <Canvas x:Name="board" Background="Honeydew">
        <TextBlock x:Name="fruit" Text="🍊" FontSize="30" Canvas.Left="180" Canvas.Top="0"/>
        <Image x:Name="kapi" Source="kapi.png" Width="70" Canvas.Left="160" Canvas.Top="200"/>
        <TextBlock x:Name="score" Text="Points: 0" Canvas.Left="8" Canvas.Top="8" FontWeight="Bold"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer timer = new System.Windows.Threading.DispatcherTimer();
        Random rnd = new Random();
        int points = 0;

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(40);
            timer.Tick += Timer_Tick;
            timer.Start();
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            double y = Canvas.GetTop(fruit) + 5;
            double fx = Canvas.GetLeft(fruit);
            double kx = Canvas.GetLeft(kapi);
            if (y > 200 && fx > kx - 20 && fx < kx + 60)
            {
                points++;
                score.Text = $"Points: {points}";
                y = 0;
                Canvas.SetLeft(fruit, rnd.Next(0, 350));
            }
            else if (y > 260)
            {
                y = 0;
                Canvas.SetLeft(fruit, rnd.Next(0, 350));
            }
            Canvas.SetTop(fruit, y);
        }

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double x = Canvas.GetLeft(kapi);
            if (e.Key == Key.Left) x = Math.Max(0, x - 20);
            if (e.Key == Key.Right) x = Math.Min(320, x + 20);
            Canvas.SetLeft(kapi, x);
        }`) }, cap: 'A mini-game: every 40 ms a DispatcherTimer moves the orange down and checks whether Kapi caught it. Click the window and steer with the arrows!' },
  ],
  tasks: [
   { q: 'Which class animates a numeric property, e.g. the width?', why: 'DoubleAnimation changes a value of type double.' },
   { q: 'What does <code>Duration="0:0:2"</code> mean?', opts: ['2 seconds', '2 minutes', '2 milliseconds', '2 repetitions'], why: 'The format is hours:minutes:seconds.' },
   { q: 'What does <code>AutoReverse="True"</code> do?', opts: ['After reaching To, the animation goes back to From', 'Inverts the colours', 'Runs the animation from the end', 'Repeats the animation forever'], why: 'AutoReverse adds a return phase.' },
   { q: 'How do you start an animation in XAML right after the window is shown?', why: 'The Loaded event happens after the element is loaded.' },
   { q: 'Complete it so that the animation repeats forever.', why: 'RepeatBehavior="Forever" repeats the animation endlessly.' },
   { q: 'Complete <code>Timer_Tick</code> so that on every timer tick the cloud <code>cloud</code> moves 4 px to the right (Canvas.Left), and when it exceeds 300 – goes back to 0.',
     start: { 'MainWindow.xaml': WIN('Wind', 200, 360, `    <Canvas Background="SkyBlue">
        <TextBlock x:Name="cloud" Text="☁️" FontSize="40" Canvas.Left="0" Canvas.Top="30"/>
    </Canvas>`), 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer timer = new System.Windows.Threading.DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(50);
            timer.Tick += Timer_Tick;
            timer.Start();
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            // Your code
        }`) },
     sol: { 'MainWindow.xaml': WIN('Wind', 200, 360, `    <Canvas Background="SkyBlue">
        <TextBlock x:Name="cloud" Text="☁️" FontSize="40" Canvas.Left="0" Canvas.Top="30"/>
    </Canvas>`), 'MainWindow.xaml.cs': CSW(`        System.Windows.Threading.DispatcherTimer timer = new System.Windows.Threading.DispatcherTimer();

        public MainWindow()
        {
            InitializeComponent();
            timer.Interval = TimeSpan.FromMilliseconds(50);
            timer.Tick += Timer_Tick;
            timer.Start();
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            double x = Canvas.GetLeft(cloud) + 4;
            if (x > 300) x = 0;
            Canvas.SetLeft(cloud, x);
        }`) },
     ui: "ui.tick(3); let x = ui.el('cloud').att['Canvas.Left']; if (x !== 12) return 'After 3 ticks Canvas.Left should be 12 (it is ' + x + ')'; ui.tick(73); x = ui.el('cloud').att['Canvas.Left']; if (x > 300 || x < 0) return 'After exceeding 300 the cloud should go back to 0'; return '';", hint: 'double x = Canvas.GetLeft(cloud) + 4; if (x > 300) x = 0; Canvas.SetLeft(cloud, x);' },
  ] },
 grafika3d: { title: '3D graphics',
  theory: `<p>WPF can display simple <b>3D</b> scenes in the <code>Viewport3D</code> control. A scene consists of:</p>
<ul><li>a <b>camera</b> – <code>PerspectiveCamera</code> with a position (<code>Position</code>), a viewing direction (<code>LookDirection</code>) and a field of view (<code>FieldOfView</code>),</li>
<li><b>lights</b> – <code>AmbientLight</code> (diffuse) and <code>DirectionalLight</code> (directional, with <code>Direction</code>),</li>
<li><b>models</b> – <code>GeometryModel3D</code> with a <b>mesh</b> <code>MeshGeometry3D</code> and a <b>material</b> (<code>DiffuseMaterial</code> with a brush).</li></ul>
<p>A mesh is a list of 3D points (<code>Positions="x,y,z x,y,z ..."</code>) and triangles built from their indices (<code>TriangleIndices="0 1 2 ..."</code>). A triangle is visible from the side where its vertices go <b>counter-clockwise</b>.</p>
<p>An object is rotated with a <code>RotateTransform3D</code> transform with an <code>AxisAngleRotation3D</code> (<code>Axis</code> – the axis, <code>Angle</code> – the angle). Animating <code>Angle</code> gives a spinning model.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN('3D treasure pyramid', 300, 400, `    <Grid Background="Black">
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
                                        <AxisAngleRotation3D x:Name="spin" Axis="0,1,0" Angle="0"/>
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
                            <DoubleAnimation Storyboard.TargetName="spin" Storyboard.TargetProperty="Angle"
                                             From="0" To="360" Duration="0:0:6" RepeatBehavior="Forever"/>
                        </Storyboard>
                    </BeginStoryboard>
                </EventTrigger>
            </Viewport3D.Triggers>
        </Viewport3D>
    </Grid>`), 'MainWindow.xaml.cs': CSW(CTOR) }, cap: 'A golden pyramid made of 5 points and 6 triangles spins around the Y axis. The directional light gives every face a different shade.' },
  ],
  tasks: [
   { q: 'In which control do we display a 3D scene in WPF?', why: 'A 3D scene goes into a Viewport3D.' },
   { q: 'Without what will a 3D scene be completely invisible (nothing to “look” from)?', opts: ['Without a camera', 'Without an animation', 'Without a style', 'Without a menu'], why: 'The camera defines where we look at the scene from and towards.' },
   { q: 'What does a <code>MeshGeometry3D</code> consist of?', opts: ['Points (Positions) and triangles (TriangleIndices)', 'Pixels', 'Rectangles and circles', 'Line elements'], why: 'Every 3D surface is a set of triangles spanned on points.' },
   { q: 'How many triangles does <code>TriangleIndices="0 1 2 2 3 0"</code> describe?', why: 'Every three numbers form one triangle: (0,1,2) and (2,3,0).' },
   { q: 'Which property of <code>AxisAngleRotation3D</code> says <b>around what</b> the model rotates?', why: 'Axis is the rotation axis (e.g. 0,1,0 – the Y axis), Angle – the angle.' },
  ] },
 strony: { title: 'Page-based interface',
  theory: `<p>Instead of many windows an application can have one window and many <b>pages</b> (<code>Page</code>) to move between – like in a web browser or an installation wizard.</p>
<ul><li>A page is a XAML file with a <code>&lt;Page&gt;</code> root and a class inheriting from <code>Page</code>.</li>
<li>In the window we put <code>&lt;Frame x:Name="frame" Source="Start.xaml"/&gt;</code> – the “viewport” where pages are displayed.</li>
<li>Navigating from code: <code>NavigationService.Navigate(new Page2());</code> (in a page) or <code>frame.Navigate(new Page2());</code> (in the window).</li>
<li>Going back: <code>NavigationService.GoBack()</code>; <code>CanGoBack</code> says whether there is somewhere to go back to. A Frame can show a navigation bar with arrows.</li>
<li>In text you can use a link: <code>&lt;Hyperlink NavigateUri="Page2.xaml"&gt;Next&lt;/Hyperlink&gt;</code>.</li></ul>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN("Kapi's cookbook", 300, 420, `    <Frame x:Name="frame" Source="Start.xaml" NavigationUIVisibility="Visible"/>`), 'Start.xaml': `<Page x:Class="KapiPasta.Start"
      ${XH}
      Title="Start">
    <StackPanel Margin="15" Background="LightYellow">
        <TextBlock Text="📖 Kapi's cookbook" FontSize="20"/>
        <Image Source="kapi.png" Height="80"/>
        <Button Content="Pasta recipe →" Click="Pasta_Click" Margin="0,8,0,0"/>
        <TextBlock Margin="0,8,0,0">
            Or click <Hyperlink NavigateUri="Dessert.xaml">dessert</Hyperlink>.
        </TextBlock>
    </StackPanel>
</Page>`, 'Pasta.xaml': `<Page x:Class="KapiPasta.Pasta"
      ${XH}
      Title="Pasta">
    <StackPanel Margin="15">
        <TextBlock Text="🍝 Pasta à la Kapi" FontSize="20"/>
        <TextBlock Text="1. Cook the pasta&#10;2. Add orange sauce&#10;3. Enjoy!"/>
        <Button Content="← Back" Click="Back_Click" Width="80" HorizontalAlignment="Left"/>
    </StackPanel>
</Page>`, 'Dessert.xaml': `<Page x:Class="KapiPasta.Dessert"
      ${XH}
      Title="Dessert">
    <TextBlock Text="🍰 Watermelon tiramisu – recipe coming soon!" FontSize="16" Margin="15"/>
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

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            if (NavigationService.CanGoBack) NavigationService.GoBack();
        }
    }

    public partial class Dessert : Page
    {
        public Dessert()
        {
            InitializeComponent();
        }
    }`) }, cap: 'One window, three pages: the Frame shows the current page, the button goes to the recipe (Navigate), and the arrow or “Back” returns (GoBack).' },
  ],
  tasks: [
   { q: 'Which element do we put in a window to display pages in it?', why: 'A Frame is the container in which we navigate between pages.' },
   { q: 'Which class does a WPF application page inherit from?', why: 'Pages are classes inheriting from Page.' },
   { q: 'How do you go from page code to the <code>Results</code> page?', opts: ['NavigationService.Navigate(new Results());', 'new Results().Show();', 'Frame.Open("Results");', 'Page.Go(Results);'], why: "A page's NavigationService handles navigation." },
   { q: 'How do you check whether you can go back to the previous page?', why: 'CanGoBack is true when there is a previous page in the history.' },
   { q: 'On the <code>Start</code> page complete <code>Next_Click</code> so that it goes to the <code>Finish</code> page (<code>NavigationService.Navigate</code>).',
     start: { 'MainWindow.xaml': WIN('Race', 200, 320, `    <Frame x:Name="frame" Source="Start.xaml"/>`), 'Start.xaml': `<Page x:Class="KapiPasta.Start"
      ${XH}
      Title="Start">
    <Button x:Name="next" Content="Next" Click="Next_Click"/>
</Page>`, 'Finish.xaml': `<Page x:Class="KapiPasta.Finish"
      ${XH}
      Title="Finish">
    <TextBlock x:Name="end" Text="🏁 Finish!"/>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Start : Page
    {
        public Start() { InitializeComponent(); }

        private void Next_Click(object sender, RoutedEventArgs e)
        {
            // Your code
        }
    }

    public partial class Finish : Page
    {
        public Finish() { InitializeComponent(); }
    }`) },
     sol: { 'MainWindow.xaml': WIN('Race', 200, 320, `    <Frame x:Name="frame" Source="Start.xaml"/>`), 'Start.xaml': `<Page x:Class="KapiPasta.Start"
      ${XH}
      Title="Start">
    <Button x:Name="next" Content="Next" Click="Next_Click"/>
</Page>`, 'Finish.xaml': `<Page x:Class="KapiPasta.Finish"
      ${XH}
      Title="Finish">
    <TextBlock x:Name="end" Text="🏁 Finish!"/>
</Page>`, 'MainWindow.xaml.cs': CSW(CTOR, `

    public partial class Start : Page
    {
        public Start() { InitializeComponent(); }

        private void Next_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Finish());
        }
    }

    public partial class Finish : Page
    {
        public Finish() { InitializeComponent(); }
    }`) },
     ui: "if (ui.has('end')) return 'At start the Start page should be visible'; ui.click('next'); if (!ui.has('end')) return 'After clicking Next the Finish page should appear'; const f = ui.el('frame'); if (!f.page || f.page.p.Title !== 'Finish') return 'The frame should display the Finish page'; return '';", hint: 'NavigationService.Navigate(new Finish());' },
  ] },
});
