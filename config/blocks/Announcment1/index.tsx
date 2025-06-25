import React from "react";
import { ComponentConfig } from "../../../packages/core";
import BorderRadiusAdjuster from "@/components/BorderRadiusAdjustor";
import BoxShadowAdjustor from "@/components/BoxShadowAdjustor";
import ColorPanel from "@/components/ColorPanel";
import MediaUploader from "@/components/MediaUploader";
import SpacingAdjustor from "@/components/SpacingAdjustor";
import Image from "next/image";

export type Announcement1Props = {
  MainText?: string;
  SecondaryText?: string;
  shown?: string;
  bgColor?: string;
  textColor?: string;
  borderRadius?: string;
  spacing?: {
    padding: string;
    margin: string;
  };
  boxShadow?: string;
  fontSize?: string;
  fontWeight?: string;
  imageUrl?: string;
  isPreview?: boolean; // New prop for preview mode
};

export const Announcement1: ComponentConfig<Announcement1Props> = {
  label: "Announcement #1",
  image: "https://miro.medium.com/v2/resize:fit:1200/1*u2fa0tEmnwftUi9omquHaw.png",
  fields: {
    shown: {
      section: "content",
      label: "Logo visibility",
      type: "radio",
      options: [
        { label: "shown", value: "flex" },
        { label: "hidden", value: "hidden" },
      ],
    },
    MainText: {
      section: "content",
      type: "text",
      label: "Main Text",
    },
    SecondaryText: {
      section: "content",
      type: "text",
      label: "Secondary Text",
    },
    imageUrl: {
      section: "content",
      label: "Logo Image",
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
    bgColor: {
      section: "style",
      styleType: "Background & Borders",
      styleTypeToggle: true,
      label: "Background Color",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} />
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
        <BorderRadiusAdjuster value={value} onChange={onChange} />
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
  },
  defaultProps: {
    MainText: "Get started today.",
    SecondaryText: "Sign up to get unlimited updates.",
    shown: "flex",
    bgColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: "0px",
    spacing: { padding: "20px", margin: "0px" },
    boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
    fontSize: "text-base",
    fontWeight: "font-medium",
    imageUrl: "",
    isPreview: false,
  },
  render: ({
    MainText,
    SecondaryText,
    shown,
    bgColor,
    textColor,
    borderRadius,
    spacing,
    boxShadow,
    fontSize,
    fontWeight,
    imageUrl,
    isPreview = false,
  }: Announcement1Props) => {
    // Preview mode adjustments
    const previewStyles = isPreview
      ? {
          transform: "scale(0.9)",
          pointerEvents: "none",
          margin: "0 auto",
          maxWidth: "320px",
        }
      : {};

    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius,
          padding: isPreview ? "12px" : spacing?.padding,
          margin: isPreview ? "0" : spacing?.margin,
          boxShadow,
          transition: "all 0.2s ease",
          ...previewStyles,
        }}
        className={`backdrop-blur-lg ${isPreview ? "border border-gray-200" : ""}`}
      >
        <div className={`${isPreview ? "px-2 py-2" : "px-4 py-4 sm:px-6 lg:px-8"} mx-auto`}>
          <div className={`grid ${isPreview ? "gap-2" : "gap-4"} justify-center sm:grid-cols-2 sm:items-center`}>
            <div className={`flex items-center ${isPreview ? "gap-x-2" : "gap-x-3 md:gap-x-5"}`}>
              {imageUrl && (
                isPreview ? (
                  <div className={`relative shrink-0 ${shown} ${isPreview ? "w-6 h-6" : "size-10 md:size-14"}`}>
                    <Image
                      src={imageUrl}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt="Logo"
                    className={`shrink-0 ${isPreview ? "w-6 h-6" : "size-10 md:size-14"} ${shown}`}
                  />
                )
              )}
              <div className="grow">
                <p className={`${fontSize} ${fontWeight} ${isPreview ? "truncate text-xs" : ""}`}>
                  {MainText}
                </p>
                {!isPreview && (
                  <p className="text-sm md:text-base">{SecondaryText}</p>
                )}
              </div>
            </div>

            {!isPreview && (
              <div className="text-center sm:text-start flex sm:justify-end max-md:justify-center sm:items-center gap-x-3 md:gap-x-4">
                <a
                  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                  href="#"
                >
                  Free trial
                </a>
                <a
                  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 dark:border-white dark:text-white"
                  href="#"
                >
                  Buy now
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};