"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow, dracula, solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism"
import "katex/dist/katex.min.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DownloadIcon, CopyIcon, TrashIcon, PlusIcon, SaveIcon, FolderIcon, FileIcon, XIcon } from "lucide-react"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Table,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import rehypeRaw from "rehype-raw"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

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

type SavedDocument = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export default function Home() {
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

  useEffect(() => {
    document.body.className = theme
    document.documentElement.style.setProperty("--font-size", `${fontSize}px`)
    document.documentElement.style.setProperty("--line-height", lineHeight)
    document.documentElement.style.setProperty("--font-family", fontFamily)
  }, [theme, fontSize, lineHeight, fontFamily])

  useEffect(() => {
    const words = markdown.trim().split(/\s+/).length
    const chars = markdown.length
    setWordCount(words)
    setCharCount(chars)
  }, [markdown])

  // Load saved documents from localStorage on component mount
  useEffect(() => {
    const storedDocs = localStorage.getItem('markdown-master-documents')
    if (storedDocs) {
      setSavedDocuments(JSON.parse(storedDocs))
    }
  }, [])

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
        }
        
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

  return (
    <div className={`max-w-[95%] mx-auto p-4 h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Markdown Master</h1>
          <Input 
            type="text" 
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="ml-4 w-64" 
            placeholder="Document Title"
          />
        </div>
        <div>
          <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="mr-2">
                <FolderIcon className="h-4 w-4 mr-2" />
                Saved Documents
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Saved Documents</SheetTitle>
                <SheetDescription>
                  Your saved markdown documents
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[70vh] mt-4">
                <div className="space-y-2">
                  {savedDocuments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No saved documents</p>
                  ) : (
                    savedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => loadDocument(doc)}
                        className="p-3 border rounded-md hover:bg-accent cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium flex items-center">
                            <FileIcon className="h-4 w-4 mr-2" />
                            {doc.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(doc.date).toLocaleDateString()}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => deleteDocument(doc.id, e)}
                          className="h-6 w-6 p-0"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <Select defaultValue={theme} onValueChange={(value) => setTheme(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Color Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue={fontFamily} onValueChange={(value) => setFontFamily(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Font Family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inter">Inter</SelectItem>
            <SelectItem value="roboto">Roboto</SelectItem>
            <SelectItem value="open-sans">Open Sans</SelectItem>
            <SelectItem value="lato">Lato</SelectItem>
            <SelectItem value="montserrat">Montserrat</SelectItem>
            <SelectItem value="poppins">Poppins</SelectItem>
            <SelectItem value="raleway">Raleway</SelectItem>
            <SelectItem value="ubuntu">Ubuntu</SelectItem>
            <SelectItem value="merriweather">Merriweather</SelectItem>
            <SelectItem value="playfair-display">Playfair Display</SelectItem>
            <SelectItem value="source-sans-pro">Source Sans Pro</SelectItem>
            <SelectItem value="oswald">Oswald</SelectItem>
            <SelectItem value="nunito">Nunito</SelectItem>
            <SelectItem value="roboto-slab">Roboto Slab</SelectItem>
            <SelectItem value="roboto-mono">Roboto Mono</SelectItem>
            <SelectItem value="lora">Lora</SelectItem>
            <SelectItem value="fira-sans">Fira Sans</SelectItem>
            <SelectItem value="pt-sans">PT Sans</SelectItem>
            <SelectItem value="pt-serif">PT Serif</SelectItem>
            <SelectItem value="arvo">Arvo</SelectItem>
            <SelectItem value="bitter">Bitter</SelectItem>
            <SelectItem value="crimson-text">Crimson Text</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue={syntaxTheme} onValueChange={(value) => setSyntaxTheme(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Code Syntax Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="dracula">Dracula</SelectItem>
            <SelectItem value="solarizedlight">Solarized Light</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Label htmlFor="font-size">Font Size:</Label>
          <Input
            id="font-size"
            type="number"
            min="0"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-[80px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="line-height">Line Height:</Label>
          <Input
            id="line-height"
            type="number"
            min="0"
            step="0.1"
            value={lineHeight}
            onChange={(e) => setLineHeight(e.target.value)}
            className="w-[80px]"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={downloadPDF} variant={theme === "dark" ? "secondary" : "default"}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={downloadHTML} variant={theme === "dark" ? "secondary" : "default"}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download HTML
        </Button>
        <Button onClick={downloadMarkdown} variant={theme === "dark" ? "secondary" : "default"}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download MD
        </Button>
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <SaveIcon className="w-4 h-4 mr-2" />
              Save
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Document</DialogTitle>
              <DialogDescription>
                Save your markdown document to access it later.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="document-title">Document Title</Label>
              <Input
                id="document-title"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Enter a title for your document"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={saveDocument}>Save Document</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={copyToClipboard} variant="outline">
          <CopyIcon className="w-4 h-4 mr-2" />
          Copy to Clipboard
        </Button>
        <Button onClick={clearMarkdown} variant="destructive">
          <TrashIcon className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="text-sm text-gray-500 mb-2">
        Words: {wordCount} | Characters: {charCount}
      </div>
      <div className="flex justify-center items-center gap-2 mb-4 p-2 bg-gray-100 dark:bg-zinc-900 rounded-lg">
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("bold")}>
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("italic")}>
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("strikethrough")}>
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("list")}>
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("ordered-list")}>
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("quote")}>
          <Quote className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("code")}>
          <Code className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("image")}>
          <Image className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("link")}>
          <Link className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h1")}>
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h2")}>
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h3")}>
          <Heading3 className="w-4 h-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Table className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Insert Markdown Table</DialogTitle>
              <DialogDescription>
                Create a table by adding or removing rows and columns, then copy or insert the generated Markdown.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Button onClick={addTableRow} variant="outline">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Row
                </Button>
                <Button onClick={addTableColumn} variant="outline">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Column
                </Button>
              </div>
              <div className="max-h-[300px] overflow-auto">
                <table className="w-full">
                  <tbody>
                    {tableContent.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="p-2">
                            <Input
                              value={cell}
                              onChange={(e) => updateTableCell(rowIndex, colIndex, e.target.value)}
                              className="w-full"
                            />
                          </td>
                        ))}
                        <td className="p-2">
                          <Button variant="ghost" size="sm" onClick={() => deleteTableRow(rowIndex)}>
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      {tableContent[0].map((_, colIndex) => (
                        <td key={colIndex} className="p-2">
                          <Button variant="ghost" size="sm" onClick={() => deleteTableColumn(colIndex)}>
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={copyMarkdownTable} variant="outline">
                  Copy Markdown
                </Button>
                <Button onClick={insertMarkdownTable}>Insert Table</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              😊 Emojis
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Emoji</DialogTitle>
              <DialogDescription>Click on an emoji to insert it at the cursor position.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-auto">
              {[
                "😀",
                "😃",
                "😄",
                "😁",
                "😆",
                "😅",
                "😂",
                "🤣",
                "😊",
                "😇",
                "🙂",
                "🙃",
                "😉",
                "😌",
                "😍",
                "🥰",
                "😘",
                "😗",
                "😙",
                "😚",
                "😋",
                "😛",
                "😝",
                "😜",
                "🤪",
                "🤨",
                "🧐",
                "🤓",
                "😎",
                "🤩",
                "🥳",
                "😏",
                "😒",
                "😞",
                "😔",
                "😟",
                "😕",
                "🙁",
                "☹️",
                "😣",
                "😖",
                "😫",
                "😩",
                "🥺",
                "😢",
                "😭",
                "😤",
                "😠",
                "😡",
                "🤬",
                "🤯",
                "😳",
                "🥵",
                "🥶",
                "😱",
                "😨",
                "😰",
                "😥",
                "😓",
                "🤗",
                "🤔",
                "🤭",
                "🤫",
                "🤥",
                "😶",
                "😐",
                "😑",
                "😬",
                "🙄",
                "😯",
                "😦",
                "😧",
                "😮",
                "😲",
                "🥱",
                "😴",
                "🤤",
                "😪",
                "😵",
                "🤐",
                "🥴",
                "🤢",
                "🤮",
                "🤧",
                "😷",
                "🤒",
                "🤕",
              ].map((emoji, index) => (
                <Button key={index} variant="ghost" size="sm" onClick={() => insertMarkdown(`emoji-${emoji}`)}>
                  {emoji}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="h-full p-4">
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(replaceLatexDelimiters(e.target.value))}
              className="w-full h-full p-2 border-none rounded-none resize-none focus:outline-none focus:ring-0 font-mono custom-scrollbar"
              placeholder="Enter your markdown here..."
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div id="markdown-content" className="h-full overflow-auto custom-scrollbar p-8">
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    return match ? (
                      <SyntaxHighlighter
                        // @ts-ignore - Type issues with the style property
                        style={syntaxTheme === "tomorrow" ? tomorrow : (syntaxTheme === "dracula" ? dracula : solarizedlight)}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                  br: () => <br />,
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

