"use client"

import { useEffect, useRef } from "react"
import { useMarkdown } from "@/context/MarkdownContext"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ZapIcon, CopyIcon, ScissorsIcon, PenIcon, InfoIcon } from "lucide-react"

interface EditorContextMenuProps {
  children: React.ReactNode
  onAIAssist: () => void
}

export default function EditorContextMenu({ children, onAIAssist }: EditorContextMenuProps) {
  const { aiEnabled, selectedText } = useMarkdown()
  const hasTextSelected = selectedText.length > 0
  
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem 
          onClick={() => document.execCommand('cut')} 
          disabled={!hasTextSelected}
        >
          <ScissorsIcon className="h-4 w-4 mr-2" />
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => document.execCommand('copy')} 
          disabled={!hasTextSelected}
        >
          <CopyIcon className="h-4 w-4 mr-2" />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => document.execCommand('paste')}>
          <PenIcon className="h-4 w-4 mr-2" />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        
        {aiEnabled ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={onAIAssist} 
              disabled={!hasTextSelected}
              className={!hasTextSelected ? "text-muted-foreground" : ""}
            >
              <ZapIcon className="h-4 w-4 mr-2" />
              Enhance with AI Assistant
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem disabled className="text-muted-foreground">
              <InfoIcon className="h-4 w-4 mr-2" />
              Enable AI in settings for smart text enhancement
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}