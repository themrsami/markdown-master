"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { Textarea } from "@/components/ui/textarea"
import { ResizablePanel } from "@/components/ui/resizable"
import { useEffect, useRef, useState, useCallback } from "react"
import EditorContextMenu from "./EditorContextMenu"

export default function MarkdownEditor() {
  const { 
    markdown, 
    setMarkdown, 
    replaceLatexDelimiters, 
    aiEnabled,
    setSelectedText,
    setSelectionRange
  } = useMarkdown();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [localContent, setLocalContent] = useState(markdown);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
    <ResizablePanel defaultSize={50}>
      <div className="h-full p-4">
        <EditorContextMenu onAIAssist={handleAIAssist}>
          <Textarea
            ref={textareaRef}
            value={localContent}
            onChange={handleContentChange}
            onSelect={handleSelect}
            className="w-full h-full p-2 border-none rounded-none resize-none focus:outline-none focus:ring-0 font-mono custom-scrollbar"
            placeholder="Enter your markdown here..."
          />
        </EditorContextMenu>
      </div>
    </ResizablePanel>
  );
}