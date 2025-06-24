import React from "react";
import { ComponentConfig } from "../../../packages/core";
import { BorderRadiusOptions } from "@/config/options";
import MediaUploader from "@/components/MediaUploader";
import DimensionAdjustor from "@/components/DimensionsAdjustor";

export type MapProps = {
  link: string;
};

export const Map: ComponentConfig<MapProps> = {
  fields: {
    link: {
      section: "content",
      label: "Location URL",
      type: "text",
    },
  },
  defaultProps: {
    link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019102633544!2d-122.41941508468183!3d37.77492977975968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c5e6ee5b5%3A0x6a1462c042374a7c!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1687483542105!5m2!1sen!2sus",
  },
  render: ({ link }) => {

    return (
      <div className="w-full flex p-20 bg-purple-300">
      <iframe
  src={link}
  width="600"
  height="450"

  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
</div>
    );
  },
};