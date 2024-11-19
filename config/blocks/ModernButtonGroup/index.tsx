/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core/types";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import { Section } from "../../components/Section";
import { X, Brush } from "lucide-react";
import ColorPicker from "react-pick-color";
import ColorPickerComponent from "@/components/ColorPicker";

const getClassName = getClassNameFactory("ButtonGroup", styles);

export type ModernButtonGroupProps = {
  align?: string;
  buttons: {
    btnText: string;
    btnLink: string;
    btnBgColor: string;
    fontColor: string;
  }[];
  bgColor: string;
};

export const ModernButtonGroup: ComponentConfig<ModernButtonGroupProps> = {
  label: "Modern Button Group",
  fields: {
    buttons: {
      type: "array",
      getItemSummary: (item) => item.btnText || "Button",
      arrayFields: {
        btnText: {
          label: "Button title",
          type: "text",
        },
        btnLink: {
          label: "Button link",
          type: "text",
        },
        btnBgColor: {
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
      },
      defaultItemProps: {
        btnText: "Button",
        btnLink: "#",
        btnBgColor: "#34d399",
        fontColor: "#ffffff",
      },
    },
    align: {
      type: "radio",
      options: [
        { label: "left", value: "start" },
        { label: "center", value: "center" },
        { label: "right", value: "end" },
      ],
    },
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
  },
  defaultProps: {
    buttons: [{ btnText: "Learn more", btnLink: "#", btnBgColor: "#34d399", fontColor: "#ffffff" }],
    bgColor: "#000000"
  },
  render: ({ align, buttons, bgColor, puck }) => {
    return (
      <div
        className="flex gap-4 items-center px-4"
        style={{ backgroundColor: bgColor, justifyContent: align }}
      >
        {buttons.map((button) => (
          <a
            href={button.btnLink}
            className="px-4 py-2 backdrop-blur-sm border text-white text-center rounded-full relative"
            style={{
              backgroundColor: `${button.btnBgColor}1A`,
              borderColor: `${button.btnBgColor}33`,
            }}
          >
            <span style={{color: button.fontColor}}>{button.btnText}</span>
            <div
              className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4"
              style={{
                backgroundImage: `linear-gradient(to right, transparent, ${button.btnBgColor}, transparent)`,
              }}
            />
          </a>
        ))}
      </div>
    );
  },
};
