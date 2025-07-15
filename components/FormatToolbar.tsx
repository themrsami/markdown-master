"use client"

import { Button } from "@/components/ui/button"
import { useMarkdown } from "@/context/MarkdownContext"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Smile,
  Type,
  ListTree
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon, TrashIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function FormatToolbar() {
  const {
    insertMarkdown,
    tableRows,
    tableCols,
    tableContent,
    addTableRow,
    addTableColumn,
    deleteTableRow,
    deleteTableColumn,
    updateTableCell,
    copyMarkdownTable,
    insertMarkdownTable
  } = useMarkdown();

  return (
    <div className="mb-2 p-2 bg-muted/40 border rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center justify-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("bold")}>
                  <Bold className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bold</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("italic")}>
                  <Italic className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Italic</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("strikethrough")}>
                  <Strikethrough className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Strikethrough</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Lists and Quote */}
        <div className="flex items-center gap-1 px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("list")}>
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bullet List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("ordered-list")}>
                  <ListOrdered className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Numbered List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("quote")}>
                  <Quote className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Blockquote</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Headings */}
        <div className="flex items-center gap-1 px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h1")}>
                  <Heading1 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 1</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h2")}>
                  <Heading2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 2</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h3")}>
                  <Heading3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 3</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Special Elements */}
        <div className="flex items-center gap-1 px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("code")}>
                  <Code className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("image")}>
                  <Image className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => insertMarkdown("link")}>
                  <Link className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Advanced Elements */}
        <div className="flex items-center gap-1 px-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Table className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Insert Markdown Table</DialogTitle>
                      <DialogDescription>
                        Create a table by adding or removing rows and columns, then copy or insert the generated Markdown.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Button onClick={addTableRow} variant="outline">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add Row
                        </Button>
                        <Button onClick={addTableColumn} variant="outline">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add Column
                        </Button>
                      </div>
                      <div className="max-h-[300px] overflow-auto">
                        <table className="w-full">
                          <tbody>
                            {tableContent.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                  <td key={colIndex} className="p-2">
                                    <Input
                                      value={cell}
                                      onChange={(e) => updateTableCell(rowIndex, colIndex, e.target.value)}
                                      className="w-full"
                                    />
                                  </td>
                                ))}
                                <td className="p-2">
                                  <Button variant="ghost" size="sm" onClick={() => deleteTableRow(rowIndex)}>
                                    <TrashIcon className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            <tr>
                              {tableContent[0].map((_, colIndex) => (
                                <td key={colIndex} className="p-2">
                                  <Button variant="ghost" size="sm" onClick={() => deleteTableColumn(colIndex)}>
                                    <TrashIcon className="w-4 h-4" />
                                  </Button>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button onClick={copyMarkdownTable} variant="outline">
                          Copy Markdown
                        </Button>
                        <Button onClick={insertMarkdownTable}>Insert Table</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Insert Table</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Emoji</DialogTitle>
                      <DialogDescription>Click on an emoji to insert it at the cursor position.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-auto">
                      {[
                        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", 
                        "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", 
                        "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", 
                        "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", 
                        "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", 
                        "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", 
                        "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", 
                        "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", 
                        "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕"
                      ].map((emoji, index) => (
                        <Button key={index} variant="ghost" size="sm" onClick={() => insertMarkdown(`emoji-${emoji}`)}>
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Insert Emoji</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}