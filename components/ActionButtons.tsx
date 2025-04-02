"use client"

import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { DownloadIcon, CopyIcon, TrashIcon, SaveIcon } from "lucide-react"
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

  return (
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
  );
}