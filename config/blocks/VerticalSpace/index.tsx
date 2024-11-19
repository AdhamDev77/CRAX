/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";

import { ComponentConfig } from "../../../packages/core";
import { spacingOptions } from "../../options";
import { Brush, X } from "lucide-react";
import ColorPicker from "react-pick-color";
import ColorPickerComponent from "@/components/ColorPicker";

export type VerticalSpaceProps = {
  size: string;
  bgColor: string;
};

export const VerticalSpace: ComponentConfig<VerticalSpaceProps> = {
  label: "Vertical Space",
  fields: {
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    size: {
      type: "select",
      options: spacingOptions,
    },
  },
  defaultProps: {
    size: "24px",
    bgColor: "#ffffff",
  },
  render: ({ size, bgColor }) => {
    return (
      <div style={{ backgroundColor: bgColor, height: size, width: "100%" }} />
    );
  },
};
