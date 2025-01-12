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
import ColorPanel from "@/components/ColorPanel";
import BorderRadiusAdjuster from "@/components/BorderRadiusAdjustor";
import IconSelector from "@/components/IconSelector";

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

export type SimpleCardProps = {
  bgColor: string;
  borderRadius: string;
  iconColor: string;
  fontColor: string;
  title: string;
  description: string;
  icon?: any;
  mode: "flat" | "card";
};

export const SimpleCard: ComponentConfig<SimpleCardProps> = {
  fields: {
    bgColor: {
      label: "Background Color",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} />
      ),
    },
    borderRadius: {
      label: "Border Radius",
      type: "custom",
      render: ({ onChange, value }) => (
        <BorderRadiusAdjuster value={value} onChange={onChange} />
      ),
    },
    fontColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPanel name={name} onChange={onChange} value={value} />;
      },
    },
    iconColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPanel name={name} onChange={onChange} value={value} />;
      },
    },
    title: { section: "content", type: "text" },
    description: { section: "content", type: "textarea" },
    icon: { section: "content", type: "select", options: iconOptions },
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
    mode: "flat",
    bgColor: "#ffffff",
    borderRadius: "0px",
    fontColor: "#000000",
    iconColor: "#6c9ed2",
  },
  render: ({
    title,
    icon,
    description,
    mode,
    bgColor,
    borderRadius,
    fontColor,
    iconColor,
  }) => {
    return (
      <div
        className="w-full h-full border p-3"
        style={{ background: bgColor, borderRadius: borderRadius }}
      >
        <div className="py-4" style={{ color: iconColor }}>
          {icon && icons[icon] && (
            <>{React.cloneElement(icons[icon], { className: "w-10 h-10" })}</> // Adjust the size here
          )}
        </div>

        <div
          className="text-2xl mb-1 font-semibold"
          style={{ color: fontColor }}
        >
          {title}
        </div>
        <div className="text-lg" style={{ color: fontColor, opacity: 0.8 }}>
          {description}
        </div>
      </div>
    );
  },
};
