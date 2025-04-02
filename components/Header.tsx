"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { FolderIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import SavedDocumentsList from "@/components/SavedDocumentsList"

export default function Header() {
  const { docTitle, setDocTitle, showSidebar, setShowSidebar } = useMarkdown();

  return (
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
              <SavedDocumentsList />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}