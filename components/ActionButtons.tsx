"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { DownloadIcon, CopyIcon, TrashIcon, SaveIcon, Code, FileType2, Download } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import HtmlPreviewDialog from "./HtmlPreviewDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function ActionButtons() {
  const { 
    theme, 
    downloadPDF, 
    downloadHTML, 
    downloadMarkdown,
    copyToClipboard,
    clearMarkdown,
    docTitle,
    setDocTitle,
    showSaveDialog,
    setShowSaveDialog,
    saveDocument
  } = useMarkdown();
  
  const [htmlPreviewOpen, setHtmlPreviewOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/30 rounded-lg shadow-sm">
        {/* Document Actions Group */}
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-r-none border-r-0">
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Save document to local storage</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="rounded-none">
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy markdown to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={clearMarkdown} variant="outline" size="sm" className="rounded-l-none text-destructive hover:text-destructive">
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear the current document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Separator orientation="vertical" className="h-8 mx-4" />
        
        {/* Export Actions Group */}
        <div className="flex items-center">
          {/* Export dropdown */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant={theme === "dark" ? "secondary" : "default"} 
                      size="sm"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      <span>Export As</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export document in various formats</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={downloadPDF} className="cursor-pointer">
                <Download className="w-4 h-4 mr-2" />
                PDF Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadHTML} className="cursor-pointer">
                <FileType2 className="w-4 h-4 mr-2" />
                HTML File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadMarkdown} className="cursor-pointer">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Markdown (.md)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* HTML Preview Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setHtmlPreviewOpen(true)} 
                  variant={theme === "dark" ? "secondary" : "default"}
                  size="sm"
                  className="ml-2"
                >
                  <Code className="w-4 h-4 mr-2" />
                  HTML Preview
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview and edit the HTML/CSS</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* HTML Preview Dialog */}
      <HtmlPreviewDialog open={htmlPreviewOpen} onOpenChange={setHtmlPreviewOpen} />
    </div>
  );
}