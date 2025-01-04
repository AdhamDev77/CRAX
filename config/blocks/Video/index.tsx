import React from "react";
import { ComponentConfig } from "../../../packages/core";

export type VideoProps = {
  videoLink: string;
};

export const Video: ComponentConfig<VideoProps> = {
  label: "Video",
  fields: {
    videoLink: { type: "text", label: "Video URL" },
  },
  defaultProps: {
    videoLink: "https://youtu.be/X4buj5uynmE",
  },

  render: ({ videoLink }: VideoProps) => {
    const isYouTube =
      videoLink.includes("youtube.com") || videoLink.includes("youtu.be");
    const isVimeo = videoLink.includes("vimeo.com");
    let embedUrl = videoLink;

    if (isYouTube) {
      const videoId = videoLink.split("v=")[1] || videoLink.split("/").pop();
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (isVimeo) {
      const videoId = videoLink.split("/").pop();
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    return (
      <div className="w-full h-full">
        <iframe
          src={embedUrl}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-xl"
          style={{ height: "100%"}}
        ></iframe>
      </div>
    );
  },
};
