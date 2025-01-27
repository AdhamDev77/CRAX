import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { ColorResult } from "react-color";

const SketchPicker = dynamic(
  () => import("react-color").then((mod) => mod.SketchPicker),
  { ssr: false }
);

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  name: string;
  forColorPanel?: boolean;
};

const ColorPickerComponent: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  name,
  forColorPanel,
}) => {
  const [mounted, setMounted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState<string>(value || "#fff");
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const savedColors = localStorage.getItem("recentColors");
      if (savedColors) {
        // Parse and filter out null values and gradients
        const filteredColors = JSON.parse(savedColors)
          .filter(color => color !== null && !color.includes('linear-gradient'));
        setRecentColors(filteredColors);
      }
    } catch (error) {
      console.error("Error loading recent colors:", error);
    }
  }, []);

  useEffect(() => {
    // Update color when value prop changes
    if (value && !value.includes('linear-gradient')) {
      setColor(value);
    }
  }, [value]);

  // Safe event handlers
  const handleColorChange = (newColor: ColorResult) => {
    if (!mounted) return;
    const updatedColor = newColor.hex;
    setColor(updatedColor);
    
    if (!forColorPanel) {
      onChange(updatedColor);
    } else {
      // For ColorPanel, just update the temp color
      onChange(updatedColor);
    }
  };

  const handleShowColorPicker = () => {
    if (!mounted) return;
    setShowColorPicker((prev) => !prev);

    if (!showColorPicker && mounted && !forColorPanel) {
      try {
        const updatedRecentColors = [color, ...recentColors]
          .filter((c, index, self) => 
            self.indexOf(c) === index && !c.includes('linear-gradient')
          )
          .slice(0, 24);
        setRecentColors(updatedRecentColors);
        localStorage.setItem(
          "recentColors",
          JSON.stringify(updatedRecentColors)
        );
      } catch (error) {
        console.error("Error saving recent colors:", error);
      }
    }
  };

  // Display name logic
  const displayName =
    name === "bgColor"
      ? "Background Color"
      : name === "fontColor"
      ? "Font Color"
      : name;

  // Don't render anything until mounted
  if (!mounted) {
    return (
      <div className="flex flex-col gap-2 items-center justify-start relative min-h-[40px]">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-gray-600">{displayName}</h2>
          <div className="w-6 h-6 rounded-full border bg-gray-200" />
        </div>
      </div>
    );
  }

  // For ColorPanel, render just the color picker
  if (forColorPanel) {
    return (
      <div className="flex flex-col gap-2 items-center justify-start relative">
        <SketchPicker
          className="!w-full"
          color={color}
          onChangeComplete={handleColorChange}
          presetColors={recentColors}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-start relative">
      <div className="flex items-center justify-between w-full">
        <h2>{displayName}</h2>
        {!showColorPicker && (
          <button
            onClick={handleShowColorPicker}
            className="py-1 rounded flex items-center justify-center"
            aria-label={
              showColorPicker ? "Confirm color selection" : "Open color picker"
            }
          >
            <div
              className="w-6 h-6 rounded-full border border-opacity-40"
              style={{ backgroundColor: color }}
            />
          </button>
        )}

        {showColorPicker && (
          <Button 
            className="text-sm !p-2px !py-2px" 
            variant="secondary" 
            onClick={handleShowColorPicker}
          >
            Confirm
          </Button>
        )}
      </div>
      {mounted && showColorPicker && (
        <div className="flex items-center justify-center z-40 absolute top-full mt-2">
          <div className="fixed inset-0" onClick={handleShowColorPicker} />
          <div className="relative">
            <SketchPicker
              className="!w-full"
              color={color}
              onChangeComplete={handleColorChange}
              presetColors={recentColors}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerComponent;