"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { 
  DownloadIcon, 
  CopyIcon, 
  TrashIcon, 
  SaveIcon, 
  Code, 
  FileType2, 
  Download,
  BookmarkIcon 
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
import { useToast } from "@/hooks/use-toast"

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
    saveDocument,
    addToHistory,
    markdown
  } = useMarkdown();
  
  const { toast } = useToast();
  const [htmlPreviewOpen, setHtmlPreviewOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  
  // Handler for saving a new version
  const handleSaveVersion = () => {
    addToHistory(markdown);
    
    toast({
      title: "Version saved",
      description: "Your document version has been saved",
    });
  };
  
  // Handle copy to clipboard with toast notification
  const handleCopy = () => {
    copyToClipboard();
    toast({
      title: "Copied to clipboard",
      description: "Markdown content has been copied to your clipboard",
    });
  };
  
  // Handle markdown download with toast notification
  const handleDownloadMarkdown = () => {
    downloadMarkdown();
    toast({
      title: "Download started",
      description: `${docTitle}.md is being downloaded`,
    });
  };
  
  // Handle HTML download with toast notification
  const handleDownloadHTML = () => {
    downloadHTML();
    toast({
      title: "Download started",
      description: "HTML file is being downloaded",
    });
  };
  
  // Handle PDF download with toast notification
  const handleDownloadPDF = () => {
    downloadPDF();
    toast({
      title: "PDF export initiated",
      description: "PDF download will start after processing",
    });
  };
  
  // Handle document save with toast notification
  const handleSaveDocument = () => {
    saveDocument();
    toast({
      title: "Document saved",
      description: `"${docTitle}" has been saved to local storage`,
    });
  };
  
  // Handle clear document with confirmation
  const handleClearDocument = () => {
    clearMarkdown();
    toast({
      title: "Document cleared",
      description: "The document has been cleared",
      variant: "destructive",
    });
    setClearDialogOpen(false);
  };

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
                      <Button onClick={handleSaveDocument}>Save Document</Button>
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
                <Button onClick={handleCopy} variant="outline" size="sm" className="rounded-none">
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
                <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-l-none text-destructive hover:text-destructive">
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Clear Document</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to clear the current document? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleClearDocument}>
                        Clear Document
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear the current document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Separator orientation="vertical" className="h-8 mx-4" />
        
        {/* Version Control Action */}
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleSaveVersion} 
                  variant="outline" 
                  size="sm" 
                  className="flex gap-2 items-center"
                >
                  <BookmarkIcon className="w-4 h-4" />
                  Save Version
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Save current version</p>
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
              <DropdownMenuItem onClick={handleDownloadPDF} className="cursor-pointer">
                <Download className="w-4 h-4 mr-2" />
                PDF Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadHTML} className="cursor-pointer">
                <FileType2 className="w-4 h-4 mr-2" />
                HTML File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadMarkdown} className="cursor-pointer">
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