# Markdown Master

A powerful, customizable Markdown editor and renderer with real-time preview, built with Next.js. Fully compatible with ChatGPT-generated markdown content.

![Markdown Master](/public/screenshot.png)

## Features

- **Real-time Preview**: See your markdown rendered as you type
- **ChatGPT Compatibility**: Copy markdown directly from ChatGPT and paste it for perfect rendering
- **AI Assistant**: Enhance selected text with Gemini AI assistance
- **Version History**: Track document changes with undo/redo functionality
- **Mathematics Support**: Full LaTeX math support using KaTeX
- **Code Syntax Highlighting**: Multiple themes for code blocks
- **Export Options**: Download as PDF or HTML with preserved formatting
- **Document Management**: Save and load documents from local storage
- **User Feedback**: Toast notifications and confirmation dialogs for improved UX
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

### Version History

- Use the version history toolbar to navigate through document versions
- Click "Save Version" to manually save the current state of your document
- Navigate through versions using the undo/redo buttons
- Jump to the latest version using the fast-forward button

### AI Assistant

1. Enable AI features in the settings toolbar
2. Enter your Gemini API key (it will be saved securely in your browser)
3. Select text in the editor and right-click to use "Enhance with AI Assistant"
4. Enter a prompt describing how to transform the selected text
5. The AI will replace the selected text with enhanced content

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

### Document Management

- Save documents to local storage with custom titles
- Access saved documents from the "My Documents" panel
- Load and delete saved documents as needed

### Exporting

- Click "Export As" to see available export options
- Choose PDF, HTML, or raw Markdown format
- Use "HTML Preview" to customize the HTML/CSS before exporting

## Known Issues

1. The HTML download may not exactly match what's displayed in the markdown preview area.

I'm actively working on the issues to ensure consistent rendering across all export formats.

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

### AI Assistant Settings

Enable or disable the AI assistant and manage your Gemini API key in the settings toolbar.

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown processor
- [KaTeX](https://katex.org/) - Math typesetting
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Syntax highlighting
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Google Gemini AI](https://ai.google.dev/) - AI assistance (requires API key)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Remark](https://github.com/remarkjs/remark) for markdown processing
- [Rehype](https://github.com/rehypejs/rehype) for HTML processing
- [React Resizable Panels](https://github.com/bvaughn/react-resizable-panels) for resizable editor/preview panels
- [Google Generative AI](https://ai.google.dev/) for AI assistance capabilities