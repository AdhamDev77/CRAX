import React from "react";
import { ComponentConfig } from "../../../packages/core";
import { BorderRadiusOptions } from "@/config/options";
import MediaUploader from "@/components/MediaUploader";
import DimensionAdjustor from "@/components/DimensionsAdjustor";

export type Dimensions = {
  width: string;
  height: string;
};

export type ImageProps = {
  alt: string;
  imageUrl: string;
  borderRadius: string;
  dimensions: Dimensions;
  link: string;
};

export const Image: ComponentConfig<ImageProps> = {
  fields: {
    imageUrl: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        const handleImageSelect = (selectedImage: string | null) => {
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
    alt: { 
      type: "text", 
      label: "Image alt"
    },
    borderRadius: {
      label: "Border radius",
      type: "select",
      options: BorderRadiusOptions,
    },
    dimensions: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <DimensionAdjustor 
            value={value as Dimensions} 
            onChange={onChange}
          />
        );
      }
    },
    link: {
      label: "Link URL",
      type: "text",
    },
  },
  defaultProps: {
    alt: "beach",
    imageUrl:
      "https://www.shutterstock.com/image-photo/aerial-view-lying-beautiful-young-600nw-2120219699.jpg",
    borderRadius: "0px",
    dimensions: { width: "100%", height: "auto" },
    link: "#",
  },
  render: ({ alt, imageUrl, borderRadius, dimensions, link }) => {
    const imageElement = (
      <img
        src={imageUrl}
        alt={alt}
        style={{
          borderRadius,
          width: dimensions.width,
          height: dimensions.height,
        }}
      />
    );

    const shouldRenderLink = link && link.trim() !== "" && link !== "#";

    return (
      <div className="w-full flex justify-center items-center">
        {shouldRenderLink ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {imageElement}
          </a>
        ) : (
          imageElement
        )}
      </div>
    );
  },
};