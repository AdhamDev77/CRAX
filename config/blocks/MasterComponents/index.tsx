import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComponentConfig } from "@measured/puck";
import { getResponsiveSpacingStyles, getResponsiveGap, getResponsiveTypographyStyles } from "@/lib/responsiveSpacing";
import { AiTextEditor } from "@/components/AiTextEditor";
import BorderRadiusAdjuster from "@/components/BorderRadiusAdjustor";
import BoxShadowAdjustor from "@/components/BoxShadowAdjustor";
import ColorPanel from "@/components/ColorPanel";
import MediaUploader from "@/components/MediaUploader";
import MotionAdjustor from "@/components/MotionAdjustor";
import SpacingAdjustor from "@/components/SpacingAdjustor";

export type MasterComponentProps = {
  // Content Fields
  title?: string;
  description?: string;
  imageUrl?: string;
  links?: { label: string; url: string }[];
  buttons?: { label: string; url: string; variant: "primary" | "secondary" }[];
  text?: string;

  // Style Fields
  bgColor?: string;
  textColor?: string;
  borderRadius?: {
    radius: string;
    isBorderEnabled: boolean;
    borderThickness: number;
    borderStyle: string;
    borderColor: string;
    isEnabled: boolean;
  };
  spacing?: {
    padding: string;
    margin: string;
  };
  itemSpacing?: string;
  boxShadow?: string;
  fontSize?: string;
  fontWeight?: string;
  alignment?: "left" | "center" | "right";
  direction?: "ltr" | "rtl";

  // Advanced Features
  customCSS?: string;
  hoverEffects?: boolean;
  responsiveBreakpoints?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };

  // Animation
  animation?: {
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
  };
};

export const MasterComponent: ComponentConfig<MasterComponentProps> = {
  label: "Master Component",
  fields: {
    // Content Fields
    title: {
      section: "content",
      type: "text",
      label: "Title",
    },
    description: {
      section: "content",
      type: "text",
      label: "Description",
    },
    text: {
      section: "content",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <AiTextEditor name={name} value={value} onChange={onChange} />
      ),
    },
    imageUrl: {
      section: "content",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <MediaUploader
          initialImage={value}
          onImageSelect={onChange}
          withMediaLibrary={true}
          withUnsplash={true}
        />
      ),
    },
    links: {
      section: "content",
      type: "array",
      getItemSummary: (item) => item.label || "Link",
      label: "Links",
      arrayFields: {
        label: { type: "text", label: "Link Label" },
        url: { type: "text", label: "Link URL" },
      },
    },
    buttons: {
      section: "content",
      type: "array",
      getItemSummary: (item) => item.label || "Button",
      label: "Buttons",
      arrayFields: {
        label: { type: "text", label: "Button Label" },
        url: { type: "text", label: "Button URL" },
        variant: {
          type: "select",
          label: "Button Variant",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      },
    },

    // Style Fields
    bgColor: {
      section: "style",
      styleType: "Background & Borders",
      styleTypeToggle: true,
      label: "Background Color",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} allowGradient={true} />
      ),
    },
    textColor: {
      section: "style",
      styleType: "Typography",
      styleTypeToggle: true,
      label: "Text Color",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} />
      ),
    },
    borderRadius: {
      section: "style",
      styleType: "Background & Borders",
      styleTypeToggle: true,
      label: "Border Radius",
      type: "custom",
      render: ({ onChange, value }) => (
        <BorderRadiusAdjuster value={value?.radius || "8px"} onChange={onChange} />
      ),
    },
    spacing: {
      section: "style",
      styleType: "Sizing & Spacing",
      styleTypeToggle: true,
      label: "Spacing",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <SpacingAdjustor value={value} onChange={onChange} unit="px" />
      ),
    },
    itemSpacing: {
      section: "style",
      styleType: "Sizing & Spacing",
      styleTypeToggle: true,
      label: "Item Spacing",
      type: "select",
      options: [
        { label: "Tight", value: "gap-2" },
        { label: "Normal", value: "gap-4" },
        { label: "Loose", value: "gap-6" },
        { label: "Giant", value: "gap-10" },
      ],
    },
    boxShadow: {
      section: "style",
      styleType: "Effects & Shadows",
      styleTypeToggle: true,
      label: "Box Shadow",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <BoxShadowAdjustor value={value} onChange={onChange} />
      ),
    },
    fontSize: {
      section: "style",
      styleType: "Typography",
      styleTypeToggle: true,
      label: "Font Size",
      type: "radio",
      options: [
        { label: "Small", value: "text-sm" },
        { label: "Medium", value: "text-base" },
        { label: "Large", value: "text-lg" },
      ],
    },
    fontWeight: {
      section: "style",
      styleType: "Typography",
      styleTypeToggle: true,
      label: "Font Weight",
      type: "select",
      options: [
        { label: "Normal", value: "font-normal" },
        { label: "Medium", value: "font-medium" },
        { label: "Semibold", value: "font-semibold" },
        { label: "Bold", value: "font-bold" },
      ],
    },
    alignment: {
      section: "style",
      styleType: "Layout & Positioning",
      styleTypeToggle: true,
      label: "Alignment",
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    direction: {
      section: "style",
      styleType: "Layout & Positioning",
      styleTypeToggle: true,
      label: "Direction",
      type: "radio",
      options: [
        { label: "Left to Right", value: "ltr" },
        { label: "Right to Left", value: "rtl" },
      ],
    },

    // Advanced Features
    customCSS: {
      section: "style",
      styleType: "Advanced Styling",
      styleTypeToggle: true,
      label: "Custom CSS",
      type: "textarea",
    },
    hoverEffects: {
      section: "style",
      styleType: "Interactions",
      styleTypeToggle: true,
      label: "Hover Effects",
      type: "radio",
      options: [
        { label: "Enable", value: true },
        { label: "Disable", value: false },
      ],
    },

    // Animation
    animation: {
      section: "style",
      styleType: "Interactions",
      styleTypeToggle: true,
      label: "Animation",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <MotionAdjustor value={value} onChange={onChange} />
      ),
    },
  },
  defaultProps: {
    title: "Master Component",
    description: "This is a master component with all possible features.",
    text: "Text",
    imageUrl: "",
    links: [{ label: "Link 1", url: "#" }],
    buttons: [{ label: "Button", url: "#", variant: "primary" }],
    bgColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: {
      radius: "8px",
      isBorderEnabled: false,
      borderThickness: 1,
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      isEnabled: true,
    },
    spacing: { padding: "20px", margin: "0px" },
    itemSpacing: "gap-4",
    boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
    fontSize: "text-base",
    fontWeight: "font-medium",
    alignment: "center",
    direction: "ltr",
    customCSS: "",
    hoverEffects: false,
    animation: {
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
    },
  },
  render: (props) => {
    const {
      title,
      description,
      text,
      imageUrl,
      links,
      buttons,
      bgColor,
      textColor,
      borderRadius,
      spacing,
      itemSpacing,
      boxShadow,
      fontSize,
      fontWeight,
      alignment,
      direction,
      customCSS,
      hoverEffects,
      animation,
    } = props;

    // Generate responsive spacing styles
    const spacingStyles = getResponsiveSpacingStyles(spacing?.padding, spacing?.margin);

    // Apply border styles if border is enabled
    const borderStyles = borderRadius?.isBorderEnabled
      ? {
          border: `${borderRadius.borderThickness}px ${borderRadius.borderStyle} ${borderRadius.borderColor}`,
        }
      : {};

    const renderLink = (link, idx) => {
      // If URL is empty or only whitespace, render as span
      if (!link.url?.trim()) {
        return (
          <span
            key={idx}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            {link.label}
          </span>
        );
      }
      return (
        <a
          key={idx}
          href={link.url}
          className="text-blue-600 hover:underline"
        >
          {link.label}
        </a>
      );
    };

    const renderButton = (button, idx) => {
      const buttonClasses = `px-4 py-2 rounded ${
        button.variant === "primary"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-800"
      }`;

      // If URL is empty or only whitespace, render as button
      if (!button.url?.trim()) {
        return (
          <button
            key={idx}
            className={`${buttonClasses} cursor-pointer`}
          >
            {button.label}
          </button>
        );
      }
      return (
        <a
          key={idx}
          href={button.url}
          className={buttonClasses}
        >
          {button.label}
        </a>
      );
    };

    return (
      <div
        style={{
          background: bgColor,
          color: textColor,
          borderRadius: borderRadius?.radius,
          ...borderStyles,
          padding: spacing?.padding,
          margin: spacing?.margin,
          boxShadow,
          textAlign: alignment,
          direction,
        }}
        className={`${itemSpacing} ${fontSize} ${fontWeight} ${
          hoverEffects ? "hover:opacity-80 transition-opacity" : ""
        }`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Component Image"
            className="w-full h-48 object-cover rounded-t"
          />
        )}
        <div className="p-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-2">{description}</p>
          <div className="mt-4">
            {links?.map((link, idx) => renderLink(link, idx))}
          </div>
          <div className="mt-4 flex gap-2">
            {buttons?.map((button, idx) => renderButton(button, idx))}
          </div>
        </div>
      </div>
    );
  },
};