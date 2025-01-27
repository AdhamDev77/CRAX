import React, { useState, useEffect } from "react";
import { Radius, Eye, EyeOff, PenLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import ColorPickerComponent from "./ColorPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BorderRadiusProps {
  value: string;
  onChange: (value: {
    radius: string;
    isBorderEnabled: boolean;
    borderThickness: number;
    borderStyle: string;
    borderColor: string;
    isEnabled: boolean;
  }) => void;
}

const PRESETS = [
  { name: "Small", value: "4px" },
  { name: "Med", value: "8px" },
  { name: "Large", value: "16px" },
  { name: "Full", value: "50%" },
];

const BORDER_STYLES = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

const getSteppedValue = (value: number) => {
  if (value <= 32) return value;
  if (value === 101) return 100; // For 50% case
  const remaining = value - 32;
  return 32 + Math.round(remaining / 8) * 8;
};

const parseBorderRadius = (value: string = "0px") => {
  if (value.includes("%")) return 101; // Special value for 50%
  return parseInt(value) || 0;
};

const formatValue = (value: number) => {
  if (value === 101) return "50%";
  return `${value}px`;
};

const BorderRadiusAdjuster = ({
  value = "8px",
  onChange,
}: BorderRadiusProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isBorderEnabled, setIsBorderEnabled] = useState(false);
  const [radius, setRadius] = useState(parseBorderRadius(value));
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderThickness, setBorderThickness] = useState(1);
  const [borderStyle, setBorderStyle] = useState("solid");

  useEffect(() => {
    setRadius(parseBorderRadius(value));
  }, [value]);

  const updateRadius = (newRadius: number) => {
    const steppedValue = getSteppedValue(newRadius);
    setRadius(steppedValue);
    triggerOnChange({
      radius: formatValue(steppedValue),
      isBorderEnabled,
      borderThickness,
      borderStyle,
      borderColor,
      isEnabled,
    });
  };

  const triggerOnChange = (updates: {
    radius: string;
    isBorderEnabled: boolean;
    borderThickness: number;
    borderStyle: string;
    borderColor: string;
    isEnabled: boolean;
  }) => {
    onChange({
      radius: updates.radius,
      isBorderEnabled: updates.isBorderEnabled,
      borderThickness: updates.borderThickness,
      borderStyle: updates.borderStyle,
      borderColor: updates.borderColor,
      isEnabled: updates.isEnabled,
    });
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radius size={16} className="text-gray-600" />
            <span className="text-sm font-medium">Border Radius</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsEnabled(!isEnabled);
              triggerOnChange({
                radius: formatValue(radius),
                isBorderEnabled,
                borderThickness,
                borderStyle,
                borderColor,
                isEnabled: !isEnabled,
              });
            }}
            className={`h-8 w-8 ${
              isEnabled ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {isEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </Button>
        </div>

        <div
          className={
            isEnabled ? "opacity-100" : "opacity-50 pointer-events-none"
          }
        >
          {/* Preview Box */}
          <div className="flex justify-center mb-6">
            <div
              className="w-40 h-40 bg-stone-300 flex items-center justify-center"
              style={{
                borderRadius: formatValue(radius),
                border: isBorderEnabled
                  ? `${borderThickness}px ${borderStyle} ${borderColor}`
                  : "none",
              }}
            >
              <span className="text-xs text-gray-600">Preview</span>
            </div>
          </div>

          {/* Radius Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">Radius</label>
                <span className="text-xs text-gray-600">
                  {formatValue(radius)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateRadius(parseBorderRadius(preset.value))
                    }
                    className="w-full text-sm"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
              <Slider
                value={[radius]}
                onValueChange={([newRadius]) => updateRadius(newRadius)}
                min={1}
                max={101} // Allow up to 101 for "Full" (50%)
                step={1}
                className="py-2"
              />
            </div>

            {/* Border Toggle Button */}
            <Button
              variant={isBorderEnabled ? "outline" : "default"}
              size="sm"
              onClick={() => {
                setIsBorderEnabled(!isBorderEnabled);
                triggerOnChange({
                  radius: formatValue(radius),
                  isBorderEnabled: !isBorderEnabled,
                  borderThickness,
                  borderStyle,
                  borderColor,
                  isEnabled,
                });
              }}
              className="w-full flex items-center gap-2"
            >
              <PenLine size={14} />
              <span>{isBorderEnabled ? "Remove Border" : "Apply Border"}</span>
            </Button>

            {/* Border Controls (Conditional) */}
            {isBorderEnabled && (
              <>
                <div className="space-y-2">
                  <ColorPickerComponent
                    value={borderColor}
                    onChange={(newColor) => {
                      setBorderColor(newColor);
                      triggerOnChange({
                        radius: formatValue(radius),
                        isBorderEnabled,
                        borderThickness,
                        borderStyle,
                        borderColor: newColor,
                        isEnabled,
                      });
                    }}
                    forColorPanel={false}
                    name={"Border Color"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-600">
                    Border Thickness
                  </label>
                  <Slider
                    value={[borderThickness]}
                    onValueChange={([newThickness]) => {
                      setBorderThickness(newThickness);
                      triggerOnChange({
                        radius: formatValue(radius),
                        isBorderEnabled,
                        borderThickness: newThickness,
                        borderStyle,
                        borderColor,
                        isEnabled,
                      });
                    }}
                    min={1}
                    max={10}
                    step={1}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-600">Border Style</label>
                  <Select
                    value={borderStyle}
                    onValueChange={(value) => {
                      setBorderStyle(value);
                      triggerOnChange({
                        radius: formatValue(radius),
                        isBorderEnabled,
                        borderThickness,
                        borderStyle: value,
                        borderColor,
                        isEnabled,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select border style" />
                    </SelectTrigger>
                    <SelectContent>
                      {BORDER_STYLES.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BorderRadiusAdjuster;