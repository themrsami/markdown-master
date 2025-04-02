"use client"

import { useMarkdown } from "@/context/MarkdownContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="flex flex-wrap gap-4 mb-4">
      <Select defaultValue={theme} onValueChange={(value) => setTheme(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Color Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={fontFamily} onValueChange={(value) => setFontFamily(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Font Family" />
        </SelectTrigger>
        <SelectContent>
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
      <Select defaultValue={syntaxTheme} onValueChange={(value) => setSyntaxTheme(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Code Syntax Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tomorrow">Tomorrow</SelectItem>
          <SelectItem value="dracula">Dracula</SelectItem>
          <SelectItem value="solarizedlight">Solarized Light</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Label htmlFor="font-size">Font Size:</Label>
        <Input
          id="font-size"
          type="number"
          min="0"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-[80px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="line-height">Line Height:</Label>
        <Input
          id="line-height"
          type="number"
          min="0"
          step="0.1"
          value={lineHeight}
          onChange={(e) => setLineHeight(e.target.value)}
          className="w-[80px]"
        />
      </div>
    </div>
  );
}