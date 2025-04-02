"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { FileIcon, XIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SavedDocumentsList() {
  const { savedDocuments, loadDocument, deleteDocument } = useMarkdown();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string, title: string } | null>(null);

  const handleDeleteClick = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    if (documentToDelete) {
      deleteDocument(documentToDelete.id, e);
      setDeleteDialogOpen(false);
    }
  };

  return (
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
              onClick={(e) => handleDeleteClick(doc.id, doc.title, e)}
              className="h-6 w-6 p-0"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{documentToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}