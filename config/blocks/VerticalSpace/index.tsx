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
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      color="#3182ce"
      fill="none"
    >
      <rect
        width="13"
        height="7"
        x="8"
        y="3"
        rx="1"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m2 9 3 3-3 3"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        width="13"
        height="7"
        x="8"
        y="14"
        rx="1"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  fields: {
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
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
      <div
        style={{
          backgroundColor: bgColor,
          height: size,
          width: "100%",
          zIndex: 10,
        }}
      />
    );
  },
};
