import React from "react";
import { ComponentConfig } from "../../../packages/core/types";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import { Section } from "../../components/Section";
import ColorPanel from "@/components/ColorPanel";
import BorderRadiusAdjuster from "@/components/BorderRadiusAdjustor";

const getClassName = getClassNameFactory("ButtonGroup", styles);

export type ButtonGroupProps = {
  align?: string;
  buttons: { label: string; href: string; variant: string }[];
  bgColor: string;
  fontColor: string;
  borderRadius: string;
};

export const ButtonGroup: ComponentConfig<ButtonGroupProps> = {
  label: "Button Group",
  fields: {
    bgColor: {
      label: "Background Color",
      type: "custom",
      render: ({ name, onChange, value }) => (
        <ColorPanel name={name} value={value} onChange={onChange} />
      ),
    },
    fontColor: {
      label: "Font Color",
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
    buttons: {
      type: "array",
      getItemSummary: (item) => item.label || "Button",
      arrayFields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
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
    buttons: [
      {
        label: "Button",
        href: "#",
        variant: "primary",
      },
    ],
    bgColor: "#428af5",
    fontColor: "#fff",
    borderRadius: "0px",
  },
  render: ({ align, buttons, bgColor, fontColor, borderRadius, puck }) => {
    return (
      <Section style={{ justifyContent: align }}>
        <div className={getClassName("actions")}>
          {buttons.map((button, i) => (
            <a
              key={i}
              className="p-2 px-3 rounded-md hover:opacity-80"
              style={{
                background: button.variant === "primary" ? bgColor : fontColor,
                borderRadius,
                border: button.variant === "secondary" ? `1px solid ${bgColor.split(',')[1]?.trim() || bgColor}` : "none"
              }}
              href={button.href}
              tabIndex={puck.isEditing ? -1 : undefined}
            >
              <span style={{ color: button.variant === "primary" ? fontColor : bgColor.split(',')[1]?.trim() || bgColor }}>
                {button.label}
              </span>
            </a>
          ))}
        </div>
      </Section>
    );
  },
};