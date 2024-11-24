/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "../../../packages/core";
import { BorderRadiusOptions } from "@/config/options";

export type MapLocationProps = {
  locationURL: string;
  height: string;
  borderRadius: string;
};

export const MapLocation: ComponentConfig<MapLocationProps> = {
  fields: {
    locationURL: { type: "text", label: "Location URL" },
    height: { type: "text", label: "Height (px)" },
    borderRadius: {
      label: "Border radius",
      type: "select",
      options: BorderRadiusOptions,
    },
  },
  defaultProps: {
    locationURL: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12032.17158295837!2d29.032734802803706!3d41.06805498955896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab621b54e1721%3A0x6b574662fca4d613!2zQXJuYXZ1dGvDtnksIDM0MzQ1IEJlxZ9pa3RhxZ8vxLBzdGFuYnVs!5e0!3m2!1sen!2str!4v1730032746468!5m2!1sen!2str",
    borderRadius: "0px",
    height: "450"
  },
  render: ({ locationURL, borderRadius, height }) => {
    return (
      <div className="w-full flex">
        <iframe src={locationURL} height={height} className="w-full" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ borderRadius: borderRadius }}></iframe>
      </div>
    );
  },
};
