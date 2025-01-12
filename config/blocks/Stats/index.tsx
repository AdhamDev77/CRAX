/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import { Section } from "../../components/Section";
import { X, Brush } from "lucide-react";
import ColorPicker from "react-pick-color";
import ColorPickerComponent from "@/components/ColorPicker";
import ColorPanel from "@/components/ColorPanel";

const getClassName = getClassNameFactory("Stats", styles);

export type StatsProps = {
  items: {
    title: string;
    description: string;
  }[];
  bgColor: string;
  fontColor: string;
};

export const Stats: ComponentConfig<StatsProps> = {
  fields: {
    bgColor: {
      label: "Background Color",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} />
      ),
    },
    fontColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    items: {
      section: "content",
      type: "array",
      getItemSummary: (item, i) => item.title || `Feature #${i}`,
      defaultItemProps: {
        title: "Title",
        description: "Description",
      },
      arrayFields: {
        title: { type: "text" },
        description: { type: "text" },
      },
    },
  },
  defaultProps: {
    items: [
      {
        title: "Stat",
        description: "1,000",
      },
    ],
    bgColor: "#000",
    fontColor: "#ffffff",
  },
  render: ({ items, bgColor, fontColor}) => {
    return (
      <Section className={getClassName()} maxWidth={"916px"}  style={{ backgroundColor: bgColor}}>
        <div className={getClassName("items")} style={{background: bgColor, }}>
          {items.map((item, i) => (
            <div key={i} className={getClassName("item")}>
              <div className={getClassName("label")} style={{ color: fontColor, opacity: 0.8}}>{item.title}</div>
              <div className={getClassName("value")} style={{ color: fontColor}}>{item.description}</div>
            </div>
          ))}
        </div>
      </Section>
    );
  },
};
