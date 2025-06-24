import { Monitor, Smartphone, Tablet, ZoomIn, ZoomOut } from "lucide-react";
import { IconButton } from "../IconButton";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getClassNameFactory } from "../../lib";

import styles from "./styles.module.css";
import { Viewport } from "../../types";

const icons = {
  Smartphone: <Smartphone size={16} />,
  Tablet: <Tablet size={16} />,
  Monitor: <Monitor size={16} />,
};

const getClassNameButton = getClassNameFactory("ViewportButton", styles);

const ViewportButton = ({
  children,
  height = "auto",
  title,
  width,
  onClick,
  currentWidth,
}: {
  children: ReactNode;
  height?: number | "auto";
  title: string;
  width: number;
  onClick: (viewport: Viewport) => void;
  currentWidth: number;
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(width === currentWidth);
  }, [width, currentWidth]);

  return (
    <span className={getClassNameButton({ isActive })}>
      <IconButton
        title={title}
        disabled={isActive}
        onClick={(e) => {
          e.stopPropagation();
          onClick({ width, height });
        }}
      >
        <span className={getClassNameButton("inner")}>{children}</span>
      </IconButton>
    </span>
  );
};

const defaultZoomOptions = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
  { label: "125%", value: 1.25 },
  { label: "150%", value: 1.5 },
  { label: "200%", value: 2 },
];

export const ViewportControls = ({
  autoZoom,
  zoom,
  onViewportChange,
  onZoom,
  viewports,
  currentViewportWidth,
}: {
  autoZoom: number;
  zoom: number;
  onViewportChange: (viewport: Viewport) => void;
  onZoom: (zoom: number) => void;
  viewports: any[];
  currentViewportWidth: number;
}) => {
  const defaultsContainAutoZoom = defaultZoomOptions.find(
    (option) => option.value === autoZoom
  );

  const zoomOptions = useMemo(
    () =>
      [
        ...defaultZoomOptions,
        ...(defaultsContainAutoZoom
          ? []
          : [
              {
                value: autoZoom,
                label: `${(autoZoom * 100).toFixed(0)}% (Auto)`,
              },
            ]),
      ]
        .filter((a) => a.value <= autoZoom)
        .sort((a, b) => (a.value > b.value ? 1 : -1)),
    [autoZoom]
  );

  return (
    <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-0.5">
        {viewports.map((viewport, i) => (
          <ViewportButton
            key={i}
            height={viewport.height}
            width={viewport.width}
            title={
              viewport.label
                ? `Switch to ${viewport.label} viewport`
                : "Switch viewport"
            }
            onClick={onViewportChange}
            currentWidth={currentViewportWidth}
          >
            {typeof viewport.icon === "string"
              ? icons[viewport.icon as keyof typeof icons] || viewport.icon
              : viewport.icon || icons.Smartphone}
          </ViewportButton>
        ))}
      </div>
      
      {/* <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
      
      <div className="flex items-center gap-1">
        <IconButton
          title="Zoom viewport out"
          disabled={zoom <= zoomOptions[0]?.value}
          onClick={(e) => {
            e.stopPropagation();
            onZoom(
              zoomOptions[
                Math.max(
                  zoomOptions.findIndex((option) => option.value === zoom) - 1,
                  0
                )
              ].value
            );
          }}
        >
          <ZoomOut size={14} />
        </IconButton>
        
        <select
          className="text-xs font-medium bg-transparent border-0 outline-none cursor-pointer text-gray-700 dark:text-gray-300 min-w-[60px] text-center"
          value={zoom.toString()}
          onChange={(e) => {
            onZoom(parseFloat(e.currentTarget.value));
          }}
        >
          {zoomOptions.map((option) => (
            <option
              key={option.label}
              value={option.value}
              className="bg-white dark:bg-gray-800"
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <IconButton
          title="Zoom viewport in"
          disabled={zoom >= zoomOptions[zoomOptions.length - 1]?.value}
          onClick={(e) => {
            e.stopPropagation();
            onZoom(
              zoomOptions[
                Math.min(
                  zoomOptions.findIndex((option) => option.value === zoom) + 1,
                  zoomOptions.length - 1
                )
              ].value
            );
          }}
        >
          <ZoomIn size={14} />
        </IconButton>
      </div> */}
    </div>
  );
};