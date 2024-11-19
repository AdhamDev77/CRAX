import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core/types";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import { DropZone } from "../../../packages/core/components/DropZone";
import { Section } from "../../components/Section";
import ColorPickerComponent from "@/components/ColorPicker";
import MediaUploader from "@/components/MediaUploader";
import PaddingAdjustor from "@/components/PaddingAdjustor";
import Slider from "@/components/Slider";
import { X } from "lucide-react";
import ColorPanel from "@/components/ColorPanel";

const getClassName = getClassNameFactory("Flex", styles);

export type FlexProps = {
  backgroundType?: string;
  bgColor?: string;
  imageUrl?: string;
  imageUrls?: string[];
  backgroundStyle?: string;
  sections: { minItemWidth?: number }[];
  padding: string;
  animationStyle?: string;
};

export const Flex: ComponentConfig<FlexProps> = {
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
    sections: {
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
    padding: {
      label: "Padding",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <PaddingAdjustor value={value} onChange={onChange} unit="px" />
      ),
    },
  },
  defaultProps: {
    sections: [{}, {}],
    backgroundType: "color",
    bgColor: "#ffffff",
    backgroundStyle: "normal",
    animationStyle: "fade",
    padding: "20px 0px 20px 0px",
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
    padding,
    backgroundType,
    bgColor,
    imageUrl,
    imageUrls,
    backgroundStyle,
  }) => {
    const backgroundAttachment =
      backgroundStyle === "parallax" ? "fixed" : "scroll";

    return (
<Section
  style={{
    background:
      backgroundType === "color" && bgColor
        ? bgColor
        : backgroundType === "image" && imageUrl
        ? `${bgColor ? `${bgColor}, ` : ""}url(${imageUrl})`
        : undefined,
    backgroundSize: backgroundType === "image" ? "cover" : undefined,
    backgroundPosition: backgroundType === "image" ? "center" : undefined,
    backgroundRepeat: backgroundType === "image" ? "no-repeat" : undefined,
    backgroundAttachment: backgroundType === "image" ? backgroundAttachment : undefined,
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
        <div style={{ padding }} className={getClassName()}>
          {sections.map((section, idx) => (
            <div key={idx} className={getClassName("item")}>
              <DropZone zone={`item-${idx}`} />
            </div>
          ))}
        </div>
      </Section>
    );
  },
};
