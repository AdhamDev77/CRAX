/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { ReactElement, useState } from "react";
import { ComponentConfig } from "../../../packages/core/types";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { X, Brush } from "lucide-react";
import ColorPicker from "react-pick-color";
import ColorPickerComponent from "@/components/ColorPicker";

const getClassName = getClassNameFactory("Card", styles);

const icons = Object.keys(dynamicIconImports).reduce<
  Record<string, ReactElement>
>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);

  return {
    ...acc,
    [iconName]: <El />,
  };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map((iconName) => ({
  label: iconName,
  value: iconName,
}));

export type CardProps = {
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
  fontColor: string;
  title: string;
  description: string;
  icon?: string;
  mode: "flat" | "card";
};

export const Card: ComponentConfig<CardProps> = {
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
    iconBgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    iconColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    title: { section: "content", type: "text" },
    description: { section: "content", type: "textarea" },
    icon: {
      section: "content",
      type: "select",
      options: iconOptions,
    },
    mode: {
      type: "radio",
      options: [
        { label: "card", value: "card" },
        { label: "flat", value: "flat" },
      ],
    },
  },
  defaultProps: {
    title: "Title",
    description: "Description",
    icon: "Feather",
    mode: "flat",
    bgColor: "#ffffff",
    iconBgColor: "#cfdff0",
    fontColor: "#000000",
    iconColor: "#6c9ed2",
  },
  render: ({
    title,
    icon,
    description,
    mode,
    bgColor,
    iconBgColor,
    fontColor,
    iconColor,
  }) => {
    return (
      <div
        className={getClassName({ [mode]: mode })}
        style={{ backgroundColor: bgColor, paddingTop: "16px", paddingBottom: "16px" }}
      >
        <div
          className={getClassName("icon")}
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          {icon && icons[icon]}
        </div>
        <div className={getClassName("title")} style={{ color: fontColor }}>
          {title}
        </div>
        <div
          className={getClassName("description")}
          style={{ color: fontColor, opacity: 0.8 }}
        >
          {description}
        </div>
      </div>
    );
  },
};
