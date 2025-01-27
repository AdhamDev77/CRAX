import React from "react";
import { ComponentConfig } from "../../../packages/core";
import BorderRadiusAdjuster from "@/components/BorderRadiusAdjustor";
import BoxShadowAdjustor from "@/components/BoxShadowAdjustor";
import ColorPanel from "@/components/ColorPanel";
import MediaUploader from "@/components/MediaUploader";
import SpacingAdjustor from "@/components/SpacingAdjustor";

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
  }: Announcement1Props) => {
    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius,
          padding: spacing?.padding,
          margin: spacing?.margin,
          boxShadow,
        }}
        className="backdrop-blur-lg"
      >
        <div className="max-w-[85rem] px-4 py-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid justify-center sm:grid-cols-2 sm:items-center gap-4">
            <div className={`flex items-center gap-x-3 md:gap-x-5`}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Logo"
                  className={`shrink-0 size-10 md:size-14 ${shown}`}
                />
              )}
              <div className="grow">
                <p className={`${fontSize} ${fontWeight}`}>{MainText}</p>
                <p className="text-sm md:text-base">{SecondaryText}</p>
              </div>
            </div>

            <div className="text-center sm:text-start flex sm:justify-end max-md:justify-center sm:items-center gap-x-3 md:gap-x-4">
              <a
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                href="#"
              >
                Free trial
              </a>
              <a
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-white dark:text-white dark:hover:text-neutral-300 dark:hover:border-neutral-300 dark:focus:text-neutral-300 dark:focus:border-neutral-300"
                href="#"
              >
                Buy now
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  },
};