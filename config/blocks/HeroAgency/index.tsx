import React from "react";
import { ComponentConfig } from "../../../packages/core";
// import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../packages/core/lib";
import { useBrand } from "@/packages/core/components/Puck/components/BrandSidebar";

// const getClassName = getClassNameFactory("Hero", styles);

export type HeroAgencyProps = {
  name?: string;
  slogan?: string;
  description?: string;
};

export const HeroAgency: ComponentConfig<HeroAgencyProps> = {
  label: "Hero (Agency)",
  fields: {
    name: {section: "content", type: "text", label: "Brand Name" },
    slogan: {section: "content", type: "text", label: "Slogan" },
    description: {section: "content", type: "text", label: "Slogan" },
  },
  defaultProps: {
    name: "Preline Agency:",
    slogan: "Transforming ideas into reality",
    description:
      "It is a creative hub where imagination meets craftsmanship to transform ideas into tangible realities. At Preline Agency, we specialize in turning conceptual visions into concrete forms, whether it be through design, artistry, or technological innovation.",
  },
  render: ({ name, slogan, description }: HeroAgencyProps) => {
    const { getColor, getFont, currentTheme } = useBrand();
    return (
      <>
        <div className="bg-neutral-900">
          <div className="max-w-5xl mx-auto px-4 xl:px-0 pt-24 lg:pt-32 pb-24">
            <h1 className="font-semibold text-white text-5xl md:text-6xl">
              <span style={{ color: getColor("primary") }}>{name}</span> {slogan}
            </h1>
            <div className="max-w-4xl">
              <p className="mt-5 text-neutral-400 text-lg">
                {description}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  },
};
