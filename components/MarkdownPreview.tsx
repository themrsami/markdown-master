"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { ResizablePanel } from "@/components/ui/resizable"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

export default function MarkdownPreview() {
  const { markdown, getSyntaxHighlighterStyle } = useMarkdown();
  
  return (
    <ResizablePanel defaultSize={50}>
      <div id="markdown-content" className="h-full overflow-auto custom-scrollbar p-8">
        <div className="markdown-body">
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
    </ResizablePanel>
  );
}