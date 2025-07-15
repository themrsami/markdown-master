"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { ResizablePanel } from "@/components/ui/resizable"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { useEffect, useRef, useCallback } from "react"

export default function MarkdownPreview() {
  const { markdown, getSyntaxHighlighterStyle } = useMarkdown();
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingSelf = useRef<boolean>(false);
  const lastScrollTop = useRef<number>(0);
  
  // Handle synchronized scrolling with smooth animation
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSelf.current) return; // Prevent feedback loop
    
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    
    if (maxScroll <= 0) return; // No scrollable content
    
    const scrollPercentage = scrollTop / maxScroll;
    lastScrollTop.current = scrollTop;
    
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      if ((window as any).editorScrollSync) {
        (window as any).editorScrollSync(scrollPercentage);
      }
    });
  }, []);
  
  // Listen for editor scroll events
  useEffect(() => {
    const handleEditorScroll = (scrollPercentage: number) => {
      if (!previewRef.current || isScrollingSelf.current) return;
      
      isScrollingSelf.current = true;
      const container = previewRef.current;
      const maxScroll = container.scrollHeight - container.clientHeight;
      
      if (maxScroll > 0) {
        const targetScrollTop = maxScroll * scrollPercentage;
        container.scrollTo({
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
    (window as any).previewScrollSync = handleEditorScroll;
    
    return () => {
      delete (window as any).previewScrollSync;
    };
  }, []);
  
  return (
    <ResizablePanel defaultSize={50} minSize={30}>
      <div className="h-full w-full flex flex-col">
        <div 
          ref={previewRef}
          id="markdown-preview-content" 
          className="flex-1 overflow-auto custom-scrollbar p-4 sm:p-6 lg:p-8"
          onScroll={handleScroll}
        >
          <div className="markdown-body max-w-none prose prose-sm sm:prose lg:prose-lg">
            <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                return match ? (
                  <SyntaxHighlighter
                    // @ts-ignore - Type issues with the style property
                    style={getSyntaxHighlighterStyle()}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              br: () => <br />,
            }}
          >
            {markdown}
          </ReactMarkdown>
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
}