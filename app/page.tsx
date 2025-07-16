"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import Header from "@/components/Header"
import SettingsToolbar from "@/components/SettingsToolbar"
import ActionButtons from "@/components/ActionButtons"
import FormatToolbar from "@/components/FormatToolbar"
import MarkdownEditor from "@/components/MarkdownEditor"
import MarkdownPreview from "@/components/MarkdownPreview"
import MarkdownEditorMobile from "@/components/MarkdownEditorMobile"
import MarkdownPreviewMobile from "@/components/MarkdownPreviewMobile"
import AIAssistant from "@/components/AIAssistant"
import { useEffect, useState } from "react"

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <KeyboardShortcuts />
      
      {/* Header section - responsive layout */}
      <div className="flex-shrink-0 w-full">
        {/* Main header with logo and title - always visible */}
        <div className="px-2 sm:px-3 lg:px-4 py-1">
          <Header />
        </div>
        
        {/* Collapsible toolbar section */}
        <div className="px-2 sm:px-3 lg:px-4 pb-1 space-y-1">
          {/* Primary tools row */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <div className="flex-1 min-w-0">
              <ActionButtons />
            </div>
          </div>
          
          {/* Secondary tools row */}
          <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <SettingsToolbar />
            </div>
            <div className="text-xs sm:text-sm text-gray-500 order-last sm:order-none">
              <WordCharCount />
            </div>
          </div>
          
          {/* Format toolbar - full width on mobile */}
          <div className="w-full">
            <FormatToolbar />
          </div>
        </div>
      </div>
      
      {/* Main editor area - takes all remaining height */}
      <div className="flex-1 w-full px-2 sm:px-3 lg:px-4 pb-0 min-h-0 overflow-hidden">
        {/* Desktop layout with resizable panels */}
        <div className="hidden lg:flex w-full h-full">
          <ResizablePanelGroup 
            direction="horizontal" 
            className="w-full h-full rounded-lg border"
          >
            <MarkdownEditor />
            <ResizableHandle />
            <MarkdownPreview />
          </ResizablePanelGroup>
        </div>
        
        {/* Mobile layout with vertical resizable panels */}
        <div className="flex lg:hidden w-full h-full">
          <ResizablePanelGroup 
            direction="vertical" 
            className="w-full h-full rounded-lg border"
          >
            <MarkdownEditorMobile />
            <ResizableHandle withHandle />
            <MarkdownPreviewMobile />
          </ResizablePanelGroup>
        </div>
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

