/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core/types";
import { spacingOptions } from "@/config/options";
import { X, Brush } from "lucide-react";
import ColorPicker from "react-pick-color";
import { InfiniteMovingCards } from "@/components/ui/aceternity/infinite-moving-cards";
import ColorPickerComponent from "@/components/ColorPicker";

export type TestimonialsProps = {
  testimonials: {
    quote: string;
    name: string;
    title: string;
  }[];
  verticalPadding: string,
  mainBgComponentColor: string;
  mainBgColor: string;
  secondaryBgColor: string;
  fontColor: string;
  direction: "left" | "right";
  speed: "fast" | "normal" | "slow";
  pauseOnHover: boolean;
};

export const Testimonials: ComponentConfig<TestimonialsProps> = {
  label: "Testimonials",
  fields: {
    testimonials: {
      section: "content",
      type: "array",
      getItemSummary: (item) => item.title || "Testimonial",
      arrayFields: {
        quote: { type: "text" },
        name: { type: "text" },
        title: { type: "text" },
      },
    },
    direction: {
      label: "Direction",
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    speed: {
      label: "Speed",
      type: "select",
      options: [
        { label: "Fast", value: "fast" },
        { label: "Normal", value: "normal" },
        { label: "Slow", value: "slow" },
      ],
    },
    pauseOnHover: {
      label: "Pause on hover?",
      type: "select",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    verticalPadding: {
      type: "select",
      options: spacingOptions,
    },
    mainBgComponentColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    mainBgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return <ColorPickerComponent name={name} onChange={onChange} value={value} />;
      },
    },
    secondaryBgColor: {
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
    testimonials: [
      {
        quote:
          "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
        name: "Charles Dickens",
        title: "A Tale of Two Cities",
      },
      {
        quote:
          "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
        name: "William Shakespeare",
        title: "Hamlet",
      },
      {
        quote: "All that we see or seem is but a dream within a dream.",
        name: "Edgar Allan Poe",
        title: "A Dream Within a Dream",
      },
      {
        quote:
          "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        name: "Jane Austen",
        title: "Pride and Prejudice",
      },
      {
        quote:
          "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
        name: "Herman Melville",
        title: "Moby-Dick",
      },
    ],
    direction: "left",
    speed: "normal",
    pauseOnHover: false,
    verticalPadding: "24px",
    mainBgComponentColor: "#000000",
    mainBgColor: "#1e293b",
    secondaryBgColor: "#0f172a",
    fontColor: "#ffffff",
  },
  render: ({
    testimonials,
    mainBgComponentColor,
    mainBgColor,
    secondaryBgColor,
    fontColor,
    direction,
    speed,
    pauseOnHover,
    verticalPadding,
  }) => {
    return (
      <div className={`rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden`} style={{backgroundColor: mainBgComponentColor, paddingTop: verticalPadding, paddingBottom: verticalPadding}}>
        <InfiniteMovingCards
          mainBgColor={mainBgColor}
          secondaryBgColor={secondaryBgColor}
          fontColor={fontColor}
          items={testimonials}
          direction={direction}
          speed={speed}
          pauseOnHover={pauseOnHover}
        />
      </div>
    );
  },
};
