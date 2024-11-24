import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react";

interface MyEditorProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextEditor: React.FC<MyEditorProps> = ({
  name,
  value,
  onChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({ 
        types: ["heading", "paragraph", "bulletList", "orderedList"] 
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Underline,
      Link.configure({
        openOnClick: true,
      }),
      Image,
    ],
    content: value || `<p>Start writing your story...</p>`,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      onChange(htmlContent);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !editor) {
    return null;
  }

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Editor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Rich Text Editor</DialogTitle>
        </DialogHeader>

        <div className="editor-container">
          <div className="toolbar flex flex-wrap items-center gap-2 mb-4 p-2 border rounded-lg bg-muted">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-secondary" : ""}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-secondary" : ""}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-secondary" : ""}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={editor.isActive({ textAlign: "left" }) ? "bg-secondary" : ""}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={editor.isActive({ textAlign: "center" }) ? "bg-secondary" : ""}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={editor.isActive({ textAlign: "right" }) ? "bg-secondary" : ""}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                className={editor.isActive({ textAlign: "justify" }) ? "bg-secondary" : ""}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBulletList}
                className={editor.isActive("bulletList") ? "bg-secondary" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleOrderedList}
                className={editor.isActive("orderedList") ? "bg-secondary" : ""}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            {/* Font Controls */}
            <div className="flex items-center gap-2">
              <Select
                onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Font Family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => editor.chain().focus().setFontSize(value).run()}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12px">12px</SelectItem>
                  <SelectItem value="16px">16px</SelectItem>
                  <SelectItem value="20px">20px</SelectItem>
                  <SelectItem value="24px">24px</SelectItem>
                  <SelectItem value="32px">32px</SelectItem>
                  <SelectItem value="36px">36px</SelectItem>
                  <SelectItem value="40px">40px</SelectItem>
                  <SelectItem value="48px">48px</SelectItem>
                  <SelectItem value="56px">56px</SelectItem>
                  <SelectItem value="64px">64px</SelectItem>
                  <SelectItem value="72px">72px</SelectItem>
                  <SelectItem value="80px">80px</SelectItem>
                  <SelectItem value="88px">88px</SelectItem>
                  <SelectItem value="96px">96px</SelectItem>
                  <SelectItem value="108px">108px</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="color"
                className="w-10 h-8 p-0 border-none"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              />
            </div>

            {/* Additional Features */}
            <div className="flex items-center gap-1 border-r pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = prompt("Enter URL:");
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={editor.isActive("link") ? "bg-secondary" : ""}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = prompt("Enter image URL:");
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                  }
                }}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 min-h-[400px]">
            <EditorContent editor={editor} className="prose max-w-none" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};