/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { ComponentConfig } from "../../../packages/core";
import { Heading as _Heading } from "../../../packages/core/components/Heading";
import type { HeadingProps as _HeadingProps } from "../../../packages/core/components/Heading";
import { Section } from "../../components/Section";
import ColorPickerComponent from "@/components/ColorPicker";

export type HeadingProps = {
  fontColor: string;
  bgColor: string;
  align: "left" | "center" | "right";
  text?: string;
  level?: _HeadingProps["rank"];
  size: _HeadingProps["size"];
  padding?: string;
};

const sizeOptions = [
  { value: "xxxl", label: "XXXL" },
  { value: "xxl", label: "XXL" },
  { value: "xl", label: "XL" },
  { value: "l", label: "L" },
  { value: "m", label: "M" },
  { value: "s", label: "S" },
  { value: "xs", label: "XS" },
];

const levelOptions = [
  { label: "", value: "" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
];

export const Heading: ComponentConfig<HeadingProps> = {
  fields: {
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    fontColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    text: {
      section: "content",
      type: "textarea",
    },
    size: {
      type: "select",
      options: sizeOptions,
    },
    level: {
      type: "select",
      options: levelOptions,
    },
    align: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    padding: { type: "text" },
    
  },
  defaultProps: {
    align: "left",
    text: "Heading",
    padding: "24px",
    size: "m",
    fontColor: "#000000",
    bgColor: "#ffffff",
  },
  render: ({ align, text, size, level, padding, fontColor, bgColor }) => {
    return (
      <Section padding={padding} style={{ backgroundColor: bgColor }}>
        <_Heading size={size} rank={level as any}>
          <span
            style={{
              color: fontColor,
              display: "block",
              textAlign: align,
              width: "100%",
            }}
          >
            {text}
          </span>
        </_Heading>
      </Section>
    );
  },
};
