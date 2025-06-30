import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextEditor } from "@/components/TextEditor";
import { ComponentConfig } from "../../../../packages/core";
import ColorPickerComponent from "@/components/ColorPicker";
import { AiTextEditor } from "@/components/AiTextEditor";
import { spacingOptions } from "@/config/options";
import MotionAdjustor from "@/components/MotionAdjustor";
import {
  getResponsiveSpacingStyles,
  getResponsiveTypographyStyles,
} from "@/lib/responsiveSpacing";
import { useBrand } from "@/packages/core/components/Puck/components/BrandSidebar";

interface AnimationConfig {
  type: string;
  duration: number;
  ease: string;
  delay: number;
  repeat: number;
  bounce: number;
  damping: number;
  stiffness: number;
  mass: number;
  velocity: number;
  useSpring: boolean;
}

export type Heading2Props = {
  text: string;
  paddingX: string;
  paddingY: string;
  bgColor: string;
  animation?: Partial<AnimationConfig>;
  type?: "heading" | "body"; // Add type prop
};

const defaultAnimation: AnimationConfig = {
  type: "fade",
  duration: 0.5,
  ease: "easeOut",
  delay: 0,
  repeat: 0,
  bounce: 0.25,
  damping: 10,
  stiffness: 100,
  mass: 1,
  velocity: 0,
  useSpring: false,
};

const animationTypes = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slide: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  scale: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  rotate: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
  },
  flip: {
    initial: { rotateY: 180, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
  },
  bounce: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  expand: {
    initial: { scale: 0, rotate: 180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
  },
  elastic: {
    initial: { scaleX: 0, opacity: 0 },
    animate: { scaleX: 1, opacity: 1 },
  },
};

// Enhanced function to process HTML and add fluid typography styles with proper defaults
const processHtmlWithFluidStyles = (
  html: string,
  brandColor: string,
  brandFont: string,
  componentType: "heading" | "body" = "heading"
): string => {
  // Create a temporary div to work with DOM
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Function to check if element has user-defined styles
  const hasUserDefinedColor = (element: HTMLElement): boolean => {
    const style = element.getAttribute("style") || "";
    return style.includes("color:") || element.style.color !== "";
  };

  const hasUserDefinedFont = (element: HTMLElement): boolean => {
    const style = element.getAttribute("style") || "";
    return style.includes("font-family:") || element.style.fontFamily !== "";
  };

  // Function to update element styles intelligently
  const updateElementStyles = (element: HTMLElement) => {
    const currentStyle = element.getAttribute("style") || "";
    let newStyle = currentStyle;

    // Handle font-size with fluid typography
    const fontSizeMatch = currentStyle.match(/font-size:\s*([^;]+)/);
    if (fontSizeMatch) {
      const originalFontSize = fontSizeMatch[1];

      // Extract numeric value if it's in pixels
      const pxMatch = originalFontSize.match(/(\d+(?:\.\d+)?)px/);
      if (pxMatch) {
        const fontSize = parseFloat(pxMatch[1]);
        const lineHeight = fontSize * 1.2;
        const fluidStyles = getResponsiveTypographyStyles(
          fontSize,
          lineHeight,
          0.75
        );
        newStyle = newStyle.replace(
          /font-size:\s*[^;]+/,
          `font-size: ${fluidStyles.fontSize}`
        );
      }
    }

    // Apply brand color only if user hasn't set a custom color
    if (brandColor && !hasUserDefinedColor(element)) {
      newStyle = newStyle
        ? `${newStyle}; color: ${brandColor}`
        : `color: ${brandColor}`;
    }

    // Apply brand font only if user hasn't set a custom font
    if (brandFont && !hasUserDefinedFont(element)) {
      newStyle = newStyle
        ? `${newStyle}; font-family: ${brandFont}`
        : `font-family: ${brandFont}`;
    }

    // Clean up style string
    newStyle = newStyle
      .replace(/;\s*;/g, ";") // Remove double semicolons
      .replace(/^;\s*/, "") // Remove leading semicolon
      .replace(/\s*;$/, ""); // Remove trailing semicolon

    if (newStyle) {
      element.setAttribute("style", newStyle);
    }
  };

  // Process all elements with existing styles first
  const elementsWithStyle = tempDiv.querySelectorAll("[style]");
  elementsWithStyle.forEach((el) => updateElementStyles(el as HTMLElement));

  // For elements without styles, add default brand styles
  const allElements = tempDiv.querySelectorAll("*");
  allElements.forEach((el) => {
    const element = el as HTMLElement;
    // Only apply to text-containing elements that don't have styles
    if (
      element.textContent &&
      element.textContent.trim() &&
      !element.getAttribute("style") &&
      !element.querySelector("*")
    ) {
      // Only leaf elements
      let defaultStyle = "";
      if (brandColor) defaultStyle += `color: ${brandColor}`;
      if (brandFont)
        defaultStyle += defaultStyle
          ? `; font-family: ${brandFont}`
          : `font-family: ${brandFont}`;
      if (defaultStyle) element.setAttribute("style", defaultStyle);
    }
  });

  return tempDiv.innerHTML;
};

// Enhanced default styles function
const getDefaultStyles = (
  brandColor: string,
  brandFont: string,
  type: "heading" | "body" = "heading"
) => {
  return {
    color: brandColor || "inherit",
    fontFamily: brandFont || "inherit",
    fontSize: type === "heading" ? "1.5em" : "1em",
    fontWeight: type === "heading" ? "600" : "400",
    lineHeight: type === "heading" ? "1.2" : "1.6",
  };
};

export const Heading2: ComponentConfig<Heading2Props> = {
  label: "Heading 2",
  html: `<span style="font-size: max(30px, min(3.3333333333333335vw, 28px)); color: brandColor; font-family: brandFont;">Heading 2</span>
`,
  primary: false,
  fields: {
    type: {
      type: "select",
      options: [
        { value: "heading", label: "Heading Style" },
        { value: "body", label: "Body Style" },
      ],
    },
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    text: {
      section: "content",
      type: "custom",
      render: ({ name, onChange, value, props }) => {
        return (
          <AiTextEditor
            name={name}
            value={value}
            onChange={(updatedContent) => onChange(updatedContent)}
            type={props?.type || "heading"}
          />
        );
      },
    },
    animation: {
      type: "custom",
      render: ({ name, onChange, value = defaultAnimation }) => {
        return (
          <MotionAdjustor
            value={value}
            onChange={(config) => onChange(config)}
          />
        );
      },
    },
    paddingX: { type: "select", options: spacingOptions },
    paddingY: { type: "select", options: spacingOptions },
  },
  defaultProps: {
    text: `<span style="font-size: max(30px, min(3.3333333333333335vw, 28px))">Heading 2</span>`,
    bgColor: "#ffffff",
    paddingX: "0px",
    paddingY: "0px",
    animation: defaultAnimation,
    type: "heading",
  },

  render: function Heading2Render({
    text,
    bgColor,
    paddingX,
    paddingY,
    animation = defaultAnimation,
    type = "heading",
  }: Heading2Props) {
    const { getColor, getFont } = useBrand();

    // Get appropriate brand colors and fonts based on type
    const brandColor =
      type === "heading" ? getColor("primary") : getColor("secondary");
    const brandFont = type === "heading" ? getFont("heading") : getFont("body");

    // Generate fluid spacing styles
    const fluidStyles = getResponsiveSpacingStyles(
      `${paddingY} ${paddingX} ${paddingY} ${paddingX}`,
      "0px 0px 0px 0px"
    );

    const sanitizeHtml = (html: string): string => {
      return html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
    };

    const currentAnimation = { ...defaultAnimation, ...animation };

    const getTransition = () => {
      if (currentAnimation.useSpring) {
        return {
          type: "spring",
          stiffness: currentAnimation.stiffness,
          damping: currentAnimation.damping,
          mass: currentAnimation.mass,
          velocity: currentAnimation.velocity,
          bounce: currentAnimation.bounce,
          restDelta: 0.001,
        };
      }

      return {
        duration: currentAnimation.duration,
        ease: currentAnimation.ease,
        delay: currentAnimation.delay,
        repeat: currentAnimation.repeat,
        repeatType:
          currentAnimation.repeat > 0 ? ("reverse" as const) : undefined,
      };
    };

    const variants = animationTypes[currentAnimation.type || "fade"];

    // Process the HTML content with proper brand defaults
    const sanitizedText = sanitizeHtml(text);
    const processedHtml = processHtmlWithFluidStyles(
      sanitizedText,
      brandColor,
      brandFont,
      type
    );

    // Enhanced default styles
    const defaultStyles = getDefaultStyles(brandColor, brandFont, type);

    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          transition={getTransition()}
          style={{
            ...fluidStyles,
            backgroundColor: bgColor,
          }}
          className={`text-component max-md:text-center ${
            type === "heading" ? "heading-component" : "body-component"
          }`}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: processedHtml,
            }}
            className="text-content"
            style={defaultStyles}
          />
        </motion.div>
      </AnimatePresence>
    );
  },
};

export const useTextComponent = (props: Partial<Heading2Props>) => {
  const mergedProps = {
    ...Heading2.defaultProps,
    ...props,
  };

  return {
    props: mergedProps,
    isValid: {
      bgColor: mergedProps.bgColor,
      paddingX: mergedProps.paddingX,
      paddingY: mergedProps.paddingY,
      animation: mergedProps.animation,
      type: mergedProps.type,
    },
  };
};
