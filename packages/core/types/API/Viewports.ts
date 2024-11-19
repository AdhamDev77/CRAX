import { ReactNode } from "react";

type iconTypes = "Smartphone" | "Monitor" | "Tablet";

export type Viewport = {
  width: number;
  height?: number | "auto";
  label?: any;
  icon?: iconTypes | ReactNode;
};

export type Viewports = Viewport[];
