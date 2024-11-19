/* eslint-disable react-hooks/rules-of-hooks */

"use client";
import react, { useState } from "react";
import Lens from "@/components/ui/aceternity/lens";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ComponentConfig } from "@measured/puck";
import { X, Brush } from "lucide-react";
import ColorPicker from "react-pick-color";
import ColorPickerComponent from "@/components/ColorPicker";

export interface LensProps {
  imageUrl: string;
  title: string;
  description: string;
  bgColorMain: string;
  bgColorSecondary: string;
  fontColor: string;
}

export const LensCard: ComponentConfig<LensProps> = {
  label: "Lens Card",
  fields: {
    imageUrl: { type: "text", label: "Image URL" },
    title: { type: "text", label: "Title" },
    description: { type: "text", label: "Description" },
    bgColorMain: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    bgColorSecondary: {
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
  defaultProps: {
    imageUrl:
      "https://images.unsplash.com/photo-1713869820987-519844949a8a?q=80&w=3500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Apple Vision Pro",
    description:
      "The all new apple vision pro was the best thing that happened around 8 months ago, not anymore.",
    bgColorMain: "#121318",
    bgColorSecondary: "#1D2235",
    fontColor: "#ffffff",
  },
  render: ({
    imageUrl,
    title,
    description,
    bgColorMain,
    bgColorSecondary,
    fontColor,
  }) => {
    const [hovering, setHovering] = useState(false);
    return (
      <div>
        <div
          className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto p-8"
          style={{
            background: `linear-gradient(to left, ${bgColorMain}, ${bgColorSecondary})`,
          }}
        >
          {/* <Rays />
        <Beams /> */}
          <div className="relative z-10">
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src={imageUrl}
                alt="image"
                width={500}
                height={500}
                className="rounded-2xl"
              />
            </Lens>
            <motion.div
              animate={{
                filter: hovering ? "blur(2px)" : "blur(0px)",
              }}
              className="py-4 relative z-20"
            >
              <h2
                className="text-2xl text-left font-bold"
                style={{ color: fontColor }}
              >
                {title}
              </h2>
              <p
                className="text-left  mt-4"
                style={{ color: fontColor, opacity: 0.8 }}
              >
                {description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  },
};
