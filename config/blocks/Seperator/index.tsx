/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "../../../packages/core";
import { Separator } from "@/components/ui/separator";
import { PrecentageOptions } from "@/config/options";
import { BoldnessOptions } from "@/config/options";
import ColorPickerComponent from "@/components/ColorPicker";
import SpacingAdjustor from "@/components/SpacingAdjustor";

export type SeperatorProps = {
  color: string;
  width: string;
  boldness: string;
  spacing: {padding: string, margin: string};
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
    spacing: {
      label: "Spacing",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <SpacingAdjustor value={value} onChange={onChange} unit="px" />
      ),
    },
  },
  defaultProps: {
    color: "#ccc",
    width: "100%",
    boldness: "2px",
    justify: "center",
    spacing: { padding: "10px 0px 10px 0px", margin: "0px 0px 0px 0px" }
  },
  render: ({ color, width, boldness, justify, spacing }) => {
    return (
      <div className="flex w-full" style={{ padding: spacing.padding, margin: spacing.margin, justifyContent: justify }}>
        <Separator
          style={{ backgroundColor: color, width, height: boldness }}
        />
      </div>
    );
  },
};
