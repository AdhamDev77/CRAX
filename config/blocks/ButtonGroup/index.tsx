/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core/types";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import { Button } from "../../../packages/core/components/Button";
import { Section } from "../../components/Section";
import ColorPickerComponent from "@/components/ColorPicker";

const getClassName = getClassNameFactory("ButtonGroup", styles);

export type ButtonGroupProps = {
  align?: string;
  buttons: { label: string; href: string; variant: "primary" | "secondary" }[];
  bgColor: string;
};

export const ButtonGroup: ComponentConfig<ButtonGroupProps> = {
  label: "Button Group",
  fields: {
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    buttons: {
      type: "array",
      getItemSummary: (item) => item.label || "Button",
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "radio",
          options: [
            { label: "primary", value: "primary" },
            { label: "secondary", value: "secondary" },
          ],
        },
      },
      defaultItemProps: {
        label: "Button",
        href: "#",
        variant: "primary",
      },
    },
    align: {
      type: "radio",
      options: [
        { label: "left", value: "left" },
        { label: "center", value: "center" },
        { label: "right", value: "right" },
      ],
    },
  },
  defaultProps: {
    buttons: [{ label: "Learn more", href: "#", variant: "primary" }],
    bgColor: "#fff"
  },
  render: ({ align, buttons, bgColor, puck }) => {
    return (
      <Section style={{ backgroundColor: bgColor, justifyContent: align}}>
        <div className={getClassName("actions")}>
          {buttons.map((button, i) => (
            <Button
              key={i}
              href={button.href}
              variant={button.variant}
              size="large"
              tabIndex={puck.isEditing ? -1 : undefined}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </Section>
    );
  },
};
