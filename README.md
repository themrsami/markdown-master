# Markdown Master

A powerful, customizable Markdown editor and renderer with real-time preview, built with Next.js. Fully compatible with ChatGPT-generated markdown content.

![Markdown Master](/public/screenshot.png)

## Features

- **Real-time Preview**: See your markdown rendered as you type
- **ChatGPT Compatibility**: Copy markdown directly from ChatGPT and paste it for perfect rendering
- **Mathematics Support**: Full LaTeX math support using KaTeX
- **Code Syntax Highlighting**: Multiple themes for code blocks
- **Export Options**: Download as PDF or HTML with preserved formatting
- **Customization Options**:
  - Light and dark themes
  - Multiple font families
  - Adjustable font size and line height
- **Rich Editor Tools**:
  - Text formatting (bold, italic, strikethrough)
  - Lists (ordered and unordered)
  - Headings
  - Code blocks
  - Tables with visual editor
  - Images and links
  - Blockquotes
  - Emoji picker
- **Statistics**: Word and character count

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/themrsami/markdown-master.git
   cd markdown-master
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Basic Editing

Type your markdown in the left panel and see the rendered output in real-time on the right panel.

### Using with ChatGPT

1. Generate markdown content in ChatGPT
2. Copy the markdown text (including code blocks and math equations)
3. Paste directly into the Markdown Master editor
4. View the rendered output and export as needed

The app preserves all formatting, including:
- Code syntax highlighting
- Math equations
- Tables
- Lists and nested content
- Links and images

### Math Equations

Use LaTeX syntax for math equations:

- Inline math: `$E = mc^2$`
- Block math: `$$\frac{n!}{k!(n-k)!} = \binom{n}{k}$$`

### Tables

Click the table button in the toolbar to open the table editor. You can:
- Add/remove rows and columns
- Input cell content
- Generate and insert the markdown table

### Exporting

- Click "Download as PDF" to print your document
- Click "Download as HTML" to save as an HTML file

## Known Issues

1. Square root symbols may display incorrectly in print mode, showing long horizontal lines extending to the end of the page.
2. The HTML download may not exactly match what's displayed in the markdown preview area.

We're actively working on these issues to ensure consistent rendering across all export formats.

## Customization

### Theme

Select between light and dark themes using the dropdown menu.

### Font Family

Choose from over 20 different font families for your document.

### Code Syntax Highlighting

Select from multiple syntax highlighting themes for code blocks:
- Tomorrow
- Dracula
- Solarized Light

### Font Size and Line Height

Adjust the font size and line height using the input fields.

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown processor
- [KaTeX](https://katex.org/) - Math typesetting
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Syntax highlighting
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Remark](https://github.com/remarkjs/remark) for markdown processing
- [Rehype](https://github.com/rehypejs/rehype) for HTML processing
- [React Resizable Panels](https://github.com/bvaughn/react-resizable-panels) for resizable editor/preview panels