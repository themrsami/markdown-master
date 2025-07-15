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
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <KeyboardShortcuts />
      
      {/* Header section - auto height */}
      <div className="flex-shrink-0 w-full">
        <div className="px-2 sm:px-4 py-1 space-y-2">
          <Header />
          <SettingsToolbar />
          <ActionButtons />
          
          <div className="text-sm text-gray-500">
            <WordCharCount />
          </div>
          
          <FormatToolbar />
        </div>
      </div>
      
      {/* Main editor area - takes all remaining height */}
      <div className="flex-1 w-full px-2 sm:px-4 pb-2 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full rounded-lg border">
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

