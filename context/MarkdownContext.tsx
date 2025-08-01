"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { tomorrow, dracula, solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism"

export type SavedDocument = {
  id: string;
  title: string;
  content: string;
  customCSS?: string;
  date: string;
};

type MarkdownContextType = {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  fontSize: string;
  setFontSize: (fontSize: string) => void;
  lineHeight: string;
  setLineHeight: (lineHeight: string) => void;
  syntaxTheme: string;
  setSyntaxTheme: (syntaxTheme: string) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  wordCount: number;
  charCount: number;
  tableRows: number;
  setTableRows: (rows: number) => void;
  tableCols: number;
  setTableCols: (cols: number) => void;
  tableContent: string[][];
  setTableContent: (content: string[][]) => void;
  savedDocuments: SavedDocument[];
  setSavedDocuments: (docs: SavedDocument[]) => void;
  docTitle: string;
  setDocTitle: (title: string) => void;
  currentFileId: string | null;
  setCurrentFileId: (id: string | null) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  aiEnabled: boolean;
  setAiEnabled: (enabled: boolean) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  selectedText: string;
  setSelectedText: (text: string) => void;
  showAiPrompt: boolean;
  setShowAiPrompt: (show: boolean) => void;
  selectionRange: { start: number; end: number } | null;
  setSelectionRange: (range: { start: number; end: number } | null) => void;
  generateWithAI: (prompt: string) => Promise<string>;
  generateCSSWithAI: (prompt: string, elementInfo: string) => Promise<string>;
  elementSelectorMode: boolean;
  setElementSelectorMode: (mode: boolean) => void;
  selectedElement: Element | null;
  setSelectedElement: (element: Element | null) => void;
  customCSS: string;
  setCustomCSS: (css: string) => void;
  getSyntaxHighlighterStyle: () => any;
  insertMarkdown: (format: string) => void;
  downloadPDF: () => void;
  downloadHTML: () => void;
  downloadMarkdown: () => void;
  saveDocument: () => void;
  saveAsDocument: (title: string) => void;
  quickSaveDocument: () => void;
  newDocument: () => void;
  loadDocument: (doc: SavedDocument) => void;
  deleteDocument: (id: string, e: React.MouseEvent) => void;
  deleteMultipleDocuments: (ids: string[]) => void;
  renameDocument: (id: string, newTitle: string) => void;
  copyToClipboard: () => void;
  clearMarkdown: () => void;
  addTableRow: () => void;
  addTableColumn: () => void;
  deleteTableRow: (rowIndex: number) => void;
  deleteTableColumn: (colIndex: number) => void;
  updateTableCell: (rowIndex: number, colIndex: number, value: string) => void;
  generateMarkdownTable: () => string;
  copyMarkdownTable: () => void;
  insertMarkdownTable: () => void;
  replaceLatexDelimiters: (text: string) => string;
};

const initialMarkdown = `# Welcome to Markdown Master

This is a **bold** text, and this is an *italic* text.

## Lists

### Unordered List
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images

[OpenAI](https://www.openai.com)

![Sample Image](https://via.placeholder.com/150)

## Code

Inline \`code\` looks like this.

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

## Tables

| Header 1 | Header 2 |
|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 |
| Row 2, Col 1 | Row 2, Col 2 |

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

## Mathematical Equations

Inline equation: $E = mc^2$

Block equation:

$$
\\frac{n!}{k!(n-k)!} = \\binom{n}{k}
$$

## Horizontal Rule

---

That's all for now!
`

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined);

export const MarkdownProvider = ({ children }: { children: ReactNode }) => {
  const [markdown, setMarkdown] = useState(initialMarkdown)
  const [theme, setTheme] = useState("light")
  const [fontSize, setFontSize] = useState("16")
  const [lineHeight, setLineHeight] = useState("1.5")
  const [syntaxTheme, setSyntaxTheme] = useState("tomorrow")
  const [fontFamily, setFontFamily] = useState("inter")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [tableRows, setTableRows] = useState(2)
  const [tableCols, setTableCols] = useState(2)
  const [tableContent, setTableContent] = useState([
    ["", ""],
    ["", ""],
  ])
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([])
  const [docTitle, setDocTitle] = useState("New Document")
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  
  // AI Assistant state
  const [aiEnabled, setAiEnabled] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [showAiPrompt, setShowAiPrompt] = useState(false)
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)
  
  // Element selector and CSS customization state
  const [elementSelectorMode, setElementSelectorMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [customCSS, setCustomCSS] = useState("")

  // Handle theme and styling
  useEffect(() => {
    document.body.className = theme
    document.documentElement.style.setProperty("--font-size", `${fontSize}px`)
    document.documentElement.style.setProperty("--line-height", lineHeight)
    document.documentElement.style.setProperty("--font-family", fontFamily)
  }, [theme, fontSize, lineHeight, fontFamily])

  // Count words and characters
  useEffect(() => {
    const words = markdown.trim().split(/\s+/).length
    const chars = markdown.length
    setWordCount(words)
    setCharCount(chars)
  }, [markdown])

  // Track unsaved changes
  useEffect(() => {
    if (currentFileId) {
      const currentDoc = savedDocuments.find(doc => doc.id === currentFileId)
      if (currentDoc && (currentDoc.content !== markdown || (currentDoc.customCSS || '') !== customCSS)) {
        setHasUnsavedChanges(true)
      }
    } else if (markdown.trim() !== initialMarkdown.trim() || customCSS.trim() !== '') {
      setHasUnsavedChanges(true)
    }
  }, [markdown, customCSS, currentFileId, savedDocuments])

  // Load saved documents from localStorage
  useEffect(() => {
    const storedDocs = localStorage.getItem('markdown-master-documents')
    if (storedDocs) {
      setSavedDocuments(JSON.parse(storedDocs))
    }
    
    // Load saved API key
    const storedApiKey = localStorage.getItem('markdown-master-api-key')
    if (storedApiKey) {
      setGeminiApiKey(storedApiKey)
    }
    
    // Load saved custom CSS only for backward compatibility
    // New documents will have CSS stored per-document
    const storedCSS = localStorage.getItem('markdown-master-custom-css')
    if (storedCSS && !savedDocuments.length) {
      // Only set global CSS if no documents exist (first time user)
      setCustomCSS(storedCSS)
      
      // Apply saved CSS to document
      let styleElement = document.getElementById('custom-markdown-styles') as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-markdown-styles';
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = storedCSS;
    }
  }, [])

  // Update style element when custom CSS changes
  useEffect(() => {
    let styleElement = document.getElementById('custom-markdown-styles') as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-markdown-styles';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = customCSS || '';
  }, [customCSS])

  // Save custom CSS to localStorage for backward compatibility only
  // Primary CSS storage is now per-document
  useEffect(() => {
    // Only save to global localStorage if no current document (for new users)
    if (customCSS && !currentFileId) {
      localStorage.setItem('markdown-master-custom-css', customCSS)
    } else if (!customCSS) {
      localStorage.removeItem('markdown-master-custom-css')
    }
  }, [customCSS, currentFileId])

  const getSyntaxHighlighterStyle = () => {
    if (syntaxTheme === "tomorrow") return tomorrow;
    if (syntaxTheme === "dracula") return dracula;
    return solarizedlight;
  }

  const downloadPDF = () => {
    // Get the markdown content from the preview
    const content = document.getElementById("markdown-preview-content")?.innerHTML
    const katexCSS = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">'
    
    console.log('PDF Export - Custom CSS:', customCSS); // Debug log
    console.log('PDF Export - Custom CSS length:', customCSS?.length || 0); // Debug log
    
    if (content) {
      // Create complete HTML document optimized for printing
      const htmlDocument = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${docTitle} - PDF Export</title>
            ${katexCSS}
            <style>
              :root {
                --font-size: ${fontSize}px;
                --line-height: ${lineHeight};
                --font-family: "${fontFamily}";
              }
              
              body {
                font-family: var(--font-family);
                font-size: var(--font-size);
                line-height: var(--line-height);
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                color: #111;
                background-color: #fff;
              }
              
              .markdown-body {
                font-size: ${fontSize}px;
                line-height: ${lineHeight};
                font-family: ${fontFamily}, sans-serif;
                max-width: none;
                margin: 0;
                padding: 0;
              }
              
              /* Typography */
              h1, h2, h3, h4, h5, h6 {
                margin: 1.5em 0 0.5em 0;
                color: #111;
                page-break-after: avoid;
              }
              
              h1 { font-size: 2.5em; font-weight: bold; }
              h2 { font-size: 2em; font-weight: 600; }
              h3 { font-size: 1.5em; font-weight: 500; }
              h4 { font-size: 1.25em; font-weight: 500; }
              h5 { font-size: 1.125em; font-weight: 500; }
              h6 { font-size: 1em; font-weight: 500; }
              
              p {
                margin: 1em 0;
                color: #111;
              }
              
              /* Links */
              a {
                color: #0066cc;
                text-decoration: underline;
              }
              
              /* Lists */
              ul, ol {
                margin: 1em 0;
                padding-left: 2em;
              }
              
              li {
                margin-bottom: 0.5em;
              }
              
              /* Code */
              code {
                background: #f5f5f5;
                color: #333;
                padding: 2px 4px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
              }
              
              pre {
                background: #f5f5f5;
                color: #333;
                padding: 1em;
                border-radius: 5px;
                white-space: pre-wrap;
                overflow: visible;
                margin: 1em 0;
              }
              
              pre code {
                background: transparent;
                padding: 0;
              }
              
              /* Tables */
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
              }
              
              th, td {
                border: 1px solid #ddd;
                padding: 8px 12px;
                text-align: left;
              }
              
              th {
                background-color: #f5f5f5;
                font-weight: bold;
              }
              
              /* Blockquotes */
              blockquote {
                border-left: 4px solid #ccc;
                padding-left: 1em;
                margin: 1em 0;
                color: #666;
                font-style: italic;
              }
              
              /* Images */
              img {
                max-width: 100%;
                height: auto;
                margin: 1em 0;
              }
              
              /* Horizontal rules */
              hr {
                border: none;
                border-top: 1px solid #ccc;
                margin: 2em 0;
              }
              
              /* Math equations */
              .katex-display {
                display: flex;
                justify-content: center;
                margin: 1em 0;
                max-width: 100%;
                overflow: hidden;
              }
              
              .katex {
                display: inline-block;
                white-space: normal;
                max-width: 100%;
              }
              
              /* Print styles */
              @media print {
                body {
                  margin: 0;
                  padding: 20px;
                }
                
                h1, h2, h3, h4, h5, h6 {
                  page-break-after: avoid;
                }
                
                pre, blockquote {
                  page-break-inside: avoid;
                }
                
                img {
                  page-break-inside: avoid;
                }
                
                table {
                  page-break-inside: avoid;
                }
              }
              
              /* Custom User Styles */
              ${customCSS || '/* No custom styles applied */'}
            </style>
          </head>
          <body>
            <div id="markdown-preview-content">
              <div class="markdown-body">
                ${content}
              </div>
            </div>
            <script>
              // Auto-open print dialog when page loads
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              };
            </script>
          </body>
        </html>
      `
      
      // Create blob and open in new tab
      const blob = new Blob([htmlDocument], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      
      // Open in new tab
      const newTab = window.open(url, '_blank')
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
  }

  const clearMarkdown = () => {
    setMarkdown("")
    setDocTitle("New Document")
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${docTitle.toLowerCase().replace(/\s+/g, '-')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const saveDocument = () => {
    const id = docTitle ? docTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now() : 'doc-' + Date.now()
    const doc = {
      id,
      title: docTitle || 'Untitled Document',
      content: markdown,
      customCSS: customCSS || '',
      date: new Date().toISOString()
    }

    const updatedDocs = [...savedDocuments, doc]
    setSavedDocuments(updatedDocs)
    localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
    setShowSaveDialog(false)
  }

  const saveAsDocument = (title: string) => {
    const id = title ? title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now() : 'doc-' + Date.now()
    const doc = {
      id,
      title: title || 'Untitled Document',
      content: markdown,
      customCSS: customCSS || '',
      date: new Date().toISOString()
    }

    const updatedDocs = [...savedDocuments, doc]
    setSavedDocuments(updatedDocs)
    localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
    
    // Update current file tracking
    setCurrentFileId(id)
    setDocTitle(title)
    setHasUnsavedChanges(false)
  }

  const quickSaveDocument = () => {
    if (currentFileId) {
      // Update existing document
      const updatedDocs = savedDocuments.map(doc => 
        doc.id === currentFileId 
          ? { ...doc, content: markdown, customCSS: customCSS || '', date: new Date().toISOString() }
          : doc
      )
      setSavedDocuments(updatedDocs)
      localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
      setHasUnsavedChanges(false)
    } else {
      // No current file, treat as save as
      const id = docTitle ? docTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now() : 'doc-' + Date.now()
      const doc = {
        id,
        title: docTitle || 'Untitled Document',
        content: markdown,
        customCSS: customCSS || '',
        date: new Date().toISOString()
      }

      const updatedDocs = [...savedDocuments, doc]
      setSavedDocuments(updatedDocs)
      localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
      
      setCurrentFileId(id)
      setHasUnsavedChanges(false)
    }
  }

  const loadDocument = (doc: SavedDocument) => {
    setMarkdown(doc.content)
    setDocTitle(doc.title)
    setCurrentFileId(doc.id)
    setCustomCSS(doc.customCSS || '') // Load document-specific CSS
    setHasUnsavedChanges(false)
    setShowSidebar(false)
  }

  const newDocument = () => {
    setMarkdown('')
    setDocTitle('')
    setCurrentFileId('')
    setCustomCSS('') // Clear CSS for new document
    setHasUnsavedChanges(false)
    setShowSidebar(false)
  }

  const deleteDocument = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedDocs = savedDocuments.filter(doc => doc.id !== id)
    setSavedDocuments(updatedDocs)
    localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
  }

  const deleteMultipleDocuments = (ids: string[]) => {
    const updatedDocs = savedDocuments.filter(doc => !ids.includes(doc.id))
    setSavedDocuments(updatedDocs)
    localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
  }

  const renameDocument = (id: string, newTitle: string) => {
    const updatedDocs = savedDocuments.map(doc => 
      doc.id === id 
        ? { ...doc, title: newTitle, date: new Date().toISOString() }
        : doc
    )
    setSavedDocuments(updatedDocs)
    localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
    
    // Update current document title if it's the one being renamed
    if (currentFileId === id) {
      setDocTitle(newTitle)
    }
  }

  const downloadHTML = () => {
    const content = document.getElementById("markdown-preview-content")?.innerHTML
    const katexCSS = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">'
    
    console.log('HTML Export - Custom CSS:', customCSS); // Debug log
    console.log('HTML Export - Custom CSS length:', customCSS?.length || 0); // Debug log
    
    if (content) {
      // Get the computed CSS styles for proper rendering
      const markdownStyles = `
        body {
          font-family: var(--font-family);
          font-size: var(--font-size);
          line-height: var(--line-height);
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: ${theme === 'dark' ? '#e0e0e0' : '#111'};
          background-color: ${theme === 'dark' ? '#111' : '#fff'};
        }
        
        .markdown-body {
          font-size: ${fontSize}px;
          line-height: ${lineHeight};
          font-family: ${fontFamily}, sans-serif;
        }
        
        /* KaTeX Math Rendering Fixes */
        .katex-display {
          display: flex;
          justify-content: center;
          margin: 1em 0;
          max-width: 100%;
          overflow: hidden;
        }
        
        .katex {
          display: inline-block;
          white-space: normal;
          max-width: 100%;
        }
        
        .katex .sqrt {
          display: inline-flex;
          max-width: fit-content;
        }
        
        .katex .sqrt .sqrt-sign {
          position: relative;
          max-width: fit-content;
        }
        
        .katex .sqrt .vlist {
          max-width: fit-content;
        }
        
        .katex .overline .overline-line {
          min-width: auto;
          max-width: 100%;
          width: auto;
        }
        
        /* Markdown Styling */
        ${document.querySelector('.markdown-body')?.classList.toString()
          .split(' ')
          .map(cls => `.${cls}`)
          .join(', ')} {
          ${Array.from(document.styleSheets)
            .filter(sheet => !sheet.href || sheet.href.startsWith(window.location.origin))
            .map(sheet => {
              try {
                return Array.from(sheet.cssRules || [])
                  .filter(rule => {
                    return rule instanceof CSSStyleRule && rule.selectorText?.includes('.markdown-body');
                  })
                  .map(rule => (rule as CSSStyleRule).cssText)
                  .join('\n');
              } catch (e) {
                return '';
              }
            })
            .join('\n')}

        /* Code Syntax Highlighting */
        code {
          font-family: 'Roboto Mono', monospace;
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f1f1f1'};
          color: ${theme === 'dark' ? '#e0e0e0' : '#333'};
          padding: 0.2em 0.4em;
          border-radius: 3px;
        }
        
        pre {
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f1f1f1'};
          padding: 1em;
          border-radius: 5px;
          overflow-x: auto;
        }
        
        pre code {
          background-color: transparent;
          padding: 0;
        }
        
        /* Table Styling */
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        th, td {
          border: 1px solid ${theme === 'dark' ? '#4a4a4a' : '#ddd'};
          padding: 8px;
        }
        
        th {
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f1f1f1'};
          text-align: left;
        }
      `
      
      // Create complete HTML with all necessary styles
      const htmlDocument = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown Export</title>
            ${katexCSS}
            <style>
              :root {
                --font-size: ${fontSize}px;
                --line-height: ${lineHeight};
                --font-family: "${fontFamily}";
              }
              ${markdownStyles}
              
              /* Custom User Styles */
              ${customCSS || '/* No custom styles applied */'}
            </style>
          </head>
          <body class="${theme}">
            <div id="markdown-preview-content">
              <div class="markdown-body">
                ${content}
              </div>
            </div>
          </body>
        </html>
      `
      
      const blob = new Blob([htmlDocument], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "markdown.html"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const insertMarkdown = (format: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    let insertion = ""

    switch (format) {
      case "bold":
        insertion = `**${text.slice(start, end) || "bold text"}**`
        break
      case "italic":
        insertion = `*${text.slice(start, end) || "italic text"}*`
        break
      case "strikethrough":
        insertion = `~~${text.slice(start, end) || "strikethrough text"}~~`
        break
      case "list":
        insertion = `\n- List item`
        break
      case "ordered-list":
        insertion = `\n1. Ordered list item`
        break
      case "quote":
        insertion = `\n> ${text.slice(start, end) || "Blockquote"}`
        break
      case "code":
        insertion = `\`${text.slice(start, end) || "code"}\``
        break
      case "image":
        insertion = `![Alt text](https://example.com/image.jpg)`
        break
      case "link":
        insertion = `[Link text](https://example.com)`
        break
      case "h1":
        insertion = `\n# ${text.slice(start, end) || "Heading 1"}`
        break
      case "h2":
        insertion = `\n## ${text.slice(start, end) || "Heading 2"}`
        break
      case "h3":
        insertion = `\n### ${text.slice(start, end) || "Heading 3"}`
        break
      default:
        if (format.startsWith("emoji-")) {
          insertion = format.slice(6)
        }
    }

    const newText = text.slice(0, start) + insertion + text.slice(end)
    setMarkdown(newText)
    textarea.focus()
    textarea.setSelectionRange(start + insertion.length, start + insertion.length)
  }

  const addTableRow = () => {
    setTableRows(tableRows + 1)
    setTableContent([...tableContent, Array(tableCols).fill("")])
  }

  const addTableColumn = () => {
    setTableCols(tableCols + 1)
    setTableContent(tableContent.map((row) => [...row, ""]))
  }

  const deleteTableRow = (rowIndex: number) => {
    if (tableRows > 1) {
      setTableRows(tableRows - 1)
      setTableContent(tableContent.filter((_, index) => index !== rowIndex))
    }
  }

  const deleteTableColumn = (colIndex: number) => {
    if (tableCols > 1) {
      setTableCols(tableCols - 1)
      setTableContent(tableContent.map((row) => row.filter((_, index) => index !== colIndex)))
    }
  }

  const updateTableCell = (rowIndex: number, colIndex: number, value: string) => {
    const newContent = [...tableContent]
    newContent[rowIndex][colIndex] = value
    setTableContent(newContent)
  }

  const generateMarkdownTable = () => {
    let markdownTable = "| " + tableContent[0].join(" | ") + " |\n"
    markdownTable += "| " + Array(tableCols).fill("---").join(" | ") + " |\n"
    for (let i = 1; i < tableRows; i++) {
      markdownTable += "| " + tableContent[i].join(" | ") + " |\n"
    }
    return markdownTable
  }

  const copyMarkdownTable = () => {
    const markdownTable = generateMarkdownTable()
    navigator.clipboard.writeText(markdownTable)
  }

  const insertMarkdownTable = () => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    const markdownTable = generateMarkdownTable()
    
    if (!textarea) {
      // Fallback: append to end if no textarea found
      setMarkdown((prevMarkdown) => prevMarkdown + "\n\n" + markdownTable)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = textarea.value
    
    // Add proper spacing around table
    const beforeText = currentValue.slice(0, start)
    const afterText = currentValue.slice(end)
    const needsSpaceBefore = beforeText.trim() && !beforeText.endsWith('\n\n')
    const needsSpaceAfter = afterText.trim() && !afterText.startsWith('\n\n')
    
    const insertion = (needsSpaceBefore ? '\n\n' : '') + markdownTable + (needsSpaceAfter ? '\n\n' : '')
    const newContent = beforeText + insertion + afterText
    const newCursorPosition = start + insertion.length

    // Update React state
    setMarkdown(newContent)
    
    // Update textarea and cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPosition, newCursorPosition)
    }, 0)
  }

  const replaceLatexDelimiters = (text: string) => {
    // Replace LaTeX delimiters only
    return text
      .replace(/\\\[/g, "$$$$") // Replace \[ with $$
      .replace(/\\\]/g, "$$$$") // Replace \] with $$
      .replace(/\\\(/g, "$$") // Replace \( with $
      .replace(/\\\)/g, "$$") // Replace \) with $
  }

  // Generate content with Gemini AI
  const generateWithAI = async (prompt: string): Promise<string> => {
    if (!geminiApiKey) {
      console.error("Gemini API key is not set")
      return "Error: API key not provided. Please add your Gemini API key in settings."
    }

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful assistant for a markdown editor application. The user has selected some markdown text and wants to change it based on the following prompt: "${prompt}". 
                  
The user's selected markdown text is:
"""
${selectedText}
"""

Generate a response that directly answers their request. Your response should be well-formatted markdown that can directly replace the selected text. Do not include explanations or extra comments outside of what should replace the text.`
                }
              ],
              role: "user"
            }
          ],
          generation_config: {
            temperature: 0.7,
            top_p: 0.95,
            top_k: 40,
            max_output_tokens: 8192
          },
          safety_settings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the response to extract the generated text
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
      return `Error generating content: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  // Generate CSS styles with Gemini AI
  const generateCSSWithAI = async (prompt: string, elementInfo: string): Promise<string> => {
    if (!geminiApiKey) {
      console.error("Gemini API key is not set")
      return "Error: API key not provided. Please add your Gemini API key in settings."
    }

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a CSS expert helping to style HTML elements. The user has selected a specific element and wants to apply custom CSS styles to it.

IMPORTANT: You are styling ONE SPECIFIC ELEMENT that has already been targeted with a precise CSS selector. Do NOT change or suggest a different selector.

Selected Element Details:
${elementInfo}

User's Styling Request: "${prompt}"

Your task: Generate ONLY the CSS properties (not selectors or curly braces) that will accomplish the user's request for this specific element. 

Requirements:
- Generate only CSS properties and values
- Use !important declarations for specificity
- One property per line with proper semicolons
- Focus on the specific element described above
- Do not include any selectors, comments, or curly braces
- Make the styles beautiful and professional

Example format:
color: #333333 !important;
background-color: #f8f9fa !important;
padding: 1rem !important;
border-radius: 0.5rem !important;

Generate CSS properties only:`
                }
              ],
              role: "user"
            }
          ],
          generation_config: {
            temperature: 0.7,
            top_p: 0.95,
            top_k: 40,
            max_output_tokens: 2048
          },
          safety_settings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the response to extract the generated text
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error generating CSS with AI:", error);
      return `/* Error generating CSS: ${error instanceof Error ? error.message : 'Unknown error'} */`;
    }
  };

  return (
    <MarkdownContext.Provider value={{
      markdown,
      setMarkdown, // Use the regular setMarkdown function
      theme,
      setTheme,
      fontSize,
      setFontSize,
      lineHeight,
      setLineHeight,
      syntaxTheme,
      setSyntaxTheme,
      fontFamily,
      setFontFamily,
      wordCount,
      charCount,
      tableRows,
      setTableRows,
      tableCols,
      setTableCols,
      tableContent,
      setTableContent,
      savedDocuments,
      setSavedDocuments,
      docTitle,
      setDocTitle,
      currentFileId,
      setCurrentFileId,
      hasUnsavedChanges,
      setHasUnsavedChanges,
      showSidebar,
      setShowSidebar,
      showSaveDialog,
      setShowSaveDialog,
      aiEnabled,
      setAiEnabled,
      geminiApiKey,
      setGeminiApiKey,
      selectedText,
      setSelectedText,
      showAiPrompt,
      setShowAiPrompt,
      selectionRange,
      setSelectionRange,
      generateWithAI,
      elementSelectorMode,
      setElementSelectorMode,
      selectedElement,
      setSelectedElement,
      customCSS,
      setCustomCSS,
      getSyntaxHighlighterStyle,
      insertMarkdown,
      downloadPDF,
      downloadHTML,
      downloadMarkdown,
      saveDocument,
      saveAsDocument,
      quickSaveDocument,
      newDocument,
      loadDocument,
      deleteDocument,
      deleteMultipleDocuments,
      renameDocument,
      copyToClipboard,
      clearMarkdown,
      addTableRow,
      addTableColumn,
      deleteTableRow,
      deleteTableColumn,
      updateTableCell,
      generateMarkdownTable,
      copyMarkdownTable,
      insertMarkdownTable,
      replaceLatexDelimiters,
      generateCSSWithAI,
    }}>
      {children}
    </MarkdownContext.Provider>
  );
};

export const useMarkdown = () => {
  const context = useContext(MarkdownContext);
  if (context === undefined) {
    throw new Error("useMarkdown must be used within a MarkdownProvider");
  }
  return context;
};