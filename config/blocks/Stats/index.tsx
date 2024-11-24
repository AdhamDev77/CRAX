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

const getClassName = getClassNameFactory("Stats", styles);

export type StatsProps = {
  items: {
    title: string;
    description: string;
  }[];
  bgColor: string;
  fontColor: string;
  cardColor1: string;
  cardColor2: string;
};

export const Stats: ComponentConfig<StatsProps> = {
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
    cardColor1: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    cardColor2: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    items: {
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
    bgColor: "#ffffff",
    fontColor: "#ffffff",
    cardColor1: "#ffffff",
    cardColor2: "#ffffff",
  },
  render: ({ items, bgColor, fontColor, cardColor1, cardColor2}) => {
    return (
      <Section className={getClassName()} maxWidth={"916px"}  style={{ backgroundColor: bgColor}}>
        <div className={getClassName("items")} style={{background: `linear-gradient(to bottom right, ${cardColor1}, ${cardColor2})`!, }}>
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
