"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { 
  DownloadIcon, 
  CopyIcon, 
  TrashIcon, 
  SaveIcon, 
  Code, 
  FileType2, 
  Download
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
    saveAsDocument,
    quickSaveDocument,
    savedDocuments,
    setSavedDocuments,
    markdown,
    currentFileId,
    hasUnsavedChanges
  } = useMarkdown();
  
  const { toast } = useToast();
  const [htmlPreviewOpen, setHtmlPreviewOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [localDocTitle, setLocalDocTitle] = useState("");
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  
  // Sync local title with main docTitle when dialogs open
  useEffect(() => {
    if (showSaveDialog || showSaveAsDialog) {
      setLocalDocTitle(docTitle);
    }
  }, [showSaveDialog, showSaveAsDialog, docTitle]);
  
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
  
  // Handle quick save (Ctrl+S) - save to current file or show dialog if new
  const handleQuickSave = () => {
    if (currentFileId) {
      // Has current file, just save directly with toast
      quickSaveDocument();
      toast({
        title: "✅ Document saved",
        description: `"${docTitle}" has been updated`,
        variant: "default",
      });
    } else {
      // No current file, open save as dialog
      setShowSaveAsDialog(true);
    }
  };

  // Handle save as (always opens dialog)
  const handleSaveAs = () => {
    setShowSaveAsDialog(true);
  };

  // Handle save as document
  const handleSaveAsDocument = () => {
    // Check for duplicate names
    const isDuplicate = savedDocuments.some(doc => 
      doc.title.toLowerCase() === localDocTitle.toLowerCase() && 
      doc.id !== currentFileId
    );
    
    if (isDuplicate) {
      toast({
        title: "Duplicate Name",
        description: `A document with the name "${localDocTitle}" already exists. Please choose a different name.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!localDocTitle.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid document name.",
        variant: "destructive",
      });
      return;
    }
    
    saveAsDocument(localDocTitle);
    setShowSaveAsDialog(false);
    toast({
      title: "Document saved as",
      description: `"${localDocTitle}" has been saved`,
    });
  };
  const handleCancelSave = () => {
    setLocalDocTitle(docTitle); // Reset to original title
    setShowSaveDialog(false);
  };

  const handleCancelSaveAs = () => {
    setLocalDocTitle(docTitle); // Reset to original title
    setShowSaveAsDialog(false);
  };
  const handleSaveDocument = () => {
    // Check for duplicate names
    const isDuplicate = savedDocuments.some(doc => 
      doc.title.toLowerCase() === localDocTitle.toLowerCase() && 
      doc.id !== currentFileId
    );
    
    if (isDuplicate) {
      toast({
        title: "Duplicate Name",
        description: `A document with the name "${localDocTitle}" already exists. Please choose a different name.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!localDocTitle.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid document name.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the main docTitle state with the local title
    setDocTitle(localDocTitle);
    
    // Use localDocTitle for the save operation
    const id = localDocTitle ? localDocTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now() : 'doc-' + Date.now()
    const doc = {
      id,
      title: localDocTitle || 'Untitled Document',
      content: markdown,
      date: new Date().toISOString()
    }

    const updatedDocs = [...savedDocuments, doc]
    setSavedDocuments(updatedDocs)
    localStorage.setItem('markdown-master-documents', JSON.stringify(updatedDocs))
    setShowSaveDialog(false)
    
    toast({
      title: "Document saved",
      description: `"${localDocTitle || 'Untitled Document'}" has been saved to local storage`,
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

  // Listen for keyboard shortcut save event
  useEffect(() => {
    const handleQuickSaveEvent = () => {
      handleQuickSave();
    };

    document.addEventListener('quickSave', handleQuickSaveEvent);
    return () => document.removeEventListener('quickSave', handleQuickSaveEvent);
  }, [handleQuickSave]);

  return (
    <div className="mb-2">
      <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/30 rounded-lg shadow-sm">
        {/* Document Actions Group */}
        <div className="flex items-center">
          {/* Quick Save Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleQuickSave}
                  variant="outline" 
                  size="sm" 
                  className="rounded-r-none border-r-0"
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Save{hasUnsavedChanges && "*"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{currentFileId ? "Save to current file" : "Save document"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Save As Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleSaveAs}
                  variant="outline" 
                  size="sm" 
                  className="rounded-l-none rounded-r-none border-r-0"
                >
                  Save As
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save document with a new name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleCopy} variant="outline" size="sm" className="rounded-l-none rounded-r-none">
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
      
      {/* Save As Dialog */}
      <Dialog open={showSaveAsDialog} onOpenChange={setShowSaveAsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save As</DialogTitle>
            <DialogDescription>
              Save your markdown document with a new name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="save-as-title">Document Title</Label>
            <Input
              id="save-as-title"
              value={localDocTitle}
              onChange={(e) => setLocalDocTitle(e.target.value)}
              placeholder="Enter a title for your document"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelSaveAs}>Cancel</Button>
            <Button onClick={handleSaveAsDocument}>Save As</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}