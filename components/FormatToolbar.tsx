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
    <div className="flex justify-center items-center gap-2 mb-4 p-2 bg-gray-100 dark:bg-zinc-900 rounded-lg overflow-auto">
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("bold")}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("italic")}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("strikethrough")}>
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("list")}>
        <List className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("ordered-list")}>
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("quote")}>
        <Quote className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("code")}>
        <Code className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("image")}>
        <Image className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("link")}>
        <Link className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h1")}>
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h2")}>
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h3")}>
        <Heading3 className="w-4 h-4" />
      </Button>
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            😊 Emojis
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
    </div>
  );
}