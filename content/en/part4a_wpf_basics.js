// English translation of chapter 13 (WPF basics). Helpers XH / CSW / CTOR are shared with part4b.

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
const WIN = (title, h, w, body, extra = '') => `<Window x:Class="KapiPasta.MainWindow"
        ${XH}${extra}
        Title="${title}" Height="${h}" Width="${w}">
${body}
</Window>`;

Object.assign(TR.ch, {
 wpf1: { name: { pirate: 'Lighthouse Windows', kitchen: 'Restaurant Window', hero: "Hero's Cockpit", neutral: 'WpfBasics' }, topic: 'WPF, XAML, controls, Grid, StackPanel, Canvas, mouse and keyboard events',
  outcomes: 'Uses a development environment for desktop applications; chooses an IDE; recognises its tools; explains the concept of a framework; uses frameworks (WPF) and the XAML language; distinguishes interface elements (window, modal and modeless dialog, controls); programs application windows and mouse and keyboard event handling.' },
});

Object.assign(TR.les, {
 wpfintro: { title: 'Desktop applications: WPF and XAML',
  theory: `<p>A <b>desktop application</b> (windowed) has a graphical user interface – a <b>GUI</b>: windows, buttons, text boxes. The program does not run “from top to bottom”; it <b>waits for events</b> (clicks, keys) and reacts to them.</p>
<p>A <b>framework</b> is a ready-made application skeleton: a set of libraries, tools and rules that we plug our own code into. For desktop apps in .NET there are, among others: <b>WPF</b> (Windows Presentation Foundation), Windows Forms (older), WinUI, .NET MAUI and Avalonia (cross-platform). Other languages have their own: Java – Swing/JavaFX, Python – Tkinter/PyQt, C++ – Qt.</p>
<p>A WPF application is created in <b>Visual Studio</b>: <i>New project → WPF Application</i>. Useful IDE tools: the <b>Designer</b> (window preview), the <b>Toolbox</b> (controls to drag in), the <b>Properties</b> window, the XAML editor and the <b>Live Visual Tree</b> while debugging.</p>
<p>A window consists of two files:</p>
<ul><li><code>MainWindow.xaml</code> – the <b>look</b>, written in <b>XAML</b> (a flavour of XML): tags are controls, attributes are their properties,</li>
<li><code>MainWindow.xaml.cs</code> – the <b>code-behind</b> in C#: logic and event handling.</li></ul>
<p>In XAML every tag must be closed: <code>&lt;TextBlock Text="Ahoy!"/&gt;</code> or <code>&lt;Button&gt;OK&lt;/Button&gt;</code>. A window (<code>Window</code>) can have only <b>one</b> element inside – usually a container such as <code>StackPanel</code> or <code>Grid</code>.</p>`,
  more: `<p>Interface elements: the <b>window</b> (Window), <b>controls</b> (Button, TextBox…), layout <b>containers</b> (Grid, StackPanel). Dialog windows are either <b>modal</b> – they block the main window until you close them (e.g. “Save as”, <code>ShowDialog()</code>) – or <b>modeless</b>, which let you keep using the main window (e.g. a “Find” window, <code>Show()</code>). A window constructor always calls <code>InitializeComponent()</code> – that method builds the window from the XAML file.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN("Kapi's first window", 250, 400, `    <StackPanel Margin="15">
        <Image Source="kapi.png" Height="100"/>
        <TextBlock Text="Ahoy! I'm a WPF window 🪟"
                   FontSize="20" HorizontalAlignment="Center"/>
        <TextBlock Text="I described this text in XAML" Foreground="Gray"
                   HorizontalAlignment="Center"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) }, cap: 'Kapi looks out of a window built in XAML: an Image, two TextBlocks and a StackPanel that places them one below the other.' },
  ],
  tasks: [
   { q: 'In which file do we describe the <b>look</b> of a WPF window?', why: 'The look in XAML, the logic in the code-behind (.xaml.cs).' },
   { q: 'What is a <b>framework</b>?', opts: ['A ready-made application skeleton: libraries and rules we plug our own code into', 'A code editor', 'A file with the look of a window', 'A kind of compile error'], why: 'E.g. WPF provides windows, controls, events and a layout system – we only write our part.' },
   { q: 'How does a <b>modal</b> window differ from a modeless one?', opts: ['A modal one blocks the main window until you close it', 'A modal one has no title bar', 'A modeless one is always full screen', 'There is no difference'], why: 'ShowDialog() opens a modal window, Show() – a modeless one.' },
   { q: 'Complete the attribute so that the TextBlock displays <code>Ahoy!</code>.', code: WIN('Kapi', 200, 300, `    <TextBlock ___="Ahoy!" FontSize="24"/>`), why: 'The text of a TextBlock is set by the Text property.' },
   { q: 'The XAML designer reports an error. Click the line with the bug.', code: WIN('Kapi', 200, 300, `    <StackPanel>
        <TextBlock Text="Welcome"/>
        <Buton Content="OK"/>
    </StackPanel>`), why: 'A typo in the control name: Buton instead of Button (MC3074).' },
   { q: 'The XAML designer reports an error. Click the line that has to be fixed.', code: WIN('Kapi', 200, 300, `    <StackPanel>
        <TextBlock Text="First">
        <TextBlock Text="Second"/>
    </StackPanel>`), fix: '<TextBlock Text="First"/>', why: 'The TextBlock tag was not closed – in XAML every tag must end with /> or have a closing tag.' },
   { q: 'Add a button (<code>Button</code>) with the caption <code>Ahoy, crew!</code> below the TextBlock.',
     start: { 'MainWindow.xaml': WIN('Kapi', 200, 320, `    <StackPanel Margin="10">
        <TextBlock Text="Captain Kapi welcomes you!" FontSize="18"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': WIN('Kapi', 200, 320, `    <StackPanel Margin="10">
        <TextBlock Text="Captain Kapi welcomes you!" FontSize="18"/>
        <Button Content="Ahoy, crew!"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "const b = ui.byType('Button'); if (!b.length) return 'The <Button> is missing'; if (b[0].contentText() !== 'Ahoy, crew!') return 'Button caption: Ahoy, crew!'; return '';", hint: '<Button Content="Ahoy, crew!"/> inside the StackPanel.' },
  ] },
 kontrolki: { title: 'Controls and their attributes',
  theory: `<p>The most commonly used WPF <b>controls</b>:</p>
<ul><li><code>TextBlock</code> – text to read, <code>Label</code> – a label (e.g. a field description),</li>
<li><code>TextBox</code> – a field for typing text (<code>Text</code>), <code>PasswordBox</code> – a password,</li>
<li><code>Button</code> – a button (<code>Content</code>, the <code>Click</code> event),</li>
<li><code>CheckBox</code> and <code>RadioButton</code> – choices (<code>IsChecked</code>; radio buttons in one group exclude each other),</li>
<li><code>Slider</code> – a slider (<code>Minimum</code>, <code>Maximum</code>, <code>Value</code>), <code>ProgressBar</code> – a progress bar,</li>
<li><code>ComboBox</code> – a drop-down list, <code>ListBox</code> – a list (<code>SelectedIndex</code>, <code>SelectedItem</code>),</li>
<li><code>Image</code> – a picture (<code>Source</code>).</li></ul>
<p>Common <b>attributes</b>: <code>Width</code>, <code>Height</code>, <code>Margin</code> (space outside), <code>Padding</code> (space inside), <code>FontSize</code>, <code>FontWeight</code>, <code>Foreground</code> (text colour), <code>Background</code>, <code>HorizontalAlignment</code>, <code>VerticalAlignment</code>, <code>IsEnabled</code>, <code>Visibility</code> (Visible/Hidden/Collapsed), <code>ToolTip</code>.</p>
<p>To refer to a control from C# code, give it a name: <code>x:Name="nameBox"</code>. Then in the code-behind you write <code>nameBox.Text</code>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN('Order at Kapi’s', 330, 420, `    <StackPanel Margin="12">
        <Label Content="Guest name:"/>
        <TextBox x:Name="nameBox" Text="Ola" ToolTip="Type a name"/>
        <CheckBox x:Name="cheese" Content="Extra cheese 🧀" IsChecked="True" Margin="0,8,0,0"/>
        <StackPanel Orientation="Horizontal" Margin="0,6,0,0">
            <RadioButton Content="Small" GroupName="size" Margin="0,0,10,0"/>
            <RadioButton Content="Large" GroupName="size" IsChecked="True"/>
        </StackPanel>
        <ComboBox x:Name="dish" SelectedIndex="1" Margin="0,8,0,0">
            <ComboBoxItem Content="Pizza"/>
            <ComboBoxItem Content="Pasta"/>
            <ComboBoxItem Content="Salad"/>
        </ComboBox>
        <TextBlock Text="Spiciness:" Margin="0,8,0,0"/>
        <Slider x:Name="spice" Minimum="0" Maximum="10" Value="3"/>
        <ProgressBar Value="65" Height="14" Margin="0,8,0,0"/>
        <Button Content="Order" Width="120" Margin="0,10,0,0" FontWeight="Bold"
                Background="Orange" Foreground="White" IsEnabled="True"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) }, cap: "The order form in Kapi's kitchen: a text box, a check box, radio buttons, a drop-down list, a slider, a progress bar and a button." },
  ],
  tasks: [
   { q: 'Which control lets the user <b>type</b> text?', why: 'TextBlock and Label only display text; it is typed into a TextBox.' },
   { q: 'How does <code>Margin</code> differ from <code>Padding</code>?', opts: ['Margin is the space outside the control, Padding – inside', 'Margin is the border colour', 'They are two names of the same property', 'Padding works only in a Grid'], why: 'Margin moves the control away from its neighbours, Padding moves the content away from the control’s edges.' },
   { q: 'How does <code>Visibility="Hidden"</code> differ from <code>Visibility="Collapsed"</code>?', opts: ['Hidden hides but leaves empty space; Collapsed takes no space', 'Collapsed only folds the text', 'Hidden removes the control from code', 'There is no difference'], why: 'Collapsed “folds” the control – the layout behaves as if it were not there.' },
   { q: 'The XAML designer reports an error. Click the line with the bug.', why: 'The property is called Content – a typo: Contnet (MC3072).' },
   { q: 'Complete the attributes so that the slider has the range 0–100.', why: 'The slider range is set by Minimum and Maximum.' },
   { q: 'Build a form: a <code>TextBox</code> named <code>nameBox</code>, a <code>CheckBox</code> named <code>consent</code> with the caption <code>I like oranges</code> (checked by default) and a disabled <code>Send</code> button (<code>IsEnabled="False"</code>).',
     start: { 'MainWindow.xaml': WIN("Kapi's survey", 220, 320, `    <StackPanel Margin="10">
        <Label Content="Name:"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': WIN("Kapi's survey", 220, 320, `    <StackPanel Margin="10">
        <Label Content="Name:"/>
        <TextBox x:Name="nameBox"/>
        <CheckBox x:Name="consent" Content="I like oranges" IsChecked="True"/>
        <Button Content="Send" IsEnabled="False"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "if (!ui.has('nameBox') || ui.el('nameBox').__type !== 'TextBox') return 'Add a TextBox x:Name=\"nameBox\"'; const z = ui.has('consent') && ui.el('consent'); if (!z || z.__type !== 'CheckBox') return 'Add a CheckBox x:Name=\"consent\"'; if (z.contentText() !== 'I like oranges') return 'CheckBox caption: I like oranges'; if (z.p.IsChecked !== true) return 'The CheckBox should be checked'; const b = ui.byType('Button').find(x => x.contentText() === 'Send'); if (!b) return 'Add the Send button'; if (b.p.IsEnabled !== false) return 'The button should be disabled (IsEnabled=\"False\")'; return '';", hint: '<CheckBox x:Name="consent" Content="..." IsChecked="True"/>' },
  ] },
 uklad: { title: 'Layout: Grid, StackPanel, Canvas',
  theory: `<p>WPF arranges controls with <b>containers</b> (panels):</p>
<ul><li><code>StackPanel</code> – one below another (or side by side: <code>Orientation="Horizontal"</code>),</li>
<li><code>Grid</code> – a table with rows and columns. We define them in <code>Grid.RowDefinitions</code> and <code>Grid.ColumnDefinitions</code>, and place a control with <code>Grid.Row="1" Grid.Column="2"</code> (counted from 0). <code>Grid.ColumnSpan</code> merges cells. Size: <code>Auto</code> (fit), a number (pixels), <code>*</code> (the remaining space, <code>2*</code> – twice as much),</li>
<li><code>WrapPanel</code> – side by side, wrapping to a new line,</li>
<li><code>DockPanel</code> – docking to edges (<code>DockPanel.Dock="Top"</code>), the last element fills the rest,</li>
<li><code>Canvas</code> – absolute positions in pixels: <code>Canvas.Left</code>, <code>Canvas.Top</code> (good for games and drawing).</li></ul>
<p>Alignment within a cell: <code>HorizontalAlignment</code> (Left/Center/Right/Stretch), <code>VerticalAlignment</code>. Spacing: <code>Margin="10"</code> (all sides), <code>"10,5"</code> (horizontal, vertical), <code>"left,top,right,bottom"</code>.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN("Kapi's calculator", 260, 300, `    <Grid Margin="8">
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
    </Grid>`), 'MainWindow.xaml.cs': CSW(CTOR) }, cap: 'A Grid like a game board: 3 rows and 3 columns. The text box takes the whole first row (ColumnSpan="3"), and “0” – two cells.' },
   { wpf: { 'MainWindow.xaml': WIN("Kapi's harbour", 260, 420, `    <DockPanel>
        <TextBlock DockPanel.Dock="Top" Text="⚓ Kapi's Harbour" FontSize="18" Background="Navy"
                   Foreground="White" Padding="6"/>
        <StackPanel DockPanel.Dock="Left" Background="LightGray" Width="90">
            <Button Content="Map" Margin="4"/>
            <Button Content="Treasure" Margin="4"/>
        </StackPanel>
        <Canvas Background="LightSkyBlue">
            <TextBlock Canvas.Left="20" Canvas.Top="20" Text="⛵" FontSize="40"/>
            <TextBlock Canvas.Left="170" Canvas.Top="90" Text="🏝️" FontSize="50"/>
            <Image Canvas.Left="200" Canvas.Top="20" Source="kapi.png" Width="80"/>
        </Canvas>
    </DockPanel>`), 'MainWindow.xaml.cs': CSW(CTOR) }, cap: 'The DockPanel sticks the title bar to the top and the menu to the left. The Canvas fills the rest, and the ship, the island and Kapi have pixel coordinates.' },
  ],
  tasks: [
   { q: 'Which container places elements <b>one below another</b>?', opts: ['StackPanel', 'Canvas', 'Grid without definitions', 'Image'], why: 'StackPanel has vertical orientation by default.' },
   { q: 'How do you place a button in the second row and third column of a Grid?', why: 'Grid rows and columns are counted from 0.' },
   { q: 'Grid columns have widths <code>100</code>, <code>*</code> and <code>2*</code>, and the window is 400 px. How wide is the third column?', why: 'After subtracting 100 px, 300 px are left to split 1:2, so the third column is 200 px.' },
   { q: 'Complete it so that the buttons are placed <b>side by side</b>.', why: 'Orientation="Horizontal" arranges elements horizontally.' },
   { q: 'The XAML designer reports an error. Click the line with the bug.', code: WIN('Kapi', 200, 300, `    <TextBlock Text="First"/>
    <TextBlock Text="Second"/>`), fix: '<StackPanel><TextBlock Text="First"/><TextBlock Text="Second"/></StackPanel>', why: 'A Window can have only one element inside (MC3089). Wrap both TextBlocks in a StackPanel or a Grid.' },
   { q: 'Build a 2×2 Grid and place four buttons <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code> in it: A (row 0, column 0), B (0, 1), C (1, 0), D (1, 1).',
     start: { 'MainWindow.xaml': WIN('Grid', 220, 300, `    <Grid>

    </Grid>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     sol: { 'MainWindow.xaml': WIN('Grid', 220, 300, `    <Grid>
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
    </Grid>`), 'MainWindow.xaml.cs': CSW(CTOR) },
     ui: "const g = ui.byType('Grid')[0]; if (!g || !g.rows || g.rows.length !== 2 || !g.cols || g.cols.length !== 2) return 'The Grid should have 2 rows and 2 columns (RowDefinitions, ColumnDefinitions)'; const exp = { A: [0,0], B: [0,1], C: [1,0], D: [1,1] }; for (const k in exp) { const b = ui.byType('Button').find(x => x.contentText() === k); if (!b) return 'Button ' + k + ' is missing'; if ((b.att['Grid.Row']||0) !== exp[k][0] || (b.att['Grid.Column']||0) !== exp[k][1]) return 'Button ' + k + ' should be in row ' + exp[k][0] + ', column ' + exp[k][1]; } return '';", hint: 'First <Grid.RowDefinitions> and <Grid.ColumnDefinitions>, then the buttons with Grid.Row and Grid.Column.' },
  ] },
 zdarzenia: { title: 'Event-driven programming: mouse and keyboard',
  theory: `<p>In <b>event-driven programming</b> the program reacts to <b>events</b>: a click, a mouse move, a key press, a text change. We attach an <b>event handler</b> method to an event.</p>
<p>In XAML: <code>&lt;Button Content="Click" Click="MyButton_Click"/&gt;</code>, and in the code-behind:</p>
<pre>private void MyButton_Click(object sender, RoutedEventArgs e)
{
    label.Text = "Clicked!";
}</pre>
<p><code>sender</code> is the control that raised the event, and <code>e</code> – extra information. Important events:</p>
<ul><li><code>Click</code> (Button, CheckBox, MenuItem), <code>TextChanged</code> (TextBox), <code>ValueChanged</code> (Slider), <code>SelectionChanged</code> (ComboBox, ListBox), <code>Checked</code>/<code>Unchecked</code>,</li>
<li><b>mouse</b>: <code>MouseDown</code>, <code>MouseUp</code>, <code>MouseMove</code>, <code>MouseEnter</code>, <code>MouseLeave</code> – the position is given by <code>e.GetPosition(element)</code>,</li>
<li><b>keyboard</b>: <code>KeyDown</code>, <code>KeyUp</code> – the pressed key is <code>e.Key</code> (e.g. <code>Key.Left</code>, <code>Key.Enter</code>).</li></ul>
<p>An event can also be attached in code: <code>myButton.Click += MyButton_Click;</code>.</p>`,
  more: `<p>Mouse and keyboard events in WPF are <b>routed</b>: they “bubble” from the control up the tree to the window. That is why a <code>KeyDown</code> attached to the <code>Window</code> catches keys from the whole window. Setting <code>e.Handled = true</code> stops further routing.</p>`,
  ex: [
   { wpf: { 'MainWindow.xaml': WIN('Orange counter', 230, 360, `    <StackPanel Margin="15">
        <TextBlock x:Name="label" Text="Kapi has 0 oranges" FontSize="18"/>
        <TextBox x:Name="box" Text="Kapi" Margin="0,8" TextChanged="Box_TextChanged"/>
        <Button Content="Give an orange 🍊" Click="Give_Click" Padding="6"/>
        <TextBlock x:Name="echo" Foreground="Gray" Margin="0,8,0,0"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(`        int oranges = 0;

` + CTOR + `

        private void Give_Click(object sender, RoutedEventArgs e)
        {
            oranges++;
            label.Text = $"{box.Text} has {oranges} oranges";
            if (oranges >= 5)
            {
                label.Foreground = Brushes.Green;
            }
        }

        private void Box_TextChanged(object sender, TextChangedEventArgs e)
        {
            echo.Text = "You are typing: " + box.Text;
        }`) }, cap: 'Every click on the button runs the Give_Click method. Typing in the text box raises the TextChanged event.' },
   { wpf: { 'MainWindow.xaml': `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        Title="Steer Kapi (arrows + click)" Height="280" Width="420"
        KeyDown="Window_KeyDown">
    <Canvas x:Name="board" Background="PaleGreen" MouseDown="Board_MouseDown">
        <Image x:Name="kapi" Source="kapi.png" Width="70" Canvas.Left="150" Canvas.Top="80"/>
        <TextBlock x:Name="info" Canvas.Left="8" Canvas.Top="6" Text="Click the board, use the arrows"/>
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
            info.Text = $"Key: {e.Key}, position: {x}, {y}";
        }

        private void Board_MouseDown(object sender, MouseButtonEventArgs e)
        {
            Point p = e.GetPosition(board);
            Canvas.SetLeft(kapi, p.X - 35);
            Canvas.SetTop(kapi, p.Y - 30);
            info.Text = $"Click at ({p.X:F0}, {p.Y:F0})";
        }`) }, cap: "Kapi runs around the Canvas: the arrows are handled by the window's KeyDown, and a mouse click moves him to the point given by e.GetPosition." },
  ],
  tasks: [
   { q: 'Which button event happens after it is clicked?', why: 'Clicking a button is the Click event.' },
   { q: 'What does the <code>sender</code> parameter of an event handler mean?', opts: ['The control that raised the event', 'The key that was pressed', 'A dialog window', 'The text typed by the user'], why: 'sender is the source of the event, e.g. the clicked button.' },
   { q: 'How do you check in a <code>KeyDown</code> handler whether Enter was pressed?', why: 'KeyEventArgs has a Key property of the Key enumeration type.' },
   { q: "The application doesn't compile. Click the line with the bug in the XAML.", why: 'The method name in the Click attribute must exactly match the method in the code-behind (CS1061).' },
   { q: 'Attach the <code>Kapi_Click</code> method to the button click.', code: WIN('Kapi', 200, 300, `    <Button Content="Squeak!" ___="Kapi_Click"/>`), why: 'The event attribute is named like the event: Click.' },
   { q: 'Complete the <code>Greet_Click</code> method: after clicking the button, the TextBlock <code>label</code> should show <code>Ahoy, NAME!</code>, where NAME is the text from the <code>nameBox</code> field.',
     start: { 'MainWindow.xaml': WIN('Greeting', 200, 320, `    <StackPanel Margin="10">
        <TextBox x:Name="nameBox"/>
        <Button x:Name="greetButton" Content="Greet" Click="Greet_Click"/>
        <TextBlock x:Name="label" FontSize="18"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Greet_Click(object sender, RoutedEventArgs e)
        {
            // Your code
        }`) },
     sol: { 'MainWindow.xaml': WIN('Greeting', 200, 320, `    <StackPanel Margin="10">
        <TextBox x:Name="nameBox"/>
        <Button x:Name="greetButton" Content="Greet" Click="Greet_Click"/>
        <TextBlock x:Name="label" FontSize="18"/>
    </StackPanel>`), 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Greet_Click(object sender, RoutedEventArgs e)
        {
            label.Text = $"Ahoy, {nameBox.Text}!";
        }`) },
     ui: "ui.type('nameBox', 'Ola'); ui.click('greetButton'); if (ui.text('label') !== 'Ahoy, Ola!') return 'For the name Ola the label should read: Ahoy, Ola! (it is: ' + ui.text('label') + ')'; ui.type('nameBox', 'Kapi'); ui.click('greetButton'); if (ui.text('label') !== 'Ahoy, Kapi!') return 'The label should change after every click'; return '';", hint: 'label.Text = $"Ahoy, {nameBox.Text}!";' },
   { q: 'A game: handle the window’s <code>KeyDown</code> so that the <code>Right</code> key moves the <code>ship</code> 10 px to the right (Canvas.Left), and <code>Left</code> – 10 px to the left. After each move the TextBlock <code>position</code> should show the current Canvas.Left.',
     start: { 'MainWindow.xaml': `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        Title="Voyage" Height="200" Width="400" KeyDown="Window_KeyDown">
    <Canvas Background="LightBlue">
        <TextBlock x:Name="ship" Text="⛵" FontSize="40" Canvas.Left="100" Canvas.Top="60"/>
        <TextBlock x:Name="position" Text="100"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            // Your code
        }`) },
     sol: { 'MainWindow.xaml': `<Window x:Class="KapiPasta.MainWindow"
        ${XH}
        Title="Voyage" Height="200" Width="400" KeyDown="Window_KeyDown">
    <Canvas Background="LightBlue">
        <TextBlock x:Name="ship" Text="⛵" FontSize="40" Canvas.Left="100" Canvas.Top="60"/>
        <TextBlock x:Name="position" Text="100"/>
    </Canvas>
</Window>`, 'MainWindow.xaml.cs': CSW(CTOR + `

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            double x = Canvas.GetLeft(ship);
            if (e.Key == Key.Right) x += 10;
            if (e.Key == Key.Left) x -= 10;
            Canvas.SetLeft(ship, x);
            position.Text = x.ToString();
        }`) },
     ui: "ui.key('Right'); ui.key('Right'); ui.key('Left'); const x = ui.el('ship').att['Canvas.Left']; if (x !== 110) return 'After Right, Right, Left the ship should have Canvas.Left = 110 (it has ' + x + ')'; if (ui.text('position') !== '110') return 'The TextBlock position should show 110'; return '';", hint: 'double x = Canvas.GetLeft(ship); ... Canvas.SetLeft(ship, x);' },
  ] },
});
