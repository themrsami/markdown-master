"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { FolderIcon, FileTextIcon, MenuIcon, PlusIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import SavedDocumentsList from "@/components/SavedDocumentsList"

export default function Header() {
  const { docTitle, setDocTitle, showSidebar, setShowSidebar, theme, newDocument } = useMarkdown();

  return (
    <div className="mb-1 relative">
      {/* Top header section with logo and document title */}
      <div className="flex items-center justify-between py-1 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center flex-shrink-0">
            <FileTextIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Markdown Master
            </h1>
          </div>
          
          <Separator orientation="vertical" className="h-6 sm:h-8 hidden sm:block" />
          
          <div className="relative flex-1 max-w-xs sm:max-w-sm">
            <Input 
              type="text" 
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full pl-3 h-8 sm:h-9 text-sm transition-all focus-within:ring-2" 
              placeholder="Document Title"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            onClick={newDocument}
            variant="outline" 
            size="sm" 
            className="gap-1 sm:gap-2 shadow-sm hover:shadow-md transition-all text-xs sm:text-sm"
          >
            <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">New Document</span>
            <span className="sm:hidden">New</span>
          </Button>
          <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
            <SheetTrigger asChild>
              <Button 
                variant={theme === "dark" ? "outline" : "default"} 
                size="sm" 
                className="gap-1 sm:gap-2 shadow-sm hover:shadow-md transition-all text-xs sm:text-sm"
              >
                <FolderIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">My Documents</span>
                <span className="sm:hidden">Docs</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96 sm:w-[400px]">
              <SheetHeader className="space-y-2">
                <SheetTitle className="flex items-center text-lg">
                  <FolderIcon className="mr-2 h-5 w-5 text-primary" />
                  Document Library
                </SheetTitle>
                <SheetDescription className="text-sm">
                  Manage your saved markdown documents with professional tools
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <div className="h-[calc(100vh-120px)] overflow-hidden">
                <SavedDocumentsList />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Bottom border with gradient */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent mt-1" />
    </div>
  );
}