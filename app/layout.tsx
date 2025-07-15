import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { fontVariables } from "@/lib/fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { MarkdownProvider } from "@/context/MarkdownContext"

export const metadata: Metadata = {
  title: "Markdown Master - Advanced Markdown Editor",
  description: "A powerful, modern markdown editor with live preview, AI assistance, and export capabilities",
  keywords: ["markdown", "editor", "preview", "export", "AI", "writing"],
  authors: [{ name: "Markdown Master Team" }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
          integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${fontVariables} h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MarkdownProvider>
            {children}
            <Toaster />
          </MarkdownProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}