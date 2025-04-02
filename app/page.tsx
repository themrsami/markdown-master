"use client"

import { MarkdownProvider, useMarkdown } from "@/context/MarkdownContext"
import { ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import Header from "@/components/Header"
import SettingsToolbar from "@/components/SettingsToolbar"
import ActionButtons from "@/components/ActionButtons"
import FormatToolbar from "@/components/FormatToolbar"
import MarkdownEditor from "@/components/MarkdownEditor"
import MarkdownPreview from "@/components/MarkdownPreview"
import AIAssistant from "@/components/AIAssistant"
import VersionHistoryToolbar from "@/components/VersionHistoryToolbar"

export default function Home() {
  return (
    <MarkdownProvider>
      <div className="max-w-[95%] mx-auto p-4 h-screen flex flex-col">
        <Header />
        <SettingsToolbar />
        <ActionButtons />
        
        <div className="text-sm text-gray-500 mb-2">
          <WordCharCount />
        </div>
        
        <FormatToolbar />
        
        <VersionHistoryToolbar />
        
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
          <MarkdownEditor />
          <ResizableHandle />
          <MarkdownPreview />
        </ResizablePanelGroup>
        
        {/* AI Assistant floating component */}
        <AIAssistant />
      </div>
    </MarkdownProvider>
  )
}

// Small component for word and character count
function WordCharCount() {
  const { wordCount, charCount } = useMarkdown();
  return <div>Words: {wordCount} | Characters: {charCount}</div>;
}

