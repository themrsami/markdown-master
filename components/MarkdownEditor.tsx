"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { Textarea } from "@/components/ui/textarea"
import { ResizablePanel } from "@/components/ui/resizable"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEffect, useRef, useState, useCallback } from "react"
import { Info } from "lucide-react"
import EditorContextMenu from "./EditorContextMenu"

export default function MarkdownEditor() {
  const { 
    markdown, 
    setMarkdown, 
    replaceLatexDelimiters, 
    aiEnabled,
    geminiApiKey,
    setSelectedText,
    setSelectionRange
  } = useMarkdown();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [localContent, setLocalContent] = useState(markdown);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingSelf = useRef<boolean>(false);
  const lastScrollTop = useRef<number>(0);
  
  // Debounced update to main markdown state
  const debouncedSetMarkdown = useCallback((value: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setMarkdown(replaceLatexDelimiters(value));
    }, 150); // 150ms debounce
  }, [setMarkdown, replaceLatexDelimiters]);
  
  // Handle content change with local state for immediate UI update
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalContent(newValue); // Immediate UI update
    debouncedSetMarkdown(newValue); // Debounced state update
  };
  
  // Sync local content when markdown changes from outside (e.g., AI, load document)
  useEffect(() => {
    setLocalContent(markdown);
  }, [markdown]);
  
  // Handle synchronized scrolling with smooth animation
  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (isScrollingSelf.current) return; // Prevent feedback loop
    
    const textarea = e.currentTarget;
    const scrollTop = textarea.scrollTop;
    const scrollHeight = textarea.scrollHeight;
    const clientHeight = textarea.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    
    if (maxScroll <= 0) return; // No scrollable content
    
    const scrollPercentage = scrollTop / maxScroll;
    lastScrollTop.current = scrollTop;
    
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      const previewElement = document.getElementById('markdown-preview-content');
      if (previewElement) {
        const previewMaxScroll = previewElement.scrollHeight - previewElement.clientHeight;
        if (previewMaxScroll > 0) {
          previewElement.scrollTo({
            top: previewMaxScroll * scrollPercentage,
            behavior: 'instant' // Use instant to prevent jarring
          });
        }
      }
    });
  }, []);
  
  // Listen for preview scroll events
  useEffect(() => {
    const handlePreviewScroll = (scrollPercentage: number) => {
      if (!textareaRef.current || isScrollingSelf.current) return;
      
      isScrollingSelf.current = true;
      const textarea = textareaRef.current;
      const maxScroll = textarea.scrollHeight - textarea.clientHeight;
      
      if (maxScroll > 0) {
        const targetScrollTop = maxScroll * scrollPercentage;
        textarea.scrollTo({
          top: targetScrollTop,
          behavior: 'instant'
        });
      }
      
      // Reset flag after scroll completes
      setTimeout(() => {
        isScrollingSelf.current = false;
      }, 50);
    };
    
    // Store the function reference for cleanup
    (window as any).editorScrollSync = handlePreviewScroll;
    
    return () => {
      delete (window as any).editorScrollSync;
    };
  }, []);
  
  // Cleanup debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle text selection in the editor
  const handleSelect = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      const selectedContent = localContent.substring(start, end);
      setSelectedText(selectedContent);
      setSelectionRange({ start, end });
    }
  };
  
  // Open AI Assistant dialog when requested from context menu
  const handleAIAssist = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start !== end) {
        const selectedContent = localContent.substring(start, end);
        setSelectedText(selectedContent);
        setSelectionRange({ start, end });
        // Trigger the AI dialog in the AIAssistant component
        const aiEvent = new CustomEvent('openAIAssistant');
        document.dispatchEvent(aiEvent);
      }
    }
  };

  return (
    <ResizablePanel 
      defaultSize={50} 
      minSize={30}
      className="lg:min-h-0 min-h-[45vh]"
    >
      <div className="h-full w-full flex flex-col">
        <EditorContextMenu onAIAssist={handleAIAssist}>
          <Textarea
            ref={textareaRef}
            value={localContent}
            onChange={handleContentChange}
            onSelect={handleSelect}
            onScroll={handleScroll}
            className="flex-1 w-full min-h-0 p-3 border-none rounded-none resize-none focus:outline-none focus:ring-0 focus-visible:ring-0 font-mono text-sm leading-relaxed custom-scrollbar touch-manipulation"
            placeholder="Enter your markdown here..."
            style={{ 
              minHeight: 0,
              height: '100%',
              WebkitTapHighlightColor: 'transparent'
            }}
          />
        </EditorContextMenu>
        
        {/* AI Tip when not enabled */}
        {(!aiEnabled || !geminiApiKey) && (
          <div className="p-3 border-t">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs">
                <strong>Tip:</strong> Enable AI Assistant in settings to enhance your writing. 
                Select text and right-click for AI-powered editing assistance!
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </ResizablePanel>
  );
}