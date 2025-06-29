import React, { useEffect, useState, useCallback } from "react";
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
import MediaUploader from "./MediaUploader";
import Image from "@tiptap/extension-image";
import { useBrand } from "@/packages/core/components/Puck/components/BrandSidebar";

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
  RefreshCw,
  Type,
  Image as ImageIcon,
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
              if (
                !attributes.lineHeight ||
                attributes.lineHeight === "normal"
              ) {
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
              return bgImage && bgImage !== "none" ? bgImage : null;
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
                class: "text-background-image",
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
              backgroundImage: `url("${imageUrl}")`,
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

// Font Family extension
const FontFamily = Extension.create({
  name: "fontFamily",
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
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily || null,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              return { style: `font-family: ${attributes.fontFamily}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontFamily:
        (fontFamily) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontFamily }).run();
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
  type?: "heading" | "body";
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
      <EditorContent editor={editor} />
    )),
  { ssr: false }
);

export const AiTextEditor: React.FC<NovelEditorProps> = ({
  name,
  value,
  onChange,
  type = "heading",
}) => {
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>("");
  const [currentBgColor, setCurrentBgColor] = useState<string>("");
  const [currentFont, setCurrentFont] = useState<string>("");
  const [currentFontSize, setCurrentFontSize] = useState<string>("");
  const [currentLineHeight, setCurrentLineHeight] = useState<string>("normal");

  const { getColor, getFont } = useBrand();

  // Get brand defaults based on type
  const brandColor =
    type === "heading" ? getColor("primary") : getColor("secondary");
  const brandFont = type === "heading" ? getFont("heading") : getFont("body");
  const brandBgColor = getColor("background");
  const defaultFontSize = type === "heading" ? "24px" : "16px";

  // Font options
  const fontOptions = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Helvetica, sans-serif", label: "Helvetica" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Roboto, sans-serif", label: "Roboto" },
    { value: "Open Sans, sans-serif", label: "Open Sans" },
    { value: "Lato, sans-serif", label: "Lato" },
    { value: "Montserrat, sans-serif", label: "Montserrat" },
    { value: "Poppins, sans-serif", label: "Poppins" },
    { value: "Inter, sans-serif", label: "Inter" },
  ];

  const fontSizeOptions = [
    { value: "12px", label: "12px" },
    { value: "14px", label: "14px" },
    { value: "16px", label: "16px" },
    { value: "18px", label: "18px" },
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px" },
    { value: "28px", label: "28px" },
    { value: "32px", label: "32px" },
    { value: "36px", label: "36px" },
    { value: "48px", label: "48px" },
  ];

  const lineHeightOptions = [
    { value: "1", label: "1" },
    { value: "1.2", label: "1.2" },
    { value: "1.4", label: "1.4" },
    { value: "1.6", label: "1.6" },
    { value: "1.8", label: "1.8" },
    { value: "2", label: "2" },
    { value: "normal", label: "Normal" },
  ];

  const applyFontSize = (size: string) => {
    editor?.chain().focus().setFontSize(size).run();
    setCurrentFontSize(size);
  };

  const applyFontFamily = (family: string) => {
    editor?.chain().focus().setFontFamily(family).run();
    setCurrentFont(family);
  };

  const applyBackgroundColor = (color: string) => {
    editor?.chain().focus().setBackgroundColor(color).run();
    setCurrentBgColor(color);
  };

  const applyColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setCurrentColor(color);
  };

  const applyTextAlign = (alignment: string) => {
    editor?.chain().focus().setTextAlign(alignment).run();
  };

  const applyLineHeight = (height: string) => {
    editor?.chain().focus().setLineHeight(height).run();
    setCurrentLineHeight(height);
  };

  // Function to apply brand defaults to new content
  const applyBrandDefaults = useCallback(() => {
    if (!editor || !brandColor || !brandFont) return;

    // Apply defaults to the entire document if it's empty or has no styling
    const content = editor.getHTML();
    const isEmpty = content === "<p></p>" || content === "";

    if (isEmpty || !isInitialized) {
      editor
        .chain()
        .focus()
        .selectAll()
        .setMark("textStyle", {
          color: brandColor,
          fontFamily: brandFont,
          fontSize: defaultFontSize,
        })
        .run();

      // Update current states
      setCurrentColor(brandColor);
      setCurrentFont(brandFont);
      setCurrentFontSize(defaultFontSize);
      setIsInitialized(true);
    }
  }, [brandColor, brandFont, defaultFontSize, isInitialized]);

  // Function to reset to brand defaults
  const resetToBrandDefaults = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (hasSelection) {
      // Apply to selection
      editor
        .chain()
        .focus()
        .setMark("textStyle", {
          color: brandColor,
          fontFamily: brandFont,
          fontSize: defaultFontSize,
        })
        .run();
    } else {
      // Apply to all content
      editor
        .chain()
        .focus()
        .selectAll()
        .setMark("textStyle", {
          color: brandColor,
          fontFamily: brandFont,
          fontSize: defaultFontSize,
        })
        .selectTextblockEnd()
        .run();
    }

    // Update current states
    setCurrentColor(brandColor);
    setCurrentFont(brandFont);
    setCurrentFontSize(defaultFontSize);
  };

  // Update current formatting states based on selection
  const updateCurrentStates = useCallback(() => {
    if (!editor) return;

    const { selection } = editor.state;
    const { from, to } = selection;

    // Get attributes at current position
    const attrs = editor.getAttributes("textStyle");

    setCurrentColor(attrs.color || brandColor);
    setCurrentFont(attrs.fontFamily || brandFont);
    setCurrentFontSize(attrs.fontSize || defaultFontSize);
    setCurrentBgColor(attrs.backgroundColor || "");

    // Get line height from paragraph or heading
    const lineHeight =
      editor.getAttributes("paragraph").lineHeight ||
      editor.getAttributes("heading").lineHeight ||
      "normal";
    setCurrentLineHeight(lineHeight);
  }, [brandColor, brandFont, defaultFontSize]);

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
      FontFamily,
      LineHeightExtension,
      BackgroundColor,
      TextBackgroundImage,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      onChange(htmlContent);
    },
    onCreate: ({ editor }) => {
      // Apply brand defaults when editor is created
      setTimeout(() => {
        applyBrandDefaults();
        updateCurrentStates();
      }, 100);
    },
    onSelectionUpdate: ({ editor }) => {
      updateCurrentStates();
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none min-h-[200px] rounded-lg border p-4",
        style: `color: ${brandColor}; font-family: ${brandFont}; background: ${brandBgColor}; font-size: ${defaultFontSize};`,
      },
    },
  });

  const handleImageSelect = (imageUrl: string | null) => {
    if (!editor) return;
    console.log("Selected image URL:", imageUrl);

    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (!hasSelection) {
      console.warn(
        "Please select some text first to apply the background image"
      );
      return;
    }

    if (imageUrl) {
      editor.chain().focus().setTextBackgroundImage(imageUrl).run();
    } else {
      editor.chain().focus().removeTextBackgroundImage().run();
    }
  };

  const insertImage = (imageUrl: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
      // Reapply brand defaults after setting content
      setTimeout(() => {
        applyBrandDefaults();
        updateCurrentStates();
      }, 100);
    }
  }, [value, editor, applyBrandDefaults, updateCurrentStates]);

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
    variant = "ghost",
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    tooltip: string;
    disabled?: boolean;
    variant?: "ghost" | "outline" | "default";
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
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

  if (!mounted) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="px-4 py-2">
          ✍️ Open Editor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl overflow-y-auto bg-white rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle>Crax AI Text Editor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
            {/* Formatting Controls */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                isActive={editor?.isActive("bold")}
                icon={Bold}
                tooltip="Bold"
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                isActive={editor?.isActive("italic")}
                icon={Italic}
                tooltip="Italic"
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                isActive={editor?.isActive("underline")}
                icon={UnderlineIcon}
                tooltip="Underline"
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                isActive={editor?.isActive("strike")}
                icon={Strikethrough}
                tooltip="Strikethrough"
              />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Headings */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
                isActive={editor?.isActive("heading", { level: 1 })}
                icon={Heading1}
                tooltip="Heading 1"
              />
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                isActive={editor?.isActive("heading", { level: 2 })}
                icon={Heading2}
                tooltip="Heading 2"
              />
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                isActive={editor?.isActive("heading", { level: 3 })}
                icon={Heading3}
                tooltip="Heading 3"
              />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Alignment */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => applyTextAlign("left")}
                isActive={editor?.isActive({ textAlign: "left" })}
                icon={AlignLeft}
                tooltip="Align Left"
              />
              <ToolbarButton
                onClick={() => applyTextAlign("center")}
                isActive={editor?.isActive({ textAlign: "center" })}
                icon={AlignCenter}
                tooltip="Align Center"
              />
              <ToolbarButton
                onClick={() => applyTextAlign("right")}
                isActive={editor?.isActive({ textAlign: "right" })}
                icon={AlignRight}
                tooltip="Align Right"
              />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Lists */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                isActive={editor?.isActive("bulletList")}
                icon={List}
                tooltip="Bullet List"
              />
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                isActive={editor?.isActive("orderedList")}
                icon={ListOrdered}
                tooltip="Numbered List"
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                isActive={editor?.isActive("taskList")}
                icon={CheckSquare}
                tooltip="Task List"
              />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Other Formatting */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                isActive={editor?.isActive("blockquote")}
                icon={Quote}
                tooltip="Quote"
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCode().run()}
                isActive={editor?.isActive("code")}
                icon={Code}
                tooltip="Inline Code"
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleHighlight().run()}
                isActive={editor?.isActive("highlight")}
                icon={Highlighter}
                tooltip="Highlight"
              />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Undo/Redo */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor?.chain().focus().undo().run()}
                icon={Undo}
                tooltip="Undo"
                disabled={!editor?.can().undo()}
              />
              <ToolbarButton
                onClick={() => editor?.chain().focus().redo().run()}
                icon={Redo}
                tooltip="Redo"
                disabled={!editor?.can().redo()}
              />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Reset to Brand Defaults */}
            <ToolbarButton
              onClick={resetToBrandDefaults}
              icon={RefreshCw}
              tooltip="Reset to Brand Defaults"
              variant="outline"
            />
          </div>

          {/* Advanced Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 border rounded-lg bg-gray-50">
            {/* Font Family */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Font Family</label>
              <Select value={currentFont} onValueChange={applyFontFamily}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={brandFont}>Brand Default</SelectItem>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Font Size</label>
              <Select value={currentFontSize} onValueChange={applyFontSize}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={defaultFontSize}>Brand Default </SelectItem>
                  {fontSizeOptions.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Line Height */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Line Height</label>
              <Select value={currentLineHeight} onValueChange={applyLineHeight}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Line Height" />
                </SelectTrigger>
                <SelectContent>
                  {lineHeightOptions.map((height) => (
                    <SelectItem key={height.value} value={height.value}>
                      {height.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Text Color */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => applyColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyColor(brandColor)}
                  className="text-xs px-2 h-8"
                >
                  Brand
                </Button>
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentBgColor}
                  onChange={(e) => applyBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyBackgroundColor("")}
                  className="text-xs px-2 h-8"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Image Background for Text */}
            <div className="space-y-1 flex flex-col">
              <label className="text-sm font-medium">Text Image</label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <ImageIcon className="h-4 w-4 mx-1" />
                    Insert Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Apply Image Background to Text</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select text first, then choose an image to apply as
                      background
                    </p>
                    <MediaUploader
                      onImageSelect={handleImageSelect}
                      accept="image/*"
                      maxFileSize={5 * 1024 * 1024} // 5MB
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Insert Image */}
            <div className="space-y-1 flex flex-col">
              <label className="text-sm font-medium">Insert Image</label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <ImageIcon className="h-4 w-4 mx-1" />
                    Insert Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <MediaUploader
                      onImageSelect={(url) => url && insertImage(url)}
                      accept="image/*"
                      maxFileSize={5 * 1024 * 1024} // 5MB
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* AI Commands */}
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
              <Sparkles className="h-4 w-4" />
              AI Assistant:
            </div>
            {Object.entries(aiCommands).map(([key, command]) => {
              const Icon = command.icon;
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiCommand(key as AiCommand)}
                  disabled={isGenerating}
                  className="bg-white/80 hover:bg-white border-purple-200 hover:border-purple-300"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4 mr-1" />
                  )}
                  {command.label}
                </Button>
              );
            })}
          </div>

          {/* Editor */}
          <div className="border rounded-lg overflow-hidden">
            <Editor editor={editor} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
