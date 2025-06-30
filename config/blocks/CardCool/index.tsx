import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core/types";
import styles from "./styles.module.css";
import { DropZone } from "../../../packages/core/components/DropZone";
import { Section } from "../../components/Section";
import ColorPickerComponent from "@/components/ColorPicker";
import MediaUploader from "@/components/MediaUploader";
import SpacingAdjustor from "@/components/SpacingAdjustor";
import Slider from "@/components/Slider";
import { Linkedin, Mail, MapPin, Phone, X } from "lucide-react";
import { spacingOptions } from "@/config/options";
import ColorPanel from "@/components/ColorPanel";
import BoxShadowAdjustor from "@/components/BoxShadowAdjustor";
import {
  getResponsiveSpacing,
  getResponsiveGap,
  getResponsiveSpacingStyles,
  getFluidStyles
} from "@/lib/responsiveSpacing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/packages/core/components/Button";
import { useBrand } from "@/packages/core/components/Puck/components/BrandSidebar";

export type CardCoolProps = {
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

export const CardCool: ComponentConfig<CardCoolProps> = {
  label: "Card Cool",
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
      styleType: "Layout & Positioning",
      styleTypeToggle: false,
      options: [
        { label: "Full Width", value: "full" },
        { label: "Auto Width", value: "auto" },
      ],
    },
    backgroundType: {
      label: "Background Type",
      type: "radio",
      styleType: "Background & Borders",
      styleTypeToggle: true,
      options: [
        { label: "None", value: "none" },
        { label: "Color", value: "color" },
        { label: "Image", value: "image" },
        { label: "Slider", value: "slider" },
      ],
    },
    bgColor: {
      label: "Background Color",
      styleType: "Background & Borders",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} />
      ),
    },
    imageUrl: {
      label: "Background Image",
      styleType: "Background & Borders",
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
      styleType: "Background & Borders",
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
      styleType: "Background & Borders",
      type: "radio",
      options: [
        { label: "Normal", value: "normal" },
        { label: "Parallax", value: "parallax" },
      ],
    },
    gap: {
      label: "Gap",
      styleType: "Sizing & Spacing",
      type: "select",
      options: spacingOptions,
    },
    boxShadow: {
      type: "custom",
      styleType: "Effects & Shadows",
      render: ({ name, onChange, value }) => (
        <BoxShadowAdjustor value={value} onChange={onChange} />
      ),
    },
    spacing: {
      label: "Spacing",
      styleType: "Sizing & Spacing",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <SpacingAdjustor value={value} onChange={onChange} unit="px" />
      ),
    },
  },
  defaultProps: {
    sections: [{}, {}],
    backgroundType: "color",
    bgColor: "",
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
  }: any) => {
    const { getColor, getFont } = useBrand();
    // Move hook call to top-level of component, not inside a nested function
    

    const backgroundAttachment = backgroundStyle === "parallax" ? "fixed" : "scroll";

    // Determine the background style based on background type and available images
    const backgroundStyles = (() => {
      switch (backgroundType) {
        case "color":
          return {
            background: bgColor || getColor("primary"),
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
    
    const resolvedBgColor = bgColor || getColor("background");
    return (
      <div className="min-h-screen bg-gradient-to-br p-8 flex items-center justify-center"         style={{
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
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 overflow-hidden relative">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute top-8 right-8 w-16 h-16 bg-blue-400/20 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/10 rounded-full translate-y-12 -translate-x-12"></div>

        <CardContent className="p-8 relative z-10">
          {/* Header with profile image */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-1">
                <img
                  src="/placeholder.svg?height=96&width=96"
                  alt="Employee Profile"
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Name and title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sarah Johnson</h2>
            <p className="text-blue-600 font-semibold mb-2">Senior Product Designer</p>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              San Francisco, CA
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-blue-50/50 rounded-xl">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">5+</div>
              <div className="text-xs text-gray-600">Years Exp</div>
            </div>
            <div className="text-center border-x border-blue-200">
              <div className="text-xl font-bold text-blue-600">50+</div>
              <div className="text-xs text-gray-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">15+</div>
              <div className="text-xs text-gray-600">Awards</div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
            Passionate designer with expertise in user experience and interface design. Specialized in creating
            intuitive digital solutions that drive business growth.
          </p>

          {/* Contact buttons */}
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12">
              <Mail className="w-4 h-4 mr-2" />
              sarah.johnson@company.com
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
              
                className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl h-11 bg-transparent"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </button>
              <button
             
                className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl h-11 bg-transparent"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </button>
            </div>
          </div>

          {/* Skills tags */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {["UI/UX Design", "Figma", "Prototyping", "User Research"].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    );
  },
};