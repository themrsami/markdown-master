"use client"

import { useState, useEffect } from "react"
import { useMarkdown } from "@/context/MarkdownContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Code, FileJson } from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamic import of code editor to avoid SSR issues
const CodeEditor = dynamic(() => 
  import('@monaco-editor/react').then(mod => ({ default: mod.default })), { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" /> 
  }
)

interface HtmlPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HtmlPreviewDialog({ open, onOpenChange }: HtmlPreviewDialogProps) {
  const { markdown, theme, fontSize, lineHeight, fontFamily } = useMarkdown()
  const [htmlContent, setHtmlContent] = useState("")
  const [cssContent, setCssContent] = useState("")
  const [combinedContent, setCombinedContent] = useState("")
  const [activeEditor, setActiveEditor] = useState<"html" | "css">("html")
  
  // Generate initial HTML content when dialog opens
  useEffect(() => {
    if (open) {
      generateHtmlContent()
    }
  }, [open, markdown, theme])

  // Update preview when HTML or CSS is edited
  useEffect(() => {
    if (htmlContent && cssContent) {
      const combined = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Preview</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">
  <style>
${cssContent}
  </style>
</head>
<body class="${theme}">
${htmlContent}
</body>
</html>`
      
      setCombinedContent(combined)
    }
  }, [htmlContent, cssContent, theme])

  const generateHtmlContent = async () => {
    // Get the rendered HTML content
    const content = document.getElementById("markdown-content")?.innerHTML || ""
    setHtmlContent(`<div class="markdown-body">\n  ${content}\n</div>`)

    // Generate CSS content
    const markdownStyles = `
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
  padding: 20px;
  color: ${theme === 'dark' ? '#e0e0e0' : '#111'};
  background-color: ${theme === 'dark' ? '#111' : '#fff'};
}

.markdown-body {
  font-size: var(--font-size);
  line-height: var(--line-height);
  font-family: var(--font-family), sans-serif;
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

/* Dark mode specific styles */
.dark {
  color: #e0e0e0;
  background-color: #111;
}

.dark a {
  color: #61dafb;
}

.dark blockquote {
  border-left-color: #4a4a4a;
  background-color: #2d2d2d;
}

.dark th,
.dark td {
  border-color: #4a4a4a;
}

.dark th {
  background-color: #2d2d2d;
}

.dark code {
  background-color: #2d2d2d;
  color: #e0e0e0;
}

.dark pre {
  background-color: #2d2d2d;
}`

    setCssContent(markdownStyles)
  }

  const downloadHTML = () => {
    const blob = new Blob([combinedContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "markdown.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPDF = () => {
    // Create an iframe to print the content
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.top = '-10000px'
    iframe.style.left = '-10000px'
    document.body.appendChild(iframe)

    // Write the content to the iframe
    iframe.contentDocument?.open()
    iframe.contentDocument?.write(combinedContent)
    iframe.contentDocument?.close()

    // Wait for resources to load
    iframe.onload = () => {
      // Print the iframe content
      iframe.contentWindow?.print()
      
      // Remove the iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    }
  }

  const handleEditorMount = (editor: any) => {
    // You can configure the editor further here
    editor.updateOptions({ 
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      wordWrap: 'on'
    });
  }

  const htmlEditorOptions = {
    minimap: { enabled: false },
    formatOnPaste: true,
    formatOnType: true,
    autoClosingBrackets: 'always' as const,
    autoClosingQuotes: 'always' as const,
    autoIndent: 'full' as const,
    tabSize: 2,
    wordWrap: 'on' as const
  }

  const cssEditorOptions = {
    ...htmlEditorOptions,
    folding: true,
    foldingHighlight: true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>HTML Preview</DialogTitle>
          <DialogDescription>
            View and edit the HTML and CSS before exporting.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {/* Preview panel */}
            <ResizablePanel defaultSize={50} minSize={25}>
              <div className="h-full overflow-auto">
                <div className="p-4 h-full">
                  <iframe
                    title="HTML Preview"
                    srcDoc={combinedContent}
                    className="w-full h-full border rounded-md"
                  />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle />
            
            {/* Code editors panel */}
            <ResizablePanel defaultSize={50} minSize={25}>
              <ResizablePanelGroup direction="vertical">
                {/* HTML editor */}
                <ResizablePanel defaultSize={50} minSize={15} className="relative">
                  <div className="absolute top-0 left-0 z-10 flex items-center justify-between w-full px-4 py-2 bg-muted">
                    <div className="flex items-center gap-2">
                      <Code size={16} />
                      <span className="font-medium">HTML</span>
                    </div>
                  </div>
                  <div className="h-full pt-10">
                    <CodeEditor
                      height="100%"
                      defaultLanguage="html"
                      theme={theme === 'dark' ? "vs-dark" : "vs"}
                      value={htmlContent}
                      onChange={(value) => setHtmlContent(value || "")}
                      options={htmlEditorOptions}
                      onMount={handleEditorMount}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle />
                
                {/* CSS editor */}
                <ResizablePanel defaultSize={50} minSize={15} className="relative">
                  <div className="absolute top-0 left-0 z-10 flex items-center justify-between w-full px-4 py-2 bg-muted">
                    <div className="flex items-center gap-2">
                      <FileJson size={16} />
                      <span className="font-medium">CSS</span>
                    </div>
                  </div>
                  <div className="h-full pt-10">
                    <CodeEditor
                      height="100%"
                      defaultLanguage="css"
                      theme={theme === 'dark' ? "vs-dark" : "vs"}
                      value={cssContent}
                      onChange={(value) => setCssContent(value || "")}
                      options={cssEditorOptions}
                      onMount={handleEditorMount}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button onClick={downloadHTML} variant="outline">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export HTML
            </Button>
            <Button onClick={downloadPDF}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}