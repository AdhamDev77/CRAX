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

export type CardLink2Props = {
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
  fontColor: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
  icon: string;
};

export const CardLink2: ComponentConfig<CardLink2Props> = {
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
    title: { type: "text" },
    description: { type: "textarea" },
    linkText: { type: "textarea" },
    link: { type: "textarea" },
    icon: {
      type: "select",
      options: iconOptions,
    },
  },
  defaultProps: {
    title: "Responsive",
    description: "Responsive, and mobile-first project on the web",
    link: "facebook.com",
    linkText: "Learn more",
    icon: "Feather",
    bgColor: "#ffffff",
    iconBgColor: "#0158ad",
    fontColor: "#000000",
    iconColor: "#6499cf",
  },
  render: ({
    title,
    description,
    link,
    linkText,
    icon,
    bgColor,
    iconBgColor,
    fontColor,
    iconColor,
  }) => {
    return (
      <a
        className="group flex flex-col justify-center rounded-xl p-4 md:p-7 "
        style={{ backgroundColor: bgColor }}
        href={link}
      >
        <div
          className={getClassName("icon")}
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          {icon && icons[icon]}
        </div>
        <div className="mt-5">
          <h3 className="text-lg font-semibold" style={{ color: fontColor }}>
            {title}
          </h3>
          <p className="mt-1" style={{ color: fontColor, opacity: 0.8 }}>
            {description}
          </p>
          <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline group-focus:underline font-medium">
            {linkText}
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </div>
      </a>
    );
  },
};
