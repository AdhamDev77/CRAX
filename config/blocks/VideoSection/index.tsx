/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core";

export type VideoSecionProps = {
  backgroundImage: string;
  videoUrl: string;
  buttonText: string;
};

export const VideoSecion: ComponentConfig<VideoSecionProps> = {
  label: "Video Section",
  fields: {
    backgroundImage: {section: "content", type: "text", label: "Background Image URL" },
    videoUrl: {section: "content", type: "text", label: "Video URL (YouTube or Vimeo)" },
    buttonText: {section: "content", type: "text", label: "Button Text" },
  },
  defaultProps: {
    backgroundImage:
      "https://images.unsplash.com/photo-1606868306217-dbf5046868d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1020&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    buttonText: "Play the overview",
  },
  render: ({
    backgroundImage,
    videoUrl,
    buttonText,
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
      <div className="relative overflow-hidden">
        <div className="mx-auto">
          <div className="relative max-w-5xl mx-auto">
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


          </div>
        </div>
      </div>
    );
  },
};
