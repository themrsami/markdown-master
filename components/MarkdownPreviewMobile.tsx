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

export default function MarkdownPreviewMobile() {
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
      if ((window as any).editorScrollSyncMobile) {
        (window as any).editorScrollSyncMobile(scrollPercentage);
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
    (window as any).previewScrollSyncMobile = handleEditorScroll;
    
    return () => {
      delete (window as any).previewScrollSyncMobile;
    };
  }, []);
  
  return (
    <ResizablePanel 
      defaultSize={35} 
      minSize={25}
      className="min-h-0"
    >
      <div className="h-full w-full flex flex-col">
        <div 
          ref={previewRef}
          id="markdown-preview-content-mobile" 
          className="flex-1 h-full overflow-auto custom-scrollbar p-3 sm:p-4 touch-manipulation"
          onScroll={handleScroll}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="markdown-body max-w-none prose prose-sm">
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
