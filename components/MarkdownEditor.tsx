"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { Textarea } from "@/components/ui/textarea"
import { ResizablePanel } from "@/components/ui/resizable"

export default function MarkdownEditor() {
  const { markdown, setMarkdown, replaceLatexDelimiters } = useMarkdown();

  return (
    <ResizablePanel defaultSize={50}>
      <div className="h-full p-4">
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(replaceLatexDelimiters(e.target.value))}
          className="w-full h-full p-2 border-none rounded-none resize-none focus:outline-none focus:ring-0 font-mono custom-scrollbar"
          placeholder="Enter your markdown here..."
        />
      </div>
    </ResizablePanel>
  );
}