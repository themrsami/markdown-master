"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette, Type, Code2, AlignJustify } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

export default function SettingsToolbar() {
  const { 
    theme, 
    setTheme, 
    fontFamily, 
    setFontFamily,
    syntaxTheme,
    setSyntaxTheme,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight
  } = useMarkdown();

  return (
    <div className="mb-6">
      <div className="p-3 border rounded-lg bg-background/50 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Theme Settings */}
          <div className="flex items-center gap-4 pr-4 border-r">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={theme} onValueChange={(value) => setTheme(value)}>
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Color Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light Theme</SelectItem>
                        <SelectItem value="dark">Dark Theme</SelectItem>
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change visual theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Typography Settings */}
          <div className="flex items-center gap-4 pr-4 border-r">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={fontFamily} onValueChange={(value) => setFontFamily(value)}>
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Font Family" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="open-sans">Open Sans</SelectItem>
                        <SelectItem value="lato">Lato</SelectItem>
                        <SelectItem value="montserrat">Montserrat</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                        <SelectItem value="raleway">Raleway</SelectItem>
                        <SelectItem value="ubuntu">Ubuntu</SelectItem>
                        <SelectItem value="merriweather">Merriweather</SelectItem>
                        <SelectItem value="playfair-display">Playfair Display</SelectItem>
                        <SelectItem value="source-sans-pro">Source Sans Pro</SelectItem>
                        <SelectItem value="oswald">Oswald</SelectItem>
                        <SelectItem value="nunito">Nunito</SelectItem>
                        <SelectItem value="roboto-slab">Roboto Slab</SelectItem>
                        <SelectItem value="roboto-mono">Roboto Mono</SelectItem>
                        <SelectItem value="lora">Lora</SelectItem>
                        <SelectItem value="fira-sans">Fira Sans</SelectItem>
                        <SelectItem value="pt-sans">PT Sans</SelectItem>
                        <SelectItem value="pt-serif">PT Serif</SelectItem>
                        <SelectItem value="arvo">Arvo</SelectItem>
                        <SelectItem value="bitter">Bitter</SelectItem>
                        <SelectItem value="crimson-text">Crimson Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change font family</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="font-size" className="text-xs text-muted-foreground">Size:</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="font-size"
                      type="number"
                      min="12"
                      max="32"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-[70px] h-9"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Font size in pixels</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="line-height" className="text-xs text-muted-foreground">Line:</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="line-height"
                      type="number"
                      min="1"
                      max="3"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(e.target.value)}
                      className="w-[70px] h-9"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Line height multiplier</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Code Settings */}
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select value={syntaxTheme} onValueChange={(value) => setSyntaxTheme(value)}>
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Code Syntax Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="dracula">Dracula</SelectItem>
                      <SelectItem value="solarizedlight">Solarized Light</SelectItem>
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Code syntax highlighting theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}