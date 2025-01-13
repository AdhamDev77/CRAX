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
import GridCustomizer from "@/components/GridAdjustor";
import { getResponsiveGap, getResponsiveSpacingStyles } from "@/lib/responsiveSpacing";

const getClassName = getClassNameFactory("Flex", styles);

export type GridProps = {
  backgroundType?: string;
  bgColor?: string;
  imageUrl?: string;
  imageUrls?: string[];
  backgroundStyle?: string;
  spacing: {
    padding: string;
    margin: string;
  };
  gap?: string;
  boxShadow?: string;
  
  gridConfig?: {
    columns: number;
    rows: number;
    gap: number;
    columnWidth?: string;
    rowHeight?: string;
    backgroundColor?: string;
    itemBackgroundColor?: string;
    overflow?: 'auto' | 'hidden' | 'scroll';
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    alignItems?: 'start' | 'center' | 'end' | 'stretch';
  };
};

export const Grid: ComponentConfig<GridProps> = {
  label: "Grid",
  icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#3182ce" fill="none">
  <path d="M20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M21.5 12L2.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M12 2.5L12 21.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>,
  fields: {
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
    gridConfig: {
      section: "content",
      label: "Grid Configuration",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <GridCustomizer 
          onChange={(config) => onChange(config)}
          value={value}
        />
      ),
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
    backgroundType: "color",
    bgColor: "#ffffff",
    backgroundStyle: "normal",
    boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)',
    spacing: { padding: "20px 0px 20px 0px", margin: "0px 0px 0px 0px" },
    imageUrl: 'https://png.pngtree.com/background/20230616/original/pngtree-faceted-abstract-background-in-3d-with-shimmering-iridescent-metallic-texture-of-picture-image_3653595.jpg', // Explicitly set to null
    imageUrls: ['https://png.pngtree.com/background/20230616/original/pngtree-faceted-abstract-background-in-3d-with-shimmering-iridescent-metallic-texture-of-picture-image_3653595.jpg'], 
    gridConfig: {
      columns: 2,
      rows: 2,
      gap: 12,
      columnWidth: 'auto',
      rowHeight: 'auto',
      backgroundColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      itemBackgroundColor: 'bg-indigo-300',
      overflow: 'auto',
      justifyContent: 'start',
      alignItems: 'stretch'
    }
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
    spacing,
    backgroundType,
    bgColor,
    imageUrl,
    imageUrls,
    backgroundStyle,
    boxShadow,
    gridConfig,
  }) => {
    const backgroundAttachment =
      backgroundStyle === "parallax" ? "fixed" : "scroll";

    // Generate responsive spacing styles
    const spacingStyles = getResponsiveSpacingStyles(spacing.padding, spacing.margin);

    // Generate responsive gap
    const responsiveGap = gridConfig?.gap ? getResponsiveGap(`${gridConfig.gap}px`) : null;

    // Compute grid style based on grid configuration
    const gridStyle = gridConfig
      ? {
          display: "grid",
          gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`, // Default columns
          gridTemplateRows:
            gridConfig.rowHeight === "auto"
              ? `repeat(${gridConfig.rows}, 1fr)`
              : `repeat(${gridConfig.rows}, ${gridConfig.rowHeight})`,
          gap: responsiveGap, // Apply responsive gap
          overflow: gridConfig.overflow || "auto",
          justifyContent: gridConfig.justifyContent || "start",
          alignItems: gridConfig.alignItems || "stretch",
          maxHeight: gridConfig.overflow !== "hidden" ? undefined : "100%",
        }
      : {};

    return (
      <Section
        style={{
          background:
            backgroundType === "color" && bgColor
              ? bgColor
              : backgroundType === "image" && imageUrl
              ? `url(${imageUrl})`
              : undefined,
          backgroundSize: backgroundType === "image" ? "cover" : undefined,
          backgroundPosition: backgroundType === "image" ? "center" : undefined,
          backgroundRepeat:
            backgroundType === "image" ? "no-repeat" : undefined,
          backgroundAttachment:
            backgroundType === "image" ? backgroundAttachment : undefined,
          zIndex: 40,
          boxShadow,
          ...spacingStyles, // Apply responsive padding and margin
        }}
      >
        {backgroundType === "slider" && imageUrls && imageUrls.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
          >
            <Slider images={imageUrls} />
          </div>
        )}

        {/* Add CSS media queries for responsive grid columns */}
        <style>
          {`
            @media (max-width: 767px) {
              .responsive-grid {
                grid-template-columns: repeat(1, 1fr) !important;
              }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              .responsive-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}
        </style>

        <div
          style={gridStyle}
          className="responsive-grid" // Apply responsive grid class
        >
          {gridConfig &&
            [...Array(gridConfig.columns * gridConfig.rows)].map((_, idx) => (
              <div
                key={idx}
                className="flex w-full h-full"
              >
                <DropZone zone={`grid-item-${idx}`} />
              </div>
            ))}
        </div>
      </Section>
    );
  },
};

export default Grid;