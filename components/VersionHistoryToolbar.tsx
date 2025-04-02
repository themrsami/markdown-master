"use client"

import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { UndoIcon, RedoIcon, FastForwardIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function VersionHistoryToolbar() {
  const { 
    canUndo, 
    canRedo, 
    undo, 
    redo, 
    versionHistory,
    currentVersionIndex
  } = useMarkdown();

  // Function to navigate to the latest version
  const goToLatest = () => {
    // If we have a version history, go to the latest version
    if (versionHistory.length > 0 && currentVersionIndex !== versionHistory.length - 1) {
      // Instead of calling functions from context, we'll render the component with the latest version
      redo();
      // If we're not at the latest version yet, keep going forward
      if (currentVersionIndex < versionHistory.length - 2) {
        const interval = setInterval(() => {
          if (currentVersionIndex < versionHistory.length - 1) {
            redo();
          } else {
            clearInterval(interval);
          }
        }, 100);
        
        // Safety: clear interval after 2 seconds
        setTimeout(() => clearInterval(interval), 2000);
      }
    }
  };

  // Get current version info
  const currentVersion = versionHistory[currentVersionIndex];
  const formattedTime = currentVersion ? 
    format(new Date(currentVersion.timestamp), "h:mm:ss a") : "";
  const isLatestVersion = currentVersionIndex === versionHistory.length - 1;
  const hasAIPrompt = currentVersion?.aiPrompt !== undefined;
  
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex items-center bg-muted/50 rounded-lg p-1 shadow-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                className="h-8 w-8"
              >
                <UndoIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Previous Version)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                className="h-8 w-8"
              >
                <RedoIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Next Version)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToLatest}
                disabled={isLatestVersion}
                className="h-8 w-8"
              >
                <FastForwardIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Latest Version</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <span>Version {currentVersionIndex + 1}/{versionHistory.length}</span>
        {currentVersion && <span>• {formattedTime}</span>}
        {hasAIPrompt && (
          <Badge variant="outline" className="text-xs py-0 h-5">
            AI Modified
          </Badge>
        )}
        {versionHistory.length === 1 && (
          <span className="italic text-muted-foreground">
            (Use "Save Version" to create document versions)
          </span>
        )}
      </div>
    </div>
  );
}