/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "../../../packages/core";
import { Separator } from "@/components/ui/separator";
import { PrecentageOptions } from "@/config/options";
import { BoldnessOptions } from "@/config/options";
import ColorPickerComponent from "@/components/ColorPicker";
import PaddingAdjustor from "@/components/PaddingAdjustor";

export type SeperatorProps = {
  color: string;
  width: string;
  boldness: string;
  padding: string;
  justify: string;
};

export const Seperator: ComponentConfig<SeperatorProps> = {
  fields: {
    color: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    width: {
      label: "Width",
      type: "select",
      options: PrecentageOptions,
    },
    boldness: {
      label: "Boldness",
      type: "select",
      options: BoldnessOptions,
    },
    justify: {
      label: "Justify Seperator",
      type: "radio",
      options: [
        { label: "Left", value: "start" },
        { label: "Center", value: "center" },
        { label: "Right", value: "end" },
      ],
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
    color: "#ccc",
    width: "100%",
    boldness: "2px",
    justify: "center",
    padding: "10px 0px 10px 0px",
  },
  render: ({ color, width, boldness, justify, padding }) => {
    return (
      <div className="flex w-full" style={{ padding, justifyContent: justify }}>
        <Separator
          style={{ backgroundColor: color, width, height: boldness }}
        />
      </div>
    );
  },
};
