import { TextEditor } from "@/components/TextEditor";
import { ComponentConfig } from "../../../packages/core";
import ColorPickerComponent from "@/components/ColorPicker";
import { AiTextEditor } from "@/components/AiTextEditor";
import { spacingOptions } from "@/config/options";
// import { CoolSpan } from "@/components/CoolSpan";

export type TextProps = {
  text: string; // JSON string representing the editor state
  paddingX: string;
  paddingY: string;
  bgColor: string;
};

export const Text: ComponentConfig<TextProps> = {
  // label: <div className="flex w-full justify-between items-center">Text <CoolSpan text="AI Powered" /></div>,
  label: 'Text',
  fields: {
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    text: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <AiTextEditor
            name={name}
            value={value}
            onChange={(updatedContent) => onChange(updatedContent)}
          />
        );
      },
    },
    paddingX: { type: "select", options: spacingOptions },
    paddingY: { type: "select", options: spacingOptions },
  },
  defaultProps: {
    text: "Text", // Default content for the editor
    bgColor: "#ffffff",
    paddingX: "0px",
    paddingY: "0px",
  },
  render: ({ text, bgColor, paddingX, paddingY }: TextProps) => {
    const safeStyles = {
      backgroundColor: bgColor || "#ffffff",
      paddingLeft: paddingX || "0",
      paddingRight: paddingX || "0", // Apply padding on both sides
      paddingTop: paddingY || "0", // Apply padding to the top
      paddingBottom: paddingY || "0", // Apply padding to the bottom
    };

    const sanitizeHtml = (html: string): string => {
      return html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
    };

    return (
      <div style={safeStyles} className="text-component">
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(text),
          }}
          className="text-content"
        />
      </div>
    );
  },
};

// Optional: Export a hook for consuming components
export const useTextComponent = (props: Partial<TextProps>) => {
  const mergedProps = {
    ...Text.defaultProps,
    ...props,
  };

  return {
    props: mergedProps,
    isValid: {
      bgColor: mergedProps.bgColor,
      paddingX: mergedProps.paddingX,
      paddingY: mergedProps.paddingY,
    },
  };
};
