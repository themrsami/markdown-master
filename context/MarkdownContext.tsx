"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { tomorrow, dracula, solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism"

export type SavedDocument = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type VersionHistory = {
  content: string;
  timestamp: number;
  aiPrompt?: string;
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
  versionHistory: VersionHistory[];
  currentVersionIndex: number;
  addToHistory: (content: string, aiPrompt?: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  generateWithAI: (prompt: string) => Promise<string>;
  getSyntaxHighlighterStyle: () => any;
  insertMarkdown: (format: string) => void;
  downloadPDF: () => void;
  downloadHTML: () => void;
  downloadMarkdown: () => void;
  saveDocument: () => void;
  loadDocument: (doc: SavedDocument) => void;
  deleteDocument: (id: string, e: React.MouseEvent) => void;
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
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  
  // Version history state
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([
    { content: initialMarkdown, timestamp: Date.now() }
  ])
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0)
  const [isUndoingOrRedoing, setIsUndoingOrRedoing] = useState(false)
  
  // Custom setMarkdown function that tracks version history
  const handleSetMarkdown = (newContent: string) => {
    // Only add to history if not currently undoing/redoing
    if (!isUndoingOrRedoing) {
      // If we're not at the end of the history, the user has gone back
      // and is now making a new edit, so we should truncate the future versions
      if (currentVersionIndex < versionHistory.length - 1) {
        setVersionHistory(versionHistory.slice(0, currentVersionIndex + 1));
      }
    }
    
    // Update the content
    setMarkdown(newContent);
  }
  
  // AI Assistant state
  const [aiEnabled, setAiEnabled] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [showAiPrompt, setShowAiPrompt] = useState(false)
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)

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
  }, [])

  const getSyntaxHighlighterStyle = () => {
    if (syntaxTheme === "tomorrow") return tomorrow;
    if (syntaxTheme === "dracula") return dracula;
    return solarizedlight;
  }

  const downloadPDF = () => {
    window.print()
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
      date: new Date().toISOString()
    }

    const updatedDocs = [...savedDocuments, doc]
    setSavedDocuments(updatedDocs)
    localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
    setShowSaveDialog(false)
  }

  const loadDocument = (doc: SavedDocument) => {
    setMarkdown(doc.content)
    setDocTitle(doc.title)
    setShowSidebar(false)
  }

  const deleteDocument = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedDocs = savedDocuments.filter(doc => doc.id !== id)
    setSavedDocuments(updatedDocs)
    localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
  }

  const downloadHTML = () => {
    const content = document.getElementById("markdown-content")?.innerHTML
    const katexCSS = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">'
    
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
            </style>
          </head>
          <body class="${theme}">
            <div class="markdown-body">
              ${content}
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
    const markdownTable = generateMarkdownTable()
    setMarkdown((prevMarkdown) => prevMarkdown + "\n\n" + markdownTable)
  }

  const replaceLatexDelimiters = (text: string) => {
    // First replace LaTeX delimiters
    let processedText = text
      .replace(/\\\[/g, "$$$$") // Replace \[ with $$
      .replace(/\\\]/g, "$$$$") // Replace \] with $$
      .replace(/\\\(/g, "$$") // Replace \( with $
      .replace(/\\\)/g, "$$") // Replace \) with $
    
    // Find all math expressions (both inline and block)
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
    
    // Replace pipe symbols within math expressions with HTML entity
    return processedText.replace(mathRegex, (match) => {
      // Replace all pipe symbols with their HTML entity within math expressions
      return match.replace(/\|/g, "\\vert ");
    });
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

  // Version history functions
  const addToHistory = (content: string, aiPrompt?: string) => {
    // Don't add duplicate content
    if (versionHistory[currentVersionIndex]?.content === content) {
      return;
    }

    // If we're currently viewing a past version (not the latest one)
    if (currentVersionIndex < versionHistory.length - 1) {
      // Create a new branch from the current version point
      const newHistory = [...versionHistory.slice(0, currentVersionIndex + 1), {
        content,
        timestamp: Date.now(),
        aiPrompt
      }];
      
      setVersionHistory(newHistory);
      setCurrentVersionIndex(newHistory.length - 1);
    } else {
      // We're at the latest version, simple add to history
      setVersionHistory([...versionHistory, {
        content,
        timestamp: Date.now(),
        aiPrompt
      }]);
      setCurrentVersionIndex(versionHistory.length);
    }
  };
  
  // Computed properties for undo/redo availability
  const canUndo = currentVersionIndex > 0;
  const canRedo = currentVersionIndex < versionHistory.length - 1;
  
  // Undo function - go back one version
  const undo = () => {
    if (canUndo) {
      setIsUndoingOrRedoing(true);
      const newIndex = currentVersionIndex - 1;
      setCurrentVersionIndex(newIndex);
      setMarkdown(versionHistory[newIndex].content);
      setIsUndoingOrRedoing(false);
    }
  };
  
  // Redo function - go forward one version
  const redo = () => {
    if (canRedo) {
      setIsUndoingOrRedoing(true);
      const newIndex = currentVersionIndex + 1;
      setCurrentVersionIndex(newIndex);
      setMarkdown(versionHistory[newIndex].content);
      setIsUndoingOrRedoing(false);
    }
  };
  
  // Clear history except for current version
  const clearHistory = () => {
    const currentVersion = versionHistory[currentVersionIndex];
    setVersionHistory([currentVersion]);
    setCurrentVersionIndex(0);
  };

  return (
    <MarkdownContext.Provider value={{
      markdown,
      setMarkdown: handleSetMarkdown, // Use our custom function here
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
      getSyntaxHighlighterStyle,
      insertMarkdown,
      downloadPDF,
      downloadHTML,
      downloadMarkdown,
      saveDocument,
      loadDocument,
      deleteDocument,
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
      versionHistory,
      currentVersionIndex,
      addToHistory,
      canUndo,
      canRedo,
      undo,
      redo,
      clearHistory,
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