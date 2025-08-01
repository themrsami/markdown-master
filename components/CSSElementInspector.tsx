"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import { 
  MousePointer2, 
  X, 
  Code, 
  Palette, 
  Download,
  Copy,
  Trash2,
  Sparkles,
  Loader2,
  Info
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function CSSElementInspector() {
  const { 
    elementSelectorMode, 
    setElementSelectorMode,
    selectedElement,
    setSelectedElement,
    customCSS,
    setCustomCSS,
    generateCSSWithAI,
    aiEnabled,
    geminiApiKey
  } = useMarkdown();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAllStylesDialog, setShowAllStylesDialog] = useState(false);
  const [localCSS, setLocalCSS] = useState("");
  const [elementPath, setElementPath] = useState("");
  const [viewStylesCSS, setViewStylesCSS] = useState(""); // Local state for view styles
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingCSS, setIsGeneratingCSS] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Update local CSS when selectedElement changes
  useEffect(() => {
    if (selectedElement) {
      const tagName = selectedElement.tagName.toLowerCase();
      const className = selectedElement.className;
      const id = selectedElement.id;
      
      // Generate more specific CSS selector for higher specificity
      let selector = `#markdown-preview-content .markdown-body ${tagName}`;
      
      if (id) {
        selector = `#markdown-preview-content .markdown-body #${id}`;
      } else if (className && typeof className === 'string' && className.trim()) {
        const classes = className.split(' ').filter(c => c.trim() && !c.includes('css-inspector'));
        if (classes.length > 0) {
          selector = `#markdown-preview-content .markdown-body ${tagName}.${classes.join('.')}`;
        }
      }
      
      // Add nth-child if needed for more specificity
      const parent = selectedElement.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(el => el.tagName === selectedElement.tagName);
        if (siblings.length > 1) {
          const index = siblings.indexOf(selectedElement) + 1;
          selector += `:nth-of-type(${index})`;
        }
      }
      
      // Generate element path for display
      const path = getElementPath(selectedElement);
      setElementPath(path);
      
      // Get existing styles for this element
      const existingProperties = getCurrentElementStyles(selectedElement, selector);
      
      // Generate default CSS template with high specificity
      let defaultCSS = '';
      
      if (existingProperties.trim()) {
        // If there are existing styles, show them for editing
        defaultCSS = `/* Existing styles for this element - Edit to update */\n${selector} {\n  ${existingProperties}\n}`;
      } else {
        // If no existing styles, show template
        defaultCSS = `/* Custom styles for selected element */\n${selector} {\n  /* Add your custom styles here */\n  /* Examples: */\n  /* color: #333 !important; */\n  /* background-color: #f5f5f5 !important; */\n  /* padding: 1rem !important; */\n  /* border-radius: 0.5rem !important; */\n  /* border: 2px solid #007acc !important; */\n}`;
      }
      
      setLocalCSS(defaultCSS);
      setIsDialogOpen(true);
    }
  }, [selectedElement, customCSS]);

  // Sync view styles CSS when dialog opens
  useEffect(() => {
    if (showAllStylesDialog) {
      setViewStylesCSS(customCSS);
      setHasUnsavedChanges(false);
    }
  }, [showAllStylesDialog, customCSS]);

  // Debounced CSS update function
  const debouncedCSSUpdate = useCallback((newCSS: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setCustomCSS(newCSS);
      // Apply changes to DOM
      const styleElement = document.getElementById('custom-markdown-styles');
      if (styleElement) {
        styleElement.textContent = newCSS;
      }
      setHasUnsavedChanges(false);
    }, 500); // 500ms debounce
  }, [setCustomCSS]);

  // Handle view styles CSS change
  const handleViewStylesChange = (newCSS: string) => {
    setViewStylesCSS(newCSS);
    setHasUnsavedChanges(true);
    debouncedCSSUpdate(newCSS);
  };

  // Handle view styles dialog close
  const handleViewStylesClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setShowAllStylesDialog(false);
    }
  };

  // Save changes and close
  const handleSaveAndClose = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    setCustomCSS(viewStylesCSS);
    const styleElement = document.getElementById('custom-markdown-styles');
    if (styleElement) {
      styleElement.textContent = viewStylesCSS;
    }
    
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    setShowAllStylesDialog(false);
    
    toast({
      title: "Changes Saved",
      description: "Your CSS changes have been saved.",
    });
  };

  // Discard changes and close
  const handleDiscardAndClose = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    setViewStylesCSS(customCSS); // Reset to original
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    setShowAllStylesDialog(false);
  };

  // Cleanup debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Clean up when selector mode is disabled
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

  // Function removed - using getCurrentElementStyles instead

  // Generate element path for display
  const getElementPath = (element: Element): string => {
    const path = [];
    let current = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector = `#${current.id}`;
        path.unshift(selector);
        break;
      } else if (current.className && typeof current.className === 'string') {
        const classes = current.className.split(' ').filter((c: string) => c.trim());
        if (classes.length > 0) {
          selector += `.${classes.join('.')}`;
        }
      }
      
      path.unshift(selector);
      current = current.parentElement as Element;
      
      // Limit path length for readability
      if (path.length > 4) break;
    }
    
    return path.join(' > ');
  };

  // Helper function to get current styles for the selected element
  const getCurrentElementStyles = (element: Element, selector: string): string => {
    if (!customCSS) return '';
    
    // Look for existing CSS block with this selector
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(\\/\\*[^*]*\\*\\/\\s*)?${escapedSelector}\\s*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}`,
      'gm'
    );
    
    const match = regex.exec(customCSS);
    if (match && match[2]) {
      // Extract just the CSS properties, clean them up
      const properties = match[2]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('/*') && !line.endsWith('*/'))
        .join('\n  ');
      
      return properties;
    }
    
    return '';
  };

  const handleToggleSelector = () => {
    const newMode = !elementSelectorMode;
    setElementSelectorMode(newMode);
    
    if (!newMode) {
      // Exiting selector mode - clean up all highlights and selections
      document.querySelectorAll('.css-inspector-selected').forEach(el => {
        el.classList.remove('css-inspector-selected');
      });
      document.querySelectorAll('.css-inspector-hover').forEach(el => {
        el.classList.remove('css-inspector-hover');
      });
      setSelectedElement(null);
      
      toast({
        title: "Element Selector Disabled",
        description: "Normal preview mode restored.",
      });
    } else {
      toast({
        title: "Element Selector Active",
        description: "Click on any element in the preview to inspect and style it.",
      });
    }
  };

  const handleApplyCSS = () => {
    // Update the context state
    const currentSelector = extractSelectorFromCSS(localCSS);
    
    // Apply CSS to the document immediately
    let styleElement = document.getElementById('custom-markdown-styles') as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-markdown-styles';
      document.head.appendChild(styleElement);
    }
    
    // Get existing CSS and check if this selector already exists
    const existingCSS = styleElement.textContent || '';
    let newCSS;
    
    if (currentSelector && existingCSS.includes(currentSelector)) {
      // Replace existing CSS block for this selector
      newCSS = replaceExistingCSSBlock(existingCSS, localCSS, currentSelector);
    } else {
      // Add new CSS block
      newCSS = existingCSS + '\n\n' + localCSS;
    }
    
    styleElement.textContent = newCSS;
    
    // Store the updated CSS
    setCustomCSS(newCSS);
    
    // Clean up selection highlights
    document.querySelectorAll('.css-inspector-selected').forEach(el => {
      el.classList.remove('css-inspector-selected');
    });
    document.querySelectorAll('.css-inspector-hover').forEach(el => {
      el.classList.remove('css-inspector-hover');
    });
    
    // Auto-exit selector mode
    setElementSelectorMode(false);
    setSelectedElement(null);
    
    toast({
      title: "CSS Applied",
      description: "Your custom styles have been applied and selector mode disabled.",
    });
    
    setIsDialogOpen(false);
  };

  // Helper function to extract selector from CSS
  const extractSelectorFromCSS = (css: string): string | null => {
    const match = css.match(/^\/\*[^*]*\*\/\s*([^{]+)\s*{/m);
    return match ? match[1].trim() : null;
  };

  // Helper function to replace existing CSS block
  const replaceExistingCSSBlock = (existingCSS: string, newCSS: string, selector: string): string => {
    // Create a regex to match the existing CSS block for this selector
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(\\/\\*[^*]*\\*\\/\\s*)?${escapedSelector}\\s*\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}`,
      'gm'
    );
    
    // Replace the existing block with the new one
    return existingCSS.replace(regex, newCSS);
  };

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(localCSS);
    toast({
      title: "CSS Copied",
      description: "CSS has been copied to your clipboard.",
    });
  };

  const handleDownloadCSS = () => {
    const cssToDownload = showAllStylesDialog ? viewStylesCSS : localCSS;
    const blob = new Blob([cssToDownload], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-markdown-styles.css';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "CSS Downloaded",
      description: "CSS file has been downloaded.",
    });
  };

  const handleClearCSS = () => {
    if (!selectedElement) {
      // If no element is selected, clear all CSS (fallback behavior)
      setLocalCSS("");
      setCustomCSS("");
      
      // Remove CSS from document
      const styleElement = document.getElementById('custom-markdown-styles');
      if (styleElement) {
        styleElement.remove();
      }
    } else {
      // Generate the exact selector for the selected element
      const tagName = selectedElement.tagName.toLowerCase();
      let exactSelector = `#markdown-preview-content .markdown-body ${tagName}`;
      
      if (selectedElement.id) {
        exactSelector = `#markdown-preview-content .markdown-body #${selectedElement.id}`;
      } else if (Array.from(selectedElement.classList).filter(cls => !cls.startsWith('css-inspector')).length > 0) {
        const cleanClasses = Array.from(selectedElement.classList).filter(cls => !cls.startsWith('css-inspector'));
        exactSelector = `#markdown-preview-content .markdown-body ${tagName}.${cleanClasses.join('.')}`;
      } else {
        const parent = selectedElement.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(el => el.tagName === selectedElement.tagName);
          const index = siblings.indexOf(selectedElement) + 1;
          exactSelector += `:nth-of-type(${index})`;
        }
      }
      
      // Remove only the CSS block for this specific element
      if (customCSS) {
        // Create regex to match the specific CSS block for this selector
        const escapedSelector = exactSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const blockRegex = new RegExp(
          `(\\/\\*[^*]*\\*\\/\\s*)?${escapedSelector}\\s*\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}\\s*`,
          'gm'
        );
        
        const updatedCSS = customCSS.replace(blockRegex, '').trim();
        setCustomCSS(updatedCSS);
        
        // Clear the local CSS editor
        setLocalCSS("");
        
        toast({
          title: "Element Styles Cleared",
          description: `Removed custom styles for the selected ${tagName} element.`,
        });
      }
    }
    
    // Clean up selection highlights
    document.querySelectorAll('.css-inspector-selected').forEach(el => {
      el.classList.remove('css-inspector-selected');
    });
    document.querySelectorAll('.css-inspector-hover').forEach(el => {
      el.classList.remove('css-inspector-hover');
    });
    
    // Exit selector mode
    setElementSelectorMode(false);
    setSelectedElement(null);
    
    toast({
      title: "CSS Cleared",
      description: "All custom styles have been removed and selector mode disabled.",
    });
  };

  const handleGenerateWithAI = async () => {
    if (!selectedElement || !aiPrompt.trim()) return;
    
    setIsGeneratingCSS(true);
    
    try {
      // Get element information for the AI
      const tagName = selectedElement.tagName.toLowerCase();
      const id = selectedElement.id ? `#${selectedElement.id}` : '';
      const classes = Array.from(selectedElement.classList).filter(cls => 
        !cls.startsWith('css-inspector')
      ).join(', ');
      const textContent = selectedElement.textContent?.slice(0, 100) || '';
      
      // Generate the exact same selector that will be used
      let exactSelector = `#markdown-preview-content .markdown-body ${tagName}`;
      
      if (selectedElement.id) {
        exactSelector = `#markdown-preview-content .markdown-body #${selectedElement.id}`;
      } else if (Array.from(selectedElement.classList).filter(cls => !cls.startsWith('css-inspector')).length > 0) {
        const cleanClasses = Array.from(selectedElement.classList).filter(cls => !cls.startsWith('css-inspector'));
        exactSelector = `#markdown-preview-content .markdown-body ${tagName}.${cleanClasses.join('.')}`;
      } else {
        const parent = selectedElement.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(el => el.tagName === selectedElement.tagName);
          const index = siblings.indexOf(selectedElement) + 1;
          exactSelector += `:nth-of-type(${index})`;
        }
      }

      const elementInfo = `Target Element: ${tagName}${id}
Exact CSS Selector: ${exactSelector}
Classes: ${classes || 'none'}
Text content: "${textContent}${textContent.length >= 100 ? '...' : ''}"
Current styles: You are styling this specific element only, not all ${tagName} elements`;

      const generatedCSS = await generateCSSWithAI(aiPrompt, elementInfo);
      
      if (generatedCSS && !generatedCSS.startsWith('Error:') && !generatedCSS.includes('/* Error')) {
        // Use the exact selector we calculated above
        const cleanCSS = generatedCSS.trim();
        
        const newCSSBlock = `/* AI Generated: ${aiPrompt} */
${exactSelector} {
  ${cleanCSS}
}`;

        setLocalCSS(newCSSBlock);
        
        toast({
          title: "AI CSS Generated",
          description: "CSS styles have been generated based on your prompt.",
        });
      } else {
        toast({
          title: "AI Generation Failed",
          description: generatedCSS.startsWith('Error:') ? generatedCSS : "Failed to generate CSS. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "AI Generation Error",
        description: "An error occurred while generating CSS. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingCSS(false);
      setAiPrompt("");
      setShowAIDialog(false);
    }
  };

  return (
    <>
      {/* Element Selector Toggle Button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleToggleSelector}
          variant={elementSelectorMode ? "default" : "outline"}
          size="sm"
          className={`gap-2 ${elementSelectorMode ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <MousePointer2 className="h-4 w-4" />
          {elementSelectorMode ? "Exit Selector" : "Element Selector"}
        </Button>
        
        {customCSS && (
          <Button
            onClick={() => setShowAllStylesDialog(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Code className="h-4 w-4" />
            View Styles
          </Button>
        )}
      </div>

      {/* CSS Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              CSS Element Inspector
            </DialogTitle>
            <DialogDescription>
              Customize the styling for the selected element
            </DialogDescription>
          </DialogHeader>

          {selectedElement && (
            <div className="space-y-4">
              {/* Element Info */}
              <div className="space-y-2">
                <h4 className="font-medium">Selected Element:</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {selectedElement.tagName.toLowerCase()}
                  </Badge>
                  {selectedElement.id && (
                    <Badge variant="outline">
                      #{selectedElement.id}
                    </Badge>
                  )}
                  {selectedElement.className && typeof selectedElement.className === 'string' && (
                    <Badge variant="outline">
                      .{selectedElement.className.split(' ').filter(c => c.trim()).join('.')}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {elementPath}
                </p>
              </div>

              <Separator />

              {/* CSS Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Custom CSS:</h4>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyCSS}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                    {aiEnabled && geminiApiKey && (
                      <Button
                        onClick={() => setShowAIDialog(true)}
                        variant="outline"
                        size="sm"
                        className="gap-1 text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300"
                      >
                        <Sparkles className="h-3 w-3" />
                        AI Generate
                      </Button>
                    )}
                    <Button
                      onClick={handleDownloadCSS}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                    <Button
                      onClick={handleClearCSS}
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                </div>
                
                {/* AI Tip when not enabled */}
                {(!aiEnabled || !geminiApiKey) && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Tip:</strong> Enable AI Assistant in settings for intelligent CSS generation. 
                      Simply describe how you want to style your element and let AI generate the CSS for you!
                    </AlertDescription>
                  </Alert>
                )}
                
                <Textarea
                  value={localCSS}
                  onChange={(e) => setLocalCSS(e.target.value)}
                  className="font-mono text-sm min-h-[300px]"
                  placeholder="Enter your custom CSS here..."
                />
              </div>

              {/* Element Content Preview */}
              {selectedElement.textContent && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Element Content:</h4>
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded max-h-20 overflow-y-auto">
                      {selectedElement.textContent.trim().slice(0, 200)}
                      {selectedElement.textContent.trim().length > 200 && '...'}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApplyCSS} className="gap-2">
              <Palette className="h-4 w-4" />
              Apply Styles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View All Applied Styles Dialog */}
      <Dialog open={showAllStylesDialog} onOpenChange={(open) => {
        if (!open) {
          handleViewStylesClose();
        } else {
          setShowAllStylesDialog(open);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              All Applied Custom Styles
              {hasUnsavedChanges && (
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  Unsaved Changes
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              View and manage all custom CSS that has been applied to the preview
              {hasUnsavedChanges && " • Changes are auto-saved after 500ms"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* All CSS Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Applied CSS:</h4>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigator.clipboard.writeText(viewStylesCSS)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy All
                  </Button>
                  <Button
                    onClick={handleDownloadCSS}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <Button
                    onClick={handleClearCSS}
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear All
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={viewStylesCSS}
                onChange={(e) => handleViewStylesChange(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
                placeholder="No custom styles applied yet..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleViewStylesClose}
            >
              {hasUnsavedChanges ? "Close" : "Close"}
            </Button>
            {hasUnsavedChanges && (
              <Button 
                onClick={handleSaveAndClose}
                className="gap-2"
              >
                <Palette className="h-4 w-4" />
                Save & Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes in your CSS. What would you like to do?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleDiscardAndClose}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Discard Changes
            </Button>
            <Button 
              onClick={handleSaveAndClose}
              className="gap-2"
            >
              <Palette className="h-4 w-4" />
              Save & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI CSS Generation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI CSS Generator
            </DialogTitle>
            <DialogDescription>
              Describe how you want to style the selected element and AI will generate the CSS for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedElement && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Selected Element:</h4>
                <div className="flex flex-wrap items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {selectedElement.tagName.toLowerCase()}
                  </Badge>
                  {selectedElement.id && (
                    <Badge variant="outline" className="text-xs">
                      #{selectedElement.id}
                    </Badge>
                  )}
                  {selectedElement.className && typeof selectedElement.className === 'string' && (
                    <Badge variant="outline" className="text-xs">
                      .{selectedElement.className.split(' ').filter(c => c.trim()).slice(0, 2).join('.')}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Style Description:</label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Make it have a blue background with white text and rounded corners..."
                className="min-h-[100px] text-sm"
                disabled={isGeneratingCSS}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAIDialog(false);
                setAiPrompt("");
              }}
              disabled={isGeneratingCSS}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateWithAI}
              disabled={isGeneratingCSS || !aiPrompt.trim()}
              className="gap-2"
            >
              {isGeneratingCSS ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate CSS
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
