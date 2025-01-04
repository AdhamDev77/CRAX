import React from "react";
import { ComponentConfig } from "../../../packages/core";
// import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import MediaUploader from "@/components/MediaUploader";

// const getClassName = getClassNameFactory("Hero", styles);

export type CardLinkProps = {
  MainText?: string;
  SecondaryText?: string;
  imageUrl?: string;
  link?: string;
};

export const CardLink: ComponentConfig<CardLinkProps> = {
  label: "Card (Link)",
  fields: {
    MainText: { type: "text", label: "Main Text" },
    SecondaryText: { type: "text", label: "Secondary Text" },
    link: { type: "text", label: "Refered Link" },
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
  },
  defaultProps: {
    MainText:
      "Facebook is creating a news section in Watch to feature breaking news",
    SecondaryText: "Facebook launched the Watch platform in August",
    imageUrl:
      "https://images.unsplash.com/photo-1669828230990-9b8583a877ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80",
    link: "https://imagecolorpicker.com",
  },
  render: ({ MainText, SecondaryText, imageUrl, link }: CardLinkProps) => {
    return (
      /* eslint-disable @next/next/no-img-element */
      <a
        className="group relative block rounded-xl focus:outline-none w-full"
        href={link}
      >
        <div className="shrink-0 relative rounded-xl overflow-hidden w-full h-[350px] before:absolute before:inset-x-0 before:z-[1] before:size-full before:bg-gradient-to-t before:from-gray-900/70">
          <img
            className="w-full h-full min-h-[350px] absolute top-0 start-0 object-cover"
            src={imageUrl}
            alt="Blog Image"
          />
        </div>

        <div className="absolute bottom-0 inset-x-0 z-10">
          <div className="flex flex-col h-full w-full p-4 sm:p-6">
            <h3 className="text-lg sm:text-3xl font-semibold text-white group-hover:text-white/80 group-focus:text-white/80">
              {MainText}
            </h3>
            <p className="mt-2 text-white/80">{SecondaryText}</p>
          </div>
        </div>
      </a>
    );
  },
};
