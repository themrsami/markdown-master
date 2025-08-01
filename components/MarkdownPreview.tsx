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
import CSSElementInspector from "./CSSElementInspector"

export default function MarkdownPreview() {
  const { 
    markdown, 
    getSyntaxHighlighterStyle,
    elementSelectorMode,
    setSelectedElement,
    customCSS
  } = useMarkdown();
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingSelf = useRef<boolean>(false);
  const lastScrollTop = useRef<number>(0);
  
  // Clean up highlights when selector mode is disabled
  useEffect(() => {
    if (!elementSelectorMode) {
      // Clean up all highlights when selector mode is disabled
      document.querySelectorAll('.css-inspector-selected').forEach(el => {
        el.classList.remove('css-inspector-selected');
      });
      document.querySelectorAll('.css-inspector-hover').forEach(el => {
        el.classList.remove('css-inspector-hover');
      });
    }
  }, [elementSelectorMode]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      document.querySelectorAll('.css-inspector-selected').forEach(el => {
        el.classList.remove('css-inspector-selected');
      });
      document.querySelectorAll('.css-inspector-hover').forEach(el => {
        el.classList.remove('css-inspector-hover');
      });
    };
  }, []);
  
  // Handle element selection
  const handleElementClick = useCallback((e: React.MouseEvent) => {
    if (elementSelectorMode) {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as Element;
      
      // Skip if clicking on the container itself
      if (target === previewRef.current) return;
      
      // Find the closest meaningful element (not just text nodes or small elements)
      let selectedEl = target;
      if (target.tagName === 'SPAN' && target.parentElement) {
        selectedEl = target.parentElement;
      }
      
      // Add visual feedback
      document.querySelectorAll('.css-inspector-selected').forEach(el => {
        el.classList.remove('css-inspector-selected');
      });
      
      selectedEl.classList.add('css-inspector-selected');
      setSelectedElement(selectedEl);
    }
  }, [elementSelectorMode, setSelectedElement]);
  
  // Handle element hover in selector mode
  const handleElementHover = useCallback((e: React.MouseEvent) => {
    if (elementSelectorMode) {
      const target = e.target as Element;
      
      // Remove previous hover highlights
      document.querySelectorAll('.css-inspector-hover').forEach(el => {
        el.classList.remove('css-inspector-hover');
      });
      
      // Skip if hovering the container itself
      if (target === previewRef.current) return;
      
      // Find the closest meaningful element
      let hoveredEl = target;
      if (target.tagName === 'SPAN' && target.parentElement) {
        hoveredEl = target.parentElement;
      }
      
      hoveredEl.classList.add('css-inspector-hover');
    }
  }, [elementSelectorMode]);
  
  const handleElementLeave = useCallback(() => {
    if (elementSelectorMode) {
      document.querySelectorAll('.css-inspector-hover').forEach(el => {
        el.classList.remove('css-inspector-hover');
      });
    }
  }, [elementSelectorMode]);
  
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
    <ResizablePanel 
      defaultSize={50} 
      minSize={20}
      className="lg:min-h-0 min-h-[35vh]"
    >
      <div className="h-full w-full flex flex-col">
        {/* CSS Element Inspector Toolbar */}
        <div className="flex items-center justify-between p-2 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <CSSElementInspector />
            {elementSelectorMode && (
              <span className="text-xs text-muted-foreground">
                Click on any element to inspect and style it
              </span>
            )}
          </div>
        </div>
        
        <div 
          ref={previewRef}
          id="markdown-preview-content" 
          className={`flex-1 overflow-auto custom-scrollbar p-3 sm:p-4 lg:p-6 touch-manipulation ${
            elementSelectorMode ? 'css-selector-active' : ''
          }`}
          onScroll={handleScroll}
          onClick={handleElementClick}
          onMouseOver={handleElementHover}
          onMouseLeave={handleElementLeave}
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            cursor: elementSelectorMode ? 'crosshair' : 'default'
          }}
        >
          <div className="markdown-body markdown-body-preview max-w-none prose prose-sm sm:prose-base lg:prose-lg">
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