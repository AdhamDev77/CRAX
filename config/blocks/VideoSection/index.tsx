/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core";
import ColorPicker from "react-pick-color";
import { Brush, Edit, Edit2, X } from "lucide-react";
import ColorPickerComponent from "@/components/ColorPicker";

export type VideoSecionProps = {
  bgColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  videoUrl: string;
  buttonText: string;
  showGradientShapes: string;
};

export const VideoSecion: ComponentConfig<VideoSecionProps> = {
  label: "Video Section",
  fields: {
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    textColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    title: { type: "text", label: "Title" },
    subtitle: { type: "text", label: "Subtitle" },
    backgroundImage: { type: "text", label: "Background Image URL" },
    videoUrl: { type: "text", label: "Video URL (YouTube or Vimeo)" },
    buttonText: { type: "text", label: "Button Text" },
    showGradientShapes: {
      type: "radio",
      options: [
        { label: "show", value: "show" },
        { label: "hide", value: "hide" },
      ],
      label: "Show Gradient Shapes",
    },
  },
  defaultProps: {
    bgColor: "#ffffff",
    textColor: "#000000",
    title: "Designed for you to get more simple",
    subtitle: "Build your business here. Take it anywhere.",
    backgroundImage:
      "https://images.unsplash.com/photo-1606868306217-dbf5046868d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1020&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    buttonText: "Play the overview",
    showGradientShapes: "show",
  },
  render: ({
    title,
    subtitle,
    backgroundImage,
    videoUrl,
    buttonText,
    showGradientShapes,
    bgColor,
    textColor,
  }: VideoSecionProps) => {
    const isYouTube =
      videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");
    let embedUrl = videoUrl;

    if (isYouTube) {
      const videoId = videoUrl.split("v=")[1] || videoUrl.split("/").pop();
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (isVimeo) {
      const videoId = videoUrl.split("/").pop();
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    const [showVideo, setShowVideo] = useState(false);
    return (
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mx-auto py-10">
          <div className="max-w-2xl text-center mx-auto">
            <h1
              className="block text-3xl font-bold sm:text-4xl md:text-5xl"
              style={{ color: textColor }}
              dangerouslySetInnerHTML={{ __html: title }}
            ></h1>
            <p className="mt-3 text-lg opacity-75" style={{ color: textColor }}>
              {subtitle}
            </p>
          </div>

          <div className="mt-10 relative max-w-5xl mx-auto">
            {!showVideo && (
              <div
                className="w-full object-cover h-96 sm:h-[480px] bg-no-repeat bg-center bg-cover rounded-xl"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              ></div>
            )}

            {!showVideo && (
              <div className="absolute inset-0 size-full flex justify-center items-center">
                <button
                  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  onClick={() => setShowVideo(true)}
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {buttonText}
                </button>
              </div>
            )}

            {showVideo && (
              <div className="h-screen w-full">
                <iframe
                  src={embedUrl}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-xl"
                ></iframe>
              </div>
            )}

            {showGradientShapes === "show" && (
              <>
                <div className="absolute bottom-12 -start-20 -z-[1] size-48 bg-gradient-to-b from-orange-500 to-white p-px rounded-lg dark:to-neutral-900">
                  <div className="bg-white size-48 rounded-lg dark:bg-neutral-900"></div>
                </div>

                <div className="absolute -top-12 -end-20 -z-[1] size-48 bg-gradient-to-t from-blue-600 to-cyan-400 p-px rounded-full">
                  <div className="bg-white size-48 rounded-full dark:bg-neutral-900"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
};
