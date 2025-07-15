"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import Header from "@/components/Header"
import SettingsToolbar from "@/components/SettingsToolbar"
import ActionButtons from "@/components/ActionButtons"
import FormatToolbar from "@/components/FormatToolbar"
import MarkdownEditor from "@/components/MarkdownEditor"
import MarkdownPreview from "@/components/MarkdownPreview"
import AIAssistant from "@/components/AIAssistant"
import { useEffect } from "react"

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <KeyboardShortcuts />
      
      {/* Header section - fixed height */}
      <div className="flex-shrink-0 px-4 py-2 space-y-3">
        <Header />
        <SettingsToolbar />
        <ActionButtons />
        
        <div className="text-sm text-gray-500">
          <WordCharCount />
        </div>
        
        <FormatToolbar />
      </div>
      
      {/* Main editor area - takes remaining height */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
          <MarkdownEditor />
          <ResizableHandle />
          <MarkdownPreview />
        </ResizablePanelGroup>
      </div>
      
      {/* AI Assistant floating component */}
      <AIAssistant />
    </div>
  )
}

// Small component for word and character count
function WordCharCount() {
  const { wordCount, charCount } = useMarkdown();
  return <div>Words: {wordCount} | Characters: {charCount}</div>;
}

// Component to handle keyboard shortcuts
function KeyboardShortcuts() {
  const { quickSaveDocument, currentFileId } = useMarkdown();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        // Trigger save action - this will be handled by ActionButtons component
        const saveEvent = new CustomEvent('quickSave');
        document.dispatchEvent(saveEvent);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}

