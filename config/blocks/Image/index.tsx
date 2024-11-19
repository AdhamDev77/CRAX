/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "../../../packages/core";
import { getClassNameFactory } from "../../../packages/core/lib";
import { Section } from "../../components/Section";
import { BorderRadiusOptions } from "@/config/options";
import MediaUploader from "@/components/MediaUploader";

export type ImageProps = {
  alt: string;
  imageUrl: string;
  borderRadius: string;
};

export const Image: ComponentConfig<ImageProps> = {
  fields: {
    imageUrl: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        const handleImageSelect = (selectedImage: string | null) => {
          // Only call onChange if the image is not null
          if (selectedImage) {
            onChange(selectedImage);
          }
        };

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
              withMediaLibrary={true}
              withUnsplash={true}
              onImageSelect={handleImageSelect}
            />
          </div>
        );
      },
    },
    alt: { type: "text", label: "Image alt" },
    borderRadius: {
      label: "Border radius",
      type: "select",
      options: BorderRadiusOptions,
    },
  },
  defaultProps: {
    alt: "beach",
    imageUrl:
      "https://www.shutterstock.com/image-photo/aerial-view-lying-beautiful-young-600nw-2120219699.jpg",
    borderRadius: "0px",
  },
  render: ({ alt, imageUrl, borderRadius }) => {
    return (
      <div className="w-full flex">
        <img src={imageUrl} alt={alt} style={{ borderRadius: borderRadius }} />
      </div>
    );
  },
};
