"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { FolderIcon, FileTextIcon, MenuIcon } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

export default function Header() {
  const { docTitle, setDocTitle, showSidebar, setShowSidebar, theme } = useMarkdown();

  return (
    <div className="mb-2 relative">
      {/* Top header section with logo and document title */}
      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <FileTextIcon className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Markdown Master
            </h1>
          </div>
          
          <Separator orientation="vertical" className="h-8" />
          
          <div className="relative">
            <Input 
              type="text" 
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-64 pl-3 h-9 transition-all focus-within:w-80" 
              placeholder="Document Title"
            />
            <div className="absolute -bottom-5 left-0 text-xs text-muted-foreground">
              Untitled Document
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
            <SheetTrigger asChild>
              <Button 
                variant={theme === "dark" ? "outline" : "default"} 
                size="sm" 
                className="gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <FolderIcon className="h-4 w-4" />
                <span>My Documents</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <FolderIcon className="mr-2 h-5 w-5" />
                  Saved Documents
                </SheetTitle>
                <SheetDescription>
                  Access your saved markdown documents
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <ScrollArea className="h-[75vh] pr-4">
                <SavedDocumentsList />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Bottom border with gradient */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent mt-1" />
    </div>
  );
}