/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ComponentConfig } from "../../../packages/core/types";
import { spacingOptions } from "@/config/options";
import { X, Brush } from "lucide-react";
import ColorPicker from "react-pick-color";
import { InfiniteMovingCards } from "@/components/ui/aceternity/infinite-moving-cards";
import { ImagesSlider } from "@/components/ui/aceternity/images-slider";
import { motion } from "framer-motion";
import MediaUploader from "@/components/MediaUploader";
import axios from "axios";
import { useParams } from "next/navigation";
import ColorPickerComponent from "@/components/ColorPicker";

export type HeroImagesSliderProps = {
  title: string;
  buttons: { btnText: string; btnLink: string; btnBgColor: string }[];
  images: {
    imageURL: string;
    alt: string;
  }[];
};

export const HeroImagesSlider: ComponentConfig<HeroImagesSliderProps> = {
  label: "Hero (Images Slider)",
  fields: {
    title: {
      label: "Title",
      type: "text",
    },
    buttons: {
      type: "array",
      getItemSummary: (item) => item.btnText || "Button",
      arrayFields: {
        btnText: {
          label: "Button title",
          type: "text",
        },
        btnLink: {
          label: "Button link",
          type: "text",
        },
        btnBgColor: {
          type: "custom",
          render: ({ name, onChange, value }) => {
            return (
              <ColorPickerComponent
                name={name}
                onChange={onChange}
                value={value}
              />
            );
          },
        },
      },
      defaultItemProps: {
        btnText: "Button",
        btnLink: "#",
        btnBgColor: "#34d399",
      },
    },

    images: {
      type: "array",
      getItemSummary: (item: { alt: string }) => item.alt || "Image",
      arrayFields: {
        imageURL: {
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
        alt: { type: "text" },
      },
    },
  },
  defaultProps: {
    title: "The hero section slideshow nobody asked for",
    buttons: [
      {
        btnText: "Join now →",
        btnLink: "https://www.facebook.com",
        btnBgColor: "#34d399",
      },
    ],
    images: [
      {
        imageURL:
          "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d",
        alt: "Mountain landscape at sunset",
      },
      {
        imageURL:
          "https://images.unsplash.com/photo-1483982258113-b72862e6cff6",
        alt: "Snowy mountain peaks",
      },
      {
        imageURL:
          "https://images.unsplash.com/photo-1482189349482-3defd547e0e9",
        alt: "Forest landscape",
      },
    ],
  },
  render: ({ images, title, buttons }) => {
    const urlArray = images.map((item) => item.imageURL);
    return (
      <ImagesSlider className="h-[40rem]" images={urlArray}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 flex flex-col justify-center items-center"
        >
          <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 py-4 max-w-[850px]">
            {title}
          </motion.p>
          <div className="flex gap-4">
            {buttons.map((button) => (
              <a
                href={button.btnLink}
                className="px-4 py-2 backdrop-blur-sm border text-white mx-auto text-center rounded-full relative mt-4"
                style={{
                  backgroundColor: `${button.btnBgColor}1A`,
                  borderColor: `${button.btnBgColor}33`,
                }}
              >
                <span>{button.btnText}</span>
                <div
                  className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto"
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, ${button.btnBgColor}, transparent)`,
                  }}
                />
              </a>
            ))}
          </div>
        </motion.div>
      </ImagesSlider>
    );
  },
};
