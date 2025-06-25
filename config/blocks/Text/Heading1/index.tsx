import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextEditor } from "@/components/TextEditor";
import { ComponentConfig } from "../../../../packages/core";
import ColorPickerComponent from "@/components/ColorPicker";
import { AiTextEditor } from "@/components/AiTextEditor";
import { spacingOptions } from "@/config/options";
import MotionAdjustor from '@/components/MotionAdjustor';
import { getResponsiveSpacingStyles, getResponsiveTypographyStyles } from '@/lib/responsiveSpacing';
import { renderToStaticMarkup } from 'react-dom/server';

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

// Function to process HTML and add fluid typography styles
const processHtmlWithFluidStyles = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Process all elements with font-size
  doc.querySelectorAll('[style*="font-size"]').forEach(el => {
    const style = el.getAttribute('style') || '';
    const fontSizeMatch = style.match(/font-size:\s*(\d+)px/);
    if (fontSizeMatch) {
      const fontSize = parseInt(fontSizeMatch[1], 10);
      const lineHeight = fontSize * 1.2; // Default line height ratio
      const fluidStyles = getResponsiveTypographyStyles(fontSize, lineHeight, 0.75);
      
      // Update the style attribute with fluid values
      const newStyle = style.replace(
        /font-size:\s*\d+px/,
        `font-size: ${fluidStyles.fontSize}`
      );
      el.setAttribute('style', newStyle);
    }
  });

  return doc.body.innerHTML;
};

// Render function that returns the JSX
const renderComponent = ({ text, bgColor, paddingX, paddingY, animation = defaultAnimation }: Heading1Props) => {
  // Generate fluid spacing styles
  const fluidStyles = getResponsiveSpacingStyles(
    `${paddingY} ${paddingX} ${paddingY} ${paddingX}`,
    '0px 0px 0px 0px'
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={variants.initial}
        animate={variants.animate}
        transition={getTransition()}
        style={{
          ...fluidStyles,
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

// Generate HTML from the render function (simplified version without motion)
const generateHtml = () => {
  const defaultProps = {
    text: `<span style="font-size: max(30px, min(3.3333333333333335vw, 40px))">Heading 1</span>`,
    bgColor: "#ffffff",
    paddingX: "0px",
    paddingY: "0px",
    animation: defaultAnimation,
  };
  
  // Create a simplified version without Framer Motion for HTML generation
  const SimplifiedComponent = ({ text, bgColor, paddingX, paddingY }: Heading1Props) => {
    const fluidStyles = getResponsiveSpacingStyles(
      `${paddingY} ${paddingX} ${paddingY} ${paddingX}`,
      '0px 0px 0px 0px'
    );

    const sanitizeHtml = (html: string): string => {
      return html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
    };

    const processedHtml = processHtmlWithFluidStyles(sanitizeHtml(text));

    return (
      <div
        style={{
          ...fluidStyles,
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
  };
  
  return renderToStaticMarkup(<SimplifiedComponent {...defaultProps} />);
};

export const Heading1: ComponentConfig<Heading1Props> = {
  label: 'Heading 1',
  html: generateHtml(), // Dynamically generated from render function
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
    text: `<span style="font-size: max(30px, min(3.3333333333333335vw, 40px))">Heading 1</span>`,
    bgColor: "#ffffff",
    paddingX: "0px",
    paddingY: "0px",
    animation: defaultAnimation,
  },
  
  render: renderComponent,
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