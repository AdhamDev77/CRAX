import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import ColorPickerComponent from "./ColorPicker";

interface BoxShadowProps {
  value: string;
  onChange: (value: string) => void;
}

const PRESETS = [
  { name: "Soft", value: "0px 2px 4px rgba(0, 0, 0, 0.1)" },
  { name: "Medium", value: "0px 4px 8px rgba(0, 0, 0, 0.12)" },
  { name: "Hard", value: "0px 8px 16px rgba(0, 0, 0, 0.15)" },
];

// Helper function to parse box shadow string with default values
const parseBoxShadow = (boxShadow: string | undefined) => {
  // If no boxShadow is provided, return default values
  if (!boxShadow) {
    return {
      offsetX: 0,
      offsetY: 2,
      blur: 4,
      spread: 0,
      color: "rgba(0, 0, 0, 0.1)",
    };
  }

  try {
    const parts = boxShadow.split(" ");
    return {
      offsetX: parseInt(parts[0]) || 0,
      offsetY: parseInt(parts[1]) || 2,
      blur: parseInt(parts[2]) || 4,
      spread: parseInt(parts[3]) || 0,
      color: parts.slice(4).join(" ") || "rgba(0, 0, 0, 0.1)",
    };
  } catch (error) {
    // Fallback to default values if parsing fails
    return {
      offsetX: 0,
      offsetY: 2,
      blur: 4,
      spread: 0,
      color: "rgba(0, 0, 0, 0.1)",
    };
  }
};

const BoxShadowAdjuster = ({ value = "0px 2px 4px 0px rgba(0, 0, 0, 0.1)", onChange }: BoxShadowProps) => {
  const [isEnabled, setIsEnabled] = useState(true);

  // Parse the initial value with fallback
  const parsedValue = parseBoxShadow(value);

  const [offsetX, setOffsetX] = useState(parsedValue.offsetX);
  const [offsetY, setOffsetY] = useState(parsedValue.offsetY);
  const [blur, setBlur] = useState(parsedValue.blur);
  const [spread, setSpread] = useState(parsedValue.spread);
  const [color, setColor] = useState(parsedValue.color);

  // Update internal state when value prop changes
  useEffect(() => {
    const newValues = parseBoxShadow(value);
    setOffsetX(newValues.offsetX);
    setOffsetY(newValues.offsetY);
    setBlur(newValues.blur);
    setSpread(newValues.spread);
    setColor(newValues.color);
  }, [value]);

  const updateShadow = (
    updates: Partial<{
      offsetX: number;
      offsetY: number;
      blur: number;
      spread: number;
      color: string;
    }> = {}
  ) => {
    const newValues = {
      offsetX: updates.offsetX ?? offsetX,
      offsetY: updates.offsetY ?? offsetY,
      blur: updates.blur ?? blur,
      spread: updates.spread ?? spread,
      color: updates.color ?? color,
    };

    const shadowValue = `${newValues.offsetX}px ${newValues.offsetY}px ${newValues.blur}px ${newValues.spread}px ${newValues.color}`;
    onChange(shadowValue);
  };

  const applyPreset = (presetValue: string) => {
    const newValues = parseBoxShadow(presetValue);
    setOffsetX(newValues.offsetX);
    setOffsetY(newValues.offsetY);
    setBlur(newValues.blur);
    setSpread(newValues.spread);
    setColor(newValues.color);
    onChange(presetValue);
  };

  return (
    <Card className="w-full max-w-md bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Square size={16} className="text-gray-600" />
            <span className="text-sm font-medium">Box Shadow</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEnabled(!isEnabled)}
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
          <div className="grid grid-cols-3 gap-2 mb-4">
            {PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.value)}
                className="w-full"
              >
                {preset.name}
              </Button>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="w-24 h-24 bg-white border rounded-lg"
              style={{ boxShadow: value }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex-1">
              <ColorPickerComponent
                value={color}
                onChange={(newColor) => {
                  setColor(newColor);
                  updateShadow({ color: newColor });
                }}
                forColorPanel={false}
                name={"Color"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Offset X</label>
              <Slider
                value={[offsetX]}
                onValueChange={([newOffsetX]) => {
                  setOffsetX(newOffsetX);
                  updateShadow({ offsetX: newOffsetX });
                }}
                min={-50}
                max={50}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600">Offset Y</label>
              <Slider
                value={[offsetY]}
                onValueChange={([newOffsetY]) => {
                  setOffsetY(newOffsetY);
                  updateShadow({ offsetY: newOffsetY });
                }}
                min={-50}
                max={50}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600">Blur</label>
              <Slider
                value={[blur]}
                onValueChange={([newBlur]) => {
                  setBlur(newBlur);
                  updateShadow({ blur: newBlur });
                }}
                max={50}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600">Spread</label>
              <Slider
                value={[spread]}
                onValueChange={([newSpread]) => {
                  setSpread(newSpread);
                  updateShadow({ spread: newSpread });
                }}
                min={-25}
                max={25}
                step={1}
                className="py-2"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoxShadowAdjuster;