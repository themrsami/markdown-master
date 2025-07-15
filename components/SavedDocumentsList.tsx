"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { FileIcon, XIcon, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
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
  const { savedDocuments, loadDocument, deleteDocument, deleteMultipleDocuments } = useMarkdown();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string, title: string } | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Clear selections when saved documents change (after deletions)
  useEffect(() => {
    setSelectedDocuments(prev => 
      prev.filter(id => savedDocuments.some(doc => doc.id === id))
    );
  }, [savedDocuments]);

  const handleDeleteClick = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    if (documentToDelete) {
      deleteDocument(documentToDelete.id, e);
      setDeleteDialogOpen(false);
      
      toast({
        title: "Document Deleted",
        description: `"${documentToDelete.title}" has been permanently removed.`,
        variant: "destructive",
      });
    }
  };

  // Handle checkbox selection
  const handleDocumentSelect = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  // Handle select all/none
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(savedDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedDocuments.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    deleteMultipleDocuments(selectedDocuments);
    
    toast({
      title: "Documents Deleted",
      description: `${selectedDocuments.length} document(s) have been permanently removed.`,
      variant: "destructive",
    });
    
    setSelectedDocuments([]);
    setBulkDeleteDialogOpen(false);
  };
  
  const handleLoadDocument = (doc: any) => {
    loadDocument(doc);
    
    // Clear selections when loading a document
    setSelectedDocuments([]);
    
    toast({
      title: "Document Loaded",
      description: `"${doc.title}" has been loaded successfully.`,
    });
  };

  return (
    <div className="space-y-2">
      {savedDocuments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No saved documents</p>
      ) : (
        <>
          {/* Bulk actions header */}
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedDocuments.length === savedDocuments.length && savedDocuments.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedDocuments.length > 0 
                  ? `${selectedDocuments.length} selected` 
                  : "Select all"
                }
              </span>
            </div>
            {selectedDocuments.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Selected</span>
              </Button>
            )}
          </div>

          {/* Documents list */}
          {savedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-3 border rounded-md hover:bg-accent cursor-pointer flex items-center space-x-3"
            >
              <Checkbox
                checked={selectedDocuments.includes(doc.id)}
                onCheckedChange={(checked) => handleDocumentSelect(doc.id, checked as boolean)}
                onClick={(e) => e.stopPropagation()}
              />
              <div 
                className="flex-1 flex justify-between items-center"
                onClick={() => handleLoadDocument(doc)}
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
            </div>
          ))}
        </>
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

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Documents</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedDocuments.length} selected document(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground">
              Delete All Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}