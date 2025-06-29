import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextEditor } from "@/components/TextEditor";
import { ComponentConfig } from "../../../../packages/core";
import ColorPickerComponent from "@/components/ColorPicker";
import { AiTextEditor } from "@/components/AiTextEditor";
import { spacingOptions } from "@/config/options";
import MotionAdjustor from '@/components/MotionAdjustor';
import { getResponsiveSpacingStyles, getResponsiveTypographyStyles } from '@/lib/responsiveSpacing';
import { useBrand } from '@/packages/core/components/Puck/components/BrandSidebar';

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

export type Heading1Props = {
  text: string;
  paddingX: string;
  paddingY: string;
  bgColor: string;
  animation?: Partial<AnimationConfig>;
  isPreview?: boolean;
};

const defaultAnimation: AnimationConfig = {
  type: 'fade',
  duration: 0.5,
  ease: 'easeOut',
  delay: 0,
  repeat: 0,
  bounce: 0.25,
  damping: 10,
  stiffness: 100,
  mass: 1,
  velocity: 0,
  useSpring: false
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
  }
};

// Fallback function for responsive spacing if the utility doesn't exist
const getFallbackSpacingStyles = (padding: string) => {
  return {
    padding: padding || '0px',
  };
};

// Fallback function for responsive typography if the utility doesn't exist
const getFallbackTypographyStyles = (html: string): string => {
  // Return the HTML as-is if we can't process it
  return html;
};

// Function to process HTML and add fluid typography styles
const processHtmlWithFluidStyles = (html: string): string => {
  
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.DOMParser) {
      return getFallbackTypographyStyles(html);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Process all elements with font-size
    doc.querySelectorAll('[style*="font-size"]').forEach(el => {
      const style = el.getAttribute('style') || '';
      const fontSizeMatch = style.match(/font-size:\s*(\d+)px/);
      if (fontSizeMatch) {
        const fontSize = parseInt(fontSizeMatch[1], 10);
        const lineHeight = fontSize * 1.2; // Default line height ratio
        
        // Try to use the responsive typography utility, fallback if it fails
        try {
          const fluidStyles = getResponsiveTypographyStyles(fontSize, lineHeight, 0.75);
          const newStyle = style.replace(
            /font-size:\s*\d+px/,
            `font-size: ${fluidStyles.fontSize}`
          );
          el.setAttribute('style', newStyle);
        } catch (error) {
          // Keep original styles if utility fails
          console.warn('Responsive typography utility failed, using original styles');
        }
      }
    });

    return doc.body.innerHTML;
  } catch (error) {
    console.warn('HTML processing failed, using original HTML');
    return html;
  }
};

// The render function extracted as a separate component
const Heading1Component = ({ 
  text, 
  bgColor = "#ffffff", 
  paddingX = "0px", 
  paddingY = "0px", 
  animation = defaultAnimation,
  isPreview = false 
}: Heading1Props) => {
  // Generate fluid spacing styles with fallback
  let fluidStyles;
  try {
    fluidStyles = getResponsiveSpacingStyles(
      `${paddingY} ${paddingX} ${paddingY} ${paddingX}`,
      '0px 0px 0px 0px'
    );
  } catch (error) {
    // Fallback to simple padding if utility fails
    fluidStyles = getFallbackSpacingStyles(`${paddingY} ${paddingX}`);
  }

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
        restDelta: 0.001
      };
    }
    
    return {
      duration: currentAnimation.duration,
      ease: currentAnimation.ease,
      delay: currentAnimation.delay,
      repeat: currentAnimation.repeat,
      repeatType: currentAnimation.repeat > 0 ? "reverse" as const : undefined,
    };
  };

  const variants = animationTypes[currentAnimation.type || 'fade'];

  // Process the HTML content with fluid typography
  const processedHtml = processHtmlWithFluidStyles(sanitizeHtml(text));

  // For preview mode, disable animations to prevent issues
  if (isPreview) {
    return (
      <div
        style={{
          ...fluidStyles,
          backgroundColor: bgColor,
        }}
        className="text-component max-md:text-center"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: processedHtml
          }}
          className="text-content"
        />
      </div>
    );
  }

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
        className="text-component max-md:text-center"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: processedHtml
          }}
          className="text-content"
        />
      </motion.div>
    </AnimatePresence>
  );
};

// ComponentConfig for the form fields - following the same pattern as CardLink
export const Heading1: ComponentConfig<Heading1Props> = {
  label: 'Heading 1',
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
      section: "content",
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
    text: `<span style="font-size: max(30px, min(3.3333333333333335vw, 28px))">Heading 1</span>`,
    bgColor: "#ffffff",
    paddingX: "0px",
    paddingY: "0px",
    animation: defaultAnimation,
  },
  
  // Render function directly in the config like CardLink
  render: ({ 
    text, 
    bgColor = "#ffffff", 
    paddingX = "0px", 
    paddingY = "0px", 
    animation = defaultAnimation,
    isPreview = false 
  }: Heading1Props) => {
    return <Heading1Component 
      text={text}
      bgColor={bgColor}
      paddingX={paddingX}
      paddingY={paddingY}
      animation={animation}
      isPreview={isPreview}
    />;
  },
};

export const useTextComponent = (props: Partial<Heading1Props>) => {
  const mergedProps = {
    ...Heading1.defaultProps,
    ...props,
  };

  return {
    props: mergedProps,
    isValid: {
      bgColor: mergedProps.bgColor,
      paddingX: mergedProps.paddingX,
      paddingY: mergedProps.paddingY,
      animation: mergedProps.animation,
    },
  };
};

// Export the component for use in previews
export { Heading1Component };

// Export as default to match your import pattern
export default Heading1;