import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core/types";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import { DropZone } from "../../../packages/core/components/DropZone";
import { Section } from "../../components/Section";
import ColorPickerComponent from "@/components/ColorPicker";
import MediaUploader from "@/components/MediaUploader";
import SpacingAdjustor from "@/components/SpacingAdjustor";
import Slider from "@/components/Slider";
import { X } from "lucide-react";
import { spacingOptions } from "@/config/options";
import ColorPanel from "@/components/ColorPanel";
import BoxShadowAdjustor from "@/components/BoxShadowAdjustor";
import {
  getResponsiveSpacing,
  getResponsiveGap,
  getResponsiveSpacingStyles,
  getFluidStyles
} from "@/lib/responsiveSpacing";

const getClassName = getClassNameFactory("Flex", styles);

export type FlexProps = {
  backgroundType?: string;
  bgColor?: string;
  imageUrl?: string;
  imageUrls?: string[];
  backgroundStyle?: string;
  sections: { minItemWidth?: number }[];
  spacing: {
    padding: string;
    margin: string;
  };
  animationStyle?: string;
  gap?: string;
  boxShadow?: string;
  widthType: "full" | "auto";
};

export const Flex: ComponentConfig<FlexProps> = {
  label: "Flex",
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#3182ce" fill="none">
    <path d="M3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 2.5V21.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
  ),
  fields: {
    sections: {
      section: "content",
      label: "Sections",
      type: "array",
      arrayFields: {
        minItemWidth: {
          label: "Minimum Item Width",
          type: "number",
          min: 0,
        },
      },
      getItemSummary: (_, id = -1) => `Section ${id + 1}`,
    },
    widthType: {
      // New field for width control
      label: "Width Type",
      type: "radio",
      options: [
        { label: "Full Width", value: "full" },
        { label: "Auto Width", value: "auto" },
      ],
    },
    backgroundType: {
      label: "Background Type",
      type: "radio",
      options: [
        { label: "None", value: "none" },
        { label: "Color", value: "color" },
        { label: "Image", value: "image" },
        { label: "Slider", value: "slider" },
      ],
    },
    bgColor: {
      label: "Background Color",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} />
      ),
    },
    imageUrl: {
      label: "Background Image",
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <div>
            {value && (
              <div className="mb-2 w-full flex justify-center items-center">
                <img
                  src={value}
                  alt="Selected"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
            <MediaUploader
              initialImage={value}
              withMediaLibrary={true}
              withUnsplash={true}
              onImageSelect={onChange}
            />
          </div>
        );
      },
    },
    imageUrls: {
      label: "Slider Images",
      type: "custom",
      render: ({ name, onChange, value }) => {
        const handleImageSelect = (selectedImage: string | null) => {
          if (selectedImage) {
            onChange([...(value || []), selectedImage]);
          }
        };

        const handleImageRemove = (index: number) => {
          onChange(value.filter((_, i) => i !== index));
        };

        return (
          <div>
            {(value || []).map((url, index) => (
              <div
                key={index}
                className="relative w-32 mb-2 mx-auto flex justify-center items-center"
              >
                <img
                  src={url}
                  alt={`Image ${index}`}
                  className="w-32 h-32 object-cover rounded-lg shadow-lg"
                />
                <button
                  className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 hover:text-red-500 font-bold w-6 h-6 rounded-full flex justify-center items-center transition duration-200"
                  onClick={() => handleImageRemove(index)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <MediaUploader
              withMediaLibrary={true}
              withUnsplash={true}
              onImageSelect={handleImageSelect}
            />
          </div>
        );
      },
    },
    backgroundStyle: {
      label: "Background Style",
      type: "radio",
      options: [
        { label: "Normal", value: "normal" },
        { label: "Parallax", value: "parallax" },
      ],
    },
    gap: {
      label: "Gap",
      type: "select",
      options: spacingOptions,
    },
    boxShadow: {
      type: "custom",
      render: ({ name, onChange, value }) => (
        <BoxShadowAdjustor value={value} onChange={onChange} />
      ),
    },
    spacing: {
      label: "Spacing",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <SpacingAdjustor value={value} onChange={onChange} unit="px" />
      ),
    },
  },
  defaultProps: {
    sections: [{}, {}],
    backgroundType: "color",
    bgColor: "#ffffff",
    gap: "16px",
    backgroundStyle: "normal",
    boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
    animationStyle: "fade",
    spacing: { padding: "20px 0px 20px 0px", margin: "0px 0px 0px 0px" },
    widthType: "full",
    imageUrl:
      "https://png.pngtree.com/background/20230616/original/pngtree-faceted-abstract-background-in-3d-with-shimmering-iridescent-metallic-texture-of-picture-image_3653595.jpg", // Explicitly set to null
    imageUrls: [
      "https://png.pngtree.com/background/20230616/original/pngtree-faceted-abstract-background-in-3d-with-shimmering-iridescent-metallic-texture-of-picture-image_3653595.jpg",
    ], // Explicitly set to empty array
  },
  resolveFields: async (data, { fields }) => {
    // Conditionally show/hide fields based on backgroundType
    if (data.props.backgroundType === "color") {
      return {
        ...fields,
        imageUrl: undefined,
        imageUrls: undefined,
        backgroundStyle: undefined,
      };
    } else if (data.props.backgroundType === "image") {
      return {
        ...fields,
        bgColor: undefined,
        imageUrls: undefined,
      };
    } else if (data.props.backgroundType === "slider") {
      return {
        ...fields,
        imageUrl: undefined,
        bgColor: undefined,
        backgroundStyle: undefined,
      };
    } else if (data.props.backgroundType === "none") {
      return {
        ...fields,
        imageUrls: undefined,
        imageUrl: undefined,
        bgColor: undefined,
        backgroundStyle: undefined,
      };
    }
    return fields;
  },
  render: ({
    sections,
    spacing,
    backgroundType,
    bgColor,
    gap,
    imageUrl,
    imageUrls,
    backgroundStyle,
    widthType,
    boxShadow,
  }) => {
    const backgroundAttachment = backgroundStyle === "parallax" ? "fixed" : "scroll";

    // Determine the background style based on background type and available images
    const backgroundStyles = (() => {
      switch (backgroundType) {
        case "color":
          return {
            background: bgColor || "transparent",
          };
        case "image":
          return imageUrl
            ? {
                background: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: backgroundAttachment,
              }
            : {};
        case "slider":
          return imageUrls && imageUrls.length > 0 ? {} : {};
        default:
          return {};
      }
    })();

    // Calculate responsive spacing values
    const responsiveSpacingStyles = getResponsiveSpacingStyles(
      spacing.padding,
      spacing.margin
    );

    // Calculate responsive gap
    const responsiveGap = gap ? getResponsiveGap(gap) : undefined;

    // Calculate container width based on widthType
    const containerWidth = widthType === "auto" ? "fit-content" : "100%";

    return (
      <Section
        style={{
          ...backgroundStyles,
          width: widthType === "auto" ? "auto" : "100%",
          height: widthType === "auto" ? "auto" : "100%",
          margin: widthType === "auto" ? "0 auto" : undefined,
          zIndex: 40,
          boxShadow,
          position: "relative",
        }}
      >
        {backgroundType === "slider" && imageUrls && imageUrls.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
              overflow: "hidden",
            }}
          >
            <Slider images={imageUrls} />
          </div>
        )}
        <div
          style={{
            ...responsiveSpacingStyles,
            gap: responsiveGap,
            width: containerWidth,
          }}
          className="flex md:space-y-0 md:flex-row flex-col space-y-4"
        >
          {sections.map((section, idx) => {
            // Calculate responsive minimum width for sections if specified
            const minWidth = section.minItemWidth
              ? getResponsiveSpacing(`${section.minItemWidth}px`)
              : undefined;

            return (
              <div
                key={idx}
                className={getClassName("item")}
                style={{
                  width: widthType === "auto" ? "auto" : "100%",
                  minWidth,
                  flex: widthType === "auto" ? "0 1 auto" : "1 1 0",
                }}
              >
                <DropZone zone={`item-${idx}`} />
              </div>
            );
          })}
        </div>
      </Section>
    );
  },
};