"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { 
  FileIcon, 
  XIcon, 
  Trash2, 
  Edit3, 
  Search, 
  SortAsc, 
  SortDesc, 
  Calendar,
  FileText,
  CheckIcon,
  MoreVertical,
  FolderOpen
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type SortOption = 'title' | 'date' | 'size'
type SortDirection = 'asc' | 'desc'

export default function SavedDocumentsList() {
  const { 
    savedDocuments, 
    loadDocument, 
    deleteDocument, 
    deleteMultipleDocuments,
    renameDocument,
    currentFileId
  } = useMarkdown();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string, title: string } | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const { toast } = useToast();

  // Clear selections when saved documents change (after deletions)
  useEffect(() => {
    setSelectedDocuments(prev => 
      prev.filter(id => savedDocuments.some(doc => doc.id === id))
    );
  }, [savedDocuments]);

  // Filter and sort documents
  const filteredAndSortedDocuments = savedDocuments
    .filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'size':
          comparison = a.content.length - b.content.length;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

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

  const handleDocumentSelect = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredAndSortedDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

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
    setSelectedDocuments([]);
    
    toast({
      title: "Document Loaded",
      description: `"${doc.title}" has been loaded successfully.`,
    });
  };

  const handleEditClick = (doc: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDocId(doc.id);
    setEditingTitle(doc.title);
  };

  const handleSaveEdit = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    if (editingDocId && editingTitle.trim()) {
      // Check for duplicate names
      const isDuplicate = savedDocuments.some(doc => 
        doc.title.toLowerCase() === editingTitle.toLowerCase() && 
        doc.id !== editingDocId
      );
      
      if (isDuplicate) {
        toast({
          title: "Duplicate Name",
          description: `A document with the name "${editingTitle}" already exists.`,
          variant: "destructive",
        });
        return;
      }
      
      renameDocument(editingDocId, editingTitle);
      setEditingDocId(null);
      setEditingTitle("");
      
      toast({
        title: "Document Renamed",
        description: `Document renamed to "${editingTitle}".`,
      });
    }
  };

  const handleCancelEdit = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    setEditingDocId(null);
    setEditingTitle("");
  };

  const toggleSort = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatFileSize = (content: string) => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const truncateTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <div className="space-y-4">
      {/* Header with search and controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* Sort and Bulk Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  {sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
                  <span className="text-xs capitalize">{sortBy}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => toggleSort('title')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Sort by Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort('date')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Sort by Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort('size')}>
                  <FileIcon className="h-4 w-4 mr-2" />
                  Sort by Size
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Badge variant="secondary" className="text-xs">
              {filteredAndSortedDocuments.length} {filteredAndSortedDocuments.length === 1 ? 'document' : 'documents'}
            </Badge>
          </div>

          {selectedDocuments.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="h-8 gap-1"
            >
              <Trash2 className="h-3 w-3" />
              <span className="text-xs">Delete ({selectedDocuments.length})</span>
            </Button>
          )}
        </div>

        {/* Select All */}
        {filteredAndSortedDocuments.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={selectedDocuments.length === filteredAndSortedDocuments.length && filteredAndSortedDocuments.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span>
              {selectedDocuments.length > 0 
                ? `${selectedDocuments.length} selected` 
                : "Select all"
              }
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* Documents List */}
      {filteredAndSortedDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "No documents match your search" : "No saved documents"}
          </p>
          {searchQuery && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setSearchQuery("")}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-1 sidebar-scroll overflow-y-auto max-h-[60vh]">
          {filteredAndSortedDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`sidebar-document-item group relative p-3 rounded-lg border transition-all duration-200 hover:bg-accent/50 ${
                currentFileId === doc.id 
                  ? 'sidebar-document-current bg-primary/10 border-primary/30 shadow-sm' 
                  : 'hover:border-border/60'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <Checkbox
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={(checked) => handleDocumentSelect(doc.id, checked as boolean)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />

                {/* Document Content */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleLoadDocument(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      {editingDocId === doc.id ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="h-7 text-sm font-medium"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(e);
                              if (e.key === 'Escape') handleCancelEdit(e);
                            }}
                          />
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={handleSaveEdit}
                            className="h-7 w-7 p-0"
                          >
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={handleCancelEdit}
                            className="h-7 w-7 p-0"
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-primary flex-shrink-0" />
                          <h3 className="sidebar-compact-title font-medium text-sm" title={doc.title}>
                            {truncateTitle(doc.title)}
                          </h3>
                          {currentFileId === doc.id && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              Current
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="sidebar-document-meta flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(doc.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileIcon className="h-3 w-3" />
                          {formatFileSize(doc.content)}
                        </span>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    {editingDocId !== doc.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="sidebar-action-button h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleEditClick(doc, e)}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => handleDeleteClick(doc.id, doc.title, e)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Documents</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedDocuments.length} selected document(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}