import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextEditor } from "@/components/TextEditor";
import { ComponentConfig } from "../../../packages/core";
import ColorPickerComponent from "@/components/ColorPicker";
import { AiTextEditor } from "@/components/AiTextEditor";
import { spacingOptions } from "@/config/options";
import MotionAdjustor from '@/components/MotionAdjustor';

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

export type TextProps = {
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

export const Text: ComponentConfig<TextProps> = {
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
    text: "Text",
    bgColor: "#ffffff",
    paddingX: "0px",
    paddingY: "0px",
    animation: defaultAnimation,
  },
  render: ({ text, bgColor, paddingX, paddingY, animation = defaultAnimation }: TextProps) => {
    const safeStyles = {
      paddingLeft: paddingX || "0",
      paddingRight: paddingX || "0",
      paddingTop: paddingY || "0",
      paddingBottom: paddingY || "0",
    };

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

    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          transition={getTransition()}
          style={safeStyles}
          className="text-component"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(text),
            }}
            className="text-content"
          />
        </motion.div>
      </AnimatePresence>
    );
  },
};

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
      animation: mergedProps.animation,
    },
  };
};