import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import dynamic from "next/dynamic";
import axios from "axios";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Focus from "@tiptap/extension-focus";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import MediaUploader from './MediaUploader';
import Image from "@tiptap/extension-image";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Sparkles,
  Check,
  Wand2,
  MessageSquarePlus,
  PenTool,
  Highlighter,
  CheckSquare,
  BookOpen,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough,
  Underline as UnderlineIcon,
  Palette,
  Indent,
  Outdent,
  Heading1,
  Heading2,
  Code,
  Heading3,
  Quote,
  LineChart,
} from "lucide-react";

// Line height extension
const LineHeightExtension = Extension.create({
  name: "lineHeight",
  addOptions() {
    return {
      types: ["paragraph", "heading"],
      defaultLineHeight: "normal",
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: "normal",
            renderHTML: (attributes) => {
              if (!attributes.lineHeight || attributes.lineHeight === "normal") {
                return {};
              }
              return { style: `line-height: ${attributes.lineHeight}` };
            },
            parseHTML: (element) => element.style.lineHeight || "normal",
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }: { commands: any }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { lineHeight })
          );
        },
    };
  },
});

const TextBackgroundImage = Extension.create({
  name: "textBackgroundImage",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundImage: {
            default: null,
            parseHTML: (element) => {
              const bgImage = element.style.backgroundImage;
              return bgImage && bgImage !== 'none' ? bgImage : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.backgroundImage) return {};
              return {
                style: `
                  background-image: ${attributes.backgroundImage}; 
                  -webkit-background-clip: text; 
                  background-clip: text; 
                  color: transparent; 
                  background-size: cover; 
                  background-position: center; 
                  background-repeat: no-repeat; 
                  font-weight: bold;
                  -webkit-text-fill-color: transparent;
                  display: inline-block;
                `,
                class: 'text-background-image'
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setTextBackgroundImage:
        (imageUrl) =>
        ({ chain }) => {
          if (!imageUrl) {
            return chain().unsetMark("textStyle").run();
          }
          return chain()
            .setMark("textStyle", { 
              backgroundImage: `url("${imageUrl}")` 
            })
            .run();
        },
      removeTextBackgroundImage:
        () =>
        ({ chain }) => {
          return chain().unsetMark("textStyle").run();
        },
    };
  },
});

const BackgroundColor = Extension.create({
  name: "backgroundColor",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor || null,
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) return {};
              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setBackgroundColor:
        (backgroundColor) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { backgroundColor }).run();
        },
    };
  },
});

// Font size extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
    };
  },
});

// Custom underline extension with styling
const CustomUnderline = Underline.configure({
  HTMLAttributes: {
    class: "underline decoration-1",
  },
});

interface NovelEditorProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const aiCommands = {
  continue: {
    label: "Continue writing",
    prompt: "Continue writing from this point: ",
    icon: MessageSquarePlus,
  },
  improve: {
    label: "Improve writing",
    prompt: "Enhance the clarity and flow of this text: ",
    icon: Wand2,
  },
  fix: {
    label: "Fix writing",
    prompt: "Correct grammar and spelling in this text: ",
    icon: Check,
  },
  creative: {
    label: "Make creative",
    prompt: "Make this text more engaging and creative: ",
    icon: PenTool,
  },
  academic: {
    label: "Academic style",
    prompt: "Rephrase this text in a formal academic style: ",
    icon: BookOpen,
  },
} as const;

type AiCommand = keyof typeof aiCommands;

const Editor = dynamic(
  () =>
    Promise.resolve(({ editor }: { editor: any }) => (
      <EditorContent editor={editor} className="rounded-lg border p-4" />
    )),
  { ssr: false }
);

export const AiTextEditor: React.FC<NovelEditorProps> = ({
  name,
  value,
  onChange,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const applyFontSize = (size: string) => {
    editor?.chain().focus().setFontSize(size).run();
  };

  const applyBackgroundColor = (color: string) => {
    editor?.chain().focus().setBackgroundColor(color).run();
  };

  const applyColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  const applyTextAlign = (alignment: string) => {
    editor?.chain().focus().setTextAlign(alignment).run();
  };

  const applyLineHeight = (height: string) => {
    editor?.chain().focus().setLineHeight(height).run();
  };

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
      heading: {
        levels: [1, 2, 3],
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right"],
      defaultAlignment: "left",
    }),
    TextStyle,
    Typography,
    Focus.configure({
      className: "ring-2 ring-blue-500",
      mode: "all",
    }),
    Color.configure({
      types: ["textStyle"],
    }),
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: "highlight-marker",
      },
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: "task-list",
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: "task-item",
      },
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === "heading") return "What's the title?";
        return "Press '/' for commands, or start writing...";
      },
      showOnlyCurrent: true,
    }),
    CustomUnderline,
    FontSize,
    LineHeightExtension,
    BackgroundColor,
    // Add the Text Background Image extension
    TextBackgroundImage,
  ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      onChange(htmlContent);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none min-h-[200px]",
      },
    },
  });

const handleImageSelect = (imageUrl: string | null) => {
  if (!editor) return;
  console.log('Selected image URL:', imageUrl);
  
  // Check if there's selected text
  const { from, to } = editor.state.selection;
  const hasSelection = from !== to;
  
  if (!hasSelection) {
    // If no text is selected, show an alert or select some text first
    console.warn('Please select some text first to apply the background image');
    return;
  }
  
  if (imageUrl) {
    // Apply image background to selected text
    editor.chain().focus().setTextBackgroundImage(imageUrl).run();
  } else {
    // Remove image background from selected text
    editor.chain().focus().removeTextBackgroundImage().run();
  }
};


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    if (generatedText && editor && !isGenerating) {
      const currentCursor = editor.state.selection.from;
      editor.commands.insertContent(generatedText);
      editor.commands.focus(currentCursor + generatedText.length);
    }
  }, [generatedText, editor, isGenerating]);

  const getSelectedText = () => {
    if (!editor) return "";
    return editor.state.selection.empty
      ? editor.getText()
      : editor.state.doc.cut(
          editor.state.selection.from,
          editor.state.selection.to
        ).textContent;
  };

  const handleAiCommand = async (command: AiCommand) => {
    if (!editor || isGenerating) return;
    setIsGenerating(true);
    const selectedText = getSelectedText();

    if (!selectedText || selectedText.trim() === "") {
      console.warn("No text selected or empty text for AI command.");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await axios.post("/api/generate", {
        prompt: `${aiCommands[command].prompt}${selectedText.trim()}`,
      });
      if (response.data) {
        setGeneratedText(response.data.text);
      }
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    tooltip,
    disabled = false,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    tooltip: string;
    disabled?: boolean;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={`${isActive ? "bg-secondary" : ""} ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (!mounted) {
    return null;
  }

  // Add custom styles for highlight colors
  const customStyles = `
      .highlight-marker {
        background-color: #fef08a;
        border-radius: 0.25rem;
        padding: 0.1rem 0.2rem;
      }
      .task-list {
        list-style: none;
        padding-left: 0;
      }
      .task-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    `;

  return (
    <Dialog>
      <style>{customStyles}</style>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full">
          <PenTool className="h-4 w-4" />
          Write Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            CRAX AI-Powered Editor
          </DialogTitle>
        </DialogHeader>

        <div className="editor-container space-y-4">
          <div className="toolbar flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-muted">
            {/* Text Formatting Section */}
            <div className="flex items-center gap-1 border-r pr-2">
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                isActive={editor?.isActive("bold")}
                icon={Bold}
                tooltip="Bold"
                disabled={!editor?.can().chain().focus().toggleBold().run()}
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                isActive={editor?.isActive("italic")}
                icon={Italic}
                tooltip="Italic"
                disabled={!editor?.can().chain().focus().toggleItalic().run()}
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                isActive={editor?.isActive("underline")}
                icon={UnderlineIcon}
                tooltip="Underline"
                disabled={
                  !editor?.can().chain().focus().toggleUnderline().run()
                }
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                isActive={editor?.isActive("strike")}
                icon={Strikethrough}
                tooltip="Strikethrough"
                disabled={!editor?.can().chain().focus().toggleStrike().run()}
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleHighlight().run()}
                isActive={editor?.isActive("highlight")}
                icon={Highlighter}
                tooltip="Highlight"
                disabled={
                  !editor?.can().chain().focus().toggleHighlight().run()
                }
              />
            </div>

            {/* Lists Section */}
            <div className="flex items-center gap-1 border-r pr-2">
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                isActive={editor?.isActive("bulletList")}
                icon={List}
                tooltip="Bullet List"
                disabled={
                  !editor?.can().chain().focus().toggleBulletList().run()
                }
              />
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                isActive={editor?.isActive("orderedList")}
                icon={ListOrdered}
                tooltip="Numbered List"
                disabled={
                  !editor?.can().chain().focus().toggleOrderedList().run()
                }
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                isActive={editor?.isActive("taskList")}
                icon={CheckSquare}
                tooltip="Task List"
                disabled={!editor?.can().chain().focus().toggleTaskList().run()}
              />
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().sinkListItem("listItem").run()
                }
                icon={Indent}
                tooltip="Indent"
                disabled={
                  !editor?.can().chain().focus().sinkListItem("listItem").run()
                }
              />
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().liftListItem("listItem").run()
                }
                icon={Outdent}
                tooltip="Outdent"
                disabled={
                  !editor?.can().chain().focus().liftListItem("listItem").run()
                }
              />
            </div>

            {/* Headings Section */}
            <div className="flex items-center gap-1 border-r pr-2">
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
                isActive={editor?.isActive("heading", { level: 1 })}
                icon={Heading1}
                tooltip="Heading 1"
                disabled={
                  !editor
                    ?.can()
                    .chain()
                    .focus()
                    .toggleHeading({ level: 1 })
                    .run()
                }
              />
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                isActive={editor?.isActive("heading", { level: 2 })}
                icon={Heading2}
                tooltip="Heading 2"
                disabled={
                  !editor
                    ?.can()
                    .chain()
                    .focus()
                    .toggleHeading({ level: 2 })
                    .run()
                }
              />
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                isActive={editor?.isActive("heading", { level: 3 })}
                icon={Heading3}
                tooltip="Heading 3"
                disabled={
                  !editor
                    ?.can()
                    .chain()
                    .focus()
                    .toggleHeading({ level: 3 })
                    .run()
                }
              />
            </div>

            {/* Block Formatting Section */}
            <div className="flex items-center gap-1 border-r pr-2">
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                isActive={editor?.isActive("blockquote")}
                icon={Quote}
                tooltip="Quote"
                disabled={
                  !editor?.can().chain().focus().toggleBlockquote().run()
                }
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                isActive={editor?.isActive("codeBlock")}
                icon={Code}
                tooltip="Code Block"
                disabled={
                  !editor?.can().chain().focus().toggleCodeBlock().run()
                }
              />
            </div>

            {/* Alignment Section */}
            <div className="flex items-center gap-1 border-r pr-2">
              <ToolbarButton
                onClick={() => applyTextAlign("left")}
                isActive={editor?.isActive({ textAlign: "left" })}
                icon={AlignLeft}
                tooltip="Align Left"
                disabled={!editor}
              />
              <ToolbarButton
                onClick={() => applyTextAlign("center")}
                isActive={editor?.isActive({ textAlign: "center" })}
                icon={AlignCenter}
                tooltip="Align Center"
                disabled={!editor}
              />
              <ToolbarButton
                onClick={() => applyTextAlign("right")}
                isActive={editor?.isActive({ textAlign: "right" })}
                icon={AlignRight}
                tooltip="Align Right"
                disabled={!editor}
              />
            </div>

            {/* Font Size and Color Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <Select onValueChange={applyLineHeight} defaultValue="normal">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Line Height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="1.25">1.25</SelectItem>
                    <SelectItem value="1.5">1.5</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="2.5">2.5</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select onValueChange={applyFontSize} disabled={!editor}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64].map(
                    (size) => (
                      <SelectItem key={size} value={`${size}px`}>
                        {size}px
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <div className="flex gap-1 justify-center items-center">
                <Palette className="h-5 w-5" />
                <input
                  type="color"
                  onChange={(e) => applyColor(e.target.value)}
                  className="bg-transparent border-none outline-none w-8 h-8 cursor-pointer"
                  disabled={!editor}
                />
              </div>
            </div>

            <div className="flex gap-1 justify-center items-center">
              <Highlighter className="h-5 w-5" />
              <input
                type="color"
                onChange={(e) => applyBackgroundColor(e.target.value)}
                className="bg-transparent border-none outline-none w-8 h-8 cursor-pointer"
                disabled={!editor}
                title="Background Color"
              />
            </div>

            {/* Undo/Redo Section */}
            <div className="ml-auto flex items-center gap-1">
              <ToolbarButton
                onClick={() => editor?.chain().focus().undo().run()}
                icon={Undo}
                tooltip="Undo"
                disabled={!editor?.can().chain().focus().undo().run()}
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().redo().run()}
                icon={Redo}
                tooltip="Redo"
                disabled={!editor?.can().chain().focus().redo().run()}
              />
            </div>
          </div>

          {/* AI Commands Section */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(aiCommands).map(([key, { label, icon: Icon }]) => (
              <Button
                key={key}
                variant="outline"
                className="gap-2"
                onClick={() => handleAiCommand(key as AiCommand)}
                disabled={isGenerating || !editor}
              >
                <Icon className="h-4 w-4" />
                {isGenerating && key === "continue" ? "Generating..." : label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 border-t pt-2">
  <MediaUploader
    onImageSelect={handleImageSelect}
    withMediaLibrary={true}
    withUnsplash={true}
  />
</div>

          {/* Editor Content */}
          <div className="prose-container relative">
            <EditorContent
              editor={editor}
              className="rounded-lg border p-4 min-h-[300px] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
const customStyles = `
  .highlight-marker {
    background-color: #fef08a;
    border-radius: 0.25rem;
    padding: 0.1rem 0.2rem;
  }
  .task-list {
    list-style: none;
    padding-left: 0;
  }
  .task-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
    cursor: pointer;
  }
  .ProseMirror img:hover {
    opacity: 0.8;
    transition: opacity 0.2s;
  }
  .ProseMirror img.ProseMirror-selectednode {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;