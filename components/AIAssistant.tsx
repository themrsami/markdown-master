"use client"

import { useState, useEffect } from "react"
import { useMarkdown } from "@/context/MarkdownContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ZapIcon, Loader2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AIAssistant() {
  const { 
    aiEnabled,
    geminiApiKey, 
    setGeminiApiKey, 
    selectedText,
    selectionRange, 
    generateWithAI,
    setMarkdown,
    markdown,
    addToHistory
  } = useMarkdown()
  
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [apiKeyDialog, setApiKeyDialog] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey)

  // Filter markdown code block delimiters from a string
  const filterMarkdownCodeBlockDelimiters = (content: string): string => {
    // Remove ```markdown at beginning if present
    content = content.replace(/^```markdown\s*/m, '');
    // Remove ``` at the end if present
    content = content.replace(/\s*```\s*$/m, '');
    return content;
  }

  // Listen for custom event to open AI Assistant
  useEffect(() => {
    const handleOpenAIAssistant = () => {
      if (aiEnabled && selectedText) {
        setShowDialog(true);
      }
    };

    document.addEventListener('openAIAssistant', handleOpenAIAssistant);
    
    return () => {
      document.removeEventListener('openAIAssistant', handleOpenAIAssistant);
    };
  }, [aiEnabled, selectedText]);

  if (!aiEnabled) return null;

  const handleGenerateContent = async () => {
    if (!geminiApiKey) {
      setApiKeyDialog(true)
      return
    }

    if (!prompt.trim() || !selectionRange) return

    setIsGenerating(true)
    toast({
      title: "AI Processing",
      description: "Generating content with Gemini AI...",
    });
    
    try {
      const generatedContent = await generateWithAI(prompt)
      
      // Filter the markdown code block delimiters from the response
      const filteredContent = filterMarkdownCodeBlockDelimiters(generatedContent)
      
      // Replace the selected text with the filtered generated content
      if (selectionRange) {
        const newText = 
          markdown.substring(0, selectionRange.start) + 
          filteredContent + 
          markdown.substring(selectionRange.end)
        
        // Update markdown content
        setMarkdown(newText)
        
        // Add to version history with AI prompt information
        addToHistory(newText, prompt)
        
        toast({
          title: "AI Content Generated",
          description: `Successfully enhanced content with prompt: "${prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt}"`,
        });
      }
      
      // Reset
      setPrompt("")
      setShowDialog(false)
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating content with AI.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false)
    }
  }

  const saveApiKey = () => {
    setGeminiApiKey(tempApiKey)
    // Save API key to localStorage for persistence
    localStorage.setItem('markdown-master-api-key', tempApiKey)
    setApiKeyDialog(false)
    
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved successfully.",
    });
  }

  return (
    <>
      {/* AI Assistant Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ZapIcon className="h-5 w-5 mr-2 text-primary" />
              AI Assistant
            </DialogTitle>
            <DialogDescription>
              Enhance your selected text with Gemini AI. Enter a prompt to transform your selection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="border rounded-md bg-muted/50 p-3 text-sm">
              <strong>Selected Text:</strong>
              <p className="mt-2 whitespace-pre-wrap break-words max-h-40 overflow-auto">
                {selectedText || "No text selected"}
              </p>
            </div>
            
            <div>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt (e.g., 'Make this more formal')"
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleGenerateContent()
                  }
                }}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleGenerateContent} 
              disabled={isGenerating || !prompt.trim() || !selectedText}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ZapIcon className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* API Key Dialog */}
      <Dialog open={apiKeyDialog} onOpenChange={setApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gemini API Key Required</DialogTitle>
            <DialogDescription>
              Enter your Gemini API key to use AI features. You can get a key from the Google AI Studio.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Paste your Gemini API key here"
              className="w-full"
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Your API key is stored locally and is never sent to our servers.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveApiKey} disabled={!tempApiKey.trim()}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}